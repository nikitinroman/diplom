export default {
  state: () => ({
    authorized: false,
    editableMode: false,
    userId: "",
  }),
  mutations: {
    setAuth(state, payload) {
      state.authorized = payload;
    },
    setEditableModeStatus(state, payload) {
      state.editableMode = payload;
    },
    setId(state, payload) {
      state.userId = payload;
    },
  },
  getters: {
    getAuth(state) {
      return state.authorized;
    },
    editableMode(state) {
      return state.editableMode;
    },
    userId(state) {
      return state.userId;
    },
  },
  actions: {
    fetchAuth({ commit }) {
      commit("setAuth", true);
      commit("setEditableModeStatus", true);
      commit("setId", "user123");
    },
    logout({ commit }) {
      commit("setAuth", false);
      commit("setEditableModeStatus", false);
    },
  },
};
