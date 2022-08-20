<template>
	<view class="c-GiftGoodsSelect">
		<scroll-view class="c-GiftGoodsSelect__scroll" scroll-x="true" >
			<view class="app-flex--inline-flex app-flex--align-center app-clearfix">
				<view v-for="item in list" :key="item.id" class="c-GiftGoodsSelect__item app-flex-item app-flex app-flex--column app-flex--align-center app-flex--justify-center" :class="{
					'has-subTitle': item.subTitle,
					'is-active': value.includes(item.id)
				}" @click="handleItemClick(item)">
					<view class="c-GiftGoodsSelect__title">{{item.title}}</view>
					<view v-if="item.subTitle" class="c-GiftGoodsSelect__subTitle">{{item.subTitle}}</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'GiftGoodsSelect',
		props: {
			// 当前选中的id，只受控，为了支持多选，这个值是个数组，即使最多只能选择一个时候
			value: {
				type: Array,
				default () {
					return [0];
				},
			},
			title: {
				type: String,
				default: '商品核销'
			},
			// 列表数据
			list: {
				type: Array,
				default () {
					return Array(30).fill(1).map((item, index) => ({
						id: index,
						title: '6.24',
						subTitle: '周五',
					}))
				},
			},
			// 最多选择多少个
			max: {
				type: Number,
				default: 1,
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
			handleItemClick(item) {
				let newVal = [...this.value];
				const targetIndex = this.value.findIndex(val => val === item.id)
				// 如果已经选中，则取消选中
				if (targetIndex !== -1) {
					newVal.splice(targetIndex, 1)
				// 如果未选中，则选中
				} else {
					newVal = [
						item.id,
						...this.value,
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
	.c-GiftGoodsSelect {
		margin: 20rpx auto;
	}
	.c-GiftGoodsSelect__title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		white-space: nowrap;
		.has-subTitle & {
			font-size: 24rpx;
		}
	}
	.c-GiftGoodsSelect__item {
		min-width: 120rpx;
		height: 80rpx;
		padding: 0 30rpx;
		border-radius: 20rpx;
		&.is-active{
			background-color: #FED900;
		}
	}
	.c-GiftGoodsSelect__subTitle {
		font-size: 24rpx;
		white-space: nowrap;
		color: #333;
	}
</style>
