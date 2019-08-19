
"use strict";


const getProperty = (obj, path) => {
  let name = path.split(".");
  for (let i = 0; i < name.length - 1; i++) {
    obj = obj[name[i]];
    if (typeof obj !== "object" || !obj || Array.isArray(obj)) return;
  }
  return obj[name.pop()];
};


const setProperty = (obj, path, value) => {
  let name = path.split(".");
  for (let i = 0; i < name.length - 1; i++) {
    if (typeof obj[name[i]] !== "object" && obj[name[i]] !== undefined) return;
    if (Array.isArray(obj[name[i]])) return;
    if (!obj[name[i]]) obj[name[i]] = {};
    obj = obj[name[i]];
  }
  obj[name.pop()] = value;
};


class Combiner{
  constructor(){
    this.default = {}

    this.customTypes = {}
  }

  define(path, dfValue, type='replace', isForce=false){
    this.default[path] = {
      type,
      dfValue,
      isForce
    }
  }

  addType(name, handler){
    this.customTypes[name] = handler;
  }

  generate(options){
    options = Object.assign({},options);

    for(let path in this.default){
      let {
        dfValue, type, isForce
      } = this.default[path];

      let userValue = getProperty(options,path);

      let doAction = isForce || userValue === undefined;

      if(doAction){

        switch (type) {
          case 'replace':
            setProperty(options, path, dfValue)
            break;
        
          case 'tf':
          case 'transform':
            setProperty(options, path, dfValue.call(this, userValue, options))
            break;
          case 'alter':
            dfValue.call(this, userValue, options);
            break;
          
          case 'push': {
            if (!Array.isArray(userValue)) userValue = [userValue];
            setProperty(options, path, dfValue.concat(userValue))
            break;
          }

          default:
            throw new Error(`${path} cantnot generate with type: ${type}`);
        }

        for(let cusType in this.customTypes){
          if (type === cusType){
            this.customTypes[cusType].call(this, options, dfValue, userValue, {
              set: ()
            })
          }
        }

      }

    }

  }
}


new DF({
  a: {
    entry: {
      value: './src/index',
      s: 'call',
      handler: (val, cfg)=>{

      }
    },
    output: {
      path: '/dist'
    },
    b: {
      c: []
    },
    b2: {

    }
  }
})