<template>
	<view>
		<!-- 风格一 -->
		<block v-if="itemStyle.display === '1'">
			<block v-for="(goods,index) in itemData" :key="goods.goods_id">
				<view class="diy-goods-list goods-type-3" :style="{'padding':itemStyle.margincol+'px '+itemStyle.marginrow+'px'}">
					<view class="diy-goods-item" @click="toGoodsInfo(goods)">
						<view class="goods-item-img" :class="{'sale-out':goods.stock_num === 0}">
							<!-- <view class="goods-item-label" v-if="itemStyle.icon === '2'">推荐</view> -->
							<view class="image" :style="{'background-image':'url('+goods.goods_image+')'}"></view>
							<!-- <view class="goods-item-users" v-if="itemStyle.user === 1">
								<view class="iconfont icon-hotfill"></view>
								<view class="user-title">参与</view>
								<view class="user-list">
									<image src="https://img.hipintuan.cn/images/2/2018/11/sShyMqDH7vds8LkkHOsMDKMMFd9ZlV.jpg"></image>
									<image src="https://img.hipintuan.cn/images/2/2018/11/sShyMqDH7vds8LkkHOsMDKMMFd9ZlV.jpg"></image>
									<image src="https://img.hipintuan.cn/images/2/2018/11/sShyMqDH7vds8LkkHOsMDKMMFd9ZlV.jpg"></image>
								</view>
							</view> -->
						</view>
						<view class="goods-item-content">
							<!-- <view class="goods-item-store">
							<view class="goods-item-store-name">店铺名称</view>
							<view class="goods-item-store-distance">999m</view>
						</view> -->
							<view class="goods-item-title dis-flex flex-y-center">
								<view class="twolist-hidden">
									<view class="title-label" v-if="itemStyle.icon === '2'">{{itemStyle.icontext}}</view>{{goods.goods_name}}
								</view>
							</view>
							<view class="goods-item-info">
								<view class="goods-item-money">
									<view class="goods-item-money-now price-font-family">
										{{settingData.currency}}{{goods.goods_price}}
										<view class="f-24  money col-3 main-bg-color auxiliary-color" v-if="goods.dealer_money>0 && goods.dealer_tip">
											返 <text class="col-f auxiliary-color "> {{settingData.currency}}{{goods.dealer_money}}</text>
										</view>
										<view class="dis-flex flex-y-center" v-if="goods.is_member_price===1">
											<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
											<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">{{memberDiyFont.discount_font}}<text class="member-coupon-price">{{goods.coupon_price}}</text>元</view>
										</view>
									</view>
									<view class="goods-item-buy help-bg-color  " :class="{'sale-out':goods.stock_num === 0}" v-if="itemStyle.buybtn === '1'">
										<view>{{itemStyle.btntext}}</view>
									</view>
									<view class="shoppIng-main" :class="{'sale-out':goods.stock_num === 0}" v-if="itemStyle.cart === '1'">
										<image @click.stop="addCart(goods['goods_id'],goods.goods_sku_id,goods)" src="../../../static/images/goods/cartone.png"
										 mode="widthFix" style="width: 40px;"></image>
										<view class="cart-num col-f f-24">{{goods['cart_num']}}</view>
									</view>
								</view>
								<view class="goods-item-num">
									<view class="goods-item-money-old f-24">
										<block v-if="itemStyle.line_price===undefined?true:(itemStyle.line_price==='2')">
											{{settingData.currency}}{{goods.line_price}}
										</block>
									</view>
									<view class="goods-item-already">
										<block v-if="itemStyle.goods_sales===undefined?true:(itemStyle.goods_sales==='2')">
											{{goods.goods_sales}}人购买
										</block>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</block>
		<!-- 风格二 -->
		<block v-if="itemStyle.display === '1-1'">
			<view class="diy-goods-list goods-type-3" :style="{'padding':itemStyle.margincol+'px 0'}">
				<view class="diy-goods-list-swiper">
					<view class="swiper-title" :style="{'padding':'0 '+itemStyle.marginrow+'px'}">
						<view class="swiper-title-contnet flex-box">
							<view class="swiper-title-main">{{itemStyle.title}}
								<view class="title-icon"></view>
							</view>
							<view class="swiper-title-minor">{{itemStyle.subtitle}}</view>
						</view>
						<view class="swiper-title-index"><text class="text">{{currentIndex}} </text> /{{itemData.length}}</view>
					</view>
					<swiper :autoplay="true" :interval="5000" :circular="true" @change="swiperChange">
						<swiper-item v-for="(goods,index) in itemData" :key="goods.goods_id">
							<view class="diy-goods-item" @click="toGoodsInfo(goods)" :style="{'padding':'0 '+itemStyle.marginrow+'px'}">
								<view class="goods-item-img" :class="{'sale-out':goods.stock_num === 0}">
									<!-- <view class="goods-item-label" v-if="itemStyle.icon === '2'">推荐</view> -->
									<view class="image" :style="{'background-image':'url('+goods.goods_image+')'}"></view>
									<view class="goods-item-users" v-if="itemStyle.user === 1">
										<view class="iconfont icon-hotfill"></view>
										<view class="user-title">参与</view>
										<view class="user-list">
											<image src="https://img.hipintuan.cn/images/2/2018/11/sShyMqDH7vds8LkkHOsMDKMMFd9ZlV.jpg"></image>
											<image src="https://img.hipintuan.cn/images/2/2018/11/sShyMqDH7vds8LkkHOsMDKMMFd9ZlV.jpg"></image>
											<image src="https://img.hipintuan.cn/images/2/2018/11/sShyMqDH7vds8LkkHOsMDKMMFd9ZlV.jpg"></image>
										</view>
									</view>
									<!-- 返好多钱 -->
									<view v-if="goods.dealer_tip && goods.dealer_money>0 && itemStyle.charges == '1'" class="goods-v2-item__price-earn-v2 price-font-family">返:{{settingData.currency}}{{goods.dealer_money}}</view>
								</view>
								<view class="goods-item-content">
									<!-- <view class="goods-item-store">
										<view class="goods-item-store-name">店铺名称</view>
										<view class="goods-item-store-distance">999m</view>
									</view> -->
									<view class="goods-item-title dis-flex flex-y-center">
										<view class="twolist-hidden">
											<view class="title-label" v-if="itemStyle.icon === '2'">{{itemStyle.icontext}}</view>{{goods.goods_name}}
										</view>
									</view>
									<view class="goods-item-info">
										<view class="goods-item-money">
											<view class="goods-item-money-now price-font-family">{{settingData.currency}}{{goods.goods_price}}
											<!-- <view class="f-24 col-3 money" v-if="goods.dealer_money>0 && goods.dealer_tip">
												返 <text class="col-f auxiliary-color "> {{settingData.currency}}{{goods.dealer_money}}</text>
											</view> -->
												<view class="dis-flex flex-y-center" v-if="goods.is_member_price===1">
													<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
													<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">{{memberDiyFont.discount_font}}<text class="member-coupon-price">{{goods.coupon_price}}</text>元</view>
												</view>
											</view>
											<view class="goods-item-buy  help-bg-color" :class="{'sale-out':goods.stock_num === 0}" v-if="itemStyle.buybtn === '1'">
												<view>{{itemStyle.btntext}}</view>
											</view>
											<view class="shoppIng-main" :class="{'sale-out':goods.stock_num === 0}" v-if="itemStyle.cart === '1'">
												<image @click.stop="addCart(goods['goods_id'],goods.goods_sku_id,goods)" src="../../../static/images/goods/cartone.png"
												 mode="widthFix" style="width: 40px;"></image>
												<view class="cart-num col-f f-24">{{goods['cart_num']}}</view>
											</view>
										</view>
										<view class="goods-item-num">
											<view class="goods-item-money-old f-24 t-through">
												<block v-if="itemStyle.line_price===undefined?true:(itemStyle.line_price==='2')">
												<text class="">{{settingData.currency}}{{goods.line_price}}</text>
												</block>
											</view>
											<view class="goods-item-already">
												<block v-if="itemStyle.goods_sales===undefined?true:(itemStyle.goods_sales==='2')">
													{{goods.goods_sales}}人购买
												</block>
											</view>
										</view>
									</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</block>

		<!-- 风格三 -->
		<block v-if="itemStyle.display === '2'">
			<block v-for="(goods,index) in itemData" :key="index">
				<view class="diy-goods-list goods-type-1" :style="{'padding':itemStyle.margincol+'px '+itemStyle.marginrow+'px'}">
					<view class="diy-goods-item" @click="toGoodsInfo(goods)">
						<view class="goods-item-img " :class="{'sale-out':goods.stock_num === 0}">
							<view class="goods-item-label" v-if="itemStyle.icon === '2'">{{itemStyle.icontext}}</view>
							<view class="image" :style="{'background-image':'url('+goods.goods_image+')'}"></view>
						</view>
						<view class="goods-item-content">
							<view class="goods-item-title twolist-hidden">{{goods.goods_name}}</view>
							<view class="dis-flex flex-y-center" >
								<view class="dis-flex flex-y-center"  v-if="goods.is_member_price===1">
									<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
									<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">{{memberDiyFont.discount_font}}<text class="member-coupon-price">{{goods.coupon_price}}</text>元</view>
								</view>


								<view class="f-24 col-3 money" v-if="goods.dealer_money>0 && itemStyle.charges == 1" style="height:30rpx;line-height: 30rpx;">
									返 <text class="col-f auxiliary-color"> {{settingData.currency}}{{goods.dealer_money}}</text>
								</view>
							</view>

							<view class="goods-item-info">
								<view class="goods-item-money">
									<view class="goods-item-money-now">
										{{settingData.currency}}{{goods.goods_price}}

										<text class="goods-item-money-old t-through f-24">
											<block v-if="itemStyle.line_price===undefined?true:(itemStyle.line_price==='2')">
												{{settingData.currency}}{{goods.line_price}}
											</block>
										</text>

									</view>
									<!-- <view class="goods-item-sale">已售{{goods.goods_sales}}</view> -->
								</view>
								<view class="goods-item-buy help-bg-color" :class="{'sale-out':goods.stock_num === 0}" v-if="itemStyle.buybtn === '1'">
									<view>{{itemStyle.btntext}}</view>
								</view>
								<view class="shoppIng-main" :class="{'sale-out':goods.stock_num === 0}" v-if="itemStyle.cart === '1'">
									<image src="../../../static/images/goods/cartone.png" @click.stop="addCart(goods['goods_id'],goods.goods_sku_id,goods)"
									 mode="widthFix" style="width: 40px;"></image>
									<view class="cart-num col-f f-24">{{goods['cart_num']}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</block>

		<!-- 风格四 -->
		<block v-if="itemStyle.display === '3' || itemStyle.display === '1-2'">
			<view class="diy-goods-list goods-type-2" :style="{'padding':'0 '+(itemStyle.marginrow/2)+'px'}">
				<view class="diy-goods-item" v-for="(goods,index) in itemData" :key="goods.goods_id" @click="toGoodsInfo(goods)"
				 :style="{'padding':itemStyle.margincol+'px '+(itemStyle.marginrow/2)+'px'}">
					<view class="goods-item-img" :class="{'sale-out':goods.stock_num === 0,'img-rect':itemStyle.display === '1-2'}">
						<view class="goods-item-label" v-if="itemStyle.icon === '2'">{{itemStyle.icontext}}</view>
						<view class="image" :style="{'background-image':'url('+goods.goods_image+')'}"></view>
					</view>
					<view class="goods-item-content">
						<view class="goods-item-title twolist-hidden">{{goods.goods_name}}</view>
						<view class="goods-item-info">
							<view class="goods-item-money">
								<view class="goods-item-money-now">
									{{settingData.currency}}{{goods.goods_price}}

									<view class="dis-flex flex-y-center" v-if="goods.is_member_price===1">
										<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
										<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">{{memberDiyFont.discount_font}}<text class="member-coupon-price">{{goods.coupon_price}}</text>元</view>
									</view>
								</view>
								<view class="dis-flex flex-x-between m-top10">
									<view class="goods-item-money-old f-24 dis-flex flex-x-between flex-y-center">
										<block v-if="itemStyle.line_price===undefined?true:(itemStyle.line_price==='2')">
											<view class="t-through">{{settingData.currency}}{{goods.line_price}}</view>
										</block>
										<view class="f-24 col-3 money" v-if="goods.dealer_money>0 && itemStyle.charges == '1'">
											返 <text class="col-f auxiliary-color"> {{settingData.currency}}{{goods.dealer_money}}</text>
										</view>
									</view>
									<view class="goods-item-sale">
										<block v-if="itemStyle.goods_sales===undefined?true:(itemStyle.goods_sales==='2')">
											已售{{goods.goods_sales}}
										</block>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>

		<!-- 风格五 -->
		<block v-if="itemStyle.display === '4' || itemStyle.display === '1-3'">
			<view class="diy-goods-list goods-type-5">
				<scroll-view scroll-x="true" enable-flex="true" class="goods-scroll-view" :style="{'height':scrollViewHeight(itemStyle.margincol,itemStyle.display === '1-3')+'px','padding-left':itemStyle.marginrow/2+'px'}">
					<view class="dis-flex flex-y-center">
						<block v-for="(goods,index) in itemData" :key="goods.goods_id">
							<view class="diy-goods-item" @click="toGoodsInfo(goods)" :style="{'padding':itemStyle.margincol+'px '+(itemStyle.marginrow/2)+'px '+itemStyle.margincol+'px '+(itemStyle.marginrow/2)+'px','margin-right':(index===itemData.length - 1?itemStyle.marginrow/2:0)+'px'}">
								<view class="goods-item-img" :class="{'sale-out':goods.stock_num === 0,'img-rect':itemStyle.display === '1-3'}">
									<view class="goods-item-label" v-if="itemStyle.icon === '2'">{{icontext(itemStyle.icontext)}}</view>
									<view class="image" :style="{'background-image':'url('+goods.goods_image+')'}"></view>
								</view>
								<view class="goods-item-content">
									<view class="goods-item-title twolist-hidden">{{goods.goods_name}}</view>
									<view class="goods-item-info">
										<view class="goods-item-money">
											<view class="goods-item-money-now">{{settingData.currency}}{{goods.goods_price}}
												<view class="dis-flex flex-y-center" v-if="goods.is_member_price===1">
													<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
													<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">{{memberDiyFont.discount_font}}<text class="member-coupon-price">{{goods.coupon_price}}</text>元</view>
												</view>
											</view>
											<view class="dis-flex flex-x-between flex-y-center">
												<view class="dis-flex flex-x-between flex-y-center">
													<view class="goods-item-money-old t-through f-24">
														<block v-if="itemStyle.line_price===undefined?true:(itemStyle.line_price==='2')">
															{{settingData.currency}}{{goods.line_price}}
														</block>
													</view>
													<view class="f-24 col-3 money main-bg-color auxiliary-color" v-if="goods.dealer_money>0 && itemStyle.charges == '1'">
														返 <text class="col-f auxiliary-color"> {{settingData.currency}}{{goods.dealer_money}}</text>
													</view>
												</view>

												<view class="goods-item-sale">
													<block v-if="itemStyle.goods_sales===undefined?true:(itemStyle.goods_sales==='2')">
														已售{{goods.goods_sales}}
													</block>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
				</scroll-view>
			</view>
		</block>


		<!-- 风格五 -->
		<!-- <view class="diy-goods-list goods-type-4">
			<view class="diy-goods-item">
				<view class="goods-item-img sale-out">
					<image src="https://img.hipintuan.cn/images/2/2018/11/sShyMqDH7vds8LkkHOsMDKMMFd9ZlV.jpg"></image>
					<view class="goods-item-users">
						<view class="iconfont icon-hotfill"></view>
						<view class="user-title">参与</view>
						<view class="user-list">
							<image src="https://img.hipintuan.cn/images/2/2018/11/sShyMqDH7vds8LkkHOsMDKMMFd9ZlV.jpg"></image>
							<image src="https://img.hipintuan.cn/images/2/2018/11/sShyMqDH7vds8LkkHOsMDKMMFd9ZlV.jpg"></image>
							<image src="https://img.hipintuan.cn/images/2/2018/11/sShyMqDH7vds8LkkHOsMDKMMFd9ZlV.jpg"></image>
						</view>
					</view>
				</view>
				<view class="goods-item-content">
					<view class="goods-item-title">请选择商品...</view>
					<view class="goods-item-info">
						<view class="goods-item-money">
							<view class="goods-item-money-now">00.00<text>元</text></view>
							<view class="goods-item-money-old">¥00.00</view>
						</view>
						<view  class="goods-item-buy" :class="{'sale-out':goods.stock_num === 0}">去抢购</view>
					</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				cartTotal: '',
				currentIndex: 1,
			};
		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			params: Object,
			itemData: Array
		},
		components: {

		},
		computed: {
			icontext() {
				return (text) => {
					return !!text && text.length > 2 ? text.substring(0, 2) : text;
				}
			}
		},
		beforeCreate() {

		},
		onLoad(options) {

		},

		onShow() {


		},
		mounted() {

		},
		created() {

		},
		methods: {
			addCart(goods_id, goods_sku_id, goods) {
				let _this = this;
				App._get('cart/add', {
					goods_id,
					goods_sku_id
				}, (result) => {
					if (result.code === 1) {
						_this.cartTotal = result.data.cart_total_num;
						this.$emit('number', _this.cartTotal)
						App.showSuccess('已加入购物车');
					}
				})
			},
			swiperChange(e) {
				this.currentIndex = Number(e.detail.current) + 1;
			},
			scrollViewHeight(margincol, isRect) {
				return uni.upx2px(isRect ? 400 : 500) + margincol * 2;
			},
			toGoodsInfo(goodsInfo) {
				// activity_type 1秒杀 2拼团
				let {
					goods_id,
					activity_type,
					spike_id,
					group_id,
					is_member_price
				} = goodsInfo,
				activityId = {
						"1": "spike_id",
						"2": "group_id",
						"4": "bargain_id",
					},
					goodsParams = {
						goods_id
					};
				if (activity_type !== 0) {
					goodsParams[activityId[activity_type]] = goodsInfo[activityId[activity_type]];
				} else {
					if (is_member_price === 1) {
						goodsParams.goods_type = "member_goods";
					}
				}
				// console.log(goodsParams);
				goodsParams = this.$util.removeEmpty(goodsParams);
				App.navigationTo({
					url: "pages/subPages/goods/index/index?" + App.urlEncode(goodsParams)
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.money {
		background-color: #FFD940;
		height: 30rpx;
		line-height: 30rpx;
		margin: 12rpx;
		padding: 0 15rpx;
		border-radius: 5rpx;
	}
	.shoppIng-main {
		position: absolute;
		right: 0;
		bottom: 20rpx;

		.shoppingIcon {
			width: 60upx;
			height: 60upx;
			background: linear-gradient(0deg, rgba(255, 220, 77, 1) 0%, rgba(255, 204, 0, 1) 100%);
			border-radius: 50%;

			>image {
				display: block;
				margin: 0 auto;
				width: 30upx;
				height: 30upx;
				transform: translateY(50%);
			}

			.cart-num {
				position: absolute;
				right: 0;
				top: -14upx;
				background: rgba(255, 68, 68, 1);
				border-radius: 50%;
				padding: 2upx 10upx;
				transform: scale(.75);
			}
		}
	}

	.diy-goods-list {
		/* padding: 30upx; */
		display: flex;
		background: #FFFFFF;

		.diy-goods-item {
			background-color: #fff;
			display: flex;
			position: relative;
			overflow: hidden;

			.goods-item-content {
				flex: 1;
			}

			// .goods-item-content.footer-padding {
			// 	padding-bottom: 20px
			// }
			.goods-item-title {
				font-size: 30upx;
			}

			.goods-item-info {
				display: flex;
				justify-content: space-between;
			}

			.goods-item-money-now {
				height: 36upx;
				line-height: 36upx;
				color: #FE504F;
				font-size: 32upx;
				margin: 0;
				/* overflow: hidden; */
				text-overflow: ellipsis;
				white-space: nowrap;
				font-family: Number-Font !important;
			}

			.goods-item-money-old {
				height: 32upx;
				line-height: 32upx;
				color: #999;
				/* overflow: hidden; */
				text-overflow: ellipsis;
				white-space: nowrap;
				position: relative;
				// text-decoration: line-through;
				/* font-family: Number-Font !important; */
			}

			.goods-item-img {
				position: relative;
				/* overflow: hidden; */
				border-radius: 6upx;

				.goods-item-label {
					position: absolute;
					left: 0;
					top: -6upx;
					width: 60upx;
					height: 60upx;
					font-size: 20upx;
					line-height: 50upx;
					z-index: 10;
					color: #FFFFFF;
					background-image: url('~@/static/images/diypage/common_label.png');
					background-size: cover;
					text-indent: 6upx;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}

				&.sale-out::after,
				&.sale-end::after {
					content: " ";
					display: block;
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: 5;
					background-color: rgba(0, 0, 0, .5);
					background-size: 239rpx 203rpx;
					background-repeat: no-repeat;
					background-position: 50%;
				}

				&.sale-out::after {
					background-image: url("~@/static/images/diypage/sale-out.png");
				}

				&.sale-end::after {
					background-image: url("~@/static/images/diypage/sale-end.png");
				}

				.image {
					width: 100%;
					height: 100%;
					display: block;
					position: relative;
					z-index: 1;
					border-radius: 6upx;
					background-size: 100%;
					background-position: center;
					background-size: 100%;
					background-repeat: no-repeat;
				}
			}

			.goods-item-sale {
				height: 34upx;
				line-height: 36upx;
				color: #999;
				font-size: 24upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.goods-item-buy {
				.sale-out {
					background: #cccccc !important;
					color: #ffffff !important;
				}
			}

		}

		/* 横向滑动样式 */
		.swiper-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex: 1;
			/* padding: 0 15upx; */
			margin-bottom: 20upx;
		}

		.swiper-title-contnet {
			display: flex;
			flex-direction: column;
		}

		.swiper-title-main {
			font-size: 44upx;
			font-weight: 600;
			margin: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			.title-icon {
				display: inline-block;
				width: 0;
				height: 0;
				border: 10upx solid;
				border-color: transparent #FFD940 #FFD940 transparent;
				border-color: transparent var(--theme-color) var(--theme-color) transparent;
				margin-left: 12upx;
			}
		}

		.swiper-title-minor {
			color: #999;
			font-size: 24upx;
			margin: 0;
			/* overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap; */
		}

		.swiper-title-index {
			font-size: 32upx;
			display: inline-block;

			.text {
				font-size: 44upx;
				font-style: normal;
				display: inline;
			}
		}

		/* 风格一 */
		&.goods-type-1 {
			.diy-goods-item {
				justify-content: space-between;
				flex: 1;

				/* margin-bottom: 30upx; */
				.goods-item-img {
					width: 200upx;
					height: 200upx;
					flex-shrink: 0;
					overflow: inherit;

					.image {
						border-radius: 0;
						background-size: 100% 100%;
						background-repeat: no-repeat;
					}
				}

				.goods-item-content {
					margin-left: 20upx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
				}

				.goods-item-title {
					height: 80upx;
					line-height: 40upx;
				}

				.goods-item-info {
					/* padding-top: 52upx; */
					align-items: flex-end;
				}

				.goods-item-money-now {
					font-size: 38upx;
				}

				.goods-item-buy {
					min-width: 120upx;
					height: 50upx;
					line-height: 50upx;
					color: #fff;
					font-size: 26upx;
					text-align: center;
					background-color: #FE504F;
					border-radius: 6upx;
					display: inline-block;
				}

				.goods-item-money-old {
					margin-left: 12upx;
				}
			}

			.member-price-label {
				margin-left: -10upx;
			}
		}

		/* 风格二 */
		&.goods-type-2 {
			flex-wrap: wrap;

			.diy-goods-item {
				width: 50%;
				min-width: 50%;
				box-sizing: border-box;
				flex-direction: column;
				margin-top: 30upx;

				.goods-item-img {
					width: 100%;
					padding-top: 100%;
					display: block;
					position: relative;

					&.img-rect {
						padding-top: 56.22%;
					}

					/* overflow: hidden; */
					.image {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background-size: 100% 100%;
						background-repeat: no-repeat;
						border-radius: 6upx;
					}
				}

				.goods-item-info {
					align-items: flex-end;
					margin-top: 20upx;
				}

				.goods-item-title {
					margin-top: 20upx;
					font-size: 28upx;
					height: 2.8em;
					line-height: 1.4em;
				}

				.goods-item-money {
					width: 100%;
				}

				.goods-item-money-now {
					display: flex;
					font-size: 36upx;
				}
			}

			.sale-out,
			.sale-end {
				border-radius: 6upx;
			}
		}

		/* 风格三 */
		&.goods-type-3 {
			flex-direction: column;

			.diy-goods-item {
				width: 100%;
				/* padding: 15upx; */
				box-sizing: border-box;
				flex-direction: column;

				.goods-item-info {
					flex-direction: column;
				}

				.goods-item-img {
					width: 100%;
					padding-top: 56.22%;
					display: block;
					overflow: hidden;
					border-radius: 6upx;

					.image {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						border-radius: 6upx;
					}

					.goods-item-users {
						color: #FFFFFF;
						position: absolute;
						height: 72upx;
						line-height: 72upx;
						background: linear-gradient(90deg, #FF7E42, #FB2F52);
						border-radius: 0 0 0 70px;
						box-sizing: initial;
						position: absolute;
						top: 0;
						right: 0;
						z-index: 2;
						font-size: 28upx;
						padding: 0 12upx 0 30upx;
						display: flex;
						flex-direction: row;
						align-items: center;
					}

					.user-list {
						/* display: flex;
						flex-direction: row;
						align-items: center; */
						line-height: 1em;
						padding-left: 20upx;

						.image {
							width: 42upx;
							height: 42upx;
							border-radius: 50%;
							display: inline-block;
							margin-left: -10upx;
							background-size: 100%;
							background-position: center;
							background-size: 100%;
							background-repeat: no-repeat;
						}
					}
				}

				.goods-item-store {
					color: #999;
					font-size: 24upx;
					margin-top: 20upx;
					display: flex;
					justify-content: space-between;
				}

				.goods-item-title {
					line-height: 40upx;
					font-size: 30upx;
					margin-top: 20upx;

					.title-label {
						display: inline-block;
						height: 24upx;
						line-height: 24upx;
						font-size: 22upx;
						font-style: normal;
						margin-right: 10upx;
						padding: 6upx 18upx;
						background-color: #FFD93F;
						border-radius: 4upx;
					}
				}

				.goods-item-money {
					margin-top: 20upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 5rpx;
				}

				.goods-item-num {
					color: #999;
					font-size: 26upx;
					display: -webkit-flex;
					display: flex;
					justify-content: space-between;
				}


				.goods-item-money-now {
					color: #FE504F;
					font-size: 48upx;
					height: 56upx;
					line-height: 56upx;
					margin: 0;
					flex-shrink: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: normal;
					display: -webkit-box;
				}

				.goods-item-buy {
					width: 144upx;
					height: 56upx;
					line-height: 56upx;
					color: #fff;
					font-size: 28upx;
					text-align: center;
					font-weight: normal;
					margin: 0;
					background-color: #FE504F;
					border-radius: 8upx;
					flex-shrink: 0;
				}
			}

		}

		/* 风格四 */
		&.goods-type-4 {
			.diy-goods-item {
				width: 100%;
				padding: 15upx;
				box-sizing: border-box;
				flex-direction: column;

				.goods-item-img {
					width: 100%;
					height: 48vw;
					display: block;
					position: relative;

					.image {
						border-radius: 6upx;
					}
				}

				.goods-item-users {
					color: #FFFFFF;
					position: absolute;
					height: 72upx;
					line-height: 72upx;
					background: linear-gradient(90deg, #FF7E42, #FB2F52);
					border-radius: 0 0 0 70px;
					box-sizing: initial;
					position: absolute;
					top: 0;
					right: 0;
					z-index: 2;
					font-size: 28upx;
					padding: 0 12upx 0 30upx;
					display: flex;
					flex-direction: row;
					align-items: center;
				}

				.user-list {
					/* display: flex;
					flex-direction: row;
					align-items: center; */
					line-height: 1em;
					padding-left: 20upx;

					.image {
						width: 42upx;
						height: 42upx;
						border-radius: 50%;
						display: inline-block;
						margin-left: -10upx;
					}
				}
			}

			.sale-out,
			.sale-end {
				border-radius: 6upx;
			}

			.goods-item-info {
				position: relative;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
			}

			.goods-item-content {
				overflow: inherit;
			}

			.goods-item-money {
				margin-top: 20upx;
				display: flex;
				align-items: flex-end;
				justify-content: space-between;
			}

			.goods-item-store {
				color: #999;
				font-size: 24upx;
				margin-top: 20upx;
				display: flex;
				justify-content: space-between;
			}

			.goods-item-money-now {
				color: #FE504F;
				font-size: 40upx;
				margin: 0;
				flex-shrink: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: normal;
				display: -webkit-box;
			}

			.goods-item-money-old {
				color: #999;
				font-size: 28upx;
				line-height: 40upx;
				font-weight: normal;
				margin-left: 20upx;
				display: inline;
			}

			.goods-item-buy {
				height: 72upx;
				line-height: 72upx;
				color: #FFE200;
				font-size: 28upx;
				padding: 0 20upx 0 6upx;
				background-color: #2D2D2D;
				border-radius: 2upx 0 10upx 4upx;
				position: absolute;
				top: 0;
				right: -14upx;
				display: inline-block;

				&::after {
					content: "";
					border-width: 15upx;
					border-style: solid;
					border-color: transparent transparent transparent #2D2D2D;
					position: absolute;
					top: -14upx;
					right: -14upx;
				}
			}
		}

		/* 风格五 */
		&.goods-type-5 {
			.goods-scroll-view {
				width: 100%;
				height: 490rpx;
				display: flex;
				align-items: center;
				flex-wrap: nowrap;
				// white-space: nowrap;
			}

			.diy-goods-item {
				width: 45vw;
				min-width: 45vw;
				box-sizing: border-box;
				flex-direction: column;
				padding: 0 10upx;

				// display: inline-block;

				.goods-item-img {
					width: 100%;
					padding-top: 100%;
					display: block;
					position: relative;

					/* overflow: hidden; */
					&.img-rect {
						padding-top: 56.22%;
					}

					.image {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background-size: 100% 100%;
						border-radius: 6upx;
						overflow: hidden;
					}
				}

				.goods-item-info {
					align-items: flex-end;
					margin-top: 20upx;
				}

				.goods-item-title {
					font-size: 28upx;
					height: 2.6em;
					line-height: 1.3em;
					margin-top: 10upx;
					flex: 1;
					white-space: normal;
				}

				.goods-item-money {
					width: 100%;
				}

				.goods-item-money-now {
					display: flex;
				}
			}

			.sale-out,
			.sale-end {
				border-radius: 6upx;
				overflow: hidden;
			}
		}
	}

	.diy-goods-list-swiper {
		swiper {
			height: 600upx;
		}
	}

	/* 折扣商品样式 */
	.member-price-label {
		color: #333333;
		height: 0;
		line-height: 30upx;
		border-width: 0upx 10upx 30upx 0;
		border-style: none solid solid;
		border-color: transparent #000 #efd68f;
		position: relative;
		left: 10upx;
		padding-left: 6upx;
		border-radius: 4upx 0 0 4upx;
	}

	.member-coupon-price {
		color: #efd68f;
	}

	.coupon-price-2 {
		padding: 0 10upx;
		height: 30upx;
		line-height: 30upx;
		border-radius: 0 4upx 4upx 0;
	}

	.old-price {
		text-decoration: line-through;
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
		border-top-left-radius: 6rpx;
		border-bottom-right-radius: 14rpx;
		z-index: 5;
	}
</style>
