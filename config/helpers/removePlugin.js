module.exports = function removePlugin(pluginName) {
  return (config, _env) => {
    const { plugins } = config;

    const index = plugins.findIndex((plugin) => {
      return plugin.constructor.name === pluginName;
    });

    if (index !== -1) {
      plugins.splice(index, 1);
    }

    return config;
  };
};
