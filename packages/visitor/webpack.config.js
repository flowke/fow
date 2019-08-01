var path = require('path');
const base = require('../../webpack.config');
const merge = require('webpack-merge');

module.exports = merge(base, {
  entry: './index.js',
  output: {
    library: 'vi',
    libraryTarget: 'es',
    libraryExport: 'default'
  }
}) 