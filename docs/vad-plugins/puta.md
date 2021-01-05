# puta

`type: boolean`

puta 插件用于为 vad 项目提供数据请求功能. 

关于 puta 的所有功能, 请查看: https://www.npmjs.com/package/puta 

本插件本质是在 vad 项目中提供一个 puta 实例, 以及定义 puta 的配置和调用方式.

设置为 true 后, 可以新建一个 `src/services/` 的目录, 在里面放置相关的请求文件.

`src/services/` 目录约定如下: 

```
src/services/
├── puta.config.js              // 和 puta 请求相关的一些配置
├── common.js                   // 一个叫做 common的 puta api 模块, 定义接口
├── xxx.js                      // 其它 puta api 模块, 定义接口
├── ...                         // 可以有多个xxx.js 文件



```
在 services 文件夹中, 除去 puta.config.js, 可以有多个其它的文件.  
其它所有文件都是用来定义 api 的模块, 用来定义各种具体的用来请求的 url path.

## puta.config.js

以下是 `puta.config.js` 的内容详情:

```js
// 导出此值用于定义可以访问的和请求相关的 api.
// 可以在 window 访问
// 可以不导出此值, 这是默认值
export const access = {
  instance: '$req', // puta 实例
  apis: '$apis', // === $req.apis
  mApis: '$m', // === $req.mApis
}

// 新建 puta 实例时, 传递的配置对象
// 具体查看查看 puta 文档的 新建实例部分.
export const putaConfig = {
  timeout: 16000
}

// puta实例化后可以执行一个可选的回调函数
// req:  puta 实例
export const callback = (req) => {
// 此时可以通过 window 访问上面 access 定义的值
window.$req === req; // true

// 比如可以定义一些全局的interceptors
req.use(res=>{
  // 以下是伪代码, 具体根据自己的项目定
  if(res.data.stat !==1){
    throw new Error('stat !=1')
  }
  return res.data

})

...

}

```

## xxx.js

xxx.js 可以定义传递给 `.moduleRegister()` 的参数.

假设有如下 `src/services/home.js` 来定义 home 视图下相关的 api:

```js
// src/services/home.js

// 可选导出, 名字必须是 config
// puta的 配置参数
export const config = {
  baseURL: 'www.xxx.com',
}

// 默认导出, 传递个 .moduleRegister() 的第一个参数
export default {
  getGoodsList: '/hu/d',
  updateList: '/u/hh'
  
}

```
一旦拥有的以上文件一个文件, 相当于给 `.moduleRegister()` 传递了以下参数:

`.moduleRegister( apis , 'home', config)`

其中: 
* apis: 由文件 `export default` 导出的对象提供
* 'home': 文件名 'home.js' 取出后缀
* config: 由 `export const config` 导出的对象提供


## 一个示例

在假设你已经拥有上面所述的两个文件: `src/services/puta.config.js` 和 `src/services/home.js` 之后, 

你就可以在你的项目代码中如下使用请求了:

假设如下是你的 App.vue 组件文件:

```html
// App.vue
<templage>
...
</templage>

<script>

$apis.updateList.post({})
.then(res=>{
  // ...
})


</script>


```

