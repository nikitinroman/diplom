export default {
  state: () => ({
    tasks: [],
  }),
  mutations: {
    setTasks(state, payload) {
      state.tasks = [...state.tasks, payload];
    },
  },
  getters: {
    getTasks(state) {
      return state.tasks;
    },
  },
  actions: {
    fetchTasks({ commit }) {
      commit("setTasks", [1, 2, 3]);
    },
  },
};
