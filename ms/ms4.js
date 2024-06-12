/**
 
1.如何判断对象时排除null？
  -->使用typeof分不清object，null，Array
  -->可以使用Object.prototype.toString.call()方法:
                                     -->注意：它输出的是一个字符串，格式为：[object type]
  -->instanceof 使用它判断数组时，不管是 arr instanceof Array 还是  arr instanceof Object 都会返回true【但可以排除Null】
——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
2.null与undefined的区别？
  null代表的是一个空对象，undefined表示未定义
——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
3.路由权限如何做？(vue,react)
  -->Vue:
      //index.ts
      const vueRoute:RouteRecordRaw[] = [
         {
            path: '/',
            name: 'hachiware',
            component:()=>import(''); //这里是指定的路径 
         }
      ]

      // example：
      {
        path: 'user',
        name: 'SysUser',
        component: () => import(''),
        meta: {
          title: '用户管理',
          permissionCode: 10004,
          img: require('@/assets/images/Tree/setting-user.png')
      }
  },

  // 当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于等待中。
  -->每个守卫方法接收两个参数：
       to: 即将要进入的目标
       from: 当前导航正要离开的路由

       可以返回的值如下:
        false: 取消当前的导航。如果浏览器的 URL 改变了(可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
        一个路由地址: 通过一个路由地址重定向到一个不同的地址，如同调用 router.push()，且可以传入诸如 replace: true 或 name: 'home' 之类的选项。
        它会中断当前的导航，同时用相同的 from 创建一个新导航。

   import {createrouter , createWebHistory} from 'vue-router';
   const router = createRouter({
      history: createWebhistory(),
      routes: [] //里面是路由具体配置
   })
   //全局前置守卫 (在路由进入前触发)
   router.beforeEach((to,from,next)=>{ //tip：next参数可选
      //检查用户是否登录
      if(to.meta.requiresAuth && !isAuthenticated()){
        next('/login') //如果没有登录，重定向
      }else{
         next(); //正常跳转
      }
    })
  
    //也可以为单个路由设置守卫，比如在配置数组中：
    {
      path: '/somePath',
      component:()=>import('/xxx');
      beforeEach:(to,from,next)=>{
        if(){
          xxxx
        }
      }
    }
        ==================
        全局解析守卫和全局路由守卫的区别？(router.beforeResolve和router.beforeEach)
        1. router.beforeEach 会在导航被触发后，路由配置解析开始之前立即调用
        2. router.beforeResolve 会在组件内守卫和异步路由组件被解析之后，导航被确认之前调用，它通常用于最后一步检查


4.token过期了如何处理？
  -->token用于验证用户权限的，在第一次完成登录或注册时，服务端给返回一个token，然后后边的每次请求，客户端都要携带这个token，以便让服务器验证用户有权限访问。
  token可以设置过期时间(在后端)；
  如果当前客户端发送的token被服务端检查到已经过期了(一般token，像JWT会包含过期时间)，后端会返回401状态码，表示没有权限，或者403 禁止访问；
  -->前端可以在每次发送请求前自己检查一下token是否过期(如果token携带)
   ————>
      Refresh Token:
                   1.服务器发送两种令牌给客户端： Access Token 和Refresh Token
                   Access Token： 短期令牌。主要用于访问需要凭证的接口
                   Refresh Token：如果Access Token过期，它可以获取一个新的，有效期通常会更长【只会访问特定的接口，来换取新的Access Token】
                    -->tip:如果Refresh Token也过期，就需要用户重新进行身份验证
    --也可以拦截响应(401或403或407)然后自动刷新Token，然后再发送一次请求
————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
5.路由权限守卫的细节，点击某一个路由页面跳转时，如何触发，以及触发过程？
6.路由懒加载和图片懒加载的实现？
7.绝对定位和相对定位的区别？
   相对定位：相对于它原本在文档流中的位置来计算偏移位置(不脱离文档流)
   绝对定位：相对于最近的被设置定位的祖先元素计算位置(如果没有，会相对于视口或根元素定位) 【会脱离文档流】
8.在vue的computed和watch函数中，可不可以用promise？
9.什么时候用async和promise？
10.forEach和map的区别？for...in与for...of的区别？
  1. forEach对数组的每个元素执行一次所给方法，在每次执行都会返回undefined，map会返回一个数组，里面的元素是原数组经过给定函数操作后的结果
  2. for in一般用来遍历对象，它会遍历到对象的所有可枚举属性(包括继承来的)
     for of可以遍历所有可迭代的对象(对象不可迭代)
————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
11.如何判断一个属性是自己有，还是在原型链上？(hasOwnProperty)如何判断一个原型对象是否在另一个对象的原型链上(isPropertyOf)
——————————————————————————————————————————————————————————————————————————————————————————————————————————————————
12.原生js如何获取dom元素，如何监听dom元素全部加载出来(MutationObserver)
 
13.场景：用户距离服务器很远，不能在用户的终端复现他的卡顿场景，如何排查？
14.黑客注入一个恶意脚本，发出一条ajax请求，该请求发送到黑客自己的服务器然后进行了一个转发，这种是否属于CSRF？
15.手写instanceof                                    
16.深拷贝要注意哪些问题？
17.async和await的具体实现？
18.webpack 的工作流程
19.ES5如何实现继承？对原型链的理解？
20.require和import 的区别？
21.webpack 的loader解决的具体问题？
22.



proxy支持的拦截操作：
      1.get(target,propKey,receiver) 拦截对象属性的截取
      2.set(target,propKey,value,receiver) 拦截对象属性的设置
      3.has(target,propKey) 拦截propKey in proxy的操作
      ...
  **/
