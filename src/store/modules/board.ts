// @ts-ignore
import { BOARD_URL, UPDATE_TASK_STATUS_URL } from "../../requestHelpers/endpoints.ts";
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
    async updateTaskStatus(_, postBody) {
      await requestWrapper({
        additionUrl: UPDATE_TASK_STATUS_URL,
        userID: this.state.auth.userId,
        token: this.state.auth.token,
        postBody: postBody,
        method: "POST",
      });
    },
  },
};
