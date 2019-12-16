function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import createErr from './MsgError';
import Hook from './hooks';
var hook = null;
var vuePlugin = {
  install: function install(Vue) {
    var old = null;

    if (type(Vue.config.errorHandler, 'function')) {
      old = Vue.config.errorHandler;
    }

    Vue.config.errorHandler = function (err, vm, info) {
      try {
        if (old) old(err, vm, info);
      } catch (error) {
        console.error(error);
      }

      throw err;
    };
  }
};

var Hooks =
/*#__PURE__*/
function (_Hook) {
  _inherits(Hooks, _Hook);

  function Hooks() {
    var _this;

    _classCallCheck(this, Hooks);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Hooks).call(this));
    if (hook) return _possibleConstructorReturn(_this, hook);
    hook = _assertThisInitialized(_this);
    _this.errorTypes = {};

    _this.initErrorCatch();

    _this.vuePlugin = vuePlugin;
    return _this;
  }

  _createClass(Hooks, [{
    key: "initErrorCatch",
    value: function initErrorCatch() {
      var _this2 = this;

      function isBiError(name) {
        return !!['Error', 'EvalError', 'InternalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'URIError'].find(name);
      }

      window.addEventListener('error', function (ev) {
        var error = ev.error,
            target = ev.target;

        if (target && target.tagName) {
          var name = String(target.tagName).toUpperCase();

          if (_this2.listeners['ETag:' + name]) {
            _this2.dispatch('ETag:' + name, {
              target: target,
              "catch": function _catch(fn) {
                ev.preventDefault();
                type(fn, 'Function') && fn(error);
                return true;
              }
            });
          }

          return;
        }

        if (type(error, 'Object')) {
          var _name = error.name;
          if (isBiError(_name)) _name = 'Error';

          if (_this2.listeners['E:' + _name]) {
            _this2.dispatch('E:' + _name, {
              error: error,
              target: target,
              payload: error.payload,
              "catch": function _catch(fn) {
                ev.preventDefault();
                type(fn, 'Function') && fn(error);
                return true;
              }
            });
          }
        }
      });
      window.addEventListener('unhandledrejection', function (ev) {
        var promise = ev.promise,
            reason = ev.reason,
            target = ev.target;

        if (type(reason, 'Object')) {
          var name = reason.name;
          if (isBiError(reason.name)) name = 'Error';
          var nameType = 'E:' + name;

          if (_this2.listeners[nameType]) {
            _this2.dispatch(nameType, {
              error: reason,
              promise: promise,
              target: target,
              payload: reason.payload,
              "catch": function _catch(fn) {
                promise && promise["catch"](function (err) {
                  type(fn, 'Function') && fn(err);
                });
              }
            });
          }
        } else {
          if (_this2.listeners['E:unhandledrejection']) {
            _this2.dispatch('E:unhandledrejection', {
              error: new Error('unhandledrejection'),
              promise: promise,
              target: target,
              "catch": function _catch(fn) {
                promise && promise["catch"](function (err) {
                  type(fn, 'Function') && fn(err);
                });
              }
            });
          }
        }
      });
    }
  }, {
    key: "toErrorConxt",
    value: function toErrorConxt(type, error, promise, target) {
      var ctx = {
        error: error,
        promise: promise,
        target: target,
        payload: error ? error.payload : undefined
      };

      if (type === 'error') {
        ctx["catch"] = function (fn) {
          ev.preventDefault();
          type(fn, 'Function') && fn(error);
          return true;
        };
      } else if (type === 'promise') {
        ctx["catch"] = function (fn) {
          promise && promise["catch"](function (err) {
            type(fn, 'Function') && fn(err);
          });
        };
      }

      return ctx;
    }
  }, {
    key: "register",
    value: function register(HooksObj) {
      var _this3 = this;

      var is = typs;
      if (!is(HooksObj, 'Object')) return;

      var _loop = function _loop(_type) {
        var arr = _type.split(':');

        var cb = HooksObj[_type];
        if (is(cb, 'Function')) return {
          v: void 0
        };

        _this3.addEventListener(_type, function (ev) {
          cb.call(null, ev);
        });

        if (arr.lengt == 2 && arr[0] === 'E' && arr[1].length) {
          _this3.errorTypes[arr[1]] = createErr(arr[1]);
          Error[arr[1]] = _this3.errorTypes[arr[1]];
        }
      };

      for (var _type in HooksObj) {
        var _ret = _loop(_type);

        if (_typeof(_ret) === "object") return _ret.v;
      }
    }
  }]);

  return Hooks;
}(Hook);

function type(val, str) {
  return Object.prototype.toString.call(val).toLowerCase() === "[object ".concat(str, "]").toLowerCase();
}

export default new Hooks();