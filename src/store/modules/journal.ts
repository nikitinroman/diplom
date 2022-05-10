// @ts-ignore
import { JOURNAL_URL, SET_TASK_MARK_URL } from "../../requestHelpers/endpoints.ts";
import { requestWrapper } from "../../requestHelpers/requestHelper.js";

export default {
  state: () => ({
    table: [],
  }),
  mutations: {
    setJournalTable(state, payload) {
      state.table = payload;
    },
  },
  getters: {
    journalTable(state) {
      return state.table;
    },
  },
  actions: {
    async fetchGroupSubjectJournalTable({ commit }, getParam) {
      const response = await requestWrapper({
        additionUrl: JOURNAL_URL,
        userID: this.state.auth.userId,
        token: this.state.auth.token,
        getParam: getParam,
        method: "GET",
      });
      commit("setJournalTable", response.table);
    },
    async setTaskMark(_, postBody) {
      await requestWrapper({
        additionUrl: SET_TASK_MARK_URL,
        userID: this.state.auth.userId,
        token: this.state.auth.token,
        postBody: postBody,
        method: "POST",
      });
    },
  },
};
