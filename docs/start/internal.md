# 内部方法

# 通过 runner 实例访问的属性或方法:

## runner.tempDir 
adf 提供的一个临时目录, 例如可以把文件输出到这个地方

## runner.runnerConfig

提供以下配置信息: 
```js
runnerConfig = {
  appRoot: , 程序所在目录, 默认是 cwd
}
```

## runner.options

配置信息.

在 `installPlugin` 以及之后的 生命周期中被填充, 在此之前会是 `null`

## addWatch(obj)

同 `@fow/dev-utils/watch` 中的 [`add方法`](/dev-utils/watch#add);

不同之处在于, 可以填充一个可选的 obj.type 属性:

```js
obj = {
  type: 'reemit'/'restart'
  ...
}

如果 type 是以上两个值之一, 会 watch 的东西有变后, 或触发 reemitApp 的 hook 或 restart hook.



如果是 reemit: 还会会清理一些状态, 重新触发以下 hook, 以便重新生成入口:

- defineEntry
- entry
- emitFile
- webpack
- watch



```

## addAppFile(path, codeString)

需要生成的文件, 需要指定路径, 和文件的代码字符串.

# 在 hooks 中可访问到的方法或对象:

## chunk

在 entry 阶段, 会得到一个 chunks list: [chunk, ...].

此处的 chunk 都继承自 `ChunkBlock`, 是 `VueChunk` 的一个实例:

## WebpackConfigApi

在 entry 和 webpack 阶段, 会得到一个 WebpackConfigApi.

此时可以有机会对 webpack 进行修改.