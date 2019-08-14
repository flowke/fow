
"use strict";

const Ajv = require("ajv");
const ajv = new Ajv({
  allErrors: true,
  verbose: true
});

require("ajv-keywords")(ajv, ["instanceof"]);
require("./keywords/absolutePath")(ajv);

const validate = (schema, options) => {
  const validate = ajv.compile(schema);
  const valid = validate(options);
  return valid ? [] : validate.errors;
};

const compile = (schema)=>{
  const validate = ajv.compile(schema);
  return (data)=>{
    return validate(data) ? [] : validate.errors;
  }
}

validate.compile = compile;

module.exports = validate;
