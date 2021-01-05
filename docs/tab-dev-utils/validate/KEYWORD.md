# 新增 keyword

[新增 keyword](https://github.com/epoberezkin/ajv#defining-custom-keywords)  
[Defining custom keywords](https://github.com/epoberezkin/ajv/blob/master/CUSTOM.md)

## 概述

```js
ajv.addKeyword('range', {
  type: 'number',
  compile: function (sch, parentSchema) {
    var min = sch[0];
    var max = sch[1];

    return parentSchema.exclusiveRange === true
            ? function (data) { return data > min && data < max; }
            : function (data) { return data >= min && data <= max; }
  }
});

var schema = { "range": [2, 4], "exclusiveRange": true };
var validate = ajv.compile(schema);
console.log(validate(2.01)); // true
console.log(validate(3.99)); // true
console.log(validate(2)); // false
console.log(validate(4)); // false
```


## addKeyword -> Ajv

```js
ajv.addKeyword(keyword name, {
  type: 'number', // 会对那些 type 生效, 值类型是: 字符串或数组

  compile() => 验证函数(),
  validate(),
  macro(),
  inline() => string code,
  schema: (true)|false,  验证时不会 pass schema,

  metaSchema: 可选, 验证 keyword schema 的 schema,

  dependencies: 可选, 父 schema 必须存在的属性的 list, 会在 schema 编译阶段进行检查,

  modifying: 如果 对数据有修改, 必须设置 true,

  statements: 如果 inline keyword 生成statements, 可以传 true,

  valid: true/false, 决定是否预先验证结果, 验证函数返回的结果会被忽略. macro keywords 不能使用此选项,

  $data: 可选 true, 来支持 $data reference ,

  async: an optional true value,

  errors: boolean/'full', 来指明 keyword 是否返回 [错误,错误], 如果没有设置, ajv 会自行决定是否设置错误

});
```

有 4 中方式定义 keyword : 

- validation function(验证函数)
- compilation function
- macro function
- inline compilation function : 需要返回代码(string), 这些代码会内联到当前已经编译的 schema 中 

compile, macro and inline 是互斥的. 

validate可以单独使用，也可以附加使用来支持 $data 引用.

## Define keyword with validation function

会在 数据进行验证时调用, 会传递: 

* schema
* data
* parent schema
* current data path
* parent data object
* 在父对象中的属性名
* the root data

函数返回: boolean, 也可以在函数本身: validationFN.errors = [error,...]来返回错误

## Define keyword with "compilation" function

"compilation" function -> validation function

会在编译期间调用,  会传递: 

- schema
- parent schema
-  [schema compilation context](https://github.com/epoberezkin/ajv/blob/master/CUSTOM.md#schema-compilation-context)

validation function 会传递:

- data
- current data path
- parent data object
- 在父对象中的属性名
- the root data

## Define keyword with "macro" function

## Define keyword with "inline" compilation function

## 定义错误的方式

同步错误: validationFn.errors = [err,...] 的方式来定义错误  
异步错误: return Promise.reject(new Ajv.ValidationError([err,...])), 或 return Promise.resolve(false)

内联自定义关键字:  increase error counter errors and add error to vErrors array (it can be null). 

## 错误对象

```js
error = {
  keyword: ,

  dataPath: 默认是 js 访问的方式: ".prop[1].subProp", 如果 jsonPointers 选项是 true: "/prop/1/subProp",

  schemaPath: 到达错误点的 schemaPath,

  params: 一个对象, 不同的 keyword 附加不同的属性, 用来辅助构建 error message,

  message: 标准错误信息, (can be excluded with option messages set to false).

  schema: keyword 的 schema, (added with verbose option),

  parentSchema: the schema containing the keyword,  (added with verbose option),

  data: the data validated by the keyword, (added with verbose option),

}
```