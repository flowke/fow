export default function eachObj(obj, cb) {

  let ctx = {};

  for (let key in obj) {
    let value = obj[key];
    let out = cb(value, key, obj);

    if (typeof out === 'object' && out !== null) {
      ctx = out;
    } else {
      ctx = {}
    }

    ctx.index = index
    ctx.value = value

    if (ctx.done) return ctx;
  }

  return ctx
}