<template>
	<popup-view class="rights-popup" :show="dVisible" type="center" @clickmask="dVisible = false">
		<view class="rights-card">
			<view class="rights-card__header">
				{{title}}
			</view>
			<scroll-view scroll-y class="rights-card__content">
				<view class="rights-card__scroll__content">
					<parse :html="text"></parse>
				</view>
			</scroll-view>
			<view class="rights-card__footer padding-box-all">
				<button class="app-btn-large" style="width: auto;" @click="dVisible = false">我知道了！</button>
			</view>
			<!-- <view class="rights-popup__btn-close iconfont icon-searchclose" @click="dVisible = false"></view> -->
		</view>
	</popup-view>
</template>

<script>
	import PopupView from '@/components/template/PopManager.vue'
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	export default {
		components: {
			PopupView,
			Parse
		},
		props: {
			// 默认是否显示v-model
			value: {
				type: Boolean,
				default: false
			},
			// 标题
			title: {
				type: String,
				default: ''
			},
			// 富文本
			text: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				dVisible: this.value
			}
		},
		watch: {
			value(val) {
				this.dVisible = val
			},
			dVisible(val) {
				this.$emit('input',val)
			}
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	

	.rights-card {
		position: relative;
		width: 630rpx;
		border-radius: 20rpx 20rpx;
		background-color: #fff;
	}

	.rights-card__header {
		box-sizing: border-box;
		display: flex;
		min-height: 120rpx;
		padding: 0 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 40rpx;
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
		text-align: center;
	}

	.rights-card__content {
		height: 600rpx;
		box-sizing: border-box;
		padding: 30rpx 40rpx;
	}
	
	.rights-popup__btn-close {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		font-size: 36rpx;
		text-align: center;
	}
</style>
