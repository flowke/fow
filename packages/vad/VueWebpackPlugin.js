const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

module.exports = class VueWebpackPlugin{
  constructor(){

  }

  run(runner){
    this.runner = runner;
    runner.hooks.webpack.onCall('VueWebpackPlugin', cfg=>{
      cfg.add(this.config.bind(this))
    })
  }

  config(chain){
    let { runnerConfig} = this.runner;
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
          .include
            .add(path.resolve(runnerConfig.appRoot, 'src'))
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