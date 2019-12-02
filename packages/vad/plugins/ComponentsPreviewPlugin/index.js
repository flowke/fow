const glob = require('globby');
const path = require('path');
const fs = require('fs');

module.exports = class ComponentListPlugin{

  run(runner){
    let {
      appRoot,

    } = runner.runnerConfig;

    runner.hooks.watch.onCall('PutaPlugin', add => {
      add({
        type: 'reemit',
        paths: [path.resolve(__dirname, 'preview.vue')],
        events: 'change',
        
      })
      add({
        type: 'restart',
        paths: ['src/components/**/*.vue', 'src/components/preview.config.js'],
        events: 'add,unlink',
      })
  
    });

    let {tempDir} = runner;

    let compDir = path.resolve(appRoot, 'src/components');
    
    let compList = glob.sync(['**/*.vue'], {
      cwd: compDir
    }).filter(Boolean)

    compList = compList.reduce((accu, p)=>{
      let arr = p.split('/');

      if(arr.length>1){
        let key = arr[0];
        let path = arr.slice(1).join('/');

        if(accu[key]){
          accu[key].push(path)
        }else{
          accu[key] = [path]
        }

      }else{
        accu[p] = true;
      }
      return accu

    }, {});

    // 收集到的所有组件信息
    compList = Object.entries(compList)

    runner.hooks.entry.onCall('ComponentListPlugin-entry',(chunks)=>{
      chunks.forEach(chunk => {

        chunk.registerRouter((c, code)=>{

          let existCfg = fs.existsSync(path.resolve(appRoot, 'src/components/preview.config.js'))

          if (existCfg){
            c.import('import previewConfigJS from "@/components/preview.config.js";')
          }

          let routers = []

          compList.forEach(([key, val])=>{
            
            // 一个文件夹里的组件
            if(Array.isArray(val)){
              

              val.forEach((path)=>{
                // 引入组件
                let name = 'a'+ (key + '/' + path).replace(/[/.]/g, '_')
                c.import(`import ${name} from '@/components/${key}/${path}'`)
                let outsideProps = '{}'
                if (existCfg){
                  outsideProps = `previewConfigJS['${key}/${path}'] &&  previewConfigJS['${key}/${path}']['props']`

                }
                routers.push([
                  '{',
                  `  path: '${key}/${path}',`,
                  `  component: Object.assign({},comp_wrap_x, {components: {Comp: ${name}}, outsideProps: ${outsideProps} })`,
                  '}'
                ].join('\n'))

              }, []);

            } else{
              let name = 'a' + key.replace(/[/.]/g, '_')
              c.import(`import ${name} from '@/components/${key}'`);
              let outsideProps = '{}'
              if (existCfg) {
                outsideProps = `previewConfigJS['${key}'] &&  previewConfigJS['${key}']['props']`
              }

              routers.push([
                '{',
                `path: '${key}',`,
                `component: Object.assign({},comp_wrap_x, { components: {Comp: ${name}}, outsideProps: ${outsideProps} })`,
                '}',
              ].join('\n'))

            }

          });

          routers = `[${routers.join(',')}]`;

          runner.addAppFile(runner.tempDir+'/_preview.vue', fs.readFileSync(__dirname+'/preview.vue'));
          runner.addAppFile(runner.tempDir + '/_compWrap.vue', fs.readFileSync(__dirname +'/compWrap.vue'));

          let previewPath = './'+ path.relative(path.dirname(chunk.emitPath), runner.tempDir + '/_preview.vue')
          let wrapPath = './'+ path.relative(path.dirname(chunk.emitPath), runner.tempDir + '/_compWrap.vue')
          

          c.import(`import comp_preview_x from '${previewPath}';`);
          c.import(`import comp_wrap_x from '${wrapPath}';`);

          let renderMenu = compList.map(([key, value])=>{

            if(Array.isArray(value)){
  
              return {
                label: key,
                children: value.map(p => {
                  return {
                    path: `/comp_preview/${key}/${p}`,
                    label: p
                  }
                })
              }
            }else {
              return {
                path: `/comp_preview/${key}`,
                label: key
              }
            }

          })
          
          c.import(`comp_preview_x.menuList = ${inspectStr(renderMenu)}`)


          return [
            `${code}.addRoutes([`,
            `  {`,
            `    path: '/comp_preview',`,
            `    component: comp_preview_x,`,
            `    children: ${routers}`,
            `  }`,
            `]);`
          ].join('\n')
           
        })
      });
    })

  }
}

function inspectStr(data) {
  if(Array.isArray(data)){
    let arr = data.map(elt=>{
      if(typeof elt === 'object'){
        return inspectStr(elt)
      }else {
        return `${JSON.stringify(elt)}`
      }
    });

    return '[' + arr.join(',') + ']'
  }else{
    let arr = Object.entries(data).map(([key, value])=>{
      if(typeof value === 'object'){
        return `${key}: ${inspectStr(value)}`
      }else{
        return `${key}: ${JSON.stringify(value)}`
      }
    })

    return '{'+ arr.join(',') + '}'

  }
}
