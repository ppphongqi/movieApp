<template>
	<popup-view class="shopping-cart-goods-popup" :show="show" type="bottom" :overlay="true" @clickmask="$emit('on-mask-click')">
		<view class="cart-goods-section">
			<!-- 折扣已减多少钱 -->
			<!-- <view class="cart-goods-section__header">折扣已减{{cTotalData.priceSaveStr}}元</view> -->
			<view class="cart-goods-section__header"></view>
			<!-- 折扣已减多少钱 end -->
			<!-- 商品总数 -->
			<view class="cart-goods-section__op">
				<view class="cart-goods-section__total">购物车<text class="is-small">(共{{cTotalData.num}}件商品)</text></view>
				<view class="cart-goods-section__btn-clear" @click="handleBtnClearClick">
					<view class="iconfont is-inline icon-shanchu1"></view>清空购物车
				</view>
			</view>
			<!-- 商品总数 end -->
			<scroll-view class="cart-goods-section__scroll" scroll-y>
				<view class="cart-goods-list">
					<view v-for="item in cListData" :key="item.id" class="cart-goods-item" :class="{'is-disabled': item.disabled}">
						<view class="cart-goods-item__content">
							<view class="cart-goods-item__left">
								<image class="cart-goods-item__img" :src="item.imgUrl" />
								<view v-if="item.disabled" class="cart-goods-item__mask">
									<view class="cart-goods-item__mask__content">
										<view class="cart-goods-item__mask__text">不可下单</view>
										<view class="cart-goods-item__mask__line"></view>
									</view>
								</view>
							</view>
							<view class="cart-goods-item__center">
								<view class="cart-goods-item__title">{{item.title}}</view>
								<label-member-price v-if="item.priceSaveVisible" containerStyle="margin-top: 8rpx;" :label="memberDiyFont.member_font"
								 :pricePrefix="memberDiyFont.discount_font" :priceStr="item.priceSaveStr" />
								<view class="goods-price"><text class="is-red">￥</text><text class="is-strong is-red">{{item.priceStr}}</text><text
									 class="is-del">￥{{item.priceLine}}</text></view>
							</view>
							<view class="cart-goods-item__right">
								<view class="cart-goods-item__total">已售{{item.saleNum}}件</view>
								<good-input-number :value="item.num" @input="handleGoodsNumChange($event,item)" />
							</view>
						</view>
						<view class="cart-goods-item__footer">
							<goods-tip v-if="item.tip" :tip="item.tip" containerStyle="padding-bottom: 24rpx;" />
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 留出底部安全距离 -->
			<view class="app-container--safe-bottom"></view>
		</view>
	</popup-view>
</template>

<script>
	import PopupView from "@/components/template/PopManager.vue"
	import LabelMemberPrice from './LabelMemberPrice.vue'
	import GoodInputNumber from './GoodInputNumber.vue'
	import GoodsTip from './GoodsTip.vue'
	export default {
		components: {
			PopupView,
			LabelMemberPrice,
			GoodInputNumber,
			GoodsTip
		},
		props: {
			// 是否显示
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				value: 10
			}
		},
		computed: {
			// 购物车商品接口信息
			cCartGoodsListRes() {
				return this.$store.state.cgp.cartGoodsListRes || {
					goods_rows: []
				}
			},
			//总计的一些数据
			cTotalData() {
				return {
					// 折扣已减多少钱
					priceSaveStr: this.cCartGoodsListRes.total_member_coupon_price > 0 ? this.cCartGoodsListRes.total_member_coupon_price :
						0,
					// 商品总数
					num: +this.cCartGoodsListRes.goods_total_num || 0
				}
			},
			// 商品列表数据
			cListData() {
				// return [
				// 	{
				// 		id: 'goods01',
				// 		title: '披萨1份 约400g披萨1份 约400g披萨1份 约400g披萨1份 约400g披萨1份 约400g披萨1份 约400g披萨1份 约400g',
				// 		imgUrl: 'http://placekitten.com/114/114',
				// 		priceSale: '3.0',
				// 		priceStr: '0.1',
				// 		priceLine: '20.00',
				// 		saleNum: 2258,
				// 		num: 1,
				// 		disabled: false,
				//		styleStr: ''
				// 	}
				// ]
				return (this.cCartGoodsListRes.goods_rows || []).map(item => ({
					id: item.goods_id,
					// 商品规格id
					goods_sku_id: item.goods_sku_id,
					// 商品名称
					title: item.goods_name,
					// 商品图片
					imgUrl: item.image,
					// 商品节省价格是否可见
					priceSaveVisible: item.member_coupon_price > 0 && +item.is_member_price === 1,
					// 商品节省价格
					priceSaveStr: item.member_coupon_price,
					// 商品价格
					priceStr: item.goods_price,
					// 商品划线价
					priceLine: item.line_price,
					// 商品已售数量
					saleNum: item.goods_sales,
					// 商品购物车数量
					num: item.goods_num,
					// 商品是否disabled
					disabled: !!item.tip,
					// 商品的提示
					tip: item.tip
				}))
			}
		},
		methods: {
			// 修改商品数量
			handleGoodsNumChange(num, goods = {}) {
				this.$store.dispatch('cgp/doUpdateCart', {
					goods_id: goods.id,
					goods_sku_id: goods.goods_sku_id,
					all_num: num
				})
			},
			// 清空购物车按钮点击事件
			async handleBtnClearClick() {
				// 锁
				if (this.handleBtnClearClickLock) {
					return
				}
				this.handleBtnClearClickLock = true
				uni.showLoading({
					title: '请稍候...',
					mask: true
				})
				try {
					const res = await this.$store.dispatch('cgp/clearCartGoodsListRes')
					uni.hideLoading()
					uni.showToast({
						title: res.msg || '清空成功！',
						icon: 'none'
					})
					// 偷懒 通过这种方式 让弹出框关闭
					this.$emit('on-mask-click')
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
				this.handleBtnClearClickLock = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cart-goods-section {
		box-sizing: border-box;
		width: 100vw;
		background-color: #fff;
		padding-bottom: 230rpx;
		border-radius: 20rpx 20rpx 0 0;
	}

	.cart-goods-section__header {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60rpx;
		font-size: 24rpx;
		color: #333;
		background-color: #FFF9E1;
		border-radius: 20rpx 20rpx 0 0;
	}

	.cart-goods-section__op {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		padding: 0 30rpx;
		border-bottom: 1rpx solid #eee;
	}

	.cart-goods-section__total {
		font-size: 28rpx;
		color: #333;

		.is-small {
			font-size: 24rpx;
			color: #999;
		}
	}

	.cart-goods-section__btn-clear {
		font-size: 24rpx;
		color: #333;

		.iconfont {
			margin-right: 8rpx;
		}
	}

	.cart-goods-section__scroll {
		max-height: 600rpx;
	}

	// 商品列表
	.cart-goods-list {
		padding: 0 30rpx 30rpx 30rpx;
	}

	.cart-goods-item {
		&+& {
			border-top: 1px solid #eee;
		}
	}

	.cart-goods-item__content {
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		padding: 30rpx 0;

	}

	.cart-goods-item__left {
		position: relative;
		font-size: 0;
	}

	.cart-goods-item__mask {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10rpx;
		background-color: rgba($color: #ffffff, $alpha: 0.5);
	}

	.cart-goods-item__mask__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 90rpx;
		height: 90rpx;
		font-size: 18rpx;
		color: #DDDDDD;
		border-radius: 50%;
		background-color: rgba($color: #000000, $alpha: 0.7);
	}

	.cart-goods-item__mask__line {
		position: relative;
		width: 50rpx;
		height: 1px;
		font-size: 0;
		margin-top: 10rpx;
		background-color: #DDDDDD;

		&::after {
			position: absolute;
			left: 50%;
			top: 50%;
			display: block;
			content: "\20";
			width: 8rpx;
			height: 8rpx;
			background-color: #DDDDDD;
			transform: translate(-50%, -50%);
			border-radius: 50%;
		}
	}

	.cart-goods-item__img {
		width: 114rpx;
		height: 114rpx;
		border-radius: 10rpx;
	}

	.cart-goods-item__center {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1;
		margin-left: 16rpx;

		.is-disabled & {
			opacity: 0.5;
		}
	}

	.cart-goods-item__title {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.goods-price {
		margin-top: auto;
		font-size: 24rpx;
		color: #999;

		.is-red {
			color: #FF4444;
		}

		.is-strong {
			font-size: 32rpx;
			font-weight: bold;
			line-height: 1;
		}

		.is-del {
			margin-left: 8rpx;
			text-decoration: line-through;
		}
	}

	.cart-goods-item__right {
		display: flex;
		flex-direction: column;
		margin-left: 16rpx;
	}

	.cart-goods-item__total {
		margin-bottom: auto;
		font-size: 24rpx;
		color: #999;
		text-align: right;
	}

	// 商品列表 end
</style>
