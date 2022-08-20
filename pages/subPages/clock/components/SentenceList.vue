<template>
	<view class="c-SentenceList app-flex app-flex--column">
		<!-- header -->
		<view class="app-flex-item app-flex app-flex--align-center app-flex--justify-between padding-box-all">
			<view class="app-flex-item app-flex-item--shrink-0 col-3 f-36 f-w">
				金句
			</view>
			<view class="app-flex app-flex-item" style="background-color: #F0F0F0; padding: 10rpx 20rpx; border-radius: 9999rpx;">
				<view v-for="(item,index) in colorList" :key="item" class="app-flex-item" @click="handleColorItemClick(item,index)">
					<view class="color-option" :style="'--main-color:'+item+';'" :class="{
						'is-active': item === color
					}"></view>
				</view>
			</view>
			<view class="app-flex-item" style="margin-left: auto;">
				<button class="btn-normal c-SentenceList__btn-add" @click="$emit('on-btn-custom-click')">自定义</button>
			</view>
		</view>
		<!-- header end -->
		<!-- content -->
		<vew class="app-flex-item app-flex-item--1">
			<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="$emit('on-scrolltolower')">
				<view class="c-sentence-list padding-box-all">
					<view v-for="item in list" :key="item.id" class="c-sentence-list-item" :class="{
							'is-active': activeId == item.id
						}" @click="handleItemClick(item,index)">
						<view class="c-sentence-card app-flex app-flex--align-center" :class="{
							'is-active': activeId == item.id
						}">
							<view class="app-flex-item app-flex-item--shrink-0">
								<view v-if="activeId == item.id" class="c-sentence-card__icon iconfont icon-roundcheckfill"></view>
								<view v-else class="c-sentence-card__icon iconfont icon-round"></view>
							</view>
							<view class="app-flex-item app-flex-item--1">
								<view class="c-sentence-card__text">{{item.text}}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</vew>
		<!-- content end -->
	</view>
</template>

<script>
	export default {
		props: {
			// 当前选中项的id v-model 受控和不受控都可以
			value: {
				type: [String, Number],
				default: ''
			},
			// 金句列表
			list: {
				type: Array,
				default () {
					// return new Array(25).fill(1).map((item, index) => ({
					// 	id: '0' + index,
					// 	text: '很长的金句很长的金句很长的金句很长的金句很长的金句' + index
					// }))
					return []
				}
			},
			// 当前选中的颜色
			color: {
				type: String,
				default: '#FFFFFF'
			},
			// 文字颜色列表
			colorList: {
				type: Array,
				default () {
					return ['#FFFFFF','#393939','#C85150','#E8B62D','#48A252','	#1D78CA','#5B3D8F']
				}
			}
			
		},
		data() {
			return {
				// 当前选中项的id
				activeId: this.value,
			}
		},
		watch: {
			value: {
				handler(val) {
					this.activeId = val
				},
				immediate: true
			},
		},
		methods: {
			// 列表项点击事件
			handleItemClick(item, index) {
				this.activeId = item.id
				this.$emit('input', item.id)
				this.$emit('on-item-click', item,index)
			},
			handleColorItemClick(item, index) {
				this.$emit('on-color-item-click', item, index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-SentenceList {
		height: 100%;
		background-color: #fff;
	}

	.c-SentenceList__btn-add {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 54rpx;
		padding: 0 20rpx;
		border-radius: 9999rpx;
		font-size: 26rpx;
		color: #333;
		border: 1px solid #CCCCCC;
	}
	.c-sentence-list-item {
		&+& {
			margin-top: 20rpx;
		}
	}
	.c-sentence-card__icon {
		font-size: 42rpx;
		color: #ccc;
		.c-sentence-card.is-active & {
			color: #FFD940;
		}
	}
	.c-sentence-card__text {
		font-size: 28rpx;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.color-option {
		box-sizing: border-box;
		height: 40rpx;
		width: 40rpx;
		border-radius: 100%;
		border: 1px solid var(--main-color);
		&.is-active {
			background-color: var(--main-color);
		}
	}
</style>
