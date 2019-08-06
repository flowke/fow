// debounce with interval
// and execute after interval at last time call
export default function debounceExec(interval, cb) {

  let timer = null;

  return (...rest) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...rest);
    }, interval);
  }
}