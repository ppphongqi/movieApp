<template>
	<view class="label-member-price" :style="containerStyle">
		<view class="label-member-price__left">{{label}}</view>
		<view class="label-member-price__right">{{pricePrefix}}￥{{priceStr}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 标签名字
			label: {
				type: String,
				default:'会员'
			},
			// 价格前缀
			pricePrefix: {
				type: String,
				default:'省'
			},
			// 价格
			priceStr: {
				type: String,
				default:'0'
			},
			containerStyle: {
				type: String,
				default:''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.label-member-price {
		display: inline-flex;
		height: 30rpx;
		font-size: 0;
	}
	.label-member-price__left {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 60rpx;
		height: 100%;
		line-height: 1;
		padding-left: 8rpx;
		padding-right: 10rpx;
		font-size: 20rpx;
		color: #333;
		border-radius: 4rpx 0 0 4rpx;
		// linear-gradient(to left,#333 10rpx, #EED196 0)避免真机右侧有线
		background: linear-gradient(-105deg, #333 50%, #EED196 0) top right/10rpx 30rpx, linear-gradient(to left,#333 10rpx, #EED196 0);
		background-repeat: no-repeat;
	}
	.label-member-price__right {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 80rpx;
		height: 100%;
		line-height: 1;
		padding: 0 4rpx;
		font-size: 20rpx;
		color: #fff;
		border-radius: 0 4rpx 4px 0;
		background-color: #333;
	}
</style>
