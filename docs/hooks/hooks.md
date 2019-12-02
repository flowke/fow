
# Hooks
<!-- {docsify-ignore} -->

**以下 hooks 继承自 vad**

## patchSchema : patchFn (内部)
执行方式: call

用于扩充 config 的验证 schema. 传递一个 patch 函数

## addDefaultOption : defaulter (内部)
执行方式: call

用于加工用户配置文件信息. 比如定义默认值等等. 传递一个 defaulter 对象.

## installPlugin : runner (内部)
执行方式: call

安装第三方插件前夕执行.

## afterPluginRun : runner
执行方式: call

所有第三方插件安装完毕

## defineEntry : entryContainer (内部)
执行方式: call

vad 独有

定义 entry 的容器. entry 阶段的 entries 在此时填充

entryContainer: 一个空数组, 往里面填充基础的 chunkBlock 实例.

## entry : entries, runnerConfig, webpackConfigAPI
执行方式: call

此时可以修改程序入口.

传递以下参数: 
- entries: [chunkBlock,...], 数组, 元素为 chunkBlock 实例
- runnerConfig
- webpackConfigAPI: 一个可以操作 webpack 的 对象

## emitFile : addAppFileFn, tempDir
执行方式: call

此时可以添加需要输出的文件.

传递以下参数: 
- addAppFileFn: 指定输出内容和路径
- tempDir:  adf 提供的临时目录

## webpack : webpackConfigAPI
执行方式: call

可以对 webpack 进行修改.


传递以下参数: 
- webpackConfigAPI: 一个可以操作 webpack 的 对象

## watch : addWatchFn

可以添加要 watch 的文件以及指定行为. 传递一个 addWatchFn 函数

比如某些文件变更后, 需要进入 restart/reemit 的生命周期.

## restart (第三方无需实现)

重新启动

## reemitApp

重新生成入口. 

如果某些 watch 的文件变化了, 需要重新生成入口文件. 此时可以在这这个生命周期做一些清理工作, 因为和入口生成的相关 hook 会重新触发.