<template>
	<view class="c-single-coupon" @click="handleClick">
		<!-- 左边容器 -->
		<view class="c-single-coupon__left">
			<!-- 商品图片 -->
			<view class="c-single-coupon__img-wrapper">
			 	<image class="c-single-coupon__img" :src="cCouponData.imgUrl"></image>
			</view>
		</view>
		<!-- 右边容器 -->
		<view class="c-single-coupon__right">
			<!-- 标题 -->
			<view class="c-single-coupon__title"><label-members v-if="cCouponData.memberVisible" containerStyle="margin-right: 8rpx;" />{{cCouponData.title}}</view>
			<!-- 商品价 -->
			<view class="c-single-coupon__goods-price">商品价：<text class="is-strong price-font-family">￥{{cCouponData.goodsPrice}}</text></view>
			<!-- 金额和操作按钮容器 -->
			<view class="c-single-coupon__op-wrapper">
				<view class="c-single-coupon__op-wrapper__left">
					<!-- 金额 -->
					<view class="c-single-coupon__price price-font-family"><text v-if="cCouponData.couponType != 20">￥</text><text class="is-strong">{{cCouponData.couponPrice}}</text></view>
					<!-- 使用条件 -->
					<view class="c-single-coupon__condition">{{cCouponData.couponCondition}}</view>
				</view>
				<view class="c-single-coupon__op-wrapper__right" @click.stop="handleBtnClick">
					<!-- 操作按扭 -->
					<btn-op :text="cCouponData.btnText" :bindMobileVisible="cCouponData.bindMobileVisible" @on-click="handleBtnClick" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import LabelMembers from './LabelMembers.vue'
import BtnOp from './BtnOp.vue'
export default {
    components: {
        LabelMembers,
		BtnOp
    },
    props: {
	    // 是否使用默认的数据转换器，如果为true可以直接传入接口的原始数据接口，否则，则需要在父组件将数据转换好再传入
	    useDefaultDataConverter: {
	        type: Boolean,
	        default: false
	    },
        // 原始优惠券数据
        couponData: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    computed: {
        // 格式化后的couponData
        cCouponData() {
            if (this.useDefaultDataConverter) {
                return this.defaultDataConverter(this.couponData)
            }
            return this.couponData
        }
    },
    methods: {
        defaultDataConverter(data) {
			// TODO 完善这个默认转换器
            return {
                // // id
                // id: 'ss',
                // // 商品图片
                // imgUrl: 'http://placekitten.com/220/220',
                // // 优惠券名称
                // title: '全品类券【每天0/8/12/14仅可购买美食部分商品每天0/8/12/14仅可购买美食部分商品',
                // // 商品价
                // goodsPrice: '10.00',
                // // 优惠券金额
                // couponPrice: '10.00',
                // // 使用条件
                // couponCondition: '满10.01元可用',
                // // 是否显示会员专属
                // memberVisible: true
            }
        },
		handleClick(item) {
			this.$emit('on-item-click',this.cCouponData)
		},
		handleBtnClick(item) {
			this.$emit('on-btn-click',this.cCouponData)
		}
    }
}
</script>

<style lang="scss" scoped>
	.c-single-coupon {
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		height: 260rpx;
		margin: 0 auto;
		padding: 0 20rpx;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 20rpx;

	}
	.c-single-coupon__left {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding-right: 20rpx;
		background-image: linear-gradient(to bottom, #eee 25%, transparent 25%, transparent 50%,#eee 50%, #eee 75%, transparent 75%, transparent);
		background-size: 2rpx 40rpx;
		background-position: 100% 40rpx;
		background-repeat: repeat-y;
		&::before {
			position: absolute;
			top: 0;
			right: -8rpx;
			display: block;
			content: "\20";
			width: 20rpx;
			height: 10rpx;
			background-color: #F8F8F8;
			border-radius: 0 0 20rpx 20rpx;
			z-index: 1;
		}
		&::after {
			position: absolute;
			bottom: 0;
			right: -8rpx;
			display: block;
			content: "\20";
			width: 20rpx;
			height: 10rpx;
			background-color: #F8F8F8;
			border-radius: 20rpx 20rpx 0 0;
			z-index: 1;
		}
	}
	.c-single-coupon__img {
		height: 220rpx;
		width: 220rpx;
	}
	.c-single-coupon__right {
		box-sizing: border-box;
		flex: 1;
		margin-left: 20rpx;
	}
	.c-single-coupon__title {
		height: 76rpx;
		font-weight: bold;
		font-size: 28rpx;
		color: #333;
		overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2;
	}
	.c-single-coupon__goods-price {
		font-weight: bold;
		font-size: 22rpx;
		color: #999;
		.is-strong {
			color: #333;
		}
	}
	.c-single-coupon__op-wrapper {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
	.c-single-coupon__op-wrapper__left {
		width: 0;
		flex: 1;
	}
	.c-single-coupon__op-wrapper__right {
		flex-shrink: 0;
	}
	.c-single-coupon__price {
		font-weight: bold;
		font-size: 32rpx;
		color: #FF4444;
		.is-strong {
			font-size: 50rpx;
		}
	}
	.c-single-coupon__condition {
		font-weight: bold;
		font-size: 24rpx;
		color: #FF4444;
	}
	.c-single-coupon__btn-op {
		width: 150rpx;
		height: 50rpx;
		border-radius: 25rpx;
		font-weight: bold;
		font-size: 23rpx;
		color: #fff;
		text-align: center;
		line-height: 50rpx;
		background: linear-gradient(-90deg, #FF4444 0%, #FD7137 100%);;
	}
</style>
