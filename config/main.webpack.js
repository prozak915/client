/* eslint-disable global-require */

const path = require('path');
const { compose } = require('react-app-rewired');

// const rewireEntry = require('./helpers/rewireEntry');
const rewireNode = require('./helpers/rewireNode');
const injectTarget = require('./helpers/injectTarget');
const injectExternal = require('./helpers/injectExternal');
const injectDynamicImport = require('./helpers/injectDynamicImport');
const removePlugin = require('./helpers/removePlugin');

const env = process.env.NODE_ENV || 'development';

function getConfig() {
  if (env === 'development') {
    return require('react-scripts/config/webpack.config.dev');
  } else {
    return require('react-scripts/config/webpack.config.prod');
  }
}

const merge = require('webpack-merge');
const updateReactScriptPath = require('./helpers/updateReactScriptPath');

function rewireEntry(name, filename) {
  return (config, _env) => {
    updateReactScriptPath(filename);

    const format = (filepath) => (
      path.join(env === 'production' ? '' : 'build', filepath)
    );

    return merge({
      ...config,
      entry: {
        [name]: [filename]
      }
    }, {
      output: {
        filename: format('static/js/[name].bundle.js'),
        chunkFilename: format('static/js/[name].chunk.js')
      }
    });
  };
}

module.exports = compose(
  rewireNode,
  rewireEntry('main', path.resolve(__dirname, '../src/main/index.js')),
  injectTarget('electron-main'),
  injectExternal('@cityofzion/neon-js'),
  injectDynamicImport,
  removePlugin('HtmlWebpackPlugin')
)(getConfig(), env);
