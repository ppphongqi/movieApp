<template>
	<view class="shopping-cart">
		<!-- 操作区域 -->
		<view class="op-section" :class="cOpSectionClassStr">
			<!-- 中 -->
			<view class="op-section__center">
				<!-- 店铺logo -->
				<view class="op-section__logo-shop" @click="$emit('on-shop-logo-click')">
					<view v-if="cTotalData.num" class="op-section__total-num">{{cTotalData.num}}</view>
				</view>
				<!-- 店铺logo end -->
				<!-- 价格 -->
				<view v-if="cTotalData.num" class="price-wrapper">
					<view class="price-wrapper__row">
						<view class="price is-white"><text>￥</text><text class="is-strong">{{cTotalData.priceStr}}</text></view>
						<view class="price price--line"><text>￥{{cTotalData.priceLineStr}}</text></view>
					</view>
					<view v-if="cTotalData.priceStartingStr" class="price-wrapper__row">
						<view class="price"><text>起送价：￥{{cTotalData.priceStartingStr}}</text></view>
					</view>
				</view>
				<!-- 价格 end -->
				<!-- 暂无商品提示 -->
				<view v-else class="op-section_tip">暂无加入商品</view>
				<!-- 暂无商品提示 end -->
			</view>
			<!-- 中 end -->
			<!-- 右 -->
			<view v-if="cBtnGoVisible" class="op-section__right" @click="handleBtnGo">
				<button class="op-section__btn-go btn-normal">去结算</button>
			</view>
			<!-- 右 end -->
		</view>
		<!-- 操作区域 end -->
		<!-- 留出底部安全距离 -->
		<view class="app-container--safe-bottom"></view>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	export default {
		props: {
			store_id: {
				type: [String,Number],
				default: ''
			},
			// 商品列表
			goodsList: {
				type: Array,
				default() {
					return []
				}
			},
			// 总数
			num: {
				type: [String,Number],
				default: 0
			},
			// 总价
			price: {
				type: [String,Number],
				default: 0
			},
			// 划线价
			priceLine: {
				type: [String,Number],
				default: 0
			},
			// 起送价
			priceStarting: {
				type: [String,Number],
				default: 0
			},
		},
		data() {
			return {
				
			}
		},
		computed: {
			// 去结算按钮是否显示
			cBtnGoVisible() {
				return this.cTotalData.num > 0 &&　+this.cTotalData.priceStr >= +this.cTotalData.priceStartingStr
			},
			// 总计的一些信息
			cTotalData() {
				return {
					// 购物车商品总数
					num: +this.num || 0,
					// 最终价
					priceStr: this.price || '',
					// 原价
					priceLineStr: this.priceLine || '',
					// 起送价
					priceStartingStr: this.priceStarting || ''
				}
			},
			// 操作区域的class
			cOpSectionClassStr() {
				let classStr = ''
				if (!this.cTotalData.num) {
					classStr += ' is-no-goods'
				}
				return classStr
			}
		},
		methods: {
			// 去结算按钮点击事件
			handleBtnGo() {
				if (this.cTotalData.num > 0) {
					// 去购物车 页面参数为transport_type=40&cart_indexes=["690_0"]&isCart=1&is_express=0&is_zt=0&order_type=1&goods_type=&i=1
					const cart_indexes = (this.goodsList || []).map(item =>
						`${item.goods_id}_${item.goods_sku_id}`)
					if(!cart_indexes.length) {
						App.showError('暂无可下单商品')
						return
					}
					App.navigationTo({
						url: 'pages/subPages/flow/checkout?' + App.urlEncode({
							transport_type: 20,
							cart_indexes: JSON.stringify(cart_indexes),
							isCart: 1,
							order_type: 1,
							is_city: 1,
							store_id: this.store_id,
							cart_type: 'store_wm'
						})
					})
				}
			}
		}

	}
</script>

<style lang="scss" scoped>
	$op-height: 100rpx;
	$op-radius: $op-height/2;

	.shopping-cart {
		box-sizing: border-box;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding-bottom: 130rpx;
		z-index: 206;
	}

	.op-section {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 690rpx;
		margin: 0 auto;
		background-color: #333;
		border-radius: $op-radius;
		z-index: 210;
	}

	.op-section__left {
		position: relative;

		&::after {
			position: absolute;
			right: 0;
			top: 50%;
			display: block;
			content: "\20";
			width: 1px;
			height: 59rpx;
			transform: translateY(-50%);
			background-color: rgba($color: #FFD940, $alpha: 0.5);
		}
	}

	.op-section__btn-contact {
		position: relative;
		box-sizing: border-box;
		height: 100%;
		width: 138rpx;
		height: $op-height;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: $op-radius 0 0 $op-radius;
	}

	.op-section__btn-contact__img {
		width: 40rpx;
		height: 40rpx;
	}

	.op-section__btn-contact__img__text {
		color: #FFD940;
		font-size: 20rpx;
	}

	.op-section__btn-go {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 140rpx;
		height: $op-height;
		font-weight: bold;
		color: #333333;
		font-size: 28rpx;
		border-radius: 0 $op-radius $op-radius 0;
		background: linear-gradient(-90deg, #FBAE34 0%, #FCCF5D 100%);
	}

	.op-section__center {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0;
		padding-left: 28rpx;
		height: $op-height;
	}

	.op-section__logo-shop {
		position: relative;
		top: -20rpx;
		flex-shrink: 0;
		width: 100rpx;
		height: 100rpx;
		background-image: url(../static/images/express-box.png);
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;

		.is-no-goods & {
			background-image: url(../static/images/express-box--disabled.png);
		}
	}

	.op-section__total-num {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 30rpx;
		min-width: 30rpx;
		padding: 0 4rpx;
		font-size: 20rpx;
		color: #fff;
		background-color: #FF4444;
		border-radius: 15rpx;
		transform: translateX(50%);
	}

	.price-wrapper {
		padding-left: 14rpx;
	}

	.price-wrapper__row {
		display: flex;
		align-items: flex-end;
	}

	.price {
		color: #999;
		font-size: 24rpx;

		&.is-white {
			color: #fff;
		}

		.is-strong {
			font-weight: bold;
			font-size: 28rpx;
			line-height: 1;
		}
	}

	.price--line {
		margin-left: 8rpx;
		text-decoration: line-through;
	}

	.op-section_tip {
		width: 100%;
		font-size: 28rpx;
		color: #fff;
		text-align: center;
	}
</style>
