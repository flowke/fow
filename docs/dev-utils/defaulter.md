# Defaulter

Defaulter 用于对 对象进行改造. 器流程为:

`Object -> Defaulter -> newObject`

## 使用

```js
const {Defaulter}  = require('@fow/dev-utils')

module.exports = class DfOptions extends Defaulter{
  constructor(){
    super();

    this.set('devServer.port', 3005);
    ...

    // userValue : 用户在此路径设置的值
    this.tf('dev.port', (userValue, dfOptions)=>{
      return value
    });
    ...

    this.alter('dev.port', (userValue, dfOptions)=>{
      ... 直接操作数据
    });
    ...

    this.push('dev.port', userValue/[userValue])
  }
}
```

## 实例 api

### define(path, dfValue, type="set", isForce=false)

path: 值所在的路径, 如:

```js
let obj = {
  a: {
    c: {
      x: 5
    }
  }
}
obj.a.c.x 的访问路径为: 'a.c.x'


```

dfValue: 值, 根据 type 不同

type: 

- set: 在此路径设置值, 如果有相同路径, 覆盖
- tf/transform: dfValue 是 handler(userValue, options) -> value
- alter: dfValue 是 handler(userValue, options), 只运行 dfValue
- push: 把 userValue 改造成 array, push 到 path


isForce: true, 强制设置值, 不过用户有没有在此路径设置了值; false: 只有用户没有相应配置值, 才进行默认设置

### addType(name, handler)

新增自定义的处理方式


## generate(userOptions)

options: 用户定义的配置数据

## 快捷别名 [type](path, value, isForce)

type: define 方法的点个参数所指明的类型

例如: set( path, value, ifForce ) 相等于 define(path, dfValue, 'set', isForce=false)

