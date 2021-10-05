/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
// MiniCssExtractPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// Terser Plugin
const TerserPlugin = require('terser-webpack-plugin');
// ManifestPlugin
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
// Clean webpack plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// ESLintPlugin
const ESLintPlugin = require('eslint-webpack-plugin');
// Dotenv
require('dotenv').config();

const isDev = (process.env.ENV === 'development');
const entry = ['./src/frontend/index.js'];

if (isDev) {
  entry.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true');
}

module.exports = {
  entry,
  mode: process.env.ENV,
  output: {
    path: path.resolve(__dirname, 'src/server/public'),
    filename: isDev ? 'assets/app.js' : 'assets/app-[contenthash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        // Here we indicate exactly what cacheGroups we will take to render.
        vendors: {
          name: 'vendors',
          chunks: 'all',
          reuseExistingChunk: true,
          // Ask if we want to use existing chunks
          priority: 1,
          // priority 1: is the max priority
          filename: isDev ? 'assets/vendor.js' : 'assets/vendor-[contenthash].js',
          enforce: true,
          // This process, (the build), always has to happen, otherwise it will not work, the code will break.
          test(module, chunks) {
            const name = module.nameForCondition && module.nameForCondition();
            return chunks.name !== 'vendors' && /[\\/]node_modules[\\/]/.test(name);
          },
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|styl)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[contenthash].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    isDev ? new webpack.HotModuleReplacementPlugin() : () => {},
    isDev ? () => {} : new WebpackManifestPlugin(),
    isDev ? () => {} : new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: path.resolve(`${__dirname}src/server/public`),
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? 'assets/app.css' : 'assets/app-[contenthash].css',
    }),
    isDev ? new ESLintPlugin({
      extensions: ['js', 'jsx'],
      fix: true,
    }) : () => {},
  ],
};
