const glob = require('globby');
const path = require('path');
const fs = require('fs');
const {
  walkCode
} = require('@fow/dev-utils/ast');
const {
  Defaulter,
  ChunkBlock
} = require('@fow/dev-utils');


// 默认 _ 开头的文件夹不会被匹配

module.exports = class PutaPlugin{
  constructor(options){
    let df = new Defaulter();

    df.set('ignore',[] );

    this.options = df.generate(options);
  }

  run(runner){

    let { appRoot } = runner.runnerConfig;

    runner.hooks.webpack.onCall('PutaPlugin', (webpackCfg)=>{
      webpackCfg.chainJs(js=>{
        js.include
          .add(/puta\/lib\/index/)
          .add(/puta\\lib\\index/)
      })
    });

    runner.hooks.watch.onCall('PutaPlugin', add=>{
      add({
        type: 'reemit',
        paths: ['src/services/**', 'src/services/'],
        events: 'change,add,unlink',
        name: 'puta_service',
        callback: (ctx)=>{
          // console.log(ctx,'ctx');
          
        }
      })
    });

    runner.hooks.entry.onCall('PutaPlugin-entry', (chunks)=>{
      let emitPath = path.resolve(runner.tempDir, '_puta.js');
      let newChunk = new ChunkBlock();
      newChunk.emitPath = emitPath;
      
      // 得到不同的实例组
      let putaInstances = this.globFiles(runner);
      let putaInsArr = Object.entries(putaInstances);

      // ** 引入puta
      if (putaInsArr.length) {
        newChunk.import(`import Request from 'puta/lib/index';`);
      }

      chunks.forEach(chunk => {

        if (putaInsArr.length){
          // console.log(path.dirname(chunk.emitPath));
          
          
          let relaPath = './'+path.relative(path.dirname(chunk.emitPath), newChunk.emitPath);

          chunk.import(`import "${relaPath}";`,'pre')
        }

        // 遍历需要生成的实例
        // insName: puta实例名
        // ins: puta 实例
        putaInsArr.forEach(([insName, ins])=>{

          // **** 加载配置信息 start
          
          // 配置文件变量名
          let configNameCode = '';
          let putaArgsCode = ''; // 传递给实例化 puta 的参数
          // puta.config.js 输出的东西
          let configInfo = {
            globalConfig: null, // 配置全局变量的访问
            putaConfig: null,  // putaConfig
            callback: null, //  回调函数
          }
          // puts.config 文件路径, 基于 src/services
          let configFilePath = '';
          if (ins.config) configFilePath = insName === 'common' ? ins.config : insName + '/' + ins.config

          if (ins.config){
            
            configInfo = parseConfigInfo(path.resolve(appRoot, 'src/services', configFilePath))
          }
          

          if (Object.keys(configInfo).filter(Boolean).toString()) {
            configNameCode = `_putaConfig_${insName}`
            // 引入实例配置信息
            newChunk.import(`import * as ${configNameCode} from '@/services/${configFilePath}';`)
            
            // ** 传递给实例化需要的参数
            let {putaConfig } = configInfo;
            let cfgCode = putaConfig ? `${configNameCode}.${putaConfig}` : '';
            putaArgsCode = `${cfgCode}`
          };

          let putaInsNameCode = `_puta_${insName}`;

          // ** 声明 puta 实例
          newChunk.code(`let ${putaInsNameCode} = Request(${putaArgsCode});`);

          // **暴露给全局
     
          let globalCode = _putaGlobalCode(putaInsNameCode, {
            req: insName === 'common' ? '$req' : `$${insName}`,
            apis: insName === 'common' ? '$apis' : `$a${upcaseCapital(insName)}`,
            mApis: insName === 'common' ? '$m' : `$m${upcaseCapital(insName)}`,
          }, configInfo.globalConfig ? `${configNameCode}.${configInfo.globalConfig}` : null);

          newChunk.code(globalCode)

          // **注册此实例的相关模块
          ins.modules.forEach(moduleFile => {
            let ctxDir = insName+'/';
            if (insName === 'common') ctxDir = '';
            // 模块在代码中的引入路径
            let modulePath = `@/services/${ctxDir}${moduleFile}`;
            // 模块名
            let mName = path.basename(moduleFile, '.js');
            // 代码中的模块名
            let mNameCode = ` _putaModule_${insName}_${mName}`

            // 引入实例模块
            newChunk.import(`import ${mNameCode},{config as ${mNameCode}_config} from "${modulePath}";`);

            // **注册实例模块
            newChunk.code(`${putaInsNameCode}.moduleRegister(${mNameCode}, '${mName}',${mNameCode}_config)`)

          });

          // **执行callback
          if (configInfo.callback){
            newChunk.code(`${configNameCode}.${configInfo.callback}(${putaInsNameCode});`)
          }
          
        })
      });
      // console.log(emitPath, newChunk.genCode(), 'ppp');
      
      runner.addAppFile(emitPath, newChunk.genCode());
    })
  }
  // 得到类似于
//  [
//    {
//     name: 模块名,
//     modules: [], 模块文件名列表
//     config: 配置文件名
//    }
//  ]
  globFiles(runner){
    let {appRoot} = runner.runnerConfig;

    let files = glob.sync('**.js', {
      cwd: path.resolve(appRoot, 'src/services'),
      onlyFiles: true,
      deep: 2,
      ignore: this.options.ignore.concat(['_*/**'])
    });

    return files.reduce((acc, name) => {
      let arr = name.split('/');

      let [a1, a2] = arr;

      let moduleName, file;


      if (arr.length === 1) {

        moduleName = 'common';
        file = a1

      } else {
        moduleName = a1;
        file = a2;
      }

      if (!acc[moduleName]) {
        acc[moduleName] = {
          name: moduleName,
          modules: [],
          config: ''
        }
      }

      if (file === 'puta.config.js') {
        acc[moduleName].config = file
      } else {
        acc[moduleName].modules.push(file)
      }

      return acc

    }, {})

  }


}

function _putaGlobalCode(putaIns, deault, configObjCode ){
  if (!configObjCode){
    return [
      `window.${deault.req} = ${putaIns}`,
      `window.${deault.apis} = ${putaIns}.apis`,
      `window.${deault.mApis} = ${putaIns}.mApis`,
    ].join('\n')
  }else{
    return [
      `{`,
      `  let obj = ${configObjCode} || {}`,
        `window[obj.req || "${deault.req}"] = ${putaIns}`,
        `window[obj.apis || "${deault.apis}"] = ${putaIns}.apis`,
        `window[obj.mApis || "${deault.mApis}"] = ${putaIns}.mApis`,
      `}`,
    ].join(`\n`)
  }
}


function upcaseCapital(str){
  let a = str[0].toUpperCase()

  return a+ str.slice(1)
}

function parseConfigInfo(path){

  let obj = {
    globalConfig: null,
    callback: null,
    putaConfig: null
  }

  try {
    let code = fs.readFileSync(path, {
      encoding: 'utf8'
    });

    walkCode(code, {
      enter: function({node}){
        
        let exportName = '';
        if (node.type === 'ExportNamedDeclaration' && node.declaration){
          exportName = node.declaration.declarations[0].id.name;
        } else if (node.type === 'ExportSpecifier'){
          exportName = node.exported.name;
        }

        switch (exportName){
          case 'puta':
          case 'access': {
            obj.globalConfig = exportName;
            break;
          }
          case 'putaConfig': {
            obj.putaConfig = exportName;
            break;
          }
          case 'callback': {
            obj.callback = exportName;
            break;
          }

        }
      }
    })

  } catch (error) {
    console.log('warnning: ', 'parse ', path, ' fail');
    console.log('  -> message: ', error);
    
    
    return {}
  }

  // console.log(obj);

  return obj

}