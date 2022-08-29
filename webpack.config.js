// @ts-check
/**
 * @Author likan
 * @Date 2022/8/17 17:33:19
 * @FilePath E:\WorkSpace\likan\webpack.config.js
 */

const { resolve } = require('path');
const { ProvidePlugin, CleanPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const IS_PROD = process.env.NODE_ENV !== 'development';

/** @type {import('webpack').Configuration} */
module.exports = {
  cache: true,
  target: 'node',
  mode: IS_PROD ? 'production' : 'development',
  devtool: IS_PROD ? false : 'source-map',
  performance: { hints: 'error' },
  entry: './src',

  plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: process.env.NODE_ENV === 'test' ? 'server' : 'disabled' }),
    new ProvidePlugin({ vscode: 'vscode', fs: 'fs', path: 'path' }),
    new CleanPlugin(),
  ],

  optimization: {
    minimize: IS_PROD,
  },
  output: {
    path: resolve(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: resolve(__dirname, './src'),
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: IS_PROD } }],
      },
    ],
  },
  infrastructureLogging: {
    level: 'log',
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
