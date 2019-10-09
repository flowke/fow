const { EventEmitter } = require('events');
const {ordered} = require('@fow/visitor');

module.exports = class Hooks{
  constructor(){
    this.hooks = {}
  } 

  setHooks(obj={}){
    for (const name in obj) {
      let val = obj[name]
      this.hooks[name] = call(name, val);
    }
    return this
  }

}

class Hook extends EventEmitter{
  constructor(name){
    super();
    this.name = name;
    this.setMaxListeners(0);
    this.on('error', e=>{
      process.emitWarning(e.message)
    });
  }

  // listeners
  l(){
    return this.listeners(this.name);
  }

  rowl(){
    return this.rawListeners(this.name)
  }

  onCall(msg, fn){
    // this.on(this.name, fn)
    this.on(this.name, (...args)=>{
      // return fn(...args);
      try {
        return fn.call(undefined, ...args)
      } catch (error) {
        this.emit('error', new Error(`Error: ${msg}\n ${error.message}`))
      }
      
    });
  }

  onAsync(msg, fn) {
    this.onCall(msg, fn);
  }

  call(...args){
    this.emit(this.name,...args);
  };

  asyncParallelCall(...args){
    let l = this.l();

    return ordered(l, { parallel: true}, ...args);

  }
  asyncSeriesCall(...args){
    let l = this.l();

    return ordered(l, { parallel: false}, ...args);

  }

  promiseCall(){

  }

 


}

function call(name, args){
  return new Hook(name, args);
}