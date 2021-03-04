<template>
<!--  <transition :name="position">-->
    <div class="action" @touchmove="maskMove" :style="{top}" v-show="show">
      <div class="mask" v-show="overlay" @click="cancel" :style="{top}"></div>
      <div class="top" v-if="position==='top'" :style="{height:topHeight}">
<!--        <scroll ref="scroll" @scrollEnd="scrollEnd" :data="list" :scrollbar="scrollbar">-->
          <slot name="top"></slot>
<!--        </scroll>-->
      </div>
      <div class="bottom" v-if="position==='bottom'">
        <slot name="bottom"></slot>
      </div>
      <div class="center" v-if="position==='center'">
        <slot name="center"></slot>
      </div>
    </div>
<!--  </transition>-->
</template>

<script>
  // import Scroll from 'components/scroll'

  export default {
	name: 'action',
	// components: {Scroll},
	props: {
	  overlay: {
		type: Boolean,
		default: true
	  },
	  topHeight: {
		type: String,
		default: '100%'
	  },
	  position: {
		type: String,
		default: 'bottom'
	  },
	  pre: {      //  是否阻止默认行为
		type: Boolean,
		default: true
	  },
	  top: {
		type: String,
		default: '0px'
	  },
	  list: {
		type: Array,
		default() {
		  return []
		}
	  },
	  show: {
		type: Boolean,
		default: false
	  }
	},
	data() {
	  return {
		scrollbar: {
		  fade: false
		}
	  }
	},
	methods: {
	  maskMove(e) {
//        this.pre && console.log('此处可能有坑 maskMove in action.vue')
//        this.pre && e.preventDefault()
	  },
	  cancel() {
		console.log('tap')
		this.$emit('cancel')
	  },
	  scrollEnd(p) {
		this.$emit('scrollEnd', p)
	  }
	},
	watch: {
	  show(newVal) {
		if (this.position !== 'top') return
		let scroll = this.$refs.scroll
		if (!this.scroll && !newVal) return
		scroll.scroll && scroll.scroll.refresh()
	  }
	}
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../styles/variable";

  .action {
    position: absolute;
    right: 0;
    left: 0;
    z-index: 20;
    bottom: 0px;
    .bottom {
      background-color: #fff;
      position: absolute;
      z-index: 2;
      width: 100%;
      bottom: 0;
    }
    .top {
      height: 100%;
      position: relative;
      background-color: #fff;
    }
    .mask {
      .fill;
      background-color: rgba(0, 0, 0, 0.4);
    }
    .center {
      transform: translate3d(-50%, -50%, 0) scale(1);
      position: absolute;
      left: 50%;
      top: 50%;
    }
  }

  .bottom-enter-active, .bottom-leave-active,
  .center-enter-active, .center-leave-active,
  .top-enter-active, .top-leave-active {
    transition: .3s;
    > div {
      transition: .3s;
    }
  }

  .bottom-enter, .bottom-leave-to {
    .bottom {
      transform: translate3d(0, 100%, 0);
    }
    .mask {
      opacity: 0;
    }
  }

  .top-enter, .top-leave-to {
    .mask {
      opacity: 0;
    }
    .top {
      transform: translate3d(0, -100%, 0);
    }
  }

  .center-enter, .center-leave-to {
    .mask {
      opacity: 0;
    }
    .center {
      transform: translate3d(-50%, -50%, 0) scale(0);
    }
  }

</style>
