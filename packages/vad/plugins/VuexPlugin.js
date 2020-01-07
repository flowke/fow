const glob = require('globby');
const fs = require('fs');
const path = require('path');
const {
  ChunkBlock
} = require('@fow/dev-utils');


module.exports = class VuexPlugin{

  run(runner){
    let {appRoot} = runner.runnerConfig

    runner.hooks.watch.onCall('VuexPlugin', add=>{
      add({
        type: 'reemit',
        paths: [
          'src/store/index.js',
          'src/store/modules/*.js',
          'src/pages/*/modules/*.js'
        ],
        events: 'add,unlink'
      });

    });

    runner.hooks.entry.onCall('VuexPlugin-entry', chunks=>{
      let existCfg = fs.existsSync(path.resolve(appRoot, 'src/store/index.js'));
      console.log(existCfg, 'existCfg');
      
      let modules = []

      if(existCfg){
        
        modules = glob.sync([
          'src/store/modules/*.js',
          'src/pages/*/modules/*.js'
        ],{
            cwd: appRoot,
            onlyFiles: true,
        });
      };

      modules = modules.map(n=>{
        return {
          name: path.basename(n, '.js'),
          path: n
        }
      });


      chunks.forEach(chunk=>{
        if (existCfg){
          let emitPath = path.resolve(runner.tempDir, '_redux_xx_index.js');

          let relaPath = './' + path.relative(path.dirname(chunk.emitPath), emitPath);

          let nChunk = new ChunkBlock();

          nChunk.import("import Vuex from 'vuex';")
          nChunk.import("import storeConfig from '@/store/index'")
          nChunk.code(`storeConfig.modules = {}`)

          modules.forEach(m=>{
            nChunk.import(`import __vuex_m_${m.name} from '@@/${m.path}`)
            nChunk.code(`storeConfig.modules.${m.name} = __vuex_m_${m.name}`)
          });

          nChunk.code(`let store = new Vuex.Store(storeConfig);`)
          nChunk.code(`window.$store = store;`)
          nChunk.code(`export {`)
          nChunk.code(`  Vuex as _Vue_Vuex,`)
          nChunk.code(`  store as _$store_ins_`)
          nChunk.code(`}`)

          chunk.import(`import {_Vue_Vuex, _$store_ins_} from "${relaPath}";`, 'pre');
          chunk.code('Vue.use(_Vue_Vuex);');
          chunk.vueOption(`store`, '_$store_ins_');

          runner.addAppFile(emitPath, nChunk.genCode());

        }
      })
    })


  }
}