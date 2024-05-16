export default function ExamplePlugin(options = {}) {
  return {
    name: "example", //插件的名字，必须
    enforce: "pre",  //可选，控制插件的调用顺序
    configResolved(resolvedConfig){  //钩子函数：在服务启动时调用
        console.log('...');
    },
    transform(code,id){ //钩子函数：转换代码
        if(id.endsWith('.txt')){
            return `export default ${JSON.stringify(code)}`
        }
    }
  };
}
