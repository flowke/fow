"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "replace", {
  enumerable: true,
  get: function get() {
    return _replace["default"];
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function get() {
    return _set["default"];
  }
});
Object.defineProperty(exports, "get", {
  enumerable: true,
  get: function get() {
    return _get["default"];
  }
});
exports.type = void 0;

var type = _interopRequireWildcard(require("./type"));

exports.type = type;

var _replace = _interopRequireDefault(require("./replace"));

var _set = _interopRequireDefault(require("./set"));

var _get = _interopRequireDefault(require("./get"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }