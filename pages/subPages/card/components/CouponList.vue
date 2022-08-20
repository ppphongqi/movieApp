<template>
	<view class="c-coupon-list">
		<!-- handler -->
		<view class="coupon-handler">
			<view class="coupon-handler__left">赠送优惠券</view>
			<view class="coupon-handler__center" @click="couponPopupVisible = true">
				<!-- 最多显示三个 -->
				<view v-for="item in couponList" :key="item.id" class="coupon-handler__coupon-item">
					<label-coupon :text="item.couponCondition" />
				</view>
				<view v-for="item in couponList" :key="item.id" class="coupon-handler__coupon-item">
					<label-coupon :text="item.couponCondition" />
				</view>
				<view v-for="item in couponList" :key="item.id" class="coupon-handler__coupon-item">
					<label-coupon :text="item.couponCondition" />
				</view>
				<view v-for="item in couponList" :key="item.id" class="coupon-handler__coupon-item">
					<label-coupon :text="item.couponCondition" />
				</view>
				<view v-for="item in couponList" :key="item.id" class="coupon-handler__coupon-item">
					<label-coupon :text="item.couponCondition" />
				</view>
				<view v-for="item in couponList" :key="item.id" class="coupon-handler__coupon-item">
					<label-coupon :text="item.couponCondition" />
				</view>
			</view>
			<view class="coupon-handler__right" @click="couponPopupVisible = true">
				<view class="iconfont icon-right" />
			</view>
		</view>
		<!-- handler end -->
		<!-- 优惠券弹窗 -->
		<popup-view :show="couponPopupVisible" type="bottom" @clickmask="couponPopupVisible = false">
			<view class="coupon-popup-card app-after--safe-bottom">
				<!-- 标题 -->
				<view class="coupon-popup-card__title">
					赠送优惠券
				</view>
				<!-- 列表 -->
				<scroll-view class="coupon-popup-card__list" style="height: 500rpx;" scroll-y>
					<view v-for="item in couponList" :key="item.id" class="coupon-popup-card__item">
						<coupon-owned :couponData="item" />
					</view>
				</scroll-view>
				<!-- 列表 end -->
				<view class="coupon-popup-card__btn-close iconfont icon-searchclose" @click="couponPopupVisible = false"></view>
			</view>
		</popup-view>
		<!-- 优惠券弹窗 end -->
	</view>
</template>

<script>
	import LabelCoupon from './LabelCoupon.vue'
	import PopupView from '@/components/template/PopManager.vue'
	// 不得不从其他分包引入组件
	import CouponOwned from './CouponOwned'
	export default {
		components: {
			LabelCoupon,
			PopupView,
			CouponOwned
		},
		props: {
			// 列表数据
			couponList: {
				type: Array,
				default () {
					// 使用import { couponItemConverter } from '@/common/js/dataConverter/couponItemConverter'转换数据格式
					// 和pages/subPages/couponCenter/myList页面中的cCouponList数据格式一致
					// return [{
					// 	// id
					// 	id: 251,
					// 	// 类型
					// 	couponType: 20,
					// 	// 类型文本
					// 	couponTypeText: '满减券',
					// 	styleType: 2,
					// 	// 按钮状态
					// 	btnStatus: 1,
					// 	// 按钮文字
					// 	btnText: '立即使用',
					// 	// 标题
					// 	title: '会员',
					// 	// 副标题
					// 	subtitle: '会员',
					// 	// 优惠券金额
					// 	couponPrice: '50.00',
					// 	// 使用条件
					// 	couponCondition: '减免50.00',
					// 	// 是否显示会员专属
					// 	memberVisible: false,
					// 	// 有效期
					// 	term: '2021/03/03-2021/03/12',
					// 	// 使用说明
					// 	useDesc: '',
					// 	// 立即使用按钮是否可见
					// 	btnReceiveVisible: false
					// }]
					return []
				}
			},
		},
		data() {
			return {
				// 优惠券弹窗是否显示
				couponPopupVisible: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.coupon-handler {
		box-sizing: border;
		display: flex;
		align-items: center;
		height: 100rpx;
		padding: 0 30rpx;
		justify-content: space-between;
	}

	.coupon-handler__left {
		font-size: 28rpx;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.coupon-handler__center {
		display: flex;
		justify-content: flex-end;
		flex: 1;
		min-width: 0;
		margin-left: 20rpx;
		overflow: hidden;
	}

	.coupon-handler__coupon-item {
		flex-shrink: 0;

		&+& {
			margin-left: 16rpx;
		}
	}

	.coupon-handler__right {
		line-height: 1;
		padding-top: 6rpx;
		margin-left: 20rpx;

		.iconfont {
			line-height: 1;
			font-size: 24rpx;
			color: #FF4444;
		}
	}

	// 优惠券弹窗
	.coupon-popup-card {
		box-sizing: border-box;
		position: relative;
		padding: 30rpx;
		padding-top: 0;
		width: 100vw;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0px 0px;
	}

	.coupon-popup-card__title {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 105rpx;
		font-weight: bold;
		font-size: 32rpx;
		color: #333333;
	}

	.coupon-popup-card__btn-close {
		position: absolute;
		top: 24rpx;
		right: 33rpx;
		color: #333;
		font-size: 36rpx;
	}

	.coupon-popup-card__item {
		&+& {
			margin-top: 20rpx;
		}
	}

	// 优惠券弹窗 end
</style>
