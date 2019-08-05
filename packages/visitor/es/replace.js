import getProperty from './get';
import setProperty from './set';
export default function replace(obj, path, modifier) {
  var ctx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (!path.length) return modifier(obj, ctx);
  if (!obj) return modifier(obj);
  path = path.slice();
  var node = path.shift();

  if (typeof node === 'function') {
    return obj.map(function (item, indx) {
      if (node(item, indx)) {
        return replace(item, path, modifier, {
          indx: indx
        });
      }

      return item;
    });
  }

  if (typeof node === 'string') {
    var rut = replace(getProperty(obj, node), path, modifier);
    setProperty(obj, node, rut);
    return obj;
  }
}