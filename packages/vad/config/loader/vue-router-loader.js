const t = require('@babel/types');
const parser = require('@babel/parser');
const genn = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;

module.exports = function (source, sm, meta) {
  this.sourceMap = true;
  let callback = this.async();

  let ast = parser.parse(source, {
    sourceType: 'module',
    plugins: [
      //  'estree',
       'dynamicImport',
      'asyncGenerators',
      'bigInt',
      'classProperties',
      'classPrivateProperties',
      'classPrivateMethods',
      ['decorators', {
        decoratorsBeforeExport: true
      }],
      'doExpressions',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'functionBind',
      'functionSent',
      'importMeta',
      'logicalAssignment',
      'nullishCoalescingOperator',
      'numericSeparator',
      'objectRestSpread',
      'optionalCatchBinding',
      'optionalChaining',
      'throwExpressions',
    ]
  })
  
  let importTpl = '';

  traverse(ast,{
    StringLiteral: {
      enter(path){

        let str = path.node.value.trim();
        if (/^@@pages\./.test(str)){
          let newStr = str.replace('@@pages.','');
          path.replaceWith(createDyImportFn(`@/pages/${newStr}`) )
        }
        if (/^@pages\./.test(str)){
          let newStr = str.replace('@pages.','');
          let compName = path.scope.generateUidIdentifier("Comp").name;
          path.replaceWithSourceString(compName)
          importTpl += `import ${compName} from '@/pages/${newStr}'\n`
        }
        if (/^@@layout\./.test(str)) {
          let newStr = str.replace('@@layout.', '');
          path.replaceWith(createDyImportFn(`@/layout/${newStr}`))
        }
        if (/^@layout\./.test(str)){
          let newStr = str.replace('@layout.','');
          let compName = path.scope.generateUidIdentifier("Comp").name;
          path.replaceWithSourceString(compName)
          importTpl += `import ${compName} from '@/layout/${newStr}'\n`
        }
      }
    }
  })


  let {code, map} = genn(ast);
  
  importTpl+=code;

  callback(null, importTpl);
}


function createDyImportFn(path) {
  let callee = t.import();
  let args = [t.stringLiteral(path)];
  return t.arrowFunctionExpression([], t.callExpression(callee, args) )
}