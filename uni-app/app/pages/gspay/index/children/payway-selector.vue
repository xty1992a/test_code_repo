<template>
  <div class="payway-selector">
    <h3 class="pay-head" @click="$emit('close')">
      <i class="iconfont icon-xiangzuojiantou"></i>
      <span>支付方式</span>
    </h3>
    <div class="payway-body">
<!--      <scroller :data="list">-->
        <ul class="type-list">
          <li
            v-for="item in list"
            @click="checkItem(item)"
            v-if="item.enabled"
            class="payway-item panel"
            :class="item.cls"
          >
            <div class="left">
              <i v-if="item.icon" class="iconfont" :class="item.icon"></i>
              <img v-if="item.img" :src="item.img" />
              <span class="text">{{item.text}}</span>
            </div>
            <div class="right" :class="{checked:value===item.type}">
              <i class="iconfont icon-icon_xuanzhong1"></i>
            </div>
          </li>
        </ul>
<!--      </scroller>-->
    </div>
  </div>
</template>

<script>
// import Scroller from "components/scroll";

const paytypes = {
  ali: 1,
  wecaht: 2,
  value: 4,
  point: 8,
  cash: 16,
  bankcard: 32,
  coupon: 64,
  best: 512,
  credit: 1024
};
export default {
  name: "payway-selector",
  components: { /*Scroller*/ },
  data() {
    return {
      checked: false
    };
  },
  methods: {
    hasPayType(type) {
      return (this.payType & type) !== 0;
    },
    checkItem(item) {
      console.log(1111, item);
      this.$emit("close");
      this.$emit("input", item.type);
    },
    shouldShow() {
      return this.list.filter(x => x.enabled).length > 1;
    }
  },
  computed: {
    eanbleWechat() {
      return this.deviceType === 1 && this.hasPayType(paytypes.wecaht);
    },
    enableAli() {
      return this.deviceType === 2 && this.hasPayType(paytypes.ali);
    },
    enableCash() {
      return this.hasPayType(paytypes.cash) && this.isMember;
    },
    enableCard() {
      return this.hasPayType(paytypes.bankcard) && this.isMember;
    },
    enableredit() {
      return this.hasPayType(paytypes.credit) && this.isMember;
    },
    list() {
      return [
        {
          type: paytypes.wecaht,
          icon: "icon-zizhumaidanweixinzhifu",
          text: "微信支付",
          enabled: this.eanbleWechat,
          cls: "wechat"
        },
        {
          type: paytypes.ali,
          icon: "icon-zizhumaidanzhifubao",
          text: "支付宝支付",
          enabled: this.enableAli,
          cls: "alipay"
        },
        {
          type: paytypes.cash,
          icon: "icon-zizhumaidanxianjinzhifu",
          text: "现金支付",
          enabled: this.enableCash && this.enableMemberPay,
          cls: "currency"
        },
        {
          type: paytypes.bankcard,
          icon: "icon-zizhumaidanxianjinzhifu",
          text: "银行卡支付",
          enabled: this.enableCard && this.enableMemberPay,
          cls: "card"
        },
        {
          type: paytypes.credit,
          icon: "",
          text: "分期支付",
          img: "/static/pictures/upay/fenqi_pay.png",
          enabled: this.enableredit,
          cls: "creditPay"
        }
      ];
    }
  },
  props: {
    payType: {
      type: Number,
      default: 0
    },
    deviceType: {
      type: Number,
      default: 3
    },
    isMember: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: 0
    },
    enableMemberPay: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    payType: {
      handler(now) {
        //默认第一个
        var item = this.list.find(x => x.enabled);
        if (item) {
          this.$emit("input", item.type);
        }
      }
    },
    list() {
      var item = this.list.find(x => x.enabled);
      if (item) {
        this.$emit("input", item.type);
      } else {
        this.$emit("input", 0);
      }
      this.$emit("listChange", this.list);
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@gayC: #999;
@borderC: #f0f0f0;
@normalC: #333;
@priceC: #fe9700;
@warmC: #ff9801;
@wxC: #01c10a;
@aliC: #29a1f7;
@unchoosed: #c7c7c7;
@linkC: #3685f0;
@backC: #f7f7f7;
@font-sm: 24px;
@font-sl: 28px;
@font-sx: 30px;
@font-lg: 32px;
.payway-selector {
  height: 100%;
  position: relative;

  .payway-body {
    position: absolute;
    bottom: 0;
    right: 0;
    top: 44px;
    left: 0;
  }

  .type-list {
    padding: 0 10px;

    .payway-item {
      &.disable {
        position: relative;

        .left {
          i {
            color: #999 !important;
          }
        }

        &:before {
          content: "";
          position: absolute;
          height: 100%;
          width: 100%;
          left: 0;
          top: 0;
        }
      }

      label {
        display: flex;
        height: 44px;
        justify-content: space-between;
        align-items: center;
      }

      &:not(:last-child) {
        border-bottom: 1px solid @borderC; /*px*/
      }

      .left {
        font-size: 30px; /*px*/
      }

      .right {
        i {
          font-size: 18px;
        }

        &.checked {
          i {
            color: @priceC;
          }
        }

        input {
          position: absolute;
          left: -99999px;

          &:checked {
            + i {
              color: @priceC;
            }
          }
        }
      }

      i {
        font-size: 18px;
        color: #c7c7c7;
        transition: 0.2s;

        &.active {
          color: @priceC;
        }
      }

      &.wechat {
        .left {
          i {
            color: @wxC;
          }
        }
      }

      &.currency {
        .left {
          i {
            color: @priceC;
          }
        }
      }

      &.alipay {
        .left {
          i {
            color: @aliC;
          }
        }
      }

      &.card {
        .left {
          i {
            color: @priceC;
          }
        }
      }

      &.creditPay {
        .left {
          img {
            height: 20px;
            width: 20px;
            transform: translateY(4px);
          }
        }
      }
    }
  }
}
</style>
