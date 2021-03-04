import Vue from 'vue';
import App from './index.vue';
// import 'core-js/es6/promise';

Vue.config.productionTip = false;

window.Promise = window.Promise || Promise;
Promise.all([Promise.resolve]);
const vm = window.APPLICATION = new Vue({
  el: '#app',
  components: {App},
  render: h => h(App)
});
