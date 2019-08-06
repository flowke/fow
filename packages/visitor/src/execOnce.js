export default function execOnce(fn) {

  let isExecd = false;

  return function (...rest) {
    if (!isExecd) {
      isExecd = true

      fn(...rest)
    }
  }
}