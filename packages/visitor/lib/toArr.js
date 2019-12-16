"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = toArr;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// resolve object's values, keys
function toArr(obj) {
  var generate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var v = new Value(obj);
  if (generate) v.generate();
  return v;
}

var Value =
/*#__PURE__*/
function () {
  function Value() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Value);

    this.__rowValue = obj;
    this.__hasGenerate = false;
    this.keys = [];
    this.values = [];
    this.entries = [];
  }

  _createClass(Value, [{
    key: "get",
    value: function get() {
      if (!this.__hasGenerate) this.generate();
      return this;
    }
  }, {
    key: "generate",
    value: function generate(fn) {
      var _this = this;

      eachObj(this.__rowValue, function (key, value, i) {
        _this.keys.push(key);

        _this.values.push(value);

        _this.entries.push([key, value]);

        fn && fn(key, value, i);
      });
      this.__hasGenerate = true;
      return this;
    }
  }, {
    key: "forEach",
    value: function forEach(fn) {
      var result = true;

      if (this.__hasGenerate) {
        retult = eachArr(this.entries, function (e, i) {
          return fn(e[0], e[1], i);
        });
      } else {
        var hasFalse = false;
        this.generate(function (key, elt, i) {
          if (hasFalse) result = false;
          hasFalse = fn(key, elt, i);
        });
      }

      return result;
    }
  }, {
    key: "reduce",
    value: function reduce(fn, init) {
      if (!this.__hasGenerate) {
        var value = init;
        this.generate(function (key, val, i) {
          value = fn(key, val, i);
        });
        return value;
      } else {
        return this.entries.reduce(function (accu, e, i) {
          return fn(accu, e[0], e[1], i);
        }, init);
      }
    }
  }]);

  return Value;
}();

function eachObj(obj, fn) {
  var i = 0;

  for (var key in obj) {
    var rut = fn(key, obj[key], i);
    if (rut === false) return false;
    i++;
  }

  return true;
}

function eachArr(arr, fn) {
  for (var index = 0; index < arr.length; index++) {
    var e = arr[index];
    if (fn(e, i) === false) return false;
  }

  return true;
}