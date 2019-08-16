module.exports = class ConfigError extends Error{
  constructor(msg){
    super(msg);
    this.name = 'ConfigError';
  }
}