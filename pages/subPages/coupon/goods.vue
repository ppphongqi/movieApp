<template>
	<view class="container" :style="themeColor">
		<GoodsList :item-data="goodsListData" :item-style="itemStyle"></GoodsList>
	</view>
</template>

<script>
	import GoodsList from "@/components/page/pageComponents/Goods.vue"
	import App from "@/common/js/app.js";
	export default {
		data() {
			return {
				goodsListData: null,
				itemStyle: {
					display: "3",
					margincol: "10",
					marginrow: "15"
				},
			};
		},
		components: {
			GoodsList
		},
		computed: {

		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.pageLoad(options);
		},
		mounted() {

		},
		methods: {
			/**
			 * 页面加载处理
			 */
			pageLoad(options) {
				// 当前页面参数
				this.options = options;
				this.getCouponGoods(options.coupon_id);
			},
			/**
			 * 获取优惠券列表
			 */
			getCouponGoods(coupon_id) {
				let _this = this;
				App._get('Goods/couponGoodsList', {
					coupon_id
				}, (result) => {
					if (result.data.length) {
						_this.goodsListData = result.data;
					}
				});
			},
		}
	}
</script>

<style>
	.container {
		min-height: 100vh;
		background: #FFFFFF;
	}
</style>
