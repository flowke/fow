const path = require('path');

module.exports = function (cfg={}) {
  let {
    compatibility
  } = cfg;

  let {
    level,
    targets
  } = compatibility

  return {
    cwd: path.resolve(__dirname, '../../'),
    presets: [
      ["@babel/preset-env",{
        modules: false,
        useBuiltIns: level ? 'usage': false,
        corejs: level? level : undefined,
        targets
      }]
    ],

    plugins: [
      "@babel/plugin-syntax-jsx",
      ["@babel/plugin-transform-runtime"],
      ["@babel/plugin-proposal-decorators",{decoratorsBeforeExport: true}],
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-optional-chaining",
    ]
  }
}