const VueChunk = require('./lib/vueChunk');
const path = require('path');
const fs = require('fs');

module.exports = class DefignEntryPlugin {
  constructor() {

  }

  run(runner) {

    let { appRoot } = runner.runnerConfig;

    runner.hooks.watch.onCall('DefignEntryPlugin', add=>{
      add({
        type: 'reemit',
        paths: ['src/App.vue'],
        events: 'add,unlink',
      })
    } )

    runner.hooks.defineEntry.onCall('DefignEntryPlugin-defineEntry', container =>{

      let existApp = fs.existsSync(path.resolve(appRoot, 'src/App.vue'))

      let chunk = new VueChunk();
      chunk.name = 'app';
      chunk.htmlName = 'index';
      chunk.emitPath = path.resolve(runner.tempDir, 'app.js')
      chunk.htmlTemplatePath = 'src/index.html';

      if (existApp){
        
        chunk.setRenderComp('__entryComp_' + chunk.name,  '@/App.vue')
      }

      container.push(chunk);
      
    });
    
    runner.hooks.webpack.onCall('DefignEntryPlugin-webpack', cfg=>{
      cfg.chainJs(js=>{
        js 
          .include
          .add(runner.tempDir)
      })
    })
  }

}