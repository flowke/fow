// 控制 App 文件的生成
const path = require('path');
const Hooks = require('../hooks');
const schema = require('./config/OptionsSchema');
const validate = require('../validate');
const Defaulter = require('./DefaultOptions');
const WebpackConfig = require('./WebpackConfig');
const jsonmergepatch = require('json-merge-patch');
const { toArr, debounceExec} = require('@fow/visitor');
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

// entryNode=== chunk: {name, emitPath, [htmlTemplatePath,htmlName], genCode()}
// watcher: [{type: 'restart'/'reemit', callback, paths, events, option}]
module.exports = class Runner extends Hooks{

  constructor(){
    super();

    this.tempDir = runnerConfig.tempFilePath();
    this.runnerConfig = runnerConfig;
    this.options = null
    this.webpackConfig = new WebpackConfig();
    this.appFiles = []; // 有什么样的文件会生成
    this.entryNodes = []; // 框架继承者实现, 决定会有哪些 entry
    this.devServer = null;
    this.watches = [];
    this.watcher = null;
    this.mayPath = new MayPath({
      root: appRoot,
      ignoreInitial: true,
    });

    this.setHooks({
      patchSchema: ['patchFn'],
      addDefaultOption: ['defaulter'],
      installPlugin: ['runner'],
      afterPluginRun: [],
      mayPath: ['addPathFn'],
      entry: ['entries','runnerConfig', 'webpackConfig'],
      emitFile: ['addAppFileFn', 'tempDir'],
      webpack: ['webpackConfig'],
      watch: ['addWatchFn'],
      restart: [],
      reemitApp: [],
    });
    
  }

  run(){
    let options = this.getOptions();

    this.options = options;

    this.hooks.installPlugin.call(this);

    options.plugins.forEach(p => {
      p.run(this)
    });

    this.hooks.afterPluginRun.call()
    
    return this.generateApp(options);

  }

  // ready 之后
  generateApp(options){
    this.hooks.mayPath.call(this.mayPath.add.bind(this.mayPath));
    this.mayPath.sync();

    this.entryNodes = this.defineEntry();
    this.hooks.entry.call(this.entryNodes, this.runnerConfig, this.webpackConfig);
    
    // 生成文件 start
    // 注册要生成的文件
    // 注册 webpack 配置
    this.entryNodes.forEach(node=>{


      this.addAppFile(node.emitPath, node.genCode());

      this.webpackConfig.addEntry(node.name, node.emitPath);

      if (node.htmlTemplatePath){
        let htmlOption = {
          filename: `${node.htmlName || node.name}.html`,
          template: node.htmlTemplatePath,
          excludeChunks: this.entryNodes.filter(e=>e.name !== node.name)
        };

        this.webpackConfig.addHtml(`html${node.name}`, htmlOption)
      }

    });

    // 生成自定义文件
    this.hooks.emitFile.call((chunk)=>{
      
      this.addAppFile(chunk.emitPath, chunk.genCode())
    }, this.tempDir)

     // 生成文件 end
    // 修改 patch webpack
    this.hooks.webpack.call(this.webpackConfig);

    return this.emitFiles();

  }

  defineEntry(){
    throw new Error('The method "defineEntry" must be implemented');
  }

  // 获取
  getUserOptions(){
    throw new Error('The method "defineEntries" must be implemented');
  }
  // r: 是否刷新数据
  getMayPath(r){
    if (this.mayPath) return this.mayPath.sync(r);
    return {}
  }

  // path: string, [string...]
  addAppFile(path, code){
    
    this.appFiles.push({
      path,
      code
    });
  }

  addWatch(obj={}){
    this.watches.push(Object.assign({
      // type: ''
      // ...watchAdd
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
      console.log();
      console.log(error.message.red);
      console.log();
      process.exit()
      
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

  startDev(){
    rimraf.sync(this.tempDir + '/**');

    this.run()
      .then(()=>{
        return this.webpackConfig.create(this.options, this.runnerConfig);
      })
      .then(config=>{
        
        let server = this.devServer = new DevServer();

        server.on('launched', () => {

        })

        server.start(this.options.devServer, config);

        this.watch();
      })
  }

  // 重启
  reStartDev(){
    rimraf.sync(this.tempDir + '/**');
    this.hooks.restart.call()
    
  }

  // 重新渲染 入口
  reEmitApp(){
    rimraf.sync(this.tempDir + '/**');
    // 清理工作
    this.appFiles = [];
    this.entryNodes = [];
    this.mayPath = new MayPath({ root: appRoot });
    
    // 告知进行清理
    this.hooks.reemitApp.asyncParallelCall()
    .then(()=>{
      // 重新生成 app
      this.generateApp(this.options)
        .then(done => {
          cfg => {
            console.log();
            console.log('reemit done!');
          }
        })
    })
    .catch(err=>{

    })
  }

  watch(){
    this.hooks.watch.call(this.addWatch.bind(this));
    this.watcher = new Watcher();

    let restart = debounceExec(700, (ctx, callback) => {

      if (callback.length>=2){
        callback(ctx, this.reStartDev.bind(this));
      }else{
        callback(ctx)
        this.reStartDev();
        
      }
      
    });

    let reemit = debounceExec(300,(ctx, cb)=>{
      console.log('reemitting entries, caused:');
      console.log(`  -> ${ctx.path}`);
      this.reEmitApp();
      cb(ctx)
    });

    this.watches.forEach(node=>{

      this.watcher.add({
        name: node.name,
        paths: node.paths,
        events: node.events,
        callback: ctx => {
          let callback = node.callback || (f => f);
          if (node.type === 'restart') {
            restart(ctx, callback)
          } else if (node.type === 'reemit') {
            reemit(ctx, callback);
          } else {
            callback(ctx)
          }
        },
        option: node.option
      })

    });

    this.watcher.run({
      cwd: this.runnerConfig.appRoot
    })
  }

  build(cb){
    rimraf.sync(this.tempDir + '/**');
    this.run()
      .then(() => {
        return this.webpackConfig.create(this.options, this.runnerConfig);
      })
      .then(config=>{
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
