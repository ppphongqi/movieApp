<template>
	<view class="page-subscribeWxMessage" :style="themeColor">
		<!-- header -->
		<view class="page-subscribeWxMessag__header">
			<view class="page-subscribeWxMessage__rules-title">温馨提示：</view>
			<view class="page-subscribeWxMessage__rules">
				<view class="page-subscribeWxMessage__rules__item">1、为了您及时接收本程序的消息，请进行手动订阅操作。</view>
				<view class="page-subscribeWxMessage__rules__item">2、订阅后面数字代表可发送次数，点击一次增加一次。</view>
				<view class="page-subscribeWxMessage__rules__item">3、请选择“总是保存以上选择，不再询问”。</view>
			</view>
		</view>
		<!-- header end -->
		<!-- content -->
		<view class="page-subscribeWxMessag__content">
			<!-- 订阅消息列表卡片 -->
			<view v-for="(item,outerIndex) in cData" :key="item.title" class="page-subscribeWxMessag-card">
				<view class="page-subscribeWxMessag-card__title">{{item.title}}</view>
				<!-- 消息列表 -->
				<view class="page-subscribeWxMessag-card__list">
					<view v-for="(listItem,index) in item.data" :key="listItem.scene_desc" class="page-subscribeWxMessag-card__item">
						<view class="page-subscribeWxMessag-card__item__title">{{index+1}}、{{listItem.name}}</view>
						<view class="page-subscribeWxMessag-card__item__btn" @click="handleBtnSubscribe(listItem,outerIndex,index)">订阅{{listItem.numberStr}}</view>
					</view>
				</view>
				<!-- 消息列表 end -->
			</view>
			<!-- 订阅消息列表卡片 -->
		</view>
		<!-- content end -->
		<!-- 悬浮导航 -->
		<view class="page-subscribeWxMessage-nav">
			<view class="page-subscribeWxMessage-nav__item" @click="handleNavItemClick({url: 'pages/mainPages/index/index'})">
				<!-- <image class="page-subscribeWxMessage-nav__img" src="/static/images/icon-home--333.png"></image> -->
				<view class="iconfont icon-home1"></view>
				<text class="page-subscribeWxMessage-nav__text">首页</text>
			</view>
			<view v-if="cServicePopupCanShow" class="page-subscribeWxMessage-nav__item" @click="servicePopupVisible = true">
				
				<!-- <image class="page-subscribeWxMessage-nav__img" src="/static/images/icon-kefu--333.png"></image> -->
				<view class="iconfont icon-kefu"></view>
				<text class="page-subscribeWxMessage-nav__text">客服</text>
			</view>
		</view>
		<!-- 悬浮导航 end -->
		<!-- 联系客服弹窗 -->
		<popup-view :show="servicePopupVisible && cServicePopupCanShow">
			<block v-if="servicePopupVisible">
				<view class="shade-box">
					<view class="invite-bg m-btm40" :style="{'background-image':getImageRoot('45.png','url')}">
						<view class="invite-textbox p-r">
							<view class="invite-title f-44 col-3 t-c m-btm40">添加客服</view>
							<view class="commun-detail" style="margin-top: 80rpx;">
								<block v-if="!!serviceRes['kf_phone']">
									<view class="commun-bg-style bor-radius-10upx b-f commun-bg-style-top dis-flex flex-y-center flex-x-between p-left-right-30">
										<view class="commun-left dis-flex flex-y-center">
											<image src="/static/images/merchant/mobile.png" mode="" class="commun-mobile"></image>
											<view class="col-3 f-24">{{serviceRes['kf_phone']}}</view>
										</view>
										<view class="commun-right commun-right-mobile f-24 col-3 t-c main-bg-color auxiliary-color" @click="commun('mobile',serviceRes['kf_phone'])">拨号</view>
									</view>
								</block>
								<block v-if="!!serviceRes['kf_wxid']">
									<view class="commun-bg-style bor-radius-10upx b-f dis-flex flex-y-center flex-x-between p-left-right-30">
										<view class="commun-left dis-flex">
											<image src="/static/images/merchant/wx.png" mode="" class="commun-weixin"></image>
											<view class="col-3 f-24">{{serviceRes['kf_wxid']}}</view>
										</view>
										<view class="commun-right commun-right-copy f-24 col-f t-c" @click="commun('wx',serviceRes['kf_wxid'])">复制</view>
									</view>
								</block>
							</view>
						</view>.
					</view>
					<view class="shade-close t-c">
						<text class="iconfont icon-roundclose shade-close-icon" @click="servicePopupVisible = false"></text>
					</view>
				</view>
			</block>
		</popup-view>
		<!-- 联系客服弹窗 end -->
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import PopupView from "@/components/template/PopManager.vue"
	import {
		wxRequestSubscribeMessageX
	} from '@/common/js/wxPromise.js'
	export default {
		components: {
			PopupView
		},
		data() {
			return {
				// 全局配置的接口数据
				settingRes: {},
				// 订阅消息列表的接口数据
				listRes: [],
				// 客服信息的接口数据
				serviceRes: {},
				// 联系客服弹窗是否显示
				servicePopupVisible: false
			}

		},
		computed: {
			// 格式化的订阅消息列表
			cData() {
				return (this.listRes || []).map(item => ({
					title: item.title,
					data: (item.data || []).map(listItem => {
						// 处理要显示的订阅数
						let numberStr = listItem.number || 0
						numberStr = numberStr > 999 ? 999 : numberStr
						numberStr = numberStr > 0 ? '+' + numberStr : ''
						return {
							...listItem,
							// 不超过999
							numberStr
						}
					})
				}))
			},
			// 客户信息是否可以显示
			cServicePopupCanShow() {
				return +this.$util.deepGet(this.settingRes, 'apply_open') === 1
			}
		},
		async mounted() {
			await this.fetchSettingRes()
			this.fetchListRes()
			this.fetchServiceRes()
		},
		methods: {
			// 抄过来的方法
			commun(type, val) {
				let _this = this;
				switch (type) {
					case 'mobile':
						uni.makePhoneCall({
							phoneNumber: val //仅为示例
						});
						break;
					case 'wx':
						App.copyTextHandle(val);
						break;
				}
			},
			/**
			 * 订阅按钮点击事件
			 */
			async handleBtnSubscribe(item, outerIndex, index) {
				if(this.beingSubscribe) {
					return
				}
				this.beingSubscribe = true
				if (item.number >= 999) {
					uni.showToast({
						icon: 'none',
						title: '已到达该消息最大订阅数'
					})
					this.beingSubscribe = false
					return 
				}
				uni.showLoading({
					mask: true,
					title: '请稍后'
				})
				try {
					// 获取模板id
					const tmplIdsRes = await App._postP('wxapp.sub/getIds', {
						op: item.scene_desc
					})
					const tmplIds = this.$util.deepGet(tmplIdsRes, 'data') || []
					// 订阅消息
					await wxRequestSubscribeMessageX({
						tmplIds,
						showMessage: false
					})
					uni.showLoading({
						mask: true,
						title: '请稍后'
					})
					// 订阅成功上报数据
					await App._postP('Subscribe/editSubscribeNum', {
						type: item.scene_desc
					})
					uni.showLoading({
						mask: true,
						title: '请稍后'
					})
					// 刷新列表数据
					this.fetchListRes()
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: '订阅成功'
					})
				} catch (e) {
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: '取消订阅或订阅失败，请稍后再试'
					})
					console.log('handleBtnSubscribe', e)
					//TODO handle the exception
				}
				console.log('handleBtnSubscribe', item)
				this.beingSubscribe = false
			},
			/**
			 *  导航按钮的点击事件
			 */
			handleNavItemClick({
				url = ''
			}) {
				App.navigationTo({
					url
				});
			},
			// 获取全局配置
			async fetchSettingRes() {
				try{
					const res = await App._postP('setting/index')
					this.settingRes = this.$util.deepGet(res, 'data') || []
				}catch(e){
					console.log('fetchSettingRes',e)
				}
			},
			/**
			 * 请求订阅消息的接口数据
			 */
			async fetchListRes() {
				try {
					const res = await App._postP('Subscribe/getUserSubscribe')
					this.listRes = this.$util.deepGet(res, 'data') || []
					console.log('this.listRes', this.listRes)
				} catch (e) {
					console.log(112231231212, e)
					//TODO handle the exception
				}
			},
			// 获取客服信息
			async fetchServiceRes() {
				// 判断是否需要请求客服信息先
				if(!this.cServicePopupCanShow) return
				try {
					const res = await App._postP('Live/getBusinessSetting')
					this.serviceRes = this.$util.deepGet(res, 'data') || []
				} catch (e) {
					console.log(112231231212, e)
					//TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-subscribeWxMessage {
		background-color: #F8F8F8;
		padding-bottom: 220rpx;
	}

	// header
	.page-subscribeWxMessag__header {
		background-color: var(--theme-color);
		color: var(--auxiliary-color);
		padding-top: 30rpx;
		padding-bottom: 26rpx;
	}

	.page-subscribeWxMessage__rules {
		box-sizing: border-box;
		padding: 0 30rpx;
		padding-top: 17rpx;
	}

	.page-subscribeWxMessage__rules-title {
		font-size: 32rpx;
		text-align: center;
	}

	.page-subscribeWxMessage__rules__item {
		font-size: 26rpx;
		line-height: 1.6;
	}

	// header end

	// content
	.page-subscribeWxMessag__content {
		padding: 0 30rpx;
		background-image: linear-gradient(to right, var(--theme-color), var(--theme-color));
		background-repeat: no-repeat;
		background-size: 100% 116rpx;
	}

	.page-subscribeWxMessag-card {
		color: #333;
		background-color: #fff;
		border-radius: 10rpx;

		&+& {
			margin-top: 20rpx;
		}
	}

	.page-subscribeWxMessag-card__title {
		box-sizing: border-box;
		height: 90rpx;
		padding: 0 30rpx;
		line-height: 90rpx;
		font-weight: bold;
		border-bottom: 1px solid #EEEEEE;
	}

	.page-subscribeWxMessag-card__list {
		padding: 0 30rpx;
	}

	.page-subscribeWxMessag-card__item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		font-size: 28rpx;
		border-bottom: 1px solid #EEEEEE;
	}

	.page-subscribeWxMessag-card__item__title {
		box-sizing: border-box;
		padding-right: 16rpx;
	}

	.page-subscribeWxMessag-card__item__btn {
		flex-shrink: 0;
		box-sizing: border-box;
		width: 128rpx;
		height: 50rpx;
		line-height: 50rpx;
		background-color: var(--theme-color);
		color: var(--auxiliary-color);
		font-size: 24rpx;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	// content end

	// 悬浮导航
	.page-subscribeWxMessage-nav {
		display: flex;
		align-items: center;
		position: fixed;
		left: 30rpx;
		bottom: 40rpx;
	}

	.page-subscribeWxMessage-nav__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100rpx;
		height: 100rpx;
		background-color: var(--theme-color);
		color: var(--auxiliary-color,#333);
		border-radius: 100%;

		&+& {
			margin-left: 30rpx;
		}
	}

	.page-subscribeWxMessage-nav__img {
		height: 40rpx;
		width: 40rpx;
	}

	.page-subscribeWxMessage-nav__text {
		font-size: 24rpx;
	}

	// 悬浮导航 end
	// 客服弹窗的样式
	.shade-box {
		margin-top: -200upx;
	}

	.invite-bg {
		width: 550upx;
		height: 670upx;
		background-size: 540upx 670upx;
		background-repeat: no-repeat;
	}

	.invite-textbox {
		top: 260upx;
	}

	.invite-text {
		padding: 0 35upx 0 65upx;
	}

	.commun-bg-style {
		width: 428upx;
		height: 80upx;
		margin: 0 auto;
	}

	.commun-bg-style-top {
		margin: 0 auto 20upx !important;
	}

	.commun-left .commun-mobile {
		width: 28upx;
		height: 28upx;
		margin-right: 14upx;
	}

	.commun-left .commun-weixin {
		width: 32upx;
		height: 28upx;
		margin-right: 14upx;
	}

	.commun-right {
		width: 96upx;
		height: 44upx;
		line-height: 44upx;
		border-radius: 6upx;
	}

	.commun-right.commun-right-mobile {
		background-color: #FFD940;
	}

	.commun-right.commun-right-copy {
		background-color: #10CE50;
	}

	.shade-close-icon {
		font-size: 44upx !important;
		color: #FFFFFF !important;
	}

	// 客服弹窗的样式
</style>
