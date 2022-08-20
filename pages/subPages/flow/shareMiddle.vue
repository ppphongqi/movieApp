<template>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				options: {
					// 订单id
					order_id: '',
					// 商品id
					goods_id: '',
					// 分享人id
					referee_id: '',
					// 奖励id
					reward_type: '',
					// 支付成功页面路径（带完整参数）decodeURIComponent两次
					pagePaymentSuccessfulPage: ''
				}
			}
		},
		onLoad(options) {
			this.options = options
		},
		async onShow() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				await this.jump()
				
			} catch (err) {

			}
		},
		methods: {
			/**
			 * 跳转到其他页面
			 * 1.如果打开别人分享的页面 则直接跳转到商品详情页
			 * 2.打开自己的分享页面 跳转到pagePaymentSuccessfulPage
			 */
			async jump() {
				try {
					// 分享成功打点
					await App._postP('paymarketing.Index/isShare',{
						order_id: this.options.order_id,
						reward_type: this.options.reward_type,
						referee_id: this.options.referee_id,
					})
					// 如果自己打开自己的链接
					if(this.options.referee_id == this.mainMixin_userInfo.user_id) {
						console.log('打开自己的链接')
						App.navigationTo({
							url: decodeURIComponent(decodeURIComponent(this.options.pagePaymentSuccessfulPage)),
							redirectTo: true
						})
					}else {
						console.log('打开别人的链接')
						App.navigationTo({
							url: 'pages/subPages/goods/index/index?' + App.urlEncode({
								goods_id: this.options.goods_id,
								redirectTo: true
							})
						})
					}
				}catch(err) {
					console.log('jump',err)
				}
			}
		}
	}
</script>

<style>
</style>
