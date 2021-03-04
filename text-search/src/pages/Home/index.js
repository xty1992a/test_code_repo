import Vue from "@/lib/shared-vue";
import App from "./index.vue";

const app = window.APPLICATION = new Vue({
  el: "#app",
  components: {App},
  render: h => h(App)
});
