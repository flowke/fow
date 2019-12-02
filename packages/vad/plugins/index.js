const InitPlugin = require('./InitPlugin')
const PutaPlugin = require('./PutaPlugin')
const VuexPlugin = require('./VuexPlugin')
const RouterPlugin = require('./RouterPlugin')
const ComponentsPreviewPlugin = require('./ComponentsPreviewPlugin')
const ErrorHooksPlugin = require('./ErrorHooksPlugin')

let maps = {
  init: InitPlugin,
  puta: PutaPlugin,
  vuex: VuexPlugin,
  router: RouterPlugin,
  componentsPreview: ComponentsPreviewPlugin,
  errorHooks: ErrorHooksPlugin,
}

function type(params) {
  return Object.prototype.toString.call(params)
}

module.exports = class VadPlugins{

  constructor(options={}){

    if (type(options) !== '[object Object]') throw new Error('VadPlugins .options must be a plan Object')

    this.options = options;
  }

  run(runner){

    Object.entries(this.options).forEach(([key, val])=>{

      if(val && maps[key]){
        let op ;

        if(type(val)==='[object Object]') op = val
        
        new maps[key](op).run(runner)
      }

    })
  }
}