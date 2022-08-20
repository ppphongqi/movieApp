<template>
	<view class="page-card-createOrder app-clearfix">
		<!-- 卡包区域 -->
		<view class="page-card-createOrder__section">
			<!-- 广告位 -->
			<image class="page-card-createOrder__ad" :src="cAdData.imgUrl" mode="aspectFill" @click="navigationTo(cAdData.link)"></image>
			<!-- 广告位 end -->
			<!-- 卡包列表 -->
			<CardSelectionV2 v-model="cardSelectionValue" :list="cCardList" selectFirstDefault></cardSelectionV2>
			<!-- 卡包列表 end -->
			<!-- 优惠券列表 -->
			<coupon-list v-if="cCouponList.length" :couponList="cCouponList" />
			<!-- 优惠券列表 end -->
		</view>
		<!-- 卡包区域 end -->
		<!-- 追加次数区域 -->
		<view v-if="cNumberVisible" class="page-card-createOrder__section" style="padding-left: 30rpx;padding-right: 30rpx;padding-bottom: 0;">
			<view class="buy-num-card">
				<view class="buy-num-card__tip">
					<view class="iconfont is-inline icon-zhuyi"></view>追加购买{{settingData.card.font.ci}}数({{cCardActiveItem.price}}元/{{settingData.card.font.ci}})
				</view>
				<view class="form-row">
					<view class="form-row__label">追加{{settingData.card.font.ci}}数</view>
					<input v-model="orderForm.number" class="form-row__input" type="number" :placeholder="'请填写追加'+settingData.card.font.ci+'数'"
					 placeholder-class="is-placeholder" />
				</view>
			</view>
		</view>
		<!-- 追加次数区域 end -->
		<!-- 查看支持商家 -->
		<view class="page-card-createOrder__section" style="padding-left: 30rpx;padding-right: 30rpx;padding-bottom: 0;">
			<view class="form-row">
				<view class="form-row__label"><image style="width: 40rpx;height: 40rpx;margin-right: 8rpx;vertical-align: middle;" src="./static/images/icon-shop--card.png" mode=""></image>查看支持的商家</view>
				<view class="form-row__label" @click="businessPopupVisible = true">{{storeRes && storeRes.length}}个商家<view class="iconfont is-inline icon-right" style="font-size: 28rpx;"></view></view>
			</view>
		</view>
		<!-- 查看支持商家 end -->
		<!-- 表单 -->
		<view class="page-card-createOrder__section" style="padding:0 30rpx;">
			<view class="form-row">
				<view class="form-row__label">姓名</view>
				<input v-model="orderForm.user_name" class="form-row__input" placeholder="请填写姓名" placeholder-class="is-placeholder" />
			</view>
			<view class="form-row">
				<view class="form-row__label">手机号码</view>
				<input v-model="orderForm.mobile" class="form-row__input" placeholder="请填写手机号码" placeholder-class="is-placeholder"
				 maxlength="11" />
			</view>
		</view>
		<!-- 表单 end -->
		<!-- 提交按钮 -->
		<view class="app-wrapper--safe-fixed-bottom" style="background-color: #fff;">
			<view class="page-card-createOrder__footer ">
				<button class="btn-normal page-card-createOrder__btn-home" @click="navigationTo('pages/mainPages/index/index')"><view class="iconfont icon-flow is-inline"></view>返回首页</button>
				<button class="btn-normal page-card-createOrder__btn-home" style="width: 90rpx; height: 90rpx;" @click="toggleShare">海报</button>
				<button :loading="submitting" class="btn-normal page-card-createOrder__btn-op" @click="handleBtnConfirmClick">
					确认支付<block v-if="cTotalPrice">：¥</block>{{cTotalPrice || ''}}
					<!-- 分享免单提示 -->
					<view v-if="cShareNum.visible" class="share-tip">
						<image v-if="cShareNum.avatar" class="share-tip_avatar" :src="cShareNum.avatar" mode="aspectFill"></image>
						<view v-if="cShareNum.nickname" class="share-tip__text share-tip__nickname">{{cShareNum.nickname}}</view>
						<view class="share-tip__text">还差{{cShareNum.num}}{{settingData.free.a_word||''}}免单成功</view>
					</view>
					<!-- 分享免单提示 end -->
				</button>
			</view>
		</view>
		<!-- 提交按钮 end -->
		<!-- 订单支付组件 -->
		<order-pay ref="orderPay" @paySuccess="paySuccess" @payFail="payFail" />
		<!-- 订单支付组件 end -->
		<!-- 商家列表弹窗 -->
		<popup-view :show="businessPopupVisible" type="bottom" @clickmask="businessPopupVisible = false">
			<view scroll-y class="business-wrapper">
				<view class="business-wrapper__header">
					<view class="business-wrapper__title">{{storeRes && storeRes.length}}个商家</view>
					<view class="iconfont icon-searchclose business-wrapper__icon-close" @click="businessPopupVisible = false"></view>
				</view>
				<scroll-view class="business-wrapper__scroll" scroll-y>
					<view class="business-wrapper__scroll__content">
						<business-list :list="cBusinessList" :isRounded="true" @on-item-click="handleBusinessItemClick" />
					</view>
				</scroll-view>
			</view>
			
		</popup-view>
		<!-- 商家列表弹窗 end -->
		<!-- 分享菜单 -->
		<share-view ref="shareView" poster-type="cardBagOrder" :apiParams="cPosterParams" :height="667" :width="375"></share-view>
		<!-- 分享菜单 end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import {
		couponItemConverter
	} from '@/common/js/dataConverter/couponItemConverter'
	import App from '@/common/js/app.js'
	import CardSelectionV2 from './components/CardSelectionV2.vue'
	import CouponList from './components/CouponList.vue'
	import OrderPay from '@/components/template/OrderPayPopups.vue'
	import BusinessList from './components/BusinessList.vue'
	import PopupView from '@/components/template/PopManager.vue'
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	import ShareView from '@/components/template/ShareView.vue'
	export default {
		mixins: [
			pageShareMixin
		],
		components: {
			CardSelectionV2,
			CouponList,
			OrderPay,
			BusinessList,
			PopupView,
			ShareView
		},
		data() {
			return {
				// query参数
				options: {
					// // 卡包分类id
					// card_class_id: '6',
					// // 免单活动id
					// free_id: '',
					// // 从哪个页面来的
					// from: ''
				},
				// 商家列表的接口数据
				storeRes: [],
				// 卡包列表选中的id
				cardSelectionValue: [],
				// 上次下单用户信息的接口数据
				lastUserRes: {},
				// 订单详情的接口数据
				orderDetailsRes: [],
				// 订单表单的一些值
				orderForm: {
					number: '',
					user_name: '',
					mobile: ''
				},
				// 是否正在提交表单
				submitting: false,
				// 商家列表弹窗是否显示
				businessPopupVisible: false,
				// 当前的纬度
				lat: 30.57447,
				// 当前的经度
				lng: 103.92377,
			}
		},
		onLoad(options) {
			this.options = options
			if (options.scene) {
				const queryData = this.$util.scene_decode(options.scene) || {}
				this.options = {
					free_id: queryData.f,
					card_id: queryData.c,
					referee_id: queryData.a,
					card_class_id:  queryData.s,
					from: queryData.m == 1 ? 'free' : '',
					...this.options
				}
			}
			console.log('000000',this.options,this.options.card_id && this.options.referee_id)
			if(this.options.card_id && this.options.from === 'free') {
				console.log('111111',this.options)
				this.cardSelectionValue = [+this.options.card_id]
			}
		},
		async onShow() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				const location = await App.getLocation().catch(() => {}) || {}
				this.lat = location.latitude
				this.lng = location.longitude
				await Promise.all([this.fetchOrderDetailsRes().catch(() => {}),
					this.fetchLastUserRes().catch(() => {}),
					this.fetchStoreRes().catch(() => {})
				])
				this.shareData = this.pageShareMixin_createShareData({
					title: this.$util.deepGet(this.cCardList, '0.title', ''),
					desc: ' ',
					query: {
						free_id: this.options.free_id,
						card_id: this.options.card_id,
						referee_id: this.options.referee_id,
						card_class_id:  this.options.card_class_id,
					}
				})
				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
			}
		},
		computed: {
			// 格式化的海报参数
			cPosterParams() {
				return {
					free_id: this.options.free_id,
					card_id: this.options.card_id,
					referee_id: this.options.referee_id,
					card_class_id:  this.options.card_class_id,
				}
			},
			// 格式化的商家数据
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
						address: item.store_introduce || item.detailed_address || ''
					}
				})
			},
			// 格式化的广告位的数据
			cAdData() {
				return {
					// 图片地址
					imgUrl: this.$util.deepGet(this.settingData, 'card.ad_image.0.file_path', ''),
					link: this.$util.deepGet(this.settingData, 'card.ad_link', ''),
				}
			},
			// 格式化的卡包列表数据
			cCardList() {
				return (this.orderDetailsRes || []).map(item => {
					const priceArr = (item.unit_price || '').split('.')
					const priceInteger = priceArr[0] || ''
					const priceDecimal = '.' + (priceArr[1] || '')
					return {
						_source: item,
						id: item.card_id,
						// 免单id
						free_id: item.free_id,
						// 免单数量
						shareNum: item.share_num,
						// 免单头像
						shareAvatar: item.pid_avatarUrl,
						// 免单昵称
						shareNickname: item.pid_nickName,
						// 次数类型（1：固定次数，2：任意次数）
						type: item.type,
						// 标题
						title: item.title,
						// 次数
						times: item.type == 1 ? item.number : '',
						// 格式化的价格
						price: item.unit_price || '',
						// 格式化的价格 整数部分
						priceInteger,
						// 格式化的价格 小数部分（有小数部分的话样式不一样）
						priceDecimal,
						// 格式化的划线价，
						linePrice: '',
						// 是否是推荐
						recommended: false,
						// 使用须知（富文本）
						rules: item.content,
						// 优惠券
						coupon: item.coupon
					}
				})
			},
			// 当前选中的卡包的信息
			cCardActiveItem() {
				// 当前选中项的id
				const id = this.cardSelectionValue[0]
				if (!id) {
					return {}
				}
				return this.cCardList.find(item => item.id == id) || {}
			},
			// 当前要显示的优惠券信息
			cCouponList() {
				return (this.cCardActiveItem.coupon || []).map(item => {
					let term = item.expire_type === 20 ? this.$util.formatTime(item.stime, 'date', '/') :
						`${this.$util.formatTime(item.stime, 'date', '/')}-${this.$util.formatTime(item.etime, 'date', '/')}`
					if (!item.stime) {
						term = ''
					}
					return {
						...couponItemConverter(item),
						// 有效期
						term,
						// 使用描述
						useDesc: item.use_desc,
						// 是否显示新标签
						labelNewVisible: item.coupon_new,
						// 按钮状态 -1 不知道是什么状态
						btnStatus: -1,
						// 按钮文字
						btnText: '',
						// 是否显示立即领取按钮
						btnReceiveVisible: false,
						// 优惠券的是否已经使用之类的coupon_list:可使用,used:已使用,be_overdue:已过期
						cateType: 'coupon_list'
					}
				})
			},
			// 格式化的订单提交信息
			cOrderDataSubmitted() {

				const data = {
					card_id: this.cCardActiveItem.id,
					user_name: this.orderForm.user_name,
					mobile: this.orderForm.mobile,
					pay_from: 'cardOrderPay',
					referee_id: this.$store.state.refereeId,
					free_id: this.cCardActiveItem.free_id,
				}
				if (this.cNumberVisible) {
					data.number = +this.orderForm.number
				}
				return data
			},
			// 是否显示追加次数
			cNumberVisible() {
				return this.cCardActiveItem.type == 2
			},
			// 当前总价（前端计算）
			cTotalPrice() {
				if (this.cCardActiveItem.type == 1) {
					return this.cCardActiveItem.price
				}
				if (this.cCardActiveItem.type == 2) {
					if (!this.orderForm.number) {
						return ''
					}
					return (this.cCardActiveItem.price * this.orderForm.number).toFixed(2)
				}
			},
			// 免单数据量及其显不显示
			cShareNum() {
				return {
					visible: !!this.cCardActiveItem.free_id,
					num: this.cCardActiveItem.shareNum,
					avatar: this.cCardActiveItem.shareAvatar,
					nickname: this.cCardActiveItem.shareNickname
				}
			}

		},
		watch: {
			cCardList(val) {
				if (this.cardSelectionValue.length && val && val.length === 1 && this.options.from !== 'free') {
					this.cardSelectionValue = [val[0].id]
				}
			},
			lastUserRes(val) {
				if (!this.orderForm.user_name && val.user_name) {
					this.orderForm.user_name = val.user_name
				}
				if (!this.orderForm.mobile && val.mobile) {
					this.orderForm.mobile = val.mobile
				}
			},
			cardSelectionValue() {
				this.fetchStoreRes()
			}
		},
		methods: {
			toggleShare() {
				this.$refs.shareView.shareswich()
			},
			// 商家列表项点击事件
			handleBusinessItemClick(item) {
				console.log('handleBusinessItemClick', item._source)
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
			payOrder(data = {}) {
				console.log('payOrder', data)
				this.$store.commit('orderPay', data)
				this.$refs.orderPay.onToggleList(() => {
					this.submitting = false
				})
			},
			paySuccess() {
				console.log('paySuccess')
				this.submitting = false
				if (this.options.from === 'free') {
					this.$nextTick(() => {
						uni.showToast({
							icon: 'none',
							title: '购买成功'
						})
					})
					// 跳转到免单活动下单成功页面
					App.navigationTo({
						url: 'pages/subPages/myfreeBill/miandiansuccess?' + App.urlEncode({
							card_id: this.cCardActiveItem.id,
							free_id: this.options.free_id,
							redirectTo: true
						})
					})
					return
				}
				// 跳转到我的卡包首页
				App.navigationTo({
					url: 'pages/subPages/card/list'
				})
			},
			payFail() {
				console.log('payFail')
				this.submitting = false
			},
			// 提交订单按钮点击事件
			async handleBtnConfirmClick() {
				if (this.submitting) {
					return
				}
				if (!this.validateForm()) {
					// 滚动到底部
					uni.pageScrollTo({
						// 一个足够大的数
						scrollTop: 99999
					})
					return
				}
				this.submitting = true
				try {
					this.payOrder(this.cOrderDataSubmitted)
				} catch (e) {
					console.log('handleBtnConfirmClick', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			/**
			 * 校验表单数据
			 * @return {Boolean}
			 */
			validateForm(data = this.cOrderDataSubmitted) {
				if (!data) {
					return false
				}
				if (!data.card_id) {
					uni.showToast({
						icon: 'none',
						title: '请先选择卡包'
					})
					return false
				}
				if (!data.number && this.cNumberVisible) {
					uni.showToast({
						icon: 'none',
						title: '请填次数'
					})
					return false
				}
				if (!data.user_name) {
					uni.showToast({
						icon: 'none',
						title: '请填写姓名'
					})
					return false
				}
				if (!data.mobile) {
					uni.showToast({
						icon: 'none',
						title: '请填写手机号'
					})
					return false
				}
				if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(data.mobile)) {
					uni.showToast({
						icon: 'none',
						title: '手机号码格式不正确'
					})
					return false
				}
				return true
			},
			// 请求订单详情的接口数据
			async fetchOrderDetailsRes() {
				try {
					const res = await App._getP('card.card/cardDetail', {
						card_class_id: this.options.card_class_id,
						card_id: this.options.card_id || '',
						free_id: this.options.free_id || '',
						referee_id: this.options.referee_id || '',
					})
					this.orderDetailsRes = res.data || []
				} catch (e) {
					console.log('fetchOrderDetailsRes', e)
					return Promise.reject(e)
				}
			},
			// 请求上次下单用户信息的接口数据
			async fetchLastUserRes() {
				try {
					const res = await App._getP('card.card/lastOrderInfo')
					this.lastUserRes = res.data || []
				} catch (e) {
					console.log('fetchLastUserRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求商家列表的接口数据
			async fetchStoreRes() {
				try {
					const lat = this.lat
					const lng = this.lng
					const res = await App._getP('card.card/cardBusiness', {
						list_rows: 200,
						card_class_id: this.options.card_class_id,
						card_id: this.cardSelectionValue[0],
						lat,
						lng
					})
					this.storeRes = this.$util.deepGet(res, 'data.data', [])
				} catch (e) {
					console.log('fetchStoreResIfNeeded', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-card-createOrder {
		padding-bottom: 200rpx;
	}

	.page-card-createOrder__section {
		background-color: #fff;
		padding: 20rpx 0;

		&+& {
			margin-top: 20rpx;
		}
	}

	.page-card-createOrder__ad {
		display: block;
		width: 690rpx;
		height: 140rpx;
		margin: 0 auto;
		border-radius: 20rpx;
	}

	.buy-num-card__tip {
		font-size: 20rpx;
		color: #999;

		.iconfont {
			font-size: 28rpx;
			margin-right: 8rpx;
			vertical-align: middle;
		}
	}

	.form-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100rpx;
		line-height: 1;
		font-size: 28rpx;
		color: #333;

		&+& {
			border-top: 1px solid #eee;
		}
	}

	.form-row__input {
		flex: 1;
		text-align: right;

		/deep/ {
			&.is-placeholder {
				color: #999999;
			}
		}
	}

	.page-card-createOrder__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 30rpx;
		background-color: #fff;
	}
	
	.page-card-createOrder__btn-home {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 200rpx;
		height: 90rpx;
		margin-right: 20rpx;
		font-size: 28rpx;
		color: #333;
		border-radius: 9999rpx;
		border: 1px solid #CCCCCC;
		.iconfont {
			margin-right: 10rpx;
			font-size: 28rpx;
		}
	}

	.page-card-createOrder__btn-op {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 90rpx;
		font-size: 28rpx;
		color: #333;
		line-height: 1;
		background-color: #FFD940;
		border-radius: 9999rpx;
	}

	// 分享免单提示
	.share-tip {
		position: absolute;
		left: 50%;
		bottom: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60rpx;
		padding-left: 12rpx;
		padding-right: 28rpx;
		background-color: rgba($color: #000000, $alpha: 0.7);
		border-radius: 9999rpx;
		font-size: 24rpx;
		color: #fff;
		transform: translate(-50%, -10rpx);

		&::after {
			position: absolute;
			left: 50%;
			top: 100%;
			display: block;
			content: "\20";
			width: 0;
			height: 0;
			border-left: 10rpx solid transparent;
			border-right: 10rpx solid transparent;
			border-top: 10rpx solid rgba($color: #000000, $alpha: 0.7);
			transform: translateX(-50%);
		}
	}

	.share-tip_avatar {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
		border-radius: 50%;
	}

	.share-tip__text {
		position: relative;
		white-space: nowrap;

		&+& {
			padding-left: 20rpx;

			&::after {
				position: absolute;
				top: 50%;
				left: 10rpx;
				display: block;
				content: "\20";
				width: 1px;
				height: 20rpx;
				background-color: #828282;
				transform: translateY(-50%);
			}
		}
	}

	.share-tip__nickname {
		max-width: 6em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	// 分享免单提示 end

	// 商家列表弹窗
	.business-wrapper {
		box-sizing: border-box;
		width: 100vw;
		border-radius: 20rpx 20rpx 0 0;
		background-color: #FBFAFC;
	}

	.business-wrapper__header {
		height: 100rpx;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.business-wrapper__title {
		font-size: 32rpx;
		color: #333333;
	}

	.business-wrapper__icon-close {
		position: absolute;
		top: 50%;
		right: 33rpx;
		font-size: 32rpx;
		color: #333333;
		transform: translateY(-50%);
	}
	
	.business-wrapper__scroll {
		max-height: 85vh;
	}
	.business-wrapper__scroll__content {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}

	// 商家列表弹窗 end
</style>
