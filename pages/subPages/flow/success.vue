<template>
	<view :style="themeColor">
		<lead-attention></lead-attention>
		<view class="pay-success b-f dis-flex flex-dir-column flex-x-center flex-y-center">
			<!-- <view class="success-image" :style="{'background-image':getImageRoot('2.png','url')}"><text class="col-3 f-36">支付成功</text></view>
			<view class="success-price col-3">{{settingData.currency}}{{options.pay_price}}</view> -->
			<view class="iconfont icon-chenggong"></view>
			<view class="col-3 f-32 m-top40">购买成功</view>
			<view class="success-btns dis-flex flex-x-center border-line border-bottom">
				<button class="return-btn" @click="backHome(options.order_id)">返回首页</button>
				<button class="order-btn main-bg-color auxiliary-color" @click="orderInfo(options.order_id)" v-if="isReservation==1 && isPreShopping==2">我要预约</button>
				<button class="order-btn main-bg-color auxiliary-color" @click="orderInfo(options.order_id)" v-else>查看订单</button>
			</view>
			<!-- 社群活动 -->
			<block v-if="community">
				<view class="goods-community dis-flex flex-x-between flex-y-center">
					<view class="community-user dis-flex flex-y-center flex-box ">
						<image :src="community.headimg && community.headimg.length > 0 && !!community.headimg[0] ? community.headimg[0].file_path : '' "
						 class="community-user-img"></image>
						<view class="community-user-info flex-box">
							<view class="community-user-name col-0 f-28">{{community.title}}</view>
							<view class="community-user-des f-24 col-9 onelist-hidden">{{community.des}}</view>
						</view>
					</view>
					<view class="community-btn">
						<button class="community-add f-24 col-f" @click="showCommunity = true">添加</button>
					</view>
				</view>

				<!-- 社群弹窗  -->
				<!-- #ifdef H5 -->
				<popup-layer :showClose="true" :show="showCommunity" topTitle="关注提醒" :wechat="community.wechat" :communityType="community.community_type"
				 :phone="community.mobile" :imgSrc="community.qrcodeimg && community.qrcodeimg.length > 0 && !!community.qrcodeimg[0]?community.qrcodeimg[0].file_path:''"
				 :isShowLongPressBtn="true" @closePopupBtn="showCommunity=false">
				</popup-layer>
				<!-- #endif -->

				<!-- #ifdef MP -->
				<popup-layer :showClose="true" :show="showCommunity" topTitle="联系客服" :wechat="community.wechat" :communityType="community.community_type"
				 :phone="community.mobile" :imgSrc="getImageRoot('91.png')" footBtnText='去回复' @closePopupBtn="showCommunity=false">
					<view v-if="appClientType ==='2'">
						有任何疑问，点击“<text class="col-m">去回复</text>”发送“<text class="col-m">{{community.id}}</text>”,即可添加客服微信
					</view>
				</popup-layer>
				<!-- #endif -->
				<!-- 社群弹窗 end -->

				<!-- 社群弹窗（废弃） -->
				<popup-view style="display: none;" :show="showCommunity" type="center" @clickmask="showCommunity = false">
					<view class="community-detail b-f t-c">
						<view class="community-header f-w f-44 p-r"><text class="community-header-text p-r">联系客服</text></view>
						<!-- #ifdef MP-WEIXIN -->
						<view class="community-body f-26 col-3" v-if="appClientType ==='2'">
							有任何疑问，点击“<text class="col-m">去回复</text>”发送“<text class="col-m">{{community.id}}</text>”,即可添加客服微信
						</view>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<!-- v-if="appClientType === '4'" -->
						<view class="community-body">
							<image :src="community.qrcodeimg && community.qrcodeimg.length > 0 && !!community.qrcodeimg[0]?community.qrcodeimg[0].file_path:''"
							 class="community-qrcodeimg"></image>
							<view class="community-toreply f-26 col-3">长按识别二维码</view>
						</view>
						<!-- #endif -->
						<view class="community-phone dis-flex flex-y-center flex-x-between">
							<view class="community-number dis-flex flex-y-center">
								<image src="/static/images/goods/community.png" class="community-number-icon"></image>
								<view class="f-24 col-3">{{community.mobile}}</view>
							</view>
							<view class="community-bdial f-24 col-3" @click="callPhone(community.mobile)">拨号</view>
						</view>
						<button class="community-reply f-24 col-3" open-type="contact" v-if="appClientType === '2'">去回复</button>
					</view>
				</popup-view>
			</block>
			<!-- 社群活动 end -->
			<!-- 支付营销 -->
			<view class="marketing-section">
				<!-- 支付营销-轮播 -->
				<view v-if="cSwiperList && cSwiperList.length" class="swiper-wrapper">
					<u-swiper :current="swiperIndex" :autoplay="false" :list="cSwiperList" height="180" border-radius="20" @change="handleSwiperChange" @click="handleSwiperClick"></u-swiper>
				</view>
				<!-- 支付营销-轮播 end -->
				<!-- 支付营销-商品 -->
				<goods-list v-if="[1,2,3,6,7].includes(cSwiperType)" :list="cSwiperData" @on-item-click="handleGoodsItemClick" />
				<!-- 支付营销-商品 end -->
				<!-- 支付营销-抽奖 -->
				<luck-draw-list v-else-if="[4].includes(cSwiperType)" :list="cSwiperData" @on-item-click="handleLuckItemClick" />
				<!-- 支付营销-抽奖 end -->
				<!-- 支付营销-卡包 -->
				<card-bag-list v-else-if="[5].includes(cSwiperType)" :list="cSwiperData" @on-item-click="handleCardItemClick" />
				<!-- 支付营销-卡包 end -->
				<!-- 支付营销-本次支付可获得 -->
				<reward-list v-if="cRewardList && cRewardList.length" :list="cRewardList" @on-btn-wx-share-click="handleBtnWxShareClick"
				 @on-btn-h5-share-click="handleBtnH5ShareClick" @on-btn-receive-click="handleBtnReceiveClick" />
				<!-- 支付营销-本次支付可获得 end -->
			</view>
			<!-- 支付营销 end -->
			<view class="recommend-goods" v-if="options.goods_id">
				<recommend-goods :goods-id="options.goods_id"></recommend-goods>
			</view>
		</view>
		<!-- H5分享蒙层 -->
		<!-- #ifdef H5 -->
		<share-guide ref="shareGuide"></share-guide>
		<!-- #endif -->
		<!-- H5分享蒙层 end -->
		<!-- 支付数据正在请求弹窗 -->
		<popup-view :show="fetchingPopupVisible" type="center" :overlay="false">
			<view class="toast-card">
				<image class="toast-card__loading" src="./static/images/icon-loading.png"></image>
				<view class="toast-card__text">支付信息查询中...</view>
			</view>
		</popup-view>
		<!-- 支付数据正在请求弹窗 end -->
	</view>
</template>

<script>
	import RecommendGoods from "@/components/template/RecommendGoods.vue"
	import LeadAttention from "@/components/template/LeadAttention.vue"
	import PopupView from "@/components/template/PopManager.vue"
	import App from "@/common/js/app.js"
	import PopupLayer from "@/components/template/PopLayer.vue"
	import RewardList from './components/RewardList.vue'
	import CardBagList from './components/CardBagList.vue'
	import LuckDrawList from './components/LuckDrawList.vue'
	import GoodsList from './components/GoodsList.vue'
	import pageShareMixin from "@/common/js/pageShareMixin.js"
	export default {
		mixins: [pageShareMixin],
		data() {
			return {
				options: {},
				showCommunity: false,
				community: {},
				// 支付营销的接口数据
				marketingRes: {},
				// 当前轮播图的index
				swiperIndex: 0,
				// 当前的分享项
				shareActiveItem: {},
				pageShareMixin_usePromise: true,
				fetchingPopupVisible: false
			};
		},
		components: {
			RecommendGoods,
			PopupView,
			LeadAttention,
			PopupLayer,
			RewardList,
			CardBagList,
			LuckDrawList,
			GoodsList,
		},
		computed: {
			isReservation() {

				return this.options.is_reservation
			},
			isPreShopping() {
				return this.options.isPreShopping
			},
			// 支付营销-轮播数据
			cSwiperList() {
				const data = this.$util.deepGet(this.marketingRes, 'relation', [])
				// return [{
				// 		id: 'swiper1',
				// 		image: 'https://via.placeholder.com/690x180/2a9ff6/fffffff'
				// 	}, {
				// 		id: 'swiper2',
				// 		image: 'https://via.placeholder.com/690x180/2a9ff6/fffffff'
				// 	},
				// 	{
				// 		id: 'swiper3',
				// 		image: 'https://via.placeholder.com/690x180/2a9ff6/fffffff'
				// 	}
				// ]
				return data.map(item => ({
					id: item.relation_type,
					// 1:秒杀，2：拼团，3：砍价，4：抽奖，5：卡包，6：礼包，7：套餐，8：其他
					type: item.relation_type,
					image: item.relation_picture,
					url: item.relation_url,
					data: item.data
				}))
			},
			// 当前轮播对应的type
			cSwiperType() {
				return +this.$util.deepGet(this.cSwiperList, `${this.swiperIndex}.type`, '')
			},
			// 当前轮播对应的列表数据
			cSwiperData() {
				const data = this.$util.deepGet(this.cSwiperList, `${this.swiperIndex}.data`, []) || []
				// 1:秒杀，2：拼团，3：砍价，4：抽奖，5：卡包，6：礼包，7：套餐，8：其他
				const type = this.cSwiperType
				if ([1, 2, 3, 6, 7].includes(type)) {
					return data.map(item => {
						let price = ''
						let priceLine = ''
						if (type === 1) {
							price = item.price
							priceLine = item.old_price
						} else if (type === 2) {
							price = item.groups_price
							priceLine = item.original_price
						} else if (type === 3) {
							price = item.bargain_price
							priceLine = item.goods_price
						} else if (type === 6) {
							price = item.goods_price
							priceLine = 10
						} else if (type === 7) {
							price = item.goods_price
							priceLine = item.line_price
						}
						return {
							_source: item,
							id: item.goods_id,
							// 类型 0：秒杀，1：团购，2：砍价，3：礼包，4：套餐
							type: this.cSwiperType,
							// 商品图片
							imgUrl: item.file || this.$util.deepGet(item, 'image.0.file_path', '') || this.$util.deepGet(item,
								'image.file_path', ''),
							// 标题
							title: item.goods_name,
							// 售价
							price,
							// 划线价
							priceLine,
							// 团购人数
							groupNum: item.group_number || '',
							// 秒杀结束时间
							endTime: item.end_time,
							// 礼包共几家店铺可用
							giftBusinessNum: 8
						}
					})
				} else if ([5].includes(type)) {
					return data.map(item => ({
						id: item.card_class_id,
						title: item.alias_title,
						desc: item.name,
						bgUrl: this.$util.deepGet(item, 'image.0.file_path', '')
					}))
				} else if ([4].includes(type)) {
					return data.map(item => ({
						_source: item,
						id: item.luck_id,
						// 商品图片
						imgUrl: item.image,
						// 标签文字
						label: '抽奖',
						// 标题
						title: item.luck_title,
						// 参与抽奖人数
						num: item.num || 0,
						// 期数
						periods: item.period_id
					}))
				}
				return []
			},
			// 支付营销-奖励数据
			cRewardList() {
				const data = this.$util.deepGet(this.marketingRes, 'reward', [])
				// return [{
				// 	id: 'reward1',
				// 	title: '43元购物补贴',
				// 	desc: '实物商品通用',
				// 	btnText: '领取',
				// 	btnClass: 'is-disabled',
				// 	disabled: false
				// }]
				return data.map(item => {
					return {
						id: item.reward_type,
						title: item.title,
						// 1:分享，2：领取，3：已领取
						btnType: +item.result,
						_source: item
					}
				})
			}

		},
		beforeCreate() {

		},
		onLoad(options) {
			this.options = options;
			let community = uni.getStorageSync("community");
			if (!!community && !!community[options.goods_id]) {
				this.community = community[options.goods_id];
			} else {
				this.community = null
			}
		},
		onUnload() {
			if (this.community) {
				uni.removeStorageSync("community");
			}
		},
		async onShow() {
			// 20201126注释掉 不需要了
			// this.selectStatus()
			try{
				if(!this.marketingRes.id) {
					this.fetchingPopupVisible = true
					clearTimeout(this.fetchingPopupTimer)
					this.fetchingPopupTimer = setTimeout(()=>{
						this.fetchingPopupVisible = false
					},3000)
					uni.$once('beforeDestroy', ()=>{clearTimeout(this.fetchingPopupTimer)})
				}
				await this.fetchMarketingRes().catch(() => {})
			}catch(e){
				//TODO handle the exception
			}
			this.fetchingPopupVisible = false
		},
		methods: {
			// 点击了分享需要执行的事件
			pageShareMixin_afterShare() {
				console.log('点击了分享需要执行的事件',this.shareActiveItem)
				const item = this.shareActiveItem
				App._postP('paymarketing.Index/isShare',{
					order_id: this.options.order_id,
					reward_type:  item.id,
					referee_id: this.globalSaveRefereeId
				})
			},
			// 轮播图点击事件
			handleSwiperClick(index) {
				this.navigationTo(this.cSwiperList[this.swiperIndex].url)
			},
			// 商品列表点击事件
			handleGoodsItemClick(item) {
				App.navigationTo({
					url: 'pages/subPages/goods/index/index?'+App.urlEncode({
						goods_id: item.id
					})
				})
			},
			// 卡包列表点击事件
			handleCardItemClick(item) {
				App.navigationTo({
					url: 'pages/subPages/card/createOrder?'+App.urlEncode({
						card_class_id: item.id
					})
				})
			},
			// 抽奖列表点击事件
			handleLuckItemClick(item) {
				App.navigationTo({
					url: 'pages/subPages/drawlotter/index/index?'+App.urlEncode({
						luck_id: item.id,
						period_id: item.periods
					})
				})
			},
			// 领取按钮点击事件
			async handleBtnReceiveClick(item, index) {
				if (this.receiving) return
				this.receiving = true
				try {
					uni.showLoading({
						title: '正在领取中...'
					})
					await App._postP('paymarketing.Index/receiveRecord', {
						id: this.marketingRes.id,
						order_id: this.options.order_id,
						reward_type: item.id
					})
					await this.fetchMarketingRes()
					uni.showToast({
						icon: 'none',
						title: '领取成功'
					})
				} catch (e) {
					//TODO handle the exception
					console.log('handleBtnReceiveClick', e)
				}
				this.receiving = false
			},
			// H5分享
			handleBtnH5ShareClick(item) {
				this.shareActiveItem = item
				let pagePaymentSuccessfulPage = 'pages/subPages/flow/success?' + App.urlEncode(this.options)
				pagePaymentSuccessfulPage = encodeURIComponent(encodeURIComponent(pagePaymentSuccessfulPage))
				this.shareData = this.pageShareMixin_createShareData({
					url: '/pages/subPages/flow/shareMiddle',
					query: {
						order_id: this.options.order_id,
						goods_id: this.marketingRes.goods_id,
						pagePaymentSuccessfulPage,
						reward_type: item.id
					},
					title: this.marketingRes.title,
					desc: this.marketingRes.describe,
					imgUrl: this.$util.deepGet(this.marketingRes, 'image.0.file_path', '')
				})
				this.pageShareMixin_openShareGuideInH5()
			},
			// 微信分享按钮点击事件
			handleBtnWxShareClick(item) {
				this.shareActiveItem = item
				let pagePaymentSuccessfulPage = 'pages/subPages/flow/shareMiddle?' + App.urlEncode(this.options)
				pagePaymentSuccessfulPage = encodeURIComponent(encodeURIComponent(pagePaymentSuccessfulPage))
				this.shareData = this.pageShareMixin_createShareData({
					url: '/pages/subPages/flow/shareMiddle',
					query: {
						order_id: this.options.order_id,
						goods_id: this.marketingRes.goods_id,
						pagePaymentSuccessfulPage,
						reward_type: item.id
					},
					title: this.marketingRes.title,
					desc: this.marketingRes.describe,
					imgUrl: this.$util.deepGet(this.marketingRes, 'image.0.file_path', '')
				})
			},
			// 轮播图点击事件
			handleSwiperChange(index) {
				this.swiperIndex = index
			},
			backHome(order_id = "") {
				let url = +this.options.cgp === 1 ? "/pages/subPages/cgp/diypage/index" : "/pages/mainPages/index/index";
				if (this.appClientType === "3" || this.appClientType === "4") {
					url += `?&i=${App.getUniacid()}`;
				}
				App.saveFormId("success", {
					order_id
				})
				uni.reLaunch({
					url
				});
			},
			orderInfo(order_id) {
				let uniacid = App.getUniacid(),
					isUndefined = order_id === 'undefined' ? "" : order_id,
					isCgp = +this.options.cgp === 1 ? true : false,
					orderUrl = ''
				if (isCgp) {
					orderUrl = isUndefined ?
						"/pages/mainPages/order/detail?order_id=" + this.options.order_id + "&i=" + uniacid :
						"/pages/subPages/cgp/order/index?type=delivery";
				} else {
					orderUrl = isUndefined ?
						"/pages/mainPages/order/detail?order_id=" + this.options.order_id + "&i=" + uniacid :
						"/pages/mainPages/order/index?type=delivery";
				}
				App.saveFormId("success", {
					order_id
				})
				uni.redirectTo({
					url: orderUrl
				})
			},
			/**
			 * 社群显示
			 */
			communityShow() {
				this.showCommunity = !this.showCommunity;
			},
			/**
			 * 社群拨打电话
			 */
			callPhone(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber: String(phoneNumber)
				})
			},
			selectStatus() {
				App._post_form('user.order/selfCheckOrder', {}, res => {

				})
			},
			// 请求支付营销的接口数据
			async fetchMarketingRes() {
				try {
					const res = await App._getP('paymarketing.Index/getWebPayMarketing', {
						order_id: this.options.order_id
					})
					this.marketingRes = res.data
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.recommend-goods {
		width: 100%;
	}

	.success-image {
		width: 100%;
		height: 414upx;
		background-size: cover;
		background-repeat: no-repeat;
		padding-bottom: 18upx;
		margin-top: 20upx;
		position: relative;
	}

	.success-image text {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 32upx;
		text-align: center;
		font-weight: 400;
	}

	.success-price {
		font-size: 50upx;
		padding-bottom: 40upx;
		text-align: center;
		background: #FFFFFF;
	}

	.success-btns {
		background: #FFFFFF;
		padding-bottom: 36upx;
		margin: 70rpx 30upx 0;
	}

	.success-btns button {
		width: 250upx;
		height: 75upx;
		font-size: 30upx;
		line-height: 74upx;
		background: #FFFFFF;
		color: #333333;
		border-radius: 37upx;
		margin: 0 20upx;
	}

	.success-btns .return-btn {
		border: 1upx solid #CCCCCC;
	}

	.success-btns button.order-btn {
		color: #333333;
		background: #FCD754;
	}

	.icon-chenggong {
		width: 1em;
		height: 1em;
		line-height: 1em;
		font-size: 110rpx;
		margin-top: 80rpx;
		color: #74D588;
	}

	/* 社群 */
	.goods-community {
		width: calc(100% - 60rpx);
		margin: 30rpx 30rpx 20rpx;
		border-radius: 10rpx;
		padding: 30rpx;
		box-sizing: border-box;
		box-shadow: 0 0 12px rgba(221, 221, 221, 0.5);
	}

	.community-user .community-user-img {
		width: 68rpx;
		height: 68rpx;
		display: block;
		margin-right: 20rpx;
		border-radius: 50%;
	}

	.community-add {
		width: 110rpx;
		height: 54rpx;
		line-height: 54rpx;
		background-color: #2AC418;
		border-radius: 10rpx;
		font-size: 24rpx;
	}

	.community-detail {
		border-radius: 20rpx;
		overflow: hidden;
	}

	.community-detail .community-header {
		width: 70vw;
		height: 120rpx;
		line-height: 120rpx;
	}

	.community-detail .community-header .community-header-text {
		z-index: 2;
	}

	.community-detail .community-header::after {
		content: " ";
		position: absolute;
		top: -160rpx;
		left: -25%;
		width: 150%;
		height: 280rpx;
		border-radius: 60%;
		background: #FFD940;
		background: var(--theme-color);
		z-index: 1;
	}

	.community-detail .community-body {
		padding: 50rpx;
	}

	.community-detail .community-phone {
		height: 80rpx;
		line-height: 80rpx;
		margin: 0 30rpx 30rpx;
		padding: 0 20rpx;
		border-radius: 20rpx;
		background: rgba(255, 217, 64, .2);
	}

	.community-detail .community-number .community-number-icon {
		width: 30rpx;
		height: 30rpx;
		display: block;
		margin-right: 15rpx;
	}

	.community-detail .community-bdial {
		width: 96rpx;
		height: 52rpx;
		line-height: 52rpx;
		background: #FFD941;
		border-radius: 10rpx;
	}

	.community-detail .community-reply {
		width: 200rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: #FFD941;
		border-radius: 35rpx;
		margin: 0 auto 30rpx;
	}

	.community-detail .community-qrcodeimg {
		width: 366rpx;
		height: 366rpx;
		display: block;
		margin: 0 auto 30rpx;
	}

	// 支付营销-轮播
	.swiper-wrapper {
		width: 690rpx;
		margin: 30rpx auto;
	}

	// 支付营销-轮播 end
	// 支付数据正在请求弹窗
	.toast-card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 300rpx;
		padding: 40rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}
	.toast-card__loading {
		width: 80rpx;
		height: 80rpx;
		animation: loading 2s infinite linear;
	}
	.toast-card__text {
		margin-top: 30rpx;
		font-size: 28rpx;
		color: #333;
	}
	@keyframes loading {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	
	// 支付数据正在请求弹窗 end
</style>
