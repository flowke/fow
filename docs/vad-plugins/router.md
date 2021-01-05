# router

`type: boolean`

设置为 true 后, 就直接设置了 vue-router 功能.

此时无需开发者编写 实例化 `vue-router` 的相关代码. 直接在项目中使用.

可以在 `router/index.js` 设置 router 配置文件.


以下是 `router/index.js`, 默认导出一个 符合 vue-router 路由配置对象即可:

```js
// router/index.js

export default {
  routes: [
    { 
      path: '', 
      component: '@layout.base' , // @语法相当于 
      children: [
        {
          path: '',
          component: '@@pages.home/home'
        }
      ]
    },
  ]
}
```

唯一不同的地方在于可以使用 `@` 或 `@@` 语法来引入组件. 也可以不使用,以上文件等价类似于:

```js
// 内部可能不叫 LayoutBase 名, 防止命名冲突
import LayoutBase from '@/layout/base.vue'
export default {
  routes: [
    { 
      path: '', 
      component: '@layout.base' , // @语法相当于 
      children: [
        {
          path: '',
          component: import('@/pages/home/home.vue')
        }
      ]
    },
  ]
}

```
