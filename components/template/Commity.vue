<template>
	<view class="">
		<view v-if="triggerVisible" class="goods-community dis-flex flex-x-between flex-y-center m-top20 border-line border-top">
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
		<popup-layer
			:showClose="true"
			:show="showCommunity" 
			topTitle="关注提醒" 
			:wechat="community.wechat"
			:communityType="community.community_type"
			:phone="community.mobile"
			:imgSrc="community.qrcodeimg && community.qrcodeimg.length > 0 && !!community.qrcodeimg[0]?community.qrcodeimg[0].file_path:''" 
			:isShowLongPressBtn="true"
			@closePopupBtn="showCommunity=false"
		>	
		</popup-layer>
		<!-- #endif -->
		
		<!-- #ifdef MP -->
		<popup-layer
			:showClose="true"
			:show="showCommunity" 
			topTitle="联系客服" 
			:wechat="community.wechat"
			:communityType="community.community_type"
			:phone="community.mobile"
			:imgSrc="getImageRoot('91.png')" 
			footBtnText='去回复'
			@closePopupBtn="showCommunity=false"
		>	
			<view v-if="appClientType ==='2'">
				有任何疑问，点击“<text class="col-m">去回复</text>”发送“<text class="col-m">{{community.id}}</text>”,即可添加客服微信
			</view>
		</popup-layer>
		<!-- #endif -->
		<!-- 社群弹窗 end -->
		
							
		<!-- 社群弹窗（废弃） -->
		<popup-view style="display: none;" :show="showCommunity" type="center" @clickmask="showCommunity = false" v-if="showCommunity">
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
	</view>
	
</template>

<script>
	import PopupView from "@/components/template/PopManager.vue"
	import PopupLayer from "@/components/template/PopLayer.vue"
	export default {
		data() {
			return {
				showCommunity:false
				
			}
		},
		components:{
			PopupView,
			PopupLayer
		},
		props:{
			community:{
				type:Object,
				default:{}
			},
			// 是否显示触发按钮
			triggerVisible: {
				type: Boolean,
				default: true
			}
		},
		watch: {
		},
		methods:{
			callPhone(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber: String(phoneNumber)
				})
			},
			toggleVisible() {
				this.showCommunity = !this.showCommunity
			}
		}
	}
</script>

<style>
	/* 社群 */
	.goods-community {
		padding-top: 20rpx;
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
</style>
