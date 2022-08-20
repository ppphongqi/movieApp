<template>
	<popup-view class="spec-popup" :show="dVisible" type="center" :zIndex="999" @clickmask="dVisible = false">
		<view class="spec-card" @touchmove.stop.prevent>
			<!-- content -->
			<view class="spec-card__content">
				<image class="spec-card__poster" :src="posterUrl"></image>
			</view>
			<!-- content end -->
			<!-- footer -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="spec-card__footer app-flex app-flex--align-center app-flex--justify-center m-top-btm40">
				<view class="app-flex-item">
					<button class="btn-normal spec-card__btn-outline">保存图片</button>
				</view>
				<view class="app-flex-item">
					<button class="btn-normal spec-card__btn-op">分享给好友</button>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="spec-card__footer app-flex app-flex--align-center app-flex--justify-center m-top-btm40">
				<view class="app-flex-item col-f">
					长按图片保存
				</view>
			</view>
			<!-- #endif -->
			<!-- footer end -->
		</view>
	</popup-view>
</template>

<script>
	import Poster from './Poster.vue'
	import PopupView from '@/components/template/PopManager.vue'
	export default {
		components: {
			PopupView,
			Poster
		},
		props: {
			// 默认是否显示v-model
			value: {
				type: Boolean,
				default: false
			},
			// 图片地址
			posterUrl: {
				type: String,
				default: 'http://placekitten.com/750/750'
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
	}

	.spec-card__content {
		width: 690rpx;
		height: 690rpx;
		border-radius: 20rpx;
		background-color: #ffff;
	}
	.spec-card__poster {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}
	.spec-card__btn-op {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 200rpx;
		height: 60rpx;
		border-radius: 999rpx;
		font-size: 28rpx;
		color: #333;
		background-color: #ffd940;
	}
	.spec-card__btn-outline {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 200rpx;
		height: 60rpx;
		border-radius: 999rpx;
		font-size: 28rpx;
		color:#fff;
		border: 1px solid currentColor;
		background-color: transparent;
	}
</style>
