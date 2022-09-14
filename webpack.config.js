// @ts-check
/**
 * @Author likan
 * @Date 2022/8/17 17:33:19
 * @FilePath E:\WorkSpace\likan\webpack.config.js
 */

const { resolve } = require('path');
const { ProvidePlugin, optimize, CleanPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

const IS_PROD = process.env.NODE_ENV !== 'development';

/** @type {import('webpack').Configuration} */
module.exports = {
  cache: true,
  target: 'node',
  mode: IS_PROD ? 'production' : 'development',
  devtool: IS_PROD ? false : 'source-map',
  entry: './src/index.ts',

  plugins: [
    new CleanPlugin(),
    new optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new BundleAnalyzerPlugin({ analyzerMode: process.env.NODE_ENV === 'test' ? 'server' : 'disabled' }),
    new ProvidePlugin({ vscode: 'vscode' }),
  ],

  optimization: {
    minimize: IS_PROD,
    usedExports: IS_PROD,
    sideEffects: IS_PROD,
    concatenateModules: IS_PROD,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          ecma: 2020,
          mangle: true,
          compress: {
            drop_console: IS_PROD,
          },
          format: { comments: false },
          module: true,
        },
      }),
    ],
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
    mainFields: ['module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: resolve(__dirname, './src'),
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: IS_PROD, experimentalWatchApi: IS_PROD } }],
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
