<template>
	<view class="page-selectgoods" :style="themeColor">
		<view class="stock-content">

			<view class="p-left-right-30 ">
				<view class="f-24 f-w col-9" style="padding: 20rpx;">共{{orderList.total}}件商品</view>
				<view class="dis-flex flex-warp flex-x-between">
					<block v-if="orderList.data.length">
						<view style="width: 47%;" v-for="(item,index) in orderList.data" class="m-btm80">
							<image :src="item.img" class="dis-block"></image>
							<view class="b-f" style="padding: 10rpx;">
								<view class="f-28 col-3 twolist-hidden">{{item.goods_name}}</view>
								<view class="dis-flex flex-x-between flex-y-center">
									<view class="f-24 col-9 ">数量：{{item.total_num}}</view>
									<radio value="" :checked="item.check" @click="getOrderId(item)" style="zoom: .7;width: 60rpx;height: 40rpx;line-height: 40rpx;"
									 color="#FFD640" />
								</view>
							</view>
						</view>
					</block>
					<block v-else>
						<view class="nothing f-24 col-6">
							暂无商品需要提货
						</view>

					</block>


				</view>

			</view>
		</view>
		<view class="footer-bottom dis-flex flex-y-center b-f" :class="{'footer-bottom-ipx':isIphoneX}">
			<view class="flex-box dis-flex flex-y-center flex-x-between">
				<view class="dis-flex flex-y-center">
					<radio value="" style="zoom: .7;width: 60rpx;height: 40rpx;line-height: 40rpx;" color="#FFD640" :checked="isCheckedAll"
					 @click="isCheckedAll = !isCheckedAll;checkAll()" />
					<view class="col-3 f-28 m-left12">全选</view>
				</view>
			</view>
			<view class="footer-btn f-30 col-3" @click="deliveryGoods">确定提货</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	export default {
		mixins: [pageShareMixin],
		data() {
			return {
				isCheckedAll: false,
				user_id: '',
				orderList: {
					data: [],
					total: 0
				},
				user_id: '',
				order_id: '',
				orderId: []
			}
		},
		watch: {
			settingData: {
				handler(val) {
					console.log('哈哈哈哈哈哈哈哈',val)
					this.shareData = this.pageShareMixin_createShareData({
						title: this.$util.deepGet(val, 'cgp.share_title'),
						desc: this.$util.deepGet(val, 'cgp.share_text', ''),
						imgUrl: this.$util.deepGet(val, 'cgp.share_image', '')
					})
				},
				immediate: true
			}
		},
		onLoad(options) {
			const sceneOptions = this.$util.scene_decode(options.scene)
			console.log('sceneOptions',sceneOptions)
			this.user_id = options.user_id || sceneOptions.user_id || ""
			this.order_id = options.order_id || sceneOptions.order_id || sceneOptions.o || ''
			// this.bingLeader()
		},
		onShow() {
			this.getGoods()
		},
		methods: {
	
			checkAll() {
				if (this.isCheckedAll) {
					this.orderList.data.forEach(item => {
						item.check = true
						if (this.orderId.indexOf(item.order_id) < 0) {
							this.orderId.push(item.order_id)
						}
					})

				} else {
					this.orderList.data.forEach(item => {
						item.check = false
					})
					this.orderId = []

				}


			},
			getOrderId(item) {
				let {
					orderId
				} = this, {
					order_id
				} = item
				item.check = !item.check
				if (item.check) {
					orderId.push(order_id)
				} else {
					orderId.splice(orderId.indexOf(order_id), 1)
				}
				this.orderId = orderId
				this.orderList.data = [...this.orderList.data]
				console.log(this.orderId, 'this.orderId')
			},
			getGoods() {
				let {
					user_id,
					order_id
				} = this
				App._post_form('cgp.Reg/scanDetail', {
					user_id,
					order_id,
					page: 1,
					list_rows: 500
				}, res => {
					// this.orderList.data.push(...res.data.data)
					this.orderList.data = res.data.data
					this.orderList.total = res.data.total
					this.orderList.data.forEach(item => {
						item.check = false
					})

				})
			},
			deliveryGoods() {
				let {
					user_id,
					orderId
				} = this
				if (!orderId.length) {
					uni.showToast({
						icon: "none",
						title: '请选择商品'
					})
					return false
				}
				App._post_form('cgp.Reg/confirmZt', {
					order_id: orderId
				}, res => {
					let {
						msg,
						code
					} = res
					uni.showToast({
						icon: "none",
						title: msg
					})
					this.orderId = []
					this.getGoods()
					// if (code == 1) {
					// 	uni.redirectTo({
					// 		url: '/pages/subPages/cgp/center/center'
					// 	})
					// }


				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-selectgoods {
		padding-bottom: 180rpx;
	}
	.stock-content image {
		width: 100%;
		height: 180rpx;
		border-radius: 10rpx;
	}

	.stock-content-top {
		padding: 10rpx 40rpx 10rpx 40rpx;
		text-align: center;
	}

	.footer-bottom {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		height: 100rpx;
		line-height: 100rpx;
		border-top: 1rpx solid #EEEEEE;

		&.footer-bottom-ipx {
			// bottom: calc(96rpx + 20px);
		}

		.flex-box {
			padding: 0 30rpx;
		}

		.footer-btn {
			width: 235rpx;
			text-align: center;
			height: 100rpx;
			background-color: #FFD940;
			background-color: var(--theme-color);

			&.disabled {
				color: #333333;
				background-color: #DDDDDD;
			}
		}
	}
</style>
