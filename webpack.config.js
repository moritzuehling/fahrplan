const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename:  '[name].[hash].js'
  }, resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new CleanWebpackPlugin({ 
      cleanOnceBeforeBuildPatterns: ['./dist'],
    }),
    new CopyWebpackPlugin([{
      from: './src/assets',
      to: './assets/'
    }]),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
    },
  )],
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader' },
      { test: /\.(eot|svg|woff|ttf|woff2)$/, use: 'file-loader' },
      { test: /\.(png)$/, use: 'file-loader' },
      { test: /\.scss$/, use: ['style-loader','css-loader','sass-loader'] },
	{ test: /\.css$/, use: ['style-loader','css-loader'] },
    ]
  },

  devServer: {
  }
};
