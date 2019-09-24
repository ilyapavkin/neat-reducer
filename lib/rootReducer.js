"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RootReducer = function RootReducer(initial) {
  var _this = this;

  _classCallCheck(this, RootReducer);

  this.reducers = {};
  this.callMap = {};
  this.listens = [];
  this.initial = initial;

  var rebuildMap = function rebuildMap() {
    var newMap = {};
    var mapAsArray = Object.values(_this.reducers).map(function (r) {
      return r.listens.map(function (l) {
        return {
          msg: l,
          reducer: r
        };
      });
    }).flat();
    mapAsArray.map(function (el) {
      if (newMap[el.msg] === undefined) {
        newMap[el.msg] = [];
      }

      newMap[el.msg].push(el.reducer);
      return el;
    });
    _this.callMap = newMap;
    _this.listens = Object.keys(_this.callMap);
  };

  var func = function func() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.initial;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    if (_this.callMap[action.type] !== undefined) {
      var call = _this.callMap[action.type].map(function (name) {
        return {
          name: name,
          newState: _this.reducers[name](state[name], action, function () {
            return state;
          })
        };
      }).reduce(function (acc, el) {
        acc[el.name] = el.newState;
        return acc;
      }, {});

      var r = _objectSpread({}, state, {}, call);

      return r;
    }

    return state;
  };

  func.add = function (name, reducer) {
    if (_this.reducers[name] !== undefined) {
      throw new Error("".concat(name, " reducer is already defined"));
    }

    reducer.listen.map(function (l) {
      if (_this.listens.indexOf(l) === -1) {
        _this.callMap[l] = [name];
      } else {
        _this.callMap[l].push(name);
      }

      return l;
    });
    _this.reducers[name] = reducer;
    reducer.notifyOnChange(_this);
    _this.initial[name] = _objectSpread({}, _this.initial[name], {}, reducer());
  };

  func.onUpdate = function () {
    rebuildMap();
  };

  return func;
};

var _default = RootReducer;
exports["default"] = _default;