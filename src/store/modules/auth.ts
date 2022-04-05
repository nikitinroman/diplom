export default {
  state: () => ({
    authorized: false
  }),
  mutations: {
    setAuth(state, payload) {
      state.tasks = [...state.tasks, payload];
    }
  },
  getters: {
    getAuth(state) {
      return state.authorized;
    }
  },
  actions: {
    fetchAuth({ commit }) {
      commit('setAuth', true)
    }
  }
}
