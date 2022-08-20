<template>
	<view class="bonus-content">
		<block v-for="(item,index) in itemData" :key="item.id">
			<view class="coupon-item col-f dis-flex flex-x-between flex-y-center m-top12" @click="openBonus(item.id)">
				<view class="coupon-price t-c">
					<view class="dis-flex flex-y-line flex-x-center">
						<view class="f-22" style="margin-right:4rpx">{{settingData.currency}}</view>
						<view class="f-40">{{item.money}}</view>
					</view>
					<view class="f-24 onelist-hidden">{{item.rule === 20?`满${removePoint(item.rule_order_money)}元可用`:"无门槛"}}</view>
				</view>
				<view class="coupon-info t-l flex-box p">
					<view class="coupon-name f-28">{{item.name}}</view>
					<view class="coupon-time f-24">{{getBonusTime(item)}}</view>
				</view>
				<view class="coupon-receive f-22">立即领取</view>
			</view>
			<block v-if="item.goods && item.goods.length > 0">
				<diy-goods :item-style="itemStyle" :item-data="item.goods"></diy-goods>
			</block>
		</block>
	</view>
</template>

<script>
	import DiyGoods from "./Goods.vue"
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				itemStyle: {
					buybtn: "1",
					buybtnstyle: "1",
					display: "4",
					icon: "1",
					margincol: 6,
					marginrow: 15,
					name: "1",
					oldprice: "1",
					price: "1",
					sales: "1",
				}
			}
		},
		props: {
			itemIndex: Number,
			itemData: Array,
			params: Object,
		},
		components: {
			DiyGoods
		},
		computed: {

		},
		mounted() {

		},
		methods: {
			removePoint(money) {
				return this.$util.removePoint(money)
			},
			getBonusTime(item) {
				let _this = this,
					{
						available_type,
						available_time
					} = item;
				if (available_type === 10) {
					return `有效期:${available_time.map(val=>_this.$util.formatTime(val, "date", ".")).join("-")}`;
				} else {
					return `领取后${available_type === 20?"当":"次"}日起${available_time}天内可用`;
				}
			},
			openBonus(active_id) {
				App.navigationTo({
					url: `pages/subPages/bonus/index?active_id=${active_id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bonus-content {
		padding: 12rpx 30rpx;
		background: #FFFFFF;


		.coupon-item {
			width: 100%;
			box-sizing: border-box;
			height: 120rpx;
			padding: 0 30rpx;
			margin-bottom: 12rpx;
			background-size: 100% 100%;
			background-image: url("~@/static/images/goods/coupon-bg.png");
		}

		.coupon-price {
			width: 23%;
		}

		.coupon-info {
			padding-left: 12rpx;
		}

		.coupon-item:last-child {
			margin-bottom: 0;
		}

		.coupon-receive {
			padding: 6rpx 10rpx;
			border: 1rpx solid #FFFFFF;
			border-radius: 50px;
		}
	}
</style>
