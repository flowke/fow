// resolve promise by ordered
// array<fn(return promise)>
// op
//  paraller: is run promise paraller
//  
export default function ordered(arr, op = {}, ...args) {
  let { parallel, beforeEach, afterEach, waitingEach } = op;

  let p = Promise.resolve(true);

  if (parallel) {
    arr = arr.map(fn => {

      let out = fn(...args)
      beforeEach && beforeEach(out.__info)
      return () => out
    })
  }

  return arr.reduce((acc, fn) => {

    return acc.then(() => {
      let out = fn(...args);
      if (!parallel) {
        beforeEach && beforeEach(out.__info)
      }
      waitingEach && waitingEach(out.__info)
      return out
    })
      .then(res => {
        afterEach && afterEach(res)
        return res
      })
  }, p)

}