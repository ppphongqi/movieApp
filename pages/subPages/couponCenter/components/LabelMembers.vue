<template>
	<view class="c-label-members" :style="containerStyle">{{text}}</view>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: '会员专属'
        },
        containerStyle: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
	.c-label-members {
		display: inline-block;
		height: 24rpx;
		padding: 0 8rpx;
		font-weight: bold;
		font-size: 18rpx;
		color: #FFDBA5;
		line-height: 24rpx;
		border-radius: 12rpx;
		background: linear-gradient(-90deg, #393945 0%, #555B69 100%);
	}
</style>
