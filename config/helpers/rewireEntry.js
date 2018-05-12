const merge = require('webpack-merge');

const updateReactScriptPath = require('./updateReactScriptPath');

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
