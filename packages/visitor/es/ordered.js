// resolve promise by ordered
// array<fn(return promise)>
// op
//  paraller: is run promise paraller
//  
export default function ordered(arr) {
  var op = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var parallel = op.parallel,
      beforeEach = op.beforeEach,
      afterEach = op.afterEach,
      waitingEach = op.waitingEach;
  var p = Promise.resolve(true);

  if (parallel) {
    arr = arr.map(function (fn) {
      var out = fn.apply(void 0, args);
      beforeEach && beforeEach(out.__info);
      return function () {
        return out;
      };
    });
  }

  return arr.reduce(function (acc, fn) {
    return acc.then(function () {
      var out = fn.apply(void 0, args);

      if (!parallel) {
        beforeEach && beforeEach(out.__info);
      }

      waitingEach && waitingEach(out.__info);
      return out;
    }).then(function (res) {
      afterEach && afterEach(res);
      return res;
    });
  }, p);
}