

module.exports = class WatchConfigPlugin{
 constructor(){} 

 run(runner){
   runner.hooks.watch.onCall(add=>{
     add({
       type: 'restart',
       name: 'config',
       paths: ['config/config.js'],
       events: 'change',
     })
   })
 }
}