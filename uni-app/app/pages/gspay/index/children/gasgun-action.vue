<template>
  <action class="gasgun" :show="show" @touchmove.native.prevent @cancel="cancel">
    <div class="gasgun-action " slot="bottom">
      <header class="gas-head action-head">
        <b>选择油枪</b>
        <i @click="cancel" class="iconfont icon-quxiao"></i>
      </header>
      <section class="gas-content">
        <!--        <scroll ref="scroll">-->
        <ul class="pick-list">
          <li
                  class="pick-item"
                  @click="check(it)"
                  v-for="(it, index) in localOptions"
          >
            <!-- :class="getCLS(it, index)" -->
            <div class="gas-item" :class="it.className">
              <div class="gun-info">
                <p class="gun-name" v-if="it.gunName" v-html="fmtName(it.gunName)"></p>
                <p class="gas-name" v-if="it.gsName">{{it.gsName}}</p>
              </div>

              <div class="roll-wrap" v-if="it.orders && it.orders.length">
                <!--                  <Roller :list="it.orders" key-name="oilOrderGuid">
                                    <template v-slot="order">
                                      <div class="order-item">
                                        <span class="order_price">{{order.price}}</span>
                                        <span class="order_time">{{order.time}}</span>
                                      </div>
                                    </template>
                                  </Roller> -->
              </div>
            </div>
          </li>
        </ul>
        <!--        </scroll>-->
      </section>
    </div>
  </action>
</template>

<script>
  // import Scroll from 'components/scroll';
  import Action from '../../../../components/action';
  // import Roller from './Roller';
  import pickOrder from '../action/pickOrder';

  const sleep = time => new Promise(resolve => setTimeout(resolve, time));
  const ellipsis = count => str => str.length > count ? str.substr(0, count) + "..." : str;
  import {mapState, mapGetters} from "vuex";

  export default {
	name: 'gasgun-action',
	props: {
	  show: {
		type: Boolean
	  },
	  value: {
		type: Object,
		default: {}
	  },
	  options: {
		type: Array,
		default: []
	  }
	},
	components: {Action, /*Scroll, *//* Roller */},
	data() {
	  return {};
	},

	methods: {
	  fmtName(v) {
		try {
		  if (/^(\d*)/.test(v)) {
			return `<i>${RegExp.$1}</i>号`;
			// return v.replace(/^(\d*)/, '<i>$1</i>');
		  }
		  return `<i>${v[0]}</i>${v.substr(1, v.length)}`;

		} catch (e) {
		  return v;
		}
	  },
	  cancel() {
		this.$emit('show', false)
		this.$emit('confirm', {success: false});
	  },
	  async check(item) {
		if (!this.parameter.enableDispenser) {
		  this.$emit('show', false)

		  this.$emit("input", item);
		  this.$emit("confirm", {success: true});
		  return;
		}
		console.log('abc', this.getCLS(item, 0));

		if (this.getCLS(item, 0) === "disabled") {
		  return;
		}

		this.$emit('show', false)
		await sleep(300);

		//只有一个金额，直接选择
		if (item.orders.length < 2) {
		  this.$emit('show', false)
		  this.$emit("input", item);
		  this.$emit("confirm", {success: true, value: item.orders[0]});
		  return;
		}

		const result = await pickOrder({
		  value: null,
		  title: item.gunName,
		  options: item.orders
		});

		console.log(result);

		this.$emit('show', false)

		this.$emit("input", item);
		this.$emit("confirm", result);
	  },

	  // 油枪item存在四种状态
	  /*
       1. 禁用状态(对接油机-无订单) disabled
       2. 普通状态(未对接油机-未选中) normal
       3. 存在订单状态(对接油机-有订单) active
       4. 选中状态(无论是否对接油机,选中样式一致) picked
      * */
	  getCLS(item, index) {
		if (this.value.guid === item.guid) {
		  return "picked ";
		}
		if (this.parameter.enableDispenser) {
		  if (!item.orders.length) {
			return "disabled";
		  }
		  else {
			return "active";
		  }
		}
		else {
		  return "normal";
		}
	  }
	},
	computed: {
	  ...mapState([
		"parameter",
	  ]),

      localOptions() {
	    return this.options.map((it, index) => ({
          ...it,
          className: this.getCLS(it, index)
        }))
      }
	},
	watch: {
	  show(now) {
		setTimeout(() => {
		  now && this.$refs.scroll && this.$refs.scroll.refresh();
		}, 20);
	  },
      options() {
	    console.log(this.localOptions)
      }
	}
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../../styles/variable";

  view, text{
    box-sizing: border-box;
  }

  .gasgun-action {
    background-color: #fff;
    border-radius: 8px 8px 0 0;

    .ellipsis {
      .ellipsis(100%);
    }

    .gas-head {
      line-height: 28px;
      .f18;
    }

    .gas-content {
      height: 320px;
      .f17;
    }

    .pick-list {
      padding: 5px;

      .pick-item {
        display: inline-block;
        vertical-align: middle;
        width: 33.33%;
        padding: 6px;
      }
    }

    .gas-item {
      border-radius: 4px;
      height: 60px;
      padding: 0 10px;
      color: #333;
      line-height: 1.2;
      .f10;
      background-color: #EDEDED;
      text-align: center;

      .gun-info {
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
      }

      .gun-name {
        white-space: nowrap;
        .f10;

        i {
          font-weight: bold;
          font-size: 24px;
        }

      }

      .gas-name {
        white-space: nowrap;
        .ellipsis(100%);
      }

      p {
        &:first-of-type {
          font-size: 18px;
        }
      }

      // 对接油机,无订单
      &.disabled {
        opacity: .45;
        touch-action: none;
      }

      &.disabled,
      &.normal {
        .gun-name {
          color: #07C160;
          margin-bottom: 5px;
        }
      }

      // 未对接油机
      &.normal {
        background-color: #EDEDED;
      }

      // 选中的,无论是否对接油机
      &.picked {
        background-color: #06A853;
        color: #fff;
      }

      /*对接了油机,有订单的*/

      &.active {
        background-color: #07C160;
        color: #fff;

        .gun-info {
          height: auto;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          line-height: 1;
          padding-top: 5px;

          .gas-name {
            opacity: .8;
            line-height: 14px;
            vertical-align: middle;
            text-align: right;
            width: 6em;

            &:after {
              border-width: 1px; /*px*/
              border-radius: 2px;
            }
          }
        }
      }
    }

    .roll-wrap {
      overflow: hidden;
      height: 50px;
      margin-top: 8px;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      opacity: .8;

      .order_price {
        font-size: 14px;

        &:before {
          content: '￥';
          font-size: 10px;
        }
      }

      .order_time {
      }
    }

  }
</style>
