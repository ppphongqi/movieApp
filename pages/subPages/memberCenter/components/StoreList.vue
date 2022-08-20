<template>
	<view class="StoreList">
		<view v-for="(item,index) in list" :key="item.id" class="StoreList-item">
			<!-- header -->
			<view class="StoreList-item__header app-flex app-flex--align-center">
				<view class="app-flex-item app-flex-item--shrink-0">
					<image class="StoreList-item__logo" :src="item.logo" mode="aspectFill" @click="$emit('on-logo-click',item,index)"></image>
				</view>
				<view class="app-flex-item app-flex-item--1">
					<view class="f-28 col-3 f-bold onelist-hidden">{{item.title}}</view>
					<view class="m-top10 app-flex app-flex--align-center">
						<view class="app-flex-item app-flex-item--1 f-24 col-9 onelist-hidden">{{item.address}}</view>
						<view class="app-flex-item app-flex-item--shrink-0 f-24 col-9">{{item.distance}}</view>
					</view>
				</view>
				<view class="app-flex-item app-flex-item--shrink-0 app-flex app-flex app-flex--align-center">
					<view class="app-flex-item">
						<image class="StoreList-item__btn-op" src="../static/images/icon-phone.png" mode=""
							@click="storeMobile(item.phone)"></image>
					</view>
					<view class="app-flex-item">
						<image class="StoreList-item__btn-op" src="../static/images/icon-map.png" mode=""
							@click="storeLocation(item.location)">
						</image>
					</view>
				</view>
			</view>
			<!-- header end -->
			<!-- content -->
			<view class="StoreList-item__content m-top30">
				<view class="f-28 col-3 m-btm30">{{item.desc}}</view>
				<!-- 图片列表 -->
				<view class="pic-list">
					<view v-for="img in item.images" :key="item.id" class="pic-list__item">
						<view class="pic-list__img-wrapper">
							<image class="pic-list__img" :src="img.url" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<!-- 图片列表 end -->
			</view>
			<!-- content end -->
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	export default {
		name: 'StoreList',
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
					// 	// 图片列表
					// 	images: [{
					// 		id: 'a01',
					// 		url: 'http://placekitten.com/750/750'
					// 	},{
					// 		id: 'a01',
					// 		url: 'http://placekitten.com/750/750'
					// 	},{
					// 		id: 'a01',
					// 		url: 'http://placekitten.com/750/750'
					// 	},{
					// 		id: 'a01',
					// 		url: 'http://placekitten.com/750/750'
					// 	}]
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
	.StoreList-item {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		padding: 30rpx;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.StoreList-item__logo {
		width: 80rpx;
		height: 80rpx;
		border-radius: 100%;
	}

	.StoreList-item__btn-op {
		width: 60rpx;
		height: 60rpx;
	}

	// 图片列表
	.pic-list {
		display: flex;
		flex-wrap: wrap;
		margin: -5rpx;
	}

	.pic-list__item {
		box-sizing: border-box;
		width: percentage($number: 1/3);
		padding: 5rpx;
	}

	.pic-list__img-wrapper {
		position: relative;
		width: 100%;
		padding-top: 100%;
	}

	.pic-list__img {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}

	// 图片列表 end
</style>
