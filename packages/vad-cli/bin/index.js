#!/usr/bin/env node

const Create = require('@fow/cli-utils/create');
const yargs = require('yargs');
const path = require('path');
require('colors');
const { fork } = require('child_process');

function tryfile(file) {
  try {
    return require.resolve(path.resolve(process.cwd(),'node_modules', file))
  } catch (error) {  
    return ''
  }
}

function logInstall(str) {
  console.log();
  console.log(`can't not find package '@fow/vad' in your project. please install it with: `)
  console.log();

  console.log(`    ${str}`.bold.green);

  console.log();
}



function runDevRunner() {
  let file = tryfile('@fow/vad/scripts/run.js')
  if(!file){
    logInstall('npm i @fow/vad');
    return;
  }
  let runnerProcess = fork(file,{
    stdio: 'inherit',
  })

  runnerProcess.once('message', (msg) => {
    if (msg === 'restart') {
      runnerProcess.kill();
      process.nextTick(()=>{
        runDevRunner();
      })
    }
  });

  runnerProcess.send('start')
}

yargs
  .alias('h', 'help')
  .alias('V', 'version')
  .command('dev', 'start devserver', {}, argv => {
    
    process.env.NODE_ENV = 'development'
    runDevRunner()
  })
  .command('build', 'build', {}, argv => {
    process.env.NODE_ENV = 'production'
    let file = tryfile('@fow/vad/scripts/build.js')
    if (!file) {
      logInstall('npm i @fow/vad');
      return;
    }else{
      require(file)()
    }
  })
  .command('$0 <create-method> [dir]', 'create a project template into a directory with a template type', yargs => {

    return yargs
      .positional('create-method', {
        describe: 'put template to current directory or init into a new directory',
        choices: ['put', 'init']
      })
      .options({

        type: {
          alias: 't',
          describe: 'type of template name',
        },
        force: {
          alias: 'f',
          describe: 'force to create',
          type: 'boolean'
        }
      })
  }, argv => {
    
    let config = {
      createMethod: argv.createMethod,
      forceCreate: argv.force,
      initDirName: argv.dir,
      templateType: argv.type,
      templateFrom: 'npm',
      packageName: '@fow/vad-init-templates'
    }
    new Create().run(config)
  })
  .help()

yargs.argv;

