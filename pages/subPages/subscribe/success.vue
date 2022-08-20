<template>
	<view class="" :style="themeColor">
		<view class="header dis-flex flex-dir-column flex-x-around flex-y-center">
			<view class="iconfont icon-form title"></view>
			<view class="col-3 f-28 f-w">预约申请已提交</view>
			<view class="col-6 f-24">已发给商家确认预约信息和时间，通过后即可到店使用</view>
			<view class="col-3 f-28 btn">查看预约信息</view>
		</view>
		<view class=""></view>
	</view>
</template>

<script>
</script>

<style lang="scss">
	.header{
		background-color: #FFFFFF;
		height: 400rpx;
	}
	.title {
		font-size: 150rpx;
		color: var(--theme-color);
	}
	.btn {
	 padding: 10rpx 20rpx;
	 border: 1px solid #999;
	 border-radius: 40rpx;
	}
</style>
