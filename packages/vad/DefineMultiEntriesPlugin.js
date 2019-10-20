const VueChunk = require('./lib/vueChunk');
const path = require('path');
const glob = require('globby');

module.exports = class DefignEntryPlugin {
  constructor(op={}) {

    this.options = op;

  }

  run(runner) {
    this.runner = runner;

    this.hooks.mayPath.onCall('VueRunner', add => {
      add('pagesConfig', 'src/pages/pages.config.js');
    });

    this.hooks.defineEntry.onCall('VueRunner', container => {
      this.defineEntries(runner, container)
    })

  }

  defineEntries(runner, container) {
    if (!this.options.multiMode) return container;

    let { appRoot } = runner.runnerConfig;
    let cfgPath = runner.getMayPath().pagesConfig;
    let pageCfg = [];
    if (cfgPath.has) {
      pageCfg = require(path.resolve(appRoot, 'src/pages/pages.config.js'));
    } else {
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

    return pageCfg.map(elt => {
      let chunk = new VueChunk();
      Object.assign(chunk, {
        name: elt.name,
        emitPath: path.resolve(runner.tempDir, `${elt.name}.js`)
      });

      chunk.setRenderComp('__entryComp_' + elt.name, '@/pages/' + elt.path)

      return chunk;
    })

  }

}