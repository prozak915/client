/* eslint-disable global-require */

import path from 'path';
import webpack from 'webpack';
import externals from 'webpack-node-externals';
import autoprefixer from 'autoprefixer';
import postCssFlexBugsFixes from 'postcss-flexbugs-fixes';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

// In tests, polyfill requestAnimationFrame since jsdom doesn't provide it yet.
if (process.env.NODE_ENV === 'test') {
  require('raf').polyfill(global);
}

const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

const styleLoaders = [
  isProd ? MiniCssExtractPlugin.loader : 'style-loader',
  {
    loader: 'css-loader',
    options: {
      modules: true,
      sourceMap: !isProd,
      minimize: isProd,
      importLoaders: 1,
      localIdentName: '[name]__[local]___[hash:base64:5]'
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: !isProd,
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
      includePaths: [path.resolve(__dirname, '..', 'src', 'renderer')],
      sourceMap: !isProd
    }
  }
];

export default {
  // Don't use webpack default optimizations. https://webpack.js.org/concepts/mode/
  mode: 'none',

  // Don't attempt to continue if there are any errors.
  bail: isProd,

  // Source maps are resource heavy and can cause out of memory issue for large source files.
  devtool: isProd ? false : 'source-map',

  // Exclude node_modules when building.
  externals: [externals()],

  module: {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },

      // "oneOf" will traverse all following loaders until one will
      // match the requirements. When no loader matches it will fall
      // back to the "file" loader at the end of the loader list.
      {
        oneOf: [
          // "url" loader works just like "file" loader but it also embeds
          // assets smaller than specified size as data URLs to avoid requests.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          // Process application JS with Babel.
          // The preset includes JSX, Flow, and some ESnext features.
          {
            test: /\.(js|jsx|mjs)$/,
            include: path.resolve(__dirname, '..', 'src'),
            exclude: [/[/\\\\]node_modules[/\\\\]/],
            use: [
              // This loader parallelizes code compilation, it is optional but
              // improves compile time on larger projects
              require.resolve('thread-loader'),
              {
                loader: require.resolve('babel-loader'),
                options: {
                  presets: [
                    require.resolve('babel-preset-react-app')
                  ],
                  plugins: [
                    [
                      require.resolve('babel-plugin-named-asset-import'),
                      {
                        loaderMap: {
                          svg: {
                            ReactComponent: 'svgr/webpack![path]'
                          }
                        }
                      }
                    ]
                  ],
                  compact: true,
                  highlightCode: true
                }
              }
            ]
          },
          // Process any JS outside of the app with Babel.
          // Unlike the application JS, we only compile the standard ES features.
          {
            test: /\.js$/,
            use: [
              // This loader parallelizes code compilation, it is optional but
              // improves compile time on larger projects
              require.resolve('thread-loader'),
              {
                loader: require.resolve('babel-loader'),
                options: {
                  babelrc: false,
                  compact: false,
                  presets: [
                    // require.resolve('babel-preset-react-app/dependencies')
                  ],
                  cacheDirectory: true,
                  highlightCode: true
                }
              }
            ]
          },
          // Support for SASS modules.
          {
            test: /\.(scss|sass)$/,
            exclude: /node_modules/,
            use: styleLoaders
          },
          // "file" loader makes sure assets end up in the `build` folder.
          // When you `import` an asset, you get its filename.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          // IMPORTANT: this should be the last loader within `oneOf`.
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
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
    publicPath: `http://localhost:${port}/dist/`,
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
    new webpack.HotModuleReplacementPlugin({
      multiStep: true
    }),

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new webpack.NamedModulesPlugin(),

    new MiniCssExtractPlugin({
      filename: 'static/media/[name].bundle.css',
      chunkFilename: 'static/media/[name].chunk.css'
    })
  ],

  // Disables webpack processing of __dirname and __filename.
  // If you run the bundle in node.js it falls back to these values of node.js.
  // https://github.com/webpack/webpack/issues/2010
  node: {
    __dirname: false,
    __filename: false
  },

  // What to output to console during webpack build.
  stats: {
    entrypoints: false,
    children: false
  }
};
