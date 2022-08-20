<template>
	<view class="page-phoneBill-index app-clearfix">
		<!-- banner -->
		<view class="banner-wrapper">
			<u-swiper :list="cBannerList" height="300" img-mode="scaleToFill"></u-swiper>
		</view>
		<!-- banner end -->
		<!-- 滚动通知 -->
		<view class="notice-wrapper">
			<u-icon name="volume"></u-icon>
			<view class="notice-wrapper__content">
				<u-notice-bar color="#FF4444" :volume-icon="false" :list="cNotice" type="none" padding="0 10rpx"></u-notice-bar>
			</view>
		</view>
		<!-- 滚动通知 end -->
		<!-- 充值类型 -->
		<view class="type-list">
			<view class="type-item" :class="{'is-active': typeActive === index}" v-for="(item,index) in cType" :key="item.id"
			 @click="handleTypeItemClick(item,index)">{{item.text}}</view>
		</view>
		<!-- 充值类型 end -->
		<!-- 手机号码输入 -->
		<view class="phoneBill-form">
			<view class="phoneBill-form__row">
				<input class="phoneBill-form__row__input" placeholder-class="is-placeholder" v-model="phone" type="number"
				 placeholder="请输入手机号码" maxlength="11" />
				<image class="phoneBill-form__row__icon" src="./static/images/icon-mail-list.png" mode="aspectFit"></image>
			</view>
			<!-- <view v-if="cTypeActiveItem.id == 2" class="phoneBill-form__tip">慢充为48小时后到账，请知晓。</view> -->
		</view>
		<!-- 手机号码输入 end -->
		<!-- 选择项 -->
		<view class="phoneBill-price-wrapper" :class="{'is-pt-large':cOpenMembershipVisible}">
			<!-- 充值金额列表 -->
			<view class="phoneBill-price-list">
				<view v-for="(item,index) in cPriceList" :key="item.id" class="phoneBill-price-item" @click="handlePriceItemClick(item,index)">
					<view class="phoneBill-price-card" :class="{'is-active': index === priceActive}">
						<view class="phoneBill-price-card__name">{{item.name}}</view>
						<view v-if="item.memberPrice" class="phoneBill-price-card__text">会员价：{{item.memberPrice}}</view>
						<view class="phoneBill-price-card__text">非会员价：{{item.price}}</view>
					</view>
				</view>
			</view>
			<!-- 充值金额列表 end -->
			<!-- 优惠券选择 -->
			<view class="phoneBill-coupon-cell">
				<view class="phoneBill-coupon-cell__left">
					<view class="phoneBill-coupon-cell__title">优惠券</view>
				</view>
				<view class="phoneBill-coupon-cell__center" @click="couponPopupVisible = true">
					<view class="phoneBill-coupon-cell__text">{{cCouponText}}</view>
				</view>
				<view class="phoneBill-coupon-cell__right" @click="couponPopupVisible = true">
					<view class="iconfont icon-right phoneBill-coupon-cell__icon"></view>
				</view>
			</view>
			<!-- 优惠券选择 end -->
			<!-- 开通会员标识 -->
			<image v-if="cOpenMembershipVisible" class="phoneBill-img-open-membership" src="./static/images/img-open-membership.png" @click="navigationTo('pages/subPages/member/index/index')"></image>
			<!-- 开通会员标识 end -->
		</view>
		<!-- 选择项 end -->
		<!-- 规则富文本 -->
		<view class="rules-wrapper">
			<!-- 必须这样才能在切换的时候正常渲染 -->
			<view v-show="cTypeActiveItem.id == 1">
				<parse :html="cFastRules" />
			</view>
			<view v-show="cTypeActiveItem.id == 2">
				<parse :html="cSlowRules" />
			</view>
		</view>
		<!-- 规则富文本 end -->
		<!-- footer -->
		<view class="page-phoneBill__footer app-wrapper--safe-fixed-bottom">
			<!-- 提交区域 -->
			<view class="confirm-wrapper">
				<view class="confirm-wrapper__left">
					<view class="confirm-wrapper__price">¥{{cCalculation.totalPrice}}</view>
					<button class="btn-normal confirm-wrapper__btn-details" @click="detailsPopupVisible = !detailsPopupVisible">
						明细
						<image class="confirm-wrapper__icon-details" :class="{'is-up': !detailsPopupVisible}" src="./static/images/icon-triangle-down-blue.png"
						 mode=""></image>
					</button>
				</view>
				<view class="confirm-wrapper__right">
					<button :loading="submitting" class="btn-normal confirm-wrapper__btn-confirm" @click="handleBtnConfirmClick">立即充值</button>
				</view>
			</view>
			<!-- 提交区域 end -->
			<!-- 分销金额 -->
			<view v-if="cCalculation.commissionVisible" class="page-phoneBill__commission" :style="{'background-image':getImageRoot('59.png', 'url')}"  @click="handleBtnPosterClick">
				<view class="page-phoneBill__content">
					<view class="page-phoneBill__text">{{dealerDiyFont.commission}}</view>
					<view class="page-phoneBill__text">返¥<text class="f-36">{{cCalculation.commissionMoney}}</text></view>
					<view class="page-phoneBill__text" style="margin-top: 20rpx;color: #fff;">{{dealerDiyFont.buy_commission}}</text></view>
				</view>
				<view class="page-phoneBill__commission__btn">点击分享</view>
			</view>
			<!-- 分销金额 end -->
			<!-- 海报按钮 -->
			<view v-if="cBtnPosterVisible" class="page-phoneBill__btn-nav" style="bottom: 350rpx;background: linear-gradient(-180deg, #FD7256 0%, #FF4841 100%);" @click="handleBtnPosterClick">
				<image class="page-phoneBill__btn-nav__img" src="./static/images/icon-poster.png" mode=""></image>
				<view class="page-phoneBill__btn-nav__text">海报</view>
			</view>
			<!-- 海报按钮 end -->
			<!-- 订单列表按钮 -->
			<view class="page-phoneBill__btn-nav" @click="navigationTo('pages/subPages/phoneBill/order')">
				<image class="page-phoneBill__btn-nav__img" src="./static/images/icon-rmb.png" mode=""></image>
				<view class="page-phoneBill__btn-nav__text">我的</view>
			</view>
			<!-- 订单列表按钮 end -->
		</view>
		<!-- footer end -->
		<!-- 结算详情的弹窗 -->
		<popup-view :show="detailsPopupVisible" type="bottom" @clickmask="detailsPopupVisible = false">
			<view class="details-popup-card app-after--safe-bottom">
				<view class="details-popup-card__header">支付明细</view>
				<view class="details-popup-card__content">
					<view class="details-popup-card__row">
						<view class="details-popup-card__row__left">支付明细</view>
						<view class="details-popup-card__row__right">¥{{cCalculation.originalPrice}}</view>
					</view>
					<view class="details-popup-card__row">
						<view class="details-popup-card__row__left">优惠</view>
						<view class="details-popup-card__row__right text-red">-¥{{cCalculation.discountPrice}}</view>
					</view>
				</view>
				<view class="details-popup-card__btn-close iconfont icon-searchclose" @click="detailsPopupVisible = false"></view>
			</view>
		</popup-view>
		<!-- 结算详情的弹窗 end -->
		<!-- 优惠券的弹窗 -->
		<popup-view :show="couponPopupVisible" type="bottom" @clickmask="couponPopupVisible = false">
			<view class="coupon-popup-card app-after--safe-bottom">
				<view class="coupon-popup-card__header">选择优惠券</view>
				<view class="coupon-popup-card__content__scroll">
					<scroll-view scroll-y="true" class="coupon-popup-card__content__scroll">
						<view>
							<coupon-sheet ref="couponSheet" :coupon-list="couponListRes" showType="coupon" coupontype="is_use" @radioChange="handleCouponChange" :iscoupon-checked="1" />
						</view>
					</scroll-view>
				</view>
				<button class="btn-normal coupon-popup-card__btn-confirm" @click="handleBtnDelCouponClick">不使用优惠券</button>
				<view class="coupon-popup-card__btn-close iconfont icon-searchclose" @click="couponPopupVisible = false"></view>
			</view>
		</popup-view>
		<!-- 优惠券的弹窗 end -->
		<!-- 订单支付组件 -->
		<order-pay ref="orderPay" @paySuccess="paySuccess" @payFail="payFail" @on-api-error="payFail" :paddingBottom="cPayPopupPaddingBottom" />
		<!-- 订单支付组件 end -->
		<page-loading ref="loading"></page-loading>
		<!-- 分享组件 -->
		<share-view ref="shareView" poster-type="phoneBill" :height="667" :width="375"></share-view>
		<!-- 分享组件 end -->
		<!-- 返回按钮 -->
		<!-- #ifdef H5 || MP-WEIXIN || MP-TOUTIAO -->
		<view class="diy-navigator">
			<view class="return-btn" @click="returnBtn">
				<view class="iconfont icon-fanhuijiantou"></view>
			</view>
		</view>
		<!-- #endif -->
		<!-- 返回按钮 end -->
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import Parse from '@/components/threeComponents/jyf-Parser/index'
import PopupView from '@/components/template/PopManager.vue'
import OrderPay from '@/components/template/OrderPayPopups.vue'
import pageShareMixin from '@/common/js/pageShareMixin.js'
import CouponSheet from '@/components/template/CouponSheet.vue'
import ShareView from '@/components/template/ShareView.vue'

export default {
    mixins: [pageShareMixin],
    components: {
        Parse,
        PopupView,
        OrderPay,
        CouponSheet,
        ShareView
    },
    data() {
        return {
			// 页面query
			options: {},
            // 用户详情接口数据
            userDetails: {},
            // 页面设置的接口数据
            pageRes: {},
            // 当前算价接口的数据
            calculationRes: {},
            // 当前可用优惠券的接口数据
            couponListRes: [],
            // 当前选中的优惠券数据
            couponActiveItem: {},
            // 当前充值类型激活项的索引
            typeActive: 0,
            // 当前输入的手机号
            phone: '',
            // 当前选中金额的索引
            priceActive: 0,
            // 结算明细弹窗是否显示
            detailsPopupVisible: false,
            // 优惠券弹窗是否显示
            couponPopupVisible: false,
            // 当前是否正在提交订单
            submitting: false
        }
    },
    computed: {
        // 是否显示海报按钮
        cBtnPosterVisible() {
            return this.$util.deepGet(this.pageRes, 'is_poster', '') == 1
        },
        // 是否显示开通会员标签
        cOpenMembershipVisible() {
            const isOpen = this.userDetails.member_Info && this.userDetails.member_Info.is_open == 1
            const hasVipPrice = this.cPriceList.find(item => item.memberPrice)
            return isOpen && hasVipPrice
        },
        // 当前选中的充值类型
        cTypeActiveItem() {
            return this.cType[this.typeActive] || {}
        },
        // 当前选中的话费规格
        cPriceActiveItem() {
            return this.cPriceList[this.priceActive] || {}
        },
        // banner的数据
        cBannerList() {
            let slide_image = this.pageRes.slide_image || []
            return slide_image.map(item => ({
                image: item
            }))
        },
        // 滚动通知的内容
        cNotice() {
            return [this.pageRes.notice_tip || '']
        },
        // 充值分类的数据
        cType() {
            const typeMap = {
                '1': {
                    id: '1',
                    text: '快充',
                    key: 'fast'
                },
                '2': {
                    id: '2',
                    text: '慢充',
                    key: 'slow'
                }
            }
            return (this.pageRes.recharge_type || []).map(item => typeMap[item])
        },
        // 充值金额列表数据
        cPriceList() {
            const key = this.cTypeActiveItem.key || ''
            const list = this.pageRes.face_values && this.pageRes.face_values[key] || []
            return list.map(item => ({
                _source: item,
                id: item.value,
                name: `${item.value}元`,
                price: item.price,
                memberPrice: +item.vip_is_open === 1 ? item.vip_price : ''
            })).filter(item => +item._source.is_open === 1)
        },
        // 慢充说明
        cSlowRules() {
            return this.pageRes.slow_tip || ''
        },
        // 快充说明
        cFastRules() {
            return this.pageRes.fast_tip || ''
        },
        // 当前算价参数
        cCalculationResOptions() {
            const amount = this.cPriceActiveItem.id
            const recharge_app = this.pageRes.recharge_app
            const coupon_id = this.couponActiveItem.coupon_id
            const recharge_type = this.cTypeActiveItem.id || ''
            return {
                amount,
                recharge_app,
                coupon_id,
                recharge_type
            }
        },
        // 格式化的当前算价结果
        cCalculation() {
            return {
                // 总价
                totalPrice: this.calculationRes.pay_price || '0.00',
                // 支付明细
                originalPrice: this.calculationRes.pay_price || '0.00',
                // 优惠
                discountPrice: (this.calculationRes.vip_coupon_money + this.calculationRes.coupon_price) || '0.00',
				// 是否显示分销
				commissionVisible: this.calculationRes.is_show_dealer,
				// 分销金额
				commissionMoney: this.calculationRes.dealer_money || '0'
            }
        },
        // 订单提交的参数
        cOrderDataSubmitted() {
			const amount = this.cPriceActiveItem.id || ''
            return {
                mobile: this.phone,
                amount,
				// 用于支付组件中判断余额是否充足
				actual_pay_price: this.cCalculation.totalPrice,
                coupon_id: this.cTypeActiveItem.coupon_id,
                recharge_app: this.pageRes.recharge_app || '',
                recharge_type: this.cTypeActiveItem.id || '',
                pay_from: 'payBill',
				referee_id: this.$store.state.refereeId,
            }
        },
        // 支付弹窗paddingBottom
        cPayPopupPaddingBottom() {
            return uni.upx2px(150) + 'px'
        },
        // 请求优惠券的trigger
        cFetchCouponListResTrigger() {
            return `${this.cOrderDataSubmitted.amount}-${this.cOrderDataSubmitted.recharge_app}`
        },
        // 优惠券选择文字
        cCouponText() {
            if (!this.couponActiveItem.coupon_id) {
                return '未选择优惠券'
            }
            return `-${this.couponActiveItem.reduce_price}元`
        }
    },
    watch: {
        // 当算价参数变化时 调用算价接口
        cCalculationResOptions: {
            handler(val) {
                this.debounceFetchCalculationRes && this.debounceFetchCalculationRes()
            },
            immediate: true
        },
        // 请求优惠券的trigger变化时 更新优惠券信息
        cFetchCouponListResTrigger: {
            handler(val) {
                this.debounceFetchCouponListRes && this.debounceFetchCouponListRes()
            },
            immediate: true
        },
        pageRes(val) {
            // 设置分享数据
            this.shareData = this.pageShareMixin_createShareData({
                imgUrl: this.$util.deepGet(val, 'share_image', ''),
                desc: this.$util.deepGet(val, 'share_describe', ''),
                title: this.$util.deepGet(val, 'share_title', '')
            })
        }
    },
    created() {
        // 节流的请求当前算价结果的方法
        this.debounceFetchCalculationRes = this.$util.throttle(() => {
            this.fetchCalculationRes()
        }, 500, {
            leading: false,
            trailing: true
        })
        // 节流的请求优惠券的方法
        this.debounceFetchCouponListRes = this.$util.throttle(() => {
            this.fetchCouponListRes()
        }, 500, {
            leading: false,
            trailing: true
        })
    },
	onLoad(options) {
		this.options = options
	},
    async onShow() {
        try {
            await this.mainMixin_BeforeFetchPageData()
            await Promise.all([
                this.fetchPageRes({}).catch(() => {}),
                this.fetchUserDetailsRes().catch(() => {})
            ])
            console.log(this.pageDataRes, '12345')
			if (this.options.scene) {
				const queryData = this.$util.scene_decode(this.options.scene)
				// queryData.a是referee_id
				console.log('queryData.a', queryData.a)
				if (queryData.a) {
					App.saveRefereeIdX(queryData.a)
				}
			
			}
            App.hideLoading()
        } catch (e) {
            console.log('onPullDownRefresh 报错', e)
            // TODO handle the exception
        }
    },
    methods: {
        // 返回按钮点击
        returnBtn(e) {
		    let pages = getCurrentPages()
		    if (pages.length > 1) {
		        uni.navigateBack({
		            delta: 1
		        })
		    } else {
		        let url = '/pages/mainPages/index/index'
		        // #ifdef H5
                url += '?i=' + App.getUniacid() + '&aid=' + App.siteInfo.aid
		        // #endif
		        uni.reLaunch({
		            url
		        })
		    }
        },
        // 海报按钮点击事件
        handleBtnPosterClick() {
            this.$refs.shareView.shareswich()
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
        // 提交订单按钮点击事件
        async handleBtnConfirmClick() {
            if (this.submitting) {
                return
            }
            if (!this.validateForm()) {
                return
            }
            this.submitting = true
            try {
                this.payOrder(this.cOrderDataSubmitted)
            } catch (e) {
                console.log('handleBtnConfirmClick', e)
                return Promise.reject(e)
                // TODO handle the exception
            }
        },
        // 充值类型点击事件
        handleTypeItemClick(item, index) {
            this.typeActive = index
        },
        // 充值类型点击事件
        handlePriceItemClick(item, index) {
            this.priceActive = index
        },
        // 请求用户详情接口数据
        async fetchUserDetailsRes() {
		    try {
		        const res = await App._getP('user.index/detail')
		        this.userDetails = res.data || {}
		    } catch (e) {
		        return Promise.reject(e)
		        // TODO handle the exception
		    }
        },
        // 请求页面设置相关接口数据
        async fetchPageRes() {
            try {
                const res = await App._getP('phoneBill.Index/index')
                this.pageRes = res.data || {}
            } catch (e) {
                return Promise.reject(e)
                // TODO handle the exception
            }
        },
        // 请求页面设置相关接口数据
        async fetchCouponListRes() {
            if (!this.cOrderDataSubmitted.amount || !this.cOrderDataSubmitted.recharge_app) {
                return
            }
            try {
                const res = await App._getP('phoneBill.Index/canUseCoupon', {
                    pay_price: this.cOrderDataSubmitted.amount,
                    recharge_app: this.cOrderDataSubmitted.recharge_app,
                    recharge_type: this.cOrderDataSubmitted.recharge_type
                })
                this.couponListRes = res.data || []
                // 更新数据后 根据需要清空当前选中的优惠券
                if (!this.couponListRes.find(item => item.coupon_id === this.couponActiveItem.coupon_id)) {
                    this.couponActiveItem = {}
                }
            } catch (e) {
                console.log('fetchCouponListRes err', e)
                return Promise.reject(e)
                // TODO handle the exception
            }
        },
        // 请求当前算价接口的数据
        async fetchCalculationRes() {
            try {
                const {
                    amount,
                    recharge_app,
                    coupon_id,
                    recharge_type
                } = this.cCalculationResOptions
                // 参数校验
                if (!amount || !recharge_app || !recharge_type) {
                    return
                }
                const res = await App._getP('phoneBill.Index/calculationPayPrice', {
                    amount,
                    recharge_app,
                    coupon_id,
                    recharge_type
                })
                this.calculationRes = res.data || {}
            } catch (e) {
                return Promise.reject(e)
                // TODO handle the exception
            }
        },
        payOrder(data = {}) {
            console.log('payOrder', data)
            this.$store.commit('orderPay', data)
            this.$refs.orderPay.onToggleList(() => {
                this.submitting = false
            })
        },
        // 校验表单数据
        validateForm() {
            const data = this.cOrderDataSubmitted
            if (!data.mobile) {
                uni.showToast({
                    icon: 'none',
                    title: '请填写手机号'
                })
                return false
            }
            if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(data.mobile)) {
			    uni.showToast({
			        icon: 'none',
			        title: '手机号码格式不正确'
			    })
			    return false
            }
            if (!data.amount) {
                uni.showToast({
                    icon: 'none',
                    title: '请选择充值金额'
                })
                return false
            }
            if (!data.recharge_type) {
                uni.showToast({
                    icon: 'none',
                    title: '请选择快充或者慢充'
                })
                return false
            }
            return true
        },
        paySuccess() {
            console.log('paySuccess')
            this.submitting = false
            // 跳转到话费订单页面
            App.navigationTo({
                url: 'pages/subPages/phoneBill/order'
            })
            setTimeout(() => {
                uni.showToast({
                    icon: 'none',
                    title: '充值成功'
                })
            }, 50)
        },
        payFail() {
            this.submitting = false
        }
    }
}
</script>

<style lang="scss" scoped>
	.page-phoneBill-index {
		box-sizing: border-box;
		min-height: 100vh;
		padding-top: 30rpx;
		background-color: #F8F8F8;
		padding-bottom: 200rpx;
	}

	// banner
	.banner-wrapper {
		width: 690rpx;
		max-width: 100%;
		margin: 0 auto;
	}

	// banner end
	// 滚动通知
	.notice-wrapper {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		width: 690rpx;
		max-width: 100%;
		margin: 30rpx auto;
		color: #FF4444;
	}

	.notice-wrapper__content {
		width: 670rpx;
	}

	// 滚动通知 end
	// 充值类型
	.type-list {
		box-sizing: border-box;
		display: flex;
		width: 690rpx;
		max-width: 100%;
		height: 90rpx;
		margin: 30rpx auto;
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		background-color: #fff;
	}

	.type-item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 100%;
		transition: 0.3s all ease-in-out;

		&.is-active {
			color: #fff;
			background-color: #2C5FF4;
		}

		&:first-child {
			border-radius: 10rpx 0 0 10rpx;
		}

		&:last-child {
			border-radius: 0 10rpx 10rpx 0;
		}
	}

	// 充值类型 end
	// 手机号码输入
	.phoneBill-form {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		margin: 30rpx auto;
	}

	.phoneBill-form__row {
		display: flex;
		align-items: center;
		height: 110rpx;
		border-bottom: 1px solid #CCCCCC;
	}

	.phoneBill-form__row__input {
		flex: 1;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;

		&.is-placeholder {
			color: #999;
		}
	}

	.phoneBill-form__row__icon {
		width: 50rpx;
		height: 52rpx;
	}

	.phoneBill-form__tip {
		margin-top: 16rpx;
		font-size: 24rpx;
		color: #999;
	}

	// 手机号码输入 end
	// 充值金额列表
	$phoneBill-price-item-gutter: 26rpx;

	.phoneBill-price-wrapper {
		position: relative;
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		padding: 30rpx 30rpx 16rpx 30rpx;
		margin: 30rpx auto;
		border-radius: 10rpx;
		background-color: #fff;
		&.is-pt-large {
			margin-top: 50rpx;
			padding-top: 40rpx;
		}
		.phoneBill-img-open-membership {
			position: absolute;
			top: -46rpx;
			right: 16rpx;
		}
	}

	.phoneBill-price-list {
		display: flex;
		margin: 0 -$phoneBill-price-item-gutter/2;
	}

	.phoneBill-price-item {
		box-sizing: border-box;
		width: 33.333333%;
		padding: $phoneBill-price-item-gutter/2;
	}

	.phoneBill-price-card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 193rpx;
		padding: 20rpx 0;
		color: #999;
		text-align: center;
		white-space: nowrap;
		background-color: #F8F8F8;
		border-radius: 10rpx;
		transition: 0.3s all ease-in-out;

		&.is-active {
			color: #fff;
			background-color: #2C5FF4;
		}
	}

	.phoneBill-price-card__name {
		margin-bottom: auto;
		font-size: 48rpx;
		font-weight: bold;
	}

	.phoneBill-price-card__text {
		font-size: 20rpx;
	}

	// 充值金额列表 end
	// 优惠券选择
	.phoneBill-coupon-cell {
		box-sizing: boder;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 60rpx;
		margin-top: 20rpx;
	}

	.phoneBill-coupon-cell__title {
		font-size: 28rpx;
		color: #333;
	}

	.phoneBill-coupon-cell__center {
		margin-left: auto;
		margin-right: 20rpx;
	}

	.phoneBill-coupon-cell__text {
		font-size: 28rpx;
		color: #999;
	}

	.phoneBill-coupon-cell__icon {
		font-size: 28rpx;
		color: #999;
		line-height: 1;
	}

	// 优惠券选择 end
	// 开通会员标识
	.phoneBill-img-open-membership {
		width: 218rpx;
		height: 66rpx;
	}
	// 开通会员标识
	// 规则富文本
	.rules-wrapper {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		padding: 30rpx;
		margin: 30rpx auto;
		border-radius: 10rpx;
		background-color: #fff;
	}

	// 规则富文本 end
	// footer
	.page-phoneBill__footer {
		background-color: #fff;
		// 要高于结算详情弹窗
		z-index: 10;
	}

	.confirm-wrapper {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
	}

	.confirm-wrapper__left {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex: 1;
		padding: 0 30rpx;
	}

	.confirm-wrapper__price {
		font-weight: bold;
		font-size: 36rpx;
		color: #FF4444;
	}

	.confirm-wrapper__btn-details {
		box-sizing: border-box;
		font-weight: bold;
		font-size: 28rpx;
		color: #2C5FF4;
		line-height: 1;
	}

	.confirm-wrapper__icon-details {
		width: 12rpx;
		height: 14rpx;
		margin-left: 10rpx;
		vertical-align: middle;
		transform-origin: center center;
		transition: all .3s ease;

		&.is-up {
			transform: rotateX(-180deg);
		}
	}

	.confirm-wrapper__btn-confirm {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 300rpx;
		height: 110rpx;
		font-weight: bold;
		font-size: 32rpx;
		color: #fff;
		background-color: #2C5FF4;
	}

	// footer end
	// 结算详情弹窗
	.details-popup-card {
		box-sizing: border-box;
		position: relative;
		width: 100vw;
		padding: 0 30rpx 300rpx 30rpx;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
	}

	.details-popup-card__header {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 120rpx;
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
	}

	.details-popup-card__btn-close {
		position: absolute;
		top: 24rpx;
		right: 33rpx;
		color: #333;
		font-size: 36rpx;
	}

	.details-popup-card__row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #333333;

		.text-red {
			color: #FF4444;
		}
	}

	// 结算详情弹窗
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
		background-color: #2C5FF4;
	}

	// 优惠券详情弹窗
	// 我的订单按钮
	.page-phoneBill__btn-nav {
		box-sizing: border-box;
		position: absolute;
		bottom: 210rpx;
		right: 30rpx;
		display: flex;
		width: 98rpx;
		height: 98rpx;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		line-height: 1;
		border-radius: 100%;
		background-color: #2C5FF4;
	}
	.page-phoneBill__btn-nav__img {
		width: 33rpx;
		height: 33rpx;
	}
	.page-phoneBill__btn-nav__text {
		margin-top: 6rpx;
		color: #fff;
		font-size: 24rpx;
		font-weight: bold;
	}
	// 我的订单按钮 end
	
	// 佣金
	.page-phoneBill__commission {
		position: relative;
		box-sizing: border-box;
		position: absolute;
		bottom: 490rpx;
		right: 30rpx;
		width: 162rpx;
		height: 214rpx;
		padding-top: 24rpx;
		background-size: contain;
		background-repeat: no-repeat;
	}
	.page-phoneBill__text {
		font-size: 20rpx;
		text-align: center;
		color: #9d461c;
	}
	.page-phoneBill__commission__btn {
		position: absolute;
		left: 50%;
		top: 156rpx;
		font-size: 20rpx;
		color: #9d461c;
		transform: translateX(-50%);
		white-space: nowrap;
		&::after {
			display: inline-block;
			content: "\20";
			width: 0;
			height: 0;
			border: 5px solid transparent;
			border-left-color: #9d461c;
			margin-left: 3px;
		}
	}
	// 佣金 end

	// 返回按钮（直接从商品详情页抄的）
	.diy-navigator {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		padding: 0 20rpx;
		height: 88rpx;
		z-index: 100;
	}

	.return-btn {
		position: absolute;
		left: 20rpx;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50%;
		text-align: center;
		color: #fff;
		background-color: rgba(0, 0, 0, .5);
		z-index: 50;
	}
	// 返回按钮 end
</style>
