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
const DevServer = require('../devServer/server');
const Watcher = require('../watch');
const rimraf = require('rimraf');
const webpack = require('webpack');

let { 
  appRoot,
  tempFilePath
} = runnerConfig;

// entryNode: {name, compPath: 相对于 page, entry}
// watcher: [{type: 'restart'/'reemit', callback, paths, events}]
module.exports = class Runner extends Hooks{

  constructor(){
    super();

    this.runnerConfig = runnerConfig;
    this.options = null
    this.webpackConfig = new WebpackConfig();
    this.appFiles = []; // 有什么样的文件会生成
    this.entryNodes = []; // 框架继承者实现, 决定会有哪些 entry
    this.devServer = null;
    this.watches = [];
    this.watcher = null;
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
      webpack: ['webpackConfig'],
      watch: ['addWatchFn']
    });
    
  }

  // ready 之后
  ready(){
    // generate Options
    let options = this.getOptions(userOptions);
    this.options = options;

    this.hooks.mayPath.call(this.mayPath.add.bind(this.mayPath));
    this.mayPath.sync();

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

  }

  defineEntry(){
    throw new Error('The method "defineEntry" must be implemented');
  }

  defineEntries(){
    throw new Error('The method "defineEntries" must be implemented');
  }
  // 获取
  getUserOptions(){
    throw new Error('The method "defineEntries" must be implemented');
  }

  getMayPath(r){
    if (this.mayPath) return this.mayPath.sync(r);
    return {}
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

  addWatch(obj={}){
    this.watches.push(Object.assign({},{
      type: 'restart',
    },obj))
  }

  // 验证不通过会抛错
  getOptions(){

    let userOptions = this.getUserOptions();

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

  // 生成文件任务, 返回 promise list
  emitFiles(){
    let tasks = this.appFiles.map(f=>{
      return fse.outputFile(
        f.path
        , 
        f.code
      )
    });

    return Promise.all(tasks)

  }

  prepareFilesAndWebpack(callback = f => f) {
    this.ready();

    this.emitFiles()
      .then(done => {
        return this.webpackConfig.create(this.options);
      })
      .then(config => {
        callback(config);

      });
  }

  startDev(){
    
    this.prepareFilesAndWebpack(config => {
      let server = this.devServer = new DevServer();

      server.start(this.options.devServer, config);

      this.watch();

    });


  }

  reStartDev(){

    if(this.watcher){
      this.watcher.close('all', true);
    }
    if(this.devServer){
      this.devServer.close();
    }

    this.options = null;
    this.webpackConfig = new WebpackConfig();
    this.appFiles = [];
    this.entryNodes = [];
    this.devServer = null;
    this.watches = [];
    this.watcher = null;
    this.mayPath = new MayPath({root: appRoot});

    this.startDev();

  }

  reEmitFiles(){
    this.options = null;
    this.appFiles = [];
    this.entryNodes = [];
    this.mayPath = new MayPath({ root: appRoot });

    this.prepareFilesAndWebpack()
  }

  watch(){
    this.hooks.watch.call(this.addWatch.bind(this));
    this.watcher = new Watcher();
    this.watches.forEach(node=>{

      if(node.type==='restart'){
        this.watcher.add(node.name, node.paths, node.events, ()=>{
          this.reStartDev();
        })
      }

      if(node.type==='reemit'){
        this.reEmitFiles();
      }

    })
  }

  build(cb){
    this.prepareFilesAndWebpack(config=>{
      rimraf.sync(this.options.paths.outputPath + '/**');
      webpack(config, (err,stats)=>{

        if (cb) {
          cb(err, stats);
          return;
        }

        if (err) {
          console.error(err.stack || err);
          if (err.details) {
            console.error(err.details);
          }
          return;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
          console.error(info.errors);
        }

        if (stats.hasWarnings()) {
          console.warn(info.warnings);
        }

        if (!err) {
          console.log(stats.toString({
            colors: true
          }))
        }

      })
    })
  }


}
