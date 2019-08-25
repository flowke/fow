const pnp = require('pnp-webpack-plugin');


class ruxModuleLoader {
  constructor(m){
    this.module = m;
  }
  apply(resolver) {
    pnp.moduleLoader(this.module).apply(resolver)
  }
}

pnp.ruxModuleLoader = ruxModuleLoader;

module.exports = pnp;