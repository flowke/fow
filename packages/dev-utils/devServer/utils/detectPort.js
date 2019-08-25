const net = require('net');

function listen(port, hostname, cb) {
  const server = new net.Server();
  server.on('error', err => {
    server.close();
    if (err.code === 'ENOTFOUND') {
      return cb(null, port);
    }
    return cb(err);
  });

  server.listen(port, hostname, () => {
    port = server.address().port;
    
    server.close();
    return cb(null, port);
  });
}

function detectPort(port, host, cb) {
  listen(port, host, (err, validPort) => {
    if(err) return detectPort(++port, host, cb);
    cb(null, validPort);
  })
}

module.exports = function(port, hostname) {
  return new Promise((rv, rj) => {
    detectPort(port, hostname, (err, port)=>{
      if(err) rj(err);
      rv(port);
    })
  });
}