"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = debounceExec;

// debounce with interval
// and execute after interval at last time call
function debounceExec(interval, cb) {
  var timer = null;
  return function () {
    for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }

    clearTimeout(timer);
    timer = setTimeout(function () {
      cb.apply(void 0, rest);
    }, interval);
  };
}