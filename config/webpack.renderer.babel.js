import path from 'path';
import merge from 'webpack-merge';
import baseConfig from './webpack.base';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const publicPath = `http://localhost:${port}/dist`;

export default merge.smart(baseConfig, {
  target: 'electron-renderer',

  entry: {
    renderer: path.resolve(__dirname, '..', 'src', 'renderer')
  },

  serve: {
    port,
    dev: {
      publicPath,
      stats: 'errors-only',
      watchOptions: {
        aggregateTimeout: 200,
        ignored: /node_modules/,
        poll: 100
      },
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  }
});
