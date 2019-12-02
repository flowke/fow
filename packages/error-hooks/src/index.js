import createErr from './MsgError';
import Hook from './hooks';

let hook = null;

let vuePlugin = {
  install(Vue){
    let old = null;
    if (type(Vue.config.errorHandler, 'function')){
      old = Vue.config.errorHandler;
    }
    Vue.config.errorHandler = function (err, vm, info) {

      try {
        if (old) old(err,vm, info)
      } catch (error) {
        console.error(error) 
      }

      throw err;
      
    }
  }
}

class Hooks extends Hook{
  constructor(){
    super()
    if(hook) return hook;
    hook = this;
    this.errorTypes = {};
    this.initErrorCatch();
    this.vuePlugin = vuePlugin
  }

  initErrorCatch(){


    window.addEventListener('error', (ev)=>{
      let {error} = ev;

      if (type(error, 'Object') && this.listeners['E'+error.name]){
        this.dispatch('E' + error.name, {
          error,
          payload: error.payload,
          catch: (fn) => {
            ev.preventDefault();
            type(fn, 'Function') && fn(error)
          }
        })
      }
    })
    window.addEventListener('unhandledrejection', (ev)=>{
      let { promise, reason} = ev;

      if(type(reason, 'Object')){
        let nameType = 'E:'+ reason.name;

        if (this.listeners[nameType]){
          this.dispatch(nameType, {
            error: reason,
            promise,
            payload: reason.payload,
            catch: (fn)=>{
              promise && promise.catch((err)=>{
                type(fn, 'Function') && fn(err)
              })
            }
          })
        }
      } else{
        if (this.listeners['E:unhandledrejection']){
          this.dispatch('E:unhandledrejection', {
            error: new Error('unhandledrejection'),
            promise,
            catch: (fn) => {
              promise && promise.catch((err) => {
                type(fn, 'Function') && fn(err)
              })
            }
          })
        }

      }

    })
  }

  toErrorConxt(error, type, promise){
    let ctx = {
      error,
      promise,
      payload: error.payload
    }

    if(type==='error'){
      ctx.catch = (fn) => {
        promise && promise.catch((err) => {
          type(fn, 'Function') && fn(err)
        })
      }
    }else if(type==='promise'){
      ctx.catch = (fn) => {
        promise && promise.catch((err) => {
          type(fn, 'Function') && fn(err)
        })
      }
    }

    return ctx
  }


  register(HooksObj){

    let is = typs;

    if (!is(HooksObj, 'Object')) return;


    for (const type in HooksObj) {
      let arr = type.split(':');
      let cb = HooksObj[type];

      if(is(cb, 'Function')) return;

      this.addEventListener(type, (ev) => {
        cb.call(null, ev);
      })

      if (arr.lengt == 2 && arr[0] === 'E' && arr[1].length){
        this.errorTypes[arr[1]] = createErr(arr[1]);
        Error[arr[1]] = this.errorTypes[arr[1]];

      }

    }
  }

}

function type(val, str) {
  return Object.prototype.toString.call(val).toLowerCase() === `[object ${str}]`.toLowerCase()
}

export default new Hooks()