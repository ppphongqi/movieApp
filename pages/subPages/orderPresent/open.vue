<template>
	<view class="page-open">
		<view v-if="cDetails.nickname" class="app-card">
			<!-- header -->
			<view class="app-flex app-flex--align-center">
				<view v-if="cDetails.status === 0" class="app-flex-item page-open__label-status">
					转赠中...
				</view>
				<view v-else-if="cDetails.status === 2" class="app-flex-item page-open__label-status is-ylq">
					已领取
				</view>
				<view class="app-flex-item f-28 col-3">来自</view>
				<view class="app-flex-item" style="font-size: 0;">
					<image :src="cDetails.avatar" mode="" style="width: 48rpx;height: 48rpx;border-radius: 100%;">
					</image>
				</view>
				<view class="app-flex-item f-28 col-3 f-bold onelist-hidden" style="max-width: 6em;">{{cDetails.nickname}}</view>
				<view class="app-flex-item f-28 col-3" style="margin-left: 0;">的转赠</view>
			</view>
			<view class="f-24 col-3 m-top20">截至使用时间：{{cDetails.deadline}}</view>
			<!-- header end -->
			<!-- list -->
			<NormalOpenList v-if="cDetails.type === 'normal'" :list="cNormalList" @on-btn-details-click="handleBtnDetailsClick"></NormalOpenList>
			<GiftOpenList v-else-if="cDetails.type === 'gift'" :list="cGiftList" @on-btn-details-click="handleBtnDetailsClick"></GiftOpenList>
			<!-- list end -->
			<!-- footer -->
			<button v-if="cDetails.status === 0" class="app-btn-red--block m-top30"
				style="background-color: #FE675E;font-size: 32rpx;font-weight: bold;" @click="handleBtnGoClick">一键领取</button>
			<view v-else-if="cDetails.status === 1" class="page-open__received app-flex app-flex--align-center app-flex--justify-center m-top30">
				<view class="app-flex-item f-28 col-9" style="margin-left: 0;">{{cDetails.statusText}}</view>
			</view>
			<view v-else-if="cDetails.status === 2" class="page-open__received app-flex app-flex--align-center app-flex--justify-center m-top30">
				<view class="app-flex-item f-28 col-9">已被</view>
				<view class="app-flex-item" style="font-size: 0;">
					<image :src="cDetails.recipientAvatar" mode="" style="width: 48rpx;height: 48rpx;border-radius: 100%;">
					</image>
				</view>
				<view class="app-flex-item f-28 col-3 f-bold onelist-hidden" style="max-width: 6em;">{{cDetails.recipientNickname}}</view>
				<view class="app-flex-item f-28 col-9" style="margin-left: 0;">领取</view>
			</view>
			<!-- footer -->
		</view>
		<view class="app-card">
			<view class="app-flex app-flex--justify-center">
				<view class="app-flex-item f-36 col-3 f-bold">-为您推荐-</view>
			</view>
			<view style="margin: 0 -30rpx;">
				<recommend-goods v-if="cDetails.goodsId" :recommendclass="1" :isShowCopyRight="false" :isShowTitle="false" :goodsId="cDetails.goodsId"></recommend-goods>
			</view>
		</view>
		<!-- 详情弹窗 -->
		<OpenPopup v-model="openPopupVisible" :codeItem="openPopupTarget" :type="cDetails.type"></OpenPopup>
		<!-- 详情弹窗 end -->
		<!-- 关注公众号二维码弹窗 -->
		<!-- #ifdef MP-WEIXIN -->
		<popup-view :show="followGzhPopupVisible" type="center" @clickmask="followGzhPopupVisible = false">
			<view class="follow-gzh-sapp-card">
				<view class="follow-gzh-sapp-card__content">
					<image class="follow-gzh-sapp-card__img" :src="getImageRoot('img-follow-wx.png')"></image>
				</view>
				<button class="follow-gzh-sapp-card__btn btn-normal" open-type="contact"
					:send-message-path="cSendMessage.path" :send-message-title="cSendMessage.title"
					:send-message-img="cSendMessage.img" show-message-card>去关注</button>
			</view>
		
		</popup-view>
		<!-- #endif -->
		<!-- 关注公众号二维码弹窗 end -->
		
		<!-- 关注公众号二维码弹窗h5 -->
		<!-- #ifdef H5 -->
		<popup-view :show="followGzhPopupVisible" type="bottom" @clickmask="followGzhPopupVisible = false">
			<view class="follow-gzh-card">
				<view class="follow-gzh-card-content">
					<image class="follow-gzh-card__img-code" :src="detailsRes && detailsRes.wechat_image" />
					<p class="follow-gzh-card__tip">为了领取好友转赠，请先扫码关注公众号。</p>
				</view>
				<view class="follow-gzh-card-footer">
					<button class="btn-normal follow-gzh-card__btn-cancel"
						@click="followGzhPopupVisible = false">取消</button>
				</view>
			</view>
		</popup-view>
		<!-- #endif -->
		<!-- 关注公众号二维码弹窗h5 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import LoadMore from '@/components/template/Loadmore.vue'
	import RecommendGoods from '@/components/template/RecommendGoods.vue'
	import NormalOpenList from './components/NormalOpenList.vue'
	import GiftOpenList from './components/GiftOpenList.vue'
	import OpenPopup from './components/OpenPopup.vue'
	import PopupView from '@/components/template/PopManager.vue'
	
	export default {
		components: {
			NormalOpenList,
			GiftOpenList,
			LoadMore,
			RecommendGoods,
			OpenPopup,
			PopupView
		},
		data() {
			return {
				options: {
					// 转赠id
					d_id: ''
				},
				// 详情弹窗是否显示
				openPopupVisible: false,
				// 详情弹窗的目标
				openPopupTarget: {},
				// 关注公众号二维码弹窗是否显示
				followGzhPopupVisible: false,
				// 详情的接口数据
				detailsRes: {},
			}
		},
		computed: {
			cSendMessage() {
				return {
					path: `pages/subPages/orderPresent/open?d_id=${this.options.d_id}`,
					title: '转赠领取',
					img: this.$util.deepGet(this.detailsRes, 'code_detail.0.image') || ''
				}
			},
			// 格式化的详情数据
			cDetails() {
				let type = ''
				if (this.detailsRes.is_gift == 1) {
					type = 'gift'
				} else if (this.detailsRes.is_gift !== undefined) {
					type = 'normal'
				}
				return {
					// 普通还是礼包
					type,
					// 推荐商品id
					goodsId: this.detailsRes.goods_id,
					avatar: this.detailsRes.from_user_avatar,
					nickname: this.detailsRes.from_user_name,
					deadline: this.detailsRes.deadline || '',
					// 领取状态0=可领取 1=不可领取 2 已被领取
					status: this.detailsRes.button_status,
					// 状态文字
					statusText: this.detailsRes.button_status_text,
					// 领取人昵称
					recipientNickname: this.detailsRes.get_user_nickname,
					// 领取人头像
					recipientAvatar: this.detailsRes.get_user_avatar,
				}
			},
			// 普通列表数据
			cNormalList() {
				if(!this.cDetails.type ==='normal') {
					return []
				}
				const list = this.detailsRes.code_detail || []
				return list.map(item => ({
					id: 'xxx',
					title: item.title,
					image: item.image,
					codeList: item.code,
					// 价值
					price: item.need_pay_price,
					// 划线价
					linePirce: item.value_price,
					storeList: item.store,
					// 礼包详情
					content: item.content,
				}))
			},
			// 礼包列表数据
			cGiftList() {
				if(!this.cDetails.type ==='gift') {
					return []
				}
				const list = this.detailsRes.code_detail || []
				return list.map(item => ({
					id: item.code,
					title: item.title,
					image: item.image,
					code: item.code,
					// 持券仅付
					needPrice: item.need_pay_price,
					// 价值
					price: item.value_price,
					storeList: item.store,
					// 礼包详情
					content: item.content,
				}))
			},
		},
		onLoad(options) {
			this.options = options
		},
		async onShow() {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#F8F8F8",
			});
			try {
				await this.mainMixin_BeforeFetchPageData()
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#F8F8F8",
				});
				await Promise.all([this.fetchDetailsRes()])
				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
				// TODO handle the exception
			}
		},
		methods: {
			// 查看详情按钮点击事件
			handleBtnDetailsClick(item) {
				console.log('handleBtnDetailsClick',item)
				this.openPopupVisible = true
				this.openPopupTarget = item
			},
			// 一键领取点击
			async handleBtnGoClick() {
				// 如果正在请求或者不是以下操作 直接返回
				if(this.handleBtnGoClicking) {
					return 
				}
				// 先检查是否关注了公众号,没有关注的话要提示关注
				if(this.detailsRes.have_in_wechat != 1 &&　this.detailsRes.is_have_in_wechat == 1) {
					this.followGzhPopupVisible = true
					return
				}
				this.handleBtnGoClicking = true
				try{
					// 显示loading
					uni.showLoading({
						title: '请稍候...',
						mask: true
					})
					// 请求接口
					const res = await App._postP('user.order/getDonation',{
						d_id: this.options.d_id,
					})
					// 提示成功
					uni.showToast({
						icon: 'none',
						title: '领取成功'
					})
					// 跳转到成功页面
					App.navigationTo({
						url: `pages/subPages/orderPresent/received`,
						query: {
							goods_id: this.cDetails.goodsId
						}
					});
				} catch(e){
					uni.hideLoading()
					console.log(e)
				}
				this.handleBtnGoClicking = false
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._postP('user.order/showDonation', {
						d_id: this.options.d_id
					})
					this.detailsRes = this.$util.deepGet(res, 'data', {})
					console.log('this.detailsRes', this.detailsRes)
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-open {
		box-sizing: border-box;
		padding-top: 257rpx;
		min-height: 100vh;
		background-color: #FE675E;
		background-image: url(static/images/bg-page-open.png);
		background-repeat: no-repeat;
		background-position: center top;
		background-size: 100% auto;
		padding-bottom: 200rpx;
	}
	// 关注公众号二维码弹窗
	.follow-gzh-card {
		width: 100vw;
		border-radius: 20rpx 20rpx 0 0;
		background-color: #fff;
	}
	
	.follow-gzh-card-content {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 398rpx;
	}
	
	.follow-gzh-card__img-code {
		width: 250rpx;
		height: 250rpx;
	}
	
	.follow-gzh-card-footer {
		box-sizing: 105rpx;
		border-top: 20rpx solid #F8F8F8;
	}
	
	.follow-gzh-card__tip {
		font-size: 28rpx;
		color: #333333;
	}
	
	.follow-gzh-card__btn-cancel {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 85rpx;
		font-weight: bold;
		color: #333333;
		font-size: 32rpx;
	}
	
	// 关注公众号二维码弹窗 end
	// 关注公众号二维码弹窗(小程序)
	.follow-gzh-sapp-card__content {
		box-sizing: border-box;
		width: 530rpx;
		height: 734rpx;
		padding: 30rpx 50rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}
	
	.follow-gzh-sapp-card__img {
		width: 416rpx;
		height: 671rpx;
	}
	
	.follow-gzh-sapp-card__btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 70rpx;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: var(--auxiliary-color, #333);
		font-weight: bold;
		background-color: var(--theme-color, #FFD940);
		border-radius: 10rpx;
	}
	
	// 关注公众号二维码弹窗(小程序) end
	.page-open__label-status {
		width: 210rpx;
		height: 80rpx;
		padding: 20rpx 28rpx 0rpx 20rpx;
		font-size: 28rpx;
		color: #fff;
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
		background-image: url(static/images/bg-zhuanzengzhong.png);
		&.is-ylq {
			background-image: url(static/images/bg-yilingqu.png);
		}
	}
	.page-open__received{
		height: 90rpx;
		background-color: #eee;
		border-radius: 20rpx;
	}
</style>
