<template>
	<view class="festival-intro">
		<view class="festival-intro__header">
			<!-- 活动数据 -->
			<!-- TODO:提成组件 -->
			<!-- 已经提成了./StatisticsList.vue -->
			<view class="festival-intro-data">
				<view class="festival-intro-data__item">
					<view class="festival-intro-data__icon" :class="buyIcon"></view>
					<view class="festival-intro-data__text is-strong">{{cBuyNum}}</view>
					<view class="festival-intro-data__text">{{buyText || '人已购'}}</view>
				</view>
				<view class="festival-intro-data__item">
					<view class="festival-intro-data__icon iconfont icon-120"></view>
					<view class="festival-intro-data__text is-strong">{{cShareNum}}</view>
					<view class="festival-intro-data__text">人分享</view>
				</view>
				<view class="festival-intro-data__item">
					<view class="festival-intro-data__icon iconfont icon-123"></view>
					<view class="festival-intro-data__text is-strong">{{cViewsNum}}</view>
					<view class="festival-intro-data__text">人浏览</view>
				</view>
			</view>
			<!-- 活动数据 end -->
		</view>
		<view class="festival-intro__content">
			<view class="festival-intro__title">{{title}}</view>
			<slot>
				<view class="festival-intro__price"><text class="is-red">￥</text><text class="is-red is-strong festival-intro__price__num">{{priceStr}}</text><text>市场价：{{priceDelStr}}</text></view>
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 应该把这个几个量提成数组的
			// 浏览量
			viewsNum: {
				type: [String,Number],
				default: 0
			},
			// 分享量
			shareNum: {
				type: [String,Number],
				default: 0
			},
			// 购买量
			buyNum: {
				type: [String,Number],
				default: 0
			},
			// 购买量对应的文字
			buyText: {
				type: String,
				default: '人已购'
			},
			buyIcon: {
				type: String,
				default: 'iconfont icon-119'
			},
			// 标题
			title: {
				type: String,
				default: ''
			},
			// 价格str
			priceStr: {
				type: String,
				default: ''
			},
			// 原价str
			priceDelStr: {
				type: String,
				default: ''
			}
		},
		computed: {
			cViewsNum() {
				return this.transformNum(this.viewsNum)
			},
			cShareNum() {
				return this.transformNum(this.shareNum)
			},
			cBuyNum() {
				return this.transformNum(this.buyNum)
			}
		},
		methods: {
			transformNum(num) {
				num = +num
				if(num < 0) {
					return 0
				}
				if(num > 10000) {
					return +(num/10000).toFixed(2) + 'w'
				}
				return num
			}
		}
	}
</script>

<style lang="scss" scoped>
	.festival-intro {
		width: 690rpx;
		margin: 20rpx auto;
	}
	.festival-intro__header {
		border-radius: 10rpx 10rpx 0 0;
		background-color: #F8F8F8;
	}
	// 活动数据
	.festival-intro-data {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 70rpx;
		padding: 0 40rpx;
		white-space: nowrap;
	}
	.festival-intro-data__item {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
	}
	.festival-intro-data__icon {
		margin-right: 10rpx;
		font-size: inherit;
		color: inherit;
	}
	.festival-intro-data__text {
		&.is-strong {
			color: #333333;
		}
	} 
	// 活动数据
	.festival-intro__content {
		box-sizing: border-box;
		padding: 30rpx;
		border-radius: 0 0 10rpx 10rpx;
		background-color: #fff;
	}
	.festival-intro__title {
		font-size: 32rpx;
		color: #333333;
		font-weight: bold;
	}
	.festival-intro__price {
		margin-top: 16rpx;
		white-space: nowrap;
		text-align: center;
		color: #999;
		font-size: 24rpx;
		.is-red {
			color: #FF4444;
		}
		.is-strong {
			font-size: 58rpx;
			font-weight: bold;
		}
	}
	.festival-intro__price__num {
		margin-right: 16rpx;
	}
</style>
