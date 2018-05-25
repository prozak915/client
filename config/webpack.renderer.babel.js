/* eslint-disable no-console, global-require, import/no-dynamic-require */

import path from 'path';
import merge from 'webpack-merge';
import { spawn } from 'child_process';
import baseConfig from './webpack.base';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const publicPath = `http://localhost:${port}/dist`;

const devServerEntry = isProd ? [] : [
  'react-hot-loader/patch',
  `webpack-dev-server/client?http://localhost:${port}/`,
  'webpack/hot/dev-server'
];

export default merge.smart(baseConfig, {
  target: 'electron-renderer',

  entry: {
    renderer: [
      ...devServerEntry,
      path.resolve(__dirname, '..', 'src', 'renderer')
    ]
  },

  devServer: {
    port,
    publicPath,
    compress: true,
    noInfo: true,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.resolve(__dirname, '..', 'dist'),
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false
    },
    before() {
      if (process.env.START_HOT) {
        console.log('Starting Main Process...');
        spawn(
          'npm',
          ['run', 'start-main-dev'],
          { shell: true, env: process.env, stdio: 'inherit' }
        )
          .on('close', (code) => process.exit(code))
          .on('error', (spawnError) => console.error(spawnError));
      }
    }
  }
});
