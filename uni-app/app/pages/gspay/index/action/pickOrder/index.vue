<template>
  <transition name="action">
    <div class="pick-order" @click="close" v-show="show">
      <div class="center" @click.stop>
        <header>
          <h3>{{title}}<span>选择金额</span></h3>
          <i class="iconfont icon-quxiao" @click="cancel"></i>
        </header>
        <section>
          <ul class="list">
            <li class="item" v-for="item in options" :key="item.key" @click="confirm(item)">
              <span class="price">{{item.price}}</span>
              <span class="time">{{item.time}}</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </transition>
</template>

<script>
	const sleep = time => new Promise(resolve => setTimeout(resolve, time));
	export default {
		name: "pick-order",
		props: {},
		data() {
			return {
				show: false
			};
		},
		computed: {},
		methods: {
			async close() {
				this.show = false;
				await sleep(300);
				this.$destroy();
			},

			cancel() {
				this.resolve({success: false});
				this.close();
			},

			confirm(item) {
				this.resolve({success: true, value: item});
				this.close();
			}
		},
		watch: {},
		created() {
		},
		mounted() {
		},
		beforeDestroy() {
			this.$el && this.$el.parentNode.removeChild(this.$el);
		}
	};
</script>

<style lang="less" rel="stylesheet/less">

  .pick-order {
    position: fixed;
    bottom: 0;
    right: 0;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;

    .center {
      width: 280px;
      max-height: 40vh;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      background-color: #fff;
      border-radius: 8px;

      header {
        position: sticky;
        background-color: #fff;
        right: 0;
        left: 0;
        top: 0;
        height: 60px;
        font-size: 9px;
        color: #07C160;
        text-align: center;

        h3 {
          line-height: 60px;
        }

        span {
          color: #666;
        }

        .iconfont {
          position: absolute;
          right: 10px;
          top: 23px;
          color: #333;
          font-size: 9px;
        }
      }

      section {
        .list {
          padding: 1px 13px;

          .item {
            height: 55px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            background-color: #EDEDED;
            border-radius: 6px;
            margin-bottom: 15px;
          }

          .price {
            color: #000;
            font-size: 12px;

            &:before {
              content: '￥';
              font-size: 10px;
            }
          }

          .time {
            color: #07C160;
            font-size: 12px;
          }
        }
      }
    }
  }

  .action-enter,
  .action-leave-to {
    background-color: transparent;

    .center {
      opacity: 0;
      transform: translateY(-100px);
    }
  }

  .action-enter-active,
  .action-leave-active {
    transition: .3s;

    .center {
      transition: .3s;
    }
  }
</style>
