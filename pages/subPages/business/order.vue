<template>
	<view :style="themeColor">
		<page-nav-bar :nav-list="navList" default_check="all" :current="express_type" @navItemClick="tabselect" fixed="1"></page-nav-bar>

		<view class="check-order-list" v-if="orderData">
			<scroll-view scroll-x="true" style="margin-bottom: 40rpx;">
				<view class="order-status dis-flex flex-y-center">
					<view class="f-24 col-9 item m-right30" :class="{'item-check':order_status==item.id}" v-for="(item,index) in orderStatus" @click="display(item.id)">
						{{item.name}}
					</view>
				</view>
			</scroll-view>
			<block v-if="orderData.data.length>0">
				<block  v-for="(item,index) in orderData.data" :key="index">
					<view class="check-order-item b-f" @click.stop="navigationTo('pages/mainPages/order/detail?showType=business&order_id='+item.order_id)">
						<view class="check-order-title dis-flex flex-x-between flex-y-center border-line border-bottom">
							<view class="f-24 col-9 dis-flex flex-y-center">订单号:{{item.order_no}}
								<view class="order-mark f-22" v-if="item.order_type !== 1">{{item.order_type === 2?"拼团":item.order_type === 3?"秒杀":item.order_type === 4?"卡密":"砍价"}}</view>
							</view>
							<view class="f-24 col-m">{{item.app_state_text}}</view>
						</view>
						<list-goods-item :goods-data="item.goods[0]"></list-goods-item>
						<view class="handle-list border-line border-top">
							<view class="handle-item dis-flex flex-x-end">
								<view class="f-24 col-9">合计: </view>
								<view class="f-24 col-m">{{settingData.currency}}{{item.pay_price}}</view>
							</view>
						</view>
						<view v-if="item.app_state_text == '待发货'&& delivergoods == 1"  @click.stop="navigationTo('pages/subPages/business/sendOrder?showType=business&send=1&order_id='+item.order_id)" class="dis-flex flex-x-end" >
							<view  class="main-bg-color auxiliary-color f-24 col-3 m-btm30 confirm-btn">确认发货</view>
						</view>
					</view>
				</block>
				<load-more :showLoadmore="!isMore"></load-more>
			</block>
			<block v-else>
				<view class="check-orders">
					<Abnor :abnor="'ORDER'"></Abnor>
				</view>
			</block>
		</view>
		<!-- 返回顶部 -->
		<GoTopBtn :page-scroll="pageScroll"></GoTopBtn>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
import PageNavBar from '@/components/template/PageNavBar2.vue'
import ListGoodsItem from '@/components/template/ListGoodsItem.vue'
import LoadMore from '@/components/template/Loadmore.vue'
import Abnor from '@/components/template/Abnor.vue'
import GoTopBtn from '@/components/template/GoTopBtn.vue'
import listMixin from '@/common/js/pageListMixin.js'
import App from '@/common/js/app.js'
export default {
    mixins: [listMixin],
    data() {
        return {
            navListActive: 0,
            navList: [
                {
                    id: 'all',
                    title: '全部'
                },
                {
                    id: 3,
                    title: '核销'
                },
                {
                    id: 1,
                    title: '快递'
                },
                {
                    id: 2,
                    title: '自提'
                },
				{
				    id: 6,
				    title: '同城配送'
				}
            ],
            express_type: 'all', // 订单类型
            orderData: null,
            order_status: '',
            page: 1,
            writeOffOrder: [
                { id: 0,
                    name: '全部' },
                { id: 1,
                    name: '待付款' },
                { id: 2,
                    name: '待核销' },
                { id: 3,
                    name: '已完成' },
                { id: 4,
                    name: '已过期' },
                { id: 5,
                    name: '已关闭' }
            ],
            selfExtraOrder: [
                { id: 0,
                    name: '全部' },
                { id: 1,
                    name: '待付款' },
                { id: 2,
                    name: '待自提' },
                { id: 3,
                    name: '已完成' },
                { id: 4,
                    name: '已关闭' }
            ],
            sendOrder: [
                { id: 0,
                    name: '全部' },
                { id: 1,
                    name: '待付款' },
                { id: 2,
                    name: '待发货' },
                { id: 3,
                    name: '待收货' },
                { id: 4,
                    name: '已完成' },
                { id: 5,
                    name: '已关闭' }
            ],
            isMore: true,
            bus_id: '',
            store_id: '',
            delivergoods: ''
        }
    },
    computed: {
        orderStatus() {
            let { express_type, writeOffOrder, selfExtraOrder, sendOrder } = this
            return express_type == 3 ? writeOffOrder : (express_type == 2 ? selfExtraOrder : (express_type == 1 ? sendOrder : []))

        }

    },
    components: {
        PageNavBar,
        ListGoodsItem,
        GoTopBtn,
        Abnor,
        LoadMore
    },
    beforeCreate() {

    },
    onLoad(options) {
        this.bus_id = options.bus_id
        this.store_id = options.store_id
        this.express_type = options.express_type
        this.order_status = options.order_status
        this.delivergoods = options.delivergoods
        uni.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff'
        })
    },

    onShow() {
        App.showLoading()
        this.page = 1
        this.listInit(this.express_type)
        this.getOrderList(1, this.order_status, this.express_type)
    },
    mounted() {
        // App.showLoading();
        // this.getOrderList(1,this.order_status, this.express_type);
    },
    methods: {
        tabselect(val) {
            console.log('tabselect', val)
            this.order_status = ''
            this.listInit(val.id)
            this.getOrderList(1, this.order_status, val.id)
        },
        display(id) {
            console.log('display', id)
            this.order_status = id
            this.getOrderList(1, this.order_status, this.express_type)
        },

        /**
			 * 列表初始化
			 */
        listInit(express_type) {
            this.express_type = express_type
            this.page = 1
            uni.pageScrollTo({
                duration: 0,
                scrollTop: 0
            })
        },

        /**
			 * 订单列表获取
			 */
        getOrderList(page = 1, order_status, express_type, isPage = false) {
            let _this = this
            express_type = express_type === 'all' ? '' : express_type
            App._get('merchant.order/index', {
                page,
                express_type,
                order_status,
                bus_id: _this.bus_id,
                bus_new: 1,
                store_id: _this.store_id
            }, res => {
                if (isPage) {
                    if (res.data.data.length > 0) {
                        _this.orderData.data.push(...res.data.data)
                    }
                } else {
                    _this.orderData = res.data
                }
                _this.isMore = res.data.data.length == res.data.per_page
                App.hideLoading(1000)
            })
        }
    },

    onReachBottom() {
        let _this = this,
            orderData = _this.orderData
        if (_this.page < orderData.last_page) {
            _this.getOrderList(++_this.page, _this.order_status, _this.express_type, true)
        }
    }
}
</script>

<style lang="scss">
	page {
		background-color: #F8F8F8;
	}
	.check-orders {
		height: calc(100vh - 140upx);
	}
	.confirm-btn {
			width:164rpx;
			height:60rpx;
			text-align: center;
			line-height: 60rpx;
			border-radius:10rpx;
	}
    .order-status {

		padding: 0 30rpx;
		box-sizing: border-box;
		.item {
			border-radius:50rpx;
			padding:15rpx 20rpx;
			background-color:rgba(238,238,238,1);
			white-space: nowrap;
		}
		.item-check {
			background-color: var(--theme-color);
			color: var(--auxiliary-color);
		}
	}
	.check-order-list {
		position: relative;
		z-index: 5;
		margin-top: 30upx;
	}

	.check-order-item {
		padding: 0 30upx;
		margin: 0 30rpx 20rpx 30rpx;
		border-radius: 6upx;
	}

	.check-order-title {
		height: 82upx;
	}

	.check-order-title .order-mark {
		padding: 4rpx 6rpx;
		color: #FFFFFF;
		background: #FF4444;
		border-radius: 6rpx;
		margin-left: 12rpx;
		/* border:1rpx solid # */
	}

	.handle-list {
		button {
			width:164rpx;
			height:60rpx;
			line-height:60rpx;
		}
	}

	.handle-item {
		height: 70upx;
		line-height: 70upx;
	}
</style>
