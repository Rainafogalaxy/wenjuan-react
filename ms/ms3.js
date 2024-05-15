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
12.Vue的组件间通信有几种方式？
13.如何收集项目中的各种数据指标，以用于优化项目？
14.有哪些衡量网页性能的指标和方法？
15. pinia和vuex有啥区别？
16.关于nextTick？
17.数组的方法有哪些？
18.CSRF攻击，XSS攻击，用来防御的常见场景？
19.怎么获取浏览器的信息？
20.MVVM是什么？
21.rem和em ，vw和vh
22.同源策略？
23.首屏优化指标怎么分析的？
24.首屏优化的关键指标？
25.关于响应状态码
26.事件循环？
27.Jquery和Vue的区别？
28.promise.all和promise.race的区别？
29.可不可以让promise的状态不管成功还是失败都并行结束？
30.splice和slice有什么区别？

  
  
 
  **/
