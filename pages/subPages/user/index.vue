<template>
	<view class="container" :class="tabContainer" :style="themeColor">
		<lead-attention></lead-attention>
		<!-- <view :animation="animationData" style="background:red;height:100rpx;width:100rpx" @click="declick"></view> -->
		<!-- 用户信息 -->
		<view class="user ">
			<view class="user-header">
				<image class="image user-header-bg main-bg-color auxiliary-color" mode="widthFix" :style="{'top':headerBgTop}"></image>
				<view class="user-header-cont auxiliary-color">
					<view class="user-header-avatar auxiliary-color">
						<block v-if="hasUserinfo && !!userInfo.avatarUrl">
							<image :src="userInfo.avatarUrl"></image>
						</block>
						<block v-else>
							<image src="/static/images/user/avatar.png" mode=""></image>
							<!-- #ifdef MP-WEIXIN -->
							<!-- <open-data class="" lang="zh_CN" type="userAvatarUrl"></open-data> -->
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<!-- #endif -->
						</block>
					</view>
					<view class="user-header-info dis-flex flex-dir-column auxiliary-color" :class="[hasUserinfo?'flex-box':'']">
						<block v-if="hasUserinfo && !!userInfo.user_id">
							<view class="user-header-info-name onelist-hidden auxiliary-color">
								<block v-if="!!userInfo.nickName">
									{{userInfo.nickName}}
								</block>
								<block v-else>
									<!-- #ifdef MP-WEIXIN -->
									<open-data lang="zh_CN" type="userNickName"></open-data>
									<!-- #endif -->
									<!-- #ifdef H5 -->
									匿名用户
									<!-- #endif -->
								</block>
							</view>
							<view class="user-header-info-phone auxiliary-color">
								<block v-if="!!userInfo.mobile">
									<view class="i icon iconfont icon-mobilefill"></view>{{userMobile}}
									<!-- <view class="i icon iconfont icon-writefill" @click="editPhone"></view> -->
								</block>
								<block v-else>未绑定手机号</block>
							</view>
						</block>
						<block v-else>
							<view class="user-login-btn f-24" @click="doLogin">立即登录</view>
						</block>
					</view>
					<view class="discount-num dis-flex flex-x-around flex-y-center t-c auxiliary-color" v-if="hasUserinfo">
						<view class="col-3 p-r auxiliary-color" v-if="balanceSetting.balance_display ==='1'" @click="navigationTo('pages/subPages/balance/detail?classs=2')">
							<view class="f-28">{{userInfo.balance}}</view>
							<view class="f-24">{{balanceSetting.balance_str}}</view>
							<image src="/static/images/user/chong.png" class="balance-icon" v-if="userInfo.balance === '0.00'"></image>
						</view>
						<view class="col-3 auxiliary-color" v-if="balanceSetting.integral_open === '1'" @click="navigationTo('pages/subPages/balance/detail?classs=1')">
							<view class="f-28">{{userInfo.integral}}</view>
							<view class="f-24">{{balanceSetting.integral_str}}</view>
						</view>
						<view class="col-3 auxiliary-color" @click="navigationTo('pages/subPages/user/coupon/coupon?type=bonus')">
							<view class="f-28">{{orderCount.redEnvelopes}}</view>
							<view class="f-24">红包</view>
						</view>
						<!-- <view class="col-3" @click="navigationTo('pages/subPages/cgp/goods/deliverycode')" v-if="cgp.open">
							<view class="iconfont icon-qrcode m-right12" ></view>
							<view class="f-24">查看提货码</view>
						</view> -->

					</view>
				</view>
				<!-- 分销快捷按钮 -->
				<view class="discount-num dis-flex flex-x-around flex-y-center t-c t-c m-btm20 " v-if="showDealerFast">
					<!-- <view class="discount-num dis-flex flex-x-around flex-y-center t-c t-c m-btm20" > -->
					<view class="col-3" @click="navigationTo(`pages/subPages/dealer/team/team?lv=${dealerInfo.is_move_protect&&dealerInfo.team_diy==='2'?1:0}&listStyle=${dealerInfo.team_diy}`)">
						<image src="/static/images/user/client1.png" class="discount-icon" v-if="auxiliaryColor=='#ffffff'"></image>
						<image src="/static/images/user/client.png" class="discount-icon" v-else></image>
						<view class="f-24 auxiliary-color">{{dealerDiyFont.customer}}</view>
					</view>
					<view class="col-3" @click="navigationTo('pages/subPages/dealer/order/order')">
						<image src="/static/images/user/record1.png" class="discount-icon" v-if="auxiliaryColor=='#ffffff'"></image>
						<image src="/static/images/user/record.png" class="discount-icon" v-else></image>
						<view class="f-24 auxiliary-color">{{dealerDiyFont.record}}</view>
					</view>
					<view class="col-3" @click="navigationTo('pages/subPages/dealer/index/goods')">
						<image src="/static/images/user/goods1.png" class="discount-icon" v-if="auxiliaryColor=='#ffffff'"></image>
						<image src="/static/images/user/goods.png" class="discount-icon" v-else></image>
						<view class="f-24 auxiliary-color">{{dealerDiyFont.my_shop}}</view>
					</view>
				</view>
				<block v-if="memberInfo.is_open==='1'">
					<view class="user-member t-r dis-flex flex-y-center flex-x-between" :class="{'user-member--disabled':!userInfo.is_member}"
					 :style="{'background-image':userInfo.is_member ? getImageRoot('bg-user-member.png','url') : getImageRoot('bg-user-member--disabled.png','url')}">
						<!-- <view class="member-openbtn f-22 t-c" @click="member">{{userInfo.is_member?'立即续费':'立即开通'}}</view> -->
						<view class="member-left dis-flex flex-y-center" style="margin-top: -20rpx;">
							<view class="left-member-title f-24 onelist-hidden" style="max-width:6em;">{{!!memberInfo.card_title?memberInfo.card_title:'会员卡'}}</view>
							<view class="left-member-content f-24 onelist-hidden" style="max-width:14em;">{{userInfo.is_member?memberInfo.card_describe_second:'开通'+(!!memberInfo.card_title?memberInfo.card_title:'会员卡')+'，'+memberInfo.card_describe_first}}</view>
						</view>
						<view class="memeber-right open-memberbtn f-22 t-c" style="margin-top: -20rpx;" @click="member">{{userInfo.is_member?memberInfo.card_button_second:memberInfo.card_button_first}}</view>
					</view>
					<view class="bg-mask"></view>
				</block>
			</view>
			<view class="user-content">
				<!-- #ifdef MP-WEIXIN -->

				<view class="official-account" v-if="isShowAttention">
					<official-account @load="official" @error="official"></official-account>
				</view>
				<!-- #endif -->

				<!-- 分销数据 -->
				<block v-if="showDealerFast">
					<view class="dealer-info user-content-p-wrap">
						<view class="dealer-title border-line border-bottom dis-flex flex-x-between flex-y-center">
							<view class="dis-flex flex-dir-column flex-x-center">
								<view class="f-24 col-9">可提现金额(元)</view>
								<view class="col-3 f-48 m-top12">{{dealerInfo.dealer_money || 0}}</view>
							</view>
							<view class="main-bg-color dealer-withdraw t-c col-3 f-24 auxiliary-color" @click="navigationTo('pages/subPages/withdraw/list/list')">立即提现</view>
						</view>
						<view class="income-list dis-flex">
							<view class="income-item">
								<view class="f-24 col-9">预计收益(元)</view>
								<view class="col-3 f-36 m-top12">{{dealerInfo.no_settled_money || 0}}</view>
							</view>
							<view class="income-item">
								<view class="f-24 col-9">今日收益(元)</view>
								<view class="col-3 f-36 m-top12">{{dealerInfo.day_money || 0}}</view>
							</view>
							<view class="income-item dis-flex flex-y-center" v-if="dealerInfo.is_dealer_leave==='1'" @click="dealerLevel(dealerInfo.leave_diy)">
								<view class="flex-box">
									<view class="col-3 f-28 onelist-hidden">{{dealerInfo.leave_title || ""}}</view>
									<view class="f-24 col-9 m-top12">{{dealerDiyFont.fxs}}等级</view>
								</view>
								<view class="iconfont icon-jinrujiantou1 col-9"></view>
							</view>
						</view>
						<TipBar v-if="setting && setting.dealer_basic && setting.dealer_basic.is_refresh == 1" @on-btn-click="handleBtnTipRefreshClick" />
					</view>

					

					<view class="dealer-share user-content-p-wrap dis-flex flex-x-between flex-y-center">
						<block v-if="dealerInfo.member_dealer === '1'">
							<view class="dealer-share-item flex-box dis-flex flex-y-center" @click="dealerShare('dealer')">
								<image src="/static/images/user/invite.png" class="dealer-share-icon m-right30"></image>
								<view class="flex-box dis-flex flex-dir-column flex-x-around">
									<view class="f-30 col-3">{{dealerDiyFont.up_shop}}</view>
									<view class="f-24 col-9">{{dealerDiyFont.managerProfit}}</view>
								</view>
							</view>
							<view class="dealer-share-item flex-box dis-flex flex-y-center border-vertical border-left" @click="dealerShare('member')">
								<image src="/static/images/user/member.png" class="dealer-share-icon m-right30"></image>
								<view class="flex-box dis-flex flex-dir-column flex-x-around">
									<view class="f-30 col-3">{{dealerDiyFont.member}}</view>
									<view class="f-24 col-9">{{dealerDiyFont.memberProfit}}</view>
								</view>
							</view>
						</block>
						<block v-else>
							<image src="/static/images/user/invite.png" class="dealer-share-icon m-right30"></image>
							<view class="flex-box dis-flex flex-dir-column flex-x-around">
								<view class="f-30 col-3">{{dealerDiyFont.up_shop}}</view>
								<view class="f-24 col-9">{{dealerDiyFont.managerProfit}}</view>
							</view>
							<view class="main-bg-color dealer-share-btn col-3 t-c f-24 p-r auxiliary-color" @click="dealerShare('dealer')">
								去邀请
								<!-- #ifdef MP-TOUTIAO -->
								<button class="report-btn" open-type="share"></button>
								<!-- #endif -->
							</view>
						</block>
					</view>
				</block>
				
				<!-- 我的次票 -->
				<view v-if="userInfo && userInfo.card_is_true && cCardList && cCardList.length" class="my-card">
					<view class="my-card__header">
						<view class="my-card__title">我的{{settingData.card.font.ka_bao}}</view>
					</view>
					<view class="my-card__content" @click="navigationTo('pages/subPages/card/list')">
						<view v-for="item in cCardList" :key="item.id" class="my-card-card" :style="{backgroundImage: `url(${item.bgUrl})`}">
							<image class="my-card-card__img" :src="item.imgUrl" mode="aspectFill"></image>
							<view class="my-card-card__title">{{item.title}}</view>
							<view class="my-card-card__text">剩余{{settingData.card.font.ci}}数：{{item.times}}</view>
						</view>
						<view class="my-card__more">
							<image class="my-card__more__img" src="/static/images/user/icon-more.png"></image>
							<view class="my-card__more__text">更多</view>
						</view>
					</view>
				</view>
				<!-- 我的次票 end -->

				<!-- 订单导航栏 -->
				<view class="order-navbar user-content-p-wrap">
					<form @submit="onTargetOrder" data-type="all" report-submit="true">
						<button formType="submit" class="btn-normal">
							<view class="order-navbar-header border-line border-bottom dis-flex">
								<text class="order-navbar-header-title f-30">我的订单</text>
								<!-- <view class="dis-flex flex-y-center">
									<text class="f-24 col-9">全部订单</text>
									<text class="icon iconfont icon-jinrujiantou1 col-9"></text>
								</view> -->
							</view>
						</button>
					</form>
					<view class="order-navbar-footer user-order-navbar">
						<view v-for="item in order" :key="item.icon" class="order-navbar-item">
							<form @submit="onTargetOrder" :data-type="item.icon" report-submit="true">
								<button formType="submit" class="btn-normal">
									<view class="order-navbar-img" >
										<view class="order-navbar-img-wrap">
											<image class="image" :src="item.img" style="width: 50rpx;height: 50rpx;"></image>
										</view>
									</view>
									<text class="order-navbar__name">{{item.name}}</text>
									<text class="order-badge" v-if="item.count > 0">{{item.count}}</text>
								</button>
							</form>
						</view>
					</view>
					<view class="order-navbar-bind-phone border-line border-top dis-flex flex-x-between" v-if="hasUserinfo && !hasMobile">
						<view class="bind-phone-txt">
							找不到订单和{{appCoupon.coupon_title}}？绑定手机号试试
						</view>
						<view class="bind-phone-btn dis-flex flex-y-center p-r">
							<view class="btn p-r">一键获取
								<bind-mobile-button showText="1" @onBindSuccess="getUserDetail"></bind-mobile-button>
							</view>
						</view>
					</view>
				</view>
				<!-- 订单导航栏 end -->
				
				<!-- 我的团购 -->
				<view v-if="reg && reg.length" class="order-navbar user-content-p-wrap">
					<view class="order-navbar-header border-line border-bottom">
						<text class="order-navbar-header-title f-30">我的团购</text>
					</view>
					<!-- <view class="Icon-bg">
							    <navigator url="../../subPages/business/appointment" hover-class="navigator-hover">
							                    <button type="default">我的预约</button>
							                </navigator>
					</view> -->
					<view class="order-navbar-footer order-navbar-menu-footer">
						<!-- <view class="order-navbar-item p-r" v-for="(item,index) in menus" :key="index"
						:disabled="item.id === 'cgp'&&cgpSatus==3?true:false" > -->
				
						<view class="order-navbar-item p-r" v-for="(item,index) in reg" :key="index">
							<button v-if="item.kf_type == 2" @click="onTargetMenus($event,item.url,item)" formType="submit" class="btn-normal">
								<view class="order-navbar-img">
									<view class="order-navbar-img-wrap t-c" style="line-height: 140rpx;">
										<!-- <image class="image" :src="'/static/images/user/'+item.icon+'.png'"></image> -->
										<image class="image" :src="item.img" style="width: 50rpx;" mode="widthFix"></image>
									</view>
								</view>
								<text class="order-navbar__name onelist-hidden">{{item.name}}</text>
								<text v-if="item.count" class="order-badge" style="right: 30rpx; top: 20rpx;">{{item.count}}</text>
							</button>
							<form v-else @submit="onTargetMenus($event,item.url,item)" :data-url="item.url" :data-icon="item.icon" report-submit="true">
								<button formType="submit" class="btn-normal">
									<view class="order-navbar-img">
										<view class="order-navbar-img-wrap t-c" style="line-height: 140rpx;">
											<!-- <image class="image" :src="'/static/images/user/'+item.icon+'.png'"></image> -->
											<image class="image" :src="item.img" style="width: 50rpx;" mode="widthFix"></image>
										</view>
									</view>
									<text class="order-navbar__name onelist-hidden">{{item.name}}</text>
									<text v-if="item.count" class="order-badge" style="right: 30rpx; top: 20rpx;">{{item.count}}</text>
								</button>
							</form>
							<block v-if="(item.id === 'apply') && (!!hasUserinfo && !hasMobile) && is_bindmobile">
								<bind-mobile-button @onBindSuccess="onTargetMenus($event,item.url)"></bind-mobile-button>
							</block>
							<block v-if="(item.id === 'enter') && (!!hasUserinfo && !hasMobile)">
								<bind-mobile-button @onBindSuccess="onTargetMenus($event,item.url)"></bind-mobile-button>
							</block>
						</view>
				
					</view>
				</view>
				<!-- 我的团购 end -->

				<!-- 菜单列表 -->
				<view class="order-navbar user-content-p-wrap">
					<view class="order-navbar-header border-line border-bottom">
						<text class="order-navbar-header-title f-30">我的服务</text>
					</view>
					<!-- <view class="Icon-bg">
							    <navigator url="../../subPages/business/appointment" hover-class="navigator-hover">
							                    <button type="default">我的预约</button>
							                </navigator>
					</view> -->
					<view class="order-navbar-footer order-navbar-menu-footer">
						<!-- <view class="order-navbar-item p-r" v-for="(item,index) in menus" :key="index"
						:disabled="item.id === 'cgp'&&cgpSatus==3?true:false" > -->

						<view class="order-navbar-item p-r" v-for="(item,index) in menus" :key="index">
							<button v-if="item.kf_type == 2" @click="onTargetMenus($event,item.url,item)" formType="submit" class="btn-normal">
								<view class="order-navbar-img">
									<view class="order-navbar-img-wrap t-c" style="line-height: 140rpx;">
										<!-- <image class="image" :src="'/static/images/user/'+item.icon+'.png'"></image> -->
										<image class="image" :src="item.img" style="width: 50rpx;" mode="widthFix"></image>
									</view>
								</view>
								<text class="order-navbar__name onelist-hidden">{{item.name}}</text>
								<text v-if="item.count" class="order-badge" style="right: 30rpx; top: 20rpx;">{{item.count}}</text>
							</button>
							<form v-else @submit="onTargetMenus($event,item.url,item)" :data-url="item.url" :data-icon="item.icon" report-submit="true">
								<button formType="submit" class="btn-normal">
									<view class="order-navbar-img">
										<view class="order-navbar-img-wrap t-c" style="line-height: 140rpx;">
											<!-- <image class="image" :src="'/static/images/user/'+item.icon+'.png'"></image> -->
											<image class="image" :src="item.img" style="width: 50rpx;" mode="widthFix"></image>
										</view>
									</view>
									<text class="order-navbar__name onelist-hidden">{{item.name}}</text>
									<text v-if="item.count" class="order-badge" style="right: 30rpx; top: 20rpx;">{{item.count}}</text>
								</button>
							</form>
							<block v-if="(item.id === 'apply') && (!!hasUserinfo && !hasMobile) && is_bindmobile">
								<bind-mobile-button @onBindSuccess="onTargetMenus($event,item.url)"></bind-mobile-button>
							</block>
							<block v-if="(item.id === 'enter') && (!!hasUserinfo && !hasMobile)">
								<bind-mobile-button @onBindSuccess="onTargetMenus($event,item.url)"></bind-mobile-button>
							</block>
						</view>

					</view>
				</view>
			</view>
			<copyright></copyright>
		</view>

		<!-- 分销等级 -->
		<popup-view :show="showDealerLevel" type="center" @clickmask="showDealerLevel = false">
			<view class="dealer-level">
				<!-- <view class="level-header dis-flex flex-dir-column flex-x-around flex-y-center" :style="{'background-image':getImageRoot('63.png','url')}"> -->
				<view class="level-header dis-flex flex-dir-column flex-x-around flex-y-center main-bg-color">
					<!-- :src="getImageRoot('62.png')" -->
					<image class="level-icon "></image>
					<view class="col-3 f-30 f-w auxiliary-color">{{dealerInfo.leave_title || ""}}</view>
					<view class="point auxiliary-color">•</view>
					<view class="f-24 col-3 m-btm20 auxiliary-color" v-if="!!dealerInfo.leave_last_info">下个等级：{{dealerInfo.leave_last_info?dealerInfo.leave_last_info.leave_title:""}}</view>
				</view>
				<scroll-view scroll-y="true" class="level-up" v-if="dealerInfo.leave_last_info && dealerInfo.leave_last_info.leave_where">
					<view class="col-3 f-24 f-w p-r">升级需要满足以下条件:</view>
					<!-- <block v-for="(item,index) in leaveLastInfo" :key="index">
						<block v-if="!!item.value"></block>
						<view class="col-3 f-24 m-top12">· {{item.text}},{{item.value}}</view>
					</block> -->
					<block v-for="(item,index) in leaveLastInfo" :key="index">
						<block v-if="!!item.goods">
							<view class="col-3 f-26 dis-flex m-top30">
								<view class="numleft m-right12 main-bg-color auxiliary-color">{{index+1}}</view>
								<view class="f-24">购买商品</view>
							</view>
							<block v-for="(item_g,index_g) in item.goods" :key="index_g">
								<view class="reveal m-top12 dis-flex f-24" @click="navigationToGoods(item_g.goods_id)">
									<image class="img m-right12" :src="item_g.image"></image>
									<view class="flex-box">
										<view class="f-24 onelist-hidden" style="text-indent:20rpx">{{item_g.goods_name}}</view>
										<view class="dis-flex">
											<view class="f-28" style="color: #E9524B">￥{{item_g.goods_price}}</view>
											<view class="f-18 col-9 m-right12" style="line-height:44rpx;text-decoration: line-through;"></view>
											<view class="buy f-20 col-9 help-bg-color">购买升级</view>
										</view>
									</view>
								</view>
							</block>
							<!-- <view class="f-26 dis-flex m-top30">
								<view class="numleft m-right12">2</view>
								<view class="f-24">{{item.uni}}</view>
							</view> -->
						</block>
						<block v-else>
							<view class="col-3 f-26 m-top12 dis-flex">
								<view class="numleft_bn m-right12 main-bg-color auxiliary-color">{{index+1}}</view>
								<view>{{item.text}},{{item.value}}</view>
							</view>
						</block>
					</block>

				</scroll-view>
				<view class="level-up max" v-else>
					<view class="col-3 f-24 f-w p-r t-c">您当前已是最高等级!</view>
				</view>
				<view class="main-bg-color level-btn t-c f-28 col-3 auxiliary-color" @click="showDealerLevel = false">我知道了</view>
			</view>
		</popup-view>

		<!-- 分享菜单 -->
		<share-view ref="shareView" :poster-type="'dealer'"></share-view>
		<!-- 激活账号 -->
		<write-hint ref="writeHint"></write-hint>
		<DiyTab></DiyTab>
		<page-loading ref="loading"></page-loading>
		<!-- #ifdef MP-WEIXIN -->
		<view class="btn-subscribe" @click="handleBtnSubscribeClick">
			<view class="btn-subscribe__icon iconfont icon-fold topicon"></view>
			<view class="btn-subscribe__text">订阅通知</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<GetUserPhone ref="getUserPhone" :isUpdated="true" :roundcloseVisible="false"></GetUserPhone>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<FollowImgPopup v-if="settingData && settingData.qzgz" :visible="settingData.qzgz.indexOf('my') !== -1"></FollowImgPopup>
		<!-- #endif -->

	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import DiyTab from '@/components/template/TabBar.vue'
	import Copyright from '@/components/template/Copyright.vue'
	import PopupView from '@/components/template/PopManager.vue'
	import BindMobileButton from '@/components/template/BindMobileButton.vue'
	import ShareView from '@/components/template/ShareView.vue'
	import LeadAttention from '@/components/template/LeadAttention.vue'
	import GetUserPhone from '@/components/template/GetUserPhone.vue'
	import TipBar from '@/components/template/TipBar.vue'
	// #ifdef H5
	import FollowImgPopup from '@/components/page/pageComponents/FollowImgPopup.vue'
	// #endif

	export default {
		data() {
			let reg = /^(?![0-9]+)(?![a−zA−Z]+)[0-9A-Za-z]{1,20}$/
			// console.log(reg.test('a'))
			// console.log(reg.test('1111111@a'))
			// console.log(reg.test('a11'))
			// console.log(reg.test('a_1'))
			// console.log(reg.test('_a1'))
			// console.log(reg.test('_1//////a'))
			// console.log(reg.test('_1a1111****!!!'), 'sss')
			return {
				setting: {},
				write: null,
				// userInfo: {},
				orderCount: {},
				order: [],
				reg:[],
				dealerInfo: {},
				menus: [],
				member_Info: {},
				bindType: '', // 绑定手机号方式
				shareData: null, // 分享数据
				showDealerLevel: false, // 显示分销等级弹窗
				cgp: {},
				cgpSatus: '',
				// 弹窗显示控制
				animationData: {},
				off: false,
				htmlData: [],
				is_force_phone: false,
				is_bindmobile: false,
				// 卡包列表的接口数据
				cardBagRes: []
			}
		},
		components: {
			DiyTab,
			Copyright,
			BindMobileButton,
			PopupView,
			ShareView,
			LeadAttention,
			GetUserPhone,
			TipBar,
			// #ifdef H5
			FollowImgPopup
			// #endif
		},
		computed: {
			cCardList() {
				return (this.cardBagRes || []).map(item => ({
					_source: item,
					id: item.id,
					imgUrl: item.logo || '',
					bgUrl: item.image,
					title: item.title,
					times: item.number
				})).slice(0, 2)
			},
			userMobile() {
				if (!!this.userInfo && !!this.userInfo.mobile) {
					let mobile = this.userInfo.mobile.split('')
					mobile.splice(3, 4, '*', '*', '*')
					return mobile.join('')
				}
			},
			isShowAttention() {
				if (this.setting && this.setting.share) {
					return this.setting.share.app_show == '1'
				}
			},
			userInfo() {
				return this.$store.state.userInfo || {}
			},
			memberInfo() {
				return this.member_Info
			},
			hasUserinfo() {
				return this.$store.state.userInfo && this.$store.state.userInfo.user_id
			},
			hasMobile() {
				return this.hasUserinfo && !this.$util.isEmptyMobile(this.$store.state.userInfo.mobile)
			},
			balanceSetting() {
				return this.settingData.balance || {}
			},
			headerBgTop() {
				return this.hasUserinfo && this.userInfo.dealer_user === 1 && this.dealerInfo.user_diy === '1' ? '388rpx' :
					'288rpx'
			},
			leaveLastInfo() {
				if (!!this.dealerInfo && this.dealerInfo.leave_last_info) {
					let leave_where = this.dealerInfo.leave_last_info.leave_where
					// leaveList = []; //最终要渲染的数据
					if (leave_where.length > 0) {
						leave_where = leave_where.filter(val => !!val.introduction && !val.introduction.finish).map(val => {
							let {
								introduction: itemWhere // 后端传过来的每一项
							} = val || {},
								leaveItem = {} // 渲染使用每一项条件
							// if (!!itemWhere) {
							// 	leaveItem.text = itemWhere.text;
							// 	if (itemWhere.goods) {
							// 		itemWhere.goods.map(item => {
							// 			let leaveItem = {};
							// 			// leaveItem.goods_name =item.goods_name;
							// 			// leaveItem.uni =item.goods_name;
							// 			// leaveItem.image =item.image;
							// 			// leaveItem.goods_price =item.goods_price;
							// 			leaveItem.uni = item;
							// 			console.log("item",item);
							// 			leaveList.push(leaveItem);
							// 		});
							// 		console.log("leaveItem", leaveItem)
							// 	} else {
							// 		leaveItem.value = itemWhere.value;
							// 		leaveList.push(leaveItem);
							// 	}
							// }
							return itemWhere
						})
						// console.log("leaveList", leaveList)
						// return leaveList
						console.log('leave_where', leave_where)
						return leave_where
					}
					return []

				}
				return []


			},
			showDealerFast() {
				let {
					hasUserinfo,
					userInfo: {
						dealer_user
					},
					dealerInfo: {
						user_diy,
						is_open
					}
				} = this
				return hasUserinfo && dealer_user === 1 && user_diy === '1' && is_open === '1'
			}
		},
		beforeCreate() {
			// #ifdef MP-WEIXIN
			uni.hideTabBar()
			// #endif
			uni.removeStorageSync('currentPage')
		},

		onLoad(options) {
			// #ifdef H5
			// let getappSetting = this.$store.getters.getappSetting
			// this.is_force_phone = !!(!this.userInfo.mobile && getappSetting.share.is_force_phone === '1')
			// #endif
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.setIndex()

			App.customDefaultShare(this.globalSaveRefereeId, `${App.siteInfo.siteroot}h5/#/pages/subPages/user/index`)

			// 获取当前用户申请团长状态
			// this.getLeaderState()
			// 获取当前用户信息
			// #ifdef MP
			App.userSilentLogin(() => {
				console.log('获取用户信息--------------userSilentLogin')
				this.getUserDetail()
			}, true)
			// #endif
			// #ifdef H5
			this.getUserDetail()
			// #endif
			if (this.$refs.writeHint && !!this.$refs.writeHint) {
				this.$refs.writeHint.mask = uni.getStorageSync('iswrite') === 2
			}
			// 初始化一个动画
			var animation = uni.createAnimation({
				duration: 1000,
				timingFunction: 'ease'
			})
			this.animation = animation
			this.fetchCardBagRes().catch(() => {})
		},


		watch: {
			dealerInfo(newValue) {
				console.log('————个人分销————')
				console.log('hasUserinfo', this.hasUserinfo)
				console.log('userInfo', this.userInfo)
				console.log('dealerInfo', newValue)
				console.log()
			},
			is_force_phone(newValue) {
				if (newValue) {
					this.$refs.getUserPhone.showChange()
				}
			}
		},
		methods: {
			async handleBtnTipRefreshClick() {
				uni.showLoading({
					title: '刷新中',
					mask: true
				})
				this.getUserDetail({
					is_refresh: 1
				})
			},
			// 请求卡包列表的接口数据
			async fetchCardBagRes() {
				try {
					const res = await App._getP('card.card/myCard', {
						list_rows: 2,
						no_login: 1
					})
					this.cardBagRes = this.$util.deepGet(res, 'data.data', [])
				} catch (e) {
					console.log('fetchCardBagRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			handleBtnSubscribeClick() {
				App.navigationTo({
					url: 'pages/subPages/subscribeWxMessage/index'
				})
			},
			setIndex() {
				App._post_form('setting/index', {}, res => {
					this.setting = res.data
					this.is_bindmobile = this.setting.bind_mobile == 1
				})
			},
			declick() {
				if (this.off) {
					// 使用动画
					this.rotateAndScale()
				} else {
					this.norotateAndScale()
				}
				this.off = !this.off
			},
			// 定义动画内容
			rotateAndScale() {
				// 定义动画内容
				this.animation.translateX(0).step()
				// 导出动画数据传递给data层
				this.animationData = this.animation.export()
			},
			norotateAndScale() {
				this.animation.translateX(-80).step()
				this.animationData = this.animation.export()
			},
			// getLeaderState() {
			// 	let _this = this
			// 	App._post_form('cgp.Regapply/applyStatus', {
			// 		no_login:1
			// 	}, function(res) {
			// 		_this.cgpSatus = res.data.status
			// 	})
			// },
			/**
			 * 登录
			 */
			doLogin() {
				App.doLogin()
			},
			/**
			 * 获取当前用户信息
			 */
			getUserDetail: function({
				is_refresh
			}={}) {
				let _this = this
				App._get('user.index/detail', {
					no_login: 1,
					is_refresh
				}, function(result) {
					console.log('————个人数据————')
					console.log('result==============', result.data)
					console.log()
					let menus = result.data.menus,
						handlerList = []
					_this.cgp = result.data.cgp
					for (let key in menus) {
						let item = {
							id: key,
							...menus[key]
						}
						handlerList.push(item)
					}
					result.data.menus = handlerList.sort((a,b)=>{
						const sort1 = +a.sort || 0
						const sort2 = +b.sort || 0
						return sort1 - sort2
					})
					if (result.data.userInfo) {
						App.setUserinfo('', result.data.userInfo.user_id, result.data.userInfo)
						// 获取分销商数据
						if (result.data.userInfo.dealer_user === 1) {
							_this.dealerInfo = result.data.dealer
						}
						if (result.data.userInfo.is_debug === 1) {
							App.showSuccess('调试已打开', () => {
								uni.setEnableDebug({
									enableDebug: true
								})
							})
						}
						// #ifdef H5
						let getappSetting = _this.$store.getters.getappSetting
						_this.is_force_phone = !!(!_this.userInfo.mobile && getappSetting.share.is_force_phone === '1')
						// #endif
					} else {
						console.log('清除------')
						_this.$store.commit('userInfo', {})
						uni.removeStorageSync('userInfo')
					}
					delete result.data.userInfo
					_this.setData(result.data)
					// 兼容抖音无法关闭loading
					// #ifdef MP-TOUTIAO
					setTimeout(() => {
						App.hideLoading()
					}, 600)
					// #endif
					// #ifndef MP-TOUTIAO
					App.hideLoading()
					// #endif
					uni.stopPullDownRefresh()
					if(is_refresh == 1) {
						uni.showToast({
							icon: 'none',
							title: '刷新成功'
						})
					}
				})
			},

			/**
			 * 订单导航跳转
			 */
			onTargetOrder(e) {
				// #ifdef MP-WEIXIN
				if (!this.$store.state.token || !this.hasUserinfo || !this.userInfo.user_id) {
					this.doLogin()
					return false
				}
				// #endif
				// 记录formid
				App.saveFormId()
				let urls = {
					all_order: 'pages/mainPages/order/index?type=all',
					payment: 'pages/mainPages/order/index?type=payment',
					delivery: 'pages/mainPages/order/index?type=delivery',
					received: 'pages/mainPages/order/index?type=received',
					refund: 'pages/mainPages/order/refund/index'
				}
				// 转跳指定的页面
				App.navigationTo({
					url: urls[e.currentTarget.dataset.type]
				})
			},
			// 商品跳转
			navigationToGoods(goods_id) {
				let url = `pages/subPages/goods/index/index?goods_id=${goods_id}`
				if (this.appClientType === '4') {
					url += `&i=${App.getUniacid()}`
				}
				App.navigationTo({
					url
				})
			},

			/**
			 * 菜单列表导航跳转
			 */
			async onTargetMenus(e, url,item={}) {
				// #ifdef MP
				if(item.kf_type == '2') {
					wx.openCustomerServiceChat({
					  extInfo: {url: item.qykf_link},
					  corpId: item.qykf_id,
					  success(res) {
						console.log(res)
					  },
					  fail(res) {
						uni.showModal({
						    title: '温馨提示',
						    content: res.errMsg,
						    showCancel: false
						})
						console.log(res)
					  }
					})
					return 
				}
				// #endif
				
				// #ifdef H5
				if(item.kf_type == '2') {
					location.href = item.qykf_link
					return 
				}
				// #endif

				// 记录formId
				if (e.detail && e.detail.formId) {
					App.saveFormId()
				} else {

					this.getUserDetail()
				}
				
				if(item.id === 'movie') {
					try {
						// 显示loading
						uni.showLoading({
							title: '跳转中...'
						})
						const location = await App.getLocation() || {}
						const res = await App._postP('movie.Movie/inToMovie',{
							latitude: location.latitude || '',
							longitude: location.longitude || ''
						})
						
						const url = res.data || ''
						
						uni.hideLoading()
						if(!url) {
							uni.showToast({
								icon:'none',
								title: '未获取到url'
							})
							return
						}
						// 隐藏loading
						// #ifdef H5
						location.href = url
						// #endif
						// #ifdef MP
						App.navigationTo({
						    url: 'pages/mainPages/index/webview?link=' + encodeURIComponent(url)
						})
						// #endif
					} catch (e) {
						console.log('fetchCardCateRes', e)
						return Promise.reject(e)
						// TODO handle the exception
					}
					return
				}

				App.navigationTo({
					url
				})
			},
			// 会员跳转
			member() {
				let _this = this
				App.navigationTo({
					url: 'pages/subPages/member/index/index'
				})
			},
			official(e) {
				if (e.detail.status !== 0) {
					if (wx.getRealtimeLogManager) {
						let settingData = this.settingData,
							logger = wx.getRealtimeLogManager()
						console.log('关注公众号组件显示错误:', e.detail.errMsg, e.detail.scene ? e.detail.scene : '')
						logger.info('关注公众号组件显示错误:', e.detail.errMsg, e.detail.scene ? e.detail.scene : '')
						settingData.share.app_show = 2
						this.$store.commit('setAppSetting', settingData)
					}
				}
			},
			/**
			 * 显示分销等级
			 */
			dealerLevel(leave_diy) {
				if (leave_diy === '1') {
					App.navigationTo({
						url: 'pages/subPages/dealer/index/level'
					})
				} else {
					this.showDealerLevel = true
				}
			},
			/**
			 * 分销邀请分享
			 */
			dealerShare(shareType) {
				App.navigationTo({
					url: 'pages/subPages/user/share?shareType=' + shareType
				})
				// // #ifndef MP-TOUTIAO
				// shareType === "dealer" && this.$refs.shareView.shareswich();
				// // #endif

				// if (this.appClientType === "4") {
				// 	let userInfo = this.userInfo,
				// 		shareData = shareType === "dealer" ? {
				// 			title: this.userInfo.nickName, // 分享标题
				// 			desc: "邀请您成为分销商~", // 分享描述
				// 			link: `${App.siteInfo.siteroot}h5/#/pages/subPages/dealer/apply/apply?referee_id=${userInfo.user_id}&i=${App.getUniacid()}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				// 			imgUrl: userInfo.avatarUrl, // 分享图标
				// 		} : {
				// 			title: this.userInfo.nickName, // 分享标题
				// 			desc: "邀请您开通会员卡~", // 分享描述
				// 			link: `${App.siteInfo.siteroot}h5/#/pages/subPages/member/index/index?referee_id=${this.userInfo.user_id}&i=${App.getUniacid()}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				// 			imgUrl: this.userInfo.avatarUrl, // 分享图标
				// 		};
				// 	wxApi.wxShare(shareData);
				// 	this.$refs.shareView.onlyImg = true;
				// }

			}
		},
		onPullDownRefresh() {
			this.getUserDetail()
			this.setIndex()
		}
	}
</script>


<style lang="scss">
	/* 用户信息 */
	page {
		background-color: rgb(242, 242, 242);
		padding-bottom: 200rpx;
	}

	.pickup {
		position: fixed;
		top: 400rpx;
		/* background: #ffd940; */
		z-index: 100;
		width: 240rpx;
		padding: 10rpx;
		border-radius: 10rpx;
		right: -212rpx;
	}

	.user {
		position: relative;
	}

	.user-header {
		width: 100%;
		align-content: center;
		background-repeat: no-repeat;
		background-position: center right;
		background-size: auto 100%;
		position: relative;
		overflow: hidden;
	}

	.user-header-bg {
		width: 100%;
		position: absolute;
		left: 0;
		transform: translateY(-100%);
		display: block;
		z-index: 1;
	}

	.user-header .user-header-cont {
		display: flex;
		margin: 0 30rpx;
		height: 160rpx;
		width: calc(100vw - 60rpx);
		align-items: center;
		position: relative;
		z-index: 2;
	}

	.discount-num {
		height: 100rpx;
		position: relative;
		z-index: 2;
		flex: 1;
		padding: 0 12rpx;
	}

	.discount-num .col-3 {
		white-space: nowrap;
		margin-left: 20rpx;
	}

	.discount-num .f-24 {
		white-space: nowrap;
	}

	.balance-icon {
		position: absolute;
		top: -50%;
		right: -50%;
		width: 40rpx;
		height: 40rpx;
		display: block;
		z-index: 1;
	}

	.discount-num .discount-icon {
		width: 50rpx;
		height: 50rpx;
		display: block;
		margin: 0 auto 12rpx;
	}

	.user-header .user-header-cont .user-header-avatar {
		display: block;
		margin-right: 20rpx;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		overflow: hidden;
	}

	.user-header .user-header-cont .user-header-avatar image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		display: block;
	}

	.user-header-info-name {
		height: 34rpx;
		line-height: 34rpx;
		font-size: 36rpx;
	}

	.user-header-info-phone {
		height: 40rpx;
		line-height: 40rpx;
		color: #333333;
		font-size: 24rpx;
		margin-top: 12rpx;
	}

	.user-login-btn {
		width: 5em;
		padding: 6rpx 12rpx;
		text-align: center;
		border: 1rpx solid #333333;
		border-radius: 50px;
	}

	.user-header-info-phone .i {
		font-size: 24rpx;
		display: inline-block;
	}

	.user-header-info-phone .i.icon-writefill {
		margin-left: 6rpx;
	}

	.user-content {
		position: relative;
		z-index: 5;
	}

	.user-member {
		margin: 0 30rpx 0;
		position: relative;
		z-index: 3;
		height: 84rpx;
		line-height: 84rpx;
		padding-right: 30rpx;
		background-size: 100% 84rpx;
		background-repeat: no-repeat;
		padding: 0 20rpx;
	}

	.bg-mask {
		position: relative;
		z-index: 2;
		margin: -14rpx 0 -30rpx;
		height: 44rpx;
		background: #F2F2F2;
	}

	.member-left .left-member-title,
	.left-member-content {
		position: relative;
		color: #ECDBBD;
		padding: 0 12rpx;

		.user-member--disabled & {
			color: #333333;
		}
	}

	.member-left .left-member-title:after {
		content: " ";
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		width: 2rpx;
		height: 24rpx;
		background-color: #ECDBBD;
		opacity: .5;
	}

	.user-member .open-memberbtn {
		background: linear-gradient(49deg, #E7CFAC, #F1E0CE);
		width: 114rpx;
		height: 42rpx;
		line-height: 42rpx;
		border-radius: 20rpx;
		color: #472712;

	}

	.user-member--disabled {
		.open-memberbtn {
			background: #333333;
			color: #D0D0D0;
		}

	}

	.member-pop {
		background-color: #F2F2F2;
		position: relative;
		height: 40rpx;
		margin-top: -16rpx;
	}

	/*黑卡会员*/
	.black-card {
		height: 64rpx;
		line-height: 64rpx;
		margin: 0 78rpx;
		padding: 0 30rpx;
		background-color: #292C37;
		border-radius: 20rpx 20rpx 0 0;
		position: relative;
	}

	.black-card-bg {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.black-card-wrap {
		position: relative;
		z-index: 1;
	}

	.black-card-l {
		justify-content: flex-start;
	}

	.black-card-l .i {
		width: 44rpx;
		height: 44rpx;
		line-height: 44rpx;
		margin-top: 10rpx;
		display: inline-block;
		float: left;
	}

	.black-card-l .i .image {
		width: 100%;
		height: 100%;
	}

	.black-card-l .span {
		font-size: 24rpx;
		font-family: HYk1gj;
		font-weight: 400;
		background: -webkit-linear-gradient(90deg, #EBD9AE, #C4A364);
		background: linear-gradient(90deg, #EBD9AE, #C4A364);
		-webkit-background-clip: text;
		color: transparent;
		margin-left: 10rpx;
		display: inline-block;
	}

	.black-card-r {
		justify-content: flex-start;
	}

	.black-card-r .span {
		font-size: 24rpx;
		background: -webkit-linear-gradient(90deg, #EBD9AE, #C4A364);
		background: linear-gradient(90deg, #EBD9AE, #C4A364);
		-webkit-background-clip: text;
		color: transparent;
		margin-left: 10rpx;
		display: inline-block;
	}

	.black-card-r .i {
		height: 16rpx;
		line-height: 16rpx;
		color: #393B44;
		font-size: 20rpx;
		font-weight: 600;
		margin-left: 10rpx;
		padding: 8rpx 6rpx;
		background: linear-gradient(90deg, #EBD9AE, #C4A364);
		border-radius: 16rpx;
	}

	.user-content-p-wrap {
		margin: 20rpx 30rpx 0;
		background-color: #fff;
		border-radius: 20rpx;
	}

	/* 余额 */
	.balance-i {
		flex: 1;
	}

	.balance-i-wrap {
		text-align: center;
		padding: 28rpx 20rpx;
		position: relative;
	}

	.balance-i-wrap::after {
		content: "";
		position: absolute;
		top: 24rpx;
		bottom: 24rpx;
		right: 0;
		border-left: 1px solid #F7F7F7;
		transform-origin: 0 0;
		transform: scaleX(0.5);
		z-index: 2;
	}

	.balance-i:last-child .balance-i-wrap::after {
		content: none;
	}

	.balance-i-txt {
		height: 24rpx;
		line-height: 24rpx;
		font-size: 28rpx;
		font-weight: 400;
	}

	.balance-i-num {
		height: 28rpx;
		line-height: 28rpx;
		font-size: 28rpx;
		font-weight: 400;
		margin-top: 20rpx;
	}

	/* 订单导航栏 */
	.order-navbar {
		font-size: 30rpx;
		margin-top: 20rpx;
		background: #fff;
	}

	.order-navbar-header {
		margin: auto;
		height: 40rpx;
		line-height: 40rpx;
		padding: 26rpx 30rpx;
		/* border-bottom: 1px solid #eee; */
		justify-content: space-between;
		align-items: center;
	}

	.order-navbar-header-title {
		font-size: 30rpx;
		font-weight: 400;
	}

	.order-navbar-header .icon {
		font-size: 30rpx;
		margin-left: 6rpx;
	}

	.order-navbar-footer {
		width: 100%;
		padding: 0 0 26rpx 0;
	}

	/* 	.order-navbar-footer .btn-normal {
		padding: 10rpx 0 0 0;
	} */

	.order-navbar-footer .order-navbar-img {
		height: 90rpx;
	}

	.order-navbar-img-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100rpx;
		height: 100rpx;
		margin: 0 auto;
	}

	.order-navbar-footer .order-navbar-img-wrap .image {
		width: 100%;
		height: 100%;
	}

	.order-navbar-footer .order-navbar-item {
		width: 25%;
		display: inline-block;
	}

	.order-navbar-footer.user-order-navbar .order-navbar-item {
		width: 20%;
	}

	.order-navbar-footer .order-navbar-item .order-navbar__name {
		display: block;
		font-size: 24rpx;
		color: #666666;
		text-align: center;
	}

	.order-navbar-menu-footer .order-navbar-item .order-navbar__name {
		color: #666666;
	}

	.order-navbar-footer .order-navbar-item .order-badge {
		position: absolute;
		top: 10rpx;
		right: 6%;
		font-size: 22rpx;
		background: #ff495e;
		text-align: center;
		line-height: 28rpx;
		color: #fff;
		border-radius: 100%;
		min-height: 30rpx;
		min-width: 30rpx;
		padding: 1rpx;

		&.is-small {
			min-height: 10rpx;
			min-width: 10rpx;
		}
	}

	/* 绑定手机 */
	.order-navbar-bind-phone {
		/* position: relative; */
		/* border-top: 1px solid #eee; */
		padding: 0 30rpx;
	}

	.bind-phone-txt {
		line-height: 28rpx;
		color: #FE504F;
		font-size: 24rpx;
		font-weight: 400;
		padding: 30rpx 20rpx 30rpx 0;
		font-weight: bold;
	}

	.bind-phone-btn .btn {
		width: 120rpx;
		height: 48rpx;
		line-height: 48rpx;
		font-weight: bold;
		color: #FE504F;
		font-size: 24rpx;
		text-align: center;
		border: 2rpx solid rgba(254, 80, 79, 1);
		border-radius: 6rpx;
		background-color: transparent;
		padding: 0;
	}

	.official-account {
		margin: 20rpx 30rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.dealer-info {
		margin-top: 20rpx;
	}

	.dealer-title {
		padding: 26rpx 30rpx;
	}

	.dealer-withdraw {
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		/* background: #FFD940; */
		border-radius: 30px;
	}

	.income-list {
		padding: 20rpx 30rpx 26rpx;
	}

	.income-item {
		flex: 1;
		position: relative;
	}

	.income-item::after {
		content: " ";
		position: absolute;
		top: 10rpx;
		bottom: 10rpx;
		right: 30rpx;
		border-right: 1rpx solid #F7F7F7;
	}

	.income-item:last-child::after {
		content: none;
	}

	.dealer-share {
		padding: 30rpx;
	}

	.dealer-share-item {
		position: relative;
	}

	.dealer-share-item:last-child {
		padding-left: 30rpx;
	}

	.dealer-share .dealer-share-icon {
		width: 72rpx;
		height: 72rpx;
		display: block;
	}

	.dealer-share-btn {
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		/* background: #FFD940; */
		border-radius: 30px;
	}

	.dealer-level {
		width: 500rpx;
		padding-bottom: 30rpx;
		border-radius: 20rpx;
		background: #FFFFFF;
	}

	.level-header {
		height: 244rpx;
		background-size: 101% 100%;
		border-radius: 20rpx 20rpx 0 0;
	}

	.point {
		position: relative;
	}

	.point::after,
	.point::before {
		content: " ";
		position: absolute;
		top: 50%;
		transform: scale(.5);
		width: 106rpx;
		border-top: 1rpx solid #333333;
	}

	.point::after {
		right: -120rpx;
	}

	.point::before {
		left: -120rpx;
	}

	.level-header .level-icon {
		width: 204rpx;
		height: 197rpx;
		display: block;
		margin-top: -20%;
	}

	.level-up {
		padding: 30rpx 40rpx;
		height: 600rpx;
		box-sizing: border-box;
	}

	.level-up .f-w::before {
		content: " ";
		position: absolute;
		top: 50%;
		left: -24rpx;
		width: 12rpx;
		height: 12rpx;
		background: #FFD940;
		transform: translateY(-50%) rotate(45deg);
	}

	.level-up.max .f-w::before {
		content: none;
	}

	.level-btn {
		margin: 0 60rpx;
		/* background: #FFD940; */
		height: 72rpx;
		line-height: 72rpx;
		border-radius: 6rpx;
	}

	.numleft {
		width: 32rpx;
		height: 32rpx;
		background: rgba(253, 219, 52, 1);
		border-radius: 50%;
		text-align: center;
		line-height: 32rpx;
		font-size: 20rpx;
	}

	.numleft_bn {
		width: 44rpx;
		height: 32rpx;
		background: rgba(253, 219, 52, 1);
		border-radius: 50%;
		text-align: center;
		line-height: 32rpx;
		font-size: 20rpx;
	}

	.reveal {
		width: 360rpx;
		height: 80rpx;
		background: rgba(248, 248, 248, 1);
		border-radius: 10rpx;
		padding: 20rpx;

		.img {
			width: 75rpx;
			height: 75rpx;
			border-radius: 10rpx;
		}
	}



	.buy {
		width: 96rpx;
		height: 40rpx;
		line-height: 40rpx;
		background: #FF4444;
		color: rgba(255, 255, 255, 1);
		border-radius: 8rpx;
		text-align: center;
		padding: 0 10rpx;
		font-size: 20rpx;
	}

	.btn-subscribe {
		box-sizing: border-box;
		position: fixed;
		right: 30rpx;
		bottom: 200rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		width: 110rpx;
		height: 110rpx;
		padding-bottom: 8rpx;
		z-index: 6;
		font-size: 26rpx;
		color: #FFFFFF;
		background-image: url('/static/images/user/button.png');
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}

	.btn-subscribe__icon {
		height: 26rpx;
	}

	.btn-subscribe__text {
		font-size: 26rpx;
		width: 2.2em;
		line-height: 1.1;
		text-align: center;
	}
</style>

<style lang="scss" scoped>
	// 我的次票
	.my-card {
		box-sizing: border-box;
		margin: 20rpx 30rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.my-card__title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}

	.my-card__content {
		display: flex;
		justify-content: space-between;
		padding-top: 46rpx;
	}

	.my-card-card {
		box-sizing: border-box;
		position: relative;
		width: 258rpx;
		height: 145rpx;
		padding: 0 20rpx;
		border-radius: 10rpx;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}

	.my-card-card__img {
		position: absolute;
		left: 50%;
		bottom: 100%;
		box-sizing: border-box;
		width: 60rpx;
		height: 60rpx;
		border-radius: 100%;
		border: 1px solid #fff;
		transform: translate(-50%, 50%);
	}

	.my-card-card__title {
		padding-top: 50rpx;
		font-weight: bold;
		font-size: 24rpx;
		color: #fff;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.my-card-card__text {
		margin-top: 10rpx;
		font-size: 20rpx;
		color: #fff;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.my-card__more {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 74rpx;
		height: 145rpx;
		background-color: #EEEEEE;
		border-radius: 10rpx;
	}

	.my-card__more__img {
		width: 32rpx;
		height: 32rpx;
	}

	.my-card__more__text {
		margin-top: 16rpx;
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
	}

	// 我的次票 end
</style>
