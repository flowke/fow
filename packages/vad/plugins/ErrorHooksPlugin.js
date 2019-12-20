const fs = require('fs');
const path = require('path');
const {
  ChunkBlock,
} = require('@fow/dev-utils');
const toPath = require('@fow/dev-utils/toPath');

module.exports = class ErrorHooksPlugin{

  constructor(option={}){
    this.option = {
      ...option
    }

    if (typeof this.option.configName !== 'string'){
      this.option.configName = 'hooks'
    }
  }

  run(runner){

    let {
      appRoot
    } = runner.runnerConfig;

    let {
      configName
    } = this.option;

    configName = configName.replace('.js', '');

    runner.hooks.watch.onCall('ErrorHooksPlugin-watch', (add) => {
      add({
        paths: [`src/${configName}.js`],
        events: 'unlink,add',
        type: 'reemit'
      })
    })

    runner.hooks.entry.onCall('ErrorHooksPlugin-entry', (chunks)=>{
      chunks.forEach(chunk => {
        
        let cfgPath = path.resolve(appRoot, 'src', configName+'.js')
        
        if (fs.existsSync(cfgPath)){
          
          let emitPath = path.resolve(runner.tempDir, '_errorHooks.js');
          let newChunk = new ChunkBlock();
          newChunk.emitPath = emitPath;
          newChunk.import('import errorHooks from "@fow/error-hooks";');
          newChunk.import(`import errorHooksConfig from '@/${configName}';`)
          newChunk.import(`import Vue from "vue/dist/vue.runtime.esm";`)
          newChunk.code(`errorHooks.register(errorHooksConfig);`)
          newChunk.code(`window.$hooks = errorHooks`)
          newChunk.code(`Vue.use(errorHooks.vuePlugin)`)
          chunk.import(`import '${toPath.relativePath( chunk.emitPath, emitPath)}';`,'pre')
          
          runner.addAppFile(emitPath, newChunk.genCode());
        }

      });
    })
  }
}