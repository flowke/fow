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
    });
  }

  // listeners
  l(type){
    return this.listeners(type);
  }

  rowl(type){
    return this.rawListeners(type)
  }

  baseOn(type, msg, fn){
    if (typeof msg === 'function') {
      fn = msg;
      msg = ''
    }

    this.on(type, (...args) => {
      // return fn(...args);
      try {
        return {
          value: fn.call(undefined, ...args),
          error: null
        }
      } catch (error) {
        this.emit('error', new Error(`Hook-Error: ${msg}\n message: ${error.message}`))
        return {
          error
        }
      }
    });
  }

  onCall(msg, fn){
    
    this.baseOn('onCall', msg, fn)
  }

  call(...args) {
    this.emit('onCall', ...args);
  };

  onAsync(msg, fn) {
    this.baseOn('onAsync', msg, fn)
  }

  // 异步并行执行
  asyncParallelCall(...args){
    let l = this.l('onAsync');

    l = l.map(fn=>{
      return createFnPromise(fn,...args)
    });

    return Promise.all(l);

  }

  // 异步串行执行
  asyncSeriesCall(...args){
    let l = this.l('onAsync');

    return l.reduce((acc, fn)=>{
      return acc.then(res=>{
        return fn(...args);
      })
      .catch(err=>{
        return err
      })

    }, Promise.resolve())

  }

  promiseCall(){

  }

}

function call(name, args){
  return new Hook(name, args);
}

function createFnPromise(fn, ...args) {
  return new Promise((rv, rj) => {
    let done = (err,value) => {
      if (!err) {
        rv({
          error: err,
          value
        });
      }
      rv({
        error: err
      })
    }

    let out = fn(...args, done);

    if(out.error){
      rv({
        error: out.error
      });
    } else if (Object.prototype.toString.call(out.value) === '[object Promise]') {
      out.value
        .then(res => rv({
          value: res
        }))
        .catch(err => rv({
          error: err
        }))
    }

  })
}

exports.Hook = Hook;

