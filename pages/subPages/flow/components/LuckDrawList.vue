<template>
	<scroll-view class="luck-draw-wrapper" scroll-x>
		<view class="luck-draw-list">
			<view v-for="(item,index) in list" :key="item.id" class="luck-draw-list__item">
				<view class="luck-draw-card"  @click="$emit('on-item-click',item,index)">
					<view class="luck-draw-card__right">
						<image class="luck-draw-card__img" :src="item.imgUrl" mode="aspectFit"></image>
						<view class="luck-draw-card__label">{{item.label}}</view>
					</view>
					<view class="luck-draw-card__center">
						<view class="luck-draw-card__title"><view v-if="item.periods" class="luck-draw-card__periods">{{item.periods}}期</view>{{item.title}}</view>
						<view class="luck-draw-card__row">
							<view class="luck-draw-card__num">已有{{item.num}}人参与抽奖</view>
							<button class="btn-normal luck-draw-card__btn">前往抽奖</button>
						</view>
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
					return [{
						id: 'item0',
						// 商品图片
						imgUrl: 'https://via.placeholder.com/170x170/2a9ff6/fffffff',
						// 标签文字
						label: '抽奖',
						// 标题
						title: '【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐',
						// 参与抽奖人数
						num: 500,
						// 期数
						periods: 10
					}, {
						id: 'item1',
						// 商品图片
						imgUrl: 'https://via.placeholder.com/170x170/2a9ff6/fffffff',
						// 标签文字
						label: '抽奖',
						// 标题
						title: '【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐【4店通用·哈姆西克】75元抢2- 4元套餐',
						// 参与抽奖人数
						num: 500,
					}]
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.luck-draw-wrapper {
		width: 750rpx;
		margin: 20rpx auto;
	}

	.luck-draw-list {
		box-sizing: border-box;
		display: inline-flex;
		padding: 0 20rpx;
	}

	.luck-draw-list__item {
		padding: 0 10rpx;
	}

	.luck-draw-card {
		width: 640rpx;
		box-sizing: border-box;
		display: flex;
		padding: 20rpx;
		background-color: #F8F8F8;
		border-radius: 10rpx;
	}

	.luck-draw-card__right {
		position: relative;
		font-size: 0;
	}

	.luck-draw-card__img {
		width: 170rpx;
		height: 170rpx;
	}

	.luck-draw-card__label {
		position: absolute;
		top: 10rpx;
		left: -17rpx;
		display: inline-flex;
		align-items: center;
		height: 34rpx;
		padding: 0 6rpx;
		font-size: 24rpx;
		color: #5E4E0F;
		background-color: #FFD940;
		border-radius: 0rpx 4rpx 4rpx 0px;
		&::after {
			position: absolute;
			top: 100%;
			left: 0;
			display: block;
			content: "\20";
			width: 0;
			height: 0;
			border-top: 12rpx solid #AB8901;
			border-left: 17rpx solid transparent; 
		}
	}

	.luck-draw-card__center {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
	}

	.luck-draw-card__title {
		display: -webkit-box;
		max-height: 2em * 1.4;
		margin-bottom: auto;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: 1.4;
		font-size: 28rpx;
		color: #333;
	}
	.luck-draw-card__periods {
		box-sizing: border-box;
		display: inline-block;
		height: 28rpx;
		padding: 0 6rpx;
		line-height: 28rpx;
		font-size: 20rpx;
		color: #333;
		background-color: #FFD940;
	}
	.luck-draw-card__row {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
	.luck-draw-card__num {
		font-size: 24rpx;
		color: #FF4444;
	}
	.luck-draw-card__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		height: 60rpx;
		min-width: 140rpx;
		padding: 0 8rpx;
		font-size: 28rpx;
		color: #333;
		border-radius: 6rpx;
		background-color: #FFD940;
	}
</style>
