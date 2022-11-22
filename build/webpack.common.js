const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const os = require("os");
// const HappyPack = require("happypack");

const resolve = (dir, fileName, dirName = __dirname) =>
  path.resolve(dirName, dir, fileName);

const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");

// 根路径
const rootPath = path.join(__dirname, "..");
// src路径
const srcDir = path.join(__dirname, "../src");

// 图片路径
const imgsDir = path.join(__dirname, "../src", "/assets/images");

// 视频路径
const mediasDir = path.join(__dirname, "../src", "/assets/medias");

// 图标字体
const fontsDir = path.join(__dirname, "../src", "/assets/fonts");

// plubic路径
const publciDir = path.join(__dirname, "../public");
// 是否是开发环境
const isDev = process.env.NODE_ENV !== "production";
console.log("isDev", isDev);
console.log("src", path.resolve(__dirname, "../src", "Main.tsx"));

// 创建共享进程池
// const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  entry: {
    main: resolve("../src", "Main.tsx"), // 主入口文件
  },
  output: {
    filename: "static/js/[name].js", // 每个输出的js文件名称
    path: path.join(__dirname, "../dist"), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [srcDir],
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            // 预设执行顺序由右往左,所以先处理ts,再处理jsx
            presets: ["@babel/preset-react", "@babel/preset-typescript"],
          },
        },
      },
      {
        test: /\.less$/,
        include: [srcDir],
        use: [
          // 开发环境不拆分CSS文件
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                strictMath: true,
                noIeCompat: true,
              },
            },
          },
        ],
      },
      // {
      //   test: /.css$/,
      //   use: ["happypack/loader?id=cssHappyPack"],
      // },
      {
        test: /.css$/,
        include: [srcDir],
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      /**
       * https://webpack.docschina.org/guides/asset-modules/#inlining-assets
       * webpack5 内置 url-loader raw-loader file-loader
       * url-loader   文件作为url内联到bundle中
       * filr-loader  放到输出目录
       * raw-loader   文件导入为字符串
       * 新内置方法
       * file-loader => asset/resource
       * url-loader => asset/inline
       * raw-loader => asset/source
       * asset 根据文件大小在resource和inline之间切换
       */
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/images/[name][hash][ext]",
        },
        include: [imgsDir],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: "asset",
        generator: {
          filename: "static/medias/[name][hash][ext]", // 文件输出目录和命名
        },
        include: [mediasDir],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/fonts/[name][hash][ext]", // 文件输出目录和命名
        },
        include: [fontsDir],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: `${publciDir}/index.html`,
      inject: true, // 自动注入静态资源 默认为true 将script文件放置于body底部
    }),
    // css文件拆分配置
    // new MiniCssExtractPlugin({
    //   filename: "[name].[contenthash:8].css",
    //   chunkFilename: "chunk/[id].[contenthash:8].css",
    // }),
    // new HappyPack({
    //   id: "tsHappyPack",
    //   // 转换的内容进行临时缓存
    //   loaders: ["babel-loader?cacheDirectory=true"],
    //   // 使用共享进程池中来处理该类型任务
    //   threadPool: happyThreadPool,
    //   // 默认为true
    //   verbose: true,
    // }),
    // new HappyPack({
    //   id: "lessHappyPack",
    //   loaders: [
    //     // 开发环境不拆分CSS文件
    //     isDev ? "style-loader" : MiniCssExtractPlugin.loader,
    //     "css-loader",
    //     "postcss-loader",
    //     {
    //       loader: "less-loader",
    //       lessOptions: {
    //         strictMath: true,
    //         noIeCompat: true,
    //       },
    //     },
    //   ],
    //   // 使用共享进程池中来处理该类型任务
    //   threadPool: happyThreadPool,
    // }),
    // new HappyPack({
    //   id: "cssHappyPack",
    //   loaders: [
    //     // 开发环境不拆分CSS文件
    //     isDev ? "style-loader" : MiniCssExtractPlugin.loader,
    //     "css-loader",
    //     "postcss-loader",
    //   ],
    //   // 使用共享进程池中来处理该类型任务
    //   threadPool: happyThreadPool,
    // }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@": rootPath, // 根路径
      "@src": srcDir, // src 路径
    },
  },
};
