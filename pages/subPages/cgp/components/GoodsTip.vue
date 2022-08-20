
<template>
	<view class="goods-tip" :style="containerStyle"><view class="iconfont icon-wenhaoxiao"></view><view class="goods-tip__text">{{tip}}</view></view>
</template>

<script>
	export default {
		props: {
			// 最外层容器的样式
			containerStyle: {
				type: String,
				default: ''
			},
			// 提示文字
			tip: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-tip {
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0;
		font-size: 20rpx;
		color: #999;
		.iconfont {
			margin-right: 8rpx;
			color: inherit;
			font-size: inherit;
		}
	}
	.goods-tip__text {
		min-width: 0;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
</style>
