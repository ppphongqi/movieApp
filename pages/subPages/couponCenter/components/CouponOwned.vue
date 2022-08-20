<template>
	<view class="c-coupon-owned" :class="cCouponClass" @click="handleClick">
		<!-- 主要内容 -->
		<view class="c-coupon-content">
			<!-- 左侧 -->
			<view class="c-coupon-content__left" :style="cCouponLeftStyleStr">
				<view class="c-coupon-content__price price-font-family"><text v-if="cCouponData.couponType != 20">￥</text><text class="is-strong">{{cCouponData.couponPrice}}</text></view>
				<view class="c-coupon-content__couponCondition">{{cCouponData.couponCondition}}</view>
				<!-- 会员标签 -->
				<view v-if="cCouponData.memberVisible" class="c-coupon-content__label-member"><view class="c-coupon-content__label-member__inner"><image class="c-coupon-content__img-member" src="../static/images/img-membericon.png">会员专享</view></view>
			</view>
			<!-- 右侧 -->
			<view class="c-coupon-content__right">
				<view class="dis-flex">
					<view class="flex-box">
						<view class="c-coupon-content__title"><view class="c-coupon-content__label-type" :style="cLabelCouponTypeStyle">{{cCouponData.couponTypeText}}</view>{{cCouponData.title}}</view>
						<view class="c-coupon-content__op-row">
							<view class="c-coupon-content__time price-font-family">{{cCouponData.term}}</view>
							<button v-if="cCouponData.btnReceiveVisible" class="c-coupon-content__btn-op btn-normal" :style="cBtnOpStyle" @click.stop="handleBtnClick">{{cCouponData.btnText}}</button>
						</view>
					</view>
					<!-- 过期等标签 -->
					<image v-if="'used' === couponData.cateType" class="c-coupon-content__label-status" src="../static/images/label-used.png"></image>
					<image v-if="'be_overdue' === couponData.cateType" class="c-coupon-content__label-status" src="../static/images/label-expired.png"></image>
				</view>
				<view v-if="cCouponData.useDesc" class="c-coupon-content__details-header" @click.stop="doToggleDetailVisible">
					<view class="c-coupon-content__details-title">详细信息</view>
					<view class="c-coupon-content__icon-details iconfont icon-xiangxiayuanjiantou"></view>
				</view>
				<!-- 新 -->
				<view v-if="cCouponData.labelNewVisible" class="c-coupon-content__label-new">新</view>
			</view>
		</view>
		<!-- 主要内容 end -->
		<!-- 提示性内容 -->
		<view v-show="cCouponData.useDesc && detailVisible" class="c-coupon-owned__tip">			{{cCouponData.useDesc}}
		</view>
		<!-- 提示性内容 end -->
	</view>
</template>

<script>
	export default {
		props: {
			// 是否使用默认的数据转换器，如果为true可以直接传入接口的原始数据接口，否则，则需要在父组件将数据转换好再传入
			useDefaultDataConverter: {
			    type: Boolean,
			    default: false
			},
			// 原始优惠券数据(把原始数据传进来简直就是个错误)...
			couponData: {
			    type: Object,
			    default() {
			        return {
						// // id
						// id: 'ss',
						// // 标题
						// title: '仅可购买美食部分商品仅可购买美食部分商品',
						// // 副标题
						// subtitle: '除特例商品全品类可用除特例商品全品类可用除特例商品全品类可用',
						// // 优惠券金额
						// couponPrice: '10',
						// // 使用条件
						// couponCondition: '满10.01元可用',
						// // 是否显示会员专属
						// memberVisible: true
					}
			    }
			}
		},
		data() {
			return {
				detailVisible: false
			}
		},
		computed: {
		    // 格式化后的couponData
		    cCouponData() {
		        if (this.useDefaultDataConverter) {
		            return this.defaultDataConverter(this.couponData)
		        }
		        return this.couponData
		    },
			cCouponClass() {
				let classStr = ''
				// is-cate-type--used:已经使用，is-cate-type--be_overdue:已经过期
				if(this.couponData.cateType) {
					classStr += ` is-cate-type--${this.couponData.cateType}`
				}
				// this.couponData.couponType优惠券类型10:满减券, 20:折扣券, 30:运费券, 40:随机券
				classStr += ` is-type--${this.couponData.couponType}`
				return classStr
			},
			// 优惠券右侧的样式
			cCouponLeftStyleStr() {
				let styleStr = ''
				 // 这种方式太不好了 应该在外面算清楚
				 // this.couponData.couponType优惠券类型10:满减券, 20:折扣券, 30:运费券, 40:随机券
				if(this.couponData.cateType === 'used' || this.couponData.cateType === 'be_overdue') {
					// 优惠券已经过期或被使用
					styleStr = `background-image: url('${this.getImageRoot('bg-coupon-left--gray.png')}');`
				}else if(+this.couponData.couponType === 30) {
					// 运费券
					styleStr = `background-image: url('${this.getImageRoot('bg-coupon-left--green.png')}');`
				}else if(+this.couponData.couponType) {
					// 其他券
					styleStr = `background-image: url('${this.getImageRoot('bg-coupon-left--blue.png')}');`
				}
				return styleStr
			},
			// 优惠券标签的样式
			cLabelCouponTypeStyle() {
				let styleStr = ''
				// 这种方式太不好了 应该在外面算清楚
				 // this.couponData.couponType优惠券类型10:满减券, 20:折扣券, 30:运费券, 40:随机券
				if(this.couponData.cateType === 'used' || this.couponData.cateType === 'be_overdue') {
					// 优惠券已经过期
					styleStr = `background-color: #C2C2C2;`
				}else if(+this.couponData.couponType === 30) {
					// 运费券
					styleStr = `background-color: #45CBC4;`
				}else if(+this.couponData.couponType) {
					// 其他券
					styleStr = `background-color: #5193D5;`
				}
				return styleStr
			},
			// 优惠券按钮颜色
			cBtnOpStyle() {
				let styleStr = ''
				// 这种方式太不好了 应该在外面算清楚
				 // this.couponData.couponType优惠券类型10:满减券, 20:折扣券, 30:运费券, 40:随机券
				if(this.couponData.cateType === 'used' || this.couponData.cateType === 'be_overdue') {
					// 优惠券已经过期
					styleStr = `color: #C2C2C2;`
				}else if(+this.couponData.couponType === 30) {
					// 运费券
					styleStr = `color: #45CBC4;`
				}else if(+this.couponData.couponType) {
					// 其他券
					styleStr = `color: #5193D5;`
				}
				return styleStr
			}
		},
		methods: {
			// 默认的数据转换器
		    defaultDataConverter(data) {
				// TODO 完善这个默认转换器
		        return {
		            // // id
		            // id: 'ss',
		            // // 标题
		            // title: '仅可购买美食部分商品仅可购买美食部分商品',
		            // // 副标题
		            // subtitle: '除特例商品全品类可用除特例商品全品类可用除特例商品全品类可用',
		            // // 优惠券金额
		            // couponPrice: '10',
		            // // 使用条件
		            // couponCondition: '满10.01元可用',
		            // // 是否显示会员专属
		            // memberVisible: true,
					// // 是否显示立即领取按钮
					// btnReceiveVisible: true
		        }
		    },
			handleClick() {
				this.$emit('on-item-click',this.cCouponData)
			},
			handleBtnClick() {
				this.$emit('on-btn-click',this.cCouponData)
			},
			doToggleDetailVisible() {
				this.detailVisible = !this.detailVisible
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-coupon-owned {
		width: 690rpx;
		max-width: 100%;
		margin: 0 auto;
	}
	.c-coupon-content {
		box-sizing: border-box;
		display: flex;
		height: 186rpx;
		background-color: #fff;
	}
	.c-coupon-content__left {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 226rpx;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
	.c-coupon-content__price {
		font-weight: bold;
		font-size: 32rpx;
		color: #fff;
		line-height: 1;
		.is-strong {
			font-size: 50rpx;
		}
	}
	.c-coupon-content__couponCondition {
		font-size: 22rpx;
		color: #fff;
	}
	.c-coupon-content__right {
		position: relative;
		box-sizing: border-box;
		flex: 1;
		height: 100%;
		padding: 16rpx 20rpx;
		border-radius: 0 4px 4rpx 0;
		border: 1px solid #eee;
	}
	
	.c-coupon-content__label-status {
		position: relative;
		top: 0;
		right: -20rpx;
		width: 74rpx;
		height: 93rpx;
	}
	
	.c-coupon-content__label-new {
		box-sizing: border-box;
		position: absolute;
		top: 0;
		right: 0;
		height: 70rpx;
		width: 70rpx;
		padding-left: 35rpx;
		padding-bottom: 35rpx;
		line-height: 35rpx;
		font-size: 24rpx;
		color: #fff;
		text-align: center;
		background: linear-gradient(-135deg,#FF4444,#FF4444 50%,transparent 50%);
		border-radius: 0 4rpx 4rpx 0;
		background-repeat: no-repeat;
	}
	.c-coupon-content__title {
		width: 354rpx;
		height: 70rpx;
		font-weight: bold;
		font-size: 26rpx;
		color: #333;
		overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2;
		.c-coupon-content__label-type {
			margin-right: 14rpx;
		}
	}
	.c-coupon-content__label-type {
		box-sizing: border-box;
		display: inline-block;
		height: 26rpx;
		line-height: 26rpx;
		font-weight: bold;
		font-size: 20rpx;
		color: #fff;
		padding: 0 12rpx;
		background-color: #45CBC4;
		border-radius: 13rpx;
		transform: translateY(-4rpx);
	}
	.c-coupon-content__op-row {
		display: flex;
		align-items: center;
		height: 56rpx;
		background-image: linear-gradient(to right, #F5F5F5, #F5F5F5 18rpx, transparent 18rpx, transparent);
		background-size: 28rpx 1px;
		background-position: 0 100%;
		background-repeat-y: no-repeat;
	}
	.c-coupon-content__time {
		font-size: 24rpx;
		color: #333;
	}
	.c-coupon-content__btn-op {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40rpx;
		width: 110rpx;
		margin-left: auto;
		color: #45CBC4;
		font-size: 20rpx;
		border-radius: 20rpx;
		border: 1px solid currentColor;
	}
	.c-coupon-content__details-header {
		display: flex;
		align-items: center;
		height: 42rpx;
	}
	.c-coupon-content__details-title {
		font-size: 20rpx;
		color: #333;
	}
	.c-coupon-content__icon-details {
		margin-left: auto;
		font-size: 24rpx;
		color: #DADADA;
	}
	.c-coupon-owned__tip {
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 24rpx;
		color: #666;
		background-color: #fff;
	}
	.c-coupon-content__label-member {
		box-sizing: border-box;
		position: absolute;
		top: 0;
		left: 0;
		height: 24rpx;
		padding-left: 4rpx;
		padding-right: 4rpx;
		line-height: 24rpx;
		font-size: 20rpx;
		color: #FFDBA5;
		&::before {
			position: absolute;
			z-index: 0;
			display: block;
			content: "\20";
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(-90deg, #393946 0%, #565B69 100%);
			transform: scale(1.2, 1.2) perspective(20rpx) rotateX(5deg);
			transform-origin: bottom left;
		}
		.c-coupon-content__img-member {
			margin-right: 12rpx;
		}
	}
	.c-coupon-content__label-member__inner {
		position: relative;
		z-index: 1;
	}
	.c-coupon-content__img-member {
		display: inline-block;
		width: 24rpx;
		height: 18rpx;
	}
</style>
