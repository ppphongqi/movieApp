<template>
	<view class="advertisement">
		<image class="advertisement__img" :src="imgUrl" @click="handleImgClick"></image>
	</view>
</template>

<script>
	export default {
		props: {
			// 广告图片地址
			imgUrl: {
				type: String,
				default: ''
			},
			// 点击跳转的链接信息,可能是个对象，使用this.navigationTo跳转即可
			link: {
				type: [String,Object],
				default: ''
			}
		},
		methods: {
			// 广告点击事件
			handleImgClick() {
				this.navigationTo(this.link)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.advertisement {
		width: 690rpx;
		max-width: 100%;
		margin: 20rpx auto;
	}
	.advertisement__img {
		width: 100%;
		border-radius: 10rpx;
	}
</style>
