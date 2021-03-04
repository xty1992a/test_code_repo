<template>
  <ul class="row-list">
    <li class="item" v-for="item in list" v-if="item.value">
      <div class="text" :class="item.colors[0]">{{item.text}}</div>
      <div class="num" :class="item.colors[1]">
        <template v-if="!isPrice(item)">{{item.value}}</template>
        <template v-if="isPrice(item)">{{item.plus ? (item.plus === 2 ? '-' : '+') : ''}}<!--
        -->
          <p class="text" v-if="item.wayId===4">X {{item.value}}</p>
<!--          <price :price="item.value"-->
<!--                 :intH="30"-->
<!--                 :floatH="30"-->
<!--                 :color="item.colors?item.colors[1]?'#FFB257':'#333':'#333'"-->
<!--                 :isPrice="false"-->
<!--                 v-else></price>-->
          <span>{{item.value}}</span>
        </template>
      </div>
    </li>
    <slot></slot>
  </ul>
</template>

<script>
  // import Price from '../../../components/price'

  export default {
    name: 'row-list',
    // components: {Price},
    props: {
      list: {
        type: Array
      }
    },
    methods: {
      isPrice(item) {
        return item.hasOwnProperty('plus')
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../../styles/variable";

  .row-list {
    .item {
      .li(40px, #fff);
      padding-left: 10px;
    }
  }

  .orange {
    color: #FFB257;
  }

  .lightC {
    color: #576B95;
  }
</style>
