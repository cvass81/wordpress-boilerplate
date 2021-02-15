const path = require('path');
const sass = require('sass');
const autoprefixer = require('autoprefixer');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: ['./src/app.scss', './src/app.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(
      __dirname,
      './app/public/wp-content/themes/twentytwentyone/',
    ),
    publicPath: '',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: 'asset/resource',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'bundle.css',
            },
          },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer()],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              // Prefer Dart Sass
              implementation: sass,

              // See https://github.com/webpack-contrib/sass-loader/issues/804
              webpackImporter: false,
              sassOptions: {
                includePaths: ['./node_modules'],
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
    ],
  },
  plugins: [
    new BrowserSyncPlugin({
      files: '**/*.php',
      injectChanges: true,
      proxy: 'http://grafgo.local',
    }),
  ],
};
