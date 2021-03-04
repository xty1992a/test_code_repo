import App from '../../core/index';

const limit = (min, max) => value => Math.max(Math.min(max, value), min);

new App({
  name: 'Counter',
  props: {
	value: Number,
	max: {
	  type: Number,
	  default: Infinity
	},
	min: {
	  type: Number,
	  default: 0
	},
	size: {
	  type: String,
	  default: '28px'
	}
  },
  created() {
  },
  methods: {
	add() {
	  this.input(+this.value + 1);
	},
	sub() {
	  this.input(+this.value - 1);
	},

	input(value) {
	  this.$emit('input', limit(this.min, this.max)(value));
	}
  },
  computed: {},
  watch: {}
});
