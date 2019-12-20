function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import createErr from './MsgError';
import Hook from './hooks';

var Hooks =
/*#__PURE__*/
function (_Hook) {
  _inherits(Hooks, _Hook);

  function Hooks() {
    var _this;

    _classCallCheck(this, Hooks);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Hooks).call(this));
    if (window._errorHooks) return _possibleConstructorReturn(_this, window._errorHooks);
    window._errorHooks = _assertThisInitialized(_this);

    if (window._errorUncatchEvents) {
      window.removeEventListener('error', window._errorUncatchEvents.push, true);
      window.removeEventListener('unhandledrejection', window._errorUncatchEvents.push);
      _this.errorUncatchEvents = window._errorUncatchEvents.slice();
      window._errorUncatchEvents = undefined;
    }

    _this.errorTypes = {};

    _this.initErrorCatch();

    var self = _assertThisInitialized(_this);

    _this.vuePlugin = {
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

          var logErr = function logErr() {
            console.error(err);
          };

          self.dispatchWithCtx({
            error: err,
            "catch": function _catch(fn) {
              logErr = function logErr(f) {
                return f;
              };

              fn && fn(err);
            }
          }, 'E');
          logErr();
        };
      }
    };
    return _this;
  }

  _createClass(Hooks, [{
    key: "initErrorCatch",
    value: function initErrorCatch() {
      var _this2 = this;

      window.addEventListener('error', function (ev) {
        _this2.dispatchWithEvent(ev);
      }, true);
      window.addEventListener('unhandledrejection', function (ev) {
        _this2.dispatchWithEvent(ev);
      });
    }
  }, {
    key: "getDispatchInfoWithCtxTag",
    value: function getDispatchInfoWithCtxTag(ctx, errType) {
      var promise = ctx.promise,
          error = ctx.error,
          target = ctx.target,
          catchError = ctx["catch"];
      var evCtx = null;
      var errName = null;

      switch (errType) {
        case 'ETag':
        case 'Etag':
          {
            if (target && target.tagName) {
              errName = String(target.tagName).toUpperCase();
              evCtx = {
                target: target,
                "catch": catchError
              };
            }

            break;
          }

        case 'E':
          {
            if (type(error, 'Error')) {
              errName = error.name;
              if (isBiError(errName)) errName = 'Error';
              evCtx = {
                error: error,
                promise: promise,
                payload: error.payload,
                "catch": catchError
              };
            }

            break;
          }
      }

      if (evCtx && errType && errName) {
        if (this.listeners[errType + ':' + errName]) {
          return [errType + ':' + errName, evCtx];
        }
      }
    }
  }, {
    key: "getDispatchInfoWithEvent",
    value: function getDispatchInfoWithEvent(ev) {
      var error = ev.error,
          target = ev.target,
          promise = ev.promise,
          reason = ev.reason;

      var evCatch = function evCatch(fn) {
        ev.preventDefault();
        type(fn, 'Function') && fn(error);
      };

      var ctx = {
        "catch": evCatch,
        promise: promise
      };
      var tag = '';

      if (target && target.nodeType === Node.ELEMENT_NODE) {
        ctx.target = target;
        tag = 'ETag';
      } else if (type(error, 'Error')) {
        ctx.error = error;
        tag = 'E';
      } else if (!type(error, 'Error')) {
        ctx.error = new Error('Not standard Error, more information in Error.payload');
        ctx.error.payload = error;
        tag = 'E';
      } else if (type(reason, 'Error')) {
        ctx.error = reason;
        tag = 'E';
      } else if (!type(reason, 'Error')) {
        ctx.error = new Error('Not standard Error, more information in Error.payload');
        ctx.error.payload = reason;
        tag = 'E';
      }

      if (tag) {
        return this.getDispatchInfoWithCtxTag(ctx, tag);
      }
    }
  }, {
    key: "dispatchWithEvent",
    value: function dispatchWithEvent(ev) {
      var info = this.getDispatchInfoWithEvent(ev);
      if (info) this.dispatch.apply(this, info);
    }
  }, {
    key: "dispatchWithCtx",
    value: function dispatchWithCtx(ctx, type) {
      var info = this.getDispatchInfoWithCtxTag(ctx, type);
      if (info) this.dispatch.apply(this, info);
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(type, callback) {
      var _this3 = this;

      _get(_getPrototypeOf(Hooks.prototype), "addEventListener", this).call(this, type, callback);

      if (this.errorUncatchEvents) {
        this.errorUncatchEvents.forEach(function (ev) {
          var info = _this3.getDispatchInfoWithEvent(ev);

          if (info && info[0] === type) {
            callback(info[1]);
          }
        });
      }
    }
  }, {
    key: "register",
    value: function register(HooksObj) {
      var _this4 = this;

      var is = type;
      if (!is(HooksObj, 'Object')) return;

      var _loop = function _loop(_type) {
        var arr = _type.split(':');

        var cb = HooksObj[_type];
        if (!is(cb, 'Function')) return "continue";

        _this4.addEventListener(_type, function (ev) {
          cb.call(null, ev);
        });

        if (arr.length == 2 && arr[0] === 'E' && arr[1].length) {
          _this4.errorTypes[arr[1]] = createErr(arr[1]);
          Error[arr[1]] = _this4.errorTypes[arr[1]];
        }
      };

      for (var _type in HooksObj) {
        var _ret = _loop(_type);

        if (_ret === "continue") continue;
      }
    }
  }, {
    key: "add",
    get: function get() {
      return this.addEventListener;
    }
  }]);

  return Hooks;
}(Hook);

function type(val, str) {
  return Object.prototype.toString.call(val).toLowerCase() === "[object ".concat(str, "]").toLowerCase();
} // is builtin error


function isBiError(name) {
  return ['Error', 'EvalError', 'InternalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'URIError'].indexOf(name) !== -1;
}

function isErrorTag(name) {
  return ['IMG', 'SCRIPT', 'LINK'].indexOf(name) !== -1;
}

export default new Hooks();