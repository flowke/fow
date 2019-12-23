
# 配置

配置文件位于项目中的: `config/config.js`.

以下是一个配置项文件实例 : 

```js
// config/config.js
const VadPlugin = require('@fow/vad/plugins')
module.exports = {
  devServer: { // 定义开发服务器的行为, 同 webpack devServer
    port: 3006
  },
  defaultProcessEnv: { // 定义在项目中可以通过 process.env.xxx 来访问的字段
    // access it with process.env.BUILD_TYPE
    BUILD_TYPE: 'test'
  },
  defineVar: { // 在项目中定义全局变量
    // access it with NAME
    NAME: 'Hue'
  },
  compatibility: { // 定义项目中开发者编写的代码的兼容性, 同 
    level: , //0,2,3

    // targets config for browserslist
    // https://github.com/browserslist/browserslist
    targets: {
      "chrome": "58",
      "ie": "11"
    }
  },

  splitRuntime: false,

  plugins: [ // 插件列表
    new VadPlugin({
      router: true,
      vuex: true,
      puta: true
    })
  ],

  webpackChain: ()=>{},

  paths: { // 定义打包输出路径, 输出文件的命名等等
    outputPath: './dist',
    publicPath: '',
    // 单页的 html 模板
    appHtml: './src/index.html',
    //  app 文件夹
    assetsDir: 'static',
    hash: false,
    contentHash: true,
    js: '',
    css: '',
    fonts: '',
    img: '',
    media: '',
    'otherFiles': '',
    patterns: []
  }

}

```

## plugins

`type: array`

注册插件列表.

更多关于 `@fow/vad/plugins` 的内容请查看这里.

## devServer

`type: object`

定义开发服务器的行为, 配置项同 [webpack devServer ](https://webpack.docschina.org/configuration/dev-server/)

## defaultProcessEnv

`type: object`

 定义在项目中可以通过 process.env.xxx 来访问的字段, 如:

 ```js
// config/config.js

{
  defaultProcessEnv: {
    BUILD_VERSION: 'test'
  }
}

// 项目中文件中访问: BUILD_VERSION

console.log(process.env.BUILD_EERSION === 'test') // =>true

 ```
## defineVar

`type: object`

 定义在项目中可以可以访问全局变量, 如:

 ```js
// config/config.js

{
  defineVar: {
    G_SUBJECT: 'english'
  }
}

// 项目中文件中访问: G_SUBJECT

console.log(G_SUBJECT === 'english') // =>true

 ```
## compatibility

`type: object`

定义开发者代码的兼容性. 这意味着一般来说, 它无法约束第三方包(如通过 npm 安装的包)的兼容行为. 除非改变 webpack 中关于 babel-loader 的相关行为.

它的配置会经过一些转换并传递给 `@babel/preset-env` .


 ```js
// config/config.js

{
  compatibility: {
    level: 0,
    targets: string | Array<string> | { [string]: string }, defaults to {}.
  }
}

// 项目中文件中访问: G_SUBJECT

console.log(G_SUBJECT === 'english') // =>true

 ```
### compatibility.level

有三个 level 取值:

0: 不使用 corejs 进行polyfill
2: 使用 corejs@2 进行polyfill
3: 使用 corejs@3 进行polyfill, 会包括实例属性的 polyfill, 例如: `"foobar".includes("foo")`

### compatibility.targets

`type: string | Array<string> | { [string]: string }, defaults to {}.`

定义兼容的目标

同 [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env#targets) target 的配置.

详情查看 https://github.com/browserslist/browserslist

这决定了 babel 是否需要都某些代码进行 transform 和 polyfill.

## splitRuntime

`type: boolean`

是否生成一个共享的, 额外的 runtime文件.

## webpackChain

`type: fn: chain=>{}`

一个函数, 接收一个 chain 作为参数, 用于修改 webpack 的行为:

```js
{
  webpackChain: chain=>{
    // 使用 webpack-chain 的相关 api 进行操作
  }
}
```

## paths

`object, defaults: {}`

此配置项用于 配置和文件路径相关的选项, 例如 输出目录, 文件位置等等.

以下是一个配置项示例: 


```js
{
  paths: {
    outputPath: './dist',
    publicPath: '',
    // 单页的 html 模板
    appHtml: './src/index.html',
    //  app 文件夹

    assetsDir: 'static',
    hash: false,
    contentHash: true,
    js: '',
    css: '',
    fonts: '',
    img: '',
    media: '',
    'otherFiles': '',
    patterns: []
  }
}


```

### paths.outputPath

`string, default: 'dist'`

相当于定义 webpack 配置的 output.path, 此处可以是相对路径或绝对路径.

### paths.publicPath

`string, default: ''`

相当于定义 webpack 配置的 output.publicPath.

### paths.appHtml

`string, default: './src/index.html'`

相当于定义 html-webpack-plugin` 的 template`.


### paths.assetsDir

`string, default: 'static'`

放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputPath 的) 目录。

### paths.contentHash

`string / boolean, default: true`

配置 输出文件名的 contentHash 格式,  

- false 为不生成 contenthash.  
- true 为 "[contenthash:8]"
- string, 自定义 contenthash 的格式, 参考: [webpack output.filename](https://webpack.js.org/configuration/output/#outputfilename)

### paths.hash

`string / boolean, default: false`

配置 输出文件名的 hash 格式, **只在 contentHash 为 false 时生效**.

- false 为不生成 hash.  
- true 为 "[hash:8]"
- string, 自定义 contenthash 的格式, 参考: [webpack output.filename](https://webpack.js.org/configuration/output/#outputfilename)


### paths.js

`string, default: ''`

定义 js 文件的输出.

值示例: `static/js/[name].[contenthash:8].js`

相当于配置 webpack 的 output.filename 和 output.chunkFilename. 对此配置有影响.

string 的格式符合 webpack output.filename 的格式, 不过此处设置的 .js 后缀会被忽略.

假定值为: `'static/js/[name].[contenthash:8].js'`, 对 webpack 产生的影响如下: 

```js
{
  output: {
    filename: 'static/css/[name].[contenthash:8].css',
    chunkFilename: 'static/css/[name].[contenthash:8].[id].chunk.css',
  }
}

```

 参考: [webpack output.filename](https://webpack.js.org/configuration/output/#outputfilename)

 > 此配置会忽略 assetsDir, hash , contenthash 配置

### paths.css

`string, default: ''`

定义 css 文件的输出.

值示例: `static/css/[name].[contenthash:8].css`

相当于配置 [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) 的 filename 和 chunkFilename

string 的格式符合 mini-css-extract-plugin option.filename 的格式, 不过此处设置的 .css 后缀会被忽略.

假定值为: `'static/js/[name].[contenthash:8].css'`, 对mini-css-extract-plugin影响如下: 

```js
{
  filename: 'static/js/[name].[contenthash:8].js',
  chunkFilename: 'static/js/[name].[contenthash:8].[id].chunk.js',
}

```

参考: [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

 > 此配置会忽略 assetsDir, hash , contenthash 配置

### paths.img

`string, default: ''`

值示例: `static/img/[name].[contenthash:8].[ext]`

定义图片文件的输出位置, 影响的文件为: `.bmp, .gif, .jpg, .jpeg, .png`

 > 此配置会忽略 assetsDir, hash , contenthash 配置

### paths.fonts

`string, default: ''`

值示例: `static/fonts/[name].[contenthash:8].[ext]`

定义字体文件的输出位置, 影响的文件为: `.ttf, .eot, .woff, .woff2`

 > 此配置会忽略 assetsDir, hash , contenthash 配置

### paths.media

`string, default: ''`

值示例: `static/media/[name].[contenthash:8].[ext]`

定义音频视频文件的输出位置, 影响的文件为: `.avi、.mpeg、.mp4、.mov、.mkv、.wmv、.flv、.rmvb、.webm, .mp3, .ogg, .wav`

 > 此配置会忽略 assetsDir, hash , contenthash 配置

### paths.otherFiles

`string, default: ''`

值示例: `static/other-files/[name].[contenthash:8].[ext]`

定义其它 **未在以上标明的文件** 的输出位置, 例如 `ab.abc` 文件后缀名未在以上识别, 打包出来的文件将放在 static/other-files/ 文件夹下.

 > 此配置会忽略 assetsDir, hash , contenthash 配置

### paths.patterns

`array< array<array|string|regexp, string> >, default: []`

patterns 是一个数组, 每一个元素也是一个数组, 

值示例: 

```js
[
  // 第一个元素 为匹配条件, 可以是 array, string, regexp
  // 第二个元素是文件位置
  [/\.abc$/, 'static/abc/[name].[hash].[ext]'],
  [[/\.aaa$/, /\.bbb$/], 'static/abab/[name].[hash].[ext]'],
]

```

在以上示例的情况下,   

- `.abc` 后缀的文件将放在 `static/abc/` 文件夹下,   
- `.aaa, .bbb` 后缀的文件将放在 `static/abab` 文件夹下

### 注意 :key::key:

 paths 的 img, fonts, media, otherFiles, patterns, 的文件名需符合 [file-loader option.name](https://github.com/webpack-contrib/file-loader#name) 的要求, 参考: [file-loader](https://github.com/webpack-contrib/file-loader#name)
