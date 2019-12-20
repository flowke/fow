const glob = require('globby');
const path = require('path');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const request = require('axios');
const shell = require('shelljs');
const compressing = require('compressing');
const os = require('os');
const ora = require('ora');
const arT = require('art-template');
const { spawn } = require('child_process');

require('colors')

const spinner = ora();

function logExistDir(dir) {
  console.log();
  console.log(`Directory ${(path.resolve(dir) + '/').bold} already exists, please use another one.`);
  console.log();
}

module.exports = class Create{

  constructor(){

    this.hasNpm = shell.which('npm')

    this.filenameMapping = {
      '_.gitignore': '.gitignore',
      '_package.json': 'package.json',
    };
    
  }

  run(config){
    
    let {
      createMethod, // 创建方式
      forceCreate, // 是否强制创建
      initDirName, // 初始化的目录名
      templateType, // 模板类型
      templateFrom='npm', // 'npm', 'git', 'local',
      packageName, // 模板所在的 npm 包名

    } = config;

    let p = Promise.resolve(null)

    if (createMethod === 'put') p = this.getPutDir(forceCreate)
    if (createMethod === 'init') p = this.getInitDir(initDirName, forceCreate)

    p.then(toDir=>{


      // 使用 npm 安装
      if (templateFrom === 'npm' && toDir) {
        config.toDir = toDir
        return this.generateTemplateWithNpm({
          packageName,
          templateType,
          toDir
        })
      }else{
        return null
      }
    })
    .then(info=>{
      if(info){
        return this.install({
          toDir: config.toDir,
          createMethod,
        })
      }
    })
    .catch(e=>{
      throw e
      
    })
    
  }

  //* 获取初始化的 dir, resolve dir 或 null
  getInitDir(dirName, force){

    let p = Promise.resolve(null);

    if(dirName){
      p = Promise.resolve(dirName)
      .then(dirName=>{

        if(force){
          shell.rm('-rf', path.resolve(dirName) )
        }else{
          let existDir = fse.existsSync(path.resolve(dirName))
          if (existDir) {
            logExistDir(dirName)
            return null
          }
        }
        return path.resolve(dirName)
      })

    }else[
      p = this.askDirName()
        .then(dir => path.resolve(dir))
    ]

    return p

  }

  //* 让用户 dir名字
  askDirName() {
    return inquirer.prompt([
      {
        message: 'type a directory name to init:',
        name: 'dir',
        validate: function (dir) {
          if (!dir) return 'dir must be a valid name';

          if (fse.existsSync(path.resolve(dir))) {
            return `Directory ${(path.resolve(dir) + '/').bold} already exists, please use another one.`
          }
          return true
        }
      }
    ])
      .then(val => val.dir)
  }

  /**
   * 获取当前工作目录的 dir
   * resolve dir 或 null
   */
  getPutDir(force){

    let files = glob.sync('*', {deep: 1, onlyFiles: false});

    let dir = process.cwd();

    if(force){
      fse.emptyDirSync(dir);

    }else if(files.length){

      let fdName = path.basename(dir);

      console.log();
      console.log(`There is something in ${(fdName + '/').bold} directory, make sure it is clean or use '--force' to clean it first.`);
      console.log();

      console.log((`|-${fdName}`).green);
      files.forEach(e=>{
        console.log((`  |-${e}`).green);
      })
      console.log();
      dir = null
    }


    return Promise.resolve(dir)

  }
  // * 在模板文件生成后安装依赖
  install(options){
    let {
      toDir,
      createMethod
    } = options;

    let toDirName = path.basename(toDir)

    if (createMethod === 'init') {
      shell.cd(toDirName)
    }

    return new Promise((rv,rj)=>{
      console.log();// 隔行
      spinner.stopAndPersist({
        text: 'Starting install packages with NPM...',
        symbol: '🍉🍉🍉'
      })
      console.log(); // 隔行
      
      let p = spawn('npm', ['i'], { stdio: 'inherit' });
      p.on('exit', (c, s) => {
        
        if(!c){
          rv()
        }
        rj()

      })
      p.on('error', (err) => {
        rj()
      })
    })
    .then(()=>{
      console.log('\n');
      this.logUsage(createMethod, toDirName);
      return true
    })
    .catch(e=>{
      console.log();

      console.log('Installing package fail. '.red.bold);

      let cd = '';
      if (createMethod === 'init') {
        cd = `- cd ${toDirName}`
      }
      console.log();

      console.log([
        'retry later:\n',
        cd && `- cd ${toDirName}\n`,
        'npm i\n'
      ].join('').bold.green)
      
      return false
    })



    



   

    
  }
  // * 通过 npm 生成模板, 并收集生成过程中的信息
  generateTemplateWithNpm(options={}){
    let {
      packageName, // 下载的 npm 包名
      templateType,
      toDir
    } = options;

    return this.fetchNpmPkgInfo(packageName)
      .then(info => {
        // 获取 type
        options.packageInfo = info
        return this.getTemplateType(templateType, info.templatesConfig)
      })
      .then(type=>{
        // 下载压缩包, 解压到临时目录
        if(type){
          options.templateType = type;
          
          return this.downloadTarball(options.packageInfo.dist.tarball, packageName)
        }else{
          return null
        }
      })
      .then(templateDir=>{
        // 手机渲染模板的信息
        if(templateDir){
          options.templateDir = templateDir; //下载的包的文件放置的地方
          return this.getTemplateLocals({
            dependencies: require(path.resolve(templateDir, 'dependencies')),
            templateType: options.templateType,
            packageName: path.basename(toDir)
          })
        }else{
          return null
        }
      })
      .then(locals=>{
        if(locals){
          options.locals = locals;

          return this.renderTemplate({
            locals,
            toDir,
            templateType: options.templateType,
            templateDir: options.templateDir
          })
        }
        return false
      })
      .then(renderDone=>{
        if (renderDone) return options
        return null
      })
  }

  //* 获取包信息\
  // packageName: 如 lodash
  fetchNpmPkgInfo(packageName){
    spinner.start('fetching template info...')
    let registry = this.getRegistry();
    spinner.succeed(`got registry: ${registry}`)

    let packageInfo = null

    if (registry.includes('npm.taobao')){
      packageInfo = this.request(`${registry}/${packageName}/latest`)
    }else{
      packageInfo = this.request(`https://registry.npmjs.org/${packageName}`)
      .then(res=>{
        let { latest } = res['dist-tags'];
        return res.versions[latest]
      }) 
    }

    
    spinner.start('fetching template info...')

    return packageInfo
    .then(res=>{
      spinner.succeed(`got template info`)
      return res
    })
    .catch(error=>{
      spinner.fail('fail to fetch package info, retry later...')
      process.exit(1)
    })
  }

  //* 基于模板配置信息, 询问出一种模板类型
  askTemplateType(templateConfig){


    
    return inquirer.prompt([
      {
        type: 'list',
        message: 'please choose a template',
        name: 'type',
        choices: Object.values(templateConfig).map(e=>{
          return {
            name: e.name + '  ' + e.describe,
            value: e.name
          }
        })
      }
    ])
    .then(v => v.type)
  }

  //* 获取项目模板名
  getTemplateType(type, templateConfig) {

    if (type && templateConfig[type]) {
      return Promise.resolve(type)
    } else if (!type) {
      return this.askTemplateType(templateConfig)
    } else {
      return Promise.resolve(null)
    }

  }

  // 无用
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

  // * 
  getTemplateLocals(config){

    let {
      dependencies: dep,
      templateType: type,
      packageName
    } = config

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
      packageName: packageName,
      dependencies,
      devDependencies
    })
  }

  // *
  renderTemplate(config){
    let {
      locals,
      toDir,
      templateType,
      templateDir
    } = config;

    let renderFile = (file, baseRoot) => {
      let tplName = path.basename(file);
      let realName = this.filenameMapping[tplName] || tplName
      let isJson = path.extname(tplName) === '.json'

      // from abs path
      let fullPath = path.resolve(baseRoot, file)
      // to abs path
      let to = path.resolve(toDir, file).replace(tplName, realName)

      let content = ''
      // rendered content
      if (/src/.test(fullPath)) {
        content = fse.readFileSync(fullPath)
      } else {
        
        content = arT(fullPath, locals);
        
      }

      if (isJson) {
        content = JSON.parse(content);
        content = JSON.stringify(content, null, 2);
      }

      fse.outputFileSync(to, content)
    }

    try {
      let tplTypeRoot = path.resolve(templateDir, 'templates', templateType)
      let commonTypeRoot = path.resolve(templateDir, 'templates', 'common')

      let commonFiles = glob.sync('**/*', { dot: true, cwd: commonTypeRoot });
      let files = glob.sync('**/*', { dot: true, cwd: tplTypeRoot });

      let length = commonFiles.concat(files).length;
      let fileIndx = 1

      commonFiles.forEach((f) => {

        spinner.start(`[${++fileIndx}/${length}]generateing file: ${f}`)
        renderFile(f, commonTypeRoot)

      })
      files.forEach((f) => {

        spinner.start(`[${++fileIndx}/${length}]generateing file: ${f}`)
        renderFile(f, tplTypeRoot)

      })

      spinner.succeed('Generated file successfully!')

      return true
    } catch (error) {
      
      spinner.fail()
      return false
    }

    


  }


  //* return template putting dir
  downloadTarball(tarballUrl, putDirName){

    const getTarball = ()=>{
      return this.request(tarballUrl, { responseType: 'arraybuffer' })
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

      tempdir = path.resolve(os.tmpdir(), putDirName)

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
  // *
  getRegistry(){
    let url = '';

    if (!this.hasNpm) {
      console.log('Ensure npm has been installed!'.red)
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
      console.log('Make sure you set a valid npm registry url'.red);
      process.exit(1)
    }

    return url;

  }
  // *
  request(url, op){
    return request(url,op)
    .then(res=>{
      return res.data
    })
    .catch(e=>{
      spinner.fail(('request fali:' + e.message + ' when fetching' + ' ' + url).red.bold)
    })
  }

  logUsage(createMethod,toDirName){
    let cd = '';
    if (createMethod === 'init') {
      cd = `- cd ${toDirName}`
    }
    console.log();
    
    console.log((`usage:
  ${cd}
  - npm i
  - npm start

  ------

  other usage:
    npm start - starting devServer and open browser
    npm run build - build app
    `).bold)
  }


}