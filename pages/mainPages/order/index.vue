<template>
	<view class="container" :style="themeColor" :key='falg'>
		<page-nav-bar @navItemClick="expressType" :nav-list="navList" :current="dataType" fixed="1"></page-nav-bar>
		<view class="order-list padding-box" v-if="!!list.data && list.data.length > 0">
			<view class="order-wrap-i m-btm20" :id="'item-'+index" v-for="(item, index) in list.data" v-if="item.is_group_show !== 1"
			 :key="index" @click.stop="navigateToDetail" :data-id="item.order_id">
				<view class="order-i">
					<view class="order-i-top dis-flex flex-x-between border-line border-bottom">
						<view v-if="item.is_refund == 10 && item.express_type == 3 && item.delivery_status && item.delivery_status.value == 10 && item.should_over_time > 0" class="order-i-top-l onelist-hidden f-28">截至日期：{{ item.should_over_time | formatTime }}</view>
						<view v-else class="order-i-top-l onelist-hidden f-28">下单日期：{{ item.create_time }}</view>
						<view class="order-i-top-r f-24">{{ item.app_state_text }}</view>
					</view>
					<view class="order-i-center dis-flex border-line border-bottom">
						<list-goods-item type="new" :goods-data="item.goods[0]" :group-number="item.groups_number ? item.groups_number : -1" style="width: 100%;"></list-goods-item>
					</view>
<!-- 					<view class="order-i-bottom" :class="{'border-line border-bottom':item.isShowBtns}">
						合计：<view class="span">{{settingData.currency}}{{ item.pay_price }}</view>
					</view> -->
					<!-- 订单操作按钮 -->
					<view class="order-i-btn dis-flex" v-if="item.isShowBtns">
						<block v-for="(itemBtn,btnIndex) in item.app_show_button" :key="btnIndex">
							<view v-if="itemBtn.value === 1 && itemBtn.event!='appointment' && itemBtn.event!='appointmentIfno'" @click.stop="orderHandle(itemBtn.event,item.order_id,item.comment_id,item.pay_price,item.express_type)"
							 class="btn-default p-r btn-main" :class="{'main-bg-color auxiliary-color':itemBtn.event === 'kammi' ||itemBtn.event === 'get' || itemBtn.event === 'pay'|| itemBtn.event === 'check' || itemBtn.event === 'agglomeration','main-border-color':itemBtn.event === 'kammi' || itemBtn.event === 'get' || itemBtn.event === 'pay'|| itemBtn.event === 'check' || itemBtn.event === 'agglomeration' }">
								<form @submit="saveFormId" report-submit="">
									<button class="btn-normal report-btn main-bg-color auxiliary-color" form-type="submit"></button>
								</form>
								{{itemBtn.text}}
							</view>
							<view v-if="itemBtn.value === 1 && itemBtn.event=='appointment'" class="btn-default p-r btn-main  col-9" style="border: 1rpx solid #999;"
							 @click.stop="navigationTo('pages/subPages/subscribe/confirm?goods_id='+item.goods[0].goods_id+'&num='+item.goods[0].total_num+'&bus_id='+item.goods[0].bus_id+'&order_id='+item.order_id+'&goods_sku_id='+item.goods[0].spec_sku_id)">
								{{itemBtn.text}}
							</view>
							<view v-if="itemBtn.value === 1 && itemBtn.event=='appointmentIfno'" class="btn-default p-r btn-main col-9"
							 style="border: 1rpx solid #999;" @click.stop="navigationTo('pages/subPages/subscribe/info?order_id='+item.order_id+'&goods_id='+item.goods[0].goods_id+'&bus_id='+item.goods[0].bus_id+'&goods_sku_id='+item.goods[0].spec_sku_id)">
								{{itemBtn.text}}
							</view>
						</block>
					</view>
				</view>
			</view>
			<load-more :showLoadmore="!isLoading"></load-more>
		</view>
		<!-- <view v-if="no_more" class="no-more f-30">亲, 没有更多了</view> -->
		<block v-if="!isLoading && !!list.data && !list.data.length">
			<view class="no-data">
				<Abnor :abnor="'ORDER'"></Abnor>
			</view>
		</block>
		<!-- 返回顶部 -->
		<GoTopBtn :page-scroll="pageScroll"></GoTopBtn>
		<!-- 订单支付组件 -->
		<OrderPay ref="orderPay" @orderReady="payOrderReady" @paySuccess="paySuccess" @payFail="payFail"></OrderPay>
		<page-loading ref="loading"></page-loading>
		<KammiModel :orderKami="orderKami" v-if="showKami" @closeKami="showKami=false"></KammiModel>
		<!-- 客服 -->
		<!-- #ifdef MP-TOUTIAO -->
		<view class="tt-img"><view class="iconfont icon"></view>客服</view>
		<!-- #endif -->
		<!-- 客服 end -->
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import { dateFormat } from '@/common/js/date.js'
import PageNavBar from '@/components/template/PageNavBar2.vue'
import OrderPay from '@/components/template/OrderPayPopups.vue'
import LoadMore from '@/components/template/Loadmore.vue'
import ListGoodsItem from '@/components/template/ListGoodsItem.vue'
import GoTopBtn from '@/components/template/GoTopBtn.vue'
import Abnor from '@/components/template/Abnor.vue'
import listMixin from '@/common/js/pageListMixin.js'
import KammiModel from '@/components/template/KammiModel.vue'
import pageShare from "@/common/js/pageShareMixin.js"
// #ifdef H5
import wxApi from '@/static/h5/wxApi.js'
// #endif
export default {
    mixins: [listMixin,pageShare],
    data() {
        return {
            dataType: 'all',
            list: {},
            falg: 0,
            orderKami: [],
            showKami: false,
            scrollHeight: null,
            no_more: true, // 没有更多数据
            isLoading: true, // 是否正在加载中
            page: 1, // 当前页码
            isShowGoTop: false, // 是否显示返回顶部
            intoView: '',
            navList: [
                {
                    id: 'all',
                    title: '全部'
                },
                {
                    id: 'payment',
                    title: '待付款'
                },
                {
                    id: 'delivery',
                    title: '待使用'
                },
                {
                    id: 'received',
                    title: '待收货'
                },
                {
                    id: 'comment',
                    title: '待评价'
                }
            ]
        }
    },
    filters: {
        formatTime(timeStamp) {
            return dateFormat(timeStamp, {
                format: 'YYYY-MM-DD HH:mm:ss',
                fallback: ''
            })
        }
    },
    components: {
        PageNavBar,
        OrderPay,
        ListGoodsItem,
        GoTopBtn,
        Abnor,
        LoadMore,
        KammiModel
    },
    computed: {},
    onLoad(options) {
        this.pageLoad(options)
		// #ifdef MP
		 uni.hideShareMenu()
		// #endif
		// #ifdef H5
		this.pageShareMixin_hideShare()
		// #endif
    },
    onUnload() {
        uni.removeStorageSync('orderList')
    },
    onShow() {
        App.showLoading()
        let isPage = !!this.list.total,
            page = this.page
        this.list.data = []
        // 获取订单列表

        // #ifdef MP
        App.userSilentLogin(() => {
            console.log('获取订单列表--------------userSilentLogin')
            this.getOrderList()
        })
        // #endif
        // #ifdef H5
        this.getOrderList()
        jWeixin.ready(() => {
            let {
                share_title,
                share_describe,
                wechat_share_image
            } = this.settingData.share
            console.log('share_describe -order- 1111', share_describe)
            wxApi.wxShare({
                title: share_title || '', // 分享标题
                desc: share_describe || '', // 分享描述
                link: `${App.siteInfo.siteroot}h5/#/pages/mainPages/index/index?referee_id=${this.globalSaveRefereeId}&i=${App.getUniacid()}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: wechat_share_image ? wechat_share_image[0].file_path : '' // 分享图标
            })
        })
        // #endif


    },
    methods: {
        /**
			 * 页面加载处理
			 */
        pageLoad(options) {
            let _this = this
            uni.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#ffffff'
            })
            _this.setListHeight()
            this.dataType = options.type || 'all'
            console.log('99999999999999999', options)
        },
        expressType(item) {
            // console.log(item.id,item.index);
            this.setData({
                dataType: item.id,
                isLoading: true,
                page: 1
            })
            uni.pageScrollTo({
                duration: 0,
                scrollTop: 0
            })
            // 获取订单列表
            this.getOrderList()
        },
        /**
			 * 获取订单列表
			 */
        getOrderList(isPage, page) {
            let _this = this
            App._get('user.order/lists', {
                page: page || 1,
                type: _this.dataType,
                no_login: 1
            }, function (result) {
                let resList = result.data
                console.log('--------------------')
                // _this.orderStateHandle(resList.data);
                if (resList.data.length > 0) {
                    resList.data.map(item => {
                        item.isShowBtns = item.app_show_button.filter(val => val.value === 1).length > 0
                    })
                }

                if (isPage == true) {
                    console.log('true')
                    if (!!page) {
                        console.log('true11')
                        _this.list.data.push(...resList.data)
                        _this.setData({
                            isLoading: resList.data.length == resList.per_page,
                            no_more: resList.data.length == resList.per_page
                        })
                    }
                } else {
                    console.log('false')
                    _this.setData({
                        list: resList,
                        isLoading: resList.data.length == resList.per_page,
                        no_more: resList.data.length == resList.per_page
                    })
                }

                console.log('1111111111', _this.list)
                _this.$forceUpdate()
                App.hideLoading()
            })
        },

        /**
			 * 切换标签
			 */
        bindHeaderTap(e) {
            this.setData({
                dataType: e.currentTarget.dataset.type,
                isLoading: true,
                page: 1,
                no_more: false
            })
            // 获取订单列表
            this.getOrderList()
        },

        /**
			 * 订单操作
			 */
        orderHandle(handleType, order_id, comment_id, pay_price,express_type) {

            let _this = this,
                handleList = [
                    'cancel',
                    'get'
                ],
                navigationTo = [
                    'express',
                    'comment'
                ],
                kammi = ['kammi'],
                groupsInfo = ['agglomeration']
			if(handleType === 'distribution' && express_type == 6) {
				// 跳转到配送地图
				App.navigationTo({
				    url: `pages/subPages/cityDistribution/map?order_id=${order_id}`
				})
			}else if(handleType === 'get' && express_type == 6) {
				App.showError('确认收货?', res => {
				    if (res.confirm) {
				        App._post_form('citydelivery.Index/confirmGoods', {
				            order_id
				        }, result => {
				            _this.getOrderList(_this.dataType)
				        })
				    }
				}, true)
			}else if (handleList.includes(handleType)) {
                App.showError(`确认${handleType === 'cancel' ? '要取消该订单吗' : '收到商品'}?`, res => {
                    if (res.confirm) {
                        App._post_form(`user.order/${handleType === 'get' ? 'receipt' : handleType}`, {
                            order_id
                        }, result => {
                            _this.getOrderList(_this.dataType)
                        })
                    }
                }, true)
            } else if (groupsInfo.includes(handleType)) {
                App.navigationTo({
                    url: `pages/subPages/groups/index/index?order_id=${order_id}`
                })
            } else if (navigationTo.includes(handleType)) {
                App.navigationTo({
                    url: `pages/mainPages/order/${handleType}/${comment_id ? 'success' : handleType}?order_id=${order_id}${comment_id ? '&&type=detail&&comment_id=' + comment_id : ''}`
                })
            } else if (kammi.includes(handleType)) {
                console.log('kami ~')
                App._postP('user.order/getOrderKammi', {
                    order_id
                }).then(res => {
                    console.log(res)
                    this.orderKami = res.data.data
                })

                this.showKami = true

            } else {
                _this[`${handleType}Order`](order_id, pay_price)
            }
        },

        /**
			 * 订单核销
			 */
        checkOrder(order_id) {
            let _this = this
            App.navigationTo({
                url: 'pages/mainPages/order/confirm?order_id=' + order_id
            })
        },

        /**
			 * 支付方式弹窗
			 */
        onToggleList() {
            this.$refs.orderPay.onToggleList()
        },

        /**
			 * 发起付款
			 */
        payOrder(order_id, pay_price) {
            App.saveFormId('pay', {
                type: 'normal'
            })
            this.$store.commit('orderPay', {
                order_id,
                actual_pay_price: pay_price,
                pay_from: 'order'
            })
            this.onToggleList()
        },

        /**
			 * 提交支付订单
			 */
        payOrderReady(e) {
            console.log(e)
            uni.hideLoading()
            let _this = this,
                source = App.getClientType(),
                order_id = e.result.data.order_id
            if (source === '3' || source === '4') {
                this.orderStatusInquiry(order_id)
            }
        },
        /**
			 * 订单支付状态查询
			 */
        orderStatusInquiry(order_id) {
            let _this = this,
                uniacid = App.getUniacid()
            uni.showModal({
                title: '温馨提示',
                content: '请确认当前支付是否已完成',
                cancelText: '未完成',
                confirmText: '已完成',
                success(res) {
                    if (res.confirm) {
                        console.log('用户已完成支付')
                        // 订单状态查询
                        App._get('user.order/detail', {
                            order_id
                        }, result => {
                            let orderInfo = result.data,
                                pay_status = orderInfo.pay_status.value
                            if (pay_status === 20) {
                                // 跳转到支付成功
                                uni.redirectTo({
                                    url: `/pages/subPages/flow/success?goods_id=${_this.goods_list[0].goods_id}&order_id=${order_id}&pay_price=${_this.actual_pay_price > 0 ? _this.actual_pay_price : _this.order_pay_price}&i=${uniacid}`
                                })
                            } else {
                                uni.redirectTo({
                                    url: '/pages/mainPages/order/index?type=payment&i=' + uniacid
                                })
                            }
                        })
                    } else if (res.cancel) {
                        console.log('用户未完成支付')
                        uni.redirectTo({
                            url: '/pages/mainPages/order/index?type=payment&i=' + uniacid
                        })
                    }
                }
            })
        },

        /**
			 * 订单支付成功
			 */
        paySuccess(e) {
            uni.hideLoading()
            let orderId = e.order.order_id,
                orderIndex = this.list.data.findIndex(order => order.order_id)
            if (this.dataType === 'all') {
                this.getOrderList(false)
            } else {
                this.list.data.splice(orderIndex, 1)
            }
            console.log(orderIndex)
            // 跳转到已付款订单
            App.navigationTo({
                url: 'pages/mainPages/order/detail?order_id=' + orderId
            })
        },

        /**
			 * 订单支付失败
			 */
        payFail(result) {
            uni.hideLoading()
            // 2-微信小程序 3-H5 4-公众号 7-支付宝小程序 8-百度小程序 9-头条小程序
            console.log('payFail', result)
            let clientType = this.$store.state.clientType,
                errMsg = null
            if (clientType === '2') {
                let isCancel = result.errMsg === 'requestPayment:fail cancel'
                errMsg = isCancel ? '订单未支付' : result.err_desc
            } else if (clientType === '4') {
                errMsg = result.err_msg === 'get_brand_wcpay_request:cancel' ? '订单未支付' : '支付失败'
            } else if (clientType === '7') {
                errMsg = result.resultCode === '6001' ? '订单未支付' : '支付失败'
            } else if (clientType === '8') {
                errMsg = '支付失败'
            } else if (clientType === '9') {
                errMsg = result.errMsg === 'requestPayment:fail cancel' ? '订单未支付' : '支付失败'
            }
            App.showError(errMsg)
        },

        /**
			 * 跳转订单详情页
			 */
        navigateToDetail(e) {
            let order_id = e.currentTarget.dataset.id
            App.saveFormId('order', {
                order_id
            })
            App.navigationTo({
                url: 'pages/mainPages/order/detail?order_id=' + order_id
            })
        },


        /**
			 * 设置商品列表高度
			 */
        setListHeight() {
            let systemInfo = uni.getSystemInfoSync(),
                rpx = systemInfo.windowWidth / 750, // 计算rpx
                tapHeight = Math.floor(rpx * 88), // tap高度
                scrollHeight = systemInfo.windowHeight - tapHeight // swiper高度
            this.setData({
                scrollHeight
            })
        }
    },
    /**
		 * 下拉到底加载数据
		 */
    onReachBottom() {
        // 已经是最后一页
        if (this.page >= this.list.last_page) {
            this.isLoading = false
            return false
        }
        // 加载下一页列表
        this.getOrderList(true, ++this.page)
    },
    onShareAppMessage(e) {

    }
}
</script>

<style>
	.container {
		/* background-color: #F0F0F0; */
	}

	.order-list {
		margin-top: 30rpx;
	}

	.no-data {
		padding-top: 140upx;
		height: 100vh;
		box-sizing: border-box;
	}

	.order-wrap-i {
		margin-bottom: 20upx;
	}

	/* 	.order-wrap-i:first-child {
		margin-top: 0;
	} */

	.order-i {
		padding: 0 30upx;
		background-color: #fff;
		border-radius: 6upx;
	}

	.order-i-add-line {
		position: relative;
	}

	.order-i-add-line:after {
		content: "";
		width: 100%;
		height: 2upx;
		background-color: #EEEEEE;
		position: absolute;
		left: 0;
		bottom: 0;
	}

	.order-i-top {
		height: 26upx;
		line-height: 26upx;
		padding: 28upx 0 30upx 0;
	}

	.order-i-top-l {
		font-weight: 400;
		flex-shrink: 1;
	}

	.order-i-top-r {
		color: #FE504F;
		font-weight: 400;
		flex-shrink: 0;
	}

	.order-i-center {
		position: relative;
	}

	.order-i-center-l {
		width: 170upx;
		height: 170upx;
		flex-shrink: 0;
	}

	.order-i-center-l .image {
		width: 100%;
		height: 100%;
	}

	.order-i-center-r {
		padding-left: 20upx;
		flex: 1;
		flex-shrink: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.order-i-center-r-wrap {
		height: 100%;
		position: relative;
	}

	.order-i-center-r .title {
		line-height: 30upx;
		color: #000000;
		font-size: 28upx;
		font-weight: 600;
		white-space: normal;
	}

	.order-i-center-r .spec {
		height: 23upx;
		line-height: 23upx;
		color: #999999;
		font-size: 24upx;
		margin-top: 18upx;
	}

	.order-i-center-r .price-num {
		width: 100%;
		height: 21upx;
		line-height: 21upx;
		font-size: 28upx;
		position: absolute;
		left: 0;
		bottom: 13upx;
	}

	.order-i-center-r .price-num .price {
		color: #FE504F;
	}

	.order-i-center-r .price-num .num {
		color: #999999;
	}

	.order-i-bottom {
		line-height: 25upx;
		color: #999999;
		font-size: 24upx;
		text-align: right;
		padding: 24upx 0 26upx 0;
	}

	.order-i-bottom .span {
		color: #FE504F;
		display: inline;
	}

	.order-i-btn {
		padding: 21upx 0;
		justify-content: flex-end;
	}

	.order-i-btn-i {
		margin-left: 22upx;
	}

	.order-i-btn-i:first-child {
		margin-left: 0;
	}

	.order-i-btn .btn-default {
		width: calc((100vw - 96upx) / 4);
		/* #ifndef MP-ALIPAY */
		height: 56upx;
		line-height: 56upx;
		/* #endif */
		/* #ifdef MP-ALIPAY */
		height: .5rem;
		line-height: .5rem;
		/* #endif */
		color: #333333;
		font-size: 24upx;
		text-align: center;
		border: 2upx solid #CCCCCC;
		border-radius: 100upx;
		margin-left: 20upx;
	}

	.order-i-btn .btn-main {
		/* background-color: #FFD940; */
		border: 2upx solid #999;
	}

	.scrollView {
		height: calc(100vh - 140upx);
	}
</style>
