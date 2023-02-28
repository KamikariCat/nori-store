import { useEffect, useState } from 'react';
export var createUseState = function (store, subscribe) {
    if (subscribe === void 0) { subscribe = true; }
    return function () {
        var deps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            deps[_i] = arguments[_i];
        }
        var _a = useState(store.state), state = _a[0], setState = _a[1];
        useEffect(function () {
            if (subscribe) {
                return store.subscribe(function (state, prevState) {
                    if (deps.length >= 1) {
                        var changedValues_1 = {};
                        deps.forEach(function (keyName) { return void (changedValues_1[keyName] = state[keyName]); });
                        var hasChanges = deps.some(function (keyName) { return state[keyName] !== prevState[keyName]; });
                        if (hasChanges) {
                            setState(changedValues_1);
                        }
                        else {
                            return;
                        }
                    }
                    setState(state);
                });
            }
            return function () { return void 0; };
        }, []);
        return state;
    };
};
//# sourceMappingURL=getUseState.js.map