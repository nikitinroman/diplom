import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/";

import Auth from "../pages/auth";
import Board from "../pages/board";
import Home from "../pages/home";
import Schedule from "../pages/schedule";
import Miro from "../pages/miro";
import Journal from "../pages/journal";
import myReview from "../pages/myReview";
import newTask from "../pages/newTask";

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
  { path: "/newTask", name: "newTask", component: newTask },
];

const editableModeRoutesOnly = ["myReview", "newTask"];
const studentModeRoutesOnly = ["board", "home"];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (!store.getters.getAuth && to.name !== "auth") {
    next({ name: "auth" });
  } else {
    if (
      editableModeRoutesOnly.includes(to.name) &&
      !store.getters.editableMode
    ) {
      next({ name: "board" });
    } else if (
      studentModeRoutesOnly.includes(to.name) &&
      store.getters.editableMode
    ) {
      next({ name: "myReview" });
    } else {
      next();
    }
  }
});

export default router;
