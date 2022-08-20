<template>
	<view class="normalCodeSelect">
		<!-- header -->
		<view class="normalCodeSelect__header app-flex app-flex--align-center p-top-bom-30">
			<view class="app-flex-item app-flex-item--1 f-32 f-bold col-3">{{title}}</view>
			<view class="app-flex-item app-flex-item--shrink-0">
				<view class="normalCodeSelect__checkbox" :class="{
				        'is-active': allChecked
				      }" @click="allChecked = !allChecked" style="width: 30rpx;height: 30rpx;">
					<view v-show="allChecked" class="iconfont icon-check"></view>
				</view>
			</view>
			<view class="app-flex-item f-28 col-3">全选</view>
		</view>
		<!-- header end -->
		<!-- content -->
		<view class="normalCodeSelect-list" >
			<view v-for="item in list" :key="item.id" class="normalCodeSelect-item app-flex app-flex--align-center" :class="{
					        'is-active': value.includes(item.id)
					      }">
				<view class="app-flex-item f-26 col-3">核销码</view>
				<view class="app-flex-item app-flex-item--1 f-32 f-bold col-3">{{item.code}}</view>
				<view class="app-flex-item">
					<view class="normalCodeSelect__checkbox" :class="{
					        'is-active': value.includes(item.id)
					      }" @click="handleItemClick(item,index)">
						<view v-show="value.includes(item.id)" class="iconfont icon-check"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- content end -->
	</view>
</template>

<script>
	export default {
		name: 'normalCodeSelect',
		props: {
			// 当前选中的id，只受控
			value: {
				type: Array,
				default () {
					return [1];
				},
			},
			title: {
				type: String,
				default: '核销码'
			},
			// 列表数据
			list: {
				type: Array,
				default () {
					// return Array(2).fill(1).map((item, index) => ({
					// 	id: index,
					// 	code: '12345678',
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

				this.$emit('input', this.list.map(item => item.id));
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
						...this.value,
						item.id,
					];
				}
				// 如果超过最大选择数量，则保留最新的选中
				if (newVal.length > this.max) {
					newVal = newVal.slice(0, this.max);
				}
				this.$emit('input', newVal);
			}

		}
	}
</script>

<style lang="scss" scoped>
	.normalCodeSelect {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
	}

	.normalCodeSelect__checkbox {
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

	.normalCodeSelect-item {
		box-sizing: border-box;
		min-height: 70rpx;
		padding: 20rpx 16rpx;
		background-color: #F8F8F8;
		border-radius: 10rpx;
		&.is-active {
			background-color: #FFFBE5;
		}
		&+& {
			margin-top: 20rpx;
		}
	}
</style>
