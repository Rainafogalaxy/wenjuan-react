// craco(Create React App Configuration Override)是一个对Create React App(CRA)配置进行自定义覆盖而不需要eject的Node.js库。
// CRA是一个官方提供的用于创建单页React应用的脚手架，隐藏了Webpack，Babel等构件工具的复杂配置。
// 当项目需要更复杂的配置时，需要暴露这些配置项，官方的推荐方法是执行eject命令，但eject之后，项目将不会再享受CRA的简易维护和升级

// 为了解决这个问题，craoco提供了一种方式来自定义CRA 的Webpack,Babel，ESLint等配置，而不用执行eject。
// 使用craoco，可以在不修改node_modules/react-scripts的情况下，通过创建一个craco.config.js文件来覆盖CRA的默认配置

// https://craco.js.org/docs/getting-started/
module.exports = {
  // devServer是webpack中的一个配置 : 开发环境下的server
  devServer: {
    port: 8000, // B 端(前端)
    //当只要命中了以api开头的路由...,都指向所指定的属性值
    proxy: {
      "/api": "http://localhost:3001", //mock 服务
    },
  },
};
