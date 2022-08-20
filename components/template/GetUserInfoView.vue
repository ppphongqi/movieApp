<!--
 * @description: 获取用户登录权限
 * @author: wuxiao
 * @update: 2019-01-09
 * 使用方式: <组件名 @updateUserInfo></组件名>
 * @updateUserInfo 更新用户信息之后的回调
-->
<template>
	<view>
		<view class="login" v-if="isShowView">
			<view class="login-mask"></view>
			<view class="login-d">
				<view class="login-t">
					<view class="login-t-d"></view>
				</view>
				<view class="login-c">
					<view class="login-c-t">
						<image class="image" src="http://weilamdemo.oss-cn-qingdao.aliyuncs.com/images/26/2018/10/ZCt8pru0H50hO2Zrq5r2q08DcCcZ0O.png"
						 mode="aspectFill"></image>
					</view>
					<view class="login-c-c">
						<view class="h1">智慧城市</view>
						<view class="h2">该程序获得以下授权：</view>
						<view class="p">获取您的公开信息（昵称和头像等），以便于查看优惠信息哦</view>
					</view>
					<view class="login-c-b">
						<button hover-class="none" plain="true" open-type="getUserInfo" @getuserinfo="onGotUserInfo">确定授权</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
			isShowView: {
				get() {
					return this.$store.state.getUserShow
				},
				set(value) {
					this.$store.commit("getUserShow", value);
				}
			},
		},
		mounted() {
			this.isShowView = !this.$store.state.userInfo.nickname;
		},
		methods: {
			onGotUserInfo(e) {
				var that = this;
				var userInfo = {};
				if (e.detail.userInfo) {
					for (let i in e.detail.userInfo) {
						userInfo[i] = e.detail.userInfo[i];
					}
					if (!that.loginLoading) {
						that.loginLoading = true;
						uni.showLoading({
							title: '正在登录',
						});
						var Base64 = that.$util.Base64
						var userInfoBase64 = new Base64().encode(JSON.stringify(userInfo));
						that.$request({
							url: 'UpUserInfo',
							info: userInfoBase64
						}, res => {
							//console.log(res.result.userinfo);
							if (res.code === 0) {
								that.isShowView = false;
								that.$store.commit('userInfo', res.result.userinfo);
							}
							setTimeout(function() {
								that.loginLoading = false;
								uni.hideLoading();
								that.$emit("updateUserInfo", res.result.userinfo);
							}, 1000);
						}, that, true);
					}
				}
			},
			getUserInformationErr() {
				this.loginLoading = false;
				uni.hideLoading();
				uni.showToast({
					title: '获取信息失败',
					icon: 'none',
					duration: 1000,
					mask: true
				});
			}
		}
	}
</script>

<style scoped>
	view {
		background-color: transparent;
	}

	.login-mask {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .65);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
	}

	.login-d {
		width: calc(100vw - 200upx);
		background-color: #fff;
		border-radius: 20upx;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 101;
	}

	.login-close {
		width: 80upx;
		height: 80upx;
		line-height: 80upx;
		text-indent: 4upx;
		text-align: center;
		margin-left: -40upx;
		background-color: #fff;
		border-radius: 50%;
		position: absolute;
		left: 50%;
		bottom: -130upx;
	}

	.login-close .i {
		font-size: 48upx;
		display: inline;
	}

	.login-t {
		width: 100%;
		height: 260upx;
		border-radius: 20upx 20upx 0 0;
		position: absolute;
		overflow: hidden;
	}

	.login-t-d {
		height: 200%;
		background-color: #FF8B1A;
		position: absolute;
		z-index: 1;
		border-radius: 50%;
		transform: translate(-25%, -60%);
		width: 200%;
	}

	.login-t-stl {
		width: 240%;
		height: 600upx;
		position: absolute;
		top: -450upx;
		left: calc(-70% - 80upx);
		z-index: 1;
		border: 80upx solid #fff;
		border-radius: 50%;
	}

	.login-c {
		padding: 60upx 50upx;
		position: relative;
		z-index: 2;
	}

	.login-c-t {
		width: 130upx;
		height: 130upx;
		margin: 0 auto;
		margin-top: -16upx;
	}

	.login-c-t .image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		overflow: hidden;
	}

	.login-c-c {
		margin-top: 60upx;
	}

	.login-c-c .h1 {
		font-size: 40upx;
		font-weight: 600;
		text-align: center;
	}

	.login-c-c .h2 {
		font-size: 32upx;
		font-weight: 600;
		text-align: left;
		margin-top: 12upx;
		line-height: 2em;
	}

	.login-c-c .p {
		line-height: 48upx;
		font-size: 28upx;
		margin-top: 10upx;
	}

	.login-c-b {
		text-align: center;
		margin-top: 40upx;
	}

	.login-c-b button {
		width: 70%;
		height: 70upx;
		line-height: 70upx;
		font-size: 30upx;
		background-color: #FF8B1A;
		color: #fff;
		border: none;
		border-radius: 100upx;
		display: inline-block;
	}
</style>
