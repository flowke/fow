# router

`type: boolean`

设置为 true 后, 就直接设置了 vuex 功能.

此时无需开发者编写 实例化 `vuex` 的相关代码. 直接在项目中使用.

可以在 `src/store/` 文件夹和 `src/pages` 文件夹提供相关配置.

这些文件声明即可, vad 会自己处理这些文件.

有以下文件:

### `src/store/index.js`

vuex 的配置文件.

### vuex 的 modules 相关:

有两个地方:
* `src/store/modules/*.js`
* `src/pages/<name>/modules/*.js`

放置 vuex 的 module, 每个 module 就是一个文件, 文件名就是 module名. 声明文件即可, vad 会自动处理这些文件.

