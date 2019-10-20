const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = class VueWebpackPlugin{
  constructor(){

  }

  run(runner){
    runner.hooks.webpack.onCall(cfg=>{
      cfg.add(this.config.bind(this))
    })
  }

  config(chain){

    chain.module
      .rule('baseLoaders')
        .oneOf('js')
          .use('babel')
            .tap(op => {

              if (!op.plugins) op.plugins = [];
              op.plugins.push(require("babel-plugin-transform-vue-jsx"))
              
              return op;
            })
            .end()
          .end()
        .exclude
          .add(/\.vue$/)
          .end()
        .end()
      .rule('vue')
        .test(/\.vue$/)
        .use('vueLoader')
          .loader(require.resolve('vue-loader'))
    
    chain.merge({
      plugin: {
        VueLoaderPlugin: {
          plugin: VueLoaderPlugin
        }
      }
    })

  }
}