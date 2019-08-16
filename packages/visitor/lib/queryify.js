"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ify;

var _type = _interopRequireDefault(require("./type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ify(data) {
  if (!data || _typeof(data) !== 'object') return '';

  ify.detail = function (f) {
    return f;
  };

  var arr = [];

  try {
    for (var key in data) {
      var val = JSON.stringify(data[key]);
      arr.push("".concat(key, "=").concat(val));
    }

    return arr.join('&');
  } catch (error) {
    ify.detail = function () {
      ify.detail = function (f) {
        return f;
      };

      return error;
    };

    return '';
  }
}