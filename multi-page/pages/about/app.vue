<template>
    <div class="app">
        <p>current time is {{time | date}}</p>
    </div>
</template>

<script>
import { fmt, sleep } from '@/utils'

export default {
  name: 'app',
  data() {
    return {
      time: new Date()
    }
  },
  filters: {
    date: v => fmt('YYYY-MM-DD HH:mm:ss')(v)
  },
  mounted() {
    this.timeStart()
  },
  methods: {
    async timeStart() {
      while (this.$el) {
        await sleep(1000)
        this.time = new Date()
      }
    }
  }
}
</script>