# Error Hooks

error-hooks 能够帮助你集中式的注册一些 hook, 特殊的部分在于, 当你抛出错误(内置错误或自定义错误), 能够自动的触发相关的 hooks.

在以下术语中:

hook === 事件

type === 类型

在后续文字中, 会混用这些术语.

## 用例

```js
import hooks from '@fow/error-hooks';

// 批量注册, hook type
// 可以注册同名 type
hooks.register({
  // 以 'E:' 开头的 hook type , 后面部分为错误类型, 挂载在 Error 上
  'E:MsgError': ctx=>{
    let {
      error, // 错误对象
      catch, // 一个函数, 执行后会捕获掉错误
      payload, // 抛出自定义错误时带来的一些额外数据, 
      promise, // 如果此错误是 promise rejection 传递的错误, promise 会在此填充
    } = ctx;

    //  一旦调用, 会捕获掉此错误, 此时错误不会输出到控制台
    catch()
    // ... do something
  },
  'E:Error': ctx=>{

    // ... do something
  },
  'E:OtherError': ctx=>{

    // ... do something
  },

  // 一些正常的 hooks, 需要通过 dispatch 触发
  success: ctx=>{

  }

})

// 触发 'E:MsgError' 对应的回调, 自定义错误的第二个参数是 payload
throw new Error.MsgError('message', payload)

// 触发 'E:Error' 对应的回调
throw new Error('message')
throw new Error.Error('message', payload)

// 触发 'E:OtherError' 对应的回调
throw new Error.OtherError('message', payload)

// 正常触发的 hook, 第二个参数为整个 ctx
hooks.dispatch('success', ctx)

```

## 实例方法

### hooks.register(HookTypesObj)

注册一系列 hook type, 也就是事件类型和对应的回调函数

以下是 HookTypesObj 的详细格式:

```js
{
  'E:MsgError': (ctx)=>{

    // 如果此事件通过, throw Error.MsgError() 触发, 会自动填充以下数据
    let {
      error, // 收到的错误对象
      catch, // 一个函数, 执行后会捕获掉错误
      payload, // 抛出自定义错误时带来的一些额外数据, 
      promise, // 如果此错误是 promise rejection 传递的错误, promise 会在此填充
    } = ctx;
  },

  success: (ctx)=>{

  }


}

```

以上代码中, 定义了两个 hook type.

触发的方式就是 `hooks.dispatch(type, ctx)`,

例如: 

```js
hooks.dispatch('E:MsgError', {
  // 一些数据
})
hooks.dispatch('success', {
  // 一些数据
})

```

**'E:xxx'** 有点奇怪!!!

'E:MsgError' 是一个特殊的事件类型, 可以通过 throw 错误来触发.

这个 type 分为两部分: 'E' 和 'type':

* E: 代表这是一个可以通过抛错触发的 事件类型.
* xxx 代表 错误类型, 会挂载到 Error 上.

例如注册了一个 'E:MsgError' 的事件, 则 Error 上会挂载一个 MsgError的错误类, 你可以通过以下方式抛出:

throw new Error.MsgError(message, payload)

这个类接收两个参数: 错误 message 和 payload,

* message: 错误的提示信息
* payload: 可选的数据, 传递后会填充到 ctx 里


### hooks.dispatch(type, ctx)

手动发布事件, ctx 会被传递到 listener 中


### hooks.remove(type, [listener])

移除某个事件对于的回调函数, 不传递 listener 则移除所有回调

### hoos.add(type, callback)

单独添加一个事件



## 使用技巧

### 1. 监听全局的运行时错误

你可以全局的监听一些运行时错误, 除了 Error 外, 其它的内置错误也可以监听, 包括: EvalError, RangeError, ReferenceError, SyntaxError , TypeError, URIError 等

例如: hooks.register({
  'E:Error': (ctx)=>{

  }
})

此时你可以监听到全局范围内在运行时抛出的 Error.

例如: throw new Error('测试错误!')

如果是主动抛出的 Error , 你有两种方式来往 ctx 填充 payload:

```js
throw new Error.Error(msg, payload)

或

let err = new Error(msg)

err.payload = {...}


```

### vue 的边界错误

Vue 会自己捕获掉一些生命周期等等的错误, 导致这些错误无法传递除去. 应用此插件会把这些错误传递除去.

Vue.use(hooks.vuePlugin)