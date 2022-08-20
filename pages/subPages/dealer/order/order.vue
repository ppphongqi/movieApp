<template>
	<view class="container" :style="themeColor">
		<page-header :pos="'1'">
			<block slot="content">
				<view class="income-list dis-flex flex-dir-row">
					<!-- <view class="income-item t-c dis-flex flex-dir-column flex-x-center">
						<view class="col-9 f-24">总收入(元)</view>
						<view class="col-3 f-32 m-top10">{{order_money.total_money}}</view>
					</view> -->
					<view class="income-item t-c dis-flex flex-dir-column flex-x-center">
						<view class="col-9 f-24">未结算(元)</view>
						<view class="col-3 f-32 m-top10">{{order_money.notSettled_money}}</view>
					</view>
					<view class="income-item t-c dis-flex flex-dir-column flex-x-center">
						<view class="col-9 f-24">已结算(元)</view>
						<view class="col-3 f-32 m-top10">{{order_money.settled_money}}</view>
					</view>
				</view>
			</block>
		</page-header>
		<page-nav-bar isScroll :nav-list="navList" fixed="1" :fix-top="182" :current="current" :default_check="2"  @navItemClick="orderTypeChange"></page-nav-bar>
		<view class="scrollView">
			<block v-if="!!orderData.data&&orderData.data.length>0">
				<dealer-goods-item :distorderList="orderList"></dealer-goods-item>
				<loadmore :showLoadmore="!showLoadmore"></loadmore>
			</block>
			<block v-else>
				<Abnor :abnor="'DATA'"></Abnor>
			</block>
		</view>
		<!-- </view> -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import loadmore from '@/components/template/Loadmore.vue'
import Abnor from '@/components/template/Abnor.vue'
import PageHeader from '@/components/template/PageHeader.vue'
import PageNavBar from '@/components/template/PageNavBar2.vue'
import DealerGoodsItem from '@/components/template/DealerGoodsItem.vue'
export default {
    data() {
        return {
			options: {},
            current: 2,
            navList: [
                {
                    id: 2,
                    title: '普通订单'
                },
                {
                    id: 0,
                    title: '未结算订单'
                },
                {
                    id: 1,
                    title: '已结算订单'
                },
                {
                    id: 3,
                    title: '会员卡订单'
                },
                {
                    id: 4,
                    title: '卡包订单'
                },
                {
                    id: 5,
                    title: '话费订单'
                }
            ],
            page: 1,
            order_money: {},
            orderData: {},
            scrollHeight: 0,
            scroll_Top: 0,
            showLoadmore: false,
            is_settled: 2 // 0未结算 1已结算 2全部
        }
    },
    components: {
        PageHeader,
        PageNavBar,
        DealerGoodsItem,
        loadmore,
        Abnor
    },
    computed: {
        orderList() {
            if (this.orderData.data) {
                let orderList = this.orderData.data
                if (orderList && orderList.length > 0) {
                    orderList = orderList.map(order => {
                        if (order.member_order_id > 0) {
                            order.order_id = order.member_order_id
                            order.order_goods = [
                                {
                                    goods_name: order.goods_name,
                                    rebate_commission: order.rebate_commission,
                                    total_pay_price: order.pay_price,
                                    total_num: 1,
                                    image: {
                                        file_path: '/static/images/member/member.png'
                                    }
                                }
                            ]
                        } else if (order.order_goods && order.order_goods[0]) {
                            order.order_goods[0].total_pay_price = order.pay_price
                        }
                        return order
                    })
                }
                return orderList
            }
            return []
        }
    },
    onLoad(options) {
		this.options = options
		this.$nextTick(()=>{
			this.current = this.navList.findIndex(item=>item.id == options.orderType)
		})
    },
    mounted() {
        this.computeScrollViewHeight()
		const id = (this.navList.find(item=>item.id == this.options.orderType) || {}).id || 2
        this.getPreproDetail(id, 1)
    },
    methods: {
        /**
			 * 获取	资产页面信息内容
			 */
        getPreproDetail(is_settled, page, isPage = false) {
            let _this = this
            App._get('user.dealer.User/getMyAssets', {
                is_settled,
                page
            }, result => {
                let data = result.data
                _this.order_money = {
                    total_money: data.total_money,
                    settled_money: data.settled_money,
                    notSettled_money: data.notSettled_money
                }

                if (isPage) {
                    if (result.data.data.length > 0) {
                        _this.orderData.data.push(...result.data.data)
                    }
                } else {
                    _this.orderData = result.data
                }
                _this.showLoadmore = result.data.data.length == result.data.per_page

                _this.$nextTick(() => {
                    uni.hideLoading()
                })
                App.hideLoading()
            })
        },
        /**
			 * 计算获取scroll高度
			 */
        computeScrollViewHeight() {
            let that = this,
                query = uni.createSelectorQuery().in(this)
            query.select('.income-list').boundingClientRect(function (res) {
                if (!!res) {
                    // header高度
                    let headerHeight = res.height + 20,
                        // 获取屏幕可用高度- navbar高度
                        screenHeight = uni.getSystemInfoSync().windowHeight,
                        // 计算 scroll-view 的高度
                        scrollHeight = screenHeight - headerHeight - 42
                    that.scrollHeight = `${scrollHeight}px`
                }
            }).
                exec()
        },
        orderTypeChange(value) {
            this.page = 1
            uni.pageScrollTo({
                duration: 0,
                scrollTop: 0
            })
            uni.showLoading({
                title: '加载中...'
            })
            this.is_settled = value.id
            this.getPreproDetail(value.id, 1)
        }
    },
    onReachBottom() {
        let {
            orderData
        } = this
        if (this.page <= orderData.last_page) {
            this.getPreproDetail(this.is_settled, ++this.page, true)
        };
    }
}
</script>

<style>
	.container {
		min-height: calc(100vh - 284rpx);
		background: #FFFFFF;
	}

	.scrollView {
		margin-top: 204rpx;
	}

	/* 头部样式 */
	.income-item {
		width: 100%;
		height: 144upx;
		position: relative;
	}

	/* 	.income-item::after {
		content: " ";
		position: absolute;
		top: 35upx;
		right: 0;
		bottom: 35upx;
		border-right: 1upx solid #EEEEEE;
	} */

	.income-list .income-item:last-child::after {
		content: none;
	}
</style>
