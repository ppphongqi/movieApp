import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import App from '@/common/js/app.js'
import {
	dateFormat
} from '@/common/js/date.js'
import listMixin from '@/common/js/pageListMixin.js'
import {
	couponItemConverter
} from '@/common/js/dataConverter/couponItemConverter'
import groups from './groups.js'
import bargain from './bargain.js'
import {
	wxRequestSubscribeMessageX
} from '@/common/js/wxPromise.js'
import pageShareMixin from '@/common/js/pageShareMixin.js'
// #ifdef H5
import wxApi from '@/static/h5/wxApi.js'
// #endif
dayjs.extend(duration)
let successTimer = null,
	indexTimer = null,
	setTimer = null,
	page = {
		mixins: [
			listMixin,
			groups,
			bargain,
			pageShareMixin
		],
		data() {
			return {
				// 礼包查看详情弹窗是否显示
				openPopupVisible: false,
				// 详情弹窗的目标
				openPopupTarget: {},
				// 页面的options
				options: {},
				// 当前未支付订单接口数据
				orderNotPaidRes: {},
				// 当前正在领取的优惠券的信息
				couponReceivedObj: {},
				// 优惠券领取成功弹窗是否是否显示
				couponReceivedPopupVisible: false,
				// 待支付订单弹窗是否显示
				orderToBePaidPopupVisible: false,
				// 当前视频是否显示,在H5中只有为true才显示，小程序不受这个控制
				goodsVideoVisible: false,
				// 预约成功的提示弹窗是否显示
				appointmentSuccessPopupVisible: false,
				// 当前我要预约的倒计时字符串
				appointmentCountDownStr: '',
				// 商品的接口信息
				goodsRes: {},
				// 音频播放的状态v-model
				audioStatus: 'play',
				// 关注公众号二维码弹窗是否显示
				followGzhPopupVisible: false,
				text_diy: {},
				showAll: false,
				fxStatus: true,
				disabledTally: false,
				hideStock: false,
				isSpecSignid: true,
				isMoreStore: false, // 展示更多门店
				detailType: '1', // 商品详情显示类型 1-商品详情 2-商品评价
				showBuyMenu: false,
				showGoodsSpec: false,
				expected_service: '',
				popupType: 'param', // 弹框类型
				currentIndex: 1, // 轮播图指针
				detail: {}, // 商品详情信息
				dealer_tip: false, // 是否显示分销赚
				bargain_data: {}, // 砍价详情信息
				content: '', // 商品富文本
				byKnow: '', // 购买须知
				param: {}, // 商品参数
				serve: null, // 商品服务
				goods_price: 0, // 商品价格
				goods_min_price: 0, // 商品最低价格
				// 商品显示的价格 sale_type营销方式（0:普通营销；1：秒杀；2：拼团；3：抽奖；4：砍价.....）sale_type为1的时候显示sku[0].goods_price,否则显示goods_min_price
				goods_show_price: 0,
				line_price: 0, // 划线价格
				stock_num: 0, // 库存数量
				limit_buy: 0, // 是否开启限购
				surplus_quantity: 0, // 用户可购买数量
				image_path: '', // 购买图片
				goods_num: 1, // 商品数量
				goods_sku_id: '', // 规格id
				cart_total_num: 0, // 购物车商品总数量
				specData: [], // 多规格信息
				scrollIntoView: '',
				showBottomPopup: false,
				goods_spec_arr: [], // 商品选中规格

				businessInfo: null, // 商家信息
				businessList: [], // 商家门店列表
				bannerType: 'imgs',
				user_image: [], // 购买用户头像
				tieredPrice: [], // 阶梯价数组
				isTieredPriceGoods: 0, // 是否为阶梯价商品
				ismember: false, // 是否为会员
				pageScroll: 0,

				referee_id: null, // 分销推荐人id
				isBind: false, // 是否绑定上下级关系
				spike_id: '', // 秒杀活动id

				goods_end_time: null, // 秒杀倒计时

				// 视频组件设置
				videoParams: {
					params: {
						videotype: '2',
						videolink: '',
						videocover: ''
					},
					itemStyle: {
						display: '3'
					}
				},
				RecommendClass: 1,
				showTopPopup: false,
				shareData: null, // 分享数据
				group_id: null,
				goods_type: null,
				activityData: null, // 商品活动数据
				community: null,
				showCommunity: false, // 社群显示开关
				sku_coupon_price: 0, // 多规格会员优惠价
				has_stock: false,
				barrageList: [], // 弹幕数据
				showTips: false, // 显示弹幕
				tipsIndex: 0,
				groupScopeTime: null,
				bargainScopeTime: 0,
				skuItem: null, // 规格项
				activityStatus: {
					status: 0, // 活动状态
					leftTime: 0, // 剩余时间
					type: '' // 当前活动类型
				}, // 活动状态
				goodsActivity: {}, // 商品活动
				clientType: {
					'1': '导入',
					'2': '微信小程序',
					'3': 'H5',
					'4': '公众号',
					'5': '安卓',
					'6': '苹果',
					'7': '支付宝小程序',
					'8': '百度小程序',
					'9': '头条/字节跳动小程序'
				},
				kf_phone: '',
				customer: '', // 自定义操作按钮
				coupon_list: [], // 商品优惠券
				showCouponList: false,
				dealer_diy: '',
				dealer_type: '',
				isShowDealerTip: true, // 是否显示分销返佣
				user_is_dealer: false, // 当前用户是否是分销商
				swiperHeight: 375, // 轮播图图片高度
				receiveing: false, // 是否优惠券领取中
				cart_total_num: 0, // 购物车商品数量
				dealer_basic: {},
				roomid: '',
				businessStore: {},
				isMemberExclusiveGoods: false, // 是否会员专属商品
				// 20210122 当前时间的时间戳 以后倒计时就根据这个时间戳在计算属性进行计算
				// 因为这个页面倒计时比较多
				currentTime: {
					// 引用计数标签数组,长度为0说明没有其他部分引用,故可以暂停计时
					counter: [],
					// 定时器
					timer: null,
					// 时间戳
					timeStamp: + new Date()
				},
				// 会员开通弹窗是否显示
				openMemberPopupVisible: false,
				// 会员购买提示弹窗是否显示
				memberBuyPopupVisible: false,
				// 多规格及其对应的会员返利接口数据
				skuRebatePricesRes: {
					
				},
				// 当前选中的多规格的id
				skuActiveId: '',
				// 电话列表弹窗是否显示
				phoneListPopupVisible: false,
				// 当前是否展开显示所有商家
				allBusinessVisible: false,
				// 是否显示同城配送弹窗
				cityBuyPopupVisible: false
			}
		},
		computed: {
			// 当前要显示的商家列表
			cBusinessList() {
				if(this.allBusinessVisible || this.detail.more_store == 1) {
					return this.businessList
				}
				return (this.businessList || []).slice(0,2)
			},
			// 查看更多按钮是否显示
			cBtnViewAllBusinessVisible() {
				return (this.cBusinessList || []).length < (this.businessList||[]).length
			},
			// 当前要显示的返利价格
			cRebatePrice() {
				return this.$util.deepGet(this.skuRebatePricesRes,`${this.skuActiveId}.dealer_money`,'')
			},
			// 免单数据量及其显不显示
			cShareNum() {
				const detail = this.goodsRes && this.goodsRes.detail || {}
				return {
					visible: !!detail.free_id,
					num: detail.share_num || 0,
					avatar: detail.pid_avatarUrl,
					nickname: detail.pid_nickName
				}
			},
			userInfo() {
				return this.$store.state.userInfo || {}
			},
			cAd() {
				const imgUrl = this.$util.deepGet(this.goodsRes, 'detail.adsense_image.0.file_path', '')
				const link = this.$util.deepGet(this.goodsRes, 'detail.adsense_link', '')
				const visible = imgUrl && link
				return {
					imgUrl,
					link,
					visible
				}
			},
			// 限购数据量 为假值就不显示就不显示https://weliam.coding.net/p/lingdian/requirements/issues/6953/detail
			cLimitBuyNum() {
				const detail = this.goodsRes.detail || {}
				const limit_buy = detail.limit_buy
				const hide_info = detail.hide_info || []
				// spec_type 10:单规格，20:多规格
				const spec_type = detail.spec_type || ''
				// 单规格
				if (spec_type == 10) {
					if (detail.limit_buy != 10 || hide_info.some(item => item === 'limitBuy')) {
						return ''
					}
					return detail.limit_num
				}
				// 多规格 实际上在goodsBuyMenu这个组件里面去处理这个显示了（实际上这样不太好。。。）
				if (spec_type == 20) {
					// 当前选中的规格
					return ''
				}
				return ''
			},
			// 下架时间 为假值就不显示https://weliam.coding.net/p/lingdian/requirements/issues/6953/detail
			cOffTimeStamp() {
				const is_under = this.$util.deepGet(this.goodsRes, 'detail.is_under')
				const hide_info = this.$util.deepGet(this.goodsRes, 'detail.hide_info', [])
				if (is_under != 20 || hide_info.some(item => item === 'downTime') || this.detail.goods_status != 10) {
					return 0
				}
				return +this.$util.deepGet(this.goodsRes, 'detail.under_time')
			},
			// 下架时间当前显示的倒计时
			cOffTimeData() {
				const now = this.currentTime.timeStamp
				const end = dayjs(this.cOffTimeStamp)
				const sale_type = this.goodsRes.detail && this.goodsRes.detail.sale_type
				if (+sale_type !== 0 || !this.cOffTimeStamp || end < now) {
					return {
						visible: false
					}
				}
				const diff = dayjs.duration(end.diff(now))
				const days = parseInt(diff.asDays())
				const hours = diff.hours() >= 10 ? diff.hours() : `0${diff.hours()}`
				const minutes = diff.minutes() >= 10 ? diff.minutes() : `0${diff.minutes()}`
				const seconds = diff.seconds() >= 10 ? diff.seconds() : `0${diff.seconds()}`
				return {
					visible: true,
					days,
					hours,
					minutes,
					seconds
				}


			},
			// 格式化的预约倒计时相关信息
			cAppointmentCountDownData() {
				// 当前预约状态1:显示预约倒计时，2:显示已经预约，其他:不显示预约按钮
				const is_open_sale = +this.$util.deepGet(this.goodsRes, 'detail.is_open_sale')
				// 当前预约结束时间(13位时间戳)
				const open_sale_time = +this.$util.deepGet(this.goodsRes, 'detail.open_sale_time')
				// 当前模板消息id
				const template_id = this.$util.deepGet(this.goodsRes, 'detail.template_id', [])
				return {
					is_open_sale,
					open_sale_time,
					template_id
				}
			},
			// 微信小程序客服组件
			cSendMessage() {
				return {
					path: `pages/subPages/goods/index/index?goods_id=${this.$util.deepGet(this.goodsRes, 'detail.goods_id')}&user_id=${App.getUserId()}`,
					title: this.$util.deepGet(this.goodsRes, 'detail.goods_name'),
					img: this.$util.deepGet(this.shareData, 'imageUrl')
				}
			},
			//
			cPopupLayer() {
				return {
					pagePath: `pages/subPages/goods/index/index?community_id=${this.$util.deepGet(this.goodsRes, 'community.id', '')}`
				}
			},
			// 需要强制隐藏的一些东西
			cEleForceHidden() {
				// hide_info：隐藏信息（business：商家信息，buyKnow：购买须知，goodsInfo：商品详情，evaluate：商品评价，priceDescription价格说明）
				const hide_info = this.$util.deepGet(this.detail, 'hide_info', [])
				return {
					// 商家信息
					business: hide_info.indexOf('business') === -1,
					// 购买须知
					buyKnow: hide_info.indexOf('buyKnow') === -1,
					// 商品详情
					goodsInfo: hide_info.indexOf('goodsInfo') === -1,
					// 商品评价
					evaluate: hide_info.indexOf('evaluate') === -1,
					// 价格说明
					priceDescription: hide_info.indexOf('priceDescription') === -1
				}
			},
			cMoney() {
				return (this.dealer_basic.in_join_content || '').replace('{$dealer_money}', this.detail.first_money)
			},
			// 是否已达最大购买数
			isMaxBuyLimit() {
				const {
					buyNumber
				} = this.groupData
				let {
					limit_buy, // 用户限购数量
					surplus_quantity // 用户可购数量
				} = this

				if (typeof buyNumber === 'string') {
					// console.log(this.goods_num,buyNumber,surplus_quantity)
					if (limit_buy === 10 && ((this.goods_num + Number(buyNumber)) >= surplus_quantity)) {
						return !0
					}
					return !1
				}
			},
			spikendTime() {
				return this.detail.end_time
			},
			goodsParams() {
				if (this.param && this.param.value && this.param.value.length > 0) {
					return this.param.value.map(val => val.name).join(' · ')
				}
			},
			goodsSpec() {
				if (this.specData && this.specData.length > 0) {
					return this.specData.map(val => val.spec_item).join(' · ')
				}
			},
			goodsServe() {
				if (this.serve && this.serve.length > 0) {
					return this.serve.map(val => val.title).join(' · ')
				}
			},
			// 设置返回按钮高度
			backBtnHeight() {
				// #ifdef MP-TOUTIAO
				return 0
				// #endif
				// #ifndef MP-TOUTIAO
				return this.$store.state.systemInfo && this.$store.state.systemInfo.statusBarHeight
				// #endif
			},
			isShowGroupDealer() {
				const {
					is_dealer
				} = this.groupData
				return is_dealer === 1
			},
			// 是否启用规格禁用
			isSpecDisabled() {
				return !!this.spike_id || !!this.group_id
			},
			// 判断活动渠道
			hasActivityChannle() {
				const clientType = App.getClientType(),
					activityType = this.activityStatus.type
				const {
					channel
				} = activityType === 'group' ? this.groupData : this.bargain_data
				const $msg = {
					hasChannel: false,
					errorMsg: '当前渠道不可参与活动\n'
				}

				if (Array.isArray(channel)) {
					$msg.hasChannel = channel.includes(`${clientType}`)
					if (!$msg.hasChannel) {
						$msg.errorMsg += '请前往'
						channel.map(item => {
							$msg.errorMsg += `${this.clientType[`${item}`]},`
						})
						$msg.errorMsg += `参与${activityType === 'group' ? '拼团' : '砍价'}活动`
					}
				}
				return $msg
			},
			// 用于显示的优惠券列表
			couponShowList() {
				if (this.coupon_list && this.coupon_list.length > 0) {

					return this.coupon_list.filter((val, index) => index < 2)

				}
				return []

			},
			// 自定义底部按钮
			footerBtns() {
				let {
					user_is_dealer, // 是否分销商
					detail: {
						is_distribution // 是否分销商品
					},
					settingData: {
						dealer_basic = {}, // 分销设置
						button = [{
								input: '首页',
								link: 'pages/mainPages/index/index',
								image: '/static/images/goods/home.png',
								type: '3'
							},
							{
								input: '订单',
								link: 'pages/mainPages/order/index?type=all',
								image: '/static/images/goods/flow.png',
								type: '3'
							},
							{
								input: '客服',
								link: 'pages/mainPages/index/index',
								image: '/static/images/goods/service.png',
								type: '1'
							}
						]
					}
				} = this,
				isDealerBtn = button.findIndex(val => val.type === '5') > 0
				console.log('isDealerBtn', isDealerBtn)
				console.log('isDealerBtn', isDealerBtn)
				button = JSON.parse(JSON.stringify(button))
				if (isDealerBtn) {
					// 用map来遍历？？？
					button.map(val => {
						if (val.type === '5') {
							// 存在分享赚按钮且不是分销商时
							if (dealer_basic.is_open === '1') {
								if (is_distribution === 1 && !user_is_dealer) {
									val.input = '分享'
									val.notDealer = true
								}
							} else {
								val.input = '分享'
								val.notDealer = true
							}
						}
					})
					console.log('button', button)
				}

				button.forEach(item => {
					if (+this.options.cgp === 1 && item.input === '订单') {
						console.log('hahahha')
						item.link = 'pages/subPages/cgp/order/index'
					}
				})

				return button
			},
			// 推荐搭配商品
			collocationGoods() {
				let {
					collocation = []
				} = this.detail
				return collocation.map(val => !!val && val.goods)
			},
			// 是否为礼包商品
			isGift() {
				return this.detail.gift && this.detail.gift.length
			},
			// 是否为套餐商品
			isMeal() {
				return this.detail.is_meal == 1 && this.detail.sku && this.detail.sku.length
			},
			isReservation() {
				return this.detail.is_reservation
			},
			isPreShopping() {
				return this.detail.is_pre_shopping
			},
			aaa() {
				console.log("hfffffffff很丰富付付付付付付付付付付付付付付付付付", this.detail)
				return
			}

		},
		watch: {
			// 监听下架时间的变化
			cOffTimeStamp(val) {
				if (val) {
					this.startCurrentTimer('offTime')
				} else {
					this.endCurrentTimer('offTime')
				}
			},
			// 监听商品详情接口数据的变化
			goodsRes(val = {}) {
				const {
					goods_id,
					spike_id,
					group_id,
					bargain_id,
					video,
					free_id,
					is_automatic,
					goods_min_price,
					spec_type,
					start_price
				} = val.detail || {}
				const query = {
					goods_id,
					spike_id,
					group_id,
					bargain_id,
					free_id,
				}
				// 如果有视频
				if (video) {
					this.bannerType = 'video'
				}
				// 设置分享的参数
				// #ifdef H5
				this.shareData = this.pageShareMixin_createShareData({
					title: this.$util.deepGet(val, 'detail.share_title'),
					desc: this.$util.deepGet(val, 'detail.share_description'),
					imgUrl: this.$util.deepGet(val, 'detail.wechat_img', ''),
					query
				})
				// #endif
				// #ifdef MP
				this.shareData = this.pageShareMixin_createShareData({
					title: this.$util.deepGet(val, 'detail.share_title'),
					imgUrl: this.$util.deepGet(val, 'detail.sapp_img', ''),
					query
				})
				this.pageShareMixin__videoShareData = {
                    ...this.shareData,
                    channel: 'video'
                }
				// #endif
			},
			// 监听预约倒计时接口数据的变化
			cAppointmentCountDownData(val) {
				this.startAppointmentCountDownIfNeed()
			},
			isToBargain(newValue) {
				console.log('isToBargain', newValue)
			},
			cEleForceHidden(val) {
				if (val.goodsInfo && val.evaluate) {
					return
				}
				if (!val.goodsInfo) {
					this.detailTypeChange('2')
				}
			}
		},
		onLoad(e) {
			this.options = e
			this.isMemberExclusiveGoods = e.exclusive == 1
			this.fxStatus = true
			this.pageLoad(e)
			console.log("fhfhfhfh发劵进度就觉得简简单单", e)
		},
		onShow() {
			this.openMemberPopupVisible = false
			this.memberBuyPopupVisible = false
			console.log('goods detail onShow', this)
			// let token = uni.getStorageSync("token")?uni.getStorageSync("token"):'',
			// let token = uni.getStorageSync("token"),
			let {
				goods_id,
				spike_id,
				group_id,
				bargain_id,
				bargain_group_id,
				again_bargain,
				free_id,
				referee_id,
			} = this
			this.getGoodsDetail(goods_id, spike_id || '', group_id || '', bargain_id || '', bargain_group_id, free_id || '',
				referee_id || '')
			this.getBasicSetting()
			// this.detail.is_meal ==1 ? this.$refs.goodsBuyMenu.showBuyMenu = false :""
			// this.dealer_basic = this.$store.state.appSetting.dealer_basic?this.$store.state.appSetting.dealer_basic:{}
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				menus: [
					'shareAppMessage',
					'shareTimeline'
				]
			})
			// #endif
			// 开始播放音频
			this.audioStatus = 'play'
			// 请求未支付订单信息
			this.fetchFestivalRes()
		},
		onHide() {
			// 暂停播放音频
			this.audioStatus = 'pause'
			clearTimeout(successTimer)
			clearTimeout(setTimer)
			clearTimeout(indexTimer)
			this.showTips = false
			if (this.group_id) {
				clearInterval(this.groupTimber)
			}
			console.log('onHide')
		},
		onUnload() {
			clearTimeout(successTimer)
			clearTimeout(setTimer)
			clearTimeout(indexTimer)
			this.endAppointmentCountDownIfNeed()
			this.showTips = false
			if (this.group_id) {
				clearInterval(this.groupTimber)
			}
		},
		beforeDestroy() {
			clearTimeout(successTimer)
			clearTimeout(setTimer)
			clearTimeout(indexTimer)
			this.endAppointmentCountDownIfNeed()
			this.endCurrentTimer('', true)
			this.showTips = false
			if (this.group_id) {
				clearInterval(this.groupTimber)
			}
		},
		methods: {
			// 礼包查看详情点击
			handleGiftDetailClick(item = {}) {
				console.log('handleGiftDetailClick',item)
				this.openPopupVisible=true
				// 详情弹窗的目标
				this.openPopupTarget = {
					id: 'xxx',
					title: item.title,
					image: this.$util.deepGet(item,'image.0.file_path') || '',
					// 持券仅付
					needPrice: item.need_pay_price,
					// 价值
					price: item.price,
					storeList: item.stores,
					// 礼包详情
					content: item.content,
				}
				console.log('this.openPopupTarget',this.openPopupTarget)
			},
			async handleBtnStatPrice() {
				console.log('handleBtnStatPrice')
				if(this.handleBtnStatPricing) {
					return
				}
				this.handleBtnStatPricing = true
				uni.showLoading({
					title: '正在跳转',
					mask: true
				})
				try {
					await App._postP('cart/add',{
						goods_id: this.detail.goods_id,
						goods_num: 1,
						goods_sku_id: this.$util.deepGet(this.detail,'sku.0.spec_sku_id'),
						store_id: this.detail.delivery_store_id,
						cart_type: 'store_wm'
					})
				} catch(err) {
					console.log(err)
				}
				uni.hideLoading()
				this.handleBtnStatPricing = false
				this.navigationTo('pages/subPages/shopDetail/shopDetail?'+ App.urlEncode({
					bus_id: this.detail.bus_id,
					store_id: this.detail.delivery_store_id,
					addGoodsId: this.detail.goods_id,
					cityCateId: this.$util.deepGet(this.detail,'goods_category.0.category_id','')
				}))
			},
			// 规格弹窗 选中规格项点击事件
			async handleActiveSkuChange(item) {
				this.skuActiveId = item.spec_sku_id
				// 如果已经请求过就不必再请求了
				if(this.skuRebatePricesRes[this.skuActiveId]) return
				try {
					const res = await App._getP('Goods/skuDealerMoney', {
						goods_id: this.options.goods_id,
						spec_sku_id: this.skuActiveId,
					})
					this.skuRebatePricesRes = {
						...this.skuRebatePricesRes,
						[this.skuActiveId]: this.$util.deepGet(res, 'data',{})
					}
				}catch(err) {
					console.log('handleActiveSkuChange',err)
				}
				console.log('handleActiveSkuChange',item)
			},
			// 请求当前未支付订单接口数据
			async fetchFestivalRes() {
				try {
					const res = await App._getP('goods/checkOrderCancle', {
						goods_id: this.goods_id,
						no_login: 1
					})
					this.orderNotPaidRes = this.$util.deepGet(res, 'data', {})
					// 判断是否显示未支付订单弹窗
					const tip = this.orderNotPaidRes.tip || {}
					if (+tip.tip > 0) {
						this.orderToBePaidPopupVisible = true
					} else {
						this.orderToBePaidPopupVisible = false
					}
				} catch (e) {
					// TODO handle the exception
				}
			},
			handleGiftCardClick(gift) {
				let store_ids = ''
				try {
					store_ids = JSON.stringify(gift.store_ids)
				} catch (e) {

				}
				this.navigationTo(`pages/subPages/store/list?store_ids=${store_ids}`)
			},
			// 取消待支付订单
			async handleBtnOrderToBePaidCancelClick() {
				uni.showLoading({
					mask: true,
					title: '正在取消'
				})
				try {
					await App._postP('user.order/cancel', {
						order_id: this.orderNotPaidRes.tip.order_id
					})
					this.orderToBePaidPopupVisible = false
					this.$nextTick(() => {
						uni.showToast({
							icon: 'none',
							title: '取消成功'
						})
					})

				} catch (e) {

				}
			},
			// 视频播放状态改变事件
			handleGoodsVideoStatusChange(status) {
				console.log('视频播放状态改变事件', status)
			},
			// 我要预约按钮点击事件
			async handleBtnAppointmentCountDownClick() {
				// 如果不可以预约或者没有关注公众号
				if (this.cAppointmentCountDownData.is_open_sale !== 1 || this.checkAndShowFollowGzhPopupVisible()) {
					return
				}
				uni.showLoading({
					mask: true
				})
				try {
					// 如果是小程序先请求订阅消息权限
					// #ifdef MP-WEIXIN
					await wxRequestSubscribeMessageX({
						tmplIds: this.cAppointmentCountDownData.template_id,
						showMessage: true
					})
					// #endif
					// 请求订阅接口
					await App._postP('user.index/goodsTip', {
						goods_id: this.goods_id
					})
					// 刷新商品信息
					const {
						goods_id,
						spike_id,
						group_id,
						bargain_id,
						bargain_group_id,
						again_bargain
					} = this
					this.getGoodsDetail(goods_id, spike_id || '', group_id || '', bargain_id || '', bargain_group_id || '')
					this.appointmentSuccessPopupVisible = true
					uni.hideLoading()
					setTimeout(() => {
						this.appointmentSuccessPopupVisible = false
					}, 5000)
				} catch (e) {
					uni.hideLoading()
					console.log(e)
				}

			},
			// 根据label开始当前时间计时器
			startCurrentTimer(label) {
				if (!label) {
					throw new Error('label不能为空')
				}
				// 添加label
				if (!this.currentTime.counter.includes(label)) {
					this.currentTime.counter = [
						...this.currentTime.counter,
						label
					]
				}
				if (this.currentTime.timer) {
					return
				}
				this.currentTime.timer = setInterval(() => {
					console.log('currentTimer')
					this.currentTime.timeStamp = +new Date()
				}, 1000)
			},
			// 根据label结束当前时间计时器
			endCurrentTimer(label, force = false) {
				this.currentTime.counter = this.currentTime.counter.filter(item => item === label)
				// 没有其他部分需要用这个时间了 就结束
				if (!this.currentTime.counter.length || force) {
					clearInterval(this.currentTime.timer)
					this.currentTime.timer = null
				}
			},
			// 开始我要预约倒计时如果有必要的话
			startAppointmentCountDownIfNeed() {
				if ([
						1,
						2
					].indexOf(this.cAppointmentCountDownData.is_open_sale) === -1) {
					// 不是预约或者不是已经预约 直接返回
					this.endAppointmentCountDownIfNeed()
					return
				}
				if (this.appointmentCountDownTimer) {
					// 当前有倒计时器先结束
					this.endAppointmentCountDownIfNeed()
				}
				this.appointmentCountDownTimer = setInterval(() => {
					console.log('this.appointmentCountDownTimer')
					// 当前时间和结束时间的时间差
					const now = dayjs()
					const end = dayjs(this.cAppointmentCountDownData.open_sale_time)
					if (now.isAfter(end)) {
						// 预约时间已到
						console.log('now.isAfter(end) 预约时间已到')
						this.appointmentCountDownStr = '00:00:00'
						this.endAppointmentCountDownIfNeed()
						// 刷新商品信息
						const {
							goods_id,
							spike_id,
							group_id,
							bargain_id,
							bargain_group_id,
							again_bargain
						} = this
						this.getGoodsDetail(goods_id, spike_id || '', group_id || '', bargain_id || '', bargain_group_id || '')
						return
					}
					const diff = dayjs.duration(end.diff(now))
					const days = parseInt(diff.asDays())
					let hours = parseInt(diff.asHours())
					hours = hours >= 10 ? hours : `0${hours}`
					const minutes = diff.minutes() >= 10 ? diff.minutes() : `0${diff.minutes()}`
					const seconds = diff.seconds() >= 10 ? diff.seconds() : `0${diff.seconds()}`
					this.appointmentCountDownStr = `${hours}:${minutes}:${seconds}`
				}, 1000)
			},
			// 结束我要预约倒计时如果有必要的话
			endAppointmentCountDownIfNeed() {
				if (this.appointmentCountDownTimer) {
					clearInterval(this.appointmentCountDownTimer)
					this.appointmentCountDownTimer = null
					this.appointmentCountDownStr = '00:00:00'
				}
			},
			/**
			 * 检查是否该显示关注公众号的弹窗，并显示
			 * 检查是否是显示会员后买弹窗，并显示
			 * 只有微信小程序和公众号才需要显示
			 * @return {boolean} 是否需要显示关注公众号弹窗
			 */
			checkAndShowFollowGzhPopupVisible() {
				if (this.$util.deepGet(this.goodsRes,'detail.user_is_member') != 1 && this.isMemberExclusiveGoods) {
					this.memberBuyPopupVisible = true
					return true
				}
				// #ifdef H5 || MP-WEIXIN
				if (!App.validateUserInfo() || this.detail.no_login == 1) {
					App.doLogin()
					return true
				}
				if (+this.detail.handle === 2 && +this.detail.have_in_wechat === 2) {
					this.followGzhPopupVisible = true
					return true
				}
				return false
				// #endif

				// #ifndef H5 || MP-WEIXIN
				return false
				// #endif
			},
			saveFormIdNotice() {
				let _this = this
				App._post_form('wxapp.sub/getIds', {
					op: 'luckstart'
				}, result => {
					let {
						data: tmplIds = []
					} = result
					if (tmplIds.length) {
						App._post_form('wxapp.formid/save', {
							op: 'luckstart',
							type: '2',
							main_id: _this.spike_id || ''
						}, res => {
							console.log(res, 'xx')
							if (res.code === 1) {
								_this.detail.subscribe = true
								App.showSuccess('订阅成功')
							}
						})
					}
				})
				// App.saveFormId('luckstart', {'type': '2','main_id': this.spike_id || ''},res=>{
				// 	console.log(res,'xx6666')
				// 	if(res.code === 1){
				// 		this.detail.subscribe = true
				// 		App.showSuccess('订阅成功')
				// 	}
				// })
			},
			dealerMoneyStr(str_1, str_2) {
				let str = str_1 + ''
				return str.replace('{$dealer_money}', str_2)
			},
			jumpTocheckout(spec_sku_id) {
				if (this.checkAndShowFollowGzhPopupVisible()) {
					return
				}
				this.goods_sku_id = spec_sku_id
				console.log(this.goods_sku_id, 'this.goods_sku_id-------------------------')
				this.submit()
			},
			getBasicSetting() {
				App._post_form('setting/index', {}, res => {
					this.dealer_basic = res.data.dealer_basic
					this.businessStore = res.data.businessStore
				})
			},
			jumpToApply() {
				App.navigationTo({
					url: 'pages/subPages/dealer/apply/apply'
				})
			},
			// 是否关闭购物车
			isOpenCard() {
				let _this = this,
					getSeting = _this.$store.state.appSetting || ''
				const transport_type = +this.$util.deepGet(this.goodsRes,
						'detail.transport_type')
				if (getSeting.share && getSeting.share.cart_open === '1' && transport_type !== 40 && transport_type !== 70) {
					return true
				}
				return false

			},

			/**
			 * 页面加载处理
			 */
			pageLoad(e) {

				let _this = this,
					scene = App.getSceneData(e),
					{
						a, // goods_id
						b, // referee_id
						c, // spike_id
						d, // group_id,
						g // bargain_id
					} = scene,
					goods_id = a ? a : e.goods_id,
					referee_id = b ? b : e.referee_id,
					spike_id = c ? c : (e.spike_id || ''),
					group_id = d ? d : (e.group_id || ''),
					bargain_id = g ? g : (e.bargain_id || ''),
					again_bargain = e.again_bargain || null,
					roomid = e.room_id || '',
					bargain_group_id = e.bargain_group_id || ''
				this.options = {
					...this.options,
					goods_id,
					referee_id,
					spike_id,
					group_id,
					bargain_id,
					again_bargain,
					roomid,
					bargain_group_id
				}
			   
				// #ifdef MP-ALIPAY
				if (App.query) {
					goods_id = App.query.goods_id
					referee_id = App.query.referee_id
					spike_id = App.query.spike_id
					group_id = App.query.group_id
					bargain_id = App.query.bargain_id
				}
				// #endif
				_this.activityData = {
					spike_id,
					group_id,
					goods_id,
					referee_id,
					bargain_id
				}
				// console.log(roomid, 'roomid================')
				// 商品id
				_this.setData({
					goods_id,
					spike_id,
					group_id,
					bargain_id,
					bargain_group_id,
					again_bargain,
					roomid
				})
				if (!!referee_id) {
					App.saveRefereeId(referee_id)
					App.saveRefereeQuest()
				} else {
					referee_id = App.getRefereId() || ''
				}!!referee_id && _this.$store.commit('saveRefereeId', referee_id)
			},
			/**
			 * 广告类型切换
			 */
			bannerChange() {
				this.bannerType = this.bannerType === 'imgs' ? 'video' : 'imgs'
			},

			/**
			 * 显示大图
			 */
			previewImages(url, index) {
				// let image = this.detail.image.map(val => val.file_path);
				// uni.previewImage({
				// 	current: url || "",
				// 	urls: image
				// });
			},

			/**
			 * 获取商品信息
			 */
			getGoodsDetail(goods_id, spike, group, bargain, bargain_group, referee_id) {
				let _this = this,
					clientType = App.getClientType(),
					params = {
						goods_id,
						spike_id: spike,
						group_id: group,
						bargain_id: bargain,
						// #ifdef MP
						no_login: 1,
						// #endif
						referee_id: referee_id,
					}
				if (!!bargain_group) {
					params.bargain_group_id = bargain_group
				}
				console.log("fjjfjfjfjf发或多或少是非得失涣发大号发达省份都是付电话费电话费电话费", referee_id)
				// 判读是否有referee_id，没有就添加上
				if (!referee_id) {
					params.referee_id = _this.options.referee_id
				}


				App._get('goods/detail', params, result => {
					// 初始化商品详情数据
					let data = _this.initGoodsDetailData(result.data),
						{
							is_member,
							spike_id,
							bargain_id,
							group_id,
							free_id
						} = data.detail
					_this.ismember = is_member === 1
					_this.tieredPrice = data.detail.step_price || []
					_this.isTieredPriceGoods = _this.tieredPrice.length
					console.log(_this.tieredPrice, '阶梯价数组============')
					spike_id = !!spike_id ? (spike_id === -1 ? '' : spike_id) : ''
					group_id = !!group_id ? (group_id === -1 ? '' : group_id) : ''
					bargain_id = !!bargain_id ? (bargain_id === -1 ? '' : bargain_id) : ''
					free_id = !!free_id ? (free_id === -1 ? '' : free_id) : ''

					// 预热时间
					_this.seckill_et_time = result.data.detail.et_time || ''

					// 设置活动数据
					_this.goodsActivity = {
						spike_id,
						group_id,
						bargain_id,
						free_id,
						groupBuyType: null,
						groupData: data.groupData || null
					}
					// 社群数据缓存(支付成功页面使用)
					if (!!data.community) {
						let goodsCommunity = uni.getStorageSync('community') || {}
						goodsCommunity[goods_id] = data.community
						uni.setStorageSync('community', goodsCommunity)
					} else {
						uni.removeStorageSync('community')
					}

					data.detail['selling_point'] = _this.$util.deepGet(data.detail, 'selling_point', '')

					_this.setData({
						...data,
						spike_id,
						group_id,
						free_id,
						bargain_id,
						goodsRes: data
					})

					this.isMemberExclusiveGoods = data.detail && data.detail.member_exclusive == 1

					console.log('————商品详情数据————')
					console.log('goodsDetail', data)
					console.log()

					// 获取拼团列表数据
					if (!!group_id) {
						const user_id = uni.getStorageSync('user_id'),
							{
								stime,
								etime
							} = data.groupData
						_this.getGroupList(group_id, goods_id)
						_this.setActivityCutTime('group', {
							start_time: stime,
							end_time: etime
						})
					}

					// 秒杀
					if (!!spike_id) {
						_this.setActivityCutTime('spike', {
							start_time: data.detail.start_time,
							end_time: data.detail.end_time
						})
					}

					// 砍价
					if (!!bargain_id) {
						let {
							start_time,
							end_time
						} = data.bargain_data
						_this.setActivityCutTime('bargain', {
							start_time,
							end_time
						})
						// bargain_money
						if (!!data.money) { // 砍价浏览商品后生成的金额 bargain_money
							uni.setStorageSync('bargainvisit', `${data.money}|${data.bargain_group_id}`)
						} else {
							uni.removeStorageSync('bargainvisit')
						}
					}

					clearTimeout(successTimer)
					// 用户停留5秒后显示购买弹幕
					successTimer = setTimeout(() => {
						if (_this.settingData.barrage && _this.settingData.barrage.is_barrage === '1') {
							_this.setSuccessBarrage(goods_id)
						}
					}, 5000)

					// 获取商家信息
					_this.getBusinessInfo(result.data.detail.bus_id)
					// 获取商家门店
					_this.getBusinessStore()

				}, err => {
					if (err.data.code === 0) {
						uni.navigateBack({
							delta: 1
						})
					}
				})
			},
			/**
			 * 初始化商品详情数据
			 */
			initGoodsDetailData(data) {
				let _this = this
				let {
					group_id
				} = data || {}


				// 富文本转码
				if (data.detail.content.length > 0) {
					data.content = data.detail.content
				}
				// 富文本转码
				if (data.detail.by_know.length > 0) {
					data.byKnow = data.detail.by_know
				}

				// 商品优惠券
				if (data.coupon_list && data.coupon_list.length > 0) {
					data.coupon_list.map(val => {
						let {
							start_time,
							end_time,
							coupon_type,
							discount,
							max,
							min,
							rule_min_money,
							reduce_price,
							rule,
							expire_type,
							expire_day
						} = val
						let couponDiscount = coupon_type === 20 ? discount : coupon_type === 40 ? '?' : reduce_price
						val.discount = _this.$util.removePoint(couponDiscount)
						val.rule_min_money = _this.$util.removePoint(rule_min_money)
						val.start_time = _this.$util.formatTime(start_time / 1000, 'date', '.')
						val.end_time = _this.$util.formatTime(end_time / 1000, 'date', '.')
						if (expire_type === 10) {
							val.time = `有效期:${val.start_time}-${val.end_time}`
						} else if (expire_type === 20) {
							val.time = '领取后当日可用'
						} else if (expire_type === 30) {
							val.time = `领取后次日起${expire_day}天内可用`
						} else if (expire_type === 40) {
							val.time = `领取后当日起${expire_day}天内可用`
						}
					})
				} else {
					data.coupon_list = []
				}

				// 商品红包
				if (data.red_envelopes_list && data.red_envelopes_list.length > 0) {
					data.red_envelopes_list.map(val => {
						let {
							available_type, // 可用券时间类型
							available_time, // 可用券时间
							rule, // 券使用规则 10无门槛 20满减
							rule_order_money, // 券使用金额
							money, // 券面额
							name, // 券名
							id // 活动id
						} = val,
						couponItem = {
							coupon_id: id,
							coupon_type: 50, // 50-红包活动
							discount: money,
							time: available_type === 10 ?
								`有效期:${available_time.map(item => _this.$util.formatTime(item, 'date', '.')).join('-')}` : `领取后${available_type === 20 ? '当' : '次'}日起${available_time}天内可用`,
							name,
							rule_min_money: _this.$util.removePoint(rule_order_money),
							rule: rule === 10 ? 1 : 0
						}
						data.coupon_list.unshift(couponItem)
					})
				}

				const has_stock = data.detail.sku_count === 0
				if (has_stock && !_this.has_stock) {
					_this.has_stock = has_stock
					setTimeout(this.settimeSoldout, 1500)
				}
				// 规格id/商品价格/划线价/库存/是否限购/剩余可购买数量
				data.goods_sku_id = data.detail.sku[0].spec_sku_id || ''
				data.goods_price = this.$groups_type ? data.detail.sku[0].groups_price : data.detail.sku[0].goods_price
				data.goods_min_price = this.$util.removePoint(data.detail.goods_min_price)
				data.goods_show_price = data.detail.sale_type === 1 ? this.$util.removePoint(data.detail.sku && data.detail.sku[0] &&
					data.detail.sku[0].goods_price) : data.goods_min_price
				data.sku_coupon_price = data.detail.sku[0].coupon_price
				data.line_price = this.$util.removePoint(data.detail.sku[0].line_price)
				data.stock_num = data.detail.sku_count
				data.limit_buy = !!group_id ? (data.groupData.is_limit === 1 ? 10 : 20) : data.detail.limit_buy
				data.surplus_quantity = !!group_id ? data.groupData.limit_num : data.detail.surplus_quantity
				// 分销赚金额处理
				if (data.detail.first_money) {
					let first_money = data.detail.first_money.split('.')
					data.detail.first_money = first_money[1] === '00' ? first_money[0] : first_money.join('.')
				}

				// 单规格商品封面图
				// data.image_path = data.detail.image && data.detail.image[0]['file_path'] ? data.detail.image[0]['file_path'] : ''
				data.image_path = this.$util.deepGet(data, 'detail.image.0.file_path', '')
				// 多规格商品封面图
				if (data.detail.spec_type == 20 && data.detail.sku[0].image) {
					data.image_path = data.detail.sku[0].image.file_path
				}
				// 初始化商品视频
				if (data.detail.video) {
					_this.videoParams.params.videolink = data.detail.video
					_this.videoParams.params.videocover = data.detail && data.detail.image && data.detail.image[0] && data.detail.image[
						0].file_path
				}

				// 积分抵扣显示
				if (!!data.balance) {
					let serveList = data.serve || []
					serveList.unshift({
						title: `${parseFloat(data.balance.max_integral)}${data.balance.str}抵扣${data.balance.max_rebate_money}元`
					})
					data.serve = serveList
				}

				// delete data.detail["by_know"];
				// delete data.detail["content"];
				// console.log(data, '商品详情初始化数据--------')
				return data
			},
			/**
			 * 设置活动倒计时
			 * activityType 活动类型
			 * timeData 活动时间数据
			 */
			setActivityCutTime(activityType, timeData) {
				let activityStatus = null,
					{
						start_time,
						end_time
					} = timeData
				activityStatus = App.getActivityStatus(start_time, end_time)
				if (activityType === 'spike') {

				} else if (activityType === 'group') {

				}

				// 活动未开始且预热时间不为空
				if (activityStatus.status === 0 && this.seckill_et_time) {
					let nowTime = Math.round(new Date().getTime() / 1000)
					// 预热
					if (nowTime >= this.seckill_et_time && nowTime < start_time) {
						activityStatus.etLeftTime = parseInt(start_time - nowTime)
					}
				}
				// else if( activityStatus.status === 2 ) {
				// 	console.log('倒计时----------------------------------------------已结束')
				// 	this.resetDetail()
				//  activityStatus.status = 1
				// }

				// 保存当前处于什么活动
				activityStatus.type = activityType
				this.activityStatus = activityStatus
			},

			// 倒计时结束 重置接口
			resetDetail(status = 'spike') {
				this.getGoodsDetail(this.goods_id, status === 'notice' ? this.spike_id : '', this.group_id || '', this.bargain_id,
					this.bargain_group_id)
			},

			/**
			 * 商品规格默认不选中
			 */
			initManySpecData(data, isNoCheck) {
				for (let i in data) {
					for (let j in data[i].spec_item_list) {
						if (j < 1) {
							if (!isNoCheck) {
								data[i].spec_item_list[0].checked = true
							}
							this.goods_spec_arr.splice(i, 1, data[i].spec_item_list[0].signid)
						}
					}
				}
				return data
			},

			/**
			 * 获取商家信息
			 */
			getBusinessInfo(busId) {
				let _this = this
				App._get('Business/businessDetails', {
					id: busId,
					no_login: 1
				}, result => {
					_this.businessInfo = result.data
					App.hideLoading()
					uni.stopPullDownRefresh()
				})
			},

			/**
			 * 获取商家门店
			 */
			getBusinessStore(isMore = false) {
				let _this = this,
					params = {
						lng: '',
						lat: '',
						bus_id: _this.detail.bus_id,
						goods_id: _this.detail.goods_id
					}
				App._get('Business/lists', params, result => {
					if (result.data.length > 0) {
						result.data = result.data.map(val => {
							const hasTime = val.time && Array.isArray(val.time) && val.time.length > 0
							if (hasTime) {
								val.time.map(item => {
									item[0] = _this.$util.formatTime(item[0] / 1000, 'rule', ':').substr(-5, 5)
									item[1] = _this.$util.formatTime(item[1] / 1000, 'rule', ':').substr(-5, 5)
								})
							}

							val.start_time = _this.$util.formatTime(val.start_time, 'rule', ':').substr(-5, 5)
							val.end_time = _this.$util.formatTime(val.end_time, 'rule', ':').substr(-5, 5)
							return val
						})
					}
					_this.businessList = result.data
					if (isMore) {
						_this.isMoreStore = isMore
					}
				})
			},
			/**
			 * 绑定分销商关系
			 */
			// bindDealerContact(referee_id) {
			// 	App._post_form("user.dealer.Apply/bindUser", {
			// 		dealer_id: referee_id,
			// 		user_id: uni.getStorageSync("user_id")
			// 	}, res => {
			// 		console.log(res,'分销商返回状态');
			// 	})
			// },

			/**
			 * 进入商家详情
			 */
			toBusiness(id, item) {
				let flag = this.businessStore && this.businessStore.good_store_style ? this.businessStore.good_store_style : 1
				// 新版好店是2
				flag == 2 && App.navigationTo({
					url: 'pages/subPages/shopDetail/shopDetail?bus_id=' + item.bus_id + '&store_id=' + id
				})
				// 老版好店
				flag == 1 && App.navigationTo({
					url: 'pages/subPages/store/index?bus_id=' + item.bus_id
				})
			},

			/**
			 * 拨打门店电话
			 */
			storeMobile(mobile) {
				uni.makePhoneCall({
					phoneNumber: mobile
				})
			},

			/**
			 * 查看门店地址
			 */
			storeLocation({
				lat,
				lng,
				name,
				address
			}) {
				uni.openLocation({
					name,
					address,
					latitude: Number(lat),
					longitude: Number(lng),
					success() {
						console.log('success')
					}
				})
			},

			/**
			 * 返回顶部
			 */
			goTop(t) {
				uni.pageScrollTo({
					scrollTop: 0
				})
			},

			/**
			 * 设置轮播图当前指针 数字
			 */
			setCurrent(e) {
				this.currentIndex = Number(e.detail.current) + 1

				let index = '.itemImage' + e.detail.current,
					info = uni.createSelectorQuery().select(index),
					_this = this,
					height = 0
				info.boundingClientRect(function(data) {

					height = data && data.height ? data.height : 0
					_this.swiperHeight = height

				}).exec()
			},

			/**
			 * 计算图片高度
			 */
			imagesHeight(e, imgIndex) {
				// console.log(e,imgIndex,'图片参数')
				// if (imgIndex !== 0) return;
				// let systemInfo = this.$store.state.systemInfo;
				// // 获取图片真实宽度
				// let {
				// 	width,
				// 	height
				// } = e.detail,
				// 	// 宽高比
				// 	ratio = width / height;
				// // 计算的高度值
				// this.swiperHeight = systemInfo.windowWidth / ratio;
				if (imgIndex == 0) {
					let systemInfo = this.$store.state.systemInfo
					// 获取图片真实宽度
					let {
						width,
						height
					} = e.detail,
						// 宽高比
						ratio = width / height
					// 计算的高度值
					this.swiperHeight = systemInfo.windowWidth / ratio

				}
			},

			/**
			 * 商品确认购买
			 * @param {Object} buyData 用户选择商品信息
			 */
			goodsSubmit(buyData) {
				console.log('buyData', buyData, )
				// 如果不满足起送价
				if(this.detail.spec_type == 20 && +this.detail.start_price >=0 &&　+this.detail.start_price > +buyData.goods_price) {
					console.log('如果不满足起送价')
					if(this.detail.is_automatic == 1) {
						this.handleBtnStatPrice()
					}else {
						this.cityBuyPopupVisible = true
					}
					return
				}
				let {
					btnType,
					goods_num,
					goods_sku_id
				} = buyData
				this.goods_num = goods_num
				this.goods_sku_id = goods_sku_id

				// console.log(this.goods_num, this.goods_sku_id)
				if (this.isToBargain) {
					let params = {
						goods_id: this.goods_id,
						goods_sku_id: this.goods_sku_id,
						bargain_id: this.bargain_id
					}
					console.log(this.again_bargain, 'this.again_bargain')
					if (!!this.again_bargain && typeof this.again_bargain === 'string') {
						params.again_bargain = this.again_bargain
					}
					App.navigationTo({
						url: 'pages/subPages/bargain/index/index?' + App.urlEncode(params)
					})
					this.$refs.goodsBuyMenu.showBuyMenu = false
					// this.onToggleTrade();
				} else if (btnType === 'confirm' || btnType === 'groups') {
					this.submit()
				} else if (btnType === 'joinGroups') {
					this.joinGroups()
				} else if (btnType === 'addCart') {
					uni.showLoading({
						title: '加载中...'
					})
					App._get('cart/add', {
						goods_id: this.goods_id,
						goods_sku_id
					}, res => {
						uni.hideLoading()
						uni.showToast({
							title: '已加入购物车'
						})
						this.cart_total_num = res.data.cart_total_num
					})
				}
			},

			/**
			 * 加入购物车and立即购买
			 */
			submit() {
				let _this = this,
					detail = _this.detail,
					limit_buy = _this.limit_buy,
					surplus_quantity = _this.surplus_quantity,
					group_buy_type = _this.group_buy_type
				console.log(detail, 'detail=================')
				if (limit_buy === 10 && surplus_quantity <= 0) {
					App.showError('购买数量已达上限')
					return
				}

				if (!_this.isSpecSignid) {
					App.showError('请选择有效的规格选项后提交订单')
					return
				}

				if (detail.effect === 10 && detail.validity === 30) {
					let nowTime = new Date().getTime()
					if (nowTime > Number(detail.validity_starttime[1])) {
						App.showError('当前商品已过期')
						return
					}
				}

				if (this.isMeal) {
					detail.sku.forEach((item, index, arr) => {
						if (item.spec_sku_id == _this.goods_sku_id && item.stock_num == 0) {
							_this.goods_sku_id = arr[index + 1].spec_sku_id

						}
					})

				}


				console.log(_this.free_id, '================_this.isPreShopping')

				// 立即购买
				App.navigationTo({
					url: 'pages/subPages/flow/checkout?' + App.urlEncode({
						//如果有free_id，order_type传7，否则走之前的判断
						order_type: _this.free_id ? '7' : (!!_this.spike_id ? '3' : !!_this.group_id && (group_buy_type === '2') ?
							'2' : '1'),
						goods_id: _this.goods_id,
						goods_num: _this.goods_num,
						goods_sku_id: _this.goods_sku_id,
						transport_type: detail.transport_type,
						isPreShopping: _this.isPreShopping,
						is_reservation: _this.isReservation,
						bus_id: detail.bus_id,
						is_meal: detail.is_meal,
						meal_together_buy: detail.meal_together_buy,
						is_express: detail.isexpress,
						is_zt: detail.iszt,
						run_errands: detail.run_errands,
						activityId: _this.spike_id || '',
						goods_type: !_this.spike_id && !_this.group_id && detail.is_member_price === 1 ? 'member_goods' : '',
						group_id: _this.$groups_type ? _this.group_id || '' : '',
						// group_id: _this.group_id || '',
						isTieredPriceGoods: _this.isTieredPriceGoods,
						free_id: detail.free_id || '',

					}),
					success() {
						// 关闭弹窗
						_this.$refs.goodsBuyMenu.showBuyMenu = false
					}
				})


			},

			/**
			 * 商品详细显示切换
			 */
			detailTypeChange(type) {
				this.detailType = type
			},

			/**
			 * 购买菜单显示隐藏
			 */
			onToggleTrade(isToBargain = false, btnType = '') {
				console.log('App.validateUserInfo()', App.validateUserInfo())
				// 如果没有登录先登录
				if (!App.validateUserInfo()) {
					App.doLogin()
					return
				}
				if(this.detail.spec_type != 20 && +this.detail.start_price >=0 &&　+this.detail.start_price > +this.goods_show_price) {
					if(this.detail.is_automatic == 1) {
						this.handleBtnStatPrice()
					}else {
						this.cityBuyPopupVisible = true
					}
					
					return
				}
				if (this.checkAndShowFollowGzhPopupVisible()) {
					return
				}
				// 如果是砍价页面，重置砍价跳转标志
				if (this.isBargain) {
					this.isToBargain = isToBargain
				}
				// 拼团活动未开始
				if (!!this.group_id) {
					let isGroupsStatus = this.activityStatus.status,
						msg = ''
					if (isGroupsStatus === 0) {
						msg = '活动暂未开始'
					} else if (isGroupsStatus === 2) {
						msg = '活动已结束'
					}
					if (msg !== '') {
						App.showError(msg)
						return
					}
				}

				this.$refs.goodsBuyMenu.onToggleTrade(btnType)

			},
			// 规格按钮点击
			handleBtnSpecTap(spec_sku_id) {
				if (this.checkAndShowFollowGzhPopupVisible()) {
					return
				}
				this.goods_sku_id = spec_sku_id
				this.$refs.goodsBuyMenu.onToggleTrade()
			},
			// 社群显示
			onToggleCommunity(type) {
				this.showCommunity = !this.showCommunity
			},

			/**
			 * 服务列表显示
			 */
			onToggleSpec(type) {
				if (type !== 'close') {
					this.popupType = type
				}
				this.showGoodsSpec = !this.showGoodsSpec
			},

			/**
			 * 邀请好友分享
			 */
			isShare(type) {
				// #ifndef MP-TOUTIAO || MP-ALIPAY
				if (App.validateUserInfo()) {
					if (this.user_is_dealer) {
						this.$refs.shareView.shareswich()
					} else if (type === 'share') {
						this.$refs.shareView.shareswich()
					} else {
						App.navigationTo({
							url: 'pages/subPages/dealer/apply/apply'
						})
					}
				} else {
					App.doLogin()
				}
				// #endif
			},
			/**
			 * 底部菜单按钮跳转
			 */
			footerNav(item = {}) {
				// #ifdef MP
				if(item.kf_type == '2') {
					wx.openCustomerServiceChat({
					  extInfo: {url: item.qykf_link},
					  corpId: item.qykf_id,
					  success(res) {
						console.log(res)
					  },
					  fail(res) {
						uni.showModal({
						    title: '温馨提示',
						    content: res.errMsg,
						    showCancel: false
						})
						console.log(res)
					  }
					})
					return 
				}
				// #endif
				
				// #ifdef H5
				if(item.kf_type == '2') {
					location.href = item.qykf_link
					return 
				}
				// #endif
				let {
					link: url = '',
					type
				} = item,
				kf_phone = this.settingData.kf_phone
				if (type === '1') {
					url = 'pages/subPages/user/service'
					// #ifndef H5
					return
					// #endif
				} else if (type === '2') {
					if(this.detail.dial == 1) {
						this.phoneListPopupVisible = true
						return
					}
					uni.makePhoneCall({
						phoneNumber: kf_phone // 仅为示例
					})
					return
				} else if (type === '3') {
					// #ifdef H5
					if (url.indexOf('http') === 0) {
						location.href = url
						return
					}
					// #endif
					if (url.indexOf('pages/mainPages/index/index') !== -1) {
						// #ifdef H5
						url += '?i=' + App.getUniacid() + '&aid=' + App.siteInfo.aid
						// #endif
						uni.reLaunch({
							url: '/' + url
						})
						return
					}
				} else if (type === '4' || type === '5') {
					this.isShare('share')
					return
				} else if (type === 'cart') {
					url = 'pages/subPages/flow/index'
					// #ifdef H5
					url += '?i=' + App.getUniacid()
					// #endif
					uni.reLaunch({
						url: '/' + url
					})
					return
				}
				App.navigationTo({
					url
				})
			},

			/**
			 * 查看全部评论
			 */
			allComment(id) {
				App.navigationTo({
					url: 'pages/subPages/goods/comment/comment?goods_id=' + id
				})
			},
			/**
			 * 返回按钮
			 */
			returnBtn(e) {
				let pages = getCurrentPages()
				if (pages.length > 1) {
					uni.navigateBack({
						delta: 1
					})
				} else {
					let url = '/pages/mainPages/index/index'
					// #ifdef H5
					url += '?i=' + App.getUniacid()
					// #endif
					uni.reLaunch({
						url
					})
				}
			},
			/**
			 * 已售罄推荐商品
			 */
			isshowTP(data) {
				this.showTopPopup = data
			},
			/**
			 * 已售罄开关
			 */
			settimeSoldout() {
				this.showTopPopup = true
			},
			/**
			 * 客服按钮
			 */
			contactBtn(customer) {
				if (customer === 'service') {
					// #ifdef MP-ALIPAY || MP-TOUTIAO || H5
					App.navigationTo({
						url: 'pages/subPages/user/service'
					})
					// #endif
				} else if (customer === 'dial') {
					let phoneNumber = this.kf_phone
					uni.makePhoneCall({
						phoneNumber
					})
				} else if (customer === 'share') {
					// #ifndef MP-TOUTIAO || MP-ALIPAY
					this.isShare('share')
					// #endif
				}

			},
			skip_member(card_type) {
				// App.navigationTo({
				// 	url: `pages/subPages/member/memberpay/memberpay?card_type=${card_type}`
				// });
				App.navigationTo({
					url: 'pages/subPages/member/index/index'
				})
			},
			/**
			 * 一键发圈
			 */
			toSpread() {
				App.navigationTo({
					url: `pages/subPages/goods/spread?goods_id=${this.goods_id}`
				})
			},
			/**
			 * 社群显示
			 */
			communityShow() {
				this.showCommunity = !this.showCommunity
			},
			/**
			 * 社群拨打电话
			 */
			callPhone(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber: String(phoneNumber)
				})
			},

			/**
			 * 获取弹幕数据
			 */
			getBarrageData(goods_id) {
				return new Promise((reslove, reject) => {
					App._get('Goods/barrage', {
						goods_id
					}, res => {
						reslove(res.data)
					})
				})
			},
			/**
			 * 设置购买弹幕
			 */
			setSuccessBarrage(goods_id) {
				let _this = this,
					tipsIndex = _this.tipsIndex,
					barrageList = _this.barrageList,
					isBarrage = _this.$store.state.appSetting ? _this.$store.state.appSetting.barrage.is_barrage === '1' : false
				if (!isBarrage) {
					return
				}
				if (tipsIndex >= barrageList.length) {
					_this.getBarrageData(goods_id).then(res => {
						_this.tipsIndex = 0
						_this.barrageList.splice(0, res.length, ...res)
						res.length > 0 && _this.setSuccessBarrage(goods_id)
					})
				} else {
					console.log('showTips')
					_this.showTips = true
					clearTimeout(successTimer)
					successTimer = setTimeout(() => {
						_this.showTips = false
						clearTimeout(setTimer)
						setTimer = setTimeout(() => {
							_this.tipsIndex++
						}, 500)
						clearTimeout(indexTimer)
						indexTimer = setTimeout(() => {
							_this.setSuccessBarrage(goods_id)
						}, 3000)
					}, 5000)
				}
			},

			/**
			 * 领取优惠券
			 * 这个方法的参数形式有点问题应该item和index就好了
			 */
			async receiveCoupon(coupon_id, coupon_type, item) {
				if (item.where == 1) {
					this.openMemberPopupVisible = true
					return
				}
				let _this = this
				// 缓存正在领取优惠券的信息
				_this.couponReceivedObj = (_this.coupon_list || []).find(item => coupon_id === item.coupon_id)
				if (coupon_type === 50) { // 跳转瓜分活动
					App.navigationTo({
						url: `pages/subPages/bonus/index?active_id=${coupon_id}`
					})
				} else { // 领取优惠券
					if (!_this.receiveing) {
						_this.receiveing = true
						uni.showLoading()
						let location = {}
						if([1,2].includes(item.area_restrictions)) {
							location = await App.getLocation() || {}
						}
						App._post_form('user.coupon/receive', {
							coupon_id,
							lat: location.latitude || '',
							lng: location.longitude || ''
						}, function(result) {
							console.log(result)
							uni.hideLoading()
							// 处理优惠券列表信息
							_this.coupon_list = _this.coupon_list.filter(val => val.coupon_id !== coupon_id)
							_this.receiveing = false
							// 处理领取成功弹窗的信息
							_this.couponReceivedObj = couponItemConverter(_this.couponReceivedObj)
							if (+_this.couponReceivedObj.couponType === 40) {
								_this.couponReceivedObj.couponPrice = _this.$util.deepGet(result, 'data.coupon_price', '0')
							}
							// 显示领取成功弹窗
							_this.couponReceivedPopupVisible = true
						})
					}
				}

			}
		},
		onPullDownRefresh() {
			// goods_id, spike_id || "", group_id || "", bargain_id || "", bargain_group_id
			this.getGoodsDetail(this.goods_id, this.spike_id, this.group_id || '', this.bargain_id, this.bargain_group_id)
		},
		onShareTimeline() {
			console.log('分享到朋友圈的参数是', {
				title: this.$util.deepGet(this.goodsRes, 'detail.share_title'),
				imageUrl: this.$util.deepGet(this.goodsRes, 'detail.sapp_img', '')
			})
			return {
				title: this.$util.deepGet(this.goodsRes, 'detail.share_title'),
				imageUrl: this.$util.deepGet(this.goodsRes, 'detail.sapp_img', '')
			}
		}
	}
export default {
	...page
}
