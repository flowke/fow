const detectPort = require('./detectPort');
const inquirer = require('inquirer');
const chalk = require('chalk');
const localIp = require('./localIp');
const url = require('url');

// 询问是否使用新端口
function inquirerPort(port, validPort) {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'usePort',
      message: chalk.yellow(`port ${port} is inuse, type enter or y key to use ${validPort} instead?`),
      default: true
    }
  ])
  .then(data=>{
    if(data.usePort){
      
      console.log();
      console.log(chalk.green(`server will listen at port ${validPort}.`));
      console.log();
      
      return validPort;
    }else{
      throw new Error('do not use port');
    }
  })
}

// 得到url, 某些url带格式
exports.parseUrl = function(protocol, host, port){
  const formatUrl = hostname =>
    url.format({
      protocol,
      hostname,
      port,
      pathname: '/',
    });
  const prettyPrintUrl = hostname =>
    url.format({
      protocol,
      hostname,
      port: chalk.bold(port),
      pathname: '/',
    });
  const isUnspecifiedHost = host === '0.0.0.0' || host === '::';

  let prettyHost;
  
  if (isUnspecifiedHost){
    prettyHost = 'localhost';
  }else{
    prettyHost = host;
  }

  return {
    lanUrlForTerminal: prettyPrintUrl(localIp()),
    localUrlForTerminal: prettyPrintUrl(prettyHost),
    localUrl: formatUrl(prettyHost)
  }
}

// 期望得到一个可用的端口
exports.useValidPort = (port, hostname)=>{
  return detectPort(port, hostname)
  .then(validPort=>{
    if(validPort!==port){
      return inquirerPort(port, validPort)
    }else{
      return validPort
    }
  })
  .then((port)=>{
    return port;
  });
}
