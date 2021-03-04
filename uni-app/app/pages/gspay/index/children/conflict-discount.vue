<template>
  <div v-if="list.length" class="block conflict-discount">
    <h3 class="block-title text">以下优惠不可同享</h3>
    <div class="panel" @click="itemtap(item)" :class="item.typecls" v-for="item in list">
      <div class="left">
        <i class="iconfont" :class="item.icon" :style="{color:item.iconColor}"></i>
        <span class="text" v-if="item.type===1">
        {{item.result.title||item.text}}
      </span>
        <span class="text" v-if="item.type!==1">
        {{item.text}}
        <span v-if="item.type===2">(可用{{item.result.total}}张)</span>
      </span>
        <template v-if="item.type===0">
        </template>
        <template v-if="item.type===1&&item.description">
          <i @click.stop="actclick(item.description)" class="iconfont icon-yiwenhao" style="color: #999;"></i>
        </template>
        <template v-if="item.type===3">
          <span class="point-text" v-html="pointTip"></span>
          <i @click.stop="tipclick" class="iconfont  icon-yiwenhao" style="color: #999;"></i>
        </template>
        <template v-if="item.type===2">
          <span class="coupon-rect">已选{{item.result.count}}张</span>
        </template>
      </div>

      <div class="right">
        <span class="val">-</span>
        <span class="price">{{item.result.money}}</span>
        <i class="iconfont icon-icon_xuanzhong1" :class="{checked:item.checked}"></i>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
	name: "conflict-discount",
	props: {
	  list: {
		type: Array,
		default: []
	  },
	  parameter: {
		type: Object,
		default: {}
	  }
	},
	components: {},
	data() {
	  return {
		types: ["", "point", "coupon"]
	  };
	},
	methods: {
	  itemtap(item) {
		if (item.type === 3) {
		  let checkResut = item.result.checkResult;
		  if (checkResut && !checkResut.success) {
			return;
		  }
		}
		this.$emit("tap", item);
	  },
	  tipclick(item) {
		// this.$emit("tipclick", item);
		var maxmoney = this.parameter.discountParameter.paidMoneyMaxRate * 100;
		var tip = `${this.parameter.discountParameter.pointPerYuan}积分可抵一元,最高可抵订单金额${maxmoney}%`;
		this.$dialog._toast(tip);
	  },
	  actclick(description) {
		this.$dialog._toast(description);
	  },
	  formatStr(str) {
		let arr = str.split("");
		let text = "";
		arr.forEach(i => {
		  if (/\d/.test(i)) {
			text += '<i style="color:#f00">' + i + "</i>";
		  }
		  else {
			text += i;
		  }
		});
		return text;
	  }
	},
	computed: {
	  pointTip() {
		let pointItem = this.list.find(x => x.type === 3);
		if (!pointItem) {
		  return "";
		}
		let checkResult = pointItem.result.checkResult;
		if (checkResult) {
		  if (checkResult.type == 1) {
			return this.formatStr(
				`(满${
					this.parameter.discountParameter.canPaidPointForMemberPoint
					}积分可用，当前共${
					this.parameter.discountParameter.memberAvailablePoint
					}积分)`
			);
		  }
		  if (checkResult.type == 2) {
			return this.formatStr(
				`(满${
					this.parameter.discountParameter.canPaidPointForConsumeValue
					}元可用，本单不可用)`
			);
		  }
		}
		return `(可用${this.parameter.discountParameter.memberAvailablePoint}分)`;
	  }
	}
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../../styles/variable";

  .conflict-discount {
    .panel {
    }

    .text {
      min-height: 44px;
      font-size: 14px;
    }

    .point-text {
      color: @grayC;
      .f12;
    }

    .coupon-rect {
      line-height: 24px;
      border: 1px solid @sunC;
      padding: 0 8px;
      color: @sunC;
      .f12;
    }

    .right {
      .checked {
        color: #fe9700;
      }
    }
  }
</style>
