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
  return new Value().generate(obj);
}

var Value =
/*#__PURE__*/
function () {
  function Value() {
    _classCallCheck(this, Value);

    this.keys = [];
    this.values = [];
    this.entries = [];
  }

  _createClass(Value, [{
    key: "generate",
    value: function generate() {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (var key in obj) {
        var elt = obj[key];
        this.keys.push(key);
        this.values.push(elt);
        this.arr.push([key, elt]);
      }

      return this;
    }
  }, {
    key: "forEach",
    value: function forEach(fn) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'entries';
      var arr = this[type];

      for (var index = 0; index < arr.length; index++) {
        var e = arr[index];
        if (fn(e[0], e[1], i) === false) return false;
      }

      return true;
    }
  }, {
    key: "reduce",
    value: function reduce(fn, init) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'entries';
      this[type].reduce(function (accu, e, i) {
        return fn(accu, e[0], e[1], i);
      }, init);
    }
  }]);

  return Value;
}();