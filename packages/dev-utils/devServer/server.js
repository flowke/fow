
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const EventEmitter = require('events');
const webpack = require('webpack');
const openBrowser = require('./utils/openBrowser');

const {
  useValidPort,
  parseUrl
} = require('./utils/devServerUtils');

module.exports = class Server extends EventEmitter{
  constructor() {
    super();
    this.webpack = webpack;
    this.validPort = null;
    this.devServer = null;

    this.hooks = {
      launched: (parsedUrl) => this.emit('launched', parsedUrl),
      listened: (parsedUrl) => this.emit('listen', parsedUrl)
    }
  }

  createCompiler(config) {
    let compiler = this.webpack(config);

    return compiler;
  }

  // run server
  serve(validPort, serverConfig, webpackConfig) {

    let {
      host
    } = serverConfig;
    let compiler = this.createCompiler(webpackConfig);
    const devServer = new WebpackDevServer(compiler, serverConfig);

    let parsedUrl = parseUrl('http', host, validPort);

    let firstTimeListen = true;
    devServer.listen(validPort, host, err => {
      if (err) {
        throw error
      }

      this.hooks.listened(parsedUrl);

      compiler.hooks.done.tap('done', () => {

        if (!firstTimeListen) return;
        firstTimeListen = false;
        
        printBrowserOpenInfo(parsedUrl)
        openBrowser(parsedUrl.localUrl)

        this.hooks.launched(parsedUrl);
      })

    });

    return devServer;
  }

  // prepare to run server
  run(devOption, webpackConfig) {

    let {
      port,
      host
    } = devOption;

    let p = null;

    // 获取 合法port
    if (this.validPort) {
      p = Promise.resolve(this.validPort)
    } else {
      p = useValidPort(port, host)
        .then(port => this.validPort=port)
    }

    return p
      .then(valiPort => {
        this.devServer = this.serve(valiPort, devOption, webpackConfig);
      })
      .catch(e => {
        console.log();
        console.log(chalk.cyan('stop launching the dev server.'));
        console.log('because:\n');
        console.log(e);

        process.exit(0);
      })

  }

  // start
  start(devOption, webpackConfig) {

    // process.on('warning', m => {
    //   console.log();
    //   console.log(chalk.yellow('warning on process:'));
    //   console.log();
    //   console.log(chalk.yellow.bold(m.message));
    // })

    this.run(devOption, webpackConfig);
    
  }

  // restart
  restart(devOption, webpackConfig){

    if(!this.devServer) return;
    this.devServer.close();
    process.nextTick(()=>{
      this.run(devOption, webpackConfig)
      
    });
  }

  close(){
    this.devServer && this.devServer.close();
  }

}

function printBrowserOpenInfo(urls) {

  console.log();
  console.log(chalk.cyan('opening the browser at:'));
  console.log();
  console.log(
    `  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}`
  );
  console.log(
    `  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}`
  );

  console.log();

}