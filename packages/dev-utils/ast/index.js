const parser = require("@babel/parser");
const t = require('@babel/types');
const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;


function parse(code, op={}, parseFnName ='parse', full=true){

  let plugins = [
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
  ];

  if (!full) plugins = []

  return parser[parseFnName](code, {
    sourceType: 'module',
    ...op,
    plugins: [
      ...plugins,
      ...(op.plugins ? op.plugins :[])
    ]
  } );
}
function walk(ast, visitor){
  return traverse(ast, visitor)
}

function genCode(ast, ...rest) {
  return generator(ast, ...rest)
}

function walkCode(code, visitor, ...parseOp){
  let ast = parse(code, ...parseOp);
  
  walk(ast, visitor)
}


function walkAndGenCode(code, visitor={}, parseOp=[], gennOp=[] ){
  let ast = parse(code, ...parseOp);

  walk(ast, visitor)

  return genCode(ast, ...gennOp);

}


module.exports = {
  parse,
  traverse,
  walk,
  walkCode,
  genCode,
  walkAndGenCode,
  t,
  parser,
  generator
}