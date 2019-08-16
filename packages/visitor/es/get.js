function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

export default function (obj, path) {
  if (_typeof(obj) !== 'object') return;
  var name = path.split(".");

  for (var i = 0; i < name.length - 1; i++) {
    obj = obj[name[i]];
    if (_typeof(obj) !== "object" || !obj || Array.isArray(obj)) return;
  }

  return obj[name.pop()];
}
;