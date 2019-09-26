// 控制 App 文件的生成

const Hooks = require('../hooks');
const schema = require('./config/BaseOptionsSchema');
const validate = require('../validate');
const Defaulter = require('./config/DefaultOptions');



class Runner extends Hooks{

  constructor(){
    super();
    this.setHooks({
      addSchema: ['add']
    })
  }

  run(){
    
  }

  getOptions(options){
    let defaulter = new Defaulter();

    // add schema
    this.hooks.addSchema.call(s => validate.ajv.addSchema(s));
    

    let defaultOptions = defaulter.generate(options);

    
  }

  generateApp(){

  }

  generateWebpackConfig(){

  }

}