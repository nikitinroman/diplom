export default {
  state: () => ({
    authorized: false,
    editableMode: false,
  }),
  mutations: {
    setAuth(state, payload) {
      state.authorized = payload;
    },
    setEditableModeStatus(state, payload) {
      state.editableMode = payload;
    },
  },
  getters: {
    getAuth(state) {
      return state.authorized;
    },
    editableMode(state) {
      return state.editableMode;
    },
  },
  actions: {
    fetchAuth({ commit }) {
      commit("setAuth", true);
      commit("setEditableModeStatus", true);
    },
    logout({ commit }) {
      commit("setAuth", false);
      commit("setEditableModeStatus", false);
    },
  },
};
