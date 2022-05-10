// @ts-ignore
import { TASKS_FOR_REVIEW_URL } from "../../requestHelpers/endpoints.ts";
import { requestWrapper } from "../../requestHelpers/requestHelper.js";

export default {
  state: () => ({
    tasksForReview: [],
  }),
  mutations: {
    setTasksForReview(state, payload) {
      state.tasksForReview = payload;
    },
  },
  getters: {
    tasksForReview(state) {
      return state.tasksForReview;
    },
  },
  actions: {
    async fetchTasksForReview({ commit }, getParam) {
      const response = await requestWrapper({
        additionUrl: TASKS_FOR_REVIEW_URL,
        userID: this.state.auth.userId,
        token: this.state.auth.token,
        getParam: getParam,
        method: "GET",
      });
      commit("setTasksForReview", response.taskList);
    },
  },
};
