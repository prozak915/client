import path from 'path';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import baseConfig from './webpack.base';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

// const devServerEntry = isProd ? [] : [
//   'react-hot-loader/patch',
//   `webpack-dev-server/client?http://localhost:${port}/`
//   // 'webpack/hot/dev-server'
// ];

export default merge.smart(baseConfig, {
  target: 'electron-renderer',

  entry: {
    renderer: path.resolve(__dirname, '..', 'src', 'renderer')
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'public', 'index.html'),
      templateParameters: {
        publicPath: isProd ? '' : '/'
      }
    }),

    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '..', 'public'),
        to: path.resolve(__dirname, '..', 'build')
      }
    ])
  ],

  devServer: {
    port,
    // publicPath: '/',
    compress: true,
    noInfo: true,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    // hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    contentBase: path.resolve(__dirname, '..', 'build'),
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100
    },
    historyApiFallback: {
      // verbose: true,
      disableDotRule: false
    }
  }
});
