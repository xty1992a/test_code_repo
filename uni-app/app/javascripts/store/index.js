import Vue from '@vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import secondKill from './modules/secondKill'
import shop from './modules/shop'
// import createLogger from 'vuex/dist/logger'
import vuexStorePlugin from './vuexStorePlugin'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
// plugins: debug ? [vuexStorePlugin, createLogger()] : [vuexStorePlugin]
  plugins: [vuexStorePlugin],
  modules: {
	secondKill,
	shop,
  },
})
