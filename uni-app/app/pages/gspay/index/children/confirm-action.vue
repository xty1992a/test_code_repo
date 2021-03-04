<template>
  <transition>
    <div class="confirm-action" v-show="show" @touchmove="maskMove">
      <div class="mask" v-show="show"></div>
      <div class="con-bottom">
        <div class="cf-action">
          <header class="con-head confirm-head">
            <p>油站确认</p>
          </header>
          <div class="con-content">
            <div class="con-item">
              <p class="con-text" v-if="disType===1">
                当前定位模糊，距离油站
                <span style="color:red;">{{newDistance}}</span>
                <span>{{distanceUnit}}</span>
                ，请向加油员咨询并确认当前油站名称是否为：
                <span style="color:red;">{{gsStoreName}}</span>
              </p>
              <p class="con-text" v-else>{{disMessage}}</p>
            </div>
          </div>
          <header class="con-sub confirm-head" @click="cancel" v-if="disType===1">
            <p>确定</p>
          </header>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import "../js/math";

  export default {
	name: "confirm-action",
	props: {
	  show: {
		type: Boolean
	  },
	  disType: {
		type: Number
	  },
	  distance: {
		type: Number
	  },
	  disMessage: {
		type: String
	  },
	  gsStoreName: {
		type: String
	  }
	},
	components: {},
	data() {
	  return {};
	},
	methods: {
	  cancel() {
		this.$emit("update:show", false);
		this.$emit("confirm");
	  },
	  maskMove(e) {
	  }
	},
	computed: {
	  distanceUnit() {
		if (this.distance > 1000) {
		  return "公里";
		}
		return "米";
	  },
	  newDistance() {
		let dis = 0;
		if (this.distance <= 1000) {
		  dis = this.distance;
		}
		if (this.distance > 1000) {
		  dis = this.distance / 1000;
		}
		return Math.fixed(dis, 2);
	  }
	},
	watch: {
	  show(now) {
		setTimeout(() => {
		  // now && this.$refs.scroll && this.$refs.scroll.refresh();
		}, 20);
	  }
	}
  };
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "../../../../styles/variable";

  .confirm-action {
    position: absolute;
    right: 0;
    left: 0;
    z-index: 20;

    .con-bottom {
      position: absolute;
      z-index: 10;
      width: 100%;
      padding: 0 16%;
      margin: -10% auto;

      .cf-action {
        background-color: #fff;
        border-radius: 8px;

        .confirm-head {
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          -webkit-box-pack: center;
          justify-content: center;
        }
      }

      .con-head {
        font-size: 9px;
        font-weight: bold;
        padding: 20px 0px 5px 0px;
      }

      .con-sub {
        font-size: 18px;
        font-weight: bold;
        border-top: 1px solid #e5e5e5;
        padding: 10px 0 15px 0px;

        p {
          &:first-child {
            color: #07c160;
          }
        }
      }

      .con-content {
        height: auto;
        .f17;

        .con-item {
          padding: 5px 20px 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;

          .con-text {
            font-size: 13px;
            line-height: 20px;
            color: #9d9d9d;
          }
        }
      }
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

    .pick-list {
      padding: 5px;

      .pick-item {
        display: inline-block;
        vertical-align: middle;
        width: 33.33%;
        padding: 6px;

        &.disabled {
          opacity: 0.4;
        }
      }
    }
  }
</style>
