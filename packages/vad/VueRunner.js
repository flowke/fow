const Runner = require('@fow/dev-utils/vad/Runner');
const helpers = require('@fow/dev-utils/vad/helpers');

class VueRunner extends Runner{
  constructor(){
    super();

    this.hooks.mayPath.onCall('VueRunner', add=>{
      add('app', 'src/App.vue');
      add('pagesConfig', 'src/pages/pages.config.js');
    })
  }

  defineEntry(){
    let appPath = this.getMayPath().app;
    return [{
      name: 'app',
      entry: helpers.createChunk(),
      compPath: appPath.has ? '@/App.vue' : null
    }]
  }
  defineEntries(){
    let { appRoot } = this.runnerConfig;
    let cfgPath = this.getMayPath().pagesConfig;
    let pageCfg = [];
    if(cfgPath.has){
      pageCfg = require(path.resolve(appRoot, 'src/pages/pages.config.js'));
    }else{
      let files = glob.sync('*/index.vue', {
        cwd: path.resolve(appRoot, 'src/pages'),
        onlyFiles: true,
        deep: 1,
      });

      pageCfg = files.map((e) => {
        return `${/(.+)\//.exec(e)[1]}:${e}`
      })
    }

    pageCfg = pageCfg.map(str => {
      let arr = str.split(':').map(s => s.trim());
      return {
        name: arr[0],
        path: arr[1] || `${arr[0]}/index.vue`,
      }
    });

    return pageCfg.map(elt=>{
      return {
        name: elt.name,
        compPath: '@/pages/'+elt.path,
        entry: helpers.createChunk()
      }
    })

  }
  getUserOptions(){

    let configPath = path.resolve(this.runnerConfig.appRoot, 'config/config');
    delete require.cache[configPath]

    return require(configPath);
  }
}