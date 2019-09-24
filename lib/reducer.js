"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Reducer = function Reducer(initial) {
  var _this = this;

  _classCallCheck(this, Reducer);

  this.callMap = {};
  this.parent = null;
  this.listen = [];
  this["default"] = null;

  var func = function func() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initial;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var getState = arguments.length > 2 ? arguments[2] : undefined;

    if (action === undefined) {
      return state;
    }

    var handler = _this.callMap[action.type];

    if (handler !== undefined) {
      return handler(state, action, getState);
    }

    if (_this["default"] === false) {
      throw new Error("".concat(action.type, " missfire (reducer handler is not defined)"));
    }

    if (typeof _this["default"] === 'function') {
      return _this["default"](state, action, getState);
    }

    return state;
  };

  func.on = function (message, execute) {
    if (typeof message !== 'string') {
      throw new Error("message must be string, got ".concat(_typeof(message)));
    }

    if (_this.callMap[message] !== undefined) {
      throw new Error("".concat(message, " already defined (reducer handler redefinition is not allowed)"));
    }

    if (typeof execute !== 'function') {
      throw new Error("".concat(message, " handler is not a function"));
    }

    _this.callMap[message] = execute;

    _this.listen.push(message);

    if (_this.parent !== null) {
      _this.parent.onUpdate(_this);
    }

    return func;
  };

  func.notifyOnChange = function (parent) {
    _this.parent = parent;
  };

  func["default"] = function (handler) {
    if (handler === false || handler === null || typeof handler === 'function') {
      _this["default"] = handler;
    }

    throw new Error('default handler can only be function, null of false');
  };

  Object.defineProperty(func, 'listen', {
    get: function get() {
      return _this.listen;
    }
  });
  return func;
};

exports["default"] = Reducer;
;