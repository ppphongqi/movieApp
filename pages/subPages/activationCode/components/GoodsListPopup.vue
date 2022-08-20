<template>
	<popup-view class="goods-list-popup" :show="dVisible" type="bottom" @clickmask="dVisible = false">
		<view class="goods-list-card app-after--safe-bottom">
			<!-- header -->
			<view class="goods-list-card__header">
				激活详情
			</view>
			<!-- header -->
			<!-- content -->
			<scroll-view scroll-y="true" style="height: 600rpx;">
				<view style="padding: 30rpx;">
					<view class="sku-table">
						<view class="sku-table__tr sku-table__tr--header">
							<view class="sku-table__th">商品名称</view>
							<view class="sku-table__th">价格</view>
						</view>
						<view class="sku-table__tr" v-for="item in list" :key="item.id">
							<view class="sku-table__td">{{item.name}}</view>
							<view class="sku-table__td">
								<view class="c-price"><text class="is-strong">￥{{item.price}}</text></view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- content end -->
			<!-- footer -->
			<view class="goods-list-card__footer">
				<button class="btn-normal goods-list-card__btn-go is-active" @click="$emit('on-btn-confirm-click')">确认</button>
			</view>
			<!-- footer end -->
			<!-- 关闭按钮 -->
			<view class="iconfont icon-searchclose goods-list-card__close" @click="dVisible = false"></view>
			<!-- 关闭按钮 end -->
		</view>
	</popup-view>
</template>

<script>
	import PopupView from '@/components/template/PopManager.vue'
	export default {
		components: {
			PopupView
		},
		props: {
			// 默认是否显示v-model
			value: {
				type: Boolean,
				default: false
			},
			// 列表数据
			list: {
				type: Array,
				default () {
					// return [{
					// 	id: '01',
					// 	name: '4店通用·哈姆西克754店通用店4店a',
					// 	price: '8.00',
					// },{
					// 	id: '02',
					// 	name: '4店通用',
					// 	price: '9.00',
					// }]
					return []
				}
			}
		},
		data() {
			return {
				dVisible: this.value,
				// 当前选中的id
				activeId: this.$util.deepGet(this.list, '0.id', '')
			}
		},
		watch: {
			value(val) {
				this.dVisible = val
			},
			dVisible(val) {
				this.$emit('input', val)
			},
		},

	}
</script>

<style lang="scss" scoped>
	.goods-list-card {
		position: relative;
		width: 100vw;
		border-radius: 20rpx 20rpx 0 0;
		background-color: #fff;
	}

	.goods-list-card__close {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
	}

	.goods-list-card__header {
		box-sizing: border-box;
		display: flex;
		min-height: 120rpx;
		padding: 0 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 40rpx;
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
		text-align: center;
	}

	.goods-list-card__content {
		box-sizing: border-box;
		padding: 30rpx 40rpx;
	}

	.goods-list-card__footer {
		display: flex;
		align-items: center;
		padding: 0 30rpx 30rpx 30rpx;
	}

	.goods-list-card__btn-go {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 90rpx;
		border-radius: 20rpx;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		border: 1px solid #ccc;

		&.is-active {
			background: var(--theme-color, #FFD940);
			color: var(--auxiliary-color, #333333);
			border: none;
		}

		&+& {
			margin-left: 20rpx;
		}
	}

	// table
	.sku-table {
		width: 100%;
		display: table;
		border: 1px solid #EEEEEE;
		border-radius: 10rpx;
	}

	.sku-table__tr {
		display: table-row;

		&:first-child {

			.sku-table__th,
			.sku-table__td {
				border-top: none;
			}
		}
	}

	.sku-table__tr--header {
		background-color: #FBFBFB;
	}

	.sku-table__th {
		display: table-cell;
		padding: 14rpx 10rpx;
		color: #333333;
		font-weight: bold;
		font-size: 24rpx;
		border-top: 1px solid #EEEEEE;

		&+& {
			border-left: 1px solid #EEEEEE;
		}
	}

	.sku-table__td {
		padding: 14rpx 10rpx;
		display: table-cell;
		color: #333333;
		font-weight: bold;
		font-size: 24rpx;
		border-top: 1px solid #EEEEEE;
		
		.is-red {
			color: #FE504F;
		}

		&+& {
			border-left: 1px solid #EEEEEE;
		}
	}

	// table end
	.c-price {
		font-size: 24rpx;
		font-weight: normal;
		color: #333333;
	
		.is-red {
			color: #FE504F;
		}
	
		.is-strong {
			font-weight: bold;
			color: #FE504F;
		}
	}
</style>
