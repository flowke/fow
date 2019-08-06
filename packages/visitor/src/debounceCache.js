// debounce with interval
// return value immediately and will cache value during interval
// cb accept : 
//  fresh: boolean : should return fresh value


// cache the first timer value
export default function debounceCache(interval, cb) {

  let cacheVal = undefined;

  let timerRunning = false;

  return (...rest) => {

    if (!timerRunning) {
      timerRunning = true;
      setTimeout(() => {
        timerRunning = false;
      }, interval);

      cacheVal = cb(...rest);
      return cacheVal;
    } else {
      return cacheVal
    }

  }
}