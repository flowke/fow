# class Defaulter

## 实例 api

### define(path, dfValue, type="replace", isForce=false)

path: 值所在的路径

dfValue: 值, 根据 type 不同

type: 

- replace: 在此路径设置值, 如果有相同路径, 覆盖
- tf/transform: dfValue 是 handler(userValue, options) -> value
- alter: dfValue 是 handler(userValue, options), 只运行 dfValue
- push: 把 userValue 改造成 array, push 到 path


isForce: true, 强制进行默认值处理; false: 只有用户没有相应配置值, 才进行默认设置

### addType(name, handler)

新增自定义的处理方式


## generate(options)

options: 用户定义的配置数据