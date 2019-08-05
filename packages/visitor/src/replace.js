import getProperty from './get';
import setProperty from './set';

export default function replace(obj, path, modifier, ctx = {}) {

  if (!path.length) return modifier(obj, ctx);
  if (!obj) return modifier(obj);

  path = path.slice();
  let node = path.shift();

  if (typeof node === 'function') {
    return obj.map((item, indx) => {
      if (node(item, indx)) {
        return replace(item, path, modifier, { indx })
      }
      return item
    })
  }

  if (typeof node === 'string') {
    let rut = replace(getProperty(obj, node), path, modifier);
    setProperty(obj, node, rut);

    return obj
  }

}
