const path = require('path');
const sass = require('sass');
const autoprefixer = require('autoprefixer');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: ['./src/app.scss', './src/app.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './app/public/wp-content/themes/cv/assets/'),
    publicPath: '',
  },
  mode: 'development',
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        use: ['file-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              // make loader to behave like url-loader, for all svg files
              encoding: 'base64',
            },
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false },
              ],
            },
          },
        ],
        exclude: /node_modules/,
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
        exclude: /node_modules/,
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
      {
        loader: 'webpack-modernizr-loader',
        exclude: /node_modules/,
        test: /\.modernizrrc\.js$/,
        // Uncomment this when you use `JSON` format for configuration
        // type: 'javascript/auto'
      },
    ],
  },
  resolve: {
    alias: {
      modernizr$: path.resolve(__dirname, './src/.modernizrrc.js'),
    },
  },
  plugins: [
    new BrowserSyncPlugin({
      files: '**/*.php',
      injectChanges: true,
      proxy: 'http://grafgo.local',
    }),
  ],
};
