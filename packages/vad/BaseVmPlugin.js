

module.exports = class BaseVmPlugin{
  constructor(){
    
  }

  run(runner){

    runner.hooks.entry.onCall('BaseVmPlugin', (chunk) => {

    })
  }

}