<template>
  <div class="task-panel panel">
    <div class="icon icon-1">
<!--      <svg-icon :icon="icon"/>-->
      <span>{{icon}}</span>
    </div>
    <p class="task-text" :style="data.taskType === 6?'margin-left: -100px;':''">{{data.taskTitle}}</p>
    <p class="task-award" v-if="data.taskType!=6">+{{data.point}}</p>
    <div class="btn-wrap">
      <btn :text="btnText" :class="isDone?'done':''" @tap="tapHandler"/>
    </div>
  </div>
</template>

<script>
  // import SvgIcon from 'components/SvgIcon'
  export default {
    name: 'task-panel',
    props: {
      data: {
        type: Object,
        required: true,
      }
    },
    // components: {SvgIcon},
    data() {
      return {}
    },
    methods: {
      tapHandler() {
        if (this.data.done) return
        this.$emit('tap', this.data)
      }
    },
    computed: {
      icon() {
        const map = ['', 'sign_in', 'personal', 'attention', 'connect', 'password', 'recommend', 'address']
        return map[this.data.taskType]
      },
      isDone() {
        return this.data.state === 3
      },
      btnText() {
        const map = ['', '去完成', '领取', '已完成']
        return map[this.data.state]
      },
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../styles/variable";

  .task-panel {
    height: 70px;
    padding: 0 10px;
    margin-bottom: 13px;
    .shadow;
    .br;
    .icon {
      svg {
        font-size: 25px;
      }
    }
    .task-text {
      width: 125px;
      padding-left: 5px;
      .f16;
    }
    .task-award {
      width: 100px;
      padding-left: 10px;
      .f18;
      color: @sunC;
      &:after {
        .f16;
        content: ' 积分';
        color: @normalC;
      }
    }
    .btn-wrap {
      height: 29px;
      width: 60px;
      button {
        border-radius: 15px;
        background: linear-gradient(to left, #FF7F21, #ff9700);
        border: 0;
        &.done {
          background: #D1D1D1;
        }
      }
    }
  }

</style>
