<!-- 
绑定用户电话弹窗 by 缪启峙
isshow 判断绑定手机弹出框是否打开
bindType "edit" 重新绑定手机号
 -->
<template>
	<view class="bind-main" v-if="isShow">
		<view class="bind-view" @tap.prevent="touchMove" @touchmove.prevent="touchMove"></view>
		<view class="bind-call-main">
			<view class="call-view t-l">
				<view class="title col-0">绑定手机号</view>
				<view class="intor" v-if="bindType ===''">为了您的账户安全,请及时绑定手机号</view>
				<view class="call-from">
					<form @submit="formSubmit">
						<view class="input-bg col-3">
							<input type="number" name="mobile" v-model="mobile" placeholder="请输入手机号" />
						</view>
						<view class="input-bg dis-flex flex-x-between flex-y-center">
							<input type="number" class="col-3" name="verCode" v-model="verCode" placeholder="请输入验证码" />
							<view class="getcode-btn" @click="getCode">{{codeMsg}}</view>
						</view>
						<button class="bindmobile" formType="submit">绑定手机号</button>
					</form>
				</view>
			</view>
			<view v-if="roundcloseVisible" class="bind-close-img iconfont icon-roundclose" @click="showChange">
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				countdown: 60, // 按钮上的文字
				codeMsg: '获取验证码', // 定时器
				timer: null,
				disabled: false,
				mobile: "",
				verCode: "",
				ClientType: null,
				isShow: false
			};
		},
		props: {
			bindType: {
				type: String,
				default: ""
			},
			isUpdated: {
				type: Boolean,
				default: true
			},
			bindNumber: {
				type: String,
				default: ""
			},
			roundcloseVisible: {
				type: Boolean,
				default: true
			}
		},
		mounted() {
			let that = this;
			that.ClientType = App.getClientType();
		},
		watch: {
			isShow(newValue, oldValue) {
				if (newValue) {
					this.mobile = this.bindNumber;
				}
			}
		},
		methods: {
			touchMove() {
				console.log("touchMove");
				return;
			},
			showChange() {
				this.isShow = !this.isShow;
			},
			getCode() {
				let that = this;
				if (!that.mobile) {
					App.showError("请填写手机号");
					return;
				}

				if (!that.disabled) {
					//防止重复操作
					that.disabled = true;
					//发送短信
					App._post_form("user.H5/sendSms", {
						mobile: that.mobile,
						type: "register"
					}, result => {
						App.showSuccess("发送成功");
						console.log(result);
						that.setCountdown();
					}, () => {
						that.disabled = false;
					});
				}
			},
			setCountdown() {
				if (!this.timer) {
					this.timer = setInterval(() => {
						if (this.countdown > 0 && this.countdown <= 60) {
							this.countdown--;
							if (this.countdown !== 0) {
								this.codeMsg = "重新发送(" + this.countdown + ")";
							} else {
								clearInterval(this.timer);
								this.codeMsg = "获取验证码";
								this.countdown = 60;
								this.timer = null;
								this.disabled = false;
							}
						}
					}, 1000)
				}
			},
			formSubmit(e) {
				let {
					mobile,
					verCode
				} = e.detail.value,
					_this = this,
					bindType = this.bindType;
				console.log(mobile, verCode);
				if (mobile && verCode) {
					uni.showLoading({
						title: "提交中..."
					});
					App._post_form('user.index/bindMobile', {
						mobile,
						verCode,
						isWechat: ''
					}, result => {
						console.log(result);
						uni.hideLoading();
						if (result.code === 1) {
							let userInfo = _this.$store.state.userInfo;
							App.showSuccess(result.msg, () => {
								_this.isShow = false;
								console.log("bindMobileAfter", mobile);
								_this.$emit("bindMobileAfter", mobile);
								if (_this.isUpdated) {
									userInfo.mobile = mobile;
									_this.$store.commit("userInfo", userInfo);
								}
							});
						}
					}, () => {
						uni.hideLoading();
					});
				} else {
					App.showError("请填写手机号和验证码");
				}
			}
		}

	}
</script>

<style>
	.bind-main {
		position: relative;
	}

	.bind-view {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .4);
		left: 0;
		top: 0;
		z-index: 100;
	}

	.bind-call-main {
		position: fixed;
		width: 100%;
		z-index: 101;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	.bind-call-main .call-view {
		margin: 0 5%;
		background-color: rgb(255, 255, 255);
		/* height: 360upx; */
		padding: 40upx 40upx 80upx 40upx;
		border-radius: 25upx;
	}

	.call-view .title {
		font-size: 32upx;
		height: 1.8em;
		line-height: 1.8em;
		font-weight: 600;
		margin-bottom: 40rpx;
	}

	.call-view .intor {
		margin: 0 0 50rpx 0;
		color: rgb(158, 158, 158);
		font-size: 26upx;
		height: 1.8em;
		line-height: 1.8em;
	}

	.input-bg {
		position: relative;
		border-radius: 50upx;
		background-color: rgb(238, 238, 238);
		height: 90upx;
		padding: 0 30upx;
		margin-bottom: 30upx;
		font-size: 28upx;
	}

	.input-bg input {
		height: 90upx;
		line-height: 90upx;
	}

	.getcode-btn {
		/* display: flex;
		align-items: center; */
		color: rgb(241, 170, 69);
	}

	.getcode-btn:before {
		content: '';
		position: absolute;
		right: 37%;
		top: 54%;
		transform: translateY(-50%);
		width: 1px;
		height: 40upx;
		background-color: rgb(178, 178, 178);
	}

	.bindmobile {
		position: relative;
		opacity: 1;
		background-color: rgb(0, 0, 0);
		color: rgb(255, 255, 255);
		font-size: 28upx;
		height: 90upx;
		line-height: 90upx;
		border-radius: 50upx;
		margin: 0 20upx;
	}

	.bind-close-img.iconfont {
		position: absolute;
		left: 50%;
		bottom: -2em;
		transform: translateX(-50%);
		color: #FFFFFF;
		font-size: 56upx;
		width: 1em;
		height: 1em;
		line-height: 1em;
	}
</style>
