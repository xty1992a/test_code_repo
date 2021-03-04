<template>
  <div @enter="enter"
       @before-leave="beforeLeave"
       @leave="leave"
       name="closePanel"
       class="close-panel" v-show="open">
    <slot></slot>
  </div>
</template>

<script>
  export default {
	name: 'close-panel',
	props: {
	  staticHeight: Number,
      open: Boolean
	},
	data() {
	  return {
		height: 0
	  };
	},
	methods: {
	  initHeight(el) {
		if (this.staticHeight) {
		  this.height = this.staticHeight;
		  return;
		}
		if (this.hadInit) return;
		this.hadInit = true;
		this.height = el.getBoundingClientRect().height;
	  },
	  enter(el, done) {
		this.initHeight(el);
		el.style.height = 0;
		setTimeout(() => {
		  // velocity(el, {height: this.height + 'px'}, {easing: 'linear', duration: 300, complete: done})
		}, 20);
	  },
	  beforeLeave(el) {
	  },
	  leave(el, done) {
		this.initHeight(el);
		// velocity(el, {height: '0px'}, {easing: 'linear', duration: 300, complete: done})
	  }
	}
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../styles/variable";

</style>
