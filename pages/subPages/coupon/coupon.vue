<template>
	<view :style="themeColor">
		<view class="container">
			<view class="coupon-list" v-if="list.length">
				<view class="coupon-item" v-for="(item,index) in list" :key="index">
					<view class="item-wrapper" :class="['color__'+(item.state.value ? item.color: 'gray')]">
						<view class="coupon-type">{{ item.coupon_type}}</view>
						<view class="tip dis-flex flex-dir-column flex-x-center">
							<view v-if="item.coupon_type== 10">
								<text class="f-30">{{settingData.currency}}</text>
								<text class="money">{{item.reduce_price}}</text>
							</view>
							<text class="money" v-if="item.coupon_type == 20">{{item.discount}}折</text>
							<text class="pay-line">满{{item.min_price}}元可用</text>
						</view>
						<view class="split-line"></view>
						<view class="content dis-flex flex-dir-column flex-x-between">
							<view class="title">{{item.name}}</view>
							<view class="bottom dis-flex flex-y-center">
								<view class="time flex-box">
									<text v-if="item.expire_type == 10">领取{{ item.expire_day }}天内有效</text>
									<text v-if="item.expire_type == 20">{{ item.start_time.text }}~{{ item.end_time.text }}</text>
								</view>
								<view class="receive" v-if="item.state.value" @click="receive" :data-coupon-id="item.coupon_id">
									<text>立即领取</text>
								</view>
								<view class="receive state" v-else>
									<text>{{item.state.text}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else-if="notcont">
				<view class="yoshop-notcont">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">亲，暂无{{appCoupon.coupon_title}}哦</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	export default {
		data() {
			return {
				// 优惠券列表
				list: [],

				// show
				notcont: false
			};
		},
		components: {

		},
		computed: {

		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			// 当前页面参数
			this.options = options;
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			// 获取优惠券列表
			this.getCouponList();
		},
		mounted() {

		},
		methods: {
			/**
			 * 获取优惠券列表
			 */
			getCouponList() {
				let _this = this;
				App._get('coupon/lists', {}, function(result) {
					_this.setData({
						list: result.data.list,
						notcont: !result.data.list.length
					});
				});
			},

			/**
			 * 立即领取
			 */
			async receive(e) {
				let _this = this,
					couponId = e.currentTarget.dataset.couponId;
				let location = {}
				if([1,2].includes(e.currentTarget.dataset.area_restrictions)) {
					location = await App.getLocation() || {}
				}
				App._post_form('user.coupon/receive', {
					coupon_id: couponId,
					lat: location.latitude || '',
					lng: location.longitude || ''
				}, function(result) {
					App.showSuccess(result.msg);
					// 获取优惠券列表
					_this.getCouponList();
				});
			},
		}
	}
</script>

<style>
	.container,
	page {
		background: #fff;
	}

	.coupon-list {
		padding: 20upx;
	}

	.coupon-list .coupon-item {
		position: relative;
		overflow: hidden;
		margin-bottom: 22upx;
	}

	.coupon-list .coupon-item .item-wrapper {
		width: 100%;
		display: flex;
		background: #fff;
		border-radius: 8upx;
		color: #fff;
		height: 180upx;
	}

	.coupon-list .coupon-item .item-wrapper .coupon-type {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 10;
		width: 128upx;
		padding: 3px 0;
		background: #a771ff;
		font-size: 20upx;
		text-align: center;
		color: #ffffff;
		transform: rotate(45deg);
		transform-origin: 64upx 64upx;
	}

	.coupon-list .coupon-item .item-wrapper.color__blue {
		background: linear-gradient(-125deg, #57bdbf, #2f9de2);
	}

	.coupon-list .coupon-item .item-wrapper.color__red {
		background: linear-gradient(-128deg, #ff6d6d, #ff3636);
	}

	.coupon-list .coupon-item .item-wrapper.color__violet {
		background: linear-gradient(-113deg, #ef86ff, #b66ff5);
	}

	.coupon-list .coupon-item .item-wrapper.color__violet .coupon-type {
		background: #55b5ff;
	}

	.coupon-list .coupon-item .item-wrapper.color__yellow {
		background: linear-gradient(-141deg, #f7d059, #fdb054);
	}

	.coupon-list .coupon-item .item-wrapper.color__gray {
		background: linear-gradient(-113deg, #bdbdbd, #a2a1a2);
	}

	.coupon-list .coupon-item .item-wrapper.color__gray .coupon-type {
		background: #9e9e9e;
	}

	.coupon-list .coupon-item .item-wrapper .content {
		flex: 1;
		padding: 30upx 20upx;
		border-radius: 8px 0 0 8px;
		background-color: #666666;
	}

	.coupon-list .coupon-item .item-wrapper .content .title {
		font-size: 38upx;
	}

	.coupon-list .coupon-item .item-wrapper .content .bottom .time {
		font-size: 24upx;
	}

	.coupon-list .coupon-item .item-wrapper .content .bottom .receive {
		height: 46upx;
		width: 122upx;
		line-height: 46upx;
		text-align: center;
		border: 1px solid #fff;
		border-radius: 30upx;
		color: #fff;
		font-size: 24upx;
	}

	.coupon-list .coupon-item .item-wrapper .content .bottom .receive.state {
		border: none;
	}

	.coupon-list .coupon-item .item-wrapper .tip {
		position: relative;
		flex: 0 0 32%;
		text-align: center;
		border-radius: 0 8px 8px 0;
		background-color: #666666
	}

	.coupon-list .coupon-item .item-wrapper .tip .money {
		font-weight: bold;
		font-size: 52upx;
	}

	.coupon-list .coupon-item .item-wrapper .tip .pay-line {
		font-size: 22upx;
	}

	.coupon-list .coupon-item .item-wrapper .split-line {
		position: relative;
		flex: 0 0 0;
		border-left: 4upx solid #fff;
		margin: 0 5px 0 3px;
		background: #fff;
	}

	.coupon-list .coupon-item .item-wrapper .split-line:before,
	.coupon-list .coupon-item .item-wrapper .split-line:after {
		content: '';
		position: absolute;
		width: 12px;
		height: 6px;
		background: #f7f7f7;
		left: -7px;
		z-index: 1;
	}

	.coupon-list .coupon-item .item-wrapper .split-line:before {
		border-radius: 0 0 8px 8px;
		top: 0;
	}

	.coupon-list .coupon-item .item-wrapper .split-line:after {
		border-radius: 8px 8px 0 0;
		bottom: 0;
	}
</style>
