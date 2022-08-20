<template>
	<view class="container" :style="themeColor">
		<image :src="inviteStatus==='invite'?businessData.logo:'/static/images/business/success.png'" class="store-logo"></image>
		<view class="f-28 col-3 t-c">{{inviteStatus==="invite"?businessData.name:"操作成功"}}</view>
		<view class="f-24 col-9 t-c m-top20">{{inviteStatus==="invite"?"邀请你成为他的店员":"等待管理员进行后续操作"}}</view>
		<button class="agree-btn m-top40 f-28 main-bg-color auxiliary-color" @click="empower(code,inviteStatus)">{{inviteStatus==="invite"?"接受邀请":"进入首页"}}</button>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	export default {
		data() {
			return {
				businessData: {},
				code: "",
				inviteStatus: "invite"
			};
		},
		computed: {
			isShowAttention() {
				return this.businessData.is_wechat === "1";
			}
		},
		onLoad(options) {
			let _this = this,
				scene = App.getSceneData(options);
			console.log(scene);
			_this.code = scene.code
			App._get("merchant.index/getCodeData", {
				code: scene.code
			}, result => {
				_this.businessData = result.data;
			});
		},
		onShow() {

		},
		mounted() {

		},
		methods: {
			/**
			 * 同意授权
			 * @param {Object} code 
			 */
			empower(code, inviteStatus) {
				let _this = this,
					{
						is_wechat,
						wechat_url
					} = _this.businessData;
				if (inviteStatus === "invite") {
					App._get("merchant.index/empower", {
						code
					}, result => {
						if (result.code === 1) {
							if (wechat_url) {
								App.navigationTo({
									url: `pages/subPages/dealer/apply/attention?type=business&wechat_image=${encodeURIComponent(wechat_url)}`
								})
							} else {
								_this.inviteStatus = "success";
								uni.setNavigationBarTitle({
									title: "操作成功"
								})
							}
						}
						console.log("empower", result);
					})
				} else {
					let url = "/pages/mainPages/index/index";
					// #ifdef H5
					url += `?i=${App.getUniacid()}`
					// #endif
					uni.reLaunch({
						url
					})
				}
			},
			official(e) {
				console.log("official", e);
			}
		}
	}
</script>

<style>
	.container {
		min-height: 100vh;
		background: #FFFFFF;
		padding-top: 100rpx;
		box-sizing: border-box;
	}

	.store-logo {
		width: 130rpx;
		height: 130rpx;
		display: block;
		margin: 0 auto 40rpx;
		border-radius: 50%;
	}

	.wechat_url {
		width: 200rpx;
		height: 200rpx;
		display: block;
		margin: 20rpx auto 0;
	}

	.official-account {
		margin: 20rpx 65rpx 0;
	}

	.agree-btn {
		margin: 0 65rpx;
		height: 80rpx;
		line-height: 80rpx;
		color: #333333;
		background: #FFD940;
		border-radius: 50px;
		margin-top: 20rpx;
	}
</style>
