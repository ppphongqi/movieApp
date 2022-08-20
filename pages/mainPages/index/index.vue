<template>
	<view class="container" :class="tabContainer" :style="themeColor">
		<HomeHeader :type="cHomeHeaderData.type" :cateVisible="cHomeHeaderData.cateVisible"
			:agentName="cHomeHeaderData.agentName" :agentJump="cHomeHeaderData.agentJump" :title="cHomeHeaderData.title"
			:titleStyle="cHomeHeaderData.titleStyle" :cateData="cHomeHeaderData.cateData"
			:swiperData="cHomeHeaderData.bannerData" :scrollTop="scrollTop" @on-cate-item-click="onTopCateClick"
			@on-swiper-item-click="onTopSwiperItemClick" :navBgColor="cHomeHeaderData.navBgColor"></HomeHeader>
		<view style="min-height: 80vh;">
			<block v-if="isShowLead">
				<!-- 引导关注公众号 -->
				<lead-attention placement="bottom"></lead-attention>
			</block>
			<!-- 自定义页面（老版） -->
			<diy-page v-if="cRecommendHomeVisible" ref="diypage" :diy-items="diyItems" :getBind="getBind"
				@getNum='getNum'></diy-page>

			<!-- 自定义页面（老版）end -->
			<!-- 顶部分类对应的商品列表(新版) -->
			<block v-else>
				<!-- 列表 -->
				<GoodsCard :item-data="cCateGoodsData" :item-style="cCateGoodsStyle"></GoodsCard>
				<!-- 列表 end -->
				<!-- 加载中提示 -->
				<LoadMore v-if="goodsListRes.isFetching"></LoadMore>
				<!-- 加载中提示 end -->
			</block>
			<!-- 顶部分类对应的商品列表(新版) end -->
			<!-- 红包提示 -->
			<view class="bonus-tips dis-flex flex-x-around flex-y-center f-24  col-f"
				:class="{'bonus-tips-ipx':isIphoneX}" v-if="showBonus">
				<view class="">你还有<text class="col-s">{{pageOptions.redEnvelop_num}}</text>个红包待使用,快快下单立享优惠!</view>
				<view class="bonus-tips-btn" @click="navigationTo('pages/subPages/user/coupon/coupon?type=bonus')">立即查看
				</view>
				<view class="iconfont icon-roundclose" @click="showBonus = false"></view>
			</view>
			<!-- 平台提示 -->
			<app-protocol @readSuccess="readSuccess"></app-protocol>
			<!-- 自定义底部菜单 -->
			<diy-tab :cNum="num"></diy-tab>
			<!-- 右上角添加小程序功能提示 -->
			<AddsamllFunction ref="addsamllFunction" :follow='is_follow' :isCustomNav="true"></AddsamllFunction>
			<page-loading ref="loading"></page-loading>
			<voucher ref="voucher" :config="{'diyItems':diyItems}" @closeEvt="advertHandle"></voucher>
		</view>
		<Copyright></Copyright>
		<!-- 分销商 -->
		<DistributorFixed />
		<!-- 分销商 end -->
		<!-- #ifdef H5 -->
		<FollowImgPopup v-if="settingData && settingData.qzgz" :visible="settingData.qzgz.indexOf('index') !== -1">
		</FollowImgPopup>
		<!-- #endif -->
	</view>
</template>

<script>
	import DiyPage from '@/components/page/DiyPage.vue'
	import DiyTab from '@/components/template/TabBar.vue'
	import AppProtocol from '@/components/template/AppProtocol.vue'
	import App from '@/common/js/app.js'
	import AddsamllFunction from '@/components/template/AddsamllFunction.vue'
	import Voucher from '@/components/template/Voucher.vue'
	import LeadAttention from '@/components/template/LeadAttention.vue'
	import Copyright from '@/components/template/Copyright.vue'
	import HomeHeader from '@/components/template/HomeHeader.vue'
	import GoodsList from '@/components/page/pageComponents/Goods.vue'
	import GoodsCard from '@/components/page/pageComponents/GoodsCard.vue'
	import LoadMore from '@/components/template/Loadmore.vue'
	import DistributorFixed from '@/components/page/pageComponents/DistributorFixed.vue'
	// #ifdef H5
	import FollowImgPopup from '@/components/page/pageComponents/FollowImgPopup.vue'
	// #endif


	// #ifdef H5
	import wxApi from '@/static/h5/wxApi.js'
	// #endif
	export default {
		data() {
			return {
				is_follow: '',
				num: '',
				diyItems: [],
				imageList: [],
				express: '',
				// 页面的信息 比如标题等
				pageOptions: null,
				showBonus: false,
				isPageShow: false,
				isFollowWechat: false, // 是否公众号进入
				getBind: {},
				options: {},
				homeconfiginfo: [],
				paramsxdata: [],
				orderCount: {},
				member_Info: {},
				userInfo: {},
				// 当前页面的scrollTop
				scrollTop: 0,
				// 当前顶部分类选中的索引，-1代表没选中 0代表选中的推荐。-1和0都是老的版面样式。其他值都是统一一个列表样式
				topCateIndex: -1,
				// 顶部分类的接口（当取得了顶部信息时，再根据需不需要取顶部分类来决定要不要请求分类的值）
				topCateRes: [],
				// 类别商品列表的接口数据
				goodsListRes: {
					// 原始接口数据
					data: [],
					// 是否正在请求
					isFetching: false,
					// 是否还有更多
					hasMore: true,
					// 当前页码,0代表还未请求
					page: 0,
					// 分页大小
					listRow: 20
				},
				// 类别商品列表的演示
				goodsItemStyle: {

				},
				// 代理信息的接口数据
				aidRes: {

				},
				// 当前地址的接口数据
				locationRes: {},
			}
		},
		components: {
			DiyPage,
			DiyTab,
			AppProtocol,
			AddsamllFunction,
			Voucher,
			LeadAttention,
			Copyright,
			HomeHeader,
			GoodsList,
			LoadMore,
			GoodsCard,
			DistributorFixed,
			// #ifdef H5
			FollowImgPopup
			// #endif
		},
		computed: {
			// 登陆组件参数
			LoginData() {
				if (this.loginuser_id) {
					return {
						login: this.loginuser_id,
						photourl: this.userInfo.avatarUrl,
						name: this.userInfo.nickName,
						vipopen: this.userInfo.is_member,
						card_title: this.member_Info.card_title,
						account: this.account
					}
				}
			},
			// 登录组件右侧最终卡卷信息
			account() {
				return this.paramsxdata.map(item => {
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
			},
			// 返回用户登录id判断登录状态
			loginuser_id() {
				return this.userInfo && this.userInfo.user_id
			},
			// 返回需要展示的卡卷信息
			// homeconfig() {
			// 	return this.homeconfiginfo && this.homeconfiginfo[0] && this.homeconfiginfo[0].paramsxdata
			// },
			// 类别商品的格式化数据
			cCateGoodsData() {
				// 原始的商品列表数据
				const data = this.goodsListRes.data || []
				return data.map(item => ({
					...item,
					goods_image: this.$util.deepGet(item, 'image[0].file_path') || '',
					goods_price: item.spec_type === 20 ? item.goods_min_price : this.$util.deepGet(item,
						'sku[0].goods_price', ''),
					line_price: this.$util.deepGet(item, 'sku[0].line_price', '')
				}))

			},
			// 类别商品应该应用的样式
			cCateGoodsStyle() {
				const itemStyle = {
					display: '3',
					margincol: '10',
					marginrow: '15'
				}
				const is_goods_long = this.$util.deepGet(this.settingData, 'is_goods_long', [])
				if (is_goods_long.indexOf('2') != '-1') {
					itemStyle.display = '1-2'
				}
				return itemStyle
			},
			// 新版顶部分类的相关格式化数据
			cHomeHeaderData() {
				const data = this.pageOptions || {}
				let cateVisible = false
				let agentJump = true
				if (+this.$util.deepGet(data, 'params.pattern') === 3 && +this.$util.deepGet(data,
						'params.shownavigation') === 1 || +this.$util.deepGet(
						data,
						'params.classtype'
					) === 1 && +this.$util.deepGet(data, 'params.pattern') === 2) {
					cateVisible = true
				}
				let agentName = ''
				if (+this.$util.deepGet(this.settingData, 'agent_open') === 1) {
					agentName = this.$util.deepGet(this.aidRes, 'areaname', '正在定位')
				} else if (+this.$util.deepGet(this.settingData, 'is_display_location') === 1) {
					agentJump = false
					agentName = this.$util.deepGet(this.locationRes, 'result.addressComponent.city', '正在定位')
				}
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
					cateData: cateVisible ? [{
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
					] : [],
					// 代理的名字
					agentName,
					agentJump
				}
			},
			// 当前显示推荐首页还是商品列表页
			cRecommendHomeVisible() {
				return [
					-1,
					0
				].indexOf(this.topCateIndex) !== -1
			},
			isopen_float() {
				return this.$store.state.floatOpen
			},
			canTip() {
				return !!this.$store.state.userInfo && this.$store.state.userInfo.can_tip
			},
			isShowLead() {
				let isShowLead = false
				// #ifdef MP
				isShowLead = this.canTip === 3
				// #endif
				// #ifdef H5
				isShowLead = true
				// #endif
				return isShowLead
			}
		},
		beforeCreate() {
			// #ifdef MP-WEIXIN
			uni.hideTabBar()
			// #endif
		},
		onLoad(options) {
			// 将会通过watch跳转到免单首页
			if (this.$util.deepGet(this.settingData, 'free.free_home_page') == 1) {
				console.log('onLoad将会通过watch跳转到免单首页')
				return
			}
			this.pageLoad(options)
			this.getUserDetail()
		},
		async onShow() {
			// 将会通过watch跳转到免单首页
			if (this.$util.deepGet(this.settingData, 'free.free_home_page') == 1) {
				console.log('onShow将会通过watch跳转到免单首页')
				return
			}
			try {
				await this.getUserDetail()
			} catch (e) {
				// TODO handle the exception
			}
			// this.fetchTopCateRes()
			this.getData()
			this.getPageData(this.options.pageLogin ? this.options.pageLogin : 0)
			// 没有用户信息的时候，不触发发券宝
			if (this.diyItems && this.diyItems.length > 0 && App.validateUserInfo()) {
				this.getVoucherCoupon('show')
			}
			console.log("jfjfjfjff", this.options)
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				menus: [
					'shareAppMessage',
					'shareTimeline'
				]
			})
			// #endif
			// #ifdef H5
			// setTimeout(() => {
			//     // console.log('onShow setTimeout index')
			//     uni.pageScrollTo({
			//         scrollTop: 1,
			//         duration: 0
			//     })
			//     setTimeout(() => {
			//         // console.log('onShow setTimeout index')
			//         uni.pageScrollTo({
			//             scrollTop: 0,
			//             duration: 0
			//         })

			//     }, 0)
			// }, 200)
			// #endif
		},
		watch: {
			LoginData(val) {
				console.log('LoginData 222222', val)
			},
			pageOptions(options) {
				// console.log("options",options)
				if (options.params && options.params.title) {
					// console.log('设置标题栏', options.style.texttype === '1' ? '#000000' : '#ffffff', options.style.bgcolor)
					setTimeout(() => {
						uni.setNavigationBarTitle({
							title: options.params && options.params.title ? options.params.title : ''
						})
						uni.setNavigationBarColor({
							frontColor: options.style.texttype === '1' ? '#000000' : '#ffffff',
							backgroundColor: options.style.bgcolor
						})
					}, 0)
					if (this.topColor == '#FFD940') {
						uni.setNavigationBarColor({
							frontColor: options.style.texttype === '1' ? '#000000' : '#ffffff',
							backgroundColor: options.style.bgcolor
						})
					}
					this.showBonus = options.redEnvelop_num > 0
					if (this.appClientType === '4') {
						// console.log(`分享链接是${App.siteInfo.siteroot}h5/#/pages/mainPages/index/index?referee_id=${this.globalSaveRefereeId}&i=${App.getUniacid()}`)
						let sharepath = options.params.sharepath[0].file_path,
							wechat_share_image = this.settingData.share && this.settingData.share.wechat_share_image
						wxApi.wxShare({
							title: options.params.sharetitle, // 分享标题
							desc: options.params.shareinfo, // 分享描述
							link: `${App.siteInfo.siteroot}h5/#/pages/mainPages/index/index?referee_id=${this.globalSaveRefereeId}&i=${App.getUniacid()}&aid=${App.siteInfo.aid || ''}`, // 分享链接
							imgUrl: sharepath === 'default_picture.png' ? (wechat_share_image ? wechat_share_image[
								0].file_path : '') : sharepath
						})
					}
				}
			},
			cHomeHeaderData(val) {
				if (val.cateVisible && !this.topCateResFetched) {
					// 只请求一次
					this.topCateResFetched = true
					this.fetchTopCateRes()
				}
			},
			settingData: {
				handler(val = {}) {
					if (val && val.is_display_location == 1) {
						this.fetchLocationRes()
					}
					if (val.free && val.free.free_home_page == 1) {
						App.navigationTo({
							url: 'pages/subPages/myfreeBill/index',
							redirect: true
						})
						return
					}
				},
				immediate: true
			}
		},

		methods: {
			async fetchLocationRes() {
				try {
					// 获取当前位置
					const location = await App.getLocation()
					if (!location.latitude || !location.longitude) {
						// App.showError('获取当前位置失败，请稍候或检查定位设置后重试')
						return
					}
					// 获取aid
					const res = await App._postP('agent.index/getLocation', {
						lat: location.latitude,
						lng: location.longitude
					})
					this.locationRes = res.data || {}
					console.log('fetchLocationRes success', this.locationRes)
				} catch (e) {
					console.log('fetchAidRes error', e)
					// TODO handle the exception
				}
			},
			// 检查当前代理是否在和当前定位一致
			async checkAgent() {
				try {
					this.$store.dispatch('getTabBarData')
					// 获取当前位置
					const location = await App.getLocation()
					if (!location.latitude || !location.longitude) {
						// App.showError('获取当前位置失败，请稍候或检查定位设置后重试')
						return
					}
					// 获取aid
					const res = await App._postP('agent.index/aidTip', {
						lat: location.latitude,
						lng: location.longitude
					})
					const data = this.$util.deepGet(res, 'data') || {}
					const self = this
					if (+data.status === 3) {
						// #ifdef MP-WEIXIN
						// 存储Storage
						uni.setStorageSync('aid', {
							...data,
							aid: 0
						})
						App.setSiteInfo()
						// 刷新页面
						self.getPageData()
						self.getData()
						// #endif
						// #ifdef H5
						console.log('h5重启', window.location.href)
						// window.location.href = self.$util.changeURLArg(window.location.href,'aid',0)
						window.location.replace(self.$util.changeURLArg(window.location.href, 'aid', 0))
						window.location.reload()
						// #endif
					} else if (+data.status === 1 && this.settingData && this.settingData.agent_tip_switch == 1) {
						uni.showModal({
							title: '友情提示',
							content: `定位到您在${data.areaname},是否切换到该地区？`,
							success(res) {
								if (!res.confirm) return
								console.log('success', res)

								console.log('友情提示', data)
								// #ifdef MP-WEIXIN
								// 存储Storage
								uni.setStorageSync('aid', data)
								App.setSiteInfo()
								// 刷新页面
								self.pageOptions = {}
								self.getPageData()
								self.getData()
								// #endif
								// #ifdef H5
								console.log('h5重启', window.location.href)
								window.location.replace(self.$util.changeURLArg(window.location.href, 'aid',
									data.aid))
								window.location.reload()
								// #endif
							}
						})
					} else if (+data.status === 1 && this.settingData && this.settingData.agent_auto_switch == 1) {
						const lastAutoSwitchTime = uni.getStorageSync('lastAutoSwitchTime') || 0
						console.log('lastAutoSwitchTime', lastAutoSwitchTime, +new Date() - lastAutoSwitchTime)
						if (+new Date() - lastAutoSwitchTime < 1000 * 60 * 60 * 24) {
							console.log('lastAutoSwitchTime 一天内只自动切换一次')
							// 一天内只自动切换一次
							return
						}
						uni.setStorageSync('lastAutoSwitchTime', +new Date())
						// #ifdef MP-WEIXIN
						// 存储Storage
						uni.setStorageSync('aid', data)
						App.setSiteInfo()
						// 刷新页面
						this.pageOptions = {}
						self.getPageData()
						self.getData()
						// #endif
						// #ifdef H5
						console.log('h5重启', window.location.href)
						window.location.replace(self.$util.changeURLArg(window.location.href, 'aid', data.aid))
						window.location.reload()
						// #endif
					}
				} catch (e) {
					//TODO handle the exception
				}
			},
			// 代理信息的接口数据
			async fetchAidRes() {
				try {
					// 获取当前位置
					const location = await App.getLocation()
					if (!location.latitude || !location.longitude) {
						// App.showError('获取当前位置失败，请稍候或检查定位设置后重试')
						// return
					}
					// 获取aid
					const res = await App._postP('agent.index/getAid', {
						lat: location.latitude,
						lng: location.longitude
					})
					this.aidRes = res.data || {}
					// 存储aid信息到localStorage
					uni.setStorageSync('aid', res.data || {})
					// 更新app.siteInfo
					App.setSiteInfo()
				} catch (e) {
					console.log('fetchAidRes error', e)
					//TODO handle the exception
				}
			},
			// 获取用户当前信息
			async getUserDetail() {
				try {
					const res = await App._getP('user.index/detail', {
						no_login: 1
					})
					this.orderCount = res.data.orderCount
					this.member_Info = res.data.member_Info
					this.userInfo = res.data.userInfo
				} catch (e) {
					console.log(e)
					// TODO handle the exception

				}
			},
			// 顶部轮播图点击
			onTopSwiperItemClick(item) {
				this.navigationTo(item.link)
			},
			// 顶部分类点击事件
			onTopCateClick(item, index) {
				console.log('onTopCateClick', item, index)
				const source = item._item || {}
				if (source.link_type == 2) {
					this.navigationTo(source.link)
					return
				}
				this.topCateIndex = index
				if (index > 0) {
					// 点击的是其他类别
					this.fetchGoodsListRes({
						resetBeforeFetch: true
					})
				}
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
			// 请求类别商品接口数据的方法
			async fetchGoodsListRes({
				// 请求之前是否重置当前的列表
				resetBeforeFetch = false
			} = {}) {
				if (resetBeforeFetch) {
					this.goodsListRes = {
						...this.goodsListRes,
						data: [],
						isFetching: false,
						hasMore: true,
						page: 0
					}
				}
				try {
					// 如果是点击推荐也不必请求
					if (this.topCateIndex <= 0) {
						return Promise.reject()
					}
					// 没有更多了就不必再请求了
					if (!this.goodsListRes.hasMore) {
						return Promise.reject()
					}
					// 如果没有指定id也不用请求了
					const category_id = this.$util.deepGet(this.cHomeHeaderData, `cateData.${this.topCateIndex}.id`,
						'')
					// console.log('当前要请求的Id', category_id, this.cHomeHeaderData)
					if (!category_id) {
						return Promise.reject()
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.goodsListRes.isFetching = true
					// 请求数据
					const res = await App._getP('goods/lists', {
						page: this.goodsListRes.page + 1,
						listRow: this.goodsListRes.listRow,
						sortType: 'all',
						sortPrice: 'price',
						category_id
					})
					// 取得新的数据
					const newData = this.$util.deepGet(res, 'data.list.data', [])
					// 判断是否有更多
					const hasMore = newData.length >= this.goodsListRes.listRow
					// console.log()
					// 设置新的数据
					this.goodsListRes = {
						...this.goodsListRes,
						page: this.goodsListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ? newData : this.goodsListRes.data.concat(newData),
						hasMore,
						isFetching: false
					}
				} catch (e) {
					console.log(e)
					// TODO handle the exception
				}
			},
			getData() {
				App._post_form('user.index/getShareSetting', {
					no_login: 1
				}, res => {
					this.is_follow = res.data.is_follow
				})
			},
			getNum(val) {
				this.num = val
			},
			getBindReg() {
				let _this = this
				App._post_form('cgp.Reg/getBindReg', {
					no_login: 1
				}, res => {
					_this.getBind = res.data
				})
			},
			/**
			 * 页面加载处理
			 */
			pageLoad(options) {
				uni.setStorageSync('isAdvertShow', 1)
				this.isFollowWechat = options ? options.followWechat == 1 : false
				this.options = options
				// this.getPageData(options.pageLogin ? options.pageLogin : 0);
			},
			/**
			 * 获取自定义首页信息
			 */
			getPageData(pageLogin = 0) {
				// 将会通过watch跳转到免单首页
				if (this.$util.deepGet(this.settingData, 'free.free_home_page') == 1) {
					return
				}
				let _this = this,
					userInfo = uni.getStorageSync('userInfo'),
					isRead = this.settingData.helpbtn === '1' ? (userInfo ? userInfo.is_read === 1 : !0) : !0
				_this.isPageShow = true
				let location = {}
				// console.log('开始获取定位')
				App.getLocation().then(res => {
					location = res
					// console.log('location = res', location)
				}).
				catch(() =>
					// console.log('获取位置信息失败')
					Promise.resolve()).
				then(() => {
					App._get('diy.Diy/getHomeConfigInfo', {
						// not_token: "1",
						lat: location.latitude || '',
						lng: location.longitude || ''
					}, res => {
						try {
							let diyItems = (res.data || []).filter(item => {
								if ((item.params && item.params.isshow && item.params.isshow ===
										'1') || item.key === 'otheradvert' || item.key ==
									'graphiccenter') {
									if (item.key === 'otheradvert') {
										item.data = item.data instanceof Array ? {} : item.data
									}
									if (item.key == 'graphiccenter' && item.params.isshow && item
										.params.isshow === '1') {
										_this.paramsxdata = item.paramsxdata
										// 这个时候this.LoginData完全可能没有
										item.logindata = this.LoginData || {}
										console.log('item.logindata', item.logindata)
									}
									if (item.key === 'otheradvert') {
										item.manydata = (item.manydata || []).map((data,
											index) => {
											const dataKeyMap = ({
												'1': '',
												'2': 'goodsdata',
												'3': 'luckdata',
											})
											const dataKey = dataKeyMap[data.params.type]
											console.log('formatAdvert', {
												id: index,
												data: data[dataKey] && data[
													dataKey][0] || {},
												params: data.params,
												style: item.style
											})
											return {
												id: index,
												data: data[dataKey] && data[dataKey][0] ||
												{},
												params: data.params,
												style: item.style
											}
										}).filter(data => {
											console.log('data.params',data.params)
											return data.params && data.params.open == 1 
										})
									}
									return item
								}
							})
							if (diyItems.find(item => item.key === 'graphiccenter')) {
								_this.diyItems = [...diyItems]
							}
							if (pageLogin === 0) {
								// 为什么之前用splice？？？？
								// _this.diyItems.splice(0, diyItems.length, ...diyItems)
								_this.diyItems = [...diyItems]
								_this.pageOptions = res.data[0]
								console.log('pageLogin === 0', [..._this.diyItems])
							}
							if (App.validateUserInfo()) {
								_this.getVoucherCoupon('load')
							} else if (isRead) {
								_this.advertHandle('load')
							}
							let flag = false
							_this.diyItems.map(rel => {
								if (rel.name == '团购') {
									flag = true
								}
							})
							flag && this.getBindReg()
						} catch {

						}

						console.log('哈哈哈哈111')
						if (+this.$util.deepGet(this.settingData, 'agent_open') === 1) {
							this.fetchAidRes().then(() => {
								this.checkAgent()
							})
						}
						App.hideLoading()
						uni.stopPullDownRefresh()

						// console.log('首页数据--------------',_this.diyItems)

					}, res => {}, res => {
						App.hideLoading()
					})
				})
			},

			/**
			 * 发券宝
			 */
			getVoucherCoupon(showType) {
				// console.log(userInfo, 'userInfo=====1111111111111111======')
				let _this = this,
					userInfo = uni.getStorageSync('userInfo'),
					isRead = this.settingData.helpbtn === '1' ? (userInfo ? userInfo.is_read === 1 : !0) : !0,
					// isFollowWechat = userInfo?(userInfo.is_follow==2?this.isFollowWechat:false) :this.isFollowWechat,
					isFollowWechat = this.isFollowWechat,
					scene = uni.getStorageSync('scene')
				App._get('voucher.Voucher/VoucherCoupon', {
					// not params
					// test:1,//是否测试 1-不发券
					no_login: 1,
					collection_or_follow: scene === 1089 ? '6' : (isFollowWechat ? '5' : '') // 5 公众号 6 小程序
				}, res => {
					const {
						code,
						data
					} = res
					if (code == 1 && isRead) {
						if (!!data && Array.isArray(data) && _this.$refs) {
							_this.$refs.voucher.showVoucher = !0
							_this.$refs.voucher.couponList = data.filter(item => item.voucher_coupon_term == 1 ||
								item.voucher_coupon_term ==
								3 || item.voucher_coupon_term == 4)
							_this.$refs.voucher.couponMoreList = data.filter(item => item.voucher_coupon_term == 2)
							if (_this.$refs.voucher.couponList[0]) {
								let voucher_coupon_term = _this.$refs.voucher.couponList[0].voucher_coupon_term;
								(voucher_coupon_term === 3 || voucher_coupon_term === 4) && (_this.$refs
									.addsamllFunction.collectGuide = !1)
							}
						} else {
							// console.log('ishow__________________________________')
							_this.advertHandle(showType)
						}
					}
				})
			},
			/**
			 * 弹窗操作
			 * @param {Object} showType 显示类型
			 */
			advertHandle() {
				const _this = this;
				const index = this.$store.state.openAdvertIndex
				let advertData = _this.diyItems[_this.diyItems.length - 1] && _this.diyItems[_this.diyItems.length - 1]
					.manydata && _this.diyItems[_this.diyItems.length - 1].manydata[index];
				// console.log('advertData', advertData)
				if (!!advertData) {
					_this.getAdvertShow(advertData.params).then(result => {
						if (result) {
							_this.$store.commit('showAdvert', true)
							uni.setStorageSync('isShowAdvert', '1')
						}
					})
				}
				this.$store.state.shareSetting.is_follow == 2 && (this.$store.state.shareSetting.is_follow = 1)

			},
			/**
			 * 获取弹窗广告是否显示
			 */
			getAdvertShow(params) {
				let {
					open, // 是否开启1开启 2关闭
					status, // 显示类型 1仅首次 2每次 3多次
					pattern, // 弹窗样式 1默认 2自定义
					rate, // 每人/每天显示次数
					type, // 广告类型 1图片 2商品 3抽奖
					overtime
				} = params,
				nowTime = new Date().getTime() / 1000,
					isLogin = !!this.$store.state.userInfo,
					isShowed = uni.getStorageSync('isShowAdvert') === '1' // 是否已经显示过过弹窗
				// 如果用户未登录，则只显示一次，且不计次数
				if (!isLogin && open === '1') {
					status = '1'
				}
				return new Promise((resolve, reject) => {
					// 倒计时小于当前时间，弹窗不显示
					if (type != '1' && pattern === '2' && nowTime > overtime) {
						resolve(false)
						return
					}
					if (open === '1') {
						if (status === '1') {
							resolve(!isShowed)
						} else if (status === '2') {
							resolve(true)
							uni.removeStorageSync('isShowAdvert')
						} else if (status === '3' && Number(rate) > 0) {
							// console.log(11111111111111111)
							App._get('diy.Diy/getUserAdvertisement', {
								no_login: 1,
								rate
							}, res => {
								resolve(res.data)
							})
						}
					} else {
						resolve(false)
					}
				})
			},
			/**
			 * 用户条款回调
			 */
			readSuccess() {
				this.getVoucherCoupon()
			}
		},
		onUnload() {
			this.$store.commit('showAdvert', false)
		},
		onPullDownRefresh() {
			uni.removeStorageSync('showAdvert')
			this.getPageData()
			this.getData()
		},
		onReachBottom() {
			if (this.topCateIndex > 0 && !this.goodsListRes.isFetching && this.goodsListRes.hasMore) {
				this.fetchGoodsListRes()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
			if (this.isopen_float) {
				this.$store.commit('floatOpen', !1)
			}
		},
		onShareAppMessage(e) {
			// console.log('分享类型',e)
			console.log('onShareAppMessage 1212121212', this.pageOptions.params.sharepath[0])
			// console.log(this.pageOptions)
			let file_path = this.pageOptions.params.sharepath[0].file_path
			// 点击整点秒杀分享按按钮（小程序）
			if (e.from === 'button' && e.target.id === 'seckill') {
				return {
					title: '整点秒杀（测试数据）',
					imageUrl: file_path === 'default_picture.png' ? '' : file_path,
					path: '/pages/mainPages/index/index?referee_id=' + this.globalSaveRefereeId
				}
			}

			return {
				title: this.pageOptions.params.sharetitle || this.settingData.share.share_title,
				imageUrl: file_path === 'default_picture.png' ? '' : file_path,
				path: '/pages/mainPages/index/index?referee_id=' + this.globalSaveRefereeId
			}

		},
		onShareTimeline() {
			let file_path = this.pageOptions.params.sharepath[0].file_path
			return {
				title: this.pageOptions.params.sharetitle || this.settingData.share.share_title,
				imageUrl: file_path === 'default_picture.png' ? '' : file_path
			}
			//
		}
	}
</script>

<style>
	.container {
		overflow-x: hidden;
		background-color: #F8F8F8;
	}

	/* 这种办法小程序生产环境 不支持 */
	/* 	.container.tab-container .attention {
		top: initial;
		bottom: 88rpx;
	} */

	.bonus-tips {
		position: fixed;
		left: 40rpx;
		right: 40rpx;
		bottom: 96rpx;
		background: rgba(0, 0, 0, .5);
		padding: 8rpx 12rpx;
		border-radius: 8rpx;
		z-index: 2;
	}

	.bonus-tips.bonus-tips-ipx {
		bottom: calc(96rpx + 20px);
	}

	.bonus-tips-btn {
		padding: 6rpx 8rpx;
		margin: 0 auto;
		border-radius: 8rpx;
		background: #FE504F;
	}
</style>
