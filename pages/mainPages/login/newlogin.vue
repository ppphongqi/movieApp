<template>
	<view :style="themeColor">
		<view class="login-container dis-flex flex-dir-column flex-y-center" :style="{'background-image':getImageRoot('5.png','url')}">
			<view class="login-logo">
				<image :src="appLogo" class="app-logo"></image>
			</view>
			<view class="login-type dis-flex flex-dir-row">
				<block v-if="loginType === 'forget'">
					<view class="login-item">忘记密码</view>
					<view class="login-back iconfont icon-back" @click="loginTypeChange('login')"></view>
				</block>
				<block v-else>
					<view class="login-item" :class="{'active':loginType === 'login'}" @click="loginTypeChange('login')">登录</view>
					<view class="login-item" :class="{'active':loginType === 'register' || loginType === 'success'}" @click="loginTypeChange('register')">注册</view>
				</block>
			</view>
			<view class="login-form b-f">
				<form @submit="formSubmit" report-submit="">
					<block v-if="loginType !== 'success'">
						<view class="form-item dis-flex flex-y-center">
							<view class="form-item-label">
								<image src="/static/images/login/denglushoujihao.png"></image>
							</view>
							<view class="form-item-input flex-box">
								<input type="number" name="mobile" v-model="mobile" placeholder="请输入手机号码" placeholder-class="input-place" />
							</view>
						</view>

						<block v-if="loginType === 'register' || loginType === 'forget'">
							<view class="form-item dis-flex flex-y-center">
								<view class="form-item-label">
									<image class="code-img" src="/static/images/login/yanzhengma.png"></image>
								</view>
								<view class="form-item-input flex-box">
									<input type="number" name="verCode" v-model="verCode" placeholder="请输入验证码" placeholder-class="input-place" />
								</view>
								<button class="checked-btn f-24 col-3" :disabled="!canSendCode" @click="getverifyCode(loginType === 'register'?'register':'findBack')">{{canSendCode?"验证码":countdown+"S"}}</button>
							</view>
						</block>

						<view class="form-item dis-flex flex-y-center">
							<view class="form-item-label">
								<image src="/static/images/login/churumima.png"></image>
							</view>
							<view class="form-item-input flex-box">
								<input name="password" :type="passWordType" :value="passWord" @input="passInput" placeholder="请输入登录密码"
								 placeholder-class="input-place" />
							</view>
							<view class="iconfont" @click="passTypeChange" v-if="loginType === 'login'" :class="[passWordType === 'password'?'icon-attentionforbid':'icon-attention']"></view>
						</view>

						<block v-if="loginType === 'register'  || loginType === 'forget'">
							<view class="form-item dis-flex flex-y-center">
								<view class="form-item-label">
									<image src="/static/images/login/churumima.png"></image>
								</view>
								<view class="form-item-input flex-box">
									<input type="password" name="againPassword" v-model="againPassword" placeholder="请再次输入登录密码" placeholder-class="input-place" />
								</view>
							</view>
						</block>
					</block>
					<block v-else>
						<image src="/static/images/login/zhuchechenggong.png" class="success-img"></image>
						<view class="f-32 col-3 m-top20 t-c">注册成功!</view>
					</block>

					<view class="form-btn-box">
						<button form-type="submit">{{loginType==="login"?"登录":loginType==="register"?"注册":loginType==="forget"?"确定":loginType==="success"?"去登陆":""}}</button>
					</view>
				</form>
			</view>
			<block v-if="loginType === 'login'">
				<view class="forget f-26 col-3" @click="loginTypeChange('forget')">忘记密码?</view>
				<!-- <view class="other-login-title f-26 col-3">Or</view>
				<view class="other-login-list dis-flex flex-dir-row flex-x-center flex-y-center">
					<view class="iconfont icon-weixin"></view>
					<view class="iconfont icon-myfill"></view>
				</view> -->
			</block>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	let timer = null;
	export default {
		data() {
			return {
				loginType: "login", //页面显示类型 
				mobile: "",
				verCode: "",
				againPassword: "",
				passWordType: "password",
				passWord: "",
				countdown: 0, //倒计时
				canSendCode: true, //能否发送短信
			};
		},
		components: {

		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {

		},

		onShow() {

		},
		mounted() {

		},
		methods: {
			/**
			 * 类型切换
			 */
			loginTypeChange(type) {
				if (this.loginType !== type) {
					this.loginType = type;
					this.passWordType = "password";
					this.pageInit(type);
				}
			},

			/**
			 * 密码输入
			 */
			passInput(e) {
				this.passWord = e.detail.value.trim();
			},

			/**
			 * 是否显示密码
			 */
			passTypeChange(e) {
				this.passWordType = this.passWordType === "text" ? "password" : "text";
			},

			/**
			 * 发送短信验证码
			 */
			getverifyCode(type) {
				let _this = this,
					totalCount = 60; //短信倒计时
				_this.countdown = totalCount;
				if (!_this.mobile) {
					App.showError("请填写手机号");
					return;
				}
				if (_this.canSendCode) {
					_this.canSendCode = false;
					_this.sendCountdown();
					//发送短信
					App._post_form("user.H5/sendSms", {
						mobile: _this.mobile,
						type
					}, result => {
						App.showSuccess("发送成功")
						console.log(result);
					}, () => {
						_this.canSendCode = true;
					});
				}
			},

			/**
			 * 短信倒计时
			 */
			sendCountdown() {
				timer = setInterval(() => {
					if (this.countdown === 0) {
						this.canSendCode = true;
						clearInterval(timer);
					} else {
						--this.countdown;
					}
				}, 1000);
			},

			/**
			 * 页面数据初始化
			 */
			pageInit(type) {
				this.setData({
					loginType: type,
					countdown: 0, //倒计时
					canSendCode: true, //能否发送短信
					mobile: "",
					passWord: "",
					verCode: "",
					againPassword: "",
				})
			},

			/**
			 * 提交表单
			 */
			formSubmit(e) {
				let _this = this,
					loginType = this.loginType,
					{
						mobile,
						verCode,
						password,
						againPassword
					} = e.detail.value,
					reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/,
					requestData = {
						"login": {
							"url": "user/login",
							"test": [mobile && password, reg.test(mobile)],
							"errMsg": ["请正确填写登录信息", "手机号格式不正确"]
						},
						"register": {
							"url": "user.H5/register",
							"test": [reg.test(mobile), password === againPassword, !!verCode],
							"errMsg": ["手机号格式不正确", "两次密码输入不一致", "请输入短信验证码"]
						},
						"forget": {
							"url": "user.H5/findBack",
							"test": [!!mobile, !!password, password === againPassword, !!verCode],
							"errMsg": ["请输入手机号", "请输入密码", "两次密码输入不一致", "请输入短信验证码"]
						}
					};

				//切换登录
				if (loginType === "success") {
					_this.pageInit("login");
					return;
				}

				//表单验证
				if (requestData[loginType].test.includes(false)) {
					let index = requestData[loginType].test.findIndex(val => val === false);
					App.showError(requestData[loginType].errMsg[index]);
					return;
				}

				uni.showLoading({
					title: loginType === "login" ? "登录中..." : "提交中..."
				});
				App._post_form(requestData[loginType].url, {
					referee_id: uni.getStorageSync('referee_id'),
					mobile,
					verCode: verCode || "",
					password,
				}, result => {
					uni.hideLoading();
					if (result.code === 1) {
						App.showSuccess(result.msg);
						if (loginType === "login") {
							let {
								route,
								options
							} = uni.getStorageSync("currentPage");
							if (route === "pages/subPages/write/write") {
								uni.reLaunch({
									url: `/pages/mainPages/index/index?${App.urlEncode(options)}`
								})
							} else {
								let page = getCurrentPages()[0];
								uni.redirectTo({
									url: `/${route}?${App.urlEncode(options)}`
								});
								console.log(route, options);
								setTimeout(() => {
									console.log("currentPage.optinos", uni.getStorageSync("currentPage"));
									page.pageLoad(uni.getStorageSync("currentPage").optinos);
								}, 200);
								uni.navigateBack({
									delta: 1,
									success() {
										// #ifdef H5
										setTimeout(() => {
											location.href = location.href;
										}, 200);
										// #endif
									}
								});
							}
							let {
								token,
								user_id,
								status
							} = result.data;
							//设置用户信息
							App.setUserinfo(token, user_id, status);
							if (!!_this.globalSaveRefereeId) {
								App.saveRefereeQuest()
							}
							//清除登录缓存信息
							App.removeCurrentPage();
						} else if (loginType === "register") {
							_this.loginType = "success";
						} else if (loginType === "forget") {
							_this.pageInit("login");
						}
					}
				}, () => {
					uni.hideLoading();
				});
			}
		}
	}
</script>

<style>
	.login-container {
		height: 100vh;
		box-sizing: border-box;
		padding-top: 50upx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.login-logo {
		width: 180upx;
		height: 180upx;
		margin-bottom: 40upx;
		position: relative;
	}

	.login-logo::after {
		content: " ";
		position: absolute;
		top: 0;
		left: 0;
		width: 180upx;
		height: 180upx;
		border-radius: 50%;
		background: rgba(255, 255, 255, .4);
		z-index: 1;
	}

	.login-logo image {
		position: relative;
		width: 160upx;
		height: 160upx;
		margin: 10upx;
		border-radius: 50%;
		z-index: 2;
	}

	.login-type {
		width: 433upx;
		height: 60upx;
		min-height: 60upx;
		text-align: center;
		padding: 8upx;
		background: rgba(0, 0, 0, .2);
		border-radius: 40upx;
		margin-bottom: 44upx;
		position: relative;
	}

	.login-type .login-back {
		position: absolute;
		top: 8upx;
		left: 8upx;
		z-index: 2;
		width: 60upx;
		height: 60upx;
		min-height: 60upx;
		line-height: 60upx;
		text-align: center;
		font-size: 36upx;
		color: #333333;
		background: #FFFFFF;
		border-radius: 50%;
	}

	.login-item {
		width: 100%;
		font-size: 28upx;
		color: #FFFFFF;
		border-radius: 40upx;
		position: relative;
		z-index: 1;
		height: 60upx;
		min-height: 60upx;
		line-height: 60upx;
	}

	.login-item.active {
		color: #333333;
		background: #FFFFFF;
	}

	.login-form {
		width: 564upx;
		padding: 20upx 42upx 0;
		border-radius: 6upx;
	}

	.login-form .success-img {
		width: 307upx;
		height: 325upx;
		display: block;
		margin: 0 auto;
	}

	.form-item {
		height: 100upx;
		border-top: 1upx solid #EEEEEE;
	}

	.form-item:first-child {
		border-top: 0;
	}

	.form-item .icon-attention,
	.form-item .icon-attentionforbid {
		font-size: 40upx;
	}

	.form-item-label {
		margin-right: 30upx;
	}

	.form-item-label image {
		width: 29upx;
		height: 39upx;
		display: block;
	}

	.form-item-label image.code-img {
		width: 35upx;
		height: 27upx;
	}

	.form-item-input input {
		font-size: 28upx;
		color: #333333;
	}

	.input-place {
		color: #999999;
		font-size: 28upx;
	}

	.form-item .checked-btn {
		background: #FFD940;
		border-radius: 40upx;
		width: 165upx;
		height: 66upx;
		line-height: 66upx;
		text-align: center;
	}

	.form-btn-box {
		padding: 0 42upx 0;
	}

	.form-btn-box button {
		background: #FFD940;
		border-radius: 6upx;
		height: 100upx;
		line-height: 100upx;
		font-size: 32upx;
		color: #333333;
		position: relative;
		top: 50upx;
		box-shadow: 1upx 6upx 20upx 0px rgba(176, 23, 146, 0.15);
	}

	.forget {
		margin-top: 80upx;
		text-decoration: underline;
	}

	.other-login-title {
		margin-top: 60upx;
		position: relative;
	}

	.other-login-title::after,
	.other-login-title::before {
		content: " ";
		position: absolute;
		top: calc(50% - 2upx);
		width: 200upx;
		height: 4upx;
		background: linear-gradient(90deg, rgba(180, 151, 36, 0.5) 0%, rgba(255, 255, 255, 0) 100%);
		opacity: 0.5;
		border-radius: 4upx;
	}

	.other-login-title::after {
		left: -230upx;
		transform: rotate(180deg);
	}

	.other-login-title::before {
		right: -230upx;
	}

	.other-login-list {
		width: 100%;
		margin-top: 30upx;
	}

	.other-login-list .iconfont {
		font-size: 56upx;
		width: 1.8em;
		height: 1.8em;
		line-height: 1.8em;
		text-align: center;
		background: #FFFFFF;
		border-radius: 50%;
		margin: 0 30upx;
	}
</style>
