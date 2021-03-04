<template>
  <div class="ui-input-number" @click="isStop">
    <template v-if="controls">
      <span class="sub" :class="canSub?'':'disabled'" @click="sub"></span>
      <span class="add" :class="canAdd?'':'disabled'" @click="add"></span>
    </template>
    <input :disabled="disabled" type="number" :value="value" @input="print" @blur="blur">
  </div>
</template>

<script>
  export default {
	name: 'input-number',
	props: {
	  value: [Number, String],
	  controls: {
		type: Boolean,
		default: true,
	  },
	  min: {
		type: Number,
		default: 0,
	  },
	  max: {
		type: Number,
		default: 999999,
	  },
	  disabled: Boolean,
      stop: {
	    type: Boolean,
        default: true
      }
	},
	components: {},
	data() {
	  return {}
	},
	created() {
	},
	methods: {
      isStop(e){
        this.stop && e.stopPropagation()
      },
	  print(e) {
		this.$emit('input', +e.target.value);
	  },
	  blur() {
		let value = +this.value;
		if (isNaN(value)) {
		  console.log('NaN', this.value, this.max);
		  this.$emit('input', this.max);
		  return
		}
		if (value < this.min) {
		  this.$emit('input', this.min)
		}
		if (value > this.max) {
		  this.$emit('input', this.max)
		}
		if (value - parseInt(value) !== 0) {
		  this.$emit('input', parseInt(value))
		}
	  },
	  add() {
		if (!this.canAdd) return;
		this.$emit('input', +this.value + 1)
	  },
	  sub() {
		if (!this.canSub) return;
		this.$emit('input', +this.value - 1)
	  },
	},
	computed: {
	  canAdd() {
		return this.value + 1 <= this.max && !this.disabled
	  },
	  canSub() {
		return this.value - 1 >= this.min && !this.disabled
	  },
	},
	watch: {
	  max(now) {
		if (this.value > now) {
		  this.$emit('input', now)
		}
	  },
	  min(now) {
		if (this.value < now) {
		  this.$emit('input', now)
		}
	  },
	  disabled(now) {
		if (now) {
		  this.$emit('input', 0)
		}
	  },
	},
  }
</script>

<style lang="less" rel="stylesheet/less">

  .ui-input-number {
    width: 105px;
    height: 30px;
    position: relative;
    border: 1px solid #e5e5e5;
    overflow: hidden;

    span {
      top: 0;
      height: 30px;
      width: 30px;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      vertical-align: top;
      position: absolute;
      background-color: #fff;

      &:before, &:after {
        content: '';
        width: 50%;
        height: 1px;
        background-color: #000;
        display: block;
        margin: auto;
        position: absolute;
        bottom: 0;
        right: 0;
        top: 0;
        left: 0;
      }

      &.sub {
        left: 0;
        border-right: 1px solid #e5e5e5;
      }

      &.add {
        right: 0;
        border-left: 1px solid #e5e5e5;

        &:after {
          transform: rotate(90deg);
        }
      }

      &.disabled {
        color: #999;

        &:after, &:before {
          background-color: #999;
        }
      }
    }

    input {
      width: 100%;
      height: 100%;
      text-align: center;
      border: 0;
    }
  }
</style>
