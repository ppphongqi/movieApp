<template>
	<popup-view class="gift-bag-rules-popup" :show="show" :overlay="true" @clickmask="$emit('on-mask-click')">
		<view class="rules-card">
			<view class="rules-card__content">
				<text>{{text}}</text>
			</view>
		</view>
	</popup-view>
</template>

<script>
	import PopupView from "@/components/template/PopManager.vue"
	export default {
		components: {
			PopupView
		},
		props: {
			// 是否显示
			show: {
				type: Boolean,
				default: false
			},
			// 规则文本 由后台填写
			text: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rules-card {
		box-sizing: border-box;
		width: 600rpx;
		height: 735rpx;
		padding-top: 107rpx;
		background-image: url(../static/image/bg-gift-bag-rules-popup.png);
		background-position: center;
		background-size: contain;
		background-repeat: no-repeat;
	}
	.rules-card__content {
		width: 500rpx;
		height: 600rpx;
		margin: 0 auto;
		overflow-y: auto;
		word-break: break-all;
	}
</style>
