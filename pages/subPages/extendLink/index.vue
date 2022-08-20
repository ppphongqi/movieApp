<template>
	<view class="extend-link" :style="themeColor">
		<!-- 顶部菜单栏 -->
		<view class="extend-navbar f-28">
			<view class="text" @click="handledChatClick">
				<view :class="{navBarSelect:isActive == weChat}" class="left-text">公众号</view>
				<view class="select-nav"><image :class="{active:isActive == weChat}" class="select-nav-img" src="/static/images/br1.png"></image></view>
			</view>
			<view class="text" @click="handledAppClick">
				<view :class="{navBarSelect:isActive == wxApp}" class="right-text">小程序</view>
				<view class="select-nav"><image :class="{active:isActive == wxApp}" class="select-nav-img" src="/static/images/br1.png"></image></view>
			</view>
		</view>
		<!-- 专属链接部分 -->
		<view class="center-box">
			<view class="only-link" :style="{'background-image':getImageRoot('84.png','url')}">
				<view class="only-link-text f-28">专属链接</view>
				<view class="only-link-address">
					<view v-if="isActive == 0" class="only-link-address-center f-28">{{extendRes['weChat_url']}}</view>
					<view v-else class="only-link-address-center f-28">{{extendRes['wxApp_url']}}</view>
				</view>
				<view @click="copyLink(isActive)" class="only-link-button f-26">点击复制链接</view>
			</view>
		</view>
		<!-- 专属二维码部分 -->
		<view class="only-code-text f-28">
			<view class="text-left"></view>
			<view class="text-center">专属二维码</view>
			<view class="text-right"></view>
		</view>
		<view class="only-code-imgtext f-26">
			<view v-if="isActive == 0" class="only-code-qrcode" :style="{backgroundImage: 'url(' + extendRes['weChat_qrcode'] + ')'}"></view>
			<view v-else class="only-code-qrcode" :style="{backgroundImage: 'url(' + extendRes['wxApp_qrcode'] + ')'}"></view>
			<view @click="saveimages(isActive)" class="only-code-button">保存专属二维码</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import PopupView from "@/components/template/PopManager.vue"
	import {
		wxRequestSubscribeMessageX
	} from '@/common/js/wxPromise.js'
	export default {
		data() {
			return {
				// 公众号专属链接地址数据
				extendRes : [],
				isActive: 0,
				weChat: 0,
				wxApp:1,
				poster_images: null,
				// 
				
			}
		},
		mounted() {
			this.fetchExtendRes()
		},
		methods: {
			// 请求推广链接的接口数据
			async fetchExtendRes() {
				try {
					const res = await App._postP('user.dealer.User/getDistributionExtension')
					this.extendRes = this.$util.deepGet(res, 'data') || []
					console.log(this.extendRes)
				} catch (e) {
					console.log(112231231212, e)
					//TODO handle the exception
				}
			},
				
			handledChatClick: function() {
				this.isActive = 0
			},
			handledAppClick: function() {
				this.isActive = 1
			},
			// 点击保存链接
			copyLink: function(isActive) {
				if(isActive == 0) {
					uni.setClipboardData({
						data: this.extendRes['weChat_url'],
						success() {
							// #ifdef MP-ALIPAY || H5 || MP-TOUTIAO
							uni.showToast({
								title: "复制成功"
							})
							// #endif
						}
					});
				}else {
					uni.setClipboardData({
						data: this.extendRes['wxApp_url'],
						success() {
							// #ifdef MP-ALIPAY || H5 || MP-TOUTIAO
							uni.showToast({
								title: "复制成功"
							})
							// #endif
						}
					});
				}
			},
			// 点击保存图片
			saveimages(isActive) {
					if(isActive == 0) {
						this.poster_images = this.extendRes['weChat_qrcode']
					}else {
						this.poster_images = this.extendRes['wxApp_qrcode']
					}
					uni.showLoading({title: '加载中'});
					let _this = this,
						poster_images = this.poster_images;
					// #ifdef H5
					_this.downloadIamge(poster_images);
					// #endif
					// #ifdef MP-ALIPAY
					my.saveImage({
						url: poster_images,
						complete() {
							uni.hideLoading();
						}
					});
					// #endif
					// #ifndef H5 || MP-ALIPAY
					// uni.getImageInfo({
					// 	src: poster_images,
					// 	success(image) {
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
									_this.openSetting = true;
								}
							}
						});
					})
				
					// 	},
					// 	fail() {
					// 		uni.hideLoading();
					// 		App.showError("图片获取失败,请确认图片域名已加入小程序downloadFile合法域名列表中");
					// 	}
					// });
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
		}	
	}
</script>

<style lang="scss" scoped>
	.extend-navbar{
		display: flex;
		margin-bottom: 40rpx;
		padding-top: 56rpx;
	}
	.extend-navbar .text {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #999999;
	}
	.navBarSelect {
		color: #333333;
	}
	.left-text,.right-text {
		width: 82rpx;
		height: 26rpx;
	}
	.select-nav {
		width: 46rpx;
		height: 7rpx;
	}
	.select-nav-img {
		height: 100%;
		width: 100%;
		margin-top: 14rpx;
	}
	.active {
		background: var(--theme-color);
	}
	.center-box {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 38rpx;
	}
	.only-link {
		display: flex;
		align-items: center;
		flex-direction: column;
		width:679rpx;
		height:420rpx;
		box-shadow:0rpx 2rpx 30rpx 0rpx rgba(153,153,153,0.15);
		background-size: 679rpx 420rpx;
	}	
	.only-link-text {
		width: 110rpx;
		height: 28rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 69rpx;
		color:#333333;
	}
	.only-link-address {
		width: 560rpx;
		height: 112rpx;
		background:rgba(248,248,248,1);
		border-radius:4rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 40rpx 0;
	}
	.only-link-address-center {
		width: 489rpx;
		height: 70rpx;
		color: #999999;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		word-break:break-all;
		display: -webkit-box;    
		-webkit-box-orient: vertical;    
		-webkit-line-clamp: 2;    
		overflow: hidden;
	}
	.only-link-button {
		width: 190rpx;
		height: 52rpx;
		border-radius:4rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--theme-color);
		color:#333333;
		line-height:40rpx;
	}
	
	.only-code-text{
		width: 668rpx;
		height: 28rpx;
		margin: 0 41rpx;
		display: flex;
		justify-content: center;	
		align-items: center;
	}
	.text-center {
		width: 138rpx;
		height: 40rpx;
		line-height: 40rpx;
	}
	.text-left,.text-right {
		width:238rpx;
		height:1rpx;
		background:rgba(238,238,238,1);
	}
	.text-left {
		margin-right: 27rpx;
	}
	.text-right {
		margin-left: 27rpx;
	}
	.only-code-imgtext {
		margin-top: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: #999999;
	}
	.only-code-qrcode {
		width: 330rpx;
		height: 330rpx;
		background-size: 330rpx 330rpx;
		margin-bottom: 41rpx;
	}
	.only-code-button {
		width: 220rpx;
		height: 52rpx;
		line-height: 52rpx;
		text-align: center;
		border:1px solid rgba(238,238,238,1);
		border-radius:4px;
	}
</style>
