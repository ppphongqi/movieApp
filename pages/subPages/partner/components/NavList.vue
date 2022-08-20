<template>
	<view class="c-NavList">
		<view v-for="(item,index) in list" :key="item.id" class="c-NavList__item">
			<view class="c-nav-card" @click="handleItemClick(item,index)">
				<image class="c-nav-card__img" :src="item.imgSrc" mode="aspectFill"></image>
				<view class="c-nav-card__text">{{item.text}}</view>
				<!-- #ifdef MP-TOUTIAO || MP-ALIPAY -->
				<button v-if="item.type === 'poster'" class="c-nav-card__btn-share" open-type="share"></button>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 数据列表
			list: {
				type: Array,
				default () {
					return [
						// {
						// 	id: '01',
						// 	imgSrc: 'https://via.placeholder.com/98x60/2a9ff6/fffffff',
						// 	text: '我的团队',
						// 	url: ''
						// },
					]
				}
			}
		},
		methods: {
			handleItemClick(item,index) {
				if(item.url) {
					this.navigationTo(item.url)
				}
				this.$emit('on-item-click',item,index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	$item-gutter: 90rpx;
	$item-cols: 5;
	.c-NavList {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.c-NavList__item {
		box-sizing: border-box;
		padding: 0 $item-gutter/2;
		margin: 20rpx 0;
		width: percentage($number: 1/$item-cols);
	}
	.c-nav-card {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.c-nav-card__img {
		width: 98rpx;
		height: 60rpx;
		border-radius: 9999rpx;
	}
	.c-nav-card__text {
		margin-top: 14rpx;
		font-size: 24rpx;
		color: #333;
		white-space: nowrap;
	}
	.c-nav-card__btn-share {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
	}
</style>
