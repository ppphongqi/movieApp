<template>
	<popup-view class="spec-popup" :show="dVisible" type="center" :zIndex="999" @clickmask="dVisible = false">
		<view class="spec-card" @touchmove.stop.prevent>
			<!-- header -->
			<view class="t-c f-32 f-w m-btm40 col-3">{{title}}</view>
			<!-- header end -->
			<!-- content -->
			<scroll-view scroll-y class="spec-card-content">
				<view class="spec-card__text">{{text}}</view>
			</scroll-view>
			<!-- content end -->
			<!-- footer -->
			<view class="spec-card__footer">
				<button class="btn-normal spec-card__btn-copy" @click="handleBtnConfirmClick">{{btnText}}</button>
			</view>
			<!-- footer end -->
		</view>
		<view class="spec-popup__btn-close iconfont icon-roundclose" @click="dVisible = false"></view>
	</popup-view>
</template>

<script>
	import PopupView from '@/components/template/PopManager.vue'
	export default {
		components: {
			PopupView
		},
		props: {
			// 默认是否显示v-model
			value: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: '补签'
			},
			// 要显示的文字
			text: {
				type: String,
				default: ''
			},
			// 按钮文字
			btnText: {
				type: String,
				default: '确认补签'
			},
		},
		data() {
			return {
				// 当前弹窗是否显示
				dVisible: this.value,
			}
		},
		computed: {},
		watch: {
			value(val) {
				this.dVisible = val
			},
			dVisible(val) {
				this.$emit('input', val)
			}
		},
		methods: {
			handleBtnConfirmClick() {
				this.dVisible = false
				this.$emit('on-confirm')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.spec-popup__btn-close {
		margin-top: 40rpx;
		color: #fff;
		font-size: 50rpx;
		text-align: center;
	}

	.spec-card {
		box-sizing: border-box;
		width: 690rpx;
		padding: 30rpx 40rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.spec-card-content {
		max-height: 420rpx;
	}

	.spec-card__text {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
	}

	.spec-card__link {
		font-size: 28rpx;
		font-weight: bold;
		color: #5D94D4;
		margin-top: 20rpx;
		word-break: break-all;
	}

	.spec-card__btn-copy {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		width: 380rpx;
		margin: 0 auto;
		margin-top: 40rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		background-color: #FFD940;
		border-radius: 9999rpx;

		.iconfont {
			margin-left: 8rpx;
			font-size: inherit;
			color: inherit;
		}
	}
</style>
