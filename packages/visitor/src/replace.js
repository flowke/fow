import getProperty from './get';
import setProperty from './set';

export default function replace(obj, path, modifier, ctx = {}) {
  ctx.value = obj;
  ctx.path = path;
  if (!path.length) return modifier(obj,ctx);
  if (!obj) return modifier(obj, ctx);

  path = path.slice();
  let node = path.shift();
  // console.log(obj, node, path);
  
  
  if (typeof node === 'function') {
    return obj.map((item, indx) => {
      if (node(item, indx)) {
        ctx.index = indx
        return replace(item, path, modifier, ctx)
      }
      return item
    })
  }

  if (typeof node === 'string') {
    
    let rut = replace(getProperty(obj, node), path, modifier, ctx);
    setProperty(obj, node, rut);

    return obj
  }

}
