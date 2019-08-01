"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replace = replace;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var getProperty = function getProperty(obj, path) {
  var name = path.split(".");

  for (var i = 0; i < name.length - 1; i++) {
    obj = obj[name[i]];
    if (_typeof(obj) !== "object" || !obj || Array.isArray(obj)) return;
  }

  return obj[name.pop()];
};

var setProperty = function setProperty(obj, path, value) {
  var name = path.split(".");

  for (var i = 0; i < name.length - 1; i++) {
    if (_typeof(obj[name[i]]) !== "object" && obj[name[i]] !== undefined) return;
    if (Array.isArray(obj[name[i]])) return;
    if (!obj[name[i]]) obj[name[i]] = {};
    obj = obj[name[i]];
  }

  obj[name.pop()] = value;
};

function replace(obj, path, cb) {
  var ctx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (!path.length) return cb(obj, ctx);
  if (!obj) return cb(obj);
  path = path.slice();
  var node = path.shift();

  if (typeof node === 'function') {
    return obj.map(function (item, indx) {
      if (node(item, indx)) {
        return replace(item, path, cb, {
          indx: indx
        });
      }

      return item;
    });
  }

  if (typeof node === 'string') {
    var rut = replace(getProperty(obj, node), path, cb);
    setProperty(obj, node, rut);
    return obj;
  }
}