<template>
	<view class="c-DashboardCard">
		<view class="c-DashboardCard__content">
			<!-- 收益 -->
			<view class="profit-list">
				<view class="profit-list__item">
					<view class="profit-price"><text class="profit-price__small">￥</text>{{cDetails.totalProfit.price}}<text
							v-if="cDetails.totalProfit.unit"
							class="profit-price__small">{{cDetails.totalProfit.unit}}</text></view>
					<view class="profit-text">累计收益</view>
				</view>
				<view class="profit-list__item">
					<view class="profit-price"><text class="profit-price__small">￥</text>{{cDetails.todayProfit.price}}<text
							v-if="cDetails.todayProfit.unit"
							class="profit-price__small">{{cDetails.todayProfit.unit}}</text></view>
					<view class="profit-text">今日收益</view>
				</view>
				<view class="profit-list__item">
					<view class="profit-price"><text class="profit-price__small">￥</text>{{cDetails.monthProfit.price}}<text
							v-if="cDetails.monthProfit.unit"
							class="profit-price__small">{{cDetails.monthProfit.unit}}</text></view>
					<view class="profit-text">月收益</view>
				</view>
			</view>
			<!-- 收益 end -->
			<!-- 提现 -->
			<view class="balance-card">
				<view class="balance-card__left">
					<view class="balance-title">可提现金额</view>
					<view class="balance-price"><text class="balance-price__small">￥</text>{{cDetails.balance.price}}<text
							v-if="cDetails.balance.unit"
							class="profit-price__small">{{cDetails.balance.unit}}</text></view>
				</view>
				<view class="balance-card__right">
					<button class="btn-normal btn-withdrawal" @click="$emit('on-btn-withdrawal-click')"><image class="btn-withdrawal__img" src="../static/images/img-rmb.png"></image>我要提现<view class="btn-withdrawal__icon-more iconfont icon-right is-inline"></view></button>
				</view>
				<view v-if="refreshTipVisible" class="tip-bar-wrapper">
					<TipBar containerStyle="background-color:#FEC318;" @on-btn-click="$emit('on-btn-refresh-click')"></TipBar>
				</view>
			</view>
			<!-- 提现 end -->
		</view>
	</view>
</template>

<script>
	
	import TipBar from '@/components/template/TipBar.vue'
	export default {
		components: {
			TipBar
		},
		props: {
			// 累计收益（元）
			totalProfit: {
				type: [String,Number],
				default: 0
			},
			// 今日收益（元）
			todayProfit: {
				type: [String,Number],
				default: 0
			},
			// 月收益（元）
			monthProfit: {
				type: [String,Number],
				default: 0
			},
			// 可提现金额（元）
			balance: {
				type: [String,Number],
				default: 0
			},
			// 是否显示刷新提示
			refreshTipVisible: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			// 格式化的数据
			cDetails() {
				return {
					totalProfit: this.formatPrice(this.totalProfit),
					todayProfit: this.formatPrice(this.todayProfit),
					monthProfit: this.formatPrice(this.monthProfit),
					balance: this.formatPrice(this.balance)
				}
			}
		},
		methods: {
			// 格式化的金额的方法
			formatPrice(price) {
				price = +price || 0
				if(price >= 10000) {
					return {
						price: (price/10000).toFixed(2),
						unit: '万'
					}
				}
				return {
					price: price.toFixed(2)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-DashboardCard {
		width: 690rpx;
		max-width: 100%;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.c-DashboardCard__content {
		background-color: #FFD940;
		border-radius: 0 0 20rpx 20rpx;
		overflow: hidden;
	}

	// 收益列表
	.profit-list {
		box-sizing: border-box;
		display: flex;
		padding: 40rpx 30rpx;
	}

	.profit-list__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1 0 auto;
	}

	.profit-price {
		font-weight: 900;
		font-size: 36rpx;
		color: #482311;
	}

	.profit-price__small {
		font-size: 24rpx;
	}

	.profit-text {
		margin-top: 10rpx;
		color: #B2972B;
		font-size: 24rpx;
	}

	// 收益列表 end
	// 余额信息
	.balance-card {
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding: 30rpx 0 30rpx 30rpx;
		justify-content: space-between;
		background: linear-gradient(-267deg, #FFD940 0%, #FFD247 100%);
	}

	.balance-title {
		margin-bottom: 10rpx;
		color: #B2972B;
		font-size: 24rpx;
	}

	.balance-price {
		font-weight: 900;
		font-size: 48rpx;
		color: #482311;
	}

	.balance-price__small {
		font-size: 24rpx;
	}

	.balance-card__rights {
		box-sizing: border-box;
		margin-bottom: 10rpx;
		padding-right: 30rpx;
		color: #B2972B;
		font-size: 24rpx;
		text-align: right;
		.iconfont {
			line-height: 1;
			margin-left: 10rpx;
		}
	}

	.btn-withdrawal {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 70rpx;
		padding-left: 10rpx;
		padding-right: 20rpx;
		font-size: 28rpx;
		color: #482215;
		border-radius: 9999rpx 0 0 9999rpx;
		background-color: #FEC318;
	}
	
	.btn-withdrawal__img {
		width: 50rpx;
		height: 50rpx;
		margin-right: 20rpx;
	}
	
	.btn-withdrawal__icon-more {
		font-size: inherit;
		color: inherit;
		margin-left: 20rpx;
	}

	// 余额信息 end
	.tip-bar-wrapper {
		box-sizing: border-box;
		width: 100%;
		padding-right: 30rpx;
	}
</style>
