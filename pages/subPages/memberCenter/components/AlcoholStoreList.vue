<template>
	<view class="AlcoholStoreList">
		<view v-for="(item,index) in list" :key="item.id" class="AlcoholStoreList-item">
			<!-- header -->
			<view class="AlcoholStoreList-item__header app-flex app-flex--align-center">
				<view class="app-flex-item app-flex-item--shrink-0">
					<image class="AlcoholStoreList-item__logo" :src="item.logo" mode="" @click="$emit('on-logo-click',item,index)"></image>
				</view>
				<view class="app-flex-item app-flex-item--1  app-flex app-flex--column">
					<view class="app-flex-item f-30 col-3 f-bold">{{item.name}}</view>
					<view class="app-flex-item app-flex-item--1  app-flex app-flex--align-center m-top10">
						<view class="app-flex-item app-flex-item--1 f-24 col-0 onelist-hidden">{{item.address}}</view>
						<view class="app-flex-item app-flex-item--shrink-0 f-24 col-0">{{item.distance}}</view>
					</view>
				</view>
				<view class="app-flex-item app-flex-item--shrink-0">
					<image class="AlcoholStoreList-item__btn-go" src="../static/images/icon-map.png" mode="" @click="storeLocation(item.location)"></image>
				</view>
				<view class="app-flex-item app-flex-item--shrink-0">
					<image class="AlcoholStoreList-item__btn-go" src="../static/images/icon-buy.png" mode="" @click="navigationTo('pages/subPages/payOnline/index?id='+item.pay_online_business_id)"></image>
				</view>
			</view>
			<!-- header end -->
			<!-- content -->
			<view class="AlcoholStoreList-item__content">
				<view class="m-top20 f-32 f-bold col-3">{{item.title}}</view>
				<view class="m-top10 f-24 col-9">{{item.desc}}</view>
				<!-- 进度 -->
				<view class="m-top10 app-flex app-flex--align-center">
					<view class="app-flex-item app-flex-item--1">
						<view class="c-progress">
							<view class="c-progress__active" :style="{
								width: item.bookedPercent + '%'
							}"></view>
							<view class="c-progress__text">已预定{{item.bookedNum || 0}}桌</view>
						</view>
					</view>
					<view class="app-flex-item app-flex-item--1 f-20" style="flex:0.8;color: #421906;">
						今日限{{item.limit}}桌
					</view>
					<view class="app-flex-item">
						<button class="app-btn" @click="$emit('on-btn-appoint-click',item,index)">预约</button>
					</view>
				</view>
				<!-- 进度 end -->
				<!-- 预约和用户 -->
				<view v-if="item.bookedUserNum" class="m-top20 app-flex app-flex--align-center">
					<view class="app-flex-item"  style="width: 50%;">
						<view class="c-user-list">
							<view v-for="user in item.userList" :key="item.id" class="c-user-list__item">
								<image class="c-user-list__avatar" :src="user.avatar" mode="aspectFill"></image>
							</view>
						</view>
					</view>
					<view class="app-flex-item f-24" style="color: #421906;margin-left: auto;">
						+{{item.bookedUserNum}}人已预约
					</view>
				</view>
				<!-- 预约和用户 end -->
			</view>
			<!-- content end -->
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	export default {
		name: 'AlcoholStoreList',
		props: {
			// 列表数据
			list: {
				type: Array,
				default () {
					// return Array(4).fill(1).map((item, index) => ({
					// 	id: index,
					// 	// 店铺logo
					// 	logo: 'http://placekitten.com/50/50',
					// 	// 地址
					// 	address: '双流区大件路珠江路蓝光酒吧酒吧酒吧',
					// 	// 距离
					// 	distance: '距0.3km',
					// 	// 经纬度信息
					// 	location: {
					// 		name: '',
					// 		address: '',
					// 		longitude: 116,
					// 		latitude: 39,
					// 	},
					// 	// 标题
					// 	title: '支持就餐-全场国宾、一品纯麦免费喝',
					// 	// 描述
					// 	desc: '除啤酒外消费多少元，免费喝多少元啤酒',
					// 	// 已预订多少桌
					// 	bookedNum: 115,
					// 	// 限制多少桌
					// 	limit: 500,
					// 	// 预订百分比，0-100，
					// 	bookedPercent: 70,
					// 	// 预约人员列表
					// 	userList: [{
					// 		id: 'a01',
					// 		avatar: 'http://placekitten.com/90/90'
					// 	}, {
					// 		id: 'a02',
					// 		avatar: 'http://placekitten.com/90/90'
					// 	}, {
					// 		id: 'a03',
					// 		avatar: 'http://placekitten.com/90/90'
					// 	}],
					// 	// 多少人已经预约
					// 	bookedUserNum: 500
					// }))
					return []
				}
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
	.AlcoholStoreList-item {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		padding: 30rpx;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.AlcoholStoreList-item__header {
		box-sizing: border-box;
		padding: 20rpx;
		background-color: #F8F8F8;
		border-radius: 20rpx;
	}

	.AlcoholStoreList-item__logo {
		width: 50rpx;
		height: 50rpx;
		border-radius: 100%;
	}

	.AlcoholStoreList-item__btn-go {
		width: 60rpx;
		height: 60rpx;
	}
	// 进度条
	.c-progress {
		box-sizing: border-box;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 30rpx;
		border: 1px solid #FFD940;
		border-radius: 20rpx;
		background-color: #FFF8D8;
	}
	.c-progress__text {
		position: relative;
		text-align: center;
		font-size: 20rpx;
		color: #421906;
	}
	.c-progress__active {
		position: absolute;
		height: 100%;
		left: 0;
		top: 0;
		background-color: #FFD940;
		border-radius: 20rpx;
		z-index: 0;
	}
	// 进度条 end
	// 用户列表
	.c-user-list {
		position: relative;
		display: flex;
		align-items: center;
	}
	.c-user-list__item {
		position: relative;
		&+& {
			margin-left: -23rpx;
		}
	}
	.c-user-list__avatar {
		width: 46rpx;
		height: 46rpx;
		border-radius: 100%;
		border: 1px solid #707070;
	}
	// 用户列表 end
</style>
