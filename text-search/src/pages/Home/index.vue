<template>
  <div class="app">
    <h3>welcome use @redbuck/template</h3>
    <p>current time is {{time | date}}</p>
  </div>
</template>

<script>
  import {fmt} from '@/utils';

  export default {
	name: 'app',
	data() {
	  return {
		time: new Date()
	  };
	},
	filters: {
	  date: v => fmt('YYYY-MM-DD HH:mm:ss')(v)
	},
	created() {
	  this.timeStart();
	},
	methods: {
	  async timeStart() {
		while (this.$el) {
		  await this.$utils.sleep(1000);
		  this.time = new Date();
		}
	  }
	},
  };
</script>

<style>

  .app {
  }
</style>
