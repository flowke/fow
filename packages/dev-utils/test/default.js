const DF = require('../defaulter');

let d = new DF();

d.set('tasty', 'define', (val)=>{
  if(val===true) return val
  return Object.assign({},val)
})

d.set('tasty.a', '1')
d.set('tasty.b', '2')
d.set('tasty.c', '3')
d.set('au', 'append', [3])

console.log(d.process({
  tasty: {d:999},
  au: [77]
}));
