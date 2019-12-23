# init

`type: boolean`

设置为 true 后, 可以新建一个 `src/init.js` 的文件.

```js
// src/init.js

//可以运行一些代码, 比如引入 element-ui
import Element from 'element-ui'

// 导出一个 function
export default (Vue, done )=>{
  Vue.use(Element)

  // 如果形参中声明了接收 done 参数, 则必须运行 done 才能实例化 Vue
  // 这意味着你可以异步实例化 Vue
  done(ctx=>{
    let {
      vm,
      router, // 如果开启了 router功能, 有此属性
      store // 如果开启了 vuex, 有此属性
    } = ctx;

  })
}

```
==
在 init.js 默认导出的函数中:

* 第一个参数是 Vue, 它引入自 `vue/dist/vue.runtime.esm`
* 第二个参数是一个可选的 `done` 函数.
  * 如果一旦在形参列表中声明了 done, 则必须运行, 只有在 done 运行后才能实例化 Vue, 这意味着你可以异步实例化 vue
  * 也可以往 done 里传入一个函数作为参数, 函数接收一个 ctx 对象