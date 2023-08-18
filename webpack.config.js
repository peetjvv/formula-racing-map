const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { EnvironmentPlugin } = require('webpack');

const isDevServer = process.argv.some(v => v === 'serve');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    // noParse: /(mapbox-gl)\.js$/,
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.modernizrrc(\.json)?$/,
        use: ['modernizr-loader', 'json-loader'],
      },
      {
        test: /\.scss/,
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    // alias: {
    //   settings: path.resolve(
    //     isDevServer ? './src/settings.dev' : './src/settings.prod'
    //   ),
    // },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      favicon: './src/favicon.ico',
    }),
    new EnvironmentPlugin({
      MAPBOX_TOKEN: JSON.stringify(process.env.MAPBOX_TOKEN),
    }),
  ],
  devServer: {
    historyApiFallback: true,
  },
  devtool: 'source-map',
};
