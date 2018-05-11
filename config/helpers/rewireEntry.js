const merge = require('webpack-merge');
const { paths } = require('react-app-rewired');

function updateReactScriptPath(filename) {
  // ensure that react-script has loaded before trying to resolve it
  require('react-scripts/config/paths.js'); // eslint-disable-line global-require

  const originalPaths = require.cache[
    require.resolve(`${paths.scriptVersion}/config/paths.js`)
  ];

  Object.assign(originalPaths.exports, {
    appIndexJs: filename
  });
}

module.exports = function rewireEntry(name, filename, format = (path) => path) {
  return (config, _env) => {
    updateReactScriptPath(filename);

    const entry = [
      ...config.entry.slice(0, config.entry.length - 1),
      filename
    ];

    return merge({
      ...config,
      entry: {
        [name]: entry
      }
    }, {
      output: {
        filename: format('static/js/[name].bundle.js'),
        chunkFilename: format('static/js/[name].chunk.js')
      }
    });
  };
};
