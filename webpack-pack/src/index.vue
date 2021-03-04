<template>
  <div class="app">
    <p>hello</p>
  </div>
</template>

<script>
  export default {
	name: 'app',
	props: {},
	components: {},
	data() {
	  return {};
	},
	async created() {
	  try {
		const module = await import('./module.js');
		await module.sleep(1000);
		console.log('created over 1000 ms');
	  } catch (e) {
		console.log('some thing error ', e);
	  }
	},
	methods: {},
	computed: {}
  };
</script>

<style lang="less" rel="stylesheet/less">

  .app {
    p {
      display: flex;
      font-size: 30px;
      color: #606669;
    }

  }
</style>
