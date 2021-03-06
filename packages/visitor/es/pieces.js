import { getType } from './type'; // options 
// piect
// interval
// callback(acc, piece, raw)

export default function pieces(arr, options, callback) {
  var opType = getType(options);
  var cbType = getType(callback);
  var cb = null;

  if (opType === 'function') {
    cb = options;
  } else if (cbType === 'function') {
    cb = callback;
  } else {
    return;
  }

  var interval = 60,
      piece = 10;

  if (opType === 'object') {
    if (options.interval) interval = options.interval;
    if (options.piece) piece = options.piece;
  }

  render(0, piece);

  function render(begin, end) {
    if (end > arr.length) {
      end = arr.length;
    }

    cb(arr.slice(0, end), arr.slice(begin, end), arr);

    if (end < arr.length) {
      setTimeout(function () {
        render(end, end + piece);
      }, interval);
    }
  }
}