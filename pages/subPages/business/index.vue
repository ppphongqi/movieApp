<template>
	<view class="page" :style="themeColor">
		<view class="col-3 f-24 dis-flex flex-x-between flex-y-center main-bg-color padding-all-box36">
			<text class="f-28 f-w">{{detail && detail.name?detail.name:''}}</text>
			<view @click="switchBus" class="dis-flex flex-y-center">切换商家
				<text class="iconfont icon-pailie m-left12"
					style="display: inline-block; transform: rotate(90deg);"></text>
			</view>
		</view>
		<view class="header-bg">

		</view>
		<view class="section" v-if="!!detail">
			<view class="cancel-content p-left-right-30">
				<!-- 扫一扫 -->
				<view class="scan-card">
					<view class="scan-card__btn-scan" @click="scanningCode">
						<view class="iconfont icon-saoyisao"></view>
					</view>
					<view class="scan-card__tip">扫一扫核销码</view>
					<view class="scan-card-input-wrapper">
						<input v-model="codeNumber" class="scan-card-input-wrapper__input" type="number"
							placeholder="请输入核销码/自提码" />
						<button class="scan-card-input-wrapper__btn btn-normal main-bg-color auxiliary-color"
							@click="checkConfirm">核销</button>
					</view>
				</view>
				<!-- 扫一扫 end -->
				<!-- 切换店铺 -->
				<view class="store-change b-f m-btm20 dis-flex flex-x-between flex-y-center">
					<view class="store-info dis-flex flex-y-center">
						<image src="/static/images/business/store.png" class="store-icon"></image>
						<view class="">
							<view class="f-28 col-3 onelist-hidden">{{storeName}}</view>
							<view class="f-26 col-9">当前店铺</view>
						</view>
					</view>
					<view class="change-btn p-r" v-if="$storeList.length > 0">
						<picker @change="pickerChange" mode="selector" :value="0" range-key="name" :range="$storeList">
							<view class=" dis-flex flex-y-center flex-x-center">
								<view class="f-28 col-3">切换</view>
								<view class="iconfont icon-pailie"></view>
							</view>
						</picker>
					</view>
				</view>
				<!-- 切换店铺 end -->
				<!-- 管理员切换门店显示 -->
				<view v-if="$right.seedata == '1' && !changeShow && (checkShow || selfShow)"
					class="cancel-data statistics dis-flex b-f p-top-bom-40  m-btm20">
					<view class="dis-flex flex-dir-column flex-x-center flex-y-center" style="width: 100%;">
						<view class="scale-grows dis-flex flex-x-center flex-y-center">
							<view class="data-content data-order"></view>
							<view class="store-total f-26 col-9">门店累计数据</view>
						</view>
						<view class="scale-grows dis-flex flex-y-center" v-if="checkShow">
							<view class="data-title main-bg-color auxiliary-color ">核销数据</view>
							<view class="dis-flex flex-x-center flex-y-center flex-box">
								<view class="data-content data-order">
									<view class="col-9 f-24">核销份数</view>
									<view class="col-3 f-32">{{$cumulative.already_code || "0.00"}}</view>
								</view>
								<view class="data-content data-order">
									<view class="col-9 f-24">核销金额</view>
									<view class="col-3 f-32">{{$cumulative.sever_already_money || "0.00"}}</view>
								</view>
							</view>
						</view>
						<view class="scale-grows dis-flex flex-y-center" v-if="selfShow">
							<view class="data-title main-bg-color auxiliary-color">自提数据</view>
							<view class="dis-flex flex-x-center flex-y-center flex-box">
								<view class="data-content data-order">
									<view class="col-9 f-24">自提单数</view>
									<view class="col-3 f-32">{{$cumulative.orderSelfCheckedNum || "0.00"}}</view>
								</view>
								<view class="data-content data-order">
									<view class="col-9 f-24">自提金额</view>
									<view class="col-3 f-32">{{$cumulative.orderSelfCheckedMoney || "0.00"}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 管理员切换门店显示 end -->

				<!-- 收益 -->
				<view v-if="$right.seedata == '1'" class="business-profit">
					<view class="business-profit__title">商家收益</view>
					<!-- 总计 -->
					<view class="business-profit__total">
						<view class="business-profit__num business-profit__num--strong">{{$applyNum.balance}}</view>
						<view class="business-profit__text">可提现金额(元)</view>
						<view class="business-profit__frozen">冻结金额<text class="business-profit__frozen__strong"
								style="margin-left: 20rpx;">{{$applyNum.frozen_balance}}</text></view>
					</view>
					<!-- 总计 end -->
					<!-- 列表 -->
					<view class="business-profit-list">
						<view class="business-profit-item">
							<view class="business-profit-card">
								<view class="business-profit__num">{{$applyNum.day}}</view>
								<view class="business-profit__text">今日营业额</view>
							</view>
						</view>
						<view class="business-profit-item">
							<view class="business-profit-card">
								<view class="business-profit__num">{{$applyNum.month}}</view>
								<view class="business-profit__text">本月营业额</view>
							</view>
						</view>
						<view class="business-profit-item">
							<view class="business-profit-card">
								<view class="business-profit__num">
									{{detail.checkTotalMoney && detail.right.seedata === 1?detail.checkTotalMoney:"0.00"}}
								</view>
								<view class="business-profit__text">累计入账金额</view>
							</view>
						</view>
						<view class="business-profit-item">
							<view class="business-profit-card">
								<view class="business-profit__num">{{$applyNum.total}}</view>
								<view class="business-profit__text">累计营业额</view>
							</view>
						</view>
					</view>
					<!-- 列表 end -->
					<!-- 按钮 -->
					<button v-if="detail.apply.is_show != 0" class="business-profit__btn btn-normal"
						@click="withdrawInfo">我的钱包</button>
					<!-- 按钮 end -->
				</view>
				<!-- 收益 end -->

				<view class="cancel-tab dis-flex b-f">
					<view class="tab-item t-c" v-for="(item,index) in tabList" :key="index" @click="navigationTo(item)">
						<image :src="item.thumb" class="tab-imag"></image>
						<view class="col-3 f-24">{{item.title}}</view>
					</view>
				</view>

				<view v-if="$right.seedata == '1' && (checkShow || selfShow)"
					class="cancel-data statistics dis-flex b-f p-top-bom-40 m-top20  m-btm20">
					<view class="dis-flex flex-dir-column flex-x-center flex-y-center" style="width: 100%;">
						<view class="scale-grows dis-flex flex-x-center flex-y-center">
							<view class="data-content data-order">
							</view>
							<view>
								<view class="time-check dis-flex flex-x-center flex-y-center">
									<view v-for="(item,index) in timeCheck" :key="index" class="time-item"
										:style="{'border-right': ((index == 0 && timeCheckCurrent == 1) || index == 1) ? 0 :  '1px solid #cccccc', 'border-left': ((index == 2 && timeCheckCurrent == 1) || index == 1) ? 0 :  '1px solid #cccccc'}"
										:class="{'current  main-bg-color': index === timeCheckCurrent}"
										@tap="changeTimeCheck(index)">{{item.label}}</view>
								</view>
							</view>
						</view>
						<view class="scale-grows dis-flex flex-y-center" v-if="checkShow">
							<view class="data-title main-bg-color auxiliary-color">核销数据</view>
							<view class="dis-flex flex-x-center flex-y-center flex-box">
								<view class="data-content data-order" v-if="orderCodeNumShow">
									<view class="col-9 f-24">销售份数</view>
									<view class="col-3 f-32">{{$code.orderCodeNum || "0.00"}}</view>
								</view>
								<view class="data-content data-order">
									<view class="col-9 f-24">核销份数</view>
									<view class="col-3 f-32">{{$code.already_code || "0.00"}}</view>
								</view>
								<view class="data-content data-order">
									<view class="col-9 f-24">核销金额</view>
									<view class="col-3 f-32">{{$code.sever_already_money || "0.00"}}</view>
								</view>
							</view>
						</view>
						<view class="scale-grows dis-flex flex-y-center" v-if="selfShow">
							<view class="data-title main-bg-color auxiliary-color">自提数据</view>
							<view class="dis-flex flex-x-center flex-y-center flex-box">
								<view class="data-content data-order" v-if="orderSelfCodeNumShow">
									<view class="col-9 f-24">销售单数</view>
									<view class="col-3 f-32">{{$code.orderSelfCodeNum || "0.00"}}</view>
								</view>
								<view class="data-content data-order">
									<view class="col-9 f-24">自提单数</view>
									<view class="col-3 f-32">{{$code.orderSelfCheckedNum || "0.00"}}</view>
								</view>
								<view class="data-content data-order">
									<view class="col-9 f-24">自提金额</view>
									<view class="col-3 f-32">{{$code.orderSelfCheckedMoney || "0.00"}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 门店结算统计 -->
				<view
					v-if="$right.store_settlement_data　== 1 &&　($storeList.length == 0 || (pickvalue != 0 && showStoreAccount != -1))"
					class="cancel-data dis-flex flex-dir-column b-f p-top-bom-40  m-btm20">
					<view class="cancel-title">当前单个门店结算统计</view>
					<view class="dis-flex flex-y-center">
						<view class="t-c dis-flex flex-dir-column flex-x-between p-left-right-40" style="width: 64%;">
							<view class="dis-flex flex-x-between" style="text-align: left;">
								<view class="dis-flex flex-dir-column flex-x-between" style="text-align: left;">
									<view class="col-3 f-32">{{storedata.off_settlement_money}}</view>
									<view class="col-9 f-22" style="margin-bottom: 40upx;">已结算金额</view>
								</view>
								<view class="dis-flex flex-dir-column flex-x-between" style="text-align: left;">
									<view class="col-3 f-32">{{storedata.no_settlement_money}}</view>
									<view class="col-9 f-22" style="margin-bottom: 40upx;">未结算金额</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 门店结算统计 end -->
			</view>
		</view>
		<page-loading ref="loading"></page-loading>
		<!-- 业务员弹窗 -->
		<popup-view class="salesman-popup" :show="salesmanPopupVisible" type="center"
			@clickmask="salesmanPopupVisible = false">
				<!-- 未绑定 -->
				<view v-if="cSalesmanData.type == 0" class="binding-card">
					<image class="binding-card__img-qrcode" mode="widthFix" :src="cSalesmanData.qrcode"></image>
					<view class="binding-card__text">邀请业务员扫码绑定</view>
				</view>
				<!-- 未绑定 end -->
				<!-- 已绑定 -->
				<view v-else class="salesman-card">
					<image class="salesman-card__avatar" src="./static/images/avatar-salesman.png" mode=""></image>
					<view class="salesman-card__name">{{cSalesmanData.real_name}}</view>
					<view class="salesman-card__mobile"><image class="salesman-card__mobile__icon" src="./static/images/icon-phone-yellow.png" mode=""></image>{{cSalesmanData.real_mobile}}</view>
					<view class="salesman-card__attrs">
						<view class="salesman-card__attr">绑定时间：<text class="is-strong">{{cSalesmanData.create_time}}</text></view>
						<view v-if="cSalesmanData.real_name" class="salesman-card__attr">到期时间：<text class="is-strong">{{cSalesmanData.expire_time}}</text></view>
					</view>
				</view>
				<!-- 已绑定 end -->
				<view class="salesman-popup__btn-close iconfont icon-roundclose"
					@click="salesmanPopupVisible = false"></view>
		</popup-view>
		<!-- 业务员弹窗 end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	// #ifdef H5
	import wxApi from '@/static/h5/wxApi.js'
	// #endif
	import PopupView from '@/components/template/PopManager.vue'
	export default {
		data() {
			return {
				options: {},
				showStore: false,
				timeCheckCurrent: 0,
				timeCheck: [{
						value: '1',
						label: '今天'
					},
					{
						value: '2',
						label: '昨天'
					},
					{
						value: '3',
						label: '七日'
					}
				],
				storeCurrent: null,
				tabList: [],
				detail: null,
				codeNumber: '',
				checkType: '3',
				bus_id: '',
				bus_name: '', // 商家名字
				user_id: null,
				store_id: -1, // 当前门店id
				isAdmin: true, // 是否是管理员
				sceneData: null, // 抽奖核销相关参数
				delivergoods: null,
				storedata: {},
				pickvalue: 0, // 切换门店时选择门店的下标
				showStoreAccount: '', // 判断是否显示门店结算统计
				busData: [], // 当前用户的商家列表
				name: '',
				// 业务员弹窗是否显示
				salesmanPopupVisible: false,
				// 业务员信息的接口数据
				salesmanRes: {}
			}
		},
		components: {
			PopupView
		},
		computed: {
			// 业务员弹窗数据
			cSalesmanData() {
				// 0:未绑定，1:已绑定
				let type = 0
				if(this.salesmanRes.salesman_id) {
					type = 1
				}
				return {
					type,
					// 绑定二维码
					qrcode: this.salesmanRes.qrcode,
					// 姓名
					real_name: this.salesmanRes.real_name,
					// 手机号
					real_mobile: this.salesmanRes.real_mobile,
					// 绑定时间
					create_time: this.salesmanRes.create_time,
					// 到期时间
					expire_time: this.salesmanRes.expire_time == -1 ? '永久' : this.salesmanRes.expire_time
				}
			},
			$apply() {
				const {
					apply = {}
				} = this.detail || {}
				return apply
			},
			$code() {
				const {
					code = {}
				} = this.detail || {}
				return code
			},
			$cumulative() {
				const {
					cumulative = {}
				} = this.$code || {}
				return cumulative
			},
			$storeList() {
				const {
					storeList = []
				} = this.detail || {}
				if (storeList.length > 0) {
					storeList.unshift({
						id: -1,
						name: '所有门店'
					})
				}
				return storeList
			},
			$right() {
				const {
					right = {}
				} = this.detail || {}
				return right
			},
			$applyNum() {
				const {
					balance = 0, total = 0, day = 0, month = 0, frozen_balance = 0
				} = this.$apply
				return {
					frozen_balance: parseFloat(frozen_balance).toFixed(2),
					balance: parseFloat(balance).toFixed(2),
					total: parseFloat(total).toFixed(2),
					day: parseFloat(day).toFixed(2),
					month: parseFloat(month).toFixed(2)
				}
			},
			$expressType() {
				const {
					express_type = []
				} = this.detail || {}
				return express_type
			},
			$salesData() {
				const {
					sales_data = []
				} = this.detail || {}
				return sales_data
			},
			checkShow() {
				// return this.$expressType.includes('3')
				return this.$salesData.includes('1')
			},
			selfShow() {
				// return this.$expressType.includes('2')
				return this.$salesData.includes('2')
			},
			orderCodeNumShow() {
				return this.detail && this.detail.data_mode == 1
			},
			orderSelfCodeNumShow() {
				return this.detail && this.detail.data_mode == 1
			},
			storeName() {
				let {
					$storeList: storeList,
					store_id,
					isAdmin,
					detail
				} = this
				if (storeList.length > 0 && store_id !== -1) {
					let store = storeList.filter(val => val.id === store_id)[0]
					return store.name
				}
				if (!!detail) {
					return detail.store ? detail.store.name : '所有门店'
				}

			},
			changeShow() {
				let {
					isAdmin,
					store_id
				} = this
				return isAdmin ? store_id === -1 : true
			}
		},
		onLoad(options) {
			this.options = options
			this.pageLoad(options)

		},
		onShow() {
			// #ifdef MP
			App.userSilentLogin(() => {
				console.log('获取商家信息--------------userSilentLogin')
				this.getMerchantInfo()
			})
			// #endif
			// #ifdef H5
			this.getMerchantInfo()
			// #endif

			// 获取商家列表 扫码核销用
			this.getBusData()
		},
		mounted() {

		},
		methods: {
			// 获取当前用户的商家列表
			getBusData() {
				App._post_form('merchant.index/switchBusiness', {
					name: this.name
				}, res => {
					const {
						code,
						msg,
						data: data = []
					} = res
					this.busData = data

				}, () => {}, () => {
					App.hideLoading()
					uni.hideLoading()
				})

			},
			// 处理任务宝核销
			async dealPrizeWriteOff(options = {}) {
				if (!options.assist_help_id) {
					return
				}
				console.log('dealPrizeWriteOff')
				try {
					const res = await App._postP('assist.Assist/prizeWriteOff', {
						assist_help_id: options.assist_help_id,
						user_id: options.user_id
					})
					uni.showModal({
						title: '提示',
						content: res.msg,
						confirmText: '确定',
						showCancel: false
					})
				} catch (e) {
					console.log('dealPrizeWriteOff:error', e)
					// TODO handle the exception
				}
			},
			switchBus() {
				App.navigationTo({
					url: 'pages/subPages/business/change?bus_id=' + this.bus_id
				})
			},
			pageLoad(options) {
				const _this = this
				this.dealPrizeWriteOff(options)
				console.log(options, '1223')
				let {
					q = '',
						scene = '',
						luck_id = '',
						luck_code = '',
						hit_id = '',
						bus_id = '',
						blessing_id = '',
						prize_index = '',
						user_id = '',
						card_user_id = ''
				} = options

				if (!!q) {
					let queryData = this.$util.qureyDecode(q)
					console.log(queryData)
					this.queryData = queryData
				}
				if (!!scene) {
					let sceneData = App.getSceneData(options)
					let {
						a: luck_id = '',
						b: luck_code = '',
						c: hit_id = '',
						d: bus_id = '',
						l: blessing_id = '',
						k: prize_index = '',
						j: user_id = ''
					} = sceneData || {}
					this.sceneData = {
						luck_id,
						luck_code,
						hit_id
					}
				}
				if (!!luck_id && !!luck_code && !!hit_id) {
					this.sceneData = {
						luck_id,
						luck_code,
						hit_id,
						bus_id
					}
				}
				if (!!blessing_id && !!prize_index && !!user_id) {
					this.sceneData = {
						blessing_id,
						prize_index,
						user_id
					}
				}
				this.user_id = uni.getStorageSync('user_id') || (this.$store.state.userInfo && this.$store.state.userInfo
						.user_id) ||
					''
				this.bus_id = bus_id
			},
			changeTimeCheck(index) {
				uni.showLoading({
					title: '加载中...'
				})
				this.timeCheckCurrent = index

				this.getMerchantInfo()
			},
			/**
			 * 跳转到店铺提现
			 */
			withdrawInfo() {
				App.navigationTo({
					url: `pages/subPages/withdraw/store/store?bus_id=${this.detail.bus_id}`
				})
			},
			/**
			 * 获取商家数据
			 */
			getMerchantInfo() {
				let _this = this,
					{
						store_id,
						bus_id
					} = _this
				App._get('merchant.index/index', {
					day: this.timeCheckCurrent + 1,
					store_id,
					bus_id,
					bus_new: bus_id ? 1 : ''
				}, res => {
					console.log(res, 'res===============')
					this.storedata = res.data.store_data
					let express_type = res.data.express_type
					this.showStoreAccount = res.data.right.store_settlement_data == 1
					this.bus_id = res.data.bus_id
					this.bus_name = res.data.name
					this.delivergoods = res.data.right.delivergoods
					if (_this.options.card_user_id) {
						_this.cardBagOff({
							card_user_id: _this.options.card_user_id,
							bus_id: _this.bus_id,
							store_id
						})
						return
					}
					let tabList = [

						{
							title: '我的店铺',
							id: 'store',
							thumb: '/static/images/business/wodedianpu.png',
							link: 'pages/subPages/store/index?bus_id='
						}


					]
					if (res.data && !res.data.bus_id) {
						App.showError('暂未绑定店铺', () => {
							let url = '/pages/mainPages/index/index'
							// #ifdef H5
							url += '?i=' + App.getUniacid()
							// #endif
							uni.reLaunch({
								url
							})
						})
					}
					if (res.data.right.look_order == 1) {
						tabList.push({
							title: '订单管理',
							id: 'order',
							thumb: '/static/images/business/ordergl.png',
							link: 'pages/subPages/business/order?bus_id=' + this.bus_id + '&store_id=' +
								this.store_id +
								'&delivergoods=' +
								this.delivergoods
						})
					}
					if (res.data.right.look_hx_order == 1) {
						tabList.push({
							title: '核销记录',
							id: 'check',
							thumb: '/static/images/business/hexiaojilu.png',
							link: 'pages/subPages/business/check?type=3&store_id='
						})
					}
					if (res.data.right.look_self_order == 1) {
						tabList.push({
							title: '自提记录',
							id: 'check',
							thumb: '/static/images/business/zitijilu.png',
							link: 'pages/subPages/business/check?type=2&store_id='
						})
					}
					if (res.data.right.look_card_order == 1) {
						tabList.push({
							title: '次卡记录',
							id: 'check',
							thumb: require('./static/images/cikajilu.png'),
							link: 'pages/subPages/business/check?type=4&store_id='
						})
					}
					// 显示物流发货
					if (res.data.right.delivergoods === 1) {
						let itemRight = {
							title: '物流发货',
							id: 'send',
							thumb: '/static/images/goods/send.png',
							link: 'pages/subPages/business/order?bus_id=' + this.bus_id + '&store_id=' + this
								.store_id +
								'&express_type=1&order_status=2' + '&delivergoods=' + this.delivergoods
						}
						tabList.splice(1, 0, itemRight)
					}
					// 显示添加店员按钮
					if (res.data.right.addsal === 1) {
						let itemRight = {
							title: '店员管理',
							id: 'clerk',
							thumb: '/static/images/business/dianyuanguanli.png',
							link: 'pages/subPages/business/employee/list?bus_id='
						}
						tabList.push(itemRight)
					}
					// 显示上传商品
					if (res.data.right.management === 1) {
						// 202007161043发版屏蔽掉这个入口
						let itemRight = {
							title: '上传商品',
							id: 'management',
							thumb: '/static/images/business/shangchuangshangpin.png',
							link: 'pages/subPages/goodsManage/index?bus_id=' + this.bus_id + '&store_id=' +
								this.store_id
						}
						tabList.push(itemRight)
					}
					// 显示预约管理按钮
					if (res.data.right.reserve === 1) {
						let itemRight = {
							title: '预约管理',
							id: 'reserve',
							thumb: '/static/images/business/yuyueguanli.png',
							link: 'pages/subPages/business/appointment?bus_id=' + this.bus_id
						}
						tabList.push(itemRight)
					}
					// 显示直播申请按钮
					if (res.data.right.applylive === 1) {
						let itemRight = {
							title: '直播管理',
							id: 'applylive',
							thumb: '/static/images/business/zhiboshengqing.png',
							link: 'pages/subPages/liveApply/applyrecord?bus_id=' + this.bus_id + '&bus_name=' +
								this.bus_name
						}
						tabList.push(itemRight)
					}
					if (res.data.right.cityDelivery === 1) {
						let itemRight = {
							title: '配送订单',
							id: 'cityDelivery',
							thumb: './static/images/peisongdingdan.png',
							link: 'pages/subPages/business/cityOrder?bus_id=' + this.bus_id + '&store_id=' +
								this.store_id
						}
						tabList.push(itemRight)
					}
					if (res.data.right.salesman === 1) {
						this.fetchSalesmanRes().catch(()=>{})
						let itemRight = {
							title: '业务合作',
							id: 'salesman',
							thumb: './static/images/salesman.png',
						}
						tabList.push(itemRight)
					}
					if (res.data.right.dealer_free === 1) {
						let itemRight = {
							title: '分销免单',
							id: 'dealer_free',
							thumb: './static/images/fxmd.png',
							link: 'pages/subPages/withdraw/business/index?bus_id=' + this.bus_id
						}
						tabList.push(itemRight)
					}
					// 当前店员类型
					if (!!res.data.apply) {
						_this.isAdmin = res.data.apply.is_show === 1
						if (!_this.isAdmin) {
							_this.store_id = res.data.store ? res.data.store.id : ''
						}
					}

					// 管理员门店列表
					if (res.data.storeList && res.data.storeList.length > 0) {
						let {
							storeList
						} = res.data
						// _this.store_id = res.data.storeList[0].id;
					}
					_this.tabList.splice(0, tabList.length, ...tabList)
					_this.detail = res.data
					console.log('oxwoxoxoxowoxoxox', _this.sceneData, res.data.bus_id)
					if (!!_this.sceneData && res.data.bus_id && !!_this.sceneData.luck_id) {

						let {
							luck_code,
							luck_id,
							hit_id
						} = _this.sceneData
						uni.showModal({
							title: '温馨提示',
							content: `确认核销:${luck_code}`,
							success(result) {
								if (result.confirm) {
									console.log({
										luck_code, luck_id, hit_id
									})
									_this.lotterWriteOff('',res.data.bus_id, luck_code, luck_id, hit_id, '')
								}
							}
						})
					} else if (!!_this.sceneData && res.data.bus_id && !!_this.sceneData.blessing_id) {
						let {
							blessing_id,
							prize_index,
							user_id
						} = _this.sceneData
						uni.showModal({
							title: '温馨提示',
							content: '确认核销?',
							success(result) {
								if (result.confirm) {
									_this.newLotterWriteOffBless(blessing_id, prize_index, user_id, _this
										.detail.bus_id, _this.store_id)
								}
							}
						})
					}

					App.hideLoading()
				})
			},
			/**
			 * 门店切换
			 */
			pickerChange(e) {
				this.pickvalue = e.detail.value
				this.store_id = this.$storeList[Number(e.detail.value)].id
				this.getMerchantInfo()
			},
			/**
			 * 操作跳转
			 */
			navigationTo(optinos) {
				console.log(optinos)
				// if(optinos.id=="appointment"){
				// 	console.log("?????????????????");
				// 	App.navigationTo({
				// 		url: 'pages/subPages/business/employee/appointment?bus_id='+this.bus_id
				// 	});
				// }
				let _this = this,
					{
						right: {
							seedata,
							addsal,
							management,
							reserve

						},
						apply: {
							is_show
						}
					} = _this.detail
				console.log(seedata)

				let {
					link,
					id
				} = optinos
				if (id == 'salesman') {
					// 点击了业务合作
					// 打开业务员弹窗
					this.salesmanPopupVisible = true
					return
				}
				link += (id === 'store' || id === 'clerk') ? _this.detail.bus_id : (id === 'check' ?
					`${_this.store_id}&mType=${is_show === 1 ? 'admin' : 'assistant'}&bus_id=${_this.detail.bus_id}` :
					'')
				let navigationTo = id === 'cityDelivery' || id === 'management' || id === 'clerk' || id === 'reserve' ||
					id === 'applylive' || (seedata ===
						1 && id === 'order') || (seedata === 1 && id === 'send') || (seedata === 1 && id === 'store') || (
						seedata === 1 &&
						id === 'check') || id === 'dealer_free'
				if (navigationTo) {
					App.navigationTo({
						url: link
					})
				} else {
					App.showError('请在后台开启查看权限')
				}
			},
			/**
			 * 确认操作
			 */
			checkConfirm() {
				if (!!this.codeNumber) {
					App.navigationTo({
						url: `pages/mainPages/order/selfcancel?order_type=store&code=${this.codeNumber}&bus_id=${this.detail.bus_id}&isurl=1`
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '请输入核销码/自提码'
					})
				}
			},
			newLotterWriteOff(praise_id, prize_index, user_id, bus_id, store_id) {
				console.log(user_id, '核销user_id')
				let _this = this
				if (this.checkType === '3') {
					App._get('praise.Praise/prizeWriteOff', {
						praise_id,
						prize_index,
						user_id,
						bus_id,
						store_id,
						bus_new: bus_id ? 1 : ''
					}, function(result) {
						// 初始化商品详情数据

						const {
							code,
							msg
						} = result
						_this.sceneData = null
						if (code === 1) {
							App.showError(`${msg || '核销成功'}`)
						}
					}, err => {
						if (err.data.code === 0) {
							uni.navigateBack({
								delta: 1
							})
						}
					})
				} else {
					App.showError('扫码失败,抽奖暂不支持自提,请重试')
				}
			},
			async cardBagOff({
				card_user_id,
				bus_id,
				store_id
			}) {
				App.navigationTo({
					url: 'pages/subPages/card/cancel?' + App.urlEncode({
						card_user_id,
						bus_id,
						store_id
					})
				})
			},
			lotterWriteOff(praise_id, bus_id, luck_code, luck_id, hit_id, store_id, period_id = 0) {
				console.log('lotterWriteOff',{
					bus_id,
					luck_code,
					luck_id,
					hit_id
				})
				if (!!bus_id && !!luck_code && !!luck_id && !!hit_id) {

					if (this.checkType === '3') {

						let _this = this
						App._get('luck.luck/checkLuckCode', {
							bus_id,
							luck_code,
							luck_id,
							hit_id,
							store_id,
							period_id
						}, function(result) {
							// 初始化商品详情数据
							console.log('ewewrewerwvfdgfd', result)
							const {
								code,
								msg
							} = result
							_this.sceneData = null
							if (code === 1) {
								App.showError(`${msg || '核销成功'}`)
							}
						}, err => {
							if (err.data.code === 0) {
								uni.navigateBack({
									delta: 1
								})
							}
						})
					} else {
						App.showError('扫码失败,抽奖暂不支持自提,请重试')
					}
				}
				console.log(praise_id, bus_id, luck_code, luck_id, hit_id, store_id)
			},
			newLotterWriteOffBless(blessing_id, prize_index, user_id, bus_id, store_id) {
				let _this = this
				if (_this.checkType === '3') {
					App._get('blessing.blessing/prizeWriteOff', {
						blessing_id,
						prize_index,
						user_id,
						bus_id,
						store_id,
						bus_new: bus_id ? 1 : ''
					}, function(result) {
						// 初始化商品详情数据

						const {
							code,
							msg
						} = result
						_this.sceneData = null
						if (code === 1) {
							App.showError(`${msg || '核销成功'}`)
						}
					}, err => {
						App.showError(err.data.msg)
					})
				} else {
					App.showError('扫码失败,抽奖暂不支持自提,请重试')
				}
			},
			scanningCode() {
				let _this = this,
					clientType = App.getClientType()
				App.scanCode({
					complete(res) {
						console.log(res)
						let isScanCode = clientType === '4' ? (res.errMsg === 'scanQRCode:ok') : (res.errMsg ===
							'scanCode:ok')
						if (isScanCode) {
							let Base64 = new _this.$util.Base64(),
								result = res[clientType === '4' ? 'resultStr' : res.scanType === 'QR_CODE' ?
									'result' : 'path'],
								isSceneQR = result.indexOf('scene') !== -1, // 是否小程序码
								isHttpUrl = result.indexOf('http') !== -1 // 是否二维码
							if (isSceneQR) { // 扫小程序码
								let params = _this.$util.getParams('scene', decodeURIComponent(result), true)
								params = _this.$util.scene_decode(params)
								let {
									a: luck_id = '',
									b: luck_code = '',
									c: hit_id = '',
									d: code = '',
									o: order_id = '',
									p: period_id = '',
									h: praise_id = '',
									k: prize_index = '',
									j: user_id = '',
									l: blessing_id = '',
									ci: card_user_id = ''
								} = params
								console.log('params', params)
								result = {
									order_id,
									luck_id,
									luck_code,
									hit_id,
									code,
									praise_id,
									prize_index,
									user_id,
									period_id,
									blessing_id,
									card_user_id
								}
							} else if (isHttpUrl && !isSceneQR) { // 扫二维码
								let [
									order_id = '',
									luck_id = '',
									blessing_id = '',
									luck_code = '',
									hit_id = '',
									code = '',
									period_id = '',
									praise_id = '',
									prize_index = '',
									user_id = '',
									card_user_id = ''
								] = [
									'order_id',
									'luck_id',
									'blessing_id',
									'luck_code',
									'hit_id',
									'code',
									'period_id',
									'praise_id',
									'prize_index',
									'user_id',
									'card_user_id'
								].map(val => _this.$util.getParams(val, decodeURIComponent(result), true) || '')
								result = {
									order_id,
									luck_id,
									luck_code,
									hit_id,
									code,
									period_id,
									praise_id,
									prize_index,
									user_id,
									blessing_id,
									card_user_id
								}
							} else {
								try{
									result = JSON.parse(result)
								}catch(e){
									//TODO handle the exception
								}
							}
							console.log('扫码结果:', result)
							const {
								order_id = '',
									luck_code = '',
									luck_id = '',
									hit_id = '',
									code = '',
									period_id = '',
									praise_id = '',
									prize_index = '',
									user_id = '',
									blessing_id = '',
									card_user_id = ''
							} = result

							console.log('是否要扫码card_user_id', card_user_id)
							if (!!card_user_id) {
								_this.cardBagOff({
									card_user_id,
									bus_id: _this.bus_id,
									store_id: _this.store_id
								})
							} else if (!!luck_id) {
								uni.showModal({
									title: '温馨提示',
									content: `确认核销:${luck_code}`,
									success(result) {
										if (result.confirm) {
											// console.log(luck_code, luck_id, hit_id);
											_this.lotterWriteOff(
												praise_id, _this.detail.bus_id, luck_code, luck_id,
												hit_id, _this.store_id,
												period_id
											)
										}
									}
								})
								// _this.lotterWriteOff(praise_id,_this.detail.bus_id, luck_code, luck_id, hit_id, _this.store_id,period_id)
							} else if (!!praise_id) {
								uni.showModal({
									title: '温馨提示',
									content: '确认核销',
									success(result) {
										if (result.confirm) {
											// console.log(luck_code, luck_id, hit_id);
											_this.newLotterWriteOff(praise_id, prize_index, user_id, _this
												.detail.bus_id, _this.store_id)
										}
									}
								})
								// _this.newLotterWriteOff(praise_id,prize_index,user_id,_this.detail.bus_id, _this.store_id)
							} else if (!!blessing_id) {
								uni.showModal({
									title: '温馨提示',
									content: '确认核销',
									success(result) {
										if (result.confirm) {
											// console.log(luck_code, luck_id, hit_id);
											_this.newLotterWriteOffBless(blessing_id, prize_index, user_id,
												_this.detail.bus_id, _this.store_id)
										}
									}
								})
							} else if (!!order_id) {
								App.navigationTo({
									url: `pages/mainPages/order/selfcancel?order_type=store&code=${code}&bus_id=${_this.detail.bus_id}&order_id=${order_id}&isurl=1`
								})
							}
						}

					}
				})
			},
			previewImage(url) {
				uni.previewImage({
					current: 0,
					urls: [url]
				})
			},
			// 请求申请详情的接口数据
			async fetchSalesmanRes() {
				try {
					const res = await App._getP('salesman.Salesman/businessSalesman',{
						bus_id: this.bus_id
					})
					this.salesmanRes = this.$util.deepGet(res, 'data', {})
					
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			}
		}
	}
</script>

<style lang="scss">
	.main-bg-color.col-3 {
		color: var(--auxiliary-color) !important;
	}
</style>
<style lang="scss" scoped>
	$statistics-border: #cccccc;

	.statistics {
		background: #ffffff;

		.scale-grows {
			width: 100%;
			text-align: left;
			margin-bottom: 20rpx;

			&:first-child {
				margin-bottom: 40upx;
			}

			.data-title {
				font-size: 24rpx;
				width: 1em;
				padding: 8rpx 14rpx;
				overflow: hidden;
				border-radius: 0 10rpx 10rpx 0;
				background: #FFD940;
			}

			.data-order {
				padding-left: 20upx;

				.f-24 {
					margin-bottom: 12rpx;
				}

				.f-32,
				.f-36 {
					// font-weight: 600;
				}
			}

			.store-total {
				border: 1px solid $statistics-border;
				border-radius: 2em;
				margin-right: 30rpx;
				padding: 2rpx 20rpx;
			}

			.time-check {
				position: relative;
				border-radius: 2em;
				// border:1px solid $statistics-border;
				margin-right: 40upx;
				color: $statistics-border;

				// &:after{
				// 	content: " ";
				// 	position: absolute;
				// 	border-top: 1px solid #F7F7F7;
				// 	transform-origin: 0 0;
				// 	transform: scaleY(0.5);
				// 	z-index: 2;
				// 	left: 0;
				// 	top: 0;
				// 	right: 0;
				// }
				// &::before{
				// 	content: " ";
				// 	position: absolute;
				// 	border-top: 1px solid #F7F7F7;
				// 	transform-origin: 0 0;
				// 	transform: scaleY(0.5);
				// 	z-index: 2;
				// 	left: 0;
				// 	bottom: 0;
				// 	right: 0;
				// }


				>.time-item {
					box-sizing: border-box;
					width: 90upx;
					text-align: center;
					line-height: 50upx;
					height: 50upx;
					font-size: 28upx;

					// background: rgb(33,52,85);
					&:nth-of-type(1) {
						border-radius: 2em 0 0 2em;
						border-top: 1px solid $statistics-border;
						border-left: 1px solid $statistics-border;
						border-right: 1px solid $statistics-border;
						border-bottom: 1px solid $statistics-border;
					}

					&:nth-of-type(3) {
						border-radius: 0 2em 2em 0;
						border-top: 1px solid $statistics-border;
						border-right: 1px solid $statistics-border;
						border-left: 1px solid $statistics-border;
						border-bottom: 1px solid $statistics-border;
					}

					&:nth-of-type(2) {
						position: relative;
						border-top: 1px solid $statistics-border;
						border-bottom: 1px solid $statistics-border;
						// .before-line{
						// 	position: absolute;
						// 	border-left: 1px solid #F7F7F7;
						// 	transform-origin: 0 0;
						// 	transform: scaleX(0.5);
						// 	z-index: 2;
						// 	top: 0;
						// 	bottom: 0;
						// 	left: 0;
						// }
						// .after-line{
						// 	position: absolute;
						// 	border-left: 1px solid #F7F7F7;
						// 	transform-origin: 0 0;
						// 	transform: scaleX(0.5);
						// 	z-index: 2;
						// 	top: 0;
						// 	bottom: 0;
						// 	right: 0;
						// }
					}

					&.current {
						border: none !important;
						color: #ffffff;
						background: #FFD940;
					}
				}
			}
		}
	}

	.header-bg {
		position: relative;
		width: 100%;
		height: 140px;
		margin-top: -2upx;
		overflow: hidden;

		&::after {
			width: 140%;
			height: 100%;
			position: absolute;
			left: 50%;
			top: 0;
			content: "\20";
			transform: translate(-50%);
			border-radius: 0 0 50% 50%;
			background-color: var(--theme-color, #FFD940);
		}
	}

	.section {
		position: relative;
		top: -160upx;
	}

	.content-header {
		height: 280upx;
		border-radius: 6upx;
	}

	// 扫一扫
	.scan-card {
		position: relative;
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		margin: 0 auto;
		margin-bottom: 20rpx;
		padding: 30rpx;
		padding-top: 100rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.scan-card__btn-scan {
		position: absolute;
		left: 50%;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		width: 174rpx;
		height: 174rpx;
		border: 10rpx solid #fff;
		transform: translate(-50%, -50%);
		border-radius: 100%;
		background-color: var(--theme-color, #FFD940);

		.iconfont {
			font-size: 70rpx;
			color: #fff;
		}
	}

	.scan-card__tip {
		font-size: 28rpx;
		color: #333;
		text-align: center;
	}

	.scan-card-input-wrapper {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: 80rpx;
		margin-top: 40rpx;
		background-color: #F8F8F8;
		border-radius: 10rpx;
	}

	.scan-card-input-wrapper__input {
		flex: 1;
		padding-left: 30rpx;
		font-size: 24rpx;
	}

	.scan-card-input-wrapper__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		height: 100%;
		padding: 0 34rpx;
		font-size: 28rpx;
		color: #333;
		border-radius: 0 10rpx 10rpx 0;
	}

	// 扫一扫 end

	// 收益
	.business-profit {
		box-sizing: border-box;
		width: 690rpx;
		margin: 20rpx auto;
		max-width: 100%;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.business-profit__title {
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
	}

	.business-profit__total {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.business-profit__num {
		color: #333333;
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 16rpx;
		text-align: center;
	}

	.business-profit__num--strong {
		color: var(--theme-color, #FFD940);
		font-size: 48rpx;
	}

	.business-profit__text {
		font-size: 24rpx;
		color: #999;
		text-align: center;
	}

	.business-profit__frozen {
		position: relative;
		height: 56rpx;
		min-width: 316rpx;
		padding: 0 28rpx;
		margin-top: 20rpx;
		line-height: 56rpx;
		color: #999;
		font-size: 28rpx;
		text-align: center;
		background-color: #F8F8F8;
		border-radius: 9999rpx;

		&::before {
			box-sizing: border-box;
			content: "\20";
			position: absolute;
			left: 50%;
			bottom: 100%;
			font-size: 0;
			border-left: 10rpx solid transparent;
			border-right: 10rpx solid transparent;
			border-bottom: 10rpx solid #F8F8F8;
		}
	}

	.business-profit__frozen__strong {
		font-weight: bold;
		color: #333;
	}

	.business-profit-list {
		display: flex;
		flex-wrap: wrap;
		margin-top: 40rpx;
		margin-bottom: 40rpx;
	}

	.business-profit-item {
		position: relative;
		width: 50%;

		&:nth-child(odd)::after {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			display: block;
			content: "\20";
			width: 1px;
			height: 60rpx;
			background-color: #EEEEEE;
		}
	}

	.business-profit-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 120rpx;

		.business-profit__num {
			margin-bottom: 8rpx;
		}
	}

	.business-profit__btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		border: 1px solid #CCCCCC;
		border-radius: 9999rpx;
	}

	// 收益 end




	.cancel-data {
		border-radius: 10upx;

		.cancel-title {
			font-size: 30upx;
			color: #333333;
			padding: 0 40upx 40upx;
		}
	}

	.data-content {
		flex: 1;
	}

	.mymoney-btn {
		width: 170upx;
		height: 65upx;
		border: 1px solid rgba(204, 204, 204, 1);
		border-radius: 33upx;
		font-size: 24upx;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		text-align: center;
		line-height: 65upx;
	}

	.bor-lr-1px {
		border-left: 1px solid #EEEEEE;
		// border-right: 1px solid #EEEEEE;
	}

	.cancel-tab {
		padding: 30upx 0;
		border-radius: 6upx;
		flex-wrap: wrap;
	}

	.tab-item {
		width: 25%;
		margin-bottom: 20rpx;
	}

	.tab-item .tab-imag {
		width: 90upx;
		height: 90upx;
		display: block;
		margin: 0 auto;
	}

	.store-change {
		padding: 20rpx 30rpx;
		border-radius: $uni-border-radius-base;

		.store-icon {
			width: 90rpx;
			height: 90rpx;
			display: block;
			margin-right: 20rpx;
		}

		.change-btn {
			width: 128rpx;
			height: 64rpx;
			line-height: 64rpx;
			text-align: center;
			border: 1rpx solid #EEEEEE;
			border-radius: 64rpx;
		}

		.iconfont {
			font-size: 36rpx;
			width: 1em;
			height: 1em;
			line-height: 1em;
			position: relative;
			transform: rotate(-90deg);
		}

		.store-picker {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1;
		}
	}
	// 业务员弹窗
	.salesman-popup__btn-close {
		margin-top: 40rpx;
		color: #fff;
		font-size: 50rpx;
		text-align: center;
	}
	.binding-card {
		box-sizing: border-box;
		width: 500rpx;
		padding: 30rpx;
		border-radius: 20px;
		background-color: #fff;
	}
	.binding-card__img-qrcode {
		width: 100%;
	}
	.binding-card__text {
		text-align: center;
		font-size: 28rpx;
		color: #999;
	}
	.salesman-card {
		box-sizing: border-box;
		width: 500rpx;
		padding: 30rpx;
		border-radius: 20px;
		background-color: #fff;
		background-image: url(./static/images/bg-salesman-card.png);
		background-position: center top;
		background-size: 100% auto;
		background-repeat: no-repeat;
	}
	.salesman-card__avatar {
		display: block;
		margin: 0 auto;
		margin-top: 20rpx;
		width: 130rpx;
		height: 130rpx;
	}
	.salesman-card__name {
		margin-top: 30rpx;
		font-weight: bold;
		font-size: 36rpx;
		color: #333;
		text-align: center;
	}
	.salesman-card__mobile {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #333;
	}
	.salesman-card__mobile__icon {
		width: 40rpx;
		height: 40rpx;
	}
	.salesman-card__attrs {
		box-sizing: border-box;
		padding: 30rpx 20rpx;
		margin-top: 30rpx;
		background-color: #F8F8F8;
		border-radius: 20rpx;
	}
	.salesman-card__attr {
		font-size: 26rpx;
		color: #999;
		&+& {
			margin-top: 20rpx;
		}
		.is-strong {
			color: #333;
		}
	}
	// 业务员弹窗弹窗 end
</style>
