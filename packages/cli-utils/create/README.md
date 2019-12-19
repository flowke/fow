# create app template

## 使用

```
const Create = require('@fow/dev-utils/create');

new Create().run(options)

```

## `options`

```js
createMethod, // 创建方式
forceCreate, // 是否强制创建
initDirName, // 初始化的目录名
templateType, // 模板类型
templateFrom='npm', // 'npm', 'git', 'local',
packageName, // 模板所在的 npm 包名
```

## 使用的模板结构

template 包 结构:

```
package
  |-templates/
    |-common/
    |-simple/  名字和 package.json 中 templatesConfig type 的 name 相对应
  |-dependencies.js
  |-package.json
```


## `package.json` 

package.json 必须有 `templatesConfig` 字段, 结构类似:

```js
{
  "simple": {
    "name": "simple",
    "describe": "template will only contain vue"
  },
  "router": {
    "name": "router",
    "describe": "template will contain vue+router"
  },
  "vuex": {
    "name": "vuex",
    "describe": "template will contain vue+vuex"
  },
  "router-vuex": {
    "name": "router-vuex",
    "describe": "template will contain vue+router+vuex"
  }
}
```


## `dependencies.js` 

dependencies.js 结构类似:

```js

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
    "tha": "latest",
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

```