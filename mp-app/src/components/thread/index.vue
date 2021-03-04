<template>
  <view class="thread" @tap="handleNavigate">
    <view class="info">
      <view>
        <image :src="member.avatar_large | url" class="avatar" />
      </view>
      <view class="middle">
        <view :class="usernameCls">
          {{ member.username }}
        </view>
        <view class="replies">
          <text class="mr10">{{ time }}</text>
          <text>评论 {{ replies }}</text>
        </view>
      </view>
      <view class="node">
        <text class="tag">{{ node.title }}</text>
      </view>
    </view>
    <text class="title">
      {{ title }}
    </text>
  </view>
</template>

<script>
import Vue from "vue";
import { eventCenter } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import { timeagoInst, Thread_DETAIL_NAVIGATE } from "../utils";
import "./thread.css";

export default {
  filters: {
    url(val) {
      return "https:" + val;
    },
  },
  props: [
    "title",
    "member",
    "last_modified",
    "replies",
    "node",
    "not_navi",
    "tid",
  ],
  computed: {
    time() {
      return timeagoInst.format(this.last_modified * 1000, "zh");
    },
    usernameCls() {
      return `author ${this.not_navi ? "bold" : ""}`;
    },
  },
  methods: {
    handleNavigate() {
      const { tid, not_navi } = this.$props;
      if (not_navi) {
        return;
      }
      eventCenter.trigger(Thread_DETAIL_NAVIGATE, this.$props);
      // 跳转到帖子详情
      Taro.navigateTo({
        url: "/pages/thread_detail/thread_detail",
      });
    },
  },
};
</script>
