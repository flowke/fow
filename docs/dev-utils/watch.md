# Watch
watch 提供一下功能来监视文件变化的不同事件.

下层依靠 chokidar 来进行文件监视.

[chokidar文档](https://github.com/paulmillr/chokidar)

## 使用

以下出现的代码详情查看:

- paths: 监听的路径, 详情查看: [API](https://github.com/paulmillr/chokidar#api)
- 事件名: 相关事件名和解释: 请查看: [methods--events](https://github.com/paulmillr/chokidar#methods--events)

```js
let {Watch} = require('@fow/watch')

let w = new Watch();

// 添加一个 watch 节点
w.add({
  name: 'srcFile', // 名字, 可选
  paths: ['/src/**'],
  events: 'add,unlink,change',
  callback: ctx=>{
    console.log(ctx)
  }
})

w.add({}) 
... // 添加多个 watch 节点

// 开启监视行为, 可以传入一个option对象作为参数
// option 同 chokidar.watch(paths, option)
w.run({})

// 移除 srcFile 这个节点的 监视行为
// 如果不传入节点名, 则停止所有节点的监视
w.close('srcFile')

```


# methods

## constructor(option)
 option 同 chokidar.watch(paths, option)

## add(obj)
新增 watch 的项

```js
add({
  name: 'srcFile', //要监视的节点名, 以便在如何访问, 可选
  paths: [], //数组,  watch 的路径, 
  events: //string 或 Object
    //string: 'addDir,change' // 'event,event...' 格式指定监听的事件列表
    // object: {
    //   pathName: 'addDir'
    // }
  callback: 回调函数,
  option: {}, 
})
```


## close(name, rm=false)

name:  
移除某个监视节点的监视行为, 
如果不传入节点名, 则移除所有监视的节点

rm: 是否取消某个节点监视行为的同时连同把整个节点也删除. 日后无法再次重启此节点的监视

## unwatch(name, paths)

## run(options={})

 option 同 chokidar.watch(paths, option)

开启所有节点的监视