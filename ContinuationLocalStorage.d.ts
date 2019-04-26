/**
 *
 *
 * @export
 * @class ContinuationLocalStorage
 * @template T
 */
export declare class ContinuationLocalStorage<T> {
    private _currId;
    readonly currId: number;
    private idHookMap;
    private readonly hookFuncs;
    private readonly hookInstance;
    /**
     * Creates an instance of ContinuationLocalStorage.
     *
     */
    constructor();
    /**
     * Get the current execution context data
     *
     * @returns {(T|undefined)}
     */
    getContext(): T | undefined;
    /**
     * Set the current execution context data
     *
     * @param {T} value
     * @returns {(T)}
     */
    setContext(value: T): T;
    /**
     * Get the root execution context data
     *
     * @returns {(T|undefined)}
     */
    getRootContext(): T | undefined;
    /**
     * Set the root execution context data
     *
     * @param {T} value
     * @returns {(T)}
     */
    setRootContext(value: T): T;
    /**
     * Get the id of the caller for debugging purpose
     *
     * @param {number} [id=this.currId]
     * @returns {(number|undefined)}
     */
    getTriggerId(id?: number): number | undefined;
    /**
     * debug output for debugging purpose
     *
     * @param {string} prefix
     * @param {number} [id=this.currId]
     */
    debugId(prefix: string, id?: number): void;
    /**
     * clean up
     */
    dispose(): void;
    /**
     * clean all data older than x seconds
     */
    clearOldData(before?: number): void;
    /**
     * enable
     *
     */
    enable(): void;
    /**
     * disable
     *
     */
    disable(): void;
    protected initMap(value?: T): void;
    private readonly findActivatedNode;
}
