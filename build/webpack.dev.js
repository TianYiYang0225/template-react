const path = require("path");
const { merge } = require("webpack-merge");
const RectRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const commonConfig = require("./webpack.common.js");

module.exports = merge(commonConfig, {
  devtool: "eval-source-map",
  mode: "development", // 开发模式
  devServer: {
    hot: true,
    // 端口
    port: 9000,
    // 自动打开页面
    open: true,
    // 找不到路由时可以默认返回到指定页面 默认首页index.html
    historyApiFallback: true,
    // gzip压缩,开发环境不开启,提升热更新速度
    compress: false,
    static: {
      directory: path.join(__dirname, "../public"),
    },
    proxy: {
      "/mock": {},
    },
  },
  /**
   * 增加react热重载插件，保证状态不丢失的情况下更新页面
   * 如果不加入此插件，每次更新tsx文件时会采用刷新页面的形式加载文件，导致状态丢失（输入框内容丢失）
   *  */
  plugins: [new RectRefreshWebpackPlugin()],
  /**
   * https://webpack.docschina.org/migrate/5/#update-outdated-options
   * webpack 5.64.2 最新版本官方文档
   * 用途：显示文件原名称
   * 原使用方法：new NamedModulesPlugin()
   *
   * */
  optimization: {
    moduleIds: "named",
  },
});
