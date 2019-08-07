"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = toArr;

// resolve object's values, keys
function toArr(obj) {
  var val = {
    keys: [],
    values: [],
    raw: obj
  };

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var elt = obj[key];
      val.keys.push(key);
      val.values.push(elt);
    }
  }

  return val;
}