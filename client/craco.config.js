// craco(Create React App Configuration Override)是一个对Create React App(CRA)配置进行自定义覆盖而不需要eject的Node.js库。
// CRA是一个官方提供的用于创建单页React应用的脚手架，隐藏了Webpack，Babel等构件工具的复杂配置。
// 当项目需要更复杂的配置时，需要暴露这些配置项，官方的推荐方法是执行eject命令，但eject之后，项目将不会再享受CRA的简易维护和升级

const { configure } = require("@testing-library/react");

// 为了解决这个问题，craoco提供了一种方式来自定义CRA 的Webpack,Babel，ESLint等配置，而不用执行eject。
// 使用craoco，可以在不修改node_modules/react-scripts的情况下，通过创建一个craco.config.js文件来覆盖CRA的默认配置

// https://craco.js.org/docs/getting-started/
module.exports = {
  // devServer是webpack中的一个配置 : 开发环境下的server
  devServer: {
    port: 8000, // B 端(前端)  tip:在本地开发时，可以通过http://localhost:8000访问应用
    //当只要命中了以api开头的路由...,都指向所指定的属性值
    proxy: { //代理配置
      "/api": "http://localhost:3001", //mock 服务
    },
  },
  webpack: {
    configure(webpackConfig) {
      if (webpackConfig.mode === "production") {
        // 抽离公共代码只在生产环境下执行(线上环境)
        if (webpackConfig.optimization == null) {
          webpackConfig.optimization = {};
        }
        webpackConfig.optimization.splitChunks = {
          chunks: "all", //对所有的chunk应用代码分割
          cacheGroups: {  //配置三个缓存组
            antd: {
              name: "antd-chunk",
              test: /antd/, //匹配所有从antd引入的组件
              priority: 100, //权限(权限越高，优先级越高)
            },
            reactDom: {
              name: "reactDom-chunk",
              test: /react-dom/,
              priority: 99,
            },
            vendors: {
              //第三方插件
              name: "vendors-chunk",
              test: /node_modules/, //所有的第三方插件都引用于node_modules(上边的antd和reactDom如果不写的话，也会在这个范围中)
              // 因为它们两个的体积最大，所以单独抽离出来
              priority: 98,
            },
          },
        };
      }
      return webpackConfig;
    },
  },
};
