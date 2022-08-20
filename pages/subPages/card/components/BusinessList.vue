<template>
	<view class="business-list" :class="{'is-rounded': isRounded}">
		<view v-for="(item,index) in list" :key="item.id" class="business-item" @click="$emit('on-item-click',item,index)">
			<view class="business-card">
				<view class="business-card__left">
					<image class="business-card__img" :src="item.imgUrl" mode="aspectFill"></image>
				</view>
				<view class="business-card__center">
					
				</view>
				<view class="business-card__content">
					<view class="business-card__row">
						<view class="business-card__title">{{item.title}}</view>
						<view v-if="item.statusStr" class="business-card__status" :class="item.statusClass">{{item.statusStr}}</view>
					</view>
					<view class="business-card__row">
						<view class="business-card__text">{{item.address}}</view><view class="business-card__distance">{{item.distanceStr}}</view>
					</view>
					<view class="business-card__row" style="margin-top: auto;">
						<button class="business-card__footer__btn btn-normal" @click.stop="handleBtnPhoneClick({phone:item.phone})">
							<image class="business-card__footer__img" src="../static/images/icon-make-phone.png" mode=""></image>拨打电话
						</button>
						<view class="business-card__footer__spacer"></view>
						<button class="business-card__footer__btn btn-normal" @click.stop="handleBtnMapNavClick({latitude:item.latitude,longitude:item.longitude,name: item.addressName,address:item.address})">
							<image class="business-card__footer__img" src="../static/images/icon-location.png"></image>地址导航
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	export default {
		props: {
			isRounded: {
				type: Boolean,
				default: false
			},
			list: {
				type: Array,
				default () {
					// return [{
					// 		id: '121212',
					// 		imgUrl: 'http://placekitten.com/200/100',
					// 		title: '某某洗车行某某洗车行某某洗车行某某洗车行',
					// 		// 距离
					// 		distanceStr: '500m',
					// 		// 电话
					// 		phone: '14700000000',
					// 		// 经纬度
					// 		latitude: 10,
					// 		longitude: 10,
					// 		// 地址名称
					// 		addressName: '你好',
					// 		// 详细地址
					// 		address: '你好详细覅值'
					// 	}
					// ]
					return []
				}
			}
		},
		methods: {
			// 商家列表拨打电话按钮点击事件
			handleBtnPhoneClick({
				phone
			} = {}) {
				// 参数检查
				if (!phone) {
					uni.showToast({
						icon: 'none',
						title: '电话号码为空'
					})
					return
				}
				// 正常拨打流程
				uni.makePhoneCall({
					phoneNumber: phone,
					fail(err) {
						console.log(err)
					}
				})
			},
			// 商家列表导航按钮点击事件
			handleBtnMapNavClick({
				name,
				address,
				latitude,
				longitude
			} = {}) {
				console.log({
					name,
					address,
					latitude,
					longitude
				})
				App.openLocation({
					name,
					address,
					latitude: +latitude,
					longitude: +longitude
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.business-list {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		margin: 0 auto;
	}
	
	.business-item + .business-item {
		margin-top: 20rpx;
	}

	.business-card {
		display: flex;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0px 2rpx 12rpx rgba(204, 204, 204, 0.16);
	}
	
	.business-card__content {
		display: flex;
		flex-direction: column;
		min-width: 0;
		margin-left: 30rpx;
		flex: 1;
	}
	
	.business-card__img {
		width: 160rpx;
		height: 160rpx;
		border-radius: 6rpx;
	}
	
	.business-card__row {
		display: flex;
		align-items: center;
		min-width: 0;
		flex: 1;
		&+& {
			margin-top: 12rpx;
		}
	}

	.business-card__title {
		min-width: 0;
		flex: 1;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.business-card__status {
		flex-shrink: 0;
		box-sizing: border-box;
		height: 30rpx;
		padding: 0 10rpx;
		margin-left: auto;
		line-height: 30rpx;
		font-weight: normal;
		font-size: 20rpx;
		color: #333;
		border-radius: 9999rpx;
		background-color:var(--theme-color, #FFD940);
		&.is-disabled {
			color: #999;
			background-color: #EEEEEE;
		}
	}

	.business-card__text {
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.business-card__distance {
		max-width: 150rpx;
		margin-left: auto;
		font-size: 24rpx;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex-shrink: 0;
		text-align: rigth;
	}

	.business-card__footer__btn {
		flex: 1;
		text-align: center;
		font-size: 24rpx;
		color: #333;

		.iconfont {
			margin-right: 8rpx;
			font-size: 24rpx;
		}
	}

	.business-card__footer__spacer {
		width: 1px;
		height: 30rpx;
		background-color: #eee;
	}
	.business-card__footer__img {
		width: 24rpx;
		height: 24rpx;
		margin-right: 20rpx;
	}
</style>
