
let version = process.env.BUILD_VERSION;

module.exports = function (api) {
  

  api.cache(false);
  return {
    "presets": [
      [
        require.resolve("@babel/preset-env"),
        {
          modules: false
        }
      ]
    ]
  };
}
