<template>
	<view class="c-TipBar" :style="containerStyle">
		<view class="c-TipBar__left">
			{{text}}
		</view>
		<view class="c-TipBar__right" @click.stop="$emit('on-btn-click')">
			<view :class="btnIconClass"></view>{{btnText}}
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 要显示的文字
			text: {
				type: String,
				default: '需刷新才能获取最新佣金数据!'
			},
			// 按钮的文字
			btnText: {
				type: String,
				default: '点击刷新!'
			},
			btnIconClass: {
				type: String,
				default: 'iconfont icon-refresh'
			},
			containerStyle: {
				type: String,
				default:''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-TipBar {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 50rpx;
		padding: 0 20rpx;
		background-color: #FFD940;
		border-radius: 10rpx;
		margin-top: 30rpx;
	}
	.c-TipBar__left {
		font-size: 24rpx;
		color: #333333;
	}
	.c-TipBar__right {
		position: relative;
		display: flex;
		align-items: center;
		margin-left: 20rpx;
		padding-left: 20rpx;
		font-weight: bold;
		font-size: 24rpx;
		color: #333;
		.iconfont {
			font-size: 24rpx;
			margin-right: 6rpx;
		}
		&::before {
			position: absolute;
			left: 0;
			top: 50%;
			content: "\20";
			display: block;
			height: 20rpx;
			width: 1px;
			transform: translateY(-50%);
			background-color: rgba($color: #333333, $alpha: 0.1);
		}
	}
</style>
