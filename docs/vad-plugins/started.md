# 介绍

`@fow/vad/plugins` 插件提供了各种各样的功能, 它内部是由一系列插件封装而成的插件集.

先开启此插件, 如果你使用 `vad-cli` 生成了项目脚手架, 那么配置文件已经帮你填写了注册此插件的相关代码.

比如如下这样: 

```js
// config/config.js
const VadPlugins = require('@fow/vad/plugins');

module.exports = {
  plugins : [
    new VadPlugins({
      init: true,
      puta: true,
      vuex: true,
      router: true,
      componentsPreview: false
    })
  ]
}
```

目前只支持以上列出的功能项, 随着版本的升级可能会添加新的配置项或改变.

以下是此插件配置项的简单介绍, 更多的配置详情请阅读此模块的其它章节:


## init

`type: boolean`

如果选项设置为 true, 那么可以在 `src/init.js` 中做一些初始化工作, 也可以获取以下变量:

* Vue: 做一些 use 或其他初始化炒作等等
* vm: vue 实例
* store: vuex store (如果开启了vuex)
* router: router (如果开启了router)

## puta

`type: boolean | object`

在项目中开启请求功能.

##  router

`type: boolean | object`

在项目中自动生成 router, 提供给项目使用.

## vuex

`type: boolean | object`

在项目中自动生成 vuex store, 提供给项目使用.

##  componentsPreview

`type: boolean | object`

快速预览组件.

