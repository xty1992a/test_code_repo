<template>
  <view class="index">
    <text>详情页面</text>
    <Counter v-model="count" />

    <button @tap="roll">随机</button>
  </view>
</template>

<script>
import Counter from "../../components/Counter";
export default {
  components: {
    Counter,
  },
  data() {
    return {};
  },

  computed: {
    count: {
      get() {
        return this.$store.state.count;
      },
      set(v) {
        this.$store.commit("SET_COUNT", v);
      },
    },
  },

  methods: {
    roll() {
      this.$store.dispatch("rollCount");
    },
  },
};
</script>

<style lang="less" rel="stylesheet/less"></style>
