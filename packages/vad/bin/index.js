#!/usr/bin/env node

const Create = require('@fow/dev-utils/create');
const yargs = require('yargs');
const { fork } = require('child_process');

function runRunner(params) {
  let runnerProcess = fork(__dirname+ '/../scripts/run.js',{
    stdio: 'inherit',
  })

  runnerProcess.once('message', (msg) => {
    if (msg === 'restart') {
      runnerProcess.kill();
      process.nextTick(()=>{
        runRunner();
      })
    }
  });

  runnerProcess.send('start')
}

yargs
  .alias('h', 'help')
  .alias('V', 'version')
  .command('dev', 'start devserver', {}, argv => {
    runRunner()
  })
  .command('build', 'build', {}, argv => {
    require('../vue/scripts/build')
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

