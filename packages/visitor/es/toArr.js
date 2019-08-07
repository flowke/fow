// resolve object's values, keys
export default function toArr(obj) {
  var val = {
    keys: [],
    values: [],
    raw: obj
  };

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var elt = obj[key];
      val.keys.push(key);
      val.values.push(elt);
    }
  }

  return val;
}