var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Store = /** @class */ (function () {
    function Store(name, initialState) {
        this._subscribers = new Set();
        this.name = name;
        this._state = initialState;
    }
    Object.defineProperty(Store.prototype, "state", {
        // === === === State === === ===
        get: function () {
            return this._state;
        },
        set: function (value) {
            var _this = this;
            if (this._subscribers.size >= 1) {
                this._subscribers.forEach(function (subscriber) { return subscriber(value, _this._state); });
            }
            this._state = value;
        },
        enumerable: false,
        configurable: true
    });
    Store.prototype.subscribe = function (subscriber) {
        var _this = this;
        this._subscribers.add(subscriber);
        return function () { return void _this._subscribers.delete(subscriber); };
    };
    Store.prototype.setValues = function (pieceOfState) {
        this.state = __assign(__assign({}, this.state), pieceOfState);
        return this.state;
    };
    return Store;
}());
export { Store };
//# sourceMappingURL=store.js.map