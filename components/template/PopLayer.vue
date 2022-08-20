<!-- popup 弹窗 -->
<template>
	<view :style="themeColor">
		<popup-view :upTop50="false" :show="show" :overlay="overlay" type="center" @clickmask="closeBtn">
			<view class="community-detail b-f t-c p-r">
				<!-- <view class="iconfont icon-roundclose"></view> -->
				
				<!-- 弹窗顶部标题 -->
				<view class="popup-header-box">
					<view class="popup-header">
						<view v-if="topTitle" class="num-height-1 f-36">{{topTitle}}</view>
						<view v-else>
							<image style="width:100rpx;margin-top: 10rpx;" mode='widthFix' :src="getImageRoot('90.png')"></image>
						</view>
					</view>
				</view>
				
				<view class="popup-body-box">
					<view style="min-height:200rpx;">
						<!-- 标题 -->
						<view class="popup-header-title f-26">
							<slot></slot>
						</view>
						
						<!-- <view v-if="title" class="popup-header-title f-26" v-html="title"></view> -->
						
						<view class="popup-image-box">
							<image v-if="imgSrc" mode='widthFix' class="popup-image" :src="imgSrc"></image>
							<view v-else class="popup-image-not"></view>
						</view>
						
						
						<!-- #ifdef H5 -->
							<view v-if="isShowLongPressBtn && !phone" class="col-9 f-24" style="margin:6rpx 0;">长按识别二维码</view>
							<view v-if="!isShowLongPressBtn" class="col-9 f-24" style="margin:6rpx 0;">联系客服</view>
						<!-- #endif -->
						<!-- #ifdef MP -->
							<view v-if="isShowSaveBtn" @click="saveimages(imgSrc)" class="col-9 f-24 save-img">点击保存二维码</view>
						<!-- #endif -->
						
						<!-- 只有公众号才有这个 -->
						<view v-if="wechat && communityType == 3" class="popup-btns clear">
							<view class="ai lf">
								<view class="content-title-icon f-40">
									<i class="iconfont icon-message"></i>
								</view>
								<view class="f-28">{{wechat}}</view>
							</view>
							<button @click.stop="ctrlorder(wechat)" class="popup-btn f-24 popup-copy">复制</button>
						</view>
						<view v-if="phone" class="popup-btns clear">
							<view class="ai lf">
								<view class="content-title-icon f-40">
									<i class="iconfont icon-mobile"></i>
								</view>
								<view class="f-28">{{phone}}</view>
							</view>
							<button  @click.stop="storeMobile(phone)" class="popup-btn f-24 popup-phone">拨打</button>
						</view>
					</view>
					<!-- #ifdef MP-WEIXIN -->
					<button 
					v-if="footBtnText" 
					:show-message-card="true" 
					class="community-reply f-24 col-3" 
					open-type="contact"
					:send-message-path="pagePath"
					:send-message-title="sendMessageTitle || ''"
					:send-message-img="sendMessageImg || ''"
					>{{footBtnText}}</button>
					<!-- #endif -->
				</view>
			</view>
			<!-- 关闭按钮 -->
			<view v-if="showClose" @click="closeBtn" class="popup-close">
				<i class="iconfont icon-round_close_light"></i>
			</view>
		</popup-view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import PopupView from "@/components/template/PopManager.vue"
	export default {
		data(){
			return {
	
			}
		},
		components:{
			PopupView
		},
		props:{
			show: {
				type: Boolean,
				default: false
			},
			// 是否显示底部关闭按钮
			showClose: {
				type: Boolean,
				default: true
			},
			// 是否有遮罩层
			overlay:{
				type: Boolean,
				default: true
			},
			// 遮罩层是否会显示
			showOverlay: {
				type: Boolean,
				default: true
			},
			// 顶部标题
			topTitle: {
				type: String,
				default: ''
			},
			// 是否显示 保存图片（小程序）
			isShowSaveBtn: {
				type: Boolean,
				default: false
			},
			// 是否显示 长按保存（h5）
			isShowLongPressBtn: {
				type: Boolean,
				default: false
			},
			// 二维码地址
			imgSrc: {
				type: String,
				default: ''
			},
			// 客服微信号
			wechat: {
				type: String,
				default: ''
			},
			// 客服电话
			phone: {
				type: String,
				default: ''
			},
			// 底部按钮文字
			footBtnText: {
				type: String,
				default: ''
			},
			//  页面链接
			pagePath: {
				type: String,
				default: ''
			},
			// 会话内消息卡片标题，open-type="contact"时有效
			sendMessageTitle: {
				type: String,
				default: ''
			},
			// 会话内消息卡片图片，open-type="contact"时有效
			sendMessageImg: {
				type: String,
				default: ''
			},
			// 客服类型 1社群 2客服 3公众号 4电话
			communityType: {
				type: Number,
				default: 0
			}
		},
		methods:{
			// 点击保存图片
			saveimages(poster_images){
				uni.showLoading({title: '加载中'});
				let _this = this;
				// #ifdef MP-ALIPAY
				my.saveImage({
					url: poster_images,
					complete() {
						uni.hideLoading();
					}
				});
				// #endif
				// #ifndef H5 || MP-ALIPAY
				_this.getImageTempFile(poster_images).then(filePath => {
					uni.saveImageToPhotosAlbum({
						filePath,
						success() {
							App.showSuccess('保存成功');
						},
						complete(res) {
							uni.hideLoading();
							if (res.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || res.errMsg ===
								"saveImageToPhotosAlbum:fail auth deny") {
								App.showError("获取权限失败,请重试");
							}
						}
					});
				})
				// #endif
			},
			// 获取本地图片路径
			getImageTempFile(tempFilePaths) {
				return new Promise((resolve, reject) => {
					if (tempFilePaths.includes("https") || tempFilePaths.includes("http")) {
						uni.getImageInfo({
							src: tempFilePaths,
							success(image) {
								resolve(image.path);
							},
							fail() {
								uni.hideLoading();
								App.showError("图片获取失败,请确认图片域名已加入小程序downloadFile合法域名列表中");
							}
						});
					} else {
						resolve(tempFilePaths)
					}
				})
			},
			// 复制
			ctrlorder(ordercode) {
				App.copyTextHandle(ordercode);
			},
			// 拨打电话
			storeMobile(phone){
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			// 关闭
			closeBtn(){
				this.$emit('closePopupBtn')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-header-box { 
		margin: auto; 
		overflow: hidden; 
		.popup-header{
			position: relative; 
			text-align: center; 
			width: 100%; 
			height: 100rpx; 
			line-height: 100rpx;
			z-index: 999;
			font-weight: bold;
			color: var(--auxiliary-color);
			
			&:after { 
				width: 100%; 
				height: 100rpx; 
				position: absolute; 
				left: 0; 
				top: 0; 
				z-index: -1;
				content: ''; 
				border-radius: 0 0 50% 50%; 
				background-color: var(--theme-color);
			}
		}
	}
	.popup-body-box{
		padding: 0 20rpx;
		text-align: center;
	}
	.save-img{
		margin:6rpx 0;
		border:1rpx solid #999999;
		display:inline-block;
		padding:4rpx 10rpx;
		border-radius: 4rpx;
	}
	.popup-header-title{
		text-align: center;
		line-height: 40rpx;
		padding: 30rpx 60rpx;
	}
	.popup-image-box{
		.popup-image{
			width: 70vw;
			max-height: 70vw;
		}
		.popup-image{
			width: 70vw;
			min-height: 10vw;
		}
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
		position: relative;
		padding: 10rpx;
		margin: 10rpx 0;
		background: rgba(248,248,248,1);
	}
	.popup-btn{
		height: 40rpx;
		line-height: 40rpx;
		padding: 0 12rpx;
		// background:rgba(38,181,12,1);
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
	.popup-close{
		color: #f00;
		position: absolute;
		bottom: -80rpx;
		left: 50%;
		margin-left: -25rpx;
		i{
			font-size: 50rpx;
			color: #FFFFFF;
			font-weight: bold;
		}
	}
	.community-detail {
		width: 565rpx;
	 min-height: 370rpx;
		border-radius: 20rpx;
		padding-bottom: 35rpx;
		overflow: hidden;
	 
		// .icon-roundclose {
		// 	position: absolute;
		// 	left: 50%;
		// 	bottom: -2em;
		// 	width: 1em;
		// 	height: 1em;
		// 	line-height: 1em;
		// 	color: #FFFFFF;
		// 	transform: translateX(-50%);
		// }
	
		.community-header {
			width: 70vw;
			height: 210rpx;
			background-size: 100% 100%;
		}
	
		.community-body {
			padding: 50rpx;
		}
	
		.community-reply {
			width: 200rpx;
			height: 70rpx;
			line-height: 70rpx;
			background: #FFD941;
			border-radius: 35rpx;
			margin: 0 auto;
			margin-top: 18rpx;
		}
	}
</style>
