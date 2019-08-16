# dev-util

## Defaulter

### API

约定术语:

`config`: 你的配置对象

`dataPath`: 
数据位置. 如果有这个一份config数据: {a:{b:1}}

那么: config.a.b 值的 dataPath 就是: 'a.b'.

### `set(dataPath, [strategy,] defaultValue)` 

- dataPath: 指向的数据位置
- strategy: optional, <undefined, 'define', 'make', 'append'>
- defaultValue: 默认值

strategy 的 4 个值:

**undefined:** 
`type: undefined`

set 函数 的 length===2 时, strategy 值为 undefined. 

如果 config 的 dataPath 指向的值为 undefined, 默认值生效.

如: 
```js
defaulter.set('foo.baz', 8)

defaulter.process({})

// 会产生如下 data:

{
  foo: {baz: 8}
}

```

**define:**  
`type: string`

此时 `defaultValue` 参数需要是一个 `function`, 接收两个参数: config 的 dataPath 的 value, 和整个 config 对象;

无论 config 的 dataPath 指向何值, 都会进行赋值动作, 结果为 defaultValue 函数的执行结果.

如: 
```js
defaulter.set('foo.baz', 'define', (val, config)=>{
  if(val===true) return {a:1};
  return Object.assign({},val)
})

defaulter.process({
  foo: {baz: true}
})
// 会产生如下 data:

{
  foo: {baz: {a:1}}
}

```

**make:**  
`type: string`

此时 `defaultValue` 参数需要是一个 `function`, 接收参数: config 对象


如果 config 的 dataPath 指向的值为 undefined, 进行赋值, 结果为 defaultValue 函数的执行结果..

如: 
```js
defaulter.set('foo.baz', ' make', (config)=>{
  if(config.mode===dev) return true;
  return false
})

defaulter.process({
  dev: true
})
// 会产生如下 data:

{
  dev: true,
  foo: {baz: true}
}

```

**append:**  

值为数组, push 数据