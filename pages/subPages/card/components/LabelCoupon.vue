<template>
	<view class="c-label-counpon" :style="customStyle">{{text}}</view>
</template>

<script>
	export default {
		props: {
			text: {
				type: String,
				default: ''
			},
			customStyle: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-label-counpon {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		display: inline-block;
		height: 30rpx;
		font-size: 24rpx;
		color: #FF4444;
		line-height: 1;
		border-width: 1px 8px 1px 8px;
		border-style: solid;
		border-color: transparent;
		border-image-source: url("../static/images/bg-coupon.png");
		border-image-slice: 1 16 1 16;
		border-image-repeat: stretch stretch;
	}
</style>
