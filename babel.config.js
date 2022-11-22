/**
 * @babel/preset-env 支持最新的语法转换成为浏览器可以识别的版本
 * @babel/preset-react 支持转换react语法
 * @babel/plugin-transform-runtime 高版本模块转换为低版本兼容代码
 *  regenerator 控制在运行时保证非构造函数不会污染全局变量 默认是true 会保证
 */
const isDEV = process.env.NODE_ENV === "development";

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        corejs: 3, // 配置使用core-js使用的版本
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    isDEV && require.resolve("react-refresh/babel"),
    [
      "@babel/plugin-transform-runtime",
      {
        regenerator: true,
      },
    ],
    // antd 按需加载
    // ["import", {
    //     "libraryName": "antd",
    //     "libraryDirectory": "es",
    //     "style": true
    // }]
  ].filter(Boolean),
};
