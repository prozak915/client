/* eslint-disable no-console */

const fs = require('fs');
const merge = require('webpack-merge');
const { getBabelLoader } = require('react-app-rewired');

module.exports = function injectBabelRC(path) {
  return (config, _env) => {
    const loader = getBabelLoader(config.module.rules);

    if (!loader) {
      console.warn('babel-loader not found');
      return config;
    }

    loader.options = merge(loader.options, {
      babelrc: fs.existsSync(path)
    });

    return config;
  };
};
