"use strict";
// tslint:disable no-null-keyword
// tslint:disable no-require-imports no-var-requires
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require('semver');
const nodeVersion = process.versions.node;
let asyncHooks;
// tslint:disable-next-line prefer-conditional-expression
if (semver.gte(nodeVersion, '8.0.0')) {
    // tslint:disable-next-line no-implicit-dependencies
    asyncHooks = require('async_hooks');
}
else {
    asyncHooks = require('./fake_async_hooks');
}
let nodeproc = process;
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
        this.initMap();
        this.hookFuncs = {
            init: (id, type, triggerId) => {
                // a new async handle gets initialized:
                const oriTriggerId = triggerId;
                // tslint:disable-next-line strict-type-predicates
                if (triggerId == null) {
                    // NOTES: this should not happen
                    // nodeproc._rawDebug(`init:   id: ${id}: WARNING: triggerId is not defined`);
                    triggerId = this._currId;
                }
                let triggerHook = this.idHookMap.get(triggerId);
                if (!triggerHook) {
                    // NOTES: this is expected
                    // nodeproc._rawDebug(`init:   id: ${id}: WARNING: triggerId: ${triggerId} is not registered`);
                    triggerId = ROOT_ID;
                    triggerHook = this.idHookMap.get(triggerId);
                }
                else {
                    while (triggerHook.type === 'PROMISE' && !triggerHook.activated &&
                        this.idHookMap.has(triggerHook.triggerId)) {
                        // NOTES: this is expected
                        // nodeproc._rawDebug(
                        //     `init:   id: ${id}: WARNING: changing trigger from ${triggerId} to ${triggerHook.triggerId}`);
                        triggerId = triggerHook.triggerId;
                        triggerHook = this.idHookMap.get(triggerId);
                    }
                }
                this.idHookMap.set(id, { id, type, triggerId, oriTriggerId, triggerHook, activated: false, creationDate: Date.now() });
                // this.debugId('init', id);
            },
            before: (id) => {
                // an async handle starts
                this._currId = id;
                let hi = this.idHookMap.get(id);
                if (hi) {
                    if (!hi.activated) {
                        hi.data = hi.triggerHook ? hi.triggerHook.data : undefined;
                    }
                    hi.activated = true;
                }
                else {
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
                    if (id === this._currId) {
                        nodeproc._rawDebug(`asyncctx: destroy hook called for current context (id: ${this.currId})!`);
                    }
                    this.idHookMap.delete(id);
                }
            }
        };
        this.hookInstance = asyncHooks.createHook(this.hookFuncs);
        this.enable();
    }
    get currId() { return this._currId; }
    /**
     * Get the current execution context data
     *
     * @returns {(T|undefined)}
     */
    getContext() {
        let hi = this.idHookMap.get(this.currId);
        return hi ? hi.data : undefined;
    }
    /**
     * Set the current execution context data
     *
     * @param {T} value
     * @returns {(T)}
     */
    setContext(value) {
        let hi = this.idHookMap.get(this.currId);
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
        let hi = this.idHookMap.get(ROOT_ID);
        if (!hi) {
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
        let hi = this.idHookMap.get(ROOT_ID);
        if (!hi) {
            throw new Error('internal error: root node not found (2)!');
        }
        hi.data = value;
        return value;
    }
    /**
     * Get the id of the caller (for debugging purpose)
     *
     * @param {number} [id=this.currId]
     * @returns {(number|undefined)}
     */
    getTriggerId(id = this.currId) {
        let hi = this.idHookMap.get(id);
        return hi ? hi.triggerId : undefined;
    }
    /**
     * debug output
     *
     * @param {string} prefix
     * @param {number} [id=this.currId]
     */
    debugId(prefix, id = this.currId) {
        let hi = this.idHookMap.get(id);
        if (hi) {
            let data = 'undefined';
            let oriTriggerId = hi.oriTriggerId ? hi.oriTriggerId : 1;
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
        // asyncHook.removeHooks(this.hooks);
        this.disable();
        this.idHookMap.clear();
    }
    /**
     * clean all data older than x seconds
     */
    clearOldData(before = 30) {
        for (let [key, value] of this.idHookMap) {
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
    disable() { this.hookInstance.disable(); }
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
