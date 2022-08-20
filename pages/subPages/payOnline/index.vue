<template>
	<view class="page-payOnline app-clearfix">
		<!-- 金额 -->
		<view class="payOnline-card">
			<view class="payOnline-business">
				<image class="payOnline-business__logo" :src="detailsRes.business_logo" mode="aspectFill"></image>
				<view class="payOnline-business__name">{{detailsRes.business_name}}</view>
				<button class="btn-normal payOnline-business__btn-view" @click="handleBtnViewBusinessesClick">查看商家</button>
			</view>
			<view class="payOnline-text is-small">金额</view>
			<view class="payOnline-input-row">
				<view class="payOnline-input-row__label is-strong">
					¥
				</view>
				<input class="payOnline-input-row__input is-strong" v-model="amount" type="digit" placeholder="请输入支付金额"
					placeholder-class="input-placeholder" />
			</view>
			<view class="payOnline-input-row">
				<view class="payOnline-input-row__label">
					不参与优惠金额
				</view>
				<input class="payOnline-input-row__input" v-model="noDiscountAmount" type="digit"
					placeholder="询问服务员后输入(如酒水)" placeholder-class="input-placeholder" />
			</view>
		</view>
		<!-- 金额 -->
		<!-- 优惠信息 -->
		<view class="payOnline-card">
			<view class="payOnline-input-row">
				<view class="payOnline-input-row__label">
					优惠券
				</view>
				<input class="payOnline-input-row__input is-normal" disabled :placeholder="cData.couponPlaceholder" :value="cData.couponText"
					placeholder-class="input-placeholder is-red"  @click="handleCouponInputClick" />
				<view v-if="detailsRes.coupon && detailsRes.coupon.length > 0" class="iconfont icon-jinrujiantou payOnline-text is-gray"></view>
			</view>
			<view class="payOnline-input-row">
				<view class="payOnline-input-row__label" style="display: flex;align-items: center;">
					积分抵扣<view style="margin-left: 10rpx;">
						<u-switch v-model="integralChecked" active-color="#FFD940" :size="48"></u-switch>
					</view>
				</view>
				<input class="payOnline-input-row__input" disabled :placeholder="`最多抵扣¥${priceRes.integral_deduct || 0}`"
					placeholder-class="input-placeholder is-black" />
			</view>
			<view class="payOnline-input-row has-border">
				<view class="payOnline-input-row__label">
					会员优惠
				</view>
				<input class="payOnline-input-row__input" disabled type="text" placeholder="无" :value="`-¥${priceRes.vip_deduct || 0}`"
					placeholder-class="input-placeholder" />
			</view>
			<view class="payOnline-total-price"><text class="is-sup">¥</text><text>{{cPayPrice}}</text></view>
			<view class="p-r">
				<button class="btn-normal payOnline-btn-go" :class="{'is-disabled': cBtnBuyDisabled}"
					:disabled="cBtnBuyDisabled" @click="handleBtnConfirmClick">立即买单</button>
				<bind-mobile-button v-if="detailsRes.is_mandatory_phone == 1&&!mainMixin_userInfo.mobile"></bind-mobile-button>
			</view>
			
			<view class="payOnline-tip" @click="billDescPopupVisible = true">
				买单说明<view class="iconfont is-inline icon-jinrujiantou" style="font-size: 24rpx;"></view>
			</view>
		</view>
		<!-- 优惠信息 end -->
		<!-- 支付提示 -->
		<view class="payOnline-tip">
			<view class="iconfont is-inline icon-tishi m-right12"></view>买单仅限于到店支付，请确认金额后提交
		</view>
		<!-- 支付提示 end -->
		<!-- 买单说明弹窗 -->
		<billDescPopup v-model="billDescPopupVisible" :text="detailsRes.explain"></billDescPopup>
		<!-- 买单说明弹窗 end -->
		<!-- 优惠券选择的弹窗 -->
		<popup-view :show="couponPopupVisible" type="bottom" @clickmask="couponPopupVisible = false">
			<view class="coupon-popup-card app-after--safe-bottom">
				<view class="coupon-popup-card__header">选择优惠券</view>
				<view class="coupon-popup-card__content__scroll">
					<scroll-view scroll-y="true" class="coupon-popup-card__content__scroll">
						<view>
							<coupon-sheet ref="couponSheet" :coupon-list="detailsRes.coupon" showType="coupon" coupontype="is_use" @radioChange="handleCouponChange" :iscoupon-checked="1" />
						</view>
					</scroll-view>
				</view>
				<button class="btn-normal coupon-popup-card__btn-confirm" @click="handleBtnDelCouponClick">不使用优惠券</button>
				<view class="coupon-popup-card__btn-close iconfont icon-searchclose" @click="couponPopupVisible = false"></view>
			</view>
		</popup-view>
		<!-- 优惠券选择的弹窗 end -->
		<!-- 订单支付组件 -->
		<order-pay ref="orderPay" @paySuccess="paySuccess" @payFail="payFail" />
		<!-- 订单支付组件 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import OrderPay from '@/components/template/OrderPayPopups.vue'
	import billDescPopup from './components/billDescPopup.vue'
	import PopupView from '@/components/template/PopManager.vue'
	import CouponSheet from '@/components/template/CouponSheet.vue'
	import BindMobileButton from '@/components/template/BindMobileButton.vue'
	export default {
		components: {
			OrderPay,
			billDescPopup,
			PopupView,
			CouponSheet,
			BindMobileButton
		},
		data() {
			return {
				options: {
					// 详情的id
					id: ''
				},
				// 详情的接口数据
				detailsRes: {},
				// 算价的接口数据
				priceRes: {},
				// 当前输入金额
				amount: '',
				// 不可优惠金额
				noDiscountAmount: '',
				// 当前选中的优惠券id
				couponActiveItem: {},
				// 是否开启积分抵扣
				integralChecked: false,
				// 买单说明弹窗是否显示
				billDescPopupVisible: false,
				// 优惠券组件是否显示
				couponPopupVisible: false
			}
		},
		computed: {
			// 不参与优势金额 是否比要买单金额大
			noDiscountAmountGtAmount() {
				return +this.noDiscountAmount > +this.amount
			},
			// 支付、算价的参数
			cPayParams() {
				return {
					// 金额
					amount: this.amount,
					// 不可优惠金额
					no_discount_amount: this.noDiscountAmount,
					// 商户在线买单设置id
					pay_online_business_id: this.options.id,
					// 商户id
					business_id: this.detailsRes.business_id,
					// 优惠券id
					coupon_id: this.couponActiveItem.coupon_id,
					// 是否使用积分
					use_integral: this.integralChecked ? 1 : 0,
				}
			},
			// 算价的trigger
			cFetchPriceResTrigger() {
				return JSON.stringify(this.cPayParams)
			},
			// 当前显示的最终支付价格
			cPayPrice() {
				const price = +this.priceRes.payment_amount || 0
				return price.toFixed(2)
			},
			// 当前买单按钮是否disabled
			cBtnBuyDisabled() {
				return +this.cPayPrice <= 0
			},
			// 格式化的一些信息
			cData() {
				// 优惠券信息placeholder
				let couponPlaceholder = ''
				// 优惠券信息text
				let couponText = ''
				if(this.couponActiveItem.coupon_id) {
					couponPlaceholder = this.couponActiveItem.name
				} else if(this.detailsRes.coupon && this.detailsRes.coupon.length > 0) {
					couponPlaceholder = `${this.detailsRes.coupon.length}张可用`
				}else {
					couponText = '暂无可用'
				}
				return {
					couponPlaceholder,
					couponText
				}
			}
		},
		watch: {
			// 当算价trigger改变时进行算价
			cFetchPriceResTrigger() {
				this.fetchPriceResThrottle()
			},
			noDiscountAmountGtAmount(val) {
				if(val) {
					this.$nextTick(()=>{
						this.noDiscountAmount = ''
					})
				}
			},
		},
		created() {
			this.fetchPriceResThrottle = this.$util.throttle(() => {
				this.fetchPriceRes()
			}, 500, {
				leading: true,
				trailing: true
			})
		},
		onLoad(options) {
			this.options = options
			if (options.scene) {
				const queryData = this.$util.scene_decode(options.scene) || {}
				this.options = {
					id: queryData.a,
					...this.options
				}
			}
		},
		async onShow() {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff",
			});
			try {
				await this.mainMixin_BeforeFetchPageData()
				// 请求接口的详情数据
				await this.fetchDetailsRes()
				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
			}
		},
		methods: {
			// 查看商家按钮点击事件
			handleBtnViewBusinessesClick() {
				App.navigationTo({
				    url: `pages/subPages/store/list?bus_id=${this.detailsRes.business_id}`
				})
			},
			// 不使用优惠券按钮点击事件
			handleBtnDelCouponClick() {
			    this.$refs.couponSheet.currentindex = -1
			    this.couponActiveItem = {}
			    this.couponPopupVisible = false
			},
			// 优惠券选择改变事件
			handleCouponChange(coupon = {}) {
			    console.log('handleCouponChange', coupon)
			    this.couponActiveItem = coupon
			    this.couponPopupVisible = false
			},
			// 优惠券输入框点击事件
			handleCouponInputClick() {
				if(this.detailsRes.coupon && this.detailsRes.coupon.length) {
					console.log('handleCouponInputClick')
					this.couponPopupVisible = true
				}
			},
			// 提交订单按钮点击事件
			async handleBtnConfirmClick() {
				if(this.detailsRes.is_mandatory_phone == 1&&!this.mainMixin_userInfo.mobile) {
					return
				}
				if (this.paying) {
					return
				}
				this.paying = true
				try {
					this.payOrder({
						...this.cPayParams,
						pay_from: 'payOnline'
					})
				} catch (e) {
					console.log('handleBtnConfirmClick', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 拉起支付
			payOrder(data = {}) {
				console.log('payOrder', data)
				this.$store.commit('orderPay', data)
				this.$refs.orderPay.onToggleList(() => {
					this.paying = false
				})
			},
			// 支付成功
			paySuccess() {
				console.log('paySuccess')
				this.paying = false
				uni.showModal({
					title: '提示成功',
					content: '买单成功'
				})
				this.amount = ''
				this.noDiscountAmount = ''
				this.couponActiveItem = {}
				this.integralChecked = false
				this.billDescPopupVisible = false
				this.fetchDetailsRes()
			},
			// 支付失败
			payFail() {
				console.log('payFail')
				this.paying = false
			},
			// 请求算价的接口数据
			async fetchPriceRes() {
				// 参数校验
				if(this.cNoDiscountAmountGtAmount) {
					return
				}
				try {
					const res = await App._postP('payonline.PayOnline/calculatedAmount', this.cPayParams)
					this.priceRes = this.$util.deepGet(res, 'data', {})
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._postP('payonline.PayOnline/payInfo', {
						id: this.options.id
					})
					this.detailsRes = this.$util.deepGet(res, 'data', {})
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.payOnline-business {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
	}
	.payOnline-business__logo {
		width: 42rpx;
		height: 42rpx;
		border-radius: 50%;
		border: 1px solid #707070;
	}
	.payOnline-business__name {
		font-size: 28rpx;
		color: #333333;
		margin-left: 20rpx;
	}
	.payOnline-business__btn-view {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx 10rpx;
		margin-left: 20rpx;
		background-color: #FFD940;
		border-radius: 10rpx;
		color: #333;
		font-size: 24rpx;
	}
	.page-activationCode {
		box-sizing: border-box;
		min-height: 100vh;
	}

	.payOnline-card {
		box-sizing: border-box;
		width: 690rpx;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
	}

	.payOnline-text {
		color: #333;
		font-size: 28rpx;

		&.is-small {
			font-size: 24rpx;
		}

		&.is-gray {
			color: #999;
		}
	}

	.payOnline-input-row {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;

		&:not(:last-child) {
			border-bottom: 1px solid #EEEEEE;
			margin-bottom: 20rpx;
		}

		&.has-border {
			border-bottom: 1px solid #EEEEEE;
		}
	}

	.payOnline-input-row__label {
		width: 260rpx;
		color: #333;
		font-size: 28rpx;

		&.is-strong {
			font-size: 60rpx;
			font-weight: bold;
		}
	}

	.payOnline-input-row__input {
		flex: 1;
		color: #333;
		font-size: 28rpx;
		font-weight: bold;
		text-align: right;
		height: 1em;

		&.is-strong {
			font-size: 40px;

		}
		
		&.is-normal {
			font-weight: normal;
		}

		/deep/ {
			&.input-placeholder {
				color: #999999;
				font-weight: normal;
				font-size: 28rpx;

				&.is-red {
					color: #FF4444;
				}

				&.is-black {
					color: #333;
				}
			}
		}
	}

	.payOnline-total-price {
		color: #333;
		font-weight: bold;
		font-size: 76rpx;
		text-align: center;
		margin: 40rpx 0;

		.is-sup {
			position: relative;
			left: -10rpx;
			top: -10rpx;
			font-weight: normal;
			font-size: 32rpx;
			vertical-align: super;
		}
	}

	.payOnline-btn-go {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630rpx;
		height: 90rpx;
		margin: 20rpx auto;
		background-color: #FFD940;
		border-radius: 20rpx;
		color: #333;
		font-weight: bold;
		font-size: 32rpx;

		&.is-disabled {
			background-color: #eee;
		}

	}

	.payOnline-tip {
		color: #999;
		font-size: 28rpx;
		text-align: center;
	}
	// 优惠券详情弹窗
	.coupon-popup-card {
		box-sizing: border-box;
		position: relative;
		width: 100vw;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
	}
	
	.coupon-popup-card__header {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 120rpx;
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
	}
	
	.coupon-popup-card__btn-close {
		position: absolute;
		top: 24rpx;
		right: 33rpx;
		color: #333;
		font-size: 36rpx;
	}
	
	.coupon-popup-card__content__scroll {
		height: 60vh;
		background-color: #F0F0F0;
	}
	
	.coupon-popup-card__btn-confirm {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 110rpx;
		font-weight: bold;
		font-size: 32rpx;
		color: #fff;
		background-color: #FFD940;
	}
	
	// 优惠券详情弹窗
</style>
