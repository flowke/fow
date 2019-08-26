#!/usr/bin/env node

const Create = require('@fow/dev-utils/create');

const yargs = require('yargs');

yargs
  .alias('h', 'help')
  .alias('V', 'version')
  .command('dev', 'start devserver', {}, argv => {
    process.env.NODE_ENV = "development"
    require('../vue/scripts/dev')
  })
  .command('build', 'build', {}, argv => {
    process.env.NODE_ENV = "production"
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
    
    process.env.NODE_ENV = "development";
    new Create().run(config)
  })
  .help()

yargs.argv;

