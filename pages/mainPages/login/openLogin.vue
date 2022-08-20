<template>
	<view class="" :style="themeColor"></view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				url: "",
				webviewStyles: {
					progress: {
						color: "#FFD940"
					}
				}
			}
		},
		components: {

		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {
	
	
			let _this = this;
			uni.setStorageSync("uniacid", options.i);
			uni.setStorage({
				key: 'token',
				data: options.token,
				success() {
					_this.getUserInfo(options.token);
				}
			});
		},
		mounted() {

		},
		onShareAppMessage(res) {
			return {
			      title: '',
			      path: '/pages/mainPages/login/openLogin'
			    }
	
		},
		methods: {
			getUserInfo(token) {
				let _this = this;
				App._get('user.index/detail', {
					no_login: 1
				}, (result) => {
					let userInfo = result.data.userInfo,
						uniacid = App.getUniacid(),
						{
							route,
							options,
							// fix https://weliam.coding.net/p/lingdian/bug-tracking/issues/7498/detail
							h5Url=''
						} = uni.getStorageSync("currentPage"),
						url = `/${route}?${App.urlEncode(options)}`;
					uni.setStorageSync('user_id', userInfo.user_id);
					let urlMatch = url.match(/referee_id=(\d)*/),
						refereeId = urlMatch ? urlMatch[0].split("=")[1] : App.getRefereId(),
						userId = userInfo.user_id;
					console.log("refereeId", refereeId);
					console.log("userId", userId);
					if (refereeId && userId) {
						App.saveRefereeId(refereeId);
						console.log("saveRefereeQuest");
						App.saveRefereeQuest();
					}
					//设置用户信息
					App.setUserinfo("", userId, userInfo);
					//清除登录缓存信息
					App.removeCurrentPage();
					//获取页面分享设置
					console.log('公众号url============',{
						route,
						options,
						h5Url
					})
					_this.$store.dispatch("getShareSetting");
					if(h5Url) {
						console.log('通过h5Url跳转',h5Url)
						uni.reLaunch({
							url: h5Url.split('#')[1] || "/pages/mainPages/index/index?i=" + uniacid
						})						
					}else if (url.indexOf("pages/subPages/write/write") !== -1) {
						uni.reLaunch({
							url: "/pages/mainPages/index/index?i=" + uniacid
						})
					}else if(route &&　route.indexOf('undefined')>-1) {
						uni.reLaunch({
							url: "/pages/mainPages/index/index?i=" + uniacid
						})
					}else if(url && url.indexOf('undefined') === -1) {
						uni.redirectTo({
							url
						})
					}else {
						uni.reLaunch({
							url: "/pages/mainPages/index/index?i=" + uniacid
						})
					}
	
	
				});
			}
		}
	}
</script>

<style>

</style>
