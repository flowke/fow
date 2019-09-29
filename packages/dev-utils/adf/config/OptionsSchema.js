module.exports = {
  type: 'object',
  // "additionalProperties": false,

  properties: {
    splitRuntime: {
      type: 'boolean'
    },
    devServer: {
      type: 'object'
    },
    clientEnv: {
      type: 'object',
      patternProperties: {
        '.*': { type: 'string', errorMessage: 'clientEnv value should be string' }
      }
    },
    paths: {
      type: 'object',
      properties: {
        'entryPoint': { type: 'string' },
        'outputPath': { type: 'string' },
        'publicPath': { type: 'string' },
        'appHtml': { type: 'string' },
        'appSrc': { type: 'string' },
        'assetsDir': { type: ['string', 'null'] },
        'js': { type: ['string', 'array'] },
        'css': { type: ['string', 'array'] },
        'fonts': { type: ['string', 'array'] },
        'img': { type: ['string', 'array'] },
        'otherFiles': { type: ['string', 'array'] },
        'patterns': {
          type: 'array',
          items: {
            type: "array",
            maxItems: 2,
            minItems: 2,
            items: [
              { "type": ['string', 'array', 'object'] },
              { type: 'string' }
            ],
          }
        },
      }
    },
    appRoot: {
      type: 'string',
      absolutePath: true,
      errorMessage: 'appRoot should be absolute path'
    },
    globalVar: {
      type: 'object',
      // 全局变量需要大写
      propertyNames: {
        pattern: "^[A-z_][A-Z0-9_]*$",
        errorMessage: {
          pattern: 'each key of globalVar should be uppercase.'
        }
      }

    },
    compatibility: {
      type: 'object',
      propertyNames: {
        level: 'number'
      }
    },
    showEntry: {
      type: 'boolean'
    },
    webpackChain: {
      cusType: 'function',
      errorMessage: 'should be function'
    },
    webpack: {
      anyOf: [
        { cusType: 'object' },
        { cusType: 'function' },
      ],
      errorMessage: 'should be function or object'
    }
  }
}