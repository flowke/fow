"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _default(obj, path, value) {
  var name = path.split(".");

  for (var i = 0; i < name.length - 1; i++) {
    if (_typeof(obj[name[i]]) !== "object" && obj[name[i]] !== undefined) return;
    if (Array.isArray(obj[name[i]])) return;
    if (!obj[name[i]]) obj[name[i]] = {};
    obj = obj[name[i]];
  }

  obj[name.pop()] = value;
}

;