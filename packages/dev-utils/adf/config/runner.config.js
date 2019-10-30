const path = require('path');
let obj = {
  appRoot: process.cwd(),
  tempFilePath: ()=>{
    return path.resolve(obj.appRoot, '.temp-xx_')
  }
}

module.exports = obj;