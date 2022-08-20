<template>
	<view class="CGiftCode">
		<!-- header -->
		<page-nav-bar class="page-nav" :nav-list="cTopCateData" :current="cTopCateActiveItem.id"
			@on-nav-item-click="handleTopCateItemClick"></page-nav-bar>
		<!-- header end -->
		<!-- content -->
		<view v-if="cList.length" class="CGiftCode-list">
			<view v-for="item in cList" :key="item.id" class="CGiftCode-item" :class="{
				'is-used': item.status != 0
			}">
				<view class="CGiftCode-card app-card">
					<!-- content -->
					<view class="app-flex app-flex--align-center">
						<view class="app-flex-item app-flex-item--shrink-0">
							<image class="CGiftCode-card__image" :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="app-flex-item app-flex-item--1">
							<view class="CGiftCode-card__title">{{item.title}}</view>
							<view class="CGiftCode-card__code">核销码<text class="is-strong m-left20">{{item.code}}</text>
							</view>
						</view>
						<view v-if="item.status == 0" class="app-flex-item">
							<image class="CGiftCode-card__qrcode" :src="getImageRoot('icon-gift-qrcode.png')"
								@click="handleQrCodeClick(item,index)"></image>
						</view>
						<view v-if="item.status == 1" class="app-flex-item">
							<image class="CGiftCode-card__yhx" :src="getImageRoot('icon-gift-yhx.png')"
								@click="handleQrCodeClick(item,index)"></image>
						</view>
					</view>
					<!-- content -->
					<!-- footer -->
					<view class="app-flex app-flex--align-center app-flex--justify-between m-top20">
						<view class="app-flex-item app-flex-item--1 CGiftCode-card-text">
							<view class="iconfont is-inline icon-zhuyi m-right12 is-red"></view>持券仅需付<text
								class="is-red is-strong">{{item.needPrice}}</text>元
						</view>
						<view v-if="item.show_button" class="app-flex-item">
							<button class="app-btn-plain--block" style="height: 50rpx;background-color: #fff;color: #333;font-size: 24rpx;" @click="handleBtnGiftTransferClick(item)">转赠</button>
						</view>
					</view>
					<view class="app-flex m-top20">
						<view class="app-flex-item app-flex-item--1 CGiftCode-card-text">
							价值:￥<text class="is-strong">{{item.price}}</text>
						</view>
						<view class="app-flex-item CGiftCode-card-text" @click="handleGiftDetailClick(item,index)">
							查看详情<view class="iconfont is-inline icon-jinrujiantou f-20"></view>
						</view>
					</view>
					<view v-if="item.status == 1" class="app-flex m-top20">
						<view class="app-flex-item app-flex-item--1 CGiftCode-card-text">
							核销时间
						</view>
						<view class="app-flex-item CGiftCode-card-text is-black">{{item.writeOffTime}}</view>
					</view>
					<view v-if="item.status == 1" class="app-flex m-top20">
						<view class="app-flex-item app-flex-item--1 CGiftCode-card-text">
							核销人员
						</view>
						<view class="app-flex-item CGiftCode-card-text is-black">{{item.operator}}</view>
					</view>
					<!-- footer end -->
				</view>
			</view>
		</view>
		<view v-else class="CGiftCode-empty app-flex app-flex--column app-flex--align-center app-flex--justify-between">
			<image class="CGiftCode-empty__img" :src="getImageRoot('icon-gift-empty.png')" mode="heightFix"></image>
			<view class="CGiftCode-empty__text">无核销商品</view>
		</view>
		<!-- content end -->
		<!-- footer -->
		<view class="CGiftCode__footer">
			<view v-if="cList.length" class="codeOpened app-flex app-flex--align-center app-flex--justify-center">
				<view v-if="!codeOpened" class="codeOpened__btn-more col-9" @click="codeOpened = true">展开<view
						class="iconfont is-inline icon-xialajiantouxiao" style="font-size: 24rpx;"></view>
				</view>
				<view v-else class="codeOpened__btn-more  col-9" @click="codeOpened = false">收起<view
						class="iconfont is-inline icon-fold" style="font-size: 24rpx;"></view>
				</view>
			</view>
			<view class="app-flex m-top20">
				<view class="app-flex-item app-flex-item--1 CGiftCode-card-text">
					下单时间
				</view>
				<view class="app-flex-item CGiftCode-card-text is-black">{{time}}</view>
			</view>
			<view class="app-flex m-top20">
				<view class="app-flex-item app-flex-item--1 CGiftCode-card-text">
					订单编号
				</view>
				<view class="app-flex-item CGiftCode-card-text is-black">{{orderNo}}</view>
			</view>
			<view class="app-flex m-top20">
				<view class="app-flex-item app-flex-item--1 CGiftCode-card-text">
					过期时间
				</view>
				<view class="app-flex-item CGiftCode-card-text is-black">{{expiration}}</view>
			</view>
			<view style="margin: 30rpx  0 ;border-top: 1px dashed #ccc;"></view>
			<!-- 使用说明 -->
			<view class="CGiftCode-intro m-top20">
				<view class="CGiftCode-intro__title">使用说明</view>
				<parse :html="instructions"></parse>
			</view>
			<!-- 使用说明  end -->
		</view>
		<!-- footer end -->
		<!-- 二维码弹窗 -->
		<QrCodePopup v-model="qrCodePopupVisible" :image="qrCodePopupItem.qrcode"></QrCodePopup>
		<!-- 二维码弹窗 end -->
		<!-- 适用门店弹窗 -->
		<StoreListPopup v-model="storeListPopupVisible" :list="storeListPopupItem"></StoreListPopup>
		<!-- 适用门店弹窗 end -->
		<!-- 礼包查看详情弹窗 -->
		<OpenPopup v-model="openPopupVisible" :codeItem="openPopupTarget" type="gift"></OpenPopup>
		<!-- 礼包查看详情弹窗 end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import PageNavBar from '@/components/template/PageNavBar2.vue'
	import QrCodePopup from './QrCodePopup.vue'
	import StoreListPopup from './StoreListPopup.vue'
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	import OpenPopup from './OpenPopup.vue'
	export default {
		name: 'CGiftCode',
		components: {
			PageNavBar,
			QrCodePopup,
			StoreListPopup,
			Parse,
			OpenPopup
		},
		props: {
			// 列表数据
			list: {
				type: Array,
				default () {
					// return Array(2).fill(1).map((item, index) => ({
					// 	id: index,
					// 	title: '标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题' + index,
					// 	image: 'https://via.placeholder.com/90x90/2a9ff6/fffffff',
					// 	code: '12345678',
					// 	qrcode: 'https://via.placeholder.com/90x90/2a9ff6/fffffff',
					// 	// 价值 多少钱
					// 	price: '104.00',
					// 	// 仅需多少钱
					// 	needPrice: '28.8',
					// 	// 门店数量
					// 	storeNum: 2,
					// 	// 0=待使用，1=已使用，2=已转赠其他数值为已失效
					// 	status: -1,
					// 	// 核销人员
					// 	operator: '',
					// 	// 核销时间
					// 	writeOffTime: '',
					// 	// 核销时间
					// 	// 门店列表
					// 	storeList: [{
					// 		id: '',
					// 		name: '',
					// 		address: '',
					// 		phone: '',
					// 		latitude: 31,
					// 		longitude: 103
					// 	}]
					// }))
					return []
				}
			},
			// 默认展示几条数据
			defaultLength: {
				type: Number,
				default: 2
			},
			// 下单时间
			time: {
				type: String,
				default: ''
			},
			// 订单编号
			orderNo: {
				type: String,
				default: ''
			},
			// 订单id
			orderId: {
				type: String,
				default: ''
			},
			// 过期时间
			expiration: {
				type: String,
				default: ''
			},
			// 使用说明（富文本）
			instructions: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				// 礼包查看详情弹窗是否显示
				openPopupVisible: false,
				// 详情弹窗的目标
				openPopupTarget: {},
				// 当前选中的顶部tab索引
				topCateAvtive: 0,
				// 是否展开
				codeOpened: false,
				// 二维码弹窗是否显示
				qrCodePopupVisible: false,
				// 二维码弹窗目标
				qrCodePopupItem: {},
				// 适用门店弹窗是否显示
				storeListPopupVisible: false,
				// 适用门店弹窗目标
				storeListPopupItem: {},
				// 礼包二维码的接口数据
				giftQrCodeResMap: {}
			}
		},
		computed: {
			// 格式化的顶部tab的数据
			cTopCateData() {
				const nums = {
					toBeUsed: 0,
					used: 0,
					transfer: 0
				}
				this.list.forEach(item => {
					if (item.status == 0) {
						nums.toBeUsed++
					} else if (item.status == 1) {
						nums.used++
					} else {
						nums.transfer++
					}
				})
				return [{
						id: 'toBeUsed',
						title: `待使用(${nums.toBeUsed})`,
						value: 0
					},
					{
						id: 'used',
						title: `已使用(${nums.used})`,
						value: 1
					},
					{
						id: 'transfer',
						title: `已转赠(${nums.transfer})`,
						value: -1
					}
				]
			},
			// 当前选中的顶部分类的项
			cTopCateActiveItem() {
				return this.cTopCateData[this.topCateAvtive] || {}
			},
			// 格式化的核销码列表
			cList() {
				let list = []
				// 待使用和已使用
				if ([0, 1].includes(+this.cTopCateActiveItem.value)) {
					list = this.list.filter(item => item.status == this.cTopCateActiveItem.value)
				} else {
					// 已经失效
					list = this.list.filter(item => ![0, 1].includes(+item.status))
				}

				if (!this.codeOpened) {
					return list.slice(0, 2)
				}
				return list
			}
		},
		methods: {
			// 转赠按钮点击事件
			handleBtnGiftTransferClick(item) {
				console.log('handleBtnGiftTransferClick',item)
				// 跳转到转赠页面
				App.navigationTo({
					url: `pages/subPages/orderPresent/giftGoodsSelect`,
					query: {
						order_id: this.orderId,
						donation_vercode_id: item.id
					}
				})
			},
			// 礼包查看详情点击
			handleGiftDetailClick(item = {}) {
				console.log('handleGiftDetailClick',item)
				this.openPopupVisible=true
				// 详情弹窗的目标
				this.openPopupTarget = item
			},
			// 二维码点击事件
			async handleQrCodeClick(item) {
				this.qrCodePopupItem = item || {}
				this.qrCodePopupVisible = true
				try{
					await this.fetchGiftQrCodeResMapIfNeeded({
						order_id: item.orderId,
						code: item.code
					})
					this.qrCodePopupItem = {
						...this.qrCodePopupItem,
						qrcode: this.giftQrCodeResMap[this.qrCodePopupItem.code]
					}
				}catch(e){
					//TODO handle the exception
				}
				
			},
			// 门店点击花时间
			handleStoreClick(item) {
				this.storeListPopupItem = item.storeList || {}
				this.storeListPopupVisible = true
			},
			// 顶部分类点击事件
			async handleTopCateItemClick({
				index
			}) {

				this.topCateAvtive = index

			},
			// 请求商家列表的接口数据
			async fetchGiftQrCodeResMapIfNeeded({
				order_id = '',
				code = '',
				force = false
			} = {}) {
				try {
					if (!force && this.giftQrCodeResMap[code]) {
						return
					}
					const res = await App._getP('user.order/lbspQrcode', {
						order_id,
						code
					})
					this.giftQrCodeResMap[code] = this.$util.deepGet(res, 'data', '')
				} catch (e) {
					console.log('fetchGiftQrCodeResMapIfNeeded', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.CGiftCode {
		background-color: #fff;
		padding: 0 30rpx 0 30rpx;
	}

	.CGiftCode-card {
		background-color: #F8F8F8;
	}

	.CGiftCode-card__image {
		width: 90rpx;
		height: 90rpx;
		border-radius: 20rpx;
	}

	.CGiftCode-card__qrcode {
		width: 70rpx;
		height: 70rpx;
	}

	.CGiftCode-card__yhx {
		width: 90rpx;
		height: 90rpx;
	}

	.CGiftCode-card__title {
		font-size: 28rpx;
		color: #999;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.CGiftCode-card__code {
		display: inline-flex;
		align-items: center;
		height: 40rpx;
		margin-top: 16rpx;
		padding: 0 20rpx;
		font-size: 24rpx;
		color: #333;
		background-color: #EEEEEE;
		border-radius: 9999rpx;

		.is-strong {
			font-size: 28rpx;
			font-weight: bold;
		}

		.is-used & {
			color: #999;
		}
	}

	.CGiftCode-card-text {
		color: #999;
		font-size: 24rpx;

		&.is-black,
		.is-black {
			color: #333;

		}

		&.is-red,
		.is-red {
			color: #FF4444;
		}

		&.is-strong,
		.is-strong {
			font-weight: bold;
			font-size: 28rpx;

			.is-used & {
				color: #999;
			}
		}

		.iconfont {
			font-size: inherit;
		}
	}

	.CGiftCode-empty {
		padding-top: 100rpx;
		padding-bottom: 100rpx;
	}

	.CGiftCode-empty__img {
		width: 200rpx;
		height: 205rpx;
	}

	.CGiftCode-empty__text {
		font-size: 24rpx;
		color: #999999;
		margin-top: 30rpx;
	}

	.CGiftCode-intro__title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 30rpx;
	}
</style>
