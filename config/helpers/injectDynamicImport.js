const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function injectDynamicImport(config, _env) {
  return injectBabelPlugin('syntax-dynamic-import', config);
};
