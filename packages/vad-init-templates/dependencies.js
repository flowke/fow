
module.exports = {
  // libs 池子, 下面 type 数组会过来取
  libs: {
    vuex: '^3.1.1',
    'vue-router': '^3.0.6',

  },
  // devLibs 池子, 下面 type 数组会过来取
  devLibs: {

  },

  commonLibs: {
    vue: '^2.6.10',
    puta: 'latest',
    '@babel/runtime': 'latest',
    '@fow/visitor': 'latest',
  },

  devCommonLibs: {
    "vue-template-compiler": "^2.6.10",
    "@fow/vad": 'latest'
  },

  type: {
    simple: {
      dev: [],
      prod: []
    },
    'router': {
      dev: [],
      prod: ['vue-router']
    },
    'router-vuex': {
      dev: [],
      prod: ['vue-router', 'vuex',]
    },
    'vuex': {
      dev: [],
      prod: ['vuex',]
    },
  }

}