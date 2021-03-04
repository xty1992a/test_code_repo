<template>
  <div class="panel">
    <div class="avatar">
      <img :src="path" alt="avatar">
    </div>
    <p class="panel-text">{{text}}</p>
    <p class="panel-subtext">{{subtext}}</p>
    <div class="panel-right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
	name: 'panel',
	props: {
	  text: String,
	  subtext: String,
	  path: {
		type: String,
		default: '/static/pictures/shop.png'
	  },
	},
	components: {},
	data () {
	  return {}
	},
	methods: {},
	computed: {}
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../../styles/variable";

  .panel {
    padding: 17px 10px 17px 70px;
    background-color: #fff;
    .border;
    position: relative;
    .avatar {
      position: absolute;
      left: 10px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      top: 50%;
      transform: translateY(-50%);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .panel-text {
      .f15;
      margin-bottom: 13px;
    }
    .panel-subtext {
      .f12;
      color: @grayC;
    }
    .panel-right {
      position: absolute;
      transform: translateY(-50%);
      right: 10px;
      top: 50%;
    }
  }
</style>
