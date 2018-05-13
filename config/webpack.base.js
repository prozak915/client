/* eslint-disable global-require */

import path from 'path';
import webpack from 'webpack';
// import { dependencies as externals } from '../package.json';

// In tests, polyfill requestAnimationFrame since jsdom doesn't provide it yet.
if (process.env.NODE_ENV === 'test') {
  require('raf').polyfill(global);
}

const isProd = process.env.NODE_ENV === 'production';

export default {
  // Don't attempt to continue if there are any errors.
  bail: isProd,

  // Source maps are resource heavy and can cause out of memory issue for large source files.
  devtool: isProd ? false : 'source-map',

  // externals: Object.keys(externals || {}),

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    }]
  },

  output: {
    // The build folder.
    path: path.resolve(__dirname, '..', 'build'),
    // Add "filename" comments to generated require()s in the output.
    pathinfo: !isProd,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    filename: 'static/js/[name].bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    // Webpack needs to know the public path for injecting the right <script> hrefs into HTML.
    publicPath: process.env.PUBLIC_PATH,
    // Point sourcemap entries to original disk location.  (Format as URL on Windows.)
    devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  },


  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      path.join(__dirname, 'app'),
      'node_modules'
    ]
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new webpack.NamedModulesPlugin()
  ]
};
