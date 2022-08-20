<template>
	<view class="statistics-list">
		<view v-for="item in cListData" :key="item._id" class="statistics-item">
			<view class="statistics-item__icon" :class="item.icon"></view>
			<view class="statistics-item__text is-strong">{{item.numStr}}</view>
			<view class="statistics-item__text">{{item.text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 最外层容器的样式
			containerStyle: {
				type: String,
				default: ''
			},
			// 列表数据
			listData: {
				type: Array,
				default() {
					return [
						{
							_id: '01',
							icon: 'iconfont icon-120',
							num: 0,
							text: '人购买'
						}
					]
				}
			},
			// 是否将数字转换为万为单位 比如10000转换为1w
			transformNumToWan: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			cListData() {
				return this.listData.map(item=>({
					...item,
					numStr: this.transformNum(item.num)
				}))
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
	.statistics-list {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		max-width: 100%;
		height: 70rpx;
		padding: 0 40rpx;
		margin: 20rpx auto;
		white-space: nowrap;
		background-color: #F8F8F8;
		border-radius: 10rpx;
	}
	.statistics-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: percentage($number: 1/3);
		font-size: 24rpx;
		color: #999;
		&:first-child {
			justify-content: flex-start;
		}
		&:last-child {
			justify-content: flex-end;
		}
	}
	.statistics-item__icon {
		margin-right: 10rpx;
		font-size: inherit;
		color: inherit;
	}
	.statistics-item__text {
		&.is-strong {
			color: #333333;
		}
	} 
</style>
