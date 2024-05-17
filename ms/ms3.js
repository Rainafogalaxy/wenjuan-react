/** 
1.怎么将url中的query转换为对象？
     使用原生JavaScript：
       // 手动解析URL的查询字符串，将其转换为一个对象
            const getQueryParams = (url) => {
              let queryParams = {};
              let urlObject = new URL(url); //利用URL类解析URL
              let params = new URLSearchParams(urlObject.search); //利用URLSearchParams处理查询参数
              params.forEach((value, key) => {
                queryParams[key] = value;
              });
              return queryParams;
            };
            const url =
              "https://www.google.com/search?q=%E8%B0%B7%E6%AD%8C%E9%83%B5%E7%AE%B1&oq=&gs_lcrp=EgZjaHJvbWUqCQgBEEUYOxjCAzIJCAAQRRg7GMIDMgkIARBFGDsYwgMyCQgCEEUYOxjCAzIJCAMQRRg7GMIDMgkIBBBFGDsYwgMyCQgFEEUYOxjCAzIJCAYQRRg7GMIDMgkIBxBFGDsYwgPSAQwyMjE1NjQ2ajBqMTWoAgiwAgE&sourceid=chrome&ie=UTF-8";
            const params = getQueryParams(url);
            console.log(params);
            
            // 直接从当前页面的URL获取查询参数
            const getQueryParams2 = () => {
              let queryParams = {};
              let params = new URLSearchParams(window.location.search); //获取当前URL的查询字符串部分
              params.forEach((value, key) => {
                queryParams[key] = value;
              });
              return queryParams;
            };
2.URL的各部分有什么含义？
     1.协议：Scheme 指明访问资源使用的协议类型(http,https,ftp,mailto)
     2.子域名(subdomain)：
     3.域名(domain)：站点名称(可读地址)
     3.端口(port)：用于区分服务器上的不同服务
     4.路径(path)：
     5.查询字符串(query):用于传递额外参数(跟在'？'后边)
     6.锚点Fragment:用于定位网页中的特定部分，在URL中以#开始；
    2.1 如何获取URL中的各个部分？
        可以使用URL类来解析并访问URL的各个部分：
           const url = new URL(window.location.href) //获取当前页面的完整URl
              --> 获取协议：url.protocal
                  获取主机名(包括域名和端口号):url.host
                  获取端口：url.port
                  获取路径：url.pathname
                  获取查询字符串：url.search
                  获取查询参数对象：url.searchParams.get('xxx');
                  获取锚点：url.hash

3.React的生命周期？
  在useEffect()函数可以看作是componentDidMount，componentDidUpdate，componentWillUnmount的集合，
  useEffect接受两个参数，一个是执行函数，一个是依赖项数组；
  --> 1. 不写依赖项数组： useEffect(()=>{}) -->副作用函数会在组件每次渲染后运行
      2. 空依赖数组：useEffect(()=>{},[]) -->副作用函数只会在组件挂载时执行一次 (componentDidMount)
      3. 包含依赖项的数组:当数组中包含一个或多个依赖时，只有当依赖项改变时，副作用函数才会执行(componentDidUpdate)
      4. 清理函数：useEffect的副作用函数可以返回一个清理函数(return)，这个清理函会在组件卸载前执行，或者在依赖项改变用且副作用重新执行前执行【可用于执行如取消网络。定时器或取消订阅等清理任务】
         --> useEffect(()=>{
               const timer = setTimeout(()=>{
                console.log('i am the king of the world')
               };
              return()=>{
                clearTimeout(timer);//在组件卸载前或依赖项变化前
              }
            )
         }，[count])
4.Set和Map的区别？哪个查找效率更高一点？数组中查找一个元素，有几种方法？
  Set是一个存储唯一值的集合，不支持索引，插入和查找操作的时间复杂的为O(1)，内部使用哈希表
  Map是键值对的集合，类似于对象，与对象的区别是键值key可以是任意类型，查找操作的时间复杂度也是O(1)
    --> 1. indexOf() 用来查找数组中某个元素的第一个索引，如果找到元素，返回它的索引，没找到返回-1
        2. includes()用来检查数组中是否包含某个元素，返回true或false
        3. find()返回数组中满足提供的测试函数的第一个元素的值，如果没有符合条件的元素，会返回undefined
        4. findIndex() 返回索引
        5. filter() 返回一个新数组
        6. some() 测试数组中至少有一个元素是否通过测试函数，返回布尔值
        7. eveny() 测试数组内的所有元素是否都通过测试函数，返回布尔值
5.数据链路层有什么协议？
  MAC，VLAN等
6.mac地址是干什么的，有什么用？
  MAC地址被称为硬件地址或物理地址，是网络设备在网络层次中的唯一标识符;
  1.在数据链路层，MAC地址用于网络设备之间的通信，当数据包(帧)从一个设备传输到另一个设备时，MAC地址用于确保数据包到达正确的目的地;
  2.网络设备标识：由于每个设备的MAC地址是唯一的，它可以用来标识网络上的设备，在某些网络安全应用中，MAC地址用于控制设备的网络访问权限;
  3.网络管理：管理员可以通过MAC地址跟踪网络中的设备，进行网络流量分析或控制网络安全;
  4.网络安全：在许多企业以及教育网络中，MAC地址过滤常被用作一种基础的接入控制措施，以允许或拒绝特定设备的网络访问;
👑7.dns查询的过程？
  DNS查询主要分为两种类型：递归查询和迭代查询；
  DNS是一种分布式数据库，用于将人类可读的域名转换为机器可以识别的IP地址;
  1. 当在浏览器中输入一个URL或请求网络资源时，客户端首先要找到该URl对应的IP地址;
  2. 大多数操作系统都会缓存DNS查询结果，如果IO地址没有在本地缓存，就会开始一个DNS解析过程;
  3. 首先会询问本地DNS解析器；
  4. 如果本地DNS服务器没有缓存该域名的记录，它还会进行一个递归查询的过程，一直向上；
  5. 到根DNS服务器，根服务器不会解析域名(没有直接的域名到IP地址的映射信息，但它知道所有顶级域名服务器的位置)，他会返回管理请求顶级域(如.com)的顶级域名服务器的IP地址；
  6. 到顶级域名服务器，如果请求的域名是以.com结尾的，那么这个顶级域名服务器就是包含管理所有以.com域名的服务器，接着他会返回给本地DNS包含请求的域名信息的权威DNS服务器的IP地址(哪个权威DNS服务器负责该具体域名)；
  7. 到权威DNS服务器，本地DNS服务器会向该域名的权威DNS服务器发出请求，然后由权威DNS服务器返回存储的域名对应的IP地址
  8. 本地服务器会将信息缓存起来(根据TTL(生存时间))
  9. 本地服务器将解析结果返回给最初发起请求的设备
  --->性能优化：
            缓存： DNS服务器会根据DNS记录中的TTL值缓存查询结果，缓存可以减少DNS解析时间，减轻服务器和TLD服务器(顶级服务器)的压力;
            负载均衡：大型网站会使用多个IP地址来处理对其域名的请求，DNS服务器可以根据不同的策略返回不同的IP地址;
8.端口号有什么用？
  区分设备上不同应用程序或服务的数字标识【端口号和IP地址一起使用，可以精确地定位网络中一个设备上的特定程序】
  端口号的用途： 1.区分服务：计算机可以同时运行多种网络服务，端口号帮助网络路由器和交换机接收到的数据包导向正确的服务；

9.登录状态如何保持？
  token
10.前端的网络安全可以怎么维护？
  https://getemoji.com/
11.怎么防范中间人攻击？
 中间人攻击：是一种网络安全威胁，攻击者秘密拦截，发送或修改通信双方之间的通信，以窃取信息，欺骗双方或破坏数据;
 常见攻击形式：
             1. HTTP劫持：在用户和网站之间插入，未加密的HTTP链接被攻击者用于注入恶意内容或重定向到假冒网站
             2. DNS欺骗：篡改DNS响应将用户重定向到恶意网站
             3. SSL剥离：攻击者强迫用户端使用非加密连接【尽管客户端和服务器原本都支持加密连接】
             4. WIFI电子侦听
             5. Email劫持：拦截电子邮件信息
12.Vue的组件间通信有几种方式？
  1. props / Events
  2. Provide / Inject
  3. vuex
  4. teleport 【<Teleport> 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。 】
  5. pinia
  6. eventbus
13.如何收集项目中的各种数据指标，以用于优化项目？
14.有哪些衡量网页性能的指标和方法？
15.pinia和vuex有啥区别？
16.关于nextTick？
17.数组的方法有哪些？
18.CSRF攻击，XSS攻击，用来防御的常见场景？
19.怎么获取浏览器的信息？
  navigator对象，它提供了关于浏览器的信息(浏览器版本，用户代理字符串User-Agent)
  const userAgent = navigator.userAgent;(包含浏览器类型，版本和所在的操作系统等信息)
  const platform = navigator.platform;(用户的操作系统)
  ---> 使用Modernizr：
                    是一个js库，可以检查用户逇浏览器是否支持某些CSS3特性。HTML5 API等
                    引入后：
                          if(Modernizr.flexbox){
                            //支持flexbox
                          }else{
                            //支持flexbox
                          }
  ---> 使用UAParser.js:
                      import UAParser from 'ua-parser-js';
                      const parser = new UAParser();
                      const result = parser.getResult();
                      console.log(result.browser);  //浏览器信息
                      console.log(result.device);  //设备信息
                      console.log(result.os); //操作系统信息
    tip：用户代理字符串是可以被修改的，所以某些情况下并不安全
20.MVVM是什么？
21.rem和em ，vw和vh
22.同源策略？
23.首屏优化指标怎么分析的？
24.首屏优化的关键指标？
25.关于响应状态码
26.事件循环？
27.Jquery和Vue的区别？
  Jquery本质是只是让在js中操作dom，事件处理，选择元素的方式比原生更简单一些，方便写代码；
  而vue是一个js框架，它的核心是MVVM模型，vue提供了一套完整的用于开发页面的(特别是单页面应用的工具)，比如路由管理，组件系统。模板语法，内置指令和内置组件等；
  它对于页面的DOM元素的处理，采用虚拟DOM的比对方式，通过快速Diff算法，对要发生变化的dom元素进行相应的排序和变更，在更新视图的变化，一定程度上减少了DOM操作对页面性能的开销；
28.promise.all和promise.race的区别？
   promise.all()接受一个promise数组，在所有数组中的promise实例返回resolve后，promise.all()会返回resolve()，只要有一个元素返回reject()，promise.all()就返回reject()
   promise.race()也是接受一个数组，它的返回值会根据数组中第一个有状态返回的元素的状态决定；
29.可不可以让promise的状态不管成功还是失败都并行结束？

30.splice和slice有什么区别？
  splice是原地删除或添加数组中的元素，slice会返回一个由参数起始索引(start)和结束索引(end)决定的原数组的浅拷贝

31. 在package.json文件中，dependencies和devDependencies有什么区别？
   -->dependencies 列出了项目在生产环境中运行所需要的依赖，比如说如果项目使用Vue框架开发，那么vue就应该在这里
   -->devDependencies 列出了只在开发环境中需要的依赖包，这些依赖主要用于开发过程(在生产环境中不是必须的，比如说单元测试，代码格式化工具eslint等，都应该在这里)
     区分这两者可以：
               1.优化生产环境，只将必要的包部署到生产环境，可以减小生产环境的大小，优化应用的加载时间和性能；
               2.安全性：减少生产环境的大小，优化应用的加载时间和性能；
     使用npm或yarn时：
                    1. 安装生产依赖：npm i package-name --save  【从npm 5 开始默认就是将依赖添加到dependencies，所以--save也可以省略】  yarn add package-name
                    2. 安装开发依赖: npm i package-name --save-dev 【会添加到devDependencies】 yarn add package-name --dev
32. Vite的依赖预构建？(主要是为了项目中的第三方库，因为这些第三方包并不一定是ES模块格式，而且有些包的数量很多，直接加载会影响性能(因为会发起很多网络请求))
   1.当第一次运行Vite时，vite首先会检查项目中的package.json文件，找出项目中应用的所有依赖
   2.vite会预构建(预打包)这些依赖到node_modules/.vite目录中，(esbuild)
   3.预构建的结果会被缓存下来
      -->优点：1.开发环境下，可以快速启动服务器
              2.减少请求，将多个依赖合并到少数几个ESM包中，减少了浏览器在模块开发过程中需要处理的请求数量
              3.确保不是以ES模块格式提供的依赖，也可以在现代浏览器中运行
33.对useCallback，useMemo这两个hook的理解，有什么区别？以及适合在什么场景下应用？
  1.useMemo()
      参数一个函数和一个依赖数组
      eg.
      const ThisIsReactComponent = ({a,b})=>{
        const expensiveValue = useMemo(()=>{
          return a + b;
        },[a,b]);
        return <div>{expensiveValue}</div>
      }

      const App = ()=>{
        const [count,setCount] = useState(0);
        return (
          <div>
            <button onClick = {()=>setCount(count+1)>
              Increment
            </button>
            <ThisIsReactComponent a = {10} b = {20} / >
          </div>
        )
      }
  2.useCallback() 用来记忆函数，只有当依赖数组中的值发生变化时，才会返回一个新的函数

  区别：
     1.useMemo用于缓存计算结果 ： 计算结果需要大量计算而不需要频繁更新的场景
     2.useCallback用于缓存一个函数 ：避免子组件进行不必要的渲染(传递给子组件的事件处理函数)
     两者只有在依赖数组中的元素发生变化时才会重新返回新的值
  注意：
      不应该滥用这两个钩子，因为在某些情况下会造成相反的效果，比如说虽然可以读取缓存结果，但React在每次渲染前都会判断一下依赖数组中的元素是否变化，
      以此来决定他们两个的返回值，如果依赖数组很大或计算函数比较复杂，性能会因此下降

34. webpack是怎么处理commonjs/esm的？
   1.处理Commonjs模块：1. 解析依赖：webpack解析require调用来确定依赖关系；
                      2. 加载模块：webpack加载并执行模块文件，将其包装到一个函数中，以避免全局命名空间冲突；(每个模块都有自己的作用域)
                      3. 导出模块：处理module.exports来确定模块的导出内容;
                      4. 合并代码：webpack将所有模块的代码合并到一个或多个打包文件中，并为每个模块生成唯一的标识符；

    tip：ESM模块是静态的，即在编译阶段(而不是运行时)就可以完全确定和解析模块的依赖关系；
         ESM禁止动态导入(不能将import放在条件语句中)
         提升性能：由于所有依赖关系在编译时就已经确定，浏览器可以并行加载所需要的所有模块，而不是等待脚本运行到某个位置才开始加载；
         按需加载：虽然ESM不支持动态导入，但可以使用import()函数来实现按需加载
         -->与之相比，CommonJS模块系统是动态的，即require可以在代码的任何地方使用(函数和条件语句)，但同时构建工具在解析和优化时就需要处理更多的复杂关系

  ==》 webpack 的Loader和Plugin：
      1. Loader是用于转换模块的，它们允许在import或require模块时预处理文件，Loader本质上是一个函数，接受源文件作为输入，然后返回转换后的结果，从而实现对文件的一系列转换；
      预处理：在文件进入打包过程之前对其进行预处理
      2. Plugin用于执行从打包到完成的各种任务和自定义功能，与Loader专注于将一种文件类型转换为另一种文件类型不同，它能参与到构建过程的各个阶段，
      可以用于优化打包结果，管理资源，插入环境变量等；

35. React组件中绑定一个事件和直接操作DOM绑定一个事件有什么区别？
36. React的hook使用时有一些限制？为什么？
37. HTTP2相对于HTTP1的变化？
    1. HTTP1是基于文本的协议，每个请求/响应都是一个独立的报文，头部和主体以纯文本形式发送;
       HTTP2引入二进制分帧层 将所有的请求和响应转换为二进制格式，数据被分为更小的帧，头部和数据帧可以独立发送;
    2. HTTP1同一个TCP连接上只能处理一个请求，必须等待当前请求完成才能发送下一个请求(队头阻塞问题)
       HTTP2允许在单个TCP连接上并行处理多个请求和响应
    3. HTTP1每个请求都要发送完整的头部，头部通常是冗长的；
       HTTP2使用HPACK算法对头部进行压缩，减少带宽
    4. HTTP1服务器只能响应客户端的请求，不能注定推送资源
       HTTP2服务器可以在哭护短请求之前主动推送资源，以减少延迟(服务器推送可以优化首屏渲染时间)
38.








**/
