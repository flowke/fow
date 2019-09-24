const Defaulter = require('../../defaulter');

module.exports = class DfOptions extends Defaulter{
  constructor(){
    super();

    this.set('devServer.port', 3005);
    this.set('devServer.quiet', true);
    this.set('devServer.host', '0.0.0.0');
    this.set('devServer.hot', false);

    this.set('appRoot', process.cwd());

  }
}