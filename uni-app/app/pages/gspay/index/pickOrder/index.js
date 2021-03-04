import Main from "./index.vue";
import Vue from "vue";

const Com = Vue.extend(Main);
const copy = o => JSON.parse(JSON.stringify(o));

function createVm(opt) {
  // const vm = new Com({ data: opt }).$mount();
  // document.body.appendChild(vm.$el);
  // return vm;
  return null
}

const dftOpt = {
  value: null,
  title: 'N号枪',
  options: []
};

export default (opt = {}) => new Promise(resolve => {
  console.log(opt);
  opt = { ...dftOpt, ...opt, resolve, value: copy(opt.value || "") };
  let vm = createVm(opt);
  vm.show = true;
})
