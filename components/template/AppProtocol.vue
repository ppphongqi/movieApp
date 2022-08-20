<template>
	<view>
		<PopManager :show="isRead && settingData.helpbtn === '1'" tpye="center">
			<view class="protocol b-f">
				<view class="protocol-title f-36 f-w t-c">温馨提示</view>
				<view class="protocol-content">
					<view class="f-28 col-6 protocol-text">{{helpinfo}}</view>
					<view class="protocol-tips col-3 f-28">以下为协议阅读链接,可以点击阅读全文</view>
					<view class="protocol-links f-28">
						<text class="text" @click="skipset('user')">用户隐私条款</text>
						<text class="text" @click="skipset('platform')">平台服务协议</text>
					</view>
					<button class="protocol-btn main-bg-color auxiliary-color" @click="showChange">同意并继续</button>
				</view>
			</view>
		</PopManager>
	</view>
</template>

<script>
	import PopManager from '@/components/template/PopManager.vue';
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				isShowRead: null
			}
		},
		components: {
			PopManager
		},
		computed: {
			isRead() {
				let userInfo = this.$store.state.userInfo;
				return !!userInfo ? userInfo.is_read === -1 : false
			},
			helpinfo() {
				let appSetting = this.$store.state.appSetting;
				return appSetting ? appSetting.helpinfo : ""
			}
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
			showChange() {
				let _this = this,
					userInfo = _this.$store.state.userInfo;
				uni.showLoading();
				App._post_form("user/isRead", {
					user_id: App.getUserId(),
					mobile: userInfo.mobile || ""
				}, res => {
					uni.hideLoading();
					console.log(res);
					if (res.code === 1) {
						let userInfo = _this.$store.state.userInfo;
						userInfo.is_read = 1;
						_this.$store.commit("userInfo", userInfo);
						_this.$emit("readSuccess")
					}
				})
			},
			skipset(skiptype) {
				switch (skiptype) {
					case 'user':
						App.navigationTo({
							url: 'pages/mainPages/richtext/setrich?richtype=policy'
						})
						break;
					case 'platform':
						App.navigationTo({
							url: 'pages/mainPages/richtext/setrich?richtype=agreement'
						})
						break;
				}
			}
		}
	}
</script>

<style>
	.protocol {
		width: 85vw;
		border-radius: 30upx;
	}

	.protocol-title {
		line-height: 3.5em;
	}

	.protocol-content {
		padding: 0 50upx 30upx;
	}

	.protocol-tips {
		margin-top: 20upx;
		line-height: 1.5em;
	}

	.protocol-text {
		line-height: 1.5em;
	}

	.protocol-links {
		margin-top: 20upx;
		color: #5f6ca3;
	}

	.protocol-links .text {
		margin-right: 30upx;
	}

	.protocol-btn {
		border-radius: 100upx;
		margin-top: 30upx;
		background: #FFD940;
		color: #333333;
		font-size: 30upx;
	}
</style>
