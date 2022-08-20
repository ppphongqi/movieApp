<!-- 领取优惠券 -->
<template>
	<view class="" :style="themeColor">
		<view class="page-container" :style="{'background-image':getImageRoot(isReceive?'55.png':'6.png','url')}">
			<view class="receive-container" v-if="!isReceive">
				<view class="confirm-hd p-r dis-flex flex-dir-column flex-y-center flex-x-center">
					<view class="confirm-rule f-24" @click="isShowRule = true">规则</view>
					<view class="confirm-name f-32 col-3 f-w">{{counpondetail.name}}</view>
					<view class="confirm-price dis-flex col-m">
						<view class="f-22 m-top10" style="margin-right:4rpx" v-if="counpondetail.coupon_type!==20">{{settingData.currency}}</view>
						<view style="font-size: 70rpx;">{{counpondetail.coupon_type===40?`${counpondetail.min}~${counpondetail.max}`:counpondetail[counpondetail.coupon_type===20?"discount":"reduce_price"]}}</view>
						<view class="f-22 m-top10" v-if="counpondetail.coupon_type===20" style="margin-left:4rpx">折</view>
					</view>
				</view>
				<view class="comfirm-tips dis-flex flex-x-center flex-y-around col-9 f-24 p-r">
					<view class="tips-circle circle-left"></view>
					<view class="tips-circle circle-right"></view>
					<view class="dis-flex flex-x-center flex-y-around col-9 f-24 tips-text p-f">
						<view class="item-tip">· {{counponRuleText}}</view>
						<view v-if="counpondetail.expire_type==10" class="item-tip">有效期:{{counpondetail.start_time}}-{{counpondetail.end_time}}</view>
						<view v-else-if="counpondetail.expire_type==20" class="item-tip">领取后当日可用</view>
						<view v-else-if="counpondetail.expire_type==30" class="item-tip">领取后次日起{{counpondetail.expire_day}}天内可用</view>
						<view v-else-if="counpondetail.expire_type==40" class="item-tip">领取后当日起{{counpondetail.expire_day}}天内可用</view>
					</view>
				</view>
				<view class="receive-btn-box b-f">
					<button class="receive-btn f-28 col-f" @click="receive">立即领取</button>
				</view>
			</view>
			<view class="confirm-receive t-c col-m p-r" v-if="isReceive">
				<view class="receive-rule f-24 col-f" @click="isShowRule = true">规则</view>
				<view class="coupon-title f-32">{{receiveData.name}}</view>
				<view class="dis-flex flex-x-center m-top16">
					<view class="f-22 m-top10" style="margin-right:4rpx" v-if="counpondetail.coupon_type!==20">{{settingData.currency}}</view>
					<view style="font-size: 70rpx;">{{receiveData.discount}}</view>
					<view class="f-22 m-top10" v-if="counpondetail.coupon_type===20" style="margin-left:4rpx">折</view>
				</view>
				<view class="f-28 m-top-btm20">{{counponRuleText}}</view>
				<view class="f-28">有效期:{{counpondetail.expire_type===20?receiveData.start_time:(receiveData.start_time+'-'+receiveData.end_time)}}</view>
				<view class="coupon-btn f-30 col-f" @click="couponUse">立即使用</view>
			</view>
			<!-- 规则 -->
			<popup-view :show="isShowRule" type="center" @clickmask="isShowRule = false">
				<view class="confirm-rule-content t-c b-f">
					<view class="confirm-rule-title f-32 f-w col-f">使用规则</view>
					<text class="rule-info f-28">{{counpondetail.use_desc}}</text>
					<view class="iconfont icon-roundclose" @click="isShowRule = false"></view>
				</view>
			</popup-view>
			<!-- 领取成功 -->
			<popup-view :show="isShowPop" type="center" @clickmask="isShowPop = false">
				<view class="confirm-success t-c" :style="{'background-image':getImageRoot('54.png','url')}">
					<view class="pop-title">
						<view class="f-40 f-w">恭喜您!</view>
						<view class="f-28">领取成功</view>
					</view>
					<view class="pop-container">
						<view class="f-32">{{counpondetail.name}}</view>
						<view class="dis-flex flex-x-center m-top10">
							<view class="f-22 m-top10" style="margin-right:4rpx" v-if="counpondetail.coupon_type!==20">{{settingData.currency}}</view>
							<view style="font-size: 70rpx;">{{receiveData.discount}}</view>
							<view class="f-22 m-top10" v-if="counpondetail.coupon_type===20" style="margin-left:4rpx">折</view>
						</view>
						<view class="pop-btn f-28" @click="couponUse">立即使用</view>
					</view>
				</view>
			</popup-view>
			<view class="recommend-goods m-top20">
				<recommend-goods :activeId="activeId" :recommendclass="1" :isShowCopyRight="false" @onReady="appHideLoading"></recommend-goods>
			</view>
			<shortcut id=""></shortcut>
			<page-loading ref="loading"></page-loading>
		</view>
		<TabBar />
	</view>

</template>

<script>
	import shortcut from "@/components/template/ShortCut.vue"
	import PopupView from "@/components/template/PopManager.vue"
	import RecommendGoods from "@/components/template/RecommendGoods.vue"
	import TabBar from '@/components/template/TabBar'
	import App from "@/common/js/app.js"
	import pageShareMixin from "@/common/js/pageShareMixin.js"
	export default {
		mixins: [pageShareMixin],
		data() {
			return {
				coupon_id: null,
				bonus_id: "",
				isShowPop: false,
				isShowRule: false,
				isReceive: false,
				receiveData: {},
				counpondetail: {},
				activeId: null
			};
		},
		components: {
			RecommendGoods,
			shortcut,
			PopupView,
			TabBar
		},
		computed: {
			counponRuleText() {
				if (this.counpondetail.coupon_id) {
					let {
						coupon_type,
						discount,
						reduce_price,
						rule,
						rule_min_money,
						max_price,
						max_price_type
					} = this.counpondetail,
						counponRuleText = "";
					if (rule === 0) {
						counponRuleText = `满${this.$util.removePoint(rule_min_money)}`;
						if (coupon_type === 30) {
							counponRuleText += `立减${this.$util.removePoint(reduce_price)}元运费`;
						} else if (coupon_type === 20 && max_price_type === 1) {
							counponRuleText += `可使用,最多优惠${max_price}元`;
						} else {
							counponRuleText += "可使用";
						}
					} else {
						counponRuleText = `无门槛${this.appCoupon.coupon_title}`;
					}
					return counponRuleText;
				}
			}
		},
		watch: {
			counpondetail(val) {
				this.shareData = this.pageShareMixin_createShareData({
					title: this.$util.deepGet(val, 'name', ''),
					desc: this.$util.deepGet(val, 'custom_share_content', ''),
					imgUrl: this.$util.deepGet(val, 'share_image_id.0.file_path', ''),
					query: {
						coupon_id: this.$util.deepGet(val, 'coupon_id', '')
					}
				})
			}
		},
		beforeCreate() {

		},
		onLoad(options) {
			let options_coupon_id = options.scene ? this.$util.scene_decode(options.scene).coupon_id : (options.coupon_id || ""),
				bonus_id = options.bonus_id || "";
			this.coupon_id = options_coupon_id;
			this.bonus_id = bonus_id;
			this.activeId = {
				bonus_id,
				coupon_id: options_coupon_id
			}
			if (!!bonus_id) {
				uni.setNavigationBarTitle({
					title: "使用红包"
				})
			}
			this.getcounpondetail(options_coupon_id, bonus_id);
		},

		onShow() {

		},
		mounted() {},
		methods: {
			/**
			 * 获取优惠券信息
			 */
			getcounpondetail(id = "", bonus_id = "") {
				let _this = this;
				return new Promise((resolve, reject) => {
					App._get('coupon/details', {
						id,
						bonus_id
					}, (result) => {
						let data = result.data;
						if (!!bonus_id) {
							data.coupon_id = bonus_id;
							let receiveData = {
								start_time: _this.$util.formatTime(data.stime, 'date', '.'),
								end_time: _this.$util.formatTime(data.etime, 'date', '.'),
								discount: data.reduce_price
							}
							_this.receiveData = receiveData;
							_this.isReceive = true;
						} else {
							data['start_time'] = _this.$util.formatTime((data['start_time'] / 1000), 'date', '.');
							data['end_time'] = _this.$util.formatTime((data['end_time'] / 1000), 'date', '.');
							data['max_price'] = _this.$util.removePoint(data['max_price']);
						}
						_this.counpondetail = data;
						App.hideLoading();
					});
				})
			},
			/**
			 * 立即领取
			 */
			async receive(e) {
				let _this = this,
					counpondetail = _this.counpondetail;
				uni.showLoading()
				let location = {}
				if([1,2].includes(counpondetail.area_restrictions)) {
					location = await App.getLocation() || {}
				}
				App._post_form('user.coupon/receive', {
					coupon_id: _this.counpondetail.coupon_id,
					lat: location.latitude || '',
					lng: location.longitude || ''
				}, function(result) {
					console.log(result.data);
					let data = result.data,
						receiveData = {
							start_time: _this.$util.formatTime(data.stime, 'date', '.'),
							end_time: _this.$util.formatTime(data.etime, 'date', '.'),
							discount: counpondetail.coupon_type === 20 ? counpondetail.discount : counpondetail.coupon_type === 40 ? data.coupon_price :
								counpondetail.reduce_price
						}
					_this.receiveData = receiveData;
					_this.isShowPop = true;
					uni.hideLoading()
				});
			},
			/**
			 * 跳转店铺或者首页
			 */
			skip(e) {
				let isreceive = e.currentTarget.dataset.isreceive;
				if (isreceive) {
					App.navigationTo({
						url: 'pages/mainPages/index/index'
					})
				}
			},
			appHideLoading() {

			},
			couponUse() {
				if (this.isReceive) {
					uni.pageScrollTo({
						duration: 150,
						scrollTop: uni.upx2px(480)
					})
				} else {
					this.isShowPop = false;
					this.isReceive = true;
				}

			}
		},

	}
</script>

<style>
	.page-container {
		min-height: 100vh;
		padding: 50rpx 30rpx 30rpx;
		background-size: 100% 480rpx;
		background-repeat: no-repeat;
		box-sizing: border-box;
		background-color: #FFFFFF;
	}

	.receive-container {
		border-radius: 18upx;
		overflow: hidden;
		filter: drop-shadow(0px 0px 6rpx #ccc);
	}

	.confirm-receive {
		height: 360rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.receive-rule {
		position: absolute;
		top: -7%;
		right: 20%;
		background: #FE504F;
		width: 1.7em;
		padding: 10rpx 0 28rpx;
	}

	.receive-rule::after {
		content: "";
		position: absolute;
		left: 0;
		bottom: 0;
		border: 0.85em solid transparent;
		border-bottom-color: #FFF8F8;
	}

	.coupon-title {
		margin-top: 70rpx;
	}

	.coupon-btn {
		background: #FE504F;
		border-radius: 32px;
		width: 250rpx;
		height: 64rpx;
		line-height: 64rpx;
		margin: 30rpx auto 0;
	}

	.confirm-hd {
		background: #ffffff;
		padding-bottom: 30rpx;
	}

	.confirm-rule {
		position: absolute;
		top: 20rpx;
		right: 30rpx;
		color: #FE504F;
		border: 1rpx solid #FE504F;
		border-radius: 20px;
		padding: 6rpx 12rpx;
	}

	.confirm-name {
		margin: 40rpx 0 30rpx;
	}

	.confirm-hd image {
		width: 106upx;
		height: 106upx;
		display: block;
		margin-top: -53upx;
		border-radius: 50%;
		border: 8upx solid #ffffff;
	}

	.confirm-title {
		color: #7c0002;
		margin: 30upx 0;
	}

	.comfirm-tips {
		height: 64rpx;
		line-height: 64rpx;
	}

	.tips-circle {
		position: relative;
		z-index: 1;
		width: 50%;
		background-size: 100% 100%;
		background-repeat: repeat;
	}

	.tips-circle.circle-left {
		background: radial-gradient(circle at left, transparent 16rpx, #f5f5f5 0);
	}

	.tips-circle.circle-right {
		background: radial-gradient(circle at right, transparent 16rpx, #f5f5f5 0);
	}

	.tips-text {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
	}

	.item-tip {
		margin: 0 12rpx;
	}

	.receive-btn-box {
		padding: 50rpx 0;
	}

	.receive-btn {
		width: 270rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: #FD4143;
		border-radius: 50px;
	}

	.recommend-goods {
		border-radius: 18upx;
		overflow: hidden;
	}

	.module-title {
		border-radius: 18upx 18upx 0 0;
	}

	.couponLogo-imag image {
		width: 220upx;
		height: 210upx;
	}

	.new-module-content {
		padding: 60upx 30upx 80upx;
		background: #ffffff;
	}

	.confirm-rule-content {
		width: 560rpx;
		height: 568rpx;
		border-radius: 20rpx;
		position: relative;
	}

	.confirm-rule-content .iconfont {
		position: absolute;
		bottom: -2em;
		left: 50%;
		transform: translateX(-50%);
		color: #FFFFFF;
		font-size: 60rpx;
	}

	.confirm-rule-title {
		width: 560rpx;
		height: 94rpx;
		line-height: 94rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("~@/static/images/user/coupon-rule.png");
	}

	.rule-info {
		padding: 30rpx;
		width: 100%;
		display: inline-block;
		text-align: left;
		box-sizing: border-box;
	}

	.confirm-success {
		width: 511rpx;
		height: 552rpx;
		color: #FAD59B;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		padding-top: 30rpx;
	}

	.pop-container {
		margin-top: 120rpx;
	}

	.pop-btn {
		color: #B97914;
		width: 304rpx;
		height: 70rpx;
		line-height: 70rpx;
		margin: 50rpx auto 0;
		background: linear-gradient(0deg, rgba(250, 213, 155, 1), rgba(255, 203, 122, 1));
		box-shadow: 0px 2px 12px 0px rgba(185, 20, 121, 0.35);
		border-radius: 35px;
	}
</style>
