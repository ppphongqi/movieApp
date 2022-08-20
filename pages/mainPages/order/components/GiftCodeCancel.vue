<template>
	<view class="CGiftCodeCancel app-clearfix">
		<!-- header -->
		<view class="CGiftCodeCancel__header app-flex app-flex--column app-flex--align-center app-flex--justify-center">
			<view class="app-flex-item" style="margin-top: -50rpx;">
				<image class="CGiftCodeCancel__logo" :src="logo" mode=""></image>
			</view>
			<view class="app-flex-item m-top20 f-32 col-3 f-bold">
				{{title}}
			</view>
		</view>
		<!-- header end -->
		<!-- split -->
		<view class="app-line app-line--decorate app-line--dotted"></view>
		<!-- split -->
		<!-- content -->
		<view class="CGiftCodeCancel__content">
			<!-- 核销商品 -->
			<GiftGoodsSelect v-model="code" :list="goodsList"></GiftGoodsSelect>
			<!-- 核销商品 end -->
			<!-- 核销门店 -->
			<view class="app-card" style="padding: 0 30rpx;margin 40rpx 0;">
				<view class="m-btm30 f-32 f-bold col-3">核销门店<text class="f-24 f-normal">({{storeList.length}})</text>
				</view>
				<view class="store-card app-card p-top-20 p-b-20 app-flex app-flex--align-center">
					<view class="app-flex-item app-flex-item--1 f-28 col-3 f-bold">
						{{cStoreActiveItem.name}}
					</view>
					<view class="app-flex-item app-flex-item--shrink-0">
						<picker :range="storeList" range-key="name" :value="storeIndex"
							@change="handleStorePickerChange">
							<button class="app-btn">切换</button>
						</picker>
					</view>
				</view>
			</view>
			<!-- 核销门店 end -->
			<!-- 订单信息 -->
			<view class="app-card" style="padding: 0 30rpx;margin 40rpx 0;">
				<view class="m-btm30 f-32 f-bold col-3">订单信息</view>
				<view class="app-flex m-top20">
					<view class="app-flex-item app-flex-item--1 f-24 col-9">
						订单编号
					</view>
					<view class="app-flex-item f-24 col-3">
						{{order.orderNo}}
					</view>
				</view>
				<view class="app-flex m-top20">
					<view class="app-flex-item app-flex-item--1 f-24 col-9">
						购买日期
					</view>
					<view class="app-flex-item f-24 col-3">
						{{order.time}}
					</view>
				</view>
				<view class="app-flex m-top20">
					<view class="app-flex-item app-flex-item--1 f-24 col-9">
						数量
					</view>
					<view class="app-flex-item f-24 col-3">
						{{order.num}}
					</view>
				</view>
				<view class="app-flex m-top20">
					<view class="app-flex-item app-flex-item--1 f-24 col-9">
						商品金额
					</view>
					<view class="app-flex-item f-24 col-3 f-bold">
						￥{{order.price}}
					</view>
				</view>
				<view class="app-flex app-flex--justify-end app-flex--align-center m-top20">
					<view class="app-flex-item f-24 col-9">
						实付款:
					</view>
					<view class="app-flex-item f-24 col-3 f-bold">
						<text class="col-f4">￥</text><text class="f-36 col-f4">{{order.price}}</text>
					</view>
				</view>
			</view>
			<!-- 订单信息 end -->
			<view class="app-line app-line--dotted m-left-right-30"></view>
			<!-- 客户信息 -->
			<view class="app-card" style="padding: 0 30rpx;margin 40rpx 0;">
				<view class="m-btm30 f-32 f-bold col-3">客户信息</view>
				<view class="app-flex m-top20">
					<view class="app-flex-item app-flex-item--1 f-24 col-9">
						姓名
					</view>
					<view class="app-flex-item f-24 col-3 f-bold">
						{{customer.name}}
					</view>
				</view>
				<view class="app-flex m-top20">
					<view class="app-flex-item app-flex-item--1 f-24 col-9">
						电话
					</view>
					<view class="app-flex-item f-24 col-3 f-bold">
						{{customer.phone}}
					</view>
				</view>
			</view>
			<!-- 客户信息 end -->
		</view>
		<!-- content end -->
		<!-- footer -->
		<view class="CGiftCodeCancel__footer--fixed app-wrapper--safe-fixed-bottom bg-color">
			<button class="app-btn-large--block CGiftCodeCancel__btn-go" @click="handleBtnGoClick">确认核销</button>
		</view>
		<!-- footer end -->
	</view>
</template>

<script>
	import GiftGoodsSelect from './GiftGoodsSelect'
	export default {
		name: 'GiftCodeCancel',
		components: {
			GiftGoodsSelect
		},
		props: {
			// 套餐logo
			logo: {
				type: String,
				default: 'https://via.placeholder.com/90x90/2a9ff6/fffffff',
			},
			// 套餐名称
			title: {
				type: String,
				default: '小龙坎火锅圣诞礼包套餐'
			},
			// 核销商品列表
			goodsList: {
				type: Array,
				default () {
					// return Array(2).fill(1).map((item, index) => ({
					// 	id: index,
					// 	title: '标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题' + index,
					// 	image: 'https://via.placeholder.com/90x90/2a9ff6/fffffff',
					// 	code: '12345678',
					// 	// 价值 多少钱
					// 	price: '104.00',
					// }))
					return []
				}
			},
			// 可以选择的核销门店列表
			storeList: {
				type: Array,
				default () {
					return [{
						logo: 'https://via.placeholder.com/90x90/2a9ff6/fffffff',
						title: '小龙坎火锅(双流店)',
						num: 4
					}]
				}
			},
			// 订单信息
			order: {
				type: Object,
				default () {
					return {
						orderNo: '123213213',
						time: '2022-09-13 15:30:20',
						num: 2,
						price: '75.00',
						paidIn: '75.00',
					}
				}
			},
			// 客户信息
			customer: {
				type: Object,
				default () {
					return {
						name: '某某',
						phone: '13888888888'
					}
				}
			}
		},
		data() {
			return {
				// 当前选中的核销码
				code: [],
				storeIndex: 0
			}
		},
		computed: {
			cStoreActiveItem() {
				return this.storeList[this.storeIndex] || {}
			}
		},
		methods: {
			handleBtnGoClick() {
				this.$emit('on-btn-go-click', {
					vercode_id: this.code,
					store_id: this.cStoreActiveItem.id,
					storeName: this.cStoreActiveItem.name,
					storeIndex: this.storeIndex
				})
			},
			handleStorePickerChange(e) {
				this.storeIndex = e.detail.value
			}
		}
	}
</script>

<style lang="scss" scoped>
	.app-line--decorate {

		&::after,
		&::before {
			background-color: #2A2A2A;
		}
	}

	.CGiftCodeCancel {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		margin: 0 auto;
		border-radius: 20rpx;
		background-color: #fff;
		margin-top: 80rpx;
	}

	.CGiftCodeCancel__header {
		position: relative;
		padding-bottom: 30rpx;
	}

	.CGiftCodeCancel__logo {
		width: 100rpx;
		height: 100rpx;
		border-radius: 20rpx;
		padding: 20rpx 30rpx;
	}

	// 核销门店
	.store-card {
		background-color: #F8F8F8;
		border-radius: 20rpx;
	}

	.store-card__logo {
		width: 60rpx;
		height: 60rpx;
		border-radius: 20rpx;
	}

	// 核销门店 end
	// footer
	.CGiftCodeCancel__footer--fixed {
		background-color: #FFD940;
		border-radius: 20rpx 20rpx 0 0;
		overflow: hidden;
	}

	.CGiftCodeCancel__btn-go {
		font-size: 32rpx;
		font-weight: bold;
	}

	// footer end
</style>
