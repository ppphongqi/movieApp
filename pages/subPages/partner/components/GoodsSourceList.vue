<template>
	<view class="c-GoodsSourceList">
		<view v-for="(item,index) in list" :key="item.id" class="c-GoodsSourceList__item">
			<view class="c-goods-card" @click.stop="$emit('on-item-click',item,index)">
				<!-- header -->
				<view class="c-goods-card__header">
					<view class="c-goods-card__header__left">
						<image class="c-goods-card__img" :src="item.imgSrc" mode="aspectFill"></image>
					</view>
					<view class="c-goods-card__header__right">
						<view class="c-goods-card__title">{{item.title}}</view>
						<view class="c-goods-card__price-list">
							<view class="c-goods-card__price">平台价：<text class="is-strong">{{item.price}}</text></view>
							<view class="c-goods-card__price">分销佣金：<text class="is-strong">{{item.rebate}}</text></view>
						</view>
					</view>
				</view>
				<!-- header end -->
				<!-- content -->
				<view v-if="item.sku && item.sku.length" class="c-goods-card__content">
					<view class="sku-table">
						<view class="sku-table__tr sku-table__tr--header">
							<view class="sku-table__th">套餐名称</view>
							<view class="sku-table__th">平台价</view>
							<view class="sku-table__th">分销佣金</view>
						</view>
						<view class="sku-table__tr" v-for="sku in item.sku" :key="sku.id">
							<view class="sku-table__td">{{sku.name}}</view>
							<view class="sku-table__td">
								<view class="c-goods-card__price"><text class="is-strong">￥{{sku.price}}</text></view>
							</view>
							<view class="sku-table__td">
								<view class="c-goods-card__price"><text class="is-red">直卖：</text><text
										class="is-strong">￥{{sku.rebate}}</text></view>
							</view>
						</view>
					</view>
				</view>
				<!-- content end -->
				<!-- footer -->
				<view class="c-goods-card__footer">
					<view class="c-goods-card__btn-list">
						<button class="btn-normal c-goods-card__btn-go"
							@click.stop="$emit('on-btn-collection-click',item,index)">
							<image v-if="item.collected" class="c-goods-card__btn-go__img"
								src="../static/images/icon-heart--active.png"></image>
							<image v-else class="c-goods-card__btn-go__img" src="../static/images/icon-heart.png">
							</image>
							收藏
						</button>
						<button class="btn-normal c-goods-card__btn-go"
							@click.stop="$emit('on-btn-text-click',item,index)">获取文案链接</button>
						<button class="btn-normal c-goods-card__btn-go is-red"
							@click.stop="$emit('on-btn-poster-click',item,index)">获取二维码海报</button>
					</view>
				</view>
				<!-- footer end -->
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
					// 		rebate: '4.00',
					// 		// 是否已经收藏
					// 		collected: false
					// 	},
					// 	{
					// 		id: 'good2',
					// 		imgSrc: 'https://via.placeholder.com/190x190/2a9ff6/fffffff',
					// 		title: '店通用·哈姆西克754店通用店4 店通用·哈姆西克754店通用店4店通用·哈姆西克754店通用店4 店通用·哈姆西克754店通用店',
					// 		// 是否已经收藏
					// 		collected: true,
					// 		sku: [{
					// 			id: '01',
					// 			name: '套餐1',
					// 			price: '8.00',
					// 			rebate: '4.00'
					// 		}, {
					// 			id: '02',
					// 			name: '套餐2',
					// 			price: '8.00',
					// 			rebate: '4.00'
					// 		}]
					// 	}
					// ]
					return []
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-GoodsSourceList__item {
		margin: 20rpx 0;
	}

	.c-goods-card {
		padding: 30rpx;
		background-color: #fff;
	}

	.c-goods-card__img {
		width: 128rpx;
		height: 128rpx;
		border-radius: 20rpx;
	}

	.c-goods-card__header {
		display: flex;
	}

	.c-goods-card__header__left {
		font-size: 0;
	}

	.c-goods-card__header__right {
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

	.c-goods-card__price-list {
		display: flex;
		align-items: center;
		margin-top: auto;

		.c-goods-card__price+.c-goods-card__price {
			margin-left: 30rpx;
		}
	}

	.c-goods-card__price {
		font-size: 24rpx;
		font-weight: normal;
		color: #333333;

		.is-red {
			color: #FE504F;
		}

		.is-strong {
			font-weight: bold;
			color: #FE504F;
		}
	}

	.c-goods-card__content {
		margin-top: 30rpx;
	}

	.c-goods-card__btn-list {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 30rpx;
	}

	.c-goods-card__btn-go {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 70rpx;
		padding: 26rpx;
		font-size: 28rpx;
		color: #333333;
		border: 1px solid #CCCCCC;
		border-radius: 9999rpx;

		&.is-red {
			color: #FE504F;
			border: 1px solid #FE504F;
		}
	}

	.c-goods-card__btn-go__img {
		width: 34rpx;
		height: 30rpx;
		margin-right: 14rpx;
	}

	// table
	.sku-table {
		display: table;
		width: 100%;
		border: 1px solid #EEEEEE;
		border-radius: 10rpx;
	}

	.sku-table__tr {
		display: table-row;
		&:first-child {
			.sku-table__th,.sku-table__td {
				border-top: none;
			}
		}
	}
	.sku-table__tr--header {
		background-color: #F8F8F8;
	}
	.sku-table__th {
		display: table-cell;
		padding: 14rpx 10rpx;
		color: #333333;
		font-weight: bold;
		font-size: 24rpx;
		border-top: 1px solid #EEEEEE;
		&+& {
			border-left: 1px solid #EEEEEE;
		}
	}
	.sku-table__td {
		padding: 14rpx 10rpx;
		display: table-cell;
		color: #333333;
		font-weight: bold;
		font-size: 24rpx;
		border-top: 1px solid #EEEEEE;
		&+& {
			border-left: 1px solid #EEEEEE;
		}
	}

	// table end
</style>
