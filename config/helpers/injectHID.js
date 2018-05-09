const merge = require('webpack-merge');

module.exports = function injectHID(config, _env) {
  return merge(config, {
    externals: {
      'node-hid': 'commonjs node-hid'
    }
  });
};
