const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
var notifier = require('node-notifier');

class Notifier{
  constructor(params){
    this.parsms = params;
  }

  apply(compiler){
    notifier.removeAllListeners();
    new WebpackBuildNotifierPlugin(this.parsms).apply(compiler)
  }
}

module.exports = Notifier;