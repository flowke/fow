const glob = require('globby');

module.exports = class MayPath{
  constructor(options={}){
    this.options =  {
      onlyFiles: true,
      ...options
    }
    this.files = {};

    this.paths = {}
  }

  add(name, pattern, options={}, callback){
    let op = options, cb = callback;

    if(typeof options === 'function'){
      cb = options;
      op = {}
    }

    this.files[name] = {
      name,
      pattern,
      options: op,
      callback: cb
    }
  }

  sync(reFresh){

    if (reFresh && Object.keys(this.paths).length) return this.paths;

    let obj = {}
    for(let name in this.files){
      let info = this.files[name];

      let files = glob.sync(info.pattern, {...this.options,...info.options});

      if(info.callback){
        obj[name] = info.callback({files,name})
      }else{
        obj[name] = {
          has: !!files.length,
          files
        }
      }

    }

    return this.paths = obj
  }

}