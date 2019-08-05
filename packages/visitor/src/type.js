
// value: value you test
// type: string, boolean, null .....
//   incoming types would like some of it valid, it valid.
export function isTypes(val, ...tps) {
  tps = tps.reduce(function (acc, val) {
    return acc.concat(val)
  }, []);

  for(let i =0, l=tps.length; i<l;i++){
    if (isType(val, tps[i])) return true
  }
  return false
}

// 判断数据类型或 实例
export function isType(val, type) {

  if(typeof type === 'string'){
    return getType(val) === type
  }else{
    return val instanceof type
  }

}

// 
export function getType(val) {
  let typeStr = typeof val;

  if (typeStr !== 'object'){
    return typeStr
  }else{
    let str = Object.prototype.toString.call(val);
    return str.slice(8, -1).toLowerCase();
  }
}


function createIss(type){
  return function(){
    return eachArgs(arguments, function (value) {
      return isType(value, type)
    })
  }
}

function createIs(type){
  return function(value){
    return isType(value, type)
  }
}

export const isStrings = createIss('string');
export const isString = createIs('string');

export const isNumbers = createIss('number');
export const isNumber = createIs('number');

export const isSymbols = createIss('symbol');
export const isSymbol = createIs('symbol');

export const isBools = createIss('boolean');
export const isBool = createIs('boolean');

export const isBooleans = isBools;
export const isBoolean = isBool;

export const isUndefineds = createIss('undefined');
export const isUndefined = createIs('undefined');

export const isNulls = createIss('null');
export const isNull = createIs('null');

export const isFunctions = createIss('function');
export const isFunction = createIs('function');

export const isObjects = createIss('object');
export const isObject = createIs('object');

export const isArray = function(arg) {
  if (!Array.isArray) {
    isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  } else {
    isArray = function (arg) {
      return Array.isArray(arg)
    }
  }
  return isArray(arg)
}


export const isArrays = function () {
  return eachArgs(arguments, function (value) {
    return isArray(value)
  })
};


// 遍历 args, 每个参数可以是数组或其他值
function eachArgs(argsObj, cb){

  return eachone(argsObj, function(val){
    let thisOne;
    if (isArray(val)) {
      thisOne = eachone(val, function(val){
        return cb(val)
      })
    } else {
      thisOne = cb(val)
    }
    if (thisOne === false) {
      return false
    }
  })
}

function eachone(arr, cb){
  for (let i = 0, l = arr.length; i < l; i++) {
    if (cb(arr[i])===false){
      return false
    }
  }
  return true
}
