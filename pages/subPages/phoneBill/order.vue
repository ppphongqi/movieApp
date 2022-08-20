<template>
	<view class="page-phoneBill-order app-clearfix">
		<!-- 数据看板 -->
		<view class="order-dashboard-card">
			<view class="order-dashboard-card__content">
				<view class="order-dashboard-item">
					<view class="order-dashboard-card__title">{{cDashboardData.save.title}}</view>
					<vew class="order-dashboard-card__text is-strong">{{cDashboardData.save.text}}</vew>
				</view>
			</view>
			<view class="order-dashboard-card__footer">
				<view v-for="item in cDashboardData.list" :key="item.title" class="order-dashboard-item">
					<view class="order-dashboard-card__title">{{item.title}}</view>
					<vew class="order-dashboard-card__text">{{item.text}}</vew>
				</view>
			</view>
		</view>
		<!-- 数据看板 end -->
		<!-- 订单列表 -->
		<view class="bill-order-wrapper">
			<view class="bill-order-wrapper__title">全部订单</view>
			<view class="bill-order-list">
				<view class="bill-order-item" v-for="item in cOrderList" :key="item.id">
					<view class="bill-order-card">
						<view class="bill-order-card__header">
							<view class="bill-order-card__no">下单时间：{{item.createTime}}</view>
							<view class="bill-order-card__status" :style="item.payStyle">{{item.payText}}</view>
						</view>
						<view class="bill-order-card__content">
							<view class="bill-order-card__content__left">
								<image class="bill-order-card__logo" :src="item.logoUrl"></image>
							</view>
							<view class="bill-order-card__content__center">
								<view class="bill-order-card__title">{{item.title}}</view>
								<view class="bill-order-card__row">
									<view class="bill-order-card__type">{{item.typeText}}</view>
									<view class="bill-order-card__status" :style="item.statusStyle">{{item.statusText}}</view>
								</view>
								<view class="bill-order-card__row">
									<view class="bill-order-card__price">￥<text class="is-strong">{{item.price}}</text></view>
									<view class="bill-order-card__rechargeNo">充值号：{{item.rechargeNo}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 订单列表 end -->
		<LoadMore :showLoadmore="!orderListRes.hasMore"></LoadMore>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import LoadMore from '@/components/template/Loadmore.vue'
export default {
    components: {
        LoadMore
    },
    data() {
        return {
            // dashboard的接口数据
            dashboardRes: {

            },
            // 订单列表的分页接口数据
            orderListRes: {
                // 当前第几页，0就是即将请求第1页
                page: 0,
                // 分页的大小
                listRow: 20,
                // 数据
                data: [],
                // 是否还有更多
                hasMore: true,
                // 是否正在请求
                isFetching: false
            }
        }
    },
    computed: {
        // 格式化数据看板的数据
        cDashboardData() {
            const data = this.dashboardRes || {}
            return {
                // 可节省多少钱
                save: {
                    title: '共节省(元)',
                    text: data.coupon_price
                },
                // 分项
                list: [
                    {
                        title: '支付金额(元)',
                        text: data.sum_pay_price
                    },
                    {
                        title: '话费到账(元)',
                        text: data.sum_amount
                    },
                    {
                        title: '消费笔数',
                        text: data.order_count
                    }
                ]
            }
        },
        // 格式化的订单列表数据
        cOrderList() {
            const data = this.$util.deepGet(this.orderListRes, 'data', [])

            // 充值中：#e0b61e
            // 充值成功：#08d217
            return data.map(item => {
                // 充值状态文字
                let statusText = ''
                // 充值状态的样式类
                let statusStyle = ''
				const recharge_status = +item.recharge_status
				// 支付状态文字
				let payText = ''
				// 支付状态的样式类
				let payStyle = ''
				const pay_status = +item.pay_status
				if(recharge_status === 1 && pay_status === 20) {
					statusText = '等待充值'
				}else if(recharge_status === 1) {
					statusText = '未充值'
				}else if(recharge_status === 2) {
					statusText = '充值成功'
					statusStyle = 'color: #08d217;'
				}else if(recharge_status === 3) {
					statusText = '充值失败'
				}else if(recharge_status === 4) {
					statusText = '充值中'
					statusStyle = 'color: #e0b61e;'
				}
				if(pay_status === 10) {
					payText = '未支付'
					payStyle = 'color: #9c9393;'
				}else if(pay_status === 20) {
					payText = '已付款'
					payStyle = 'color: #08d217;'
				}else if(pay_status === 30) {
					payText = '已退款'
					payStyle = 'color: #353535;'
				}
                // 充值类型
                let typeText = ''
                switch (+item.recharge_type) {
                case 1:
                    typeText = '快充'
                    break
                case 2:
                    typeText = '慢充'
                    break
                default:
                    break
                }
                return {
                    id: item.order_no,
                    // 订单编号
                    no: item.order_no,
                    // 下单时间
                    createTime: item.create_time,
                    // logo图片
                    logoUrl: item.image,
                    // 名称
                    title: item.title,
                    // 类型text
                    typeText,
                    // 充值状态text
                    statusText,
                    // 充值状态class
                    statusStyle,
                    // 支付状态text
                    payText,
                    // 支付状态class
                    payStyle,
                    // 价格
                    price: item.pay_price,
                    // 充值手机号
                    rechargeNo: item.recharge_phone
                }
            })
        }
    },
    async onShow() {
        try {
            await this.mainMixin_BeforeFetchPageData()
            await Promise.all([
                this.fetchOrderListRes({
                    resetBeforeFetch: true
                }).catch(() => {}),
                this.fetchDashboardRes().catch(() => {})
            ])
			App.hideLoading()
        } catch (e) {
            console.log('onPullDownRefresh 报错', e)
            // TODO handle the exception
        }
    },
    async onPullDownRefresh() {
        try {
            await this.mainMixin_BeforeFetchPageData()
            await Promise.all([
                this.fetchOrderListRes({
                    resetBeforeFetch: true
                }).catch(() => {}),
                this.fetchDashboardRes().catch(() => {})
            ])
        } catch (e) {
            console.log('onPullDownRefresh 报错', e)
            // TODO handle the exception
        }
        uni.stopPullDownRefresh()
    },
    // 上拉加载更多
    onReachBottom() {
        if (this.orderListRes.isFetching || !this.orderListRes.hasMore) {
            return
        }
        this.fetchOrderListRes().catch(() => {})
    },
    methods: {
        // 请求优惠券列表的分页接口数据
        async fetchOrderListRes({
            resetBeforeFetch = false
        } = {}) {
            try {
                // 如果在请求之前需要重置数据
                if (resetBeforeFetch) {
                    // 重置数据
                    // 还应该取消请求的但是现在没有取消请求的方法
                    this.orderListRes = {
                        ...this.orderListRes,
                        page: 0,
                        data: [],
                        hasMore: true,
                        isFetching: false
                    }
                }
                // 如果没有更多就不必请求了
                if (!this.orderListRes.hasMore) {
                    return Promise.reject()
                }
                // 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
                // 设置为正在请求
                this.orderListRes.isFetching = true
                // 请求数据
                const res = await App._getP('phoneBill.Index/orderLists', {
                    page: this.orderListRes.page + 1,
                    list_rows: this.orderListRes.listRow
                })
                // 取得新的数据
                const newData = this.$util.deepGet(res, 'data.data', [])
                // 判断是否有更多
                const hasMore = newData.length >= this.orderListRes.listRow
                // 设置新的数据
                this.orderListRes = {
                    ...this.orderListRes,
                    page: this.orderListRes.page + 1,
                    // 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
                    // 但如果前一个请求比后一个请求后返回，依然会出错
                    data: resetBeforeFetch ? newData : this.orderListRes.data.concat(newData),
                    hasMore,
                    isFetching: false
                }
                console.log('this.orderListRes11111111111', this.orderListRes.data[0])
            } catch (e) {
                console.log(e)
                return Promise.reject(e)
                // TODO handle the exception
            }
        },
        // 请求当前算价接口的数据
        async fetchDashboardRes() {
            try {
                const res = await App._getP('phoneBill.Index/data')
                this.dashboardRes = res.data || {}
            } catch (e) {
                return Promise.reject(e)
                // TODO handle the exception
            }
        }
    }
}
</script>

<style lang="scss" scoped>
	.page-phoneBill-order {
		min-height: 100vh;
	}

	// 数据看板
	.order-dashboard-card {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		margin: 30rpx auto;
		padding: 0 30rpx;
		color: #fff;
		border-radius: 20rpx;
		background-color: #2C5FF4;
	}

	.order-dashboard-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		white-space: nowrap;
	}

	.order-dashboard-card__title {
		font-size: 24rpx;
		color: #A8BEFF;
	}

	.order-dashboard-card__text {
		font-size: 34rpx;
		margin-top: 12rpx;

		&.is-strong {
			font-size: 56rpx;
			font-weight: bold;
		}
	}

	.order-dashboard-card__content {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 180rpx;
		border-bottom: 1px solid #A8BEFF;
	}

	.order-dashboard-card__footer {
		display: flex;
		min-height: 140rpx;
		align-items: center;

		.order-dashboard-item {
			width: 33.333333%;
		}
	}

	// 数据看板
	// 订单列表
	.bill-order-wrapper {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		margin: 30rpx auto;
	}

	.bill-order-wrapper__title {
		margin: 30rpx;
		font-weight: bold;
		font-size: 36rpx;
		color: #333;
	}

	.bill-order-item {
		&+& {
			margin-top: 20rpx;
		}
	}

	.bill-order-card {
		box-sizing: border-box;
		min-height: 330rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.bill-order-card__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.bill-order-card__no {
		font-size: 28rpx;
		color: #333;
	}

	.bill-order-card__status {
		font-size: 28rpx;
		color: #999;

		&.is-red {
			color: #FF4444;
		}
	}

	.bill-order-card__content {
		display: flex;
		margin-top: 30rpx;
	}

	.bill-order-card__logo {
		width: 200rpx;
		height: 200rpx;
	}

	.bill-order-card__content__center {
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 200rpx;
		flex: 1;
		margin-left: 30rpx;
	}

	.bill-order-card__title {
		display: -webkit-box;
		margin-bottom: auto;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
	}

	.bill-order-card__type {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		align-self: flex-start;
		height: 34rpx;
		padding: 0 16rpx;
		margin: 20rpx 0;
		line-height: 1;
		font-size: 20rpx;
		color: #999;
		background-color: #eee;
		border-radius: 9999rpx;
	}

	.bill-order-card__row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.bill-order-card__price {
		font-weight: bold;
		font-size: 24rpx;
		color: #FF4444;

		.is-strong {
			font-size: 36rpx;
		}
	}

	.bill-order-card__rechargeNo {
		font-size: 24rpx;
		color: #999;
	}

	// 订单列表 end
</style>
