

const getProperty = (obj, path) => {
  let name = path.split(".");
  for (let i = 0; i < name.length - 1; i++) {
    obj = obj[name[i]];
    if (typeof obj !== "object" || !obj || Array.isArray(obj)) return;
  }
  return obj[name.pop()];
};

const setProperty = (obj, path, value) => {
  let name = path.split(".");
  for (let i = 0; i < name.length - 1; i++) {
    if (typeof obj[name[i]] !== "object" && obj[name[i]] !== undefined) return;
    if (Array.isArray(obj[name[i]])) return;
    if (!obj[name[i]]) obj[name[i]] = {};
    obj = obj[name[i]];
  }
  obj[name.pop()] = value;
};

export function replace(obj, path, cb, ctx={}){

  if(!path.length) return cb(obj, ctx);
  if(!obj) return cb(obj);


  path = path.slice();
  let node = path.shift();


  if (typeof node === 'function') {
    return obj.map((item, indx) => {
      if (node(item, indx)) {
        return replace(item, path, cb, {indx})
      }
      return item
    })
  }
  
  if (typeof node === 'string') {
    let rut = replace(getProperty(obj, node), path, cb);

    setProperty(obj, node, rut);
    
    return obj
  }

}
