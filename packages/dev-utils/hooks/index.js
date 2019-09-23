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
  }

}

class Hook extends EventEmitter{
  constructor(name){
    this.name = name;
  }

  call(){
    this.emit(this.name);
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
  return new Event(name, args);
}