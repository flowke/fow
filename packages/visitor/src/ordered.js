// resolve promise by ordered
// array<fn(return promise)>
// op
//  paraller: is run promise paraller
//  
export default function ordered(arr, op = {}) {
  let { parallel, beforeEach, afterEach, waitingEach } = op;

  let p = Promise.resolve(true);

  if (parallel) {
    arr = arr.map(fn => {

      let out = fn()
      beforeEach && beforeEach(out.info)
      return () => out
    })
  }

  return arr.reduce((acc, fn) => {

    return acc.then(() => {
      let out = fn();
      if (!parallel) {
        beforeEach && beforeEach(out.info)
      }
      waitingEach && waitingEach(out.info)
      return out
    })
      .then(res => {
        afterEach && afterEach(res)
        return res
      })
  }, p)

}