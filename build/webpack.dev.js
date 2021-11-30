const webpack = require('webpack')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

module.exports = merge(commonConfig, {
  devtool: 'eval-source-map',
  mode: 'development', // 开发模式
  devServer: {
    // 端口
    port: 9000,
    // 自动打开页面
    open: false,
    // 找不到路由时可以默认返回到指定页面 默认首页index.html
    historyApiFallback: true,
    // 调用gzip compression压缩 默认是开启的，此处只是标注一下
    compress: true,
    proxy: {
      '/mock': {}
    }
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  /**
   * https://webpack.docschina.org/migrate/5/#update-outdated-options
   * webpack 5.64.2 最新版本官方文档
   * 用途：显示文件原名称
   * 原使用方法：new NamedModulesPlugin()
   *
   * */
  optimization: {
    moduleIds: 'named'
  }
})
