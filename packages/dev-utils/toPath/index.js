const path = require('path');

exports.relativePath = (from, to)=>{
  return './' + path.relative(path.dirname(from), to);
}