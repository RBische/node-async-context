"use strict";
// tslint:disable no-null-keyword
// tslint:disable no-require-imports no-var-requires
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line no-implicit-dependencies
const asyncHooks = require('async_hooks');
let lastTimestampClear = Date.now();
const DELAY_UNTIL_CLEAR = 10 * 60 * 1000;
const nodeproc = process;
const ROOT_ID = 1;
/**
 *
 *
 * @export
 * @class ContinuationLocalStorage
 * @template T
 */
class ContinuationLocalStorage {
    /**
     * Creates an instance of ContinuationLocalStorage.
     *
     */
    constructor() {
        this.findActivatedNode = (hi) => {
            /* istanbul ignore if  */
            if (!hi) {
                // NOTES: this should not happen
                // the root-node is always activated and all other nodes should have a valid trigger-node (`triggerHook`)
                return this.idHookMap.get(ROOT_ID);
            }
            if (hi.activated) {
                return hi;
            }
            return this.findActivatedNode(hi.triggerHook);
            // TODO: prettier adds this unusual semicolon
            // tslint:disable-next-line semicolon
        };
        this.initMap();
        this.hookFuncs = {
            init: (id, type, triggerId) => {
                // a new async handle gets initialized:
                const oriTriggerId = triggerId;
                /* istanbul ignore if  */
                if (triggerId == null) {
                    // NOTES: this should not happen
                    nodeproc._rawDebug(`init:   id: ${id}: WARNING: triggerId is not defined`);
                    triggerId = this._currId;
                }
                let triggerHook = this.idHookMap.get(triggerId);
                if (!triggerHook) {
                    // NOTES: this is expected
                    // nodeproc._rawDebug(`init:   id: ${id}: WARNING: triggerId: ${triggerId} is not registered`);
                    triggerId = ROOT_ID;
                    triggerHook = this.idHookMap.get(triggerId);
                }
                this.idHookMap.set(id, { id, type, triggerId, oriTriggerId, triggerHook, activated: false, creationDate: Date.now() });
                // this.debugId('init', id);
            },
            before: (id) => {
                // an async handle starts
                this._currId = id;
                const hi = this.idHookMap.get(id);
                /* istanbul ignore else */
                if (hi) {
                    if (!hi.activated) {
                        const ancestor = this.findActivatedNode(hi.triggerHook);
                        if (ancestor) {
                            hi.triggerHook = ancestor;
                            hi.triggerId = ancestor.id;
                            hi.data = ancestor.data;
                        }
                    }
                    hi.activated = true;
                }
                else {
                    // since node 11 this seems to be not required anymore:
                    this._currId = ROOT_ID;
                }
                // this.debugId('before', id);
            },
            after: (id) => {
                // an async handle ends
                if (id === this._currId) {
                    this._currId = ROOT_ID;
                }
                // this.debugId('after', id);
            },
            destroy: (id) => {
                // an async handle gets destroyed
                // this.debugId('destroy', id);
                if (this.idHookMap.has(id)) {
                    /* istanbul ignore if  */
                    if (id === this._currId) {
                        // NOTES: this should not happen
                        nodeproc._rawDebug(`asyncctx: destroy hook called for current context (id: ${this.currId})!`);
                    }
                    this.idHookMap.delete(id);
                    if (Date.now() - DELAY_UNTIL_CLEAR > lastTimestampClear) {
                        lastTimestampClear = Date.now();
                        this.clearOldData(60);
                    }
                }
            },
        };
        this.hookInstance = asyncHooks.createHook(this.hookFuncs);
        this.enable();
    }
    get currId() {
        return this._currId;
    }
    /**
     * Get the current execution context data
     *
     * @returns {(T|undefined)}
     */
    getContext() {
        const hi = this.idHookMap.get(this.currId);
        return hi ? hi.data : undefined;
    }
    /**
     * Set the current execution context data
     *
     * @param {T} value
     * @returns {(T)}
     */
    setContext(value) {
        const hi = this.idHookMap.get(this.currId);
        /* istanbul ignore if */
        if (!hi) {
            throw new Error('setContext must be called in an async context!');
        }
        hi.data = value;
        return value;
    }
    /**
     * Get the root execution context data
     *
     * @returns {(T|undefined)}
     */
    getRootContext() {
        const hi = this.idHookMap.get(ROOT_ID);
        /* istanbul ignore if  */
        if (!hi) {
            // NOTES: this should not happen
            throw new Error('internal error: root node not found (1)!');
        }
        return hi ? hi.data : undefined;
    }
    /**
     * Set the root execution context data
     *
     * @param {T} value
     * @returns {(T)}
     */
    setRootContext(value) {
        const hi = this.idHookMap.get(ROOT_ID);
        /* istanbul ignore if  */
        if (!hi) {
            // NOTES: this should not happen
            throw new Error('internal error: root node not found (2)!');
        }
        hi.data = value;
        return value;
    }
    /**
     * Get the id of the caller for debugging purpose
     *
     * @param {number} [id=this.currId]
     * @returns {(number|undefined)}
     */
    /* istanbul ignore next */
    getTriggerId(id = this.currId) {
        const hi = this.idHookMap.get(id);
        return hi ? hi.triggerId : undefined;
    }
    /**
     * debug output for debugging purpose
     *
     * @param {string} prefix
     * @param {number} [id=this.currId]
     */
    /* istanbul ignore next */
    debugId(prefix, id = this.currId) {
        const hi = this.idHookMap.get(id);
        if (hi) {
            let data = 'undefined';
            const oriTriggerId = hi.oriTriggerId ? hi.oriTriggerId : 1;
            if (hi.data) {
                try {
                    data = JSON.stringify(hi.data);
                }
                catch (_ignore) {
                    data = hi.data.toString();
                }
            }
            nodeproc._rawDebug(`${prefix}: id: ${id} type: '${hi.type}' triggerId: ${oriTriggerId} data: ${data} for id: ${hi.triggerId}))`);
        }
        else {
            nodeproc._rawDebug(`${prefix}: id: ${id}`);
        }
    }
    /**
     * clean up
     */
    dispose() {
        this.disable();
        this.idHookMap.clear();
    }
    /**
     * clean all data older than x seconds
     */
    clearOldData(before = 30) {
        for (const [key, value] of this.idHookMap) {
            if (value.creationDate <= Date.now() - before * 1000) {
                this.idHookMap.delete(key);
            }
        }
    }
    /**
     * enable
     *
     */
    enable() {
        this.initMap(this.getRootContext());
        this.hookInstance.enable();
    }
    /**
     * disable
     *
     */
    disable() {
        this.hookInstance.disable();
    }
    initMap(value) {
        this.idHookMap = new Map();
        this.idHookMap.set(ROOT_ID, { id: ROOT_ID, type: 'C++', triggerId: 0, activated: true, creationDate: Date.now() });
        this._currId = ROOT_ID;
        if (value) {
            this.setRootContext(value);
        }
    }
}
exports.ContinuationLocalStorage = ContinuationLocalStorage;
//# sourceMappingURL=ContinuationLocalStorage.js.map