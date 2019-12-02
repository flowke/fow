const fs = require('fs');
const path = require('path');

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
        type: 'restart'
      })
    })

    runner.hooks.entry('ErrorHooksPlugin-entry', (chunks)=>{
      chunks.forEach(chunk => {
        chunk.import('import errorHooks from "@fow/error-hooks";');

        let cfgPath = path.resolve(appRoot, 'src', configName+'.js')

        if (fs.existsSync(cfgPath)){
          chunk.import(`import errorHooksConfig from '@/${configName}';`)
          chunk.code(`errorHooks.register(errorHooksConfig);`)
          chunk.code(`window.$hooks = errorHooks`)
        }

      });
    })
  }
}