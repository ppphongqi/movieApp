<template>
	<view :style="themeColor">
		<view class="container">
			<!-- 顶部选项卡 -->
			<page-nav-bar class="page-nav" @navItemClick="expressType" :nav-list="navList" :current="dataType" fixed="1"></page-nav-bar>
			<!-- 优惠券 -->
			<view class="coupon-list">
				<couponsheet :coupontype="dataType" :couponList="list" :showType="type" :iscouponChecked="0"></couponsheet>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import couponsheet from "@/components/template/CouponSheet.vue";
	import PageNavBar from "@/components/template/PageNavBar2.vue";
	import util from "@/common/js/util.js";
	export default {
		data() {
			return {
				list: [], // 优惠券/红包列表
				type: "", //显示类型
				// show
				dataType: "is_use",

			};
		},
		components: {
			couponsheet,
			PageNavBar
		},
		computed: {
			navList() {
				let list = [{
						id: "is_use",
						title: `可用${this.type === "bonus"?"红包":this.appCoupon.coupon_title}`,
					},
					{
						id: "not_use",
						title: `不可用${this.type === "bonus"?"红包":this.appCoupon.coupon_title}`,
					}
				];
				return list
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			let {
				type = "",
			} = options;
			this.type = type === "bonus" ? type : "coupon";
			uni.setNavigationBarTitle({
				title: `我的${type === "bonus"?"红包":this.appCoupon.coupon_title}`
			})
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff"
			});
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			// 获取优惠券列表
			this.getCouponList(this.dataType, this.type);
		},
		methods: {
			/**
			 * 获取优惠券列表
			 */
			getCouponList(dataType, type) {
				uni.showLoading({})
				let _this = this;
				App._get('user.Coupon/lists', {
					data_type: dataType,
					no_login: 1,
					type,
				}, function(result) {
					_this.setData({
						list: result.data,
					});
				}, false, () => {
					uni.hideLoading()
				});
			},

			/**
			 * 设置swiper的高度
			 */
			expressType(item) {
				this.dataType = item.id;
				uni.pageScrollTo({
					duration: 0,
					scrollTop: 0
				})
				this.getCouponList(item.id, this.type)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		overflow: hidden;

		.page-nav {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 2;
		}

		.coupon-list {
			padding-top: 100upx;
		}
	}
</style>
