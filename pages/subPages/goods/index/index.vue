<template>
	<view style="overflow-x:hidden;" :style="themeColor">
		<!-- 返回直播间 -->
		<view class="back-live dis-flex flex-y-center flex-x-around" v-if="roomid" @click="returnBtn">
			<view class="image-box">
				<image src="../../../../static/images/liveIcon.png" mode="" style="width: 100%;height: 100%;"></image>
			</view>
			<view class="col-f f-24">返回直播间</view>
			<view class="iconfont icon-jinrujiantou1 col-f " style="margin-left: -4rpx;margin-top: -2rpx;"></view>
		</view>
		<!-- 返回按钮 -->
		<!-- #ifdef H5 || MP-WEIXIN || MP-TOUTIAO -->
		<view class="diy-navigator" :style="{'top':backBtnHeight+'px'}">
			<view class="return-btn" @click="returnBtn">
				<view class="iconfont icon-fanhuijiantou"></view>
			</view>
		</view>
		<!-- #endif -->

		<!-- 购买弹幕 -->
		<view class="success-tips dis-flex flex-y-center main-bg-color " :class="{'show':showTips}">
			<image class="success-avatar" :src="barrageList[tipsIndex] ? barrageList[tipsIndex].avatarUrl : ''"></image>
			<view class="onelist-hidden success-goods f-24 col-3 m-left12 auxiliary-color">
				{{barrageList[tipsIndex]?barrageList[tipsIndex].text:""}}</view>
		</view>

		<!-- 喜欢 -->
		<block v-if="!!spike_id && !isBargain && detail.is_like === 1">
			<view class="like-goods-nums" style="text-align: right; ">
				<view class="goods-browse-xihuan-2">
					<image :src="getImageRoot('68.png')"
						style="width:24rpx;height:24rpx;margin: 0 10rpx 0 10rpx;position:relative;top:4rpx;"></image>
					<view decode='true' style="display:inline;">
						{{detail.viewed?detail.viewed:0}}人喜欢
					</view>
				</view>
			</view>
		</block>

		<!-- 商品详情 -->
		<view v-if="detail.goods_id">
			<!-- 商品头部banner -->
			<view class="goods-header">
				<block v-if="bannerType === 'imgs'">
					<swiper :indicator-dots="!!detail.video?false:true" :autoplay="true" :interval="3000"
						:circular="true" class="goods-swiper" @change="setCurrent"
						:style="{'height':swiperHeight+'px'}">
						<swiper-item class="swiper-item" v-for="(item,index) in detail.image" :key="item.id"
							@click="previewImages(item.file_path,index)">
							<image :src="item.file_path" @load="imagesHeight($event,index)" mode="widthFix"
								:class="'itemImage'+index"></image>
						</swiper-item>
					</swiper>
					<!-- 	<view class="goods-viewed" v-if="detail.is_like === 1">{{detail.viewed?detail.viewed:0}}人感兴趣</view> -->
				</block>
				<block v-else>
					<view class="goods-video">
						<DiyVideo item-id="goods-video" :autoplay="true" x5VideoPlayerType="h5-page"
							:params="videoParams.params" :item-style="videoParams.itemStyle"
							@on-status-change="handleGoodsVideoStatusChange"></DiyVideo>
					</view>
				</block>
				<!-- <view class="swiper-index" v-if="bannerType === 'imgs'">{{currentIndex}}/{{detail.image.length}}</view> -->
				<view class="banner-change dis-flex flex-dir-row" v-if="detail.video">
					<!-- <view class="change-item " :class="{'active main-bg-color auxiliary-color':bannerType === 'video'}" @click="bannerChange">视频</view>
					<view class="change-item" :class="{'active main-bg-color auxiliary-color':bannerType === 'imgs'}" @click="bannerChange">图片</view> -->
					<view class="change-item " :class="{'active main-bg-color auxiliary-color':bannerType === 'video'}"
						@click="bannerChange">视频</view>
					<view class="change-item" :class="{'active main-bg-color auxiliary-color':bannerType === 'imgs'}"
						@click="bannerChange">图片</view>
				</view>
			</view>
			<!-- 下架时间 -->
			<!-- 			<view v-if="cOffTimeData.visible" class="off-shelf-card">
				<view class="off-shelf-card__left">
					<view class="off-shelf-card__price">
						<text class="is-small">￥</text>
						<text class="is-strong">95.00</text>
						<text v-if="detail.spec_type === 20" class="is-small">起</text>
					</view>
				</view>
				<view class="off-shelf-card__right">
					<view class="off-shelf-card__title">距结束还剩</view>
					<view class="off-shelf-time">
						<view class="off-shelf-time__item is-num">{{cOffTimeData.days}}</view>
						<view class="off-shelf-time__item">天</view>
						<view class="off-shelf-time__item is-num">{{cOffTimeData.hours}}</view>
						<view class="off-shelf-time__item">:</view>
						<view class="off-shelf-time__item is-num">{{cOffTimeData.minutes}}</view>
						<view class="off-shelf-time__item">:</view>
						<view class="off-shelf-time__item is-num">{{cOffTimeData.seconds}}</view>
					</view>
				</view>
			</view> -->
			<!-- 下架时间 end -->

			<!-- 下架时间 -->
			<view v-if="cOffTimeData.visible" class="groups-box help-bg-color auxiliary-color">
				<view class="groups-content dis-flex flex-y-center flex-x-between"
					:class="{'is-groupend':activityStatus.status === 2}">
					<view class="groups-box-left dis-flex flex-dir-row flex-y-center">
						<view class="groups-title col-f f-42">距结束还剩</view>
					</view>
					<view class="groups-box-right dis-flex flex-dir-row flex-y-center" style="padding-right: 10rpx;">
						<view class="off-shelf-time">
							<view class="off-shelf-time__item is-num">{{cOffTimeData.days}}</view>
							<view class="off-shelf-time__item">天</view>
							<view class="off-shelf-time__item is-num">{{cOffTimeData.hours}}</view>
							<view class="off-shelf-time__item">时</view>
							<view class="off-shelf-time__item is-num">{{cOffTimeData.minutes}}</view>
							<view class="off-shelf-time__item">分</view>
							<view class="off-shelf-time__item is-num">{{cOffTimeData.seconds}}</view>
							<view class="off-shelf-time__item">秒</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 下架时间 end -->

			<!-- 会员专属商品logo -->
			<block v-if="isMemberExclusiveGoods">
				<image :src="getImageRoot('member_user_goods.png')" mode=""
					style="display: block;width: 750rpx;height: 100rpx;"></image>
			</block>

			<!-- 秒杀时间 -->
			<block v-if="!!spike_id">
				<view class="seckill-box" :style="{'background-image':getImageRoot('89.png','url')}">
					<!-- <view class="seckill-box" style="background-image:url(https://zerodev.weliam.com.cn//addons/weliam_areashop/web/assets/store/img/default/we/89.png)"> -->
					<view class="seckill-content dis-flex flex-y-center flex-x-between">
						<view class="seckill-box-left dis-flex flex-y-center flex-box">
							<image class="seckill-logo" src="/static/images/seckill-timelogo.png" mode=""></image>
							<view class="seckill-title col-f f-42 onelist-hidden">
								{{!!detail.span?detail.span:'限时秒杀'}}
							</view>
						</view>
						<!-- 秒杀 -->
						<view class="seckill-box-right">
							<!-- 0未开始  1进行中  2已结束-->
							<view class="seckill-date f-20 t-r">
								{{
									activityStatus.status === 0 ? '距活动开始'
									: activityStatus.status === 1 ? '秒杀倒计时'
									: activityStatus.status === 2 ? '秒杀已结束' : ''
								}}
							</view>

							<view class="seckill-hms f-22 price-font-family">
								<!-- <CountDown
								:leftTime="(activityStatus.status===0&&activityStatus.etLeftTime)?activityStatus.etLeftTime:activityStatus.leftTime"
								:showColon="true"
								timeType="seckill"
								color="#F5156F"
								backgroundColor="#FFFFFF"
								splitorColor="#FFFFFF"
								@timeEnd="setActivityCutTime((activityStatus.status===0&&activityStatus.etLeftTime)?'notice':'spike',{})"></CountDown> -->
								<CountDown
									:leftTime="(activityStatus.status===0&&activityStatus.etLeftTime)?activityStatus.etLeftTime:activityStatus.leftTime"
									:showColon="true" timeType="seckill" color="#F5156F" backgroundColor="#FFFFFF"
									splitorColor="#FFFFFF"
									@timeEnd="resetDetail((activityStatus.status===0&&activityStatus.etLeftTime)?'notice':'spike')">
								</CountDown>
							</view>
						</view>
					</view>
				</view>
			</block>


			<block v-if="!!group_id">
				<!-- :style="{'background-image':getImageRoot('33.png','url')}" -->
				<view class="groups-box help-bg-color auxiliary-color">
					<view class="groups-content dis-flex flex-y-center flex-x-between"
						:class="{'is-groupend':activityStatus.status === 2}">
						<view class="groups-box-left dis-flex flex-dir-row flex-y-center">
							<!-- <view class="groups-logo">拼团</view> -->
							<view class="groups-title col-f f-42">{{!!groupData.tags?groupData.tags:'火热拼团'}}</view>
						</view>
						<view class="groups-box-right dis-flex flex-dir-row flex-y-center">
							<block v-if="activityStatus.status === 2">
								<view class="groups-date f-24" style="color:#999999;">当前活动已结束！</view>
							</block>
							<block v-else>
								<view class="groups-date f-24" v-if="activityStatus.status === 0">距活动开始</view>
								<view class="groups-date f-24" v-if="activityStatus.status === 1">距活动结束</view>
								<view class="groups-hms f-22">
									<CountDown :leftTime="activityStatus.leftTime" color="#FE504F"
										backgroundColor="#FFFFFF" splitorColor="#FFFFFF"
										@timeEnd="setActivityCutTime('group',{start_time:groupData.stime,end_time:groupData.etime})">
									</CountDown>
								</view>
							</block>
						</view>
					</view>
				</view>
			</block>
			<!-- 砍价 -->
			<block v-if="isBargain">
				<view class="bargain-box" :style="{'background-image':getImageRoot('33.png','url')}">
					<view class="bargain-content dis-flex flex-y-center flex-x-between"
						:class="{'is-groupend':activityStatus.status === 2}">
						<view class="groups-box-left dis-flex flex-dir-column">
							<view class="groups-title col-f f-42 dis-flex flex-y-center">
								<view class="f-44"><text
										class="f-20">{{settingData.currency}}</text>{{bargain_data.low_price}}</view>
								<view class="favourable"><i class="rotatex"></i><text class="pos-center">砍价享</text>
								</view>
							</view>
							<view class="desc-old f-20" style="text-decoration: line-through;">原价
								{{settingData.currency}}{{detail.goods_min_price}}</view>
						</view>
						<view class="groups-box-right dis-flex flex-dir-column flex-x-center flex-y-center">
							<block v-if="activityStatus.status === 2">
								<view class="groups-date f-24" style="color:#999999;">当前活动已结束！</view>
							</block>
							<block v-else>
								<view class="groups-date f-24" v-if="activityStatus.status === 0">距活动开始</view>
								<view class="groups-date f-24" v-if="activityStatus.status === 1">距活动结束还有</view>
								<view class="groups-hms f-22">
									<CountDown :leftTime="activityStatus.leftTime" color="#FFFFFF"
										backgroundColor="#FE504F" splitorColor="#FE504F"
										@timeEnd="setActivityCutTime('bargain',{start_time:bargain_data.start_time,end_time:bargain_data.end_time})">
									</CountDown>
								</view>
							</block>
							<view class="dot-tip"></view>
						</view>
					</view>
				</view>

				<view class="bargain-title" v-if="isBargain">
					<!-- 商品名称 -->
					<view class="goods-title-mian f-36 col-3" :class="detail.selling_point == ''?'':'m-btm15'">
						{{detail.goods_name}}</view>
					<!-- 商品卖点 -->
					<view v-if="detail.selling_point" class="goods-title-minor f-28 col-9 m-btm15">
						{{detail.selling_point}}</view>
				</view>

				<view v-if="isBargain" class="bargain-section">
					<view class="bargain-shopping">
						<view class="f-24 bargain-price dis-flex flex-x-between flex-y-center">
							<text>[砍价购]</text>
							<view class="dis-flex flex-x-center flex-y-center col-9" @click="showBargainnfo = true">
								玩法详情<text class="option-item-ft iconfont icon-jinrujiantou1"></text>
							</view>
						</view>
						<view>
							<text class="col-9 f-24">邀请好友砍价,超低价购买心仪商品!</text>
						</view>
					</view>
				</view>
			</block>
			<!-- 商品信息 -->
			<view class="goods-info">

				<!-- 商品内容 -->
				<view class="goods-content module-content">
					<view v-if="!isBargain" class="goods-price-box dis-flex flex-dir-row flex-y-center flex-x-between">
						<!-- 商品价格 -->
						<block v-if="!!group_id">
							<!-- 拼团 -->
							<view class="dis-flex flex-dir-row flex-y-center flex-x-between">
								<view class="groups-num">{{groupData.join_num}}人团</view>
								<view class="goods-price dis-flex flex-dir-row flex-y-end">
									<view class="goods-price-now price-font-family">
										<view class="money-label f-24">{{settingData.currency}}</view>
										<text class="f-58" style="line-height:1;">{{groupData.groups_price}}</text>
										<view class="money-label f-22" v-if="detail.spec_type === 20">起</view>
									</view>
									<view class="goods-price-old" v-if="groupData.min_price>0">
										<view class="money-label">{{settingData.currency}}</view>{{groupData.min_price}}
									</view>
								</view>
							</view>
						</block>
						<block v-else>
							<!-- 普通商品/秒杀商品 -->
							<view class="dis-il-block">
								<view class="goods-price dis-flex flex-dir-row flex-y-end">
									<view class="goods-price-now price-font-family">
										<view class="money-label f-24">{{settingData.currency}}</view>
										<text class="f-50">{{goods_show_price}}</text>
										<view class="money-label f-22" v-if="detail.spec_type === 20">起</view>
									</view>
									<view class="goods-price-old" v-if="line_price>0">
										<view class="money-label">{{settingData.currency}}</view>{{line_price}}
									</view>
								</view>
								<view class="dis-flex flex-y-center member-coupon-view-y"
									v-if="detail.is_member_price === 1">
									<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
									<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">
										{{memberDiyFont.discount_font}}<text
											class="member-coupon-price">{{detail.coupon_price}}</text>元起</view>
								</view>
							</view>
						</block>
						<!-- 商品销量/库存 -->
						<view class="goods-browse" v-if="!isBargain">
							<!-- <view class="goods-viewed" v-if="detail.is_like === 1">{{detail.viewed?detail.viewed:0}}人感兴趣</view> -->
							<!-- <view class="activity-like t-c f-24" v-if="data.luck_is_see === 1"><text class="iconfont icon-like"></text>{{data['luck_like']}}人喜欢</view> -->
							<block v-if="detail.is_like === 1 && !spike_id">
								<!-- <text class="iconfont icon-like" style="margin-left: 14rpx;"></text> -->
								<view style="text-align: right; ">
									<view class="goods-browse-xihuan">
										<image :src="getImageRoot('68.png')"
											style="width: 20rpx;height: 20rpx;margin: 0 10rpx 0 10rpx;"></image>
										<view decode='true' style="display:inline;">
											{{detail.viewed?detail.viewed:0}}人喜欢
										</view>
									</view>
								</view>
							</block>
							<view>
								<block v-if="detail.is_sales === 1">已售{{detail.goods_sales}}</block>
								{{detail.is_sales === 1&&detail.is_stock === 1?"/":""}}
								<block v-if="detail.is_stock === 1">仅剩{{detail.sku_count}}</block>
							</view>
						</view>
					</view>
					<!-- 会员折扣商品信息或状态展示 -->
					<!-- 不同级别返利信息  -->
					<view class="rebate-list">
						<view v-if="detail.rebate_commission" class="rebate-item">{{dealerDiyFont.d_selling}}{{settingData.currency}}{{detail.rebate_commission}}</view>
						<view v-if="detail.team_commission" class="rebate-item">{{dealerDiyFont.g_selling}}{{settingData.currency}}{{detail.team_commission}}</view>
					</view>
					<!-- 不同级别返利信息 end  -->
					<block v-if="detail.is_member_price === 1">
						<block v-if="detail.is_member === 0">
							<view class="member-info b-f dis-flex flex-y-center flex-x-between">
								<view class="member-left dis-flex flex-y-center" @click="skip_member(2)">
									<view class="left-member-logo"></view>
									<view class="left-member-title f-24 onelist-hidden">
										{{!!detail.card_set_title?detail.card_set_title:'会员卡'}}</view>
									<view class="left-member-content f-24">加入会员,下单立减
										<text>{{settingData.currency}}{{detail.coupon_price}}</text>
									</view>
								</view>
								<view class="memeber-right f-22" @click="skip_member(2)">立即加入
									<text class="iconfont icon-right"></text>
								</view>
							</view>
						</block>
						<block v-if="detail.is_member===1">
							<view class="member-info b-f dis-flex flex-y-center flex-x-between">
								<view class="member-left dis-flex flex-y-center" @click="skip_member(1)">
									<view class="left-member-logo"></view>
									<view class="left-member-title f-24 onelist-hidden">
										{{!!detail.card_set_title?detail.card_set_title:'会员卡'}}</view>
									<view class="left-member-content f-24 onelist-hidden"
										style="width:140px;flex-grow: 1;">
										{{!!detail.card_set_title?detail.card_set_title:'会员卡'}}低至{{detail.sku &&  detail.sku[0] && detail.sku[0].member_price}}元购买
									</view>
								</view>
								<view class="memeber-right f-22 dis-flex flex-y-center" @click="skip_member(1)">
									<view class="onelist-hidden">查看我的特权</view><text class="iconfont icon-right"></text>
								</view>
							</view>
						</block>
					</block>

					<!-- 商品标题 -->
					<view class="goods-title" v-if="!isBargain">
						<!-- 商品名称 -->
						<view class="goods-title-mian f-30 f-w col-3" :class="!!detail.selling_point?'':'m-btm15'">
							<image v-if="isMemberExclusiveGoods" src="../static/images/img-hyzs.png"
								style="width: 123rpx;height: 30rpx;vertical-align: middle;"></image>
							{{detail.goods_name}}
						</view>
						<view style="display: flex;margin-top: 20rpx;flex-wrap:wrap;" v-if="detail.is_buy_and_give==1">
							<view v-for="(item,index) in detail.buy_and_give_rules" class="f-24" style="color:#FF4444;">
								<view
									style="border: 1px solid #FF4444;margin-right: 6rpx;border-radius:8rpx;padding: 4rpx;margin-bottom: 8rpx;">
									买{{item.purchase}}赠{{item.give}}</view>
							</view>
						</view>
						<!-- 商品卖点 -->
						<view class="goods-title-minor f-24 col-9 m-btm15">{{detail.selling_point}}</view>
					</view>

					<!-- 商品服务 -->
					<view class="goods-service-box dis-flex" v-if="!!serve && serve.length > 0">
						<view class="goods-service dis-flex flex-y-center">
							<view class="service-item dis-flex flex-y-center" v-for="(item,index) in serve"
								:key="index">
								<image v-if="goodsRes.fw_icon_off == 1" :src="goodsRes.fw_icon" class="service-icon">
								</image>
								<view v-else class="iconfont icon-roundcheck main-color"></view>
								<view class="col-3 f-24 service-text">{{item.title}}</view>
							</view>
						</view>
						<view class="more-services iconfont icon-more col-6 f-w t-r" @click="onToggleSpec('serve')">
						</view>
					</view>

					<!-- 商品优惠券 -->
					<view class="goods-coupon m-top20" v-if="coupon_list.length">
						<view class="coupon-item col-f dis-flex flex-x-between flex-y-center"
							v-for="(item,index) in couponShowList" :key="item.coupon_id">
							<view class="coupon-price t-c">
								<view class="dis-flex flex-y-line flex-x-center">
									<view class="f-22" style="margin-right:4rpx" v-if="item.coupon_type!==20">
										{{settingData.currency}}</view>
									<view class="f-40">{{item.discount}}</view>
									<view class="f-22" v-if="item.coupon_type===20" style="margin-left:4rpx">折</view>
								</view>
								<view class="f-24 onelist-hidden">{{item.rule === 0?`满${item.rule_min_money}元可用`:"无门槛"}}
								</view>
							</view>
							<view class="coupon-info t-l flex-box p">
								<view class="coupon-name f-28">{{item.name}}</view>
								<view class="coupon-time f-24">{{item.time}}</view>
							</view>
							<view class="coupon-receive f-22"
								@click="receiveCoupon(item.coupon_id,item.coupon_type,item)">立即领取</view>
						</view>
						<view class="col-9 t-c f-24 m-top16" v-if="coupon_list.length>2"
							@click="onToggleSpec('coupon')">查看更多{{appCoupon.coupon_title}}</view>
					</view>

					<!-- 商品分享 -->
					<view class="goods-promote">
						<!-- 已购买-->
						<view class="goods-already dis-flex flex-dir-row flex-y-end flex-x-between p-r">
							<view class="goods-already-buy">
								<view class="goods-already-num f-24 m-btm20">TA们都在{{isBargain?"砍":"逛"}}</view>
								<view class="goods-already-user">
									<image class="user-avatar" :src="item.avatarUrl" v-for="(item,index) in user_image"
										:key="index" :style="{'z-index':user_image.length*2-index}"></image>
									<view class="user-avatar user-more f-24">···</view>
								</view>
							</view>
							<view v-if="dealer_tip && dealer_diy === '1'" class="goods-invite-reward">
								分享{{dealer_type === "" || dealer_type === "1"?"最高":"可"}}赚¥{{detail.first_money}}元</view>
							<!-- <view class="goods-invite main-bg-color auxiliary-color" @click="isShare('share')">
								邀请好友一起抢 -->
							<!-- #ifdef MP-TOUTIAO -->
							<!-- <button class="report-btn" open-type="share"></button> -->
							<!-- #endif -->
							<!-- </view> -->
							<view class="goods-invite main-bg-color auxiliary-color" @click="isShare('share')">
								{{text_diy.friend}}
								<!-- #ifdef MP-TOUTIAO -->
								<button class="report-btn" open-type="share"></button>
								<!-- #endif -->
							</view>
						</view>

						<!-- 社群活动 -->
						<block v-if="community">
							<view
								class="goods-community dis-flex flex-x-between flex-y-center m-top20 border-line border-top">
								<view class="community-user dis-flex flex-y-center flex-box ">
									<image
										:src="community.headimg && community.headimg.length > 0 && !!community.headimg[0] ? community.headimg[0].file_path : '' "
										class="community-user-img"></image>
									<view class="community-user-info flex-box">
										<view class="community-user-name col-0 f-28">{{community.title}}</view>
										<view class="community-user-des f-24 col-9 onelist-hidden">{{community.des}}
										</view>
									</view>
								</view>
								<view class="community-btn">
									<button class="community-add f-24 main-bg-color auxiliary-color"
										@click="onToggleCommunity()">添加</button>
								</view>
							</view>

							<!-- 社群弹窗  -->
							<!-- #ifdef H5 -->
							<popup-layer :showClose="true" :show="showCommunity" topTitle="关注提醒"
								:wechat="community.wechat" :communityType="community.community_type"
								:phone="community.mobile"
								:imgSrc="community.qrcodeimg && community.qrcodeimg.length > 0 && !!community.qrcodeimg[0]?community.qrcodeimg[0].file_path:''"
								:isShowLongPressBtn="true" @closePopupBtn="onToggleCommunity()">
							</popup-layer>
							<!-- #endif -->

							<!-- #ifdef MP -->
							<popup-layer :showClose="true" :show="showCommunity" topTitle="联系客服"
								:pagePath="cPopupLayer.pagePath" :wechat="community.wechat"
								:communityType="community.community_type" :sendMessageTitle="cSendMessage.title"
								:sendMessageImg="cSendMessage.img" :phone="community.mobile"
								:imgSrc="getImageRoot('91.png')" footBtnText='去回复' @closePopupBtn="onToggleCommunity()">
								<view v-if="appClientType ==='2'">
									有任何疑问，点击“<text class="col-m">去回复</text>”发送“<text
										class="col-m">{{community.id}}</text>”,即可添加客服微信
								</view>
							</popup-layer>
							<!-- #endif -->
							<!-- 社群弹窗 end -->

							<!-- 社群弹窗（废弃） -->
							<popup-view style="display: none;" :show="showCommunity" type="center"
								@clickmask="onToggleCommunity()">
								<view class="community-detail b-f t-c">
									<view class="community-header f-w f-44 p-r"><text
											class="community-header-text p-r">联系客服</text></view>
									<!-- #ifdef MP-WEIXIN -->
									<view class="community-body f-26 col-3" v-if="appClientType ==='2'">
										有任何疑问，点击“<text class="col-m">去回复</text>”发送“<text
											class="col-m">{{community.id}}</text>”,即可添加客服微信
									</view>
									<!-- #endif -->
									<!-- #ifdef H5 -->
									<!-- v-if="appClientType === '4'" -->
									<view class="community-body">
										<image
											:src="community.qrcodeimg && community.qrcodeimg.length > 0 && !!community.qrcodeimg[0]?community.qrcodeimg[0].file_path:''"
											class="community-qrcodeimg"></image>
										<view class="community-toreply f-26 col-3">长按识别二维码</view>
									</view>
									<!-- #endif -->
									<view class="community-phone dis-flex flex-y-center flex-x-between">
										<view class="community-number dis-flex flex-y-center">
											<image src="/static/images/goods/community.png"
												class="community-number-icon"></image>
											<view class="f-24 col-3">{{community.mobile}}</view>
										</view>
										<view class="community-bdial f-24 col-3" @click="callPhone(community.mobile)">拨号
										</view>
									</view>
									<button class="community-reply f-24 col-3" open-type="contact"
										v-if="appClientType === '2'">去回复</button>
								</view>
							</popup-view>
						</block>
					</view>
					<!-- 商品原价 -->
					<block v-if="isTieredPriceGoods != 0">
						<view class="f-24">
							商品原价:
							<text style="color: #fe504f;">￥</text>
							<text style="color: #fe504f; font-size: 40rpx;">{{goods_price}}</text>
						</view>
						<view class="f-24 col-9" style="margin-bottom: 30rpx;">阶梯价规格售完，商品恢复原价购买</view>
					</block>
					<!-- 阶梯价组件 -->
					<tiered-pricing :tiered-list="tieredPrice" :ismember="ismember"></tiered-pricing>
				</view>
				<!-- 商品选项 -->
				<view class="goods-option">
					<view class="goods-option-list">
						<!-- <view class="goods-option-item dis-flex flex-dir-row flex-y-center">
							<view class="option-item-hd">优惠</view>
							<view class="option-item-bd  flex-box dis-flex flex-dir-row flex-y-center">
								<view class="coupon-item">满168减10</view>
							</view>
							<view class="option-item-ft iconfont icon-jinrujiantou1"></view>
						</view> -->
						<view v-if="!!group_id && groupData.is_commander_discount == 1"
							class="goods-option-item dis-flex flex-dir-row flex-y-center  border-line border-bottom">
							<view class="option-item-hd groups-hd f-24">优惠</view>
							<view class="groups-bd option-item-bd flex-box onelist-hidden f-24">团长优惠<text
									class="text-danger">{{groupData.commander_discount}}元</text></view>
							<view class="option-item-ft"></view>
						</view>
						<!-- <view class="goods-option-item dis-flex flex-dir-row flex-y-center border-line border-bottom" @click="onToggleSpec('serve')">
							<view class="option-item-hd f-24">服务</view>
							<view class="option-item-bd  flex-box onelist-hidden f-24">{{goodsServe}}</view>
							<view class="option-item-ft iconfont icon-jinrujiantou1"></view>
						</view> -->
						<!-- <view class="goods-option-item dis-flex flex-dir-row flex-y-center  border-line border-bottom" v-if="specData.length > 0 && detail.is_meal!=1" -->
						<view class="goods-option-item dis-flex flex-dir-row flex-y-center  border-line border-bottom"
							v-if="specData.length > 0 && detail.is_meal!=1" @click="onToggleTrade">
							<view class="option-item-hd f-24">规格</view>
							<view class="option-item-bd  flex-box onelist-hidden f-24">{{goodsSpec}}</view>
							<view class="option-item-ft iconfont icon-jinrujiantou1"></view>
						</view>

						<view class="goods-option-item dis-flex flex-dir-row flex-y-center"
							@click="onToggleSpec('param')" v-if="param.value && param.value.length > 0">
							<view class="option-item-hd f-24">参数</view>
							<view class="option-item-bd  flex-box onelist-hidden f-24">{{goodsParams}}</view>
							<view class="option-item-ft iconfont icon-jinrujiantou1"></view>
						</view>
					</view>
				</view>
				<!-- 广告 -->
				<view v-if="cAd.visible" class="ad-wrapper">
					<image :src="cAd.imgUrl" class="ad-wrapper__image" @click="navigationTo(cAd.link)"></image>
				</view>

				<!-- 广告 end -->
			</view>


			<!-- 拼团参与列表 -->
			<view class="goods-option" v-if="!!group_id && groupsShowListInfo && groupData.groupsNumber > 0">
				<view class="groups-info padding-box" style="height: auto;padding:0 30rpx 0 0;width:100%;">
					<view
						class="goods-option-item dis-flex flex-dir-row flex-y-center flex-x-between border-line border-bottom">
						<view class="option-item-hd f-24" style="width: auto;">{{groupData.groupsNumber}}人组团中，请参与</view>
						<view class="dis-flex flex-dir-row flex-y-center" @click="showGoGroup = true">
							<view class="f-24" style="height: 1em;line-height: 1em;">查看更多</view>
							<view class="option-item-ft iconfont icon-jinrujiantou1"></view>
						</view>
					</view>
					<view class="info-list-box" style="padding-right: 30rpx;width:auto;height:auto;">
						<view v-for="(groupsItem,groupsIndex) in groupsShowList" :key="groupsIndex"
							class="info-list dis-flex flex-dir-row flex-y-center flex-x-between border-line border-bottom">
							<view class="dis-flex flex-dir-row flex-y-center flex-box">
								<image class="info-img" :src="groupsItem.avatarUrl" mode=""></image>
								<view class="f-28 col-3 flex-box onelist-hidden">{{groupsItem.nickName}}</view>
							</view>
							<view class="dis-flex flex-dir-row flex-y-center flex-x-between">
								<view class="desc dis-flex flex-dir-column">
									<text>还差<text class="text-danger">{{groupsItem.lastnumber}}</text>人成团</text>
									<text>剩余{{groupsItem.overFormat}}</text>
								</view>
								<view class="go-group" @click="goGroupsJoin(groupsItem)">
									{{groupsItem.isSelf?"查看详情":"去拼团"}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 服务和参数 -->
			<popup-view :show="showGoodsSpec" type="bottom" @clickmask="onToggleSpec('close')">
				<view class="goods-buy-menu">
					<!-- 主体信息-->
					<view class="trade-main">
						<view class="trade-main-title">
							{{popupType === "param"?"商品参数":popupType === 'serve'?"商品服务":appCoupon.coupon_title}}</view>
						<block v-if="popupType === 'param'">
							<!-- 商品参数 -->
							<scroll-view scroll-y class="goods-spec-list">
								<view class="goods-spec-item dis-flex flex-dir-row flex-y-center"
									v-for="(item,index) in param.value" :key="index">
									<view class="spec-item-label col-9">{{item.name}}</view>
									<view class="spec-item-text col-3">{{item.value}}</view>
								</view>
							</scroll-view>
						</block>
						<block v-if="popupType === 'serve'">
							<!-- 商品服务 -->
							<scroll-view scroll-y class="goods-service-list">
								<view class="goods-service-item dis-flex flex-dir-row " v-for="(item,index) in serve"
									:key="index">
									<view class="service-item-label">
										<image v-if="goodsRes.fw_icon_off == 1" :src="goodsRes.fw_icon"
											class="service-icon" style="width: 36rpx;height: 36rpx;"></image>
										<view v-else class="iconfont icon-roundcheck main-color"></view>
									</view>
									<view class="service-item-content">
										<view class="service-item-title col-3">{{item.title}}</view>
										<view class="service-item-derc col-9 m-top20">{{item.content}}</view>
									</view>
								</view>
							</scroll-view>
						</block>
						<block v-if="popupType === 'coupon'">
							<!-- 商品服务 -->
							<scroll-view scroll-y class="goods-service-list">
								<view class="coupon-item col-f dis-flex flex-x-between flex-y-center"
									v-for="(item,index) in coupon_list" :key="item.coupon_id">
									<view class="coupon-price t-c">
										<view class="dis-flex flex-y-line flex-x-center">
											<view class="f-22" style="margin-right:4rpx" v-if="item.coupon_type!==20">
												{{settingData.currency}}</view>
											<view class="f-40">{{item.discount}}</view>
											<view class="f-22" v-if="item.coupon_type===20" style="margin-left:4rpx">折
											</view>
										</view>
										<view class="f-24 onelist-hidden">
											{{item.rule === 0?`满${item.rule_min_money}元可用`:"无门槛"}}</view>
									</view>
									<view class="coupon-info t-l flex-box p">
										<view class="coupon-name f-28">{{item.name}}</view>
										<view class="coupon-time f-24">{{item.time}}</view>
									</view>
									<view class="coupon-receive f-22"
										@click="receiveCoupon(item.coupon_id,item.coupon_type,item)">立即领取</view>
								</view>
							</scroll-view>
						</block>
						<!-- 按钮 -->
						<view class="buy-button-box">
							<button class="buy-button help-bg-color" @click="onToggleSpec('close')">确定</button>
						</view>
					</view>
				</view>
			</popup-view>

			<!-- 商品推荐搭配 -->
			<block v-if="collocationGoods && collocationGoods.length > 0">
				<view class="module-title-w m-top20">{{text_diy.collocation}}
					<view class="select-nav-items">
						<image src="/static/images/br1.png" class="main-bg-color" mode=""></image>
					</view>
				</view>
				<view class="goods-buy-tips module-content">
					<block v-for="(item,index) in collocationGoods" :key="item.goods_id">
						<view class="goods-collocation dis-flex flex-y-center"
							@click="navigationTo('pages/subPages/goods/index/index?goods_id='+item.goods_id)">
							<image :src="item.image?item.image[0].file_path:''" class="collocation-img"></image>
							<view class="dis-flex flex-dir-column flex-x-between">
								<view class="collocation-title col-3 f-26 twolist-hidden">{{item.goods_name}}</view>
								<view class="dis-flex flex-y-center member-coupon-view m-top12"
									v-if="item.is_member_price === 1">
									<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
									<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">
										{{memberDiyFont.discount_font}}<text
											class="member-coupon-price">{{item.coupon_price}}</text>元起</view>
								</view>
								<view class="dis-flex flex-y-line flex-x-between">
									<view class="dis-flex flex-y-line">
										<view class="col-m f-36"><text
												class="f-24">{{settingData.currency}}</text>{{item.goods_price}}</view>
										<view class="col-9 f-24 t-through">{{settingData.currency}}{{item.line_price}}
										</view>
									</view>
									<view class="col-3 f-24 collocation-btn t-c main-bg-color auxiliary-color">立即抢购
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</block>

			<!-- 礼包 商品 -->
			<view class="git-goods-part  module-content" v-if="isGift">
				<view class="module-title-w m-top20">{{text_diy.gift_name || '购物礼包'}}
					<view class="select-nav-items">
						<image src="/static/images/br1.png" class="main-bg-color" mode=""></image>
					</view>
				</view>

				<!-- <view class="goods-collocation dis-flex flex-y-center" v-for="(gift,giftIndex) in detail.gift"
					:key='giftIndex' @click="handleGiftCardClick(gift)">
					<image :src="gift.image && gift.image.length?gift.image[0].file_path:''" class="collocation-img">
					</image>
					<view class="dis-flex flex-dir-column flex-x-between">
						<view class="collocation-title col-3 f-26 twolist-hidden">{{gift.title}}</view>
						<view class="dis-flex flex-y-line flex-x-between">
							<view class="dis-flex flex-y-line">
								<view class="gift-bag-goods-card__price  f-36">￥<text
										class="is-strong">{{gift.price}}</text></view>
							</view>
							<view class="gift-bag-goods-card__shop">
								共<text class="is-strong">{{gift.store_count}}</text>家店铺可用<view
									class="iconfont iconfont-line icon-right"></view>
							</view>
						</view>
					</view>
				</view> -->
				<view class="gift-goods-card app-card app-flex" v-for="(gift,giftIndex) in detail.gift" :key='giftIndex' @click="handleGiftCardClick(gift)">
					<view class="app-flex-item app-flex-item--shrink-0" style="font-size: 0;" @click.stop="handleGiftDetailClick(gift)">
						<image class="gift-goods-card__img" :src="gift.image && gift.image[0] && gift.image[0].file_path" mode="aspectFill"></image>
					</view>
					<view class="app-flex-item app-flex-item--1 app-flex app-flex--column">
						<view class="app-flex-item app-flex-item--1">
							<view class="gift-goods-card__title">{{gift.title}}</view>
						</view>
						<view class="app-flex-item">
							<view class="gift-goods-card__atts-wrapper app-flex" :style="{backgroundImage: getImageRoot('bg-giftcode-goods.png', 'url')}">
								<view class="app-flex-item app-flex-item--1 app-flex-item--shrink-0 app-flex app-flex--column app-flex--justify-center p-left-right-20">
									<view class="col-f f-24">￥<text class="f-bold f-28">{{gift.need_pay_price}}</text></view>
									<view class="col-f f-20 t-through">￥{{gift.price}}</view>
								</view>
								<view class="app-flex-item app-flex-item--1 app-flex-item--shrink-0 app-flex app-flex--column app-flex--justify-center p-left-right-20" @click.stop="handleGiftDetailClick(gift)">
									<view class="f-26 f-bold" style="color: #9C3E0F;">{{gift.discount}}折</view>
									<view class="f-24" style="color: #9C3E0F;">查看详情<view class="iconfont is-inline icon-xiangyoujiantou" style="font-size: 24rpx;"></view></view>
								</view>
								<!-- 到店付 -->
								<view class="gift-goods-card__label-pay">到店付</view>
								<!-- 到店付 end -->
								<!-- 立省 -->
								<view class="gift-goods-card__label-save">立省￥{{gift.ls}}</view>
								<!-- 立省 end -->
							</view>
						</view>
					</view>
				</view>
				<!-- 	<view class="dis-flex flex-y-center  b-f item f-28 col-3 padding-all-box36 git-goods-item"   v-for="(gift,giftIndex) in detail.gift" :key='giftIndex'>
					<image :src="gift.image && gift.image.length ? gift.image[0].file_path:''"  style="width: 110rpx;height: 110rpx;" class="m-right12 bor-radius-10"></image>
					<view class="dis-flex  flex-y-center flex-x-between center m-left12">
						<view class="dis-flex flex-dir-column  flex-x-between " style="width: 70%;height: 100%;">
							<view class="f-28 f-w">{{gift.title}}</view>
							<view class="col-9 f-24">限成平书店使用</view>
						</view>
						<view class="t-c"  style="width: 25%;">
							<view class="main-bg-color col-3 t-c bor-radius-10">价值</view>
							<text  class="f-w col-f4">￥{{gift.price}}</text>
						</view>


					</view>
				</view> -->
			</view>


			<!-- 可选套餐 -->
			<view class="git-goods-part  module-content" v-if="isMeal">
				<view class="module-title-w m-top20">可选套餐
					<view class="select-nav-items">
						<image src="/static/images/br1.png" class="main-bg-color" mode=""></image>
					</view>
				</view>
				<block v-if="!showAll">
					<view class="dis-flex flex-y-center  b-f item   padding-all-box36 tc-goods-item col-3"
						v-for="(mealItem,mealIndex) in detail.sku" :key='mealIndex' v-if="mealIndex<4">
						<view class=" dis-flex flex-dir-column flex-x-around" style="height: 100%;width:75%;">
							<view class="f-28 f-w">{{mealItem.title}}</view>
							<view v-if="mealItem.limit_buy == 20" style="font-size: 20rpx;font-weight: lighter;">
								限购{{mealItem.limit_num}}件</view>
							<view class="col-f4 dis-flex  flex-y-center ">
								<text class="f-w f-24">¥{{mealItem.goods_price}}</text>
								<view class="dis-flex flex-y-center member-coupon-view-y"
									v-if="detail.is_member_price === 1">
									<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
									<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">
										{{memberDiyFont.discount_font}}<text
											class="member-coupon-price">{{mealItem.member_coupon_price}}</text>元</view>
								</view>

							</view>
						</view>
						<view class="col-3  main-bg-color f-24 auxiliary-color" v-if="mealItem.stock_num"
							style="padding: 16rpx 34rpx;box-sizing: border-box;border-radius: 30rpx;"
							@click="handleBtnSpecTap(mealItem.spec_sku_id)">
							立即购买
						</view>
						<view class="col-3  main-bg-color f-24 auxiliary-color" v-else
							style="padding: 16rpx 34rpx;box-sizing: border-box;border-radius: 30rpx;">
							暂无库存
						</view>

					</view>

				</block>
				<block v-else>
					<view class="dis-flex flex-y-center  b-f item   padding-all-box36 tc-goods-item col-3"
						v-for="(mealItem,mealIndex) in detail.sku" :key='mealIndex'>
						<view class=" dis-flex flex-dir-column flex-x-around" style="height: 100%;width:75%;">
							<view class="f-28 f-w">{{mealItem.title}}</view>
							<view v-if="mealItem.limit_buy == 20" style="font-size: 20rpx;font-weight: lighter;">
								限购{{mealItem.limit_num}}件</view>
							<view class="col-f4 dis-flex  flex-y-center ">
								<text class="f-w f-24">¥{{mealItem.goods_price}}</text>
								<view class="dis-flex flex-y-center member-coupon-view-y"
									v-if="detail.is_member_price === 1">
									<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
									<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">
										{{memberDiyFont.discount_font}}<text
											class="member-coupon-price">{{mealItem.member_coupon_price}}</text>元</view>
								</view>

							</view>
						</view>
						<view class="col-3  main-bg-color f-24 auxiliary-color" v-if="mealItem.stock_num"
							style="padding: 16rpx 34rpx;box-sizing: border-box;border-radius: 30rpx;"
							@click="jumpTocheckout(mealItem.spec_sku_id)">
							立即购买
						</view>
						<view class="col-3  main-bg-color f-24 auxiliary-color" v-else
							style="padding: 16rpx 34rpx;box-sizing: border-box;border-radius: 30rpx;">
							暂无库存
						</view>

					</view>

				</block>

				<view class="check-item check-more no-bor dis-flex flex-x-center flex-y-center col-9 f-24 m-top20">
					<view class="" @click="showAll=!showAll">{{showAll?"收起":"查看更多套餐"}}</view>
					<view class="iconfont icon-unfold" :class="[showAll?'icon-fold':'icon-unfold']"></view>
				</view>

			</view>

			<!-- 商家信息 -->
			<view v-if="cEleForceHidden.business" class="">
				<block v-if="businessList.length>0">
					<view class="module-title-w m-top20">{{text_diy.bus_info}}
						<view class="select-nav-items">
							<image src="/static/images/br1.png" class="main-bg-color" mode=""></image>
						</view>
					</view>
					<!-- 商品店铺 -->
					<view class="goods-store module-content" style="margin-top: 0;">
						<view class="goods-store-content">
							<view
								class="goods-store-address dis-flex flex-dir-row flex-y-center flex-x-between border-line border-top"
								v-if="!!cBusinessList && cBusinessList.length > 0" v-for="(item,index) in cBusinessList"
								:key="index" @click="toBusiness(item.id,item)">
								<view class="store-addres">
									<!-- 店铺名 -->
									<view class="col-3 f-30 f-w ">{{item.name}}

									</view>
									<!-- 店铺运营时间 -->
									<view class="store-time m-top10 col-9 dis-flex flex-dir-column flex-align-c">
										<view class="store-time f-24 col-9 onelist-hidden">
											<!-- <text class="time-icon iconfont icon-timefill"></text> -->
											<block v-if="item.time && item.time.length > 0">
												营业时间：<text v-for="(store,storeIndex) in item.time" :key="storeIndex"
													style="margin-right: 10upx;">{{store[2] || ''}}{{store[0]}}-{{store[1]}}</text>
											</block>
											<block v-else>
												营业时间：{{item.start_time}}-{{item.end_time}}
											</block>
										</view>
									</view>
									<!-- 店铺电话 -->
									<view class="store-addres-text twolist-hidden col-9 f-24">商家电话：{{item.mobile}}
									</view>
									<!-- 店铺地址 -->
									<view class="store-address col-9 f-24">{{item.address}}</view>
								</view>
								<view class="">
									<view class="col-3 f-24 main-bg-color auxiliary-color t-c" style="width: 80rpx;
height: 40rpx;
line-height: 40rpx;
border-radius: 10rpx;
margin-top: 30rpx;
">
										进入
									</view>
									<store-nav :mobile="item.mobile" :address="item"></store-nav>

								</view>

							</view>
							<view v-if="cBtnViewAllBusinessVisible" @click="allBusinessVisible=true"
								class="f-24 col-9 dis-flex flex-x-center flex-y-center"><text
									class="m-right12">查看更多</text><text class="iconfont icon-unfold"></text></view>
							<view v-else class="f-24 col-9 dis-flex flex-x-center flex-y-center">—— 暂无更多 ——
							</view>
						</view>
					</view>

				</block>
				<block v-else>
					<view></view>
				</block>
			</view>


			<!-- 购买须知 -->
			<view v-if="cEleForceHidden.buyKnow" class="module-title-w m-top20">{{text_diy.buy_notice}}
				<view class="select-nav-items">
					<image src="/static/images/br1.png" class="main-bg-color" mode=""></image>
				</view>
			</view>
			<view v-if="cEleForceHidden.buyKnow" class="goods-buy-tips module-content">
				<!-- <view class="tips-item">此券不在享受店内其他优惠</view>
				<view class="tips-item">此券不在享受店内其他优惠</view>
				<view class="tips-item">此券不在享受店内其他优惠</view>
				<view class="tips-item tips-important">此券不在享受店内其他优惠</view> -->
				<parse :html="byKnow" parse-only="byKnow"></parse>
			</view>

			<!-- 商品详情 -->
			<view class="goods-detail-nav dis-flex flex-dir-row flex-y-center flex-x-center">
				<view v-if="cEleForceHidden.goodsInfo" class="goods-detail-nav-item"
					:class="{'active':detailType === '1'}" @click="detailTypeChange('1')">{{text_diy.goods_detail}}
					<view class="select-nav-items" v-if="detailType === '1'">
						<image src="/static/images/br1.png" class="main-bg-color" mode=""></image>
					</view>
				</view>
				<view v-if="cEleForceHidden.evaluate" class="goods-detail-nav-item"
					:class="{'active':detailType === '2'}" @click="detailTypeChange('2')">{{text_diy.evaluate}}
					<view class="select-nav-items" v-if="detailType === '2'">
						<image src="/static/images/br1.png" class="main-bg-color" mode=""></image>
					</view>
				</view>
			</view>
			<view class="goods-detail module-content">
				<!-- 详情内容 -->
				<view class="goods-detail-content" v-show="cEleForceHidden.goodsInfo && detailType === '1'">
					<parse :html="content" parse-only="content"></parse>
					<!-- <u-parse :html="content"></u-parse> -->
				</view>

				<!-- 商品评价 -->
				<view class="goods-detail-evaluation" v-show="cEleForceHidden.evaluate && detailType === '2'">
					<block v-if="detail.comment_data && detail.comment_data.length > 0">
						<view class="evaluation-item" v-for="(item,index) in detail.comment_data" :key="index">
							<view class="evaluation-hd dis-flex flex-dir-row flex-y-center flex-x-between">
								<view class="evaluation-user dis-flex flex-dir-row flex-y-center">
									<image :src="item.user?item.user.avatarUrl:''" mode=""></image>
									<view class="evaluation-user-name">
										<view class="user-name f-24">{{ item.user?item.user.nickName:""}}</view>
										<view class="evaluation-time f-24 col-9">{{ item.create_time }}</view>
									</view>
								</view>
								<view class="evaluation-grade dis-flex flex-dir-row flex-y-center">
									<view class="iconfont icon-shoucangxiao select"
										v-for="(score,scoreIndex) in item.score" :key="scoreIndex"></view>
									<view class="iconfont icon-shoucangxiao"
										v-for="(score,scoreIndex) in (5 - item.score)" :key="scoreIndex"></view>
								</view>
							</view>
							<view class="evaluation-bd">
								<view class="evaluation-content f-26 col-9">{{item.content}}</view>
								<view class="evaluation-imgs" v-if="!!item.comment_image">
									<block v-for="(comment_image_item,index) in item.comment_image" :key="index">
										<image :src="!!comment_image_item?comment_image_item.file_path:''" mode="">
										</image>
									</block>
								</view>
							</view>
						</view>
						<view class="evaluation-all dis-flex flex-dir-row flex-y-center flex-x-center"
							@click="allComment(detail.goods_id)">
							<text>查看全部评价({{ detail.comment_data_count }})</text>
							<text class="iconfont icon-jinrujiantou1"></text>
						</view>
					</block>
					<block v-else>
						<view class="evaluation-all dis-flex flex-dir-row flex-y-center flex-x-center">
							<text>暂无评价</text>
						</view>
					</block>
				</view>
			</view>


			<!-- 价格说明 -->
			<view v-if="cEleForceHidden.priceDescription" class="module-title-w m-top20">价格说明
				<view class="select-nav-items">
					<image src="/static/images/br1.png" class="main-bg-color" mode=""></image>
				</view>
			</view>
			<view v-if="cEleForceHidden.priceDescription" class="price-des module-content-40">
				<view class="price-des-item">
					<text>划线价格:</text> 商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过的销售价等,并非原价,仅供参考
				</view>
				<view class="price-des-item">
					<text>未划线价格:</text> 商品的实时标价,不因表述的差异改变性质。具体成交价格根据商品参加活动,或会员使用有会员红包等发生变化,最终以订单结算页价格为准
				</view>
				<view class="price-des-item">
					商家详情页(含主图)以图片或文字形式标注的一口价、促销价、优惠价等价格可能是在使用红包、满减或特定优惠活动和时段等情形下的价格,具体请以结算页面的标价、优惠条件或活动规则为准
				</view>
				<view class="price-des-item">
					<text>此说明仅当出现价格时有效,若商家单独对划线价格进行说明的,以商家的表述为准 </text>
				</view>
			</view>
			<!-- <view style="width: 100%; position: fixed;bottom:100rpx;z-index: 100;">
				<view class="t-c f-24 onelist-hidden" style="background: #E6F7FF; color:#8BB9E9;padding: 10rpx 30rpx 10rpx 30rpx;">
					该商品预售中：现在下单，4月7日至4月10日发货
				</view>
			</view> -->
			<view>
				<block v-if="detail.transport_type===40">
					<view class="yushou" :class="{'yushou-ipx':isIphoneX}" v-if="expected_service">
						<view class="t-c f-24 onelist-hidden"
							style="background: #E6F7FF; color:#8BB9E9;padding: 10rpx 30rpx 10rpx 30rpx;">
							{{expected_service}}
						</view>
					</view>
				</block>
				<block>
					<view></view>
				</block>
			</view>

			<!-- 推荐购买 -->
			<view class="recommend-goods m-top20" :style="fxStatus?'margin-bottom:186rpx;':'margin-bottom:106rpx;'">
				<recommend-goods :recommendclass="RecommendClass" :goods-id="detail.goods_id"
					:bargain-id="detail.bargain_id"></recommend-goods>
			</view>

			<!-- 拼团去参团 -->
			<popup-view :show="showGoGroup && !!group_id" type="center" @clickmask="showGoGroup = false">
				<view class="groups-info padding-box">
					<view class="module-title-w m-top20">去参团
						<view class="select-nav-items">
							<image src="/static/images/br1.png" class="main-bg-color" mode=""></image>
						</view>
					</view>
					<view class="info-list-box">
						<view v-for="(groupsItem,groupsIndex) in groupsListInfo" :key="groupsIndex"
							class="info-list dis-flex flex-dir-row flex-y-center flex-x-between border-line border-bottom">
							<view class="dis-flex flex-dir-row flex-y-center flex-box">
								<image class="info-img" :src="groupsItem.avatarUrl" mode=""></image>
								<view class="f-28 col-3 flex-box onelist-hidden">{{groupsItem.nickName}}</view>
							</view>
							<view class="dis-flex flex-dir-row flex-y-center flex-x-between">
								<view class="desc dis-flex flex-dir-column">
									<text>还差<text class="text-danger">{{groupsItem.lastnumber}}</text>人成团</text>
									<text>剩余 {{groupsItem.overFormat}}</text>
								</view>
								<view class="go-group" @click="goGroupsJoin(groupsItem)">
									{{groupsItem.isSelf?"查看详情":"去拼团"}}</view>
							</view>
						</view>
					</view>
					<view class="close-btn" @click="showGoGroup = false"><text class="iconfont icon-roundclose"></text>
					</view>
				</view>
			</popup-view>
			<!-- 砍价说明弹窗 -->
			<popup-view :show="showBargainnfo && isBargain" type="center" @clickmask="showBargainnfo = false">
				<view class="bargain-info padding-box">
					<view :style="{'background-image':getImageRoot('51.png','url')}" class="m-top20 img-center">
						<text class="pos-center">玩法介绍</text>
					</view>
					<view class="info-list-box f-24 col-3">
						<parse :html="goodsRes && goodsRes.bargain_data &&goodsRes.bargain_data.explain" />
					</view>
					<view class="close-btn" @click="showBargainnfo = false"><text
							class="iconfont icon-roundclose"></text></view>
				</view>
			</popup-view>
			<!-- 底部菜单 -->
			<form @submit="saveFormId" report-submit="">

				<view class="goods-footer  border-line border-top" :class="[isIphoneX ?'footer-padding':'']">
					<view class="dis-flex flex-dir-row flex-x-around flex-y-center">
						<view class="dis-flex flex-y-center" style="width:60%;">
							<block v-for="(item,index) in footerBtns" :key="index">
								<view v-if="item.kf_type == 2" class="goods-footer-item dis-flex flex-dir-column flex-x-center p-r" @click="footerNav(item)">
									<image :src="item.image"></image>
									<view class="goods-footer-item-text" style="width: 106%;">{{item.input}}
										<block v-if="item.type==='5'&& dealer_tip && !item.notDealer">
											{{settingData.currency}}{{(detail.first_money)}}</block>
									</view>
								</view>
								<view v-else class="goods-footer-item dis-flex flex-dir-column flex-x-center p-r"
									@click="footerNav(item)" style="width: 33%;">
									<button class="btn-normal report-btn" form-type="submit"></button>
									<!-- #ifdef MP -->
									<button class="report-btn" open-type="contact" v-if="item.type === '1'"></button>
									<!-- #endif -->
									<!-- #ifdef MP-TOUTIAO -->
									<button class="report-btn" open-type="share" v-if="item.type === '4'"></button>
									<!-- #endif -->
									<image :src="item.image"></image>
									<view class="goods-footer-item-text" style="width: 106%;">{{item.input}}
										<block v-if="item.type==='5'&& dealer_tip && !item.notDealer">
											{{settingData.currency}}{{(detail.first_money)}}</block>
									</view>
								</view>
							</block>
						</view>
						<view class="goods-footer-item dis-flex flex-dir-column flex-y-center">
							<block v-if="cAppointmentCountDownData.is_open_sale === 1">
								<view class="groups-footer-btn p-r dis-flex flex-align-c">
									<button class="btn-normal btn-appointment"
										@click="handleBtnAppointmentCountDownClick">
										<view class="btn-appointment__text">
											<view class="iconfont is-inline icon-naozhong"></view>我要预约
										</view>
										<view class="btn-appointment__time">距开始 {{appointmentCountDownStr}}</view>
									</button>
								</view>
							</block>
							<block v-else-if="cAppointmentCountDownData.is_open_sale === 2">
								<view class="groups-footer-btn p-r dis-flex flex-align-c">
									<button class="btn-normal btn-appointment"
										@click="handleBtnAppointmentCountDownClick">
										<view class="btn-appointment__text">
											<view class="iconfont is-inline icon-naozhong"></view>预约成功
										</view>
										<view class="btn-appointment__time">距开始 {{appointmentCountDownStr}}</view>
									</button>
								</view>
							</block>
							<block v-else-if="detail.goods_status === 10">
								<view v-if="!group_id && !isBargain"
									class="groups-footer-btn p-r dis-flex flex-align-c">
									<!-- 活动开始预热，需要订阅 -->
									<block v-if="activityStatus.status === 0 && activityStatus.etLeftTime">
										<!-- #ifdef MP-WEIXIN -->
										<view v-if="!detail.subscribe"
											class="go-buy dis-flex flex-dir-column flex-y-center flex-x-center p-r flex-box notice_stock onelist-hidden"
											@click.stop="saveFormIdNotice">
											<text>订阅</text>
										</view>
										<view v-else
											class="go-buy dis-flex flex-dir-column flex-y-center flex-x-center p-r has_stock">
											<text>已订阅</text>
										</view>
										<!-- #endif-->
										<!-- #ifndef MP-WEIXIN -->
										<view
											class="go-buy dis-flex flex-dir-column flex-y-center flex-x-center p-r has_stock">
											<text>订阅</text>
										</view>
										<!-- #endif -->
									</block>
									<block v-else-if="activityStatus.status === 2">
										<view
											class="go-buy dis-flex flex-dir-column flex-y-center flex-x-center p-r has_stock">
											<text>{{ activityStatus.leftTime === 0 ? '已结束' : '已售罄' }}</text>
										</view>
									</block>
									<block v-else>
										<block v-if="has_stock">
											<view
												class="go-buy dis-flex flex-dir-column flex-y-center flex-x-center p-r has_stock">
												<text>已售罄</text>
											</view>
										</block>
										<block v-else>
											<view
												v-if="isTieredPriceGoods <= 0 && detail.transport_type != 60 && detail.sale_type === 0 && isOpenCard() && !isMeal && !isGift && isReservation!=1"
												@click="onToggleTrade('','addCart')"
												class="go-buy-cart dis-flex flex-dir-column flex-y-center flex-x-center p-r flex-box main-bg-color auxiliary-color onelist-hidden">
												<text style="width: 120rpx;">加入购物车</text>
												<button class="btn-normal report-btn" form-type="submit"></button>
											</view>
											<view
												class="go-buy dis-flex flex-dir-column flex-y-center flex-x-center p-r flex-box help-bg-color onelist-hidden"
												@click.stop="onToggleTrade"
												style="position:relative;overflow: visible;">
												<text>立即购买</text>
												<text v-if="cLimitBuyNum"
													style="margin-top: 10rpx;font-size: 20rpx;font-weight: lighter;">限购{{cLimitBuyNum}}件</text>
												<button class="btn-normal report-btn" form-type="submit"></button>
												<!-- 分享免单提示 -->
												<view v-if="cShareNum.visible" class="share-tip">
													<image v-if="cShareNum.avatar" class="share-tip_avatar"
														:src="cShareNum.avatar" mode="aspectFill"></image>
													<view v-if="cShareNum.nickname"
														class="share-tip__text share-tip__nickname">
														{{cShareNum.nickname}}</view>
													<view class="share-tip__text">还差{{cShareNum.num}}{{settingData.free.a_word||''}}免单成功</view>
												</view>
												<!-- 分享免单提示 end -->
											</view>
										</block>
									</block>
								</view>
								<view v-if="!!group_id" class="groups-footer-btn dis-flex flex-dir-row"
									:class="{'has_stock':has_stock}">
									<block v-if="has_stock">
										<view
											class="go-buy dis-flex flex-dir-column flex-y-center flex-x-center p-r help-bg-color auxiliary-color">
											<text>暂无库存</text>
										</view>
									</block>
									<block v-else>
										<view
											class="go-buy dis-flex flex-dir-column flex-y-center flex-x-center p-r has_dealer help-bg-color"
											@click="isGroupToggleTrade('1')">
											<text style="margin-bottom: 5upx;"
												v-if="$min_price">{{settingData.currency}}{{$min_price}}</text>
											<text class="auxiliary-color">直接购买</text>
											<button class="btn-normal report-btn" form-type="submit"></button>
										</view>
										<view @click="isGroupToggleTrade('2')"
											:class="{'groups-end' : activityStatus.status === 1 }"
											class="p-r go-groups groups-start dis-flex flex-dir-column flex-y-center flex-x-center main-bg-color ">
											<text style="margin-bottom: 5upx;"
												class="auxiliary-color">{{settingData.currency}}{{$groups_price}}</text>
											<text class="auxiliary-color">{{groupData.join_num}}人团</text>
											<button class="btn-normal report-btn" form-type="submit"></button>
										</view>
									</block>
								</view>
								<view v-if="isBargain" class="bargain-footer-btn dis-flex flex-dir-row"
									:class="{'has_stock':has_stock}">
									<block v-if="has_stock">
										<view class="go-buy dis-flex flex-dir-column flex-y-center flex-x-center p-r">
											<text>暂无库存</text>
										</view>
									</block>
									<block v-else>
										<view
											class="go-buy dis-flex flex-dir-column flex-y-center flex-x-center p-r has_dealer main-bg-color auxiliary-color"
											@click="onToggleTrade(false)">
											<text style="margin-bottom: 5upx;"
												v-if="$min_price">{{settingData.currency}}{{$min_price}}</text>
											<text>{{settingData.currency}}{{detail.goods_min_price}}购买</text>
											<button class="btn-normal report-btn" form-type="submit"></button>
										</view>
										<view @click="isBargainToggleTrade"
											class="p-r go-groups groups-start dis-flex flex-dir-column flex-y-center flex-x-center help-bg-color"
											:class="{'groups-end' : activityStatus.status !== 1}">
											<text>{{settingData.currency}}{{bargain_data.low_price}}砍价</text>
											<button class="btn-normal report-btn" form-type="submit"></button>
										</view>
									</block>
								</view>
							</block>
							<block v-else>
								<view class="groups-footer-btn p-r dis-flex flex-align-c">
									<view
										class="go-buy dis-flex flex-dir-column flex-y-center flex-x-center p-r has_stock">
										<text>已下架</text>
									</view>
								</view>
							</block>
						</view>
					</view>
				</view>
			</form>
		</view>
		<!-- 分销佣金 -->
		<view class="dealer-bonus t-c" v-if="isShowDealerTip && dealer_tip && dealer_diy === '2'"
			@click="isShare('dealer')" :style="{'background-image':getImageRoot('59.png', 'url')}">
			<view class="iconfont icon-roundclosefill" @click.stop="isShowDealerTip = false"></view>
			<view class="dealer-income">
				<view class="dealer-text">{{dealerDiyFont.commission}}</view>
				<view class="dis-flex flex-y-line flex-x-center">返¥<view class="f-36">{{detail.first_money}}</view>
				</view>
			</view>
			<view class="dealer-share-text f-28 col-f">{{dealerDiyFont.buy_commission}}</view>
			<view class="click-share dis-flex flex-x-center flex-y-center">
				<view class="f-28">点击分享</view>
				<view class="click-share-icon"></view>
			</view>
			<!-- #ifdef MP-TOUTIAO || MP-ALIPAY -->
			<button class="report-btn" open-type="share"></button>
			<!-- #endif -->
		</view>
		<view class="add-suspension-right dis-flex">
			<view style="flex-direction: column;">
				<!-- 素材推广 -->
				<view class="add-extend dis-flex flex-x-center flex-y-center" v-if="dealer_tip && user_is_dealer"
					@click="toSpread">
					<image src="/static/images/goods/sucaituiguang.png" class="cart-icon"></image>
				</view>
				<view class="add-cart dis-flex flex-x-center flex-y-center"
					v-if="detail.sale_type === 0 && isOpenCard()">
					<!-- 加入购物车 -->
					<view style="position: relative;" @click="footerNav({type:'cart'})">
						<view class="cart-num">{{cart_total_num}}</view>
						<image src="/static/images/goods/cart.png" class="cart-icon"></image>
					</view>
				</view>
			</view>
		</view>

		<view class="dis-flex  flex-y-center flex-x-around col-f bor-radius-10 f-x-part"
			:style="{'background-image':getImageRoot('73.png','url'),'bottom':isIphoneX?'196rpx':'146rpx','margin-top':'50rpx;'}"
			v-if="fxStatus && !user_is_dealer && dealer_basic.show_join_or_not=='1' && detail.is_distribution ==1">
			<view class="iconfont icon-roundclose " style="font-size: 42rpx;width: 5%;margin-left: 10rpx;"
				@click="fxStatus=false"></view>
			<view class="" style="width: 63%;">
				<view class="f-w f-28 dis-flex  flex-y-center">
					<image src="../../../../static/images/goods/point.png" mode="widthFix" style="width: 40rpx;">
					</image>
					{{dealer_basic.in_join_title}}
				</view>
				<view class="f-24 dis-flex  flex-y-center">
					<image src="../../../../static/images/goods/point.png" mode="widthFix" style="width: 40rpx;">
					</image>
					{{cMoney}}
				</view>
			</view>
			<view class="btn  f-24 f-w " @click="jumpToApply">立即加入</view>
		</view>
		<!-- 购买菜单 -->
		<GoodsBuyMenu ref="goodsBuyMenu" @submit="goodsSubmit" :goods-detail="detail" :pGoodSkuId="goods_sku_id"
			:goods-spec="specData" :goods-activity="goodsActivity" :spec-disabled="isSpecDisabled"
			:group-buy-type="group_buy_type" @on-active-sku-change="handleActiveSkuChange" :rebatePrice="cRebatePrice" :appointmentCountDownStr="cAppointmentCountDownData.is_open_sale ? appointmentCountDownStr : ''" @on-btn-appointment-click="handleBtnAppointmentCountDownClick" :booked="cAppointmentCountDownData.is_open_sale === 2">
		</GoodsBuyMenu>
		<!-- 分享菜单 -->
		<ShareView ref="shareView" :pid="detail.goods_id" :goodsId="detail.goods_id" :activity-data="activityData" :poster-type="'goods'">
		</ShareView>
		<!-- 返回顶部 -->
		<GoTopBtn :page-scroll="pageScroll"></GoTopBtn>

		<!-- 顶部已售罄商品内容 -->
		<block v-if="detail.sku_count === 0">
			<HasbeenSoldout :goods-id="detail.goods_id" :top-popup="showTopPopup" @isshowTopPopup="isshowTP">
			</HasbeenSoldout>
		</block>
		<!-- 快捷导航 -->
		<!-- <shortcut id=""></shortcut> -->

		<!-- 关注公众号二维码弹窗 -->
		<!-- #ifdef MP-WEIXIN -->
		<popup-view :show="followGzhPopupVisible" type="center" @clickmask="followGzhPopupVisible = false">
			<view class="follow-gzh-sapp-card">
				<view class="follow-gzh-sapp-card__content">
					<image class="follow-gzh-sapp-card__img" :src="getImageRoot('img-follow-wx.png')"></image>
				</view>
				<button class="follow-gzh-sapp-card__btn btn-normal" open-type="contact"
					:send-message-path="cSendMessage.path" :send-message-title="cSendMessage.title"
					:send-message-img="cSendMessage.img" show-message-card>去关注</button>
			</view>

		</popup-view>
		<!-- #endif -->
		<!-- 关注公众号二维码弹窗 end -->

		<!-- 关注公众号二维码弹窗 -->
		<!-- #ifdef H5 -->
		<popup-view :show="followGzhPopupVisible" type="bottom" @clickmask="followGzhPopupVisible = false">
			<view class="follow-gzh-card">
				<view class="follow-gzh-card-content">
					<image class="follow-gzh-card__img-code" :src="goodsRes.detail && goodsRes.detail.wechat_image" />
					<p class="follow-gzh-card__tip">为了方便您查找订单，请扫码购买。</p>
				</view>
				<view class="follow-gzh-card-footer">
					<button class="btn-normal follow-gzh-card__btn-cancel"
						@click="followGzhPopupVisible = false">取消</button>
				</view>
			</view>
		</popup-view>
		<!-- #endif -->
		<!-- 关注公众号二维码弹窗 end -->

		<!-- 音乐播放组件 -->
		<AudioIcon v-if="detail.music" v-model="audioStatus" :src="detail.music"
			styleStr="position: fixed;right: 30rpx;top: 200rpx;z-index: 5;"></AudioIcon>
		<!-- 音乐播放组件 -->

		<!-- 预约成功的提示 -->
		<popup-view :show="appointmentSuccessPopupVisible" type="center" :overlay="false">
			<view class="appointment-success-card">
				<view class="appointment-success-card__title">
					<view class="iconfont icon-chenggong1 is-inline"></view>预约成功
				</view>
				<view class="appointment-success-card__text">将在开抢前10分钟前提醒，</view>
				<view class="appointment-success-card__text">请做好开抢准备哦~</view>
			</view>
		</popup-view>
		<!-- 预约成功的提示 end -->

		<!-- 待支付订单提醒 -->
		<popup-view :show="orderToBePaidPopupVisible" type="center" @clickmask="orderToBePaidPopupVisible = false">
			<view class="order-to-be-paid" :style="{'background-image':getImageRoot('bg-order-to-be-paid.png','url')}">
				<view class="order-to-be-paid__title">待支付订单</view>
				<view class="order-to-be-paid__desc">您有一笔订单尚未支付</view>
				<view class="order-to-be-paid__desc">
					请在{{orderNotPaidRes && orderNotPaidRes.tip && orderNotPaidRes.tip.tip || '--'}}分钟内完成支付哦~</view>
				<view class="order-to-be-paid__btns">
					<button class="btn-normal order-to-be-paid__btn is-outline"
						@click="handleBtnOrderToBePaidCancelClick">取消订单</button>
					<button class="btn-normal order-to-be-paid__btn"
						@click="navigationTo('pages/mainPages/order/index?type=payment')">立即支付</button>
				</view>
				<!-- 关闭按钮 -->
				<view class="btn-close">
					<view class="iconfont icon-roundclose" @click="orderToBePaidPopupVisible = false"></view>
				</view>
				<!-- 关闭按钮 end -->
			</view>
		</popup-view>
		<!-- 待支付订单提醒 end -->
		<!-- 优惠券领取成功弹窗 -->
		<popup-view :show="couponReceivedPopupVisible" type="center" @clickmask="couponReceivedPopupVisible = false">
			<view class="coupon-received-card"
				:style="{'background-image':getImageRoot('bg-successful-claim.png','url')}">
				<view class="coupon-received-card__title">恭喜您，领取成功！</view>
				<view class="coupon-received-card__price"><text class="is-sup">￥</text><text
						class="is-strong price-font-family">{{couponReceivedObj.couponPrice}}</text></view>
				<view class="coupon-received-card__condition">{{couponReceivedObj.couponCondition}}</view>
				<view class="coupon-received-card__tip">{{couponReceivedObj.title}}</view>
				<button class="btn-normal coupon-received-card__btn"
					@click="couponReceivedPopupVisible = false">确定</button>
				<!-- 关闭按钮 -->
				<view class="btn-close">
					<view class="iconfont icon-roundclose" @click="couponReceivedPopupVisible = false"></view>
				</view>
				<!-- 关闭按钮 end -->
			</view>
		</popup-view>
		<!-- 优惠券领取成功弹窗 end -->

		<!-- 会员开通弹窗 -->
		<popup-view :show="openMemberPopupVisible" type="center" @clickmask="openMemberPopupVisible = false">
			<view class="open-member-card">
				<image class="open-member-card__img-avatar" :src="userInfo.avatarUrl"></image>
				<view class="open-member-card__nickname">你好，{{userInfo.nickName}}</view>
				<view class="open-member-card__title">您未开通会员卡，请开通后领取</view>
				<image class="open-member-card__img-member" src="../static/images/img-gold-medal.png"></image>
				<button class="open-member-card__btn-confirm btn-normal"
					@click="navigationTo('pages/subPages/member/index/index')">立即开通</button>
				<view class="open-member-card__btn-cancel" @click="openMemberPopupVisible = false">取消</view>
			</view>
		</popup-view>
		<!-- 会员开通弹窗 end -->
		<!-- 会员购买提示弹窗 -->
		<popup-view :show="memberBuyPopupVisible" type="center" @clickmask="memberBuyPopupVisible = false">
			<view class="open-member-card">
				<image class="open-member-card__img-avatar" :src="userInfo.avatarUrl"></image>
				<view class="open-member-card__nickname">{{userInfo.nickName}}</view>
				<view class="open-member-card__title">此商品为{{mainMixin_memberInfo.card_title || '会员'}}专属商品，请开通会员后购买
				</view>
				<image class="open-member-card__img-member" src="../static/images/img-gold-medal.png"></image>
				<button class="open-member-card__btn-confirm btn-normal"
					@click="navigationTo('pages/subPages/member/index/index')">立即开通</button>
				<view class="open-member-card__btn-cancel" @click="memberBuyPopupVisible = false">取消</view>
			</view>
		</popup-view>
		<!-- 会员购买提示弹窗 end -->
		<page-loading ref="loading"></page-loading>
		<DistributorFixed></DistributorFixed>
		<!-- 电话列表弹窗 -->
		<popup-view :show="phoneListPopupVisible" type="center" @clickmask="phoneListPopupVisible = false" @touchmove.stop.prevent>
			<view class="phone-list-card">
				<!-- header -->
				<view class="phone-list-card__header">
					<view class="phone-list-card__title">拨打电话</view>
				</view>
				<!-- header end -->
				<!-- scroll -->
				<scroll-view scroll-y="true" style="max-height: 50vh;">
					<view>
						<view class="phone-list-card__subtitle">拨打电话</view>
						<!-- 商家列表 -->
						<view v-for="item in businessList" class="phone-item">
							<view class="phone-item__center">
								<view class="phone-item__title">{{item.name}}</view>
								<view class="phone-item__text">{{item.address}}</view>
							</view>
							<view class="phone-item__right">
								<image class="phone-item__img-phone" src="../static/images/icon-phone-round.png" mode="" @click="storeMobile(item.mobile)"></image>
							</view>
						</view>
						<!-- 商家列表 end -->
					</view>
				</scroll-view>
				<!-- scroll end -->
				<!-- gutter -->
				<view class="phone-list-card__gutter"></view>
				<!-- gutter end -->
				<!-- 平台电话 -->
				<view class="phone-platform">
					<view class="phone-platform__left">
						<image class="phone-platform__icon-logo" src="../static/images/icon-phone-yellow.png" mode=""></image>
					</view>
					<view class="phone-platform__center">联系平台</view>
					<view class="phone-platform__right">
						<image class="phone-platform__icon-phone" src="../static/images/icon-phone-round.png" mode="" @click="storeMobile(settingData.kf_phone)"></image>
					</view>
				</view>
				<!-- 平台电话 end -->
			</view>
		</popup-view>
		<!-- 电话列表弹窗 end -->
		<!-- 同城配送弹窗 -->
		<popup-view :show="cityBuyPopupVisible" type="center" @clickmask="cityBuyPopupVisible = false">
			<view class="order-to-be-paid" style="height: 338rpx;">
				<view class="order-to-be-paid__desc" style="font-size: 32rpx;margin-top: 60rpx;">当前门店起送价为{{detail.start_price}}元，</view>
				<view class="order-to-be-paid__desc" style="font-size: 32rpx;margin-top: 60rpx;">是否进入门店增购后下单？ </view>
				<view class="order-to-be-paid__btns">
					<button style="height: 80rpx; border-radius: 10rpx;border-width: 1px;" class="btn-normal order-to-be-paid__btn is-outline"
						@click="cityBuyPopupVisible = false">取消</button>
					<button style="height: 80rpx; border-radius: 10rpx;" class="btn-normal order-to-be-paid__btn"
						@click="handleBtnStatPrice">需要增量</button>
				</view>
			</view>
		</popup-view>
		<!-- 同城配送弹窗 end -->
		<!-- #ifdef H5 -->
		<FollowImgPopup v-if="settingData && settingData.qzgz" :visible="settingData.qzgz.indexOf('goodsdetail') !== -1" :imgUrl="detail && detail.qzgz_logo || ''"></FollowImgPopup>
		<!-- #endif -->
		<!-- 礼包查看详情弹窗 -->
		<OpenPopup v-model="openPopupVisible" :codeItem="openPopupTarget" type="gift"></OpenPopup>
		<!-- 礼包查看详情弹窗 end -->
	</view>
</template>

<script>
	import OpenPopup from '../components/OpenPopup.vue'
	import RecommendGoods from '@/components/template/RecommendGoods.vue'
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	import shortcut from '@/components/template/ShortCut.vue'
	import PopupView from '@/components/template/PopManager.vue'
	import GoTopBtn from '@/components/template/GoTopBtn.vue'
	import ShareView from '@/components/template/ShareView.vue'
	import DiyVideo from '@/components/page/pageComponents/Video.vue'
	import HasbeenSoldout from '@/components/template/HasbeenSoldout.vue'
	import StoreNav from '@/components/template/StoreNav.vue'
	import GoodsBuyMenu from '@/components/template/GoodsBuyMenu.vue'
	import CountDown from '@/components/template/CountDown.vue'
	import Methods from '@/pages/subPages/goods/index/methods.js'
	import PopupLayer from '@/components/template/PopLayer.vue'
	import AudioIcon from '@/components/page/pageComponents/AudioIcon.vue'
	import TieredPricing from '@/components/template/TieredPricing.vue'
	import DistributorFixed from '@/components/page/pageComponents/DistributorFixed.vue'
	// #ifdef H5
	import FollowImgPopup from '@/components/page/pageComponents/FollowImgPopup.vue'
	// #endif


	export default {
		components: {
			OpenPopup,
			Parse,
			PopupView,
			shortcut,
			RecommendGoods,
			GoTopBtn,
			ShareView,
			DiyVideo,
			HasbeenSoldout,
			StoreNav,
			GoodsBuyMenu,
			CountDown,
			PopupLayer,
			AudioIcon,
			TieredPricing,
			DistributorFixed,
			// #ifdef H5
			FollowImgPopup
			// #endif
		},
		...Methods
	}
</script>

<style lang="scss">
	@import "index.scss";
	@import "groups.css";
	@import "bargain.scss";

	.yushou {
		width: 100%;
		position: fixed;
		bottom: 100rpx;
		z-index: 100;

		&.yushou-ipx {
			bottom: calc(100rpx + 40rpx);
		}
	}

	.f-x-part {
		position: fixed;
		width: 95%;
		height: 106rpx;
		left: 2.5%;
		bottom: 156rpx;
		z-index: 100;
		// background-image: url();
		background-size: 100% 100%;

		.btn {
			background-color: #FDD4D9;
			color: #DA5E5A;
			border-radius: 10rpx;
			padding: 15rpx 36rpx;
			margin-right: 10rpx;

		}
	}

	// 关注公众号二维码弹窗
	.follow-gzh-card {
		width: 100vw;
		border-radius: 20rpx 20rpx 0 0;
		background-color: #fff;
	}

	.follow-gzh-card-content {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 398rpx;
	}

	.follow-gzh-card__img-code {
		width: 250rpx;
		height: 250rpx;
	}

	.follow-gzh-card-footer {
		box-sizing: 105rpx;
		border-top: 20rpx solid #F8F8F8;
	}

	.follow-gzh-card__tip {
		font-size: 28rpx;
		color: #333333;
	}

	.follow-gzh-card__btn-cancel {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 85rpx;
		font-weight: bold;
		color: #333333;
		font-size: 32rpx;
	}

	// 关注公众号二维码弹窗 end
	// 关注公众号二维码弹窗(小程序)
	.follow-gzh-sapp-card__content {
		box-sizing: border-box;
		width: 530rpx;
		height: 734rpx;
		padding: 30rpx 50rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.follow-gzh-sapp-card__img {
		width: 416rpx;
		height: 671rpx;
	}

	.follow-gzh-sapp-card__btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 70rpx;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: var(--auxiliary-color, #333);
		font-weight: bold;
		background-color: var(--theme-color, #FFD940);
		border-radius: 10rpx;
	}

	// 关注公众号二维码弹窗(小程序) end
	// 预约按钮
	.btn-appointment {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		width: 100%;
		font-weight: bold;
		background-color: var(--theme-color, #FFD940);
		color: var(--auxiliary-color, #fff);
		border-radius: 8rpx;
	}

	.btn-appointment__text {

		&,
		.iconfont {
			font-size: 28rpx;
		}

		.iconfont {
			margin-right: 8rpx;
		}
	}

	.btn-appointment__time {
		font-size: 24rpx;
	}

	// 预约按钮
	// 预约成功提示
	.appointment-success-card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 480rpx;
		min-height: 250rpx;
		padding: 32rpx;
		text-align: center;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.appointment-success-card__title {
		margin-bottom: 16rpx;

		&,
		.iconfont {
			font-weight: bold;
			font-size: 36rpx;
		}

		.iconfont {
			margin-right: 8rpx;
			font-size: 42rpx;
		}
	}

	.appointment-success-card__text {
		font-size: 28rpx;
	}

	// 预约成功提示 end
	// 待支付订单
	.order-to-be-paid {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		width: 524rpx;
		padding: 30rpx 22rpx;
		padding-top: 0;
		min-height: 391rpx;
		background-color: #fff;
		border-radius: 20rpx;
		background-size: contain;
		background-repeat: no-repeat;
	}

	.order-to-be-paid__title {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100rpx;
		margin-bottom: 50rpx;
		font-weight: bold;
		font-size: 36rpx;
		color: #333;
		text-align: center;
	}

	.order-to-be-paid__desc {
		font-size: 28rpx;
		color: #333;
		text-align: center;
	}

	.order-to-be-paid__btns {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: auto;
	}

	.order-to-be-paid__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		height: 70rpx;
		width: 225rpx;
		font-size: 26rpx;
		color: #333;
		background-color: #FFD940;

		&.is-outline {
			background-color: transparent;
			border: 1px solid #ccc;
		}
	}

	// 待支付订单 end
	// 优惠券领取成功弹窗
	.coupon-received-card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		position: relative;
		width: 524rpx;
		height: 533rpx;
		padding: 40rpx;
		padding-top: 76rpx;
		left: 0;
		top: 0;
		background-size: cover;
		background-repeat: no-repeat;
	}

	.btn-close {
		position: absolute;
		bottom: -106rpx;
		left: 50%;
		transform: translateX(-50%);

		.iconfont {
			font-size: 60rpx;
			color: #fff;
		}

		// &::after {
		// 	position: absolute;
		// 	left: 50%;
		// 	bottom: 99%;
		// 	transform: translateX(-50%);
		// 	display: block;
		// 	content: "\20";
		// 	width: 1px;
		// 	height: 54rpx;
		// 	background-color: #fff;
		// }
	}

	.coupon-received-card__title {
		display: flex;
		align-items: center;
		justify-content: center;
		align-self: center;
		font-size: 24rpx;
		color: #CA982B;
		font-weight: 500;
		// &::before,&::after {
		// 	display: block;
		// 	content: "\20";
		// 	height: 1px;
		// 	width: 32rpx;
		// 	background-color: #F7EAC4;
		// }
		// &::before {
		// 	margin-right: 16rpx;
		// }
		// &::after {
		// 	margin-left: 8rpx;
		// }
	}

	.coupon-received-card__price {
		margin-top: 26rpx;
		font-weight: bold;
		color: #A65501;
		line-height: 1;
		text-align: center;

		.is-sup {
			position: relative;
			top: -20rpx;
			font-size: 24rpx;
			// vertical-align: super;
			// transform: translateY(-40rpx);
		}

		.is-strong {
			font-size: 64rpx;
		}
	}

	.coupon-received-card__condition {
		margin-top: 26rpx;
		color: #CA982B;
		font-size: 28rpx;
		text-align: center;
	}

	.coupon-received-card__tip {
		margin-top: auto;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
	}

	.coupon-received-card__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		align-self: center;
		width: 390rpx;
		height: 80rpx;
		margin-top: 32rpx;
		font-size: 28rpx;
		color: #C9811D;
		font-weight: bold;
		background-color: #FFFCE4;
		border-radius: 40rpx;
	}

	// 优惠券领取成功弹窗 end
	// 下架时间
	.off-shelf-card {
		box-sizing: border-box;
		display: flex;
		height: 90rpx;
	}

	.off-shelf-card__left {
		box-sizing: border-box;
		flex: 1;
		padding: 0 30rpx;
		background-color: #FF4444;
	}

	.off-shelf-card__right {
		width: 246rpx;
		background-color: #FFF1F1;
	}

	.off-shelf-card__price {
		color: #fff;
		font-size: 24rpx;
		line-height: 90rpx;

		.is-strong {
			font-weight: bold;
			font-size: 38rpx;
		}
	}

	.off-shelf-card__right {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.off-shelf-card__title {
		font-size: 20rpx;
		color: #333;
	}

	.off-shelf-time {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 8rpx;
	}

	.off-shelf-time__item {
		color: #fff;
		font-size: 20rpx;

		&.is-num {
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 32rpx;
			height: 40rpx;
			padding: 0 4rpx;
			color: #FE504F;
			font-size: 22rpx;
			border-radius: 8rpx;
			background-color: #fff;
		}

		&+& {
			margin-left: 8rpx;
		}
	}

	// 下架时间 end
	.ad-wrapper {
		background-color: #fff;
		padding: 20rpx 0;
	}

	.ad-wrapper__image {
		display: block;
		width: 690rpx;
		height: 150rpx;
		max-width: 100%;
		margin: 0 auto;
		border-radius: 20rpx;
	}

	// 会员开通弹窗
	.open-member-card {
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 630rpx;
		min-height: 712rpx;
		padding: 30rpx 60rpx;
		padding-top: 100rpx;
		background-image: url(../static/images/bg-open-member-card.png);
		background-repeat: no-repeat;
		background-size: 630rpx 100%;
	}

	.open-member-card__img-member {
		margin-top: 52rpx;
		width: 155rpx;
		height: 182rpx;
	}

	.open-member-card__img-avatar {
		position: absolute;
		left: 50%;
		top: 0;
		width: 160rpx;
		height: 160rpx;
		border-radius: 100%;
		transform: translate(-50%, -50%);
	}

	.open-member-card__nickname {
		color: #A8A39D;
		font-size: 30rpx;
	}

	.open-member-card__title {
		margin-top: 32rpx;
		color: #F2D0A5;
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
	}

	.open-member-card__btn-confirm {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 500rpx;
		height: 94rpx;
		margin-top: 54rpx;
		color: #3A3D48;
		font-size: 32rpx;
		font-weight: bold;
		background-color: #F2D0A5;
		border-radius: 20rpx;
	}

	.open-member-card__btn-cancel {
		margin-top: 24rpx;
		color: #A8A39D;
		font-size: 28rpx;
	}

	// 会员开通弹窗 end
</style>

<style lang="scss" scoped>
	// 分享免单提示
	.share-tip {
		position: absolute;
		right: 0;
		bottom: 110rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60rpx;
		padding-left: 12rpx;
		padding-right: 28rpx;
		background-color: rgba($color: #000000, $alpha: 0.7);
		border-radius: 9999rpx;
		font-size: 24rpx;
		color: #fff;

		&::after {
			position: absolute;
			left: 50%;
			top: 100%;
			display: block;
			content: "\20";
			width: 0;
			height: 0;
			border-left: 10rpx solid transparent;
			border-right: 10rpx solid transparent;
			border-top: 10rpx solid rgba($color: #000000, $alpha: 0.7);
			transform: translateX(-50%);
		}
	}

	.share-tip_avatar {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
		border-radius: 50%;
	}

	.share-tip__text {
		position: relative;
		white-space: nowrap;

		&+& {
			padding-left: 20rpx;

			&::after {
				position: absolute;
				top: 50%;
				left: 10rpx;
				display: block;
				content: "\20";
				width: 1px;
				height: 20rpx;
				background-color: #828282;
				transform: translateY(-50%);
			}
		}
	}

	.share-tip__nickname {
		max-width: 6em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	// 分享免单提示 end
	// 电话列表弹窗
	.phone-list-card {
		box-sizing: border-box;
		padding: 0 40rpx;
		background-color: #fff;
		border-radius: 20rpx;
		width: 600rpx;
		
	}
	.phone-list-card__header {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 130rpx;
	}
	.phone-list-card__title {
		position: relative;
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
		z-index: 0;
		&::before {
			position: absolute;
			content: "\20";
			height: 20rpx;
			background-color: #FFD940;
			left: -4rpx;
			right: -4rpx;
			bottom: 0;
			z-index: -1;
		}
	}
	.phone-list-card__subtitle {
		font-size: 28rpx;
		color: #333;
	}
	.phone-item {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding: 30rpx 0;
		&+& {
			border-top: 1px solid #eee;
		}
	}
	.phone-item__center {
		flex: 1;
		min-width: 0;
	}
	.phone-item__title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.phone-item__text {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.phone-item__right {
		margin-left: 40rpx;
	}
	.phone-item__img-phone {
		width: 60rpx;
		height: 60rpx;
	}
	.phone-list-card__gutter {
		box-sizing: border-box;
		height: 20rpx;
		margin: 0 -40rpx;
		background-color: #F8F8F8;
	}
	.phone-platform {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 110rpx;
	}
	.phone-platform__icon-logo {
		width: 50rpx;
		height: 50rpx;
	}
	.phone-platform__center {
		flex: 1;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-left: 20rpx;
	}
	.phone-platform__icon-phone {
		width: 60rpx;
		height: 60rpx;
	}
	.phone-platform__right {
		margin-left: 20rpx;
	}
	// 电话列表弹窗 end
	// 礼包商品
	.gift-goods-card {
		&+& {
			margin-top: 20rpx;
		}
		box-shadow: 0 0 15rpx #D1D1D1;
	}
	.gift-goods-card__img {
		width: 200rpx;
		height: 200rpx;
		border-radius: 20rpx;
		font-size: 0;
	}
	.gift-goods-card__title {
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	.gift-goods-card__atts-wrapper {
		position: relative;
		width: 430rpx;
		height: 90rpx;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.gift-goods-card__label-pay {
		position: absolute;
		left: 0;
		bottom: 100%;
		transform: translateY(8rpx);
		box-sizing: border-box;
		height: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 10rpx;
		font-size: 20rpx;
		color: #333;
		border-radius: 6rpx;
		background: linear-gradient(91deg, #FED900 0%, #FABD00 100%);
		&::after {
			position: absolute;
			left: 50%;
			top: 100%;
			transform: translateX(-50%);
			display: block;
			content: "\20";
			width: 0;
			height: 0;
			border-top: 8rpx solid #FCCD00;
			border-right: 8rpx solid transparent;
			border-left: 8rpx solid transparent;
		}
	}
	.gift-goods-card__label-save {
		position: absolute;
		right: 0;
		bottom: 100%;
		transform: translateY(8rpx);
		box-sizing: border-box;
		height: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 10rpx;
		font-size: 20rpx;
		color: #fff;
		border-radius: 6rpx;
		background: linear-gradient(91deg, #F78C32 0%, #F94E1D 100%);
		&::after {
			position: absolute;
			left: 50%;
			top: 100%;
			transform: translateX(-50%);
			display: block;
			content: "\20";
			width: 0;
			height: 0;
			border-top: 8rpx solid #F86D27;
			border-right: 8rpx solid transparent;
			border-left: 8rpx solid transparent;
		}
	}
	// 礼包商品
</style>
