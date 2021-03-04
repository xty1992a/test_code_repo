<template>
  <transition name="popup">
    <div class="pop-menu" v-show="value" :style="style" @click.stop>
      <ul class="menu-list">
        <li class="menu-item"
            @click="pressMenu(item)"
            :class="index===options.length-1?'':'van-hairline--bottom'"
            v-for="(item, index) in options"
            :key="item.key">
          <svg-icon v-if="item.svg" :icon="item.svg" :style="{color:item.iconColor}"/>
          <i class="iconfont" :class="item.icon" v-if="item.icon"></i>
          <span>{{item.name}}</span>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
  export default {
	name: 'pop-menu',
	props: {
	  options: Array,
	  value: Boolean,
	  top: {
		type: String,
		default: 'auto'
	  },
	  left: {
		type: String,
		default: 'auto'
	  },
	  right: {
		type: String,
		default: 'auto'
	  },
	  bottom: String,
	},
	components: {},
	data() {
	  return {};
	},
	mounted() {
	  // document.body.appendChild(this.$el);
	},
	methods: {
	  cancel() {
		this.$emit('input', false);
	  },
	  pressMenu(item) {
		if (item.link) {
		  location.href = item.link;
		}
		else {
		  this.$emit('click', item);
		}
	  }
	},
	computed: {
	  style() {
		const result = {
		  top: this.top,
		  left: this.left,
		  right: this.right,
		  bottom: this.bottom,
		};
		Object.keys(result).forEach(k => {
		  if (result[k] === 'auto') {
			delete result[k];
		  }
		});
		return result;
	  }
	},
	watch: {
	  value(now) {
		// if (now) {
		//   setTimeout(() => {
		// 	document.addEventListener('click', this.cancel);
		//   }, 50);
		// }
		// else {
		//   document.removeEventListener('click', this.cancel);
		// }
	  }
	}
  };
</script>

<style lang="less" rel="stylesheet/less">

  .pop-menu {
    padding: 0 14px;
    background-color: #fff;
    position: fixed;
    box-shadow: 0 0 15px rgba(0, 0, 0, .1);
    border-radius: 4px;
    transform: translateY(0);
    opacity: 1;

    &:after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 0;
      width: 10px;
      height: 10px;
      background-color: #fff;
      transform: translate(-50%, 50%) rotate(45deg);
    }

    .menu-list {
      .menu-item {
        font-size: 7px;
        white-space: nowrap;
        line-height: 40px;

        .iconfont, svg {
          font-size: 8px;
          vertical-align: middle;
          color: #ff9700;
        }

        span {
          display: inline-block;
          vertical-align: middle;
        }

      }
    }
  }

  .popup-enter, .popup-leave-to {
    transform: translateY(-50px);
    opacity: 0;
  }

  .popup-enter-active, .popup-leave-active {
    transition: .3s;
  }
</style>
