<template>
	<view class="c-card-selection" :customStyle="customStyle">
		<!-- 列表 -->
		<view class="card-list">
			<view v-for="item in list" :key="item[valueKey]" class="card-item" @click="handleItemClick(item)">
				<!-- 基本信息 -->
				<view class="card-card" :class="{'is-active': value.includes(item[valueKey])}">
					<view class="card-card__center">
						<view class="card-card__title">{{item.title}}</view>
						<view v-if="item.times" class="card-card__text">使用次数：{{item.times}}次</view>
					</view>
					<view class="card-card__right">
						<!-- 价格 -->
						<view class="card-card__price-wrapper">
							<view v-if="item.priceDecimal" class="card-card__price is-red" style="margin-left: 20rpx;">¥<text class="is-strong">{{item.priceInteger}}</text>{{item.priceDecimal}}</view>
							<view v-else class="card-card__price is-red" style="margin-left: 20rpx;">¥<text class="is-strong">{{item.price}}</text></view>
							<view v-if="item.linePric" class="card-card__price is-del">¥30</view>
						</view>
						<!-- 价格 end -->
					</view>
					<!-- 推荐标签 -->
					<view v-if="item.recommended" class="card-card__label-recommend">推荐</view>
					<!-- 推荐标签 end -->
				</view>
				<!-- 基本信息 end -->
				<!-- 使用规则 -->
				<view v-if="value.includes(item[valueKey])" class="card-rules">
					<scroll-view class="card-rules__content" :class="{'is-open':detailsDescOpened}" scroll-y="">
						<parse :html="item.rules" />
					</scroll-view>				
					<view v-if="!detailsDescOpened" class="card-rules__btn-more" @click="detailsDescOpened = true">展开<view
							class="iconfont is-inline icon-xialajiantouxiao"></view>
					</view>
					<view v-else class="card-rules__btn-more" @click="detailsDescOpened = false">收起<view
							class="iconfont is-inline icon-fold"></view>
					</view>
				</view>
				<!-- 使用规则 end -->
			</view>
		</view>
		<!-- 列表 end -->
	</view>
</template>

<script>
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	import PopupView from '@/components/template/PopManager.vue'
	export default {
		components: {
			Parse,
			PopupView
		},
		props: {
			// 是否默认选中第一个
			selectFirstDefault: {
				type: Boolean,
				default: false,
			},
			// 显示的数据
			list: {
				type: Array,
				default () {
					return [{
						id: 'data1',
						title: '某某洗车行(月卡)某某洗车行(月卡)某某洗车行(月卡)',
						// 次数
						times: 20,
						// 格式化的价格
						price: '30.00',
						// 格式化的价格 整数部分
						priceInteger: '30',
						// 格式化的价格 小数部分（有小数部分的话样式不一样）
						priceDecimal: '.00',
						// 格式化的划线价，
						linePrice: '20.00',
						// 是否是推荐
						recommended: true,
						// 使用须知（富文本）
						rules: '<p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p>'
					}, {
						id: 'data2',
						title: '某某洗车行(月卡)某某洗车行(月卡)某某洗车行(月卡)',
						// 次数
						times: 20,
						// 格式化的价格
						price: '30.00',
						// 格式化的划线价，
						linePrice: '20.00'
					}, {
						id: 'data3',
						title: '某某洗车行(月卡)某某洗车行(月卡)某某洗车行(月卡)',
						// 次数
						times: 20,
						// 格式化的价格
						price: '30.00',
						// 格式化的划线价，
						linePrice: '20.00'
					}]
				}
			},
			// 列表数据中作为 value 唯一标识的键名，默认为id
			valueKey: {
				type: String,
				default: 'id'
			},
			// 当前选中的值，v-model
			value: {
				type: Array,
				default () {
					return ['data1']
				}
			},
			// 是否多选
			multiple: {
				type: Boolean,
				default: false
			},
			customStyle: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				// 当前显示的使用须知
				rules: '',
				// 使用须知弹窗是否显示
				rulesPopupVisible: true,
				// 
				detailsDescOpened: false,
			}
		},
		watch:{
			list: {
				handler(val) {
					if(this.selectFirstDefault && !this.value.length && val.length) {
						console.log('mounted 111')
						this.handleItemClick(val[0])
					}
				},
				immediate: true
			}
		},
		methods: {
			// 列表项点击事件
			handleItemClick(item) {
				const id = item[this.valueKey]
				console.log('handleItemClick', item)
				if (!id) {
					return
				}
				// 单选
				if (!this.multiple) {
					this.emitInput([id])
					return
				}
				// 多选已经有了
				if (this.value.includes(id)) {
					return
				}
				// 多选 新添加的
				this.emitInput([...this.value, id])

			},
			// 触发input事件 实现v-model
			emitInput(val = []) {
				this.$emit('input', val)
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 列表
	.c-card-selection {
		margin: 20rpx 0;
	}

	.card-list {
		padding: 0 30rpx;
	}

	.card-item {
		box-shadow: 0px 2rpx 18rpx rgba(153, 153, 153, 0.16);
		border-radius: 20rpx;

		&+& {
			margin-top: 20rpx;
		}
	}

	.card-card {
		position: relative;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 148rpx;
		padding: 24rpx 30rpx;
		border: 1px solid #eee;
		border-radius: 20rpx;

		&.is-active {
			border-color: #FFD940;
			background-color: #FFFCF2;
		}
	}

	.card-card__center {
		min-width: 0;
		flex: 1;
	}

	.card-card__title {
		margin-bottom: 10rpx;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.card-card__text {
		margin-bottom: 10rpx;
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		&.is-strong {
			color: #333;
		}

		.iconfont {
			font-size: 24rpx;
		}
	}

	.card-card__right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		align-self: flex-end;
		box-sizing: border;
		width: 270rpx;
		margin-left: 30rpx;
	}

	.card-card__price-wrapper {
		display: flex;
		flex-direction: column;
		margin-bottom: 10rpx;
		align-items: flex-end;
	}

	.card-card__price {
		display: inline-block;
		font-size: 24rpx;
		color: #999;

		&.is-del {
			font-weight: bold;
			text-decoration: line-through;
		}

		&.is-red {
			color: #FF4444;
		}

		&.is-strong,
		.is-strong {
			font-size: 48rpx;
		}
	}

	.card-card__radio {
		box-sizing: border-box;
		display: flex;
		align-items: cneter;
		justify-content: center;
		width: 40rpx;
		height: 40rpx;
		// 这里只能这样居中？
		line-height: 38rpx;
		border-radius: 100%;
		border: 1px solid #ccc;

		.iconfont {
			display: none;
			height: 24rpx;
			font-size: 24rpx;
			color: #333;
		}

		.is-active &,
		&.is-active {
			border-color: #FFD940;
			background-color: #FFD940;

			.iconfont {
				display: block;
			}
		}
	}

	.card-card__label-recommend {
		box-sizing: border-box;
		position: absolute;
		top: 0;
		left: 30rpx;
		height: 33rpx;
		padding: 0 16rpx;
		font-size: 24rpx;
		color: #fff;
		line-height: 33rpx;
		background-color: #FF4444;
		transform: translateY(-50%);
		border-radius: 17rpx 17rpx 0px 17rpx;
	}

	// 列表 end
	// 使用须知
	.rules-popup-card {
		box-sizing: border-box;
		position: relative;
		padding: 30rpx;
		padding-top: 0;
		width: 100vw;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0px 0px;
	}

	.rules-popup-card__title {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 105rpx;
		font-weight: bold;
		font-size: 32rpx;
		color: #333333;
	}

	.rules-popup-card__scroll {
		height: 495rpx;
	}

	.rules-popup-card__btn-close {
		position: absolute;
		top: 24rpx;
		right: 33rpx;
		color: #333;
		font-size: 36rpx;
	}

	// 使用须知 end
	.card-rules {
		padding: 20rpx;
	}
	.card-rules__content {
		height: 120rpx;
		&.is-open {
			height: 350rpx;
		}
	}
	.card-rules__btn-more {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 56rpx;
		font-size: 24rpx;
		color: #333;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0, rgba(255, 255, 255, 1) 8rpx);
	
		.iconfont {
			margin-left: 4rpx;
			font-size: 24rpx;
		}
	}
</style>
