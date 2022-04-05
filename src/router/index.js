import Vue from "vue";
import VueRouter from "vue-router";

import Auth from "../pages/auth";
import Board from "../pages/board";
import Home from "../pages/home";
import Schedule from "../pages/schedule";
import Miro from "../pages/miro";
import Journal from "../pages/journal";
import myReview from "../pages/myReview";

Vue.use(VueRouter);

const routes = [
  { path: "/auth", name: "auth", component: Auth },
  { path: "/board", name: "board", component: Board },
  { path: "/", redirect: "/home" },
  { path: "/home", name: "home", component: Home },
  { path: "/miro", name: "miro", component: Miro },
  { path: "/journal", name: "journal", component: Journal },
  { path: "/schedule", name: "schedule", component: Schedule },
  { path: "/myReview", name: "myReview", component: myReview },
];

const router = new VueRouter({
  mode: "history",
  routes,
});
export default router;
