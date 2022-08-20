<template>
	<view class="c-coupon-wrapper">
		<!-- 类型一、类型二和类型三 -->
		<view v-if="['type1','type2','type3'].indexOf(type) != -1" class="c-coupon" :class="cContainerClassStr" :style="cContainerStyleStr">
			<view class="c-coupon__left">
				<view class="c-coupon__price price-font-family"><text v-if="currency">{{currency}}</text><text v-if="priceStr" class="is-strong">{{priceStr}}</text></view>
				<view class="c-coupon__condition">{{condition}}</view>
				<view class="c-coupon__desc">{{desc}}</view>
			</view>
			<view class="c-coupon__right">
				<button class="c-coupon__btn-go btn-normal" @click="handleBtnClick">{{btnText}}</button>
			</view>
		</view>
		<!-- 类型一、类型二和类型三 end -->
	</view>
</template>

<script>
export default {
    props: {
        // 优惠券的id
        _id: {
            type: String,
            default: ''
        },
        // 优惠券的样式 type1,type2,type3
        type: {
            type: String,
            default: 'type1'
        },
        // 优惠券状态 0:待领取，1:已领取
        status: {
            type: String,
            default: '0'
        },
        // 货币符号
        currency: {
            type: String,
            default: '￥'
        },
        // 价格标签
        priceStr: {
            type: String,
            default: '10'
        },
        // 条件
        condition: {
            type: String,
            default: '满10.01元'
        },
        // 描述
        desc: {
            type: String,
            default: '全品类券(除特列商品)'
        },
        // 按钮文字
        btnText: {
            type: String,
            default: '领取'
        }
    },
    computed: {
        //  最外层容器的css类名
        cContainerClassStr() {
            let classStr = ''
            if (this.type) {
                classStr += ` is-${this.type}`
            }
            if (this.status === '1') {
                classStr += ' is-disabled'
            }
            return classStr
        },
        // 最外层容器的style
        cContainerStyleStr() {
            let styleStr = ''
            // 背景图片map
            const bgImgMap = {
                type1: this.getImageRoot('bg-coupon-type-01.png', 'url'),
                type2: this.getImageRoot('bg-coupon-type-02.png', 'url'),
                type3: this.getImageRoot('bg-coupon-type-03.png', 'url')
            }
            // disabled背景图片map
            const bgImgMapDisabled = {
			    type1: this.getImageRoot('bg-coupon-type-01--disabled.png', 'url'),
                type2: this.getImageRoot('bg-coupon-type-02--disabled.png', 'url'),
                type3: this.getImageRoot('bg-coupon-type-03-disabled.png', 'url')
            }
            if (this.status === '1') {
                styleStr += `background-image: ${bgImgMapDisabled[this.type]}`
            } else {
                styleStr += `background-image: ${bgImgMap[this.type]}`
            }
            return styleStr
        }
    },
    methods: {
        handleBtnClick() {
            this.$emit('on-btn-click')
        }
    }
}
</script>

<style lang="scss" scoped>
	.c-coupon {
		display: flex;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		&.is-type1 {
			width: 335rpx;
			height: 185rpx;
			color: #FF4444;
		}
		&.is-type2 {
			width: 335rpx;
			height: 185rpx;
			color: #fff;
		}
		&.is-type3 {
			flex-direction: column;
			width: 308rpx;
			height: 286rpx;
			color: #C25A00;
		}
		&.is-disabled {
			color: #999;
		}
	}
	.c-coupon__left {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
		width: 0;
		padding: 0 8rpx;
		text-align: center;
		.is-type3 & {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			flex: 1;
		}
	}
	.c-coupon__right {
		flex-shrink: 0;
		.is-type3 & {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 77rpx;
		}
	}
	.c-coupon__price {
		width: 100%;
		font-size: 32rpx;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 80rpx;
		.is-strong {
			font-size: 50rpx;
		}
	}

	.c-coupon__btn-go {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 62rpx;
		// height: 100%;
		height: 185rpx;
		padding: 0;
		writing-mode: vertical-lr;
		font-size: 28rpx;
		font-weight: bold;
		color: inherit;
		letter-spacing: 8rpx;
		.is-type3 & {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 124rpx;
			height: 40rpx;
			writing-mode: horizontal-lr;
			border: 1px solid currentColor;
			border-radius: 20rpx;
			line-height: 1;
			writing-mode: horizontal-tb;
			letter-spacing: 0;
		}
	}
	.c-coupon__condition {
		width: 100%;
		font-size: 24rpx;
		font-weight: bold;
		color: inherit;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
		.is-type1 & {
			color: #333;
		}
		.is-disabled & {
			color: #999;
		}
	}
	.c-coupon__desc {
		width: 100%;
		margin-top: 8rpx;
		font-size: 22rpx;
		color: inherit;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		.is-type1 & {
			color: #999;
		}
		.is-type3 & {
			margin-top: auto;
		}
	}
</style>
