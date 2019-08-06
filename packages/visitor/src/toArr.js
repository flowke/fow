// resolve object's values, keys
export default function toArr(obj) {
  let val = {
    keys: [],
    values: [],
    raw: obj
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const elt = obj[key];
      val.keys.push(key);
      val.values.push(elt);
    }
  }
  return val;
}