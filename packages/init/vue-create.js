const glob = require('globby');
const path = require('path');
const chalk = require('chalk');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const request = require('axios');
const shell = require('shelljs');
const compressing = require('compressing');
const os = require('os');
const ora = require('ora');
const swig = require('swig');
const { ordered, toArr } = require('@fow/visitor');

const spinner = ora();

function logExistDir(dir) {
  console.log();
  console.log(`Directory ${chalk.bold(path.resolve(dir) + '/')} already exists, please use another one.`);
  console.log();
}

module.exports = class Create{

  constructor(){
    this.argv = null;
    this.tplCfg = null;

    // 生成文件被放置的地方
    this.validDir = null;
    this.validType = null;
    this.validLocals = null;
    this.name = '';
    this.createMethod = '';

    this.hasNpm = shell.which('npm')

    this.filenameMapping = {
      '_.gitignore': '.gitignore',
      '_package.json': 'package.json',
    };
    
  }


  run(argv, tplCfg){
    this.tplCfg = tplCfg
    this.argv = argv;
    
    let { createMethod } = argv;

    this.createMethod = createMethod;

    let p = Promise.resolve(null)

    if (createMethod === 'put') p = this.getPutDir()
    if (createMethod === 'init') p = this.getInitDir()

    p
    .then(dir=>{
      if(dir){
        this.name = 
        this.validDir = dir;
        return this.getTemplateType()
      }
    })
    .then(type=>{
      if(type){
        this.validType = type;
        return this.getTemplateLocals()
      }
    })
    .then(locals=>{
      if(locals){
        this.validLocals = locals;
        return this.generate()
      }
    })
    .then(done=>{
      if(done){

        if (this.createMethod === 'init'){
          let dir = path.basename(this.validDir)
          shell.cd(dir)

        }

        let {
          dependencies,
          devDependencies
        } = this.validLocals;

        let dep = Object.keys(dependencies)
        let devDep = Object.keys(devDependencies)

        dep = dep.map(name=>{
          return function(){
            let p = new Promise(rv=>{
              shell.exec(`npm i ${name}`, { silent: true }, (code, stdout, stderr) => {
                rv(name)
              })
            })
            p.info = name
            return p
          }
          
        })
        devDep = devDep.map(name=>{
          return function(){
            let p = new Promise(rv=>{
              shell.exec(`npm i -D ${name}`, { silent: true }, (code, stdout, stderr) => {
                rv(name)
              })
            })
            p.info = name
            return p
          }
          
        })

        let all = dep.concat(devDep)

        let i = 1;
        let spin = ora({ spinner: 'point' })
        spin.start(`start installation`)

        ordered(all, {
          paraller: true,
          waitingEach:name=>{
            spin.start(`[${i++}/${all.length}] install ${name}`)
          },
          afterEach: name=>{
            
            spin.succeed();
          }
        })
        .then(()=>{
          this.logUsage()
        })
        
      }
    })
    
  }

  getInitDir(){
    let { dir, force } = this.argv;

    let p = Promise.resolve(null);

    if(dir){
      p = Promise.resolve(dir)
      .then(dir=>{

        if(force){
          shell.rm('-rf', path.resolve(dir) )
        }else{
          let existDir = fse.existsSync(path.resolve(dir))
          if (existDir) {
            logExistDir(dir)
            return null
          }
        }

        

        return path.resolve(dir)
      })
    }else[
      p = this.askDir()
        .then(dir => path.resolve(dir))
    ]

    return p

  }

  getPutDir(){
    let { force } = this.argv;

    let files = glob.sync('*', {deep: 1, onlyFiles: false});

    let dir = process.cwd();

    if(force){
      fse.emptyDirSync(dir);

    }else if(files.length){

      let fdName = path.basename(dir);

      console.log();
      console.log(`There is something in ${chalk.bold(fdName+'/')} directory, make sure it is clean or use '--force' to clean it first.`);
      console.log();

      console.log(chalk.green(`|-${fdName}`));
      files.forEach(e=>{
        console.log(chalk.green(`  |-${e}`));
      })
      console.log();
      dir = null
    }


    return Promise.resolve(dir)

  }

  askDir(){
    return inquirer.prompt([
      {
        message: 'type a directory name to init:',
        name: 'dir',
        validate: function(dir){
          // console.log(dir, typeof dir, 'dir')
          if(!dir) return 'dir must be a valid name';

          if (fse.existsSync(path.resolve(dir))) {
            return `Directory ${chalk.bold(path.resolve(dir) + '/')} already exists, please use another one.`
          }
          return true
        }
      }
    ])
    .then(val=>val.dir)
  }

  askTemplate(){

    let cfg = toArr(this.tplCfg.templates)
    
    return inquirer.prompt([
      {
        type: 'list',
        message: 'please choose a template',
        name: 'type',
        choices: cfg.values.map(e=>{
          return {
            name: e.name + '  ' + e.describe,
            value: e.name
          }
        })
      }
    ])
    .then(v => v.type)
  }

  askTemplateInfo(dir){
    let dirname = path.basename(this.validDir)
    return inquirer.prompt([
      {
        message: 'projece name: ',
        default: dirname,
        name: 'name',
      }
    ])
  }

  getTemplateType(){
    let {type } = this.argv;

    if (type && this.tplCfg.templates[type]){
      return Promise.resolve(type)
    }else if(!type){
      return this.askTemplate()
    }else{
      return Promise.resolve(null)
    }

  }

  getTemplateLocals(){
    const dep  = require('./vue-dependencies');
    let type = this.validType;

    let depType = dep.type[type];

    let dependencies = depType.prod.reduce((acc, lib)=>{
      acc[lib] = dep.libs[lib]
      return acc
    }, dep.commonLibs)

    let devDependencies = depType.dev.reduce((acc, lib) => {
      acc[lib] = dep.devLibs[lib]
      return acc
    }, dep.devCommonLibs)

    return Promise.resolve({
      packageName: path.basename(this.validDir),
      dependencies,
      devDependencies
    })
  }

  generate(){
    let { validDir, validType, validLocals, tplCfg} = this;

    let renderFile = (file, baseRoot )=>{
      let tplName = path.basename(file);
      let realName = this.filenameMapping[tplName] || tplName
      let isJson = path.extname(tplName)==='.json'

      // from abs path
      let fullPath = path.resolve(baseRoot, file)
      // to abs path
      let to = path.resolve(validDir, file).replace(tplName, realName)

      let content = ''

      // rendered content
      if (/src/.test(fullPath)){
        content = fse.readFileSync(fullPath)
      }else{
        content = swig.renderFile(fullPath, validLocals);
      }
      

      if(isJson){
        content = JSON.parse(content);
        content = JSON.stringify(content,null,2);
      }

      fse.outputFileSync(to, content)
    }
    
    
    return this.downloadPackage(tplCfg.package)
    .then(templatePkg=>{
      if (templatePkg){

        let tplTypeRoot = path.resolve(templatePkg, 'templates', validType)
        let commonTypeRoot = path.resolve(templatePkg, 'templates', 'common')

        let commonFiles = glob.sync('**/*', { dot: true, cwd: commonTypeRoot });
        let files = glob.sync('**/*', { dot: true, cwd: tplTypeRoot });

        let length = commonFiles.concat(files).length;
        let fileIndx = 1

        commonFiles.forEach((f)=>{
          
          spinner.start(`[${++fileIndx}/${length}]generateing file: ${f}` )
          renderFile(f, commonTypeRoot)

        })
        files.forEach((f)=>{
          
          spinner.start(`[${++fileIndx}/${length}]generateing file: ${f}` )
          renderFile(f, tplTypeRoot)

        })

        spinner.succeed('Generated file successfully!')

        return true
        
      }

    })
    .catch(err=>{
      spinner.fail()
      return false
    })
    
  }

  downloadPackage(packageName){
    spinner.start('get downloading registry')
    let registry = this.getRegistry();
    spinner.succeed(`got registry: ${registry}`)
    let url = `${registry}/${packageName}/latest`;

    const getTarball = ()=>{
      return this.request(url)
        .then(res => {
          // return null
          return this.request(res.dist.tarball, { responseType: 'arraybuffer' })
        })
        .catch(()=>{
          return null
        })
    }

    let tempdir = '';

    spinner.start('downloading template');
    return getTarball()
    .then(tarball=>{
      // 下载失败
      if (!tarball){
        spinner.fail()
        throw new Error('download fail')
      }

      spinner.succeed()

      tempdir = path.resolve(os.tmpdir(), 'tha-vue-create-config')

      shell.rm('-rf', tempdir);
      spinner.start('uncompress template')
      return compressing.tgz.uncompress(tarball, tempdir)
    })
    .then(done=>{
      spinner.succeed()
      
      return path.resolve(tempdir, 'package')
    })
    .catch(err=>{
      
      if (err.message !== 'download fail'){
        spinner.fail()
      }

      process.exit(1)
    })



  }

  getRegistry(){
    let url = '';

    if (!this.hasNpm) {
      console.log(chalk.red('Ensure npm has been installed!'))
      process.exit(1);
    }
    

    try {
      
      url = shell.exec('npm config get registry', { silent: true }).stdout;
      url = url.trim();
      url = url.replace(/\/$/, '');

    } catch (error) {
      url = ''
    }

    if(!url){
      console.log(chalk.red('Make sure you set a valid npm registry url'));
      process.exit(1)
    }

    return url;

  }

  request(url, op){
    return request(url,op)
    .then(res=>{
      return res.data
    })
  }

  logUsage(){
    let cd = '';
    if (this.createMethod === 'init') {
      cd = `- cd ${path.basename(this.validDir)}`
    }
    console.log();
    
    console.log(chalk.bold(`usage:
  ${cd}
  - npm i
  - npm start

  ------

  other usage:
    npm run list - list version of app libs
    npm run update - update app libs
    `))
  }


}