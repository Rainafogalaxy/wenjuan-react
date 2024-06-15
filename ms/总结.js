/* 
1.🌺JavaScript的数据类型有几种？
  答：Null，Undefined，Boolean，Number，Object，BigInt，Symbol，String

1.1 JavaScript的数据类型分为两种，分别是引用数据类型和基本数据类型，它们的区别？
  答：(1)首先基本数据类型有七种(除了Object都是)，它们都存储在栈内存中，访问速度较快，而且对基本数据类型的复制就是对值本身的复制，
      它们的大小相对较固定。
      (2)引用数据类型是Object，它们的实际数据存储在堆中，而引用这些数据的地址值存储在栈中，对引用数据类型进行复制时，复制的是栈中的
         内存地址，修改任意原始对象和拷贝对象都会改变堆中的数据，引用数据类型的大小一般不固定，可以动态增加或减少。

✨1.2 如何实现深拷贝和浅拷贝？
*/
/* 
  深拷贝：将一个对象从内存中完整地拷贝一份出来，从堆内存中开辟一个新的区域存放该对象(新旧对象不共享同一块内存)，修改新对象不会影响原对象
  浅拷贝: 如果属性是基本类型，拷贝的就是基本类型的值，如果是引用类型，拷贝的就是内存地址
*/

/* 
浅拷贝的实现：
1.扩展运算符...
2.Object.assign()
3.Array.prototype.concat() 
4.Array.prototype.slice()
*/

/* Object.assign() 可以将所有可枚举的自有属性的值从一个或多个源对象复制到目标对象，并但会目标对象 */
let ori = { a: 1, b: { love: "dks" } };
let copy = Object.assign({}, ori);

/* 扩展运算符 */
let ori2 = { a: 1, b: { love: "dks" } };
let copy2 = { ...ori2 };

/* Array.prototye.slice(start,end) (返回一个新的数组对象，接收两个参数，start和end,包括start不包括end)*/
let ori3 = [1, 2, { a: "c" }];
let copy3 = ori3.slice(); //从索引为0处开始浅拷贝，不截取

/* Array.protptye.concat(valueN),参数可以是若干个数组，用于合并两个或多个数组,返回一个新数组。*/
let ori4 = [1, 2, { a: "c" }];
let copy4 = ori4.concat();

/* 
深拷贝的实现：
1.JSON.parse(JSON.stringify())
   tip:用JSON.stringify将对象转成JSON字符串，再用JSON.parse()把字符串解析成对象 (Object和Array可以通过它来实现深拷贝)
   缺陷：
     (1)不能正确处理Date对象，Date对象会被转换成字符串
     (2)不能拷贝undefined，Symbol和函数，这些值在序列化过程中会被忽略或转换为null
     (3)不支持循环引用，会抛出错误
     (4)不能复制Map，Set，RegExp，BigInt等特殊类型

2.递归方法：遍历对象，数组，直到里面都是基本数据类型
tip：深拷贝解决循环引用的问题，可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，
先去存储空间中找，有没有拷贝过这个对象，如果有则直接返回，没有则继续拷贝
*/
// 判断数据类型;
const checkType = (n, type) => {
  const res = Object.prototype.toString.call(n);
  if (res === `[object ${type}]`) return true;
};
// 判断是否是引用类型:
const isYy = (target) => {
  const type = typeof target;
  return target !== null && (type === "object" || type === "function");
  //因为typeof分不清object和null，所以要单独区分，而且Array类型也会被认为是Object(可以区分函数)
};

// 这个函数，目的是创建一个新的实例，它和原始对象target有相同的构造函数(保持原始对象类型的一致性)
// 比如，如果target是一个Array，返回的就是空数组；target是Map，返回新的空Map
const getInit = (target) => {
  const Ctor = target.constructor;
  return new Ctor();
};

// 初始化map，用来存储已经拷贝的对象和拷贝对象之间的对应关系
const deepClone = (target, map = new WeakMap()) => {
  const isObject = checkType(target, "Object");
  const isArray = checkType(target, "Array");
  const isMap = checkType(target, "Map");
  const isSet = checkType(target, "Set");
  // 克隆原始类型(直接返回)
  if (!isYy(target)) return target;
  let cloneTarget;
  if (isObject || isArray || isMap || isSet) {
    cloneTarget = getInit(target);
  }
  //在开始复制一个对象之前，首先检查这个对象是否已经存在于map中
  //如果已经存在于map中，说明已经对这个对象拷贝过了，所以为了处理循环引用，直接返回之前存储的拷贝对象即可，以避免进一步的递归
  if (map.get(target)) {
    return map.get(target);
  }
  map.set(target, cloneTarget); //如果当前对象还没被拷贝，就将新的对应关系存储起来

  // forEach() 方法对数组的每个元素执行一次给定的函数。(Set,Map,Array上有，Object没有)

  // 克隆Set
  if (isSet) {
    target.forEach((value) => {
      cloneTarget.add(deepClone(value, map));
    });
    return cloneTarget;
  }
  // 克隆Map
  if (isMap) {
    target.forEach((value, key) => {
      cloneTarget.set(key, deepClone(value, map));
    });
    return cloneTarget;
  }

  // 克隆对象
  if (isObject || isArray) {
    for (const key in target) {
      cloneTarget[key] = deepClone(target[key], map);
    }
    return cloneTarget;
  }
};

// 测试
const map = new Map();
const set = new Set([1, 5, 3, 2, 4, 2, 1]);
map.set(2, { 3: 2 });
const target = {
  field1: 1,
  field2: undefined,
  field3: {
    child: "i am child",
    hello: {
      hi: "haha",
    },
  },
  field4: [2, 3, 4, [6, 7, [1, 2, 3]]],
  empty: null,
  map,
  set,
};

const res = deepClone(target);
console.log(res);

/*  叙述：首先先判断要拷贝目标的数据类型，可以使用typeof来判断所要拷贝的数据是引用类型还是基本数据类型，
因为typeof判断不了null，Array和Object，所以首先要排除null，如果结果返回的是function或object，说明数据为引用类型，
如果返回其他说明是基本数据类型，可以直接返回值，对于像Map，Set等其他引用类型，可以进一步使用
Object.prototye.toString.call()判断它们的具体类型，然后根据它们原本的类型创造一个空的对象，这里可以获取到它们的constructor属性，
然后使用new操作符创建和源对象源对象一致的空对象，然后进行递归拷贝，但在拷贝之前，为了处理循环引用的问题，可以使用WeakMap数据结构，
将要拷贝的对象和拷贝的结果对象存储起来一一对应，这样如果在拷贝的过程中发现了有循环引用，在执行拷贝过程之前，现在weakmap中查找
现在的对象是否已经拷贝过，是就直接返回，不是就继续存储然后执行拷贝；
拷贝过程：对于Object和Array，可以一起使用for in循环遍历，每次循环中都递归调用自己，并且传入weakmap结构，
set和map数据类型的可以使用forEach。
*/

/* 
 1.2.1 WeakMap 和 Map 的区别？
       1.它们都是用来存储键值对的集合，Map的键值可以是任意类型的，但WeakMap只接受对象作为键值(其他类型会报错)
       2.Map对它的键和值都是强引用，只要map结构本身存在，里面的数据就不会非垃圾回收机制回收(可能会导致内存泄露)
         WeakMap对键是弱引用，如果没有值指向键，这些对象就会被垃圾回收机制回收。
       3.Map的键与值可枚举(keys,values,entries方法遍历Map)，WeakMap不支持迭代，因为键对象的存在性不稳定
*/

/* 
  2.Null与undefined的区别？
    1.Null表示空对象，常被用作一个对象的初始值
    2.undefined表示未定义，变量声明但还没赋值就会返回undefined
    3.使用'=='比较两者返回 true ，使用'==='返回false

    2.1 isNaN 和 Number.isNaN 的区别？
        1.isNaN是JavaScript中的全局函数，用来检测参数是否为NaN或数字，它在检测前会首先将参数转换为数字(隐式类型转换)
        【isNaN可以对非数字值返回true】
        2.Number.isNaN()是ES6中引入的一个方法，更严格，它不会进行隐式类型转换，只有在参数类型是number且是NaN时才返回true

    2.2 Object.is 与 '==' 和 '==='的区别？
        1. '=='会进行隐式类型转换(Null == Undefined)(Null == Null)(Undefined == Undefined)
        2. '==='严格相等(0 === '0'为false)(NaN === NaN 为false)
        3. Object.is()大多数情况下与'==='一致，但对一些特殊情况会特殊处理：
            Object.is(NaN,NaN) //true
            Object(0,-0) //false   (0 === -0 返回true)
    
    2.3 判断数据类型的方式？
        1.typeof
        2.instanceof
        3.Object.prototype.toString.call()

        ✨tip:
              (1)typeof不能正确判断Object，Array，Null(三者都会返回Object)
              (2)typeof NaN会返回Number
              (3)instanceOf 只能判断对象类型，因为它就是用来检测实例对象的原型链上有没有构造函数的prototye属性
*/

/* 
  3. new操作符的实现原理？
    (1)在内存中创建一个空对象
    (2)将构造函数上的prototype属性设置为空对象的__proto__属性(新对象可以访问构造函数原型上的属性和方法)
    (3)将构造函数的this指向空对象(call改变)
    (4)执行构造函数内部的代码(给对象添加属性)
    (5)如果构造函数的返回结果是一个引用类型的值，则该对象成为new的结果，否则就返回之前创建的新对象
*/

/* 
  4. script标签中，defer和async的区别？
   defer和async都是用来异步加载脚本的
   (1)defer在下载完后，不会立刻执行脚本文件，而是等待html解析完，再按照标签的下载顺序依次执行
   (2)async在下载完后，会立刻执行脚本，如果此时html没有解析完，它会阻碍html的解析
*/

/* 
  🌼5.箭头函数与普通函数的区别？
     (1)箭头函数没有this，不能使用call，apply，bind改变this的指向
     (2)箭头函数没有原型，不能使用generator，不能作为构造函数使用，不能使用new，不能使用arguments(可以用rest)
*/

/* 
  6. this的绑定方式？
    (1)默认绑定：非严格模式下this指向全局对象，严格模式下this绑定到undefined
    (2)隐式绑定：函数引用有上下文对象时，this指向上下文对象
    (3)显示绑定：通过call(),apply()方法直接指定this 的绑定对象
*/

/* 
  7.var，let，const的区别？
    (1)var声明的变量具有函数作用域，在函数外声明就成为全局变量,且var声明的变量具有变量提升：它会被先提升到函数或全局作用域中的顶部，
    只是变量被首先提升，值不会一起提升。
    (2)let和const拥有块级作用域，且虽然他们两个也会被提升，但是与var不同的是，它们会被提升到块的顶部，
    即使被提升，但会同时存在暂时性死区问题，即变量在声明之前都不可访问，否则报错。
    (3)let 与 const的区别在于const定义的为常量，不可改变，对于基本数据类型，直接修改值会报错，但是对于引用数据类型，修改对象内部的
    属性并不会报错，因为存储在栈中的指针并没有改变。
*/

/* 
  🤩8.ES6新特性？
  1.let和const关键字
  2.箭头函数
  3.模板字符串
  4.解构赋值
  5.扩展运算符(...)
  6.类class
  7.Promise (异步编程解决方案，解决回调地狱) async await
  8.ES Module
  9.默认参数
  10.Iterator(迭代器)和Generator(生成器)
  11.新的数据结构，Map，Set，WeakMap，WeakSet，Symbol(唯一值)
     -->Map类似于对象，只不过它的键可以是任意数据类型
     -->Set类似于数组，但成员的值都是唯一的(可以用于数组去重)
     -->Symbol表示唯一值，主要用途是为对象添加属性名来避免属性名冲突(也可以用来创建私有属性)，Symbol不可变
    -->WeakMap只能接受对象作为键，键示弱引用的，值可以是任意类型
    WeakMap的键是弱引用的，如果没有其他引用指向键，就会被垃圾回收机制回收，WeakMap不可枚举，没有方法可以获取所有的键或值，也没有size属性
*/

/* 
  🌸9.H5的新特性？
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
*/

/* 
  10.commonJS和ESmodule的区别 
   (commonJS普遍用于服务器端，ES模块一般用在浏览器中，最新版本的NodeJs也可以用ES模块)
   
   1.commonJS使用同步的方式导入模块，在服务器端从磁盘加载非常迅速，但在浏览器端加载新的模块会发起网络请求，等待网络传输，阻塞页面渲染
     ES模块是异步加载(利用script标签加载)

   2.commonJS 输出的是对模块的浅拷贝，会运行缓存的结果，一旦输出，模块内的值就算变化也不会被影响到，除非输出的是一个函数
     ES module 是对模块的只读引用，对模块中的值赋值会报错，它不会缓存运行结果，类似于const，
     内部的指针指向不能改变(ES module充分考虑了静态分析的需求，可以在不执行代码的情况下分析导入导出的结果)
     (ES moudle在编译时静态解析，有利于静态分析工具进行代码优化(tree-shaking))
   
   3.commonJS是运行时加载，而ES module的导入导出语句在js引擎解析脚本时就被确定下来了(即js引擎在执行代码前就知道了模块之间的依赖关系)
   
   es module也支持动态导入 -->import()函数 -->按需加载
   
   因为commonJs时运行时加载，所以在处理循环依赖时可能会有问题，因为模块很有可能在加载时不完整
   而es module可以做到按照顺序依次执行循环依赖
   
   【静态分析的优点】
   Tree Shaking : 因为模块间的依赖关系在编译时就确定了，打包工具(Webpack,Rollup)可以通过静态分析识别和移除未被使用的代码，
   减小最终打包文件的大小
   按需加载: 静态分析使实现代码分割和按需加载变得简单
*/

/* 
 11.CSS的盒子模型？
   CSS有两种盒子模型：
      box-sizing：content-box；(标准盒模型)
                  border-box；
                    -->content-box属性值表示当前元素的宽高计算不包括内外边距和边框，
                    -->border-box会包含内外边距和边框的宽度，用来计算整个盒子的大小；
*/

/* 
  12.display有哪些属性？
     1.none
     2.inline-block
     3.inline
     4.block
     5.flex
     6.grid
     7.inherit
     8.table
*/

/* 
  13.对象属性的遍历方法？
  1. in 操作符
    可以遍历到对象中的所有属性，无论在原型对象上还是在实例上
  2. for 循环中的 in操作符
    也会返回实例和原型上的属性，而且被实例遮蔽的原型上的属性也会返回
  3.Object.hasOwnProperty()
    用于获取对象原型上的属性
  4.Object.keys()
   获取对象上的所有可枚举属性
  5.Object.getOwnProppertyNames()
   列出所有实例属性，无论是否可枚举(但不包括使用 symbol 值作为名称的属性)
  6.Object.assign()
   静态方法将一个或者多个源对象中所有可枚举的自有属性复制到目标对象，并返回修改后的目标对象
  7.Object.getOwnPropertySymbols()
   静态方法返回一个包含给定对象所有自有 Symbol 属性的数组
*/

/* 
  14.url有长度限制吗？
   有长度限制，但是一般限制的长度都远超过实际需求的长度，而且长度的限制页会根据不同的浏览器和服务器的不同而变化
*/

/* 
  🤩15.GET 和 POST 的区别？
   GET请求主要是向服务端请求数据(也可以发送数据,数据会被放到url中传输，不太安全，而且数据的长度也有限制)，
      -->一般是利用url的查询参数(query),使用axios发送请求，可以在get()方法的第二个参数中携带一个对象，包括要传递的query
         否则自己需要在请求的路径中拼接查询参数，需要带一个'?'和key=value这样的形式
   POST请求一般是向服务器提交数据(数据会被放到body中传输，相对更安全，数据长度没限制)；
   -->幂等性：GET请求具有幂等性 :即使执行多次GET请求，从服务器返回的结果都是相同的
             POST不具有幂等性(PUT具有幂等性)
   -->安全性：GET方法不会修改服务器上的资源，所以是安全的
             POST会修改服务器上的资源，因此不安全
   -->是否可缓存: GET方法响应可以被缓存(可以省去再次请求服务器)
                 POST方法默认不可缓存 
*/

/* 
 🤩16.for...in 与 for...of的区别？  (数组不推荐使用for...in循环)
   ①for...in循环用于遍历一个对象的所有可枚举属性(包括继承来的可枚举属性)
                         ^^^^^^
                          -->如果在遍历过程中不想获取到继承来的属性，可以使用hasOwnProperty()方法
   ②对数组使用for...in循环，迭代的是索引，对普通对象迭代的是key值
   ③for...of可用于任何可迭代的对象(包括字符串，set，map结构)   <---for of主要用来遍历数组元素，字符串，map，set
   ④for...of不适用于普通对象(因为普通对象不是可遍历的(不可迭代的))
*/

/* 
  17.数组扁平化？
   eg. [1, [2, [3, [4, 5]]], 6] --> [1,2,3,4,5,6]
   
   (1) Array.prototype.flat(depth) 返回一个新数组，参数是深度，默认是1，完全扁平化可使用Infinity作为参数
   (2) reduce() 和 concat()
*/
function flatArr(arr) {
  return arr.reduce((acc, curVal) => {
    Array.isArray(curVal) ? acc.concat(flatArr(curVal)) : acc.concat(curVal),
      [];
  });
}
/* 
 (3) 递归
*/
function flatArr2(arr) {
  let result = [];
  arr.forEach((i) => {
    if (Array.isArray(arr)) {
      result = result.concat(flatArr2(i));
    } else {
      result.push(i);
    }
    return result;
  });
}

/* 
  🤩18.HTTP状态码？
  1. 1XX:
         100 continue   表示现在的状态一切正常，客户端应该继续请求
         101 Switching Protocol   状态码表示服务器应客户端升级协议的请求正在切换协议。服务器会发送一个Upgrade响应头来表明其正在切换过去的协议。在使用 WebSockets 时会用到协议切换。
  2. 2xx:
         200 OK  请求成功(默认情况下状态码为 200 的响应可以被缓存),PUT 和 DELETE 的请求成功通常并不是200而是204,
                 表示无内容（或者 201 Created表示一个资源首次被创建成功）。
         201 Created 请求成功，且服务器创建了新的资源
         202 Accepted 服务器已经接受请求，但还没处理
         204 No Content 请求成功处理，但是没有内容返回(服务器不返回任何数据，但可能会返回新的或更新的元信息，比如PUT请求)，
                        通知客户端操作成功，而不需要改变当前页面或状态
  3. 3xx:
         301 Moved Permanently 永久重定向,当网页或资源的URL永久改变时使用，使用301重定向时，搜索引擎会更新其索引来反映新的url，
                               并将旧url的大部分链接权重传递给新的url(seo友好)，浏览器会缓存301重定向,在第一次重定向之后，
                               如果再次访问，会直接跳转到重定向的地址
         302 Found 暂时重定向,搜索引擎不会更新索引来反映新的url，且浏览器不会缓存302，所以用户每次访问旧url时，
                   浏览器都会向服务器发送请求。 
         304 Not Modified 告诉客户端不用发送请求，可以使用当前缓存。当客户端通过发送一个带有If-Modified-Since或If-None-Match头部的
                          HTTP请求来检查资源是否更新时，如果资源自从上次请求后就没有变化，服务器就会返回304状态码(304状态码仅适用于GET和HEAD请求)
  4. 4xx:
         400 Bad Request 服务器认为是客户端的错误，所以拒绝处理该请求(比如请求语法错误，请求格式错误等原因)
         401 Unauthorized 请求不成功，因为缺少目标资源所要求的有效身份验证凭证，如果请求已携带凭证，401表明这些凭证不被服务器认可
                          而当前的请求没有提供身份验证信息或提供的验证信息不被接受。
                          (在访问:
                             1.受保护的资源  
                             2.身份验证机制(如JWT认证失败时) 
                             3.会话过期(用户已经登录但会话过期的情况下)
                          )
                           -->在接收到401响应后，客户端应该提示用户重新输入认证信息，或确保请求中含有有效的身份验证凭证，
                           对于基于会话的应用，要确保用户回话没有过期，及时刷新令牌或重新登录
         403 Forbidden 客户端错误，服务端有能力处理，但是拒绝处理。
         404 Not Found 服务器无法找到所请求的资源，返回该响应的链接通常称为坏链或死链。
         405 Method Not Allowed 禁用请求中指定的方法
         407 Proxy Authentication Required 客户端错误，缺乏代理服务器的身份验证凭证。(401是直接与服务器认证)
         410 Gone 请求的目标资源在原服务器上不存在了，并且是永久性的丢失。
  5. 5xx：
        501 Not Implemented 表示请求的方法不被服务器支持，因此无法被处理
*/

/* 
  🤩19.协商缓存与强缓存？(http缓存)
    ->强缓存：
    可以通过设置Cache-Control和Expires头实现(在服务端设置)，告诉浏览器在一定时间内，可以直接使用本地缓存的资源，而不用向服务器发送请求
     --> Cache-Control: max-age=<seconds>  max-age用于设置缓存存储的最大周期(单位是s)
     --> Cache-control: public  表明响应可以被任何中间缓存服务器缓存，比如CDN
     --> Cache-Control: privite  表明响应只能被单个用户缓存，代理服务器不能缓存它
     --> Cache-control: no-cache  强制进行协商缓存
     --> Cache-control: no-store 禁止任何缓存策略(告诉浏览器不要缓存这个资源)
     【缓存控制权：由服务器发送的HTTP头部决定，最终由浏览器来执行指令，浏览器会根据这些头部来决定是否缓存资源，缓存多久等】
     【如果客户端强制刷新页面，浏览器会忽略缓存，从服务器请求新的资源】
    --强缓存过期后，会进入协商缓存过程(前提是服务器要进行缓存)--
     
    ->协商缓存:
      (1)如果服务器设置了Cache-Control或Expires头部，允许客户端缓存，那么浏览器在第一次请求资源时，
         会收到服务器发送的字段Last-Modified或ETag，前者表示文件的最后修改时间，后者表示资源的唯一标识(这是协商缓存的两种方式)
      (2)再次请求相同资源时，如果强缓存已经过期，浏览器就会在请求头中自动添加If-Modified-Since或If-none-match字段，它们的值就是
         上一次请求时服务器发送的对应头部的值;
      (3)服务器收到头部后，会进行验证，如果请求中的If-Modified-Since中的最后修改时间与当前资源的一致，则服务器会返回304
         如果请求携带的是If-none-match，也会比较与当前的ETag值是否匹配，是则返回304;
      (4)浏览器在接受到304状态码之后，就会直接使用当前的缓存。
    
     tip:在精确度上，ETag(Hash值，也称为文件指纹)要比last-modified高，但性能上因为Etag会多一个计算hash的算法过程，所以last-modified性能会更好一点。
*/

/* 
  20.http报文有哪些东西？
  首先分为请求报文和响应报文
    ->请求报文： 
            1. 请求行 (包括方法，GET，POST，PUT等，以及请求的URI和HTTP版本) 例：GET/index.html HTTP/1.1
            2. 请求头 (包含请求的元数据，如客户端能接受的内容类型Accept，用户代理User-Agent等)
            3. 空行 (一个空行标识请求头部分的结束和请求体的开始)
            4. 请求体 (可选。包含发送给服务器的数据，不是所有的请求方法都有请求体)
    ->响应报文：
            1.状态行 (包含HTTP版本，状态码和状态消息) 例： HTTP/1.1 200 OK
            2.响应头 (Header:包含响应的元数据，如内容类型Content-type)
            3.空行
            4.响应体 (包含服务器返回的资源内容)
*/

/* 
  21.rest参数和arguments对象有什么区别？(rest就是'...')
    【两者都用于处理函数接受的不确定数量的参数】
     1. arguments是一个类数组对象，它包含了函数调用时传入的所有参数，它只在函数体的内部可用
     2. rest参数将一个不定数量的参数表示为一个数组(它是一个真正的数组，而arguments不是)，只包含没有对应形参的实参，
        且只能作为函数的最后一个参数出现
    【更建议使用rest参数。因为它更灵活】
*/

/* 
  22.数组有哪些方法？
    Array.prototype.forEach()  返回undefined ，接受一个函数作为参数，会对数组内的每一项元素执行给定方法，不改变原数组
    Array.prototype.map()  返回一个新的数组，不改变原数组，新数组的元素是原数组中元素通过给定函数执行后的结果
    Array.prototype.filter()  返回一个新数组，不改变原数组，通过指定条件(为true)的元素会被添加到新数组中。
    Array.prototype.push()
    Array.prototype.pop()
    Array.prototype.unshift()  在数组开头添加，返回值是数组的新长度
    Array.prototype.shift()   在数组开头移除，返回值为删除元素的值
    Array.prototype.reduce()  接受一个函数和一个初始值作为参数(可选)，函数有两个参数，一个是上一次执行指定函数的结果和当前值，
                              如果是第一次执行而且传入了初始值，这个值就是指定的值，否则就是数组的第一个元素
    Array.prototype.concat() 不改变原数组，返回新数组。合并数组
    Array.prototye.find()  接受函数作为参数，返回通过测试的第一个元素，没有通过就返回undefined
    Array.prototye.findIndex()  返回满足测试函数的第一个索引，没有返回-1
*/

/* 
👑23.对称加密与非对称加密？
  --> 对称加密：加密和解密都使用相同的密钥，特点是加密和解密的速度快，适合于大数据量加密(文件加密，数据库加密等)，
               对称加密中用到的密钥叫做私钥；
               -->安全性相对来说较差，因为通信的双方用的是相同的密钥，所以如果有其中一方的密钥被泄露，该通信就会被破解
  --> 非对称加密：非对称加密也叫做公钥加密，非对称加密使用一对密钥(公钥和私钥)，加密过程是将明文用公钥或者私钥去加密，然后使用对应的私钥
                或公钥去解密;
                【一般场景都是使用公钥加密，私钥解密，因为这种方式可以确保只有私钥持有者才能解密】
                 --过程：接收方生成一对公钥和私钥，发送时将公钥公开，私钥不参与传输流程；然后发送方在传输文件时利用公钥加密文件，
                   接收方在收到加密文件时用自己的私钥进行解密；
                 -->非对称加密签名的过程是发送数据的一方将明文用私钥进行加密，然后通过公钥进行解密的接收方就可以根据是否可以解密来判断
                    发送方
                【反过来，使用私钥加密，公钥解密，就是数字签名】
                   --->数字签名主要是用于验证信息的来源和完整性
                   --过程: (1)发送者生成消息的摘要(运行一个哈希函数)
                           (2)使用私钥对摘要进行签名
                           (3)加密后的消息(签名)与未加密消息一起发送给接受者，然后接受者可以根据步骤来验证消息的来源和完整性
                 (签名的过程，目的不是直接对数据进行加密，而是使用)
*/

/* 
  24. 讲一下https(TLS四次握手)
  【Https是在Http和tcp之间加了一层SSL/TLS安全层】
    (一般的通信都是先进行非对称加密来进行秘钥交换，然后再进行对称加密进行通信)
    (非对称加密 + 对称加密的方式虽然看起来可靠，但最大的问题是中间人攻击(MITM)：黑客会拦截到客户端发送的公钥请求，然后将自己的公钥返回给客户端，等下次客户端发送消息时，黑客会用自己的私钥来解密，所以要引入CA机构，因为客户端并不知道自己获取的公钥是否安全)
    (CA过程：CA机构有自己的私钥和密钥，服务端会发送自己的公钥给CA来验证，然后CA机构用自己的私钥给服务端的公钥进行签名，以此来证明这个服务端是经过验证过的)
     ---> HTTPS的大致加密流程： 对称加密 + 非对称加密 + CA机构
          1. SSL/TLS 安全层 (TLS是SSL 的升级版，两者功能是一样，但实际上SSL已经被废弃了)
               为了让明文变成密文，HTTPS在HTTP与TCP之间加入了SSL/TLS层；
                  --> SSL/TLS 过程有两个阶段，分别是：TLS四次握手 + 加密通信(非对称加密)
                      --> TLS 第一次握手：由客户端发送给服务端，包括它支持的TLS版本(可能是1.2)，和支持的加密套件(比如RSA)，和一个客户端随机数;(还有支持的压缩方法)
                      --> TLS 第二次握手：服务端会返回一个与客户端确认的支持的TLS版本和加密套件，以及服务端同样也会生成一个随机数和它的CA证书;
                      --> TLS 第三次握手：客户端再生成一个随机数，然后从服务端发来的证书中取出公钥来给随机数加密，发送给服务端；
                                         然后客户端会用自己目前为止生成的两个随机数和从服务端返回的随机数来计算生成一个会话密钥，
                                         然后告诉服务端，后续的通信会使用这个会话密钥进行对称加密通信；
                                         最后客户端把上边过程中的通信数据生成一个摘要，用会话密钥加密，发送给服务端；
                                         (摘要: 一个Finished报文，内容就是对文本的hash操作，防止文件被篡改，hash后可以让文件变短，减小传输成本)
                                        ---- (客户端的握手流程结束) ----
                      --> TLS 第四次握手: 服务端在拿到客户端传来的随机数后，会和上两个随机数一起，也计算得到一个会话密钥，然后发送消息向客户端确认(和客户端确认一样)
                                         然后服务端也会将所有的通信内容通过这个会话密钥进行加密，最后返回给客户端;
                      【tip: 整个握手过程，都是对称加密】
                      流程：https://tls12.xargs.org/     
                      【tip:  1.关于随机数？
                                 --随机数中，第一个随机数来自客户端，第二个来自客户端，这两个都是明文，谁都可以拿到，
                                 --但第三个随机数，是客户端使用一串随机数和服务端的CA中公钥加密得来的，只有服务端的私钥才可以解密。
                              2.为什么要引入三个随机数？
                                 --为了加强随机性，防止只有第三次随机数会造成密钥相同的概率事件
                       】
    HTTP与HTTPS：
     (1)HTTP直接明文传输(url,表单内容，cookie等内容),容易被中间人攻击
     (2)HTTPS在HTTP基础上通过SSL(安全套接字层)或TLS(传输层安全性协议)提供了数据加密，数据完整性验证和身份验证
     (3)HTTPS更利于SEO
*/

/* 
  25.splice和slice有什么区别？
   splice是原地删除或添加数组中的元素，slice会返回一个由参数起始索引(start)和结束索引(end)决定的原数组的浅拷贝
*/

/* 
  26.v-if与v-show的区别？
     --> v-show控制的元素改变的是css的display属性，控制隐藏与显示(display: none)
               无论v-show的条件是true还是false，它所控制的标签元素都会被渲染到Dom结构中
         v-if是控制元素是否真正存在页面的dom结构中(不适用于频繁切换的场景)
*/

/* 
  27：显示和隐藏元素的方法，和它们之间的区别？
     -->引起重绘重排：
                 1.overflow: hidden;
                 2.display: none; (让元素和子元素在页面上不可见，不占位，但是仍然存在dom中)        
                 3.position: absolute绝对定位，将元素移出可视区域
     -->不会引起重绘重排：
                 1.opacity: 0; 将透明度设置为0(占位)
                 2.visibility：hidden(占位)
                 3.transform: scale(0) (占位)
                 4.transform: translate(-999px,0) (占位)
                 5.clip-path:circle(0) (占位，创建一个裁剪区域，确定元素的哪些部分可见)
*/

/* 
  28：事件冒泡是什么，在js和vue中分别怎么取消？
      如果一个元素外边套了一个元素然后在里边的元素中添加了一个点击事件，
      来触发对应的回调函数(实际上会套很多层，冒泡行为会直到文档的根元素为止)，
      此时事件会被触发两次，因为它会向它的上级传递；
       -->在原生js中，可以：
            document.getElementById('aruButton').addEventListener("click",(event)=>{
                 event.stopProgation();
            })
       -->在Vue中：
                 <button @click.stop = "handleClick">Click Me<button>
       -->在React中和原生JS差不多
*/

/* 
  29：TS中type与interface的区别？any和泛型的区别？
    -->type与interface：
       -->type和interface都可以描述一种类型，语法上的区别是type使用交集'&'实现继承，且定义的类型可以是任何类型，
          包括基本数据类型和复杂数据类型；
       -->interface使用extends实现继承，可以创建两个同名的interface作为扩展，但要注意同名的interface中，
          内部的类型不能相同，编译器会报错；而且在interface定义的类型只能是对象形式的，他更适合于描述面向对象这一风格，
          interface比type更具有扩展性和易于组合。                                           
    -->any与泛型：
       -->any:使用了any类型的变量，相当于关闭了TS的类型检查，因为它可以代表任意类型(十分自由)；
       -->泛型:使用了泛型的类型，可以让开发者在编写代码时不直接定义所用到的变量或对象的类型，而是通过参数传递来的数据类型来判断，
              最终确定数据类型
 
    type Point = {
        x: number;
        y: number;
    };

    type ID = string | number;
    
    type USerResponse = {
       id: ID;
       name: string;
       age?: number; //可选属性
    }

    type Expfunction = (name:string) => string;

    --------------
    interface Point {
        x: number;
        y: number;
    }

    interface User {
       id:  number;
       name: string;
       age?: number;
    }
    // 接口扩展
    interface Employee extends User{
        department: string;
    }
    //类实现接口
    class Developer implements Employee{
       id: number;
       name: string;
       age?: number;
       department: string;

       constructor(id: number,name: string, age?: number，department: string){
          this.id = id;
          this.name = name;
          this.department = department;
          this.age = age;
       }
    }
*/

/* 
  30.TS比起JS的区别和优点？
    TS可以在编译阶段约束变量或对象的类型，使代码更具有可维护性.
*/

/* 
  31. HTTP2相对于HTTP1的变化？
    1. HTTP1是基于文本的协议，每个请求/响应都是一个独立的报文,头部和主体以纯文本形式发送;
       HTTP2引入二进制分帧层 将所有的请求和响应转换为二进制格式，数据被分为更小的帧，头部和数据帧可以独立发送;
       
    2. HTTP1同一个TCP连接上只能处理一个请求，必须等待当前请求完成才能发送下一个请求(队头阻塞问题)
       HTTP2允许在单个TCP连接上并行处理多个请求和响应

    3. HTTP1每个请求都要发送完整的头部，头部通常是冗长的；
       HTTP2使用HPACK算法对头部进行压缩，减少带宽

    4. HTTP1服务器只能响应客户端的请求，不能注定推送资源
       HTTP2服务器可以在哭护短请求之前主动推送资源，以减少延迟(服务器推送可以优化首屏渲染时间)

    HTTP1实现持久通信：
      1. keep-Alive：
          HTTP/1.0 默认每个请求/响应都会关闭连接；为了减少建立TCP连接的开销(三次握手),HTTP/1.1引入了Keep-Alive头，
          通过在一个TCP连接上复用多个请求/响应：Connection: keep-alive (存在对头阻塞问题)
      2.长轮询(Long Polling)
          长轮询是一种实现持久连接的技术，客户端发送一个请求到服务器，如果服务器没有新数据，则会保持这个请求一直打开，
          直到有新数据或者超时；(缺点：需要频繁的HTTP请求，还有延迟)                           
    HTTP2：多路复用
    HTTP3：基于QUIC的多路复用(基于UDP，可以避免TCP的一些问题)
           QUIC减少了握手过程，只需要一个RTT来建立加密连接
    Websocket
*/

/* 
  32.promise.all和promise.race的区别？
      (1)promise.all()接受一个promise数组，在所有数组中的promise实例返回resolve后，promise.all()会返回resolve()，
         只要有一个元素返回reject()，promise.all()就返回reject()
      (2)promise.race()也是接受一个数组，它的返回值会根据数组中第一个有状态返回的元素的状态决定；
*/

/* 
 33.怎么将url中的query转换为对象？
     使用原生JavaScript：
*/
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
const url = "xxx";
const params = getQueryParams(url);

// 直接从当前页面的URL获取查询参数
const getQueryParams2 = () => {
  let queryParams = {};
  let params = new URLSearchParams(window.location.search); //获取当前URL的查询字符串部分
  params.forEach((value, key) => {
    queryParams[key] = value;
  });
  return queryParams;
};

/* 
  34.URL的各部分有什么含义？
     1.协议：Scheme 指明访问资源使用的协议类型(http,https,ftp,mailto)
     2.子域名(subdomain)：
     3.域名(domain)：站点名称(可读地址)
     3.端口(port)：用于区分服务器上的不同服务
     4.路径(path)：
     5.查询字符串(query):用于传递额外参数(跟在'？'后边)
     6.锚点Fragment:用于定位网页中的特定部分，在URL中以#开始；
    
     34.1 如何获取URL中的各个部分？
        可以使用URL类来解析并访问URL的各个部分：
           const url = new URL(window.location.href) //获取当前页面的完整URl
              --> 获取协议：url.protocal
                  获取主机名(包括域名和端口号):url.host
                  获取端口：url.port
                  获取路径：url.pathname
                  获取查询字符串：url.search
                  获取查询参数对象：url.searchParams.get('xxx');
                  获取锚点：url.hash
*/

/* 
  35.Set和Map的区别？哪个查找效率更高一点？数组中查找一个元素，有几种方法？
     Set是一个存储唯一值的集合，不支持索引，插入和查找操作的时间复杂的为O(1)，内部使用哈希表
     Map是键值对的集合，类似于对象，与对象的区别是键值key可以是任意类型，查找操作的时间复杂度也是O(1)
       --> 1. indexOf() 用来查找数组中某个元素的第一个索引，如果找到元素，返回它的索引，没找到返回-1
           2. includes()用来检查数组中是否包含某个元素，返回true或false
           3. find()返回数组中满足提供的测试函数的第一个元素的值，如果没有符合条件的元素，会返回undefined
           4. findIndex() 返回索引
           5. filter() 返回一个新数组
           6. some() 测试数组中至少有一个元素是否通过测试函数，返回布尔值
           7. eveny() 测试数组内的所有元素是否都通过测试函数，返回布尔值
*/

/* 
  36.怎么获取浏览器的信息？
     navigator对象，它提供了关于浏览器的信息(浏览器版本，用户代理字符串User-Agent)
*/
const userAgent = navigator.userAgent; //(包含浏览器类型，版本等信息)
//  ---> 使用Modernizr：
//  是一个js库，可以检查用户浏览器是否支持某些CSS3特性。HTML5 API等
//  引入后：
if (Modernizr.flexbox) {
  //支持flexbox
} else {
  //支持flexbox
}
//  ---> 使用UAParser.js:
import UAParser from "ua-parser-js";
const parser = new UAParser();
const result = parser.getResult();
console.log(result.browser); //浏览器信息
console.log(result.device); //设备信息
console.log(result.os); //操作系统信息
//  tip：用户代理字符串是可以被修改的，所以某些情况下并不安全

/* 
  37. rem和em,vw和vh ?
      都是相对单位，适合于构建响应式网站
      (1)rem:
            相对于根元素(html)大小的单位，比如说如果跟元素大小为16px,那么1rem总是16px
      (2)em:
           相对于父元素或更近的元素的大小的单位，如果它父元素为16px，且它本身没设置大小，那么该元素的1em就是16px，
           否则它设置多少，1em就是多少
      (3)vh:
           相对于视口高度的单位，1vh等于视口高度的1%
      (4)vw：
           相对于视口宽度的单位，1vw等于视口宽度的1%
*/

/* 
  38.如果想要在打包的时候将项目中的px单位都改为rem如何做？
    可以使用PostCSS插件：postcss-pxtorem
*/
// Vite：
//postcss.config.js文件
module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 16, //自行设定(是根元素的大小)
      propList: ["*"], //propList是一个数组，用来指定哪些CSS属性应该从px转换为rem
      // 可以指定具体的CSS属性(如['font-size','margin-top']),或使用通配符表示所有属性都转换。
      // 也可以['*','!padding*']表示转换所有属性，除了以padding开头的属性
    },
  },
};
// tip：如果要在Vite中使用postCSS的插件，只需要在根目录中添加postcss.config.js文件，然后配置即可，
// Vite会自动识别这个配置文件，然后处理CSS
// 安装插件： npm i postcss postcss-pxtorem --save-dev
// Vite使用PostCSS作为它处理CSS的一部分，当存在postcss.config.js时，Vite会自动加载并应用这个配置

/* 
 另外，除了将px转换为rem，也有其他的转换插件：
    (1). postcss-px-to-viewport
*/

module.exports = {
  plugins: {
    "postcss-px-to-viewport": {
      viewportWidth: 1920, //视口宽度
      viewportHeight: 1080, //视口宽度
      unitPrecision: 5, //单位转换后保留的精度
      viewportUnit: "vw", //转换为视口单位的类型，可以是'vw'或'vh'
      fontViewportUnit: "vw", //字体使用的视口单位
      selectorBlackList: [], //要忽略的选择器
    },
  },
};

/* 
  38：什么是source map，为什么vue可以在浏览器直接显示报错行数？
     -->是一种映射技术，用于将压缩或转译后的代码映射回源代码，在使用webpack等压缩工具时，会在转译过程中自动生成Source map
*/

//  --> Webpack.config.js中配置文件中通过devtools属性来配置source map：
module.exports = {
  devtools: "source-map", //这里适用于生产环境，如果是开发环境下，写'eval-source-map'
};
//  --> Vite:
export default defineConfig({
  build: {
    sourcemap: true, //生产环境
  },
  /*  --> 属性值：1. true 生成完整的source map
                 2. false 不生成source map(默认值)
                 3. 'inline' 将source map嵌入到生成的文件中，而不是生成单独的.map文件 
  */
});
/*
   tip: 在Vite的开发服务器中，默认情况就会使用source map，
    --> 1. source map 是否会影响页面的性能？
             source map主要用于开发和调试过程，它只有在打开dev tools时才会开始加载，一般来说不会，但是开启它会占用浏览器的内存，
             因为浏览器需要再额外去处理这些映射信息和源文件(应该确保只在开发环境下使用source map);
             如果要在生产环境中使用(通常是用来监控和调试生产环境中的错误)，也要确保这些源文件不会对用户公开
             (通常是在Nginx或Apache服务器上配置规则来限制)
    --> 2.浏览器是怎么知道source map和源文件的关系的？
            在打包工具输出的文件中，如果开启了source map，就会在代码的下方看到特殊的注释，就是对应的源文件地址
    --> 3.source map是怎样对应到源代码的？
            首先，一个source map文件通常是一个JSON格式的文件，下面是主要组成部分：
                 1. Version : source map 规范版本，一般是3
                 2. File ： 转译后的文件名称
                 3. Sources： 一个包含所有原始文件名的数组
                 4. SourceRoot：(可选)所有源文件路径的根目录
                 5. Names：包含原始代码中变量和属性名的数组
                 6. Mappings：source map的核心，是一个经过(VLQ)编码的字符串
                 描述了转译后的代码中每个位置与源代码中相应位置的映射
*/

/* 
  39.数组去重的方法？
       1.Set数据结构 + Array.from()
       2.双重for循环 + splice(去除)
       3.forEach() + inCludes()
       4.forEach() + indexOf()
       5.filter() + indexOf()
       ...
*/

/* 
  40.js中"="(赋值)与浅拷贝有区别吗？
    对于基本数据类型来说没什么区别，对于引用数据类型，赋值不会创建新对象，而浅拷贝会
*/

/* 
   41. 在package.json文件中，dependencies和devDependencies有什么区别？
        -->dependencies 列出了项目在生产环境中运行所需要的依赖，比如说如果项目使用Vue框架开发，那么vue就应该在这里
        -->devDependencies 列出了只在开发环境中需要的依赖包，这些依赖主要用于开发过程(在生产环境中不是必须的，比如说单元测试，
        代码格式化工具eslint等，都应该在这里)
        区分这两者可以：
                  1.优化生产环境，只将必要的包部署到生产环境，可以减小生产环境的大小，优化应用的加载时间和性能；
                  2.安全性：减少生产环境的大小，优化应用的加载时间和性能；
        使用npm或yarn时：
             1. 安装生产依赖：npm i package-name --save  
                【从npm 5 开始默认就是将依赖添加到dependencies，所以--save也可以省略】  yarn add package-name
             2. 安装开发依赖: npm i package-name --save-dev 
                【会添加到devDependencies】 yarn add package-name --dev
*/

/* 
  42.Jquery和Vue的区别？
    (1)Jquery本质是只是让在js中操作dom，事件处理，选择元素的方式比原生更简单一些，方便写代码；
    (2)而vue是一个js框架，它的核心是MVVM模型，vue提供了一套完整的用于开发页面的(特别是单页面应用的工具)，比如路由管理，组件系统。
       模板语法，内置指令和内置组件等；它对于页面的DOM元素的处理，采用虚拟DOM的比对方式，通过快速Diff算法，
       对要发生变化的dom元素进行相应的排序和变更，在更新视图的变化，一定程度上减少了DOM操作对页面性能的开销；
*/

/* 
  43. Vite的依赖预构建？【在开发环境中，且在第一次启动开发服务器时执行】
       (主要是为了项目中的第三方库，因为这些第三方包并不一定是ES模块格式，而且有些包的数量很多，
        直接加载会影响性能(因为会发起很多网络请求))
       (Vite可以将这些小文件打包成更少的文件)
   3.预构建的结果会被缓存下来
      -->优点：1.开发环境下，可以快速启动服务器
              2.减少请求，将多个依赖合并到少数几个ESM包中，减少了浏览器在模块开发过程中需要处理的请求数量
              3.确保不是以ES模块格式提供的依赖，也可以在现代浏览器中运行
  【Vite开发模式中使用esbuild，生产模式下使用Rollup】
    预构建过程：
          (1)当启动Vite开发服务器时，Vite检查node_modules中的依赖
          (2)Vite决定哪些依赖需要预构建，通常会包括所有的第三方库
          (3)执行：Vite使用esbuild将所有选定的依赖于大宝成少数几个或单个优化过的文件(将多个小模块合并为较大模块)
          (4)缓存：预构建的结果会被缓存下来，下次启动开发服务器时，只有在依赖项发生变化时才会重新预构建
*/

/* 
 44.移动端横竖屏切换方案？
    (1)CSS媒体查询：
      @media(orientation: landscape){  //横屏时方案
         ...
      }
      @media(orientation: portrait){  //竖屏时方案
         ...
      }

    (2)JavaScript提供屏幕方向API，允许JS直接访问和监听设备的屏幕方向变化
       window.addEventListener('orientationchange',()=>{
            switch(window.orientation){
               case 0:
               case 180:
                   //竖屏
                   break;
               case -90：
               case 90：
                    //横屏
                    break;
            }
       })

    (3)使用第三方库
*/

/* 
  45.z-index有什么限制？
     (1)仅对定位的元素生效
     (2)使用z-index的元素会创建一个新的堆叠上下文
     (3)只在它自己存在的堆叠上下文中生效
     (4)过多使用z-index会影响性能(浏览器要管理更复杂的堆叠上下文)
     【tip：当多个元素在页面上的同一位置时，堆叠上下文用来确定这些元素的显示顺序】
*/

/* 
 46.什么是BFC(块级格式上下文)？
    -->BFC(块级格式上下文),是页面中的一个独立的渲染区域，处于BFC内部的元素会与外部的元素隔离(布局之间不影响)
       触发BFC：
             (1)根元素或其他包含它的元素
             (2)浮动的元素(float)
             (3)position: absolute/fixed
             (4)display:inline-block
             (5)overflow: 不是visible的块元素
             (6)display：flex
             (7)display: grid
             ...等等
             【BFC可以解决一些布局问题，比如外边距重叠，或清除浮动】
*/

/* 
 47.TCP与UDP的区别？
   (都是传输层协议)
   (1). TCP是面向连接的协议，数据在传输前一定要三次握手，来保证消息在传输过程的完整性与可靠性，如果数据包丢失或出错，
        tcp会重新发送;tcp发送的是字节流，接收方会按照发送顺序来接收
   (2). UDP是无连接的协议，数据可以直接发送给接收方，但不能保证数据完整也不能保证数据一定送达，也不会验证接收方是否接受到了数据，
        也不会提供重发机制和错误检查，但是相对于tcp，因为缺少了繁琐的握手过程，所以延迟一般较低，比价适合流式传输;
        udp以数据报的形式发送信息，每个数据报都独立包装，传输。

        【头部开销：tcp的头部最小20字节，包含很多用于确保数据可靠传输的信息：序列号，确认号，数据偏移等
                   udp头部开销小，只有8字节，包括源端口号，目标端口号，长度和校验和
         】
*/

/* 
  48.tcp是怎么保证数据完整可靠的？
    (1).三次握手过程
    (2).序列号与确认应答：每个TCP段都会被分配一个序列号，接收方通过发送ACK来响应已成功接收的数据包，如果发送的数据包没有被确认，
        就会重新发送
    (3).数据重传(tcp有个定时器，设定时间内没有收到确认响应，就重发)
    (4).有序的数据传输和数据整合(确保数据是按序列号处理的，没有按照顺序到达的数据会被缓存起来，直到所有消息段都到达后，会被一起提交给
       应用层)
    (5).四次挥手过程
*/

/* 
49.tcp三次握手？
49.1 tcp四次挥手？


*/