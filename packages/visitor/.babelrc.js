
let version = process.env.BUILD_VERSION;

module.exports = function (api) {
  
  const isTest = api.env('test');
  api.cache(false);
  return {
    "presets": [
      [
        require.resolve("@babel/preset-env"),
        {
          modules: version === 'es' ? false : 'auto'
        }
      ]
    ]
  };
}
