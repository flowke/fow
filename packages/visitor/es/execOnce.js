export default function execOnce(fn) {
  var isExecd = false;
  return function () {
    if (!isExecd) {
      isExecd = true;
      fn.apply(void 0, arguments);
    }
  };
}