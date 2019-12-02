# VueChunk

继承自 ChunkBlock

此外可以访问如下方法和属性:

## vueChunk.renderComp 
要渲染的组件名, 和加载组件的路径.
路径是可选的
```js
{
  name: '',
  path: ''
}
```

## vueChunk.emitPath 
chunk代码 的输出路径

## vueChunk.htmlTemplatePath 可选
这个 chunk 读取的 html 模板文件的位置, 可以修改

## vueChunk.htmlName 可选
html 模板的名字, 默认 index.html

## vueChunk.setRenderComp(componentName, path='')

要渲染的组件名, 以及在程序代码中 组件的引入路径.

## vueChunk.setNewVmCode(createCodeFn)

接收一个函数, 会给函数填充一段得到 vm 实例的代码, 实际会运行:

`createCodeFn(vueChunk.createVMCode())`

## vueChunk.createVMCode()

运行后会返回一段代码, 这段代码在程序中运行后会返回一个 vm 实例

## vueChunk.vueOption(key, value)

设置 Vue(Option), key, value, 就是 Option 中的 key, value