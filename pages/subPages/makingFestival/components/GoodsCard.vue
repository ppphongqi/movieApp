<template>
	<view class="goods-card" @click="handleGoodsClick">
		<view class="goods-card__header">
			<image class="goods-card__img" :src="imgUrl" />
		</view>
		<view class="goods-card__content">
			<view class="goods-card__title"><text v-if="label" class="goods-card__label">{{label}}</text>{{title}}</view>
			<view class="goods-card__price"><text class="is-red">￥</text><text class="is-strong is-red"></text><text class="is-strong is-red">{{priceStr}}</text><text class="is-del">￥${{priceDelStr}}</text></view>
		</view>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	export default {
		props: {
			// 数据库原始数据
			source: {
				type: Object,
				default() {
					return {}
				}
			},
			// 当点击的时候是否直接跳转到详情页，依赖于this.source
			goToDetailWhenClick: {
				type: Boolean,
				default: true
			},
			// 商品图片
			imgUrl: {
				type: String,
				default: 'http://placekitten.com/280/280'
			},
			// 商品类别标签文字
			label: {
				type: String,
				default: '秒杀'
			},
			// 商品名字
			title: {
				type: String,
				default: 'ABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD'
			},
			// 商品现价
			priceStr: {
				type: String,
				default: '0000000.00'
			},
			// 商品划线价
			priceDelStr: {
				type: String,
				default: '0.00'
			}
		},
		methods: {
			// 商品点击事件
			handleGoodsClick() {
				this.$emit('on-click')
				// 在点击的时候需要直接跳转到详情页面
				if(this.goToDetailWhenClick) {
					console.log('this.source',this.source)
					const query = {
						goods_id: this.$util.deepGet(this.source, 'goods_id',''),
						spike_id: this.$util.deepGet(this.source, 'spike_id',''),
						group_id: this.$util.deepGet(this.source, 'groups_id',''),
						bargain_id: this.$util.deepGet(this.source, 'bargain_id','')
					}
					console.log('query',query,App.urlEncode)
					this.navigationTo('pages/subPages/goods/index/index?' + App.urlEncode(query))
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 498rpx;
		background-color: #fff;
		border-radius: 6rpx;
		border: 1px solid #eee;
	}
	.goods-card__header {
		&, .goods-card__img {
			width: 100%;
			height: 280rpx;
			border-radius: 6rpx 6rpx 0 0;
		}
	}
	.goods-card__content {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		min-height: 0;
		flex: 1;
		padding: 20rpx;
	}
	.goods-card__title {
		display: -webkit-box;
		height: 2.5em;
		font-weight: bold;
		font-size: 28rpx;
		color: #333;
		line-height: 1.3;
		word-break: break-all;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.goods-card__label {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 28rpx;
		padding: 0 8rpx;
		margin-right: 14rpx;
		font-size: 20rpx;
		font-weight: normal;
		vertical-align: middle;
		line-height: 28rpx;
		background-color: #F6D246;
	}
	.goods-card__price {
		margin-top: auto;
		white-space: nowrap;
		overflow: hidden;
	}
	.goods-card__price {
		font-size: 24rpx;
		.is-strong {
			font-weight: bold;
			font-size: 28rpx;
		}
		.is-red {
			color: #FF4444;
		}
		.is-del {
			margin-left: 14rpx;
			font-size: 20rpx;
			color: #999;
			text-decoration: line-through;
		}
	}
</style>
