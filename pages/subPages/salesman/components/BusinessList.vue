<template>
	<view class="c-BusinessList">
		<view class="c-BusinessList__title">
			<view class="c-BusinessList__title__text">我的商家</view>
		</view>
		<view v-for="item in list" :key="item.id" class="c-BusinessItem">
			<view class="c-BusinessItem__expirationTime">到期时间：{{item.expirationTime}}</view>
			<view class="c-BusinessItem-content">
				<view class="c-BusinessItem-content__left">
					<image class="c-BusinessItem__img" :src="item.logo" mode="aspectFill"></image>
				</view>
				<view class="c-BusinessItem-content__center">
					<view class="c-BusinessItem__title">{{item.title}}</view>
					<view v-if="item.bindingTime" class="c-BusinessItem__bindingTime">绑定时间：{{item.bindingTime}}</view>
					<view class="c-BusinessItem__rebate"><text class="c-BusinessItem__rebate__small">已返</text><text class="c-BusinessItem__rebate__small">￥</text>{{item.rebate}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 数据列表
			list: {
				type: Array,
				default () {
					// return Array(3).fill(1).map((item, index) => ({
					// 	id: 'item' + index,
					// 	// 商家名称
					// 	title: '小龙坎火锅(高新店)',
					// 	// 商家图片
					// 	logo: 'https://via.placeholder.com/160x160/2a9ff6/fffffff',
					// 	// 到期时间
					// 	expirationTime: '2021-08-21',
					// 	// 绑定时间
					// 	bindingTime: '2021-08-21',
					// 	// 已返
					// 	rebate: '200.00'
					// }))
					return []
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-BusinessList {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		margin: 20rpx auto;
		padding: 40rpx 30rpx;
		border-radius: 20rpx;
		background-color: #fff;
	}

	.c-BusinessList__title {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.c-BusinessList__title__text {
		position: relative;
		font-weight: bold;
		font-size: 36rpx;
		color: #333333;
		z-index: 0;

		&::after {
			display: block;
			content: "\20";
			position: absolute;
			left: -4rpx;
			right: -4rpx;
			bottom: 0;
			height: 16rpx;
			background-color: #FFD940;
			z-index: -1;
		}
	}

	.c-BusinessItem {
		padding-top: 30rpx;
		&+& {
			border-top: 1px solid #EEEEEE;
		}
	}

	.c-BusinessItem-content {
		box-sizing: border-box;
		display: flex;
		padding: 30rpx 0;
	}

	.c-BusinessItem__expirationTime {
		font-size: 28rpx;
		color: #333333;
	}

	.c-BusinessItem__img {
		width: 160rpx;
		height: 160rpx;
	}

	.c-BusinessItem-content__center {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		margin-left: 20rpx;
	}

	.c-BusinessItem__title {
		display: -webkit-box;
		margin-bottom: auto;
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
	}
	.c-BusinessItem__bindingTime {
		font-size: 24rpx;
		color: #999999;
	}
	.c-BusinessItem__rebate {
		font-weight: bold;
		font-size: 36rpx;
		color: #FF4444;
		margin-top: 22rpx;
	}
	.c-BusinessItem__rebate__small {
		font-weight: normal;
		font-size: 24rpx;
	}
</style>
