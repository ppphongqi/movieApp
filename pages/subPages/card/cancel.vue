<template>
	<view class="page-card-cancel app-clearfix" :style="themeColor">
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="user-card__header">
				<image class="user-card__avatar" :src="cPageDetails.avatar"></image>
				<view class="user-card__nickname">{{cPageDetails.nickname}}</view>
			</view>
			<view class="user-card__content">
				<view class="user-card__phone"> 联系电话：<text class="is-strong">{{cPageDetails.phone}}</text></view>
			</view>
		</view>
		<!-- 用户信息卡片 end -->
		<!-- 卡包信息 -->
		<view class="card-details">
			<view class="card-details__left">
				<view class="card-details__pic" :style="{backgroundImage: `url(${cPageDetails.cardBgUrl})`}">
					<view class="card-details__petName">{{cPageDetails.cardPetName}}</view>
					<view class="card-details__cate">{{cPageDetails.cardCate}}</view>
				</view>
			</view>
			<view class="card-details__right">
				<view class="card-details__title">{{cPageDetails.cardTitle}}</view>
				<view class="user-card__times">剩余可核销次数：<text class="is-strong">{{cPageDetails.times}}</text></view>
			</view>
		</view>
		<!-- 卡包信息 end -->
		<!-- 核销商家 -->
		<view class="page-card-cell">
			<view class="page-card-cell__left">核销商家</view>
			<view class="page-card-cell__center is-active">
				<picker mode="selector" :value="0" @change="handleBusPickerChange" range-key="name" :range="busListRes">
					<view>{{busActiveItem.name || '请选择商家'}}</view>
				</picker>
			</view>
			<view class="page-card-cell__right">
				<view class="iconfont icon-right"></view>
			</view>
		</view>
		<!-- 核销商家 end -->
		<!-- 核销门店 -->
		<view class="page-card-cell">
			<view class="page-card-cell__left">核销门店</view>
			<view class="page-card-cell__center is-active">
				<picker mode="selector" :value="0" @change="handleStorePickerChange" range-key="name" :range="storeListRes">
					<view>{{storeActiveItem.name || '请选择门店'}}</view>
				</picker>
			</view>
			<view class="page-card-cell__right">
				<view class="iconfont icon-right"></view>
			</view>
		</view>
		<!-- 核销门店 end -->
		<!-- 核销次数 -->
		<view class="page-card-cell">
			<view class="page-card-cell__left">核销次数</view>
			<view class="page-card-cell__center">
				<u-number-box v-model="num" :min="1" :max="cPageDetails.times || 1"></u-number-box>
			</view>
		</view>
		<!-- 核销次数 end -->
		<!-- footer -->
		<view class="app-wrapper--safe-fixed-bottom main-bg-color main-color">
			<!-- 商家按钮 -->
			<view class="page-card-cancel__btn-nav main-bg-color" @click="navigationTo('pages/subPages/business/index')">
				<image class="page-card-cancel__btn-nav__img" src="./static/images/icon-shop.png" mode=""></image>
				<view class="page-card-cancel__btn-nav__text">我的</view>
			</view>
			<!-- 商家按钮 end -->
			<button :loading="submitting" class="btn-normal page-card__btn-submit" :class="{'is-disabled': isConfirming}" @click="handleSubmitClick">{{isConfirming ? '等待用户确认' : '立即核销'}}</button>
		</view>
		<!-- footer end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	export default {
		data() {
			return {
				// 查询参数
				options: {
					card_user_id: '',
					bus_id: '',
					store_id: ''
				},
				// 详情的接口数据
				detailsRes: {},
				// 核销商家的接口数据
				busListRes: [],
				// 核销门店接口数据
				storeListRes: [],
				// 当前输入的核销次数
				num: 1,
				// 当前选中的商家
				busActiveItem: {},
				// 当前选中的门店
				storeActiveItem: {},
				// 是否正在提交表单
				submitting: false,
				// 是否正在确认中
				isConfirming: false,
				// 确认接口数据
				confirmingRes: {}
			}
		},
		computed: {
			cPageDetails() {
				const data = this.detailsRes || {}
				return {
					// 用户头像
					avatar: data.avatarUrl || '',
					// 用户昵称
					nickname: data.nickName || '',
					// 用户联系电话
					phone: data.mobile || '',
					// 卡包类别名称
					cardCate: data.class_name || '',
					// 卡包别称
					cardPetName: data.alias_title || '',
					// 卡包名称
					cardTitle: data.title || '',
					// 卡包背景图片
					cardBgUrl: data.image || '',
					// 剩余可核销次数
					times: data.number || ''
				}
			},
			// 格式化的订单提交信息
			cDataSubmitted() {
			    const data = {
			        card_user_id: this.options.card_user_id,
			        bus_id: this.busActiveItem.bus_id,
			        store_id: this.storeActiveItem.id,
					hx_num: this.num,
					index: this.detailsRes.index
			    }
			    return data
			},
		},
		onLoad(options) {
			this.options = options
		},
		async onShow() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				await Promise.all([this.fetchDetailsRes().catch(() => {}),this.fetchBusListRes().catch(()=>{})])
				this.fetchStoreListRes().catch(()=>{})
			} catch (e) {
				console.log('onShow 报错', e)
				// TODO handle the exception
			}
			App.hideLoading()
		},
		beforeDestroy() {
			this.endFetchConfirmResTimmer()
		},
		methods: {
			// 开始轮询核销状态
			async startFetchConfirmResTimmer() {
				if(this.fetchConfirmingResTimer) return
				try{
					this.fetchConfirmingRes()
					this.fetchConfirmingResTimer = setInterval(()=>{
						console.log('fetchConfirmingResTimer')
						this.fetchConfirmingRes()
					}, 2000)
				}catch(e){
					//TODO handle the exception
				}
				
			},
			// 结束轮询核销状态
			endFetchConfirmResTimmer() {
				clearInterval(this.fetchConfirmingResTimer)
				this.fetchConfirmingResTimer = null
			},
			// 查询核销状态
			async fetchConfirmingRes() {
				try {
					if(!this.detailsRes.index || this.submitting) return
					this.isConfirming = true
					const res = await App._postP('card.card/confirm', {
						index: this.detailsRes.index,
					})
					this.confirmingRes = res.data || []
					if(this.confirmingRes.bool && this.confirmingRes.status == 1){
						this.endFetchConfirmResTimmer()
						// 真正的提交
						this.doSubmit()
					}else if(this.confirmingRes.bool && this.confirmingRes.status == 2) {
						this.endFetchConfirmResTimmer()
						uni.showModal({
							content: '用户拒绝确认',
							showCancel: true,
							success() {
								// 跳转到商家中心
								App.navigationTo({
									url: 'pages/subPages/business/index',
									redirectTo: true
								})
							}
						})
					}
				} catch (e) {
					console.log('fetchConfirmingRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			/**
				 * 校验表单数据
				 * @return {Boolean}
				 */
			validateForm(data = this.cDataSubmitted) {
			    if (!data) {
			        return false
			    }
				if (!data.store_id) {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择门店'
				    })
				    return false
				}
			    if (!data.hx_num) {
			        uni.showToast({
			            icon: 'none',
			            title: '请填写核销次数'
			        })
			        return false
			    }
			    return true
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					if(this.detailsRes.index) return
					const res = await App._getP('card.card/hxDetail', {
						card_user_id: this.options.card_user_id,
					})
	
					this.detailsRes = res.data || {}
				} catch (e) {
					console.log('fetchDetailsRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求商家列表的接口数据
			async fetchBusListRes() {
				try {
					const res = await App._getP('merchant.index/switchBusiness')
					this.busListRes = res.data || []
					if(!this.busActiveItem.id) {
						this.busActiveItem = this.busListRes.find(item=>item.bus_id == this.options.bus_id) || {}
					}
				} catch (e) {
					console.log('fetchBusListRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求门店列表的接口数据
			async fetchStoreListRes() {
				try {
					const card_id = this.detailsRes.card_id
					const bus_id = this.busActiveItem.bus_id
					if(!card_id || !bus_id) return
					const res = await App._getP('card.card/cardStore', {
						card_id,
						bus_id
					})
					this.storeListRes = res.data || []
					if(!this.storeActiveItem.id) {
						this.storeActiveItem = this.storeListRes.find(item=>item.id == this.options.store_id) || {}
					}
				} catch (e) {
					console.log('fetchStoreListRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 商家选择改变事件
			handleBusPickerChange(e) {
				const index = + e.detail.value
				this.busActiveItem = this.busListRes[index] || ''
				this.storeActiveItem = {}
				this.fetchStoreListRes().catch(()=>{})
			},
			// 门店选择改变事件
			handleStorePickerChange(e) {
				const index = + e.detail.value
				this.storeActiveItem = this.storeListRes[index] || ''
			},
			// 点击事件
			async handleSubmitClick() {
				if (this.submitting) {
				    return
				}
				if (!this.validateForm()) {
				    return
				}
				try{
					await App._postP('card.card/inputNumber', {
						index: this.detailsRes.index,
						hx_num: this.cDataSubmitted.hx_num
					})
					this.doSubmit()
				}catch(e){
					//TODO handle the exception
				}
			},
			// 真正的提交方法
			async doSubmit() {
				
				if (this.submitting) {
				    return
				}
				if (!this.validateForm()) {
				    return
				}
				this.submitting = true
				try {
					const res = await App._getP('card.card/hx', {...this.cDataSubmitted})
					uni.showModal({
						content: '核销成功',
						showCancel: false,
						success() {
							// 跳转到商家中心
							App.navigationTo({
								url: 'pages/subPages/business/index',
								redirectTo: true
							})
						}
					})
				} catch(err) {
					console.log()
				}
				this.submitting = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-card-cancel {
		box-sizing: border-box;
		min-height: 100vh;
		padding-bottom: 160rpx;
		background: linear-gradient(to bottom, var(--theme-color, #FFD940), #f7f7f7 100rpx);
	}

	// 用户信息卡片
	.user-card {
		box-sizing: border-box;
		width: 690rpx;
		max-width: 100%;
		padding: 0 30rpx;
		margin: 20rpx auto;
		background-color: #FEFFFF;
		border-radius: 10rpx;
	}

	.user-card__header {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: 100rpx;
		border-bottom: 1px solid #EEEEEE;

		.user-card__nickname {
			margin-left: 20rpx;
		}
	}

	.user-card__avatar {
		flex-shrink: 0;
		width: 60rpx;
		height: 60rpx;
		border-radius: 100%;
	}

	.user-card__nickname {
		min-width: 0;
		flex: 1;
		font-weight: bold;
		color: #333;
		font-size: 32rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user-card__content {
		display: flex;
		align-items: center;
		height: 73rpx;
	}

	.user-card__phone {
		font-weight: bold;
		font-size: 24rpx;
		color: #999;

		.is-strong {
			color: #333;
		}
	}

	// 用户信息卡片 end
	// 卡包信息
	.card-details {
		box-sizing: border-box;
		display: flex;
		min-height: 180rpx;
		width: 690rpx;
		margin: 20rpx auto;
		padding: 20rpx;
		background-color: #FEFFFF;
		border-radius: 10rpx;
	}

	.card-details__left {
		flex-shrink: 0;
	}

	.card-details__pic {
		box-sizing: border-box;
		width: 235rpx;
		height: 140rpx;
		padding: 15rpx;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		border-radius: 20rpx;
	}

	.card-details__petName {
		font-size: 10rpx;
		color: #fff;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.card-details__cate {
		margin-top: 5rpx;
		font-weight: bold;
		font-size: 18rpx;
		color: #fff;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.card-details__right {
		display: flex;
		flex-direction: column;
		margin-left: 30rpx;
	}

	.card-details__title {
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
		font-weight: bold;
		font-size: 28rpx;
		color: #333;
	}

	.user-card__times {
		font-weight: bold;
		font-size: 24rpx;
		color: #999;
		margin-top: auto;

		.is-strong {
			font-weight: bold;
			color: #FF4444;
		}
	}

	// 卡包信息 end
	// 核销门店
	.page-card-cell {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		min-height: 90rpx;
		padding: 0 30rpx;
		width: 690rpx;
		max-width: 100%;
		margin: 20rpx auto;
		background-color: #FEFFFF;
		border-radius: 10rpx;
	}

	.page-card-cell__left {
		font-size: 24rpx;
		color: #333;
	}

	.page-card-cell__center {
		margin-left: auto;
		font-size: 24rpx;
		color: #999;

		&.is-active {
			font-weight: bold;
			color: #333;
		}
	}

	.page-card-cell__right {
		margin-left: 4rpx;

		.iconfont {
			font-size: 24rpx;
		}
	}

	// 核销门店 end
	.page-card__btn-submit {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		font-weight: bold;
		height: 90rpx;
		&.is-disabled {
			color: #999999;
			background-color: #DDDDDD;
		}
	}
	
	.page-card-cancel__btn-nav {
		box-sizing: border-box;
		position: absolute;
		bottom: 210rpx;
		right: 30rpx;
		display: flex;
		width: 98rpx;
		height: 98rpx;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		line-height: 1;
		border-radius: 100%;
		background-color: #2C5FF4;
	}
	.page-card-cancel__btn-nav__img {
		width: 33rpx;
		height: 33rpx;
	}
	.page-card-cancel__btn-nav__text {
		margin-top: 6rpx;
		color: #333333;
		font-size: 24rpx;
		font-weight: bold;
	}
</style>
