import Vue from "vue";
import store from "./store";
import "./app.less";
import * as utils from "./utils";
// import { AtButton } from "taro-ui-vue";
// Vue.component(AtButton.name, AtButton);
import UI from "taro-ui-vue";
import "taro-ui-vue/dist/style/index.scss";
Vue.use(UI);

// 使用.h5,.weapp后缀区分平台
import * as api from "./api";

Vue.prototype.$utils = utils;
Vue.prototype.$api = api;

const App = new Vue({
  store,
  onShow(options) {},
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h("block", this.$slots.default);
    // return <block>{this.$slots.default}</block>;
  },
});

export default App;
