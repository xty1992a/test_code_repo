import Vue from "vue";
import App from "./App.vue";
import "../shared/direct";

new Vue({
  components: { App },
  render: (h) => h(App),
}).$mount("#app");
