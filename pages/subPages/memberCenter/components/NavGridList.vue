<template>
	<view class="c-NavGridList">
		<view class="c-NavGridList__item" :style="[cItemStyle]" v-for="(item,index) in list" :key="item.id"  @click="$emit('on-item-click',item,index)">
			<image class="c-NavGridList__img" :src="item.image"></image>
			<view class="c-NavGridList__text">{{item.text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'NavGridList',
		props: {
			// 列表数据
			list: {
				type: Array,
				default() {
					// return Array(4).fill(4).map((item,index)=>({
					// 	id: 'id'+index,
					// 	image: 'http://placekitten.com/60/60',
					// 	text: '专属折扣专属折扣专属折扣'
					// }))
					return []
				}
			},
			// 有几列
			cols: {
				type: Number,
				default: 4
			}
		},
		computed: {
			cItemStyle() {
				return {
					width: `${1/this.cols*100}%`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-NavGridList {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-top: 30rpx;
	}
	.c-NavGridList__img {
		width: 60rpx;
		height: 60rpx;
	}
	.c-NavGridList__item {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 10rpx;
	}
	.c-NavGridList__text {
		max-width: 100%;
		margin-top: 20rpx;
		font-size: 24rpx;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
