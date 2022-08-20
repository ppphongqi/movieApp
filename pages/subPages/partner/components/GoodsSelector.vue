<template>
	<view class="c-GoodsSelector">
		<view class="c-GoodsSelector-list">
			<view v-for="(item,index) in list" :key="item.id" class="c-GoodsSelector-item" @click="handleItemClick(item,index)">
				<view class="c-GoodsSelector-card" :class="{'is-active':value.includes(item.id)}">
					<view class="c-GoodsSelector-card__left">
						<view class="c-GoodsSelector-card__radio" :class="{'is-active':value.includes(item.id)}">
							<view class="iconfont icon-check"></view>
						</view>
						<image class="c-GoodsSelector-card__img" :src="item.imgSrc" mode="aspectFill"></image>
					</view>
					<view class="c-GoodsSelector-card__center">
						<view class="c-GoodsSelector-card__title">{{item.title}}</view>
						<view class="c-GoodsSelector-card__row">
							<view class="c-GoodsSelector-card__price">
								平台价：<text class="is-red">￥</text><text class="is-red is-strong">{{item.price}}</text>
							</view>
							<view class="c-GoodsSelector-card__price">
								分销佣金：<text class="is-red">￥</text><text class="is-red is-strong">{{item.rebate}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 当前选中项的id value v-model
			value: {
				type: Array,
				default () {
					return []
				}
			},
			// 最多选择几项
			max: {
				type: Number,
				default: Infinity
			},
			// 列表数据
			list: {
				type: Array,
				default () {
					return [{
						id: 'good1',
						imgSrc: 'https://via.placeholder.com/190x190/2a9ff6/fffffff',
						title: '4店通用·哈姆西克754店通用店4 店通用·哈姆西克754店通用店4店通用·哈姆西克754店通用店4 店通用·哈姆西克754店通用店',
						price: '88888.00',
						rebate: '8.00',
					}]
				}
			}
		},
		methods: {
			handleItemClick(item,index) {
				const targetIndex = this.value.indexOf(item.id)
				let newValue = []
				if(targetIndex == -1) {
					// 添加该项
					newValue = [...this.value,item.id]
				}else if(targetIndex > -1) {
					// 删除该项
					newValue = this.value.filter(val=>val != item.id)
				}
				if(newValue.length > this.max) {
					uni.showToast({
						icon: 'none',
						title:'最多选择'+this.max+'项'
					})
					return 
				}
				// v-model
				this.$emit('input',newValue)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-GoodsSelector-card {
		box-sizing: border-box;
		display: flex;
		width: 690rpx;
		max-width: 100%;
		padding: 20rpx;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 20rpx;
	}
	
	.c-GoodsSelector-card__left {
		display: flex;
		align-items: center;
	}
	
	.c-GoodsSelector-card__radio {
		box-sizing: border-box;
		display: flex;
		width: 40rpx;
		height: 40rpx;
		align-items: center;
		justify-content: center;
		border-radius: 100%;
		border: 1px solid #ccc;
		background: transparent;
		color: #fff;
	
		.iconfont {
			display: none;
			font-size: 24rpx;
		}
		&.is-active {
			border-color: #FF4444;
			background: #FF4444;
			color: #fff;
			.iconfont {
				display: block;
			}
		}
	}
	
	.c-GoodsSelector-card__img {
		width: 128rpx;
		height: 128rpx;
		margin-left: 20rpx;
		border-radius: 20rpx;
	}
	
	.c-GoodsSelector-card__center {
		display: flex;
		flex: 1;
		min-width: 0;
		flex-direction: column;
		margin-left: 20rpx;
	}
	
	.c-GoodsSelector-card__title {
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: auto;
	}
	
	.c-GoodsSelector-card__row {
		display: flex;
		align-items: center;
	}
	
	.c-GoodsSelector-card__price {
		flex: 1;
		font-size: 24rpx;
		color: #999999;
		white-space: nowrap;
		&+& {
			margin-left: 20rpx;
		}
	
		&.is-red,
		.is-red {
			color: #FE504F;
		}
	
		&.is-strong,
		.is-strong {
			font-weight: bold;
		}
		&.is-del,
		.is-del {
			text-decoration: line-through;
		}
	}
</style>
