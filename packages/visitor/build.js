var path = require('path');
const base = require('../../webpack.config');
const merge = require('webpack-merge');
const webpack = require('webpack');

let config = merge(base, {
  entry: './index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'visitor',
    libraryTarget: 'umd'
  }
}) 



webpack(config,err=>{
  if(!err){
    console.log('ok ');
    
  }else{
    console.log(err);
    
  }
})