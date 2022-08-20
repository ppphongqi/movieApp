<template>
	<view class="apply_record" :style="themeColor">
		<view class="apply_list">
			<view class="apply_list_item" v-for="(item,index) in applyList" :key="index" v-if="item.name == bus_name">
				<view class="item_content">
					<view class="item_header dis-flex flex-y-center">
						<view class="shop_photo"><image :src="item.file_path"></image></view>
						<view class="item_header_right dis-flex flex-x-between">
							<view class="shop_name f-32 col-3">{{item.name}}</view>
							<view class="apply_result f-28" :class="[item.status == 1?'color_gray':'color_red']">{{checkState(item.status)}}</view>
						</view>
					</view>
					<view class="apply_name_info">
						<view class="apply_name f-26 col-9">申请姓名：
							<txet class="name col-3 m-left20 m-right20">{{item.apply_user_name}}</txet>
							<text v-if="item.type == 1" class="anchor" style="background-image: linear-gradient(#FF4444,#FD7137);">平台主播</text>
							<text v-if="item.type == 2" class="anchor" style="background-image: linear-gradient(#16CB15,#56EF52);">自带主播</text>
						</view>
					</view>
					<view class="live_time_info">
						<view class="live_time col-9 f-26">直播时间：
							<text class="start_time m-left20 f-26 col-3">{{item.start_time}}</text>
							<text>-</text>
							<text class="end_time f-26 col-3">{{item.end_time}}</text>
						</view>
					</view>
					<view class="apply-reason f-26 col-9">申请理由：</view>
					<view class="apply_reason_info f-26 col-9">{{item.notes}}</view>
					<view v-if="item.pay_price != 0" class="pay_info dis-flex flex-x-between">
						<view class="pay_info f-26 col-9">{{payState(item.pay_status)}}：<text class="f-26 col-3 m-left20">{{item.pay_price}}元</text></view>
						<view v-if="item.status == 4 && item.pay_status == 20" class="refund f-26 col-9 dis-flex flex-y-center">已退款</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="fixed_button f-24 col-3 dis-flex">
			<view class="home common dis-flex flex-dir-column flex-x-center flex-y-center" @click="handleHomeClick">
				<view class="common_img"><image src="../../../static/images/icon-home--333.png"></image></view>
				<view>首页</view>
			</view>
			<view class="service common dis-flex flex-dir-column flex-x-center flex-y-center" @click="handleServiceClick">
				<view class="common_img"><image src="../../../static/images/icon-kefu--333.png"></image></view>
				<view>客服</view>
			</view>
			<view class="live_apply f-30" @click="handleApplyClick">直播间申请</view>
		</view>
		<!-- 客服弹窗 -->
		<popup-view :show="servicePopupVisible">
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
		</popup-view>	
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import PopupView from "@/components/template/PopManager.vue"
	export default {
		data() {
			return {
				page:1,
				applyList:[],  //申请记录列表信息
				applyRecordInfo:{},
				servicePopupVisible:false,  //客服弹窗是否显示
				serviceRes:{},  //客服信息接口数据
				bus_id:null,
				bus_name:'', //店铺名字
			}
		},
		onLoad(options) {
			this.bus_id = options.bus_id
			this.bus_name = options.bus_name
			this.getApplyRecordRes()
			this.fetchServiceRes()
		},
		components: {
			PopupView,
		},
		methods: {
			// 获取直播申请记录信息
			async getApplyRecordRes() {
				try {
					const res = await App._postP('live.live/getMyApplyLiveRoom',{
						page:this.page,
						size:10,
						bus_id: this.bus_id,
					})
					console.log('bus_id',this.bus_id)
					this.applyRecordInfo = this.$util.deepGet(res, 'data') || []
					this.applyList = (this.applyList).concat(this.applyRecordInfo.data.data)
					console.log('申请信息',this.applyList)
				} catch (e) {
					console.log(112231231212, e)
				}
			},
			// 获取客服信息
			async fetchServiceRes() {
				try {
					const res = await App._postP('Live/getBusinessSetting')
					this.serviceRes = this.$util.deepGet(res, 'data') || []
				} catch (e) {
					console.log(112231231212, e)
					//TODO handle the exception
				}
			},
			// 抄过来的方法 点击复制和拨打号码
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
			// 触底事件
			onReachBottom() {
				console.log("触底事件——————————");
				if(this.page < this.applyRecordInfo.data.last_page) {
					this.page += 1;
					this.getApplyRecordRes()
				}else {
					uni.showToast({
					    title: '暂无更多',
						icon:'none',
					    duration: 1000
					});
				}
			},
			// 底部按钮点击跳转
			handleHomeClick() {
				App.navigationTo({
				     url: 'pages/mainPages/index/index'
				})
			},
			handleServiceClick() {
				this.servicePopupVisible = true
			},
			handleApplyClick() {
				uni.redirectTo({
				    url: '/pages/subPages/liveApply/index?bus_id='+this.bus_id
				})
			},
		},
		computed: {
			checkState() {
				return function(i) {
					let res;
					switch(Number(i)) {
						case 1:
						res = '通过';
						break;
						case 2:
						res = '待审核';
						break;
						case 3:
						res = '删除';
						break;
						case 4:
						res = '驳回';
						break;
					}
					return res
				}
			},
			payState() {
				return function(i) {
					let res;
					switch(Number(i)) {
						case 10:
						res = '未付款';
						break;
						case 20:
						res = '已付款';
						break;
						case 30:
						res = '已退款';
						break;
					}
					return res
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.apply_list {
		padding: 0 30rpx 160rpx 30rpx;
	}
	.apply_list_item {
		width: 690rpx;
		margin-top: 20rpx;
		background:#fff;
		border-radius:10rpx;
		padding-bottom: 30rpx;
	}
	.item_content {
		margin: 0 30rpx;
	}
	.item_header {
		width: 100%;
		height: 120rpx;
		border-bottom: 1px solid #eee;
	}
	.shop_photo {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 20rpx;
		overflow: hidden;
	}
	.shop_photo image {
		width: 100%;
		height: 100%;
	}
	.item_header_right {
		width: 550rpx;
		display: flex;
	}
	.apply_name_info {
		line-height: 56rpx;
	}
	.anchor {
		display: inline-block;
		width: 90rpx;
		height: 30rpx;
		color: #fff;
		font-size: 20rpx;	
		line-height: 30rpx;
		text-align: center;
	}
	.live_time_info {
		line-height: 52rpx;
	}
	.apply-reason {
		margin: 16rpx 0 20rpx 0;
	}
	.apply_reason_info{
		background: rgba(249,249,249,1);
		padding: 30rpx;
		line-height: 40rpx;
		border-radius:6rpx;
	}
	.pay_info {
		margin-top: 15rpx;
	}
	
	.fixed_button {
		width: 100%;
		height: 100rpx;
		position: fixed;
		bottom: 30rpx;
	}
	.common{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background: #FFD940;
		margin-left: 30rpx;
		z-index: 999;
	}
	.common_img {
		width: 40rpx;
		height: 40rpx;
	}
	.common_img image {
		width: 100%;
		height: 100%;
	}
	.live_apply {
		width: 250rpx;
		height: 100rpx;
		border-radius: 50rpx;
		font-size: 30rpx;
		background: #FFD940;
		margin-left: 30rpx;
		z-index: 999;
		text-align: center;
		line-height: 100rpx;
	}
	.color_red {
		color: #FE504F;
	}
	.color_gray {
		color: #999999;
	}
	
	// 客服悬浮窗样式
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
</style>
