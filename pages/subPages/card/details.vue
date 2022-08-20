<template>
	<view class="page-card-details app-clearfix">
		<!-- 卡包区域 -->
		<view class="page-card-details__sction app-clearfix">
			<!-- 卡包 -->
			<view class="details-card" :style="{backgroundImage: `url(${cDetailsCardData.bgUrl})`}">
				<view class="details-card__content">
					<view class="details-card__content__left">
						<image class="details-card__img" :src="cDetailsCardData.imgUrl"></image>
					</view>
					<view class="details-card__content__center">
						<view class="details-card__title">{{cDetailsCardData.title}}</view>
						<view class="details-card__text">
							剩余{{settingData.card.font.ci}}数：{{cDetailsCardData.times}}{{settingData.card.font.ci}}
						</view>
					</view>
					<view class="details-card__content__right">
						<view class="iconfont icon-ico details-card__icon-qrcode" @click="qrcodePopupVisible = true">
						</view>
					</view>
				</view>
				<view class="details-card__footer">
					<view class="details-card__footer__left">
						<view class="details-card__no">{{cDetailsCardData.code}}</view>
					</view>
					<view class="details-card__footer__right">
						<button class="details-card__btn btn-normal" @click="handleBtnRecordClick">使用记录</button>
					</view>
				</view>
			</view>
			<!-- 卡包 end -->
			<!-- 卡包描述 -->
			<view class="page-card-details__title">{{settingData.card.font.ka_bao}}描述</view>
			<view class="details-desc" :class="{'is-opened': detailsDescOpened}">
				<!-- 富文本 -->
				<parse :html="cDetailsCardData.desc" />
				<!-- 富文本 end -->
				<!-- 查看更多 -->
				<view v-if="!detailsDescOpened" class="details-desc__btn-more" @click="detailsDescOpened = true">展开<view
						class="iconfont is-inline icon-xialajiantouxiao"></view>
				</view>
				<view v-else class="details-desc__btn-more" @click="detailsDescOpened = false">收起<view
						class="iconfont is-inline icon-fold"></view>
				</view>
				<!-- 查看更多 end -->
			</view>
			<!-- 卡包描述 end -->
		</view>
		<!-- 卡包区域 end -->
		<!-- 商家列表区域 -->
		<view class="page-card-details__sction app-clearfix" style="padding-top: 0;">
			<view class="page-card-details__title">商家列表</view>
			<!-- 商家列表 -->
			<view style="background-color: #FBFAFC;margin: 0 -30rpx;padding-top: 30rpx;"><business-list :list="cBusinessList" :isRounded="true" @on-item-click="handleBusinessItemClick" /></view>
			<!-- 商家列表 end -->
			<!-- 卡包二维码 -->
			<popup-view :show="qrcodePopupVisible" type="bottom" @clickmask="qrcodePopupVisible = false">
				<view class="qrcode-card app-after--safe-bottom">
					<image class="qrcode-card__avatar" :src="cDetailsCardData.imgUrl"></image>
					<view class="qrcode-card__tip">请让营业员扫码核销</view>
					<image class="qrcode-card__qrcode" :src="cDetailsCardData.qrCode"></image>
					<!-- <view class="qrcode-card__code">{{cDetailsCardData.code}}</view> -->
					<!-- 关闭按钮 -->
					<view class="qrcode-card__btn-close iconfont icon-searchclose" @click="qrcodePopupVisible = false">
					</view>
				</view>
			</popup-view>
			<!-- 卡包二维码 end -->
		</view>
		<!-- 商家列表区域 end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	import PopupView from '@/components/template/PopManager.vue'
	import BusinessList from './components/BusinessList.vue'
	export default {
		components: {
			Parse,
			PopupView,
			BusinessList
		},
		data() {
			return {
				// url参数
				options: {
					// 卡包id
					id: ''
				},
				// 详情的接口数据
				detailsRes: {},
				// 二维码的接口数据
				qrcodeRes: {},
				// 商家列表的接口数据
				storeRes: [],
				// 富文本是否展开
				detailsDescOpened: false,
				// 卡包二维码弹窗是是否显示
				qrcodePopupVisible: false,
				// 当前的纬度
				lat: '',
				// 当前的经度
				lng: ''
			}
		},
		computed: {
			// 详情卡片数据
			cDetailsCardData() {
				return {
					id: this.detailsRes.id || '',
					card_id: this.detailsRes.card_id,
					// 核销码
					code: this.detailsRes.card_number || '',
					// 卡包图片
					imgUrl: this.detailsRes.logo || '',
					// 卡包背景图片
					bgUrl: this.detailsRes.image || '',
					// 核销二维码图片
					qrCode: this.qrcodeRes.qrimg || '',
					title: this.detailsRes.title || '',
					// 剩余使用次数
					times: this.detailsRes.number || 0,
					// 卡包描述富文本
					desc: this.detailsRes.content || ''
				}
			},
			// 商家列表数据
			cBusinessList() {
				return (this.storeRes || []).map(item => {
					let statusStr = ''
					let statusClass = ''
					if (item.week == 1) {
						statusStr = '营业中'
					} else if (item.week == 2) {
						statusStr = '休息中'
						statusClass = 'is-disabled'
					}
					return {
						_source: item,
						id: item.id,
						imgUrl: item.storelogo || '',
						title: item.name || '',
						// 状态
						statusStr,
						// 状态class
						statusClass,
						// 距离
						distanceStr: `${item.width || ''}km`,
						// 电话
						phone: item.mobile || '',
						// 经纬度
						latitude: item.lat,
						longitude: item.lng,
						// 地址名称
						addressName: item.store_introduce || item.detailed_address || '',
						// 详细地址
						address:item.store_introduce || item.detailed_address || '',
					}
				})
			}
		},
		watch: {
			'settingData.card.font': {
				handler(val) {
					uni.setNavigationBarTitle({
						title: val.ka_bao + '详情'
					})
				},
				immediate: true
			}
		},
		onLoad(options) {
			this.options = options
		},
		async onShow() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				const location = await App.getLocation().catch(() => {}) || {}
				this.lat = location.latitude
				this.lng = location.longitude
				await Promise.all([
					this.fetchDetailsRes().catch(() => {}),
					this.fetchQrcodeRes().catch(() => {})

				])
				await this.fetchStoreRess().catch(() => {})
				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
				// TODO handle the exception
			}
		},
		methods: {
			// 使用记录按钮的点击事件
			handleBtnRecordClick() {
				// 跳转到使用记录页面
				App.navigationTo({
					url: `pages/subPages/card/record?${App.urlEncode({
                    card_id: this.cDetailsCardData.card_id
                })}`
				})
			},
			// 商家列表项点击事件
			handleBusinessItemClick(item) {
				this.goStoreDetails(item._source)
			},
			// 跳转到门店详情
			goStoreDetails({
				store_id,
				bus_id
			} = {}) {
				App.navigationTo({
					url: 'pages/subPages/shopDetail/shopDetail?' + App.urlEncode({
						store_id,
						bus_id
					})
				})
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._getP('card.card/cardShow', {
						id: this.options.id
					})
					this.detailsRes = res.data || []
				} catch (e) {
					console.log('fetchCardCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求二维码的接口数据
			async fetchQrcodeRes() {
				try {
					const res = await App._getP('card.card/cardQrCode', {
						id: this.options.id
					})
					this.qrcodeRes = res.data || []
				} catch (e) {
					console.log('fetchQrcodeRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求商家列表的接口数据
			async fetchStoreRess() {
				try {
					const res = await App._getP('card.card/cardBusiness', {
						list_rows: 100,
						card_id: this.cDetailsCardData.card_id,
						lat: this.lat,
						lng: this.lng
					})
					this.storeRes = this.$util.deepGet(res, 'data.data', [])
				} catch (e) {
					console.log('fetchStoreRess', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-card-details__sction {
		box-sizing: border-box;
		padding: 20rpx 30rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
	}

	.page-card-details__title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin: 0 -30rpx;
		padding: 30rpx;
		border-bottom: 1px solid #eee;
	}

	// 卡包
	.details-card {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		min-height: 300rpx;
		margin: 0 auto;
		padding: 40rpx 30rpx;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		background-color: rgb(247, 247, 247);
		border-radius: 10rpx;
	}

	.details-card__content {
		display: flex;
		align-items: center;
	}

	.details-card__img {
		width: 90rpx;
		height: 90rpx;
		border: 2rpx solid #fff;
		border-radius: 100%;
	}

	.details-card__content__center {
		box-sizing: border-box;
		flex: 1;
		min-width: 0;
		margin-left: 30rpx;
	}

	.details-card__title {
		color: #fff;
		font-size: 32rpx;
		font-weight: normal;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.details-card__text {
		margin-top: 14rpx;
		color: #ddd;
		font-size: 24rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.details-card__content__right {
		margin-left: 30rpx;
	}

	.details-card__icon-qrcode {
		box-sizing: border-box;
		font-size: 48rpx;
		color: #999999;
		line-height: 1;
		padding: 5rpx;
		background-color: #fff;
		border-radius: 6rpx;
	}

	.details-card__footer {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-top: auto;
	}

	.details-card__no {
		font-size: 32rpx;
		color: #ddd;
		font-weight: bold;
	}

	.details-card__btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 45rpx;
		padding: 0 16rpx;
		color: #ddd;
		font-size: 20rpx;
		border: 1px solid #fff;
		border-radius: 9999rpx;
	}

	// 卡包 end
	// 卡包描述
	.details-desc {
		position: relative;
		box-sizing: border-box;
		height: 300rpx;
		overflow: hidden;

		&.is-opened {
			padding-bottom: 56rpx;
			height: 600rpx;
			overflow: auto;
		}
	}

	.details-desc__btn-more {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
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

	// 卡包描述 end
	// 商家列表
	// 商家列表 end
	// 卡包二维码
	.qrcode-card {
		position: relative;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100vw;
		padding-top: 42rpx;
		padding-bottom: 60rpx;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0px 0px;
	}

	.qrcode-card__avatar {
		width: 96rpx;
		height: 96rpx;
		border: 2rpx solid #fff;
		border-radius: 100%;
	}

	.qrcode-card__tip {
		margin-top: 38rpx;
		font-size: 24rpx;
		color: #999;
	}

	.qrcode-card__qrcode {
		width: 270rpx;
		height: 270rpx;
		margin-top: 24rpx;
	}

	.qrcode-card__code {
		margin-top: 24rpx;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.qrcode-card__btn-close {
		position: absolute;
		top: 24rpx;
		right: 33rpx;
		color: #333;
		font-size: 36rpx;
	}

	// 卡包二维码 end
</style>
