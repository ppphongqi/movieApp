<template>
	<view :style="themeColor">
		<view class="live_apply">
			<form>
				<view v-if="!storeInfo" class="store_info input_common dis-flex flex-y-center">
					<view class="common_left f-28 col-3">店铺信息</view>
					<view class="common_right f-28 dis-flex">
						<input type="text"  placeholder="暂无">
					</view>
				</view>
				<view v-else class="store_info input_common dis-flex flex-y-center">
					<view class="common_left f-28 col-3">店铺信息</view>
					<view class="common_right f-28 dis-flex flex-x-end">
						<picker mode="selector" :value="store_info_index" :range="showStoreInfo" @change="storeInfoChange" class="common_width">
							<view class="f-28 col-3">{{showStoreInfo[store_info_index]}}</view>
						</picker>
						<text class="iconfont icon-right"></text>
					</view>
				</view>
				<view class="apply_name input_common dis-flex flex-y-center">
					<view class="common_left f-28 col-3">申请人姓名</view>
					<view class="common_right f-28 dis-flex">
						<input type="text" placeholder="填写" @input="inputApplyName">
						<text class="iconfont icon-write"></text>
					</view>
				</view>
				<view class="apply_reason">
					<view class="title f-28 col-3"><text class="">申请理由</text></view>
					<view class="apply_reason_bottom f-28">
						<textarea maxlength="-1"  placeholder="填写直播间用途、售卖商品等内容描述" @input="inputApplyReason" />
						<text class="iconfont icon-write"></text>
					</view>
				</view>
				<view class="apply_time input_common dis-flex flex-y-center">
					<view class="common_left f-28 col-3">直播开始时间</view>
					<view class="common_right f-28 dis-flex flex-x-end">
						<e-picker-plus mode="YMDhm" @confirm="getStartTime" class="common_width">
							<view class="f-28 col-3">{{start_time}}</view>
						</e-picker-plus>
						<text class="iconfont icon-right"></text>
					</view>
				</view>
				<view class="apply_time_hint f-26 col-9"><text>提示 : 开播时间需要在当前时间的10分钟后，并且开始时间不能在6个月后,直播时间不能少于30分钟, 最长时间不能超过12个小时</text></view>
				<view class="apply_time input_common dis-flex flex-y-center">
					<view class="common_left f-28 col-3">直播结束时间</view>
					<view class="common_right f-28 dis-flex flex-x-end">
							<e-picker-plus mode="YMDhm" @confirm="getEndTime" class="common_width">
								<view class="f-28 col-3">{{end_time}}</view>
							</e-picker-plus>
							<text class="iconfont icon-right"></text>
					</view>
				</view>
				<view class="appyl_set input_common dis-flex flex-y-center">
					<view class="common_left f-28 col-3">直播设置</view>
					<view class="common_right f-28 dis-flex flex-x-end">
						<picker mode="selector" :value="live_set_index" :range="anchor_select" @change="selectChange" class="common_width">
							<view class="f-28 col-3">{{anchor_select[live_set_index]}}</view>
						</picker>
						<text class="iconfont icon-right"></text>
					</view>
				</view>
				<view class="nick_name input_common dis-flex flex-y-center">
					<view class="common_left f-28 col-3">主播昵称</view>
					<view class="common_right f-28 dis-flex">
						<input type="text" placeholder="请填写" @input="inputAnchorName">
					</view>
				</view>
				<view class="anchor_wx input_common dis-flex flex-y-center">
					<view class="common_left f-28 col-3">主播微信号</view>
					<view class="common_right f-28 dis-flex">
						<input type="text" placeholder="请填写" @input="inputAnchorWechat">
					</view>
				</view>
			</form>
			<view v-if="payMoneyInfo.open_pay == 1" class="submit_button" @click="handlePayClick">支付<text>{{payMoney}}</text>元并提交申请</view>
			<view v-else class="submit_button" @click="handlePayClick">提交申请</view>
		</view>
		<!-- 支付弹窗 -->
		<order-pay-popups ref="orderPayPopups" @clickMask="onToggleList"  @paySuccess="paySuccess" >
			
		</order-pay-popups>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import OrderPayPopups from "@/components/template/OrderPayPopups.vue"
	export default {
		data() {
			return {
				start_time:'请选择日期', //直播开始时间
				start_time_stamp:null,  //开始时间时间戳
				end_time:'请选择日期',  //直播结束时间
				end_time_stamp:null,  //结束时间时间戳
				live_set_index:0,  //anchor_select下标
				store_info_index:0,  //showStoreInfo下标
				liveStoreInfo:{},  // 商家及费用信息
				showStoreInfo:[],  // 展示的店铺信息
				anchor_select: ['平台主播','自带主播'],
				apply_user_name:'',
				anchor_name:'',
				anchor_wechat:'',
				source: 2,  // 平台类型
				notes:'',  // 申请理由
				money:null,  //直播需要支付金额
				showPayPopup:false, 
				apply_id:'',
				payMoneyInfo:{},
				payType:'balance', //当前支付方式
				applyInfo:{},
				
			}
		},
		components:{
			OrderPayPopups
		},
		onLoad(options) {
			// this.bus_id = options.bus_id
			this.getStoreData()
			this.getSource()
		},
		methods: {
			// 获取商家及费用信息
			async getStoreData() {
				try {
					const res = await App._postP('live.live/getSomeInfo',{})
					this.liveStoreInfo = this.$util.deepGet(res, 'data') || []
					this.payMoneyInfo = this.liveStoreInfo.set
					let arr = this.liveStoreInfo.store
					this.showStoreInfo = arr.map(item => {
						return item.name
					})
					console.log('liveStoreInfo',this.liveStoreInfo)
					console.log(this.liveStoreInfo.store[this.store_info_index].bus_id)
				} catch (e) {
					console.log(112231231212, e)
				}
			},
			
			// 申请数据提交
			async getLiveApplyData() {
				try {
					const res = await App._postP('live.live/liveRoomApplySave',{
						type: parseInt(this.live_set_index)+1,
						start_time:this.start_time_stamp,
						end_time:this.end_time_stamp,
						source:this.source,
						apply_user_name:this.apply_user_name,
						anchor_name:this.anchor_name,
						anchor_wechat:this.anchor_wechat,
						notes:this.notes,
						bus_id:this.storeBusId,
					})
					this.applyInfo = this.$util.deepGet(res, 'data') || []
					this.apply_id = this.applyInfo.apply_id
					console.log('apply-ID',this.apply_id)
				} catch (e) {
					console.log(112231231212, e)
				}
			},
			
			async handlePayClick() {
				if(this.start_time !== '请选择日期' && this.end_time !== '请选择日期' && this.apply_user_name && this.notes && this.anchor_name && this.anchor_wechat) {
					await this.getLiveApplyData()
					let payData = {
						pay_type: this.payType,
						apply_id: this.apply_id,
						source: App.getClientType(),
						pay_from: "live"
					}
					if(this.payMoneyInfo.open_pay == 1) {
						this.$store.commit("orderPay",payData)
						this.onToggleList()
					}
					else if(this.payMoneyInfo.open_pay == 0 && this.applyInfo.apply_id){
						App.showSuccess("提交成功!");
						setTimeout(() => {
							uni.redirectTo({
							    url: '/pages/subPages/liveApply/applyrecord?bus_id='+this.storeBusId + '&bus_name=' + this.storeBusName
							})
						},1500)
					}
				}
			},
			// 支付方式弹窗
			onToggleList() {
				this.$refs.orderPayPopups.onToggleList();
			},
			paySuccess(result){
				console.log("支付成功", result);
				App.showSuccess("支付成功!");
				setTimeout(() => {
					uni.redirectTo({
					    url: '/pages/subPages/liveApply/applyrecord?bus_id=' + this.storeBusId + '&bus_name=' + this.storeBusName,
					})
				},1500)
			},
			// 获取开始时间
			getStartTime(e) {
				this.start_time = e.result
				// 将时间字符串转化为时间戳
				let date = e.result;
				date = date.substring(0,19);    
				date = date.replace(/-/g,'/'); 
				this.start_time_stamp = new Date(date).getTime();
				console.log('时间戳',this.start_time_stamp);
			},
			// 获取结束时间
			getEndTime(e) {
				this.end_time = e.result
				let date = e.result;
				date = date.substring(0,19);    
				date = date.replace(/-/g,'/'); 
				this.end_time_stamp = new Date(date).getTime();
			},
			// 获取申请人姓名
			inputApplyName(event) {
				this.apply_user_name = event.target.value
				console.log('申请人',this.apply_user_name)
			},
			// 获取主播名
			inputAnchorName(event) {
				this.anchor_name = event.target.value
			},
			// 获取主播微信号
			inputAnchorWechat(event) {
				this.anchor_wechat = event.target.value
			},
			// 获取渠道
			getSource() {
				let clientType = App.getClientType()
				if(clientType === "4") {
					this.source = 4
				}
			},
			// 获取申请理由
			inputApplyReason(event) {
				this.notes = event.target.value
			},
			// 直播设置
			selectChange(e) {
				this.live_set_index = e.target.value
			},
			// 店铺信息
			storeInfoChange(e) {
				this.store_info_index = e.target.value
				console.log(e,'eeeeeeeeeeee')
			},
			
		},
		computed: {
			// 支付金额
			payMoney() {
				if(this.payMoneyInfo.open_pay == 1 && this.live_set_index == 0) {
					return (parseFloat(this.payMoneyInfo.live_actor_cost) + parseFloat(this.payMoneyInfo.live_room_cost)).toFixed(2)
				}else if(this.payMoneyInfo.open_pay == 1 && this.live_set_index == 1) {
					return (parseFloat(this.payMoneyInfo.live_room_cost)).toFixed(2)
				} 
			},
			// 返回展示的店铺id
			storeBusId() {
				if(this.liveStoreInfo && this.liveStoreInfo.store && this.liveStoreInfo.store[this.store_info_index] && this.liveStoreInfo.store[this.store_info_index].bus_id) {
					return this.liveStoreInfo.store[this.store_info_index].bus_id
				} 
			},
			// 返回展示店铺名字
			storeBusName() {
				if(this.liveStoreInfo && this.liveStoreInfo.store && this.liveStoreInfo.store[this.store_info_index] && this.liveStoreInfo.store[this.store_info_index].name) {
					return this.liveStoreInfo.store[this.store_info_index].name
				} 
			},
			// 判断有无店铺信息
			storeInfo() {
				return this.liveStoreInfo && this.liveStoreInfo.store
			},
			// 获取直播类型
			anchorSelectType() {
				return this.index + 1
			},
			
		 },
	}
</script>

<style lang="scss" scoped>
	.live_apply {
		margin: 0 30rpx;
	}
	.common_width {
		width: 370rpx;
	}
	.input_common {
		height: 80rpx;
		margin-top: 20rpx;
		background:rgba(250,250,250,1);
		border-radius:10rpx;
	}
	.common_left {
		text-align: center;
		line-height: 80rpx;
		width: 172rpx;
	}
	.common_right {
		text-align: right;
		margin-right: 30rpx;
		width: 518rpx;
	}
	
	.common_right input {
		width: 100%;
	}
	.common_right .iconfont{
		margin-left: 21rpx;
	}
	.apply_name .common_left {
		width: 201rpx;
	}
	.apply_name .common_right {
		width: 489rpx;
	}
	.apply_name .common_right .icon-write {
		margin-left: 10rpx;
	}
	.apply_time .common_left {
		width: 230rpx;
	}
	.apply_time .common_right {
		width: 460rpx;
	}
	.apply_reason {
		height: 280rpx;
		margin-top: 30rpx;
		position: relative;
		background: rgba(250,250,250,1);
	}
	.title {
		width: 100%;
		height: 80rpx;
		position: absolute;
		top: -10rpx;
	}
	.title text {
		width: 113rpx;
		height: 28rpx;
		line-height: 28rpx;
		position: absolute;
		left: 34rpx;
		top: 39rpx;
		
	}
	.apply_reason_bottom {
		position: absolute;
		width: 100%;
		bottom: 0;
		height: 210rpx;
		
	}
	.apply_reason_bottom textarea {
		height: 144rpx;
		width: 690rpx;
		text-indent: 31rpx;
		margin-top: 15rpx;
	}
	.apply_reason_bottom .iconfont{
		position: absolute;
		bottom: 20rpx;
		right: 30rpx;
	}
	.apply_time_hint {
		margin-top: 30rpx;
		text-indent: 31rpx;
		background-color: rgba(250,250,250,1);
	}
	.anchor_wx .common_left {
		width: 200rpx;
	}
	.submit_button {
		width: 630rpx;
		height: 90rpx;
		font-size: 30rpx;
		margin: 50rpx 30rpx;
		background-color: #FFD940;
		border-radius:45rpx;
		text-align: center;
		line-height: 90rpx;
		letter-spacing: 5rpx;
	}
	
	
	.time_select {
		width: 100vw;
		height: 500rpx;
		background: #008c8c;
	}
</style>
