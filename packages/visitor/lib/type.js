"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTypes = isTypes;
exports.isType = isType;
exports.getType = getType;
exports.isArrays = exports.isArray = exports.isObject = exports.isObjects = exports.isFunction = exports.isFunctions = exports.isNull = exports.isNulls = exports.isUndefined = exports.isUndefineds = exports.isBoolean = exports.isBooleans = exports.isBool = exports.isBools = exports.isSymbol = exports.isSymbols = exports.isNumber = exports.isNumbers = exports.isString = exports.isStrings = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

// value: value you test
// type: string, boolean, null .....
//   incoming types would like some of it valid, it valid.
function isTypes(val) {
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


function isType(val, type) {
  if (typeof type === 'string') {
    return getType(val) === type;
  } else {
    return val instanceof type;
  }
} // 


function getType(val) {
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

var isStrings = createIss('string');
exports.isStrings = isStrings;
var isString = createIs('string');
exports.isString = isString;
var isNumbers = createIss('number');
exports.isNumbers = isNumbers;
var isNumber = createIs('number');
exports.isNumber = isNumber;
var isSymbols = createIss('symbol');
exports.isSymbols = isSymbols;
var isSymbol = createIs('symbol');
exports.isSymbol = isSymbol;
var isBools = createIss('boolean');
exports.isBools = isBools;
var isBool = createIs('boolean');
exports.isBool = isBool;
var isBooleans = isBools;
exports.isBooleans = isBooleans;
var isBoolean = isBool;
exports.isBoolean = isBoolean;
var isUndefineds = createIss('undefined');
exports.isUndefineds = isUndefineds;
var isUndefined = createIs('undefined');
exports.isUndefined = isUndefined;
var isNulls = createIss('null');
exports.isNulls = isNulls;
var isNull = createIs('null');
exports.isNull = isNull;
var isFunctions = createIss('function');
exports.isFunctions = isFunctions;
var isFunction = createIs('function');
exports.isFunction = isFunction;
var isObjects = createIss('object');
exports.isObjects = isObjects;
var isObject = createIs('object');
exports.isObject = isObject;

var _isArray = function isArray(arg) {
  if (!Array.isArray) {
    exports.isArray = _isArray = (_readOnlyError("isArray"), function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    });
  } else {
    exports.isArray = _isArray = (_readOnlyError("isArray"), function (arg) {
      return Array.isArray(arg);
    });
  }

  return _isArray(arg);
};

exports.isArray = _isArray;

var isArrays = function isArrays() {
  return eachArgs(arguments, function (value) {
    return _isArray(value);
  });
}; // 遍历 args, 每个参数可以是数组或其他值


exports.isArrays = isArrays;

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