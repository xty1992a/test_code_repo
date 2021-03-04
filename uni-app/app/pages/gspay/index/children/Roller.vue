<template>
  <div class="roller">
    <transition name="roll">
      <div class="roller-item" :key="item[keyName]">
        <slot v-bind="item"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
	const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

	export default {
		name: "roller",
		props: {
			list: Array,
			keyName: {
				type: String,
				default: 'key'
			}
		},
		data() {
			return {
				index: 0,
				seed: 0,
			};
		},
		computed: {
			item() {
				return this.list[this.index];
			},
		},
		methods: {
			async roll() {
				while (this.seed) {
					let seed = this.seed;
					await sleep(2500);
					if (seed !== this.seed) break;
					this.ticktock();
				}
			},

			ticktock() {
				this.index = this.index === this.list.length - 1 ? 0 : this.index + 1;
			},
		},
		watch: {
			list: {
				handler() {
					this.seed++;
					this.list.length > 1 && this.roll();
				},
				immediate: true,
			},
		},
		created() {
		},
		mounted() {
		},
		beforeDestroy() {
		},
	};
</script>

<style lang="less" rel="stylesheet/less">
  .roller {
    position: relative;
  }

  .roll-enter {
    transform: translateY(100%);
    opacity: 0;
  }

  .roll-leave-to {
    transform: translateY(-100%);
    opacity: 0;
  }

  .roll-enter-active,
  .roll-leave-active {
    position: absolute;
    transition: 0.5s;
    width: 100%;
  }
</style>
