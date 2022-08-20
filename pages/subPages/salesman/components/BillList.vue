<template>
	<view class="c-BillList">
		<view v-for="(item,index) in list" :key="item.id" class="c-BillList-item">
			<view class="c-BillList-item-header">
				<view class="c-BillList-item-header__order">商品订单：{{item.orderNo}}</view>
				<view class="c-BillList-item-header__status">{{item.statusText}}</view>
			</view>
			<view class="c-BillList-item-content">
				<view class="c-BillList-item-content__left">
					<image class="c-BillList-item__img" :src="item.imgSrc" mode="aspectFill"></image>
				</view>
				<view class="c-BillList-item-content__right">
					<view class="c-BillList-item-content__title">{{item.title}}</view>
					<view class="c-BillList-item-content__time">入账时间：{{item.time}}</view>
					<view class="c-BillList-item-content__amount">￥<text class="is-strong">{{item.amount}}</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 列表数据
			list: {
				type: Array,
				default () {
					return Array(3).fill(1).map((item, index) => ({
						id: 'item' + index,
						// 订单编号
						orderNo: '1254867864212345',
						// 状态
						status: 0,
						// 状态文字
						statusText: '已入账',
						// 标题
						title: '【4店通用·哈姆西克】75元抢11【4店通用·哈姆西克】75元抢11',
						// 图片
						imgSrc: 'https://via.placeholder.com/160x160/2a9ff6/fffffff',
						// 入账时间
						time: '2021-08-21 14:12:20',
						// 金额
						amount: '200.00'
					}))
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-BillList {
		width: 690rpx;
		max-width: 100%;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.c-BillList-item {
		box-sizing: border-box;
		padding: 30rpx;

		&+& {
			border-top: 1px solid #EEEEEE;
		}
	}
	.c-BillList-item-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.c-BillList-item-header__order {
		font-size: 28rpx;
		color: #333333;
	}
	.c-BillList-item-header__status {
		font-size: 28rpx;
		color: #FF4444;
	}
	.c-BillList-item__img {
		width: 160rpx;
		height: 160rpx;
	}
	.c-BillList-item-content {
		display: flex;
		margin-top: 30rpx;
	}
	.c-BillList-item-content__left {
		flex-shrink: 0;
	}
	.c-BillList-item-content__right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
		min-width: 0;
		margin-left: 20rpx;
	}
	.c-BillList-item-content__title {
		font-weight: bold;
		font-size: 28rpx;
		color: #333333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.c-BillList-item-content__time {
		font-size: 24rpx;
		color: #999;
	}
	.c-BillList-item-content__amount {
		font-size: 24rpx;
		color: #FF4444;
		.is-strong {
			font-weight: bold;
			font-size: 36rpx;
			white-space: nowrap;
		}
	}
</style>
