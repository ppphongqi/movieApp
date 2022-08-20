<template>
	<view class="reward-wrapper">
		<view class="reward-wrapper__title">
			本次支付可获得
		</view>
		<view class="reward-list">
			<view v-for="(item,index) in cList" :key="item.id" class="reward-list__item">
				<view class="reward-card">
					<view class="reward-card__title">
						{{item.title}}
					</view>
					<view v-if="false" class="reward-card__desc">
						{{item.desc}}
					</view>
					<!-- 分享按钮 -->
					<block v-if="item.btnType == 1">
						<!-- #ifdef H5 -->
						<button class="btn-normal reward-card__btn" :disabled="item.disabled" :class="item.btnClass" @click="$emit('on-btn-h5-share-click',item,index)">{{item.btnText}}</button>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<button class="btn-normal reward-card__btn" open-type="share" :disabled="item.disabled" :class="item.btnClass"
						 @click="$emit('on-btn-wx-share-click',item,index)">{{item.btnText}}</button>
						<!-- #endif -->
					</block>
					<!-- 分享按钮 end -->
					<!-- 领取按钮 -->
					<block v-else-if="item.btnType == 2">
						<button class="btn-normal reward-card__btn" :disabled="item.disabled" :class="item.btnClass" @click="$emit('on-btn-receive-click',item,index)">{{item.btnText}}</button>
					</block>
					<!-- 领取按钮 end -->
					<!-- 已经领取按钮 -->
					<block v-else-if="item.btnType == 3">
						<button class="btn-normal reward-card__btn" :disabled="item.disabled" :class="item.btnClass" @click="$emit('on-btn-receive-click',item,index)">{{item.btnText}}</button>
					</block>
					<!-- 已经领取按钮 end -->
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
					return [{
						// id: 'reward2',
						// type: '积分',
						// title: '1奖励积分',
						// desc: '可兑红包',
						// 1:分享，2：领取，3：已领取
						// btnType: '0',
					}]
					return []
				}
			}
		},
		computed: {
			cList() {
				return this.list.map(item => {
					let btnText = ''
					let disabled = false
					let btnClass = ''
					if (item.btnType === 1) {
						btnText = '分享可领'
					} else if (item.btnType === 2) {
						btnText = '领取'
					} else if (item.btnType === 3) {
						btnText = '已领取'
						disabled = true
						btnClass = 'is-disabled'
					}
					return {
						btnText,
						disabled,
						btnClass,
						...item,
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 支付营销-本次支付可获得
	.reward-wrapper {
		width: 690rpx;
		height: 348rpx;
		margin: 30rpx auto;
		background-image: url(../static/images/bg-payment-reward.png);
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
	}

	.reward-wrapper__title {
		font-size: 28rpx;
		color: #733C05;
		font-weight: bold;
		text-align: center;
		height: 54rpx;
		line-height: 54rpx;
	}

	.reward-list {
		width: 644rpx;
		margin: 0 auto;
		margin-top: 30rpx;
		display: flex;
		justify-content: space-between;
	}

	.reward-card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 197rpx;
		height: 234rpx;
		padding: 20rpx 18rpx;
		padding-top: 30rpx;
		background-image: url(../static/images/bg-payment-reward-item.png);
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
	}

	.reward-card__title {
		max-width: 100%;
		font-size: #977604;
		color: #977604;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 80rpx;
	}

	.reward-card__desc {
		max-width: 100%;
		margin-bottom: 20rpx;
		text-overflow: ellipsis;
		font-size: 24rpx;
		color: #999999;
		white-space: nowrap;
		overflow: hidden;
	}

	.reward-card__btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		min-width: 110rpx;
		height: 44rpx;
		padding: 0 10rpx;
		border-radius: 9999rpx;
		font-size: 24rpx;
		color: #733C05;
		background: linear-gradient(-180deg, #FCE287 0%, #DB9916 100%);

		&.is-disabled {
			color: #999;
			background: transparent;
			border: 1px solid #EEEEEE;
		}
	}

	// 支付营销-本次支付可获得 end
</style>
