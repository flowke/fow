// 控制 App 文件的生成

const Hooks = require('../hooks');
const schema = require('./config/BaseOptionsSchema');
const validate = require('../validate');
const Defaulter = require('./DefaultOptions');
const WebpackConfig = require('./WebpackConfig');
const jsonmergepatch = require('json-merge-patch');
const {toArr, isType} = require('@fow/visitor');
const ChunkBlock = require('../chunkBlock');
const fse = require('fs-extra');
const runnerConfig = require('./config/runner.config');

let { 
  appRoot,
  tempFilePath
} = runnerConfig;

class Runner extends Hooks{

  constructor(){
    super();
    this.setHooks({
      patchSchema: ['patchFn'],
      addDefaultOption: ['defaulter'],
      chainWebpack: ['chain'],
      entry: ['chunkBlock']
    });
    this.appFiles = [];
  }

  run(userOptions){
    // generate Options
    let options = this.getOptions(userOptions);

    let entry = new ChunkBlock();

    this.hooks.entry.call(entry);

    let entryCode = entry.genCode();

    this.addAppFile('.entry.js')


    
  }

  // path: string, [string...]
  // isTemp: 是否放到 temp 目录
  addAppFile(path, code, isTemp=true){
    if (!isType(path, 'array')) path = [path];

    if (isTemp) path.unshift(tempFilePath)
    this.appFiles.push({
      path,
      code
    })
  }

  // 验证不通过会抛错
  getOptions(userOptions){

    // patch schema
    this.hooks.patchSchema.call((s={}) => {

      let result = {error: null}

      try {
        // 是否有相同的 properties key
        let rut = toArr(s).forEach(key => {
          if (typeof schema[key] !== 'undefined') {
            return false;
          }
        });

        if(rut === false){
          throw new Error(`There is a same key(${key}) in Schema.properties`);
        }

        jsonmergepatch.apply(schema, {
          properties: s
        });
      } catch (error) {
        result.error = error;
      }

      return result
      
    });

    // validate schema
    try {
      validate(schema, userOptions)
    } catch (error) {
      throw error;
    }
    

    let defaulter = new Defaulter();
    // add addDefaultOption
    this.hooks.addDefaultOption.call(defaulter);
    

    let options = defaulter.generate(userOptions);

    return options;
    
  }

  generateWebpackConfig(options) {

  }

  generateApp(){
    let tasks = this.appFiles.map(f=>{
      return fse.outputFile(
        path.resolve(runnerConfig.appRoot , ...f.path)
        , 
        f.code
      )
    });

    return Promise.all(tasks)

  }

  

}

function getMultiEntry(){
  
}