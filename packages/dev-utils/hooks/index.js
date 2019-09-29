const { EventEmitter } = require('events');

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
    })
  }

  onCall(msg, fn){
    this.on(this.name, (...args)=>{
      try {
        fn.call(undefined, ...args)
      } catch (error) {
        this.emit('error', new Error(`Error: ${msg}\n ${error.message}`))
      }
      
    });
  }

  call(...args){
    this.emit(this.name,...args);
  };

  asyncCall(){

  }

  promiseCall(){

  }

  onAsync(){

  }

  onPromise(){

  }
  
}

function call(name, args){
  return new Hook(name, args);
}