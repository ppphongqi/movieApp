<template>
	<view class="card-title">{{title}}</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card-title {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 108rpx;
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
		&::before,
		&::after {
			display: block;
			content: "";
			width: 30rpx;
			height: 21rpx;
			margin: 0 16rpx;
			background-image: url(../static/images/icon-festival-title--right.png);
			background-position: center;
			background-repeat: no-repeat;
			background-size: contain;
		}
		&::before {
			background-image: url(../static/images/icon-festival-title--left.png);
		}
	}
	
</style>
