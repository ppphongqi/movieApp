<template>
	<view class="AppointmentList">
		<view v-for="(item,index) in list" :key="item.id" class="AppointmentList-item">
			<!-- header -->
			<view class="AppointmentList-item__header app-flex app-flex--align-center">
				<view class="app-flex-item app-flex-item--shrink-0">
					<image class="AppointmentList-item__logo" :src="item.logo" mode="aspectFill"></image>
				</view>
				<view class="app-flex-item app-flex-item--1 f-24 col-0">
					{{item.title}}
				</view>
				<view class="app-flex-item app-flex-item--shrink-0 f-28 col-9">
					{{item.statusText}}
				</view>
			</view>
			<!-- header -->
			<!-- content -->
			<view class="m-top20 AppointmentList-item__content">
				<view class="m-top20 f-32 f-bold col-3">{{item.desc}}</view>
				<view class="m-top20 f-26 col-9">日期：{{item.time}}</view>
				<view class="m-top20 f-26 col-9">人数：{{item.num}}</view>
			</view>
			<!-- content end -->
			<!-- footer -->
			<view v-if="item.status == 0" class="m-top20 app-flex app-flex--align-center app-flex--justify-end">
				<view class="app-flex-item app-flex-item--shrink-0">
					<button class="app-btn-large--plain" style="width: auto;height: 64rpx;font-size: 24rpx;color: #333;" @click="$emit('on-btn-cancel-click',item,index)">取消预约</button>
				</view>
			</view>
			<!-- footer end -->
		</view>
	</view>
</template>

<script>
	export default {
		name: 'AppointmentList',
		props: {
			// 列表数据
			list: {
				type: Array,
				default() {
					// return Array(4).fill(1).map((item,index)=>({
					// 	id: index,
					// 	// 店铺logo
					// 	logo: 'http://placekitten.com/50/50',
					// 	// 标题
					// 	title: '66号公路酒吧',
					// 	// 描述
					// 	desc: '除啤酒外消费多少元，免费喝多少元啤酒',
					// 	// 日期
					// 	time: '2021-08-11 16:40:24',
					// 	// 人数
					// 	num: '2人 | 大厅 | 1桌',
					// 	// 状态
					// 	status: 1,
					// 	// 状态文字
					// 	statusText: '已经预约'
					// }))
					return []
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.AppointmentList-item {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		padding: 30rpx;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 20rpx;
	}
	.AppointmentList-item__header {
		box-sizing: border-box;
		padding: 20rpx;
		background-color: #F8F8F8;
		border-radius: 20rpx;
	}
	.AppointmentList-item__logo {
		width: 50rpx;
		height: 50rpx;
		border-radius: 100%;
	}
</style>
