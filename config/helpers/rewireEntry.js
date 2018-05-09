const merge = require('webpack-merge');
const { paths } = require('react-app-rewired');

function updateReactScriptPath(filename) {
  const originalPaths = require.cache[
    require.resolve(`${paths.scriptVersion}/config/paths.js`)
  ];

  Object.assign(originalPaths.exports, {
    appIndexJs: filename
  });
}

module.exports = function rewireEntry(name, filename) {
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
        filename: 'static/js/[name].bundle.js'
      }
    });
  };
};
