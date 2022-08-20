<template>
	<view class="page-mangopay">
		<!-- 主要内容 -->
		<view class="mangopay-card">
			<view class="mangopay-card__header">
				<view class="mangopay-card__title">华联影城</view>
				<view class="mangopay-card__subtitle">双流区西航港街道锦华路二段166号北京华联空港店5楼</view>
			</view>
			<view class="mangopay-card__content">
				<!-- 简要信息 -->
				<view class="mangopay-poster">
					<view class="mangopay-poster__left">
						<view class="mangopay-poster__title">梦境人生</view>
						<view class="mangopay-poster__subtitle">国语2D 2张</view>
					</view>
					<view class="mangopay-poster__right">
						<image class="mangopay-poster__img" src="https://via.placeholder.com/110x148/2a9ff6/fffffff" mode="aspectFill"></image>
					</view>
				</view>
				<!-- 简要信息 end -->
				<!-- 座位信息 -->
				<view class="mangopay-seat">
					<view class="mangopay-seat__title">2021-09-01</view>
					<view class="mangopay-seat__text">3号激光厅</view>
				</view>
				<view class="mangopay-seat">
					<view class="mangopay-seat__title is-strong">15:00~18:00</view>
					<view class="mangopay-seat__text is-strong">7排5座 | 7排4座</view>
				</view>
				<!-- 座位信息 end -->
				<!-- 分割线 -->
				<view style="margin: 0 -30rpx;">
					<view class="mangopay-card__line"></view>
				</view>
				<!-- 分割线 end -->
				<!-- 订单金额 -->
				<view class="mangopay-attr">
					<view class="mangopay-attr__title is-strong">订单金额</view>
					<view class="mangopay__price is-red">￥<text class="is-strong">70.00</text></view>
				</view>
				<view class="mangopay-attr">
					<view class="mangopay-attr__title">电影票</view>
					<view class="mangopay-attr__text">2张</view>
				</view>
				<view class="mangopay-attr">
					<view class="mangopay-attr__title">下单时间</view>
					<view class="mangopay-attr__text">2019-09-23 15:30:20</view>
				</view>
				<view class="mangopay-attr">
					<view class="mangopay-attr__title">订单号</view>
					<view class="mangopay-attr__text">201909239985945848465</view>
				</view>
				<view class="mangopay-attr">
					<view class="mangopay-attr__title">手机号</view>
					<view class="mangopay-attr__text">14700000000</view>
				</view>
				<!-- 订单金额  end -->
			</view>
		</view>
		<!-- 主要内容 end -->
		<!-- 底部悬浮 -->
		<view class="mangopay-footer app-container--safe-bottom">
			<view class="mangopay-footer__left">
				<view class="mangopay__price">应付：<text class="is-red">￥</text><text class="is-red is-strong">70.00</text></view>
			</view>
			<view class="mangopay-footer__right">
				<button class="mangopay-btn-go btn-normal">立即付款</button>
			</view>
		</view>
		<!-- 底部悬浮 end -->
	</view>
</template>

<script>
	export default {
		onShow() {
			uni.setNavigationBarColor({
				frontColor: "#ffffff",
				backgroundColor: "#2A2A2A",
			});
			
		},
	}
</script>

<style lang="scss" scoped>
	.page-mangopay {
		min-height: 100vh;
		background-color: #2A2A2A;
		padding-top: 20rpx;
		padding-bottom: 200rpx;
	}
	.mangopay-poster__img {
		width: 110rpx;
		height: 148rpx;
		border-radius: 10rpx;
	}
	.mangopay-card {
		width: 690rpx;
		margin: 0 auto;
	}
	.mangopay-card__header {
		box-sizing: border-box;
		padding: 20rpx 30rpx 40rpx 30rpx;
		border-radius: 20rpx;
		background-color: #FFD940;
		border-radius: 20rpx 20rpx 0 0;
	}
	.mangopay-card__title {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}
	.mangopay-card__subtitle {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #333;
	}
	.mangopay-card__content {
		box-sizing: border-box;
		padding: 40rpx 30rpx;
		border-radius: 20rpx;
		background-color: #fff;
		margin-top: -20rpx;
	}
	.mangopay-poster {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.mangopay-poster__title {
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
	}
	.mangopay-poster__subtitle {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #333;
	}
	.mangopay-poster__right {
		margin-left: 16rpx;
	}
	.mangopay-seat {
		display: flex;
		align-items: center;
		margin-top: 10rpx;
	}
	.mangopay-seat__title {
		font-size: 24rpx;
		color: #999;
		width: 214rpx;
		&.is-strong {
			color: #333333;
			font-weight: bold;
		}
	}
	.mangopay-seat__text {
		font-size: 24rpx;
		color: #999;
		&.is-strong {
			color: #333333;
			font-weight: bold;
		}
	}
	.mangopay-attr {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;
	}
	.mangopay-attr__title {
		font-size: 24rpx;
		color: #999;
		&.is-strong {
			font-weight: bold;
			font-size: 32rpx;
			color: #333;
		}
	}
	.mangopay-attr__text {
		font-size: 24rpx;
		color: #333;
	}
	.mangopay__price {
		font-size: 24rpx;
		color: #333;
		&.is-red,.is-red {
			color: #FF4444;
		}
		&.is-strong,.is-strong {
			font-size: 36rpx;
			font-weight: bold;
		}
	}
	.mangopay-footer {
		box-sizing: border-box;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15rpx 30rpx;
		background-color: #fff;
		z-index: 2;
	}
	.mangopay-btn-go {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333;
		background-color: #FFD940;
		border-radius: 10rpx;
	}
	.mangopay-card__line {
		position: relative;
		width: 100%;
		height: 30rpx;
		background-image: linear-gradient(to right, #ccc 0%, #ccc 50%, transparent 50%);
		background-size: 8rpx 2rpx;
		background-repeat: repeat-x;
		background-position: 0 50%;
		margin: 20rpx auto;
		&::after,&::before {
			position: absolute;
			box-sizing: border-box;
			display: block;
			content: "\20";
			width: 30rpx;
			height: 30rpx;
			top: 0;
			left: 0;
			border-radius: 100%;
			background-color: #2A2A2A;
			transform: translateX(-50%);
		}
		&::after {
			left: initial;
			right: 0;
			transform: translateX(50%);
		}
	}
</style>
