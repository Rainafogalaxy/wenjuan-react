/* 
SSO单点登录
前端实现单点登录，通常涉及到一个中心化的认证服务器，它允许用户在多个相互信任的应用间使用一套凭证进行登录。
---------------------------------------------------------
1.Vue是怎么操作DOM的？
在.vue文件中的模板最后会被转换成以js对象形式表达的虚拟DOM树结构，然后vue的内部为了减少更多的DOM操作，使用diff算法对比这些虚拟dom内部节点的变化，
再进行移动和更新，最后会对这些虚拟dom批量转换成真实dom显示到页面，对于列表渲染出来的元素，在书写vue代码时，vue就会提示每个列表项必须要有一个唯一的key，而且vue也不推荐使用索引来作为key，
因为在虚拟dom的对比以及更新中，需要一个稳定且唯一的值来判断当前节点的位置和内容信息，最后来决定是否需要重新patch或移动，如果经过计算后的列表项不需要任何变化，虚拟dom就不会被改变，
这样会避免不必要的dom操作

[vue的内部有一个异步更新队列，在同一个事件循环中，即使数据变化多次，DOM更新也只会执行一次。Vue会将所有的数据变更积累起来，在事件循环的下一个tick中统一处理，可以避免不必要的重渲染]
-------------------------------
HTTP

2.GET 和 POST 的区别
答：首先GET请求与POST请求最明显的区别就是，
GET请求主要是向服务端请求数据(也可以发送数据,数据会被放到url中传输，不太安全，而且数据的长度也有限制)，POST请求一般是向服务器提交数据(数据会被放到body中传输，相对更安全，数据长度没限制)；
-->幂等性：GET请求具有幂等性 :即使执行多次GET请求，从服务器返回的结果都是相同的
          POST不具有幂等性(PUT具有幂等性)
-->安全性：GET方法不会修改服务器上的资源，所以是安全的
          POST会修改服务器上的资源，因此不安全
-->是否可缓存: GET方法响应可以被缓存(可以省去再次请求服务器)
              POST方法默认不可缓存 

3.重定向的地址怎么返回给前端
4.HTML文档结构？
5.ES6新特性？
6.Vue中的组件怎么在浏览器中展现的？
7.(错误监控组件) ？
8.Vite和Webpack的不同
9.什么是BFC？怎么触发BFC？
10.协商缓存和强缓存？
11.Vue2与Vue3的区别？
12.for...in 与 for...of的区别？
13.TS有一个接口A，让接口B只继承A中的a,b,c三个属性，怎么做？

---------------
90%(js/css)：
1.JS数据类型？
答：String,Number,Object,BigInt,Symbol,Null,Undefined,Boolean

2.怎么判断JS数据类型？
typeof , instanceof , Object.prototype.toSting.call()

typeof这种方式不能准确判断null，array和object，它们三种返回的结果都是object，而且也不能准确判断NaN， typeof NaN 会返回 Number
instanceof只能判断引用类型的数据，因为它的原理是检测实例对象的原型链上有没有构造函数的prototype属性
Object.prototype.toString.call()方法可以准确判断任何类型

3.数组方法？
Array.prototype.forEach()  返回undefined ，接受一个函数作为参数，会对数组内的每一项元素执行给定方法，不改变原数组
Array.prototype.map(),返回一个新的数组，不改变原数组，新数组的元素是原数组中元素通过给定函数执行后的结果
Array.prototype.filter(),返回一个新数组，不改变原数组，通过指定条件(为true)的元素会被添加到新数组中。
Array.prototype.push()
Array.prototype.pop()
Array.prototype.unshift()  在数组开头添加，返回值是数组的新长度
Array.prototype.shift()   在数组开头移除，返回值为删除元素的值
Array.prototype.reduce() 接受一个函数和一个初始值作为参数，函数的也有两个参数，一个是上一次执行指定函数的结果和当前值，
如果是第一次执行而且传入了初始值，这个值就是指定的值，否则就是数组的第一个元素
Array.prototype.concat() 不改变原数组，返回新数组。合并数组
Array.prototye.find() 接受函数作为参数，返回通过测试的第一个元素，没有通过就返回undefined
Array.prototye.findIndex()  返回满足测试函数的第一个索引，没有返回-1

4.H5的新特性？
1.利于SEO的语义化标签
<header> <nav> <footer> <section>  <arcticle> <aside>
2.可以在网页中插入视频和音频
<vedio>,<audio>
3.画布和可缩放矢量图形
<canvas>,<svg>
4.web存储
引入localStorage和sessionStorage，indexDB
5.实时通信
WebSockets(提供在客户端和服务器之间进行全双工通信的能力) 和 WebRTC(允许网页应用进行实时视频，音频通讯和数据共享)
6.拖放API
Drag and Drop    https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
7.地理定位
Geolocation API   https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation
8.跨文档消息传递
PostMessage API  (跨源通信)
9.表单控件
-->新的输入类型 email color range date等
-->placeholder
-->autocomplete,autofocus,required
10.离线应用
Application Cache(已被Service Workers取代)
Service Workers  https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API

5.commonJS和ESmodule的区别 ？
(commonJS普遍用于服务器端，ES模块一般用在浏览器中，最新版本的NodeJs也可以用ES模块)
1.commonJS使用同步的方式导入模块，在服务器端从磁盘加载非常迅速，但在浏览器端加载新的模块会发起网络请求，等待网络传输，阻塞页面渲染
  ES模块异步加载，(利用script标签加载)
2.commonJS 输出的是对模块的浅拷贝，会运行缓存的结果，一旦输出，模块内的值就算变化也不会被影响到，除非输出的是一个函数
  ES module 是对模块的只读引用，对模块中的值赋值会报错，它不会缓存运行结果，类似于const，内部的指针指向不能改变(ES module充分考虑了静态分析的需求，可以在不执行代码的情况下分析导入导出的结果)
  (ES moudle在编译时静态解析，有利于静态分析工具进行代码优化(tree-shaking))

3.commonJS是运行时加载，而ES module的导入导出语句在js引擎解析脚本时就被确定下来了(即js引擎在执行代码前就知道了模块之间的依赖关系)

es module也支持动态导入 -->import()函数 -->按需加载

因为commonJs时运行时加载，所以在处理循环依赖时可能会有问题，因为模块很有可能在加载时不完整
而es module可以做到按照顺序依次执行循环依赖

【静态分析的优点】
Tree Shaking : 因为模块间的依赖关系在编译时就确定了，打包工具(Webpack,Rollup)可以通过静态分析识别和移除未被使用的代码，减小最终打包文件的大小
按需加载: 静态分析使实现代码分割和按需加载变得简单

*/
