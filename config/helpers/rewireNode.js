const merge = require('webpack-merge');

// Disables webpack processing of __dirname and __filename.  If you run the bundle in node.js, it
// falls back to the __dirname & __filename values of node.js.
// https://github.com/webpack/webpack/issues/1599
// https://github.com/webpack/webpack/issues/2010
module.exports = function rewireNode(config, _env) {
  return merge(config, {
    node: {
      __dirname: false,
      __filename: false
    }
  });
};
