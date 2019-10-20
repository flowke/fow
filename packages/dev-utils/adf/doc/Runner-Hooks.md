# Runner Hooks

## patchSchema: [patchFn(schema)]

patch option 的 schema.

addfn(schema);

schema 会填充到以下位置:

```js
{
  ...其它默认 schema,
  properties: {
    ... 其它默认 schema,
    ... addFn 传入的 schema
  }
}
```

不能与已经存在的配置项冲突, 否则此次 addSchema 失败, addFn 返回 `{error:error}`,

## addDefaultOption: [defaulter'],

使用 defaulter 设置默认配置, 

## mayPath mayPath: [addPathFn'],

注册一些路径, 可以判断是否存在, 路径是什么

## entry: ['entryNode','runnerConfig', 'webpackConfig'],

单页模式可以修改 entryNode 

entryNode: {name, compPath: 加载 entry 的路径, entry: chunkBlock实例}

## entries: ['entries','runnerConfig', 'webpackConfig'],

单页模式可以修改 entryNodes

## emitFile: ['addAppFileFn']

添加要生成的文件

addAppFileFn参数 list:

## webpack: ['webpackConfig']

修改 webpack, 

webpackConfig: webpackConfig实例

# watch: ['addWatchFn']

监视文件, 决定是重启 server 还是 重新生成文件