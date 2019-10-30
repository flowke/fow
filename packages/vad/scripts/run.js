const VueRunner = require('../VueRunner');

function run(){
  let runner = new VueRunner()

  runner.startDev()

  return runner
}

process.on('message', (msg) => {

  if(msg==='start'){
    let r = run();
    
    r.hooks.restart.onCall('scripts-restart', ()=>{
      process.send('restart')
    })

  }

  

});