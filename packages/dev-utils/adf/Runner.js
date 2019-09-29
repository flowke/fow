// 控制 App 文件的生成

const Hooks = require('../hooks');
const schema = require('./config/BaseOptionsSchema');
const validate = require('../validate');
const Defaulter = require('./config/DefaultOptions');
const jsonmergepatch = require('json-merge-patch');
const toArr = require('@fow/visitor/toArr');



class Runner extends Hooks{

  constructor(){
    super();
    this.setHooks({
      addSchema: ['addFn'],
      addDefaultOption: ['defaulter']
    })
  }

  run(userOptions){
    // generate Options
    let options = this.getOptions(userOptions);


  }

  getOptions(userOptions){

    // patch schema
    this.hooks.addSchema.call((s={}) => {

      let result = {error: null}

      try {
        // 是否有相同的 properties key
        let rut = toArr(s).forEach(key => {
          if (typeof schema[key] !== 'undefined') {
            return false;
          }
        });

        if(rut === false){
          throw new Error(`There is a same key(${key}) in Schema.properties`);
        }

        jsonmergepatch.apply(schema, {
          properties: s
        });
      } catch (error) {
        result.error = error;
      }

      return result
      
    });

    // validate schema
    try {
      validate(schema, userOptions)
    } catch (error) {
      throw error;
    }
    

    let defaulter = new Defaulter();
    // add addDefaultOption
    this.hooks.addDefaultOption.call(defaulter);
    

    let options = defaulter.generate(userOptions);

    return options;
    
  }

  generateApp(){

  }

  generateWebpackConfig(){

  }

}