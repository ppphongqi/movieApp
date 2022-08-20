<template>
	<view class="PurchaseRecordList">
		<view v-for="item in list" :key="item.id" class="PurchaseRecordList-item">
			<view class="app-flex app-flex--align-center">
				<view class="app-flex-item app-flex-item--1 f-32 f-bold col-3">
					{{item.title}}
				</view>
				<view class="app-flex-item app-flex-item--shrink-0">
					<view class="PurchaseRecordList-item__type">{{item.typeText}}</view>
				</view>
			</view>
			<view class="m-top10 app-flex app-flex--align-center">
				<view class="app-flex-item app-flex-item--1 f-24 col-3">
					{{item.time}}
				</view>
				<view class="app-flex-item app-flex-item--shrink-0">
					<view class="f-24 col-3"><text class="f-36 f-bold">{{item.num}}</text>次</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'PurchaseRecordList',
		props: {
			// 列表数据
			list: {
				type: Array,
				default() {
					// return Array(4).fill(1).map((item,index)=>({
					// 	id: index,
					// 	title: '66号公路酒吧',
					// 	time: '2020-11-08 20:14:12',
					// 	num: '-1',
					// 	type: 1,
					// 	typeText: '预约'
					// }))
					return []
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.PurchaseRecordList-item {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		margin: 20rpx auto;
		border-radius: 20rpx;
		background-color: #fff;
		padding: 30rpx;
	}
	.PurchaseRecordList-item__type {
		box-sizing: border-box;
		padding: 3rpx 10rpx;
		font-size: 24rpx;
		color: #999999;
		border: 1px solid #eee;
		border-radius: 10rpx;
	}
</style>
