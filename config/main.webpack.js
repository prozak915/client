/* eslint-disable global-require */

const path = require('path');
const { compose } = require('react-app-rewired');

const rewireEntry = require('./helpers/rewireEntry');
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

module.exports = compose(
  rewireNode,
  rewireEntry('main', path.resolve(__dirname, '../src/main/index.js'), (filename) => (
    path.join(env === 'production' ? '' : 'build', filename)
  )),
  injectTarget('electron-main'),
  injectExternal('@cityofzion/neon-js'),
  injectDynamicImport,
  removePlugin('HtmlWebpackPlugin')
)(getConfig(), env);
