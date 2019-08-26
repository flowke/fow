module.exports = {
  router: true,
  devServer: {
    port: 3006
  },
  clientEnv: {
    // access it with process.env.BUILD_TYPE
    BUILD_TYPE: 'test'
  },
  globalVar: {
    // access it with NAME
    NAME: 'Hue'
  },
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