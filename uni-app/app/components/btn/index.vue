<template>
  <button v-if="prev" v-tap.stop="{methods:btnTap}" :style="btnStyle" :class="type">{{text}}<!--
    -->
    <slot></slot>
  </button>
  <button v-else v-tap="{methods:btnTap}" :style="btnStyle" :class="type">{{text}}<!--
    -->
    <slot></slot>
  </button>
</template>

<script>
  const copy = o => JSON.parse(JSON.stringify(o))

  export default {
    name: 'btn',
    props: {
      styles: {
        type: Object,
        default() {
          return {}
        }
      },
      text: {
        type: String,
        default: '按钮'
      },
      prev: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: 'primary'
      },
      radius: {
        type: Number,
        default: 0
      },
      disable: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    methods: {
      btnTap(e) {
        if (this.disable) return
        this.$emit('tap', e)
      }
    },
    computed: {
      btnStyle() {
        let style = copy(this.styles)

        if (this.radius) style.borderRadius = this.radius + 'px'
        return style
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../styles/variable";

  button {
    .f15;
    width: 100%;
    height: 100%;
    color: @normalC;
    background-color: #fff;
    border: 1px solid @normalC; /*no*/
    &.primary {
      border-color: @activeC;
      background-color: @activeC;
      color: #fff;
    }
    &.transparent {
      border-color: transparent;
      background-color: transparent;
    }
    &.normal {
      border-color: #999;
      color: #666;
      background-color: #fff;
    }
    &._primary {
      background-color: #fff;
      border-color: @activeC;
      color: @activeC;
    }
    &.share {
      background-color: #FFC600;
      border-color: #FFC600;
      color: #A04C0E;
    }
    &.orange {
      background-color: #FF9800;
      border-color: #FF9800;
      color: #fff;
    }
    &._orange {
      background-color: #fff;
      border-color: #FF9800;
      color: #FF9800;
    }
    &.price {
      border-color: @priceC;
      background-color: @priceC;
      color: #fff;
    }
    &._price {
      border-color: @priceC;
      background-color: #fff;
      color: @priceC;
    }
    &.danger {
      border-color: @dangerC;
      background-color: @dangerC;
      color: #fff;
    }
    &.orangeRed {
      border-color: #F58C48;
      background-color: #F58C48;
      color: #fff;
    }
    &.disable {
      border-color: #dadada;
      background-color: #dadada;
      color: #fff;
    }
    &.gray {
      border-color: #CCCCCC;
      color: #fff;
      background-color: #CCCCCC;
    }
    &.babyBlue {
      border-color: #6C99E3;
      background-color: #6C99E3;
      color: #fff;
    }
    &.red {
      border-color: @wxC;
      color: @wxC;
      background-color: #fff;
    }
    &.empty-btn {
      border-color: #9C9C9C;
      background-color: #fff;
      color: #333;
    }
    &notSelect {
      border-color: #d6d5d6;
      color: @normalC;
      background-color: #fbfafc;
    }
  }
</style>
