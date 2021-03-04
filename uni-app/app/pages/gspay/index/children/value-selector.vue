<template>
  <div class="value-selector" v-if="list.length" :class="{'with-shadow':list.length>3}">
    <div class="scroll-wrap">
<!--      <scroll scroll-x ref="scroll" :should-set-width="false" tap>-->
        <ul class="value-list" :style="style">
          <li
            class="value-item"
            :class="{active:item.guid===value.guid}"
            v-for="item in list"
            @tap="checkItem(item, $event)"
            :key="item.guid"
          >
            <p class="add van-ellipsis">充{{item.valueAdd}}</p>
            <p class="plus van-ellipsis">{{item.subTitle}}</p>
            <i class="iconfont icon-xuanzhong1"></i>
          </li>
        </ul>
<!--      </scroll>-->
    </div>
  </div>
</template>

<script>
// import Scroll from "components/scroll";
export default {
  name: "value-selector",
  components: { /*Scroll*/ },
  props: {
    list: {
      type: Array,
      required: true
    },
    value: {
      type: Object,
      required: {}
    }
  },
  data() {
    return {
      checked: false,
    };
  },
  methods: {
    refresh() {
      this.$refs.scroll && this.$refs.scroll.refresh();
    },
    checkItem(item, e) {
      console.log(e)
      if (item.guid === this.value.guid) {
        this.$emit("input", {});
        this.$emit("addValueChange", {});
      } else {
        this.$emit("input", item);
        this.$emit("addValueChange", item);
      }
    }
  },
  computed: {
    style() {
      return  { width: this.list.length * 2.934 + "rem" };
    },

  },
  watch: {
    list() {
      this.refresh()
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less">
@import "../../../../styles/variable";

.value-selector {
  .panel {
    padding: 0 10px;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      width: 20px;
      height: 20px;
      background-color: #fff;
      left: 20px;
      top: 0;
      border: 1px solid #e5e5e5;
      border-left-width: 0;
      border-bottom-width: 0;
      transform: scale(0.5) translateY(-20px) rotateZ(-45deg);
    }
  }
  .scroll-wrap {
    height: 60px;
  }
  .value-list {
    white-space: nowrap;
    .value-item {
      width: 110px;
      height: 55px;
      position: relative;
      text-align: center;
      padding-right: 10px;
      padding-top: 8px;
      vertical-align: middle;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &:before {
        content: "";
        .br;
        position: absolute;
        left: 0;
        top: 0;
        right: 10px;
        bottom: 0;
        border: 1px solid #e5e5e5;
        background-color: #F7F7F7;
      }
      &.active {
        &:before {
          border-color: #FE9700;
          background-color: #FFF6EB;
        }
        .iconfont{
          color: #FE9700;
        }
      }
      p{
        position: relative;
      }
      .add {
        .f16;
        font-weight: 600;
        margin-bottom: 5px;
      }
      .plus {
        color: #666;
      }

      .iconfont{
        position: absolute;
        right: 10px;
        bottom: 0;
      }
    }
  }
  .val {
    padding: 5px 0 12px 10px;
    color: #fe5a00;
  }

  &.with-shadow{
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      right: 0;
      top: 0;
      width: 20px;
      box-shadow: -5px 0 10px 0 rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
