const inspect = require("util").inspect.custom;
let i =0;

setInterval(()=>{
  
  a()

},1000)

function a(){
  let bb = b();

  // bb.stack = 'fdsajk;'
  
  // throw bb
}
function b(){
  return c()
}
function c(){
  return new MyError()
}

class MyError extends Error {
  [inspect]() {
    console.log('stack');
    return 'fff'
    return this.stack + (this.details ? `\n${this.details}` : "");
  }
}