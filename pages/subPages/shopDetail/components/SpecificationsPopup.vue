<template>
	<popup-view class="spec-popup" :show="dVisible" type="center" :zIndex="999"  @clickmask="dVisible = false">
		<view class="spec-card" @touchmove.stop.prevent>
			<!-- header -->
			<view class="spec-card-header">
				<view class="spec-card-header__left">
					<image class="spec-card__img-goods" :src="goodsImg" mode="aspectFill"></image>
				</view>
				<view class="spec-card-header__right">
					<view class="spec-card__title">{{title}}</view>
					<view class="spec-card__attrs">
						<view class="spec-card__attr">
							<view class="spec-card__price">￥<text class="is-strong">{{cSpecGoods.goods_price}}</text></view>
							<view class="spec-card__price" style="margin-left: 10rpx;"><text
									class="is-del">￥{{cSpecGoods.line_price}}</text></view>
						</view>
						<view class="spec-card__attr">已售{{salesNum}}件</view>
					</view>
				</view>
			</view>
			<!-- header end -->
			<!-- content -->
			<scroll-view scroll-y class="spec-card-content">
				<!-- 规格列表 -->
				<view class="spec-collection">
					<view class="spec-collection-card" v-for="(spec,specIndex) in skuData" :key="spec.signid">
						<view class="spec-collection-card__title">{{spec.spec_item}}</view>
						<view class="spec-collection-card__attrs">
							<view v-for="(item,index) in spec.spec_item_list" :key="item.signid"
								class="spec-collection-card__attr"
								:class="{'is-active': specActive && specActive[specIndex] == item.signid}" @click="hanldeSpecItemClick({item,index,specIndex})">
								{{item.spec_title}}
							</view>
						</view>
					</view>
				</view>
				<!-- 规格列表 -->
			</scroll-view>
			<!-- content end -->
			<view v-show="dVisible" class="spec-card-footer">
				<!-- 已选规格 -->
				<view style="margin: 0 -40rpx;">
					<view class="spec-choice">
						已选：<text class="is-strong">{{cSpecDesc}}</text>
					</view>
				</view>
				<!-- 已选规格 end -->
				<view class="spec-card-total">
					<view class="spec-card-total__left">
						<view class="spec-card-total__price">
							总计<text class="is-strong">￥</text><text class="is-stronger">{{cTotalPrice}}</text>
						</view>
					</view>
					<view class="spec-card-total__right">
					<GoodInputNumber :value="cSpecGoods.total_num" :inputDisabled="true" @input="handleGoodsNumChange($event,{goods_sku_id:cSpecSkuId,goods_id: cSpecGoods.goods_id})"></GoodInputNumber>
					</view>
				</view>
			</view>

		</view>
		<view class="spec-popup__btn-close iconfont icon-roundclose" @click="dVisible = false"></view>
	</popup-view>
</template>

<script>
	import PopupView from '@/components/template/PopManager.vue'
	import GoodInputNumber from './GoodInputNumber.vue'
	export default {
		components: {
			PopupView,
			GoodInputNumber
		},
		props: {
			// 默认是否显示v-model
			value: {
				type: Boolean,
				default: false
			},
			// 标题
			title: {
				type: String,
				default: ''
			},
			// 商品图片
			goodsImg: {
				type: String,
				default: ''
			},
			// 销量
			salesNum: {
				type: [String, Number],
				default: 988
			},
			// 规格集合(和接口数据格式一致)
			skuData: {
				type: Array,
				default () {
					return []
				}
			},
			// 规格的笛卡尔集合（和接口数据一致）
			sku: {
				type: Array,
				default () {
					return []
				}
			},
			// 购物车列表数据（和接口数据一致）
			cartList: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				// 当前弹窗是否显示
				dVisible: this.value,
				// 当前选中的规格 数组（[二级规格id]），null说明还未初始化，需要默认选中第一个
				specActive: null
			}
		},
		computed: {
			// 最终选中的规格项的id
			cSpecSkuId() {
				return (this.specActive||[]).join('_')
			},
			// 当前选中的规格项商品的数据
			cSpecGoods() {
				const goods = this.sku.find(item=>item.spec_sku_id === this.cSpecSkuId)
				const total_num = (this.cartList.find(item=>item.goods_sku_id === this.cSpecSkuId) || {}).total_num || 0
				return {
					...goods,
					total_num
				}
			},
			// 当前总价
			cTotalPrice() {
				if(this.cSpecGoods) {
					return this.cSpecGoods.goods_price * this.cSpecGoods.total_num
				}
				return 0
			},
			// 当前已选描述
			cSpecDesc() {
				return `数量 ${this.cSpecGoods.total_num}、${this.cSpecGoods.title}`
			}
		},
		watch: {
			skuData(val) {
				// 初始化this.specActive
				if (val && val.length && !this.specActive) {
					const specActive = []
					val.forEach(item => {
						try {
							specActive.push(item.spec_item_list[0].signid)
						} catch (e) {

						}
					})
					this.specActive = specActive
				}
			},
			value(val) {
				this.dVisible = val
			},
			dVisible(val) {
				this.$emit('input', val)
			}
		},
		methods: {
			// 规格项点击事件
			hanldeSpecItemClick({item,index,specIndex}) {
				this.specActive[specIndex] = item.signid
				this.specActive = [...this.specActive]
			},
			// 加减按钮input事件
			handleGoodsNumChange(num,{
				goods_id,
				goods_sku_id
			}) {
				this.$emit('on-num-change',{
					num,
					goods_id,
					total_num: this.cSpecGoods.total_num,
					goods_sku_id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.spec-popup__btn-close {
		margin-top: 40rpx;
		color: #fff;
		font-size: 50rpx;
		text-align: center;
	}

	.spec-card {
		box-sizing: border-box;
		width: 690rpx;
		padding: 30rpx 40rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.spec-card-header {
		display: flex;
	}

	.spec-card__img-goods {
		width: 114rpx;
		height: 114rpx;
		border-radius: 10rpx;
	}

	.spec-card-header__right {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
		margin-left: 20rpx;
	}

	.spec-card__title {
		margin-bottom: auto;
		font-weight: bold;
		font-size: 36rpx;
		color: #333333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.spec-card__attrs {
		display: flex;
		justify-content: space-between;
	}

	.spec-card__price {
		display: inline;
		font-size: 24rpx;
		font-weight: bold;
		color: #FF4444;

		.is-strong {
			font-size: 32rpx;
		}

		.is-del {
			color: #999999;
			text-decoration: line-through;
		}
	}

	.spec-card__attr {
		font-size: 24rpx;
		color: #999;
	}

	.spec-card-content {
		max-height: 420rpx;
	}

	.spec-collection-card {
		box-sizing: border-box;
		margin: 20rpx 0;
	}

	.spec-collection-card__title {
		font-size: 24rpx;
		color: #999;
	}

	.spec-collection-card__attrs {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -10rpx;
	}

	.spec-collection-card__attr {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60rpx;
		padding: 0 20rpx;
		margin: 30rpx 10rpx;
		font-size: 24rpx;
		color: #333;
		border-radius: 10rpx;
		background-color: #F8F8F8;
		border: 1px solid transparent;

		&.is-active {
			color: #FF4444;
			background-color: transparent;
			border: 1px solid #FF4444;
		}
	}

	.spec-choice {
		display: block;
		box-sizing: border-box;
		font-size: 24rpx;
		color: #999999;
		padding: 20rpx 40rpx;
		background-color: #F8F8F8;

		.is-strong {
			color: 3333;
		}
	}

	.spec-card-total {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 40rpx;
	}

	.spec-card-total__price {
		font-size: 28rpx;
		color: #333;

		.is-strong {
			color: #FF4444;
		}

		.is-stronger {
			font-weight: bold;
			font-size: 48rpx;
			color: #FF4444;
		}
	}
</style>
