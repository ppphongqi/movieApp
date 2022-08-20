<template>
	<popup-view class="rights-popup" :show="dVisible" type="center" @clickmask="dVisible = false">
		<view class="rights-card" :style="{'background-image':getImageRoot('99.png','url')}">
			<view class="rights-card__header">
				
			</view>
			<view class="rights-card__content">
				最高立减{{amount}}元
			</view>
			<view class="rights-card__footer padding-box-all">
				<view class="rights-card__btn-go app-btn-large" @click="$emit('btnGoClick')">点击立减</view>
			</view>
			<!-- <view class="rights-popup__btn-close iconfont icon-searchclose" @click="dVisible = false"></view> -->
		</view>
	</popup-view>
</template>

<script>
	import PopupView from '@/components/template/PopManager.vue'
	export default {
		components: {
			PopupView,
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
			// 最高立减几元钱
			amount: {
				type: [String,Number],
				default: '0'
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
		box-sizing: border-box;
		position: relative;
		width: 612rpx;
		height: 762rpx;
		padding-top: 268rpx;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
	}
	
	.rights-popup__btn-close {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		font-size: 36rpx;
		text-align: center;
	}
	.rights-card__content {
		font-size: 36rpx;
		font-weight: bold;
		color: #FFF2B6;
		text-align: center;
	}
	.rights-card__btn-go {
		position: absolute;
		top: 440rpx;
		left: 50%;
		height: 120rpx;
		width: 280rpx;
		transform: translateX(-50%);
		border-radius: 999rpx;
		opacity: 0;
	}
</style>
