import path from 'path';
import merge from 'webpack-merge';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import baseConfig from './webpack.base';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default merge.smart(baseConfig, {
  target: 'electron-main',

  entry: {
    main: path.resolve(__dirname, '..', 'src', 'main')
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '..', 'public'),
        to: path.resolve(__dirname, '..', 'build')
      }
    ])
  ]
});
