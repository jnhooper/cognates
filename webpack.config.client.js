const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: "development",
  entry: {
    app: ['babel-polyfill', './client/index.js']
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 8080,
    host: '0.0.0.0',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: require.resolve('babel-loader'),
        options: {
          // include: path.resolve(__dirname, 'client'),
          include: './client',
          cacheDirectory: true,
          plugins: ['react-hot-loader/babel']
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|css)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Hot Module Replacement'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
