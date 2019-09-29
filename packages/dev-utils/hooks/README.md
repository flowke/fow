
# Hooks

## Usage

```js
let hooks = new Hooks().setHooks({
  add: ['addFn']
});

hooks.add.onCall((fn)=>{
  fn('xxx')
})

hooks.add.call((x)=>console.log('add:'+ x));
// 会打印: "add: xxx"
```

## Properties

hooks : 注册的所有 Hook 实例

## methods

setHooks(obj): 设置 hook

obj= {
  name: [arg1,arg2,arg3]
}

# Hook

## Properties

name: 名字

## methods

### call

call(arg1, arg2...) 
触发同步事件


