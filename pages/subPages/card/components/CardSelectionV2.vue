<template>
	<view class="c-CardSelectionV2">
		<!-- 列表 -->
		<view class="c-CardSelectionV2-list">
			<view v-for="item in list" class="c-CardSelectionV2-list__item">
				<view class="c-CardSelectionV2-card" :class="{'is-active': value.includes(item[valueKey])}"  @click="handleItemClick(item)">
					<view class="c-CardSelectionV2-card__title" style="margin-bottom: 30rpx;">{{item.title}}</view>
					<view v-if="item.priceDecimal" class="c-CardSelectionV2-card__price is-red" style="margin-left: 20rpx;">¥<text class="is-strong">{{item.priceInteger}}</text>{{item.priceDecimal}}</view>
					<view v-else class="c-CardSelectionV2-card__price is-red" style="margin-left: 20rpx;">¥<text class="is-strong">{{item.price}}</text></view>
					<view v-if="item.linePric" class="c-CardSelectionV2-card__price is-del">¥30</view>
					<view v-if="item.times" class="c-CardSelectionV2-card__text" style="margin-top: auto;">使用次数：{{item.times}}次</view>
					<!-- 推荐标签 -->
					<view v-if="item.recommended" class="c-CardSelectionV2-card__label-recommend">推荐</view>
					<!-- 推荐标签 end -->
				</view>
			</view>
		</view>
		<!-- 列表end -->
		<!-- 所有规则 -->
		<view class="c-CardSelectionV2__rules-wrapper">
			<parse :html="allRules" />
		</view>
		
		<!-- 所有规则 end -->
	</view>
</template>

<script>
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	export default {
		components: {
			Parse
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
					// return [{
					// 	id: 'data1',
					// 	title: '某某洗车行(月卡)某某洗车行(月卡)某某洗车行(月卡)',
					// 	// 次数
					// 	times: 20,
					// 	// 格式化的价格
					// 	price: '30.00',
					// 	// 格式化的价格 整数部分
					// 	priceInteger: '30',
					// 	// 格式化的价格 小数部分（有小数部分的话样式不一样）
					// 	priceDecimal: '.00',
					// 	// 格式化的划线价，
					// 	linePrice: '20.00',
					// 	// 是否是推荐
					// 	recommended: true,
					// 	// 使用须知（富文本）
					// 	rules: '<p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p><p>这里是使用须知富文本</p>'
					// }]
					return []
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
					return []
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
		computed: {
			allRules() {
				return this.list.map(item=>item.rules).join('')
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
	$gutter: 20rpx;
	.c-CardSelectionV2 {
		width: 690rpx;
		max-width: 100%;
		margin: 0 auto;
	}
	.c-CardSelectionV2-list {
		display: flex;
		flex-wrap: wrap;
		margin-left:  -$gutter/2;
		margin-right: -$gutter/2;
	}
	.c-CardSelectionV2-list__item {
		width: 50%;
		box-sizing: border-box;
		padding: $gutter;
	}
	.c-CardSelectionV2-card {
		position: relative;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 30rpx;
		height: 308rpx;
		border: 1px solid transparent;
		background-color: #fff;
		box-shadow: 0px 2px 18px rgba(153, 153, 153, 0.16);
		border-radius: 20rpx;
		&.is-active {
			border-color: #FFD940;
			background-color: #FFFDF5;
		}
	}
	.c-CardSelectionV2-card__title {
		font-weight: bold;
		font-size: 32rpx;
		color: #333;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	
	.c-CardSelectionV2-card__price {
		color: #FF4444;
		font-size: 24rpx;
		&.is-strong, .is-strong{
			font-size: 68rpx;
		}
		&.is-del, .is-del{
			color: #999999;
			text-decoration: line-through;
		}
	}
	.c-CardSelectionV2-card__text {
		font-size: 24rpx;
		color: #999999;
	}
	.c-CardSelectionV2-card__label-recommend {
		box-sizing: border-box;
		position: absolute;
		top: 0;
		left: 8rpx;
		height: 33rpx;
		padding: 0 16rpx;
		font-size: 24rpx;
		color: #fff;
		line-height: 33rpx;
		background-color: #FF4444;
		transform: translateY(-50%);
		border-radius: 17rpx 17rpx 0px 17rpx;
	}
	.c-CardSelectionV2__rules-wrapper {
		background-color: #F8F8F8;
		padding: 30rpx 20px;
		border-radius: 20rpx;
	}
</style>
