// 控制 App 文件的生成

const Hooks = require('../hooks');
const schema = require('./config/BaseOptionsSchema');
const validate = require('../validate');



class Runner extends Hooks{

  constructor(){
    super();
    this.setHooks({
      addSchema: ['add']
    })
  }

  run(){
    
  }

  getOptions(){
    // add schema
    this.hooks.addSchema.call(s => validate.ajv.addSchema(s));

    let 
  }

  generateApp(){

  }

  generateWebpackConfig(){

  }

}