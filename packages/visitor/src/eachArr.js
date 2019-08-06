
export default function eachArr(array, cb){

  let ctx = {};
  for (let index = 0, l = array.length; index <l; index++) {
    let value = array[index];

    let out = cb(value, index, array);
    if (typeof out === 'object' && out !== null) {
      ctx = out;
    }else{
      ctx = {}
    }

    ctx.index = index
    ctx.value = value
    
    if (ctx.done) return ctx;
  }

  return ctx
}