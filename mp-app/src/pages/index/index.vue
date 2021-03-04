<template>
  <view class="index">
    <text>{{ msg }}</text>
    <view>
      <text>{{ count }}</text>
    </view>
    <view>
      <button @tap="toDetail">查看详情</button>
    </view>
    <AtIcon value="clock" size="30" color="#F00"></AtIcon>
    <AtButton>按钮文案</AtButton>
  </view>
</template>

<script>
import { mapState } from "vuex";
import Taro from "@tarojs/taro";
export default {
  data() {
    return {
      msg: "Hello world!",
    };
  },
  computed: {
    ...mapState(["count"]),
  },
  methods: {
    toDetail() {
      console.log("to detail");
      Taro.switchTab({
        url: "/pages/detail/index",
      })
        .then(console.log)
        .catch(console.log);
    },
  },

  created() {
    console.log(this.$api.get());
  },
};
</script>

<style lang="less" rel="stylesheet/less"></style>
