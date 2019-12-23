# 目录和约定

一个典型的 `vad` 项目可能会有如下目录结构:

```
.
├── dist/                          // 默认的 build 输出目录
├── config/
    ├── config.js                  // vad 配置文件
└── src/                           // 源码目录，可选
    ├── layouts/index.js           // 全局布局
    ├── router/index.js            // 如果开启了 router 插件功能, 路由配置从这里读取
    ├── services/                  // 如果开启了 puta 插件功能, puta 配置从这里读取
    ├── store/                     // 如果开启了 vuex 插件功能, vuex 配置从这里读取
      ├── modules/                 // module 目录，可以在里面新建 vuex module, 文件名就是 module 名
      ├── index.js                 // vuex 配置
    ├── pages/                     // 页面目录，建议路由级别的视图组件放在此目录下,
        ├── home/                  // 一个文件夹
          ├── modules/             // 如果开启 vuex 插件, 目录下放置 vuex module, module 会自动注册
          ├── home.vue             // 一个组件
        └── xxx.vue                // 一个页面 
    ├── App.vue                    // 外层组件
    ├── init.js                    // 运行时配置文件, 可以 获取 Vue 或 vm 实例
    ├── index.html                 // HTML 模板
└── package.json

```

vad 本质上不强制规定目录结构, 但目前版本你至少需要保证以下几个文件:

* `config/config.js` : vad 配置文件
* `src/App.vue`: 外层组件, 否则 vad 没有实际有意义的组件用于渲染
* `src/index.html`: HTML 模板文件.

其它更多的目录约定取决于 vad 插件. 不同的 vad 插件会提供不同的功能或功能集合, 同时也有可能有一些新的目录约定.

多数功能由 vad的 插件来提供. 目前最终要的插件就是官方提供的插件, 其位于 `@fow/vad/plugins`.

