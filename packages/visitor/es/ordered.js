// resolve promise by ordered
// array<fn(return promise)>
// op
//  paraller: is run promise paraller
//  
export default function ordered(arr) {
  var op = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var parallel = op.parallel,
      beforeEach = op.beforeEach,
      afterEach = op.afterEach,
      waitingEach = op.waitingEach;
  var p = Promise.resolve(true);

  if (parallel) {
    arr = arr.map(function (fn) {
      var out = fn();
      beforeEach && beforeEach(out.info);
      return function () {
        return out;
      };
    });
  }

  return arr.reduce(function (acc, fn) {
    return acc.then(function () {
      var out = fn();

      if (!parallel) {
        beforeEach && beforeEach(out.info);
      }

      waitingEach && waitingEach(out.info);
      return out;
    }).then(function (res) {
      afterEach && afterEach(res);
      return res;
    });
  }, p);
}