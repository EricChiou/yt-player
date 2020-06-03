import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    countryCode: null
  },
  mutations: {
    setCountryCode(state, countryCode) { state.countryCode = countryCode; }
  },
  actions: {
    setCountryCode(context, countryCode) {
      context.commit('setCountryCode', countryCode);
    }
  }
});
