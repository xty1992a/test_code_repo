/*
* 一个简单的胶水适配类
* 提供类似vue的语法用于开发小程序.
*
* 注意区分*类实例*和*组件实例*
* 一般而已,类实例会命名为vm,组件实例会命名为app/实例
* */
import EmitAble from './emit-able';

const nextTick = () => new Promise(r => r());

const getApp = () => getCurrentPages().slice(-1)[0];

const rdm = () => Math.random().toString(36).substr(2, 15);

const isConstructor = Obj => {
  try {
	new Obj();
	return true;
  } catch (e) {
	return false;
  }
};

const dftOptions = {
  props: {
	id: {
	  type: String,
	  default: () => rdm()
	}
  },
  name: '',
  onLaunch() {
  },

  created() {
  },

  methods: {},

  computed: {},

  watch: {},

  data() {
	return {};
  },

};

export default class App {
  constructor(props = {}) {
	this.$options = {...dftOptions, ...props};
	this.run();
	this.$event = new EmitAble();
  }

  init() {
	this.mapData();
	this.mapComputed();
	this.mapProperties();
  }

  // 将methods映射到实例中
  mapMethods() {
	const methods = this.$options.methods;
	const vm = this;
	const keys = Object.keys(methods);
	keys.forEach(key => {
	  Object.defineProperty(this, key, {
		get() {
		  return methods[key];
		},
		set() {
		  throw 'methods 不可更改!';
		}
	  });
	});

	return keys.reduce((p, key) => {
	  return {
		...p,
		[key]() {
		  try {
			methods[key].call(vm, ...arguments);
		  } catch (e) {
			console.log('call methods error !', e);
		  }
		}
	  };
	}, {});
  }

  // 将props映射到实例中
  mapProperties() {
	Object.keys(this.$options.props).forEach(key => {
	  if (this.hasOwnProperty(key)) return;
	  Object.defineProperty(this, key, {
		get() {
		  return this.$app.properties[key];
		},
		set(v) {
		  console.log('set ', key, v);
		  throw `prop ${key} 只能由父组件更改!`;
		}
	  });
	});
  }

  // 转换props
  computeProps() {
	// 胶水代码
	// 把vue风格的props转换为小程序的properties
	return Object.keys(this.$options.props).reduce((pre, key) => {
	  let value = this.$options.props[key];

	  if (value.hasOwnProperty('type') && value.hasOwnProperty('default')) {
		const fn = value['default'];
		if (fn instanceof Function) {
		  value.value = value.default();
		}
		else {
		  value.value = fn;
		}
	  }
	  return {
		...pre,
		[key]: value
	  };
	}, {});
  }

  // 将小程序的data映射到实例中.
  mapData() {
	// 设置实例对应的同名属性时,将变动暂存到临时空间中.
	// 在事件循环结束时统一同步到小程序中.避免反复setData
	const data = this.$app.data;
	Object.keys(data).forEach(key => {
	  if (this.$options.computed.hasOwnProperty(key)) return;
	  Object.defineProperty(this, key, {
		get() {
		  return data[key];
		},
		set(v) {
		  const flag = this.pushData({[key]: v});
		  console.log('set app ', key, v);
		  if (flag) return;
		  nextTick().then(() => {
			this.syncData();
		  });
		}
	  });
	});
  }

  // 暂存变动的值
  pushData(data) {
	const flag = Boolean(this.__temp_data__);
	this.__temp_data__ = {...(this.__temp_data__ || {}), ...data};
	this.__old_data__ = {...data, ...(this.__old_data__ || {})};
	return flag;
  }

  // 统一同步数据
  syncData() {
	console.log('next tick, sync data to mini program ', this.__temp_data__);
	this.$app.setData(this.__temp_data__);
	this.noticeWatcher();
	this.updateComputed();
	this.__temp_data__ = null;
  }

  // 将computed映射到实例中
  mapComputed() {
	const computed = this.$options.computed;
	Object.keys(computed).forEach(key => {
	  Object.defineProperty(this, key, {
		get() {
		  return computed[key].call(this);
		},
		set(v) {
		  throw 'computed 暂不支持设置';
		}
	  });
	});
  }

  // 更新computed到小程序的data中
  updateComputed() {
	// 小程序只对data/properties中的数据变化响应渲染.
	// App实现的computed最终会实际设置到data中
	// 因此虽然App内部的computed本身已经是响应式了.
	// 但还是需要手动同步到data中.使其能够响应到view层.
	const computed = this.$options.computed;
	const map = Object
		.keys(computed)
		.reduce((pre, key) => this[key] !== this.$app[key] ? {...pre, [key]: this[key]} : pre, {});

	this.$app.setData(map);

  }

  // 触发watch中的监听器
  noticeWatcher() {
	const oldData = this.__old_data__ || {};
	const watch = this.$options.watch;
	Object.keys(oldData).forEach(key => {
	  watch[key] && watch[key](this[key], oldData[key]);
	});

	this.__old_data__ = null;
  }

  // 调用小程序组件
  run() {
	const vm = this;
	const data = this.computeData();
	const properties = this.computeProps();

	// 兼容小程序对lifetimes的改动
	function onCreated() {
	  console.log('component created');
	  vm.$app = this;//getCurrentPages().slice(-1)[0];
	  // console.log(getApp());
	  vm.init();
	  vm.$options.created.call(vm, ...arguments);
	}

	Component({
	  properties,
	  data,
	  created: onCreated,
	  pageLifetimes: {
		show() {
		  console.log('page show');
		}
	  },
	  lifetimes: {
		created: onCreated,
	  },
	  methods: {
		onLoad() {
		},

		onUnload() {
		},

		...vm.mapMethods()
	  },
	});
  }

  computeData() {
	const data = this.$options.data();
	// 初始化计算属性
	const computed = Object.keys(this.$options.computed).reduce((p, key) => ({...p, [key]: this.$options.computed[key].call(data)}), {});

	return {...data, ...computed};
  }

  $emit(event, ...args) {
	this.$app.triggerEvent(event, ...args);
	this.$event.fire(event, ...args);
  }

  $on() {
	this.$event.on(arguments);
  }
}

const _ = {
  get(obj, path) {
	path = path.split('.');
  },
  set(obj, path, value) {

  }
};
