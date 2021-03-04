import App from '../../core/index';

new App({
  name: 'Index',
  data() {
	return {
	  obj: {
		a: 1,
		b: 2,
	  },
	  a: 0,
	  b: 15,
	};
  },
  created() {
  },
  methods: {
	add() {
	  this.a++;
	  this.b++;
	  console.log('add');
	},
	sub() {
	  this.a--;
	  this.b--;
	  console.log('sub');
	},
	changeValue(event) {
	  const {detail: value, target: {dataset: {key}}} = event;
	  console.log(value);
	  this.obj[key] = value;
	}
  },
  computed: {
	total() {
	  return this.obj.a + this.obj.b;
	}
  },
  watch: {
	a(now, old) {
	  console.log('a change ', now, old);
	},
	b(now, old) {
	  console.log('b change ', now, old);
	},
	total(now, old) {
	  console.log('total change ', now, old);
	}
  }
});
