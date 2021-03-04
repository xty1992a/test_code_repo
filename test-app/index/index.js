const app = getApp()

Component({
  data: {
	options: [...Array(10).fill(0).map((n, i) => ({value: i, label: 'item-' + i}))],
	currentValue: 0
  },
  methods: {
	typeChange(item) {
	  this.setData({
		currentValue: item.detail.data.value
	  });
	}
  }
});
