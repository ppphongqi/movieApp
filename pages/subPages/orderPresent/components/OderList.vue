<template>
	<view class="c-OderList">
		<view v-for="item in list" :key="item.id" class="c-OderList-item app-card">
			<!-- header -->
			<view class="app-flex">
				<view class="app-flex-item app-flex-item--1 f-28">订单号：{{item.orderNo}}</view>
				<view class="app-flex-item f-28 col-f4">{{item.statusText}}</view>
			</view>
			<!-- header end -->
			<!-- content -->
			<view class="app-flex m-top20">
				<view class="app-flex-item app-flex-item--shrink-0" style="font-size: 0;">
					<image :src="item.image" mode="aspectFill"
						style="width: 140rpx;height:140rpx;border-radius: 10rpx;"></image>
				</view>
				<view class="app-flex-item app-flex-item--1">
					<view class="f-28 col-3 f-bold twolist-hidden">{{item.title}}</view>
				</view>
			</view>
			<view class="app-flex app-flex--align-center m-top30">
				<view class="app-flex-item app-flex-item--1 f-24 col-3">转赠时间:{{item.time}}</view>
				<view class="app-flex-item f-24 col-3">{{item.num}}件商品，共：<text
						class="f-28 f-bold col-f4">￥{{item.price}}</text></view>
			</view>
			<!-- content end -->
			<!-- footer -->
			<view class="app-flex app-flex--align-center app-flex--justify-end b-t m-top30 p-top-30">
				<view class="app-flex-item">收取人：{{item.nickName}}</view>
				<view class="app-flex-item" style="font-size: 0;">
					<image :src="item.avatar" mode="aspectFill" style="width: 60rpx;height:60rpx;border-radius: 100%;">
					</image>
				</view>
			</view>
			<!-- footer end -->
		</view>
	</view>
</template>

<script>
	export default {
		name: 'OderList',
		props: {
			// 列表数据
			list: {
				type: Array,
				default () {
					// return Array(2).fill(1).map((item, index) => ({
					// 	id: index,
					// 	// 订单号
					// 	orderNo: '1994545612245',
					// 	// 状态
					// 	status: '',
					// 	// 状态文字
					// 	statusText: '已转赠',
					// 	title: '标题标题标题' + index,
					// 	image: 'https://via.placeholder.com/90x90/2a9ff6/fffffff',
					// 	// 转赠时间
					// 	time: '2022-07-06 09:11',
					// 	// 商品数量
					// 	num: 1,
					// 	// 价值
					// 	price: '104.00',
					// 	// 收取人头像
					// 	avatar: 'https://via.placeholder.com/60x60/2a9ff6/fffffff',
					// 	// 收取人名称
					// 	nickName: '名扬天下'
					// }))
					return []
				},
			},
		}
	}
</script>

<style lang="scss" scoped>
</style>
