const VueChunk = require('./lib/vueChunk');
const path = require('path');

module.exports = class DefignEntryPlugin {
  constructor() {

  }

  run(runner) {

    runner.hooks.mayPath.onCall('DefignEntryPlugin-mayPath', add => {
      add('app', 'src/App.vue');
    });

    runner.hooks.defineEntry.onCall('DefignEntryPlugin-defineEntry', container =>{
      let app = runner.getMayPath().app;

      let chunk = new VueChunk();

      if(app){
        chunk.name = 'app';
        chunk.htmlName = 'index';
        chunk.emitPath = path.resolve(runner.tempDir, 'app.js')
        chunk.htmlTemplatePath = 'src/index.html';
        chunk.setRenderComp('__entryComp_' + chunk.name,  '@/App.vue')
      }

      container.push(chunk);
      
    })

  }

}