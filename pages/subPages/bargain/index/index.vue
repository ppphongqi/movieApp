<template>
	<view :style="themeColor">
		<!-- 砍价说明弹窗 -->
		<popup-view :show="showBargainnfo" type="center" @clickmask="showBargainnfo = false" >
			<view class="bargain-top-info">
				<view :style="{'background-image':getImageRoot('51.png','url')}" class="m-top20 img-center">
					<text class="pos-center">玩法介绍</text>
				</view>
				<view class="info-list-box f-24 col-3">
					<parse :html="detail.explain" />
				</view>
				<view class="close-btn" @click="showBargainnfo = false"><text class="iconfont icon-roundclose"></text></view>
			</view>
		</popup-view>
		<!-- <view class="view-content" :style="{'background-image':getImageRoot('50.png','url')}"> -->
		<view class="view-content help-bg-color" >
			<view class="padding-box">
				<view class="step-box">
					<view class="dis-flex flex-y-center">
						<view class="user-img" v-if="$user.avatarUrl" :style="{'background-image': `url(${$user.avatarUrl})`}"></view>
						<view class="dis-flex flex-dir-column" style="margin-left: 30upx;">
							<text class="f-28 col-3">{{$user.nickName}}</text>
							<text v-if="isUserSelf" class="f-24" style="color:#812D09;">发现好货，邀请好友砍价拿走</text>
							<text v-if="!isUserSelf" class="f-24" style="color:#812D09;">朋友一生一起走，帮砍一刀有没有</text>
						</view>
						<view class="help-info dis-flex flex-y-center" @click="showBargainnfo = true">
							<text>玩法说明</text>
							<text class="f-18 iconfont icon-wenhaoxiao m-left12" style="zoom: 0.8;"></text>
						</view>
					</view>
				</view>
				<view class="step-shop dis-flex flex-dir-row flex-x-between flex-y-center" :class="{'over-time': $status == 4 || $status == 3}"
				 @click="goShopDetail({isVisit:$visit.goods_visit == 0})">
					<view class="over-status">{{$status == '4' ? '已过期': $status == '3' ? '已结束' : ''}}</view>
					<view class="img-logo">
						<image style="width: 170upx;height: 170upx;" class="goods-img" :src="$goods.image && $goods.image.length > 0 ? $goods.image[0]['file_path'] : ''"
						 mode=""></image>
					</view>
					<view class="goods-info" style="width: 0;flex-grow: 1;">
						<view class="title twolist-hidden f-28">
							{{$goods.goods_name}}
						</view>
						<view class="desc">
							<view class="content col-9 f-22">
								还剩{{detail.stock}}件
							</view>
							<view class="dis-flex flex-y-line f-24" style="margin: 32upx 0 -10upx;color:#9E9B9D;">
								<view class="price-color f-22 f-w dis-flex flex-y-line" style="margin-right: 20upx;">
									低至￥<text class="f-30 price-font-family">{{detail.low_price}}</text>
								</view>
								<view class="col-9 f-20 dis-flex flex-y-line" style="text-decoration: line-through;">
									原价<text class="f-24">{{settingData.currency}}{{$goods.goods_min_price}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="bargain-btn-box dis-flex flex-x-center flex-y-center">
					<view v-if="($status == '4' || $status == '3') && isUserSelf" class="btns" @click="goShopDetail">重新发起砍价</view>
					<view v-if="detail.me_to || ($status == '4' || $status == '3') && !isUserSelf" class="btns" @click="goShopDetail">我也要砍价</view>
				</view>
			</view>

			<view class="group-box group-goods padding-box">
				<view class="link-dot left help-bg-color">
					<view class="point top"></view>
					<view class="point bottom"></view>
					<view class="line"></view>
				</view>
				<view class="link-dot right help-bg-color">
					<view class="point top"></view>
					<view class="point bottom"></view>
					<view class="line"></view>
				</view>


				<view class="group-time dis-flex flex-dir-column flex-y-center flex-x-center">
					<view class="dis-flex flex-x-center flex-y-center" v-if="$status == '1' || $status == '2'">
						<view class="group-hms f-22">
							<CountDown :leftTime="activityStatus.leftTime" color="#FFFFFF" backgroundColor="#FF4444" @timeEnd="getBargainDetail"></CountDown>
						</view>
						<view class="group-date f-24">后砍价结束</view>
					</view>
					<view v-if="$status == 1" class="col-3 f-24" style="margin: 30upx 0;">
						已砍<text class="price-color f-28 price-font-family f-w">{{detail.is_bargain_price}}</text>元,还差<text class="price-color f-28 price-font-family f-w">{{detail.surplus_price}}</text>元
					</view>
					<view class="col-3 f-24 dis-flex flex-dir-column flex-x-center" style="margin: 30upx 0;text-align: center;">
						<text v-if="$status == '2' && !isUserSelf" class="f-30 col-3" style="margin-bottom: 40upx;">已砍到最低价</text>
						<text v-if="$status == '2' && isUserSelf" class="f-30 col-3" style="margin-bottom: 40upx;">恭喜您，已砍价至￥<text class="price-color">{{detail.buy_price == 20 ? detail.pay_price : detail.buy_price}}</text>啦！</text>
						<image v-if="$status == '1' || $status == '2'" style="width: 100px; height: 100px;margin: 0 auto;" mode="widthFix"
						:src="getImageRoot('74.png')" ></image>
					</view>
					<view v-if="$status == 1" class="progress">
						<view class="current-num" :style="{'width': `${detail.progress > 95 ? 95 : detail.progress}%`}">
							<view class="current-dot pos-col-center">
								<image class="pos-center" src="/static/images/bargain/knife.png" style="position: absolute;width: 20upx;height: 20upx;margin-left: 3upx;zoom: .8;"
								 mode="widthFix"></image>
							</view>
						</view>
					</view>
					<view class="bargain-btn-box dis-flex flex-x-between flex-y-center">
						<view style="margin-top: 50upx;" v-if="$status == '1' && isUserSelf" class="btns p-r main-bg-color auxiliary-color" :style="{'margin-left': '15px'}"
						 @click="groupHelpJoin">
							召唤小伙伴帮砍
							<!-- #ifdef MP-TOUTIAO -->
							<button class="reason-btn" open-type="share"></button>
							<!-- #endif -->
						</view>
						<block v-if="!isUserSelf">
							<view style="margin-top: 50upx;" class="btns" :class="{'help': $status == '1'}" v-if="isUseBargain" @click="goShopDetail">我也要砍价</view>
							<block v-if="detail.is_help === 1">
								<view style="margin-top: 50upx;" class="btns end">您已帮好友砍过了</view>
							</block>
							<block v-if="detail.is_help === 2">
								<view style="margin-top: 50upx;" v-if="$status == '1'" class="btns" @click="spliceSubmit">帮好友砍一刀</view>
							</block>
							<view style="margin-top: 50upx;" v-if="$status == '2'" class="btns end">已砍至最低价</view>
						</block>
						<block v-if="isUserSelf">
							<view @click="toSubmit" style="margin: 0 40upx 0;" v-if="$status == '2' && detail.is_buy != 20" class="btns">{{settingData.currency}}{{detail.buy_price}}
								购买</view>
							<view @click="toSubmit" style="margin: 50upx 40upx 0;" v-if="$status == '1' && detail.buy_setting == '2'" class="btns">{{settingData.currency}}{{detail.buy_price}}
								购买</view>
						</block>
					</view>
					<view class="bargain-gap help-border-color" v-if="$status == '1' || $status == '2'">
						<view class="dot left help-bg-color"></view>
						<view class="dot right help-bg-color"></view>
					</view>
					<view class="bargain-info help-border-color">
						<view class="tabs-box dis-flex flex-y-center">
							<view class="tabs " :class="{'current-l help-bg-color': tabIndex == 1}" @click="tabIndex = 0">砍价伙伴</view>
							<view class="tabs" :class="{'current-r help-bg-color': tabIndex == 0}" @click="tabIndex = 1">快速砍价攻略</view>
						</view>
						<view class="bargain-list" v-if="tabIndex == 0">
							<view v-for="(item,index) in $help_user" :key="index" v-if="tabIndex == 0" class="dis-flex flex-y-center visit-item">
								<view class="user-logo" :style="{'background-image': `url(${item.user ? item.user.avatarUrl : ''})`}"></view>
								<view class="dis-flex flex-x-between flex-y-center" style="flex:1;">
									<view class="dis-flex flex-dir-column" style="margin-left: 30upx;">
										<text class="f-28 col-3 scale-grow onelist-hidden">{{item.user ? item.user.nickName : ''}}</text>
										<text class="f-24 col-9">拔刀相助，在所不辞</text>
									</view>
									<view class="f-24 dis-flex flex-y-center">
										<image style="width: 20px; height: 20px;margin-right: 10upx;" mode="widthFix" src="/static/images/bargain/cut.png"></image>砍掉{{item.money}}
									</view>
								</view>
							</view>
						</view>
						<view v-if="tabIndex == 1" class="dis-flex flex-dir-column" style="padding: 0 30upx;">
							<view class="dis-flex flex-x-between flex-y-center" style="flex:1;padding: 15px 0 30upx;border-bottom: 1px solid #eeeeee;">
								<view class="dis-flex flex-dir-column">
									<text class="f-28 col-3">进店铺逛逛</text>
									<text class="f-24 col-9">进入店铺逛逛可多砍一刀</text>
								</view>
								<view class="go-visit f-24" v-if="$visit.business_visit == 0" @click="toStoreDetail">去逛逛</view>
								<view class="go-visit f-24" v-if="$visit.business_visit == 1">已完成</view>
							</view>
							<view class="dis-flex flex-x-between flex-y-center" style="flex:1;padding: 20upx 0 30upx">
								<view class="dis-flex flex-dir-column">
									<text class="f-28 col-3">浏览商品</text>
									<text class="f-24 col-9">浏览商品可多砍一刀</text>
								</view>
								<view class="go-visit f-24" v-if="$visit.goods_visit == 0" @click="goShopDetail({isVisit:true})">去逛逛</view>
								<view class="go-visit f-24" v-if="$visit.goods_visit == 1">已完成</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="bargain-shops dis-flex flex-y-center padding-box">
				<view class="user-logo" :style="{'background-image': `url(${$bus_detail.bgimg && $bus_detail.bgimg.length >0 ? $bus_detail.bgimg[0] : ''})`}"></view>
				<view class="dis-flex flex-x-between flex-y-center" style="flex:1;">
					<view class="dis-flex flex-dir-column" style="margin-left: 30upx;">
						<text class="f-28 col-3">{{$bus_detail.name}}</text>
						<text class="f-24 col-9 onelist-hidden" style="width:360upx;">{{$bus_detail.describe}}</text>
					</view>
					<view class="f-24 go-shop help-border-color" @click="toStoreDetail">进店逛逛</view>
				</view>
			</view>

			<view class="bargain-hot dis-flex flex-dir-column flex-y-center padding-box">
				<view class="hd-title dis-flex flex-x-center flex-y-center">
					<view class="tip fl"></view>
					<view>推荐商品</view>
					<view class="tip fr"></view>
				</view>
				<recommend-goods style="margin: 0 -30upx;" v-if="detail.goods_id" :is-show-title="false" :goods-id="detail.goods_id"
				 :params="{'bargain_id': detail.id}" :isShowCopyRight="false"></recommend-goods>
			</view>
		</view>
		<ShareView ref="shareView" :pid="detail.goods_id" :activitys-id="detail.group_id" :poster-type="'goods'"></ShareView>
		<popup-view :show="showTopPopup" type="center" @clickmask="closePopup">
			<view class="bargain-splice pos-center">
				<image class="img-top" style="width: 150px; height: 150px;" mode="widthFix" :src="getImageRoot('74.png')"></image>
				<view class="splice-content">
					<view class="content-bg f-28">
						<image class="l-img" style="width: 30px; height: 30px;" mode="widthFix" src="/static/images/bargain/bargain-bg1.png"></image>
						<image class="r-img" style="width: 30px; height: 30px;" mode="widthFix" src="/static/images/bargain/bargain-bg2.png"></image>
						<view>已减 <text class="f-58" style="color:rgb(255,68,68);">{{splicePrice}}元</text></view>
						<view v-if="!(visitBargain() && isUserSelf)" style="margin-top:30upx;">第一刀, 砍得漂亮</view>
						<view v-if="hasCoupon" class="coupon-info dis-flex flex-dir-column flex-x-center f-24">
							<view class="dis-flex flex-dir-column" style="margin-bottom: 15upx;">
								<view class="dis-flex flex-x-between">
									<text>{{$coupon.name}}</text>
									<text>{{$coupon.coupon_type === 20?"折":settingData.currency}}{{$coupon.coupon_type === 40 ? ($coupon.min+"-"+$coupon.max) : $coupon.coupon_type === 20 ? $coupon.discount : $coupon.reduce_price}}</text>
								</view>
								<view>
									{{$coupon.rule === 0 ? coupon_price[$coupon.coupon_type]['textRule']+$coupon.rule_min_money:''}}{{coupon_price[$coupon.coupon_type]['textPrev']}}{{$coupon.coupon_type === 40 ? ($coupon.min+"-"+$coupon.max) : $coupon.coupon_type === 20 ? $coupon.discount : $coupon.reduce_price}}{{coupon_price[$coupon.coupon_type]['textLast']}}
								</view>
							</view>
							<view style="padding-top: 15upx;border-top: 1px dashed #FFFFFF;">使用时间: {{$coupon.time.start_time}}~{{$coupon.time.end_time}}</view>
						</view>
						<view v-if="hasCoupon" class="f-20" style="color:rgba(175, 100, 95, 1);margin-top: 10upx;margin-bottom: -10upx;">已放至『我的优惠券』</view>
					</view>
				</view>
				<view class="splice-bts main-bg-color auxiliary-color" v-if="isUserSelf" @click="groupHelpJoin">召唤小伙伴帮忙砍</view>
				<view class="splice-bts main-bg-color auxiliary-color" v-if="isUseBargain" @click="goShopDetail">我也要￥{{detail.low_price}}元拿</view>
			</view>
		</popup-view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import PopupView from "@/components/template/PopManager.vue"
	import ShareView from "@/components/template/ShareView.vue"
	import RecommendGoods from "@/components/template/RecommendGoods.vue"
	import CountDown from "@/components/template/CountDown.vue"
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	// #ifdef H5
	import wxApi from "@/static/h5/wxApi.js"
	// #endif
	export default {
		data() {
			return {
				coupon_price: {
					10: {
						textRule: '满',
						textPrev: '减免',
						textLast: '元'
					},
					20: {
						textRule: '满',
						textPrev: '打',
						textLast: '折'
					},
					30: {
						textRule: '满',
						textPrev: '减免',
						textLast: '元'
					},
					40: {
						textRule: '满',
						textPrev: '随机减',
						textLast: '元'
					}
				},
				tabIndex: 0,
				showBargainnfo: false,
				isReady: false,
				splicePrice: '00.00',
				isSettingStatus: false,
				popupType: "param", //弹框类型
				showTopPopup: false,
				shareData: null, //分享数据
				detail: {},
				activityData: null,
				last_number: {},
				status: null, //  1进行中，2成功，3失败
				coupon: null,
				activityStatus: {},
				disabled: false, //砍价按钮禁用
			};
		},
		components: {
			ShareView,
			PopupView,
			RecommendGoods,
			CountDown,
			Parse
		},
		computed: {
			isUserSelf() {
				return this.detail.recommend == 2
			},
			isUseBargain() {
				return this.detail.recommend == 1 && this.detail.is_use_bargain == 1
			},
			isBargainOver() {
				return this.$status == 4 && this.$status == 3
			},
			$coupon() {
				return this.coupon || {}
			},
			hasCoupon() {
				return Object.keys(this.$coupon).length > 0
			},
			$help_array() {
				const {
					help_array
				} = this.detail;
				return help_array || [];
			},
			hasHelpArray() {
				return Object.keys(this.$help_array).length > 0
			},
			$help_user() {
				const {
					help_user
				} = this.detail;
				return help_user || [];
			},
			isVisit() {
				return !!this.visitBargain() && this.isUserSelf;
			},
			$visit() {
				const {
					visit
				} = this.detail;
				return visit || {};
			},
			$goods() {
				const {
					goods
				} = this.detail;
				return goods || {};
			},
			$bus_detail() {
				const {
					bus_detail
				} = this.detail;
				return bus_detail || {};
			},
			$user() {
				const {
					user
				} = this.detail;
				return user || {};
			},
			$status() {
				const {
					status
				} = this.detail
				if (typeof status === 'number') {
					return this.isSettingStatus ? `${this.isSettingStatus}` : `${status}`
				}
			},
			$last_number() {
				const {
					end_time
				} = this.detail;
				this.last_number = {
					overtime: end_time
				};
				return this.last_number;
			}
		},
		onLoad(e) {
			this.pageLoad(e);
		},
		onShow() {
			let token = uni.getStorageSync("token"),
				{
					bargain_id,
					goods_id,
					goods_sku_id,
					group_id
				} = this;
			this.getBargainDetail();
		},
		onUnload() {
			clearInterval(this.endTimer);
			this.closePopup()
		},
		methods: {
			pageLoad(e) {
				let _this = this,
					scene = App.getSceneData(e),
					{
						g, // group_id
					} = scene,
					bargain_id = e.bargain_id ? e.bargain_id : "",
					goods_id = e.goods_id ? e.goods_id : "",
					goods_sku_id = e.goods_sku_id ? e.goods_sku_id : "",
					again_bargain = e.again_bargain ? e.again_bargain : null,
					group_id = g ? g : (e.group_id || "");
				// 商品id
				_this.bargain_id = bargain_id;
				_this.goods_id = goods_id;
				_this.goods_sku_id = goods_sku_id;
				_this.group_id = group_id;
				_this.again_bargain = again_bargain;
				_this.options = e;
				console.log(e, '$target')
			},
			closePopup() {
				this.showTopPopup = false;
				uni.removeStorageSync('bargainvisit');
			},
			visitBargain() {
				return uni.getStorageSync('bargainvisit');
			},
			toStoreDetail() {
				App.navigationTo({
					url: 'pages/subPages/store/index?' + App.urlEncode({
						bus_id: this.$bus_detail.id,
						group_id: this.detail.group_id
					}),
					success() {

					}
				});
			},
			toSubmit() {
				let _this = this,
					detail = _this.detail;
				// 立即购买
				App.navigationTo({
					url: 'pages/subPages/flow/checkout?' + App.urlEncode({
						order_type: '5',
						goods_id: detail.goods_id,
						goods_num: 1,
						goods_sku_id: _this.goods_sku_id || detail.spec_sku_id,
						transport_type: _this.$goods.transport_type,
						is_express: _this.$goods.isexpress,
						is_zt: _this.$goods.iszt,
						group_id: detail.group_id
					}),
					success() {

					}
				});
			},
			groupHelpJoin() {
				// #ifndef MP-TOUTIAO
				this.$refs.shareView.shareswich();
				// #endif
				this.closePopup();
			},
			spliceSubmit() {
				let _this = this;
				if (_this.disabled) return
				_this.disabled = true;
				App._get('bargain.Bargain/helpBargain', _this.getParams(), (result) => {
					const {
						data: {
							coupon,
							money,
							progress,
							time
						},
						code
					} = result;
					if (code) {
						if (coupon) {
							let {
								start_time,
								end_time,
							} = time;
							coupon.time = {
								start_time: _this.$util.formatTime(start_time, "date", "."),
								end_time: _this.$util.formatTime(end_time, "date", ".")
							};
						}
						_this.splicePrice = money;
						_this.showTopPopup = !0;
						_this.coupon = coupon;
						_this.detail.progress = progress;
						_this.getBargainDetail();
						console.log(_this.splicePrice, money, 'this.splicePrice')
					}
				});
			},
			getParams() {
				const {
					bargain_id,
					goods_id,
					goods_sku_id,
					group_id,
					again_bargain
				} = this,
				visitBargain = this.visitBargain();
				const params = {
					bargain_id,
					goods_id,
					goods_sku_id
				}

				if (!!again_bargain && typeof again_bargain === 'string') {
					params.again_bargain = again_bargain
				}

				return !group_id && !visitBargain ? params : {
					group_id: visitBargain ? visitBargain.split('|')[1] : group_id
				};
			},
			setEndTime() {
				let activityStatus = App.getActivityStatus(0, Number(this.$last_number.overtime));
				this.activityStatus = activityStatus;
				console.log(activityStatus);
			},
			// toGroupsList() {
			// 	App.navigationTo({
			// 		url: "pages/subPages/groups/more/more"
			// 	})
			// },
			goShopDetail({
				isVisit
			}) {
				const params = {
					goods_id: this.detail.goods_id
				}

				//判断是否重新发起砍价
				if ((this.$status == '4' || this.$status == '3') && this.isUserSelf) {
					params.again_bargain = '1';
				}

				if (isVisit) {
					params.bargain_group_id = this.detail.group_id
				}
				console.log(App.urlEncode(params), 'App.urlEncode(params)');
				App.navigationTo({
					url: "pages/subPages/goods/index/index?" + App.urlEncode(params)
				})
			},
			getBargainDetail() {
				let _this = this;
				App._get('bargain.Bargain/getBargainDetail', _this.getParams(), function(result) {
					const {
						data: bargainData = {}
					} = result;
					_this.detail = bargainData;
					_this.activityData = {
						goods_id: bargainData.goods_id,
						group_id: bargainData.group_id
					}
					_this.setEndTime();
					const visitBargain = _this.visitBargain();
					const isVisit = (bargainData.recommend == 2 && visitBargain);
					if (_this.hasHelpArray || isVisit) {
						_this.splicePrice = isVisit ? visitBargain.split('|')[0] : _this.$help_array.money;
						_this.showTopPopup = !0;
					}
					//解除禁用
					_this.disabled = false;
					//设置分享信息
					if (_this.appClientType !== "3") {
						_this.shareData = App.getPageShareData("bargain", result.data);
					}
					App.hideLoading();
				});
			}
		},
		onPullDownRefresh() {
			this.getBargainDetail();
		},
		onShareAppMessage(e) {
			return this.shareData
		}
	}
</script>

<style lang="scss">
	page {
		background: linear-gradient(0deg, var(--help-color) 0%, var(--help-color) 100%);
	}

	.price-color {
		color: #FE504F;
	}

	.bargain-top-info {
		position: relative;
		background: #FFFFFF;
		width: 80vw;
		padding: 0;
		border-radius: 0 0 10upx 10upx;

		.img-center {
			position: relative;
			background-position: center;
			background-size: cover;
			background-repeat: no-repeat;
			height: 180rpx;

			text {
				top: 35%;
				color: #FFFFFF;
				font-size: 44upx;
				font-weight: bold;
				letter-spacing: 4upx;
			}
		}

		.info-list-box {
			padding: 30upx;
			height: 480upx;
			line-height: 48upx;
			letter-spacing: 5upx;
			overflow-x: hidden;
			overflow-y: auto;
		}

		.close-btn {
			position: absolute;
			bottom: -80upx;
			color: #FFFFFF;
			zoom: 1.5;
			left: 50%;
			transform: translateX(-50%);
		}
	}

	.bargain-section {
		background: #FFFFFF;
		padding: 0 30upx;

		.bargain-shopping {
			padding: 20upx;
			background: rgba(255, 240, 233, 1);
			border-radius: 10upx;

			.bargain-price {
				color: #FF4444;
			}
		}
	}

	.bargain-splice {
		width: 600upx;
		height: auto;
		padding: 150upx 50upx 40upx 50upx;
		background: linear-gradient(180deg, rgba(255, 118, 66, 1) 0%, rgba(255, 68, 67, 1) 100%);
		border-radius: 6upx;

		.img-top {
			position: absolute;
			top: 0;
			left: 50%;
			margin-top: -100upx;
			transform: translateX(-50%);
		}

		.splice-content {
			background: rgb(203, 61, 0);
			padding: 10upx;
			border-radius: 6upx;

			.content-bg {
				position: relative;
				padding: 20upx 0;
				text-align: center;
				border-radius: 6upx;
				background: rgb(255, 242, 191);
				width: 100%;

				.l-img {
					position: absolute;
					left: 50upx;
					top: -78upx;
				}

				.r-img {
					position: absolute;
					right: 50upx;
					top: -78upx;
				}

				.coupon-info {
					width: 95%;
					padding: 20upx;
					box-sizing: border-box;
					margin: 20upx auto 0;
					color: #FFFFFF;
					height: 166upx;
					text-align: left;
					background: linear-gradient(0deg, rgba(255, 69, 68, 1) 0%, rgba(255, 117, 66, 1) 100%);
					border-radius: 10upx;
				}
			}
		}

		.splice-bts {
			text-align: center;
			height: 80upx;
			margin-top: 50upx;
			line-height: 80upx;
			font-size: 28upx;
			border-radius: 2em;
			background: rgb(255, 217, 64);
			color: rgba(183, 2, 1, 1);
		}
	}

	.bargain-hot {
		.recommend-container {
			.module-content {
				padding: 0;
			}
		}

		.hd-title {
			margin-bottom: -20upx;
			color: #FF4444;
			font-weight: bold;
			font-style: italic;
			font-size: 30upx;
			padding: 26upx 0;

			.tip {
				width: 120upx;
				height: 2upx;

				&.fl {
					margin-right: 20upx;
					background: linear-gradient(84deg, rgba(255, 255, 255, 1) 0%, rgba(255, 178, 164, 1) 100%);
				}

				&.fr {
					margin-left: 20upx;
					background: linear-gradient(-87deg, rgba(255, 255, 255, 1) 0%, rgba(255, 178, 164, 1) 100%);
				}
			}
		}

		.items-goods {
			width: 48%;

			.goods-img {
				width: 100%;
				border-radius: 10px;
				padding-bottom: 100%;
				background: #FB6B25;
				margin-bottom: 21upx;
			}

			.goods-desc {
				color: #333333;
				font-size: 30upx;
				margin-bottom: 15upx;
			}
		}
	}

	.bargain-shops {
		.user-logo {
			width: 80upx;
			height: 80upx;
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
			border-radius: 10upx;
		}

		.go-shop {
			width: 150upx;
			text-align: center;
			line-height: 50upx;
			height: 50upx;
			border: 1px solid rgba(252, 80, 48, 1);
			border-radius: 25upx;
		}
	}

	.bargain-gap {
		position: relative;
		width: 100%;
		height: 0;
		margin: 40upx 0;
		border-top: 1px dashed rgba(255, 68, 68, 1);
		$r: 26upx;
		$t: -16upx;
		$m: -42upx;

		.dot {
			position: absolute;
			background: rgb(251, 74, 47);
			top: $t;
			width: $r;
			height: $r;
			border-radius: $r;

			&.left {
				left: $m;
			}

			&.right {
				right: $m;
			}
		}
	}

	.bargain-info {
		position: relative;
		margin-bottom: -50upx;
		width: 100%;
		overflow-x: hidden;
		background: rgba(255, 255, 255, 1);
		border: 4upx solid rgba(252, 80, 48, 1);
		border-radius: 20px;

		.bargain-list {
			width: 100%;
			max-height: 600upx;
			// min-height: 200upx;
			overflow-y: auto;
			overflow-x: hidden;
		}

		.scale-grow {
			width: 300upx;
		}

		.visit-item {
			padding-top: 20upx;
			margin-left: 30upx;
			margin-right: 30upx;
			padding-bottom: 30upx;

			&:not(:nth-last-child(1)) {
				border-bottom: 1px solid #eeeeee;
			}
		}

		.go-visit {
			width: 130upx;
			height: 50upx;
			background: rgba(252, 80, 48, 0.1);
			border-radius: 10upx;
			text-align: center;
			line-height: 50upx;
			color: #333333;
		}

		.tabs {
			flex: 1;
			text-align: center;
			line-height: 70upx;
			font-size: 28upx;
			height: 70upx;
			background: #FFFFFF;
			color: rgba(252, 80, 48, 1);

			&.current-l {
				color: rgba(254, 254, 254, 1);
				border-radius: 20upx 0 20upx 0;
				background: rgba(252, 80, 48, 1);
			}

			&.current-r {
				color: rgba(254, 254, 254, 1);
				border-radius: 0 20upx 0 20upx;
				background: rgba(252, 80, 48, 1);
			}
		}

		.user-logo {
			width: 60upx;
			height: 60upx;
			border-radius: 60upx;
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
		}
	}

	.bargain-btn-box {
		width: 100%;

		.btns {
			font-size: 28upx;
			line-height: 80upx;
			text-align: center;
			color: #FFFFFF;
			height: 80upx;
			background: linear-gradient(-20deg, rgba(250, 70, 43, 1) 0%, rgba(251, 107, 37, 1) 100%);
			background: linear-gradient(-20deg, var(--help-color) 0%, var(--help-color) 100%);
			border-radius: 2em;
			flex: 1;
			margin: 0 10upx;

			&.help {
				background: linear-gradient(-20deg, rgba(252, 157, 45, 1) 0%, rgba(253, 183, 71, 1) 100%);
				background: linear-gradient(-20deg, var(--help-color) 0%, var(--help-color) 100%);
			}

			&.end {
				background: rgba(204, 204, 204, 1);
			}
		}
	}

	.goods-buy-menu {
		height: 68vh;
	}

	.view-content {
		height: 100%;
		padding-top: 30upx;
		padding-bottom: 30upx;
		background-repeat: no-repeat;
		background-size: cover;
	}

	.padding-box {
		padding: 30upx;
		margin-left: 30upx;
		margin-right: 30upx;
		border-radius: 10upx;
		background: #FFFFFF;
		margin-bottom: 20upx;
	}

	.step-box {
		position: relative;

		.user-img {
			width: 60upx;
			height: 60upx;
			border-radius: 50%;
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
		}

		.help-info {
			position: absolute;
			color: #FFFFFF;
			right: 0;
			margin-right: -42upx;
			padding-left: 25upx;
			line-height: 40upx;
			font-size: 20upx;
			width: 150upx;
			height: 40upx;
			background: linear-gradient(-51deg, rgba(250, 70, 43, 1) 0%, rgba(251, 107, 37, 1) 100%);
			background: linear-gradient(-20deg, var(--help-color) 0%, var(--help-color) 100%);
			border-radius: 20upx 0 0 20upx;
		}
	}

	.step-shop {
		position: relative;
		margin-top: 30upx;
		margin-bottom: 30upx;
		background: rgba(246, 246, 246, 1);
		border-radius: 10upx;
		padding: 30upx;
		overflow: hidden;

		.over-status {
			display: none;
		}

		&.over-time {
			color: rgba(153, 153, 153, 1) !important;

			.price-color {
				color: rgba(153, 153, 153, 1) !important;
			}

			.over-status {
				display: inline-block;
				position: absolute;
				font-size: 24upx;
				white-space: nowrap;
				right: -70upx;
				bottom: -70upx;
				width: 140upx;
				text-align: center;
				line-height: 40upx;
				height: 140upx;
				background: rgb(204, 204, 204);
				color: #FFFFFF;
				transform: rotate(-45deg);
			}
		}

		.img-logo {
			position: relative;
			font-size: 0;

			.goods-img {
				width: 200upx;
				height: 200upx;
				border-radius: 6upx;
				margin-right: 28upx;
			}
		}

		.goods-info {
			.title {
				margin-bottom: 10upx;
			}
		}
	}

	.group-box {
		.progress {
			width: 100%;
			height: 10upx;
			background: #EEEEEE;
			border-radius: 14upx;

			.current-num {
				position: relative;
				height: 100%;
				border-radius: 14upx;
				background: linear-gradient(90deg, rgba(254, 80, 79, 1) 0%, rgba(254, 133, 79, 1) 100%);
				background: linear-gradient(-20deg, var(--help-color) 0%, var(--help-color) 100%);

				.current-dot {
					left: 100%;
					width: 30upx;
					height: 30upx;
					background: rgba(254, 82, 79, 1);
					background: var(--help-color);
					border-radius: 50%;
				}
			}
		}
	}

	.group-box .group-time {
		margin-bottom: 45upx;
	}

	.group-box .group-time .group-date {
		color: #333333;
		padding: 0 10upx;
	}

	.group-box .group-time .group-hms {
		color: #FF4444;
	}

	.group-box .group-time .group-hms .date {
		display: inline-block;
		width: auto;
		height: 31upx;
		margin: 0 8upx;
		padding: 0 2upx;
		text-align: center;
		color: #FFFFFF;
		line-height: 31upx;
		background: #FF4444;
			background: var(--help-color);
		border-radius: 4upx;
	}

	.group-box .group-result {
		width: 38upx;
		height: 38upx;
		margin-right: 16upx;
		border-radius: 38upx;
		line-height: 1.2;
		background: #FFD940;
			background: var(--theme-color);
		color: #333333;
		text-align: center;
	}

	.group-box .group-result .iconfont {
		height: 45upx;
		width: 45upx;
	}

	.group-box .group-title {
		color: #999999;
		font-size: 28upx;
		margin-bottom: 25upx;
	}

	.group-box .group-title text {
		color: #FE504F;
	}

	.group-box .group-join {
		padding: 0 50upx;
	}

	.group-box .group-join .group-img-box {
		position: relative;
		width: 20%;
		margin-bottom: 40upx;
	}

	.group-box .group-join .group-img-box .is-admin {
		position: absolute;
		bottom: -5upx;
		text-align: center;
		width: 50upx;
		border-radius: 50upx;
		height: 20upx;
		line-height: 20upx;
		font-size: 18upx;
		color: #333333;
		background: #FFD940;
			background: var(--theme-color);
	}

	.group-box .group-join .group-img,
	.group-box .group-join .null-img,
	.group-info .null-img {
		width: 60upx;
		height: 60upx;
		border-radius: 60upx;
		border: 1px dashed #CCCCCC
	}

	.group-box .group-join .null-img,
	.group-info .null-img {
		color: #999999;
		background: #FFFFFF;
		text-align: center;
		line-height: 60upx;
	}

	.group-button {
		height: 76upx;
		width: 100%;
		line-height: 76upx;
		font-size: 24upx;
		background: #FFD940;
		background: var(--theme-color);
		color: #333333;
		text-align: center;
		border-radius: 76upx;
		margin-bottom: 20upx;
	}

	.group-goods {
		position: relative;
	}

	.group-goods .link-dot {
		position: absolute;
		top: -40upx;
	}

	.group-goods .link-dot.left {
		left: 30upx;
	}

	.group-goods .link-dot.right {
		right: 30upx;
	}

	.group-goods .link-dot .point {
		position: absolute;
		left: -5upx;
		border-radius: 10upx;
		width: 16upx;
		height: 16upx;
		background: rgba(251, 70, 45, 1);
			background: var(--help-color);
		border-radius: 50%;
	}

	.group-goods .link-dot .point.top {
		top: -4upx;
	}

	.group-goods .link-dot .point.bottom {
		bottom: -4upx;
	}

	.group-goods .link-dot .line {
		position: relative;
		z-index: 2;
		height: 60upx;
		background: #D6D6D6;
		width: 8upx;
		background: linear-gradient(-56deg, rgba(255, 195, 159, 1) 0%, rgba(255, 231, 217, 1) 100%);
		border-radius: 4upx;
	}

	.group-goods .goods-list {
		margin-bottom: 30upx;
	}

	.group-goods .goods-list:nth-last-of-type(1) {
		margin-bottom: 0;
	}

	.group-goods .goods-list .img-logo {
		position: relative;
		margin-right: 30rpx;
	}

	.group-goods .goods-list .img-logo .goods-img {
		width: 170upx;
		height: 170upx;
		border-radius: 10upx;
		margin-right: 28upx;
	}

	.group-goods .goods-list .img-logo .group-num {
		position: absolute;
		top: 0;
		left: 0;
		font-size: 24upx;
		line-height: 38upx;
		color: #FFFFFF;
		width: 76upx;
		height: 38upx;
		background: linear-gradient(90deg, rgba(254, 80, 79, 1), rgba(254, 133, 79, 1));
		background: linear-gradient(90deg, var(--help-color), var(--help-color));
		
		box-shadow: 0 2upx 10upx 0 rgba(254, 80, 79, 0.54);
		border-radius: 10upx 0 6upx 0;
		z-index: 2;
		text-align: center;
	}

	.group-goods .goods-info {
		flex-grow: 1;
		width: 0;
	}

	.group-goods .goods-info .title {
		color: #000000;
		font-size: 28upx;
		font-weight: 400;
		line-height: 40upx;
	}

	.group-goods .goods-info .desc {}

	.group-goods .goods-info .now {
		color: #FE504F;
		font-size: 24upx;
		margin: 20upx 0
	}

	.group-goods .goods-info .price .old {
		font-size: 24upx;
		color: #999999;
	}

	.group-goods .goods-info .price .num {
		font-size: 24upx;
		color: #999999;
	}

	.group-info .title {
		font-size: 30upx;
		color: #333333;
		margin-bottom: 40upx
	}

	.group-info .title .line {
		margin-right: 10upx;
		width: 6upx;
		height: 30upx;
		line-height: 30upx;
		background: #FFD940;
		background: var(--theme-color);
		
		border-radius: 3upx;
	}

	.group-info .info-list {
		margin-bottom: 70upx;
	}

	.group-info .info-list .time {
		color: #999999;
		font-size: 24upx;
	}

	.group-info .info-list .info-img {
		width: 60upx;
		height: 60upx;
		border-radius: 60px;
		margin-right: 10upx
	}

	.group-info .info-list .null-img {
		width: 58upx;
		height: 58upx;
		border-radius: 58upx;
		margin-right: 10upx;
	}

	.group-info .info-list .info-img+text,
	.group-info .info-list .null-img+text {
		font-size: 30upx;
		color: #333333;
	}

	.group-info .button-more {
		font-size: 24upx;
		color: #999999;
		margin-top: -20upx;
	}

	.buy-button-box .buy-button.no-stock {
		color: rgba(0, 0, 0, 0.6);
		background: #DEDEDE;
	}
</style>
