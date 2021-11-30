const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const os = require('os')
const HappyPack = require('happypack')
const resolve = (dir) => path.resolve(__dirname, dir)

const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

// 根路径
const rootPath = path.join(__dirname, '..')
// src路径
const srcDir = path.join(__dirname, '../src')

console.log("path.resolve(rootPath, 'src')", path.resolve(rootPath, 'src'))
// plubic路径
const publciDir = path.join(__dirname, '../public')
// 是否是开发环境
const isDev = process.env.NODE_ENV !== 'production'
console.log('src', path.resolve(__dirname, '../src', 'Main.jsx'))

// 创建共享进程池
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../src', 'Main.jsx')
  },
  output: {
    path: path.join(__dirname, '../dist')
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [srcDir],
        exclude: /(node_modules|bower_components)/,
        /**
         * 根据项目大小自行取舍是否使用多线程打包, 不选择使用可以从HappyPack中取出对应的loaders
         * */
        use: ['happypack/loader?id=jsHappyPack']
      },
      {
        test: /\.less$/,
        use: [
          // 开发环境不拆分CSS文件
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                strictMath: true,
                noIeCompat: true
              }
            }
          }
        ]
      },
      {
        test: /.css$/,
        use: ['happypack/loader?id=cssHappyPack']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: ['url-loader'],
        include: [srcDir]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: ['url-loader'],
        include: [srcDir]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: ['url-loader'],
        include: [srcDir]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: `${publciDir}/index.html`
    }),
    // css文件拆分配置
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: 'chunk/[id].[contenthash:8].css'
    }),
    new HappyPack({
      id: 'jsHappyPack',
      // 转换的内容进行临时缓存
      loaders: ['babel-loader?cacheDirectory?cacheDirectory'],
      // 使用共享进程池中来处理该类型任务
      threadPool: happyThreadPool,
      // 默认为true
      verbose: true
    }),
    new HappyPack({
      id: 'lessHappyPack',
      loaders: [
        // 开发环境不拆分CSS文件
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        {
          loader: 'less-loader',
          lessOptions: {
            strictMath: true,
            noIeCompat: true
          }
        }
      ],
      // 使用共享进程池中来处理该类型任务
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: 'cssHappyPack',
      loaders: [
        // 开发环境不拆分CSS文件
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader'
      ],
      // 使用共享进程池中来处理该类型任务
      threadPool: happyThreadPool
    })
  ],
  resolve: {
    alias: {
      '@': rootPath, // 根路径
      '@src': srcDir // src 路径
    },
    extensions: ['.js', '.jsx']
  }
}
