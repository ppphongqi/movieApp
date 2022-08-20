<template>
	<view v-if="cData.visible" class="c-DistributorFixed">
		<view class="c-DistributorFixed__center">
			<view class="c-DistributorFixed__title">{{cData.nickName}}</view>
			<view class="c-DistributorFixed__label">{{cData.label}}</view>
		</view>
		<view class="c-DistributorFixed__right">
			<image class="c-DistributorFixed__avatar" :src="cData.avatar" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 头像地址
			avatar: {
				type: String,
				default: ''
			},
			// 昵称
			nickName: {
				type: String,
				default: ''
			},
			// 标签
			label: {
				type: String,
				default: ''
			},
		},
		computed: {
			cData() {
				const dealer = this.mainMixin_userAll && this.mainMixin_userAll.dealer || {}
				return {
					visible: dealer.superior_dealer_avatarUrl &&　dealer.superior_dealer_name,
					avatar: this.avatar || dealer.superior_dealer_avatarUrl,
					nickName: this.nickName || dealer.superior_dealer_name,
					label: this.label || this.dealerDiyFont.fxs
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-DistributorFixed {
		box-sizing: border-box;
		position: fixed;
		left: 0;
		top: 300rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 224rpx;
		height: 92rpx;
		padding: 0 10rpx;
		background-color: #fff;
		border-radius: 0 9999rpx 9999rpx 0;
		box-shadow: 0px 3rpx 6rpx rgba(0, 0, 0, 0.16);
		z-index: 15;
	}
	.c-DistributorFixed__center {
		min-width: 0;
		flex: 1;
	}
	.c-DistributorFixed__right {
		margin-left: 10rpx;
	}
	.c-DistributorFixed__avatar {
		width: 72rpx;
		height: 72rpx;
		border-radius: 100%;
	}
	.c-DistributorFixed__title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.c-DistributorFixed__label {
		box-sizing: border-box;
		display: inline-block;
		height: 28rpx;
		max-width: 100%;
		padding: 0 7rpx;
		font-size: 20rpx;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 28rpx;
		border-radius: 9999rpx;
		background-color: #FFC90A;
		
	}
</style>
