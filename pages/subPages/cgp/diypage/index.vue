<template>
	<view class="container" :style="themeColor">
		
		<!-- 自定义页面 -->
		<diy-page :diy-items="diyItems" :getBind="bindRegRes"></diy-page>
		<page-loading ref="loading"></page-loading>
		<!-- 自定义底部菜单 -->
		<tab-bar-X />
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import DiyPage from "@/components/page/DiyPage.vue"
	import TabBarX from '../components/TabBarX.vue'
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	
	// #ifdef H5
	import wxApi from "@/static/h5/wxApi.js"
	// #endif
	export default {
		mixins: [pageShareMixin],
		data() {
			return {
				diyItems: [],
				pageOptions: null,
				page_id: null,
				// 当前绑定团长的接口信息
				bindRegRes: {}
			}
		},
		components: {
			DiyPage,
			TabBarX
		},
		computed: {
			isopen_float() {
				return this.$store.state.floatOpen
			}
		},
		beforeCreate() {
			// #ifdef MP-WEIXIN
			uni.hideTabBar();
			// #endif
		},
		async onLoad(options) {
			App.showLoading();
			// console.log("page,load");
			try{
				await this.$store.dispatch('cgp/fetchSetting')
				this.page_id = options.page_id || this.$util.deepGet(this.$store.state,'cgp.setting.diy_page_id','')
				this.getPageData(options.page_id);
			}catch(e){
				//TODO handle the exception
			}
	
		},
		onShow() {
			this.fetchBindRegRes()
		},
		created() {

		},
		mounted() {
	
		},
		watch: {
			pageOptions(options) {
				if (options.params.title) {
					uni.setNavigationBarTitle({
						title:options.params&&options.params.title? options.params.title:""
					});
					uni.setNavigationBarColor({
						frontColor: options.style.texttype === "1" ? "#000000" : "#ffffff",
						backgroundColor: options.style.bgcolor
					});
				}
				if (this.appClientType === "4") {
					let sharepath = options.params.sharepath[0].file_path;
					jWeixin.ready(() => {
						let {
							share_title,
							share_describe,
							wechat_share_image
						} = this.settingData.share;
						console.log("page_id", this.page_id);
						console.log('share_describe-diy 1111',share_describe)
						wxApi.wxShare({
							title: options.params.sharetitle || share_title, // 分享标题
							desc: options.params.shareinfo || share_describe, // 分享描述
							link: `${App.siteInfo.siteroot}h5/#/pages/mainPages/index/diypage?&i=${App.getUniacid()}&page_id=${this.page_id}&referee_id=${App.getUserId()}`, // 分享链接
							imgUrl: sharepath === "default_picture.png" ? (wechat_share_image ? wechat_share_image[0].file_path : "") : sharepath,
						})
					});
				}
			},
			settingData: {
				handler(val) {
					console.log('哈哈哈哈哈哈哈哈',val)
					this.shareData = this.pageShareMixin_createShareData({
						title: this.$util.deepGet(val, 'cgp.share_title'),
						desc: this.$util.deepGet(val, 'cgp.share_text', ''),
						imgUrl: this.$util.deepGet(val, 'cgp.share_image', '')
					})
				},
				immediate: true
			}
		},
		methods: {
			async fetchBindRegRes() {
				try{
					const res = await App._postP('cgp.Reg/getBindReg', {
						no_login: 1
					})
					this.bindRegRes = this.$util.deepGet(res,'data',{})
				}catch(e){
					console.log('fetchBindRegRes error',e)
					//TODO handle the exception
				}
			},
			async getPageData(page_id) {
				await this.$store.dispatch('cgp/fetchSetting')
				let _this = this;
				App._get("diy.Diy/getHomeConfigInfo", {
					page_id: page_id || _this.page_id
				}, res => {
					let diyItems = res.data.filter(item => {
						if (this.$util.deepGet(item,'params.isshow') === "1" || item.key === "otheradvert") {
							if (item.key === "otheradvert") {
								item.data = item.data instanceof Array ? {} : item.data;
							}
							return item;
						}
					});
					_this.diyItems.splice(0, diyItems.length, ...diyItems);
					_this.pageOptions = res.data[0];
					_this.advertHandle("load")
					App.hideLoading();
					uni.stopPullDownRefresh();
				})
			},
			/**
			 * 弹窗操作
			 * @param {Object} showType 显示类型
			 */
			advertHandle(showType) {
				let _this = this,
					advertData = _this.diyItems[_this.diyItems.length - 1];
					console.log(advertData,'advertData==================')
				_this.getAdvertShow(advertData.params, showType).then(result => {
					console.log("result", result);
					if (result) {
						_this.$store.commit("showAdvert", true);
						uni.setStorageSync("isShowAdvert", "1");
					}
				});
			},
			/**
			 * 获取弹窗广告是否显示
			 */
			getAdvertShow(params, showType) {
				let {
					open, //是否开启1开启 2关闭
					status, //显示类型 1仅首次 2每次 3多次
					pattern, //弹窗样式 1默认 2自定义
					rate, //每人/每天显示次数
					type, //广告类型 1图片 2商品 3抽奖
					overtime
				} = params,
				nowTime = new Date().getTime() / 1000,
					isLogin = !!this.$store.state.userInfo,
					isShowed = uni.getStorageSync("isShowAdvert") === "1"; //是否已经显示过过弹窗
					console.log(params,'params===========')
				//如果用户未登录，则只显示一次，且不计次数
				if (!isLogin && open === "1") {
					status = "1";
				}
				return new Promise((resolve, reject) => {
					//倒计时小于当前时间，弹窗不显示
					if (type != "1" && pattern === "2" && nowTime > overtime) {
						resolve(false);
						return;
					}
					if (open == "1") {
						if (status == "1") {
							resolve(!isShowed);
						} else if (status == "2") {
							resolve(true);
							uni.removeStorageSync("isShowAdvert");
						} else if (status == "3" && Number(rate) > 0) {
							App._get("diy.Diy/getUserAdvertisement", {
								no_login: 1,
								rate
							}, res => {
								resolve(res.data);
							});
						}
					} else {
						resolve(false);
					}
				})
			},
		},
		onUnload() {
			this.$store.commit("showAdvert", false);
		},
		onPullDownRefresh() {
			this.getPageData();
			this.fetchBindRegRes()
		}
	}
</script>

<style>
	.container {
		width: 100vw;
		overflow-x: hidden;
		background-color: #FFFFFF;
	}
</style>
