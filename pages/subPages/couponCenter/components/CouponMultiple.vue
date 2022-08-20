<template>
	<view class="c-coupon-multiple" @click="handleClick">
		<view class="c-coupon-multiple__left">
			<!-- 标题部分 -->
			<view class="c-coupon-multiple__header">
				<view class="c-coupon-multiple__title"><label-members containerStyle="margin-right: 8rpx;" v-if="cCouponData.memberVisible" />{{cCouponData.title}}</view>
				<view v-if="cCouponData.subtitle" class="c-coupon-multiple__subtitle">{{cCouponData.subtitle}}</view>
			</view>
			<!-- 商品列表部分 -->
			<view class="coupon-goods-list">
				<view v-for="goods in cCouponData.goods" :key="goods.id" class="coupon-goods-item">
					<view class="coupon-goods-card">
						<!-- 商品图片 -->
						<view class="coupon-goods-card__img-wrapper">
							<image class="coupon-goods-card__img" :src="goods.imgUrl" />
						</view>
						<!-- 商品价格 -->
						<view class="coupon-goods-card__price price-font-family">￥{{goods.price}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="c-coupon-multiple__right">
			<!-- 优惠券金额 -->
			<view class="c-coupon-multiple__price price-font-family"><text v-if="cCouponData.couponType != 20">￥</text><text class="is-strong">{{cCouponData.couponPrice}}</text></view>
			<!-- 优惠券使用条件 -->
			<view class="c-coupon-multiple__condition">{{cCouponData.couponCondition}}</view>
			<!-- 操作按钮 -->
			<btn-op containStyle="margin-top: 32rpx;" :text="cCouponData.btnText" :bindMobileVisible="cCouponData.bindMobileVisible" @on-click="handleBtnClick" />
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
	        return {
	            // // id
	            // id: 'ss',
                //    // 标题
                //    title: '仅可购买美食部分商品仅可购买美食部分商品',
                //    // 副标题
                //    subtitle: '除特例商品全品类可用除特例商品全品类可用除特例商品全品类可用',
	            // // 优惠券金额
	            // couponPrice: '10.00',
	            // // 使用条件
	            // couponCondition: '满10.01元可用',
                //    // 是否显示会员专属
                //    memberVisible: true,
                //    // 商品数据
                //    goods: [
                //        {
                //            id: 'goods1',
                //            imgUrl: 'http://placekitten.com/110/110',
                //            price: '10.00'
                //        }
                //    ]
	        }
	    },
        handleClick(item) {
            this.$emit('on-item-click', this.cCouponData)
        },
        handleBtnClick(item) {
            this.$emit('on-btn-click', this.cCouponData)
        }
    }
}
</script>

<style lang="scss" scoped>
	.c-coupon-multiple {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 690rpx;
		max-width: 100%;
		height: 260rpx;
		margin: 0 auto;
		border-radius: 20rpx;
		background-color: #fff;
	}
	.c-coupon-multiple__left {
		position: relative;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		width: 0;
		height: 100%;
		padding-left: 30rpx;
		padding-right: 30rpx;
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
	.c-coupon-multiple__right {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 185rpx;
		height: 100%;
		background-color: #FFECEC;
	}
	.c-coupon-multiple__header {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		height: 106rpx;
	}
	.c-coupon-multiple__title {
		width: 100%;
		font-weight: bold;
		color: #333;
		font-size: 24rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.c-coupon-multiple__subtitle {
		box-sizing: border-box;
		display: inline-block;
		height: 28rpx;
		max-width: 100%;
		padding: 0 16rpx;
		font-size: 18rpx;
		margin-top: 10rpx;
		color: #999;
		line-height: 28rpx;
		border-radius: 14rpx;
		background-color: #F8F8F8;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.coupon-goods-list {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		margin: 0 -6rpx;
	}
	.coupon-goods-item {
		display: flex;
		justify-content: center;
		width: 33.333333%;
		flex-shrink: 0;
	}
	.coupon-goods-card__img {
		width: 110rpx;
		height: 110rpx;
	}
	.coupon-goods-card__price {
		width: 100%;
		font-size: 20rpx;
		color: #666;
		line-height: 20rpx;
		text-align: center;
		white-space: nowrap;
	}
	.c-coupon-multiple__price {
		font-weight: bold;
		font-size: 32rpx;
		color: #FF4444;
		.is-strong {
			font-size: 50rpx;
		}
	}
	.c-coupon-multiple__condition {
		width: 100%;
		font-weight: bold;
		font-size: 24rpx;
		color: #FF4444;
		line-height: 24rpx;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.c-coupon-multiple__btn-op {
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
