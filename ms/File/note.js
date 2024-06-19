// Vue应用中，有两种处理方式来加载动态数据
/* 
   1.在路由导航时预先获取数据：这种方式通常通过Vue Router 的导航守卫
      可以为路由组件添加以下配置：
      beforeRouteEnter
      beforeRouteUpdate
      beforeRouteLeave
      这种方式适用于确保数据在路由完全解析之前就已经准备好
 */
<script>
export default {
  beforeRouteEnter(to, from) {
    // 在渲染该组件的对应路由被验证前调用
    // 不能获取组件实例 `this` 
    // 因为当守卫执行时，组件实例还没被创建！
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
    // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from) {
    // 在导航离开渲染该组件的对应路由时调用
    // 与 `beforeRouteUpdate` 一样，它可以访问组件实例 `this`
  },
}
</script>

/* 
  2.子组件内获取数据：用生命周期钩子，如onMounted或watch对路由参数的变化进行监听

*/
