<template>
  <div class="deal-head">
    <div class="top">
      <div class="icon">
        <img :src="checkImage(data.logo)" alt="">
      </div>
      <div class="name">{{data.name}}</div>
    </div>
    <div class="price-wrap" v-if="data.wayId != 4">
<!--      <price :price="data.price" :floatH="64" :intH="64" :color="'#333'"></price>-->
      <span>{{data.price}}</span>
    </div>
  </div>
</template>

<script>
  // import Price from '../price'

  export default {
    name: 'deal-head',
    // components: {Price},
    props: ['data'],
    created() {
    },
    methods: {},
    computed: {}
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../styles/variable";

  .deal-head {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    flex-direction: column;
    .top {
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        .br(50%);
        margin-right: 15px;
        height: 28px;
        width: 28px;
        overflow: hidden;
        img {
          max-height: 100%;
          max-width: 100%;
        }
      }
      .name {
        .f16;
      }
    }
    .price-wrap {
      .price {
        &:before {
          .fz(28px);
        }
      }
    }
  }
</style>
