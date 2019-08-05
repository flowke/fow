"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = replace;

var _get = _interopRequireDefault(require("./get"));

var _set = _interopRequireDefault(require("./set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function replace(obj, path, modifier) {
  var ctx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (!path.length) return modifier(obj, ctx);
  if (!obj) return modifier(obj);
  path = path.slice();
  var node = path.shift();

  if (typeof node === 'function') {
    return obj.map(function (item, indx) {
      if (node(item, indx)) {
        return replace(item, path, modifier, {
          indx: indx
        });
      }

      return item;
    });
  }

  if (typeof node === 'string') {
    var rut = replace((0, _get["default"])(obj, node), path, modifier);
    (0, _set["default"])(obj, node, rut);
    return obj;
  }
}