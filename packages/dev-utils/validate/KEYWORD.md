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


## addKeyword

```js
ajv.addKeyword(keyword name, {
  type: 'number', // 会对那些 type 生效, 值类型是: 字符串或数组

  compile(),
  validate(),
  macro(),
  inline() => string code,
  schema: true|false,  验证时不会 pass schema,
  metaSchema
});
```

有 4 中方式定义 keyword: 

- validation function
- compilation function
- macro function
- inline compilation function : 需要返回代码(string), 这些代码会内联到当前已经编译的 schema 中 

