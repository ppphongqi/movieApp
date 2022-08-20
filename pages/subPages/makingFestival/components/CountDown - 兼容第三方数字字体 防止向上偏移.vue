<!-- 设计稿用了第三方数字字体 但是按照常规办法 第三方字体会在真机上向上便宜 -->
<!-- 如果要处理便宜 要写额外的dom接口和css -->
<!-- 为了方便开发 就不用第三方字体了 点赞页面就没用第三方字体 -->
<template>
	<view class="count-down">
		<!-- header -->
		<view class="count-down__header">活动倒计时</view>
		<!-- header end -->
		<!-- content -->
		<view class="count-down__content">
			<view class="count-down__item">
				<view class="count-down__time">
					<!-- 必须这样写第三方数字字体才能居中 -->
					<view class="count-down__number">
						<!-- 兼容第三方数字字体的写法 -->
						<!-- <text class="is-trong price-font-family">0</text> -->
						<text class="is-trong">0</text>
					</view>
					<view class="count-down__number">
						<text class="is-trong">0</text>
					</view>
				</view>
				<view class="count-down__unit">时</view>
			</view>
			<view class="count-down__item">
				<view class="count-down__time">
					<!-- 必须这样写第三方数字字体才能居中 -->
					<view class="count-down__number">
						<text class="is-trong">0</text>
					</view>
					<view class="count-down__number">
						<text class="is-trong">0</text>
					</view>
				</view>
				<view class="count-down__unit">天</view>
			</view>
			<view class="count-down__item">
				<view class="count-down__time">
					<!-- 必须这样写第三方数字字体才能居中 -->
					<view class="count-down__number">
						<text class="is-trong">0</text>
					</view>
					<view class="count-down__number">
						<text class="is-trong">0</text>
					</view>
				</view>
				<view class="count-down__unit">时</view>
			</view>
			<view class="count-down__item">
				<view class="count-down__time">
					<!-- 必须这样写第三方数字字体才能居中 -->
					<view class="count-down__number">
						<text class="is-trong">0</text>
					</view>
					<view class="count-down__number">
						<text class="is-trong">0</text>
					</view>
				</view>
				<view class="count-down__unit">分</view>
			</view>
			<view class="count-down__item">
				<view class="count-down__time">
					<!-- 必须这样写第三方数字字体才能居中 -->
					<view class="count-down__number">
						<text class="is-trong">0</text>
					</view>
					<view class="count-down__number">
						<text class="is-trong price-font-family">0</text>
					</view>
				</view>
				<view class="count-down__unit">秒</view>
			</view>
		</view>
		<!-- content end -->
	</view>
</template>

<script>
	export default {
	
	}
</script>

<style lang="scss" scoped>
	.count-down {
		box-sizing: border-box;
		width: 690rpx;
		min-height: 179rpx;
		margin: 20rpx auto;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}
	.count-down__header {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		&::after,&::before {
			content: "";
			width: 50rpx;
			height: 1px;
			margin: 0 24rpx;
			background-color: #CCCCCC;
		}
	}
	.count-down__content {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20rpx;
	}
	.count-down__item {
		display: flex;
		align-items: flex-end;
	}
	.count-down__time {
		display: flex;
		align-items: center;
		line-height: normal;
	}
	.count-down__number {
		width: 40rpx;
		color: #fff;
		font-size: 48rpx;
		font-weight: bold;
		text-align: center;
		background-color: #333333;
		border-radius: 4rpx;
		overflow: hidden;
		&+& {
			margin-left: 4rpx;
		}
		// 必须这样写第三方数字字体才能居中
		.is-trong {
			vertical-align: middle;
			line-height: 60rpx;
		}
	}
	.count-down__unit {
		margin: 0 10rpx;
	}
</style>
