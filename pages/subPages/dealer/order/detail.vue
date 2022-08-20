<template>
	<view :style="themeColor">
		<view class="contaienr">
			<view class="order-user" v-if="detail.is_show_user === 1">
				<view class="user-title dis-flex flex-x-between flex-y-center col-3 border-line border-bottom">
					<view class="title f-30">用户信息</view>
					<view class="copy-btn f-22" @click="copyContent('')">复制信息</view>
				</view>
				<view class="user-info">
					<view class="info-item dis-flex flex-x-between flex-y-center f-26 col-9">
						<view class="item-title">姓名</view>
						<view class="item-text">{{detail.name}}</view>
					</view>
					<view class="info-item dis-flex flex-x-between flex-y-center f-26 col-9">
						<view class="item-title">联系方式</view>
						<view class="item-text">{{detail.mobile}}</view>
					</view>
					<view class="info-item dis-flex flex-x-between flex-y-center f-26 col-9" v-if="detail.express_type">
						<view class="item-title">{{detail.express_type === 1?"收货":"门店"}}地址</view>
						<view class="item-text twolist-hidden">{{detail.express_type === 1 ? detail.address.detail : detail.store.address}}</view>
					</view>
				</view>
				<image src="/static/images/order/address_line.png" class="address-line"></image>
			</view>
			<view class="order-content b-f">
				<list-goods-item :goods-data="detail.goods"></list-goods-item>
				<view class="order-total dis-flex flex-x-between flex-y-center">
					<view class="f-26 col-3">订单合计</view>
					<view class="f-26 col-9">{{settingData.currency}}{{detail.total_pay_price}}</view>
				</view>
			</view>
			<view class="order-expected dis-flex flex-x-between flex-y-center b-f">
				<view class="f-30 col-0">本单预估收入</view>
				<view class="f-28 col-m">{{settingData.currency}}{{detail.rebate_commission}}</view>
			</view>
			<view class="order-detail">
				<view class="user-title dis-flex flex-x-between flex-y-center col-3 border-line border-bottom">
					<view class="title f-30">订单信息</view>
				</view>
				<view class="order-info">
					<view class="info-item dis-flex flex-x-between flex-y-center f-26 col-9">
						<view class="item-title">订单号</view>
						<view class="item-text dis-flex flex-y-center">{{detail.order_no}}
							<view class="copy-btn f-22 col-3" @click="copyContent(detail.order_no)">复制</view>
						</view>
					</view>
					<view class="info-item dis-flex flex-x-between flex-y-center f-26 col-9">
						<view class="item-title">订单状态</view>
						<view class="item-text">{{detail.app_state_text}}</view>
					</view>
					<view class="info-item dis-flex flex-x-between flex-y-center f-26 col-9" v-if="!!detail.pay_time">
						<view class="item-title">支付时间</view>
						<view class="item-text twolist-hidden">{{detail.pay_time}}</view>
					</view>
					<view class="info-item dis-flex flex-x-between flex-y-center f-26 col-9" v-if="!!detail.settle_time">
						<view class="item-title">结算时间</view>
						<view class="item-text twolist-hidden">{{detail.settle_time}}</view>
					</view>
				</view>
			</view>
		</view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import ListGoodsItem from "@/components/template/ListGoodsItem.vue"
	export default {
		data() {
			return {
				dealer_id: "",
				detail: {}
			};
		},
		components: {
			ListGoodsItem
		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {
			this.dealer_id = options.dealer_id;
			this.getDetail(options.dealer_id);
		},
		onShow() {

		},
		mounted() {},
		methods: {
			getDetail(dealer_id) {
				let _this = this;
				App._get("user.dealer.Order/detail", {
					dealer_id
				}, (result) => {
					let data = result.data;
					data.pay_time = data.pay_time ? _this.$util.formatTime(data.pay_time, "info", "-") : null;
					data.settle_time = data.settle_time ? _this.$util.formatTime(data.settle_time, "info", "-") : null;
					_this.detail = data;
					App.hideLoading();
				})
			},
			copyContent(content) {
				if (content === "") {
					let detail = this.detail;
					content =`姓名:${detail.name}\n联系方式:${detail.mobile}\n`;
					if(this.detail.express_type){
						content+=`${detail.express_type === 1?"收货":"门店"}地址:${detail.express_type === 1 ? detail.address.detail : detail.store.address}`;
					}
				}
				App.copyTextHandle(content);
			}
		}
	}
</script>

<style>
	.contaienr {
		width: 100%;
		box-sizing: border-box;
		padding: 30upx;
	}

	.order-user,
	.order-detail {
		background: #FFFFFF;
		border-radius: 12upx;
		overflow: hidden;
	}

	.order-detail {
		margin-top: 30upx;
	}

	.user-title {
		height: 88upx;
		margin: 0 30upx;
	}

	.copy-btn {
		border: 1upx solid #999999;
		padding: 0 6upx;
		line-height: 1.5em;
		border-radius: 10upx;
		margin-left: 12upx;
	}

	.user-info,
	.order-info {
		margin: 0 30upx;
	}

	.info-item {
		padding: 20upx 0;
	}

	.item-title {
		color: #333333;
		min-width: 35%;
	}

	.address-line {
		width: 100%;
		height: 6upx;
		display: block;
	}

	.order-content {
		margin-top: 30upx;
		padding: 30upx;
		border-radius: 12upx;
	}

	.order-expected {
		padding: 20upx 30upx;
		border-radius: 12upx;
	}
</style>
