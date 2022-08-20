<template>
	<view class="c-NavFixed app-container--safe-bottom">
		<view class="c-nav-list">
			<view class="c-nav-item" @click="navigationTo('pages/subPages/partner/index')">
				 <view class="c-nav-item__icon iconfont icon-shouye_huaban1"></view>
				 <view class="c-nav-item__text">首页</view>
			</view>
			<view class="c-nav-item" @click="navigationTo('pages/subPages/dealer/order/order')">
				 <view class="c-nav-item__icon iconfont icon-yigouxuan"></view>
				 <view class="c-nav-item__text">推广订单</view>
			</view>
			<view class="c-nav-item" @click="navigationTo(mineUrl)">
				 <view class="c-nav-item__icon iconfont icon-wode"></view>
				 <view class="c-nav-item__text">我的</view>
			</view>
		</view>
		<view class="c-nav-round" @click="navigationTo('pages/mainPages/index/index')">
			<view class="c-nav-round__icon iconfont icon-dianpu"></view>
			<view class="c-nav-round__text">商场</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			mineUrl: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-NavFixed {
		box-sizing: border-box;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 30rpx;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}
	.c-nav-list {
		box-sizing: border-box;
		display: inline-flex;
		background-color: #F9D235;
		width: 570rpx;
		height: 100rpx;
		padding: 0 30rpx;
		align-items: center;
		border-radius: 9999rpx;
	}
	.c-nav-item {
		box-sizing: border-box;
		flex: 1;
		padding: 0 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		
	}
	.c-nav-item__icon {
		color: #333333;
		font-size: 36rpx;
	}
	.c-nav-item__text {
		color: #333333;
		font-size: 24rpx;
	}
	.c-nav-round {
		box-sizing: border-box;
		width: 100rpx;
		height: 100rpx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background-color: #333333;
		border-radius: 100%;
	}
	.c-nav-round__icon {
		color: #F9D235;
		font-size: 36rpx;
	}
	.c-nav-round__text {
		color: #F9D235;
		font-size: 24rpx;
	}
</style>
