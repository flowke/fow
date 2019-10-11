const Hooks = require('../hooks');
const ChunkBlock = require('../chunkBlock');


exports.createHook = function(){
  return new Hooks();
}
exports.createChunk = function(){
  return new ChunkBlock();
}