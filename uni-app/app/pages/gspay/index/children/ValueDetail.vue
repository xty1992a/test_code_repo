<template>
  <div
          class="value-detail"
          v-if="
      pickedItem &&
        JSON.stringify(pickedItem) !== '{}' &&
        pickedItem.addValueRuleInfo
    "
  >

<!--    <Scroll style="max-height:2.93rem">-->
      <div>
        <template
                v-if="
        pickedItem.giftType !== 5 &&
          (pickedItem.sendGameDesc ||
            pickedItem.pointPlus > 0 ||
            pickedItem.addValueRuleInfo ||
            pickedItem.sendCouponDesc ||
            pickedItem.sendGiftCountDesc)
      "
        >
          <div class="detail-item" v-if="pickedItem.addValueRuleInfo">
            <svg-icon icon="recharge"/>
            <span>{{ pickedItem.addValueRuleInfo }}</span>
          </div>
          <div class="detail-item" v-if="pickedItem.sendCouponDesc">
            <svg-icon icon="ticket"/>
            <span>{{ pickedItem.sendCouponDesc }}</span>
            <p
                    v-for="(item, index) in pickedItem.couponDetailList"
                    :key="item.item1"
            >
              <span>{{ item.item1 }}</span>
              <span class="count">&times;{{ item.item2 }}</span>
            </p>
          </div>
          <div class="detail-item" v-if="pickedItem.sendGiftCountDesc">
            <svg-icon icon="ticket"/>
            <span>{{ pickedItem.sendGiftCountDesc }}</span>
            <p
                    v-for="(item, index) in pickedItem.giftCountList"
                    :key="item.goodsItemGuid"
            >
              <span>{{ item.goodsName }}</span>
              <span class="count">&times;{{ item.count }}</span>
            </p>
          </div>
          <div class="detail-item" v-if="pickedItem.pointPlus > 0">
            <svg-icon icon="integration"/>
            <span>赠送{{ pickedItem.pointPlus }}积分</span>
          </div>
          <div class="detail-item" v-if="pickedItem.sendGameDesc">
            <svg-icon icon="reward"/>
            <span>{{ pickedItem.sendGameDesc }}</span>
          </div>
        </template>
        <!--gas-->
        <template
                v-if="
        pickedItem.giftType === 5 &&
          pickedItem.oilDecreaseDescList &&
          pickedItem.oilDecreaseDescList.length
      "
        >
          <div
                  v-for="desc in pickedItem.oilDecreaseDescList"
                  :key="desc.item1"
                  class="detail-item"
          >
            <svg-icon :icon="getIcon()"/>
            <span>{{ desc.item2 }}每升减{{ desc.item3 }}元</span>
          </div>
        </template>

        <template
                v-if="
        pickedItem.giftType === 8 &&
          pickedItem.lockOilPriceDescList &&
          pickedItem.lockOilPriceDescList.length
      "
        >
          <div
                  v-for="desc in pickedItem.lockOilPriceDescList"
                  :key="desc.item1"
                  class="detail-item"
          >
            <svg-icon :icon="getIcon()"/>
            <span>该笔储值消费{{desc.item2}}锁定油价{{desc.item3}}元</span>
          </div>
        </template>
      </div>

<!--    </Scroll>-->
  </div>
</template>

<script>
  // import Scroll from 'components/scroll';

  export default {
	name: "ValueDetail",
	components: {/*Scroll*/},
	data() {
	  return {};
	},
	created() {
	},
	methods: {
	  getIcon() {
		let icons = ["petrol", "diesel", "gas"];
		var index = Math.floor(Math.random() * 3);
		return icons[index];
	  }
	},
	computed: {},
	props: {
	  pickedItem: {
		type: Object,
		default: null
	  }
	}
  };
</script>

<style lang="less" rel="stylesheet/less">
  .value-detail {
    margin-top: 10px;
    background-color: #fff7ec;
    padding: 10px 10px 10px;
    text-align: left;
    font-size: 11px;
    border-radius: 4px;

    .detail-item {
      padding-left: 30px;
      position: relative;
      line-height: 1.6;

      &:not(:last-child) {
        margin-bottom: 5px;
      }

      svg {
        color: #ff9800;
        position: absolute;
        left: 5px;
        top: 0;
        font-size: 18px;
      }

      span {
        line-height: 1.4;
        font-weight: 500;
      }

      p {
        line-height: 1.4;
        font-size: 12px;
        color: #333;
      }

      .count {
        float: right;
        margin-right: 15px;
      }
    }

    .send-item {
      position: relative;
      padding-left: 20px;

      &:not(:last-child) {
        margin-bottom: 6px;
      }

      svg {
        position: absolute;
        left: 0;
        top: 2px;
        font-size: 14px;
        color: #ff9800;
        fill: #ff9800;
      }

      p {
        line-height: 1.4;
      }
    }

    .coupons {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      p {
        width: 40%;
        overflow: hidden;

        span:last-of-type {
          float: right;
        }
      }
    }
  }
</style>
