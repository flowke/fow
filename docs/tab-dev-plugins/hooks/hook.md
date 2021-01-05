
# Hook

每个 Hook 继承自 EventEmitter.

插件开发者只需关注 hook 以下的方法来注册 listener, 注册的方式由调用者决定.

更多 hooks 相关信息查看 : [dev-utils/hooks](/dev-utils/hooks.md)


## onCall(msg, callback)
注册一个同步的 listener

msg:字符串,  错误说明符号. 帮助定位 callback 中的运行时错误.

callback: listener, 可以直接抛出错误


## onAsync(msg, callback)
注册一个异步的 listener

取决于 触发的方式, listener 可能会并行或串行执行. 

- msg:字符串,  错误说明符号. 帮助定位 callback 中的运行时错误.
- callback: listener,

有两种方式能实现异步:
1. callback return Promise, 错误正常抛出
2. 除了调用者传递的参数, hook 也会填充一个 done 函数在参数列表的末尾, 执行 done([error]) 表示完成. 如果有 error, 传递给 done, 也可以直接 throw 