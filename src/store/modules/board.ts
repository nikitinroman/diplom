// @ts-ignore
import { BOARD_URL } from "../../requestHelpers/endpoints.ts";
import { requestWrapper } from "../../requestHelpers/requestHelper.js";

export default {
  state: () => ({
    tasks: [],
  }),
  mutations: {
    setTasks(state, payload) {
      state.tasks = payload;
    },
  },
  getters: {
    studentTasks(state) {
      return state.tasks;
    },
  },
  actions: {
    async fetchTasks({ commit }) {
      const response = await requestWrapper({
        additionUrl: BOARD_URL,
        userID: this.state.auth.userId,
        token: this.state.auth.token,
        method: "GET",
      });
      commit("setTasks", response.taskList);
    },
  },
};
