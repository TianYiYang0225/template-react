const webpack = require('webpack')
const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer')
// const Mini = require('mini-css-extract-plugin')
const commonConfig = require('./webpack.common.js')

let config = merge(commonConfig, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.ids.HashedModuleIdsPlugin()
  ],
  // 监控 资源文件和入口文件大小检测 warning 警告提示
  performance: {
    hints: 'warning',
    // 最大的静态资源文件大小 80000 Bytes
    maxAssetSize: 80000,
    // 最大入口文件大小 400000 Bytes
    maxEntrypointSize: 400000
  },
  optimization: {
    runtimeChunk: {
      name: 'mainfest'
    },
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        dll: {
          test: /[\\/]node_modules[\\/](react|react-demo|react-dom-router|babel-polyfill|antd|@ant-design)/,
          // 最小
          minChunks: 1,
          // 权重
          priority: 2,
          name: 'dll'
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 1,
          priority: 1,
          name: 'vendors'
        }
      }
    }
  }
})

if (process.env.npm_lifecycle_event === 'build:watch') {
  config = merge(config, {
    devtool: 'cheap-source-map'
  })
}

if (process.env.npm_lifecycle_event === 'build:report') {
  const BundleAnalyzerPlugin = WebpackBundleAnalyzer.BundleAnalyzerPlugin
  config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = config
