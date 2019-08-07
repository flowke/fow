"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = execOnce;

function execOnce(fn) {
  var isExecd = false;
  return function () {
    if (!isExecd) {
      isExecd = true;
      fn.apply(void 0, arguments);
    }
  };
}