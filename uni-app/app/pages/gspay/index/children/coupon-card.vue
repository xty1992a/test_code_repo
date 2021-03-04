<template>
  <div class="coupon-card">
    <div :class="labelCLS">
      <p class="label-text">{{label}}</p>
      <p class="coupon-value">{{couponValue}}</p>
      <p class="coupon-count" v-if="data.couponType===2">{{data.enableCount}}可用</p>
    </div>
    <div class="coupon-desc">
      <p class="coupon-name">
        <span class="name-text">{{data.title}}</span>
        <span class="name-count" v-if="data.couponType === 2">x{{data.number}}</span>
      </p>
      <p class="coupon-limit">
        <span>每满{{data.minConsumeValue}}元可用</span>
      </p>
      <p class="coupon-expire">有效期：{{data.endDate}}</p>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import "../js/math";
export default {
  name: "",
  components: {},
  props: {
    data: {
      type: Object,
      required: true
    },
    index: {
      type: Number
    }
  },
  data() {
    return {};
  },
  created() {},
  computed: {
    label() {
      return this.data.couponType === 3 ? "折扣券" : "代金券";
    },
    labelCLS() {
      let type = this.data.couponType === 3 ? "zkq" : "djq";
      const map = ["blue", "orange", "green", "red"];
      let color = "coupon-" + map[this.index % map.length || 0];
      return ["card-label", type + "-card", color].join(" ");
    },
    couponValue() {
      if (this.data.couponType === 3) {
        return Math.mult(this.data.couponValue, 10);
      }
      return this.data.couponValue;
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less">
@import "../../../../styles/modules/bgColor";

@baseC: #fa9500;
@priceC: #ff6400;
// region coupon-colors
.coupon-blue when (@gradient) {
  background-image: linear-gradient(to left top, #3dadfd, #3dc9fd);
}

.coupon-orange when (@gradient) {
  background-image: linear-gradient(to left top, #ff861d, #ffb000);
}

.coupon-green when (@gradient) {
  background-image: linear-gradient(to left top, #66c07b, #75c066);
}

.coupon-red when (@gradient) {
  background-image: linear-gradient(to left top, #ff7160, #ff8758);
}

// endregion

// region font-size
.fz(@size) {
  font-size: 2px * @size; /*px*/
}

.f12() {
  .fz(12);
}

.f14() {
  .fz(14);
}

.f15() {
  .fz(15);
}

.f16() {
  .fz(16);
}

.f17() {
  .fz(17);
}

// endregion

// region mixins
.shadow(@val: 0 0 10px rgba(0,0,0,0.1)) {
  background-color: #fff;
  box-shadow: @val;
}

.drop-shadow() {
  background-image: radial-gradient(transparent 0, transparent 8px, #fff 8px);
  background-size: 50% 50%;
  background-repeat: repeat-x;
  background-position: -50px 0;
  filter: drop-shadow(2px 0 8px rgba(0, 0, 0, 0.1));
}

.line-dot() {
  &:after {
    content: "";
    font-size: 10px;
    position: absolute;
    background-image: radial-gradient(#fff 0, #fff 0.4em, transparent 0.4em);
    background-repeat: repeat-y;
    background-size: 1.4em 1.4em;
    width: 1.4em;
    bottom: 0;
    right: -0.7em;
    top: 0;
  }
}

.ellipsis(@w:auto) {
  width: @w;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}

.full-column(@h: 50px) {
  display: flex;
  height: @h;
  justify-content: space-between;
  flex-direction: column;
  p {
    line-height: 1.1;
  }
}

// endregion

.coupon-card {
  .f12;
  height: 100px;
  position: relative;
  padding-right: 14px;
  background-color: #fff;

  .card-label {
    box-sizing: border-box;
    position: absolute;
    text-align: center;
    padding-top: 23px;
    width: 100px;
    border-radius: 4px 0 0 4px;
    height: 100%;
    color: #fff;
    left: 0;
    top: 0;
    .line-dot;

    .label-text {
      margin-bottom: 8px;
    }

    .coupon-value {
      .fz(26);

      &:after {
        .f12;
      }
    }

    .coupon-count {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.1);
      line-height: 20px;
    }

    &.zkq-card {
      .coupon-value {
        &:after {
          content: "折";
        }
      }
    }

    &.djq-card {
      .label-text {
        margin-bottom: 5px;
      }

      .coupon-value {
        &:after {
          content: "元";
        }
      }
    }
  }

  .coupon-desc {
    padding-left: 110px;
    padding-top: 10px;
    .full-column(90px);
  }

  .coupon-name {
    white-space: nowrap;

    span {
      .ellipsis;
      display: inline-block;
      vertical-align: middle;
    }

    .name-text {
      .f15;
      width: 140px;
    }

    .name-count {
      text-align: right;
      color: #999;
      width: 60px;
      .f14;
    }
  }

  .coupon-limit {
    span {
      padding: 2px 10px;
      background-color: #fff7eb;
      color: #fe9700;
      display: inline-block;
    }
  }

  .coupon-expire {
    color: #999;
  }
}
</style>
