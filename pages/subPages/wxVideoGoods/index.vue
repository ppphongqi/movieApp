<template>
	<view class="page-clock-setting app-clearfix">
		
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	export default {
		data() {
			return {
				options: {},
			}
		},
		async onLoad(options) {
			this.options = options
			try {
				await this.mainMixin_BeforeFetchPageData()
				await this.doPay()
				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
				// TODO handle the exception
			}
		},
		async onShow() {
			
		},
		created() {
		},
		methods: {
			async doPay() {
				try {
					const res = await App._postP('sappvideo.Index/apiSappVideoOrderPay', {})
					wx.requestOrderPayment(res.data && res.data.payment_params)
				} catch (e) {
					console.log('fetchCardCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-clock-setting {
		min-height: 100vh;
		background-color: #F8F8F8;
	}
</style>
