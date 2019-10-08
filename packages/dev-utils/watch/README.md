
## properties

### watches

```js
watches {
  name: node
}

node {
  watcher: ,
  paths: [],
  events: [],
  callbacks: []
}

```

# methods

##   add(name, paths=[], events='',callback)
新增 watch 的项

paths: watch 的路径

events: 
  string: 'addDir,change'
  object: {
    pathName: 'addDir'
  }


## close(name, rm=false)

## unwatch(name, paths)

## run(options={})

options: watch options