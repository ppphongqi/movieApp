<template>
	<view class="page-fabulous" :style="themeColor">
		<!-- banner -->
		<image class="banner" :src="pageBgImage"></image>
		<!-- banner end -->
		<!-- 背景音乐 -->
			<AudioIcon v-if="basicsData.praise_music" v-model="audioStatus" :src="basicsData.praise_music" :styleStr="audioStyle"></AudioIcon>
		<!-- 背景音乐 end -->
		<!-- 浏览参与转发数量 -->
		<view class="user_num common-box dis-flex flex-x-around flex-y-center f-24">
			<view class="look dis-flex flex-dir-column flex-y-center">
				<view class="col-3">浏览</view>
				<view class="common_color"><text class="f-36" style="font-weight: bold;">{{basicsData.look_num}}</text>次</view>
			</view>
			<view class="forward dis-flex flex-dir-column flex-y-center">
				<view class="col-3">转发</view>
				<view class="common_color"><text class="f-36" style="font-weight: bold;">{{basicsData.forward_num}}</text>次</view>
			</view>
			<view class="join dis-flex flex-dir-column flex-y-center">
				<view class="col-3">参与</view>
				<view class="common_color"><text class="f-36" style="font-weight: bold;">{{joinCount}}</text>人</view>
			</view>
		</view>
		<!-- 浏览参与转发数量 end -->
		<!-- 客服会话 -->
		<block v-if="community.length">
			<view class="goods-community m-top20 border-line border-top">
				<view v-for="(item,index) in community" :key="index"  class="community-item dis-flex flex-x-between flex-y-center ">
					<view class="community-user dis-flex flex-y-center flex-box ">
						<!-- <image :src="item.headimg && item.headimg.length > 0 && !!item.headimg[0] ? item.headimg[0].file_path : '' " -->
						<image :src="communityImg(index)"
						 class="community-user-img"></image>
						<view class="community-user-info flex-box">
							<view class="community-user-name col-0 f-28">{{item.title}}</view>
							<view class="community-user-des f-24 col-9 onelist-hidden">{{item.des}}</view>
						</view>
					</view>
					<view class="community-btn">
						<button class="community-add f-24 col-f" @click="onToggleCommunity(index)">添加</button>
					</view>
				</view>
			</view>
		
			<!-- 社群弹窗 -->
			<!-- #ifdef H5 -->
			
			<popup-layer
				:showClose="true"
				:show="showCommunity" 
				topTitle="关注提醒" 
				:phone="popupInfo.mobile"
				:wechat="popupInfo.wechat"
				:communityType="popupInfo.community_type"
				:imgSrc="popupInfo.qrcodeimg && popupInfo.qrcodeimg.length > 0 && !!popupInfo.qrcodeimg[0]?popupInfo.qrcodeimg[0].file_path:''" 
				:isShowLongPressBtn="showLongPressBtn"
				:pagePath="pagePath"
				@closePopupBtn="showCommunity=false"
			>	
			</popup-layer>
			<!-- #endif -->
			
			<!-- #ifdef MP -->
			<popup-layer
				:showClose="true"
				:show="showCommunity" 
				topTitle="联系客服" 
				:phone="popupInfo.mobile"
				:wechat="popupInfo.wechat"
				:communityType="popupInfo.community_type"
				:imgSrc="getImageRoot('91.png')" 
				footBtnText='去回复'
				:pagePath="pagePath"
				@closePopupBtn="showCommunity=false"
			>	
				<view v-if="appClientType ==='2'">
					有任何疑问，点击“<text class="col-m">去回复</text>”发送“<text class="col-m">{{popupInfo.id}}</text>”,即可添加客服微信
				</view>
			</popup-layer>
			<!-- #endif -->
			<!-- 社群弹窗 end -->
		</block>
		<!-- 客服会话 end -->
		<!-- 奖品列表 -->
		<view class="prize-list">
			<view class="prize-list-title f-30 col-3">
				<view class="style">本期奖品列表</view>
			</view>
			<view class="list-content">
				<view v-for="(item,index) in basicsData.prize" :key="index" class="prize-list-item dis-flex flex-x-between">
					<view class="prize-photo">
						<image :src="item.image"></image>
						<view v-if="basicsData.type == 1" class="prize-access f-24 col-f">第{{item.number}}名</view>
						<view v-if="basicsData.type == 2" class="prize-access f-24 col-f">{{item.praise_num}}赞 获得</view>
					</view>
					<view class="prize-info dis-flex flex-dir-column flex-x-between">
						<view class="prize-describe f-28 col-3 twolist-hidden">{{item.title}}</view>
						<view v-if="basicsData.type == 2" class="prize-margin col-9 f-24">剩{{item.prize_num}}份奖品</view>
						<view class="prize-else-info dis-flex">
							<view class="prize-value f-24 col-3">￥<text class="f-36">{{item.prize_money}}</text></view>
							<view class="prize-furnish col-f f-24 onelist-hidden">由{{item.bus_name}}提供</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 奖品列表 end -->
		<!-- 倒计时 -->
		<view style="margin-top: 32rpx;">
			<count-down :leftTime="activityStatus.leftTime" :status="activityStatus.status" @timeEnd="setActivityCutTime()">
			</count-down>	
		</view>
		<!-- 倒计时 end -->
		<!-- 集赞 -->
		<view v-if="showJoinContent" class="add-favour common-box">
			<view class="common-content">
				<view class="main-user-photo">
					<image :src="mainUserInfo.user_data.avatarUrl"></image>
				</view>
				<view class="main-user-name f-28 col-3">{{mainUserInfo.user_data.nickName}}</view>
				<view class="collect-info f-28 col-3">TA已集满<text style="color:#FF4444">{{mainUserInfo.user_data.praise_num}}</text>个赞，感谢你的支持~</view>
				<view class="activity-type dis-flex f-28 col-3 dis-flex">
					<view class="btn-box dis-flex" v-if="showJoinBtn">
						<view @click="handleHelpClick" class="help dis-flex flex-x-center flex-y-center" :class="{'stop_click' : stopClick}">
							<view class="img">
								<view class="text col-f">帮TA一下</view>
								<image src="./static/images/help_btn.png"></image>
							</view>
						</view>
						<view @click="handleJoinClick" class="join">
							<view class="img">
								<view class="text col-f">我也要参加</view>
								<image src="./static/images/join_btn.png"></image>
							</view>
						</view>
					</view>
					<view class="btn-box dis-flex" v-if="showShareBtn || showShare">
						<view @click="handleHelpClick" class="help dis-flex flex-x-center flex-y-center" :class="{'stop_click' : stopClick}">
							<view class="img">
								<view class="text col-f">帮TA一下</view>
								<image src="./static/images/help_btn.png"></image>
							</view>
						</view>
						<view @click="$refs.shareView.shareswich()" class="join dis-flex flex-x-center flex-y-center">
							<view class="img">
								<view class="text col-f">分享</view>
								<image src="./static/images/share_btn.png"></image>
							</view>
						</view>
					</view>
					<view class="btn-box dis-flex" v-if="showLookMeBtn && !showShare">
						<view @click="handleHelpClick" class="help dis-flex flex-x-center flex-y-center" :class="{'stop_click' : stopClick}">
							<view class="img">
								<view class="text col-f">帮TA一下</view>
								<image src="./static/images/help_btn.png"></image>
							</view>
						</view>
						<view @click="handleLookMeClick"  class="join dis-flex flex-x-center flex-y-center">
							<view class="img">
								<view class="text col-f">查看我的</view>
								<image src="./static/images/lookme_btn.png"></image>
							</view>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in mainUserInfo.help_data" :key="index" class="help-user dis-flex flex-x-around flex-y-center">
					<image :src="item.avatarUrl" ></image>
					<view class="help-user-name f-28 col-3 onelist-hidden">{{item.nickName}}</view>
					<view class="help-info f-28 col-3">帮TA集了<text style="color: #FF4444;">1</text>个赞</view>
					<view class="help-date f-24 col-3">{{item.create_time}}</view>
				</view>
			</view>
		</view>
		<!-- 集赞 end -->
		<!-- 未参与活动时 -->
		<view v-else @click="handleJoinClick" class="nojoin dis-flex flex-y-center" :class="{'stop_click' : stopClick}">
			<view class="join-box">
				<view class="text f-32 col-f">立即参与</view>
				<image v-if="activityStatus.status == 1" src="static/images/underway_joinbtn.png"></image>
				<image v-else src="static/images/end_joinbtn.png"></image>
			</view>
		</view>
		<!-- 未参与活动时 end-->
		<!-- 参与用户 -->
		<view v-if="joinData.length" class="join-activity common-box">
			<view class="title t-c f-30 col-3">
				<view class="style f-30 col-3 t-c">参与活动</view>
			</view>
			<view class="common-content">
				<view class="join-total f-28 col-3">已有<text style="color: #FF4444;">{{joinCount}}</text>人参与</view>
				<view class="join-user-list dis-flex flex-warp">
					<view v-for="(item,index) in joinData" :key="index" class="join-user dis-flex flex-dir-column flex-x-center flex-y-center">
						<image :src="item.avatarUrl" ></image>
						<view class="user-name f-24 col-3 t-c onelist-hidden">{{item.nickName}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 参与用户 end -->
		<!-- 领奖记录 -->
		<view v-if="prizeSwiperData.length" class="prize-record common-box">
			<view class="title t-c f-30 col-3">
				<view class="style f-30 col-3 t-c">中奖记录</view>
			</view>
			<view class="common-content">
				<view class="join-total f-28 col-3">已有<text style="color: #FF4444;">{{prizeData.total}}</text>人领奖</view>
				<view class="prize-user-list">
					<swiper style="height: 100%;" :vertical="true" :autoplay="true" :circular="true" :interval="4000" :duration="1000">
						<swiper-item v-for="(item,index) in prizeSwiperData" :key="index">
							<view class="swiper-item">
								<view v-for="(item1,index1) in item" :key="index1" class="prize-user dis-flex flex-x-between flex-y-center">
									<image :src="item1.avatarUrl"></image>
									<view class="name f-28 col-3 onelist-hidden">{{item1.nickName}}</view>
									<view class="result f-28 col-3">已中奖</view>
									<view class="date f-24 col-3">{{item1.create_time}}</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<!-- 领奖记录 end -->
		<!-- 点赞排行榜 -->
		<view v-if="formerRankingData.length" class="praise_ranking">
			<view class="former_ranking f-28">
				<view class="first former_ranking_common dis-flex flex-dir-column flex-y-center flex-x-center">
					<view class="img dis-flex flex-x-center flex-y-center"><view class="common_border dis-flex flex-x-center flex-y-center"><image :src="formerRankingData[0].avatarUrl" ></image></view></view>
					<view class="name onelist-hidden t-c">{{formerRankingData[0].nickName}}</view>
					<view class="total"><text>{{formerRankingData[0].praise_num}}</text>个赞</view>
				</view>
				<view v-if="formerRankingData[1]" class="second former_ranking_common dis-flex flex-dir-column flex-y-center flex-x-center">
					<view class="img dis-flex flex-x-center flex-y-center"><view class="common_border dis-flex flex-x-center flex-y-center"><image :src="formerRankingData[1].avatarUrl" ></image></view></view>
					<view class="name onelist-hidden t-c">{{formerRankingData[1].nickName}}</view>
					<view class="total"><text>{{formerRankingData[1].praise_num}}</text>个赞</view>
				</view>
				<view v-if="formerRankingData[2]" class="third former_ranking_common dis-flex flex-dir-column flex-y-center flex-x-center">
					<view class="img dis-flex flex-x-center flex-y-center"><view class="common_border dis-flex flex-x-center flex-y-center"><image :src="formerRankingData[2].avatarUrl" ></image></view></view>
					<view class="name onelist-hidden t-c">{{formerRankingData[2].nickName}}</view>
					<view class="total"><text>{{formerRankingData[2].praise_num}}</text>个赞</view>
				</view>
				<image class="former_img" src="./static/images/ranking.png" ></image>
			</view>
			<view v-if="rankingData.length" class="ranking-box common-box">
				<view class="common-content">
					<view class="title f-24 dis-flex">
						<view class="ranking">排名</view>
						<view class="name">昵称</view>
						<view class="total">集赞(数)</view>
					</view>
					<view v-if="selfUserData.nickName" class="self_ranking ranking-list-item dis-flex flex-y-center">
						<view v-if="formerRanking" class="ranking f-28 col-3">{{selfRanking}}</view>
						<view v-else class="ranking f-28 col-3">99</view>
						<image :src="mainUserInfo.user_data.avatarUrl" ></image>
						<view class="name onelist-hidden f-28 col-3">{{mainUserInfo.user_data.nickName}}</view>
						<view class="total f-28 col-3"><text style="color: #FF4444;">{{mainUserInfo.user_data.praise_num}}</text>个赞</view>
					</view>
					<view class="ranking-list">
						<view v-for="(item,index) in rankingData" :key="index" class="ranking-list-item dis-flex flex-y-center">
							<view class="ranking f-28 col-3">{{index + 4}}</view>
							<image :src="item.avatarUrl" ></image>
							<view class="name onelist-hidden f-28 col-3">{{item.nickName}}</view>
							<view class="total f-28 col-3"><text style="color: #FF4444;">{{item.praise_num}}</text>个赞</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 点赞排行榜 end -->
		
		
		<!-- 规则 -->
		<view class="lottery-rule">
			<view class="title t-c f-30 col-3">
				<view class="style f-30 col-3 t-c">集赞规则</view>
			</view>
			<view class="step dis-flex f-24 col-3">
				<view class="invite dis-flex flex-dir-column flex-x-center flex-y-center">
					<image src="static/images/invite_friend.png"></image>
					<view class="name">邀请好友</view>
				</view>
				<view class="step-arrows dis-flex flex-dir-column flex-x-center flex-y-center">
					<view class="line">
						<view class="arrows"></view>
					</view>
				</view>
				<view class="wait dis-flex flex-dir-column flex-x-center flex-y-center">
					<image src="static/images/wait_result.png"></image>
					<view class="name">等待开奖结果</view>
				</view>
				<view class="step-arrows dis-flex flex-dir-column flex-x-center flex-y-center">
					<view class="line">
						<view class="arrows"></view>
					</view>
				</view>
				<view class="result dis-flex flex-dir-column flex-x-center flex-y-center">
					<image src="static/images/prize_result.png"></image>
					<view class="name">中奖结果</view>
				</view>
			</view>
		</view>
		<!-- 规则 end -->
		<!-- 推荐商品 -->
			<view v-if="basicsData.goods.length" class="recommend-goods common-box">
				<view class="common-content">
					<view class="title f-24 col-f">优惠超值购</view>
					<view class="goods-list">
						<view v-for="(item,index) in basicsData.goods" :key="index" class="goods-list-item dis-flex flex-x-between" @click="handleBuyGoodsClick(item.goods_id)">
							<view class="photo">
								<image :src="item.image"></image>
							</view>
							<view class="goods-info dis-flex flex-dir-column flex-x-between">
								<view class="goods-title f-28 col-3 twolist-hidden">{{item.goods_name}}</view>
								<view class="info dis-flex flex-x-between">
									<view class="price f-32">￥{{item.goods_price}}</text></view>
									<view class="old-price f-30 col-9">￥{{item.line_price}}</view>
									<view class="buy-button f-24 col-3">立即购买</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		<!-- 推荐商品 end -->
		<!-- 内容详情 -->
			<view class="content-detail">
				内容详情
				<view class="triangle"></view>
			</view>
		<!-- 内容详情 end -->
		<!-- 内容 -->
			<view style="width: 690rpx;margin:auto;">
				<!-- <rich-text :nodes="basicsData.content"></rich-text> -->
				<parse :html="basicsData.content" parse-only="byKnow"></parse>
			</view>
		<!-- 内容 end -->
		<!-- 分享和海报 -->
			<share-view ref="shareView" @shareBtn="handleShareClick" :pid="praise_id" :poster-type="'praise'"></share-view>
		<!-- 分享和海报 end -->
		<!-- 底部固定导航 -->
		<view class="btm-fix dis-flex">
			<view class="btm-bar dis-flex flex-x-around flex-y-center f-24 col-3">
				<view @click="handleToHomeClick" class="home dis-flex flex-dir-column flex-x-center flex-y-center">
					<view class="iconfont icon-home1"></view>
					<view class="text">首页</view>
				</view>
				<view @click="handlePrizeClick" class="prize dis-flex flex-dir-column flex-x-center flex-y-center">
					<view class="iconfont icon-prize"></view>
					<view class="text">奖品</view>
				</view>
				<view @click="$refs.shareView.shareswich()" class="poster dis-flex flex-dir-column flex-x-center flex-y-center">
					<view class="iconfont icon-poster"></view>
					<view class="text">海报</view>
				</view>
			</view>
			<view @click="$refs.shareView.shareswich()" class="share-btn dis-flex flex-dir-column flex-x-center flex-y-center f-24">
				<!-- <button open-type="share"></button> -->
				<view class="iconfont icon-share1"></view>
				<view>分享</view>
			</view>
		</view>
		<!-- 底部固定导航 end -->
		<!-- 引导关注公众号 -->
		<popup-view :show="leadShowAttention" type="center" @clickmask="leadShowAttention = false">
			<!-- #ifdef MP -->
			<view style="position: relative;">
				<view class="community-detail b-f t-c p-r">
					<view class="community-header f-w f-44 p-r" :style="{'background-image':getImageRoot('61.png','url')}">
						<image src="/static/images/attention-wx.png" class="attention" style="background: none;"></image>
					</view>
					<view class="community-body f-26 col-3 t-c">
						<view class="f-26 col-3">该活动仅限公众号粉丝参与</view>
						<!-- <view class="t-c">点击“<text class="col-m">去回复</text>”发送“<text class="col-m">{{data.keyword}}</text>”获得购买机会</view> -->
					</view>
					<button class="community-reply f-24 col-3"  open-type="contact" :send-message-path="cSendMessage.path" :send-message-title="cSendMessage.title" show-message-card>去关注</button>
				</view>
				<view class="iconfont icon-roundclose" @click="leadShowAttention = false"></view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="attention-box">
				<view class="attention-title f-28 col-9 t-c">活动仅限公众号粉丝参与</view>
				<view class="attention-label dis-flex flex-y-center m-top30 col-3 f-24">
					<view class="label-num backColor auxiliary-color">1</view>
					<view class="attention-text">识别下方二维码关注公众号</view>
				</view>
				<image :src="basicsData.subscribe_wechat_img" class="wechat-image"></image>
				<view class="attention-label dis-flex flex-y-center m-top30 col-3 f-24">
					<view class="label-num  backColor auxiliary-color">2</view>
					<view class="attention-text">点击识别二维码弹出的内容参与集赞</view>
				</view>
				<view class="dialogue-wechat">
					<view class="dialogue-info dis-flex">
						<view class="wechat-img"></view>
						<view class="dialogue-detail b-f flex-box">
							<view class="dialogue-name f-24 col-3 onelist-hidden">{{basicsData.title}}</view>
							<image src="/static/images/shouzhi.png" class="img_shouzhi"></image>
							<view class="dis-flex flex-x-between">
								<view class="f-24 col-9">点击参与集赞~</view>
								<image src="./static/images/bg-page-dianzan.png" class="dialogue-we"></image>
								<!-- <image src="" class="dialogue-we"></image> -->
							</view>
						</view>
					</view>
					<image src="/static/images/dialogue.png" class="dialogue-img"></image>
				</view>
				<view class="iconfont icon-roundclose" @click="leadShowAttention = false"></view>
			</view>
			<!-- #endif -->
		</popup-view>
		
		
	</view>
</template>

<script>
	let innerAudioContext = null
	import App from '@/common/js/app.js'
	import ShareView from './components/ShareView.vue'
	import CountDown from './components/CountDown.vue'
	import PopupView from "@/components/template/PopManager.vue"
	import Parse from "@/components/threeComponents/jyf-Parser/index"
	import pageShare from "@/common/js/pageShareMixin.js"
	import PopupLayer from "@/components/template/PopLayer.vue"
	import AudioIcon from "@/components/page/pageComponents/AudioIcon.vue"
	import {
		wxRequestSubscribeMessageX
	} from '@/common/js/wxPromise.js'
	export default {
		mixins: [pageShare],
		components: {
			Parse,
			CountDown,
			ShareView,
			PopupView,
			PopupLayer,
			AudioIcon
		},
		data() {
			return {
				basicsData:{}, //基础数据
				mainUserInfo:{}, //点赞主用户信息
				joinData:{},  //参与活动用户数据
				rankingData:[],  //排行榜数据
				formerRankingData:[],  //前三名数据
				joinCount:0, //参与人数
				prizeData:{}, //中奖数据
				prizeSwiperData:[],  //滚动数据
				showAttention: false,
				praise_id: 0, //活动id
				referee_id: 0, 
				selfUserData:{},
				selfUserInfo:{},
				drawTmplIds: [], //订阅消息模板Ids
				audioStatus: 'play',
				successPraise: false,
				joinSuccess: false,
				showShare: false,
				// status:'',
				// rotateVisibility:true,
				// innerAudioContext: null,
				community:[],
				shareData: null, //分享数据
				popupInfo:{},
				selfRanking: 0,
				stopClick: false,
				formerRanking: false,
				showCommunity:false,
				showLongPressBtn:true,
				user_info:{},
				lng: 0,
				lat: 0,
				prizeRecordPage:1,
				prizeLastPage:1,
				pagePath:'',
				isUserShare: false, //是否用户分享进入活动
				leadShowAttention:false,
				pageOptions: {}, //页面加载参数
				activityStatus: {
					status: 0, // 活动状态
					leftTime: 0, // 剩余时间
					type: '' // 当前活动类型
				}, // 活动状态
				pageBgImage: './static/images/bg-page-dianzan.png',
			}
		},
		async onLoad(options) {
			this.pageOptions = options
			this.pageLoad(options)
		},
		async onShow() {
			 this.audioStatus = 'play'
			 this.mainMixin_BeforeFetchPageData()
			 this.user_info = this.$store.state.userInfo || {}
			 this.referee_id = this.referee_id || this.user_info.user_id
			 // this.pageLoad(this.options)
			 this.isUserShare = !!this.referee_id
			 this.pagePath = 'pages/subPages/fabulous/index?praise_id='+this.praise_id
			 await this.getCommonBasicsRes()
			 // 自定义页面标题和背景图
			 uni.setNavigationBarTitle({
			 	title: this.basicsData.title
			 })
			 this.pageBgImage = this.basicsData.praise_img
			 await this.setActivityCutTime()
			 await this.getMainJoinRes()
			 await this.getSelfJoinRes()
			 // 链接的refree_id用户没有未参与过活动，但打开链接的用户参与过活动时
			 if(this.referee_id && !this.mainUserInfo.user_data.nickName && this.selfUserInfo.user_data.nickName) {
			 	this.mainUserInfo = this.selfUserInfo
			 	this.referee_id = this.user_info.user_id
			 	// 此情况显示分享按钮
			 	this.showShare = true 
			 }
			 await this.getJoinActivityUserRes()
			 this.getPrizeRecordRes()
			 this.getLocation()
			 // 分享
			 this.share()
			console.log(this.referee_id,'最后结果')
		},
		onHide() {
			this.audioStatus = 'pause'
		},
		watch: {
			prizeRecordPage() {
				setTimeout(() => {
					this.getPrizeRecordRes()
				},5000)
			}
		},
		computed: {
			startTime() {
				return this.basicsData && this.basicsData.start_time
			},
			endTime() {
				return this.basicsData && this.basicsData.end_time
			},
			showJoinContent() {
				return this.mainUserInfo && this.mainUserInfo.user_data && this.mainUserInfo.user_data.nickName
			},
			communityImg() {
				return function(index) {
					return (this.community[index] && this.community[index].headimg && this.community[index].headimg[0] && this.community[index].headimg[0].file_path) || ''
				}
			},
			// 显示加入按钮
			showJoinBtn() {
				return !this.selfUserData.nickName
			},
			// 显示查看我的按钮
			showLookMeBtn() {
				return this.referee_id != this.user_info.user_id && this.selfUserData && this.selfUserData.nickName
			},
			// 显示分享按钮
			showShareBtn() {
					return this.referee_id == this.user_info.user_id && this.mainUserInfo && this.mainUserInfo.user_data && this.mainUserInfo.user_data.nickName
			},
			//  背景音乐样式
			audioStyle() {
				return 'position: absolute;color: #F9D235;background: #333;right: 15px;top: 100px;z-index: 5;'
			},
			// 微信小程序客服组件
			cSendMessage() {
				let refereeId = this.isUserShare ? this.user_info.user_id : this.referee_id
			    return {
			        path: 'pages/subPages/fabulous/index?praise_id=' + this.praise_id + '&referee_id=' + refereeId,
			        title: this.mainUserInfo.title
			    }
			}
			
		},
		methods:{
			// 获取有无用户参与公共基础数据
			async getCommonBasicsRes() {
				try {
					// let params = {praise_id:this.praise_id}
					let params = {praise_id:this.praise_id,referee_id:this.referee_id}
					// #ifdef H5
					params = this.isUserShare ? {praise_id:this.praise_id,referee_id:this.referee_id} : {praise_id:this.praise_id}
					// #endif
					const res = await App._postP('praise.Praise/detail',params)
					this.basicsData = res.data
					this.community = res.data.community
					console.log(this.community,'999999999999')
				} catch(e) {
					console.log(e)
				}
			},
			// 点赞主用户信息
			async getMainJoinRes() {
				try {
					const res = await App._postP('praise.Praise/praiseJoinInfo',{praise_id:this.praise_id,referee_id:this.referee_id})
					this.mainUserInfo = res.data
					console.log(this.mainUserInfo,'mainUserInfo=======')
				} catch(e) {
					console.log(e)
				}
			},
			// 获取自己的点赞信息
			async getSelfJoinRes() {
				try {
					const res = await App._postP('praise.Praise/praiseJoinInfo',{praise_id:this.praise_id,referee_id:this.user_info.user_id})
					this.selfUserData = res.data.user_data
					this.selfUserInfo = res.data
					console.log(this.selfUserInfo,'selfUserInfo=========')
				} catch(e) {
					console.log(e)
				}
			},
			
			// 获取领奖记录的数据
			async getPrizeRecordRes() {
				try {
					const res = await App._postP('praise.Praise/hasPrizeUser',
					{
						praise_id: this.praise_id,
						page: this.prizeRecordPage,
						list_rows: 25,
					})
					this.prizeData = res.data
					this.prizeLastPage = res.data.last_page
					this.prizeSwiperData = [...this.prizeSwiperData,...this.group(res.data.data,5)]
					if(this.prizeLastPage >= 2) {
						this.prizeRecordPage = 2
					}
					console.log(this.prizeSwiperData,'55555')
					
				}catch(e) {
					 console.log(e)
				}
			},
			// 获取参与活动用户及排行榜信息
			async getJoinActivityUserRes() {
				try {
					const res = await App._postP('praise.Praise/joinUser',{praise_id:this.praise_id})
					let mainInfo = res.data
					this.joinCount = mainInfo.join_count
					this.joinData = mainInfo.join_data
					this.rankingData = mainInfo.order_lists
					let arr = this.rankingData.map((item,index) => {
						if(item.user_id == this.user_info.user_id) {
							this.selfRanking = index + 1
							this.formerRanking = true
						}
					})
					this.formerRankingData = this.rankingData.splice(0,3)
					console.log(this.rankingData,'排行榜数据')
					console.log(this.formerRankingData,'前三数据')
				} catch(e) {
					console.log(e)
				}
			},
			// 转发
			getPraiseForwardRes() {
				try {
					const res = App._postP('praise.Praise/forward',{praise_id:this.praise_id})
				}catch(e) {
					console.log(e)
				}
			},
			// 海报 
			async getPosterRes() {
				try {
					const res = await App._postP('praise.Praise/poster',{praise_id:this.praise_id})
				}catch(e) {
					console.log(e)
				}
			},
			// 加入活动
			async getJoinActivityRes() {
				try {
					let params = {praise_id:this.praise_id}
					if(this.basicsData.user_group == 5) {
						params = {
							praise_id:this.praise_id,
							lat: this.lat,
							lng: this.lng
						}
					}
					const res = await App._postP('praise.Praise/join',params)
					if(res.msg == '参与成功') {
						this.joinSuccess = true
					}
				} catch(e) {
					console.log(e)
				}
				
			},
			// 点赞
			async getPraiseRes() {
				try {
					const res = await App._postP('praise.Praise/praise',{praise_id:this.praise_id,referee_id:this.referee_id})
					if(res.msg == '点赞成功') {
						this.successPraise = true
					}
				} catch(e) {
					console.log(e)
				}
				
			},
			// 时间数据
			async setActivityCutTime() {
				let start_time = this.startTime,
					end_time = this.endTime 
				this.activityStatus = await App.getActivityStatus(start_time, end_time)
				console.log('时间数据',this.activityStatus)
			},
			// 点击按钮加入活动
			async handleJoinClick() {
				// 活动进行中如果强制关注公众号且没有关注公众号时引导关注公众号
				if(this.basicsData.have_in_wechat == 2 && this.basicsData.is_subscribe == 1 && this.activityStatus.status == 1) {
					this.leadShowAttention = true
				} else {
					this.stopClick = true
					uni.showLoading({
						title: '加载中'
					})
					await this.getJoinActivityRes()
					this.stopClick = false
					uni.hideLoading()
					if(this.joinSuccess) {
						this.referee_id = this.user_info.user_id
						uni.showToast({
							title: '参与成功',
							duration: 2000
						})
					}
					// #ifdef MP-WEIXIN
					this.subscribeDraw()
					// #endif
					this.getMainJoinRes()
					// 刷新排行榜、参与、中奖纪录的数据
					this.getPrizeRecordRes()
					await this.getJoinActivityUserRes()
					this.getSelfJoinRes()
				}
			},
			// 抽奖消息订阅
			async subscribeDraw() {
				// 锁
				if (this.beingSubscribeDraw) {
					return
				}
				this.beingSubscribeDraw = true
				uni.showLoading({
					title: '请稍后'
				})
				try {
					// 获取drawTmplIds有必要的话
					console.log(this.drawTmplIds);
					if (this.drawTmplIds && this.drawTmplIds.length === 0) {
						const res = await App._postP('wxapp.sub/getIds', {
							op: 'lottery'
						})
						this.drawTmplIds = this.$util.deepGet(res, 'data') || []
					}
					console.log(this.drawTmplIds);
					// 进行消息订阅
					await wxRequestSubscribeMessageX({
						tmplIds: this.drawTmplIds,
						showMessage: false
					})
				} catch (e) {
					//TODO handle the exception
					console.log(e);
				}
				uni.hideLoading()
				// 解锁
				this.beingSubscribeDraw = false
			},
			// 点击帮TA一下
			async handleHelpClick() {
				if(this.activityStatus.status == 2) {
					uni.showToast({
						title: '活动已结束',
						duration: 2000,
						icon: 'none'
					})
				}else if(this.mainUserInfo.is_help) {
					uni.showToast({
						title: '不能重复点赞',
						duration: 2000,
						icon: 'none'
					})
				}else {
					if(this.basicsData.have_in_wechat == 2 && this.basicsData.is_subscribe == 1 && this.activityStatus.status == 1) {
						this.leadShowAttention = true
					}else {
						this.stopClick = true
						uni.showLoading({
							title: '加载中'
						})
						await this.getPraiseRes()
						if(this.successPraise) {
							this.stopClick = false
							uni.hideLoading()
							uni.showToast({
								title: '点赞成功',
								duration: 2000
							})
						}
						// 刷新点赞主用户、参与活动用户、排行榜及领奖记录数据
						await this.getMainJoinRes()
						this.getJoinActivityUserRes()
						this.getPrizeRecordRes()
					}
				}
			},
			// 查看我的
			handleLookMeClick() {
				if(this.user_info.user_id) {
					this.referee_id = this.user_info.user_id
					this.getMainJoinRes()
					this.share()
				}
			},
			// 推荐商品跳转详情页
			handleBuyGoodsClick(goods_id) {
				App.navigationTo({
					url: `pages/subPages/goods/index/index?goods_id=${goods_id}`
				})
			},
			// 页面加载处理
			pageLoad(options) {
				let scene = App.getSceneData(options),
				{
					a, //praise_id
					b  //referee_id
				} = scene
				this.praise_id = a || options.praise_id,
				this.referee_id = b || options.referee_id
			},
			// 添加社群
			onToggleCommunity(index) {
				this.popupInfo = this.community[index]
				if(this.popupInfo.community_type == 4 || this.popupInfo.community_type == 2) {
					this.showLongPressBtn = false
				}
			    this.showCommunity = true
			},
			// 社群拨打电话
			callPhone(phoneNumber) {
			    uni.makePhoneCall({
			        phoneNumber: String(phoneNumber)
			    })
			},
			// 获取当前经纬度
			getLocation() {
				App.getLocation().then(res => {
					this.lng = res.longitude
					this.lat = res.latitude
					console.log(this.lng,this.lat,'经纬度===============')
				}).catch(() => {
					App.hideLoading()
				});
			},
			// 自定义分享
			share() {
				let user_id = this.user_info.user_id ? this.user_info.user_id : '',
					nick_name = this.user_info.nickName ? this.user_info.nickName : '',
					imageUrl = this.basicsData.praise_sapp_img,
					wechat_img = this.basicsData.praise_wechat_img,
					query = {
						praise_id: this.praise_id,
						referee_id: this.referee_id
					}
				// #ifdef H5
				this.shareData = this.pageShareMixin_createShareData({
					title: nick_name + ' 邀请您集赞赢好礼啦',
					desc: this.basicsData.praise_wechat_text,
					imgUrl: wechat_img,
					query
				})
				// #endif
				// #ifdef MP
				this.shareData = this.pageShareMixin_createShareData({
				    title: nick_name + ' 邀请您集赞赢好礼啦',
				    imgUrl: imageUrl,
				    query
				})
				// #endif
			},
			group(array,subLength) {
				let index = 0
				let newArray = []
				while(index < array.length) {
					newArray.push(array.slice(index,index += subLength))
				}
				return newArray
			},
			follow() {
				let _this = this;
				// #ifdef MP
				_this.showAttention = true;
				// #endif
				// #ifndef MP
				_this.$store.commit('setWechatFollow', false)
				App.navigationTo({
					url: `pages/subPages/dealer/apply/attention?type=attention&wechat_image=${encodeURIComponent(_this.basicsData.subscribe_wechat_img)}`
				})
				// #endif
			},
			handlePrizeClick() {
				App.navigationTo({
					url: 'pages/subPages/drawlotter/drawlotterlist/drawlotterlist?type=1'
				})
			},
			handleToHomeClick() {
				App.navigationTo({
					url: `pages/mainPages/index/index`
				})
			},
			handleShareClick() {
				this.getPraiseForwardRes()
				this.getCommonBasicsRes()
			}
		},
		onShareTimeline() {
			return {
				title: this.$util.deepGet(this.user_info,'nickName') + ' 邀请您集赞赢好礼啦',
				imageUrl: this.$util.deepGet(this.basicsData,'praise_sapp_img')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-fabulous {
		min-height: 100vh;
		background-color: #FFD940 ;
		// background-color: var(--theme-color, #FFD940);
		position: relative;
		padding-bottom: 160rpx;
	}
	.rotate_visibility {
		animation: rotate 3s linear infinite;
	}
	.stop_click {
		pointer-events: none;
	}
	.background_music {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #333333;
		color: #F9D235;
		position: absolute;
		right: 30rpx;
		top: 340rpx;
		.iconfont {
			font-size: 50rpx;
		}
	}
	@keyframes rotate {
		0%{-webkit-transform:rotate(0deg);}
		25%{-webkit-transform:rotate(90deg);}
		50%{-webkit-transform:rotate(180deg);}
		75%{-webkit-transform:rotate(270deg);}
		100%{-webkit-transform:rotate(360deg);}
	}
	
	// 关注弹窗
	.community-detail {
		border-radius: 20rpx;
		padding-bottom: 35rpx;
		overflow: hidden;
	}
	
	.icon-roundclose {
		position: absolute;
		left: 50%;
		bottom: -40px;
		display: inline-lock;
		font-size: 50rpx;
		width: 1em;
		height: 1em;
		line-height: 1em;
		color: #FFFFFF;
		transform: translateX(-50%);
	}
	
	.community-detail .community-header {
		width: 70vw;
		height: 210rpx;
		background-size: 100% 100%;
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
	
	.community-detail .community-header .attention {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 153rpx;
		height: 135rpx;
		display: block;
		z-index: 10;
	}
	
	.community-detail .community-body {
		padding: 50rpx;
	}
	
	.community-detail .community-reply {
		width: 200rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: #FFD941;
		border-radius: 35rpx;
		margin: 0 auto;
	}
	// 关注弹窗 end
	
	// 客服回话弹窗
	.goods-community {
		width: 690rpx;
		margin: auto;
		padding: 30rpx 0 10rpx 0;
		background-color: #fff;
		border-radius: 10rpx;
		margin-top: 20rpx;
	}
	.community-item {
		width: 650rpx;
		margin: auto;
		margin-bottom: 20rpx;
	}
	.community-user .community-user-img {
		width: 68rpx;
		height: 68rpx;
		display: block;
		margin-right: 20rpx;
		border-radius: 50%;
	}
	
	.community-add {
		width: 120rpx;
		height: 54rpx;
		line-height: 54rpx;
		background-color: #2AC418;
		border-radius: 10rpx;
		font-size: 24rpx;
	}
	// 客服回话弹窗 end
	
	// .community-detail {
	// 	border-radius: 20rpx;
	// 	overflow: hidden;
	// }
	
	// .community-detail .community-header {
	// 	width: 70vw;
	// 	height: 120rpx;
	// 	line-height: 120rpx;
	// }
	
	// .community-detail .community-header .community-header-text {
	// 	z-index: 2;
	// }
	
	// .community-detail .community-header::after {
	// 	content: " ";
	// 	position: absolute;
	// 	top: -160rpx;
	// 	left: -25%;
	// 	width: 150%;
	// 	height: 280rpx;
	// 	border-radius: 60%;
	// 	background: #FFD940;
	// 	background: var(--theme-color);
	// 	z-index: 1;
	// }
	
	// .community-detail .community-body {
	// 	padding: 50rpx;
	// }
	
	// .community-detail .community-phone {
	// 	height: 80rpx;
	// 	line-height: 80rpx;
	// 	margin: 0 30rpx 30rpx;
	// 	padding: 0 20rpx;
	// 	border-radius: 20rpx;
	// 	background: rgba(255, 217, 64, .2);
	// }
	
	// .community-detail .community-number .community-number-icon {
	// 	width: 30rpx;
	// 	height: 30rpx;
	// 	display: block;
	// 	margin-right: 15rpx;
	// }
	
	// .community-detail .community-bdial {
	// 	width: 96rpx;
	// 	height: 52rpx;
	// 	line-height: 52rpx;
	// 	background: #FFD941;
	// 	border-radius: 10rpx;
	// }
	
	// .community-detail .community-reply {
	// 	width: 200rpx;
	// 	height: 70rpx;
	// 	line-height: 70rpx;
	// 	background: #FFD941;
	// 	border-radius: 35rpx;
	// 	margin: 0 auto 30rpx;
	// }
	
	// .community-detail .community-qrcodeimg {
	// 	width: 366rpx;
	// 	height: 366rpx;
	// 	display: block;
	// 	margin: 0 auto 30rpx;
	// }
	
	
	
	// 引导关注公众号
	// .community-detail-lead {
	// 	border-radius: 20rpx;
	// 	padding-bottom: 35rpx;
	// }
	
	// .community-detail-lead .icon-roundclose {
	// 	position: absolute;
	// 	left: 50%;
	// 	bottom: -2em;
	// 	font-size: 50rpx;
	// 	width: 1em;
	// 	height: 1em;
	// 	line-height: 1em;
	// 	color: #FFFFFF;
	// 	transform: translateX(-50%);
	// }
	
	// .community-detail-lead .community-header {
	// 	width: 70vw;
	// 	height: 210rpx;
	// 	background-size: 100% 100%;
	// }
	
	// .community-detail-lead .community-header .attention {
	// 	position: absolute;
	// 	top: 50%;
	// 	left: 50%;
	// 	transform: translate(-50%, -50%);
	// 	width: 153rpx;
	// 	height: 135rpx;
	// 	display: block;
	// }
	
	// .community-detail-lead .community-body {
	// 	padding: 50rpx;
	// }
	
	// .community-detail-lead .community-reply {
	// 	width: 200rpx;
	// 	height: 70rpx;
	// 	line-height: 70rpx;
	// 	background: #FFD941;
	// 	border-radius: 35rpx;
	// 	margin: 0 auto;
	// }
	.img_shouzhi{
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		top: 50%;
		left: 50%;
	}
	
	.attention-box {
		background: #FFFFFF;
		width: 530rpx;
		border-radius: 10rpx;
		padding: 50rpx 50rpx 30rpx;
		position: relative;
	}
	
	.attention-box .icon-roundclose {
		position: absolute;
		left: 50%;
		bottom: -2em;
		transform: translateX(-50%);
		font-size: 52rpx;
		color: #FFFFFF;
		width: 1em;
		height: 1em;
		line-height: 1em;
		text-align: center;
	}
	
	.attention-box .attention-title {}
	
	.attention-label {
		margin-bottom: 30rpx;
	}
	
	.attention-label .label-num {
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		border-radius: 4rpx;
		background: #FFD940;
		margin-right: 10rpx;
	}
	
	.wechat-image {
		width: 264rpx;
		height: 264rpx;
		display: block;
		margin: 0 auto;
	}
	
	.dialogue-wechat {}
	
	.dialogue-info {
		width: 460rpx;
		margin: 0 auto;
		background: #EEEEEE;
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.dialogue-detail {
		position: relative;
		border-radius: 10rpx;
		flex: 1;
		padding: 12rpx;
	}
	
	.dialogue-detail::after {
		content: " ";
		position: absolute;
		top: 12px;
		left: -10px;
		width: 0;
		height: 0;
		border: 5px solid transparent;
		border-right-color: #FFFFFF;
	}
	
	.wechat-img {
		position: relative;
		font-size: 22rpx;
		width: 80rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		background: #FFFFFF;
		margin-right: 20rpx;
	}
	
	.wechat-img::after {
		content: "公众号";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0.75);
		font-size: 22rpx;
		width: 100%;
		height: 100%;
	}
	
	.dialogue-img {
		width: 460rpx;
		height: 60rpx;
		display: block;
		margin: 0 auto;
	}
	
	.dialogue-we {
		width: 60rpx;
		height: 60rpx;
		display: block;
	}
	// 引导关注 end
	
	.attention {
		height: 80rpx;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0,0,0,.5);
		z-index: 100;
		.btn {
			width: 152rpx;
			height: 54rpx;
			line-height: 54rpx;
			background-color: #2AC418;
			border-radius: 10rpx;
			margin-left: 550rpx;
		}
	}

	
	.banner {
		width: 100%;
		height: 530rpx;
	}
	.user_num {
		height: 130rpx;
		.look,.forward,.join {
			width: 200rpx;
			height: 70rpx;
			.common_color {
				color: #FF4444;
			}
		}
	}
	.common-box {
		width: 690rpx;
		margin: 0 30rpx 0 30rpx;
		background: #fff;
		border-radius: 10rpx;
	}
	.common-content {
		width: 630rpx;
		margin: 0 30rpx 0 30rpx;
	}
	.prize-list {
		width: 690rpx;
		border-radius: 10rpx;
		background-color: #fff;
		margin: 19rpx 30rpx 0 30rpx;
		overflow: hidden;
		.prize-list-title {
			width: 180rpx;
			height: 12rpx;
			position: relative;
			margin: 60rpx auto 0;
			background: #FFD940;
			.style {
				position: absolute;
				left: 0;
				right: 0;
				top: -24rpx;
			}
		}
		.list-content {
			width: 690rpx;
			.prize-list-item {
				height: 160rpx;
				padding: 40rpx 0;
				border-top: 1rpx solid #eee;
				&:first-child {
					border: none;
				}
				.prize-photo {
					width: 160rpx;
					height: 160rpx;
					border-radius: 4rpx;
					position: relative;
					margin-bottom: 30rpx;
					margin-left: 20rpx;
					image {
						width: 100%;
						height: 100%;
						border-radius: 4rpx;
					}
					.prize-access {
						width: 100%;
						height: 40rpx;
						background: #000;
						opacity: 0.8;
						text-align: center;
						line-height: 40rpx;
						position: absolute;
						bottom: 0;
						left: 0;
					}
				}
				.prize-info {
					width: 470rpx;
					height: 160rpx;
					margin-right: 20rpx;
					.prize-describe {
						height: 56rpx;
						line-height: 28rpx;
					}
					.prize-margin {
						height: 24rpx;
						line-height: 24rpx;
					}
					.prize-else-info {
						.prize-value {
							width: 213rpx;
							height: 50rpx;
							font-weight: bold;
							text-align: center;
							line-height: 50rpx;
							background: #FFD940;
							border-radius: 25rpx 0 0 25rpx;
						}
						.prize-furnish {
							width: 227rpx;
							height: 50rpx;
							padding: 0 15rpx;
							text-align: center;
							line-height: 50rpx;
							background: #333;
							border-radius: 0 25rpx 25rpx 0;
						}
					}
				}
			}
			
		}
	}
	.add-favour {
		margin-top: 90rpx;
		padding-bottom: 20rpx;
		.common-content {
			position: relative;
			.main-user-photo {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50rpx;
				position: absolute;
				top: -50rpx;
				left: 265rpx;
				image {
					width: 100%;
					height: 100%;
					border-radius: 50rpx;
					border: 1rpx solid #ccc;
				}
			}
			.main-user-name {
				height: 28rpx;
				text-align: center;
				line-height: 28rpx;
				padding-top: 70rpx;
			}
			.collect-info {
				height: 28rpx;
				text-align: center;
				line-height: 28rpx;
				margin-top: 37rpx;
				font-weight: bold;
			}
			.activity-type {
				margin:40rpx 0 60rpx 0;
				overflow: hidden;
				.btn-box {
					width: 630rpx;
					height: 90rpx;
					overflow: hidden;
					.help {
						width: 390rpx;
						height: 90rpx;
						line-height: 85rpx;
						.img {
							width: 351rpx;
							height: 81rpx;
							font-size: 26rpx;
							position: relative;
							animation: helpbtn 0.5s infinite;
							animation-direction: alternate;
							.text {
								width: 100%;
								height: 100%;
								position: absolute;
								text-align: center;
								left: 0;
								top: -5rpx;
								z-index: 10;
							}
							image {
								width: 100%;
								height: 100%;
							}
						}
					}
					.join {
						width: 210rpx;
						height: 90rpx;
						line-height: 85rpx;
						margin-left: 30rpx;
						.img {
							width: 175rpx;
							height: 75rpx;
							font-size: 26rpx;
							position: relative;
							animation: joinbtn 0.5s infinite;
							animation-direction: alternate;
							.text {
								width: 100%;
								height: 100%;
								position: absolute;
								text-align: center;
								left: 0;
								top: -5rpx;
								z-index: 10;
							}
							image {
								width: 100%;
								height: 100%;
							}
						}
					}
				}
			}
			.help-user {
				height: 60rpx;
				padding-bottom: 30rpx;
				image {
					width: 60rpx;
					height: 60rpx;
					border-radius: 30rpx;
					border: 1rpx solid #ccc;
				}
				.help-user-name {
					width: 100rpx;
				}
			}
		}
	}
	.activity-type .btn-box:nth-child(2) {
		visibility: hidden;
	}
	// 参与活动时按钮的动画效果
	@keyframes helpbtn {
		from {
			width: 351rpx;
			height: 81rpx;
			font-size: 26rpx;
		} to {
			width: 390rpx;
			height: 90rpx;
			font-size: 28rpx;
		}
	}
	@keyframes joinbtn {
		from {
			width: 189rpx;
			height: 81rpx;
		} to {
			width: 210rpx;
			height: 90rpx;
		}
	}
	
	.join-activity {
		margin-top: 20rpx;
		padding-bottom: 20rpx;
		overflow: hidden;
		.title {
			width: 140rpx;
			height: 12rpx;
			line-height: 30rpx;
			position: relative;
			margin: 60rpx auto 0;
			background: #FFD940;
			.style {
				position: absolute;
				left: 0;
				right: 0;
				top: -24rpx;
			}
		}
		.common-content {
			.join-total {
				width: 100%;
				margin-top: 19rpx;
				font-weight: bold;
				text-align: center;
				line-height: 32rpx;
			}
			.join-user-list {
				margin-top: 39rpx;
				.join-user {
					width: 90rpx;
					height: 104rpx;
					margin-bottom: 20rpx;
					image {
						width: 60rpx;
						height: 60rpx;
						border-radius: 30rpx;
						border: 1rpx solid #ccc;
					}
					.user-name {
						padding-top: 14rpx;
						width: 70rpx;
						height: 30rpx;
					}
				}
			}
		}
	}
	.prize-record {
		margin-top: 20rpx;
		padding-bottom: 20rpx;
		overflow: hidden;
		.title {
			width: 140rpx;
			height: 12rpx;
			line-height: 30rpx;
			position: relative;
			margin: 60rpx auto 0;
			background: #FFD940;
			.style {
				position: absolute;
				left: 0;
				right: 0;
				top: -24rpx;
			}
		}
		.common-content {
			.join-total {
				width: 100%;
				margin-top: 19rpx;
				font-weight: bold;
				text-align: center;
				line-height: 32rpx;
			}
			.prize-user-list {
				height: 520rpx;
				.prize-user {
					height: 62rpx;
					margin-top: 40rpx;
					image {
						width: 60rpx;
						height: 60rpx;
						border: 1rpx solid #ccc;
						border-radius: 30rpx;
					}
					.name {
						width: 140rpx;
					}
				}
			}
		}	
	}
	.praise_ranking {
		position: relative;
		.former_ranking {
			height: 600rpx;
			width: 750rpx;
			color: #343434;
			position: relative;
			.first {
				position: absolute;
				left: 280rpx;
				top: 20rpx;
			}
			.second {
				position: absolute;
				left: 60rpx;
				top: 100rpx;
			}
			.third {
				position: absolute;
				left: 490rpx;
				top: 160rpx;
			}
			.former_ranking_common {
				width: 200rpx;
				z-index: 10;
				.img {
					width: 150rpx;
					height: 150rpx;
					background-color: rgba(182,132,52,.14);
					border-radius: 50%;
					.common_border {
						width: 134rpx;
						height: 134rpx;
						background-color: rgba(182,132,52,.24);
						border-radius: 50%;
						image {
							width: 120rpx;
							height: 120rpx;
							border-radius: 50%;
						}
					}
				}
				.name {
					width: 100%;
					margin-top: 20rpx;
				}
				.total {
					margin-top: 10rpx;
					text {
						color: #FF4444;
					}
				}
			}
			.former_img {
				width: 750rpx;
				height: 370rpx;
				position: absolute;
				bottom: 0rpx;
			}
		}
		.ranking-box {
			padding-bottom: 30rpx;
			.common-content {
				.title {
					width: 100%;
					height: 80rpx;
					line-height: 80rpx;
					color: #9A9A9A;
					.ranking {
						width: 50rpx;
						text-align: center;
					}
					.name {
						width: 200rpx;
						margin-left: 14rpx;
					}
					.total {
						margin-left: 220rpx;
					}
				}
				.self_ranking {
					width: 100%;
					height: 100rpx;
					background: #FFD940;
					border: 1rpx solid #8F610D;
					border-radius: 10rpx;
					.ranking {
						width: 50rpx;
						height: 50rpx;
						line-height: 50rpx;
						text-align: center;
					}
					image {
						width: 60rpx;
						height: 60rpx;
						border: 1rpx solid #ccc;
						border-radius: 30rpx;
						margin-left: 30rpx;
					}
					.name {
						width: 200rpx;
						margin-left: 14rpx;
					}
					.total {
						width: 160rpx;
						margin-left: 110rpx;
						text-align: center;
					}
				}
				.ranking-list {
					.ranking-list-item {
						width: 100%;
						height: 100rpx;
						.ranking {
							width: 50rpx;
							height: 50rpx;
							line-height: 50rpx;
							text-align: center;
						}
						image {
							width: 60rpx;
							height: 60rpx;
							border: 1rpx solid #ccc;
							border-radius: 30rpx;
							margin-left: 30rpx;
						}
						.name {
							width: 200rpx;
							margin-left: 14rpx;
						}
						.total {
							width: 160rpx;
							margin-left: 110rpx;
							text-align: center;
						}
					}
				}
			}
		}
	}
	.recommend-goods {
		margin-top: 20rpx;
		overflow: hidden;
		.common-content {
			.title {
				width: 188rpx;
				height: 52rpx;
				line-height: 52rpx;
				background: linear-gradient(0deg, rgba(255, 138, 68, 1) 0%, rgba(255, 68, 68, 1) 100%);
				border-radius: 26rpx;
				text-align: center;
				margin: 30rpx auto 50rpx;
			}
			.goods-list {
				padding-bottom: 20rpx;
				.goods-list-item {
					height: 160rpx;
					margin-bottom: 20rpx;
					.photo{
						width: 160rpx;
						height: 160rpx;
						border-radius: 4rpx;
						image {
							width: 100%;
							height: 100%;
							border-radius: 4rpx;
						}
					}
					.goods-info {
						width: 454rpx;
						.goods-title {
							
						}
						.info {
							.price {
								color: #FF4444;
								font-weight: bold;
							}
							.old-price {
								text-decoration: line-through;
							}
							.buy-button {
								width: 146rpx;
								height: 54rpx;
								line-height: 54rpx;
								text-align: center;
								background: #FFD940;
								border-radius: 27rpx;
							}
						}
					}
				}
			}
		}
	}
	.content-detail {
		width: 225rpx;
		height: 78rpx;
		border-radius: 30rpx;
		background: #7E3C0A;
		color: #FBEBD6;
		text-align: center;
		line-height: 78rpx;
		margin: 40rpx auto 60rpx;
		position: relative;
		.triangle {
			width: 0;
			height: 0;
			border: 30rpx solid;
			border-color: #7E3C0A transparent transparent;
			position: absolute;
			left: 80rpx;
			bottom: -55rpx;
		}
	}
	.nojoin {
		width: 100%;
		height: 120rpx;
		padding-bottom: 20rpx;
		.join-box {
			width: 621rpx;
			height: 108rpx;
			margin: 50rpx auto 0;
			animation: joinActivityBtn 0.5s infinite;
			animation-direction: alternate;
			position: relative;
			.text {
				width: 100%;
				height: 100%;
				line-height: 160rpx;
				position: absolute;
				text-align: center;
				z-index: 10;
				left: 0;
				top: -30rpx;
			}
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	// 未参与活动时按钮动画效果
	@keyframes joinActivityBtn {
		from {
			width: 621rpx;
			height: 108rpx;
		} to {
			width: 690rpx;
			height: 120rpx;
		}
	}
	.lottery-rule {
		margin: 40rpx auto 0;
		width: 690rpx;
		height: 300rpx;
		background-color: #fff;
		border-radius: 10rpx;
		overflow: hidden;
		.title {
			width: 140rpx;
			height: 12rpx;
			line-height: 30rpx;
			position: relative;
			margin: 60rpx auto 0;
			background: #FFD940;
			.style {
				position: absolute;
				left: 0;
				right: 0;
				top: -24rpx;
			}
		}
		.step {
			width: 600rpx;
			height: 160rpx;
			margin: 35rpx auto 0;
			.invite,.wait,.result {
				width: 150rpx;
				height: 160rpx;
			}
			.step-arrows {
				width: 75rpx;
				height: 120rpx;
				.line {
					width: 35rpx;
					height: 1rpx;
					border-bottom: 1px dashed #F5C53A;
					position: relative;
					.arrows {
						width: 0;
						height: 0;
						border: 15rpx solid;
						border-color: transparent transparent transparent #F5C53A;
						position: absolute;
						right: -33rpx;
						bottom: -15rpx;
					}
				}
			}
			image {
				width: 120rpx;
				height: 120rpx;
			}
		}
	}
	.btm-fix {
		width: 100%;
		height: 100rpx;
		position: fixed;
		bottom: 30rpx;
		left: 0;
		z-index: 11;
		.btm-bar {
			margin-left: 30rpx;
			width: 570rpx;
			height: 100rpx;
			background: #F9D235;
			box-shadow: 2rpx 2rpx 12rpx #9D7E00;
			border-radius: 50rpx;
			.home,.prize,.share,.poster {
				width: 100rpx;
				height: 100rpx;
				.text {
					padding-top: 10rpx;
				}
			}
			.iconfont {
				width: 40rpx;
				height: 40rpx;
				font-size: 40rpx;
			}
		}
		.share-btn {
			margin-left: 20rpx;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50rpx;
			background-color: #333333;
			color: #F9D235;
			position: relative;
			box-shadow: 0 0 10rpx 4rpx #9D7E00;
			// button {
			// 	width: 100%;
			// 	height: 100%;
			// 	opacity: 0;
			// 	position: absolute;
			// 	top: 0;
			// 	left: 0;
			// }
			.iconfont {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}
	
</style>
