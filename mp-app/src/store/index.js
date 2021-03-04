import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import * as utils from "../utils";

const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    SET_COUNT: (state, count) => (state.count = count),
  },
  actions: {
    // roll20面骰子
    async rollCount({ commit }) {
      await utils.sleep(300);
      commit("SET_COUNT", utils.ranger(1, 20));
    },
  },
});

export default store;
