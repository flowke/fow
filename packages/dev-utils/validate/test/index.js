
const { EventEmitter} = require('events');

let ev = new EventEmitter();

ev.on('e', (s)=>{
  try {
    s();
  } catch (error) {
    ev.emit('error', error)
  }

  
  console.log('e here');
  
  
  // throw new Error('some');
});

ev.on('e',()=>{
  console.log('ecs');
  
})

ev.on('error', (e)=>{
  console.log('err');
  
})

ev.emit('e', ()=>{
  throw new Error('tierg')
})

console.log('done');
