<!-- 领取优惠券 -->
<template>
	<view class="page-container p-r" :style="{'background-image':backgroundImage}">
		<!-- #ifdef H5 -->
		<image src="/static/h5/share.png" v-show="shareImg" class="to-share" mode="widthFix"></image>
		<!-- #endif -->
		<view class="bonus-rule f-24" @click="onTogglePop('rule')">活动规则</view>
		<!-- 活动弹幕 -->
		<view class="bonus-barrage dis-flex flex-y-center" :class="{'show':showTips}">
			<image class="success-avatar" :src="barrageList[tipsIndex] ? barrageList[tipsIndex].avatarUrl : ''"></image>
			<view class="onelist-hidden success-goods f-24 col-f m-left12">{{barrageList[tipsIndex]?barrageList[tipsIndex].text:""}}</view>
		</view>

		<!-- 活动详情 -->
		<view class="bonus-content b-f t-c">
			<view class="bonus-detail" v-if="showSatus === 1">
				<view class="bonus-title col-3 f-28">点击[立即领取]开始{{bonusType === 20?"活动":"瓜分"}}</view>
				<view class="bonus-money dis-flex flex-x-center">
					<view class="f-24">{{settingData.currency}}</view>
					<view class="f-w">{{bonusDeatil.money}}</view>
				</view>
				<view class="bonus-name f-30">优惠礼包</view>
				<view class="bonus-btn f-28 col-f btn-animation" @click="openBonus(bonusDeatil.id)">立即领取</view>
			</view>
			<view class="bonus-divide" v-if="showSatus === 2 || showSatus === 3 ||  showSatus === 5">
				<view class="divide-users dis-flex flex-y-center flex-x-center">
					<view class="user-item" v-for="(item,index) in bonusDeatil.join_user" :key="item.user_id">
						<image class="user-avatar" :src="item.avatarUrl"></image>
					</view>
					<block v-if="bonusDeatil.last_num && bonusDeatil.last_num>0">
						<view class="user-item" v-for="(item,index) in bonusDeatil.last_num" :key="index">
							<view class="user-wait f-40 t-c col-9">?</view>
						</view>
					</block>
				</view>
				<block v-if="showSatus === 2 || showSatus === 3">
					<view class="bonus-text t-c f-26" v-if="bonusDeatil.last_num > 0">还差{{bonusDeatil.last_num}}人即可{{bonusTypeText}}{{bonusDeatil.money}}元礼包,邀请好友来{{bonusTypeText}}</view>
					<view class="bonus-text t-c f-26" v-else>{{isJoinBonus?`恭喜您，好友已集齐，立即${bonusTypeText}吧！`:"很遗憾，活动人数已集齐"}}</view>
				</block>
				<view class="bonus-cutdown f-28 dis-flex flex-y-line flex-x-center">
					<block v-if=" showSatus === 5 || bonusDeatil.status === 3">
						活动已结束
					</block>
					<block v-else>
						<block  v-if="isCanJoin">
							<CountDown :leftTime="leftTime" color="#FFD940" splitorColor="#FFD940" :isPadding="false" :showColon="false"
							 @timeEnd="cutDownEnd"></CountDown>
							后结束
						</block>
					</block>
				</view>
				<view class="bonus-share f-30 t-c p-r btn-animation" v-if="showSatus === 2 && bonusDeatil.status !== 3 && isCanJoin">
					<button class="report-btn" open-type="share" @click="bonusShare"></button>
					点击邀请好友一起{{bonusTypeText}}
				</view>
				<block v-if="showSatus === 3 ||  showSatus === 5 || bonusDeatil.status === 3">
					<view class="bonus-share f-30 t-c btn-animation" v-if="showSatus !== 5 && isCanJoin && bonusDeatil.status !== 3"
					 @click="openBonus(bonusDeatil.id,'join')">立即{{bonusTypeText}}礼包</view>
					<view class="bonus-share other f-30 t-c btn-animation" @click="openBonus(bonusDeatil.activity_id)">{{bonusTypeText}}新优惠</view>
				</block>
			</view>
			<view class="bonus-divide" v-if="showSatus === 4">
				<view class="f-30 bonus-success f-w">恭喜，已成功获得</view>
				<view class="bonus-money dis-flex flex-x-center flex-y-line">
					<view class="f-24">{{settingData.currency}}</view>
					<view class="f-w">{{bonusDeatil.money}}</view>
				</view>
				<!-- 部分商品无使用门槛 -->
				<view class="f-26 col-9 m-top-btm20">{{bonusUserTime}}</view>
				<view class="bonus-share f-30 t-c btn-animation" @click="useBonus(bonusDeatil.id)">立即使用</view>
				<view class="bonus-share other f-30 t-c btn-animation" @click="openBonus(bonusDeatil.activity_id)">{{bonusTypeText}}新优惠</view>
			</view>
		</view>
		<!-- 活动好友列表 -->
		<block v-if="bonusType !== 20">
			<view class="recommend-title dis-flex flex-x-center flex-y-center" v-if="showSatus === 4">
				<image src="/static/images/bonus/title.png" class="title-icon"></image>
				<view class="f-28 f-w">好友手气</view>
				<image src="/static/images/bonus/title.png" class="title-icon"></image>
			</view>
			<view class="bonus-friends b-f" v-if="showSatus === 4">
				<view class="friend dis-flex flex-x-between flex-y-center" v-for="(item,index) in bonusDeatil.join_user" :key="item.user_id">
					<view class="friend-info dis-flex flex-y-center">
						<image class="friend-avatal" :src="item.avatarUrl" mode=""></image>
						<view class="friend-name f-28 col-3">{{item.nickName}}</view>
					</view>
					<view class="friend-bonus">{{settingData.currency}}{{item.money}}</view>
				</view>
			</view>
		</block>
		<!-- 推荐商品 -->
		<view class="recommend-title dis-flex flex-x-center flex-y-center">
			<image src="/static/images/bonus/title.png" class="title-icon"></image>
			<view class="f-28 f-w">好货精选</view>
			<image src="/static/images/bonus/title.png" class="title-icon"></image>
		</view>
		<view class="recommend-goods m-top20">
			<recommend-goods :active-id="options" :recommendclass="1" :isShowCopyRight="false" :isShowTitle="false"></recommend-goods>
		</view>
		<!-- 活动弹窗 -->
		<popup-view :show="isShowPopView" type="center" @clickmask="isShowPopView = false">
			<!-- 领取红包 -->
			<block v-if="popType ==='receive'">
				<view class="receive-content t-c p-r" :style="{'background-image':getImageRoot('57.png','url')}">
					<block v-if="isOpenBonus">
						<view class="receive-title f-30 f-w">您已获得一个优惠礼包</view>
						<view class="receive-money dis-flex flex-x-center">
							<view class="f-24">{{settingData.currency}}</view>
							<view class="f-w">{{bonusDeatil.money}}</view>
						</view>
						<view class="receive-num f-26">还差{{bonusDeatil.last_num}}人即可{{bonusTypeText}}</view>
					</block>
					<block v-else>
						<block v-if="bonusType === 20">
							<view class="share-user">
								<image class="share-avatar" :src="popUserInfo.avatarUrl"></image>
								<view class="f-24">恭喜您，已获得</view>
							</view>
							<view class="f-28 m-top20 dis-flex flex-x-center flex-y-line m-top30">
								<view class="f-44 f-w m-right12">{{bonusDeatil.money}}</view>
								元红包领取资格
							</view>
						</block>
						<block v-else>
							<view class="receive-join-icon iconfont icon-roundcheckfill"></view>
							<view class="f-28 m-top20">"您已加入一个瓜分团"</view>
						</block>
					</block>
					<view class="shaer-btn f-30 col-f btn-animation" @click="onTogglePop('close')">
						<button class="report-btn" open-type="share" @click="bonusShare"></button>
						{{showSatus===2?`邀请好友一起${bonusTypeText}`:`查看我的${bonusType === 20?"红包":"瓜分团"}`}}
					</view>
				</view>
			</block>
			<!-- 打开红包 -->
			<block v-if="popType ==='open'">
				<view class="bonus-open t-c" :style="{'background-image':getImageRoot('58.png','url')}">
					<view class="open-contnet">
						<view class="f-34 col-f">好友已集齐，立即{{bonusTypeText}}吧！</view>
						<view class="dis-flex flex-y-line flex-x-center ">
							<view style="font-size: 120rpx;color: #FFDB7B;">{{bonusDeatil.money}}</view>
							<view class="f-24" style="color: #FFDB7B;">元</view>
						</view>
						<view class="open-btn f-30 btn-animation" @click="receiveBonus(bonusDeatil.id)">立即领取</view>
					</view>
				</view>
			</block>
			<!-- 活动规则 -->
			<block v-if="popType === 'rule'">
				<view class="bonus-rule-content t-c p-r">
					<view class="rule-header f-w f-36">活动规则</view>
					<view class="rule-body">
						<scroll-view scroll-y="true" class="scrollView">
							<parse :html="bonusDeatil.use_rule"></parse>
						</scroll-view>
					</view>
					<view class="rule-footer"></view>
					<view class="iconfont icon-roundclose" @click="onTogglePop('close')"></view>
				</view>
			</block>
		</popup-view>
		<shortcut id=""></shortcut>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import Parse from "@/components/threeComponents/jyf-Parser/index"
	import CountDown from "@/components/template/CountDown.vue"
	import shortcut from "@/components/template/ShortCut.vue"
	import PopupView from "@/components/template/PopManager.vue"
	import RecommendGoods from "@/components/template/RecommendGoods.vue"
	import App from "@/common/js/app.js"
	// #ifdef H5
	import wxApi from "@/static/h5/wxApi.js"
	// #endif
	let successTimer, setTimer, indexTimer;
	export default {
		data() {
			return {
				options: {},
				popType: "", //弹窗类型
				bonusDeatil: {}, //红包详情
				isOpenBonus: true, //是否显示领取红包
				isShowPopView: false, //是否显示弹窗
				showTips: false, //显示弹幕
				tipsIndex: 0, //当前弹幕下标
				barrageList: [], //活动弹幕数据
				shareImg: false, //h5分享引导
				shareData: null,
			};
		},
		components: {
			shortcut,
			RecommendGoods,
			PopupView,
			Parse,
			CountDown
		},
		computed: {
			//页面显示状态 1-未瓜分 2-邀请中(自己) 3-邀请中(别人) 4-已获得 5-已过期
			showSatus() {
				return this.bonusDeatil.code || 1
			},
			//活动结束时间
			leftTime() {
				if (this.bonusDeatil.over_time > 0) {
					let activityStatus = App.getActivityStatus(0, this.bonusDeatil.over_time);
					return activityStatus.leftTime;
				}
			},
			//红包类型
			bonusType() {
				return this.bonusDeatil.type;
			},
			bonusTypeText() {
				return this.bonusType === 20 ? "领取" : "瓜分";
			},
			//活动背景图
			backgroundImage() {
				let {
					activity_back, //是否自定义活动背景
					back_image_id //自定义背景图片
				} = this.bonusDeatil;
				return activity_back === 20 ? (back_image_id && back_image_id.length > 0 ? `url(${back_image_id[0].file_path})` :
					this.getImageRoot('56.png', 'url')) : this.getImageRoot('56.png', 'url')
			},
			//红包使用时间
			bonusUserTime() {
				let _this = this,
					{
						available_type,
						available_time
					} = _this.bonusDeatil;
				if (available_type === 10) {
					return `有效期:${available_time.map(val=>_this.$util.formatTime(val, "date", ".")).join("-")}`;
				} else {
					return `领取后${available_type === 20?"当":"次"}日起${available_time}天内可用`;
				}
			},
			//裂变模式好友信息
			popUserInfo() {
				let {
					popup
				} = this.bonusDeatil;
				return popup;
			},
			//当前用户是否参与活动
			isJoinBonus() {
				let {
					join_user
				} = this.bonusDeatil;
				if (join_user && join_user.length > 0) {
					let user_id = App.getUserId();
					return this.bonusDeatil.join_user.map(val => val.user_id).includes(user_id);
				}
			},
			isCanJoin() {
				return this.bonusDeatil.last_num > 0;
			}
		},
		watch: {
			isShowPopView(newValue, oldValue) {
				if (!newValue) {
					this.shareImg = newValue;
				}
			}
		},
		onLoad(options) {
			//active_id活动id  bonus_id瓜分团团id
			console.log(options);
			this.options = options;
			if(!!options.scene){
				this.options.active_id = options.scene;
			}
			this.setSuccessBarrage(options);
		},
		onShow() {
			this.getBonusDetail(this.options);
		},
		onUnload() {
			this.timerInit();
		},
		methods: {
			onTogglePop(params) {
				if (params !== "close") {
					this.popType = params;
				}
				this.showPopChange();
			},
			showPopChange() {
				this.isShowPopView = !this.isShowPopView;
			},
			/**
			 * 获取红包详情
			 * @param {Object} options 所有红包相关参数
			 */
			getBonusDetail(options) {
				let _this = this;
				return new Promise((resolve, reject) => {
					App._get("redenvelopes.Redenvelopes/redEnvelopesShowData", {
						...options
					}, res => {
	
						console.log('res 11111111',res)
						delete res.data.activity_data["id"];
						let data = res.data,
							bonusDeatil = JSON.parse(JSON.stringify(res.data.activity_data));
						delete data["activity_data"];
						bonusDeatil = Object.assign(data, bonusDeatil);
						//金额去0
						bonusDeatil.money = _this.$util.removePoint(bonusDeatil.money);
						_this.bonusDeatil = bonusDeatil;
						//设置公众号分享信息
						if (_this.appClientType !== "3") {
							_this.shareData = App.getPageShareData("bonus", bonusDeatil, _this);
						}

						_this.$nextTick(() => {
							App.hideLoading();
							uni.stopPullDownRefresh();
						})

						//裂变模式，好友弹窗
						if (!!bonusDeatil.popup && bonusDeatil.popup instanceof Object) {
							_this.isOpenBonus = false;
							_this.onTogglePop("receive");
							return
						}

						let isJoinBonus;
						if (bonusDeatil.join_user && bonusDeatil.join_user.length > 0) {
							let user_id = App.getUserId();
							isJoinBonus = bonusDeatil.join_user.map(val => val.user_id).includes(user_id);
							console.log("是否在当前团:", isJoinBonus);
						}

						//活动过期判断
						let isOverTime = false;
						if (bonusDeatil.code !== 1) {
							let nowTime = new Date().getTime() / 1000;
							isOverTime = Number(bonusDeatil.over_time) < nowTime + 2;
							console.log("当前团是否已过期:", isOverTime);
							//手动添加状态5，已过期
							bonusDeatil.code = isOverTime ? 5 : bonusDeatil.code;
						}


						//瓜分成功
						if ((bonusDeatil.code === 2 || bonusDeatil.code === 3) && bonusDeatil.status === 2 && isJoinBonus && !
							isOverTime) {
							_this.showBonus();
						} else {
							resolve(bonusDeatil);
						}

					});
				})

			},
			/**
			 * 瓜分红包
			 * @param {String} id 活动id
			 * @param {String} type 参与活动类型 open打开红包 join瓜分红包
			 */
			openBonus(id, type = "open") {
				let _this = this,
					params = {
						[type === "open" ? "active_id" : "bonus_id"]: id
					};
				uni.showLoading();
				App._get(`redenvelopes.Redenvelopes/${type}RedEnvelopesGroup`, params, async res => {
					_this.isOpenBonus = type === "open";
					let bonusDeatil = await _this.getBonusDetail(params);
					uni.hideLoading();
					//最后一个成员，瓜分成功
					if ((bonusDeatil.code === 2 || bonusDeatil.code === 3) && bonusDeatil.status === 2) {
						_this.showBonus();
					} else {
						_this.onTogglePop('receive');
					}
				})
			},
			/**
			 * 领取红包
			 * @param {Object} bonus_id 瓜分团id
			 */
			receiveBonus(bonus_id) {
				let _this = this;
				uni.showLoading();
				App._get("redenvelopes.Redenvelopes/userReceiveRedEnvelopes", {
					bonus_id
				}, res => {
					_this.getBonusDetail({
						bonus_id
					}).then(bonusDeatil => {
						uni.hideLoading();
						_this.onTogglePop("close");
					})
				})
			},
			/**
			 * 显示领取红包
			 */
			showBonus() {
				this.popType = "open";
				this.showPopChange();
			},
			/**
			 * 使用红包
			 * @param {Object} bonus_id
			 */
			useBonus(bonus_id) {
				App.navigationTo({
					url: `pages/subPages/user/coupon/receive?bonus_id=${bonus_id}`
				})
			},
			/**
			 * 好友分享
			 */
			bonusShare() {
				// #ifdef H5
				this.popType = "h5";
				this.shareImg = true;
				this.showPopChange();
				// #endif
			},
			/**
			 * 获取弹幕数据
			 */
			getBarrageData(options) {
				return new Promise((reslove, reject) => {
					App._get("redenvelopes.Redenvelopes/barrage", {
						...options,
						no_login: 1
					}, (res) => {
						reslove(res.data);
					});
				})
			},
			/**
			 * 设置购买弹幕
			 */
			async setSuccessBarrage(options) {
				let _this = this,
					tipsIndex = _this.tipsIndex,
					barrageList = _this.barrageList;
				if (tipsIndex >= barrageList.length) {
					let barrageData = await _this.getBarrageData(options);
					_this.tipsIndex = 0;
					_this.barrageList.splice(0, barrageData.length, ...barrageData);
					barrageData.length > 0 && _this.setSuccessBarrage(options);
				} else {
					console.log("showTips");
					_this.showTips = true;
					successTimer = setTimeout(() => {
						_this.showTips = false;
						setTimer = setTimeout(() => {
							_this.tipsIndex++
						}, 500);
						indexTimer = setTimeout(() => {
							_this.setSuccessBarrage(options);
						}, 3000);
					}, 5000);
				}
			},
			timerInit() {
				clearTimeout(successTimer);
				clearTimeout(setTimer);
				clearTimeout(indexTimer);
			},
			/**
			 * 倒计时结束
			 */
			cutDownEnd() {
				this.getBonusDetail({
					...this.options,
					close: 1
				})
			}
		},
		onPullDownRefresh() {
			this.getBonusDetail(this.options)
		},
		onShareAppMessage() {
			console.log('红包页面分享',this.shareData)
			return this.shareData;
		}
	}
</script>

<style scoped lang="scss">
	$fontColor:#FD4143;

	.page-container {
		min-height: 100vh;
		padding: 0 30rpx 0;
		background-size: 100% 640rpx;
		background-repeat: no-repeat;
		box-sizing: border-box;
		background-color: #F8F8F8;
		padding-top: 456rpx;

		.to-share {
			position: fixed !important;
			z-index: 1009;
			right: 10upx;
			top: 0;
			overflow: auto;
			width: 500upx;
			height: 380upx;
		}

		.bonus-rule {
			position: absolute;
			top: 60rpx;
			right: 0;
			background: #FFD940;
			color: $fontColor;
			height: 46rpx;
			line-height: 46rpx;
			padding: 0 12rpx 0 20rpx;
			border-radius: 30px 0 0 30px;
		}
	}

	/* 购买提示 */
	.bonus-barrage {
		position: fixed;
		top: 6%;
		left: 30rpx;
		height: 54rpx;
		line-height: 54rpx;
		background: rgba(0, 0, 0, .5);
		border-radius: 50px;
		z-index: 5;
		padding: 0 12rpx;
		opacity: 0;
		transition: opacity .4s;

		&.show {
			opacity: 1;
		}

		.success-avatar {
			width: 40rpx;
			height: 40rpx;
			display: block;
			border-radius: 50%;
		}

		.success-goods {
			max-width: 450rpx;
		}
	}

	.bonus-content {
		// height: 429rpx;
		border-radius: 10rpx;
		padding: 16rpx;
		box-sizing: border-box;

		.bonus-money {
			margin-top: 20rpx;
			color: #FE504F;

			.f-24 {
				margin: 10rpx 10rpx 0 0;
			}

			.f-w {
				font-size: 70rpx;
			}
		}
	}

	.bonus-detail {
		border: 1rpx solid #FFE9D2;
		height: 100%;
		border-radius: 10rpx;
		background: linear-gradient(0deg, rgba(255, 252, 248, 1) 0%, rgba(255, 255, 255, 1) 100%);

		.bonus-title {
			margin-top: 30rpx;
		}

		.bonus-name {
			margin: 30rpx 0;
			color: $fontColor;
		}

		.bonus-btn {
			margin: 0 90rpx 30rpx;
			height: 78rpx;
			line-height: 78rpx;
			background: $fontColor;
			border-radius: 50px;
		}
	}

	.recommend-title {
		margin-top: 30rpx;
		color: $fontColor;

		.title-icon {
			width: 40rpx;
			height: 40rpx;
			display: block;
			margin: 0 12rpx;
		}
	}

	.receive-content {
		width: 690rpx;
		height: 600rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		color: #FF4444;
		padding-top: 145rpx;

		.receive-money {
			margin-top: 30rpx;

			.f-24 {
				margin-top: 20rpx;
			}

			.f-w {
				font-size: 100rpx;
			}
		}

		.receive-num {
			margin-top: 12rpx;
		}

		.receive-join-icon {
			font-size: 80px;
			width: 1em;
			height: 1em;
			line-height: 1em;
			color: $fontColor;
			display: inline-block;
			margin-top: -12rpx;
		}

		.share-user {
			color: $fontColor;

			.share-avatar {
				width: 80rpx;
				height: 80rpx;
				margin: 0 auto 30rpx;
				display: block;
				border-radius: 50%;
			}
		}

		.shaer-btn {
			width: 430rpx;
			height: 81rpx;
			line-height: 81rpx;
			background: linear-gradient(0deg, rgba(247, 202, 21, 1) 0%, rgba(255, 217, 64, 1) 100%);
			box-shadow: 0px 10px 30px 0px rgba(0, 0, 0, 0.2);
			border-radius: 41px;
			position: absolute;
			left: 50%;
			bottom: 21%;
			margin-left: -215rpx;
		}
	}


	.bonus-divide {
		padding: 20rpx;

		.bonus-success {
			color: $fontColor;
		}

		.divide-users {
			flex-wrap: wrap;

			.user-item {
				width: 80rpx;
				height: 80rpx;
				margin: 0 30rpx 20rpx;

				.user-avatar {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					display: block;
				}

				.user-wait {
					width: 100%;
					height: 100%;
					line-height: 80rpx;
					border-radius: 50%;
					border: 1rpx dashed #DDDDDD;
					background: #F8F8F8;
				}
			}
		}

		.bonus-text {
			color: $fontColor;
			margin-top: 12rpx;
		}

		.bonus-cutdown {
			color: #FFD940;
			margin: 30rpx 0;

			/deep/.uni-countdown__number,
			/deep/.uni-countdown__splitor {
				font-size: 28rpx !important;
				padding: 0 !important;
				margin: 0;
			}
		}

		.bonus-share {
			background: $fontColor;
			width: 478rpx;
			height: 78rpx;
			line-height: 78rpx;
			border-radius: 39px;
			margin: 0 auto;
			color: #FFFFFF;
		}

		.bonus-share.other {
			background: #FFD940;
			margin-top: 20rpx;
		}
	}

	.bonus-open {
		width: 690rpx;
		height: 900rpx;
		margin-top: -200rpx;
		box-sizing: border-box;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		padding-top: 500rpx;

		.open-btn {
			color: $fontColor;
			width: 300rpx;
			height: 83rpx;
			line-height: 83rpx;
			background: rgba(255, 217, 64, 1);
			box-shadow: 0px 0px 15px 0px rgba(209, 32, 32, 0.59);
			border-radius: 42px;
			margin: 30rpx auto 0;
		}
	}


	.bonus-friends {
		border-radius: 10rpx;
		padding: 0 30rpx;
		margin-top: 30rpx;

		.friend {
			height: 120rpx;
			border-bottom: 1rpx solid #EEEEEE;

			.friend-avatal {
				width: 70rpx;
				height: 70rpx;
				display: block;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			&:last-child {
				border: 0;
			}
		}

		.friend-bonus {
			color: $fontColor;
		}
	}

	.bonus-rule-content {
		width: 543rpx;
		background: rgba(251, 240, 254, 1);
		border-radius: 40rpx;

		.rule-header {
			height: 182rpx;
			line-height: 182rpx;
			background-image: url('~@/static/images/bonus/header.png');
			background-size: 100% 100%;
			color: $fontColor;
		}

		.rule-body {
			height: 392rpx;
			padding: 0 30rpx;

			.scrollView {
				max-height: 392rpx;
			}
		}

		.rule-footer {
			height: 91rpx;
			background-image: url('~@/static/images/bonus/footer.png');
			background-size: 100% 100%;
		}

		.iconfont {
			position: absolute;
			left: 50%;
			bottom: -2em;
			transform: translateX(-50%);
			font-size: 52rpx;
			width: 1em;
			height: 1em;
			line-height: 1em;
			color: #FFFFFF;
		}
	}

	.btn-animation {
		animation: btnScale .8s linear infinite;
	}

	@keyframes btnScale {
		0% {
			transform: scale(1, 1);
		}

		50% {
			transform: scale(1.04, 1.04);
		}

		100% {
			transform: scale(1, 1);
		}
	}

	.recommend-goods {

		/deep/.recommend-bg,
		/deep/.diy-goods-list {
			background-color: #F8F8F8 !important;
		}

		/deep/.diy-goods-list {
			padding: 0 !important;
		}

		/deep/.diy-goods-item {
			width: 48% !important;
			margin: 20rpx auto 0 !important;
			border-radius: 10rpx !important;
		}
	}
</style>
