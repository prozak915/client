const webpack = require('webpack');
const merge = require('webpack-merge');

module.exports = function injectPublicPath(path) {
  return (config, env) => {
    if (env === 'production') {
      return config;
    }

    return merge(config, {
      plugins: [
        new webpack.DefinePlugin({
          'process.env.PUBLIC_PATH': JSON.stringify(path)
        })
      ]
    });
  };
};
