const Defaulter = require('../../defaulter');
const path = require('path');

module.exports = class DfOptions extends Defaulter{
  constructor(){
    super();

    this.set('devServer.port', 3005);
    this.set('devServer.quiet', true);
    this.set('devServer.host', '0.0.0.0');
    this.set('devServer.hot', false);

    this.set('appRoot', process.cwd());

    this.set('showFiles', true);

    this.set('paths.outputPath', path.resolve('./dist/'));
    this.set('paths.publicPath', '');
    this.set('paths.appSrc', './src');
    this.set('paths.assetsDir', 'static');
    this.set('paths.hash', false);
    this.set('paths.contentHash', true);
    this.set('paths.js', '');
    this.set('paths.css', '');
    this.set('paths.fonts', '');
    this.set('paths.img', '');
    this.set('paths.media', '');
    this.set('paths.otherFiles', '');
    this.set('paths.patterns', []);

    this.set('globalVar', {});

    this.set('compatibility.level', 0);

    this.set('clientEnv.NODE_ENV', process.env.NODE_ENV || 'production');

    this.set('webpackChain', f => f);

  }
}