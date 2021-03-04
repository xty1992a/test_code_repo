<template>
	<view class="container">
<!-- 		<view class="intro">本项目已包含uni ui组件，无需import和注册，可直接使用。在代码区键入字母u，即可通过代码助手列出所有可用组件。光标置于组件名称处按F1，即可查看组件文档。</view>
		<text class="intro">详见：</text>
		<uni-link :href="href" :text="href"></uni-link>
		<view v-html="text"></view> -->
		<view class="list">
			<view class="item" v-for="it in list" :key="it">
<!--				<uni-card :title="'card-item__'+it" -->
<!--				thumbnail="https://files.1card1.cn/VipCloudSite/198543/20200331/413749cf8c874a13965b20b3296b70ae.jpeg"-->
<!--				extra="uni-card组件,看看你会在哪儿" -->
<!--				is-shadow -->
<!--				note="项目 'app' 编译成功。前端运行日志，请另行在小程序开发工具的控制台查看"-->
<!--				mode="style"-->
<!--				/>-->
			</view>
		</view>
	</view>
</template>

<script>
	const sleep = (t) => new Promise(r => setTimeout(r, t))
	export default {
		data() {
			return {
				href: 'https://uniapp.dcloud.io/component/README?id=uniui',
				text: '<span>hello world</span>',
				query: {
					pageIndex: 0,
					pageSize: 10
				}
			}
		},
		computed: {
			list() {
				return this.$store.state.list
			}
		},
		methods: {
			async getList() {
				const result = await this.$store.dispatch('getList', this.query)
				if(!result.success) return
				this.query.pageIndex++
				console.log('reach bottom', this.list.length)
			}
		},

		async created() {
			await this.getList()
			await this.getList()
			// #ifdef H5
			await this.getList()
			// #endif
		},

		onReachBottom() {
			this.getList()
		}
	}
</script>

<style lang="less" type="stylesheet/less">
	.container {
		font-size: 14px;
		.list{
			.item{
				//padding: 10px 15px;
				//border-bottom: 1px solid #E5E5E5;
				.uni-card{
					box-shadow: 0 0 10px rgba(0,0,0,0.05);
				}
			}
		}
	}
</style>
