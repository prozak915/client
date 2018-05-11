const merge = require('webpack-merge');

module.exports = function injectTarget(target) {
  return (config, _env) => {
    return merge(config, { target });
  };
};
