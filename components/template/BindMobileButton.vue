<!-- 
	绑定用户手机号组件 需父元素存在相对定位的元素 by 杨智源
	buttonText    绑定按钮文字
	onBindSuccess 绑定成功回调
	onBindFail 	  绑定失败回调
 -->
<template>
	<view>
		<view class="bind-btn-box">
			<!-- <button class="bind-btn" @click="$refs.getUserPhone.showChange()">{{btnText}}</button>	 -->
			<block v-if="isUserLogin">
				<!-- #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO-->
				<button class="bind-btn" open-type="getPhoneNumber" @getphonenumber="getUserPhone">{{btnText}}</button>
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<button class="bind-btn" open-type="getAuthorize" scope="phoneNumber" @getAuthorize="onGetAuthorize">{{btnText}}</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<button class="bind-btn" @click="$refs.getUserPhone.showChange()">{{btnText}}</button>
				<!-- #endif -->
			</block>
			<block v-else>
				<button class="bind-btn" @click="doLogin">{{btnText}}</button>
			</block>
		</view>
		<GetUserPhone ref="getUserPhone" @bindMobileAfter="bindAfter" :bind-number="bindNumber" :isUpdated="false"></GetUserPhone>
	</view>
</template>

<script>
	import GetUserPhone from "@/components/template/GetUserPhone.vue"
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {

			}
		},
		props: {
			showText: {
				type: String,
				default: "1"
			},
			buttonText: {
				type: String,
				default: "立即绑定"
			},
			bindNumber: {
				type: String,
				default: ""
			}
		},
		components: {
			GetUserPhone
		},
		computed: {
			btnText() {
				return this.showText === "1" ? this.buttonText : ""
			}
		},
		onLoad(options) {

		},
		methods: {
			doLogin() {
				App.doLogin();
			},
			/**
			 * 获取用户加密数据
			 */
			getUserPhone(e) {
				console.log(e);
				let _this = this;
				uni.showLoading();
				if (e.detail.errMsg === "getPhoneNumber:ok") {
					_this.getMobile(e.detail)
				} else {
					_this.$emit("onBindFail");
					uni.hideLoading();
				}
			},
			onGetAuthorize(e) {
				let _this = this;
				// #ifdef MP-ALIPAY
				my.getPhoneNumber({
					success: (res) => {
						let encryptedData = JSON.parse(res.response);
						_this.getMobile(encryptedData);
					}
				});
				// #endif
			},
			/**
			 * 解密用户手机号
			 * @param {Object} encryptedData
			 */
			getMobile(encryptedData) {
				let _this = this,
					mobileData = {};
				// #ifdef MP-ALIPAY
				App._post_form('user.Index/getMobile', {
					...encryptedData
				}, (res) => {
					if (res.code === 1) {
						console.log(res);
						let mobile = res.data.mobile;
						_this.bindMobile(mobile);
					}
				})
				// #endif
				// #ifndef MP-ALIPAY
				//校验checkSession
				uni.checkSession({
					success() {
						App._post_form('user.Index/getMobile', {
							...encryptedData
						}, (res) => {
							if (res.code === 1) {
								console.log(res);
								let mobile = res.data.mobile;
								_this.bindMobile(mobile);
							}
						})
					},
					fail() {
						App.showError("登陆失效,请重新登录后再次绑定", () => {
							_this.$emit("onBindFail");
							App.doLogin();
						})
					}
				});
				// #endif
			},
			/**
			 * 绑定用户手机号
			 */
			bindMobile(mobile) {
				let _this = this;
				App._post_form('user.index/bindMobile', {
					mobile,
					verCode: '',
					isWechat: '1'
				}, (result) => {
					if (result.code === 1) {
						uni.hideLoading()
						_this.bindAfter(mobile);
					}
				})
			},
			bindAfter(mobile) {
				console.log("bindAfter", mobile);
				let userInfo = this.$store.state.userInfo;
				userInfo.mobile = mobile;
				console.log("————更新用户手机号————");
				console.log("userInfo", userInfo);
				console.log("token", uni.getStorageSync("token"));
				console.log();
				this.$store.commit("userInfo", userInfo);
				this.$emit("onBindSuccess", {
					mobile
				});
			}
		}
	}
</script>

<style scoped>
	.bind-btn-box {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
	}

	.bind-btn {
		width: 100%;
		height: 100%;
		border: 0;
		opacity: 0;
		z-index: 5;
	}

	.bind-btn::after {
		content: none;
	}
</style>
