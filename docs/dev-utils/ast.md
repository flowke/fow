
# AST

提供 babel 的 AST 开发套件.

## 相关手册

强烈建议读取 babel 插件手册. 以了解此开发套件. 

- [babel 插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md) | [中文](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)
- [babel-用户手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md)

以下是一些 ast 的快速链接:

- [在线解析器](https://astexplorer.net/)
- [estree 规范](https://github.com/estree/estree)
- [SpiderMonkey Parser_API 规范](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API)

## 使用

```js
const {ast} = require('@fow/ast');

let {
  t, // require('@babel/types') 的原样输出
  parser, // require("@babel/parser")
  generator, //require('@babel/generator').default;
  traverse, // require('@babel/traverse').default

  // 以上为 babel 套件的原样输出
  // 以下是以下简单封装

  parse,
  walk,
  genCode,
  walkCode, 
  walkAndGenCode,
} = ast;

```

## babel ast 套件文档

- [@babel/parser](https://babeljs.io/docs/en/babel-parser)
- [@babel/generator](https://babeljs.io/docs/en/babel-generator)
- [@babel/types](https://babeljs.io/docs/en/babel-types)
- [@babel/traverse](https://babeljs.io/docs/en/babel-traverse)

## 函数概览

### parse(code, option={}, parseFnName ='parse', full=true)

parse函数 是对 parser 的简单封装, 内部运行以下代码:

`parser[parseFnName](code, option)`;


参数说明:

full: 默认 ture. 此时 option.plugins 会开启所以选项, 否则需要自己填充 option.plugins

### walk(ast, visitor)

traverse 的别名

### genCode(ast, ...rest)
generate 的别名

### walkCode(code, visitor, ...parseOp)

直接输入 code, 然后用 visitor 访问

以下为实现:

```js
function walkCode(code, visitor, ...parseOp){
  let ast = parse(code, ...parseOp);
  
  walk(ast, visitor)
}

```

### walkAndGenCode(code, visitor={}, parseArgs=[], gennArgs=[] )

类似 walkCode , 但是会输出代码字符串

