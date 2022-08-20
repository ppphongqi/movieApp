<template>
	<view v-if="cVisible" class="c-FollowImgPopup">
		<PopupView v-if="cVisible" :show="true" type="center">
			<view class="c-FollowImgPopup-card">
				<image class="c-FollowImgPopup-card__img" mode="widthFix" :src="cImgUrl" />
			</view>
			<view class="iconfont icon-close c-FollowImgPopup__close" @click="handleBtnClick"></view>
		</PopupView>
	</view>
</template>

<script>
	import PopupView from '@/components/template/PopManager.vue'
	export default {
		components: {
			PopupView
		},
		props: {
			// 默认是否显示，默认显示
			visible: {
				type: Boolean,
				default: true
			},
			// 关注图片的路径
			imgUrl: {
				type: String,
				default: ''
			}
		},
		computed: {
			// 最终的图片路径
			cImgUrl() {
				if(this.imgUrl) {
					return this.imgUrl
				}
				return this.$util.deepGet(this.settingData,'qzgz_logo','')
			},
			// 最终需不需要显示
			cVisible() {
				// visible为truth且最终的图片路径存在
				return this.visible && this.cImgUrl
			}
		},
		methods: {
			handleBtnClick() {
				window.location.reload()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-FollowImgPopup-card__img {
		width: 690rpx;
		height: auto;
	}
	.c-FollowImgPopup__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50rpx;
		height: 50rpx;
		margin: 0 auto;
		margin-top: 40rpx;
		background-color: rgba(#fff,0.8);
		border-radius: 100%;
	}
</style>
