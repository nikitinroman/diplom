// @ts-ignore
import { AUTH_URL, BASE_URL } from "../../requestHelpers/endpoints.ts";
import router from "../../router";

export default {
  state: () => ({
    authorized: false,
    editableMode: false,
    userId: "",
    token: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    groupId: "",
  }),
  mutations: {
    setAuth(state, payload) {
      state.authorized = payload;
    },
    setEditableModeStatus(state, payload) {
      state.editableMode = payload;
    },
    setToken(state, token) {
      state.token = token;
    },
    setUserInfo(state, payload) {
      state.userId = payload.id;
      state.firstName = payload.firstName;
      state.middleName = payload.middleName;
      state.lastName = payload.lastName;
      state.email = payload.email;
      state.phone = payload.phone;
      state.groupId = payload.groupId;
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
    firstName(state) {
      return state.firstName;
    },
    middleName(state) {
      return state.middleName;
    },
    lastName(state) {
      return state.lastName;
    },
    email(state) {
      return state.email;
    },
    phone(state) {
      return state.phone;
    },
    groupId(state) {
      return state.groupId;
    },
    token(state) {
      return state.token;
    },
  },
  actions: {
    async fetchAuth({ commit }, payload) {
      const postBody = {
        email: payload.email,
        password: payload.password,
      };

      let fullRequestUrl = BASE_URL + AUTH_URL;
      let response;

      try {
        response = await fetch(fullRequestUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json;charset=utf-8" },
          body: JSON.stringify(postBody),
        }).then((response) => {
          return response.json();
        });
      } catch (err) {
        alert(`Упс, что-то пошло не так! Ошибка: ${err}`);
      }

      if (response.error) {
        alert(`Упс, что-то пошло не так! Ошибка: ${response.error}`);
      } else if (response) {
        commit("setEditableModeStatus", !response.user.isStudent);
        commit("setToken", response.token);
        commit("setUserInfo", response.user);
        commit("setAuth", true);
        router.push({ name: "home" });
      }
    },
    logout({ commit }) {
      commit("setAuth", false);
      commit("setEditableModeStatus", false);
    },
  },
};
