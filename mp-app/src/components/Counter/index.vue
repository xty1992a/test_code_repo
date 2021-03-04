<template>
  <view class="counter">
    <view class="btn" @tap="vValue--">-</view>
    <!--    <input v-model="vValue" type="text" @blur="onBlur" />-->
    <view class="text">{{ vValue }}</view>
    <view class="btn" @tap="vValue++">+</view>
  </view>
</template>

<script>
import { limit } from "../../utils";
export default {
  name: "Counter",
  components: {},
  props: {
    value: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      default: 100,
    },
    min: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  computed: {
    vValue: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", this.limit(v));
      },
    },
  },
  watch: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    limit(v) {
      return limit(this.min, this.max)(v);
    },

    onBlur(e) {
      this.$emit("input", this.limit(+e.detail.value));
    },
  },
};
</script>

<style lang="less" rel="stylesheet/less">
.counter {
  display: inline-flex;
  border: 1px solid #e5e5e5;
  line-height: 36px;
  text-align: center;
  .btn {
    width: 36px;
  }
  .text {
    width: 60px;
    border-left: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
  }
}
</style>
