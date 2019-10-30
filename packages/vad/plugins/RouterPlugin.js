const fs = require('fs');
const path = require('path');
const {
  ChunkBlock
} = require('@fow/dev-utils');

module.exports = class RouterPlugin{
  constructor(op={}){
    this.option = Object.assign({
      routerLoader: true
    },op)
  }

  run(runner){

    let {appRoot} = runner.runnerConfig;

    runner.hooks.webpack.onCall(cfg=>{

      if (routerLoader){
        cfg.add(chain => {
          chain.module
            .rule('handleRouter')
              .pre()
              .test(/router\/index\.js$/)
              .use('router')
                .loader(require.resolve('../webpackLoader/vue-router-loader.js'))
        });
      }
      
    });

    runner.hooks.entry.onCall(chunks=>{

      let existConfig = fs.existsSync(path.resolve(appRoot, 'src/router/index.js'))

      chunks.forEach(chunk=>{
        if (existConfig){
          let emitPath = path.resolve(runner.tempDir, '_router_index.js');
          let newChunk = new ChunkBlock();
          newChunk.emitPath = emitPath;
          newChunk.import(`import Router from 'vue-router';`)
          newChunk.import(`import routerOption from '@/router/index';`)
          newChunk.code(`let router = new Router(routerOption)`)
          newChunk.code(`window.$router=router;`)
          newChunk.code(`export {`);
          newChunk.code(`  router as __$router_ins,`);
          newChunk.code(`  Router as _Vue_Router`);
          newChunk.code(`}`);

          let relativePath = './' + path.relative(path.dirname(chunk.emitPath), emitPath );

          chunk.import(`import {__$router_ins, _Vue_Router} from "${relativePath}";`, 'pre');
          chunk.code('Vue.use(_Vue_Router)')
          chunk.vueOption('router', '__$router_ins');

          if(!chunk.renderComp){
            chunk.setRenderComp('router-view')
          }

          runner.addAppFile(emitPath, newChunk.genCode());

        }
      })
    })
  }
}