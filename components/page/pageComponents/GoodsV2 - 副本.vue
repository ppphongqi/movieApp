<template>
	<view class="goods-v2" :class="cGoodsV2ClassStr">
		<!-- header -->
		<view class="goods-v2-header">
			<view v-if="cTitleData.titleVisible" class="goods-v2-header__left">
				<view class="goods-header__title">{{cTitleData.title}}</view>
				<view class="goods-header__subTitle">{{cTitleData.subTitle}}</view>
			</view>
			<view class="goods-v2-header__right">
				<view v-if="false" class="goods-v2-header__more">更多<view class="iconfont icon-right"></view>
				</view>
				<view class="goods-v2-header__btns">
					<view class="goods-v2-header__btn is-active">最新</view>
					<view class="goods-v2-header__btn">附近</view>
				</view>
			</view>
		</view>
		<!-- header -->
		<!-- 广告位 -->
		<view class="goods-v2-ad-wrapper">
			<image class="goods-v2-ad" :src="cAdData.imgUrl"></image>
		</view>
		<!-- <!-- 广告位 end -->
		<!-- 商品列表 -->
		<view class="goods-v2-list">
			<!-- 单个商品 -->
			<view class="goods-v2-item" v-for="item in cGoodsData" :key="item.id">
				<view class="goods-v2-item__img-wrapper">
					<!-- 商品图 -->
					<image class="goods-v2-item__img" :src="item.imgUrl"></image>
					<!-- 距离指示器 -->
					<view v-if="refsVisible.distanceVisible" class="goods-v2-item__distance">{{item.distance}}km</view>
				</view>
				<view class="goods-v2-item__content">
					<!-- 标题 -->
					<view v-if="refsVisible.titleVisible" class="goods-v2-item__title">
						<!-- 会员标签 -->
						<view v-if="refsVisible.labelMember" class="goods-v2-item__member m-right12">
							<view class="goods-v2-item__member-name">会员</view>省¥{{item.priceMemberSave}}
						</view>
						<!-- 推荐标签 -->
						<view v-if="refsVisible.labelRecommend" class="goods-v2-item__label-recommend">推荐</view>{{item.name}}
					</view>
					<view class="goods-v2-handle-wrapper">
						<view class="goods-v2-price-wrapper__left">
							<!-- 会员标签 -->
							<view v-if="refsVisible.labelMemberInHandle" class="goods-v2-item__member">
								<view class="goods-v2-item__member-name">会员</view>省¥{{item.priceMemberSave}}
							</view>
							<!-- 赚多少钱 -->
							<view v-if="refsVisible.priceEarnUpper" class="goods-v2-item__price-earn m-left12">赚:¥{{item.priceEarn}}</view>
							<view class="dis-flex flex-y-end">
								<!-- 原价 -->
								<view class="goods-v2-price">￥<view class="goods-v2-price_num">{{item.price}}</view>
								</view>
								<!-- 划线价 -->
								<view v-if="refsVisible.priceLineVisible" class="goods-v2-price is-del m-left12">￥<view class="goods-v2-price_num">{{item.priceLine}}</view>
								</view>
								<!-- 赚多少钱 -->
								<view v-if="refsVisible.priceEarnAfter" class="goods-v2-item__price-earn m-left12">赚:¥{{item.priceEarn}}</view>
							</view>

						</view>
						<view class="goods-v2-price-handle__right">
							<!-- 销售数量 -->
							<view v-if="refsVisible.textSales" class="goods-v2-item__sales">已售{{item.sales}}</view>
							<!-- 购买按钮 -->
							<view v-if="refsVisible.btnBuy" class="goods-v2-item__btn-buy m-top12">购买</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 单个商品 edn -->
		</view>
		<!-- 商品列表 end -->
	</view>
</template>

<script>
	const GOODS_LIST_TYPE = {
		'COL1': 1,
		'COL2': 2,
		'COL3': 3,
		'COL1--h': 4
	}
	export default {
		props: {
			// 原始的接口数据(兼容以前组件的处理方式，所以这里只用传原始数据)
			params: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		computed: {
			// 商品列表的类型1:一列的样式，2:两列的样式，3:三列的样式
			cGoodsType() {
				return GOODS_LIST_TYPE.COL3
			},
			// 各元素是否显示
			refsVisible() {
				return {
					// 距离是否显示
					distanceVisible: [GOODS_LIST_TYPE.COL1, GOODS_LIST_TYPE.COL2].indexOf(this.cGoodsType) !== -1,
					// 标题是否显示
					titleVisible: [GOODS_LIST_TYPE.COL1, GOODS_LIST_TYPE.COL2, GOODS_LIST_TYPE.COL3].indexOf(this.cGoodsType) !== -1,
					// 购买按钮
					btnBuy: [GOODS_LIST_TYPE.COL1].indexOf(this.cGoodsType) !== -1,
					// 已售数量
					textSales: [GOODS_LIST_TYPE.COL1].indexOf(this.cGoodsType) !== -1,
					// 标题里的推荐便签
					labelRecommend: [GOODS_LIST_TYPE.COL1].indexOf(this.cGoodsType) !== -1,
					// 标题的会员标签
					labelMember: [GOODS_LIST_TYPE.COL2].indexOf(this.cGoodsType) !== -1,
					// 价格区域的会员标签
					labelMemberInHandle: [GOODS_LIST_TYPE.COL1].indexOf(this.cGoodsType) !== -1,
					// 划线价是否显示
					priceLineVisible: [GOODS_LIST_TYPE.COL1, GOODS_LIST_TYPE.COL2].indexOf(this.cGoodsType) !== -1,
					// 赚多少钱（在价格后面）
					priceEarnAfter: [GOODS_LIST_TYPE.COL1].indexOf(this.cGoodsType) !== -1,
					// 赚多少钱（在价格上面的）
					priceEarnUpper: [GOODS_LIST_TYPE.COL2].indexOf(this.cGoodsType) !== -1,
				}
			},
			// 格式化的标题相关的数据
			cTitleData() {
				return {
					// 标题的类型
					type: 3,
					// 标题是否显示
					titleVisible: [1, 2].indexOf(1) !== -1,
					// 标题
					title: '今日超推荐！手慢无！今日超推荐！',
					// 副标题
					subTitle: '治愈人心的不过是深夜的一顿宵夜'
				}
			},
			// 格式化的广告位的相关数据
			cAdData() {
				return {
					imgUrl: 'http://placekitten.com/690/300'
				}
			},
			// 格式化的商品的相关数据
			cGoodsData() {
				return [{
					id: 'goods1',
					// 商品名称
					name: '【5店通用·小肥羊】68元抢100元无门槛现金券，周末节假日通用，1个成人可免费携带一个1.2米以下，5店通用·小肥羊】68元抢100元无门槛现金券，周末节假日通用，1个成人可免费携带一个1.2米以下',
					// 商品图片
					imgUrl: 'https://via.placeholder.com/690x388/2a9ff6/fffffff',
					// 货币符号
					currency: '￥',
					// 商品显示价格
					price: '99.99',
					// 商品显示划线价
					priceLine: '199.00',
					// 会员省多少钱
					priceMemberSave: '3.0',
					// 赚多少钱
					priceEarn: '1.8',
					// 商品销量
					sales: 1025.,
					// 距离多少千米
					distance: 2.88
				}, {
					id: 'goods2',
					// 商品名称
					name: '我是第二个商品',
					// 商品图片
					imgUrl: 'http://placekitten.com/690/388',
					// 货币符号
					currency: '￥',
					// 商品显示价格
					price: '99.99',
					// 商品显示划线价
					priceLine: '199.00',
					// 会员省多少钱
					priceMemberSave: '9.99',
					// 赚多少钱
					priceEarn: '10.8',
					// 商品销量
					sales: '1025人',
					// 距离多少千米
					distance: 10
				}, {
					id: 'goods3',
					// 商品名称
					name: '我是第三个商品',
					// 商品图片
					imgUrl: 'http://placekitten.com/690/388',
					// 货币符号
					currency: '￥',
					// 商品显示价格
					price: '99.99',
					// 商品显示划线价
					priceLine: '199.00',
					// 会员省多少钱
					priceMemberSave: '9.99',
					// 赚多少钱
					priceEarn: '10.8',
					// 商品销量
					sales: '1025人',
					// 距离多少千米
					distance: 10
				}, {
					id: 'goods4',
					// 商品名称
					name: '我是第四个商品',
					// 商品图片
					imgUrl: 'http://placekitten.com/690/388',
					// 货币符号
					currency: '￥',
					// 商品显示价格
					price: '99.99',
					// 商品显示划线价
					priceLine: '199.00',
					// 会员省多少钱
					priceMemberSave: '9.99',
					// 赚多少钱
					priceEarn: '10.8',
					// 商品销量
					sales: '1025人',
					// 距离多少千米
					distance: 10
				}, {
					id: 'goods5',
					// 商品名称
					name: '我是第五个商品',
					// 商品图片
					imgUrl: 'http://placekitten.com/690/388',
					// 货币符号
					currency: '￥',
					// 商品显示价格
					price: '99.99',
					// 商品显示划线价
					priceLine: '199.00',
					// 会员省多少钱
					priceMemberSave: '9.99',
					// 赚多少钱
					priceEarn: '10.8',
					// 商品销量
					sales: '1025人',
					// 距离多少千米
					distance: 10
				}]
			},
			// 最外层容器的classStr
			cGoodsV2ClassStr() {
				let str = ''
				// 标题的风格
				str += ' is-header-type-3'
				// 商品列表的风格1：一列布局，2，两列布局
				str += ` is-goods-type-${this.cGoodsType}`
				// 商品图片是否是长方形（默认是正方形）
				str += ' is-goods-rectangle'
				return str
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-v2 {
		box-sizing: border-box;
		padding: 0 30rpx;
		margin: 20rpx 0;

		&.is-goods-type-3 {
			position: relative;
			width: 690rpx;
			margin: 20rpx auto;
			background-color: #fff;
			border-radius: 10rpx;
			padding: 0 12rpx;
			padding-top: 190rpx;
		}
	}

	// 商品列表头部
	.goods-v2-header {
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 130rpx;
		padding: 0 30rpx;
		margin-top: 20rpx;

		.is-header-type-3 & {
			position: relative;
			background-image: url('http://placekitten.com/750/130');
			background-position: center;
			background-size: cover;
			background-repeat: no-repeat;
			border-top-right-radius: 6rpx;
			border-top-left-radius: 6rpx;
			z-index: 1;
			
			.goods-v2-header__right {
				padding-right: 30rpx;
			}
		}
	}

	.goods-v2-header__left {
		flex: 1;
		min-width: 0;
	}

	.goods-v2-header__right {
		margin-left: auto;
	}

	.goods-header__title {
		position: relative;
		box-sizing: border-box;
		padding-right: 16rpx;
		// #ifdef MP
		font-weight: bold;
		// #endif
		// #ifdef H5
		font-weight: 500;
		// #endif
		font-size: 36rpx;
		color: #333333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		&::after {
			position: absolute;
			right: 28rpx;
			bottom: 8rpx;
			display: block;
			content: '\20';
			width: 0;
			height: 0;
			border-bottom: 18rpx solid var(--theme-color, #fff);
			border-left: 18rpx solid transparent;
		}
	}

	.goods-header__subTitle {
		margin-top: 2rpx;
		font-size: 24rpx;
		color: #999;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.goods-v2-header__more {
		display: flex;
		align-items: center;
		padding: 16rpx 0;

		&,
		& .iconfont {
			color: #999;
			font-size: 24rpx;
		}
	}

	.goods-v2-header__btns {
		display: flex;
		align-items: center;
	}

	.goods-v2-header__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		height: 50rpx;
		min-width: 90rpx;
		padding: 0 8rpx;
		font-size: 24rpx;
		color: #333;
		border: 1px solid #FFD940;

		&.is-active {
			background-color: #FFD940;
		}
	}

	// 商品列表头部 end
	// 广告
	.goods-v2-ad-wrapper {
		.is-goods-type-3 & {
			position: absolute;
			left: -30rpx;
			right: -20rpx;
			top: 0;
			z-index: 0;
		}

		.goods-v2-ad {
			width: 100%;
			height: 300rpx;

		}
	}

	// 广告 end
	// 商品列表（一共有7种风格）
	.goods-v2-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.is-goods-type-3 & {
			justify-content: flex-start;
		}
	}

	.goods-v2-item {
		background-color: #fff;
		border-radius: 10rpx;
		margin: 20rpx 0;

		.is-goods-type-1 & {
			width: 100%;
		}

		.is-goods-type-2 & {
			width: 335rpx;
		}

		.is-goods-type-3 & {
			width: 206rpx;
			margin: 0 8rpx;
			margin-bottom: 24rpx;
		}
	}

	.goods-v2-item__img-wrapper {
		position: relative;
		width: 100%;

		.is-goods-type-1 & {
			height: 388rpx;
		}

		.is-goods-type-2 & {
			height: 335rpx;
		}

		.is-goods-type-2.is-goods-rectangle & {
			height: 188rpx;
		}

		.is-goods-type-3 & {
			height: 206rpx;
			border-radius: 10rpx;
			overflow: hidden;
		}
	}

	.goods-v2-item__img {
		width: 100%;
		height: 100%;
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
		padding: 10rpx 20rpx 20rpx 20rpx;

		.is-goods-type-3 & {
			padding: 0;
		}
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

		.is-goods-type-1 & {
			display: block;
			height: initial;
		}
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
		align-items: center;
		padding-top: 0;
		margin-top: 20rpx;
	}

	.goods-v2-price-handle__right {
		margin-left: auto;
	}

	.goods-v2-item__member {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		height: 30rpx;
		padding-right: 9rpx;
		font-size: 20rpx;
		color: #fff;
		background-color: #333;
		border-radius: 4rpx;
	}

	.goods-v2-item__member-name {
		position: relative;
		color: #333;
		height: 100%;
		padding: 0 7rpx;
		margin-right: 16rpx;
		background-color: #EED196;

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

	.goods-v2-price {
		display: flex;
		align-items: flex-end;
		color: #FF4444;
		font-size: 28rpx;
		font-weight: bold;

		.is-goods-type-2 &,
		.is-goods-type-3 & {
			font-size: 24rpx;
		}

		&.is-del {
			color: #999;
			font-size: 24rpx;
			margin-top: 8rpx;
			text-decoration: line-through;

			.goods-v2-price_num {
				transform: translateY(0);
				font-size: 1em;
			}
		}
	}

	.goods-v2-price_num {
		transform: translateY(4rpx);
		font-size: 1.286em;
	}

	.goods-v2-price-handle__right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
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
		color: #333;
		font-size: 24rpx;
		background-color: #FFD940;
		border-radius: 2rpx;
	}

	.goods-v2-item__sales {
		font-size: 24rpx;
		color: #999;
	}

	// 商品列表
</style>
