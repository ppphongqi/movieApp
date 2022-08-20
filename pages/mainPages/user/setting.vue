<template>
	<view class="page" :style="themeColor">
		<view class="setrich m-btm20">
			<navlist :itemData="navlist" :itemStyle="itemStyle" @bindSuccess="bindSuccess" @itemClick="editMobile"></navlist>
		</view>
		<view class="write">
			<navlist :itemData="writelist" :itemStyle="itemStyle"></navlist>
		</view>
		<block v-if="isDevelopment">
			<button type="primary" @click="deleteUser">删除用户</button>
			<button type="primary" @click="deleteMobile" class="m-top20">删除手机号</button>
			<button type="primary" @click="clearStorage" class="m-top20">清除缓存</button>
			<button type="primary" @click="doLogin" class="m-top20">登录</button>
		</block>
		<view class="weiliamv m-top20 col-9 f-24 t-c">当前版本号:{{weiliamv}}</view>
		<GetUserPhone ref="getUserPhone" bind-type="edit"></GetUserPhone>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import GetUserPhone from "@/components/template/GetUserPhone.vue"
	import navlist from "@/components/page/pageComponents/NavList.vue";
	export default {
		data() {
			return {
				navlist: [{
						link: 'pages/mainPages/richtext/setrich?richtype=license',
						title: '营业执照'

					},
					{

						link: 'pages/mainPages/richtext/setrich?richtype=agreement',
						title: '服务协议'

					},
					{
						link: 'pages/mainPages/richtext/setrich?richtype=policy',
						title: '隐私政策'
					},
					{
						link: '',
						type: "click",
						params: "edit",
						title: '修改手机号'
					},
					{
						link: '',
						type: "click",
						params: "init",
						title: '数据修复'
					},
					{
						link: '',
						type: "click",
						params: "auth",
						title: '权限设置'
					}
				],
				writelist: [{
					link: 'pages/subPages/write/write',
					title: '注销账号'
				}],
				itemStyle: {
					radius: "2",
					margincol: "10",
					marginrow: "10"
				}
			};
		},
		components: {
			navlist,
			GetUserPhone
		},
		computed: {
			weiliamv() {
				return App.siteInfo.weliamv
			},
			isDevelopment() {
				return process.env.NODE_ENV === 'development'
			},
			getUserInfoData() {
				return this.$store.getters.getUserInfoData.mobile
			}
		},
		onLoad(options) {

		},
		methods: {
			//修改手机号
			editMobile(res) {
				let {
					item: {
						params
					}
				} = res;
				if (params === "edit") {
					this.$refs.getUserPhone.showChange();
				} else if (params === "init") {
					uni.showModal({
						title: "温馨提示",
						content: "该功能可能会移除本地缓存，并重置相关数据，请谨慎使用",
						success(option) {
							if (option.confirm) {
								let url = "/pages/mainPages/index/index";
								uni.clearStorageSync();
								// #ifdef H5
								url += `?i=${App.getUniacid()}`
								// #endif
								uni.reLaunch({
									url,
									success() {
										// #ifdef MP
										uni.setStorageSync("isLogining", true);
										// App.doLogin();
										// #endif
									}
								});
							}
						}
					})
				}else if(params === "auth"){
	
				}
			},
			doLogin() {
				App.doLogin();
			},
			deleteUser() {
				App._get("user.index/del_user", {
					delete: "delete",
					user_id: App.getUserId()
				}, (res) => {
					App.showSuccess("删除成功!")
				})
			},
			deleteMobile() {
				App._get("user.index/editMobile", {
					editmobile: "editmobile",
					mobile: "",
					user_id: App.getUserId()
				}, (res) => {
					App.showSuccess("修改成功!")
				})
			},
			clearStorage() {
				uni.clearStorageSync();
				App.showSuccess("清除成功!");
			}
		}
	}
</script>

<style>
	.page {
		padding: 20upx 0;
	}
</style>
