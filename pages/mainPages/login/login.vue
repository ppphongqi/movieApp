<template>
	<view class="container" :style="themeColor">
		<view class="wechatapp">
			<!-- <image class="header" src="/images/wechatapp.png"></image> -->
			<view class="header">
				<image :src="appLogo"></image>
				<view class="app-name t-c f-26 col-3">{{appName}}</view>
			</view>
		</view>
		<view class="auth-title">申请获取以下权限:</view>
		<view class="auth-subtitle">•获得你的公开信息（昵称、头像等）</view>
		<view class="dis-flex flex-x-around">
			<button class="login-btn login-cancel" @click="cancelLogin">取消登录</button>
			<!-- #ifdef MP-WEIXIN -->
			<button v-if="canIUseGetUserProfile" class="login-btn main-bg-color auxiliary-color" :disabled="disabled" @click="getUserProfile">授权登录</button>
			<button v-else class="login-btn main-bg-color auxiliary-color" :disabled="disabled" open-type="getUserInfo" @getuserinfo="authorLogin">立即登录</button>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN  -->
			<button class="login-btn main-bg-color auxiliary-color" :disabled="disabled" @click="authorLogin">授权登录</button>
			<!-- #endif -->
		</view>

	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	export default {
		data() {
			return {
				disabled: false,
			};
		},
		onLoad(options) {},
		onShareAppMessage(res) {
			return {
			      title: '',
			      path: '/pages/mainPages/index/index'
			    }
			
		},
		mounted() {

		},
		methods: {
			/**
			 * 取消登录
			 */
			cancelLogin() {
				const self = this
				uni.navigateBack({
					fail() {
						// 跳转到首页
						self.navigationTo('pages/mainPages/index/index')
					}
				})
			},
			getUserProfile(e) {
			    
			    wx.getUserProfile({
				  desc: '用于完善用户资料',
				  success: (res) => {
					this.authorLogin({
						detail: res
					})
				  }
				})
			  },
			//1-导入 2-微信小程序 3-H5 4-公众号 5-安卓 6-苹果 7-支付宝小程序 8-百度小程序 9-头条小程序
			/**
			 * 授权登录
			 */
			authorLogin(e) {
				console.log('authorLogin',e)
				let _this = this,
					clientType = _this.$store.state.clientType;
				_this.disabled = true;
				// console.log("systemInfo", this.$store.state.systemInfo);
				if (clientType === "2") {
					if (e.detail.errMsg !== 'getUserInfo:ok' && e.detail.errMsg !== "getUserProfile:ok") {
						App.showError("登录失败,请重试：" + JSON.stringify(e));
						_this.disabled = false;
						return false;
					}
				}
				// #ifdef MP-WEIXIN
				_this.userLogin("weixin", e.detail);
				console.log( e.detail,'用户信息==============')
				// #endif
				
				// #ifndef MP-WEIXIN
				uni.getProvider({
					service: 'oauth',
					success(res) {
						console.log("getProvider---------", res.provider);
						_this.userLogin(res.provider[0], e.detail);
					}
				});
				// #endif

			},

			/**
			 * 获取用户登录信息
			 * @param {Object} encryptionData 加密用户信息
			 */
			getLoginData(provider, encryptionData) {
				let _this = this;
				return new Promise((resolve, reject) => {
					if (encryptionData.iv && encryptionData.encryptedData) {
						resolve(encryptionData)
					} else {
						uni.getUserInfo({
							// provider,
							withCredentials: true,
							complete(optinos) {
								//是否获取成功
								if (!!optinos.iv || provider === "alipay") {
									if (!optinos.encryptedData && !!optinos.data) {
										optinos.encryptedData = optinos.data;
									}
									resolve(optinos)
								} else {
									reject();
								}
							}
						})
					}
				})
			},

			/**
			 * 用户登录操作
			 */
			userLogin(provider, loginData) {
				console.log('userLogin111',provider, loginData)
				let _this = this,
					clientType = _this.$store.state.clientType,
					postData = {}; //登录所需参数
				uni.showLoading({
					title: "正在登录",
				});
				//登录
				uni.login({
					provider,
					scopes: "auth_user",
					success(res) {
						postData.code = res.code;
						_this.getLoginData(provider, loginData).then(data => {
							if (clientType !== "7") {
								postData = Object.assign(postData, {
									user_info: data.rawData || "",
									encrypted_data: data.encryptedData,
									iv: data.iv,
									signature: data.signature || ""
								})
							}
							if (clientType === "7") {
								postData = Object.assign(postData, {
									nickName: data.userInfo.nickName || "",
									avatarUrl: data.userInfo.avatarUrl
								});
							}
							if (clientType === "9") {
								let systemInfo = _this.$store.state.systemInfo;
								postData.source_name = systemInfo.appName;
							}
							if(loginData.userInfo && loginData.userInfo.nickName) {
								postData.user_info = JSON.stringify(loginData.userInfo)
								console.log('新版微信API登录',{loginData,postData})
							}
							// 发送用户信息
							_this.getUserInfo(postData);
						}).catch((e) => {
							console.log('userLogin err 222222',e)
							//拒绝获取用户信息后操作
							_this.disabled = false;
							if (clientType === "9") { //头条小程序
								//用户拒绝授权后，需要打开用户设置页面才能再次调起getUserInfo
								uni.showModal({
									title: "登录失败",
									content: "请点击确定允许授权后,重新登录",
									success(result) {
										if (result.confirm) {
											uni.openSetting({
												success(res) {
													if (res.authSetting["scope.userInfo"]) {
														App.showError("授权成功,请重新登录");
													}
												}
											});
										}

									}
								});
							} else {
								App.showError("登录失败,请重试。详情："+JSON.stringify(e)+JSON.stringify(res));
							}
						});
					}
				});
			},

			/**
			 * 获取用户信息
			 */
			getUserInfo(postData) {
				console.log('getUserInfo111',postData)
				let _this = this;
				App._post_form('user/login', {
					...postData,
					referee_id: _this.$store.state.refereeId
				}, result => {
					let {
						token,
						user_id,
						status
					} = result.data;
					_this.disabled = false;
					//设置用户信息
					App.setUserinfo(token, user_id, status);
					//绑定分销上下级关系
					if (App.getRefereId()) {
						App.saveRefereeQuest()
					}
					// 跳转回原页面
					_this.navigateBack();
				}, false, () => {
					uni.hideLoading();
				});
			},


			/**
			 * 授权成功 跳转回原页面或者回到首页
			 */
			navigateBack() {
				let _this = this,
					clientType = _this.appClientType,
					pages = getCurrentPages(),
					prevPages = pages[pages.length - 2],
					currentOptins = uni.getStorageSync("currentPage").options;
				if (!currentOptins) {
					currentOptins = {};
				}
				currentOptins.pageLogin = 1;
				//清除登录缓存信息
				App.removeCurrentPage();
				//获取页面分享设置
				_this.$store.dispatch("getShareSetting");
				if(!prevPages) {
					_this.navigationTo('pages/mainPages/index/index')
				} else if (prevPages.route === "pages/subPages/write/write") {
					uni.reLaunch({
						url: "/pages/mainPages/index/index"
					})
				} else {
					let prevInstance = (clientType === "3" || clientType === "4") ? prevPages : (clientType === "2" || clientType ===
						"7" || clientType === "9") ? prevPages.$vm : prevPages.rootVM;
					//处理字节跳动小程序，手动调用onLoad函数之后，无法获$refs问题
					// #ifdef MP-TOUTIAO
					if (prevPages.route !== "pages/subPages/flow/checkout") {
						prevPages.onLoad(currentOptins);
					}
					// #endif
					// #ifndef MP-TOUTIAO
					if ("pageLoad" in prevInstance) {
						prevInstance.pageLoad(currentOptins)
					} else {
						prevPages.onLoad(currentOptins);
					}
					// #endif
					uni.navigateBack();
				}
			},
		}
	}
</script>

<style>
	page {
		background: #fff;
		font-size: 32upx;
	}

	.container {
		padding: 0 60upx;
	}

	.wechatapp {
		padding: 15% 0px 10%;
		border-bottom: 1upx solid #e3e3e3;
		margin-bottom: 45upx;
		text-align: center;
	}

	.wechatapp .header {
		margin: 0 auto;
	}

	.wechatapp .header .app-name {
		margin-top: 30upx;
	}

	.wechatapp .header image {
		width: 100upx;
		height: 100upx;
		margin: 0 auto;
		display: block;
		border-radius: 50%;
		border: 2px solid #fff;
		box-shadow: 1px 0px 5px rgba(50, 50, 50, 0.3);
		background-size: 100% 100%;
	}

	.auth-title {
		color: #585858;
		font-size: 28upx;
		margin-bottom: 40upx;
	}

	.auth-subtitle {
		color: #999;
		margin-bottom: 72upx;
		font-size: 22upx;
	}

	.login-btn {
		border: none;
		height: 80upx;
		line-height: 80upx;
		background: #FFD940;
		color: #333333;
		font-size: 28rpx;
		border-radius: 6upx;
		width: 45%;
	}

	.login-btn::after {
		display: none;
	}

	.login-btn.button-hover {
		/* box-shadow: inset 0 5upx 30upx rgba(0, 0, 0, 0.15); */
	}

	.login-btn.login-cancel {
		color: #333;
		background: #fff;
		border: 1px solid #333;
	}
</style>
