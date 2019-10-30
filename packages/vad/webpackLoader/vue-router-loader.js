
const {ast} = require('@fow/dev-utils');


module.exports = function (source, sm, meta) {
  this.sourceMap = true;
  let callback = this.async();


  let importTpl = '';

  let { code } = ast.walkAndGenCode(source, {
    StringLiteral: {
      enter(path) {

        let str = path.node.value.trim();
        if (/^@@pages\./.test(str)) {
          let newStr = str.replace('@@pages.', '');
          path.replaceWith(createDyImportFn(`@/pages/${newStr}`))
        }
        if (/^@pages\./.test(str)) {
          let newStr = str.replace('@pages.', '');
          let compName = path.scope.generateUidIdentifier("Comp").name;
          path.replaceWithSourceString(compName)
          importTpl += `import ${compName} from '@/pages/${newStr}'\n`
        }
        if (/^@@layout\./.test(str)) {
          let newStr = str.replace('@@layout.', '');
          path.replaceWith(createDyImportFn(`@/layout/${newStr}`))
        }
        if (/^@layout\./.test(str)) {
          let newStr = str.replace('@layout.', '');
          let compName = path.scope.generateUidIdentifier("Comp").name;
          path.replaceWithSourceString(compName)
          importTpl += `import ${compName} from '@/layout/${newStr}'\n`
        }
      }
    }
  })


  importTpl += code;

  callback(null, importTpl);
}


function createDyImportFn(path) {
  let callee = ast.t.import();
  let args = [ast.t.stringLiteral(path)];
  return ast.t.arrowFunctionExpression([], ast.t.callExpression(callee, args))
}