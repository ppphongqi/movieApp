<!-- 
	下拉加载更多样式 by 缪启峙
	showLoadmore ture没有更多商品. false加载
 -->
<template>
	<view class="block-container dis-flex flex-x-center flex-y-center">
		<view class="already-bottom f-26" v-if="showLoadmore">没有更多了</view>
		<view class="line-scale-pulse-out " v-else>
			<view class="main-bg-color"></view>
			<view class="main-bg-color"></view>
			<view class="main-bg-color"></view>
			<view class="main-bg-color"></view>
			<view class="main-bg-color"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		props: {
			showLoadmore: {
				type: Boolean,
				default: false
			},
		},
		components: {

		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {

		},
		watch: {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.block-container {
		position: relative;
		z-index: 1;
		padding: 10upx 0 20upx;
		width: 100%;
		text-align: center;
		margin-top: 10rpx;
	}

	.loadmore {
		height: 70upx;
		line-height: 70upx;
		box-sizing: border-box;
		font-size: 28upx;
		text-align: center;
		position: relative;
		z-index: 0;
		color: #9c9c9c;
		background-color: #f2f2f2;
	}

	.line-scale-pulse-out {
		transform: scale(1);
	}

	.line-scale-pulse-out>view {
		background-color: #FFD940;
		background-color: var(--theme-color);
		width: 4upx;
		height: 40upx;
		border-radius: 4upx;
		margin: 4upx;
		animation-fill-mode: both;
		display: inline-block;
		animation: line-scale-pulse-out 0.9s -0.60s infinite cubic-bezier(0.85, 0.25, 0.37, 0.85);
	}

	.line-scale-pulse-out>view:nth-child(2),
	.line-scale-pulse-out>view:nth-child(4) {
		animation-delay: -0.4s !important;
	}

	.line-scale-pulse-out>view:nth-child(1),
	.line-scale-pulse-out>view:nth-child(5) {
		animation-delay: -0.2s !important;
	}

	@-webkit-keyframes line-scale-pulse-out {
		0% {
			transform: scaley(1);
		}

		50% {
			transform: scaley(0.4);
		}

		100% {
			transform: scaley(1);
		}
	}

	@keyframes line-scale-pulse-out {
		0% {
			transform: scaley(1);
		}

		50% {
			transform: scaley(0.4);
		}

		100% {
			transform: scaley(1);
		}
	}

	/*已经到最底部*/

	.already-bottom {
		position: relative;
		color: #AAAAAA;
	}

	.already-bottom::after,
	.already-bottom::before {
		content: "";
		position: absolute;
		top: 50%;
		width: 200upx;
		border-top: 1upx solid #EEEEEE;
	}
	.already-bottom::after{
		left: -230upx;
	}
	.already-bottom::before{
		right: -230upx;
	}
</style>
