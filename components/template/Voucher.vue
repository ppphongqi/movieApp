<template>
	<popup-view :show="showVoucher" type="center" @clickmask="closeVoucher">
		<view class="voucher-info padding-box">
			<view class="close-btn" @click="closeVoucher"><text class="iconfont icon-roundclose"></text></view>
			<view class="info-list-box" :style="{'background-image':getImageRoot('46.png','url')}">
				<!-- <view class="info-rule">活动规则</view> -->
				<view class="info-title">送你{{couponList[0] && couponList[0].voucher_coupon_term == 3 ?"收藏":couponList[0] && couponList[0].voucher_coupon_term == 4?"关注":"进店"}}礼包</view>
				<view class="prize-coupon">
					<block v-for="item in couponList" :key="item.voucher_coupon_id">
						<view class="coupon-item dis-flex flex-y-center p-r" style="margin-bottom: 20upx;">
							<view class="discount dis-flex column flex-y-center flex-x-center">
								<view class="values-num onelist-hidden" style="width: 150upx;text-align: center;" v-if="item.coupon_type!=20"><text
									 class="icon-values">{{settingData.currency}}</text>{{item.reduce_price}}</view>
								<view class="values-num" v-if="item.coupon_type==20">{{item.discount}}折</view>
								<text class="onelist-hidden" style="width: 140upx;text-align: center;">{{item.rule == 1 ? '无限制' : '满' + item.rule_min_money + '元'}}</text>
							</view>
							<view class="bor-line"></view>
							<view class="info dis-flex column flex-y-center flex-x-center">
								<text v-if="item.coupon_type==20" class="values-num">{{item.discount}}折券</text>
								<text v-if="item.coupon_type!=20" class="values-num">{{item.reduce_price}}元{{appCoupon.coupon_title}}</text>
								<view class="onelist-hidden" style="width: 330upx;"><text class="iconfont icon-dengdai"></text><text>{{expire_type(item)}}</text></view>
							</view>
						</view>
					</block>
				</view>
				<view class="more-coupon" v-if="isMore">
					<view class="more-tip"></view>
					<view class="more-help">购买消费后再送</view>
					<view class="coupon-item-box">
						<block v-for="item in couponMoreList" :key="item.voucher_coupon_id">
							<view class="coupon-item unaccalimed more dis-flex flex-y-center p-r">
								<view class="discount dis-flex column flex-y-center flex-x-between">
									<view class="values-num onelist-hidden" style="width: 150upx;text-align: center;" v-if="item.coupon_type!=20"><text
										 class="icon-values">{{settingData.currency}}</text>{{item.reduce_price}}</view>
									<view class="values-num" v-if="item.coupon_type==20">{{item.discount}}折</view>
									<text class="onelist-hidden" style="width: 140upx;text-align: center;">{{item.rule == 1 ? '无限制' : '满' + item.rule_min_money + '元'}}</text>
								</view>
								<view class="bor-line"></view>
								<view class="info dis-flex column flex-y-center flex-x-between">
									<text v-if="item.coupon_type==20" class="values-num">{{item.discount}}折券</text>
									<text v-if="item.coupon_type!=20" class="values-num">{{item.reduce_price}}元{{appCoupon.coupon_title}}</text>
									<view class="onelist-hidden" style="width: 330upx;"><text class="iconfont icon-dengdai"></text><text>{{expire_type(item)}}</text></view>
								</view>
							</view>
						</block>
						<!-- <view class="coupon-item unaccalimed more dis-flex flex-y-center flex-x-between">
							<view class="discount dis-flex column flex-y-center flex-x-between">
								<view class="bor-line"></view>
								<view class="values-num"><text class="icon-values">{{settingData.currency}}</text>1折</view>
								<text>无限制</text>
							</view>
							<view class="info dis-flex column flex-y-center flex-x-between">
								<text class="values-num">1折券</text>
								<view><text class="iconfont icon-dengdai"></text><text>领到券当日开始7天内有效</text></view>
							</view>
						</view> -->
					</view>
				</view>
				<view class="use-btn" @click="toCouponList">立即查看</view>
			</view>
		</view>
	</popup-view>
</template>

<script>
	import App from "@/common/js/app.js"
	import PopupView from "@/components/template/PopManager.vue"
	export default {
		data() {
			return {
				showVoucher: false,
				couponList: [],
				couponMoreList: []
			}
		},
		props: {
			config: {
				type: Object,
				required: false,
				default: function() {
					return {}
				}
			}
		},
		components: {
			PopupView
		},
		computed: {
			isMore() {
				return this.couponMoreList.length > 0
			},
			expire_type() {
				return function(item) {
					const {
						expire_type,
						start_time,
						end_time,
						expire_day
					} = item;
					let scopeTime = '';
					switch (expire_type) {
						case 10:
							//时间段
							scopeTime = `${start_time}-${end_time}`;
							break;
						case 20:
							//当日可用
							scopeTime = `领取后当日可用`;
							break;
						case 30:
							//次日起可用
							scopeTime = `领取后次日起${expire_day || ''}天内可用`;
							break;
					}
					console.log(expire_type, start_time, end_time, expire_day)
					return scopeTime;
				}
			}
		},
		onLoad(e) {

		},
		mounted() {

		},
		methods: {
			closeVoucher() {
				this.showVoucher = false;
				this.$emit("closeEvt", "show");
			},
			toCouponList() {
				// #ifdef MP-WEIXIN
					let globalState = this.$store.state
					if( !globalState.token || !globalState.userInfo.user_id ){
						App.doLogin()
						return false
					}
				// #endif
				console.log('pages/subPages/couponCenter/myList跳转至优惠券页面')
				App.navigationTo({
					url: "pages/subPages/couponCenter/myList"
				})
			}
		},
		onPullDownRefresh() {

		}
	}
</script>

<style lang="scss" scoped>
	$more-bg:#DD5805;
	$dot-bg:rgb(252, 110, 9);

	@mixin dit($width:null, $height:null, $right:null, $top:null, $bottom: null, $rotate:null, $bg:null) {
		&:before {
			content: "";
			width: $width;
			height: $height;
			position: absolute;
			z-index: 9;
			border-radius: 50%;
			background-color: $bg;
			top: $top;

			@if($rotate=='right') {
				right: $right;
			}

			@if($rotate=='left') {
				left: $right;
			}

			border-color: transparent;
		}

		&:after {
			content: "";
			width: $width;
			height: $height;
			position: absolute;
			z-index: 9;
			-webkit-border-radius: 50%;
			border-radius: 50%;
			background-color: $bg;
			bottom: $bottom;

			@if($rotate=='right') {
				right: $right;
			}

			@if($rotate=='left') {
				left: $right;
			}

			border-color: transparent;
		}
	}

	.voucher-info {
		$bg: #ffffff;
		$w: 12px;
		$row: -12upx;
		$h: 150upx;
		$pad: 30upx 40upx;
		position: relative;
		width: 90vw;

		.column {
			flex-direction: column;
		}

		.prize-coupon {
			.coupon-item {
				@include dit($w, $w, 170upx, $row, $row, 'left', $dot-bg);
			}
		}

		.coupon-item {
			background: $bg;
			border-radius: 12upx;
			overflow: hidden;

			.discount {
				// height: $h;
				width: 180upx;
				box-sizing: border-box;
				// padding: $pad;
				font-size: 24upx;
				color: #999999;
				overflow: hidden;
				position: relative;
				white-space: nowrap;
				border-radius: 10upx 0 0 10upx;

				.values-num {
					line-height: 48upx;
					font-size: 36upx;
					color: #F54343;

					.icon-values {
						zoom: .5;
					}
				}
			}

			.bor-line {
				position: absolute;
				left: 180upx;
				top: 0;
				bottom: 0;
				width: 0;
				border-right: 2upx dashed $dot-bg;
			}

			.info {
				// height: $h;
				font-size: 24upx;
				box-sizing: border-box;
				// padding: $pad;
				color: #999999;
				// overflow: hidden;
				position: relative;
				white-space: nowrap;
				border-radius: 0 10upx 10upx 0;
				padding-left: 30upx;
				// @include dit($w, $w, $row, $row, $row, 'left', $dot-bg);

				.values-num {
					line-height: 48upx;
					text-align: left;
					font-size: 28upx;
					width: 100%;
					color: #333333;
				}

				.iconfont {
					margin-right: 10upx;
					font-size: 24upx;
				}
			}

			&.unaccalimed {
				.discount {
					.values-num {
						color: #999999;
					}
				}

				.info {
					.values-num {
						color: #999999;
					}
				}
			}

			&.more {
				padding: 12px 0 10px;
				margin-bottom: 20upx;
				@include dit($w, $w, 170upx, $row, $row, 'left', $more-bg);

				.discount {
					.bor-line {
						border-right: 1upx dashed $more-bg;
					}

					// @include dit($w, $w, 170upx, $row, $row, 'left', $more-bg);
				}
			}
		}

		.close-btn {
			position: absolute;
			right: 10upx;
			top: -60upx;
			color: #ffffff;

			.iconfont {
				font-size: 56upx;
			}
		}

		.info-list-box {
			background-size: 100% auto;
			background-repeat: no-repeat;
			padding: 56px 0 15px;
			border-radius: 8px;
			background-position: 0 0;
			margin-top: -70upx;

			.info-rule {
				margin-right: 15px;
				float: right;
				width: 55px;
				height: 20px;
				line-height: 20px;
				text-align: center;
				font-size: 10px;
				color: #fff;
				background: rgba(75, 79, 83, 0.3);
				border-radius: 0 0 4px 4px;
			}

			.info-title {
				font-size: 46upx;
				color: #ffffff;
				text-align: center;
				margin: 40upx 0 24upx;
				letter-spacing: 4upx;
			}

			.prize-coupon {
				height: 140upx;
				overflow-y: auto;
				overflow-x: hidden;
				padding: 0 30upx;
				margin: 24upx 0 30upx;

				.coupon-item {
					padding: 24upx 0 20upx;
					overflow: hidden;
				}
			}

			.more-coupon {
				position: relative;
				margin: 0 16upx;

				.more-tip {
					position: absolute;
					top: -1.2em;
					left: 50%;
					transform: translateX(calc(-50% + 4upx)) skewX(-45deg);
					font-size: 12px;
					width: 56%;
					background: rgb(252, 110, 9);
					height: 1.4em;
					border-left: 12upx solid;
					border-right: 12upx solid;
					border-color: #DD5805;

					.skew-line {
						position: absolute;
						height: 44upx;
						width: 14upx;
						background: $more-bg;
						top: 0;

						&.left {
							left: -30upx;
						}

						&.right {
							right: -30upx;
						}
					}
				}

				.more-help {
					position: absolute;
					top: -1.2em;
					white-space: nowrap;
					left: 50%;
					transform: translateX(-50%);
					font-size: 24upx;
					width: 52%;
					text-align: center;
					height: 1.6em;
					line-height: 1.6em;
					color: #ffffff;
				}

				.more-help::after {
					content: '';
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					z-index: -1;
					background: rgba(51, 51, 51, 1);
					transform: skewX(-45deg);
				}

				.coupon-item-box {
					height: 150upx;
					overflow-x: hidden;
					overflow-y: auto;
					padding: 20upx 16upx;
					border-radius: 10upx;
					margin: 40upx 0 24upx;
					background: $more-bg;
				}
			}

			.use-btn {
				width: 85%;
				margin: 0 auto;
				height: 76upx;
				font-size: 28upx;
				line-height: 76upx;
				text-align: center;
				color: #FE6D0A;
				background: #FFD64A;
				box-shadow: 0 2upx 12upx 0 rgba(207, 17, 152, 0.35);
				border-radius: 38upx;
			}
		}
	}
</style>
