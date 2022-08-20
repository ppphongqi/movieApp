<template>
	<view class="goods-v2" :class="cGoodsV2ClassStr">
	<view class="goods-v2-list 66">
		<!-- 商品项 -->
		<view class="goods-v2-item" v-for="(item,index) in itemData" @click="toGoodsInfo(item)" :key="index">
			<view class="goods-v2-item__img-wrapper">
				<!-- 商品图 -->
				<image class="goods-v2-item__img" :src="item.goods_image"></image>
				<view v-if="item.has_sale===1" class="goods-v2-item__sale-out-wrapper">
					<image class="good-v2-item__img-sale-out" :src="getImageRoot('86.png')" mode="widthFix"></image>
				</view>
				<!--  赚多少钱 -->
				<view v-if="item.dealer_tip && item.dealer_money>0" class="goods-v2-item__price-earn-v2 price-font-family">{{itemStyle.commission || '返'}}:¥{{item.dealer_money}}</view>
				<text v-if="item.width && isNeibor===1" class="f-20 gap-box">
					<text v-if="item.width < 1">{{item.width*1000}}m</text>
					<text v-else>{{item.width}}km</text>
				</text>
			</view>
			<view class="goods-v2-item__content">
				<!-- 标题 -->
				<view class="goods-v2-item__title">{{item.goods_name}}
					<!-- <view v-if="cRefsVisible.labelRecommend" class="goods-v2-item__label-recommend">推荐</view>{{item.name}} -->
				</view>
				<view class="goods-v2-handle-wrapper">
					<view class="goods-v2-price-wrapper__left">
						<!-- 会员标签 cRefsVisible.labelMemberInHandle && -->
						<view class="goods-v2-item__member_box">
							<view v-if="item.is_member_price===1" class="goods-v2-item__member">
								<view class="goods-v2-item__member-name">{{memberDiyFont.member_font}}</view>{{memberDiyFont.discount_font}}¥{{item.coupon_price}}
							</view>
						</view>
						<!-- 赚多少钱 -->
						<!-- <view v-if="cRefsVisible.priceEarnUpper  && itemStyle.charges == '1' && item.priceEarn>0" class="goods-v2-item__price-earn">{{itemStyle.commission}}:¥{{item.priceEarn}}</view> -->
						<view class="goods-v2-price-row">
							<!-- 售价 -->
							<view class="goods-v2-price  price-font-family">
								￥<view class="goods-v2-price_num num-height-1" style="max-width:100upx;">{{ item.goods_price }}</view>
							</view>
							<!-- 阶梯价 -->
							<view v-if="item.is_step_price === 1" class="f-18" style="color: #ff4444; position: relative;top: 1rpx;">起</view>
							<!-- 划线价 -->
							<view class="goods-v2-price is-del m-left12 price-font-family">￥<view
								 class="goods-v2-price_num">{{item.line_price}}</view>
							</view>
							<!-- 赚多少钱 -->
							<!-- <view v-if="cRefsVisible.priceEarnAfter  && itemStyle.charges == '1' && item.priceEarn>0" class="goods-v2-item__price-earn m-left12" style="transform: translateY(-4rpx);">{{itemStyle.commission}}:¥{{item.priceEarn}}</view> -->
						</view>
					</view>
					<view class="goods-v2-price-wrapper__right">
						<!-- 销售数量 cRefsVisible.textSales && -->
						<view v-if="item.is_sales == 1" class="goods-v2-item__sales">已售{{item.goods_sales}}</view>
						<!-- 购买按钮 -->
<!-- 						<view v-if="cRefsVisible.btnBuy" class="goods-v2-item__btn-buy m-top12">购买</view> -->
					</view>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
export default {
    data() {
        return {
            cartTotal: '',
            currentIndex: 1
        }
    },
    props: {
        isNeibor: Number,
        // itemStyle: Object,
        // params: Object,
        // itemData: Array,
        // 原始的接口数据(兼容以前组件的处理方式，所以这里只用传原始数据)
        params: {
			    type: Object,
			    default() {
			        return {}
			    }
        },
        // 商品列表
        itemData: {
			    type: Array,
			    default() {
			        return []
			    }
        },
        // 各元素的样式
        itemStyle: {
			    type: Object,
			    default() {
			        return {}
			    }
        }
    },
    mounted() {
        console.log('********************///////', this.itemData)
    },
    computed: {
        icontext() {
            return text => !!text && text.length > 2 ? text.substring(0, 2) : text
        },
        cGoodsType() {
			    const display = this.$util.deepGet(this.itemStyle, 'display', '') || '1-2' // 3、4 正方形 1-2、1-3长方形
            console.log('displaydisplaydisplaydisplaydisplaydisplaydisplay', display)
            // 正方形
            if (display === '3' || display === '4') {
                return '2'
            }
            // 长方形

            return '2 is-goods-rectangle'

        },
        // 最外层容器的classStr
        cGoodsV2ClassStr() {
			    return ` is-goods-type-${this.cGoodsType}`
        }
    },
    methods: {
        addCart(goods_id, goods_sku_id, goods) {
            let _this = this
            App._get('cart/add', {
                goods_id,
                goods_sku_id
            }, result => {
                if (result.code === 1) {
                    _this.cartTotal = result.data.cart_total_num
                    this.$emit('number', _this.cartTotal)
                    App.showSuccess('已加入购物车')
                }
            })
        },
        swiperChange(e) {
            this.currentIndex = Number(e.detail.current) + 1
        },
        scrollViewHeight(margincol, isRect) {
            return uni.upx2px(isRect ? 400 : 500) + margincol * 2
        },
        toGoodsInfo(goodsInfo) {
            console.log(goodsInfo)
            // activity_type 1秒杀 2拼团
            let {
                    goods_id,
                    activity_type,
                    spike_id,
                    group_id,
                    is_member_price
                } = goodsInfo,
                activityId = {
                    '1': 'spike_id',
                    '2': 'group_id',
                    '4': 'bargain_id'
                },
                goodsParams = {
                    goods_id
                }
            if (activity_type !== 0) {
                goodsParams[activityId[activity_type]] = goodsInfo[activityId[activity_type]]
            } else if (is_member_price === 1) {
                goodsParams.goods_type = 'member_goods'
            }
            // console.log(goodsParams);
            goodsParams = this.$util.removeEmpty(goodsParams)
            App.navigationTo({
                url: 'pages/subPages/goods/index/index?' + App.urlEncode(goodsParams)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
	.goods-v2-item__sale-out-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,.5);
		z-index: 9;
	}
	.good-v2-item__img-sale-out {
		height: 100rpx;
		.is-goods-type-2 & {
			width: 170rpx;
			height: 143rpx;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
		}
		.is-goods-type-2.is-goods-rectangle &,
		.is-goods-type-5.is-goods-rectangle &{
			width: 121rpx;
			height: 103rpx;
		}

	}
	// .goods_over_img{
	// 	position: absolute;
	// 	top: 0;
	// 	left: 0;
	// 	right: 0;
	// 	bottom: 0;
	// 	z-index: 1;
	// 	background-repeat: no-repeat;
	// 	background-position: center center;
	// 	background-size: auto 80%;
	// }
	.gap-box{
		background-color: var(--theme-color);
		color: var(--auxiliary-color);
		position: absolute;
		right: 0;
		bottom: 0;
		padding: 0 10upx;
	}
	.goods-v2 {
		position: relative;
		box-sizing: border-box;
		padding: 0 30rpx;
		margin-top: 10rpx;
		margin-bottom: 30rpx;

	}

	// 商品列表（一共有7种风格）
	.goods-v2-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.is-goods-type-3 & {
			justify-content: flex-start;
			padding-left: 8rpx;
			padding-right: 8rpx;
			padding-bottom: 16rpx;
		}

		.is-header-type-3 & {
			position: relative;
			z-index: 5;
			margin-top: -20rpx;
		}
	}

	.goods-v2-item {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 10rpx;
		margin-top: 20rpx;
		.is-goods-type-2 & {
			width: 335rpx;
		}
	}

	.goods-v2-item__img-wrapper {
		position: relative;
		width: 100%;

		.is-goods-type-2 & {
			height: 335rpx;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
			overflow: hidden;
		}

		.is-goods-type-2.is-goods-rectangle & {
			height: 188rpx;
			overflow: hidden;
		}
	}
	.goods-v2-item__img {
		width: 100%;
		height: 100%;
		.is-goods-type-2 & {
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
		}
	}

	.goods-v2-item__price-earn-v2 {
		position: absolute;
		left: 0;
		top: 0;
		height: 34rpx;
		padding: 0 11rpx;
		line-height: 34rpx;
		font-size: 22rpx;
		color: #fff;
		white-space: nowrap;
		background: linear-gradient(-50deg, rgba(255, 68, 68, 0.9) 0%, rgba(253, 113, 55, 0.9) 100%);
		border-top-left-radius: 10rpx;
		border-bottom-right-radius: 14rpx;
		z-index: 5;
	}

	.goods-v2-item__distance {
		position: absolute;
		right: 0;
		bottom: 0;
		display: inline-flex;
		align-items: center;
		height: 40rpx;
		padding: 0 14rpx;
		font-size: 24rpx;
		color: #fff;
		background-color: rgba($color: #000000, $alpha: 0.3);
	}

	.goods-v2-item__content {
		flex: 1;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 10rpx;
		padding-bottom: 18rpx;
	}

	.goods-v2-item__title {
		box-sizing: border-box;
		height: 2.8em;
		margin: 8rpx 0;
		color: #333;
		font-size: 28rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.goods-v2-item__label-recommend {
		display: inline-block;
		height: 28rpx;
		padding: 0 6rpx;
		margin-right: 4rpx;
		font-size: 20rpx;
		color: #333333;
		line-height: 28rpx;
		background-color: #F6D246;
		transform: translateY(-2rpx);
	}
	.goods-v2-handle-wrapper {
		box-sizing: border-box;
		display: flex;
		align-items: flex-end;
		padding-top: 0;
		margin-top: auto;
	}
	.goods-v2-item__member_box{
		height: 30rpx;
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		font-size: 20rpx;
	}
	.goods-v2-item__member {
		background-color: #333;
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		color: #fff;
		border-radius: 4rpx;
		padding-right: 9rpx;
		font-size: 20rpx;
		overflow: hidden;
	}

	.goods-v2-item__member-name {
		position: relative;
		color: #333;
		height: 100%;
		padding: 0 7rpx;
		margin-right: 16rpx;
		background-color: #EED196;
		border-top-left-radius: 4rpx;
		border-bottom-left-radius: 4rpx;

		&::after {
			position: absolute;
			top: 0;
			left: 100%;
			display: block;
			content: '\20';
			width: 0;
			height: 0;
			border-bottom: 30rpx solid #EED196;
			border-right: 8rpx solid transparent;
		}
	}

	.goods-v2-price-row {
		display: flex;
		align-items: center;
		line-height: 1;
		margin-top: 16rpx;
		.goods-v2-item__member+& {

		}
	}

	.goods-v2-price {
		display: flex;
		align-items: center;
		color: #FF4444;
		font-size: 28rpx;

		.is-goods-type-2 &,
		.is-goods-type-3 &,
		.is-goods-type-5 & {
			font-size: 24rpx;
		}

		&.is-del {
			color: #999;
			font-weight: normal;
			font-size: 24rpx;
			text-decoration: line-through;

			.goods-v2-price_num {
				transform: translateY(0);
				font-size: 1em;
			}
		}
	}

	.goods-v2-price_num {
		font-size: 1.286em;
	}

	.goods-v2-price-wrapper__right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		margin-left: auto;
	}

	.goods-v2-price-wrapper__left {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-right: auto;
	}

	.goods-v2-item__price-earn {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 28rpx;
		padding: 0 8rpx;
		font-size: 20rpx;
		color: #FF4444;
		border: 1px solid currentColor;
		border-radius: 4rpx;
		background-color: rgba($color: #FF4444, $alpha: 0.1);
	}

	.goods-v2-item__btn-buy {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 90rpx;
		height: 40rpx;
		padding: 0 8rpx;
		font-size: 24rpx;
		background-color: var(--theme-color,#FFD940);
		color: var(--auxiliary-color,#fff);
		border-radius: 2rpx;
	}

	.goods-v2-item__sales {
		font-size: 22rpx;
		color: #888;
		white-space: nowrap;
	}

	// 商品列表

	// 滚动的商品列表
	.goods-v2-list-scroll {
		display: block;
		width: 100%;

		.goods-v2-list {
			display: inline-flex;
			flex-wrap: nowrap;
			padding: 0 30rpx;
		}

		.goods-v2-item {
			display: inline-flex;
			width: 324rpx;

			&+.goods-v2-item {
				margin-left: 20rpx;
			}
		}
	}

	// 滚动的商品列表
</style>
