
# 功能集

vad 的功能由插件提供. 目前最主要的插件是 `@fow/vad/plugins`. 它是一个插件集, 也可以认为是一个功能集合, 提供了各种各样的功能.

你可以在 `config/config.js` 中使用如下方式配置此插件:

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

去 `@fow/vad/plugins` 章节查看更多关于此插件详细的配置, 与使用规则.
