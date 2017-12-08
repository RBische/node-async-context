"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: no-require-imports no-var-requires
const asyncHook = require('./async-hook/index.js');
const ROOT_UID = 1;
class FakeAsyncHooks {
    constructor(externalHooks) {
        this.externalHooks = externalHooks;
        if (!FakeAsyncHooks.providers) {
            FakeAsyncHooks.providers = Object.keys(asyncHook.providers).map((key) => key);
        }
        this.enabled = false;
        this.currId = ROOT_UID;
        this.internalHooks = {
            init: (id, handle, provider, parentId, parentHandle) => {
                // TODO: set type
                if (this.enabled) {
                    // tslint:disable-next-line: triple-equals strict-type-predicates no-null-keyword
                    this.externalHooks.init(id, FakeAsyncHooks.providers[provider], parentId !== null ? parentId : this.currId);
                }
            },
            pre: (id) => {
                this.currId = id;
                if (this.enabled) {
                    this.externalHooks.before(id);
                }
            },
            post: (id) => {
                if (id === this.currId) {
                    this.currId = ROOT_UID;
                }
                if (this.enabled) {
                    this.externalHooks.after(id);
                }
            },
            destroy: (id) => {
                if (this.enabled) {
                    this.externalHooks.destroy(id);
                }
            }
        };
        asyncHook.addHooks(this.internalHooks);
    }
    enable() {
        this.enabled = true;
        if (!FakeAsyncHooks.internalHooksEnabled) {
            asyncHook.enable();
            FakeAsyncHooks.internalHooksEnabled = true;
        }
    }
    disable() { this.enabled = false; }
    dispose() { asyncHook.removeHooks(this.internalHooks); }
}
FakeAsyncHooks.internalHooksEnabled = false;
function createHook(hooks) {
    return new FakeAsyncHooks(hooks);
}
exports.createHook = createHook;

//# sourceMappingURL=fake_async_hooks.js.map
