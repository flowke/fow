require('colors');

module.exports = class WatchConfigPlugin{
  constructor(){} 

  run(runner){
    runner.hooks.watch.onCall(add=>{
    add({
      type: 'restart',
      name: 'config',
      paths: ['config/config.js'],
      events: 'change',
      callback: (ctx)=>{
        console.log('cause file changed, try to restart the server:'.green.bold);
        console.log(`  file: ${ctx.path}`.green);
      }
    });

    })
  }
}