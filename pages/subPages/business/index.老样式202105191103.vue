<template>
	<view class="page" :style="themeColor">
		<view class="col-3 f-24 dis-flex flex-x-between flex-y-center main-bg-color padding-all-box36">
			<text class="f-28 f-w">{{detail && detail.name?detail.name:''}}</text>
			<view @click="switchBus" class="dis-flex flex-y-center">切换商家
				<text class="iconfont icon-pailie m-left12" style="display: inline-block; transform: rotate(90deg);"></text></view>
		</view>
		<view class="header-bg">
			<image style="height: 141px;" class="main-bg-color auxiliary-color" mode="widthFix"></image>
		</view>
		<view class="section" v-if="!!detail">
			<view class="cancel-content p-left-right-30">
				<view class="content-header b-f m-btm20">
					<view class="cancel-header t-c">
						<view class="cancel-logo main-bg-color auxiliary-color">
							<image src="/static/images/saoma1.png" @click="scanningCode"></image>
						</view>
						<view class="col-3 f-28 m-btm40">扫一扫</view>
					</view>
					<view class="cancel-main p-left-right-40">
						<view class="cancel-main-content dis-flex m-btm20">
							<view class="cancel-input">
								<input type="number" placeholder="请输入核销码/自提码" class="f-24 col-9" v-model="codeNumber" />
							</view>
							<view class="cancel-btn f-24 col-3 main-bg-color auxiliary-color" @click="checkConfirm">查询订单</view>
						</view>
					</view>
				</view>
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

				<!-- 管理员切换门店显示 -->
				<view v-if="$right.seedata == '1' && !changeShow && (checkShow || selfShow)" class="cancel-data statistics dis-flex b-f p-top-bom-40  m-btm20">
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

				<view class="cancel-tab dis-flex b-f">
					<view class="tab-item t-c" v-for="(item,index) in tabList" :key="index" @click="navigationTo(item)">
						<image :src="item.thumb" class="tab-imag"></image>
						<view class="col-3 f-24">{{item.title}}</view>
					</view>
				</view>

				<view v-if="$right.seedata == '1' && (checkShow || selfShow)" class="cancel-data statistics dis-flex b-f p-top-bom-40 m-top20  m-btm20">
					<view class="dis-flex flex-dir-column flex-x-center flex-y-center" style="width: 100%;">
						<view class="scale-grows dis-flex flex-x-center flex-y-center">
							<view class="data-content data-order">
							</view>
							<view>
								<view class="time-check dis-flex flex-x-center flex-y-center">
									<view v-for="(item,index) in timeCheck" :key="index" class="time-item" :style="{'border-right': ((index == 0 && timeCheckCurrent == 1) || index == 1) ? 0 :  '1px solid #cccccc', 'border-left': ((index == 2 && timeCheckCurrent == 1) || index == 1) ? 0 :  '1px solid #cccccc'}"
									 :class="{'current  main-bg-color': index === timeCheckCurrent}" @tap="changeTimeCheck(index)">{{item.label}}</view>
								</view>
							</view>
						</view>
						<view class="scale-grows dis-flex flex-y-center" v-if="checkShow">
							<view class="data-title main-bg-color auxiliary-color">核销数据</view>
							<view class="dis-flex flex-x-center flex-y-center flex-box">
								<view class="data-content data-order" v-if="changeShow && orderCodeNumShow">
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
								<view class="data-content data-order" v-if="changeShow && orderSelfCodeNumShow">
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

				<!-- 可结算金额 -->
				<view v-if="$right.seedata == '1'" class="cancel-data dis-flex flex-dir-column b-f p-top-bom-40  m-btm20">
					<view class="cancel-title">商家收益</view>
					<view class="dis-flex flex-y-center">
						<view class="t-c dis-flex flex-dir-column flex-x-between p-left-right-40" style="width: 64%;">
							<view class="dis-flex flex-x-between" style="text-align: left;">
								<view class="dis-flex flex-dir-column flex-x-between" style="text-align: left;">
									<view class="col-3 f-32">{{$applyNum.day}}</view>
									<view class="col-9 f-22" style="margin-bottom: 40upx;">今日营业额</view>
								</view>
								<view class="dis-flex flex-dir-column flex-x-between" style="text-align: left;">
									<view class="col-3 f-32">{{$applyNum.month}}</view>
									<view class="col-9 f-22" style="margin-bottom: 40upx;">本月营业额</view>
								</view>
							</view>
							<view class="dis-flex flex-x-between" style="text-align: left;">
								<view class="dis-flex flex-dir-column flex-x-between">
									<view class="col-3 f-32">{{detail.checkTotalMoney && detail.right.seedata === 1?detail.checkTotalMoney:"0.00"}}</view>
									<view class="col-9 f-22">累计入账金额</view>
								</view>
								<view class="dis-flex flex-dir-column flex-x-between">
									<view class="col-3 f-32">{{$applyNum.total}}</view>
									<view class="col-9 f-22">累计营业额</view>
								</view>
							</view>
						</view>
						<view class="t-c bor-lr-1px dis-flex flex-dir-column flex-x-between flex-y-center p-left-right-40" style="flex-grow: 1;">
							<view class="dis-flex flex-dir-column flex-x-between" style="text-align: left;">
								<view class="col-3 f-32 main-color">{{$applyNum.balance}}</view>
								<view class="col-9 f-24" style="margin-bottom: 40upx;white-space: nowrap;">可提现金额</view>
							</view>
							<view class="mymoney-btn" v-if="detail.apply.is_show != 0" @click="withdrawInfo">我的钱包</view>
						</view>
					</view>
				</view>

				<!-- 门店结算统计 -->
				<view v-if="$storeList.length == 0 || (pickvalue != 0 && showStoreAccount != -1)" class="cancel-data dis-flex flex-dir-column b-f p-top-bom-40  m-btm20">
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
			</view>
		</view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
// #ifdef H5
import wxApi from '@/static/h5/wxApi.js'
// #endif
export default {
    data() {
        return {
            options: {},
            showStore: false,
            timeCheckCurrent: 0,
            timeCheck: [
                {
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
            name: ''
        }
    },
    components: {

    },
    computed: {
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
                balance = 0, total = 0, day = 0, month = 0
            } = this.$apply
            return {
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
            return this.$expressType.includes('3')
        },
        selfShow() {
            return this.$expressType.includes('2')
        },
        orderCodeNumShow() {
            return this.$salesData.includes('1')
        },
        orderSelfCodeNumShow() {
            return this.$salesData.includes('2')
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
            this.user_id = uni.getStorageSync('user_id') || (this.$store.state.userInfo && this.$store.state.userInfo.user_id) ||
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
                        link: 'pages/subPages/business/order?bus_id=' + this.bus_id + '&store_id=' + this.store_id + '&delivergoods=' +
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
                        link: 'pages/subPages/business/order?bus_id=' + this.bus_id + '&store_id=' + this.store_id +
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
                        link: 'pages/subPages/goodsManage/index?bus_id=' + this.bus_id + '&store_id=' + this.store_id
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
                        link: 'pages/subPages/liveApply/applyrecord?bus_id=' + this.bus_id + '&bus_name=' + this.bus_name
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
                                console.log(luck_code, luck_id, hit_id)
                                _this.lotterWriteOff(res.data.bus_id, luck_code, luck_id, hit_id, '')
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
                                _this.newLotterWriteOffBless(blessing_id, prize_index, user_id, _this.detail.bus_id, _this.store_id)
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
            link += (id === 'store' || id === 'clerk') ? _this.detail.bus_id : (id === 'check'
                ? `${_this.store_id}&mType=${is_show === 1 ? 'admin' : 'assistant'}&bus_id=${_this.detail.bus_id}` : '')
            let navigationTo = id === 'management' || id === 'clerk' || id === 'reserve' || id === 'applylive' || (seedata ===
					1 && id === 'order') || (seedata === 1 && id === 'send') || (seedata === 1 && id === 'store') || (seedata === 1 &&
					id === 'check')
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
                }, function (result) {
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
                    }, function (result) {
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
                }, function (result) {
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
                    let isScanCode = clientType === '4' ? (res.errMsg === 'scanQRCode:ok') : (res.errMsg === 'scanCode:ok')
                    if (isScanCode) {
                        let Base64 = new _this.$util.Base64(),
                            result = res[clientType === '4' ? 'resultStr' : res.scanType === 'QR_CODE' ? 'result' : 'path'],
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
                            result = JSON.parse(result)
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
                                            praise_id, _this.detail.bus_id, luck_code, luck_id, hit_id, _this.store_id,
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
                                        _this.newLotterWriteOff(praise_id, prize_index, user_id, _this.detail.bus_id, _this.store_id)
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
                                        _this.newLotterWriteOffBless(blessing_id, prize_index, user_id, _this.detail.bus_id, _this.store_id)
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

	.header-bg image {
		width: 100%;
		margin-top: -2upx;
	}

	.section {
		position: relative;
		top: -160upx;
	}

	.content-header {
		height: 280upx;
		border-radius: 6upx;
	}

	.cancel-logo {
		position: relative;


		image {
			width: 176upx;
			height: 176upx;
			border: 10rpx solid #fff;
			border-radius: 50%;
		}

		.select-store {
			position: absolute;
			top: 0;
			right: 0;
		}
	}

	.cancel-header,
	.cancel-main {
		position: relative;
		top: -116rpx;
		margin-bottom: 20rpx;
	}

	.cancel-main-content {
		height: 80upx;
	}

	.cancel-main-content .check-type {
		padding: 0 12upx;
		background: #F0F0F0;
		border-top-left-radius: 10upx;
		border-bottom-left-radius: 10upx;
	}

	.cancel-main-content .check-type .iconfont {
		font-size: 18upx;
		padding-left: 6upx;
	}

	.cancel-main-content .cancel-input {
		flex: 1;
		background: #F0F0F0;
		padding-left: 12upx;
	}

	.cancel-main-content .cancel-input input {
		height: 80upx;
		line-height: 80upx;
	}

	.cancel-main-content .cancel-btn {
		width: 120upx;
		height: 80upx;
		line-height: 80upx;
		background: #FFD940;
		text-align: center;
		border-top-right-radius: 10upx;
		border-bottom-right-radius: 10upx;
	}

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
</style>
