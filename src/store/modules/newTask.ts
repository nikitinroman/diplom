// @ts-ignore
import { NEW_FILE_TO_TASK_URL, NEW_TASK_URL, } from "../../requestHelpers/endpoints.ts";
import { requestWrapper } from "../../requestHelpers/requestHelper.js";

export default {
  state: () => ({}),
  mutations: {},
  getters: {},
  actions: {
    async postNewTask(_,postBody) {
      return await requestWrapper({
        additionUrl: NEW_TASK_URL,
        userID: this.state.auth.userId,
        token: this.state.auth.token,
        postBody: postBody,
        method: "POST"
      });
    },
    async uploadFile(_,payload) {
      await requestWrapper({
        additionUrl: NEW_FILE_TO_TASK_URL,
        userID: this.state.auth.userId,
        token: this.state.auth.token,
        getParam: payload.taskId,
        formData: payload.formData,
        method: "POST",
      });
    },
  },
};
