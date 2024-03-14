/* 
1.魔法参数
**是指在编程中直接使用的，没有明确含义的硬编码数值**
魔法参数会使代码难以阅读和理解：
(1).维护困难: 如果这个数值需要改变，需要在代码库中找所有使用这个数值的地方进行修改，增加维护成本
(2).重复代码：如果同一个数值在多出使用，一旦需要改变，就必须修改所有地方，违反 DRY (Don't Repeat Yourself)原则

2.埋点
**埋点是一种数据收集手段，用于追踪和分析用户行为**
(1).首先要定义埋点策略
-->①确定埋点目标:明确想通过埋点手机哪些数据，如页面访问量，按钮点击次数，用户停留时间
-->②选择埋点类型:常见的埋点类型包括代码埋点，可视化埋点和无埋点。(代理埋点需要手动在代码中添埋点逻辑，可视化埋点和无埋点通常由第三方工具提供支持)
第三方工具比如 Google Analytics , Mixpanel , Sentry , Posthog
-->③实施埋点:对于代码埋点，需要在关键交互点手动添加埋点代码，比如追踪按钮点击

document.getElementById('btn').addEventListener('click',()=>{
    analytics.track('btn',{
        button_od:'btn',
        time:new Date()
    })
})
//对于可视化埋点和无埋点，通常需要按照所选工具的说明文档集成SDK，并在其平台上配置所需的追踪目标
常见的埋点上报方式有: ajax , img , navigator.sendBeacon

// 因为埋点实际上是对关键节点的数据进行上报，是和服务端交互的一个过程，所以可以和后端约定一个接口通过ajax进行数据上报

// 第一种: ajax 
(缺点:埋点的域名不是当前域名，因此请求会存在跨域风险，而且如果ajax配置不正确可能会遭到浏览器的拦截，
    且，
    ①每个埋点事件都会生成一个网络请求，频繁的请求可能会对用户的网络环境造成压力，特别是在移动网络下，可能会导致页面响应变慢或增加用户的数据使用量
    ②大量的埋点逻辑和网络请求可能影响页面的加载和执行速度，尤其是在低端设备上
    ③请求失败:由于网络不稳定，用户关闭页面等原因，一些埋点请求可能在到达服务器之前失败，导致数据丢失
    ④跨域问题: 如果埋点数据需要上报到另一个域的服务器，可能会遇到跨域资源共享(CORS)问题，需要服务端配置适当的CORS策略
    ⑤维护成本-代码入侵性：代码埋点通常需要在多个地方手动添加上报逻辑，会使代码耦合度增加，难以维护和管理
    ⑥灵活性：如果上报逻辑或收集数据结构需要变更，可能需要修改大量前端代码并重新部署，缺乏灵活性
    ⑦缺乏实时反馈->延迟处理：数据需要在服务端处理后才能查看分析结果，对于需要快速响应(比如实时监控用户行为来做出动态调整)的场景可能无法满足需求
)

解决办法:
1.使用批量上报和数据缓存: 将多个埋点事件缓存起来，一次性批量上报，来减少网络请求
2.利用现代浏览器API ： navigator.sendBeacon() 方法来发送数据，该方法允许在页面卸载时异步发送数据，减少对页面性能的影响，并降低数据丢失的风险
3.

1.首先定义一个埋点的数据结构:

//比如:可能想要收集事件名称，事件发生的时间，用户的唯一标识，以及任何与事件相关的其他数据
const eventData = {
    eventName:'button_click',
    eventTime:new Date().toISOString(),
    userId:"用户的唯一标识",
    additionalData:{   //其他的balabala...
        buttonId:"theButton",
        page:"landingPage"
    }
}
//创建上报埋点数据的函数  (实际可能会用axios)
const buryingPointAjax = (data)=>{
    return new Promise((resolve,reject)=>{
        // 创建ajax请求
        const xhr = new XMLHttpRequest();
        const url = "服务端埋点手机接口url"
        // 定义请求接口
        xhr.open("POST",url,true);
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState === 4 && xhr.status === 200){
                console.log("事件上报成功")
            }
        }
        xhr.send(JSON.stringify(data))
    })
}

// 绑定事件并上报数据
document.getElementById('btn').addEventListener('click',()=>{
    //....
    buryingPointAjax(data);
})

// 第二种：基于img的埋点上报
// img是支持跨域的标签  可以通过script,link,img标签

但使用script和link会有两个问题，就是必须把这两个标签挂载到页面，才会真正发起请求，而反复的dom操作会造成页面的性能问题，而且载入js/css资源会阻塞页面的渲染，影响用户体验，
因此对于需要频繁上报的埋点而言，它们两个不合适(因为dom的改变会使浏览器的渲染流水线重复执行)

而img可以不用挂载到页面(避免反复操作DOM)，img的加载不会阻塞HTML的解析，但img加载后并不渲染，他需要等待Render Tree生成完后才和Render Tree一起渲染出来
(通常埋点上报会使用gif图，合法的gif图只需要43个字节)

当通过<img>标签的src属性请求一个图片资源时，服务器可以记录请求的URL，并从中解析出所需的数据，这种方式不需要等待服务器的响应


const imgPointBurring = (data)=>{
    //将事件对象转换为查询字符串
    const queryString = Object.keys(data).map(key=>`${encodeURIComponent(key)}=${endoceURIComponent(eventData[key])}`.join('&'));
    // 创建一个新的<img>标签来发送埋点请求
    const img = new Image();
    img.src = `https://my-tracking-server.com/track?${queryString}`;
    // 可选:设置一个很短的超时时间，避免长时间等待图片加载
    img.timeout = 1000;
    // 防止图片请求时间长占用内存，当图片加载完成或失败时解除引用
    img.onload = img.onerror = ()=>{
        img.onload = img.onerror = null;
    }
}

document.getElementById('btn').addEventListener("click",()=>{
    imgPointBurring({
        eventName:'btn-click',
        eventTime: new Date().toISOSting(),
        userId: '',
        buttonId: ''
    })
})

// 第三种：navigator.sendBeacon()   --->  可用于通过HTTP POST将少量数据 异步 传输到Web服务器
接受两个参数，第一个参数是hi目标服务器的url，第二个参数是要发送的数据
[它主要用于将统计数据发送到Web服务器，同时避免了用传统技术(如XMLHttpRequest)发送分析数据的一些问题]

sendBeacon如果成功进入浏览器的发送队列后，会返回true，如果受到队列总数，数据大小的限制后，会返回false，返回true后，只是表示进入了发送队列，浏览器会尽力保证发送成功，但是否成功不会有返回值

sendBeacon是异步的，不会影响当前页面到下一个页面的跳转速度，且不受同域限制
(tip:它在支付宝中可能会被拦截)

常见埋点行为：
(1).点击触发埋点:当点击目标元素时，触发埋点上报
fucntion clickBtn(url,data){
    navigator.sendBeacon(url,data)
}

(2).页面停留时间上报埋点
路由文件中，初始化一个startTime，当页面离开时通过路由守卫计算停留时间
let url = '';  // 这个是上报地址
let startTime = Date.now()
let currentTime = '';
router.beforeEach((to,from,next)=>{
    if(to){
        currentTime = Date.now();
        stayTime = parseInt(currentTime-startTime);
        navigator.sendBeacon(url,{time:styleTime});
        startTime = Date.now();
    }
})

(3).错误监听埋点
通过监听函数接收错误信息

1.Vue错误捕获(全局错误处理) :
app.config.errorHandler = (err)=>{
    navigator.sendBeacon(url,{error:error.messgae,text:"vue运行异常"})
}

2.JS异常与静态资源加载异常
window.addeventListener("error",(error)=>{
    if(error.message){
        navigator.sendBeacon(url,{error:error.message,text:"js执行异常"})
    }else{
        navigator.sendBeacon(url,{error:error.filename,text:"资源加载异常"})
    }
}，true)


--------------------------------------
Vue3错误捕获：
(1).组件错误捕获
在Vue3中，可以使用errorCaptured生命周期钩子来捕获组件树中所有后代组件的错误，
这个钩子可以在任何组件中使用，用于捕获和处理从子组件抛出的错误
https://cn.vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured

































































3.单点登录SSO




*/
