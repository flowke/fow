
"use strict";

const Ajv = require("ajv");
const ajv = new Ajv({
  allErrors: true,
  verbose: true
});

require("ajv-keywords")(ajv, ["instanceof"]);
require("./keywords/absolutePath")(ajv);

const validate = (schema, options) => {
  const v = ajv.compile(schema);
  const valid = v(options);

  return {
    errors: valid ? null : v.errors
  }

};

const compile = (schema)=>{
  const v = ajv.compile(schema);
  return (data)=>{
    const valid = v(data);
    return {
      errors: valid ? null : v.errors
    }
  }
}

validate.compile = compile;
validate.ajv = ajv;

module.exports = validate;
