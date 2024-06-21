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

   15.1 GET 请求与 HEAD的区别？
         HEAD请求比GET请求更高效，只返回头部信息，更节省资源，经常用于缓存验证，
        确定缓存内容是否还是最新的(通过比较HEAD请求返回的头部如ETag或Last-Modified)，来决定是否要发送一个完整的GET请求
   
   15.2 POST 请求和 PUT 请求的区别？
       (1)POST请求是向服务器提交数据，一般是创建新的资源，非幂等，每次请求可能造成的结果都不一样
       (2)PUT请求时是向服务器请求修改(替换或更新)已有资源，幂等，多次相同的PUT请求与第一次执行的效果相同
       --> 另外，POST既不安全也不幂等；PUT不安全但幂等
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
  19.1 关于浏览器缓存？(客户端本地存储)
       (1)Cookie 【tip: Cookie可以在前后端同时被创建和修改，但一般是在服务端通过http响应发送到客户端的】
          存储大小：一般为4kb
          有效期：可通过Expires，Max-Age属性设置(如果不设置有效期，Cookie就是会话级别的，即浏览器关闭就失效)
          作用域：
                Domain属性：指定那哪些域可以接收Cookie
                Path：限制URL路径，只有路径匹配的请求才能访问Cookie
                Secure：如果设置，Cookie仅在使用HTTPS的情况下发送到服务器
                HttpOnly：Cookie将不会被js脚本访问(预防xss攻击)
       (2)localStorage
           存储大小：2.5~10MB(具体根据浏览器不同)
           有效期：没有时间限制，直到被手动清除
           作用域：同源页面下
       (3)sessionStorage
           存储大小：2.5~10MB(具体根据浏览器不同)
           有效期：只在浏览器会话期间有效，关闭浏览器标签或窗口后，数据被清除
           作用域：创建它的标签页中(同一tab)
       (4)indexDB
           存储大小：支持存储较大量的数据，根据浏览器不同，实际存储大小也不能，可以高达上百兆，依赖于浏览器的实现和用户磁盘空间
           有效期：没有过期时间，直到被手动清除
           作用域：同源页面下

      19.1.1 Session是什么？和Cookie有什么区别？
            Session是服务器用来在两个请求之间存储用户数据的方式(HTTP协议无状态),通常在服务端实现
            -->当用户访问一个应用时，服务器会自动生成一个会话标识(Session ID),然后将SessionID存储在用户浏览器的Cookie中，
            这个Cookie会随着用户的每个请求发送到服务器，服务器通过SessionID来检索用户的状态信息，这些信息存储在服务器

            区别：
               存储位置：
                  Session：数据存储在服务器上，用户只会收到SessionID和Cookie
                  Cookie：存储在浏览器上
               安全性：
                  Session：数据存储在服务器上，相对安全
                  Cookie：存储在客户端，可能被恶意篡改(可以设置HttpOnly和Secure)
               生命周期：
                  Session：可以设置
                  Cookie：可以设置
               容量限制：
                  Session：受服务器内存限制
                  Cookie：4kb

      19.1.2 token与Cookie与Session
       (1)Cookie是由服务器发送到用户浏览器并保存到本地的小数据文件，每次浏览器向同一服务器再次发起请求时会自动携带Cookie
          用途：跟踪，识别用户身份，管理会话状态
       (2)Session是在服务器端存储用户数据的方法
       (3)Token是一种服务端生成的凭证，通常包含用户信息和请求数据，经过加密处理后发送到客户端，存储在客户端，
          不依赖于特定的存储方式，可以保存在Cookie，localStorage等其他机制，可以跨域使用

        Cookie和Token可以存储在客户端，Session在服务端
        Token比Session还安全(因为加密)，session依赖于sessionID，如果sessionID被劫持，会话也会被劫持
        Token天然支持跨域，而Cookie需要特殊配置(CORS),Session受限于创建它的服务器
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
  49.Vue的组件间通信有几种方式？
     1. props / Events
     2. Provide / Inject
     3. vuex
     4. teleport 【<Teleport> 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。 】
     5. pinia
     6. eventbus
*/

/* 
  50.对Vue响应式的理解？
*/

/* 
  51.Vue2与Vue3的区别？
     1.Vue2使用的选项式API，Vue3是组合式API，组合式API更适合逻辑复用和处理复杂组件，在vue2中，组件的响应式数据要写在data中，方法写在method中，这种分散式的写法，
       可能在较复杂的项目中，造成代码的难以理解和阅读。
     2.生命周期钩子不一致，vue3中删除了vue2里面的beforeCreate和Created两个生命周期，变为setup()来替代，setup的执行时间是vue在执行整个渲染组件流程中第一个遇到的钩子。
       destroyed替换为unMounted。
     3.响应式原理不一样，vue2使用Object.defineProperty()，监听对象属性的变化，但因为需要对对象进行深度递归遍历，对于复杂且嵌套层级很深的对象来说性能会比较差。
       vue3使用proxy代理对象来重构响应式系统，使用了多种数据结构，比如map，weakMap，set等共同维护了在要代理的对象和对应对象要操作的属性以及对应的副作用函数之间的关系，
       把所有的读取和修改操作都变成函数来执行，当读取对象时，收集当前的副作用函数到副作用函数栈中，当修改对象的属性时，根据weakMap的一一对应关系，将对应的副作用函数弹出并执行；
       不仅是对于对象的直接读取操作，在js中函数调用或枚举等操作都有对应的基本语义，只要在proxy中拦截到对应的寓意操作，就可以实现响应式。
     4.所使用的diff算法不一样
     5.vue3对ts提供了很好的支持
*/

/* 
  52.快速diff算法？
*/

/* 
  53.编译型语言与解释型语言的区别？
    (1)编译型语言: 在程序运行之前，先不要经过编译器编译来生成一个独立的文件，直接由操作系统运行，
                  运行更快，执行时没有额外的转换和解析步骤，且编译时就有严格的类型检查;【C,C++等】
    (2)解释型语言: 由解释器直接逐行读取源代码，边解释边执行，执行速度不如编译型语言，需要更多的内存和处理能力
                  【Python，JS，PHP等】
    tip: JAVA是混合型语言
*/

/* 
   54.浏览器的事件循环机制？
    -->浏览器渲染进程中的主线程会在处理和渲染JavaScript执行的同时，定期检查事件队列；
       当IO线程通过消息队列或事件的方式向主线程发送任务的结果时，主线程就要执行它发来的任务，确保即使在网络请求或文件访问完成时，
       也不会阻塞主线程的渲染和执行任务。

       事件循环机制主要是监听js调用栈和消息队列，调用栈中的是js同步任务，一旦调用栈为空，事件循环就会去检查任务队列，然后将
       这些任务的回调函数放到执行栈中执行
    -->主线程中维护着一个消息队列，用来调度和执行JavaScript任务，包括宏任务和微任务，这个消息队列是事件循环机制的核心部分，
       用于确保JavaScript的执行顺序，处理异步事件等；
    -->消息队列内部任务的一般就是我们所称的"宏任务"，每个宏任务可以看作为一个独立的工作单元，它们的执行顺序是按照先进先出的形式，
       微任务不直接存在于消息队列中，但它与每个宏任务之间相关联，每当一个宏任务执行完毕后，事件循环机制会检查与之相关联的微任务是否
       为空，不为空则连续执行所有微任务，即微任务总是在当前宏任务结束后，下一次宏任务前被执行，并且会在浏览器进行任何渲染操作之前
       完成。(完成所有微任务后，如果有必要，浏览器可能会进行渲染操作，如重绘重排)

       54.1 宏任务与微任务都有哪些？
           (1)宏任务：1. setTimeout和setInterval的回调
                     2. script文件解析
                     3. I/O操作(如发送网络请求)
                     4. UI交互事件(点击按钮，滚动页面等)
           (2)微任务：1. Promise.then() , .catch(), .finally()
                     2. MutationObserver 的回调
                     3. async/await
                     4. process.nextTick()【Node.js环境中的API】
                        【用于调度一个微任务，虽然类似于微任务但实际上它的优先级要比其他微任务要高】
                        【process.nextTick()用于确保代码在下一次事件循环之前执行】
*/

/* 
  55.浏览器的进程与线程有哪些？
    (1)进程：
           1. 渲染进程 (单个标签页内的任务，包括HTML的解析，js执行，css渲染等)【运行在沙箱模式下】
           2. 浏览器进程(协调浏览器的各个部分，是浏览器的核心功能)
           3. 插件进程(管理浏览器插件，单独一个进程是为了防止插件崩溃影响其他部分)
           4. GPU进程(处理页面硬件加速和浏览器界面合成)
           5. 网络进程(处理浏览器的页面请求，文件下载等)
    (2)线程：
           1. 主线程(UI线程)【用于处理用户界面的渲染，包括解析html，css，构建dom树和渲染树，执行js代码，处理事件等】
              【如果主线程被阻塞，整个页面会无响应】
           2. JS引擎线程(专门用于解析和执行js代码)【js引擎线程与主线程互斥，当执行js代码时，ui更新会暂停】
           3. 事件触发线程(控制事件循环和事件监听和触发回调函数等，使js具有异步执行能力，可以在不阻塞主线程下执行)
           4. 定时器触发线程
           5. http请求线程(处理所有的HTTP请求，不会阻塞主线程)
           6. 文件读写线程(I/O)
           7. 渲染线程(负责页面绘制，图像渲染，它与GPU进程密切协作)
           8. GPU加速线程
           9. webworker线程(手动创建)
*/

/* 
 56.浏览器的渲染过程？
    (1) 渲染引擎首先将HTML解析成DOM树
    (2) 解析CSS生成CSSOM树，它与构建DOM树的过程并行进行，CSSOM树最终会反映所有的CSS的规则和dom节点的样式
    (3) 将CSSOM树和DOM树结合为渲染树(Render Tree),它只包含需要渲染的节点和节点的样式信息，不包含不可见节点
        --同时浏览器也会创建一个图层树，图层树中的每个图层对应渲染树的一部分，通常是需要特殊处理的元素，
          如transform，opacity等，或是需要隔离的元素
    (4) 对每个可见元素进行布局，计算它们的大小和位置
    (5) 图层准备好后，合成线程将各个图层分块，在光栅化线程池中将图块转换为位图，然后发送绘制图块命令给浏览器进程
    (6) 浏览器根据信息生成页面
*/

/* 
  57.什么是重绘和重排？
    (1)重绘：改变元素的样式，没有改变元素的几何位置，引起的渲染流水线中从dom树与样式的重新绘制开始的一系列步骤
    (2)重排：改变了元素的布局信息，触发浏览器重新布局，更新整个渲染流水线
*/

/* 
  58.元素水平垂直居中的方式？
   (1)利用flex布局：
       .container {
          display: flex;
          justify-content: center;
          align-items: center;
   }

   (2)利用Grid布局：
        .container {
          display: grid;
          justify-content: center;
          align-items: center;
   }
   或：
       .container {
          display: grid;
          place-items: center;
   }

   (3)绝对定位 + 负边距(tip:使用transform不需要知道元素宽高，但直接使用margin-left，margin-top的负值则需要)
      .container{
          position: relative;
      }
      .inner{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          width: 200px;
          height: 100px;
      }
   
    (4)margin:auto
       .container{
          position: relative;
      }
      .inner{
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          width: 200px;
          height: 100px;
      }
*/

/* 
  59.TCP的三次握手过程？
     假设这里有一个客户端和服务端，一开始它们都处于closed状态，从服务端开始监听某个端口时，状态变为listen
     🤝(1) 如果此时客户端想要与服务端进行连接，它会首先发送一个SYN字段，表示想要建立一段连接，然后将自己的状态变更为SYN-SENT
     🤝(2) 服务端收到SYN字段，为了应答客户端，它会返回一个SYN+ACK，代表"我收到了"，然后将自己的状态变更为SYN-RCVD
     🤝(3) 客户端收到ACK后，知道服务端确认过了，也发送回一个ACK的ACK，状态变为Established
        (4) 服务端收到ACK的ACK后，也将自己的状态变为Established，握手完毕。
    
      59.1 握手过程为什么不是两次？
          -->如果只有两次，服务端在发送完应答ACK后，不能再与客户端确认这个消息，如果由于延迟的原因，客户端发送了两次请求，第二次请求
             在很长一段时间后到达服务端，而此时服务端把它当做是一次正常的请求而建立起连接，但实际上这段连接是不必要的。
      59.2 握手为什么不是四次？
          -->双方已经都完成了一次一发一收的过程，已经可以确认建立成功了。
*/

/* 
  60.TCP的四次挥手？
     在双方断开之前，都处于Established状态
     👋(1)断开连接的消息由客户端发起，它给服务端发送一个FIN字段，代表"我想结束这段连接"，然后状态变更为fin_wait_1
     👋(2)服务端收到FIN字段后，发回一个ACK，代表"我知道你想结束了",然后状态变更为cloes_wait,客户端收到确认ACK后，
          状态变更为fin_wait_2
          【如果在此结束挥手，客户端的状态会永远停留在这，因为TCP协议没有应对这个状态的处理，但Linux有】
     👋(3)服务端接着发送一个FIN+ACK，代表"我也想结束连接了",状态变更为LAST_ACK
     👋(4)客户端收到服务端的"它也想结束"后，继续发送回一个ACK，代表"我收到了",然后进入等待状态(TIME_WAIT)
         【等待是为了确保服务器收到最后的ACK包，如果服务端没收到，它会他发送一次FIN+ACK字段，如果此时客户端直接退出，
         它就再也收不到了】
         【等待时间一般是2MSL，实际应用中通常是30s,1min,2min,如果服务端在超过这个时间后也没有收到ack的应答，
         客户端会直接发送RST，告诉服务端"我走了，不会再给你发送ACK了"】
*/

/* 
  61.Symbol 和 Promise 解决了哪些问题？
    (1)Symbol: 1.Symbol 可以创建全局唯一标识符，可以解决对象属性命名上的冲突，保证唯一性;
               2.使用Symbol作为key的属性不会被for..in 和Object.keys()遍历到，可以隐藏属性;
               3.Symbol引入了一些默认属性，它们可以修改对象的默认行为，比如Symbol.iterator。
    (2)Promise: 1.解决回调地狱
*/

/* 
  62. Iterator是什么(迭代器)？
     Iterator是一个迭代器接口，任何实现了@@iterator方法的对象都可以被遍历，即对象必须要有一个名为Symbol.iterator属性
     -->Iterator对象具有next()方法，每次调用next()，都会返回一个对象，对象具有两个属性，一个是value(当前元素值)，
        另一个是done,一个布尔值，未到末尾都返回false
*/
// 可以创建自定义的可迭代对象，可以定义Symbol.iterator方法
let range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    // 返回一个迭代器对象
    return {
      current: this.from,
      last: this.to,
      // next()方法返回下一个结果对象
      next() {
        if (this.current <= this.last) {
          return {
            done: false,
            value: this.current++,
          };
        } else {
          return {
            done: true,
          };
        }
      },
    };
  },
};
for (let value of range) {
  console.log(value);
}

/* 
  63.token过期了如何处理？
    -->token用于验证用户权限的，在第一次完成登录或注册时，服务端给返回一个token，然后后边的每次请求，客户端都要携带这个token，
    以便让服务器验证用户有权限访问。token可以设置过期时间(在后端)；
    如果当前客户端发送的token被服务端检查到已经过期了(一般token，像JWT会包含过期时间)，后端会返回401状态码，表示没有权限，
    或者403 禁止访问；
    -->前端可以在每次发送请求前自己检查一下token是否过期(如果token携带)
     ————>
        Refresh Token:
                     1.服务器发送两种令牌给客户端： Access Token 和Refresh Token
                     Access Token： 短期令牌。主要用于访问需要凭证的接口
                     Refresh Token：如果Access Token过期，它可以获取一个新的，有效期通常会更长【只会访问特定的接口，
                     来换取新的Access Token】
                      -->tip:如果Refresh Token也过期，就需要用户重新进行身份验证
      --也可以拦截响应(401或403或407)然后自动刷新Token，然后再发送一次请求
*/

/* 
 64.在vue的computed和watch函数中，可不可以用promise？
   (1) computed() 被设计为【同步函数】，只有在computed属性依赖的数据发生变化时，它才会变化，Vue会缓存computed属性的结果，
       这种机制不适合于异步操作，所以不应该在computed属性中使用promise等异步操作。
   (2) watch() 函数用于响应数据的变化并执行副作用函数，如数据获取操作，在watch中可以使用异步操作
*/

/* 
  65.绝对定位和相对定位的区别？
   (1)相对定位：相对于它原本在文档流中的位置来计算偏移位置(不脱离文档流)
   (2)绝对定位：相对于最近的被设置定位的祖先元素计算位置(如果没有，会相对于视口或根元素定位) 【会脱离文档流】
*/

/* 
  66.如何判断一个属性是自己有，还是在原型链上？如何判断一个原型对象是否在另一个对象的原型链上
     (1) hasOwnProperty()
        它接收一个字符串(属性名)作为参数，返回布尔值
     (2) Object.prototype.isPrototypeOf() 
        可以检查一个对象是否存在于另一个对象的原型链上
*/

/* 
  紧跟着await后面的语句相当于放到了new Promise中，下一行及之后的语句相当于放在Promise.then中
*/

/* 
  67.React的生命周期？
  useEffect()函数可以看作是componentDidMount，componentDidUpdate，componentWillUnmount的集合，
  useEffect接受两个参数，一个是执行函数，一个是依赖项数组；
  --> 1. 不写依赖项数组： useEffect(()=>{}) -->副作用函数会在组件每次渲染后运行，每次更新时都会触发
      2. 空依赖数组：useEffect(()=>{},[]) -->副作用函数只会在组件挂载时执行一次 ，之后的组件更新不会触发(componentDidMount)
      3. 包含依赖项的数组:当数组中包含一个或多个依赖时，只有当依赖项改变时，副作用函数才会执行(componentDidUpdate)
      4. 清理函数：useEffect的副作用函数可以返回一个清理函数(return)，这个清理函数会在组件卸载前执行，
         或者在依赖项改变且副作用重新执行前执行【可用于执行如取消网络。定时器或取消订阅等清理任务】
         --> useEffect(()=>{
               const timer = setTimeout(()=>{
                console.log('i am the king of the world')
               };
              return()=>{
                clearTimeout(timer);//在组件卸载前或依赖项变化前
              }
            )
         }，[count])
*/

/* 
🤩68.Vue3的生命周期？
       beforeCreate 和created在setup()函数中没有对应的钩子。
       因为setup函数本身就是在组件创建过程中最早被调用的(渲染器在遇到组件时，最早执行的就是setup)

     1.onBeforeMount() 在组件挂载之前被调用，当这个钩子被调用时，组件已经完成了其响应式状态的设置，但还没有创建 DOM 节点。
       即将首次执行 DOM 渲染过程。
     2.onMounted() 在组件挂载完成后执行，组件在以下情况下被视为已挂载：
                  ① 其所有同步子组件都已经被挂载 (不包含异步组件或 <Suspense> 树内的组件)。
                  ② 其自身的 DOM 树已经创建完成并插入了父容器中。
                  注意仅当根容器在文档中时，才可以保证组件 DOM 树也在文档中。
     3.onBeforeUpdate() 
       在组件即将因为响应式状态变更而更新其 DOM 树之前调用。(发生在虚拟DOM打补丁之前)
     4.onUpdated() 
       在组件因为响应式状态变更而更新其 DOM 树之后调用。
     5.onBeforeUnmount() 
       在组件实例被卸载之前调用。当这个钩子被调用时，组件实例依然还保有全部的功能。这个钩子在服务器端渲染期间不会被调用。
     6.onUnmounted() 在组件实例被卸载之后调用。一个组件在以下情况下被视为已卸载：
                     ①其所有子组件都已经被卸载。
                     ②所有相关的响应式作用 (渲染作用以及 setup() 时创建的计算属性和侦听器) 都已经停止。
                     ③可以在这个钩子中手动清理一些副作用，例如计时器、DOM 事件监听器或者与服务器的连接。

     1.onErrorCaptured()   -->捕获后代组件错误的
     2.onActivated()       -->Keep-Alive内置组件中的组件被插入到dom中时调用
     3.onDeactivated()    -->Keep-Alive内置组件中的组件从dom树中被移除时
*/

/* 
  69.Vue的双向数据绑定原理？
     vue3的双向绑定主要依赖于v-model指令，以及vue的响应式系统实现的
                          ^^^^^^^^^^^      ^^^^^^^^^^^^^
     首先：
        Vue的响应式系统:vue2是使用Object.defineProperty()方法来实现的，它的缺陷是在监听过程中会深度遍历所有这个对象的属性值，
        然后为每个属性使用getter和setter来实现数据响应式。
        如果要监听的对象层级很深又很庞大，会对性能造成很大影响(初始化负载较大)，而且因为defineProperty方法本身的限制，
        它只能作用域对象属性，不支持Map，Set，WeakMap，WeakSet等数据结构的响应式变化。
        另外，通过数组索引来设置数组，和修改数组的长度，Vue都不能检测到.
        而且Vue2的响应式系统不能自动检测后期添加到对象上的属性或删除已有属性的操作，一旦数据对象在初始化时被设置为响应式，
        那么就只有一开始就存在的属性才是响应式的，只有它们被修改才会被检测到，如果想要让新添加的属性也变成响应式的，
        必须要使用vue特定的方法：
                Vue.set()或this.$set
                 ---->用于向响应式对象中添加一个属性，并确保这个新属性也是响应式的
                 语法：Vue.set(target,propertyName/index,value) 或 this.$set(target,propertyName/index,value)
                      ->target可以是数组或普通对象
                      propertyName/index是要添加的属性名或数组的索引，value是属性的值
                      Vue.delete 或this.$delete [删除]
      然后：
          Vue3使用proxy，它的优点是可以直接拦截整个对象(在不需要递归遍历的情况下实现响应式)
          它的思路是拦截一个对象的getter和setter操作，通过WeakMap与Map以及Set这些数据结构，共同维护了一个在代理对象与所要操作的属性，
          以及对这个属性要执行的副作用函数(Effect)之间的关系，核心是把对数据的读取或修改操作都变成一个函数来执行，当读取对象的属性时，
          就会收集当前的副作用函数到一个effectStack中，修改时从栈中弹出，查找所有这个属性所依赖的副作用函数并执行，
          拦截器的内部使用Reflect上的方法，它的优点在于可以接受第三个参数，相当于一个this，代表是谁在操作
          (tip:副作用函数指的是一个执行会直接或间接影响其他函数执行的函数)
---------->Reflect:
              -->Reflect是一个内置对象，它提供拦截 JavaScript 操作的方法(出自MDN)，Reflect提供的方法与Proxy的方法相对应，它让Object操作都变成函数行为
              Reflect.get(target,propertyKey,[receiver])  第一个参数是目标对象 ; 第二个参数 是要获取的属性名称 ; 
              第三个是可选参数，如果目标属性是一个getter函数，那么receiver会作为getter调用时的this值
              Reflect.set()同理...
          
           Vue创建响应式对象主要是用reactive创建的，他针对于对象类型的数据，因为JavaScript中一切都是对象，
           所以不管是对数组还是Set，Map这些数据结构进行任何操作，本质上也是对对象的读取和修改，只是拦截方法不同

           -->对于原始值的响应式方案，Vue提供了ref，主要用来让基本数据类型变成响应式数据的，因为proxy只支持代理对象，
           所以ref内部把所有的基本数据类型外部都包裹了一层对象，
           并额外地给它添加了一个属性来标识它是一个ref，以便之后在setup的返回值和模板中脱掉ref。

           -->ref解决了响应式丢失的问题，响应式丢失就是如果我们用reactive来创建一个响应式的对象，
           然后再把它其中的属性赋值给另外一个普通对象中，
           这样响应式就会丢失，因为它不再是原来的对象了，就算属性都是一样的。
           在ref中解决了这个问题，因为ref会首先被一个对象包裹，它的属性和与响应式属性同名，值就是getter和setter操作。
*/

/* 
  👑70.dns查询的过程？
       DNS查询主要分为两种类型：递归查询和迭代查询；
       DNS是一种分布式数据库，用于将人类可读的域名转换为机器可以识别的IP地址;
       1. 当在浏览器中输入一个URL或请求网络资源时，客户端首先要找到该URl对应的IP地址;
       2. 大多数操作系统都会缓存DNS查询结果，如果IO地址没有在本地缓存，就会开始一个DNS解析过程;
       3. 首先会询问本地DNS解析器；
       4. 如果本地DNS服务器没有缓存该域名的记录，它还会进行一个递归查询的过程，一直向上；
       5. 到根DNS服务器，根服务器不会解析域名(没有直接的域名到IP地址的映射信息，但它知道所有顶级域名服务器的位置)，
       他会返回管理请求顶级域(如.com)的顶级域名服务器的IP地址；
       6. 到顶级域名服务器，如果请求的域名是以.com结尾的，那么这个顶级域名服务器就是包含管理所有以.com域名的服务器，
       接着他会返回给本地DNS包含请求的域名信息的权威DNS服务器的IP地址(哪个权威DNS服务器负责该具体域名)；
       7. 到权威DNS服务器，本地DNS服务器会向该域名的权威DNS服务器发出请求，然后由权威DNS服务器返回存储的域名对应的IP地址
       8. 本地服务器会将信息缓存起来(根据TTL(生存时间))
       9. 本地服务器将解析结果返回给最初发起请求的设备
       --->性能优化：
                 缓存:DNS服务器会根据DNS记录中的TTL值缓存查询结果，缓存可以减少DNS解析时间，
                 减轻服务器和TLD服务器(顶级服务器)的压力;负载均衡：大型网站会使用多个IP地址来处理对其域名的请求，
                 DNS服务器可以根据不同的策略返回不同的IP地址;
*/

/* 
  71.对useCallback，useMemo这两个hook的理解，有什么区别？以及适合在什么场景下应用？
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
      不应该滥用这两个钩子，因为在某些情况下会造成相反的效果，比如说虽然可以读取缓存结果，但React在每次渲染前都会判断一下
      依赖数组中的元素是否变化，以此来决定他们两个的返回值，如果依赖数组很大或计算函数比较复杂，性能会因此下降
*/

/*  
  72.防抖和节流怎么实现？
   首先防抖(Debouncing),使目标函数在事件触发后的指定时间后执行，如果在此期间重复触发，会重新计时；
   【避免因频繁触发事件而执行不必要的操作】
   eg.
*/
const debounce = (func, wait) => {
  let timeout;
  return () => {
    const context = this,
      args = arguments; //解决函数调用时的上下文问题
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      //在事件监听器或异步操作(如定时器)中，函数如果被直接调用，this往往不会指向预期的对象，而是指向全局对象
      func.apply(context, args);
    }, wait);
  };
};
// Use it
window.addEventListener(
  "resize",
  debounce(() => {
    console.log("我执行了");
  }, 300)
);
/*  节流(throttling),确保函数在一定时间间隔内只执行一次，即使事件被多次触发，函数也只是周期性执行；
  【保证在给定的时间内至少执行一次，适合于需要连续响应用户操作的场景】 */
// 节流：(在指定的时间间隔内最多只执行一次)
const throttling = (fn, limit) => {
  let inThrottle; //标志变量，用于记录是否在冷却时间；
  return function () {
    //返回一个新函数，封装了原始的fn函数，控制它的执行频率
    const context = this,
      args = arguments;
    if (!inThrottle) {
      //为false
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

window.addEventListener(
  "scroll",
  throttling(() => {
    console.log("我执行了"), 300;
  })
);

/* 
  73. XSS 和 CSRF？
   --> XSS(Cross-Site-Scripting) 跨站脚本攻击：【许多网页应用依赖于URL参数来动态加载或改变页面内容】
      攻击者在页面中插入恶意代码，当用户浏览页面时，嵌入在页面中的恶意代码会执行，可能会窃取到用户的Cookie等敏感信息；
      --> XSS 产生的根本原因:
              1.恶意代码没有经过过滤，浏览器无法辨别哪些代码可信；
              2.因为直接在用户的终端发起的请求，所以是可以获取到用户的信息的
      --> XSS 分类：
              1.存储型XSS攻击(永久性存储)：
                1.首先攻击者会找到页面的输入点(通常是UGC内容,比如论坛中发的帖子，用户评论，它们的共同特点是可以被提交并储存在数据库);
                2.找到这些输入点后，攻击者就会尝试输入包含恶意js代码的数据(这些脚本通常被设计为在加载到其他用户的浏览器时自动执行);
                  --> 比如说这样的代码: <script> alert('I am XSS😈') </script>
                      这段代码如果没有被过滤和转义，就可以被储存起来显示给其他用户，而在他们的浏览器中执行;
                3.然后提交的数据会经过后端处理存储到数据库中；
                4.当其他用户正常使用网站时，恶意脚本就会从数据库中检索出来，随着网页内一起发送到用户的浏览器中

              2.反射型XSS攻击(非持久性XSS攻击)：
                  -->诱使用户点击特定的恶意链接，或访问恶意网站来执行恶意脚本的攻击方式
                  --> 1. 攻击者首先要找到输入点，(这个输入点可以接收用户的输入，并可以根据输入反射到页面中)通常是搜索框，url参数等；
                      2.确定输入点后，攻击者构造一个包含恶意代码的特殊请求或连接；
                          -->比如：一个搜索引擎网站的URL结构，允许搜索查询通过URL参数传递，并且搜索结果页面会显示查询内容，
                                攻击者会创建以下链接：http://dohkyungsoo.com/search?query=<script>alert('I am XSS😈')</script>
                                即：url中的查询参数是一段js代码；【通常来讲是在页面中插入一个恶意链接】
                      3.攻击者通过各种方式诱使用户点击恶意链接。
                      4.恶意脚本执行：当用户点击链接并访问含有恶意参数的url时，他们的浏览器会发送一个包含恶意脚本的请求到目标网站，
                      5.服务器接收到请求后，会处理请求中的查询参数(在这个阶段，服务器读取参数，然后准备将其包含在生成的响应中)，
                               对于一个搜索请求，服务器可能会生成一个页面，显示搜索结果和包含在查询参数中的搜索词
                      6.生成的HTML被返回给浏览器(此时服务器作用已完成，它只是反射了用户输入的数据回到浏览器)
                      7.响应到达用户浏览器，浏览器就会解析并渲染HTML，如果响应中包含scrpit标签或其他可执行脚本，(未被过滤或编码)
                        它们就会在浏览器中执行；

              3.DOM型XSS攻击(前端安全漏洞，上边两种属于服务端安全漏洞):
                      --> 也是诱使用户点击恶意链接，点击后脚本会改变当前页面的dom，
                          因为这种攻击完全来源于客户端，所以不会在服务器日志中留下痕迹
      --> XSS攻击的两大要素：
                         1.攻击者提交恶意代码(并显示在页面上);
                         2.浏览器执行恶意代码;
      --> XSS攻击的防御策略：
                      -->主要是如何处理用户的输入和输出内容，确保对用户输入进行严格的过滤和验证
                         将存储的数据显示到页面上时，对所有输出进行HTML编码
                         使用内容安全策略(CSP)
                         定期清理数据库
                         ...
      --> CSRF(Cross-Site Request Forgery),跨站请求伪造：
               -->攻击者诱导用户点进第三方网站，然后此网站中只要一被打开就会执行一些脚本，携带着用户的token和各种信息凭证，
                  向被攻击的网站发送请求，(因为用户在此网站已经注册并登录了，会绕过后台的验证)
                   --> 常见攻击类型：
                          1. GET 类型的CSRF  (比如嵌入在img标签中的src里面的链接)
                          2. POST类型的CSRF  (比如一个自动提交的表单)
                          3. 链接类型的CSRF  (用户点击后才会触发，通常攻击者会想尽办法诱导用户点击)
                   --> CSRF 的特点：
                          1. 通常是跨域的，因为外域更容易被控制；
                          2. 攻击者不能真正获取用户的登录凭证或权限信息(只是使用)，而是利用用户已经在被攻击网站中的已有信息
                             来向冒充用户进行对第三方网站的GET和POST行为；
                   --> CSRF 的预防：
                         1.同源检测(针对于大多数CSRF是跨域的而言)：
                                   因为CSRF大多数是从外域发起的请求。因此可以限制来自外域(或不受信任的域名)的请求，
                                   在HTTP的两个头部中，有Referer(记录HTTP请求的来源地址)和
                                   Origin(字段内包含请求的域名(不包含path及query))两个头部，服务器可以验证HTTP请求头部中的
                                   这两个字段，来确保请求是从受信任的源发起的，但是因为头部信息是可以被用户修改的，
                                   所以这种方式并不是很可靠。
                                     --> tip: 1. IE 11不会添加Origin头部
                                              2. 经过302重定向的请求也不会有Origin字段
                                  2.CSRF Token(针对于攻击者获取不到用户的Cookie等信息)：
                                      攻击能成功的原因是网站的服务器认为发起请求的是用户自己，因此可以让每个用户都拥有
                                      一个攻击者获取不到的Token，然后服务器验证请求是否携带正确的token，来区分正常的请求和攻击；
                                       --> tip: CSRF Token是一个随机生成的唯一字符串，用户在打开页面时(或登录时)，
                                       由服务器生成发送给客户端(会作为表单的一部分或添加到请求头中)，然后后续的所有请求，
                                       用户都要携带此Token，为了安全性，可能每个表单或请求都会生成一个新的CSRF Token
                                  3.双重Cookie验证
                                  4.Set-Cookie的响应头：sameSite = Strict 
                                  (这样设置，Cookie只会在请求来自同一个站点时发送),另一个值是Lax(宽松)                  
      --> CSP (Content Security Policy)是一种安全标准，用于防止跨站脚本攻击和其他跨站注入攻击。
          --> CSP指定哪些内容可以(脚本，图片，css等)可以在网页上执行或加载，提供了一个额外的安全层。
              --> 配置CSP：
                         1.HTTP头：通过发送一个HTTP头部Content-Security-Policy【在服务端配置，通常在服务端配置文件Apache，
                                  Nginx或后端语言Nodejs设置】
                         2.<meta>标签：在HTML文档中通过<meta>标签制定策略
                             -->常见的CSP指令：
                                  1.default-src: 设置默认的内容源策略，如果没有指定其他指令，则该指令被应用；
                                  2.script-src: 指定允许执行的脚本的源;
                                  3.style-src: 定义允许的样式表的来源;
                                  4.img-src: 指定可以从哪些源加载图片;
                                  5.connect-src: 限制可以通过如Ajax进行连接的域;
                                  6.font-src： 指定允许的字体的源;
                                  7.object-src: 指定允许加载的插件的源;
                                  8.media-src:指定允许加载媒体的源;
                                  9.frame-src:指定可以嵌入的<iframe>
                          因为过渡使用CSP，可能会导致网站原有的功能被破坏，所以可以逐步实施CSP；
                          可以先使用 Content-Security-Policy-Report-Only 头部，这样不会阻止任何内容，而是会将违反策略的情况报告;
*/

/* 
  74.进程和线程的区别和联系？
   【可以说一个运行的软件就是一个进程】
     (可以说进程是包含线程的，即线程是进程的子集)
     进程： 是运行在系统内存中的程序，每个进程都有自己单独的地址空间
     【资源分配的基本单位】
     【进程间相互独立，一个进程崩溃后，在保护模式下不会对其他进产生影响】
     线程：线程是程序执行的最小单元，它没有自己的地址空间，它可以与同属与一个进程中的其他线程共享进程中的所有资源
     【CPU调度的基本单位】
     【线程间资源共享，一个线程崩溃可能会影响到同一进程中的其他线程】
     --->一个进程可以包含一个或多个线程。
       74.1 并发与并行？
           并发： 在同一时刻，有多个指令在单个CPU上交替执行(CPU在多个线程之间交替执行)
           并行： 在同一时刻，有多个指令在多个CPU上同时执行(电脑只有一个cpu，但它分为x核x线程，代表可以同时处理多少个线程 )
*/

/* 
  75.TCP/IP四层模型？ (互联网协议套件)
    4.应用层 (HTTP)
    3.传输层 (TCP/IP)
    2.网际层 (主要负责在多个网络之间传输数据，其核心协议使互联网协议(IP),它负责数据包的寻址和路由，确保数据包能够跨越多个网络从源头传输到目的地)
    1.网络接口层 (相当于OSI模型的物理层和数据链路层，负责与物理网络硬件进行交互，并处理在网络设备之间传输数据包的细节)
*/

/* 
  76.OSI七层模型？
    1.物理层 (电缆，光纤)
    2.数据链路层 (在相邻的节点间建立，维护和终止链路连接)
    3.网络层 (负责设备间的数据传输和路由选择，确保数据包能够从源头到达目的地 IP)
    4.传输层 (提供端到端的数据传输服务，确保数据的完整性和顺序，两个协议：TCP/UDP)
    5.会话层 (负责在网络中的两节点之间建立，管理和终止会话，会话可以被视为不同进程间的对话或数据交换会话，
             会话层确保会话能够无错误地进行)
    6.表示层 (确保一个系统发送的信息能够被另一个系统读取和理解，关注的是数据的格式化，编码和解码，以及数据的压缩和解压缩)
    7.应用层 (直接为应用程序提供服务，定义了很多标准的鼓舞和协议，比如HTTP协议，FTP(文件传输),SMTP(电子邮件传输),
             应用层使用户能够接入网络服务)
*/

/* 
  77.call(),apply(),bind()?
  首先他们三个都用来设置函数内部this值，可以为函数调用指定一个具体的对象作为上下文(this);
  1. call()
  语法： func.call(thisArg,arg1,arg2...);
  参数说明：thisArg，在func函数运行时使用的this值
          arg1，arg2，传递给函数的参数列表
  2. apply()
  语法：func.apply(thisArg,[argsArray]);
  参数说明： argsArray 一个数组或类数组对象
  3. bind()
  创建一个新的函数，bind()被调用时，新函数的this被指定为bind()的第一个参数，其余函数作为新函数的参数
*/

/* 
  78.Vue是怎么操作DOM的？
  在.vue文件中的模板最后会被转换成以js对象形式表达的虚拟DOM树结构，然后vue的内部为了减少更多的DOM操作，
  使用diff算法对比这些虚拟dom内部节点的变化，再进行移动和更新，最后会对这些虚拟dom批量转换成真实dom显示到页面，对于列表渲染出来的元素，
  在书写vue代码时，vue就会提示每个列表项必须要有一个唯一的key，而且vue也不推荐使用索引来作为key，因为在虚拟dom的对比以及更新中，
  需要一个稳定且唯一的值来判断当前节点的位置和内容信息，最后来决定是否需要重新patch或移动，如果经过计算后的列表项不需要任何变化，
  虚拟dom就不会被改变，这样会避免不必要的dom操作
  
  [vue的内部有一个异步更新队列，在同一个事件循环中，即使数据变化多次，DOM更新也只会执行一次。Vue会将所有的数据变更积累起来，
  在事件循环的下一个tick中统一处理，可以避免不必要的重渲染]
      -->为什么不建议用index作为每个虚拟dom的key值？
         -->Vue通过key来判断哪些元素是新被添加的，哪些元素可以把被复用，所以就要求这个key必须是唯一且不重复的，
         如果使用index作为key值，如果这个元素在变化的过程中，索引还是原来的索引，此时即使元素本身有了改变，但Vue会认为它没有变化，
         复用了原来的节点，降低更新的效率。另外，如果元素是输入框之类的元素，在删除任意一个前面的元素时，后边的索引都会发生改变，
         也会导致不必要的dom操作增加。
*/

/* 
 79.webpack是怎么处理commonjs/esm的？
   1.处理Commonjs模块：1. 解析依赖：webpack解析require调用来确定依赖关系；
                      2. 加载模块：webpack加载并执行模块文件，将其包装到一个函数中，以避免全局命名空间冲突；(每个模块都有自己的作用域)
                      3. 导出模块：处理module.exports来确定模块的导出内容;
                      4. 合并代码：webpack将所有模块的代码合并到一个或多个打包文件中，并为每个模块生成唯一的标识符；

    tip：ESM模块是静态的，即在编译阶段(而不是运行时)就可以完全确定和解析模块的依赖关系；
         ESM禁止动态导入(不能将import放在条件语句中)
         提升性能：由于所有依赖关系在编译时就已经确定，浏览器可以并行加载所需要的所有模块，而不是等待脚本运行到某个位置才开始加载；
         按需加载：虽然ESM不支持动态导入，但可以使用import()函数来实现按需加载
         -->与之相比，CommonJS模块系统是动态的，即require可以在代码的任何地方使用(函数和条件语句)，
            但同时构建工具在解析和优化时就需要处理更多的复杂关系

  ==> webpack 的Loader和Plugin：
      1. Loader是用于转换模块的，它们允许在import或require模块时预处理文件，Loader本质上是一个函数，接受源文件作为输入，
      然后返回转换后的结果，从而实现对文件的一系列转换；预处理：在文件进入打包过程之前对其进行预处理
      2. Plugin用于执行从打包到完成的各种任务和自定义功能，与Loader专注于将一种文件类型转换为另一种文件类型不同，
      它能参与到构建过程的各个阶段，可以用于优化打包结果，管理资源，插入环境变量等；
*/

/* 
  80. git的命令？
     1. git add . / xxx  添加全部修改的文件/某个文件到暂存区，多个文件用空格区分

     2. git commit -m 'message' 提交暂存的更改，并留下备注
     3. git commit -am 相当于git add . && git commit -m
     4. git commit --amend 对最近一次提交的信息进行修改，(会修改commit的hash值)

     5. git pull <远程主机名> <远程分支名>：<本地分支名> //从远程仓库拉取代码并合并到本地
         -->相当于git fetch && git merge
            1. git fetch 会从远程仓库获取最新的分支状态，但不会修改工作目录
            2. git merge会将拉取下来的远程分支合并到当前分支(通常是和当前分支同名的)
            -->这种合并操作会在git历史中创建一个新的合并历史(merge commit)
     6. git pull --rebase <远程主机名> <远程分支名>：<本地分支名> 
          -->相当于 git fetch && git rebase
          -->git rebase将本地当前分支上的所有未推送的提交转移到拉取下来的远程分支的顶端(它会先把本地分支回退到两个分支的共同祖先，然后逐个应用远程分支上的提交)

     7. git fetch 只拉取远程分支，不自动进行merge操作
         1.git fetch -all 获取远程仓库所有分支的更新
    
     8. git rebase
        git merge 都是合并分支操作

        1. git merge  将多个分支合并，如果存在冲突，git会停止并要求手动解决冲突，没有会顺利进行合并
                      特点：合并会保留历史，所有历史提交都将保留在合并后的历史中
        2. git rebase 特点：
                          1.首先 git rebase 需要确定两个分支的分叉点，即这两个分支最后一次的共同提交
                          2.取出并暂存当前分支上分叉点之后的所有提交
                          3.然后将当前分支的头部移动到目标分支的最新提交上
                          4.然后git逐个将每个提交应用到最新的基底上
                          -->会改变提交历史，是历史更加线性易读
     9. git checkout 传统切换分支指令，它可以：
                               1.切换到已存在的分支
                                  git checkout <branch-name>
                               2.创建新分支并切换到该分支上
                                  git checkout -b <new-branch-name>
                               3.恢复工作目录中的文件到某一特定版本
     10. git switch (推荐使用)
                  1. git switch <branch-name> 切换到已经存在的分支
                  3. git switch -c <new-branch-name> 创建分支并切换到该分支

     11. git branch <branch-name> 创建分支
     12. git branch 查看本地分支
     13. git branch -r 查看远程分支
     14. git branch -a 查看本地和远程分支
     15. git branch -d <branch-nane> 删除本地分支  
        【-d:git会检查要删除的分支是否已经完全合并到当前分支，如果没有，git会阻止，如果确定要删除，可以使用-D,或 --delete --force】
     16. git branch -m <old-branch-name> <new-branch-name> 重命名分支
     17. git push origin(远程仓库的名称) --delete <branch-name> 删除远程分支

     18. git status 查看当前工作目录和暂存区的状态,显示当前分支的状态，包括哪些文件被修改，暂存，未跟踪的状态

     19. git log 查看提交历史
         git log --oneline 简化日志输出

     20. git stash 临时保存修改，清理工作目录(当需要切换分支但工作目录中有未完成的工作时，可以用这个命令保存当前的工作进度)
                   它将更改存放在一个本地的stash栈中
     21. git stash apply 将存储的更改重新应用到当前工作目录中的命令，不会溢出stash栈中的记录
     
     22. git cherry-pick 用于将某个分支上的单个提交(或一系列提交)应用到当前分支【允许选择性地复制一个或多个提交到当前的工作分支，而不需要进行完整的分支合并】
           -->使用方法：
              git cherry-pick <commit-hash>
              git cherry-pick <start-commit-hash>^..<end-commit-hash> 应用于多个连续的提交，^表示范围
              1.关于哈希值：可以使用git log寻找哈希值[默认情况，哈希值显示长格式，但实际只需取前七位即可]
     23. git revert 
         git reset  撤销一个或多个已有的提交【会更改历史】
            1. git reset 在本地回退，可以更改HEAD，暂存区，工作目录的状态
               git reset --soft HEAD~1  --soft模式下，git reset将HEAD指针移动到指定的提交，但不改变索引(暂存区)和工作目录，主要用于撤销 git commit而不撤销 git add
               git reset --misxed(默认) 都撤销
               git reset --hard HEAD 彻底回退，会丢失所有未提交的更改
            
           2. git revert【更安全，不改变历史】【首选】
              git revert HEAD 创建一个新提交，它是旧提交的反向操作
*/

/* 
  81.Vite和Webpack的不同
     Vite架构：
        1.Vite开发环境下使用esbuild进行依赖预构建，而且它利用现代浏览器原生支持esm(ES module)的特点提供了快速开发启动和热更新，
          在开发模式下，Vite不进行打包操作，而是通过服务器动态提供模块；
          【Vite的开发服务器主要是主要是按需编译和提供源文件
             1.当浏览器请求一个模块时，Vite首先检查请求的资源
             2.如果是第三方依赖，它会提供通过esbuild预构建的版本
             3.如果是源代码文件(.vue,.js,.ts等)，Vite会根据需要处理这些文件，例如使用esbuild处理typescript，然后直接发送到浏览器
          】
       
          Vite生产环境使用Rollup进行打包，Rollup使用tree shaking来移除未使用的代码，理论上可以减少最终打包的体积；
               rollup也支持esm，拥有丰富的插件系统，允许在生产构建中添加各种功能，比如代码压缩，css预处理，图像优化等

               生产构建流程：
                        1.预构建：与开发模式下类似，使用esbuild对依赖转换为ESM，以便让Rollup更高效地处理它们。
                        2.预构建完成后，Vite调用Rollup处理所有资源，Rollup会分析到项目中的所有模块，然后执行tree shaking，合并代码。
                          【解析动态导入，优化模块的加载顺序，代码分割】
                        3.打包后，可能还会执行后续处理步骤，比如压缩js，css，html文件(使用Rollup插件完成)
                        4.输出构建产物
  
    Webpack：
         适合于构建大型项目，或需要兼容旧系统或多种技术栈的项目，webpack支持多种模块定义。
         架构：
            1.入口(Entry):是用来构建内部依赖图的起点
            2.输出(Output):告诉webpack在哪里输出所创建的bundles，以及如何命名
            2.loaders ：webpack只能理解json和js文件，loadera可以让webpack能处理其他类型的文件，并将他们转换为有效模块，以供应用程序使用
            3.plugins：插件用于执行范围更广的任务
            4.mode


        //  https://wangdoc.com/typescript/intro
    81.1 Vite 和 Webpack 的热模块替换(HMR)?
         1.webpack 的HMR：
                       通过websocket来实现的，服务器端监听文件变动，并在代码变化时向客户端发送更新；
                       热替换过程(更新的模块会通过websocket发送到浏览器，替换旧模块，不用刷新页面)
         2.Vite 的HMR：
                    也是websocket，vite对每个模块提供http服务，浏览器可以直接请求这些模块
                    当文件有改动，它只需要重新编译改动的部分
*/

/* 
  82.TS有一个接口A，让接口B只继承A中的a,b,c三个属性，怎么做？
     假设有个接口A：
     interface A{
         a:string;
         b:number;
         c:boolean;
         d:Date;  //假设不让B继承这个属性
     }
     
     接口B：
     interface B extends Pick<A,'a' | 'b' | 'c'>{}
                         ^^^^^^^^^^^^^^^^^^^^^^^的作用是从A中挑选'a','b','c'这三个属性来创建一个新类型，然后B接口通过继承这个新类型  
*/
/* 
 83.flex：1 的含义？
    首先，flex属性是flex-grow,flex-shrink,flex-basis的简写，默认值为0 1 auto
    flex-grow：元素在 flex 容器中分配剩余空间的相对比例
    flex-shrink：指定了 flex 元素的收缩规则
    flex-basis：指定了 flex 元素在主轴方向上的初始大小

    -->当写 flex：1 时，实际上：
           flex-grow：1; 增长因子
           flex-shrink：1; 缩小因子
           flex-basis：0; 默认尺寸基准值
      flex: 1 期望多个元素平等分配父容器中的空间，例如有一个容器和三个子元素，如果给每一个子元素都设置flex:1,则每个元素都会平等地分配容器的空间，忽略它们原始的大小。
*/

/* 
  84.非关系型数据库有什么？
     非关系型(NoSQL): 
               1.键值存储(key-value):数据以键值对的形式存储，键是唯一的，这种类型的数据库提供快速查询响应
                 Redis
               2.文档型数据库：数据以文档形式存储，通常是JSON，XML格式，这些数据库允许更复杂的数据结构(如嵌套文档)并提供丰富的查询语言
                 MongoDB
               3.列存储数据库
               4.图形数据库
*/
/* 
  85.React中父组件如何调用子组件的方法？
     1.forwardRef 和 useImperativeHandle是用来处理父组件需要访问子组件中的函数或属性的特定场景。
       -->forwardRef是一个React函数，允许将ref从父组件传递给子组件，默认情况下，函数组件不能直接接受ref属性(因为没有实例)
         forward
*/

/* 
  86.跨域是怎么产生的？怎么解决跨域？(浏览器的同源策略)
*/

/* 
  87.如何检测用户离开/进入当前浏览器界面？

*/
