<template>
	<view class="c-NormalOpenList">
		<view v-for="(item,index) in list" :key="item.id" class="c-NormalOpenList-item">
			<!-- header -->
			<view class="app-flex app-flex--align-center">
				<view class="app-flex-item app-flex-item--shrink-0">
					<image class="c-NormalOpenList-item__img" :src="item.image" mode="aspectFill"></image>
				</view>
				<view class="app-flex-item app-flex-item--1">
					<view class="f-28 col-3 onelist-hidden">{{item.title}}</view>
					<view class="app-flex app-flex--align-center m-top10">
						<view class="app-flex-item f-24 col-f4">
							￥<text class="f-36 f-bold">{{item.price}}</text>
						</view>
						<view class="app-flex-item f-24 col-9" style="text-decoration: line-through;">
							￥{{item.linePirce}}
						</view>
					</view>
				</view>
			</view>
			<!-- header end -->
			<!-- footer -->
			<view class="app-flex app-flex--align-end app-flex--justify-between m-top20">
				<view class="app-flex-item" style="width: 70%;">
					<view v-for="code in item.codeList" :key="code" class="c-NormalOpenList-item__code app-flex--inline-flex app-flex--align-center">
						<view class="app-flex-item">核销码：</view>
						<view class="app-flex-item is-strong">{{code}}</view>
					</view>
				</view>
				<view v-if="btnDetailsVisible" class="app-flex-item app-flex-item--shrink-0">
					<button class="app-btn-plain--block"
						style="width: auto;height: 50rpx;font-size: 24rpx;" @click="handleBtnDetailsClick(item,index)">查看详情</button>
				</view>
			</view>
			<!-- footer end -->
		</view>
	</view>
</template>

<script>
	export default {
		name: 'OpenList',
		props: {
			// 列表数据
			list: {
				type: Array,
				default () {
					// return Array(2).fill(1).map((item, index) => ({
					// 	id: index,
					// 	title: '标题标题标题' + index,
					// 	image: 'https://via.placeholder.com/90x90/2a9ff6/fffffff',
					// 	codeList: ['1049 4992','1049 4992','1049 4992'],
					// 	// 价值
					// 	price: '104.00',
					// 	// 划线价
					// 	linePirce: '200.00'
					// }))
					return []
				},
			},
			// 是否显示查看详情
			btnDetailsVisible: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			handleBtnDetailsClick(item,index) {
				console.log('handleBtnDetailsClick 00',item,index)
				this.$emit('on-btn-details-click',item,index)
			}
		}

	}
</script>

<style lang="scss" scoped>
	.c-NormalOpenList-item {
		box-sizing: border-box;
		margin-top: 20rpx;
		padding: 20rpx;
		background-color: #F8F8F8;
		border-radius: 20rpx;
	}

	.c-NormalOpenList-item__img {
		width: 90rpx;
		height: 90rpx;
		border-radius: 20rpx;
	}

	.c-NormalOpenList-item__code {
		height: 40rpx;
		padding: 0 20rpx;
		font-size: 24rpx;
		color: #333;
		background-color: #EEEEEE;
		border-radius: 10rpx;
		&+& {
			margin-top: 14rpx;
		}

		.is-strong {
			font-size: 28rpx;
			font-weight: bold;
		}
	}
</style>

