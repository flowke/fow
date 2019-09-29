export default function execOnce(fn) {
  var isExecd = false;
  return function () {
    if (!isExecd) {
      isExecd = true;

      for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
        rest[_key] = arguments[_key];
      }

      fn.call.apply(fn, [this].concat(rest));
    }
  };
}