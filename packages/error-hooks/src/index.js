import createErr from './MsgError';
import Hook from './hooks';

class Hooks extends Hook{
  constructor(){
    super()
    if (window._errorHooks) return window._errorHooks;
    window._errorHooks = this;

    if (window._errorUncatchEvents){
      window.removeEventListener('error', window._errorUncatchEvents.push, true);
      window.removeEventListener('unhandledrejection', window._errorUncatchEvents.push);
      this.errorUncatchEvents = window._errorUncatchEvents.slice();
      window._errorUncatchEvents = undefined;
    }

    this.errorTypes = {};
    this.initErrorCatch();
    let self = this;
    this.vuePlugin = {
      install(Vue) {
        let old = null;
        if (type(Vue.config.errorHandler, 'function')) {
          old = Vue.config.errorHandler;
        }
        Vue.config.errorHandler = (err, vm, info) => {

          try {
            if (old) old(err, vm, info)
          } catch (error) {
            console.error(error)
          }

          let logErr = ()=>{
            console.error(err);
            
          }

          self.dispatchWithCtx({
            error: err,
            catch: (fn)=>{
              logErr = f=>f
              fn && fn(err)
            }
          }, 'E')

          logErr()

        }
      }
    };

  }


  initErrorCatch(){

    window.addEventListener('error', (ev)=>{
      
      this.dispatchWithEvent(ev)
    },true)

    window.addEventListener('unhandledrejection', (ev)=>{
      this.dispatchWithEvent(ev)

    })
  }

  getDispatchInfoWithCtxTag(ctx, errType){
    let {
      promise,
      error,
      target,
      catch: catchError
    } = ctx;

    let evCtx = null;
    let errName = null;

    switch (errType) {
      case 'ETag':
      case 'Etag':{
        if (target && target.tagName ) {
          errName = String(target.tagName).toUpperCase();
          evCtx = {
            target,
            catch: catchError
          }
        }
        break;
      }
      case 'E':{
        if (type(error, 'Error')){
          errName = error.name;
          if (isBiError(errName)) errName = 'Error';
          evCtx = {
            error,
            promise,
            payload: error.payload,
            catch: catchError
          }
        }

        break;
      }

    }

    if (evCtx && errType && errName){
      if (this.listeners[errType + ':' + errName]){
        return [errType + ':' + errName, evCtx]
      }
      
    }

  }
  getDispatchInfoWithEvent(ev) {
    let { error, target, promise, reason } = ev;

    let evCatch = fn => {
      ev.preventDefault();
      type(fn, 'Function') && fn(error)
    }

    let ctx = {
      catch: evCatch,
    };
    let tag = ''

    if (promise) ctx.promise = promise

    if (target && target.nodeType === Node.ELEMENT_NODE) {
      ctx.target = target;
      tag = 'ETag'

    } else if (type(error, 'Error')) {
      ctx.error = error
      tag = 'E'
    } else if (!type(error, 'Error')) {
      ctx.error = new Error('Not standard Error, more information in Error.payload')
      ctx.error.payload = error
      tag = 'E'
    } else if (type(reason, 'Error')) {
      ctx.error = reason
      tag = 'E'
    } else if (!type(reason, 'Error')) {
      ctx.error = new Error('Not standard Error, more information in Error.payload')
      ctx.error.payload = reason
      tag = 'E'
    }

    if (tag) {
      return this.getDispatchInfoWithCtxTag(ctx, tag)
    }
  }

  dispatchWithEvent(ev){
    let info = this.getDispatchInfoWithEvent(ev);
    if (info) this.dispatch.apply(this, info )
    
  }

  dispatchWithCtx(ctx, type){
    let info = this.getDispatchInfoWithCtxTag(ctx, type);
    if (info) this.dispatch.apply(this, info)
  }

  addEventListener(type, callback){
    super.addEventListener(type, callback);

    if (this.errorUncatchEvents){
      this.errorUncatchEvents.forEach(ev => {
        let info = this.getDispatchInfoWithEvent(ev);
        if(info && info[0]===type){
          callback(info[1])
        }
      });
    }

  }

  get add(){
    return this.addEventListener
  }

  register(HooksObj){

    let is = type;

    if (!is(HooksObj, 'Object')) return;

    
    for (const type in HooksObj) {
      
      let arr = type.split(':');
      let cb = HooksObj[type];
      
      if(!is(cb, 'Function')) continue;

      this.addEventListener(type, (ev) => {
        cb.call(null, ev);
      })

      if (arr.length == 2 && arr[0] === 'E' && arr[1].length){
        this.errorTypes[arr[1]] = createErr(arr[1]);
        Error[arr[1]] = this.errorTypes[arr[1]];

      }

    }
  }

}

function type(val, str) {
  
  return Object.prototype.toString.call(val).toLowerCase() === `[object ${str}]`.toLowerCase()
}

// is builtin error
function isBiError(name) {

  return [
    'Error',
    'EvalError',
    'InternalError',
    'RangeError',
    'ReferenceError',
    'SyntaxError',
    'URIError',
  ].indexOf(name) !== -1
}

function isErrorTag(name) {
  return [
    'IMG',
    'SCRIPT',
    'LINK'
  ].indexOf(name) !== -1
}

export default new Hooks()