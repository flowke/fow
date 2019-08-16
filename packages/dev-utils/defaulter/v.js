
"use strict";

/**
 * Gets the value at path of object
 * @param {object} obj object to query
 * @param {string} path query path
 * @returns {any} - if {@param path} requests element from array, then `undefined` will be returned
 */
const getProperty = (obj, path) => {
  let name = path.split(".");
  for (let i = 0; i < name.length - 1; i++) {
    obj = obj[name[i]];
    if (typeof obj !== "object" || !obj || Array.isArray(obj)) return;
  }
  return obj[name.pop()];
};

/**
 * Sets the value at path of object. Stops execution, if {@param path} requests element from array to be set
 * @param {object} obj object to query
 * @param {string} path query path
 * @param {any} value value to be set
 * @returns {void}
 */
const setProperty = (obj, path, value) => {
  let name = path.split(".");
  for (let i = 0; i < name.length - 1; i++) {
    if (typeof obj[name[i]] !== "object" && obj[name[i]] !== undefined) return;
    if (Array.isArray(obj[name[i]])) return;
    if (!obj[name[i]]) obj[name[i]] = {};
    obj = obj[name[i]];
  }
  obj[name.pop()] = value;
};


class DF{
  constructor(df){
    this.df = df;
  }
}


new DF({
  a: {
    entry: {
      value: './src/index',
      
    },
    output: {
      path: '/dist'
    },
    b: {
      c: []
    },
    b2: {

    }
  }
})