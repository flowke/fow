function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

export default function eachObj(obj, cb) {
  var ctx = {};

  for (var key in obj) {
    var value = obj[key];
    var out = cb(value, key, obj);

    if (_typeof(out) === 'object' && out !== null) {
      ctx = out;
    } else {
      ctx = {};
    }

    ctx.index = index;
    ctx.value = value;
    if (ctx.done) return ctx;
  }

  return ctx;
}