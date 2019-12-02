# WebpackConfigApi

此 API 可以设置 webpack

可以访问如下方法:

##  add( callback<chain> )

添加一个规则, 如:

```js

webpackCfg.add(chain=>{
  // chain....
  此处使用 chain 进行修改
})

```

##  merge( fn=>webpackConfig )

接收一个函数, 函数需要 return 一个纯webpack 配置

## addEntry(name, path)

快速添加一个入口, 是以下函数的别名:

`add(chain=>{chain.entry(name).add(path)})`

## chainJs(cb)
cb(ChainJsMap)


## addHtml(name, op)

快速添加一个 html, add()的别名.

name: 一个字符串, 方便 chain 以后访问
op: htmlWebpackPlugin 的 option

