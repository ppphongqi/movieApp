<!-- 
	单个分销商品 by 杨智源  
	
	distorderList 分销订单列表 
 -->
<template>
	<view>
		<view class="income-ordder-item" v-for="(items,index) in orderList" :key="index">
			<view class="order-number-box dis-flex flex-x-between flex-y-center">
				<view class="order-number col-9 f-24">订单编号：{{items.order_no}}
					<text class="number-copy col-3 f-24" @click="ctrlorder(items.order_no)">复制</text>
				</view>
				<view class="order-status dis-flex flex-y-center">
					<text class="col-m f-26">{{items.state_text}}</text>
				</view>
			</view>
			<view class="order-goods dis-flex flex-dir-row m-btm20" v-for="(goodsitem,idx) in items.order_goods" :key="idx"
			 @click="navigationTo('pages/subPages/dealer/order/detail?dealer_id='+items.id)">

				<view class="order-goods-img">
					<image :src="!!goodsitem.image&&!!goodsitem.image['file_path']?goodsitem.image['file_path']:''"></image>
				</view>
				<view class="order-goods-info dis-flex flex-dir-column flex-x-between flex-box">
					<view class="order-goods-title twolist-hidden f-28 col-3">{{goodsitem.goods_name}}</view>
					<view class="order-income dis-flex flex-x-between">
						<view class="dis-flex flex-y-center">
							<image :src="items.avatarUrl" class="avatar" mode=""></image>
							<view class="nick-name f-24 col-3 onelist-hidden">{{items.nickName}}</view>
						</view>
					</view>
					<view class="dis-flex flex-y-center flex-x-between">
						<view class="f-24 col-9">实付金额：{{settingData.currency}}{{goodsitem.total_pay_price}}</view>
						<view class="f-26 col-9">x{{goodsitem.total_num}}</view>
					</view>
				</view>
			</view>
			<view class="incom-total m-top20">
				<view class="dis-flex flex-x-between flex-y-center">
					<view class="f-24 col-3">总计预估返利</view>
					<view class="f-24 col-m">{{items.is_settled===0?'未结算':items.is_settled===1?'已结算':'结算中'}}</view>
				</view>
				<view class="dis-flex flex-x-between flex-y-center m-top10">
					<view class="f-32 col-m price-font-family">{{settingData.currency}}{{items.rebate_commission}}</view>
					<!-- <view class="f-24 col-9 price-font-family">共{{items.member_order_id ? "1": items.order_goods.length}}件商品</view> -->
					<view class="f-24 col-9 price-font-family">{{items.referee?items.referee[1]:"内购"}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {

			};
		},
		props: {
			distorderList: {
				type: Array,
				default: []
			}
		},
		components: {

		},
		computed: {
			orderList() {
				return this.distorderList.filter(val => val.order_id > 0);
			}
		},
		beforeCreate() {

		},
		onLoad(options) {

		},

		onShow() {

		},
		mounted() {

		},
		methods: {
			ctrlorder(ordercode) {
				App.copyTextHandle(ordercode);
			}
		}
	}
</script>

<style>
	/* 订单列表 */
	.income-ordder-item {
		box-shadow: 0 2upx 10upx 0 rgba(170, 170, 170, 0.35);
		border-radius: 6upx;
		padding: 20upx 30upx;
	}

	.order-number-box {
		margin-bottom: 12upx;
	}

	.income-ordder-item .number-copy {
		padding: 6upx 14upx;
		border-radius: 8upx;
		border: 1upx solid #EEEEEE;
		margin-left: 20upx;
	}

	.income-ordder-item .order-goods-img {
		margin-right: 20upx;
	}

	.income-ordder-item .order-goods-img image {
		border-radius: 6upx;
		width: 170upx;
		height: 170upx;
		display: block;
	}

	.order-income .avatar {
		width: 60rpx;
		height: 60rpx;
		display: block;
		border-radius: 50%;
		margin: 4rpx 12rpx 4rpx 0;
		/* padding: 4upx 15upx 4upx 10upx;
		border: 1upx solid #D69555;
		color: #D69555;
		border-radius: 0 40upx 40upx 0; */
	}

	.order-income .iconfont {
		width: 1em;
		height: 1em;
		line-height: 1em;
		margin-right: 8upx;
	}
</style>
