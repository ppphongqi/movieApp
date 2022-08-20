<template>
	<view class="page" :style="themeColor">
		<page-nav-bar @navItemClick="navTypeChange" :nav-list="navList" :current="navType" fixed="1"></page-nav-bar>
		<view class="after-list-content">
			<block v-if="orderListData.length>0">
				<view class="after-list p-left-right-30 b-f" v-for="(item, index) in orderListData" :key="index" :id="'item' + index">
					<view class="afer-items m-btm20">
						<!-- 头 -->
						<view @click="skip(item)">
							<view class="date-status dis-flex flex-x-between">
								<view class="date col-3 f-24">{{ item.create_time }}</view>
								<view class="status f-24">{{ item.statusText }}</view>
							</view>
							<!-- 商品详情 -->
							<goods-item :goods-data="item.order_goods_info"></goods-item>
							<!-- 总价 -->
							<!-- <view class="total-cotent f-24 col-9">
								共1件商品，合计：
								<text class="total-price f-28">{{settingData.currency}}{{item.order_goods_info.total_price}}</text>
							</view> -->
						</view>
						<!-- 确认收货或查看详情按钮 -->
						<view class="status-btn-content border-line border-top">
							<view class="f-24 col-3  btn btn-2" v-if="item.is_agree === 0 && item.status === 1" @click="refundHandle(item.order_refund_id,'cancel')">取消申请</view>
							<view class="f-24 col-3 btn" :class="item.is_agree === 10 &&item.is_user_send === 0&&item.type !== 30? 'btn-1': 'btn-2'"
							 @click="statusBtn(item)">
								{{item.is_agree === 10 &&item.is_user_send === 0 &&item.type !== 30 && item.status !== 3? "发货": "查看详情"}}
							</view>
							<view class="f-24 col-3  btn btn-1" v-if="item.status === 1 && item.is_agree === 10 && item.store_send_time !== 0"
							 @click="refundHandle(item.order_refund_id,'receive')">确认收货</view>
						</view>
					</view>
				</view>
			</block>
			<block v-else>
				<Abnor :abnor="'ORDER'"></Abnor>
			</block>
		</view>
		<!-- 返回顶部 -->
		<GoTopBtn :page-scroll="pageScroll"></GoTopBtn>
		<!-- 选择物流 -->
		<SelectLogistics :show="isShowSelect" @submit="logisticsSubmit" @clickmask="showSelect"></SelectLogistics>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import PageNavBar from "@/components/template/PageNavBar2.vue";
	import GoodsItem from "@/components/template/ListGoodsItem.vue";
	import SelectLogistics from "@/components/template/SelectLogistics.vue";
	import GoTopBtn from "@/components/template/GoTopBtn.vue"
	import Abnor from "@/components/template/Abnor.vue"
	import listMixin from "@/common/js/pageListMixin.js"
	import App from "@/common/js/app.js";
	let isMore = true;
	export default {
		mixins: [listMixin],
		data() {
			return {
				navType: 0,
				navList: [{
						id: 0,
						title: "全部"
					},
					{
						id: 1,
						title: "进行中"
					},
					{
						id: 2,
						title: "已完成"
					},
					{
						id: 3,
						title: "已驳回"
					}
				],
				scrollHeight: null,
				isShowSelect: false, //物流选择组件
				isShowShade: false,
				current_page: null,
				data: [],
				last_page: null,
				per_page: null,
				total: null,
				currentOrder: "", //当前操作信息
				isShowGoTop: false, //是否显示返回顶部
			};
		},
		components: {
			PageNavBar,
			SelectLogistics,
			GoodsItem,
			Abnor
		},
		computed: {
			orderListData() {
				let statusData = {
					type: {
						"10": "退货退款",
						"20": "换货",
						"30": "退款"
					},
					is_agree: {
						"0": "待处理",
						"10": "已同意",
						"20": "已拒绝"
					},
					is_user_send: {
						"0": "未发货",
						"1": "已发货"
					},
					is_receipt: {
						"0": "未收货",
						"1": "已收货"
					},
					status: {
						"1": "进行中",
						"2": "已拒绝",
						"3": "已完成",
						"4": "已取消",
						"5": "已关闭",
					}
				};
				let orderList = this.data.map(orderItem => {
					let statusText = "",
						{
							type,
							is_agree,
							is_user_send,
							is_receipt,
							is_bus_send,
							status
						} = orderItem
					if (status === 1) {
						if (is_agree === 0) {
							//待处理
							statusText = statusData.is_agree[is_agree];
						} else {
							if (is_agree === 10) {
								//已同意
								if (type === 30) {
									//退款
									statusText = "已退款";
								} else {
									if (is_user_send === 0) {
										//未发货
										statusText += `${statusData.is_agree[is_agree]}${statusData.type[type]}${type===30?'':',请及时发货'}`;
									} else {
										//未收货
										if (is_receipt === 0) {
											if (type === 10) {
												statusText += statusData.is_user_send[is_user_send] + ",待退货退款";
											}
											if (type === 20) {
												if (is_user_send === 1 && is_bus_send === 1) {
													statusText += statusData.is_user_send[is_user_send] + ",待用户收货";
												} else if (is_user_send === 0 && is_bus_send === 0) {
													statusText += statusData.is_user_send[is_user_send] + ",待用户发货";
												} else if (is_user_send === 1 && is_bus_send === 0) {
													statusText += statusData.is_user_send[is_user_send] + ",待商家发货";
												}
											}
										} else {
											//已收货
											statusText = "已完成";
										}
									}
								}
							} else {
								statusText = statusData.is_agree[is_agree];
							}
						}
					} else {
						statusText = statusData.status[status];
					}
					orderItem.statusText = statusText;
					return orderItem;
				});
				return orderList;
			}
		},
		onLoad(options) {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff"
			});
			App.showLoading();
		},
		mounted() {
			this.getRefundOrders("0", 1, false);
			this.scrollViewHeight();
		},
		methods: {
			/**
			 * 获取售后订单列表
			 */
			getRefundOrders(orderType = "0", page = 1, isPage = false) {
				let _this = this;
				App._get("User.Refund/refundList", {
					status: orderType,
					page,
					no_login: 1
				}, res => {
					console.log(res);
					if (isPage) {
						if (res.data.data.length > 0) {
							_this.data.push(...res.data.data);
						} else {
							_this.isMore = false;
						}
					} else {
						_this.setData(res.data);
					}
					_this.isMore = true;
					App.hideLoading(1000);
				});
			},
			/**
			 * 订单状态切换
			 */
			navTypeChange(e) {
				this.listInit(e.id);
				this.getRefundOrders(e.id);
			},

			/**
			 * 物流选择组件显示
			 */
			showSelect(orderInfo) {
				this.currentOrder = orderInfo ? orderInfo : null;
				this.isShowSelect = !this.isShowSelect;
			},

			/**
			 * 列表状态初始化
			 */
			listInit(navType = "30") {
				let _this = this;
				_this.setData({
					current_page: 1,
					navType,
					isMore: true
				});
			},

			/**
			 * 物流发货
			 */
			logisticsSubmit(e) {
				let _this = this;
				App.showError("是否确定发货?", res => {
					if (res.confirm) {
						let logisticsData = e;
						App._post_form("User.Refund/userDeliverGoods", {
							order_refund_id: _this.currentOrder.order_refund_id,
							express_id: e.company,
							express_no: e.number
						}, opitnos => {
							if (opitnos.data === 1) {
								App.showSuccess(opitnos.msg, () => {
									_this.listInit();
									_this.showSelect();
									_this.getRefundOrders("30", 1, false);
								})
							}
						});
					}
				}, true);
			},

			/**
			 * 订单操作
			 */
			refundHandle(order_refund_id, handleType) {
				let _this = this,
					handleList = {
						"cancel": {
							url: "cancelApply",
							msg: "确认取消申请吗?"
						},
						"receive": {
							url: "userReceivingGoods",
							msg: "确认收货吗?"
						}
					}
				App.showError(handleList[handleType].msg, (opt) => {
					if (opt.confirm) {
						App._post_form("User.Refund/" + handleList[handleType].url, {
							order_refund_id
						}, res => {
							if (res.code === 1) {
								App.showSuccess(res.msg, () => {
									_this.listInit();
									_this.getRefundOrders(_this.navType, 1, false);
								})
							}
						})
					}
				}, true)

			},

			scrollViewHeight() {
				let that = this,
					query = uni.createSelectorQuery().in(this);
				// 				query
				// 					.select(".navbar-Box")
				// 					.boundingClientRect(function(res) {
				// 						let headerHeight = res.height;
				// 						//获取屏幕可用高度
				// 						let screenHeight = uni.getSystemInfoSync().windowHeight;
				// 						//计算 scroll-view 的高度
				// 						let scrollHeight = screenHeight - headerHeight;
				// 						that.scrollHeight = `${scrollHeight}px`;
				// 					})
				// 					.exec();
			},
			skip(orderInfo) {
				App.navigationTo({
					url: `pages/mainPages/order/refund/detail/detail?order_refund_id=${orderInfo.order_refund_id}&statusText=${orderInfo.statusText}`
				});
			},
			bindPickerChange(e) {
				let that = this;
				that.ordername = null;
				that.expresslistIdx = e.target.value;
			},
			formSubmit(e) {
				console.log(
					"form发生了submit事件，携带数据为：" + JSON.stringify(e.detail.value)
				);
			},
			closeShade() {
				this.isShowShade = false;
			},
			/**
			 * 售后发货
			 */
			statusBtn(orderInfo) {
				if (orderInfo.is_agree === 10 && orderInfo.is_user_send === 0 && orderInfo.status === 1) {
					this.showSelect(orderInfo);
				} else {
					this.skip(orderInfo);
				}
			},
		},
		/**
		 * 加载更多
		 */
		onReachBottom() {
			let _this = this;
			if (!isMore) return;

			if (_this.current_page < _this.last_page) {
				_this.isMore = false;
				_this.getRefundOrders(_this.navType, ++_this.current_page, true);
			}
		}
	};
</script>

<style>
	.date-status {
		padding: 34upx 0 30upx 0;
	}

	.date-status .status {
		color: #fe504f;
	}

	.shop-detail {
		border-top: 1px solid #eeeeee;
		border-bottom: 1px solid #eeeeee;
		padding: 26upx 0 34upx 0;
	}

	.shop-detail .shop-img {
		width: 170upx;
		height: 170upx;
		margin-right: 20upx;
	}

	.shop-detail .shop-img image {
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}

	.shop-intor {
		flex: 1;
	}

	.shop-intor .shop-title {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.shop-intor .price-shopnum .price {
		color: #fe504f;
	}

	.total-cotent {
		padding: 24upx 0;
		border-bottom: 1px solid #eeeeee;
		text-align: right;
	}

	.total-cotent .total-price {
		color: #fe504f;
	}

	.status-btn-content {
		padding: 20upx 0 26upx 0;
		text-align: right;
	}

	.btn {
		display: inline-block;
		width: calc((100vw - 96upx) / 4);
		height: 56upx;
		line-height: 56upx;
		text-align: center;
		border-radius: 30upx;
		margin-left: 20upx;
	}

	.btn-1 {
		background: #ffd940;
		z-index: 2;
	}

	.btn-2 {
		border: 1px solid #cccccc;
		background: #ffffff;
	}

	.shade-box {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 2;
	}

	.logis-box {
		position: fixed;
		width: 100%;
		z-index: 3;
		left: 0;
		top: 40%;
		transform: translateY(-50%);
	}

	.logis-content {
		position: relative;
		padding: 30upx 0;
		margin: 0 65upx;
		background: #ffffff;
		border-radius: 6upx;
	}

	.logis-content .logis-title {
		text-align: center;
	}

	.logis-fgxc-content {
		width: 100%;
	}

	.logis-fgx {
		margin: 0 auto;
		width: 40upx;
		height: 6upx;
		border-radius: 4upx;
		background-color: #ffd940;
	}

	.logis-fgx-content {
		margin-bottom: 46upx;
	}

	.p-left-right-40 {
		padding: 0 40upx;
	}

	.logis-fromInput {
		height: 80upx;
		line-height: 80upx;
		border-top: 1px solid #f9f9f9;
		border-bottom: 1px solid #f9f9f9;
	}

	.fromInputplace {
		font-size: 24upx;
		color: #999999;
	}

	.fromInput-right {
		flex: 1;
	}

	.fromInput-right input {
		height: 80upx;
		line-height: 80upx;
	}

	.from-btn {
		padding: 0 50upx;
	}

	.from-btn button {
		text-align: center;
		height: 70upx;
		line-height: 70upx;
		background-color: #ffd940;
		border-radius: 36upx;
	}

	.right-iconright {
		font-size: 24upx !important;
	}

	.close {
		position: absolute;
		right: 40upx;
		top: 24upx;
	}

	.after-list {
		margin: 0 30upx;
		border-radius: 6upx;
	}

	.after-list-content {
		margin-top: 20rpx;
	}
</style>
