import auth from "./modules/auth.ts";
import board from "./modules/board.ts";
import newTask from "./modules/newTask.ts";
import journal from "./modules/journal.ts";
import review from "./modules/review.ts";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    board,
    newTask,
    journal,
    review
  },
});
