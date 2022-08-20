<template>
	<view class="c-SortBar">
		<view v-for="(item,index) in list" :key="item.id" class="c-SortBar__item"
			:class="{'c-SortBar__item--active':value[item.id] && item.type === 'text',
			'c-SortBar__item--desc':value[item.id]==='desc' && item.type === 'sortable','c-SortBar__item--asc':value[item.id]==='asc' && item.type === 'sortable'}"
			@click="handleItemClick(item,index)">
			<view class="c-SortBar__item__text">{{item.title}}</view>
			<view v-if="item.type === 'sortable'" class="c-SortBar__item__icon"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 默认的选中和排序情况
			defaultValue: {
				type: Object,
				default () {
					return {

					}
				}
			},
			// 是否只同时支持一种排序方式
			uniqSort: {
				type: Boolean,
				default: true
			},
			// 列表数据
			list: {
				type: Array,
				default () {
					return [{
						id: 'all',
						title: ' 综合',
						value: 'desc',
						type: 'text'
					}, {
						id: 'total_sales',
						title: ' 销量',
						type: 'sortable'
					}, {
						id: 'rebate_commission',
						title: ' 佣金',
						type: 'sortable'
					}, {
						id: 'create_time',
						title: ' 最新',
						value: 'desc',
						type: 'text'
					}]
				}
			}
		},
		data() {
			return {
				// 当前选中或者排序情况
				value: {
					...this.defaultValue
				}
			}
		},
		computed: {

		},
		watch: {
			// 当defaultValue改变时改变value
			defaultValue(val) {
				this.value = {
					...this.defaultValue
				}
			},
		},
		methods: {
			handleItemClick(item, index) {
				let tempValue = {
					...this.value
				}
				if(this.uniqSort) {
					tempValue = {}
				}
				if (item.type === 'text') {
					// 如果是文本
					if (this.value[item.id]) {
						this.value = {
							...tempValue,
							[item.id]: undefined
						}
					} else {
						this.value = {
							...tempValue,
							[item.id]: item.value
						}
					}
				} else if (item.type === 'sortable') {
					// 如果是排序
					if (!this.value[item.id]) {
						this.value = {
							...tempValue,
							[item.id]: 'desc'
						}
					} else if (this.value[item.id] === 'desc') {
						this.value = {
							...tempValue,
							[item.id]: 'asc'
						}
					} else if (this.value[item.id] = 'asc') {
						this.value = {
							...tempValue,
							[item.id]: undefined
						}
					}
				}
				this.$emit('on-item-click', {
					item,
					index,
					value: this.value
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	.c-SortBar {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		height: 80rpx;
		background-color: #fff;
	}

	.c-SortBar__item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		max-width: 25%;
	}

	.c-SortBar__item__text {
		color: #333333;
		font-size: 28rpx;

		.c-SortBar__item--active & {
			font-weight: bold;
		}
	}

	.c-SortBar__item__icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-left: 14rpx;

		&::before,
		&::after {
			display: block;
			content: "\20";
		}

		&::before {
			border-left: 8rpx solid transparent;
			border-right: 8rpx solid transparent;
			border-bottom: 10rpx solid #CCCCCC;

			.c-SortBar__item--asc & {
				border-bottom: 10rpx solid #333333;
			}
		}

		&::after {
			margin-top: 4rpx;
			border-left: 8rpx solid transparent;
			border-right: 8rpx solid transparent;
			border-top: 10rpx solid #CCCCCC;

			.c-SortBar__item--desc & {
				border-top: 10rpx solid #333333;
			}
		}
	}
</style>
