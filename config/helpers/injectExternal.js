const merge = require('webpack-merge');

module.exports = function injectExternal(external) {
  return (config, _env) => {
    return merge(config, {
      externals: {
        [external]: `commonjs ${external}`
      }
    });
  };
};
