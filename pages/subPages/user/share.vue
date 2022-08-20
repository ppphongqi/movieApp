<template>
	<view class="" :style="themeColor">
		
		<view class="page" :style="{'background-image':backgroundImage}">
			
			<!-- #ifdef H5 || MP-WEIXIN || MP-TOUTIAO -->
			<view class="diy-navigator" :style="{'top':backBtnHeight+'px'}">
				<view class="return-btn" @click="returnBtn">
					<text class="iconfont icon-fanhuijiantou col-f"></text>
				</view>
			</view>
			<!-- #endif -->
			<view class="share-btn-box">
				<view class="share-btn f-28 col-4 p-r main-bg-color auxiliary-color " @click="share">
					立即分享
					<!-- #ifdef MP-TOUTIAO || MP-ALIPAY -->
					<button class="report-btn " open-type="share"></button>
					<!-- #endif -->
				</view>
			</view>
		
			<!-- #ifdef H5 -->
			<share-guide ref="shareGuide"></share-guide>
			<!-- #endif -->
		
			<!-- 分享菜单 -->
			<share-view ref="shareView" :poster-type="shareType"></share-view>
		</view>
	</view>
	
</template>

<script>
	import pageShare from "@/common/js/pageShareMixin.js"
	import ShareView from "@/components/template/ShareView.vue"
	import App from "@/common/js/app.js"
	export default {
		mixins: [pageShare],
		data() {
			return {
				shareType: "",
			};
		},
		computed: {
			//设置返回按钮高度
			backBtnHeight() {
				// #ifdef MP-TOUTIAO
				return 0;
				// #endif
				// #ifndef MP-TOUTIAO
				return this.$store.state.systemInfo && this.$store.state.systemInfo.statusBarHeight;
				// #endif
			},
			getSingleShare() {
				return this.$store.getters.getSingleShare(this.shareType)
			},
			backgroundImage() {
				let {
					back_image: [back_image] = []
				} = this.getSingleShare || {};
				return !!back_image ? `url(${back_image.file_path})` : this.getImageRoot(this.shareType === 'member' ? '64.png' :
					'65.png', 'url');
			}
		},
		components: {
			ShareView,
		},
		onLoad(options) {
			this.shareType = options.shareType;
			let getSingleShare = this.getSingleShare;
			console.log('hahaha', getSingleShare);
			this.shareData = this.getPageShareData(options.shareType === "dealer" ? "dealer/index" : "member/index",
				getSingleShare);
			console.log('this.shareData',this.shareData)
	
		},
		methods: {
			/**
			 * 返回按钮
			 */
			returnBtn(e) {
				uni.navigateBack({
					delta: 1
				})
			},
			share() {
				// #ifndef MP-TOUTIAO || MP-ALIPAY
				this.$refs.shareView.shareswich();
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 108vh;
		position: relative;
		background-color: #FFFFFF;
		background-size: 100vw 100vh;
		background-repeat: no-repeat;

		.diy-navigator {
			position: fixed;
			left: 0;
			right: 0;
			padding: 0 20rpx;
			height: 88rpx;
			z-index: 100;

			.return-btn {
				position: absolute;
				left: 20rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 60rpx;
				height: 60rpx;
				line-height: 60rpx;
				border: 1px solid rgba(255, 255, 255, 0.1);
				border-radius: 50%;
				text-align: center;
				background-color: rgba(255, 255, 255, 0.6);
				z-index: 50;

				.icon-fanhuijiantou {
					position: relative;
					// left: 14%;
					color: #000000;
					font-weight: bold;
				}
			}
		}


		.share-btn-box {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #FFFFFF;
			height: 8vh;
		}

		.share-btn {
			width: 690rpx;
			height: 6vh;
			line-height: 6vh;
			margin: 1vh auto 0;
			text-align: center;
			background: #FFD940;
			border-radius: 6vh;
		}
	}
</style>
