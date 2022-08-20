<template>
	<view class="p-b-20" :style="themeColor">
		<view class="pages-header "></view>
		<view class="section m-btm20">
			<swiper class="swiper" previous-margin="16px" next-margin="16px" @change="swiperChange">
				<block v-for="(goods_item,index) in goods_list" :key="index">
					<swiper-item>
						<view class="goods-item b-f flex-box" @click="select_goods(goods_item.goods_id)">
							<view class="member-items-select" v-if="goods_item.goods_id===goods.goods_id">
								<image src="/static/images/select.png"></image>
							</view>
							<view class="goods-content border-line border-bottom">
								<view class="goods-image pr" :style="{'background-image':'url('+goods_item.image[0]['file_path']+')'}">
									<view class="rules-indicator" @click="handleRulesIndicatorClick(goods_item)"><view class="iconfont icon-tishi"></view>使用说明</view>
								</view>
								<view class='twolist-hidden f-28 col-3 m-top20' style="line-height: 1.3em; height: 2.6em;">{{goods_item.goods_name}}</view>
								<view class="goods-price"><text class='col-9 f-24 m-right30'>价值</text>{{settingData.currency}}{{goods_item.goods_price}}</view>
							</view>
							<view class="items-footer dis-flex flex-y-center flex-x-between">
								<view class="dis-flex flex-y-center">
									<view class="give-icon"></view>
									<view class="give-icon-title f-22 col-3">{{goods_item.card_title}}</view>
								</view>
								<view class="member-date f-22 col-f">{{goods_item.card_type===2?goods_item.card_time_date['start_time']+'至'+goods_item.card_time_date['end_time']:goods_item.card_time_date+'天'}}</view>
							</view>
							<view class="items-footer-2 dis-flex flex-y-center flex-x-between" v-if="!!goods_item.coupon_name">
								<view class="dis-flex flex-y-center">
									<view class="give-icon"></view>
									<view class="give-icon-title f-22 col-3">{{goods_item.coupon_name}}{{goods_item.coupon_number}}张</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</block>
			</swiper>
			<view class="swiper-dots dis-flex flex-y-center flex-x-center">
				<view class="item-dot" :class="{'active':item.goods_id===goods.goods_id}" v-for="(item,index) in goods_list" :key="index"></view>
			</view>
			<view class="member-Tabbar member-whitediv b-f" v-if="image_third">
				<view class="title col-3 f-32 f-w">会员专属特权</view>
				<image :src="image_third" mode="widthFix" style="width: 100%;"></image>
			</view>
		</view>
		<view style="height: 40px;"></view>
		<view class="open-btn f-w f-30 t-c main-bg-color auxiliary-color" @click="submitOrder">{{goods.goods_price?goods.goods_price:""}}元立即开通</view>
		<order-pay ref="orderPay" @clickMask="onToggleList" @payChange="payTypeChange" @orderReady="payOrderReady"
		 @paySuccess="paySuccess" @payFail="payFail"></order-pay>
		<page-loading ref="loading"></page-loading>
		<!-- 绑定用户手机号 -->
		<GetUserPhone ref="getUserPhone"></GetUserPhone>
		<!-- 使用规则弹窗 -->
		<popup-view class="refund-agreement-popup" :show="rulesPopupVisible" type="center" @clickmask="rulesPopupVisible = false">
			<view>
				<view class="refund-agreement-card">
					<view class="refund-agreement-card__header">
						使用说明
					</view>
					<scroll-view scroll-y class="refund-agreement-card__content">
						<view class="refund-agreement-card__scroll__content">
							<parse :html="rules"></parse>
						</view>
					</scroll-view>
				</view>
				<view class="refund-agreement-popup__btn-close iconfont icon-roundclose" @click="rulesPopupVisible = false"></view>
			</view>
		</popup-view>
		<!-- 使用规则弹窗 end -->
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import OrderPay from "@/components/template/OrderPayPopups.vue"
	import GetUserPhone from "@/components/template/GetUserPhone.vue"
	import PopupView from '@/components/template/PopManager.vue'
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	export default {
		data() {
			return {
				goods_list: [], //商品列表
				// goods_id: null, //商品id
				image_third: null, //会员权益图片
				// pay_price: null, //购买金额
				payType: "", //支付方式
				goods: null ,//当前商品
				// 是否显示使用规则弹窗
				rulesPopupVisible: false,
				// 当前要显示的使用规则
				rules: ''
			};
		},
		onLoad(e) {
			App.showLoading()
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff"
			});
			this.goods_detail(1, false)
		},
		onShow() {

		},
		components: {
			OrderPay,
			GetUserPhone,
			Parse,
			PopupView
		},
		mounted() {

		},

		methods: {
			handleRulesIndicatorClick(item) {
				this.rules = item.card_content
				this.rulesPopupVisible = true
			},
			goods_detail(page = 1, isPage = false) {
				let _this = this;
				App._post_form('member.Member/getMemberGoodsList', {
					goods_type: 2,
					page,
				}, (res) => {
					_this.setData({
						goods_list: res.data.data,
						goods: res.data.data[0],
						image_third: (!!res.data.image_third && res.data.image_third.length > 0) ? res.data.image_third[0][
							'file_path'
						] : (_this.imageRoot + '31.png')
					});
				}, false, () => {
					App.hideLoading()
				})
			},
			/**
			 * 订单提交
			 */
			submitOrder() {
				let _this = this,
					goods = _this.goods,
					userInfo = uni.getStorageSync('userInfo');
				// #ifdef H5
				if (userInfo && this.$util.isEmptyMobile(userInfo.mobile)) {
					App.showError("请先绑定手机号", (res) => {
						_this.$refs.getUserPhone.showChange();
					})
					return
				}
				// #endif
 
				// 立即购买
				uni.redirectTo({
					url: '/pages/subPages/flow/checkout?' + App.urlEncode({
						goods_id: goods.goods_id,
						goods_num: 1,
						goods_sku_id: 0,
						goods_type: 'buy_member',
						is_express: goods.isexpress,
						is_zt: goods.iszt,
						transport_type: goods.transport_type,
						paychannel: 'member_goods',
						order_type: 1
					})
				});
			},
			/**
			 * 切换商品
			 */
			select_goods(goods_id) {
				// App.navigationTo({
				// 	url: "pages/subPages/goods/index/index?goods_id=" + goods_id
				// })
			},

			/**
			 * 自动切换
			 */
			swiperChange(e) {
				let current = e.detail.current;
				this.goods = this.goods_list[current];
			}
		}
	}
</script>

<style lang="scss">
	.pages-header {
		height: 700upx;
		position: relative;
		overflow: hidden;
	}

	.pages-header::before {
		content: " ";
		width: 150vw;
		height: 700upx;
		background-color: #FFD940;
		background-color: var(--theme-color);
		border-radius: 25%;
		position: absolute;
		left: -26vw;
		top: -15%;
		z-index: 1;
	}


	.section {
		position: relative;
		z-index: 2;
		margin-top: -670upx;
	}

	.swiper {
		white-space: nowrap;
		height: 700upx;
	}

	.goods-item {
		position: relative;
		width: 96%;
		margin: 0 2%;
		display: inline-block;
		margin-right: 20upx;
		overflow: hidden;
		z-index: 3;
		border-radius: 20upx;
	}

	.goods-item .goods-image {
		width: 100%;
		height: 360upx;
		border-radius: 6upx;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		/* margin-right: 28upx; */
		position: relative;
		z-index: 1;
	}

	.goods-content {
		padding: 30upx 0 30upx;
		margin: 0 30upx;
	}

	.goods-price {
		color: rgb(254, 80, 79);
	}

	.items-footer {
		padding: 20upx 30upx;
	}

	.items-footer-2 {
		padding: 10upx 30upx;
	}

	.items-footer .give-icon,
	.items-footer-2 .give-icon {
		width: 32upx;
		height: 32upx;
		background-image: url('~@/static/images/member/give_icon.png');
		background-size: 32upx, 32upx;
		background-repeat: no-repeat;
		margin-right: 20upx;
	}

	.member-date {
		padding: 0 12upx;
		border-radius: 40upx;
		background-color: rgb(254, 80, 79);
	}

	.member-items-select {
		position: absolute;
		top: -48upx;
		right: -50upx;
		width: 130upx;
		height: 90upx;
		background: #333333;
		transform: rotate(45deg);
		z-index: 2;
	}

	.member-items-select image {
		position: absolute;
		left: 60upx;
		bottom: 6upx;
		width: 30upx;
		height: 30upx;
		display: block;
		transform: rotate(-45deg);
	}

	.member-whitediv {
		margin: 10upx 30upx 0 30upx;
		border-radius: 20upx;
	}

	.member-whitediv image {
		border-radius: 20upx;
	}

	.open-btn {
		position: fixed;
		bottom: 20upx;
		left: 0;
		right: 0;
		margin: 0 30upx;
		height: 80upx;
		line-height: 80upx;
		background-color: rgb(249, 219, 59);
		border-radius: 30upx;
		z-index: 3;
	}

	.swiper-dots {
		height: 50upx;
	}

	.item-dot {
		width: 30upx;
		height: 10upx;
		background: #FFFFFF;
		margin: 0 8upx;
	}

	.item-dot.active {
		background:var(--theme-color);
	}

	.section .member-Tabbar {
		background-color: #FFFFFF;
		position: relative;
		padding: 30upx 30upx 0;
		border-radius: 20upx;
	}

	.section .member-Tabbar::after {
		content: " ";
		position: absolute;
		top: 34upx;
		left: 15upx;
		bottom: 2upx;
		width: 8upx;
		height: 36upx;
		background: #F1E0CE;
		border-radius: 20upx
	}

	.member-Tabbar .title {
		padding-left: 10upx;
	}
</style>

<style lang="scss" scoped>
	.rules-indicator {
		box-sizing: border-box;
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 48rpx;
		font-size: 24rpx;
		padding: 0 16rpx;
		color: #fff;
		border-radius: 9999rpx;
		background-color: rgba($color: #000000, $alpha: 0.5);
		.iconfont {
			font-size: 24rpx;
			margin-right: 8rpx;
		}
	}
</style>

<style lang="scss" scoped>
	// 商品退款协议弹窗
	.refund-agreement-popup__btn-close {
		margin-top: 40rpx;
		color: #fff;
		font-size: 50rpx;
		text-align: center;
	}
	.refund-agreement-card {
		width: 580rpx;
		border-radius: 10px;
		background-color: #fff;
	}
	.refund-agreement-card__header{
		display: flex;
		min-height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 40rpx;
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
		text-align: center;
	}
	.refund-agreement-card__content {
		height: 600rpx;
		box-sizing: border-box;
		padding: 30rpx 40rpx;
	}
	// 商品退款协议弹窗 end
</style>