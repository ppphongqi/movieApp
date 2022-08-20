<template>
	<view class="page-mangopay">
		<!-- 主要内容 -->
		<view class="mangopay-card">
			<view class="mangopay-card__header">
				<view class="mangopay-card__title">{{cDetails.cinema_name}}</view>
				<view class="mangopay-card__subtitle">{{cDetails.cinema_addres}}</view>
			</view>
			<view class="mangopay-card__content">
				<!-- 简要信息 -->
				<view class="mangopay-poster">
					<view class="mangopay-poster__left">
						<view class="mangopay-poster__title">{{cDetails.film_name}}</view>
						<view class="mangopay-poster__subtitle">{{cDetails.show_version_type}} {{cDetails.ticket_num}}张</view>
					</view>
					<view class="mangopay-poster__right">
						<image class="mangopay-poster__img" :src="cDetails.film_img" mode="aspectFill"></image>
					</view>
				</view>
				<!-- 简要信息 end -->
				<!-- 座位信息 -->
				<view class="mangopay-seat">
					<view class="mangopay-seat__title">{{cDetails.time1}}</view>
					<view class="mangopay-seat__text">{{cDetails.hall_name}}</view>
				</view>
				<view class="mangopay-seat">
					<view class="mangopay-seat__title is-strong">{{cDetails.time2}}</view>
					<view class="mangopay-seat__text is-strong"><text v-for="item in cDetails.seat_data" :key="item.seat_id">{{item.position_seat}} </text></view>
				</view>
				<!-- 座位信息 end -->
				<!-- 分割线 -->
				<view style="margin: 0 -30rpx;">
					<view class="mangopay-card__line"></view>
				</view>
				<!-- 分割线 end -->
				<!-- 订单金额 -->
				<view class="mangopay-attr">
					<view class="mangopay-attr__title is-strong">订单金额</view>
					<view class="mangopay__price is-red">￥<text class="is-strong">{{cDetails.final_price}}</text></view>
				</view>
				<view class="mangopay-attr">
					<view class="mangopay-attr__title">电影票</view>
					<view class="mangopay-attr__text">{{cDetails.ticket_num}}张</view>
				</view>
				<view class="mangopay-attr">
					<view class="mangopay-attr__title">下单时间</view>
					<view class="mangopay-attr__text">{{cDetails.order_time}}</view>
				</view>
				<view class="mangopay-attr">
					<view class="mangopay-attr__title">订单号</view>
					<view class="mangopay-attr__text">{{cDetails.order_number}}</view>
				</view>
				<view class="mangopay-attr">
					<view class="mangopay-attr__title">手机号</view>
					<view class="mangopay-attr__text">{{cDetails.phone}}</view>
				</view>
				<!-- 订单金额  end -->
			</view>
		</view>
		<!-- 主要内容 end -->
		<!-- 底部悬浮 -->
		<view class="mangopay-footer app-container--safe-bottom">
			<view class="mangopay-footer__left">
				<view class="mangopay__price">应付：<text class="is-red">￥</text><text class="is-red is-strong">{{cDetails.final_price}}</text></view>
			</view>
			<view class="mangopay-footer__right">
				<button class="mangopay-btn-go btn-normal" @click="handleBtnConfirmClick">{{cDetails.btnGoText}}</button>
			</view>
		</view>
		<!-- 底部悬浮 end -->
		<!-- 订单支付组件 -->
		<order-pay ref="orderPay" @paySuccess="paySuccess" @payFail="payFail" />
		<!-- 订单支付组件 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import {dateFormat} from '../../common/js/date.js'
	import OrderPay from '@/components/template/OrderPayPopups.vue'
	export default {
		components: {
			OrderPay
		},
		data() {
			return {
				// options
				options: {
					// 订单号
					order_number: '',
					// token
					token: '',
					// 自动**座位
					auto_check_seat: '',
					// 支付失败后跳转的页面
					errorpg: '',
					// 支付成功后跳转的页面
					successpg: ''
				},
				// 详情的接口数据
				detailsRes: {},
			}
		},
		computed: {
			cDetails() {
				const btnGoTextMap = {
					'-1': '已退款',
					'0': '立即支付',
					'1': '已付款',
				}
				return {
					// 订单号
					order_number: this.detailsRes.order_number || '',
					// 付款状态 -1已退款 0未付款  1已付款
					pay_state: this.detailsRes.pay_state,
					// 付款按钮文字
					btnGoText: btnGoTextMap[this.detailsRes.pay_state],
					// 影院名称
					cinema_name: this.detailsRes.cinema_name || '',
					// 影院地址
					cinema_addres: this.detailsRes.cinema_addres || '',
					// 电影名称
					film_name: this.detailsRes.film_name || '',
					// 电影类型
					show_version_type: this.detailsRes.show_version_type || '',
					// 电影海报
					film_img: this.detailsRes.film_img || '',
					// 影厅名称
					hall_name: this.detailsRes.hall_name || '',
					// 座位信息
					seat_data: this.detailsRes.seat_data || [],
					// 订单金额
					final_price: this.detailsRes.final_price || '',
					// 票数
					ticket_num: this.detailsRes.ticket_num || '',
					// 手机号
					phone: this.detailsRes.phone || '',
					// 下单时间
					order_time: dateFormat(this.detailsRes.created_at),
					// 影片开始时间（年月日）
					time1: this.detailsRes.time1 || '',
					// 影片开始结束时间（小时分钟）
					time2: this.detailsRes.time2 || '',
				}
			},
			// 支付、算价的参数
			cPayParams() {
				return {
					
				}
			},
		},
		onLoad(options) {
			this.options = options
		},
		async onShow() {
			uni.setNavigationBarColor({
				frontColor: "#ffffff",
				backgroundColor: "#2A2A2A",
			});
			try {
				await this.mainMixin_BeforeFetchPageData()
				// 请求接口的详情数据
				await this.fetchDetailsRes()
				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
			}
		},
		methods: {
			// 提交订单按钮点击事件
			async handleBtnConfirmClick() {
				if (this.paying) {
					return
				}
				this.paying = true
				try {
					this.payOrder({
						order_number: this.options.order_number,
						movie_token: this.options.token,
						auto_check_seat: this.options.auto_check_seat,
						pay_from: 'mangopay'
					})
				} catch (e) {
					console.log('handleBtnConfirmClick', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 拉起支付
			payOrder(data = {}) {
				console.log('payOrder', data)
				this.$store.commit('orderPay', data)
				this.$refs.orderPay.onToggleList(() => {
					this.paying = false
				})
			},
			// 支付成功
			paySuccess() {
				console.log('paySuccess')
				this.paying = false
				// 跳转到支付成功页面
				// #ifdef MP
				App.navigationTo({
				    url: 'pages/mainPages/index/webview?link=' + encodeURIComponent(this.options.successpg),
					redirectTo: true
				})
				// #endif
			},
			// 支付失败
			payFail() {
				console.log('payFail')
				this.paying = false
				// 跳转到支付失败
				// #ifdef MP
				App.navigationTo({
				    url: 'pages/mainPages/index/webview?link=' + encodeURIComponent(this.options.errorpg),
					redirectTo: true
				})
				// #endif
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._postP('movie.Movie/movieOrderDetails', {
						order_number: this.options.order_number
					})
					this.detailsRes = this.$util.deepGet(res, 'data', {})
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-mangopay {
		min-height: 100vh;
		background-color: #2A2A2A;
		padding-top: 20rpx;
		padding-bottom: 200rpx;
	}
	.mangopay-poster__img {
		width: 110rpx;
		height: 148rpx;
		border-radius: 10rpx;
	}
	.mangopay-card {
		width: 690rpx;
		margin: 0 auto;
	}
	.mangopay-card__header {
		box-sizing: border-box;
		padding: 20rpx 30rpx 40rpx 30rpx;
		border-radius: 20rpx;
		background-color: #FFD940;
		border-radius: 20rpx 20rpx 0 0;
	}
	.mangopay-card__title {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}
	.mangopay-card__subtitle {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #333;
	}
	.mangopay-card__content {
		box-sizing: border-box;
		padding: 40rpx 30rpx;
		border-radius: 20rpx;
		background-color: #fff;
		margin-top: -20rpx;
	}
	.mangopay-poster {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.mangopay-poster__title {
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
	}
	.mangopay-poster__subtitle {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #333;
	}
	.mangopay-poster__right {
		margin-left: 16rpx;
	}
	.mangopay-seat {
		display: flex;
		align-items: center;
		margin-top: 10rpx;
	}
	.mangopay-seat__title {
		font-size: 24rpx;
		color: #999;
		width: 214rpx;
		&.is-strong {
			color: #333333;
			font-weight: bold;
		}
	}
	.mangopay-seat__text {
		font-size: 24rpx;
		color: #999;
		&.is-strong {
			color: #333333;
			font-weight: bold;
		}
	}
	.mangopay-attr {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;
	}
	.mangopay-attr__title {
		font-size: 24rpx;
		color: #999;
		&.is-strong {
			font-weight: bold;
			font-size: 32rpx;
			color: #333;
		}
	}
	.mangopay-attr__text {
		font-size: 24rpx;
		color: #333;
	}
	.mangopay__price {
		font-size: 24rpx;
		color: #333;
		&.is-red,.is-red {
			color: #FF4444;
		}
		&.is-strong,.is-strong {
			font-size: 36rpx;
			font-weight: bold;
		}
	}
	.mangopay-footer {
		box-sizing: border-box;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15rpx 30rpx;
		background-color: #fff;
		z-index: 2;
	}
	.mangopay-btn-go {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333;
		background-color: #FFD940;
		border-radius: 10rpx;
	}
	.mangopay-card__line {
		position: relative;
		width: 100%;
		height: 30rpx;
		background-image: linear-gradient(to right, #ccc 0%, #ccc 50%, transparent 50%);
		background-size: 8rpx 2rpx;
		background-repeat: repeat-x;
		background-position: 0 50%;
		margin: 20rpx auto;
		&::after,&::before {
			position: absolute;
			box-sizing: border-box;
			display: block;
			content: "\20";
			width: 30rpx;
			height: 30rpx;
			top: 0;
			left: 0;
			border-radius: 100%;
			background-color: #2A2A2A;
			transform: translateX(-50%);
		}
		&::after {
			left: initial;
			right: 0;
			transform: translateX(50%);
		}
	}
</style>
