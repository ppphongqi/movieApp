<template>
	<view class="c-DashboardCard">
		<view class="c-DashboardCard__content">
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
					<view class="profit-price"><text class="profit-price__small">￥</text>{{cDetails.withdrawnCash.price}}<text
							v-if="cDetails.withdrawnCash.unit"
							class="profit-price__small">{{cDetails.withdrawnCash.unit}}</text></view>
					<view class="profit-text">已提现</view>
				</view>
			</view>
			<view class="balance-card">
				<view class="balance-card__left">
					<view class="balance-title">余额</view>
					<view class="balance-price"><text class="balance-price__small">￥</text>{{cDetails.balance.price}}<text
							v-if="cDetails.balance.unit"
							class="profit-price__small">{{cDetails.balance.unit}}</text></view>
				</view>
				<view class="balance-card__right">
					<view class="balance-card__rights" @click="$emit('on-rights-click')">业务员权益<view class="iconfont icon-zhuyi is-inline"></view></view>
					<button v-if="btnWithdrawVisible" class="btn-normal btn-withdrawal" @click="$emit('on-btn-withdrawal-click')"><image class="btn-withdrawal__img" src="../static/images/img-rmb.png"></image>我要提现<view class="btn-withdrawal__icon-more iconfont icon-right is-inline"></view></button>
				</view>
			</view>
		</view>
		<view class="c-DashboardCard__footer">
			<view class="data-nav-list">
				<view class="data-nav" @click="$emit('on-btn-bill-click')">
					<image src="../static/images/img-bill.png" class="data-nav__img" />账单明细
				</view>
				<!-- #ifndef MP-TOUTIAO -->
				<view class="data-nav" @click="$emit('on-btn-poster-click')">
					<image src="../static/images/img-poster.png" class="data-nav__img" />我的海报
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-TOUTIAO -->
				<button class="btn-normal data-nav" open-type="share">
					<image src="../static/images/img-poster.png" class="data-nav__img" />邀请商家
				</button>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
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
			// 已提现（元）
			withdrawnCash: {
				type: [String,Number],
				default: 0
			},
			// 余额（元）
			balance: {
				type: [String,Number],
				default: 0
			},
			// 提现按钮是否显示
			btnWithdrawVisible: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			// 格式化的数据
			cDetails() {
				return {
					totalProfit: this.formatPrice(this.totalProfit),
					todayProfit: this.formatPrice(this.todayProfit),
					withdrawnCash: this.formatPrice(this.withdrawnCash),
					balance: this.formatPrice(this.balance)
				}
			}
		},
		methods: {
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
	// footer
	.c-DashboardCard__footer {
		box-sizing: border-box;
		padding: 30rpx;
	}

	.data-nav-list {
		display: flex;
		align-items: center;
	}

	.data-nav {
		flex: 1 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 28rpx;
		color: #333333;
	}

	.data-nav__img {
		width: 50rpx;
		height: 50rpx;
		margin-right: 20rpx;
	}

	// footer end
</style>
