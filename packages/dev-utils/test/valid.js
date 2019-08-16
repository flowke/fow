const validate = require('../validate');
require('colors');
let schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      description: '必须是字符串'
    },
    bar: {
      // type: 'number',
      enum: [1,2,3,4]
    }
  },
  additionalProperties: false,
  description: ''
}
try {
  validate(schema, {
    bar: 'g',
    f: 'f'
  })
} catch (error) {
  console.error(error.message.red.bold)
}
