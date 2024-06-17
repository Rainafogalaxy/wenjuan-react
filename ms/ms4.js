/**
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

5.路由权限守卫的细节，点击某一个路由页面跳转时，如何触发，以及触发过程？
6.路由懒加载和图片懒加载的实现？

9.什么时候用async和promise？

——————————————————————————————————————————————————————————————————————————————————————————————————————————————————
12.原生js如何获取dom元素，如何监听dom元素全部加载出来(MutationObserver)
 
13.场景：用户距离服务器很远，不能在用户的终端复现他的卡顿场景，如何排查？
14.黑客注入一个恶意脚本，发出一条ajax请求，该请求发送到黑客自己的服务器然后进行了一个转发，这种是否属于CSRF？
15.手写instanceof                                    

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
