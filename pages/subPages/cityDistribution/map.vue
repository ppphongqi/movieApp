<template>
	<view class="page-cityDistributionMap">
		<!-- 顶部导航 -->
		<u-navbar :background="{ background: 'transparent' }" immersive is-fixed :border-bottom="false" title-color="#333333" />
		<!-- 顶部导航 end -->
		<!-- 地图wrapper -->
		<view class="page-cityDistributionMap__map-wrapper">
			<map class="page-cityDistributionMap__map" controls="" :markers="cMarkers" :include-points="cIncludePoints" />
		</view>
		<!-- 地图wrapper end -->
		<!-- 状态面板 -->
		<view class="distribution-card-wrapper app-container--safe-bottom">
			<view class="distribution-card">
				<view class="distribution-card__title">{{cDistributionData.title}}</view>
				<view v-if="cDistributionData.status" class="distribution-card__time">{{cDistributionData.timeStr}}</view>
				<button v-if="cDistributionData.btnReceivingVisible" class="distribution-card__btn-op btn-normal" @click="handleBtnConfirmClick">{{cDistributionData.btnText}}</button>
				<!-- 骑手信息 -->
				<view v-if="cDistributionData.riderVisible" class="rider-card">
					<view class="rider-card__left">
						<image class="rider-card__avatar" src="./static/images/img-rider-avatar.png"></image>
					</view>
					<view class="rider-card__center">
						<view class="rider-card__title">{{cDistributionData.riderName}}</view>
						<view class="rider-card__text">联系电话：{{cDistributionData.phone}}</view>
					</view>
					<view class="rider-card__right">
						<image class="rider-card__img-phone" src="./static/images/img-phone.png" @click="handleBtnPhoneClick"></image>
					</view>
				</view>
				<!-- 骑手信息 end -->
			</view>
		</view>
		<!-- 状态面板 end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import {
		dateFormat
	} from '@/common/js/date.js'
	export default {
		data() {
			return {
				// 页面查询参数
				options: {
					// 订单id
					order_id: ''
				},
				// 配送详情的接口数据
				detailsRes: {}
			}
		},
		onLoad(options) {
			this.options = options
			this.startFetchDetailsResTimer()
		},
		beforeDestroy() {
			this.endFetchDetailsResTimer()
		},
		computed: {
			// 格式化的配送信息
			cDistributionData() {
				const details = this.detailsRes || {}
				const time = dateFormat(details.add_time)
				let timeStr = `下单时间： ${dateFormat(details.add_time)}`
				if(['gotoed','completed'].includes(details.status)) {
					timeStr = `送达时间： ${dateFormat(details.goto_time)}`
				}
				let phone = details.mobile || ''
				if(details.type == 2) {
					phone = details.begin_phone || ''
				}
				let riderName = details.real_name || ''
				if(details.type == 2) {
					riderName = details.begin_username || ''
				}
				return {
					// 订单状态(loading = 待付款', cancel='订单已取消', payed='待接单',wait_to_shop='待到店', accepted='待取件', geted='待收件',gotoed= '待评价', completed='订单已完成)
					status: details.status,
					title: details.status_text || '',
					timeStr,
					btnText: '确认收货',
					riderName,
					phone,
					// 是否显示骑手信息
					riderVisible: ['wait_to_shop', 'accepted', 'geted'].includes(details.status),
					// 只有待评价的时候显示确认收货按钮
					btnReceivingVisible: details.status === 'gotoed'
				}
			},
			// 当前地图上的标记
			cMarkers() {
				const details = this.detailsRes || {}
				let distance = +(+details.width || 0).toFixed(3)
				if (distance < 1) {
					distance = `${distance*1000 }m`
				} else {
					distance = `${distance}km`
				}
				let latitude = +details.latitude
				let longitude = +details.longitude
				if(details.type == 2) {
					latitude = +details.begin_lat
					longitude = +details.begin_lng
				}
				// 骑手位置
				const riderMarker = {
					id: 'm1',
					width: 45,
					height: 45,
					latitude,
					longitude,
					iconPath: require('./static/images/img-motorcycle.png'),
					callout: {
						display: 'ALWAYS',
						content: `距离您${distance}`,
						padding: 10,
						borderRadius: 6
					}
				}
				// 收货点位置
				const receivingMarker = {
					id: 'm2',
					width: 36,
					height: 45,
					latitude: +details.end_lat,
					longitude: +details.end_lng,
					iconPath: require('./static/images/img-receiving-point.png'),
				}
				if (this.cDistributionData.riderVisible) {
					return [riderMarker, receivingMarker]
				} else {
					return [receivingMarker]
				}
			},
			// 缩放视野以包含所有给定的坐标点
			cIncludePoints() {
				const details = this.detailsRes || {}
				const riderPoint = {
					latitude: +details.latitude,
					longitude: +details.longitude,
				}
				const receivingPoint = {
					latitude: +details.end_lat,
					longitude: +details.end_lng,
				}
				return [riderPoint, receivingPoint].filter(item=>item.latitude && item.longitude)
			}
		},
		watch: {
			detailsRes(val = {}) {
				// 订单状态(loading = 待付款', cancel='订单已取消', payed='待接单',wait_to_shop='待到店', accepted='待取件', geted='待收件',gotoed= '待评价', completed='订单已完成)
				const status = val.status
				// 如果是这些状态就停止定时器
				if(['cancel','gotoed','completed'].includes(status)) {
					this.endFetchDetailsResTimer()
				}
			}
		},
		methods: {
			// 确认收货按钮点击事件
			async handleBtnConfirmClick() {
				const [error,res] = await uni.showModal({
					title: '请示',
					content: '确认收货'
				})
				if(!res.confirm) {
					return
				}
				uni.showLoading({
				    title: '请稍候',
				    mask: true
				})
				try{
					await App._postP('citydelivery.Index/confirmGoods',{
						order_id: this.options.order_id
					})
					await this.fetchDetailsRes()
					uni.hideLoading()
					uni.showToast({
					    title: '确认收货成功',
					    icon: 'none'
					})
				}catch(e){
					uni.hideLoading()
					//TODO handle the exception
				}
				
			},
			// 电话按钮点击事件
			handleBtnPhoneClick() {
				uni.makePhoneCall({
					phoneNumber: this.cDistributionData.phone
				});
			},
			// 开始轮询
			startFetchDetailsResTimer() {
				console.log('startFetchDetailsResTimer')
				if (this.fetchDetailsResTimer || !this.options.order_id) return
				this.fetchDetailsRes()
				this.fetchDetailsResTimer = setInterval(this.fetchDetailsRes, 10 * 1000)
			},
			// 结束轮询
			endFetchDetailsResTimer() {
				clearInterval(this.fetchDetailsResTimer)
				this.fetchDetailsResTimer = null
			},
			// 请求配送的接口数据
			async fetchDetailsRes() {
				console.log('fetchDetailsRes')
				try {
					const res = await App._postP('citydelivery.Index/getOrderDetailMap', {
						order_id: this.options.order_id
					})
					this.detailsRes = res.data || {}
				} catch (e) {
					console.log('fetchDetailsRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss">
	.page-cityDistributionMap {
		.u-navbar {
			.u-icon--right {
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 60rpx;
				width: 60rpx;
				color: #FFFFFF !important;
				background-color: rgba($color: #000000, $alpha: 0.5);
				border-radius: 50%;

				.u-icon__icon {
					color: #FFFFFF !important;
					font-size: 32rpx !important;
				}
			}
		}
	}
</style>
<style lang="scss" scoped>
	.page-cityDistributionMap__map-wrapper {
		width: 100vw;
		height: 100vh;
	}

	.page-cityDistributionMap__map {
		width: 100%;
		height: 100%;
	}

	// 状态面板
	.distribution-card-wrapper {
		box-sizing: border-box;
		position: fixed;
		left: 0;
		bottom: 30rpx;
		width: 100vw;
	}

	.distribution-card {
		box-sizing: border-box;
		width: 690rpx;
		margin: 0 auto;
		padding: 30rpx;
		background-color: #ffff;
		border-radius: 20rpx;
		z-index: 2;
	}

	.distribution-card__title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.distribution-card__time {
		margin-top: 20rpx;
		margin-bottom: 30rpx;
		font-size: 28rpx;
		color: #333;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
	}

	.distribution-card__btn-op {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 520rpx;
		height: 80rpx;
		margin: 30rpx auto;
		color: #333;
		font-size: 28rpcx;
		background-color: #FFD940;
		border-radius: 10rpx;
	}

	.rider-card__avatar {
		width: 94rpx;
		height: 94rpx;
		border-radius: 50%;
	}

	.rider-card {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding-top: 28rpx;
		border-top: 1px solid #EEEEEE;
	}

	.rider-card__center {
		min-width: 0;
		flex: 1;
		margin-left: 20rpx;
	}

	.rider-card__title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.rider-card__text {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.rider-card__right {
		margin-left: 20rpx;
	}

	.rider-card__img-phone {
		width: 70rpx;
		height: 70rpx;
	}

	// 状态面板 end
</style>
