const execa = require('execa');

new Promise((rv,rj)=>{
  rv();
  rj()
})

let p = execa.command('npm i ', {
  stdio: 'inherit'
})

// console.log(p, 'p');

p.on('close', (c, s) => {
  console.log('close', c, s);

})
p.on('exit', (c, s) => {
  console.log('exit', c, s);

})
p.on('error', (err) => {
  console.log('err', err);

})

