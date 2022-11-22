const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const commonConfig = require("./webpack.common.js");

let config = merge(commonConfig, {
  mode: "production",
  plugins: [
    // 将public文件复制到dist目录下
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"), // 复制public下文件
          to: path.resolve(__dirname, "../dist"), // 复制到dist目录中
          filter: (source) => {
            return !source.includes("index.html"); // 忽略index.html
          },
        },
      ],
    }),
    // 每次打包dist前 先删除里面的文件，保证没有上一次打包的无用文件
    new CleanWebpackPlugin(),
    new webpack.ids.HashedModuleIdsPlugin(),
    /**
     * CSS 提取单独文件
     * 此MiniCssExtractPlugin当前版本会导致smp.wrap打包监控时报错
     * https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
     *
     *  */
    new MiniCssExtractPlugin({
      filename: "static/css/[name].css",
      // chunkFilename: "chunk/[id].[contenthash:8].css",
    }),
  ],
  // 监控 资源文件和入口文件大小检测 warning 警告提示
  performance: {
    hints: "warning",
    // 最大的静态资源文件大小 80000 Bytes
    maxAssetSize: 80000,
    // 最大入口文件大小 400000 Bytes
    maxEntrypointSize: 400000,
  },
  optimization: {
    minimizer: [
      // CSS 压缩
      new CssMinimizerPlugin(),
    ],
    runtimeChunk: {
      name: "mainfest",
    },
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        dll: {
          test: /[\\/]node_modules[\\/](react|react-demo|react-dom-router|babel-polyfill|antd|@ant-design)/,
          // 最小
          minChunks: 1,
          // 权重
          priority: 2,
          name: "dll",
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 1,
          priority: 1,
          name: "vendors",
        },
      },
    },
  },
});

if (process.env.npm_lifecycle_event === "build:watch") {
  config = merge(config, {
    devtool: "cheap-source-map",
  });
}

if (process.env.npm_lifecycle_event === "build:report") {
  const BundleAnalyzerPlugin = WebpackBundleAnalyzer.BundleAnalyzerPlugin;
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
