/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Gajus Kuizinas @gajus
*/
"use strict";

const createErrorsMsg = require('./createErrorsMsg');
const vali = require('./validate');
const ConfigError = require('./ConfigError');


module.exports = function(schema, data, cfg={}){
  let result = vali(schema, data);

  if (result.errors) {
    throw new ConfigError(createErrorsMsg(result.errors, schema, cfg.title))
  }
  
}

exports.compile = function(schema, cfg){
  let validate = vali.compile(schema);
  return function(data){
    let result = validate(data);
    if (result.errors) {
      throw new ConfigError(createErrorsMsg(result.errors, schema, cfg.title))
    }
  }
}