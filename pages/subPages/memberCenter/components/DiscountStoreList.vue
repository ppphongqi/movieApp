<template>
	<view class="DiscountStoreList">
		<view v-for="item in list" :key="item.id"  class="DiscountStoreList-item">
			<!-- content -->
			<view class="DiscountStoreList-item__content app-flex">
				<view class="app-flex-item app-flex-item--shrink-0" style="font-size: 0;">
					<image class="DiscountStoreList-item__logo" :src="item.logo" mode="aspectFill"></image>
				</view>
				<view class="app-flex-item app-flex-item--1 app-flex app-flex--column">
					<view class="app-flex-item f-36 f-bold col-3 onelist-hidden">{{item.title}}</view>
					<view class="app-flex-item m-top10 f-24 col-9 onelist-hidden">{{item.desc}}</view>
					<view class="app-flex-item app-flex app-flex--align-center" style="margin-top: auto;">
						<view class="app-flex-item app-flex-item--1 f-24 f-bold col-f4"><text class="f-48">{{item.discount}}</text>折</view>
						<view class="app-flex-item app-flex-item--shrink-0">
							<view class="app-btn-large f-bold" style="width: auto;height: 60rpx;" @click="navigationTo('pages/subPages/payOnline/index?id='+item.pay_online_business_id)">优惠买单</view>
						</view>
					</view>
				</view>
			</view>
			<!-- content end -->
			<!-- footer -->
			<view class="DiscountStoreList-item__footer m-top30 app-flex app-flex--align-center">
				<view class="app-flex-item">
					<view class="iconfont icon-dingwei col-9"></view>
				</view>
				<view class="app-flex-item app-flex-item--1 app-flex app-flex--align-center">
					<view class="app-flex-item app-flex-item--1 f-24 col-0 onelist-hidden">{{item.address}}</view>
					<view class="app-flex-item app-flex-item--shrink-0 f-24 col-0">{{item.distance}}</view>
				</view>
				<view class="app-flex-item app-flex-item--shrink-0">
					<image class="DiscountStoreList-item__btn-go" src="../static/images/icon-map.png" mode="" @click="storeLocation(item.location)"></image>
				</view>
				<view class="app-flex-item app-flex-item--shrink-0">
					<image class="DiscountStoreList-item__btn-go" src="../static/images/icon-phone.png" mode="" @click="storeMobile(item.phone)"></image>
				</view>
			</view>
			<!-- footer end -->
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	export default {
		name: 'DiscountStoreList',
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
					// 	// 电话
					// 	phone: 88888888,
					// 	// 标题
					// 	title: '小龙坎火锅',
					// 	// 描述
					// 	desc: '除啤酒外消费多少元，免费喝多少元啤酒',
					// 	// 折扣
					// 	discount: '9.5'
					// }))
					return []
				}
			}
		},
		methods: {
		
			/**
			 * 拨打门店电话
			 */
			storeMobile(mobile) {
				uni.makePhoneCall({
					phoneNumber: mobile
				});
			},
		
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
	.DiscountStoreList-item {
		box-sizing: border-box;
		width: 690rpx;
		margin: 20rpx auto;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}
	.DiscountStoreList-item__logo {
		width: 180rpx;
		height: 180rpx;
		border-radius: 20rpx;
	}
	.DiscountStoreList-item__footer {
		box-sizing: border-box;
		padding: 20rpx;
		background-color: #F8F8F8;
		border-radius: 20rpx;
	}
	.DiscountStoreList-item__btn-go {
		width: 60rpx;
		height: 60rpx;
	}
</style>
