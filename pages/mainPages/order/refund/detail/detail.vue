<template>
	<view class="page" :style="themeColor">
		<!-- 头部banner -->
		<view class="header-banner main-bg-color">
			<view class="header-backdrop">
				<image class="header-img" src="/static/images/order/order-header.png"></image>
				<image class="state-img" :src="stateImg" mode="aspectFit"></image>
			</view>
			<view class="order-status-text f-32 col-3 auxiliary-color">{{statusText}}</view>
		</view>
		<!-- 商品详情 -->
		<view class="all-shopcontent p-left-right-30 b-f m-btm10">
			<goods-item :goods-data="detail.order_goods_info" :goodscard="detail.card_price || detail.card_title?1:0"></goods-item>
			<!-- 总价 -->
			<view class="total-cotent f-24 col-9 border-line border-top">
				付款金额：
				<text class="total-price f-24">{{settingData.currency}}{{detail.order_goods_info && detail.order_goods_info.total_pay_price}}</text>
			</view>
		</view>
		<!-- 物流 -->
		<view class="logistics-content p-left-right-30 b-f m-btm20" v-if="detail.express_no && detail.express_id && detail.express_type !=3">
			<view class="logistics dis-flex flex-x-between">
				<view class="f-24 col-6">物流公司</view>
				<view class="f-24 col-3">{{detail.express_id}}</view>
			</view>
			<view class="logistics dis-flex flex-x-between">
				<view class="f-24 col-6">物流单号</view>
				<view class="f-24 col-3">{{detail.express_no}}</view>
			</view>
		</view>
		<!-- 核销码 -->
		<view class="address-content p-left-right-30 b-f" v-if="detail.code && detail.code.length">
			<view class="address-detail p-top-bom-30">
				<view class="address-title f-28 col-3">核销码</view>
				<view v-for="(item,index) in detail.code" :key="item.code" class="dis-flex f-24 flex-x-between m-btm30">
					<view class="col-3">{{item.code}}</view>
				</view>
			</view>
		</view>
		<!-- 售后详情 -->
		<view class="after-detail-content b-f m-btm20">
			<view class="after-type dis-flex flex-x-between">
				<view class="f-24 col-6">售后类型</view>
				<view class="f-24 col-3">{{detail.type === 10?"退货退款":detail.type === 20?"换货":"退款"}}</view>
			</view>
			<view class="after-type dis-flex flex-x-between">
				<view class="f-24 col-6">申请原因</view>
				<view class="f-24 col-3">{{detail.apply_desc}}</view>
			</view>
			<view class="after-cate" v-if="detail.refund_image && detail.refund_image.length>0">
				<view class="f-24 col-6">申请凭证</view>
				<view class="cateView dis-flex m-top20">
					<view class="cateView-img" v-for="(img, idx) in detail.refund_image" :key="idx" :style="'background-image:url('+(img.file &&img.file.file_path)+')'"
					 ></view>
				</view>
			</view>
		</view>
		<!-- 退货地址 -->
		<view class="address-content p-left-right-30 b-f" v-if="(detail.is_agree === 10) && (detail.type === 10 ||detail.type === 20)">
			<view class="address-detail p-top-bom-30">
				<view class="address-title f-28 col-3">退货地址</view>
				<view class="dis-flex f-24 flex-x-between m-btm30">
					<view class="col-6">收货人</view>
					<view class="col-3">{{detail.receive_username}}</view>
				</view>
				<view class="dis-flex f-24 flex-x-between m-btm30">
					<view class="col-6">联系电话</view>
					<view class="col-3">{{detail.receive_mobile}}</view>
				</view>
				<view class="dis-flex f-24 flex-x-between">
					<view class="col-6">详情地址</view>
					<view class="col-3">{{detail.receive_address}}</view>
				</view>
			</view>
			<view class="remaks f-24 col-9">
				<view class="m-bom12">· 未于卖家协商一致情况下，请勿寄到付或平邮</view>
				<view>· 请填写真实有效物流信息</view>
			</view>
		</view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import GoodsItem from '@/components/template/ListGoodsItem.vue';
	import App from '@/common/js/app.js';
	export default {
		data() {
			return {
				order_refund_id: '',
				statusText: "",
				detail: {}
			};
		},
		components: {
			GoodsItem
		},
		computed: {
			stateImg() {
				let detail = this.detail,
					stateImgUrl = "/static/images/order/";
				if (this.detail) {
					let {
						is_agree,
						is_user_send,
						is_receipt,
						status
					} = detail;
					if (is_agree === 0) { //待处理
						stateImgUrl += "daishiyong";
					} else if (is_agree === 10) { //已同意
						if (is_user_send === 0) { //待发货
							stateImgUrl += "daifahuo";
						} else {
							stateImgUrl += "daishouhuo";
						}
					} else if (is_agree === 20) { //已拒绝
						stateImgUrl += "yijujue";
					}
				}
				stateImgUrl += ".png";
				return stateImgUrl
			}
		},
		onLoad(options) {
			App.showLoading();
			this.setData({ ...options
			});
			this.getRefundOrder(options.order_refund_id);
		},
		mounted() {},
		methods: {
			/**
			 * 获取订单详情
			 */
			getRefundOrder(order_refund_id) {
				let _this = this;
				App._get(
					'User.Refund/refundDetail', {
						order_refund_id
					},
					res => {
						console.log(res.data);
						_this.detail = res.data;
						App.hideLoading(800);
					}
				);
			}
		}
	};
</script>

<style>
	.header-banner {
		position: relative;
		width: 100%;
		height: 170upx;
	}

	.order-status-text {
		position: absolute;
		top: 50%;
		left: 30upx;
		transform: translateY(-50%);
	}

	.all-shopcontent {
		position: relative;
		bottom: 10upx;
	}

	.shop-content {
		border-bottom: 1px solid #eeeeee;
		padding: 34upx 0 44upx 0;
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
		text-align: right;
	}

	.total-cotent .total-price {
		color: #fe504f;
	}

	.logistics-content .logistics {
		padding: 28upx 0;
		border-bottom: 1px solid #eeeeee;
	}

	.logistics-content .logistics:last-child {
		border: none;
	}

	.after-detail-content {
		padding: 26upx 30upx 40upx 30upx;
	}

	.after-type {
		margin-bottom: 26upx;
	}

	.cateView {
		flex-wrap: wrap;
	}

	.cateView-img {
		width: 30%;
		padding-top: 30%;
		border-radius: 6upx;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		margin: 0 1.5% 3%;
	}

	/* 	.cateView image {
		width: 196upx;
		height: 196upx;
		border-radius: 6upx;
		/* margin: 0 0 16upx 16upx; */
	/* 	} */

	.address-detail {
		border-bottom: 1px solid #eeeeee;
	}

	.address-title {
		margin-bottom: 40upx;
	}

	.m-btm30 {
		margin-bottom: 30upx;
	}

	.remaks {
		padding: 22upx 0 28upx 0;
	}

	.m-bom12 {
		margin-bottom: 12upx;
	}

	.header-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.header-backdrop .header-img {
		display: block;
		width: 750upx;
		height: 170upx;
	}

	.header-backdrop .state-img {
		position: absolute;
		top: 50%;
		right: 8%;
		transform: translateY(-50%);
		z-index: 1;
		width: 130upx;
	}
</style>
