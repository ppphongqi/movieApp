<template>
	<scroll-view class="goods-list-wrapper" scroll-x="true">
		<view class="goods-list">
			<view v-for="(item,index) in cList" :key="item.id" class="goods-list__item">
				<view class="goods-card" @click="$emit('on-item-click',item,index)">
					<view class="goods-card__header">
						<image class="goods-card__img" :src="item.imgUrl" mode="aspectFill"></image>
						<view class="goods-card__label">{{item.label}}</view>
					</view>
					<view class="goods-card__content">
						<view class="goods-card__title">{{item.title}}</view>
						<!-- 秒杀商品 -->
						<block v-if="item.type == 1">
							<view class="goods-card__price">秒杀价：￥<text class="is-strong">{{item.price}}</text></view>
							<view class="goods-card__line-price">原价：¥{{item.priceLine}}</view>
						</block>
						<!-- 秒杀商品 end -->
						<!-- 团购商品 -->
						<block v-else-if="item.type == 2">
							<view class="goods-card__price">拼团价：￥<text class="is-strong">{{item.price}}</text></view>
							<view class="goods-card__line-price">单购买价：¥{{item.priceLine}}</view>
						</block>
						<!-- 团购商品 end -->
						<!-- 砍价商品 -->
						<block v-else-if="item.type == 3">
							<view class="goods-card__price">已砍：￥{{item.price}}</text></view>
							<view class="goods-card__line-price" style="text-decoration: none;white-space: nowrap;font-size: 22rpx;">{{item.endTime}}结束</view>
						</block>
						<!-- 砍价商品 end -->
						<!-- 礼包商品 -->
						<block v-else-if="item.type == 6">
							<view class="goods-card__price">￥<text class="is-strong">{{item.price}}</text></view>
							<view class="goods-card__line-price" style="text-decoration: none;">共{{item.giftBusinessNum}}家店铺可用</view>
						</block>
						<!-- 礼包商品 end -->
						<!-- 砍价商品 -->
						<block v-else-if="item.type == 7">
							<view class="goods-card__price">￥<text class="is-strong">{{item.price}}</text>起</view>
							<view class="goods-card__line-price">原价：¥{{item.priceLine}}</view>
						</block>
						<!-- 砍价商品 end -->
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		props: {
			// 列表数据
			list: {
				type: Array,
				default () {
					return [{
							id: 'item0',
							// 类型 1：秒杀，2：团购，3：砍价，6：礼包，7：套餐
							type: '1',
							// 商品图片
							imgUrl: 'https://via.placeholder.com/300x170/2a9ff6/fffffff',
							// 标签文字
							label: '抽奖',
							// 标题
							title: '【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐',
							// 售价
							price: '55.02',
							// 划线价
							priceLine: '100.00',
							// 团购人数
							groupNum: 8,
							// 秒杀结束时间
							endTime: '2021-12-31 12:00:00',
							// 礼包共几家店铺可用
							giftBusinessNum: 8
						},
						{
							id: 'item1',
							// 类型 0：秒杀，1：团购，2：砍价吗，3：礼包，4：套餐
							type: '1',
							// 商品图片
							imgUrl: 'https://via.placeholder.com/300x170/2a9ff6/fffffff',
							// 标签文字
							label: '抽奖',
							// 标题
							title: '【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐',
							// 售价
							price: '55.02',
							// 划线价
							priceLine: '100.00',
							// 团购人数
							groupNum: 8,
							// 秒杀结束时间
							endTime: '2021-12-31 12:00:00',
							// 礼包共几家店铺可用
							giftBusinessNum: 8
						}, {
							id: 'item2',
							// 类型 0：秒杀，1：团购，2：砍价吗，3：礼包，4：套餐
							type: '2',
							// 商品图片
							imgUrl: 'https://via.placeholder.com/300x170/2a9ff6/fffffff',
							// 标签文字
							label: '抽奖',
							// 标题
							title: '【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐',
							// 售价
							price: '55.02',
							// 划线价
							priceLine: '100.00',
							// 团购人数
							groupNum: 8,
							// 秒杀结束时间
							endTime: '2021-12-31 12:00:00',
							// 礼包共几家店铺可用
							giftBusinessNum: 8
						}, {
							id: 'item3',
							// 类型 0：秒杀，1：团购，2：砍价吗，3：礼包，4：套餐
							type: '3',
							// 商品图片
							imgUrl: 'https://via.placeholder.com/300x170/2a9ff6/fffffff',
							// 标签文字
							label: '抽奖',
							// 标题
							title: '【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐',
							// 售价
							price: '55.02',
							// 划线价
							priceLine: '100.00',
							// 团购人数
							groupNum: 8,
							// 秒杀结束时间
							endTime: '2021-12-31 12:00:00',
							// 礼包共几家店铺可用
							giftBusinessNum: 8
						}, {
							id: 'item4',
							// 类型 0：秒杀，1：团购，2：砍价，3：礼包，4：套餐
							type: '4',
							// 商品图片
							imgUrl: 'https://via.placeholder.com/300x170/2a9ff6/fffffff',
							// 标签文字
							label: '抽奖',
							// 标题
							title: '【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐',
							// 售价
							price: '55.02',
							// 划线价
							priceLine: '100.00',
							// 团购人数
							groupNum: 8,
							// 秒杀结束时间
							endTime: '2021-12-31 12:00:00',
							// 礼包共几家店铺可用
							giftBusinessNum: 8
						},
					]
				}
			}
		},
		computed: {
			cList() {
				return (this.list || []).map(item => {
					let label = item.label
					const type = '' + item.type
					if (type === '1') {
						label = '秒杀'
					} else if (type === '2') {
						label = item.groupNum + '人团'
					} else if (type === '3') {
						label = '砍价'
					} else if (type === '6') {
						label = '礼包'
					} else if (type === '7') {
						label = '套餐'
					}
					return {
						...item,
						label
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-list-wrapper {
		width: 750rpx;
		margin: 20rpx auto;
	}

	.goods-list {
		box-sizing: border-box;
		display: inline-flex;
		padding: 0 20rpx;
		padding-top: 10rpx;
	}

	.goods-list__item {
		padding: 0 10rpx;
	}

	.goods-card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		width: 300rpx;
		height: 384rpx;
		background-color: #F8F8F8;
		border-radius: 10rpx;
	}

	.goods-card__header {
		position: relative;
	}

	.goods-card__img {
		width: 300rpx;
		height: 170rpx;
		border-radius: 10rpx 10rpx 0 0;
	}

	.goods-card__label {
		position: absolute;
		top: -10rpx;
		left: 10rpx;
		display: inline-flex;
		align-items: center;
		height: 34rpx;
		padding: 0 6rpx;
		font-size: 24rpx;
		color: #5E4E0F;
		background-color: #FFD940;
		border-radius: 4rpx 4rpx  0rpx 4rpx;

		&::after {
			position: absolute;
			top: 0;
			left: 100%;
			display: block;
			content: "\20";
			width: 16rpx;
			height: 10rpx;
			border-radius: 0 100% 0 0;
			background-color: #AB8901;
		}
	}

	.goods-card__content {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		min-height: 0;
		padding: 20rpx;
		flex: 1;
	}

	.goods-card__title {
		display: -webkit-box;
		max-height: 2em * 1.4;
		margin-bottom: auto;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: 1.4;
		font-size: 28rpx;
		color: #333;
		margin-bottom: auto;
	}

	.goods-card__price {
		font-size: 24rpx;
		color: #FF4444;

		.is-strong {
			font-size: 36rpx;
			font-weight: bold;
		}
	}

	.goods-card__line-price {
		font-size: 24rpx;
		color: #999;
		text-decoration: line-through;
	}
</style>
