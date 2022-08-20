<template>
	<view class="rights-card">
		<view class="rights-card__title">
			<view class="rights-card__title__text">{{title}}</view>
		</view>
		<Parse :html="text"></Parse>
	</view>
</template>

<script>
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	export default {
		components: {
			Parse
		},
		props: {
			title: {
				type: String,
				default: ''
			},
			text: {
				type: String,
				default: ''
			},
		}
	}
</script>

<style lang="scss" scoped>
	.rights-card {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		margin-top: 40rpx;
	}

	.rights-card__title {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 40rpx;
	}

	.rights-card__title__text {
		position: relative;
		font-weight: bold;
		font-size: 36rpx;
		color: #333333;
		z-index: 0;

		&::after {
			display: block;
			content: "\20";
			position: absolute;
			left: -4rpx;
			right: -4rpx;
			bottom: 0;
			height: 16rpx;
			background-color: #FFD940;
			z-index: -1;
		}
	}
</style>
