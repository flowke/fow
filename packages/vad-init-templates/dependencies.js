
module.exports = {
  // libs 池子, 下面 type 数组会过来取
  libs: {
    // vuex: '^3.1.2',
    // 'vue-router': '^3.1.3',

  },
  // devLibs 池子, 下面 type 数组会过来取
  devLibs: {

  },

  commonLibs: {
    "cross-env": 'latest',
    "@fow/vad": '^1.1.0'
    // vue: '^2.6.11',
    // puta: '^1.2.1',
    // '@babel/runtime': '^7.7.7',
    // '@fow/visitor': '^1.2.4',
  },

  devCommonLibs: {
    // "vue-template-compiler": "^2.6.11",
    // "@fow/vad": '^1.0.4'
    
  },

  type: {
    simple: {
      dev: [],
      prod: []
    },
    'router': {
      dev: [],
      prod: []
    },
    'router-vuex': {
      dev: [],
      prod: []
    },
    'vuex': {
      dev: [],
      prod: []
    },
  }

}