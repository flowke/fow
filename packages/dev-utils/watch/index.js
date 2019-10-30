const chokidar = require('chokidar');
const uuidv4 = require('uuid/v4');
class WatchNode {
  constructor(){
    this.paths = [];
    this.events = [];
    this.callbacks = [];
    this.watcher = null;
  }

  close(){
    if(this.watcher) this.watcher.close()
  }

  unwatch(){
    if (this.watcher) this.watcher.unwatch(this.paths)
  }
}

module.exports = class Watch{
  constructor(baseWatchOption={}){
    this.baseWatchOption = baseWatchOption;
    this.watches = {}
    this.commonEvents = []
    this.paths = {}
    this.hasRun = false
  }

  on(events, callback) {
    this.commonEvents = events.split(',').map(e => e.trim())
  }

  addCallback(name, fns){
    let node = this.watches[name];
    if (node){
      node.callbacks = node.callbacks.concat(fns)
    }
  }


  add(obj={}){

    let {
      name,
      paths=[],
      events='',
      callback,
      option = {}
    } = obj;

    if (!name) name = 'a'+uuidv4();
    
    if (!this.watches[name]){
      this.watches[name] = {
        paths: [],
        events: [],
        callbacks: [],
        option: option
      }
    }

    
    
    let node = this.watches[name];

    node.paths = node.paths.concat(paths)

    if(typeof events === 'string'){
      let evts = events.split(',').map(e => e.trim());
      node.events = node.events.concat(evts);
    }else if(typeof events === 'object' && events !== null){
      for(let key in events){
        node.events.push({name: key, fn: events[key]});
      }
    }

    if(callback){
      node.callbacks.push(callback)
    }

    // console.log(this.watches);
    
  }

  close(name, rm=false){

    if(name===undefined || name === 'all'){
      for(let key in this.watches){
        close.call(this,key, rm)
      }
    }
    

    function close(name, rm){
      let w = this.watches[name];
      if (w) {
        if (w.watcher) w.watcher.close();
        
        if (rm) delete this.watches[name]
        
      }
    }

  }


  unwatch(name, paths){
    let w = this.watches[name];

    if (w && w.watcher){
      w.watcher.unwatch(paths);
    }
  }

  run(options={}){
    if(this.hasRun){
      this.close()
    }

    this.hasRun = true;

    for(let name in this.watches){
      
      let node = this.watches[name];

      node.watcher = chokidar.watch(node.paths,{
        ignoreInitial: true,
        ...options,
        ...node.option
      })

      node.events.forEach(e=>{
        let cbs = node.callbacks;
        let evName = e;
        if (typeof e !== 'string') {
          evName = e.name;
          cbs = cbs.concat(e.fn)
        }

        node.watcher.on(evName, (p1, p2, p3) => {
          node.callbacks.forEach(fn => {
            switch (evName) {
              case 'raw':
                fn({
                  event: p1,
                  path: p2,
                  details: p3,
                  name
                })
                break;
              case 'error':
                fn({
                  error: p1,
                  name,
                  event: evName
                })
                break;
              case 'ready':
                fn({
                  name,
                  event: evName
                })
                break;
              case 'add':
              case 'addDir':
              case 'change':
                fn({
                  name,
                  event: evName,
                  path: p1,
                  stats: p2
                })
                break;

              default:
                fn({
                  name,
                  event: evName,
                  path: p1
                })
                break;
            }
          })
        })
        
      })


    }
  }
}

