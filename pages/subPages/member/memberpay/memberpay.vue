<template>
	<view class="padding-box m-top20" :style="themeColor">
		<block v-if="!isDealer">
			<view class="header m-btm20" v-if="memberInfo">
				<!-- :style="{'background-image':'url('++')'}" -->
				<view class="header-main" :style="{'background-image':memberInfo.is_member?(memberSet.image_second.length>0?'url('+memberSet.image_second[0]['file_path']+')':getImageRoot('27.png','url')):(memberSet.image_first.length>0?'url('+memberSet.image_first[0]['file_path']+')':getImageRoot('26.png','url'))}">
					<view class="member-number col-98 f-24" v-if="memberInfo.is_member">VIP：
						<text>{{memberInfo.card_number}}</text>
					</view>
					<view class="member-msg dis-flex flex-x-between">
						<view class="member-user-msg dis-flex flex-y-center">
							<image :src="memberInfo.avatarUrl" mode="" class="member-avatar" :class="memberInfo.is_member?'ady-member-avatar-bor':'not-member-avatar-bor'"></image>
							<view>
								<view class="user-nickname f-30" :class="memberInfo.is_member?'col-f':'col-3'">{{memberInfo.nickName}}
									<image :src="memberInfo.is_member?'/static/images/member/ady-member.png':'/static/images/member/not-member.png'"
									 mode="" class="member-logo"></image>
								</view>
								<view class="member-dge-price f-24 col-9" v-if="!memberInfo.is_member">{{!!memberSet.card_title?memberSet.card_title:'会员卡'}}仅售¥{{memberSet.price_min}}</view>
								<view class="member-dge-price f-24 col-f" v-else>{{memberInfo.card_end_time}}到期</view>
							</view>
						</view>
						<view class="member-people" v-if="!memberInfo.is_member">
							<view class="f-24 col-9">已加入会员</view>
							<view class="f-24 col-9 t-r"><text class="col-917952">{{memberSet.number}}</text>人</view>
						</view>
					</view>
					<view class="redeem-code col-9 f-24 t-c" v-if="memberInfo && !memberInfo.is_member && memberSet.is_cdkey==='1'"
					 @click="useCode">
						使用激活码兑换
						<BindMobileButton v-if="memberInfo.mobile==='0'|| memberInfo.mobile===''" @onBindSuccess="bindMobile($event,'code')"></BindMobileButton>
					</view>
				</view>
				<!-- <image :src="imageRoot +'31.png'" mode="widthFix" style="width:100%"></image> -->
				<view class="tab-bar b-f">
					<image :src="memberSet.image_third.length>0?memberSet.image_third[0]['file_path']: getImageRoot('31.png')" mode="widthFix"
					 style="width: 100%;"></image>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="p-r">
				<image class="header-img" :src="settingData && settingData.dealer_vip_image || getImageRoot('67.png')"></image>
				<!-- <view class="header-img-text">成为{{dealerDiyFont.fxs}}</view> -->
			</view>
		</block>
		<view class="section m-btm20">
			<view class="member-Tabbar">
				<view class="title col-3 f-32 f-w m-btm36">开通类型</view>
				<view class="member-list">
					<view class="p-r m-btm36" v-for="(couponlist_item,index) in cardList" :key="index">
						<!-- 卡 -->
						<view class="member-items b-f dis-flex flex-y-center flex-x-between" :class="couponlist_item.card_id===card_id?'select':'not-select'"
						 @click="selectCard(couponlist_item.card_id)">
							<view class="member-items-select" v-if="couponlist_item.card_id===card_id">
								<image src="/static/images/select.png"></image>
							</view>
							<view class="title-period">
								<view class="membertitle f-28 col-3">{{couponlist_item.card_title}}</view>
								<block v-if="!(!!couponlist_item.coupon)">
									<view class="memberperiod f-24 col-9 m-top10">有效期：{{couponlist_item.card_type===2?couponlist_item.card_time_date['start_time']+'至'+couponlist_item.card_time_date['end_time']:couponlist_item.card_time_date+'天'}}</view>
								</block>
								<block v-else>
									<view class="memberperiod f-24 col-9 m-top10">赠:{{couponlist_item.coupon.name}}{{couponlist_item.coupon_number}}张</view>
								</block>
							</view>
							<view class="member-price">
								<view class="now-price f-36 f-w">{{settingData.currency}} <text class="text">{{couponlist_item.card_price}}</text></view>
								<view class="f-24 col-9 old-price">{{settingData.currency}}{{couponlist_item.card_marking_price}}</view>
							</view>
							<!-- <view class="gore"></view> -->
						</view>
						<!-- 卡 -->
						<!-- 使用说明 -->
						<view v-if="couponlist_item.card_id===card_id &&　couponlist_item.content" class="member-rules" :class="{'is-open':couponlist_item.rulesOpened}">
							<scroll-view class="member-rules__content" scroll-y>
								<parse :html="couponlist_item.content" />
							</scroll-view>
							<view v-if="!couponlist_item.rulesOpened" class="member-rules__btn-more" @click="openItemRules(couponlist_item)">展开<view
								 class="iconfont is-inline icon-xialajiantouxiao"></view>
							</view>
							<view v-else class="member-rules__btn-more" @click="closeItemRules(couponlist_item)">收起<view class="iconfont is-inline icon-fold"></view>
							</view>
						</view>
						<!-- 使用说明 end -->
					</view>

				</view>
			</view>
		</view>
		<view class="mask-main" v-if="activationShow">
			<view class="mask-view"></view>
			<view class="call-main b-f">
				<view class="card-title t-c f-32 m-btm10">兑换会员</view>
				<view class="card-title-parse f-24 col-9 t-c m-btm50">兑换用户至: {{memberInfo.nickName}}</view>
				<view class="card-code-input m-btm30">
					<input type="text" value="" placeholder="请输入兑换码" class="f-26 padding-box main-border-color" v-model="activationcode" />
				</view>
				<view class="f-24 card-code-btn t-c main-bg-color auxiliary-color" @click="confrimCode">确认兑换</view>
				<view class="close-img" @click="activationShow = false">
					<text class="iconfont icon-roundclose"></text>
				</view>
			</view>
		</view>
		<view class="formbutton t-c f-28 col-3 f-w main-bg-color auxiliary-color" @click="submitOrder">{{memberType==='1'?'立即支付':'立即续费'}}
			<BindMobileButton v-if="memberInfo.mobile==='0'|| memberInfo.mobile===''" @onBindSuccess="bindMobile($event,'open')"></BindMobileButton>
		</view>
		<view class="bottomHeight"></view>
		<order-pay ref="orderPay" @clickMask="onToggleList" @payChange="payTypeChange" @orderReady="payOrderReady"
		 @paySuccess="paySuccess" @payFail="payFail"></order-pay>
		<page-loading ref="loading"></page-loading>
		<!-- #ifdef H5 -->
		<FollowImgPopup v-if="settingData && settingData.qzgz" :visible="settingData.qzgz.indexOf('membercard') !== -1"></FollowImgPopup>
		<!-- #endif -->
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import OrderPay from "@/components/template/OrderPayPopups.vue"
	import BindMobileButton from "@/components/template/BindMobileButton.vue"
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	// #ifdef H5
	import FollowImgPopup from '@/components/page/pageComponents/FollowImgPopup.vue'
	// #endif
	export default {
		data() {
			return {
				card_id: null,
				cardList: [], //会员卡列表
				memberInfo: null, //会员信息
				memberSet: null, //会员卡信息
				memberType: null, //类型（开通1,续费2）
				isShowBinding: false,
				payOrderId: null,
				isSubmit: false,
				payType: null,
				activationShow: false, //激活码兑换
				activationcode: "", //激活码
				isDealer: false, //是否分销商条件
				
			};
		},
		onLoad(e) {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff"
			});
			this.pageLoad(e);
		},
		computed: {

		},
		onShow() {
			let clientTyp = App.getClientType(),
				isSubmit = (this.isSubmit && this.payType === "alipay");
			if (isSubmit) {
				this.orderStatusInquiry(this.payOrderId);
			}
		},
		components: {
			OrderPay,
			BindMobileButton,
			Parse,
			// #ifdef H5
			FollowImgPopup
			// #endif
		},
		mounted() {

		},
		methods: {
			openItemRules(item) {
				item.rulesOpened = true
			},
			closeItemRules(item) {
				item.rulesOpened = false
			},
			/**
			 * 页面加载处理
			 */
			pageLoad(e) {
				console.log(e, 'e-------------------')
				this.memberType = e.card_type === '2' ? '1' : '2';
				this.isDealer = e.dealer === '1';
				this.dataDetail(this.memberType);
			},
			useCode() {
				let _this = this;
				if (_this.memberInfo.mobile === "0" || _this.memberInfo.mobile === "") {
					if (_this.appClientType === "4") {
						App.showError("请先绑定手机号")
					}
				} else {
					_this.activationShow = !_this.activationShow;
				}
			},
			confrimCode() {
				let _this = this;

				App._post_form('member.Member/cdKeyUse', {
					cdKey: _this.activationcode
				}, (res) => {
					if (res.code === 1) {
						App.showError('会员卡激活成功', () => {
							this.memberDetail();
							_this.activationShow = false;
							_this.activationcode = '';
						})

					}
				})
			},
			dataDetail(card_type) {
				let _this = this;
				App._post_form('member.Member/getCard', {
					card_type,
					dealer: _this.isDealer ? 1 : "",
					user_id: uni.getStorageSync('user_id')
				}, (res) => {
					const cardList = (res.data && res.data.cardList || []).map(item=>({
						...item,
						rulesOpened: false
					}))
					_this.setData({
						...(res.data || {}),
						cardList
					})
					_this.card_id = res.data.cardList[0]['card_id'];
				}, false, () => {
					App.hideLoading()
				})
			},
			/**
			 * 选择会员卡
			 */
			selectCard(card_id) {
				let _this = this;
				if (_this.card_id === card_id) {
					_this.card_id = null
				} else {
					_this.card_id = card_id;
				}
			},
			/**
			 * 获取用户手机号
			 */
			bindMobile(res, btnType) {
				this.memberInfo.mobile = res.mobile;
				this[btnType === "open" ? "submitOrder" : "useCode"]();
			},
			submitOrder() {
				let _this = this,
					payData = {
						pay_from: "checkout",
						memberType: _this.memberType,
						memberCard: _this.card_id,
						userDeaerID: _this.$store.state.refereeId
					},
					userInfo = _this.$store.state.userInfo;
				if (!(!!_this.card_id)) {
					App.showError('请选择购买会员卡')
					return
				}

				console.log(userInfo);
				if (userInfo && this.$util.isEmptyMobile(userInfo.mobile)) {
					// // #ifdef H5
					// App.showError('请先绑定手机号', () => {
					// });
					// // #endif
					return
				}
				console.log(payData);
				_this.$store.commit("orderPay", payData)
				_this.onToggleList()
			},
			/**
			 * 显示隐藏支付方式选择
			 */
			onToggleList() {
				this.$refs.orderPay.onToggleList();
			},
			/**
			 * 切换支付方式
			 */
			payTypeChange(e) {
				this.payType = e.value;
				console.log("当前选择支付方式:", e.value)
			},
			/**
			 * 订单创建成功
			 */
			payOrderReady(e) {
				console.log(e);
				uni.hideLoading();
				let _this = this,
					source = App.getClientType(),
					payType = this.payType,
					order_id = e.result.data.order_id;
				if (source === "4" && payType === "alipay") {
					_this.isSubmit = true;
					_this.payOrderId = order_id;
				}
			},
			/**
			 * 订单支付成功
			 */
			paySuccess(e) {
				console.log("paySuccess", e);
				// App.navigationTo({
				// 	url: "pages/subPages/member/index/index"
				// })
				uni.navigateBack({
					fail() {
						// 跳转到首页
						self.navigationTo('pages/mainPages/index/index')
					}
				})
			},
			/**
			 * 订单支付失败
			 */
			payFail(result) {
				//2-微信小程序 3-H5 4-公众号 7-支付宝小程序 8-百度小程序 9-头条小程序
				console.log("payFail", result);
				let clientType = this.$store.state.clientType,
					errMsg = null;
				if (clientType === "2") {
					let isCancel = result.errMsg === "requestPayment:fail cancel";
					errMsg = isCancel ? '订单未支付' : result.err_desc;
				} else if (clientType === "7") {
					errMsg = result.resultCode === "6001" ? "订单未支付" : "支付失败";
				} else if (clientType === "8") {
					errMsg = "支付失败";
				} else {
					errMsg = "支付失败";
				}
				App.showError(errMsg);
			},

			/**
			 * 订单支付状态查询
			 */
			orderStatusInquiry(order_id) {
				let _this = this,
					uniacid = App.getUniacid();
				uni.showModal({
					title: "温馨提示",
					content: "请确认当前支付是否已完成",
					cancelText: "未完成",
					confirmText: "已完成",
					success(res) {
						if (res.confirm) {
							console.log('用户已完成支付');
							//订单状态查询
							App._get('member.Member/getMemberOrderStatus', {
								order_id
							}, (result) => {
								let orderInfo = result.data,
									pay_status = orderInfo.pay_status;
								if (pay_status === 20) {
									App.navigationTo({
										url: "pages/subPages/member/index/index"
									})
								}
							});
						}
					}
				});
			},
		},
	}
</script>

<style lang="scss">
	.header .header-main {
		position: relative;
		width: 100%;
		height: 320upx;
		background-repeat: no-repeat;
		background-size: cover;
		box-shadow: 0 4upx 12upx 0 rgba(154, 154, 154, .35);
		border-radius: 20upx;
		z-index: 2;
	}

	.header .header-main .member-number {
		position: absolute;
		right: 46upx;
		top: 15%;
	}

	.member-msg {
		padding: 200upx 46upx 0 46upx;
	}

	.member-user-msg .member-avatar {
		display: block;
		width: 70upx;
		height: 70upx;
		border-radius: 50%;
		margin-right: 12upx;
	}

	.member-logo {
		display: inline-block;
		width: 30upx;
		height: 30upx;
		vertical-align: middle;
		margin-left: 10upx;
	}

	.header .member-label {
		background-color: #333333;
		border-radius: 0 0 20upx 20upx;
		margin: 0 20upx;
	}

	.header .member-label text {
		color: #EF4343;
	}

	.tab-bar {
		padding: 40upx 30upx 20upx;
		border-radius: 0 0 20upx 20upx;
		margin-top: -20upx;
		/* 		box-shadow: 0 2upx 12upx 0px rgba(226, 226, 226, 0.35);
		border-radius: 20upx;
		position: relative;
		/* z-index: 1; */
		/* 		margin-top: -20upx; */
	}

	.tab-bar image {
		display: block;
	}

	.Tabbar-items image {
		width: 60upx;
		height: 60upx;
	}

	.section .member-Tabbar {
		background-color: #FFFFFF;
		position: relative;
		padding: 36upx 30upx 16upx;
		border-radius: 20upx;
	}

	.section .member-Tabbar::after {
		content: " ";
		position: absolute;
		top: 40upx;
		left: 15upx;
		bottom: 2upx;
		width: 8upx;
		height: 36upx;
		background: #F1E0CE;
		border-radius: 20upx
	}

	.member-Tabbar .title {
		padding-left: 10upx;
	}

	.member-items.select {
		border: 1px solid #fcf6ea;
		background-color: #fcf6ea;
	}

	.member-items .member-items-select {
		position: absolute;
		top: -48upx;
		right: -48upx;
		width: 90upx;
		height: 90upx;
		background: #333333;
		transform: rotate(45deg);
	}

	.member-items .member-items-select image {
		position: absolute;
		left: 32upx;
		bottom: 4upx;
		width: 22upx;
		height: 22upx;
		display: block;
		transform: rotate(-45deg);
	}

	.select .after {
		/* content: ""; */

	}

	.member-items.not-select {
		border: 1px solid #F0F0F0;
	}

	.member-items {
		position: relative;
		padding: 30upx 44upx 30upx 36upx;
		border-radius: 20upx;
		overflow: hidden;
		z-index: 5;
	}

	.member-price .now-price {
		color: #F04C4C;
	}

	.member-price .old-price {
		text-decoration: line-through;
	}

	.member-price .now-price .text {
		margin-left: 4upx;
	}

	.formbutton {
		height: 90upx;
		line-height: 90upx;
		background: #FFD940;
		background: var(--theme-color);
		box-shadow: 0 2upx 12upx 0 rgba(204, 149, 182, 0.35);
		border-radius: 44upx;
		margin: 0 30upx;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 20upx;
		z-index: 20;
	}

	.formbutton button {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		opacity: 0;
		z-index: 2;
	}

	.padding-box {
		margin-bottom: 80upx;
	}

	.bottomHeight {
		height: 30upx;
	}

	.redeem-code {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		text-decoration: underline;
		width: 8em;
	}

	.redeem-code button {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		opacity: 0;
		z-index: 2;
	}

	.mask-main {
		position: relative;
	}

	.mask-view {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .7);
		left: 0;
		top: 0;
		z-index: 1000;
	}

	.call-main {
		position: fixed;
		width: 500upx;
		height: 320upx;
		padding: 20upx 40upx;
		z-index: 1001;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		border-radius: 20upx;
	}

	.card-code-input input {
		border: 1px solid rgb(243, 240, 168);
		border: 1px solid var(--theme-color);
		height: 70upx;
		line-height: 70upx;
		border-radius: 8upx;
		background-color: rgb(255, 250, 233);
	}

	.card-code-btn {
		height: 70upx;
		line-height: 70upx;
		/* border: 1px solid rgb(217, 217, 217); */
		border-radius: 30upx;
		margin: 0 auto;
		background-color: rgb(255, 220, 49);
		margin-top: -45upx;
	}

	.close-img {
		position: absolute;
		left: 50%;
		/* width: 100%; */
		z-index: 101;
		transform: translate(-50%, 70upx);
		/* text-align: center; */
	}

	.close-img .iconfont {
		color: #FFFFFF;
		font-size: 56upx;
	}

	.header-img {
		width: 100%;
		height: 300rpx;
		display: block;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		position: relative;
		z-index: 1;
	}

	.header-img-text {
		position: absolute;
		font-size: 72rpx;
		top: 153rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 63%;
		height: 100rpx;
		line-height: 92rpx;
		z-index: 1;
		background: #fff;
		text-align: center;
		font-weight: bold;
		color: #ffcd00;
		text-shadow: 2px 2px 0px #5c6cdf;
		letter-spacing: 10rpx;
	}
</style>

<style lang="scss" scoped>
	.member-rules {
		box-sizing: border-box;
		position: relative;
		margin-top: -20rpx;
		padding: 20rpx 30rpx;
		padding-top: 40rpx;
		background-color: #F8F8F8;
		border-radius: 0 0 20rpx 20rpx;
	}

	.member-rules__content {
		max-height: 120rpx;

		.member-rules.is-open & {
			max-height: initial;
		}
	}

	.member-rules__btn-more {
		margin-top: 8rpx;
		text-align: center;
		font-size: 24rpx;
		color: #999;

		.iconfont {
			font-size: 24rpx;
			margin-left: 8rpx;
		}
	}
</style>
