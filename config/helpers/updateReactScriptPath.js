const { paths } = require('react-app-rewired');

module.exports = function updateReactScriptPath(filename) {
  // ensure that react-script has loaded before trying to resolve it
  require('react-scripts/config/paths'); // eslint-disable-line global-require

  const originalPaths = require.cache[
    require.resolve(`${paths.scriptVersion}/config/paths.js`)
  ];

  Object.assign(originalPaths.exports, {
    appIndexJs: filename
  });
};
