<template>
	<view :style="themeColor">
		<view class="view-content">
			<view class="step-box padding-box">
				<view class="step dis-flex flex-dir-column">
					<view class="step__head is-finish step__start">
						<view class="step__arc"></view>
					</view>
					<text class="top">选择商品</text>
					<text>开团/参团</text>
				</view>
				<view class="step dis-flex flex-dir-column" :class="{current: $status === '0'}">
					<view class="step__head is-finish step__center">
						<view class="step__line"></view>
						<view class="step__arc"><text v-if="$status === '0'" class="step__check iconfont icon-check"></text></view>
					</view>
					<text class="top">邀请好友</text>
					<text>好友参团</text>
				</view>
				<!-- {{isReady}} -->
				<view class="step dis-flex flex-dir-column" :class="{current: $status !== '0'}">
					<view class="step__head step__end" :class="{'is-finish': $status !== '0'}">
						<view class="step__line"></view>
						<view class="step__arc"><text v-if="$status !== '0'" class="step__check iconfont icon-check"></text></view>
					</view>
					<block v-if="$status === '1' || $status === '0' || $status === '3'">
						<text class="top">人满成功</text>
						<text>拼团成功</text>
					</block>
					<block v-if="$status === '2'">
						<text class="top">失败</text>
						<text>拼团失败</text>
					</block>
				</view>
			</view>

			<view class="group-box padding-box">
				<view class="group-time dis-flex flex-dir-row flex-y-center flex-x-center">
					<block v-if="$status === '0'">
						<text class="iconfont icon-dengdai"></text>
						<view class="group-date f-24">剩余</view>
						<view class="group-hms f-22">
							<CountDown :leftTime="activityStatus.leftTime" color="#FFFFFF" backgroundColor="#333333" splitorColor="#333333"
							 @timeEnd="getGroupsDetail({order_id,groups_group_id,groups_end:1})"></CountDown>
							<!-- <text class="date hh">{{hh}}</text>:
							<text class="date mm">{{mm}}</text>:
							<text class="date ss">{{ss}}</text> -->
						</view>
					</block>
					<block v-if="$status !== '0'">
						<view class="dis-flex flex-dir-row flex-y-center flex-x-between">
							<view class="group-result dis-flex flex-dir-row flex-y-center flex-x-between">
								<text v-if="$status === '2'" class="iconfont icon-close"></text>
								<text v-if="($status === '1' || $status === '3')" class="iconfont icon-check"></text>
							</view>
							<text class="f-w">{{($status === '1' || $status === '3') ? '拼团成功' : '拼团失败'}}</text>
						</view>
					</block>
				</view>
				<view v-if="$lastnumber && $status === '0'" class="group-title dis-flex flex-dir-row flex-y-center flex-x-center">
					还差<text>{{$lastnumber}}人</text>成团，赶紧邀请好友加入
				</view>
				<view class="group-join dis-flex flex-dir-row flex-y-center flex-x-center flex-warp">
					<view class="group-img-box dis-flex flex-dir-row flex-y-center flex-x-center" v-for="(item,index) in $userData"
					 :key="index">
						<image v-if="item.avatarUrl" class="group-img" :src="item.avatarUrl" mode=""></image>
						<view v-else class="null-img">?</view>
						<text v-if="item.groups_captain === 1" class="is-admin auxiliary-color" >团长</text>
					</view>
				</view>
				<block v-if="isUserSelf">
					<view v-if="$status === '0'" class="group-button p-r auxiliary-color" @click="groupHelpJoin">
						邀请好友参团
						<!-- #ifdef MP-TOUTIAO || MP-ALIPAY -->
						<button class="report-btn" open-type="share"></button>
						<!-- #endif -->
					</view>
				</block>
				<block v-if="!isUserSelf">
					<view v-if="$status !== '0'" class="group-button" @click="toGroupsList">查看拼团列表</view>
					<view v-else class="group-button" @click="onToggleTrade">参与拼团</view>
				</block>
			</view>

			<view class="group-goods padding-box">
				<view class="link-dot left">
					<view class="point top"></view>
					<view class="point bottom"></view>
					<view class="line"></view>
				</view>
				<view class="link-dot right">
					<view class="point top"></view>
					<view class="point bottom"></view>
					<view class="line"></view>
				</view>
				<view class="goods-list dis-flex flex-dir-row flex-x-between flex-y-center" v-if="detail.goods_id" @click="toGoodsInfo(detail.goods_id, detail.groups_id)">
					<view class="img-logo">
						<view class="group-num">{{detail.group_number}}人团</view>
						<image v-if="detail.image" class="goods-img" :src="detail.image[0]['file_path']" mode=""></image>
					</view>
					<view class="goods-info">
						<text class="title twolist-hidden">
							{{detail.goods_name}}
						</text>
						<view class="desc dis-flex flex-dir-column">
							<text class="now">{{settingData.currency}}{{detail.groups_price}}</text>
							<view class="price dis-flex flex-dir-row flex-x-between flex-y-center">
								<text class="old">{{settingData.currency}}{{detail.price}}</text>
								<text class="num">已拼{{detail.already_spell}}件</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="group-info padding-box">
				<view class="title dis-flex flex-dir-row flex-y-center">
					<view class="line"></view><text>拼团记录</text>
				</view>
				<view v-for="(item, index) in $orderData" :key="index" class="info-list dis-flex flex-dir-row flex-y-center flex-x-between">
					<view class="dis-flex flex-dir-row flex-y-center">
						<image v-if="item.user.avatarUrl" class="info-img" :src="item.user.avatarUrl" mode=""></image>
						<view v-else class="null-img">?</view>
						<text>{{item.user.nickName}}</text>
					</view>
					<text class="time">{{item.create_time}}</text>
				</view>
				<view class="button-more dis-flex flex-dir-row flex-y-center flex-x-center" @click="getMore">
					<text>{{isGetMore?'暂无更多':'查看更多'}}</text>
				</view>
			</view>
		</view>
		<!-- 购买菜单 -->
		<GoodsBuyMenu ref="goodsBuyMenu" @submit="submit" :group-buy-type="'2'" :goods-detail="detail" :goods-spec="specData"
		 :goods-activity="goodsActivity" :spec-disabled="true"></GoodsBuyMenu>
		<ShareView ref="shareView" :pid="detail.goods_id" :activitys-id="detail.groups_group_id" :poster-type="'goods'"></ShareView>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import PopupView from "@/components/template/PopManager.vue"
	import ShareView from "@/components/template/ShareView.vue"
	import GoodsBuyMenu from "@/components/template/GoodsBuyMenu.vue"
	import CountDown from "@/components/template/CountDown.vue"
	// #ifdef H5
	import wxApi from "@/static/h5/wxApi.js"
	// #endif
	export default {
		data() {
			return {
				isReady: false,
				isSettingStatus: false,
				isSpecSignid: true,
				showBuyMenu: false,
				showContact: false,
				showGoodsSpec: false,
				showGoGroup: false,
				popupType: "param", //弹框类型
				showTopPopup: false,
				shareData: null, //分享数据
				isGetMore: false,
				order_id: null,
				orderData: [],
				detail: {},
				last_number: {},
				userData: [],
				status: null, // 0拼团中 1成功 2失败
				activityStatus: {
					status: 0,
					leftTime: 0
				}, //活动状态
				param: {}, // 商品参数
				serve: null, // 商品服务
				goods_price: 0, // 商品价格
				line_price: 0, // 划线价格
				stock_num: 0, // 库存数量
				limit_buy: 0, //是否开启限购
				surplus_quantity: 0, //用户可购买数量
				image_path: "", //购买图片
				goods_num: 1, // 商品数量
				goods_sku_id: "", // 规格id
				cart_total_num: 0, // 购物车商品总数量
				specData: [], // 多规格信息
				scrollIntoView: "",
				showBottomPopup: false,
				goods_spec_arr: [],
				goods_spec_text: [],
				orther_id: null,
				user_id: null,
				activityData: null,
				skuItem: null,
				goodsActivity: {},
				groups_group_id: ""
			};
		},
		components: {
			ShareView,
			PopupView,
			GoodsBuyMenu,
			CountDown
		},
		computed: {
			isUserSelf() {
				return (this.user_id == this.orther_id) && this.groups_group_id == "";
			},
			$status() {
				const status = this.status
				if (typeof status === 'number') {
					return this.isSettingStatus ? `${this.isSettingStatus}` : `${status}`
				}
			},
			$last_number() {
				return this.last_number || {}
			},
			$lastnumber() {
				const {
					lastnumber
				} = this.$last_number || {}
				if (typeof lastnumber === 'number') {
					return `${lastnumber}`
				}
			},
			$userData() {
				return Array.isArray(this.userData) ? this.userData.reverse() : []
			},
			$orderData() {
				return Array.isArray(this.orderData) ? this.orderData : []
			}
		},
		onLoad(e) {
			this.pageLoad(e);
		},
		onShow() {
			let token = uni.getStorageSync("token"),
				{
					order_id,
					groups_group_id
				} = this;
			console.log('onShow',{order_id,
					groups_group_id})
			if (/* token && */(order_id || groups_group_id)) {
				this.getGroupsDetail({
					order_id: order_id || '',
					groups_group_id: groups_group_id || ''
				});
			}
		},
		onUnload() {
			clearInterval(this.endTimer);
		},
		mounted() {

		},
		methods: {
			pageLoad(e) {
				let _this = this,
					scene = App.getSceneData(e),
					user_id = App.getUserId(),
					{
						a, //groups_group_id
						b, //orther_id
					} = scene,
					groups_group_id = a ? a : (e.groups_group_id || ""),
					orther_id = b ? b : (e.orther_id || user_id),
					order_id = e.order_id ? e.order_id : "";

				console.log(scene);
				// 商品id
				_this.order_id = order_id;
				_this.user_id = Number(user_id);
				_this.orther_id = Number(orther_id);
				_this.groups_group_id = groups_group_id;
				_this.options = e;
			},
			toGoodsInfo(goods_id, group_id) {
				App.navigationTo({
					url: "pages/subPages/goods/index/index?goods_id=" + goods_id + (!!group_id ? '&group_id=' + group_id : '')
				})
			},
			/**
			 * 已售罄推荐商品
			 */
			isshowTP(data) {
				this.showTopPopup = data;
			},
			/**
			 * 已售罄开关
			 */
			settimeSoldout() {
				this.showTopPopup = true;
			},
			/**
			 * 初始化商品详情数据
			 */
			initGoodsDetailData(data) {
				let _this = this;
				if (data.detail.sku_count === 0) {
					setTimeout(this.settimeSoldout, 2000);
				}
				// 规格id/商品价格/划线价/库存/是否限购/剩余可购买数量
				data.goods_sku_id = data.detail.sku[0].spec_sku_id || "";
				// data.goods_sku_id = ""; //初始规格id为空
				data.goods_price = data.detail.sku[0].groups_price;
				data.line_price = data.detail.sku[0].line_price;
				data.stock_num = data.detail.sku[0].groups_stock;
				data.limit_buy = (data.detail.is_limit === 1 ? 10 : 20);
				data.surplus_quantity = data.detail.limit_num;

				// 单规格商品封面图
				data.image_path = data.detail.image[0]['file_path'];
				// 多规格商品封面图
				if (data.detail.spec_type == 20 && data.detail.sku[0].image) {
					data.image_path = data.detail.sku[0].image['file_path'];
				}


				return data;
			},

			submit(e) {
				let _this = this,
					limit_buy = _this.limit_buy,
					surplus_quantity = _this.surplus_quantity,
					group_buy_type = _this.group_buy_type,
					goods_sku_id = e.goods_sku_id;
				if (limit_buy === 10 && surplus_quantity <= 0) {
					App.showError("购买数量已达上限");
					return;
				}

				if (!this.isSpecSignid) {
					App.showError("请选择有效的规格选项后提交订单");
					return;
				}

				// 立即购买
				console.log({
					order_type: "2",
					goods_id: _this.goods_id,
					goods_num: e.goods_num,
					goods_sku_id: goods_sku_id,
					groups_group_id: _this.detail.groups_group_id,
					transport_type: _this.detail.transport_type,
					is_express: _this.detail.isexpress,
					is_zt: _this.detail.iszt,
					activityId: _this.spike_id || '',
					goods_type: _this.goods_type || '',
					group_id: _this.group_id || ''
				})

				App.navigationTo({
					url: 'pages/subPages/flow/checkout?' + App.urlEncode({
						order_type: "2",
						goods_id: _this.detail.goods_id || '',
						goods_num: e.goods_num,
						groups_group_id: _this.detail.groups_group_id,
						goods_sku_id: goods_sku_id,
						transport_type: _this.detail.transport_type,
						is_express: _this.detail.isexpress,
						is_zt: _this.detail.iszt,
						activityId: _this.spike_id || '',
						goods_type: _this.goods_type || '',
						group_id: _this.detail.groups_id || ''
					}),
					success() {
						// 关闭弹窗
						_this.$refs.goodsBuyMenu.showBuyMenu = false;
					}
				});
			},
			onToggleTrade() {
				// this.groupsBuyMeuns(!this.showBuyMenu);
				// this.showBuyMenu = !this.showBuyMenu;
				this.$refs.goodsBuyMenu.onToggleTrade();
			},
			setEndTime() {
				let activityStatus = App.getActivityStatus(0, Number(this.$last_number.overtime));
				this.activityStatus = activityStatus;
				console.log(activityStatus);
			},
			toGroupsList() {
				App.navigationTo({
					url: "pages/subPages/groups/more/more"
				})
			},
			groupHelpJoin() {
				// #ifndef MP-TOUTIAO || MP-ALIPAY
				this.$refs.shareView.shareswich();
				// #endif
			},
			getMore() {
				const {
					order_id,
					groups_group_id
				} = this;
				this.getGroupsDetail({
					order_id,
					groups_group_id,
					list_rows: 'all'
				})
			},
			getGroupsDetail(params) {
				console.log('getGroupsDetail',params)
				if (!this.isGetMore) {
					let _this = this;
					App._get('groups.Groups/groupDetail', params, function(result) {
						// 初始化商品详情数据
						let data = _this.initGoodsDetailData(result.data);
						console.log("data", data);
						//设置分享信息
						if (_this.appClientType !== "3") {
							console.log('设置分享信息',App.getPageShareData("group", data.detail, _this.$data))
							_this.shareData = App.getPageShareData("group", data.detail, _this.$data);
						}
						_this.activityData = {
							goods_id: data.detail.goods_id,
							group_id: data.detail.groups_id
						}
						_this.goodsActivity = {
							group_id: data.detail.groups_id,
							groupBuyType: "2",
							groupData: data.detail
						}
						if (!params.list_rows) {
							_this.setData(data || {});
							_this.setEndTime();
						} else {
							const {
								data: {
									orderData
								}
							} = result;
							if (!!orderData) {
								_this.orderData = orderData;
								console.log("data", data);
								_this.isGetMore = true;
							}
						}
						App.hideLoading();
					});
				}
			}
		},
		onPullDownRefresh() {
			// this.getGoodsDetail(this.goods_id, this.spike_id, this.goods_type, this.group_id);
		},
		onShareAppMessage(e) {
			console.log('onShareAppMessage',this.shareData)
			return this.shareData
		}
	}
</script>

<style lang="scss">
	@import "index.css";

	page {
		background: #FFD940;
		background-color: var(--theme-color);
	}

	.goods-buy-menu {
		height: 68vh;
	}

	.buy-spec-list {
		margin-top: 30upx;
		height: calc(65vh - 336upx);
		overflow-x: hidden;
		overflow-y: scroll;
		padding-bottom: 20rpx;
	}

	.view-content {
		height: 100%;
		padding-top: 30upx;
		padding-bottom: 30upx;
		background: #FFD940;
		background: var(--theme-color);
	}

	.padding-box {
		padding: 40upx 30upx;
		margin-left: 30upx;
		margin-right: 30upx;
		border-radius: 10upx;
		background: #FFFFFF;
		margin-bottom: 20upx;
	}

	.step-box {
		overflow: hidden;
	}

	.step-box .step {
		text-align: center;
		float: left;
		width: 33.33%;
		font-size: 24upx;
		font-weight: bold;
		color: rgba(153, 153, 153, 1);
		line-height: 38upx;
	}

	.step-box .step .step__head {
		position: relative;
		width: 100%;
		height: 32upx;
	}

	.step-box .step .step__head.step__start {
		padding-left: 50%;
	}

	.step-box .step .step__head .step__line,
	.step-box .step .step__head .step__arc {
		background: #F5F5F5;
	}

	.step-box .step .step__head .step__arc {
		position: relative;
		z-index: 2;
	}

	.step-box .step .step__head.is-finish .step__line,
	.step-box .step .step__head.is-finish .step__arc {
		background: #FFD940;
		background: var(--theme-color);
	}

	.step-box .step .step__head .step__arc {
		width: 14upx;
		height: 14upx;
		border-radius: 50%;
		margin-top: 5px;
	}

	.step-box .step .step__head.step__end .step__arc {
		margin: 5px auto 0;
	}

	.step-box .step .step__head.step__center .step__arc {
		margin: 10upx auto;
	}

	.step-box .step.current .step__head .step__arc {
		margin-top: 0;
	}

	.step-box .step.current .step__head .step__arc {
		width: 32upx;
		height: 32upx;
	}

	.step-box .step .top {
		margin-top: 26upx;
	}

	.step-box .step.current .top {
		font-size: 28upx;
		color: #333333;
	}

	.step-box .step.current .step__head .step__arc .step__check {
		position: absolute;
		color: #000000;
		line-height: 0;
		top: 50%;
		left: 5upx;
		transform: translateY(-50%);
		font-size: 24upx;
	}

	.step-box .step .step__head .step__line {
		position: absolute;
		top: 50%;
		left: -50%;
		width: 100%;
		transform: translateY(-50%);
		height: 2upx;
		border-radius: 1upx;
	}

	.group-box .group-time {
		margin-bottom: 45upx;
	}

	.group-box .group-time .icon-dengdai {
		color: #999999;
		margin-top: -5upx;
	}

	.group-box .group-time .group-date {
		color: #999999;
		padding: 0 10upx;
	}

	.group-box .group-time .group-hms .date {
		width: 31upx;
		height: 31upx;
		margin: 0 5upx;
		padding: 0 2upx;
		color: #FFFFFF;
		line-height: 31upx;
		background: rgba(51, 51, 51, 1);
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
		width: 10upx;
		height: 10upx;
		position: absolute;
		left: -5upx;
		background: #D6D6D6;
		border-radius: 10upx;
	}

	.group-goods .link-dot .point.top {
		top: 0;
	}

	.group-goods .link-dot .point.bottom {
		bottom: 0;
	}

	.group-goods .link-dot .line {
		width: 2upx;
		height: 60upx;
		background: #D6D6D6;
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
