# class Defaulter

## 使用

```js
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

path: 值所在的路径

dfValue: 值, 根据 type 不同

type: 

- set: 在此路径设置值, 如果有相同路径, 覆盖
- tf/transform: dfValue 是 handler(userValue, options) -> value
- alter: dfValue 是 handler(userValue, options), 只运行 dfValue
- push: 把 userValue 改造成 array, push 到 path


isForce: true, 强制进行默认值处理; false: 只有用户没有相应配置值, 才进行默认设置

### addType(name, handler)

新增自定义的处理方式


## generate(options)

options: 用户定义的配置数据

## [type](path, value, isForce)

type: define 方法的点个参数所指明的类型

例如: set( path, value, ifForce ) 相等于 define(path, dfValue, 'set', isForce=false)

