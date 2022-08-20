<template>
	<view class="goods-row" @click="handleGoodsClick">
		<view class="goods-row__left">
			<image class="goods-row__img" :src="imgUrl" />
		</view>
		<view class="goods-row__center">
			<view class="goods-row__title">{{title}}</view>
			<view class="goods-row__attr">
				<view class="goods-row__attr__left">
					<view class="goods-row__price--del">价值：¥{{priceDelStr}}</view>
					<view class="goods-row__price">底价：¥<text class="is-strong">{{priceStr}}</text></view>
				</view>
				<view class="goods-row__attr__right">
					<button class="goods-row__btn-go btn-normal">立即参与</button>
				</view>
			</view>
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
					default: 'http://placekitten.com/200/200'
				},
				// 商品类别标签文字
				label: {
					type: String,
					default: '秒杀'
				},
				// 商品名字
				title: {
					type: String,
					default: '哈哈ABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD哈哈'
				},
				// 商品现价
				priceStr: {
					type: String,
					default: '0000.00'
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
	.goods-row {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		min-height: 240rpx;
		padding: 20rpx;
		border-radius: 6rpx;
		border: 1px solid #eee;
		background-color: #fff;
	}
	.goods-row__img {
		flex-shrink: 0;
		width: 200rpx;
		height: 200rpx;
		border-radius: 4rpx;
	}
	.goods-row__center {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
		margin-left: 20rpx;
	}
	.goods-row__title {
		display: -webkit-box;
		width: 100%;
		height: 2.6em;
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
	.goods-row__attr {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		min-width: 0;
		flex: 1;
		margin-top: auto;
	}
	.goods-row__price--del {
		width: 100%;
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		overflow: hidden;
	}
	.goods-row__price {
		width: 100%;
		font-size: 24rpx;
		color: #FF4444;
		white-space: nowrap;
		overflow: hidden;
		.is-strong {
			font-size: 36rpx;
			font-weight: bold;
		}
	}
	.goods-row__attr__right {
		flex-shrink: 0;
	}
	.goods-row__btn-go {
		display: flex;
		align-items: center;
		justify-content: center;
		padding:  0 14rpx;
		height: 50rpx;
		font-size: 24rpx;
		color: #333333;
		white-space: nowrap;
		background-color: #FFD940;
	}
</style>
