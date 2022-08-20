<template>
	<view class="" :style="themeColor">
		<!-- :style="{'height':pageHeight+'px','background-image':getImageRoot('19.png','url')}" -->
		<view class="page main-bg-color">
			<view class="cosult-contet" v-if="detail">
				<view class="cosult-main t-c" :style="{'background-image':getImageRoot('95.png','url')}">
					<view class="cosult-title f-36 m-btm40 col-3">在线咨询,添加客服</view>
					<!-- #ifdef MP-ALIPAY || MP-TOUTIAO -->
					<!-- <image src="" mode=""></image> -->
					<view class="col-3 f-30 m-btm10">{{detail.kf_phone}}</view>
					<view class="ctrl-wx m-btm60">
						<text class="ctrl-wx-btn f-24" @click="callPhone(detail.kf_phone)">联系客服</text>
					</view>
					<!-- #endif -->
					<!-- #ifndef MP-ALIPAY || MP-TOUTIAO -->
					<view class="code-imag m-btm60">
						<image :src="detail.kf_qr[0].file_path" @click="previewImage"></image>
					</view>
					
					<view v-if="detail.kf_wxid" class="popup-btns clear">
						<view class="ai lf">
							<view class="content-title-icon f-40">
								<i class="iconfont icon-weixin"></i>
							</view>
							<view class="f-28">{{detail.kf_wxid}}</view>
						</view>
						<button @click="ctrlwx"  class="popup-btn f-24 popup-phone">复制</button>
					</view>
					<view v-if="detail.kf_phone" class="popup-btns clear">
						<view class="ai lf">
							<view class="content-title-icon f-40">
								<i class="iconfont icon-mobile"></i>
							</view>
							<view class="f-28">{{detail.kf_phone}}</view>
						</view>
						<button @click="callPhone(detail.kf_phone)"  class="popup-btn f-24 popup-phone">拨打</button>
					</view>
					<!-- <view class="col-3 f-30 m-btm10">{{detail.kf_wxid}}</view>
					<view class="ctrl-wx m-btm60 main-border-color">
						<text class="ctrl-wx-btn f-24 main-color " @click="ctrlwx">复制微信号</text>
					</view>
					<view class="hint f-24 col-6">
						<view>点击图片长按保存二维码或者复制微信号</view>
						<view class="m-top-btm10">添加客服微信</view>
						<view>我们会最快时间回复您</view>
					</view> -->
					<!-- #endif -->
					
					<view class="left-top-img"><image :src="getImageRoot('94.png')" mode=""></image></view>
					<view class="service-img"><image :src="getImageRoot('93.png')" mode=""></image></view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				pageHeight: null
			};
		},
		components: {

		},
		computed: {
			detail() {
				return this.$store.state.appSetting;
			}
		},
		onLoad(options) {

		},
		mounted() {
			let _this = this,
				pageHeight = uni.getSystemInfoSync().windowHeight;
			this.pageHeight = pageHeight;
		},
		methods: {
			ctrlwx() {
				App.copyTextHandle(this.detail.kf_wxid);
			},
			previewImage() {
				let path = this.detail.kf_qr[0].file_path;
				uni.previewImage({
					urls: [path]
				});
			},
			callPhone(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber: String(phoneNumber)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		width: 100vw;
		height: 100vh;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.cosult-contet {
		padding-top: 40rpx;
		position: relative;
	}

	.cosult-main {
		border-radius: 6upx;
		height: 904rpx;
		padding-top: 100rpx;
		background-size: 717rpx 1004rpx;
		background-repeat: no-repeat;
	}

	.cosult-title {
		font-weight: bold;
		position: relative;
		&::before {
			position: absolute;
			left: 218rpx;
			top: 0rpx;
			display: block;
			content: "\20";
			width: 30rpx;
			height: 30rpx;
			border-radius: 25rpx;
			background-color: var(--theme-color, #FFD940);
			z-index: 1;
			opacity: 0.8;
		}
		&::after {
			position: absolute;
			right: 217rpx;
			top: 30rpx;
			display: block;
			content: "\20";
			width: 18rpx;
			height: 18rpx;
			border-radius: 25rpx;
			background-color: var(--theme-color, #FFD940);
			z-index: 1;
			opacity: 0.8;
		}
	}

	.code-imag {
		position: relative;
		width: 360upx;
		height: 360upx;
		border: 2px solid #E5E5E5;
		border-radius: 6upx;
		margin: 0 auto 40upx auto;

	}

	.code-imag image {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 340upx;
		height: 340upx;
	}

	.ctrl-wx .ctrl-wx-btn {
		display: inline-block;
		width: 160upx;
		height: 50upx;
		line-height: 50upx;
		color: #FFD940;
		background: rgba(255, 247, 213, 1);
		border: 1px dashed rgba(255, 217, 64, 1);
		border-radius: 6upx;
		border-color: var(--theme-color);
	}
	
	.content-title-icon{
		width: 50rpx;
		height: 50rpx;
		position: relative;
		top: 2rpx;
		z-index: 1;
		overflow: visible;
		margin-right: 10rpx;
		.iconfont{
			font-size: 40rpx;
		}
		&::before {
			position: absolute;
			right: 4rpx;
			top: 4rpx;
			display: block;
			content: "\20";
			width: 25rpx;
			height: 25rpx;
			border-radius: 25rpx;
			background-color: var(--theme-color, #FFD940);
			z-index: -1;
		}
	}
	.popup-btns{
		width: 444rpx;
		position: relative;
		padding: 10rpx;
		margin: 10rpx auto;
		background: rgba(248,248,248,1);
	}
	.popup-btn{
		height: 40rpx;
		line-height: 40rpx;
		padding: 0 12rpx;
		background: val(--theme-color);
		border-radius:4rpx;
		float: right;
		margin: 0;
		margin-top: 6rpx;
		position: absolute;
		right: 10rpx;
		top: 10rpx;
		&.popup-copy{
			color: var(--auxiliary-color);
			background-color: var(--theme-color, #FFD940);
		}
		&.popup-phone{
			color: var(--auxiliary-color);
			background-color: var(--theme-color, #FFD940);
		}
	}
	
	
	.left-top-img {
		width: 16rpx;
		height: 66rpx;
		position: absolute;
		top: 71rpx;
		left: 45rpx;
	}
	.left-top-img image {
		width: 100%;
		height: 100%;
	}
	.service-img {
		width: 297rpx;
		height: 377rpx;
		position: fixed;
		bottom: -10rpx;
		right: 85rpx;
	}
	.service-img image{
		width: 100%;
		height: 100%;
	}
</style>
