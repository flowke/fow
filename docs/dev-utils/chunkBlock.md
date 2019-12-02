# ChunkBlock

chunkBlock 提供了一些 api 来让你在一个假想的文件中写代码. 它本质只是输出一堆字符串.

## 说明
假定有一个空白文件, 当你实例化 ChunkBlock 之后你便拥有了这个空白文件.

通过 addBlock() 方法, **你可以把这个文件分成多个写代码的区域**, 并且可以排序.

一个写代码的区域就是一个 **block**.

每个 **block** 分成三个部分: 按顺序分别是: pre, code , post

写代码的时候, 需要先指定确定在哪个 block 写代码, 再确定写在这个 block 的哪个部分 ( pre, code, post) ;

**总结就是: 创建一个或多个 block,  然后决定在某个 block 的某个部分写代码.**

以下是一个使用示例:

```js
const {ChunkBlock} = require('@fow/dev-utils');

let chunk = new chunkBlock();

// 新建一个 名叫 code 的 block
chunk.addBlock({name: 'code'}); 
// 新建一个 名叫 code2 的 block
chunk.addBlock({name: 'code2'});

// 在 code 这个 chunk 的 post 部分 写一段代码
chunk.addCode('code', 'let a = 5;', 'post')
// 在 code2 这个 chunk 的 code(默认) 部分 写一段代码
chunk.addCode('code2','let b = 10;')
// 在  code 这个 chunk 的 code(默认) 部分 写一段代码
chunk.addCode('code', 'let fn = ()=>{}')

let code = chunk.genCode();

console.log(code)

/** 
打印出:

let fn = ()=>{}; // code->code
let a = 5;  // code -> post
let b = 10; // code2 -> code
*/

```

## 代码块 block 的顺序

通过 chunk.addBlock(obj) 来给文件添加代码块;

```js
obj: {  
  name: '', // 代码块的名字  
  indx: 0, //代码块权重, 默认是 0 
}```

通过 indx 来指定权重, 值越小, 代码块在文件的位置越靠前.

如果值相同, 则按照 addBlock 的调用顺序排序.

如: 

```js
  chunk.addBlock({name: 'code', indx: 0})
  chunk.addBlock({name: 'cod1', indx: 0})
  chunk.addBlock({name: 'cod3', indx: -1})

//  此时 代码块的排序为

code3 
↓
code
↓
code1

```

## Methods

### addBlocks(Array< Object >)

 一次可添加多个 block, 参数为元素是对象的数组.

```js
obj = {
  name : //block 名
  indx: //排序权重, 默认 0.
  beforeCall: ()=>{},// 在生成代码前执行的回调函数
}

```

indx 越小, 排序越靠前, 相同权重按添加先后排序.

### addBlock(obj)
一次添加一个 block.

`addBlocks([obj])` 的别名.

### addCode(name, codeStr, position='code', newLine=true)

在 block 里写入代码

- name : block 名
- codeStr: 要写的代码字符串
- position: 'pre'/'code'(默认)/'post'
- newLine : 是否结尾加换行符, 默认 true


### genCode()

生成代码, 返回代码字符串

### beforeGenCode()

生成代码之前(genCode) 执行的生命周期函数.

由继承者实现, 或实例化之后实现.

### import(str, position='code', newLine=true)

实例自带一个 'import' block.
此方法为 `addCode('import', ...args)` 的别名

### code(str, position='code', newLine=true)

实例自带一个 'code' block.
此方法为 `addCode('code', ...args)` 的别名

## 注意

每个实例出厂自带两个 block: `import`, `code`

constructor 实际做了如下操作:

```js
this.addBlocks([
  {name: 'import'},
  {name: 'code'},
]);
```