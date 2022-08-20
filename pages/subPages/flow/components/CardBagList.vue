<template>
	<scroll-view class="card-bag-wrapper" scroll-x>
		<view class="card-bag-list">
			<view v-for="(item,index) in list" :key="item.id" class="card-bag-list__item" @click="$emit('on-item-click',item,index)">
				<view class="card-bag" :style="{backgroundImage: `url(${item.bgUrl})`}">
					<view class="card-bag__left">
						<view class="card-bag__title">{{item.title}}</view>
						<view class="card-bag__desc">{{item.desc}}</view>
					</view>
					<view class="card-bag__right">
						<view class="iconfont icon-news-left card-bag__icon-more"></view>
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
					// return [{
					// 	id: 'item01',
					// 	title: '标准洗车卡',
					// 	desc: '年卡',
					// 	bgUrl: 'https://via.placeholder.com/650x200/2a9ff6/fffffff'
					// }, {
					// 	id: 'item02',
					// 	title: '标准洗车卡',
					// 	desc: '年卡',
					// 	bgUrl: 'https://via.placeholder.com/650x200/2a9ff6/fffffff'
					// }, ]
					return []
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.card-bag-wrapper {
		width: 750rpx;
		margin: 20rpx auto;
	}
	.card-bag-list {
		box-sizing: border-box;
		display: inline-flex;
		padding: 0 20rpx;
	}
	.card-bag-list__item {
		padding: 0 10rpx;
	}
	.card-bag {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		width: 650rpx;
		height: 200rpx;
		padding: 30rpx 30rpx 30rpx 40rpx;
		background-position: center;
		background-size: cover;
		color: #fff;
		background-repeat: no-repeat;
		border-radius: 20rpx;
	}
	.card-bag__left {
		min-width: 0;
		flex: 1;
	}
	.card-bag__right {
		flex-shrink: 0;
		margin-left: 10rpx;
	}
	.card-bag__title {
		font-size: 28rpx;
	}
	.card-bag__desc {
		margin-top: 10rpx;
		font-size: 48rpx;
		font-weight: bold;
	}
	.card-bag__icon-more {
		font-size: 34rpx;
	}
</style>
