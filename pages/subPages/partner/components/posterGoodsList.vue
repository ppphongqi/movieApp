<template>
	<view class="c-posterGoodsList">
		<view v-for="(item,index) in list" :key="item.id" class="c-posterGoodsList__item" @click="$emit('on-item-click',item,index)">
			<view class="goods-card">
				<view class="goods-card__left">
					<image class="goods-card__img" :src="item.imgSrc" mode="aspectFill"></image>
				</view>
				<view class="goods-card__center">
					<view class="goods-card__title">
						{{item.title}}
					</view>
					<view class="goods-card__row">
						<view class="goods-card__price is-red">￥<text class="is-strong">{{item.price}}</text></view>
						<view class="goods-card__price is-del">￥{{item.linePrice}}</view>
						<button class="btn-normal goods-card__btn-go">立即购买</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default () {
					// return [{
					// 	id: 'good1',
					// 	imgSrc: 'https://via.placeholder.com/190x190/2a9ff6/fffffff',
					// 	title: '4店通用·哈姆西克754店通用店4 店通用·哈姆西克754店通用店4店通用·哈姆西克754店通用店4 店通用·哈姆西克754店通用店',
					// 	price: '8.00',
					// 	linePrice: '8.00',
					// }]
					return []
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-card {
		box-sizing: border-box;
		display: flex;
		width: 690rpx;
		max-width: 100%;
		padding: 20rpx;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.goods-card__img {
		width: 180rpx;
		height: 180rpx;
		border-radius: 20rpx;
	}

	.goods-card__center {
		display: flex;
		flex: 1;
		min-width: 0;
		flex-direction: column;
		margin-left: 20rpx;
	}

	.goods-card__title {
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: auto;
	}

	.goods-card__row {
		display: flex;
		align-items: center;
	}

	.goods-card__price {
		font-size: 24rpx;
		color: #999999;
		&+& {
			margin-left: 20rpx;
		}

		&.is-red,
		.is-red {
			color: #FE504F;
		}

		&.is-strong,
		.is-strong {
			font-size: 36rpx;
			font-weight: bold;
		}
		&.is-del,
		.is-del {
			text-decoration: line-through;
		}
	}
	.goods-card__btn-go {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #333;
		height: 50rpx;
		padding: 0 22rpx;
		border-radius: 9999rpx;
		margin-left: auto;
		background-color: #FFD940;
	}
</style>
