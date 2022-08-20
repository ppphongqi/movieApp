<template>
	<view class="blessing-users-bullet">
		<view class="blessing-users-bullet__left"><text class="is-strong">{{num}}</text>人已获得</view>
		<view class="blessing-users-bullet__right"><users-bullet :fixed="false" bgColor="#EEEEEE" textColor="#000" :listData="listData" /></view>
	</view>
</template>

<script>
	import UsersBullet from './UsersBullet.vue'
	export default {
		props: {
			// 获得人数
			num: {
				type: Number,
				default: 100
			},
			listData: {
				type: Array,
				default() {
					return []
				}
			}
		},
		components: {
			UsersBullet
		}
	}
</script>

<style lang="scss" scoped>
	.blessing-users-bullet {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		width: 690rpx;
		padding: 20rpx 0;
		padding-left: 30rpx;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 10rpx;
		.is-strong {
			color: #FF4444;
		}
	}
	.blessing-users-bullet__left {
		font-size: 24rpx;
		color: #999;
	}
	.blessing-users-bullet__right {
		margin-left: 30rpx;
	}
</style>
