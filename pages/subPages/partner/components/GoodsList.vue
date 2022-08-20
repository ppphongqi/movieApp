<template>
	<view class="c-GoodsList">
		<view v-for="item in list" :key="item.id" class="c-GoodsList__item">
			<view class="c-goods-card" @click="$emit('on-item-click',item,index)">
				<view class="c-goods-card__left">
					<image class="c-goods-card__img" :src="item.imgSrc" mode="aspectFill"></image>
				</view>
				<view class="c-goods-card__right">
					<view class="c-goods-card__title">{{item.title}}</view>
					<view class="c-goods-card__content">
						<view class="c-goods-card__content__left">
							<view class="c-goods-card__price">
								￥<text class="is-strong">{{item.price}}</text>
							</view>
							<view class="c-goods-card__rebate">
								<view class="c-goods-card__rebate__prefix">赚</view>
								<view class="c-goods-card__rebate__text">¥{{item.rebate}}</view>
							</view>
						</view>
						<view class="c-goods-card__content__right">
							<button class="btn-normal c-goods-card__btn-source">获取素材</button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 列表数据
			list: {
				type: Array,
				default () {
					// return [{
					// 		id: 'good1',
					// 		imgSrc: 'https://via.placeholder.com/190x190/2a9ff6/fffffff',
					// 		title: '4店通用·哈姆西克754店通用店4 店通用·哈姆西克754店通用店4店通用·哈姆西克754店通用店4 店通用·哈姆西克754店通用店',
					// 		price: '8.00',
					// 		rebate: '8.00'
					// 	}
					// ]
					return []
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-GoodsList {
		padding: 0 30rpx;

	}

	.c-GoodsList__item {
		padding: 30rpx 0;

		&+& {
			border-top: 1px solid #EEEEEE;
		}
	}

	.c-goods-card {
		display: flex;
	}

	.c-goods-card__img {
		width: 190rpx;
		height: 190rpx;
	}
	
	.c-goods-card__left {
		font-size: 0;
	}

	.c-goods-card__right {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1;
		margin-left: 20rpx;
	}

	.c-goods-card__title {
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}
	.c-goods-card__content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: auto;
	}
	.c-goods-card__price {
		color: #FE504F;
		font-size: 24rpx;
		.is-strong {
			font-weight: bold;
			font-size: 36rpx;
		}
	}
	.c-goods-card__rebate {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		height: 30rpx;
		min-width: 100rpx;
		border: 1px solid #FE504F;
		border-radius: 4rpx;
		overflow: hidden;
	}
	.c-goods-card__rebate__prefix {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 0 6rpx;
		font-size: 20rpx;
		color: #fff;
		background-color: #FE504F;
		text-align: center;
		
	}
	.c-goods-card__rebate__text {
		min-width: 0;
		padding: 0 10rpx;
		flex: 1;
		font-size: 20rpx;
		color: #FE504F;
	}
	.c-goods-card__btn-source {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90rpx;
		height: 90rpx;
		padding: 0 20rpx;
		font-size: 24rpx;
		color: #333;
		font-weight: bold;
		border-radius: 100%;
		background-color: #FFD940;
	}
</style>
