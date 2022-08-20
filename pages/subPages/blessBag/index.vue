<template>
	<view class="">
		<!-- #ifdef H5 -->
		<view v-if="shareImg" class="shareHfive" @click="closeShare">
			<image src="./static/image/share.png" class="to-share" mode="widthFix"></image>
		</view>
		<!-- #endif -->
		<image class="banner" :src="blessDetail.blessing_img" mode=""></image>
		<view class="bullent" v-if="bullentList.length > 0" v-show="showTips">
			<!-- 弹幕 -->
			<view class="">
				<view class="bullentOne ">
					<view class="" style="line-height: 100%;">
						<text style="font-size: 24rpx;">{{bullentList[bullentIndex]?bullentList[bullentIndex]:""}}</text>
					</view>
				</view>
			</view>
		</view>
		<AudioIcon v-if="blessDetail.blessing_music" v-model="audioStatus" :src="blessDetail.blessing_music" :styleStr="audioStyle"></AudioIcon>
		<view class="activity-motai" v-if="cjShow" @click="closeMotai">
			<view class="motai-baner" v-if="cjGx" :style="{backgroundImage: getImageRoot('open.png', 'url')}">
				<image class="motai-img" src="./static/image/fudai-right.png" mode=""></image>
				<view class="motai-gx">
					恭喜您
				</view>
				<view class="motai-yz">
					抽到一张【{{zhongName}}】卡
				</view>
				<view class="motai-sy">
					剩余{{zhongNum}}次
				</view>
				<button :open-type="zsBtnType" v-if="isOpenGive && iszsBtn" class="motai-zs" @click.stop="zsTrueMotai">
					赠送好友 >
				</button>
			</view>
			<view class="motai-baner-wu" v-if="wu" :style="{backgroundImage: getImageRoot('out.png', 'url')}">
				<view class="motai-zi-wu">
					{{zhongNameTwo}}
				</view>
				<image class="motai-img-wu" src="./static/image/fudai-line.png" mode=""></image>

				<view class="motai-yz-wu">
					{{description}}
				</view>
				<button :open-type="zsBtnType" v-if="isOpenGive && iszsBtn" class="motai-zs-wu" @click.stop="zsTrueMotai">
					赠送好友 >
				</button>
			</view>
			<!-- <view class="motai-zsTrue" v-if="zsTrue">
				<view class="text">
					是否确定分享？
				</view>
				<view class="btn">
					<view @click.stop="closezsTrue" class="">取消</view>
					<button @click.stop="closezsTrue" open-type="share" type="default">确定</button>
				</view>

			</view> -->
		</view>
		<view class="content" style="padding-bottom: 150rpx;" :style="{background:blessDetail.background_color}">
			<view class="flow dis-flex flex-x-between flex-y-center">
				<view class="look f-24 col-3 dis-flex flex-y-center flex-x-between flex-dir-column">
					<view>浏览</view>
					<view class="num"><text class="f-36" style="font-weight: bold;">{{blessDetail.look_num | numberChange}}</text>人</view>
				</view>
				<view class="self-help f-24 col-3 dis-flex flex-y-center flex-x-between flex-dir-column">
					<view>求助量</view>
					<view class="num"><text class="f-36" style="font-weight: bold;">{{blessDetail.forward_num | numberChange}}</text>次</view>
				</view>
				<view class="join f-24 col-3 dis-flex flex-y-center flex-x-between flex-dir-column">
					<view>参与</view>
					<view class="num"><text class="f-36" style="font-weight: bold;">{{blessDetail.join_user_num | numberChange}}</text>人</view>
				</view>
			</view>
			<view class="activity">
				<view v-if="isShowCountDown" class="activity-tit">

					<view class="activity-titBox">
						<view class="activity-tit-left">
							活动倒计时：
						</view>

						<view class="activity-tit-right">
							<CountDown color="#FFFFFF" background-color="#7B4945" :day="day" :hour="hours" :minute="minutes" :second="seconds" @timeup="timeup"></CountDown>
						</view>
					</view>
				</view>
				
				<view v-else class="f-28 t-c" style="width: 690rpx; height: 80rpx;background: #F8F8F8;color: #7B4945;line-height: 80rpx;border-radius: 10rpx;">活动已结束</view>
				
				<view class="activity-subtit">{{blessDetail.title}}</view>
				<view class="activity-text">
					活动时间：{{blessDetail.start_time}}-{{blessDetail.end_time}}
				</view>
				<view class="activity-jd">
					<view class="activity-no">
						<view class="activity-fen">
							已领<text>{{prizeInfo.prize_get_num}}</text>/共{{prizeInfo.prize_num}}份
						</view>
						<view class="activity-pro">
							<cmd-progress :percent="progrePercent" stroke-color="#FFD940" stroke-width='10'></cmd-progress>
						</view>
					</view>
					<!-- <view class="line">

					</view> -->
					<!-- <view class="activity-liul">
						<view class="activity-liul-number">
							{{blessDetail.look_num}}
						</view>
						<view class="activity-liul-text">
							人浏览
						</view>
					</view> -->
				</view>
				<view class="lineH"></view>
				<view class="activity-fudai-img">
					<view class="fudai-img" v-for="(item,index) in blessDetail.font" :key="item.id" @click.stop="zsFriends(item.name,item.font_index,item.description,item.num)">
						<!-- type=2 自定义 -->
						<block v-if="blessDetail.setting.type == 1">
							<image class="template" v-if="item.num > 0 && blessDetail.setting.template == 1" :src="item.colours_img[0].file_path" mode="aspectFill"></image>
							<image class="template" v-if="item.num == 0  && blessDetail.setting.template == 1" :src="item.gray_img[0].file_path" mode="aspectFill"></image>
							<image class="template" v-if="item.num > 0  && blessDetail.setting.template == 2" :src="item.colours_img[0].file_path" mode="aspectFill"></image>
							<image class="template" v-if="item.num == 0  && blessDetail.setting.template == 2" :src="item.gray_img[0].file_path" mode="aspectFill"></image>
							<image class="template" v-if="item.num > 0  && blessDetail.setting.template == 3" :src="item.colours_img[0].file_path" mode="aspectFill"></image>
							<image class="template" v-if="item.num == 0  && blessDetail.setting.template == 3" :src="item.gray_img[0].file_path" mode="aspectFill"></image>
							<image class="template" v-if="item.num > 0  && blessDetail.setting.template == 4" :src="item.colours_img[0].file_path" mode="aspectFill"></image>
							<image class="template" v-if="item.num == 0  && blessDetail.setting.template == 4" :src="item.gray_img[0].file_path" mode="aspectFill"></image>
							<image class="template" v-if="item.num > 0  && blessDetail.setting.template == 5" :src="item.colours_img[0].file_path" mode="aspectFill"></image>
							<image class="template" v-if="item.num == 0 && blessDetail.setting.template == 5" :src="item.gray_img[0].file_path" mode="aspectFill"></image>
						</block>
						<block v-else>
							<image class="template" v-if="item.num > 0" :src="item.colours_img[0].file_path" mode="aspectFill"></image>
							<image class="template" v-else :src="item.gray_img[0].file_path" mode="aspectFill"></image>
						</block>
						
						<view class="fudai-num" v-if="item.num > 0">
							{{item.num}}
						</view>
						<view class="description" v-if="item.num > 0" :style="{color:blessDetail.setting.font_color}">
							{{item.name}}
						</view>
						<view class="description" v-else :style="{color:blessDetail.setting.font_color_no}">
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="activity-btn" v-if="blessDetail.user_status == 2">
					<button :disabled="isAcBtn" class="activity-btn-left" @click="acBtn">
						点我抽奖(剩余{{blessDetail.user_open_num}}次)
					</button>
					<button @click="shareFri" class="activity-btn-right" open-type="share">
						求助好友
					</button>
				</view>
				<view class="activity-btn" v-if="blessDetail.user_status == 1 && blessDetail.is_win_user_draw ==1">
					<button :disabled="isAcBtn" class="activity-btn-left" @click="acBtn">
						点我抽奖(剩余{{blessDetail.user_open_num}}次)
					</button>
					<button @click="shareFri" class="activity-btn-right" open-type="share">
						求助好友
					</button>
				</view>
				<view class="activity-btn" v-if="blessDetail.user_status == 1 && blessDetail.is_win_user_draw ==2">
					<button @click="clickJp" class="activity-btn-lj">
						点我领奖
					</button>
				</view>
			</view>

			<!-- 客服会话 -->
			<block v-if="community.length">
				<view class="goods-community m-top20 border-line border-top">
					<view v-for="(item,index) in community" :key="index" class="community-item dis-flex flex-x-between flex-y-center ">
						<view class="community-user dis-flex flex-y-center flex-box ">
							<!-- <image :src="item.headimg && item.headimg.length > 0 && !!item.headimg[0] ? item.headimg[0].file_path : '' " -->
							<image :src="communityImg(index)" class="community-user-img"></image>
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
				<popup-layer :showClose="true" :show="showCommunity" topTitle="关注提醒" :phone="popupInfo.mobile" :communityType="popupInfo.community_type"
				 :imgSrc="popupInfo.qrcodeimg && popupInfo.qrcodeimg.length > 0 && !!popupInfo.qrcodeimg[0]?popupInfo.qrcodeimg[0].file_path:''"
				 :isShowLongPressBtn="showLongPressBtn" :pagePath="pagePath" @closePopupBtn="showCommunity=false">
				</popup-layer>
				<!-- #endif -->

				<!-- #ifdef MP -->
				<popup-layer :showClose="true" :show="showCommunity" topTitle="联系客服" :phone="popupInfo.mobile" :communityType="popupInfo.community_type"
				 :imgSrc="getImageRoot('91.png')" footBtnText='去回复' :pagePath="pagePath" @closePopupBtn="showCommunity=false">
					<view v-if="appClientType ==='2'">
						有任何疑问，点击“<text class="col-m">去回复</text>”发送“<text class="col-m">{{popupInfo.id}}</text>”,即可添加客服微信
					</view>
				</popup-layer>
				<!-- #endif -->
				<!-- 社群弹窗 end -->
			</block>

			<!-- 本期奖品列表 -->
			<view class="prize">
				<view class="prize-tit">
					本期奖品
				</view>
				<view class="prize-line">

				</view>
				
				<view class="prize-cont">
					<image class="prize-img" :src="prizeInfo.image" mode="aspectFill"></image>
					<view class="prize-right dis-flex flex-dir-column flex-x-between">
						<view class="prize-name twolist-hidden">{{prizeInfo.title}}</view>
						<view class="prize-num">剩{{remainingPrizeNum}}份奖品</view>
						<view class="prize-btn">
							<view class="prize-btn-left">
								奖品值:¥{{blessDetail.prize_price}}
							</view>
							<view class="prize-btn-right">
								由{{prizeInfo.bus_name}}提供
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 中奖名单 -->
			<view class="nameList" v-if="userList.length > 0">
				<view class="nameList-tit">
					中奖名单
				</view>
				<view class="nameList-line">

				</view>
				<scroll-view class="nameList-cont" scroll-y="true">
					<view class="nameList-text" v-for="(item,index) in userList" :key='index'>
						<image class="nameList-img" :src="item.avatarUrl" mode=""></image>
						<view class="nameList-right">
							<view class="nameList-name">
								<view class="">
									{{item.nickName}}
								</view>
								<view class="">
									{{item.create_time}}
								</view>
							</view>
							<view class="nameList-suc">
								集卡成功
							</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 商家信息 -->
			<view class="shopMsg">
				<view class="shopMsg-tit">
					商家信息
				</view>
				<view class="shopMsg-line">

				</view>
				<block v-for="(item,index) in prizeInfo.store_ids" :key='item.id'>
					<view class="shopMsg-text">
						{{item.name}}
					</view>
					<view class="shopMsg-time">
						<block v-if="item.time && item.time.length > 0">
							营业时间：<text v-for="(store,storeIndex) in item.time" :key="storeIndex" style="margin-right: 10upx;">{{store[2] || ''}}{{store[0]}}-{{store[1]}}</text>
						</block>
						<block v-else>
							营业时间：{{item.start_time}}-{{item.end_time}}
						</block>
					</view>
					<view class="shopMsg-tel">
						<view class="shopMsg-tel-left">
							商家电话：{{item.mobile}}
						</view>
						<view class="shopMsg-tel-right" @click="callPhone(item.mobile)">
							拨打
						</view>
					</view>
					<view class="shopMsg-adr">
						<view class="shopMsg-adr-left">
							{{item.address}}
						</view>
						<view class="shopMsg-adr-right" @click="locationSee(item)">
							导航
						</view>
					</view>
				</block>

			</view>

			<!-- 优惠超值购 -->
			<view class="discount" v-if="showDiscount">
				<view class="discount-tit">
					优惠超值购
				</view>
				<view class="discount-cont" v-for="(item,index) in blessDetail.goods" :key='item.goods_id' @click="handleBuyGoodsClick(item.goods_id)">
					<image class="discount-img" :src="item.image" mode=""></image>
					<view class="discount-right dis-flex flex-dir-column flex-x-between">
						<view class="discount-name twolist-hidden">{{item.goods_name}}</view>
						<view class="discount-btn">
							<view class="discount-btn-left">
								<view>
									<text style="font-size: 24rpx;">¥</text><text style="font-size: 36rpx;">{{item.goods_price}}</text>
								</view>
								<view>
									¥{{item.line_price}}
								</view>
							</view>
							<view class="discount-btn-right">
								立即购买
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 规则 -->
			<view class="lottery-rule">
				<view class="title t-c f-30 col-3">
					<view class="style f-30 col-3 t-c">中奖规则</view>
				</view>
				<view class="step dis-flex f-24 col-3">
					<view class="invite dis-flex flex-dir-column flex-x-center flex-y-center">
						<image src="./static/image/cqufk.png"></image>
						<view class="name">每日抽取福卡</view>
					</view>
					<view class="step-arrows dis-flex flex-dir-column flex-x-center flex-y-center">
						<view class="">
							<image src="/static/images/draw/draw_fgx.png" mode=""></image>
						</view>
					</view>
					<view class="wait dis-flex flex-dir-column flex-x-center flex-y-center">
						<image src="./static/image/fuqiimg.png"></image>
						<view class="name">集齐福卡</view>
					</view>
					<view class="step-arrows dis-flex flex-dir-column flex-x-center flex-y-center">
						<view class="">
							<image src="/static/images/draw/draw_fgx.png" mode=""></image>
						</view>
					</view>
					<view class="result dis-flex flex-dir-column flex-x-center flex-y-center">
						<image src="./static/image/zjjg.png"></image>
						<view class="name">中奖结果</view>
					</view>
				</view>
			</view>

			<!-- 奖品介绍 -->
			<view class="produce">
				<view class="produce-tit">
					奖品介绍
				</view>
				<view class="produce-line">

				</view>
				<view class="produce-html">
					<parse :html="blessDetail.content" parse-only="byKnow"></parse>
				</view>

			</view>
		</view>
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
			</view>
			<view @click="shareFri" class="share-btn dis-flex flex-dir-column flex-x-center flex-y-center f-24">
				<button open-type="share"></button>
				<view class="iconfont icon-share1"></view>
				<view>分享</view>
			</view>
		</view>
		<page-loading ref="loading"></page-loading>
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
					<button class="community-reply f-24 col-3"  open-type="contact" :send-message-img="cSendMessage.img" :send-message-path="cSendMessage.path" :send-message-title="cSendMessage.title" show-message-card>去关注</button>
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
				<image :src="blessDetail.subscribe_wechat_img" class="wechat-image"></image>
				<view class="attention-label dis-flex flex-y-center m-top30 col-3 f-24">
					<view class="label-num  backColor auxiliary-color">2</view>
					<view class="attention-text">点击识别二维码弹出的内容参与抽奖</view>
				</view>
				<view class="dialogue-wechat">
					<view class="dialogue-info dis-flex">
						<view class="wechat-img"></view>
						<view class="dialogue-detail b-f flex-box">
							<view class="dialogue-name f-24 col-3 onelist-hidden">{{blessDetail.title}}</view>
							<image src="/static/images/shouzhi.png" class="img_shouzhi"></image>
							<view class="dis-flex flex-x-between">
								<view class="f-24 col-9">点击参与抽奖~</view>
								<image :src="blessDetail.blessing_img" class="dialogue-we"></image>
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
		<!-- 活动规则按钮 -->
		<view class="page-blessingBag__btn-rules" @click="rulesPopupVisible = true">活动规则<view class="iconfont icon-wenhaoxiao"></view></view>
		<!-- 活动规则按钮 end -->
		<!-- 活动规则弹窗 -->
		<gift-bag-rules-popup :show="rulesPopupVisible" :text="blessDetail.blessing_rule" @on-mask-click="rulesPopupVisible = false" />
		<!-- 活动规则弹窗 end -->
	</view>
</template>

<script>
	import CountDown from '@/components/template/newCount.vue';
	import cmdProgress from "@/components/template/Progress.vue"
	import App from "@/common/js/app.js";
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	import AudioIcon from "@/components/page/pageComponents/AudioIcon.vue"
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	import PopupLayer from "@/components/template/PopLayer.vue"
	import PopupView from "@/components/template/PopManager.vue"
	import {
		wxRequestSubscribeMessageX
	} from '@/common/js/wxPromise.js'
	import GiftBagRulesPopup from './components/GiftBagRulesPopup'
	let successTimer = null,
		indexTimer = null,
		setTimer = null;
	export default {
		mixins: [pageShareMixin],
		components: {
			cmdProgress,
			AudioIcon,
			CountDown,
			Parse,
			PopupLayer,
			PopupView,
			GiftBagRulesPopup
		},
		data() {
			return {
				zsTrue: false,
				isAcBtn: false,
				shareImg: false,
				cjShow: false,
				wu: false,
				cjGx: false,
				zhongNameTwo: '',
				day: '',
				hours: '',
				minutes: '',
				seconds: '',
	
				isShowCountDown: true,

				blessDetail: {},
				audioStatus: 'play',
				progrePercent: '',
				zhongName: '',
				iszsBtn: false,
				userList: [],
				zhongNum: "",
				fontIndex: '',
				shareList: {},
				blessId: 0,
				description: '',
				showCommunity: false,
				showLongPressBtn: true,
				showTips: false,
				community: [],
				popupInfo: {},
				drawTmplIds: [], //订阅消息模板Ids
				bullentIndex: 0,
				refereeId: 0,
				bullentList: [],
				prizeInfo: {},
				options: {},
				leadShowAttention:false,
				zsBtnType: 'none',
				isOpenGive: false, //是否开启转赠
				giveSendNumber: 1,
				logId: 0,
				cSendMessage: {},
				rulesPopupVisible: false
			}
		},
		filters: {
			numberChange(val) {
				if(val > 9999) {
					let res = val / 10000
					return res.toFixed(2) + 'w'
				}else {
					return val
				}
			}
		},
		computed: {
			//  背景音乐样式
			audioStyle() {
				return 'position: absolute;color: #F9D235;background: #333;right: 15px;top: 100px;z-index: 5;'
			},
			communityImg() {
				return function(index) {
					return (this.community[index] && this.community[index].headimg && this.community[index].headimg[0] && this.community[
						index].headimg[0].file_path) || ''
				}
			},
			// 剩余奖品数量
			remainingPrizeNum() {
				return this.prizeInfo.prize_num - this.prizeInfo.prize_get_num
			},
	
			showDiscount() {
				let goodsList = this.$util.deepGet(this.blessDetail,'goods') || []
				return goodsList.length > 0
			}
			//  是否还存在赠送余量次数
			// zsTrueMotaiDisbled() {
			// 	return this.blessDetail.day_send_card == 0 || this.blessDetail.sum_send_card == 0 ? false : true
			// },
		},
		onLoad(options) {
			this.options = options
			this.pageLoad(options)
		},
		onShow() {
			this.audioStatus = 'play'
			if (this.options.referee_id) {
				this.refereeId = this.options.referee_id;
			}
			this.blessId = this.options.blessing_id ? this.options.blessing_id : this.blessId
			//  当点击赠送福卡时，如果获取了LogId，无论点击取消还是确定赠送，返回福卡弹窗时不执行以下函数（执行后会改变分享数据）
			if(this.logId == 0) {
				this.blessingDetail()
				this.getDanMuList(this.blessId)
				this.hasPrizeUserList(this.blessId)
			}
			if (this.options.log_id && this.options.font_index) {
				this.getFont(this.blessId, this.options.log_id, this.options.font_index)
			}
		},
		onHide() {
			this.audioStatus = 'pause'
		},
		onUnload() {
			console.log('2222222222')
		},
		watch: {
			// 监控页面配置接口数据
			shareList: {
				handler(newVal, oldVal) {
					console.log(newVal,'最新的分享数据')
					this.shareData = this.pageShareMixin_createShareData({
						imgUrl: this.$util.deepGet(newVal, 'imgUrl', ''),
						desc: this.$util.deepGet(newVal, 'desc', ''),
						title: this.$util.deepGet(newVal, 'title', '集福'),
						query: newVal.query
					})
				},
				immediata: true
			},
		},
		methods: {
			// 推荐商品跳转详情页
			handleBuyGoodsClick(goods_id) {
				App.navigationTo({
					url: `pages/subPages/goods/index/index?goods_id=${goods_id}`
				})
			},
			//获取弹幕列表
			getDanMuList(blessing_id) {
				App._post_form('blessing.Blessing/barrage', {
					blessing_id: blessing_id
				}, (result) => {
					if (result.code == 1) {
						this.bullentList = result.data
						this.setSuccessBarrage()
					}
				}, false, () => {
					uni.hideLoading()
					uni.stopPullDownRefresh();
				});
			},
			//获取赠送福卡
			getFont(blessing_id, log_id, font_index) {
				App._post_form('blessing.blessing/shareFont', {
					blessing_id: blessing_id,
					font_index: font_index,
					log_id: log_id
				}, (result) => {
					if (result.code == 1 && result.data != true) {
						uni.showToast({
							icon: 'success',
							// title: result.msg
							title: '领取成功'
						})
						this.blessingDetail()
					}
				}, false, () => {
					uni.hideLoading()
					uni.stopPullDownRefresh();

				});
			},
			//弹幕
			setSuccessBarrage() {
				let _this = this,
					bullentIndex = _this.bullentIndex,
					bullentList = _this.bullentList;
				if (_this.bullentIndex >= _this.bullentList.length) {
					_this.bullentIndex = 0;
				}
				_this.showTips = true;
				successTimer = setTimeout(() => {
					_this.showTips = false;
					setTimer = setTimeout(() => {
						_this.showTips = false;
						_this.bullentIndex++
					}, 500);
					indexTimer = setTimeout(() => {
						_this.showTips = false;
						_this.setSuccessBarrage();
					}, 2000);
				}, 3000);

			},
			// 微信小程序客服组件
			// cSendMessage() {
			//     return {
			//         path: 'pages/subPages/blessBag/index?blessing_id=' + this.blessId,
			//         title: this.blessDetail.title
			//     }
			// },
			// 领奖
			clickJp() {
				App.navigationTo({
					url: 'pages/subPages/drawlotter/detail/newDetail?type=3&blessing_id=' + this.blessId
				})
			},
			// 是否确定分享（取消需求）
			// closezsTrue() {
			// 	this.zsTrue = false
			// 	// #ifdef H5
			// 	this.shareImg = true
			// 	// #endif
			// },
			//拨打电话
			callPhone(mobile) {
				uni.makePhoneCall({
					phoneNumber: mobile //仅为示例
				});
			},
			// 商家地址导航
			locationSee(item) {
				App.openLocation({
					address: item.address,
					latitude: Number(item.lat),
					longitude: Number(item.lng),
					success() {
						console.log('success');
					}
				});
			},
			timeup() {
				this.isShowCountDown = false
			},
			// 获取log_id并修改分享数据的参数
			getLogId() {
				let that = this
				App._post_form('blessing.blessing/forward', {
					blessing_id: that.blessDetail.blessing_id,
					font_index: that.fontIndex
				}, (result) => {
					that.logId = Number(result.data.log_id)
					if (result.code == 1) {
						let title = that.blessDetail.setting.share_title,
							newTitle = title.replace('{$font_name}',that.zhongNameTwo),
							desc = that.blessDetail.setting.share_description,
							newsDesc = (desc.replace('{$font_name}',that.zhongNameTwo)).replace('{$font_description}',that.description)
							console.log(newTitle,newsDesc,'拼接后的分享描述和题目')
						// #ifdef MP-WEIXIN
						that.shareList = {
							imgUrl: that.blessDetail.setting.sapp_img[0].file_path,
							desc: newsDesc,
							title: newTitle,
							query: {
								blessing_id: that.blessDetail.blessing_id,
								log_id: that.logId,
								font_index: that.fontIndex
							}
						}
						// #endif
						// #ifdef H5
						that.shareList = {
							imgUrl: that.blessDetail.setting.wechat_img[0].file_path,
							desc: newsDesc,
							title: newTitle,
							query: {
								blessing_id: that.blessDetail.blessing_id,
								log_id: that.logId,
								font_index: that.fontIndex
							}
						}
						// #endif
	
					}
				}, false, () => {
					uni.hideLoading()
					App.hideLoading(500)
					uni.stopPullDownRefresh();
	
				});
	
			},
	
			//赠送好友
			zsTrueMotai() {
				let that = this;
				that.zsTrue = true;
				that.shareFri()
				if(that.giveSendNumber <= 0){
					uni.showToast({
						title: '赠送已达上限',
						icon: 'none'
					})
				}
				// else {
				// 	that.getLogId()
				// }
			},
			// 页面加载处理
			pageLoad(options) {
				let scene = App.getSceneData(options),
				{
					a,
					b
				} = scene
				this.blessId = a ? a : this.blessId,
				this.refereeId = b ? b : this.refereeId
			},
			// 添加社群
			onToggleCommunity(index) {
				this.popupInfo = this.community[index]
				if (this.popupInfo.community_type == 4 || this.popupInfo.community_type == 2) {
					this.showLongPressBtn = false
				}
				this.showCommunity = true
			},
			// 跳转至我的活动列表
			handlePrizeClick() {

				App.navigationTo({

					url: 'pages/subPages/drawlotter/drawlotterlist/drawlotterlist?type=3'

				})

			},
	
			handleToHomeClick() {
				App.navigationTo({
					url: `pages/mainPages/index/index`
				})
			},
			// h5引导分享图片显示
			shareFri() {
				// #ifdef H5
				this.shareImg = true
				// #endif
			},

			closeShare() {
				// #ifdef H5
				this.shareImg = false
				// #endif
			},
	
			// 福卡弹窗点击
			closeMotai() {
				this.cjShow = false;
				this.cjGx = false
				this.wu = false
				this.blessingDetail()
				// // #ifdef MP-WEIXIN
				// this.shareList = {
				// 	imgUrl: this.blessDetail.blessing_sapp_img,
				// 	desc: this.blessDetail.blessing_wechat_text,
				// 	title: this.blessDetail.title,
				// 	query: {
				// 		blessing_id: this.blessDetail.blessing_id,
				// 	}
				// }
				// // #endif
				// // #ifdef H5
				// this.shareList = {
				// 	imgUrl: this.blessDetail.blessing_wechat_img,
				// 	desc: this.blessDetail.blessing_wechat_text,
				// 	title: this.blessDetail.title,
				// 	query: {
				// 		blessing_id: this.blessDetail.blessing_id,
				// 	}
				// }
				// // #endif

			},
	
			//  点击抽奖满足条件后进行
			getJoin() {
				let that = this
				that.isAcBtn = true
				uni.showLoading({
					title: '加载中'
				})
				App.getLocation().then(res => {
					App._post_form('blessing.blessing/join', {
						blessing_id: that.blessDetail.blessing_id,
						lat: res.latitude,
						lng: res.longitude
					}, (result) => {
						that.isAcBtn = true
						App.showLoading({
							title:'抽奖中~'
						})
						that.zhongName = result.data.name
						that.zhongNum = result.data.open_num
						that.fontIndex = result.data.font_index
	
						App._post_form('blessing.blessing/userFontCount', {
							blessing_id: that.blessDetail.blessing_id,
							font_index: that.fontIndex
						}, (result) => {
							console.log(result)
							if (result.data.count > 1) {
								this.iszsBtn = true
								this.zsBtnType = this.giveSendNumber > 0 ? 'share' : 'none'
								this.getLogId()
							} else {
								this.iszsBtn = false
								this.zsBtnType = 'none'
							}
							uni.hideLoading()
						}, false, () => {
							uni.hideLoading()
							uni.stopPullDownRefresh();
						});
	
	
						that.cjShow = true;
						that.cjGx = true
						that.isAcBtn = false
						App.hideLoading(500)
					}, false, () => {
						App.hideLoading(500)
						uni.stopPullDownRefresh();
						that.isAcBtn = false
					});
				}).catch(() => {
					uni.hideLoading()
				})
			},
	
			//  消息订阅
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

			//点击抽奖
			acBtn() {
	
				let arr = this.blessDetail.font || [],
				    newArr = arr.find((item) => {
					return item.num > 0
				})
				let isFirst = newArr == undefined
				console.log(isFirst,'是否为第一次抽奖===')
				// 强制关注公众号且未关注公众号时显示弹窗
				if(this.blessDetail.is_subscribe == 1 && this.blessDetail.have_in_wechat == 2) {
					this.leadShowAttention = true
				}else {
					if(this.blessDetail.user_open_num > 0) {
						// #ifdef MP-WEIXIN
						if(isFirst) {
							this.subscribeDraw()
						}
						// #endif
						this.getJoin()
					} else {
						uni.showToast({
							title: '抽奖次数不足',
							icon: 'none'
						})
					}
				}
			},
	
			// 福卡点击
			zsFriends(name, index, description,num) {
				let that = this
				if(num == 0) {
					uni.showToast({
						title: '暂未获得此福卡',
						icon: 'none'
					})
				}else {
					uni.showLoading({
						title: '加载中~'
					})
					App._post_form('blessing.blessing/userFontCount', {
						blessing_id: that.blessDetail.blessing_id,
						font_index: index
					}, (result) => {
						console.log(result)
						if (result.code == 1) {
							that.cjShow = true;
							that.cjGx = false
							that.wu = true
							that.zhongNameTwo = name
							that.fontIndex = index
							that.description = description;
							if (result.data.count > 1) {
								that.iszsBtn = true
								that.zsBtnType = that.giveSendNumber > 0 ? 'share' : 'none'
								that.getLogId()
							} else {
								that.iszsBtn = false
								that.zsBtnType = 'none'
							}
							uni.hideLoading()
						}
					}, false, () => {
						uni.hideLoading()
						uni.stopPullDownRefresh();
					});
				}
			},

			// 活动详情

			blessingDetail() {
				let that = this
				if (that.refereeId) {
					var parma = {
						blessing_id: that.blessId,
						referee_id: that.refereeId
					}
				} else {
					let userInfo = that.$store.state.userInfo || {}
					that.refereeId = userInfo.user_id
					var parma = {
						blessing_id: that.blessId
					}
				}

				App._post_form('blessing.blessing/detail', parma, (result) => {


				var timestamp = (new Date()).getTime();
	
				var timeCa = result.data.end_time * 1000 - timestamp
	
				var day = parseInt(timeCa / (24 * 60 * 60 * 1000));

				var hour = parseInt((timeCa % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

				var minute = parseInt(((timeCa % (24 * 60 * 60 * 1000)) % (60 * 60 * 1000)) / (60 * 1000));

				var second = parseInt((((timeCa % (24 * 60 * 60 * 1000)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000);
	
	
					if(timeCa <= 0 || result.data.status == 3) {
						this.isShowCountDown = false
					}

					console.log(day, hour, minute, second,timeCa, 'daf')

						var second = parseInt((((timeCa % (24 * 60 * 60 * 1000)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000);

						console.log(day, hour, minute, second, 'daf')

						this.day = day

						this.hours = hour

						this.minutes = minute

						this.seconds = second

						let data = result.data;
	

						result.data.prize[0].store_ids = result.data.prize[0].store_ids.map(val => {

							const hasTime = val.time && Array.isArray(val.time) && val.time.length > 0

							if (hasTime) {

								val.time.map(item => {

									item[0] = that.$util.formatTime(item[0] / 1000, 'rule', ':').substr(-5, 5)

									item[1] = that.$util.formatTime(item[1] / 1000, 'rule', ':').substr(-5, 5)
								})
							}
							val.start_time = that.$util.formatTime(val.start_time, 'rule', ':').substr(-5, 5)
							val.end_time = that.$util.formatTime(val.end_time, 'rule', ':').substr(-5, 5)
							return val
						})
						that.blessDetail = data;
						uni.setNavigationBarTitle({
							title: that.blessDetail.title
						})
						that.cSendMessage = {
								img: that.blessDetail.blessing_sapp_img,
								path: 'pages/subPages/blessBag/index?blessing_id=' + that.blessId + '&referee_id=' + that.refereeId,
								title: that.blessDetail.title
							    }
						console.log(that.cSendMessage,'contact客服参数============')
						that.isOpenGive = that.$util.deepGet(data,'setting.is_give') == 1 ? true : false
						that.giveSendNumber = that.blessDetail.send_number
						that.prizeInfo = that.$util.deepGet(data,'prize[0]') || {}
						console.log(that.prizeInfo,'奖品信息========')
						that.blessDetail.start_time = that.getTime(data.start_time)
						that.blessDetail.end_time = that.getTime(data.end_time)
						that.progrePercent = (data.prize[0].prize_get_num / data.prize[0].prize_num) * 100
						console.log(that.progrePercent, '555')
						that.community = that.blessDetail.community

						// #ifdef MP-WEIXIN
						that.shareList = {
							imgUrl: that.blessDetail.blessing_sapp_img,
							desc: that.blessDetail.blessing_wechat_text,
							title: that.blessDetail.title,
							query: {
								blessing_id: that.blessDetail.blessing_id,
							}
						}
						// #endif

						// #ifdef H5
						that.shareList = {
							imgUrl: that.blessDetail.blessing_wechat_img,
							desc: that.blessDetail.blessing_wechat_text,
							title: that.blessDetail.title,
							query: {
								blessing_id: that.blessDetail.blessing_id,
							}
						}
						// #endif
						// 设置分享数据

						that.shareData = that.pageShareMixin_createShareData({

							imgUrl: that.$util.deepGet(that.shareList, 'imgUrl', ''),

							desc: that.$util.deepGet(that.shareList, 'desc', ''),

							title: that.$util.deepGet(that.shareList, 'title', '集福'),
							query: that.shareList.query
						})

					}, false, () => {

						uni.hideLoading()

						App.hideLoading(500)

						uni.stopPullDownRefresh();

					});

			},

			// 中奖名单

			hasPrizeUserList(id) {

				let that = this

				App.getLocation().then(res => {

					App._post_form('blessing.blessing/hasPrizeUser', {

						blessing_id: id

					}, (result) => {

						console.log(result, '1233')

						that.userList = result.data.data;

					}, false, () => {

						uni.hideLoading()

						App.hideLoading(500)

						uni.stopPullDownRefresh();

					});

				}).catch(() => {

					App.hideLoading()

				});

			},

			// 时间戳转换

			getTime(time) {

				const date = new Date(parseInt(time) * 1000);

				const Y = date.getFullYear() + '.';

				const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';

				const D = date.getDate() + ' ';

				const h = date.getHours() + ':';

				const m = date.getMinutes();

				// const s = date.getSeconds(); // 秒

				const dateString = Y + M + D;

				return dateString

			}

		}
	}
</script>

<style lang="scss" scoped>
	.bullent {
		position: fixed;
		top: 40rpx;
		left: 30rpx;
		height: 130rpx;
		overflow: hidden;
		z-index: 50;


	}

	.bullentOne {
		display: flex;
		// padding: 8rpx;
		align-items: center;
		padding-right: 26rpx;
		background: rgba(255, 217, 64, 1);
		border-radius: 30rpx;
		margin-bottom: 21rpx;
		padding-left: 20rpx;
		height: 50rpx;
		border: 1rpx solid #7B4945;
	}

	.bullentImg {
		width: 46rpx;
		height: 46rpx;
		border-radius: 50%;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: center;

	}

	.shareHfive {

		width: 100%;

		height: 100%;

		background: rgba(0, 0, 0, .3);

		position: fixed;

		top: 0;

		z-index: 99;

		image {

			position: fixed !important;

			// z-index: 1009;

			right: 10rpx;

			top: 0;

			overflow: auto;

			width: 500rpx;

			height: 380rpx;

		}
	}

	.banner {

		width: 750rpx;

		height: 530rpx;

		display: block;
	}

	.activity-motai {

		width: 100%;

		height: 100%;

		background: rgba(0, 0, 0, .5);

		position: fixed;

		z-index: 60;

		top: 0;

		.motai-baner {

			width: 560rpx;

			height: 800rpx;

			background-repeat: no-repeat;

			background-size: 100%;

			position: fixed;

			top: 50%;

			left: 50%;

			margin-top: -400rpx;

			margin-left: -280rpx;

			text-align: center;

			.motai-img {

				width: 100rpx;

				height: 100rpx;

				margin-top: 84rpx;

			}

			.motai-gx {

				text-align: center;

				font-size: 28rpx;

				margin-top: 37rpx;

				font-weight: bold;

				color: #7C4A44;

			}

			.motai-yz {

				margin-top: 55rpx;

				font-size: 42rpx;

				text-align: center;

				font-weight: bold;

				color: #7C4A44;

			}

			.motai-sy {

				margin-top: 285rpx;

				font-size: 24rpx;

				font-weight: 500;

				color: #7C4A44;

			}

			.motai-zs {

				width: 168rpx;

				height: 50rpx;

				background: rgba(124, 74, 68, .1);

				border-radius: 4rpx;

				line-height: 50rpx;

				font-size: 28rpx;

				font-weight: 500;

				color: #7C4A44;

				margin-top: 20rpx;

				position: relative;

				left: 50%;

				margin-left: -84rpx;

			}

		}

		.motai-baner-wu {


			width: 560rpx;

			height: 800rpx;

			background-repeat: no-repeat;

			background-size: 100%;

			position: fixed;

			top: 50%;

			left: 50%;

			margin-top: -400rpx;

			margin-left: -280rpx;

			text-align: center;

			.motai-zi-wu {

				margin-top: 40rpx;

				font-size: 200rpx;

				font-weight: bold;

				color: #7C4A44;

			}

			.motai-img-wu {

				width: 381rpx;

				height: 14rpx;

				margin-top: 50rpx;

			}

			.motai-yz-wu {

				margin-top: 50rpx;

				font-size: 28rpx;

				font-weight: 500;

				color: #7C4A44;

			}

			.motai-zs-wu {

				width: 262rpx;

				height: 64rpx;

				background: #FBCC19;

				border: 2rpx solid #7C4A44;

				border-radius: 4rpx;

				text-align: center;

				line-height: 64rpx;

				margin-top: 113rpx;

				font-size: 28rpx;

				font-weight: 500;

				color: #7C4A44;

				position: relative;

				left: 50%;

				margin-left: -131rpx;

			}

		}

		.motai-zsTrue {
			width: 400rpx;
			height: 250rpx;
			background: white;
			position: absolute;
			top: 500rpx;
			left: 50%;
			margin-left: -200rpx;
			border-radius: 20rpx;

			.text {
				text-align: center;
				margin-top: 50rpx;
			}

			.btn {
				display: flex;
				justify-content: space-around;
				align-items: center;
				margin-top: 70rpx;
				color: black;

				view {
					margin-left: 100rpx;
				}

				button {
					width: 120rpx;
					height: 40rpx;
					line-height: 40rpx;

					text-align: center;
					font-size: 28rpx;
					background-color: #FFFFFF;
				}
			}

		}
	}

	.content {
		padding-top: 10rpx;
		padding-bottom: 70rpx;
		.flow {
			width: 690rpx;
			height: 128rpx;
			background: #fff;
			border-radius: 10rpx;
			margin: 10rpx auto 20rpx;
			.look,.self-help,.join {
				flex: 1;
				height: 70rpx;
				.num {
					color: #FF4444;
				}
			}
		}
		.activity {

			margin: 10rpx 30rpx 0 30rpx;

			width: 690rpx;

			height: auto;

			background: #FFFFFF;

			border-radius: 10rpx;

			.activity-tit {

				width: 690rpx;

				height: 80rpx;

				background: #F8F8F8;

				display: flex;

				align-items: center;

				border-radius: 10rpx;

				justify-content: center;

				.activity-titBox {

					display: flex;

					flex-wrap: wrap;

					align-items: center;

					.activity-tit-left {

						font-size: 28rpx;

						font-weight: bold;

						color: #7B4945;

					}

					.activity-tit-right {}

				}

			}

			.activity-subtit {

				padding: 21rpx 49rpx 0 31rpx;

				font-size: 32rpx;

				font-weight: bold;

				color: #333333;

			}

			.activity-text {

				padding: 19rpx 0 0 31rpx;

				font-size: 24rpx;

				font-weight: 500;

				color: #999999;

			}

			.activity-jd {

				margin-top: 40rpx;

				display: flex;

				flex-wrap: wrap;

				align-items: center;

				.activity-no {

					padding-left: 31rpx;

					.activity-fen {

						font-size: 28rpx;

						font-weight: 500;

						color: #333333;

						text {

							color: #FF4444;

						}

					}

					.activity-pro {

						width: 630rpx;

					}

				}

				.line {

					width: 2rpx;

					height: 50rpx;

					background: #EEEEEE;

					margin-left: 57rpx;

				}

				.activity-liul {

					font-size: 28rpx;

					font-weight: 400;

					color: #999999;

					margin-left: 55rpx;

					.activity-liul-number {}

					.activity-liul-text {}

				}

			}

			.lineH {

				width: 630rpx;

				margin-left: 30rpx;

				height: 2rpx;

				background: #EEEEEE;

				margin-top: 40rpx;

			}

			.activity-fudai-img {

				padding-left: 31rpx;

				display: flex;

				flex-wrap: wrap;

				.fudai-img {

					margin-top: 53rpx;

					margin-right: 45rpx;

					position: relative;

					.template {

						width: 120rpx;

						height: 120rpx;

					}
					.template2 {
					
						width: 120rpx;
					
						height: 96rpx;
					
					}
					.template3 {
					
						width: 111rpx;
					
						height: 120rpx;
					
					}
					.template4 {
					
						width: 120rpx;
					
						height: 120rpx;
					
					}
					.template5 {
					
						width: 120rpx;
					
						height: 97rpx;
					
					}

					.fudai-num {

						width: 30rpx;

						height: 30rpx;

						background: #FF4444;

						border-radius: 50%;

						color: #FFFFFF;

						font-weight: bold;

						text-align: center;

						line-height: 30rpx;

						font-size: 24rpx;

						position: absolute;

						right: 0;

						top: 0;

					}

					.description {

						font-size: 36rpx;

						font-weight: 800;

						position: absolute;

						top: 50%;

						left: 50%;

						/*偏移*/

						transform: translate(-50%, -50%);

					}

				}

			}

			.activity-btn {

				padding: 53rpx 30rpx 30rpx 30rpx;

				display: flex;

				justify-content: space-between;
				height: 100rpx;

				.activity-btn-lj {
					background-image: url(./static/image/lingjiang.png);
					width: 601rpx;
					height: 92rpx;
					background-repeat: no-repeat;
					background-size: 100%;
					border-radius: 45rpx;
					font-size: 28rpx;
					line-height: 75rpx;
					font-weight: bold;
					position: relative;
					border-bottom: 8rpx;
					color: #C94600;
					background-color: #FFFFFF !important;
					animation: joinActivityBtn4 0.5s infinite;
					animation-direction: alternate;
				}

				@keyframes joinActivityBtn4 {
					from {
						width: 601rpx;

						height: 92rpx;
					}

					to {
						width: 611rpx;
						height: 130rpx;
					}
				}

				.activity-btn-left {

					background-image: url(./static/image/btnChou.png);

					width: 346rpx;

					height: 92rpx;

					background-repeat: no-repeat;

					background-size: 100%;

					border-radius: 45rpx;

					font-size: 28rpx;

					line-height: 80rpx;

					font-weight: bold;
					position: relative;
					border-bottom: 8rpx;
					color: #C94600;
					background-color: #FFFFFF !important;

					animation: joinActivityBtn 0.5s infinite;
					animation-direction: alternate;

				}

				@keyframes joinActivityBtn {
					from {
						width: 346rpx;

						height: 92rpx;
					}

					to {
						width: 360rpx;
						height: 130rpx;
					}
				}

				.activity-btn-right {

					background-image: url(./static/image/qiuzhu.png);

					width: 251rpx;

					height: 92rpx;

					background-repeat: no-repeat;

					background-size: 100%;

					font-size: 28rpx;

					font-weight: bold;

					color: #FFFFFF;

					line-height: 80rpx;

					border-radius: 45rpx;
					background-color: #FFFFFF !important;

					animation: joinActivityBtn2 0.5s infinite;
					animation-direction: alternate;
				}

				@keyframes joinActivityBtn2 {
					from {
						width: 251rpx;

						height: 92rpx;
					}

					to {
						width: 265rpx;
						height: 110rpx;
					}
				}

			}

		}

		.prize {

			margin: 20rpx 30rpx 0 30rpx;

			width: 690rpx;

			height: auto;

			background: #FFFFFF;

			border-radius: 10rpx;

			.prize-tit {

				text-align: center;

				font-size: 32rpx;

				font-weight: bold;

				color: #333333;

				padding-top: 40rpx;

				position: relative;

				z-index: 1;

			}

			.prize-line {

				width: 145rpx;

				height: 12rpx;

				background: #FFD940;

				position: relative;

				left: 50%;

				margin-left: -72rpx;

				top: -10rpx;

			}

			.prize-cont {

				padding: 44rpx 0 40rpx 20rpx;

				display: flex;

				flex-wrap: wrap;

				.prize-img {

					width: 160rpx;

					height: 160rpx;

				}

				.prize-right {

					margin-left: 20rpx;

					.prize-name {

						width: 454rpx;

						font-size: 28rpx;

						color: #333333;

						height: 60rpx;

						line-height: 30rpx;
					}

					.prize-num {

						font-size: 24rpx;

						color: #999999;

					}

					.prize-btn {;

						display: flex;

						flex-wrap: wrap;

						.prize-btn-left {

							width: 213rpx;

							height: 50rpx;

							background: #FFD940;

							border-radius: 25rpx 0rpx 0rpx 25rpx;

							text-align: center;

							line-height: 50rpx;

							font-size: 24rpx;

							font-weight: bold;

							color: #333333;

						}

						.prize-btn-right {

							width: 257rpx;

							height: 50rpx;

							background: #333333;

							border-radius: 0rpx 25rpx 25rpx 0rpx;

							text-align: center;

							line-height: 50rpx;

							font-size: 24rpx;

							font-weight: bold;

							color: #FFFFFF;

						}

					}

				}

			}

		}

		.discount {

			margin: 20rpx 30rpx 0 30rpx;

			width: 690rpx;

			height: auto;

			background: #FFFFFF;

			border-radius: 10rpx;

			.discount-tit {

				text-align: center;

				line-height: 52rpx;

				color: #FFFFFF;

				width: 188rpx;

				height: 52rpx;

				background: linear-gradient(0deg, #FF8A44 0%, #FF4444 100%);

				border-radius: 26rpx;

				position: relative;

				top: 40rpx;

				margin-bottom: 80rpx;

				left: 50%;

				margin-left: -94rpx;

			}

			.discount-cont {

				padding: 0rpx 30rpx 40rpx 30rpx;

				display: flex;

				flex-wrap: wrap;

				.discount-img {

					width: 160rpx;

					height: 160rpx;

					border-radius: 5rpx;

				}

				.discount-right {
					width: 454rpx;
					margin-left: 16rpx;
					.discount-name {
					
						font-size: 28rpx;

						color: #333333;

						height: 56rpx;
						line-height: 28rpx;
					}

					.discount-btn {

						display: flex;

						justify-content: space-between;

						.discount-btn-left {

							display: flex;

							align-items: flex-end;

							view:nth-child(1) {

								color: #FF4444;

							}

							view:nth-child(2) {

								color: #999999;

								font-size: 24rpx;

								text-decoration: line-through;

								margin-left: 18rpx;

							}

						}

						.discount-btn-right {

							text-align: center;

							line-height: 54rpx;

							font-size: 24rpx;

							color: #333333;

							width: 146rpx;

							height: 54rpx;

							background: #FFD940;

							border-radius: 27rpx;

						}

					}

				}

			}

		}

		.nameList {

			margin: 20rpx 30rpx 0 30rpx;

			width: 690rpx;

			height: auto;

			background: #FFFFFF;

			border-radius: 10rpx;

			.nameList-tit {

				text-align: center;

				font-size: 32rpx;

				font-weight: bold;

				color: #333333;

				padding-top: 40rpx;

				position: relative;

				z-index: 1;

			}

			.nameList-line {

				width: 145rpx;

				height: 12rpx;

				background: #FFD940;

				position: relative;

				left: 50%;

				margin-left: -72rpx;

				top: -10rpx;

			}

			.nameList-cont {

				padding: 44rpx 0 40rpx 20rpx;

				height: 200rpx;

				.nameList-text {

					display: flex;

					flex-wrap: wrap;

					align-items: center;

					margin-bottom: 30rpx;

					.nameList-img {

						width: 60rpx;

						height: 60rpx;

					}

					.nameList-right {

						display: flex;

						justify-content: space-between;

						width: 559rpx;

						margin-left: 20rpx;

						align-items: center;

						.nameList-name {

							view:nth-child(1) {

								font-size: 28rpx;

								font-weight: 500;

								color: #333333;

							}

							view:nth-child(2) {

								font-size: 24rpx;

								font-weight: 500;

								color: #999999;

								margin-top: 13rpx;

							}

						}

						.nameList-suc {

							font-size: 28rpx;

							font-weight: 500;

							color: #FF4444;

						}

					}

				}

			}

		}

		.shopMsg {

			margin: 20rpx 30rpx 0 30rpx;

			width: 690rpx;

			height: auto;

			background: #FFFFFF;

			border-radius: 10rpx;

			.shopMsg-tit {

				text-align: center;

				font-size: 32rpx;

				font-weight: bold;

				color: #333333;

				padding-top: 40rpx;

				position: relative;

				z-index: 1;

			}

			.shopMsg-line {

				width: 145rpx;

				height: 12rpx;

				background: #FFD940;

				position: relative;

				left: 50%;

				margin-left: -72rpx;

				top: -10rpx;

			}

			.shopMsg-text {

				padding: 40rpx 0 30rpx 30rpx;

				font-size: 28rpx;

				font-weight: bold;

				color: #333333;

			}

			.shopMsg-time {

				padding: 0rpx 0 30rpx 30rpx;

				font-size: 24rpx;

				font-weight: 400;

				color: #999999;

			}

			.shopMsg-tel {

				padding: 0rpx 30rpx 30rpx 30rpx;

				display: flex;

				justify-content: space-between;

				.shopMsg-tel-left {

					font-size: 24rpx;

					font-weight: 400;

					color: #999999;

				}

				.shopMsg-tel-right {

					width: 80rpx;

					height: 34rpx;

					border: 2rpx solid #CCCCCC;

					border-radius: 17rpx;

					text-align: center;

					line-height: 34rpx;

					font-size: 24rpx;

					font-weight: 500;

					color: #999999;

				}

			}

			.shopMsg-adr {

				padding: 0rpx 30rpx 30rpx 30rpx;

				display: flex;

				justify-content: space-between;

				.shopMsg-adr-left {

					font-size: 24rpx;

					font-weight: 400;

					color: #999999;

				}

				.shopMsg-adr-right {

					width: 80rpx;

					height: 34rpx;

					border: 2rpx solid #CCCCCC;

					border-radius: 17rpx;

					text-align: center;

					line-height: 34rpx;

					font-size: 24rpx;

					font-weight: 500;

					color: #999999;

				}

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

				.invite,
				.wait,
				.result {
					width: 150rpx;
					height: 160rpx;
				}

				.step-arrows {
					width: 75rpx;
					height: 130rpx;
					// .line {
					// 	width: 35rpx;
					// 	height: 1rpx;
					// 	border-bottom: 1px dashed #F5C53A;
					// 	position: relative;

					// 	.arrows {
					// 		width: 0;
					// 		height: 0;
					// 		border: 15rpx solid;
					// 		border-color: transparent transparent transparent #F5C53A;
					// 		position: absolute;
					// 		right: -33rpx;
					// 		bottom: -15rpx;
					// 	}
					// }
				}

				image {
					width: 120rpx;
					height: 120rpx;
				}
			}
		}

		.produce {

			margin: 20rpx 30rpx 0rpx 30rpx;

			width: 690rpx;

			height: auto;

			background: #FFFFFF;

			border-radius: 10rpx;

			.produce-tit {

				text-align: center;

				font-size: 32rpx;

				font-weight: 900;

				color: #333333;

				padding-top: 40rpx;

				position: relative;

				z-index: 9;

			}

			.produce-line {

				width: 145rpx;

				height: 12rpx;

				background: #FFD940;

				position: relative;

				left: 50%;

				margin-left: -72rpx;

				top: -10rpx;

			}

			.produce-html {

				padding: 50rpx 30rpx 200rpx 30rpx;

			}

		}
	}

	.btm-fix {

		width: 100%;

		height: 100rpx;

		position: fixed;

		bottom: 30rpx;

		left: 0;

		z-index: 20;

		.btm-bar {

			margin-left: 30rpx;

			width: 570rpx;

			height: 100rpx;

			background: #F9D235;

			box-shadow: 2rpx 2rpx 12rpx #9D7E00;

			border-radius: 50rpx;

			.home,

			.prize,

			.share,

			.poster {

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

			button {

				width: 100%;

				height: 100%;

				opacity: 0;

				position: absolute;

				top: 0;

				left: 0;

			}

			.iconfont {

				width: 32rpx;

				height: 32rpx;

			}

		}
	}

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
	
	
	// 引导关注公众号
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
	.page-blessingBag__btn-rules {
		position: fixed;
		right: 0;
		top: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60rpx;
		padding: 0 30rpx;
		background-color: rgba(0,0,0,0.5);
		border-radius: 60rpx 0 0 60rpx;
		z-index: 5;
		&,.iconfont {
			font-size: 28rpx;
			color: #fff;
		}
		.iconfont {
			margin-left: 8rpx;
		}
	}
	
</style>
