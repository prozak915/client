const path = require('path');
const { compose, injectBabelPlugin } = require('react-app-rewired');

const rewireEntry = require('./helpers/rewireEntry');
const injectTarget = require('./helpers/injectTarget');
const injectExternal = require('./helpers/injectExternal');

function injectDynamicImport(config, _env) {
  return injectBabelPlugin('syntax-dynamic-import', config);
}

module.exports = compose(
  rewireEntry('main', path.resolve(__dirname, '../src/main/index.js')),
  injectTarget('electron-main'),
  injectExternal('@cityofzion/neon-js'),
  injectDynamicImport
);
