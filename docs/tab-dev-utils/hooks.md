# Hooks

hook 是一个发布订阅模式模型的实现.

Hooks 类 用来存储 hook 实例, 并提供方法快速设置多个 hook 实例的方法.

## 使用

```js
const {Hooks} = require('@fow/dev-utils')

let hooks = new Hooks().setHooks({
  add: ['addFn']
});

hooks.add.onCall((fn)=>{
  fn('xxx')
})

hooks.add.call((x)=>console.log('add:'+ x));
// 会打印: "add: xxx"
```

## Hooks 的 实例属性

hooks : 拿到注册的所有 Hook 实例

## Hooks 的 实例方法

### setHooks(obj): 设置 Hook

```js
args 是 hook 注释说明, 对代码运行没有实际影响.
包括: 传给回调函数的参数列表, hook 类型

建议按照以下规范进行定义: 
数组前面是回调函数的参数列表, 最后一个元素是 hook 类型:

[...args, hook 类型], 如: `[addFn, 'call']`,

hook 类型由触发 hook的方式决定, 如果: 'call', 'asyncParallelCall' 等等

obj= {
  name: [arg1,arg2,arg3, hookType]
}

```

# Hook 类

## Hook 实例方法

### onCall(msg, callback)
注册一个同步的 listener

msg:字符串,  错误说明符号. 帮助定位 callback 中的运行时错误.

callback: listener, 可以直接抛出错误


### onAsync(msg, callback)
注册一个异步的 listener

取决于 触发的方式, listener 可能会并行或串行执行. 

- msg:字符串,  错误说明符号. 帮助定位 callback 中的运行时错误.
- callback: listener,
- 
有两种方式能实现异步:
1. callback return Promise, 错误正常抛出
2. 除了调用者传递的参数, hook 也会填充一个 done 函数在参数列表的末尾, 执行 done([error]) 表示完成. 如果有 error, 传递给 done, 也可以直接 throw 

### call(...args) 

触发 onCall 监听的 listener


### asyncParallelCall

触发 onAsync 监听的 listener, 所有 listener 异步并行执行

### asyncSeriesCall

触发 onAsync 监听的 listener, 所有 listener 异步串行执行