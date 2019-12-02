const VadPlugins = require('@fow/vad/plugins');

module.exports = {
  devServer: {
    port: 3006
  },
  defaultProcessEnv: {
    // access it with process.env.BUILD_TYPE
    BUILD_TYPE: 'test'
  },
  defineVar: {
    // access it with NAME
    NAME: 'Hue'
  },
  plugins: [
    new VadPlugins({
      init: true,
      puta: true,
      vuex: true,
      router: true,
      componentsPreview: false
    })
  ],
  compatibility: {
    // level: , //0,1,2

    // targets config for browserslist
    // https://github.com/browserslist/browserslist
    // targets: {
    //   "chrome": "58",
    //   "ie": "11"
    // }
  }
}