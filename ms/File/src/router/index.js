import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("///"),
  },
  {
    path: "book/:id", //动态路由
    name: "Book",
    props: true, //启用props，使得路由参数可以作为props传递给组件
  },
];
