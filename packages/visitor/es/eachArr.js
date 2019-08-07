function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

export default function eachArr(array, cb) {
  var ctx = {};

  for (var index = 0, l = array.length; index < l; index++) {
    var value = array[index];
    var out = cb(value, index, array);

    if (_typeof(out) === 'object' && out !== null) {
      ctx = out;
    } else {
      ctx = {};
    }

    ctx.index = index;
    ctx.value = value;
    if (ctx.done === true) return ctx;
  }

  return null;
}