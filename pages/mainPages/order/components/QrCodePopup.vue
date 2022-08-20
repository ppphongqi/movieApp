<template>
	<popup-view class="c-popup" :show="dVisible" type="center" @clickmask="dVisible = false">
		<view class="c-card">
			<view class="c-card__header">
				{{title}}
			</view>
			<scroll-view scroll-y class="c-card__content">
				<view class="c-card__scroll__content">
					<view class="app-flex app-flex--justify-center">
						<image v-if="image" :src="image" mode="" style="width: 370rpx; height: 370rpx;"></image>
						<view v-else>加载中...</view>
					</view>
				</view>
			</scroll-view>
			<view class="c-popup__btn-close iconfont icon-searchclose" @click="dVisible = false"></view>
		</view>
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
			// 标题
			title: {
				type: String,
				default: '商品核销'
			},
			// 富文本
			text: {
				type: String,
				default: '哈哈'
			},
			image: {
				type: String,
				default:''
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
	

	.c-card {
		position: relative;
		width: 630rpx;
		border-radius: 20rpx;
		background-color: #fff;
	}

	.c-card__header {
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

	.c-card__content {
		box-sizing: border-box;
		padding: 30rpx 40rpx;
	}
	
	.c-popup__btn-close {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		font-size: 36rpx;
		text-align: center;
	}
</style>
