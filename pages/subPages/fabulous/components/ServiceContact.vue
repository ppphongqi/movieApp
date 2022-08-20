<template>
	<view class="c-service-contact">
		<view class="c-service-contact__left">
			<image class="avatar" :src="avatar"></image>
			
		</view>
		<view class="c-service-contact__content">
			<view class="title">{{title}}</view>
			<view class="subtitle">{{subtitle}}</view>
		</view>
		<view class="c-service-contact__right">
			<button class="btn-op btn-normal" open-type="contact">对话</button>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 客服头像
			avatar: {
				type: String,
				default: 'https://via.placeholder.com/68x68/2a9ff6/fffffff'
			},
			// 标题
			title: {
				type: String,
				default: '本地吃喝玩乐福利群'
			},
			// 副标题
			subtitle: {
				type: String,
				default: '有问题咨询客服小姐姐~'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-service-contact {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		width: 690rpx;
		max-width: 100%;
		height: 128rpx;
		margin: 0 auto;
		padding: 0 30rpx;
		background-color: #fff;
		box-shadow: 0 2rpx 24rpx 0 rgba(221, 221, 221, 0.5);
		border-radius: 10rpx;
	}
	.avatar {
		height: 68rpx;
		width: 68rpx;
		border-radius: 100%;
	}
	.c-service-contact__content {
		width: 0;
		flex: 1;
		margin: 0 16rpx;
	}
	.title {
		font-weight: bold;
		font-size: 28rpx;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.subtitle {
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.btn-op {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50rpx;
		padding: 0 27rpx;
		color: #fff;
		font-size: 24rpx;
		background-color: #2AC418;
		border-radius: 6rpx;
	}
</style>
