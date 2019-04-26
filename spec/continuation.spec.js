"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: no-unused-variable no-require-imports no-var-requires
const fs = require("fs");
const ContinuationLocalStorage_1 = require("../ContinuationLocalStorage");
const clsOld = new ContinuationLocalStorage_1.ContinuationLocalStorage();
let clsNew;
let cls;
const DODEBUG = 0;
const nodeproc = process;
function debugId(prefix) {
    if (!DODEBUG) {
        return;
    }
    cls.debugId('TEST: ' + prefix);
}
describe('test continuation but enable hooks right before each test:', () => {
    beforeEach((done) => {
        if (clsNew) {
            clsNew.dispose();
        }
        clsNew = new ContinuationLocalStorage_1.ContinuationLocalStorage();
        clsNew.disable();
        cls = clsNew;
        done();
    });
    it('calling process.nextTick should preserve continuation local storage', (done) => __awaiter(this, void 0, void 0, function* () {
        cls.enable();
        debugId('process.nextTick: START BEGIN');
        const startId = cls.currId;
        const startValue = 111;
        expect(cls.setRootContext(startValue)).toBe(startValue, `start value (${startValue}) not set`);
        debugId('process.nextTick: START END  ');
        process.nextTick(() => {
            debugId('process.nextTick: OUTER BEGIN');
            const outerId = cls.currId;
            const outerPreviousId = cls.getTriggerId();
            expect(outerPreviousId).toBe(startId, `previous id (${outerPreviousId}) is not the expected start id (${startId})`);
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            const outerValue = startValue + 1;
            expect(cls.setContext(outerValue)).toBe(outerValue, `outer value (${outerValue}) not set`);
            debugId('process.nextTick: OUTER END  ');
            process.nextTick(() => {
                debugId('process.nextTick: INNER BEGIN');
                const innerId = cls.currId;
                const innerPreviousId = cls.getTriggerId();
                expect(innerPreviousId).toBe(outerId, `previous id (${innerPreviousId}) is not the expected outer id (${outerId})`);
                expect(cls.getContext()).toBe(outerValue, `inner value is not the expected outer value (${outerValue})`);
                const innerValue = outerValue + 1;
                expect(cls.setContext(innerValue)).toBe(innerValue, `inner value (${innerValue}) not set`);
                debugId('process.nextTick: INNER END  ');
                cls.disable();
                done();
            });
        });
    }));
    it('calling setImmediate should preserve continuation local storage', (done) => __awaiter(this, void 0, void 0, function* () {
        cls.enable();
        debugId('setImmediate: START BEGIN');
        const startId = cls.currId;
        const startValue = 121;
        expect(cls.setRootContext(startValue)).toBe(startValue, `start value (${startValue}) not set`);
        debugId('setImmediate: START END  ');
        setImmediate(() => {
            debugId('setImmediate: OUTER BEGIN');
            const outerId = cls.currId;
            const outerPreviousId = cls.getTriggerId();
            expect(outerPreviousId).toBe(startId, `previous id (${outerPreviousId}) is not the expec521ted start id (${startId})`);
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            const outerValue = startValue + 1;
            expect(cls.setContext(outerValue)).toBe(outerValue, `outer value (${outerValue}) not set`);
            debugId('setImmediate: OUTER END  ');
            setImmediate(() => {
                debugId('setImmediate: INNER BEGIN');
                const innerId = cls.currId;
                const innerPreviousId = cls.getTriggerId();
                expect(innerPreviousId).toBe(outerId, `previous id (${innerPreviousId}) is not the expected outer id (${outerId})`);
                expect(cls.getContext()).toBe(outerValue, `inner value is not the expected outer value (${outerValue})`);
                const innerValue = outerValue + 1;
                expect(cls.setContext(innerValue)).toBe(innerValue, `inner value (${innerValue}) not set`);
                debugId('setImmediate: INNER END  ');
                cls.disable();
                done();
            });
        });
    }));
    it('calling setTimeout should preserve continuation local storage', (done) => __awaiter(this, void 0, void 0, function* () {
        cls.enable();
        debugId('setTimeout: START BEGIN');
        const startId = cls.currId;
        const startValue = 131;
        expect(cls.setRootContext(startValue)).toBe(startValue, `start value (${startValue}) not set`);
        debugId('setTimeout: START END  ');
        setTimeout(() => {
            debugId('setTimeout: OUTER BEGIN');
            const outerId = cls.currId;
            const outerPreviousId = cls.getTriggerId();
            expect(outerPreviousId).toBe(startId, `previous id (${outerPreviousId}) is not the expected start id (${startId})`);
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            const outerValue = startValue + 1;
            expect(cls.setContext(outerValue)).toBe(outerValue, `outer value (${outerValue}) not set`);
            debugId('setTimeout: OUTER END  ');
            setTimeout(() => {
                debugId('setTimeout: INNER BEGIN');
                const innerId = cls.currId;
                const innerPreviousId = cls.getTriggerId();
                expect(innerPreviousId).toBe(outerId, `previous id (${innerPreviousId}) is not the expected outer id (${outerId})`);
                expect(cls.getContext()).toBe(outerValue, `inner value is not the expected outer value (${outerValue})`);
                const innerValue = outerValue + 1;
                expect(cls.setContext(innerValue)).toBe(innerValue, `inner value (${innerValue}) not set`);
                debugId('setTimeout: INNER END  ');
                cls.disable();
                done();
            }, 0);
        }, 0);
    }));
    it('calling setInterval should preserve continuation local storage', (done) => __awaiter(this, void 0, void 0, function* () {
        cls.enable();
        debugId('setInterval: START BEGIN');
        const startId = cls.currId;
        const startValue = 141;
        expect(cls.setRootContext(startValue)).toBe(startValue, `start value (${startValue}) not set`);
        debugId('setInterval: START END  ');
        const timer1 = setInterval(() => {
            debugId('setInterval: OUTER BEGIN');
            const outerId = cls.currId;
            const outerPreviousId = cls.getTriggerId();
            expect(outerPreviousId).toBe(startId, `previous id (${outerPreviousId}) is not the expected start id (${startId})`);
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            const outerValue = startValue + 1;
            expect(cls.setContext(outerValue)).toBe(outerValue, `outer value (${outerValue}) not set`);
            debugId('setInterval: OUTER END  ');
            clearInterval(timer1);
            const timer2 = setInterval(() => {
                debugId('setInterval: INNER BEGIN');
                const innerId = cls.currId;
                const innerPreviousId = cls.getTriggerId();
                expect(innerPreviousId).toBe(outerId, `previous id (${innerPreviousId}) is not the expected outer id (${outerId})`);
                expect(cls.getContext()).toBe(outerValue, `inner value is not the expected outer value (${outerValue})`);
                const innerValue = outerValue + 1;
                expect(cls.setContext(innerValue)).toBe(innerValue, `inner value (${innerValue}) not set`);
                debugId('setInterval: INNER END  ');
                clearInterval(timer2);
                cls.disable();
                done();
            }, 100);
        }, 100);
    }));
    it('calling fs should preserve continuation local storage', (done) => __awaiter(this, void 0, void 0, function* () {
        cls.enable();
        debugId('fs: START BEGIN');
        const startId = cls.currId;
        const startValue = 151;
        expect(cls.setRootContext(startValue)).toBe(startValue, `start value (${startValue}) not set`);
        debugId('fs: START END  ');
        fs.access(__filename, () => {
            debugId('fs: OUTER BEGIN');
            const outerId = cls.currId;
            const outerPreviousId = cls.getTriggerId();
            expect(outerPreviousId).toBe(startId, `previous id (${outerPreviousId}) is not the expected start id (${startId})`);
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            const outerValue = startValue + 1;
            expect(cls.setContext(outerValue)).toBe(outerValue, `outer value (${outerValue}) not set`);
            debugId('fs: OUTER END  ');
            fs.access(__filename, () => {
                debugId('fs: INNER BEGIN');
                const innerId = cls.currId;
                const innerPreviousId = cls.getTriggerId();
                expect(innerPreviousId).toBe(outerId, `previous id (${innerPreviousId}) is not the expected outer id (${outerId})`);
                expect(cls.getContext()).toBe(outerValue, `inner value is not the expected outer value (${outerValue})`);
                const innerValue = outerValue + 1;
                expect(cls.setContext(innerValue)).toBe(innerValue, `inner value (${innerValue}) not set`);
                debugId('fs: INNER END  ');
                cls.disable();
                done();
            });
        });
    }));
    // NOTES:
    // the executor function of the top most Promise is running synchronously
    //   see: https://github.com/nodejs/node-eps/pull/18
    // so the cls-context inside this executor function is the same as the
    // cls-context of the caller
    it('chained promises should preserve continuation local storage', (done) => {
        cls.enable();
        debugId('promise: START BEGIN');
        const startId = cls.currId;
        const startValue = 161;
        let outerId;
        let outerValue;
        let innerId;
        let innerValue;
        let innermostId;
        let innermostValue;
        expect(cls.setRootContext(startValue)).toBe(startValue, `start value (${startValue}) not set`);
        debugId('promise: START END  ');
        return new Promise((resolve, reject) => {
            debugId('promise: OUTER BEGIN');
            outerId = cls.currId;
            const outerPreviousId = cls.getTriggerId();
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            // The executor function is running synchronously!!!
            expect(outerId).toBe(startId, `my id (${outerId}) is not the expected start id (${startId})`);
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            outerValue = startValue;
            debugId('promise: OUTER END  ');
            resolve(outerValue);
        })
            .then((val) => {
            debugId('promise: OUTER THEN');
            return new Promise((resolve, reject) => {
                debugId('promise: INNER BEGIN');
                innerId = cls.currId;
                const innerPreviousId = cls.getTriggerId();
                expect(innerPreviousId).toBe(outerId, `previous id (${innerPreviousId}) is not the expected outer id (${outerId})`);
                expect(cls.getContext()).toBe(outerValue, `inner value is not the expected outer value (${outerValue})`);
                innerValue = outerValue + 1;
                expect(cls.setContext(innerValue)).toBe(innerValue, `inner value (${innerValue}) not set`);
                debugId('promise: INNER END  ');
                resolve(innerValue);
            }).then((val2) => {
                debugId('promise: INNER THEN');
                return new Promise((resolve, reject) => {
                    debugId('promise: INNERMOST BEGIN');
                    innermostId = cls.currId;
                    const innermostPreviousId = cls.getTriggerId();
                    // test https://github.com/nodejs/node/issues/13583
                    expect(innermostPreviousId).toBe(innerId, `previous id (${innermostPreviousId}) is not the
                           expected inner id (${innerId})`);
                    expect(cls.getContext()).toBe(innerValue, `innermost value is not the expected inner value
                           (${innerValue})`);
                    innermostValue = innerValue + 1;
                    expect(cls.setContext(innermostValue)).toBe(innermostValue, `innermost value (${innermostValue}) not set`);
                    debugId('promise: INNERMOST END  ');
                    resolve(innermostValue);
                });
            });
        })
            .then((val) => {
            cls.disable();
            done();
            return val;
        })
            .catch((err) => {
            cls.disable();
            fail(err);
        });
    });
    it('promise returned from promise executor function should preserve continuation local storage', (done) => {
        cls.enable();
        debugId('promise: START BEGIN');
        const startId = cls.currId;
        let outerId;
        let innerId;
        debugId('promise: START END  ');
        return new Promise((resolve1, reject1) => {
            debugId('promise: OUTER BEGIN');
            outerId = cls.currId;
            expect(outerId).toBe(startId, `outer id (${outerId}) is not the expected start id (${startId})`);
            return new Promise((resolve2, reject2) => {
                debugId('promise: INNER BEGIN');
                innerId = cls.currId;
                expect(innerId).toBe(startId, `inner id (${innerId}) is not the expected start id (${startId})`);
                resolve2(42);
            }).then(() => {
                resolve1(24);
            }); // <= resolving is requried
        })
            .catch((err) => {
            cls.disable();
            fail(err);
        })
            .then((val) => {
            cls.disable();
            done();
        });
    });
});
// #######################################################################################################################
describe('test continuation with hooks enabled long before running these tests:', () => {
    beforeEach((done) => {
        cls = clsOld;
        done();
    });
    it('calling process.nextTick should preserve continuation local storage', (done) => __awaiter(this, void 0, void 0, function* () {
        debugId('process.nextTick: START BEGIN');
        const startId = cls.currId;
        const startValue = 211;
        expect(cls.setContext(startValue)).toBe(startValue, `start value (${startValue}) not set`);
        debugId('process.nextTick: START END  ');
        process.nextTick(() => {
            debugId('process.nextTick: OUTER BEGIN');
            const outerId = cls.currId;
            const outerPreviousId = cls.getTriggerId();
            expect(outerPreviousId).toBe(startId, `previous id (${outerPreviousId}) is not the expected start id (${startId})`);
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            const outerValue = startValue + 1;
            expect(cls.setContext(outerValue)).toBe(outerValue, `outer value (${outerValue}) not set`);
            debugId('process.nextTick: OUTER END  ');
            process.nextTick(() => {
                debugId('process.nextTick: INNER BEGIN');
                const innerId = cls.currId;
                const innerPreviousId = cls.getTriggerId();
                expect(innerPreviousId).toBe(outerId, `previous id (${innerPreviousId}) is not the expected outer id (${outerId})`);
                expect(cls.getContext()).toBe(outerValue, `inner value is not the expected outer value (${outerValue})`);
                const innerValue = outerValue + 1;
                expect(cls.setContext(innerValue)).toBe(innerValue, `inner value (${innerValue}) not set`);
                debugId('process.nextTick: INNER END  ');
                done();
            });
        });
    }));
    it('calling setImmediate should preserve continuation local storage', (done) => __awaiter(this, void 0, void 0, function* () {
        debugId('setImmediate: START BEGIN');
        const startId = cls.currId;
        const startValue = 221;
        expect(cls.setContext(startValue)).toBe(startValue, `start value (${startValue}) not set`);
        debugId('setImmediate: START END  ');
        setImmediate(() => {
            debugId('setImmediate: OUTER BEGIN');
            const outerId = cls.currId;
            const outerPreviousId = cls.getTriggerId();
            expect(outerPreviousId).toBe(startId, `previous id (${outerPreviousId}) is not the expected start id (${startId})`);
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            const outerValue = startValue + 1;
            expect(cls.setContext(outerValue)).toBe(outerValue, `outer value (${outerValue}) not set`);
            debugId('setImmediate: OUTER END  ');
            setImmediate(() => {
                debugId('setImmediate: INNER BEGIN');
                const innerId = cls.currId;
                const innerPreviousId = cls.getTriggerId();
                expect(innerPreviousId).toBe(outerId, `previous id (${innerPreviousId}) is not the expected outer id (${outerId})`);
                expect(cls.getContext()).toBe(outerValue, `inner value is not the expected outer value (${outerValue})`);
                const innerValue = outerValue + 1;
                expect(cls.setContext(innerValue)).toBe(innerValue, `inner value (${innerValue}) not set`);
                debugId('setImmediate: INNER END  ');
                done();
            });
        });
    }));
    it('calling setTimeout should preserve continuation local storage', (done) => __awaiter(this, void 0, void 0, function* () {
        debugId('setTimeout: START BEGIN');
        const startId = cls.currId;
        const startValue = 231;
        expect(cls.setContext(startValue)).toBe(startValue, `start value (${startValue}) not set`);
        debugId('setTimeout: START END  ');
        setTimeout(() => {
            debugId('setTimeout: OUTER BEGIN');
            const outerId = cls.currId;
            const outerPreviousId = cls.getTriggerId();
            expect(outerPreviousId).toBe(startId, `previous id (${outerPreviousId}) is not the expected start id (${startId})`);
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            const outerValue = startValue + 1;
            expect(cls.setContext(outerValue)).toBe(outerValue, `outer value (${outerValue}) not set`);
            debugId('setTimeout: OUTER END  ');
            setTimeout(() => {
                debugId('setTimeout: INNER BEGIN');
                const innerId = cls.currId;
                const innerPreviousId = cls.getTriggerId();
                expect(innerPreviousId).toBe(outerId, `previous id (${innerPreviousId}) is not the expected outer id (${outerId})`);
                expect(cls.getContext()).toBe(outerValue, `inner value is not the expected outer value (${outerValue})`);
                const innerValue = outerValue + 1;
                expect(cls.setContext(innerValue)).toBe(innerValue, `inner value (${innerValue}) not set`);
                debugId('setTimeout: INNER END  ');
                done();
            }, 0);
        }, 0);
    }));
    it('calling setInterval should preserve continuation local storage', (done) => __awaiter(this, void 0, void 0, function* () {
        debugId('setInterval: START BEGIN');
        const startId = cls.currId;
        const startValue = 241;
        expect(cls.setContext(startValue)).toBe(startValue, `start value (${startValue}) not set`);
        debugId('setInterval: START END  ');
        const timer1 = setInterval(() => {
            debugId('setInterval: OUTER BEGIN');
            const outerId = cls.currId;
            const outerPreviousId = cls.getTriggerId();
            expect(outerPreviousId).toBe(startId, `previous id (${outerPreviousId}) is not the expected start id (${startId})`);
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            const outerValue = startValue + 1;
            expect(cls.setContext(outerValue)).toBe(outerValue, `outer value (${outerValue}) not set`);
            debugId('setInterval: OUTER END  ');
            clearInterval(timer1);
            const timer2 = setInterval(() => {
                debugId('setInterval: INNER BEGIN');
                const innerId = cls.currId;
                const innerPreviousId = cls.getTriggerId();
                expect(innerPreviousId).toBe(outerId, `previous id (${innerPreviousId}) is not the expected outer id (${outerId})`);
                expect(cls.getContext()).toBe(outerValue, `inner value is not the expected outer value (${outerValue})`);
                const innerValue = outerValue + 1;
                expect(cls.setContext(innerValue)).toBe(innerValue, `inner value (${innerValue}) not set`);
                debugId('setInterval: INNER END  ');
                clearInterval(timer2);
                done();
            }, 100);
        }, 100);
    }));
    it('calling fs should preserve continuation local storage', (done) => __awaiter(this, void 0, void 0, function* () {
        debugId('fs: START BEGIN');
        const startId = cls.currId;
        const startValue = 251;
        expect(cls.setContext(startValue)).toBe(startValue, `start value (${startValue}) not set`);
        debugId('fs: START END  ');
        fs.access(__filename, () => {
            debugId('fs: OUTER BEGIN');
            const outerId = cls.currId;
            const outerPreviousId = cls.getTriggerId();
            expect(outerPreviousId).toBe(startId, `previous id (${outerPreviousId}) is not the expected start id (${startId})`);
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            const outerValue = startValue + 1;
            expect(cls.setContext(outerValue)).toBe(outerValue, `outer value (${outerValue}) not set`);
            debugId('fs: OUTER END  ');
            fs.access(__filename, () => {
                debugId('fs: INNER BEGIN');
                const innerId = cls.currId;
                const innerPreviousId = cls.getTriggerId();
                expect(innerPreviousId).toBe(outerId, `previous id (${innerPreviousId}) is not the expected outer id (${outerId})`);
                expect(cls.getContext()).toBe(outerValue, `inner value is not the expected outer value (${outerValue})`);
                const innerValue = outerValue + 1;
                expect(cls.setContext(innerValue)).toBe(innerValue, `inner value (${innerValue}) not set`);
                debugId('fs: INNER END  ');
                done();
            });
        });
    }));
    // NOTES:
    // the executor function of the top most Promise is running synchronously
    //   see: https://github.com/nodejs/node-eps/pull/18
    // so the cls-context inside this executor function is the same as the
    // cls-context of the caller
    it('chained promises should preserve continuation local storage', (done) => {
        debugId('promise: START BEGIN');
        const startId = cls.currId;
        const startValue = 261;
        let outerId;
        let outerValue;
        let innerId;
        let innerValue;
        let innermostId;
        let innermostValue;
        expect(cls.setContext(startValue)).toBe(startValue, `start value (${startValue}) not set`);
        debugId('promise: START END  ');
        return new Promise((resolve, reject) => {
            debugId('promise: OUTER BEGIN');
            outerId = cls.currId;
            const outerPreviousId = cls.getTriggerId();
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            // The executor function is running synchronously!!!
            expect(outerId).toBe(startId, `my id (${outerId}) is not the expected start id (${startId})`);
            expect(cls.getContext()).toBe(startValue, `outer value is not the expected start value (${startValue})`);
            outerValue = startValue;
            debugId('promise: OUTER END  ');
            resolve(outerValue);
        })
            .then((val) => {
            debugId('promise: OUTER THEN');
            return new Promise((resolve, reject) => {
                debugId('promise: INNER BEGIN');
                innerId = cls.currId;
                const innerPreviousId = cls.getTriggerId();
                expect(innerPreviousId).toBe(outerId, `previous id (${innerPreviousId}) is not the expected outer id (${outerId})`);
                expect(cls.getContext()).toBe(outerValue, `inner value is not the expected outer value (${outerValue})`);
                innerValue = outerValue + 1;
                expect(cls.setContext(innerValue)).toBe(innerValue, `inner value (${innerValue}) not set`);
                debugId('promise: INNER END  ');
                resolve(innerValue);
            }).then((val2) => {
                debugId('promise: INNER THEN');
                return new Promise((resolve, reject) => {
                    debugId('promise: INNERMOST BEGIN');
                    innermostId = cls.currId;
                    const innermostPreviousId = cls.getTriggerId();
                    // test: https://github.com/nodejs/node/issues/13583
                    expect(innermostPreviousId).toBe(innerId, `previous id (${innermostPreviousId}) is not the
                           expected inner id (${innerId})`);
                    expect(cls.getContext()).toBe(innerValue, `innermost value is not the expected inner value
                           (${innerValue})`);
                    innermostValue = innerValue + 1;
                    expect(cls.setContext(innermostValue)).toBe(innermostValue, `innermost value (${innermostValue}) not set`);
                    debugId('promise: INNERMOST END  ');
                    resolve(innermostValue);
                });
            });
        })
            .then((val) => {
            done();
            return val;
        })
            .catch((err) => {
            fail(err);
        });
    });
    it('promise returned from promise executor function should preserve continuation local storage', (done) => {
        debugId('promise: START BEGIN');
        const startId = cls.currId;
        let outerId;
        let innerId;
        debugId('promise: START END  ');
        return new Promise((resolve1, reject1) => {
            debugId('promise: OUTER BEGIN');
            outerId = cls.currId;
            expect(outerId).toBe(startId, `outer id (${outerId}) is not the expected start id (${startId})`);
            return new Promise((resolve2, reject2) => {
                debugId('promise: INNER BEGIN');
                innerId = cls.currId;
                expect(innerId).toBe(startId, `inner id (${innerId}) is not the expected start id (${startId})`);
                resolve2(42);
                // done();
            }).then(() => {
                resolve1(24);
            }); // <= resolving is requried
        })
            .catch((err) => {
            fail(err);
        })
            .then((val) => {
            done();
        });
    });
});
//# sourceMappingURL=continuation.spec.js.map