const path = require('path');
const { compose } = require('react-app-rewired');

const rewireEntry = require('./helpers/rewireEntry');
const injectSassLoader = require('./helpers/injectSassLoader');
const injectTarget = require('./helpers/injectTarget');
const injectPublicPath = require('./helpers/injectPublicPath');
const injectBabelRC = require('./helpers/injectBabelRC');
const injectExternal = require('./helpers/injectExternal');

module.exports = compose(
  rewireEntry('renderer', path.resolve(__dirname, '../src/renderer/index.js')),
  injectSassLoader(path.resolve(__dirname, '../src/renderer')),
  injectPublicPath(path.resolve(__dirname, '../public')),
  injectBabelRC(path.resolve(__dirname, '../.babelrc')),
  injectTarget('electron-renderer'),
  injectExternal('@cityofzion/neon-js'),
  injectExternal('node-hid')
);
