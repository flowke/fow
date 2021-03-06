"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = debounceCache;

// debounce with interval
// return value immediately and will cache value during interval
// cb accept : 
//  fresh: boolean : should return fresh value
// cache the first timer value
function debounceCache(interval, cb) {
  var cacheVal = undefined;
  var timerRunning = false;
  return function () {
    if (!timerRunning) {
      timerRunning = true;
      setTimeout(function () {
        timerRunning = false;
      }, interval);
      cacheVal = cb.apply(void 0, arguments);
      return cacheVal;
    } else {
      return cacheVal;
    }
  };
}