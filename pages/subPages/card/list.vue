<template>
	<view class="page-card-list">
		<!-- 卡券列表 -->
		<view class="card-list">
			<view v-for="(item,index) in cCardList" :key="item.id" class="card-item"
				@click="handleCardBagItemClick(item)">
				<view class="card-card">
					<view class="card-card__banner" :style="{backgroundImage: `url(${item.bgUrl})`}"></view>
					<view class="card-card__content">
						<view class="card-card__header">
							<image class="card-card__logo" :src="item.imgUrl" mode="aspectFill"></image>
							<view class="card-card__title">{{item.title}}</view>
							<view class="card-card__num">
								剩余{{settingData.card.font.ci}}数：{{item.times}}{{settingData.card.font.ci}}<view class="iconfont is-inline icon-jinrujiantou1"></view>
							</view>
						</view>
						<button class="card-card__btn-go btn-normal main-bg-color auxiliary-color" @click.stop="handleBtnCodeClick(item,index)"><view class="iconfont is-inline icon-saoyisao" ></view>扫码核销</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 卡券列表 end -->
		<!-- 加载更多提示 -->
		<LoadMore :showLoadmore="true"></LoadMore>
		<!-- 加载更多提示 end -->
		<!-- 兑换按钮 -->
		<view class="app-wrapper--safe-fixed-bottom app-clearfix">
			<button class="btn-normal page-card-list__btn-exchange" @click="exchangePopupVisible = true">
				兑换
			</button>
		</view>
		<!-- 兑换按钮 end -->
		<!-- 兑换弹窗 -->
		<popup-view :show="exchangePopupVisible" type="center" @clickmask="exchangePopupVisible = false">
			<view v-show="exchangePopupVisible" class="exchange-card">
				<view class="exchange-card__content">
					<input v-model="exchangeCode" class="exchange-card__input" type="text" placeholder="输入兑换码" />
				</view>
				<view class="exchange-card__footer">
					<button class="btn-normal exchange-card__btn is-cancel"
						@click="exchangePopupVisible = false">取消</button>
					<button class="btn-normal exchange-card__btn is-confirm" @click="handleBtnExchangeClick">确定</button>
				</view>
			</view>
		</popup-view>
		<!-- 兑换弹窗 end -->
		<!-- 卡包二维码 -->
		<popup-view :show="qrcodePopupVisible" type="bottom" @clickmask="qrcodePopupVisible = false">
			<view class="qrcode-card app-after--safe-bottom">
				<image class="qrcode-card__avatar" :src="cardBagToCode.imgUrl"></image>
				<view class="qrcode-card__tip">当前剩余核销次数：{{cardBagToCode.times}}</view>
				<image class="qrcode-card__qrcode" :src="qrcodeRes.qrimg"></image>
				<view class="qrcode-card__code">营业员核销中...</view>
				<!-- 剩余使用次数 -->
				<view class="qrcode-card__num">剩余次数：{{cardBagToCode.times}}次</view>
				<!-- 剩余使用次数 end -->
				<!-- 使用记录按钮 -->
				<button class="btn-normal qrcode-card__btn-record" @click="handleBtnRecordClick">使用记录</button>
				<!-- 使用记录按钮 end -->
			</view>
		</popup-view>
		<!-- 卡包二维码 end -->
		<page-loading ref="loading"></page-loading>
		<tab-bar />
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import PopupView from '@/components/template/PopManager.vue'
	import LoadMore from '@/components/template/Loadmore.vue'
	import TabBar from '@/components/template/TabBar'
	export default {
		components: {
			PopupView,
			LoadMore,
			TabBar
		},
		data() {
			return {
				// 当前二维码的接口数据
				qrcodeRes: {},
				// 卡包列表的接口数据
				cardBagRes: [],
				// 当前输入的兑换码
				exchangeCode: '',
				// 兑换弹窗是否显示
				exchangePopupVisible: false,
				// 是否正在兑换
				exchanging: false,
				// 卡包二维码弹窗是是否显示
				qrcodePopupVisible: false,
				// 当前正在扫码核销的
				cardBagToCode: {},
				// 当前核销状态接口数据
				writeOffRes: {}
			}
		},
		computed: {
			// 格式化的卡片列表数据
			cCardList() {
				return (this.cardBagRes || []).map(item => ({
					_source: item,
					id: item.id,
					imgUrl: item.logo || '',
					bgUrl: item.image,
					title: item.title,
					times: item.number
				}))
			}
		},
		watch: {
			'settingData.card.font': {
				handler(val) {
					uni.setNavigationBarTitle({
						title: val.ka_bao + '列表'
					})
				},
				immediate: true
			},
			qrcodePopupVisible(val) {
				if (val) {
					this.startFetchWriteOffResTimmer()
				} else {
					this.endFetchWriteOffResTimmer()
				}
			},
		},
		async onShow() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				await Promise.all([this.fetchCardBagRes().catch(() => {})])
			} catch (e) {
				console.log('onShow 报错', e)
				// TODO handle the exception
			}
			App.hideLoading()
		},
		beforeDestroy() {
			this.endFetchWriteOffResTimmer()
		},
		methods: {
			// 使用记录按钮的点击事件
			handleBtnRecordClick() {
				this.endFetchWriteOffResTimmer()
				// 跳转到使用记录页面
				App.navigationTo({
					url: `pages/subPages/card/record?${App.urlEncode({card_id: this.cardBagToCode._source.card_id})}`
				})
			},
			// 开始轮询核销状态
			startFetchWriteOffResTimmer() {
				if (this.fetchWriteOffResTimmer) return
				this.fetchWriteOffRes()
				this.fetchWriteOffResTimmer = setInterval(() => {
					console.log('fetchWriteOffResTimmer')
					this.fetchWriteOffRes()
				}, 2000)
			},
			// 结束轮询核销状态
			endFetchWriteOffResTimmer() {
				clearInterval(this.fetchWriteOffResTimmer)
				this.fetchWriteOffResTimmer = null
			},
			// 查询核销状态
			async fetchWriteOffRes() {
				try {
					if (!this.qrcodeRes.index || this.writeOffRes.bool) return
					const res = await App._postP('card.card/qrHx', {
						index: this.qrcodeRes.index
					})
					this.writeOffRes = res.data || {}
					if (this.writeOffRes.bool) {
						this.endFetchWriteOffResTimmer()
						this.qrcodePopupVisible = false
						uni.showToast({
							icon: 'none',
							title: '当前核销' + this.writeOffRes.number + '次'
						})
						this.fetchCardBagRes()
					}
				} catch (e) {
					console.log('fetchWriteOffRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 展示核销确认模态框
			showWriteOffModal({
				num = 0
			}) {
				if (num <= 0) return
				uni.showModal({
					content: `是否确认核销${num}次`,
					cancelText: '拒绝',
					cancelColor: '#999999',
					confirmText: '确认',
					confirmColor: '#333333',
					success: (res) => {
						this.writeOffRes = {}
						App._postP('card.card/userConfirm', {
							index: this.qrcodeRes.index,
							status: res.confirm === true ? 1 : 2
						})
					}
				})
			},
			// 扫码核销按钮点击事件
			async handleBtnCodeClick(item, index) {
				console.log('handleBtnCodeClick121212')
				this.qrcodeRes = {}
				try {
					this.qrcodePopupVisible = true
					this.cardBagToCode = {
						...item,
						index
					}
					await this.fetchQrcodeRes(item.id)
				} catch (err) {

				}
			},
			// 卡包点击事件 跳转到卡包详情
			handleCardBagItemClick(item = {}) {
				const id = item.id
				if (!id) {
					uni.showToast({
						icon: 'none',
						title: '未获取到id'
					})
				}
				App.navigationTo({
					url: `pages/subPages/card/details?${App.urlEncode({ id })}`
				})
			},
			// 兑换按钮点击事件
			async handleBtnExchangeClick() {
				// 是否正在兑换
				if (this.exchanging) {
					return
				}
				// 参数校验
				if (!this.exchangeCode) {
					uni.showToast({
						icon: 'none',
						title: '请输入兑换码'
					})
					return
				}
				this.exchanging = true
				uni.showLoading({
					mask: true,
					title: '正在兑换'
				})
				try {
					const res = await App._postP('card.card/codeExchange', {
						code: this.exchangeCode
					})
					if (res.code == 1) {
						uni.showToast({
							icon: 'none',
							title: res.msg || '兑换成功'
						})
						this.exchangePopupVisible = false
						this.exchangeCode = ''
						// 刷新列表
						this.fetchCardBagRes()
					}
					// 刷新列表数据
				} catch (e) {
					console.log('onShow 报错', e)
					// TODO handle the exception
				}
				this.exchanging = false
			},
			// 请求卡包列表的接口数据
			async fetchCardBagRes() {
				try {
					const res = await App._getP('card.card/myCard', {
						list_rows: 500
					})
					this.cardBagRes = this.$util.deepGet(res, 'data.data', [])
				} catch (e) {
					console.log('fetchCardBagRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求二维码的接口数据
			async fetchQrcodeRes(id) {
				try {
					const res = await App._getP('card.card/cardQrCode', {
						id
					})
					this.qrcodeRes = res.data || []
				} catch (e) {
					console.log('fetchQrcodeRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-card-list {
		box-sizing: border-box;
		min-height: 100vh;
		padding-bottom: 260rpx;
		background-color: #F8F8F8;
	}

	// 卡券列表
	.card-list {
		padding: 20rpx 30rpx;
	}

	.card-item {
		&+& {
			margin-top: 20rpx;
		}
	}

	.card-card {
		position: relative;
	}

	.card-card__banner {
		position: relative;
		height: 240rpx;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		border-radius: 20rpx 20rpx 0 0;
		&::before {
			position: absolute;
			left: 0;
			top: 100%;
			content: "\20";
			transform: translateY(-50%);
			width: 25rpx;
			height: 50rpx;
			background-color: #F8F8F8;
			border-radius: 0 50rpx 50rpx 0;
			z-index: 1;
		}
		&::after {
			position: absolute;
			right: 0;
			top: 100%;
			content: "\20";
			transform: translateY(-50%);
			width: 25rpx;
			height: 50rpx;
			background-color: #F8F8F8;
			border-radius: 50rpx 0 0 50rpx;
			z-index: 1;
		}
	}

	.card-card__content {
		box-sizing: border-box;
		padding: 20rpx 30rpx;
		border-radius: 0 0 20rpx 20rpx;
		background-color: #fff;
	}

	.card-card__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.card-card__logo {
		width: 60rpx;
		height: 60rpx;
		border-radius: 100%;
	}
	
	.card-card__title {
		flex: 1;
		min-width: 0;
		margin-left: 16rpx;
		font-size: 28rpx;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.card-card__num {
		margin-left: 16rpx;
		flex-shrink: 0;
		font-size: 24rpx;
		color: #999;
		.iconfont {
			font-size: inherit;
		}
	}
	
	.card-card__btn-go {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 70rpx;
		margin-top: 20rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		.iconfont {
			font-size: inherit;
			margin-right: 16rpx;
		}
	}

	// 卡券列表 end
	// 兑换按钮
	.page-card-list__btn-exchange {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 90rpx;
		max-width: 100%;
		margin: 0 auto;
		margin-bottom: 180rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		background-color: #fff;
		border-radius: 9999rpx;
		border: 1px solid #333;
	}

	// 兑换按钮 end
	// 兑换弹窗
	.exchange-card {
		box-sizing: border-box;
		width: 580rpx;
		padding: 50rpx;
		padding-bottom: 10rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.exchange-card__input {
		height: 88rpx;
		line-height: 86rpx;
		font-size: 28rpx;
		color: #333;
		border: 1px solid #ccc;
		border-radius: 9999rpx;
		text-align: center;
	}

	.exchange-card__footer {
		display: flex;
		align-items: center;
		height: 120rpx;
	}

	.exchange-card__btn {
		position: relative;
		flex: 1;
		font-weight: bold;
		font-size: 32rpx;
		color: #333;
		text-align: center;

		&+&::before {
			position: absolute;
			left: 0;
			top: 50%;
			display: block;
			content: "\20";
			height: 38rpx;
			width: 1px;
			background-color: #eee;
			transform: translateY(-50%);
		}

		&.is-cancel {
			color: #999;
		}
	}

	// 兑换弹窗
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

	.qrcode-card__num {
		position: absolute;
		left: 30rpx;
		top: 34rpx;
		color: #999;
		font-size: 24rpx;
	}

	.qrcode-card__btn-record {
		position: absolute;
		top: 23rpx;
		right: 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 54rpx;
		padding: 0 16rpx;
		font-size: 24rpx;
		color: #333;
		border: 1px solid #333333;
		border-radius: 9999rpx;
	}

	// 卡包二维码 end
</style>
