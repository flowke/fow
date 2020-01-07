# dev-utils 

dev-utils 是一个 vad 的开发工具包. 帮助你快速进行 vad 插件开发.

## 安装

```bash
npm i @fow/dev-utils
```

## 使用

```js
const {
  ChunkBlock , // 操作文件内容
  Defaulter , // 处理配置
  Hooks ,  // hook
  Validate , // ajv 验证器
  Watch , // watch 文件
  ast , //  ast 处理
} = require('@fow/dev-utils')
```