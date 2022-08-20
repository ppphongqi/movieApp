<template>
	<view class="container" :style="themeColor">
<HomeHeader
		 :type="cHomeHeaderData.type"
		 :cateVisible="cHomeHeaderData.cateVisible"
		 :agentName="cHomeHeaderData.agentName"
		 :title="cHomeHeaderData.title"
		 :titleStyle="cHomeHeaderData.titleStyle"
		 :cateData="cHomeHeaderData.cateData"
		 :swiperData="cHomeHeaderData.bannerData"
		 :scrollTop="scrollTop"
		 @on-cate-item-click="onTopCateClick"
		 @on-swiper-item-click="onTopSwiperItemClick"
		 :navBgColor="cHomeHeaderData.navBgColor"></HomeHeader>
		<!-- 自定义页面 -->
		<diy-page :diy-items="cDiyItems"></diy-page>
		<page-loading ref="loading"></page-loading>
		<!-- 自定义底部菜单 -->
		<diy-tab></diy-tab>
	</view>
</template>

<script>
	import HomeHeader from '@/components/template/HomeHeader.vue'
	import DiyPage from "@/components/page/DiyPage.vue"
	import App from "@/common/js/app.js"
	import DiyTab from "@/components/template/TabBar.vue"
	// #ifdef H5
	import wxApi from "@/static/h5/wxApi.js"
	// #endif
	export default {
		data() {
			return {
				diyItems: [],
				pageOptions: null,
				page_id: null,
				topCateRes: []
			}
		},
		computed: {
			cHomeHeaderData() {
				const data = this.pageOptions || {}
				let cateVisible = false
				if(+this.$util.deepGet(data, 'params.pattern') === 3 && +this.$util.deepGet(data, 'params.shownavigation') === 1 || +this.$util.deepGet(
				    data,
				    'params.classtype'
				) === 1 && +this.$util.deepGet(data, 'params.pattern') === 2) {
					cateVisible = true
				}
				// 自定义页面不应该有分类
				cateVisible = false
				return {
				    // 新版header的type
				    type: this.$util.deepGet(data, 'params.pattern') || 1,
				    // 标题栏背景颜色
				    navBgColor: this.$util.deepGet(data, 'style.bgcolor', '#FFD940'),
				    // 标题文字
				    title: this.$util.deepGet(data, 'params.title') || '',
				    // 标题的样式
				    titleStyle: `color: ${+this.$util.deepGet(data, 'style.texttype') === 1 ? '#000' : '#fff'};`,
				    // 是否显示顶部分类
				    cateVisible,
				    // 轮播图的数据
				    bannerData: (data.data || []).map((item, index) => ({
				        id: index,
				        // 点击时跳转地址
				        link: item.link,
				        // 图片的地址
				        imgUrl: this.$util.deepGet(item, 'thumb.file_path') || ''
				    })),
				    // 顶部分类的数据
				    cateData: cateVisible ? [
				        {
				            id: 'home',
				            title: '推荐'
				        },
				        ...this.topCateRes.map(item => ({
				            _item: item,
				            // 分类id 查询商品列表要用
				            id: item.category_id,
				            // 分类名称
				            title: item.name || ''
				        }))
				    ] : []
				}
			},
			cDiyItems() {
				const index = this.diyItems.findIndex(item => item.key === 'graphiccenter')
				if(index === -1) return this.diyItems
				const target = {...this.diyItems[index]}
				if (target) {
					const paramsxdata = target.paramsxdata
					const account = paramsxdata.map(item => {
						let number = 0
						if (this.userInfo && this.userInfo.user_id) {
							if (item === '余额') {
								number = this.userInfo.balance
							} else if (item === '积分') {
								number = this.userInfo.integral
							} else if (item === '订单') {
								number = this.orderCount.send
							} else if (item === '优惠券') {
								number = this.userInfo.coupon
							} else if (item === '红包') {
								number = this.orderCount.redEnvelopes
							}
						}
						return {
							name: item,
							num: number
						}
					})
					target.logindata = {
						login: !!this.mainMixin_userInfo.user_id,
						photourl: this.mainMixin_userInfo.avatarUrl,
						name: this.mainMixin_userInfo.nickName,
						vipopen: this.mainMixin_userInfo.is_member,
						card_title: this.mainMixin_memberInfo.card_title,
						account: account
					}
					console.log('2222222',target.loginData)
				}
				const newArr = [...this.diyItems]
				newArr[index] = target
				return newArr
				
			}
		},
		components: {
			HomeHeader,
			DiyPage,
			DiyTab
		},
		beforeCreate() {
			// #ifdef MP-WEIXIN
			uni.hideTabBar();
			// #endif
		},
		onLoad(options) {
			App.showLoading();
			// console.log("page,load");
			this.page_id = options.page_id;
			this.getPageData(options.page_id);
		},
		onShow() {

		},
		created() {

		},
		mounted() {

		},
		watch: {
			
			pageOptions(options) {
				if (options.params.title) {
					uni.setNavigationBarTitle({
						title: options.params && options.params.title ? options.params.title : ""
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
						console.log('share_describe-diy 1111', share_describe)
						wxApi.wxShare({
							title: options.params.sharetitle || share_title, // 分享标题
							desc: options.params.shareinfo || share_describe, // 分享描述
							link: `${App.siteInfo.siteroot}h5/#/pages/mainPages/index/diypage?&i=${App.getUniacid()}&page_id=${this.page_id}&referee_id=${App.getUserId()}`, // 分享链接
							imgUrl: sharepath === "default_picture.png" ? (wechat_share_image ? wechat_share_image[0].file_path : "") : sharepath,
						})
					});
				}
			},
			cHomeHeaderData(val) {
			    if (val.cateVisible && !this.topCateResFetched) {
			        // 只请求一次
			        this.topCateResFetched = true
			        this.fetchTopCateRes()
			    }
			},
		},
		methods: {
			// 顶部分类点击事件
			onTopCateClick(item, index) {
			    // console.log('onTopCateClick', item, index)
			    this.topCateIndex = index
			    if (index > 0) {
			        // 点击的是其他类别
			        this.fetchGoodsListRes({
			            resetBeforeFetch: true
			        })
			    }
			},
			// 顶部轮播图点击
			onTopSwiperItemClick(item) {
			    this.navigationTo(item.link)
			},
			// 请求顶部分类接口数据的方法
			async fetchTopCateRes() {
			    try {
			        const res = await App._getP('Category/getCateList')
			        this.topCateRes = this.$util.deepGet(res, 'data') || []
			    } catch (e) {
			        // TODO handle the exception
			    }
			},
			getPageData(page_id) {
				let _this = this;
				App._get("diy.Diy/getHomeConfigInfo", {
					page_id: page_id || _this.page_id
				}, res => {
					let diyItems = res.data.filter(item => {
						if (this.$util.deepGet(item, 'params.isshow') === "1" || item.key === "otheradvert") {
							if (item.key === "otheradvert") {
								item.data = item.data instanceof Array ? {} : item.data;
							}
							return item;
						}
					});
					// _this.diyItems.splice(0, diyItems.length, ...diyItems);
					_this.diyItems = diyItems
					console.log('hahahahahah',_this.diyItems)
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
				console.log(advertData, 'advertData==================')
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
				console.log(params, 'params===========')
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
		},
		onShareAppMessage() {
			console.log('onShareAppMessage', this.pageOptions.params)
			return {
				title: this.pageOptions.params.sharetitle || this.settingData.share.share_title,
				imageUrl: this.pageOptions.params.sharepath && this.pageOptions.params.sharepath[0] && this.pageOptions.params.sharepath[
					0].file_path,
				path: `/pages/mainPages/index/diypage?page_id=${this.page_id}&referee_id=${this.globalSaveRefereeId}`
			}
		}
	}
</script>

<style>
	.container {
		width: 100vw;
		overflow-x: hidden;
		background-color: #F8F8F8;
	}
</style>
