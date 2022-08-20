<template>
	<view :style="themeColor">
		<view class="current-level">
			<view class="user-level dis-flex flex-x-between flex-y-center">
				<view class="user-info dis-flex flex-y-center">
					<image :src="userInfo.avatarUrl" class="user-avatar"></image>
					<view class="user-name f-26 col-level">{{userInfo.nickName}}</view>
				</view>
				<view class="level-info dis-flex flex-y-center">
					<image src="/static/images/level.png" class="level-icon"></image>
					<view class="level f-26 col-level">{{userlevel.leave_title}}</view>
				</view>
			</view>
			<view class="level-list" :style="{'transform': 'translateX('+(50 + 50*current)+'%)'}">
				<view class="level-item" v-for="(item,index) in levelList" :key="index" @click="levelChange(index,item.leave_id)">
					<view class="dis-flex flex-dir-column flex-x-center flex-y-center">
						<view class="level-dot"></view>
						<image src="/static/images/vip.png" class="level-vip" v-if="self_leave === item.leave_id"></image>
						<view class="level-text col-level" :class="[self_leave === item.leave_id?'f-30 f-w':'f-26']">{{item.leave_title}}</view>
					</view>
					<view class="item-line" v-if="index !== levelList.length - 1"></view>
				</view>
			</view>
		</view>
		<view class="upgrade-info b-f">
			<part-loading ref="partLoading"></part-loading>
			<view class="up-item" v-if="levelDetail">
				<view class="up-title">佣金比例</view>
				<view class="up-content">
					<view class="commission-item dis-flex flex-y-center flex-x-between" v-if="levelDetail.leave_commission_1">
						<view class="commission-left dis-flex flex-y-center">
							<image src="/static/images/yongjin.png" class="commission-icon"></image>
							<view class="commission-text f-26">一级佣金{{!!levelDetail.dealer_money_type?(levelDetail.dealer_money_type==="10"?"比例":""):"比例"}}</view>
						</view>
						<view class="commission-right f-30 f-w">{{levelDetail.leave_commission_1}}{{!!levelDetail.dealer_money_type?(levelDetail.dealer_money_type==="10"?"%":"元"):"%"}}</view>
					</view>
					<view class="commission-item dis-flex flex-y-center flex-x-between" v-if="levelDetail.leave_commission_2">
						<view class="commission-left dis-flex flex-y-center">
							<image src="/static/images/yongjin.png" class="commission-icon"></image>
							<view class="commission-text f-26">二级佣金{{!!levelDetail.dealer_money_type?(levelDetail.dealer_money_type==="10"?"比例":""):"比例"}}</view>
						</view>
						<view class="commission-right f-30 f-w">{{levelDetail.leave_commission_2}}{{!!levelDetail.dealer_money_type?(levelDetail.dealer_money_type==="10"?"%":"元"):"%"}}</view>
					</view>
					<view class="commission-item dis-flex flex-y-center flex-x-between" v-if="levelDetail.leave_commission_3">
						<view class="commission-left dis-flex flex-y-center">
							<image src="/static/images/yongjin.png" class="commission-icon"></image>
							<view class="commission-text f-26">三级佣金{{!!levelDetail.dealer_money_type?(levelDetail.dealer_money_type==="10"?"比例":""):"比例"}}</view>
						</view>
						<view class="commission-right f-30 f-w">{{levelDetail.leave_commission_3}}{{!!levelDetail.dealer_money_type?(levelDetail.dealer_money_type==="10"?"%":"元"):"%"}}</view>
					</view>
				</view>
			</view>
			<view class="up-item" v-if="levelDetail.leave_where && levelDetail.leave_where.length>0">
				<view class="up-title dis-flex flex-x-between flex-y-end">
					<view class="">升级条件</view>
					<view class="col-9 f-24">满足以下{{levelDetail.leave_type === 1?"任意":"全部"}}条件</view>
				</view>
				<view class="up-content">
					<view class="condition-item border-line border-bottom" :class="[item.introduction.goods && item.introduction.goods.length > 0?' ':'dis-flex flex-x-between flex-y-center']"
					 v-for="(item,index) in levelDetail.leave_where" :key="index">
						<block v-if="item.introduction.goods && item.introduction.goods.length > 0">
							<view class="dis-flex flex-x-between flex-y-center m-top10">
								<view class="condition-detail">
									<view class="f-28 col-3">购买以下商品</view>
								</view>
								<view class="condition-status" :class="{'completed':item.introduction.finish}">{{item.introduction.finish?"已完成":"未完成"}}</view>
							</view>
							<view class="condition-goods">
								<view class="goods-item dis-flex" v-for="(goods,gIndex) in item.introduction.goods" :key="goods.goods_id"
								 @click="navigationToGoods(goods.goods_id)">
									<image :src="goods.image" class="goods-thumb"></image>
									<view class="goods-info dis-flex flex-dir-column flex-x-between flex-box">
										<view class="col-6 f-26 twolist-hidden">{{goods.goods_name}}</view>
										<view class="goods-price col-m f-26"><text class="f-22">{{settingData.currency}}</text>{{goods.goods_price}}</view>
									</view>
								</view>
							</view>
						</block>
						<block v-else>
							<view class="condition-detail">
								<view class="f-28 col-3">{{item.introduction.text}}</view>
								<view class="f-24 col-9" v-if="!item.introduction.finish">{{item.introduction.value}}</view>
							</view>
							<view class="condition-status" :class="{'completed':item.introduction.finish}">{{item.introduction.finish?"已完成":"未完成"}}</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import PartLoading from "@/components/template/PartLoading.vue"
	export default {
		data() {
			return {
				current: 0,
				self_leave: 1,
				levelList: [], //分销商等级
				levelDetail: {}, //当前分销等级详情
				userlevel: {}, //用户分销等级
				goods: {
					goods_name: "商品商品商品",

				}
			};
		},
		components: {
			PartLoading
		},
		computed: {
			userInfo() {
				let userInfo = this.$store.state.userInfo;
				return userInfo || {}
			}
		},
		onLoad(options) {
			this.getLeaveList();
		},
		methods: {
			getLeaveList() {
				let _this = this;
				App._get("user.dealer.Leave/LeaveList", {}, (res) => {
					let levelList = res.data.data,
						levelIndex = levelList.findIndex(item => item.leave === res.data.self_leave),
						itemlevelData = null;
					_this.levelList.splice(0, levelList.length, ...levelList);
					levelIndex = levelIndex > 0 ? levelIndex : 0;
					itemlevelData = levelList[levelIndex];
					_this.setData({
						self_leave: itemlevelData.leave_id,
						current: 0 - levelIndex,
						userlevel: itemlevelData
					});
					_this.getLeaveData(itemlevelData.leave_id);
					App.hideLoading();
				})
			},
			getLeaveData(leave_id) {
				let _this = this;
				App._get("user.dealer.Leave/Leave", {
					leave_id
				}, (res) => {
					_this.levelDetail = res.data;
					_this.$nextTick(function() {
						_this.$refs.partLoading.showChange();
					})
				})
			},
			navigationToGoods(goods_id) {
				let url = `pages/subPages/goods/index/index?goods_id=${goods_id}`;
				if (this.appClientType === "4") {
					url += `&i=${App.getUniacid()}`;
				}
				App.navigationTo({
					url
				})
			},
			levelChange(index, leave_id = 0) {
				this.$refs.partLoading.showChange();
				this.current = 0 - index;
				this.getLeaveData(leave_id);
			}
		}
	}
</script>

<style scoped>
	.col-level {
		color: #BA721B;
	}

	.current-level {
		overflow-x: hidden;
		height: 370upx;
		background: linear-gradient(180deg, #FFD940, rgba(245, 188, 20, 1));
	}

	.upgrade-info {
		position: relative;
		min-height: calc(100vh - 370upx + 60upx);
		/* #ifdef H5 */
		/* min-height: calc(100vh - 370upx + 60upx - 44px); */
		/* #endif */
		border-radius: 30upx 30upx 0 0;
		margin-top: -60upx;
		padding: 40upx 30upx 0;
		box-sizing: border-box;
	}

	.upgrade-info::after {
		content: " ";
		position: absolute;
		top: -20px;
		left: 50%;
		transform: translateX(-50%);
		border-width: 10px;
		border-style: solid;
		border-color: transparent transparent #FFFFFF transparent;
	}

	.upgrade-info>>>.part-loading {
		top: 40upx;
	}

	.user-level {
		padding-top: 40upx;
	}

	.user-info {
		margin-left: 30upx;
	}

	.user-info .user-avatar {
		width: 54upx;
		height: 54upx;
		display: block;
		margin-right: 10upx;
		border-radius: 50%;
	}

	.level-info {
		height: 54upx;
		background: #F6C115;
		border-radius: 50px 0 0 50px;
		padding: 0 24upx;
	}

	.level-info .level-icon {
		width: 26upx;
		height: 26upx;
		display: block;
		vertical-align: bottom;
		margin-right: 10upx;
	}

	.level-list {
		margin: 65upx 100upx 0;
		white-space: nowrap;
		transition: transform 400ms;
	}

	.level-item {
		position: relative;
		display: inline-block;
		width: 50%;
		transform: translateX(-50%);
	}

	.level-dot {
		width: 32upx;
		height: 32upx;
		border-radius: 50%;
		background: #FFF361;
		margin-right: 0 auto;
		border: 8upx solid #FEDC19;
		margin-bottom: 12upx;
		position: relative;
		z-index: 2;
	}

	.level-vip {
		width: 60upx;
		height: 60upx;
		display: block;
		margin-top: -68upx;
		position: relative;
		z-index: 3;
	}

	.level-text.active {}

	.item-line {
		position: absolute;
		top: 20upx;
		left: 0;
		right: 0;
		height: 10upx;
		transform: translateX(50%);
		background: #FEDC19;
	}

	.up-title {
		color: #333333;
		font-size: 30upx;
		font-weight: bold;
		margin-bottom: 40upx;
	}

	.up-title.dis-flex {
		margin-bottom: 0;
	}

	.up-content {
		padding-bottom: 40upx;
	}

	.up-title .col-9 {
		font-weight: normal;
	}

	.commission-item {
		height: 80upx;
		background: rgba(249, 203, 22, .2);
		padding: 0 25upx;
		border-radius: 20upx;
		margin-bottom: 20upx;
	}

	.commission-left .commission-icon {
		width: 36upx;
		height: 36upx;
		display: block;
		margin-right: 20upx;
	}

	.commission-text {
		color: #BA7D1B;
	}

	.commission-right {
		color: #FF4444;
	}

	.condition-item {
		min-height: 160upx;
	}

	.condition-status {
		width: 123upx;
		height: 58upx;
		line-height: 58upx;
		background: rgba(246, 246, 246, 1);
		border-radius: 29upx;
		color: #999999;
		font-size: 26upx;
		text-align: center;
	}

	.condition-status.completed {
		color: #BA721B;
		background: #FFF4BB;
	}

	.goods-item {
		padding: 12upx 0;
	}

	.goods-item .goods-thumb {
		width: 110upx;
		height: 110upx;
		border-radius: 8upx;
		display: block;
		margin-right: 12upx;
	}
</style>
