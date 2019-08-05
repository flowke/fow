function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

// value: value you test
// type: string, boolean, null .....
//   incoming types would like some of it valid, it valid.
export function isTypes(val) {
  for (var _len = arguments.length, tps = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    tps[_key - 1] = arguments[_key];
  }

  tps = tps.reduce(function (acc, val) {
    return acc.concat(val);
  }, []);

  for (var i = 0, l = tps.length; i < l; i++) {
    if (isType(val, tps[i])) return true;
  }

  return false;
} // 判断数据类型或 实例

export function isType(val, type) {
  if (typeof type === 'string') {
    return getType(val) === type;
  } else {
    return val instanceof type;
  }
} // 

export function getType(val) {
  var typeStr = _typeof(val);

  if (typeStr !== 'object') {
    return typeStr;
  } else {
    var str = Object.prototype.toString.call(val);
    return str.slice(8, -1).toLowerCase();
  }
}

function createIss(type) {
  return function () {
    return eachArgs(arguments, function (value) {
      return isType(value, type);
    });
  };
}

function createIs(type) {
  return function (value) {
    return isType(value, type);
  };
}

export var isStrings = createIss('string');
export var isString = createIs('string');
export var isNumbers = createIss('number');
export var isNumber = createIs('number');
export var isSymbols = createIss('symbol');
export var isSymbol = createIs('symbol');
export var isBools = createIss('boolean');
export var isBool = createIs('boolean');
export var isBooleans = isBools;
export var isBoolean = isBool;
export var isUndefineds = createIss('undefined');
export var isUndefined = createIs('undefined');
export var isNulls = createIss('null');
export var isNull = createIs('null');
export var isFunctions = createIss('function');
export var isFunction = createIs('function');
export var isObjects = createIss('object');
export var isObject = createIs('object');

var _isArray = function isArray(arg) {
  if (!Array.isArray) {
    _isArray = (_readOnlyError("isArray"), function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    });
  } else {
    _isArray = (_readOnlyError("isArray"), function (arg) {
      return Array.isArray(arg);
    });
  }

  return _isArray(arg);
};

export { _isArray as isArray };
export var isArrays = function isArrays() {
  return eachArgs(arguments, function (value) {
    return _isArray(value);
  });
}; // 遍历 args, 每个参数可以是数组或其他值

function eachArgs(argsObj, cb) {
  return eachone(argsObj, function (val) {
    var thisOne;

    if (_isArray(val)) {
      thisOne = eachone(val, function (val) {
        return cb(val);
      });
    } else {
      thisOne = cb(val);
    }

    if (thisOne === false) {
      return false;
    }
  });
}

function eachone(arr, cb) {
  for (var i = 0, l = arr.length; i < l; i++) {
    if (cb(arr[i]) === false) {
      return false;
    }
  }

  return true;
}