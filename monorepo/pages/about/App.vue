<template>
  <div class="app">
    <div class="sloth"/>

    <div class="box">
      <div class="cell-1" v-for="i in 400" :key="i">
        <div class="cell-2"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
	name: "app",
	props: {},
	data() {
	  return {};
	},
	computed: {},
	methods: {},
	watch: {},
	created() {
	},
	mounted() {
	},
	beforeDestroy() {
	}
  };
</script>

<style lang="less" rel="stylesheet/less">

  @cell-width: 123px;
  @cell-height: 97px;

  @dark-color: #004056;
  @light-color: #C8FED4;

  @size: 20px;
  html {
    background-color: @dark-color;
  }

  .app {
    .sloth {
      width: @cell-width;
      height: 97px;
      background-repeat: no-repeat;
      background-image: url("https://files.1card1.cn/mps/0/20200521/783f7aabecc14791a9b00c7060eede48.jpg");
      animation: smile 1s infinite alternate steps(1, end);
    }

    .box {
      width: @size*20;
      height: @size*20;
      overflow: hidden;
    }
  }

  .cell-1 {
    width: @size;
    height: @size;
    float: left;
    background-color: @dark-color;

    .cell-2 {
      width: @size/ 2;
      height: @size/2;
      background-color: @light-color;
      animation-name: round;
      animation-iteration-count: infinite;
      animation-duration: 4s;
    }
  }

  .reverse-color(@val) {
    .cell-1:nth-child(40n+@{val}) {
      background-color: @light-color;

      .cell-2 {
        background-color: @dark-color;
      }
    }
  }

  each(range(1, 19, 2), {
    .reverse-color(@value);
  })

  each(range(22, 40, 2), {
    .reverse-color(@value);
  })

  .cell-1:nth-of-type(3n) .cell-2 {
    animation-delay: 0.1s;
  }

  each(range(20), {
    .cell-1:nth-child(20n+@{value}) {
      .cell-2 {
        animation-delay: @value / 20 * 1s;
      }
    }
  })



  @keyframes round {
    0% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(0,@size/2);
    }
    50% {
      transform: translate(@size/2,@size/2);
    }
    75% {
      transform: translate(@size/2, 0);
    }
  }

  .row(@i) when (@i < 6) {
    .col(@i, 0);
    .row(@i + 1)
  }

  .col(@i, @j) when (@j < 4) {
    .position(@i, @j);
    .col(@i, @j + 1);
  }

  .position(@i, @j) {
    @step: (@i * 4 + @j) * 4.16 * 1%;
    @{step} {
      background-position: -@cell-width * @j -@cell-height * @i;
    }
  }

  @keyframes smile {
    .row(0);
  }

</style>
