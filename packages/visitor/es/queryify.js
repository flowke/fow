function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

export default function ify(data) {
  if (!data || _typeof(data) !== 'object') return '';

  ify.detail = function (f) {
    return f;
  };

  var arr = [];

  try {
    for (var key in data) {
      var val = JSON.stringify(data[key]);
      arr.push("".concat(key, "=").concat(val));
    }

    return arr.join('&');
  } catch (error) {
    ify.detail = function () {
      ify.detail = function (f) {
        return f;
      };

      return error;
    };

    return '';
  }
}