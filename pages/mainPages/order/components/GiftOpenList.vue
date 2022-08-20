<template>
	<view class="c-GiftOpenList">
		<view v-for="(item,index) in list" :key="item.id" class="c-GiftOpenList-item">
			<!-- header -->
			<view class="app-flex">
				<view class="app-flex-item app-flex-item--shrink-0">
					<image class="c-GiftOpenList-item__img" :src="item.image" mode="aspectFill"></image>
				</view>
				<view class="app-flex-item app-flex-item--1">
					<view class="f-28 col-3 onelist-hidden">{{item.title}}</view>
					<view v-if="item.code" class="c-GiftOpenList-item__code app-flex--inline-flex app-flex--align-center">
						<view class="app-flex-item">核销码：</view>
						<view class="app-flex-item is-strong">{{item.code}}</view>
					</view>
				</view>
			</view>
			<!-- header end -->
			<!-- content -->
			<view class="app-flex app-flex--align-center m-top20">
				<view class="app-flex-item" style="font-size: 0;">
					<view class="iconfont is-inline icon-zhuyi col-f4"></view>
				</view>
				<view class="app-flex-item app-flex-item--1 f-24 col-3" style="margin-left: 12rpx;">
					持券仅需付<text class="col-f4 f-28 f-bold">{{item.needPrice}}</text>元
				</view>
			</view>
			<!-- content end -->
			<!-- footer -->
			<view class="app-flex app-flex--align-center app-flex--justify-between m-top20">
				<view class="app-flex-item" style="width: 70%;">
					<view class="app-flex-item app-flex-item--1 f-24 col-9">
						价值：￥<text class="f-28 f-bold">{{item.price}}</text>
					</view>
				</view>
				<view v-if="btnDetailsVisible" class="app-flex-item app-flex-item--shrink-0">
					<button class="app-btn-plain--block" style="width: auto;height: 50rpx;font-size: 24rpx;" @click="handleBtnDetailsClick(item,index)">查看详情</button>
				</view>
			</view>
			<!-- footer end -->
		</view>
	</view>
</template>

<script>
	export default {
		name: 'OpenList',
		props: {
			// 列表数据
			list: {
				type: Array,
				default () {
					// return Array(2).fill(1).map((item, index) => ({
					// 	id: index,
					// 	title: '标题标题标题' + index,
					// 	image: 'https://via.placeholder.com/90x90/2a9ff6/fffffff',
					// 	code:'1049 4992',
					// 	// 价值
					// 	price: '104.00',
					// 	// 持券仅付
					// 	needPrice: '200.00'
					// }))
					return []
				},
			},
			// 是否显示查看详情
			btnDetailsVisible: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			handleBtnDetailsClick(item,index) {
				console.log('handleBtnDetailsClick 01',item,index)
				this.$emit('on-btn-details-click',item,index)
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.c-GiftOpenList-item {
		box-sizing: border-box;
		margin-top: 20rpx;
		padding: 20rpx;
		background-color: #F8F8F8;
		border-radius: 20rpx;
	}
	.c-GiftOpenList-item__img {
		width: 90rpx;
		height: 90rpx;
		border-radius: 20rpx;
	}
	
	.c-GiftOpenList-item__code {
		height: 40rpx;
		margin-top: 16rpx;
		padding: 0 20rpx;
		font-size: 24rpx;
		color: #333;
		background-color: #EEEEEE;
		border-radius: 10rpx;
	
		.is-strong {
			font-size: 28rpx;
			font-weight: bold;
		}
	}
</style>

