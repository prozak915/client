import webpack from 'webpack';
import merge from 'webpack-merge';
// import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './webpack.base';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default merge.smart(baseConfig, {
  target: 'electron-main',

  entry: './src/main/index.js',

  plugins: [
    // new UglifyJSPlugin({
    //   parallel: true,
    //   sourceMap: true
    // }),
    //
    // new BundleAnalyzerPlugin({
    //   analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
    //   openAnalyzer: process.env.OPEN_ANALYZER === 'true'
    // }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV
    })
  ],

  // Disables webpack processing of __dirname and __filename.
  // If you run the bundle in node.js it falls back to these values of node.js.
  // https://github.com/webpack/webpack/issues/2010
  node: {
    __dirname: false,
    __filename: false
  }
});
