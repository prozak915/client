const path = require('path');
const autoprefixer = require('autoprefixer');
const postCssFlexBugsFixes = require('postcss-flexbugs-fixes');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { castArray } = require('lodash');

module.exports = function injectSassLoader(includePaths) {
  return (config, env) => {
    const isDev = env === 'development';
    const newConfig = { ...config };

    const loaders = [
      {
        loader: 'css-loader',
        options: {
          modules: true,
          sourceMap: isDev,
          minimize: !isDev,
          importLoaders: 1,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: isDev,
          ident: 'postcss',
          plugins: () => [
            postCssFlexBugsFixes,
            autoprefixer({
              browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
              flexbox: 'no-2009'
            })
          ]
        }
      },
      {
        loader: 'sass-loader',
        options: {
          data: '@import "root/stylesheets/variables"; @import "root/stylesheets/mixins";',
          includePaths: castArray(includePaths),
          sourceMap: isDev
        }
      }
    ];

    // We have to inject before the last rule, which is the "file-loader" defined by react-scripts.
    const oneOfRules = newConfig.module.rules.find((rule) => rule.oneOf).oneOf;
    const fileLoaderIndex = oneOfRules.findIndex((rule) => (
      typeof rule.loader === 'string' && rule.loader.match(`${path.sep}file-loader${path.sep}`)
    ));

    oneOfRules.splice(fileLoaderIndex, 0, {
      test: /\.s[ac]ss$/,
      exclude: /node_modules/,
      use:
        env === 'production'
          ? ExtractTextPlugin.extract({ fallback: 'style-loader', use: loaders })
          : ['style-loader', ...loaders]
    });

    return newConfig;
  };
};
