<template>
	<view :style="themeColor">
		<view v-if="isData" class="active-father">
			<view class="activity-header" :style="{'background-image':'url('+((data['image_img'] && data['image_img'].length>0)? (data['image_img'][0]['file_path']):'')+')'} ">
				<view class="activity-like t-c f-24" v-if="data.luck_is_see === 1"><text class="iconfont icon-like"></text>{{data['luck_like']}}人喜欢</view>
				<!-- 新增详情页面弹幕 -->
				<view class="bullent" v-if="joinPerson.length>0" v-show="showTips">
					
					<!-- <view  :class="animate?'marquee_top':''" v-if="data['get_code_note']['length']>1"> -->
					<!-- <view  :class="animate?'marquee_top':''" >
						 <view v-for="(item,index) in joinPerson" :key="index" class="swiper_item">
							 <view class="bullentOne">
							 	<view class="bullentImg" :style="{'background-image': 'url('+item.avatarUrl+');'}">
							 	</view>
							 	<view class="">
							 		<text style="font-size: 24rpx;">{{item.note}}</text>
							 	</view>
							 </view>
						 </view>

					</view> -->
					<!-- 弹幕 -->
					<view class="" >
						<view class="bullentOne " >
							<image class="bullentImg" :src="joinPerson[tipsIndex] ? joinPerson[tipsIndex].avatarUrl : ''"></image>
							<view class="">
								<text style="font-size: 24rpx;">{{joinPerson[tipsIndex]?joinPerson[tipsIndex].note:""}}</text>
							</view>
						</view>
					</view>
					<!-- <view class="" v-else>
						<view class="bullentOne">
							<view class="bullentImg" :style="{'background-image': 'url('+data['get_code_note'][0]['avatarUrl']+');'}">
							</view>
							<view class="">
								<text >{{data['get_code_note'][0]['note']}}</text>
							</view>
						</view>
					</view> -->
					
					
				</view>
			</view>
			<view class="activity-content padding-box-all b-f m-btm20">
				<!-- 活动内容 -->

				<view class="activity-title f-32 col-3 twolist-hidden dis-flex ">
					 <text class="title-label backColor " v-if="period_id!=0">第{{period_id}}期</text>
					 <text v-else>{{data['luck_tag']}}</text>
					 <text> {{data['luck_title']}}</text>

				</view>
				<view class="" style="display: flex;justify-content: space-between;margin: 10rpx 0;" >
					<view class="activity-price f-28 ">价值 {{settingData.currency}}
					<text class="priceHead" style="margin-right: 15rpx;font-size: 36rpx;">{{data['luck_price']}}</text></view>
					<view class="activity-price f-28 ">
						<text>共{{data['luck_count']}}份奖品</text>
					</view>
				</view>
				<view class="activity-rule dis-flex flex-x-between m-btm40">
					<view class="" style="padding: 6rpx 0;">
						<block v-if="data['luck_mode'] === 1 && !periodsState">
							<view class=""><text>{{data['luck_begin_time']}}自动开奖</text></view>
						</block>
						<block v-if="data['luck_mode'] === 1 && periodsState">
							<view class=""><text>{{periodsData.lottery_time | timeChange}}自动开奖</text></view>
						</block>
						<block v-if="data['luck_mode'] === 2">
							<view class=""><text>人数满{{data['luck_begin_number']}}人自动开奖</text></view>
						</block>
						<block v-if="data['luck_mode'] === 3">
							<view class=""><text>手动开奖</text></view>
						</block>
					</view>
					<!-- #ifdef MP-WEIXIN -->
					<view class="">
						<view class="remind"  @click="NewNubscribeDraw" v-if="(!periodsState && data['luck_state']===3 && data['subscribe_start']===0) || (periodsState && data['subscribe_start']===0 && periodsData.period_state===3 )">
							<text style="font-size: 22rpx;">抽奖开始提醒</text>
						</view>
						<view class="remind" @click="NewNubscribeDraw" v-else-if="(!periodsState && data['luck_state']===2 && data['subscribe_open']===0) || (periodsState && data['subscribe_open']===0 && periodsData.period_state===2 )">
							<text style="font-size: 22rpx;">开奖结果通知</text>
						</view>
						<view class="remindOver" v-else-if="(periodsState && periodsData.period_state===1) || (!periodsState && data['luck_state']===1 ) " >
							<text style="font-size: 22rpx;">已结束</text>
						</view>
						<view class="remindOver" v-else>
							<text style="font-size: 22rpx;">已订阅</text>
						</view>
					</view>
					<!-- #endif -->

				</view>
				<!-- 开奖按钮及倒计时和内容 -->
				<view class="draw-content b-f bor-radius-20upx">
					<!-- 	<view class="draw-state f-24" :class="{'already':data.luck_state === 1}" v-if="showDrawState">{{data.luck_state === 1?"已开奖":"待开奖"}}</view> -->
					<block v-if="data['luck_state'] !== 1 && !periodsState">
						<view class="dis-flex flex-x-between flex-y-center">
							<!-- <block v-if="data['luck_state']===3"> -->
							<block>
								<!-- color="#FFD940" splitorColor="#FFD940" -->
								<view class="">
									<view class="f-24 col-3 dis-flex flex-y-center"  v-if="data['luck_mode'] === 1 && data['luck_state']==3">
										<text>抽奖倒计时</text>
										<CountDown :leftTime="leftTime" backgroundColor="#FFD93F" color="#333333" @timeEnd="getluckdetail(data.luck_id,1)"></CountDown>
									</view>
									<view class="f-24 col-3 dis-flex flex-y-center"  v-else>
										<text>{{data['luck_state']==3 ? "抽奖倒计时" : "抽奖进行中"}}</text>
										<CountDown :leftTime="leftTime" backgroundColor="#FFD93F" color="#333333" @timeEnd="getluckdetail(data.luck_id,1)"></CountDown>
									</view>
								</view>
							</block>
							<block>
								<view class="rules">
									<text style="font-size: 12px;">规则</text>
								</view>

							</block>
							<!-- <block v-if="data['luck_state']===2">
								<view class="f-24 col-3">抽奖活动进行中</view>
							</block>
							<block v-if="data['luck_state']!==1">
								<view class="f-24 col-3">最多还能获取{{data['surplus_num']}}次抽奖机会</view>
							</block> -->
						</view>
						<view class="draw-btn-content">

							<view class="btn-style starbtn-bg" v-if="data['luck_state']===2 && data['code']['length']===0">
								<view class="starbtn f-28 t-c col-f" @click="stardraw(luck_id)">开始抽奖</view>
								
								
							</view>
							<view class="btn-style notbtn t-c f-28 col-f" v-if="data['luck_state']===3 && data['code']['length']===0">
								<view class="starbeginbtn f-28 t-c col-f">未开始</view>
							</view>

							<view class="wincode-content" v-if="data['luck_state']===2 && data['code']['length']>0">

								<!-- 	新版参与抽奖-未开奖 -->

								<view class="lotteryNumWrap">
									<view class="lotteryNum"  v-for="(item,index) in data['code']" :key="index" v-if="index<code_number">
										<text>{{item.luck_code}}</text>
										
									</view>
																
									<view class="lotteryMore" v-if="data.code.length>8">
																
										<button @click="moreCode"  class="moreBtn">{{data['code']['length']===code_number?'收起':'更多抽奖码'}}</button>
									
									</view>

								</view>
								<view class="inviteWrap">
									<view class="inviteMore" >
									
											<button open-type="share" @click="getMoreCode" id='luck' class="moreFrends">邀请好友获取更多抽奖码</button>
									</view>
								</view>

								
							</view>
						


						</view>
					</block>
					<!-- 新版带期数，通过期数里面状态来判断 -->
					<block v-if="periodsState && periodsData.period_state!==1">
						<view class="dis-flex flex-x-between flex-y-center">
							<!-- <block v-if="data['luck_state']===3"> -->
							<block>
								<!-- color="#FFD940" splitorColor="#FFD940" -->
								<view class="">
									<view class="f-24 col-3 dis-flex flex-y-center"  v-if="data['luck_mode'] === 1 && data['luck_state']==3">
										<text>抽奖倒计时</text>
										<CountDown :leftTime="oeridosTime" backgroundColor="#FFD93F" color="#333333" @timeEnd="getluckdetail(data.luck_id,1)"></CountDown>
									</view>
									<view class="f-24 col-3 dis-flex flex-y-center"  v-else>
										<text>{{periodsData['period_state']==3 ? "抽奖倒计时" : "抽奖进行中"}}</text>
										<CountDown :leftTime="oeridosTime" backgroundColor="#FFD93F" color="#333333" @timeEnd="getluckdetail(data.luck_id,1)"></CountDown>
									</view>
								</view>
							</block>
							<block>
								<view class="rules" @click="showRule">
									<text style="font-size: 12px;" >规则</text>
								</view>

							</block>

						</view>
						<view class="draw-btn-content">

							<view class="btn-style starbtn-bg" v-if="periodsData.period_state===2 && data['code']['length']===0">
								<view class="starbtn f-28 t-c col-f" @click="stardraw(luck_id)">开始抽奖</view>
							</view>
							<view class="btn-style notbtn t-c f-28 col-f" v-if="periodsData.period_state===3 && data['code']['length']===0">
								<view class="starbeginbtn f-28 t-c col-f">未开始</view>
							</view>

							<view class="wincode-content" v-if="periodsData.period_state===2 && data['code']['length']>0">
								<!-- 	新版参与抽奖-未开奖 -->

							<view class="lotteryNumWrap">
								<view class="lotteryNum"  v-for="(item,index) in data['code']" :key="index" v-if="index<code_number">
									<text>{{item.luck_code}}</text>
									
								</view>
							
								<view class="lotteryMore" v-if="data.code.length>8">
							
									<button @click="moreCode"  class="moreBtn">{{data['code']['length']===code_number?'收起':'更多抽奖码'}}</button>
								
								</view>
							
							</view>
								<view class="inviteWrap">
									<view class="inviteMore"  >
										
										<button open-type="share" @click="getMoreCode" id='luck' class="moreFrends">邀请好友获取更多抽奖码</button>
									</view>
								</view>


							</view>
						</view>
					</block>
					<!-- 开奖后 -->

					<!-- 新版带期数的开奖后 -->
					<block v-if="(periodsState && periodsData.period_state===1) || (data['luck_state'] === 1 && !periodsState) ">
						<view class="activity-darw b-f m-btm20 ">
							<view class="">
								<view class="priceList p-r backColor ">
									
									<view class="f-30 col-3 t-c">中奖名单</view>
								
								</view>
								<view class="rules openAfter" @click="showRule">
									<text style="font-size: 12px;" >规则</text>
								</view>
							</view>
							<view class="congratulation">
								<text v-if="data.my_luck_code">恭喜您中奖，快去领奖吧！</text>
								<text v-else>很遗憾，您未中奖</text>
							</view>
							<view class="luckWrap">
								<view v-if="data['luck_state'] === 1 && data['code']['length']===0" class="f-24 col-9 t-c m-btm20" style="width: 100%;">活动已开奖,暂无中奖名单</view>
								<view class="luckPerson" v-for="(item,index) in data['code']" :key="index">
									<view class="headPhoto" :style="{'background-image':'url('+item.avatarUrl+');'}">

										<view class="me" v-if="item['luck_code']==data.my_luck_code">
											<text>我</text>
										</view>
									</view>
									<view class="nameAndNum">
										<view class="">
											<text>{{item['nickName']}}</text>
										</view>
										<view class="luckNum">
											<text>{{item['luck_code']}}</text>
										</view>
									</view>
								</view>
							
								
							</view>
						</view>

					</block>
					<!--提示-->
					<block>
						<!-- <view class="draw-btn-content">
							<view class="wincode-content" v-if="data['my_code'] && data['my_code']['length']>0">
								<view class="wincode-title col-9 f-24 t-c">我的抽奖码 共{{data['my_code']['length']}}个</view>
								<view class="wincode dis-flex flex-warp">
									<block v-for="(item,index) in data['my_code']" :key="index">
										<view class="wincode-style f-28 t-c goods-price-FE504F m-btm20">{{item['luck_code']}}</view>
									</block>
								</view>
							</view>
						</view> -->
						

					</block>
					<!-- 推荐商品展示 -->
					<view class="draw-btn-content" v-if="(periodsState && periodsData.period_state===2 && data['code']['length']==0) || (periodsData.period_state===1) || (!periodsState && data.luck_state===2 && data['code']['length']==0)">
						<view class="onlyFlex reocommended" v-for="(item,index) in data.goods" :key="index" @click="skip_goods(item.goods_id)">
							<view class="priceGoods" :style="{'background-image':'url('+item['goods']['image'][0]['file_path']+')'}">
								<!-- <image src="@/static/images/addimag.png" class="goodsBack"></image> -->
							</view>
							<view class="flexYbtw">
								<view class="">
									<text>{{item['goods']['goods_name']}}</text>
								</view>
								<view class="">
									<view class="miniTitle">
										<text>您还可以<text style="color: #FF4444;">省{{item['goods']['goods_price']-item['goods']['member_price']}}元</text>购买此商品</text>
									</view>
									<view class="priceContent">
										<view class="" style="color: #FF4444;">
											￥<text style="font-size: 18px;">{{item['goods']['goods_price']}}</text>
										</view>
										<view class="buyBtn">
											<text>推荐购买</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					
					</view>
					<!-- 点击参加抽奖后 -->
					<view class="goods-already p-top-bom-40" v-if="data.user && data.user.user && data.user.user.length > 0">
						<view class="goods-already-user onelist-hidden">
							<image class="user-avatar" :src="item.avatarUrl" v-for="(item,index) in data['user']['user']" :key="index"
							 :style="{'z-index':data['user']['user']['length']*2-index}"></image>
							<view class="user-avatar user-more f-24">···</view>
						</view>
						<view class="f-24 col-9 t-c">已有{{data['user']['count']}}人抽奖<text class="already-moreall" @click="skip_drawMorenum">查看更多</text><text
							 class="already-moreall-right iconfont icon-right"></text></view>
					</view>
					<!-- 特别说明-新增 -->
					<view class="draw-btn-content" style="margin-top:12rpx">
						<view class="specilTips">
							<text>特别说明：本期5个奖品和5个会员奖品，中奖者为会员身份获得更多奖品</text>
						</view>
					</view>
					<!-- 抽奖商品 -->
					<!-- 	<block v-if="data['goods'] && data['goods'][0] && data['goods']['length']>0"> -->
					<block>
						<!-- <view class="goods-buy-price t-c f-24 col-3">您还可以<text class="goods-price-FE504F">{{settingData.currency}}{{data['goods'][0]['goods']['goods_price']}}</text>直接购买，为您节省<text
							 class="goods-price-FE504F">{{settingData.currency}}{{data['goods'][0]['goods']['diff_price']}}</text></view> -->
						<view class="goods" v-if="show">
							<view class="goods-discount col-f f-24">优惠超值购</view>
							<view class="dis-flex padding-box-all bor-radius-10upx p-r" v-for="(item,index) in data.goods" @click="skip_goods(item.goods_id)">
								<view class="goods-left bor-radius-10upx" :style="{'background-image':'url('+((item.goods&&item.goods.image&&item.goods.image.length>0)?(item['goods']['image'][0]['file_path']):'')+')'}"></view>
								<view class="goods-right dis-flex flex-dir-column flex-x-between">
									<view class="twolist-hidden f-28 col-3">{{item['goods']['goods_name']}}</view>
									<view class="dis-flex flex-y-center member-coupon-view m-top12" v-if="item['goods'].is_member_price===1">
										<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
										<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">{{memberDiyFont.discount_font}}{{settingData.currency}}{{item['goods'].coupon_price}}</view>
									</view>
									<view class="dis-flex flex-y-line">
										<view class="goods-price-FE504F f-24 m-right12">{{settingData.currency}}<text class="f-36">{{item['goods']['goods_price']}}</text></view>
										<view class="col-9 f-24 t-through">{{settingData.currency}}{{item['goods']['line_price']}}</view>
									</view>
								</view>
								<view class="buy-btn t-c f-24 col-3 backColor auxiliary-color">立即购买</view>
							</view>
						</view>
					</block>
				</view>
			</view>
			<!-- 添加客服 -->
			<!-- <view class="flexBt" @click="showAttention=true"> -->
				<view class="flexBt" >
				<view class="onlyFlex ">
					<view class="">
						<image src="@/static/images/business/shangchuangshangpin.png" class="kefuQr"></image>
					</view>
					<view class="">
						<view class="">
							<text>抽奖粉丝群体活动快来参与</text>
						</view>
						<view class="addKefu">
							<text>加客服获得抽奖攻略</text>
						</view>
					</view>
				</view>
				<view class="addBtn">
					<text>点我添加</text>
				</view>
			</view>
			<!-- 奖品列表 -->
			<view class="activity-darw b-f m-btm20 priceBox" v-if="allPrize.length>0">
				<view class="priceList p-r backColor">
					<view class="f-30 col-3 t-c">本期奖品列表</view>
				</view>
				<block>
					<view class="priceOne" v-for="(item,index) in allPrize" :key="index">
						<view class="priceGoods" :style="{'background-image': 'url('+item.cover[0].file_path+')'}">

						</view>
						<view class="flexYbtw">
							<view class="">
								<view class="oneLine">
									<text>{{item.prize_title}}</text>
								</view>
								
							</view>
								<view class="">
									<view class="storeName oneLine" style="margin-bottom: 20rpx;overflow: hidden;width: 460rpx;
			white-space: nowrap;
			text-overflow: ellipsis;">
										<text style="font-size: 24rpx;color: #999999;">{{item.business_name}}</text>
									</view>
									<view class="priceBottom">
										<view class="priceLeft">
											<text style="font-size: 24rpx;">奖品值:¥</text><text style="font-size: 32rpx;font-family:PingFang SC;font-weight:bold;">{{item.price}}</text>
										</view>
										<view class="priceRight">
											<!-- <text-scroll :text="item.business_name" :textOffer="1"></text-scroll> -->
											<text style="font-size: 24rpx;">中奖得:</text><text style="font-size: 28rpx;">{{item.num}}份</text>
										</view>
									</view>
								</view>
							
						</view>
					</view>
				</block>
			</view>
			<!-- 开通会员 -->
			<view class="">
				<view class="openMenber" @click="toOpenMenber">
					<image src="/static/memberback.png" class="memberBack" ></image>
					<view class="memberIcon" style="background-image: url(/static/images/member/membericon.png);">

					</view>
					<view class="">
						<view class="openTitle">
							<text>开通会员，中奖额外获得专属奖品</text>
						</view>
						<view class="openSubTitle">
							<text>会员用户将多获得5个抽奖码</text>
						</view>
					</view>
					<view class="openMemberBtn">
						<text>开通会员</text>
					</view>
				</view>
			</view>
			<!-- 会员专属奖品 -->
			<view class="activity-darw b-f m-btm20 priceBox" v-if="VIPPrize.length>0">
				<view class="priceList p-r backColor">
					<view class="f-30 col-3 t-c">会员专属奖品</view>
				</view>
				<view class="priceOne" v-for="(item,index) in VIPPrize" :key="index">
					<view class="priceGoods" :style="{'background-image': 'url('+item.cover[0].file_path+')'}">

					</view>
					<view class="flexYbtw" style="position: relative;width: 100%;z-index: 2;">
						<view class="">
							<view class="titleName oneLine">
								<text>{{item.prize_title}}</text>
							</view>
							
						</view>
							<view class="vipBack">
							
						</view>
                          <view class="">
                          	<view class="storeName " style="margin-bottom: 20rpx;" >
                          	  	<text style="font-size: 24rpx;color: #999999;">{{item.business_name}}</text>
                          	  </view>
                          	<view class="priceBottom">
                          		<view class="memberLeft ">
                          			<text style="font-size: 24rpx;">奖品值:¥</text><text style="font-size: 32rpx;font-family:PingFang SC;font-weight:bold;">{{item.price}}</text>
                          		</view>
                          		<view class="sanjiaox">
                          			<text></text>
                          		</view>
                          		<view class="memberRight">
                          		<!-- 	<text-scroll :text="item.business_name" :textOffer="2"></text-scroll> -->
                          		<text  style="font-size: 24rpx;">中奖得：{{item.num}}份</text>
                          		</view>
                          	</view>
                          </view>
					</view>
				</view>
			</view>
			<!-- 抽奖规则 -->
			<view class="activity-sku b-f m-btm20">
				<view class="activity-title-style p-r backColor">
					<view class="f-30 col-3 t-c">抽奖规则</view>
				</view>
				<view class="activity-sku-tab dis-flex flex-x-between p-r">
					<view class="activity-sku-tab-item t-c" v-for="(item,index) in drawflow" :key="index">
						<image :src="item.flowimage" mode=""></image>
						<view class="f-24 col-9">{{item.title}}</view>
					</view>
					<view class="drawflow-fgx drawflow-left-fgx">
						<image src="/static/images/draw/draw_fgx.png" mode=""></image>
					</view>
					<view class="drawflow-fgx drawflow-right-fgx">
						<image src="/static/images/draw/draw_fgx.png" mode=""></image>
					</view>
				</view>
			</view>
			<!-- 奖品提供方 -->
			<view class="activity-darw b-f m-btm20">
				<view class="activity-darw-title-style p-r backColor">
					<view class="f-30 col-3 t-c">奖品提供方</view>
				</view>
				<view class="darw-store-list">
					<view class="store-list">
						<block v-for="(item,index) in data['prize']" :key="index" v-if="index<=store_number">
							<view class="store-list-item dis-flex flex-y-center flex-x-between">
								<view class="store-left dis-flex flex-y-center">
									<view class="store-logo" :style="{'background-image':'url('+item['business']['logo']['file_path']+')'}"></view>
									<view class="store-detail">
										<view class="store-title f-28 col-3">{{item['business']['name']}}</view>
										<view class="store-inor f-24 col-9 onelist-hidden">{{item['business']['describe']}}</view>
									</view>
								</view>
								<!-- icon-right/ -->
								<view class="store-right f-24 col-9" @click="skip_store(item['business_id'],item['prize_id'])">
									进店看看<text class="iconfont icon-right store-right-icon"></text>
								</view>
							</view>
						</block>
					</view>
					<view class="store-all-more" v-if="data['prize']['length']>1" @click="moreStoreList">
						<view class="f-24 col-9 t-c">{{data['prize']['length']===store_number?'收起':'查看更多'}}</view>
						<view class="iconfont t-c store-more-icon" :class="data['prize']['length']===store_number?'icon-fold':'icon-unfold'"></view>
					</view>
				</view>
			</view>
			<!-- 活动详情 -->
			<view class="b-f activity-detail">
				<view class="activity-detail-title-style p-r m-btm20 backColor" >
					<view class="f-30 col-3 t-c">活动详情</view>
				</view>
				<view class="padding-box-all">
					<parse :html="luckexplain"></parse>
				</view>
			</view>
			<!-- 底部导航高度 -->
			<view class="" style="height: 106upx;"></view>
			<!-- 底部导航 -->
			<form @submit="saveFormId" report-submit="">
				<view class="goods-footer dis-flex flex-dir-row flex-y-center border-line border-top" :class="[isIphoneX ?'footer-padding':'']">
					<block v-for="(item,index) in footerBtns" :key="index">
						<view class="goods-footer-item dis-flex flex-dir-column flex-x-center p-r" @click="footerBtnNav(item)">
							<button class="btn-normal report-btn" form-type="submit"></button>
							<!-- #ifdef MP-WEIXIN -->
							<button class="report-btn" open-type="contact" v-if="item.type === '1'"></button>
							<!-- #endif -->
							<image :src="item.image"></image>
							<view class="goods-footer-item-text">{{item.input}}</view>
						</view>
					</block>
					<view class="goods-footer-item dis-flex flex-dir-column flex-y-center">
						<view class="groups-footer-btn dis-flex flex-dir-row">
							<view class="go-buy dis-flex flex-dir-column flex-y-center flex-x-center p-r backColor"
							
							@click="toHistory"
							>
								<text>往期回顾</text>
							</view>
							
							<view class="p-r go-groups groups-start dis-flex flex-dir-column flex-y-center flex-x-center " style="background-color: #EDEDED;color: #999999;" v-if="(periodsState && periodsData.period_state===1)&&!data.my_luck_code || (!periodsState && data['luck_state']===1 &&!data.my_luck_code) ">
								<text>活动已结束</text>
							</view>
							<view class="p-r go-groups groups-start dis-flex flex-dir-column flex-y-center flex-x-center "  v-if="(periodsState && periodsData.period_state===1)&&data.my_luck_code || (!periodsState && data['luck_state']===1&&data.my_luck_code ) " @click="getLuck" >
								<text>领取奖品</text>
							</view>
							
							<view class="p-r go-groups groups-start dis-flex flex-dir-column flex-y-center flex-x-center " v-else @click="$refs.shareView.shareswich()">
								<text>邀请好友抽奖</text>
							</view>
						</view>
					</view>
				</view>
			</form>
			<popup-view :show="shadeContact" type="center" @clickmask="showContact = false" v-if="data['luck_fission']===1">
				<view class="shade-box">
					<view class="invite-bg p-r m-btm20" :style="{'background-image':getImageRoot('36.png','url')}">
						<view class="invite-textbox f-24 col-3">已成功参与活动，每邀请一位好友可以获得{{data['luck_give_number']}}枚抽奖码，最多可获得{{data['luck_code_max']}}枚抽奖码，增加中奖几率！</view>
					</view>
					<view class="invite-btn t-c f-28 col-3 f-w p-r m-btm20" :style="{'background-image':getImageRoot('37.png','url')}">立即获取更多抽奖码
						<button open-type="share" id='luck' @click="getMoreCode"></button>
					</view>
					<view class="shade-close t-c">
						<text class="iconfont icon-roundclose shade-close-icon" @click="footerNav('shade')"></text>
					</view>
				</view>
			</popup-view>

			<!-- 引导关注公众号 -->
			<popup-view :show="showAttention" type="center" @clickmask="showAttention = false">

				<!-- #ifdef MP -->
				<view class="community-detail b-f t-c p-r">
					<view class="iconfont icon-roundclose" @click="showAttention = false"></view>
					<view class="community-header f-w f-44 p-r" :style="{'background-image':getImageRoot('61.png','url')}">
						<image src="/static/images/attention-wx.png" class="attention"></image>
					</view>
					<view class="community-body f-26 col-3 t-c">
						<view class="f-26 col-3">该抽奖仅限公众号粉丝参与</view>
						<view class="t-c">点击“<text class="col-m">去回复</text>”发送“<text class="col-m">{{data.keyword}}</text>”参与抽奖</view>
					</view>
					<button class="community-reply f-24 col-3" open-type="contact">去关注</button>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="attention-box">
					<view class="attention-title f-28 col-9 t-c">抽奖仅限公众号粉丝参与</view>
					<view class="attention-label dis-flex flex-y-center m-top30 col-3 f-24">
						<view class="label-num backColor auxiliary-color">1</view>
						<view class="attention-text">识别下方二维码关注公众号</view>
					</view>
					<image :src="data.wechat_image" class="wechat-image"></image>
					<view class="attention-label dis-flex flex-y-center m-top30 col-3 f-24">
						<view class="label-num  backColor auxiliary-color">2</view>
						<view class="attention-text">点击识别二维码弹出的内容参与抽奖</view>
					</view>
					<view class="dialogue-wechat">
						<view class="dialogue-info dis-flex">
							<view class="wechat-img"></view>
							<view class="dialogue-detail b-f flex-box">
								<view class="dialogue-name f-24 col-3 onelist-hidden">{{data.luck_title}}</view>
								<image src="/static/images/shouzhi.png" class="img_shouzhi"></image>
								<view class="dis-flex flex-x-between">
									<view class="f-24 col-9">点击参与抽奖~</view>
									<image :src="data.image && data.image[0] && data.image[0].file_path" class="dialogue-we"></image>
								</view>
							</view>
						</view>
						<image src="/static/images/dialogue.png" class="dialogue-img"></image>
					</view>
					<view class="iconfont icon-roundclose" @click="showAttention = false"></view>
				</view>
				<!-- #endif -->
			</popup-view>
		</view>
		<page-loading ref="loading"></page-loading>
		<ShareView ref="shareView" :pid="luck_id" :activity-data="activityData" :period-id="period_id" :share-data="shareData" :poster-type="'luck'"></ShareView>
		<order-pay ref="orderPay" @clickMask="onToggleList" @paySuccess="paySuccess"></order-pay>
	</view>
</template>

<script>
	import OrderPay from "@/components/template/OrderPayPopups.vue"
	import App from "@/common/js/app.js"
	import Parse from "@/components/threeComponents/jyf-Parser/index"
	import CountDown from "@/components/template/CountDown.vue"
	import PopupView from "@/components/template/PopManager.vue"
	import ShareView from "@/components/template/ShareView.vue"
	import textScroll from "./compoents/textScroll.vue"
	import {
		wxRequestSubscribeMessageX
	} from '@/common/js/wxPromise.js'
	// #ifdef H5
	import wxApi from "@/static/h5/wxApi.js"
	// #endif
	let successTimer = null,
		indexTimer = null,
		setTimer = null;
	export default {
		data() {
			return {
				textArr: [],
				tipsIndex:0,
				 animate: false,
				textStr:1,
				code_number:8,
				joinPerson:[],
				newData:{},
				allPrize: [],
				VIPPrize: [],
				prizeList: [],
				period_id:0,
				duration: 1,
				periodsState: true,
				periodsData: {},
				moveTop: 50,
				show: false,
				isPay: false,
				luck_id: null, //抽奖id
				main_user_id: null, //分享者用户id
				data: {}, // 抽奖详情数据
				// 订阅消息模板Ids
				drawTmplIds: [],
				boardRemark: "由成都地铁慢生活赞助",
				text2: "由默赞助",
				timeobj: {}, //倒计时时分秒
				shadeContact: false, //分销
				store_number: 0, //店铺数量
				isData: false, //是否显示页面
				showTips:false,
				drawflow: [{
						title: '获取抽奖码',
						flowimage: '/static/images/draw/getdraw.png'
					},
					{
						title: '等待开奖结果',
						flowimage: '/static/images/draw/loadingdraw.png'
					},
					{
						title: '已获取开奖码',
						flowimage: '/static/images/draw/getwin.png'
					}
				], //抽奖流程tab
				activityData: null,
				shareData: null, //分享数据
				showAttention: false, //显示关注弹窗，
				requestData: {

				}
			};
		},
		onLoad(e) {
			console.log(e.period_id);
			this.period_id=e.period_id
			this.pageLoad(e);
			 setInterval(this.showMarquee, 2000);
			 this.setSuccessBarrage()

		},
		onShow() {
			let token = uni.getStorageSync("token"),
				{
					luck_id
				} = this;
			this.getluckdetail(luck_id,this.period_id);

		},
		onHide() {
			clearTimeout(successTimer);
			clearTimeout(setTimer);
			clearTimeout(indexTimer);
			this.showTips = false;
	
		},
		onUnload() {
			clearTimeout(successTimer);
			clearTimeout(setTimer);
			clearTimeout(indexTimer);
			this.showTips = false;
	
		},
		components: {
			Parse,
			PopupView,
			ShareView,
			CountDown,
			OrderPay,
			textScroll
		},
		computed: {
			luckexplain() {
				return this.data.luck_explain
			},
			luckStarTime() {
				return this.data.luck_start_time
			},
			//活动状态
			activityStatus() {
				if (!!this.data.luck_start_time) {
					let {
						luck_start_time,
						luck_end_time
					} = this.data,
						activityStatus = App.getActivityStatus(luck_start_time, luck_end_time);
					console.log(activityStatus);
					return activityStatus
				} else {
					return {}
				}
			},
			//活动结束时间
			leftTime() {
				return this.activityStatus.leftTime;
			},
			//活动状态
			timeStatus() {
				return this.activityStatus.status;
			},
			//活动结束时间（有期数）
			oeridosTime() {
				let starTime,endTime
				if (this.periodsData) {
	
					if(this.periodsData.period_state==3){
	
						console.log('XXXXXXXXXXXXXX');
						starTime=Date.parse(new Date())/1000;
						endTime=this.periodsData.start_time/1000;
						console.log(starTime,endTime);
					}else{
						starTime = this.periodsData.start_time/1000
						endTime = this.periodsData.lottery_time/1000
						console.log(starTime,endTime);
					}
	
					return App.getActivityStatus(starTime, endTime).leftTime;
				} else return 0;

			},
			footerBtns() {
				let {
					button = [{
							input: "首页",
							link: "pages/mainPages/index/index",
							image: "/static/images/goods/home.png",
							type: "3"
						},
						{
							input: "订单",
							link: "pages/mainPages/order/index?type=all",
							image: "/static/images/goods/flow.png",
							type: "3"
						},
						{
							input: "客服",
							link: "pages/mainPages/index/index",
							image: "/static/images/goods/service.png",
							type: "1"
						}
					]
				} = this.settingData,
					isDealerBtn = button.findIndex(val => val.type === "5") > 0;
				console.log("isDealerBtn", )
				button = JSON.parse(JSON.stringify(button));
				if (isDealerBtn) {
					button.map(val => {
						if (val.type === "5") {
							val.input = "分享";
							// val.image = "/static/images/goods/share.png"
							val.notDealer = true;
						}
					})
				}
				console.log("this.settingData", this.settingData);
				return button;
			},
			//开奖标签显示
			showDrawState() {
				return this.activityStatus.status === 1
			}
		},
filters:{
			//时间戳转换
			timeChange:function(value){
			// return this.$util.formatTime(times,normal," ")
			var time = new Date(value );
			var y = time.getFullYear();
			var m = time.getMonth() + 1;
			var d = time.getDate();
			var h = time.getHours();
			var mm = time.getMinutes();
			var s = time.getSeconds();
			if (h < 10) h = '0' + h;
			if (mm < 10) mm = '0' + mm
			return y +'年'+ m+ '月' + d + '日' + ' '+h +':' +mm;
			},
		},
		methods: {
			setSuccessBarrage() {
				let _this = this,
					tipsIndex = _this.tipsIndex,
					joinPerson = _this.joinPerson;
	
	
					console.log("showTips");
					if(_this.tipsIndex>=_this.joinPerson.length){
						_this.tipsIndex=0;
					}
					_this.showTips = true;
					successTimer = setTimeout(() => {
						_this.showTips = false;
						setTimer = setTimeout(() => {
							_this.showTips = false;
							_this.tipsIndex++
						}, 500);
						indexTimer = setTimeout(() => {
							_this.showTips = false;
							_this.setSuccessBarrage();
						}, 3000);
					}, 5000);
	
			},
			//去领取奖品
			getLuck(){
				App.navigationTo({
					url: `pages/subPages/drawlotter/detail/newDetail?luck_id=${this.luck_id}&period_id=${this.period_id}`
				})
			},
			toHistory(){
				console.log(this.luck_id);
							App.navigationTo({
								url:'pages/subPages/drawlotter/formerlotterlist/index?luck_id='+this.luck_id
							})
						},
			showMarquee(){
				this.animate=true;
				setTimeout(() => {
				     this.textArr.push(this.textArr[0]);
				     this.textArr.shift();
					 this.animate= false
	
	
				   }, 500);

			},
			 toOpenMenber(){
				 App.navigationTo({
				 	url: 'pages/subPages/member/index/index'
				 })
			 },
			NewNubscribeDraw(){
	
				// uni.showLoading({
				// 	title: '请稍后'
				// })
				//未开始
				let opData;
				if((!this.periodsState && this.newData.luck_code===3) || (this.periodsState && this.periodsData.period_state===3)){
					opData='luckstart';
	
				}else if((!this.periodsState && this.newData.luck_code===2) || (this.periodsState && this.periodsData.period_state===2)){
					opData='lottery';
				}
				App._postP('wxapp.sub/getIds', {
					op: opData
				}).then(res=>{
					console.log(res);
					if(res.data.length>0){
						let ids=res.data[0];
						App._postP('wxapp.formid/save',{
							op: opData,
							ids,
							type:1,
							main_id:this.periodsData.luck_period_id,
							period_id:this.period_id
						}).then(data=>{
							console.log(data);
							if (data.code==1){
								// uni.showToast({
								// 	title: '订阅成功',
								// 	duration: 2000
								// });
								App.showSuccess('订阅成功')
								this.getluckdetail(this.luck_id,this.period_id);
							}
							// uni.hideLoading()
						})
					}
	
	
				})
	
			},
			//显示规则
			showRule(){
				uni.showModal({
					title:"抽奖规则",
					content:this.newData.luck_rule,
					showCancel:false,
					confirmText:"知道了",
	
				})
			},
			paySuccess() {
				App.showSuccess('支付成功')
				this.getluckdetail(this.luck_id,this.period_id);
			},
			onToggleList() {
				this.$refs.orderPay.onToggleList()
			},
			pageLoad(e) {
				let _this = this,
	
					scene = App.getSceneData(e),
					{
						a, //luck_id
						b, //referee_id
					} = scene,
					luck_id = a ? a : (e.luck_id || ""),
					main_user_id = b ? b : (e.referee_id || e.main_user_id || "");
					// console.log("OOOOOOOOOOOOOO");
					// console.log(scene);
					// console.log(main_user_id);
					this.main_user_id=main_user_id
				// #ifdef MP-ALIPAY
				if (App.query) {
					luck_id = App.query.luck_id;
	
				}
				// #endif
				_this.activityData = {
					luck_id
				};
				App.showLoading();
				if (!!main_user_id) {
					_this.drawshare(luck_id, main_user_id)
				}
				_this.luck_id = luck_id;
			},
			getluckdetail(luck_id, refresh = 0,period_id=0) {
				let _this = this,
					params = {
						luck_id,
						period_id:this.period_id,
						no_login: 1
					};
				console.log(params, 'getluckdetail-params');
				if (refresh === 1) {
					params.refresh = refresh
				};
				App._post_form('luck.luck/LuckDetail', params, res => {
					console.log(res)
					this.newData=res.data;
					this.prizeList = res.data.prize;
					// this.periodsData = res.data.periods;
					// console.log(this.periodsData);
					this.allPrize=[];
					this.VIPPrize=[];
					this.joinPerson=[];
					res.data.periods.map(item=>{
						if(this.period_id==item.luck_period_id){
							this.periodsData=item
						}
					})
					console.log(this.periodsData);
					if (res.data.periods.length > 0) {
						this.periodsState = true;
					} else {
						this.periodsState = false;
					}
					//抽奖弹幕
					let resJoinData=res.data.get_code_note
					this.joinPerson=resJoinData;
					if(resJoinData.length<3 && resJoinData.length!=0){
	
						for(var i=0; i<4-resJoinData.length;i++){
							console.log(i);
							if(i>1){
								this.joinPerson.push(resJoinData[i])
							}else{
	
								this.joinPerson.push(resJoinData[0])
							}
	
						}
	
					}
					res.data.prize.map(item => {
						if (item.is_vip == 0) {
							item.business_name = "由" + item.business_name + "提供"
							this.allPrize.push(item)
						} else if (item.is_vip == 1) {
							item.business_name = "由" + item.business_name + "赞助"
							this.VIPPrize.push(item)
						}
					})
					if (res['data']['goods']['length'] > 0) {
						let diff_price = Number(res['data']['goods'][0]['goods']['line_price']) - Number(res['data']['goods'][0][
							'goods'
						]['goods_price']);
						res['data']['goods'][0]['goods']['diff_price'] = Number(diff_price).toFixed(2);
					}
					_this.setData(res)
					if (res['data']['luck_state'] === 3) {
						_this.setEndTime();
					}
					if (_this.appClientType !== "3") {
						console.log(('111111111111111111111111'));
						console.log(res.data,_this.$data);
						_this.shareData = App.getPageShareData("lottery", res.data, _this.$data);
					}
					_this.activityData = {
						luck_id: res['data']['luck_id']
					}
					_this.isData = true
					_this.isPay = res.data.is_pay ? res.data.is_pay == 1 : false
				}, err => {
					console.log(err)
					if (err.data.code === 0) {
						uni.navigateBack({
							delta: 1
						})
					}
				}, () => {
					App.hideLoading()
				})
			},
			/**
			 * 开奖倒计时
			 */
			setEndTime() {
				let _this = this,
					// 开始时间
					luckStarTime = _this.luckStarTime * 1000,
					//当前时间
					nowTime = new Date().getTime(),
					// 当前抽奖状态
					{
						luck_state
					} = _this.data,
					// 剩余开始时间
					leftTime = parseInt((luckStarTime - nowTime) / 1000);
				return {
					hh: 20,
					mm: 20,
					ss: 20
				};
				if (luck_state === 3) {
					console.log("leftTime", leftTime);
					if (leftTime > 0) {
						let hh = parseInt(leftTime / 60 / 60 / 24 * 24),
							mm = parseInt(leftTime / 60 % 60),
							ss = parseInt(leftTime % 60),
							timeobj = {
								hh: hh < 10 ? '0' + `${hh}` : hh,
								mm: mm < 10 ? '0' + `${mm}` : mm,
								ss: ss < 10 ? '0' + `${ss}` : ss
							};
						_this.$nextTick(() => {
							_this.timeobj = timeobj;
						});
					} else {
						_this.getluckdetail(_this.luck_id, 1)
						clearTimeout(setTimeout(_this.setEndTime, 1000));
						return false
					};
					// setTimeout(_this.setEndTime, 1000);
				} else {
					return false
				}
			},
			//抽奖请求
			drawRequest(params) {
				let _this = this;
				uni.showLoading({})
				App._post_form('luck.luck/EnjoyLuck', params, res => {
					if (res.code === 1) {
						if (res.data === 2) {
							this.shadeContact = true;
						}
						App.showSuccess('参与抽奖成功')
						_this.getluckdetail(_this.luck_id)
					}
				}, false, () => {
					uni.hideLoading()
				})
			},
			/**
			 * 开始抽奖
			 */
			async stardraw(luck_id) {
				if (this.data.is_subscribe === 20) {
					console.log('stardraw', 1)
					this.showAttention = true;
					return
				}
				// #ifdef MP-WEIXIN
				this.subscribeDraw()
				// #endif

				if (this.isPay) {
					// 付费类型的抽奖
					console.log('stardraw', 2)
					this.getPayDetail(luck_id)
				} else {
					// 非付费类型的抽奖
					console.log('stardraw', 3)
					this.realStardraw({
						luck_id,period_id:this.period_id
					})
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
			realStardraw(params) {
				let _this = this;

				if (_this.data.luck_mode === 2) {
					params.refresh = 1
				}
				if (_this.data.luck_crowd === 3) {
					App.getLocation().then(res => {
						params.lat = res.latitude;
						params.lng = res.longitude;
						_this.drawRequest(params)
					})
				} else {
					_this.drawRequest(params)
				}
			},
			getPayDetail(luck_id) {
				this.$store.commit("orderPay", {
					luck_id,
					period_id:this.period_id,
					pay_from: 'luck'
				})
				this.onToggleList()

			},
			drawshare(luck_id, main_user_id) {
				let _this = this;
				App._post_form('luck.luck/shareLuck', {
					luck_id,
					period_id:this.period_id,
					main_user_id
				}, res => {
					console.log('分享成功')
				})
			},
			/**
			 * 客服按钮
			 */
			/**
			 * 客服按钮
			 */
			contactBtn(customer) {
				if (customer === "service") {
					// #ifdef MP-ALIPAY || MP-TOUTIAO || H5
					App.navigationTo({
						url: "pages/subPages/user/service"
					});
					// #endif
				} else if (customer === "dial") {
					let phoneNumber = this.data.kf_phone;
					uni.makePhoneCall({
						phoneNumber
					})
				} else if (customer === "share") {
					// #ifndef MP-TOUTIAO
					this.$refs.shareView.shareswich();
					// #endif
				}

			},
			toDetail(params) {
				App.navigationTo({
					url: `pages/subPages/drawlotter/detail/detail?luck_id=${params}`
				});
			},
			/**
			 * 底部菜单按钮跳转
			 */
			footerNav(type) {
				let url = "";
				switch (type) {
					case "home":
						url = "pages/mainPages/index/index";
						break;
					case "order":
						url = "pages/mainPages/order/index";
						break;
					case "shade":
						this.shadeContact = false;
						return;
						break;
				}
				App.navigationTo({
					url
				});
			},
			/**
			 * 是否加载更多店铺
			 */
			moreStoreList() {
				let _this = this,
					store_number = _this.store_number,
					storelistnum = _this.data.prize.length;
				if (store_number === 0) {
					_this.setData({
						store_number: storelistnum
					})
				} else if (store_number === storelistnum) {
					_this.setData({
						store_number: 0
					})
				}
			},
			//加载更多抽奖码
			moreCode(){
				let _this = this,
					code_number = _this.code_number,
					// codelistnum = _this.data.code.length
					codelistnum=_this.textArr.length
	
			if (code_number === 8) {
	
					_this.code_number= codelistnum
					console.log(_this.code_number);
	
			} else if (code_number === codelistnum) {
	
					_this.code_number= 8;
					console.log(_this.code_number);
	
				}
			},
	
			/**
			 * 跳转到商品详情
			 */
			skip_goods(goods_id) {
				App.navigationTo({
					url: `pages/subPages/goods/index/index?goods_id=${goods_id}`
				})
			},
			/**
			 * 跳转到店铺详情
			 */
			skip_store(bus_id, prize_id) {
				App.navigationTo({
					url: `pages/subPages/store/list?bus_id=${bus_id}&prize_id=${prize_id}`
				})
			},
			/**
			 * 往期回顾
			 */
			skip_drawOrder() {
				App.navigationTo({
					url: `pages/subPages/drawlotter/drawlotterlist/drawlotterlist`
				})
			},
			/**
			 * 查看更多中奖人数
			 */
			skip_drawMorenum() {
				App.navigationTo({
					url: `pages/subPages/drawlotter/record/record?luck_id=${this.luck_id}`
				})
			},
			/**
			 * 获取更多抽奖码
			 */
			getMoreCode() {
				console.log("????");
				if (this.appClientType === "4") {
					this.$refs.shareView.shareswich();
					this.$refs.shareView.shareImg = true;
					console.log("1111");
				} else if (this.appClientType === "3") {
					console.log("23222");
					uni.showToast({
						icon: "none",
						title: "分享该页面给好友即可获得~"
					});
				}
			},
			/**
			 * 底部菜单按钮跳转
			 */
			footerBtnNav(item = {}) {
				let {
					link: url = "",
					type
				} = item,
				kf_phone = this.settingData.kf_phone;
				if (type === "1") {
					url = "pages/subPages/user/service";
					// #ifndef H5
					return
					// #endif
				} else if (type === "2") {
					uni.makePhoneCall({
						phoneNumber: kf_phone //仅为示例
					})
					return
				} else if (type === "3") {
					if (url.indexOf("pages/mainPages/index/index") !== -1) {
						// #ifdef H5
						url += "?i=" + App.getUniacid();
						// #endif
						uni.reLaunch({
							url: "/" + url
						});
						return;
					}
				} else if (type === "4" || type === "5") {
					this.$refs.shareView.shareswich();
					return
				}
				App.navigationTo({
					url
				});
			},
		},
		onShareAppMessage(res) {
			console.log("xxxxxx");
			console.log(res);
			console.log(this.shareData.path);
			if( res.from === "button" && res.target.id === "luck" ){
			let a= {
					imageUrl:this.shareData.imageUrl,
					title:this.shareData.title,
					 path:`${this.shareData.path}&period_id=${this.period_id}`
			}
			console.log();
				console.log(a);
			}
	
	
			 // return this.shareData
		}
	}
</script>

<style lang="less" scoped>
	@import "index.css";
.backColor{
	background-color: #FFD940;
}
.openAfter{
	position: absolute;
	right: 30rpx;
	top: 78rpx;
}

.disFlexBtew{
	display: flex;
	justify-content: space-between;
}
.priceHead{
	font-size:32rpx;
	font-family:PingFang SC;
	font-weight:bold;
}
.swiper_item{
	width: auto;
}
.marquee_top {
     transition: all 0.5s;
     margin-top: -60rpx;
  }

  .swiper{
	  display: block;
	  height: 198rpx;
	  width: 400rpx;

  }

	

	
	text {
		font-size: 28rpx;
	}

	.bullent {
		position: absolute;
		top: 40rpx;
		left: 30rpx;
		 height: 130rpx;
		 overflow: hidden;
		


	}

	.bullentOne {
		display: flex;
		// padding: 8rpx;
		padding-right: 26rpx;
		background: rgba(255, 217, 64, 1);
		opacity: 0.8;
		border-radius: 30rpx;
		margin-bottom: 21rpx;
		
	}

	.bullentImg {
		width: 46rpx;
		height: 46rpx;
		border-radius: 50%;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: center;

	}

	

	
	.luckPerson {
		width: 33.3%;
		text-align: center;
	}

	.moreBtn {
		font-size: 14px;
		padding: 0;
	}
	.moreFrends{
		font-size: 14px;
		padding: 0;
		background-color: #FFD93F;
	}

	.luckWrap {
		display: flex;
		flex-wrap: wrap;
	}

	.headPhoto {
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: center;
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		position: relative;
		margin: 0 auto;

		.me {
			position: absolute;
			bottom: 0;
			right: -15rpx;
			background: rgba(255, 217, 64, 1);
			border: 1px solid rgba(51, 51, 51, 1);
			border-radius: 50%;
			width: 30rpx;
			height: 30rpx;
			line-height: 30rpx;
		}
	}

	.nameAndNum {
		text-align: center;
		font-size: 24rpx;

		.luckNum {
			color: #FF4444;
		}

	}

	.lotteryNumWrap {
		min-height: 260rpx;
		padding: 21rpx;
		display: flex;
		flex-wrap: wrap;
	}

	.congratulation {
		text-align: center;
		color: #FF4343;
		margin-bottom: 10rpx;
	}

	.inviteWrap {
		width: 100%;

	}

	.inviteMore {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 340rpx;
		height: 60rpx;
		background: rgba(255, 217, 63, 1);
		border-radius: 8rpx;
		margin: 0 auto;
		overflow: hidden;
	}

	.lotteryNum {
		border: 1px solid rgba(255, 67, 67, 1);
		width: 170rpx;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FF4343;
		border-radius: 8rpx;
		margin: 10rpx;
	}

	.lotteryMore {
		border: 1px solid #333333;
		width: 170rpx;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #333333;
		border-radius: 8rpx;
		margin: 10rpx;
		overflow: hidden;
	}

	.priceWrap {
		padding: 21rpx;
		margin: 21rpx;
		background-color: #FFFFFF;

	}

	.priceBox {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0rpx 2rpx 12rpx 0rpx rgba(221, 221, 221, 0.5);
		border-radius: 20rpx;
		margin: 21rpx;
	}

	.titleName {
		// width: 340rpx;
	}

	.memberBack {
		width: 567rpx;
		height: 108rpx;
		position: absolute;
	}

	.vipBack {
		 background-image: url(./static/vip.png);
		width: 120rpx;
		height: 120rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: center;
		position: absolute;
		right: 0;
		z-index: -1;
	}

	.openMenber {
		display: flex;
		justify-content: space-between;
		align-items: center;

		background: linear-gradient(90deg, rgba(57, 57, 69, 1) 0%, rgba(85, 91, 105, 1) 100%);
		border-radius: 16rpx;
		padding: 21rpx;
		margin: 21rpx;

		.memberIcon {
			width: 52rpx;
			height: 52rpx;
			background-repeat: no-repeat;
			background-size: 100% 100%;
			background-position: center;
		}

		.openTitle {
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(255, 219, 165, 1);
		}

		.openSubTitle {
			font-size: 12px;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(176, 180, 193, 1);
		}

		.openMemberBtn {
			background: linear-gradient(90deg, rgba(247, 101, 105, 1) 0%, rgba(255, 121, 97, 1) 100%);
			border-radius: 20rpx;
			padding: 0rpx 6rpx 6rpx 6rpx;
			color: #FFFFFF;
		}

	}

	.sanjiaox {
		width: 0px;
		height: 0px;
		border-color: #FFD93F transparent;
		border-width: 0rpx 0rpx 70rpx 40rpx;
		border-style: solid;
		position: absolute;
		top: -9rpx;
		right: 24%;

	}

	.priceBottom {
		display: flex;
		width: 455rpx;
		border-radius: 25rpx;
		overflow: hidden;
		position: relative;

		.priceLeft {
			background: rgba(255, 217, 64, 1);
			padding: 5rpx 15rpx;
			width: 80%;
			// text-align: center;
		}

		.priceRight {
			background: rgba(51, 51, 51, 1);
			padding: 5rpx 15rpx;
			color: #FFFFFF;
			width: 50%;
			//text-align: center;
			// line-height: 100%;
			
		}
		.oneLine{
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.storeName{
			width: 340rpx;
		
			color: #999999;
			
			
		}

		.memberLeft {
			background: rgba(57, 57, 70, 1);
			padding: 5rpx 15rpx;
			width: 80%;
			//text-align: center;
			color: #FFDBA5;
		}

		.memberRight {
			background: rgba(255, 217, 64, 1);
			padding: 5rpx 16rpx;
			width: 20%;
		//	text-align: center;
			color: #333333;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}


	}

	.priceOne {
		display: flex;
		padding: 21rpx;
		border-bottom: 1px solid #EEEEEE;
	}

	.buyBtn {
		width: 130rpx;
		height: 46rpx;
		background: rgba(255, 217, 64, 1);
		border-radius: 8rpx;
		color: #333333;
		text-align: center;
	}

	.reocommended {
		box-shadow: 0rpx 2rpx 12rpx 0rpx rgba(221, 221, 221, 0.5);
		border-radius: 12rpx;
		margin-bottom: 21rpx;
		padding: 21rpx;
	}

	.miniTitle {
		margin-bottom: 10rpx;
		color: #999999;

		text {
			font-size: 12px;
		}


	}

	.priceGoods {
		width: 180rpx;
		min-width: 180rpx;
		height: 180rpx;
		border-radius: 8rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: center;
		margin-right: 21rpx;
	}

	.goodsBack {
		width: 180rpx;
		height: 180rpx;
		border-radius: 4rpx;
		margin-right: 21rpx;
	}

	.remind {
		padding: 10rpx;
		color: #FFFFFF;
		background-color: #FF7878;
		border-radius: 4px;
	
		//height: 45rpx;
		// margin-top: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		
	}
.remindOver{
	padding: 10rpx;
	color: #FFFFFF;
	background:rgba(204,204,204,1);
	border-radius: 4px;
	
	
	//height: 45rpx;
	// margin-top: 40rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	
}
	.priceContent {
		display: flex;
		justify-content: space-between;
		width: 400rpx;
	}


	.rules {
		border: 1px solid rgba(153, 153, 153, 1);
		border-radius: 4px;
		color: rgba(153, 153, 153, 1);
		padding: 0 3rpx 3rpx 3rpx;
		font-size: 12px;

	}

	.flexYbtw {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-top: -5rpx;
	}


	.specilTips {
		background: rgba(247, 247, 247, 1);
		border-radius: 4px;
		color: #999999;
		padding: 21rpx;

		text {
			font-size: 12px;
		}

	}

	.kefuQr {
		width: 68rpx;
		height: 68rpx;
		margin-right: 13rpx;
	}

	.flexBt {
		display: flex;
		justify-content: space-between;
		padding: 21rpx;
		background-color: #FFFCF1;
		margin: 30rpx;
		border-radius: 4px;
		align-items: center;

	}

	.onlyFlex {
		display: flex;
	}

	.addKefu {
		color: #999999;

		text {
			font-size: 12px;
		}
	}

	.addBtn {
		 width: 190rpx;
		height: 40rpx;
		background: rgba(255, 217, 64, 1);
		border-radius: 20rpx;
		padding: 0 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
