<template>
	<view class="appointmentDetailsCard">
		<!-- header -->
		<view class="appointmentDetailsCard__header app-flex app-flex--align-center">
			<view class="app-flex-item app-flex-item--shrink-0">
				<image class="appointmentDetailsCard__logo" :src="logo" mode="aspectFill"></image>
			</view>
			<view class="app-flex-item app-flex-item--1 f-24 col-0">
				{{title}}
			</view>
			<view class="app-flex-item app-flex-item--shrink-0">
				<image class="appointmentDetailsCard__btn-go" src="../static/images/icon-map.png" mode=""
					@click="storeLocation(location)"></image>
			</view>
			<view class="app-flex-item app-flex-item--shrink-0">
				<image class="appointmentDetailsCard__btn-go" src="../static/images/icon-buy.png" mode=""
					@click="navigationTo('pages/subPages/payOnline/index?id='+payId)"></image>
			</view>
		</view>
		<!-- header -->
		<!-- content -->
		<view class="m-top20 appointmentDetailsCard__content">
			<view class="m-top20 f-32 f-bold col-3">{{desc}}</view>
			<view class="m-top20 f-26 col-9">日期：{{time}}</view>
			<view class="m-top20 f-26 col-9">人数：{{num}}</view>
		</view>
		<!-- content end -->
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	export default {
		name: 'appointmentDetailsCard',
		props: {
			// 店铺logo
			logo: {
				type: String,
				default: ''
			},
			// 标题
			title: {
				type: String,
				default: '',
			},
			// 描述
			desc: {
				type: String,
				default: '',
			},
			// 日期
			time: {
				type: String,
				default: '',
			},
			// 人数
			num: {
				type: String,
				default: '',
			},
			// 导航信息
			location: {
				type: Object,
				default () {
					return {
						name: '',
						address: '',
						longitude: 116,
						latitude: 39,
					}
				}
			},
			// 在线买单id
			payId: {
				type: String,
				default: '',
			}
		},
		methods: {
			/**
			 * 查看门店地址
			 */
			storeLocation({
				latitude,
				longitude,
				name,
				address
			}) {
				App.openLocation({
					name,
					address,
					latitude: +latitude,
					longitude: +longitude,
					success() {
						console.log('success');
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.appointmentDetailsCard {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		padding: 30rpx;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.appointmentDetailsCard__header {
		box-sizing: border-box;
		padding: 20rpx;
		background-color: #F8F8F8;
		border-radius: 20rpx;
	}

	.appointmentDetailsCard__logo {
		width: 50rpx;
		height: 50rpx;
		border-radius: 100%;
	}

	.appointmentDetailsCard__btn-go {
		width: 60rpx;
		height: 60rpx;
	}
</style>
