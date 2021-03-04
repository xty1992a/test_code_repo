<template>
  <div class="coupon">
    <div class="left">
      <p class="coupon-empty-p" v-if="!value&&!discount"></p>
      <p class="coupon-type">{{type}}</p>
      <p class="coupon-value" v-if="value">{{value}}</p>
      <p class="coupon-discount" v-if="discount">{{discount}}</p>
    </div>
    <div class="right">
      <p class="coupon-title">{{title}}</p>
      <p class="coupon-limit">
        <span class="limit" v-if="limit">{{limit}}</span>
        <span class="count" v-if="count">X{{count}}</span>
      </p>
      <p class="coupon-expire" v-if="expire">有效期: {{expire}}</p>
    </div>
  </div>
</template>

<script>
  export default {
	name: 'coupon',
	components: {},
	props: {
	  type: [String, Number],
	  value: [String, Number],
	  discount: [String, Number],
	  title: [String, Number],
	  limit: [String, Number],
	  count: [String, Number],
	  expire: [String, Number],
	},
	data () {
	  return {}
	},
	created() {
	},
	methods: {},
	computed: {}
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../../styles/variable";

  .coupon {
    display: flex;
    .round-icon(13px, #f7f7f7, 40px);
    .left {
      height: 80px;
      width: 80px;
      color: #fff;
      background-color: #ff6400;
      text-align: center;
      padding-top: 10px;
      .coupon-empty-p {
        margin-bottom: 15px;
      }
      .coupon-type {
        .f12;
        padding: 10px;
      }
      .coupon-value {
        font-size: 12px;
        &:before {
          content: '￥';
          .f14;
        }
      }
      .coupon-discount {
        font-size: 12px;
        &:after {
          .f14;
          content: '折';
        }
      }
    }
    .right {
      background-color: #fff;
      padding: 10px;
      flex: 1;
      .full-column(80px);
      .coupon-title {
        .f15;
        .ellipsis(250px);
        line-height: 1.2;
      }
      .coupon-limit {
        .limit {
          .f12;
          color: #ff6400;
          background-color: #ffeee3;
        }
        .count {
          float: right;
        }
      }
      .coupon-expire {
        .f12;
        color: #999;
      }
    }
  }
</style>
