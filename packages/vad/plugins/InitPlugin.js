
const path = require('path');
const fs = require('fs');
const {
  walkCode
} = require('@fow/dev-utils/ast');

module.exports = class InitPlugin{
  constructor(){

  }

  run(runner){

    runner.hooks.watch.onCall('InitPlugin', (add)=>{
      add({
        paths: ['src/init.js'],
        events: 'change,add,unlink',
        type: 'reemit'
      })
    })

    runner.hooks.entry.onCall('InitPlugin-entry',(chunks, runnerCfg)=>{
      let {appRoot} = runnerCfg;

      let filePath = path.resolve(appRoot, 'src/init.js')
      let hasInitFile = fs.existsSync(filePath);
      let hasDfExport = false

      if(hasInitFile){
        walkCode(fs.readFileSync(filePath).toString(), {
          enter: function({node, stop}){
            if (node.type ==='ExportDefaultDeclaration'){
              switch (node.declaration.type) {
                case 'Identifier':
                case 'ArrowFunctionExpression':
                case 'FunctionDeclaration':
                  hasDfExport = true;
                  break;
              }
            }
          }
        })
      }

      chunks.forEach(chunk=>{
        chunk.addCache({
          name: '__pluginInit',
          indx: -9999
        });

        if (hasInitFile){
          let importCode = `import init from "@/init";`
          chunk.addCode('__pluginInit', importCode);
        }

        if (hasDfExport) {
          

          chunk.setNewVmCode(vmCode=>{
            chunk.code([
              'function __doneFN(callback){',
              `  let vm = ${vmCode}`,
              `  callback && callback({vm})`,
              '}'
            ].join('\n'));
            return [
              `if(typeof init === 'function'){`,
              `  if(init.length>=2){`,
              `    init(Vue, __doneFN)`,
              `  }else{`,
              `    init(Vue)`,
              `    ${vmCode}`,
              `  }`,
              '}else{',
              `  ${vmCode}`,
              '}'
            ].join('\n')
          })
        }

      })
    })
  }
}