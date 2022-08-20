<template>
	<view class="c-FlowList">
		<view v-for="(item,index) in list" :key="item.id" class="c-FlowList-item">
			<view class="c-FlowList-item__center">
				<view class="c-FlowList-item__title">{{item.title}}</view>
				<view class="c-FlowList-item__time">{{item.time}}</view>
			</view>
			<view class="c-FlowList-item__right">
				<view v-if="item.type == 1" class="c-FlowList-item__price">+￥<text class="is-strong">{{item.amount}}</text></view>
				<view v-if="item.type == 2" class="c-FlowList-item__price is-red">-￥<text class="is-strong">{{item.amount}}</text></view>
				<view class="c-FlowList-item__balance">余额￥<text class="is-strong">{{item.balance}}</text></view>
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
						// 类型 1:收入，2:支出
						type: 1,
						// 商家名称
						title: '主动发起微信提现，申请金额',
						// 时间
						time: '2020-05-22 16:12:04',
						// 金额
						amount: 46.5,
						// 余额
						balance: 10.8
					}))
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-FlowList {
		width: 690rpx;
		max-width: 100%;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 20rpx;
	}
	.c-FlowList-item {
		box-sizing: border-box;
		display: flex;
		padding: 30rpx;
		&+& {
			border-top: 1px solid #EEEEEE;
		}
	}
	.c-FlowList-item__center {
		min-width: 0;
		flex: 1;
	}
	.c-FlowList-item__title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	.c-FlowList-item__time {
		margin-top: 20rpx;
		font-size: 24rpx;
		color: #999;
	}
	.c-FlowList-item__right {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		margin-left: 20rpx;
	}
	.c-FlowList-item__price {
		margin-bottom: auto;
		font-size: 24rpx;
		color: #333;
		white-space: nowrap;
		text-align: right;
		&.is-red {
			color: #FF4444;
		}
		.is-strong {
			font-size: 36rpx;
			font-weight: bold;
		}
	}
	.c-FlowList-item__balance {
		margin-top: 20rpx;
		font-size: 24rpx;
		color: #333;
		white-space: nowrap;
		text-align: right;
		.is-strong {
			font-weight: bold;
		}
	}
</style>
