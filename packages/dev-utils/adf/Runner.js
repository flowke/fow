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
const MayPath = require('../mayPath');
const glob = require('globby');

let { 
  appRoot,
  tempFilePath
} = runnerConfig;

// entryNode: {name, compPath: 相对于 page, entry}
class Runner extends Hooks{

  constructor(){
    super();

    this.runnerConfig = runnerConfig;
    this.options = null
    this.webpackConfig = new WebpackConfig();
    this.appFiles = [];
    this.entryNodes = [];
    this.mayPath = new MayPath({
      root: appRoot
    });

    this.setHooks({
      patchSchema: ['patchFn'],
      addDefaultOption: ['defaulter'],
      chainWebpack: ['chain'],
      mayPath: ['addPathFn'],
      entry: ['entry','runnerConfig', 'webpackConfig'],
      entries: ['entries','runnerConfig', 'webpackConfig'],
      emitFile: ['addAppFileFn'],
      webpack: ['chain', 'merge']
    });
    
  }


  run(userOptions){
    // generate Options
    let options = this.getOptions(userOptions);
    this.options = options;

    this.hooks.mayPath.call(this.mayPath.add.bind(this.mayPath));

    let mayPath = this.mayPath.sync();

    if (options.multiPages===true){
      this.entryNodes = this.defineEntries();
      this.hooks.entries.call(this.entryNodes, this.runnerConfig, this.webpackConfig);
    }else{
      // 定义单入口
      this.entryNodes = this.defineEntry();
      this.hooks.entry.call(this.entryNodes, this.runnerConfig, this.webpackConfig);
    }

    // 生成文件 start

    // 注册要生成的文件
    // 注册 webpack 配置
    this.entryNodes.forEach(node=>{

      let path = path.resolve(appRoot, tempFilePath, `.${node.name}.js`);

      this.addAppFile(path, node.entry.genCode());

      this.webpackConfig.add(chain=>{
        chain.entry(node.name)
          .add(path)
      });

      let htmlPath = path.resolve(appRoot, `src/pages/${node.name}/index.html`);
      htmlPath = fse.existsSync(htmlPath) ? htmlPath :'';

      let htmlOption = {
        filename: `${e.name}.html`,
        template: htmlPath ? htmlPath : undefined,
        // chunks: [e.name, 'vendors'],
        excludeChunks: pageCfg.reduce((acc, elt) => {
          if (e.name !== elt.name) acc.push(elt.name)
          return acc
        }, [])
      };

      this.webpackConfig.addHtml(`html${node.name}`, htmlOption)
      this.webpackConfig.addHtml(`multiEntry`,{
        chunks: [],
        pages: pageCfg.map(e => e.name + '.html'),
        template: path.resolve(__dirname, 'multi.html'),
      })

    });

    // 生成自定义文件
    this.hooks.emitFile.call((name, code)=>{
      this.addAppFile(path.resolve(appRoot, tempFilePath, `.${name}.js`), code)
    })

     // 生成文件 end
    // 修改 patch webpack
    this.hooks.webpack.call(this.webpackConfig);

    return this.generateApp();

  }

  defineEntry(){
    throw new Error('The method "defineEntry" must be implemented');
  }

  defineEntries(){
    throw new Error('The method "defineEntries" must be implemented');
  }

  // path: string, [string...]
  // isTemp: 是否放到 temp 目录
  addAppFile(path, code){
    // if (!isType(path, 'array')) path = [path];

    // if (isTemp) path.unshift(tempFilePath)
    this.appFiles.push({
      path,
      code
    });
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

  // 生成文件任务, 返回 promise list
  generateApp(){
    let tasks = this.appFiles.map(f=>{
      return fse.outputFile(
        f.path
        , 
        f.code
      )
    });

    return Promise.all(tasks)

  }


}
