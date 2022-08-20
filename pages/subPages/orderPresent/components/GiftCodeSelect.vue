<template>
	<view class="c-GiftGoodsSelect">
		<view class="c-GiftGoodsSelect-list">
			<view v-for="(item,index) in list" :key="item.id" class="c-GiftGoodsSelect-item app-card" :class="{
					            'is-active': value.includes(item.id)
					          }">
				<view class="app-flex app-flex--align-center">
					<view class="app-flex-item app-flex-item--shrink-0">
						<image class="c-GiftGoodsSelect-item__img" :src="item.image" mode="aspectFill"></image>
					</view>
					<view class="app-flex-item app-flex-item--1">
						<view class="f-28 col-3 onelist-hidden">{{item.title}}</view>
						<view class="c-GiftGoodsSelect-item__code app-flex--inline-flex app-flex--align-center">
							<view class="app-flex-item">核销码：</view>
							<view class="app-flex-item is-strong">{{item.code}}</view>
						</view>
					</view>
				</view>
				<view class="app-flex app-flex--align-center m-top20">
					<view class="app-flex-item" style="font-size: 0;">
						<view class="iconfont is-inline icon-zhuyi col-f4"></view>
					</view>
					<view class="app-flex-item app-flex-item--1 f-24 col-3" style="margin-left: 12rpx;">
						持券仅需付<text class="col-f4 f-28 f-bold">{{item.needPrice}}</text>元
					</view>
				</view>
				
				<view class="app-flex app-flex--align-center m-top20">
					<view class="app-flex-item app-flex-item--1">
						<view class="app-flex-item app-flex-item--1 f-24 col-9">
							价值：￥<text class="f-28 f-bold">{{item.price}}</text>
						</view>
					</view>
					<view class="app-flex-item app-flex-item--shrink-0">
						<view class="c-GiftGoodsSelect__checkbox" :class="{
					            'is-active': value.includes(item.id)
					          }" @click="handleItemClick(item,index)">
							<view v-show="value.includes(item.id)" class="iconfont icon-check"></view>
						</view>
					</view>
				</view>
		
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'GiftGoodsSelect',
		props: {
			// 当前选中的id，只受控
			value: {
				type: Array,
				default () {
					return [1];
				},
			},
			// 列表数据
			list: {
				type: Array,
				default () {
					// return Array(2).fill(1).map((item, index) => ({
					// 	id: index,
					// 	title: '标题标题标题' + index,
					// 	image: 'https://via.placeholder.com/90x90/2a9ff6/fffffff',
					// 	code: '12345678',
					// 	// 价值
					// 	price: '104.00',
					// 	// 持券仅需
					// 	needPrice: '8.00'
					// }))
					return []
				
				},
			},
			// 最多选择多少个
			max: {
				type: Number,
				default: Infinity,
			},
		},
		data() {
			return {
				// 是否全选
				allChecked: false,
			}
		},
		watch: {
			// 监听是否全选
			allChecked(val) {
				if (!val) {
					this.$emit('input', []);
					return;
				}

				this.$emit('input', this.list.map(item=>item.id));
			},
		},
		methods: {
			// 切换全选
			toggleAllChecked(allChecked)　{
				if(typeof allChecked === 'boolean') {
					this.allChecked = allChecked
					return
				}
				this.allChecked = !this.allChecked
			},
			handleItemClick(item) {
				let newVal = [...this.value];
				const targetIndex = this.value.findIndex(val => val === item.id)
				// 如果已经选中，则取消选中
				if (targetIndex !== -1) {
					newVal.splice(targetIndex, 1)
				// 如果未选中，则选中
				} else {
					newVal = [
						...this.value,
						item.id,
					];
				}
				// 如果超过最大选择数量，则保留最新的选中
				if (newVal.length > this.max) {
					newVal = newVal.slice(0,this.max);
				}
				this.$emit('input', newVal);
			}

		}
	}
</script>

<style lang="scss" scoped>
	.c-GiftGoodsSelect__checkbox {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40rpx;
		height: 40rpx;
		font-size: 20rpx;
		color: #333;
		border: 1px solid #eee;
		border-radius: 6rpx;

		&.is-active {
			background-color: #ffd940;
			border-color: #ffd940;
		}
		.iconfont {
			font-size: inherit;
		}
	}

	.c-GiftGoodsSelect-item__img {
		width: 90rpx;
		height: 90rpx;
		border-radius: 20rpx;
	}

	.c-GiftGoodsSelect-item__code {
		height: 40rpx;
		margin-top: 16rpx;
		padding: 0 20rpx;
		font-size: 24rpx;
		color: #333;
		background-color: #EEEEEE;
		border-radius: 10rpx;

		.is-strong {
			font-size: 28rpx;
			font-weight: bold;
		}
	}
	.c-GiftGoodsSelect-item {
		background-color: #fff;
		border: 1px solid transparent;
		&.is-active {
			border: 1px solid #FFD940;
			background-color: #FFFDF3;
		}
		&:last-child {
			margin-bottom: 0;
		}
	}
</style>
