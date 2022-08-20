<template>
	<popup-view class="rights-popup" :show="dVisible" type="center" @clickmask="dVisible = false">
		<view class="rights-card">
			<view class="rights-card__header">
				{{title}}
			</view>
			<scroll-view scroll-y class="rights-card__content">
				<view class="rights-card__scroll__content">
					{{text}}
				</view>
			</scroll-view>
			<view class="rights-card__footer padding-box-all">
				<view class="app-flex">
					<view class="app-flex-item" style="width: 170rpx;">
						<button class="app-btn-large--plain rights-card__btn-go" style="width: auto;" @click="dVisible = false">取消</button>
					</view>
					<view class="app-flex-item app-flex-item--1">
						<button class="app-btn-large rights-card__btn-go" style="width: auto;" @click="$emit('comfirm')">立即开通</button>
					</view>
				</view>
			</view>
			<!-- <view class="rights-popup__btn-close iconfont icon-searchclose" @click="dVisible = false"></view> -->
			<image class="rights-card__img-vip" src="../static/images/img-vip.png" mode=""></image>
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
				default: '暂未开通会员'
			},
			// 富文本
			text: {
				type: String,
				default: '请先开通会员再预约'
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
		padding-top: 70rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
		text-align: center;
	}

	.rights-card__content {
		box-sizing: border-box;
		padding: 30rpx 40rpx;
		text-align: center;
	}
	
	.rights-popup__btn-close {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		font-size: 36rpx;
		text-align: center;
	}
	.rights-card__btn-go {
		border-radius: 20rpx;
	}
	.rights-card__img-vip {
		position: absolute;
		right: 0;
		top: -70rpx;
		width: 200rpx;
		height: 209rpx;
	}
</style>
