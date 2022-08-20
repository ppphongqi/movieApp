<template>
	<view :style="themeColor">
		<lead-attention></lead-attention>
		<view class="container p-bottom" v-if="order.order_id">
			<!-- #ifdef MP-WEIXIN -->
			<!-- 票务顶部订阅提示 -->
			<!-- <view class="ticketing-top-tip">
				<view class="ticketing-top-tip__left">
					<view class="iconfont icon-square"></view>
					<view class="ticketing-top-tip__text">打开提醒，及时接收此订单状态</view>
				</view>
				<view class="ticketing-top-tip__right">
					<button class="ticketing-top-tip__btn-op btn-normal">开启</button>
					<view class="ticketing-top-tip__divider"></view>
					<view class="ticketing-top-tip__icon-close iconfont icon-close"></view>
				</view>
			</view> -->
			<!-- 票务顶部订阅提示 end -->
			<!-- #endif -->

			<!-- 顶部状态栏 -->
			<view class="detail-header dis-flex flex-y-center main-bg-color ">
				<image class="state-img" :src="stateImg" mode="aspectFit"></image>
				<view class="header-state f-36 col-3 auxiliary-color">
					<text class="f-w">{{ order.app_state_text }}</text>
					<view class="f-28 col-3 m-top10" v-if="order.pay_status.value === 10 && order.order_status === 10 && order.payEndTime !== 0">剩{{remainingTime}}自动关闭</view>
					<block v-if="!cTicketingInfo.isTicketing && order.express_type === 3 && (order.groups_id === 0?!0:order.group_status === 1 || order.group_status === 3)">
						<view class="f-28 col-3 m-top10 auxiliary-color" v-if="order.is_abnormal == 2 && order.pay_status.value === 20 && order.validity_status.value === 0 && order.is_closed.value === 0">
							到期时间: {{remainingTime == -1?"永久有效":remainingTime}}</view>
					</block>
				</view>
			</view>

			<!-- 核销码 -->
			<view class="self-address b-f" v-if="!!order.vercode && order.vercode.length>0 && order.express_type === 3">
				<view class="store-info">
					<view class="store-title dis-flex flex-x-between flex-y-center border-line border-bottom">
						<view class="store-name f-28 col-3">核销码</view>
						<view class="f-24 col-3"></view>
					</view>
					<view class="check-list">
						<view class="check-item dis-flex flex-x-between flex-y-center col-3 f-26" :class="{'no-bor':order.vercode.length<=3 && index === (codeList.length-1)}"
						 v-for="(item,index) in codeList" :key="index" :style="{'height':item.gift_title || item.gift_bus ?'auto':'74rpx','line-height':item.gift_title || item.gift_bus ?'48rpx':'74rpx'}">
							<view class="check-code" style="width: 85%;">
								<view class="m-top10 f-w">
									{{ShowVercode(!!item.code ? item.code : '')}}
									<text v-if="item.is_give==1">(赠送)</text>
								</view>
								<!-- 礼包名称： 商家信息：-->
								<view class="m-top10 f-22" v-if="item.gift_title">{{item.gift_title}}</view>
								<view class="m-top10 m-btm10 f-22" v-if="item.gift_bus">
									<i class="iconfont icon-shop"></i>
									{{item.gift_bus}}</view>
							</view>
							<view class="check-status">{{checkStatusText(item.is_refund,item.check_status,item.is_past)}}</view>
						</view>
						<view class="check-item check-more no-bor dis-flex flex-x-center flex-y-center col-9 f-24" v-if="order.vercode.length>3">
							<view class="" @click="showAll = !showAll">{{showAll?"收起":"查看更多"}}</view>
							<view class="iconfont icon-unfold" :class="[showAll?'icon-fold':'icon-unfold']"></view>
						</view>
					</view>
				</view>
			</view>

			<!-- 自提码 -->
			<view class="self-address m-top20  b-f" v-if="order.express_type === 2 && order.pay_status.value === 20 && !cTicketingInfo.isTicketing">
				<view class="store-info">
					<view class="store-title dis-flex flex-x-between flex-y-center border-line border-bottom">
						<view class="store-name f-28 col-3">自提码</view>
						<view class="f-24 col-3"></view>
					</view>
					<view class="check-list">
						<view class="check-item dis-flex flex-x-between flex-y-center col-3 f-26 no-bor">
							<view class="check-code">{{ShowVercode(!!order.store ? order.store.code : '')}}</view>
							<view class="check-status">{{order.is_refund === 30? "已退款" :order.is_refund === 20? "售后中": order.delivery_status.value === 10 ?"待提货":"已提货"}}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 物流收货 -->
			<view class="flow-checkout-header b-f dis-flex flex-y-center p-r" v-if="!!order.address && (order.express_type == 1 || order.express_type == 6)">
				<view class="iconfont icon-location f-48"></view>
				<view class="flow-header-left padding-box">
					<view class="flow-checkout-admin f-28 col-3">{{order.address.name}} {{order.address.phone}}</view>
					<view class="flow-checkout-address f-26" v-if="order.address.end_address">
						{{order.address.end_address}}
					</view>
					<view class="flow-checkout-address f-26" v-else>
						{{order.address.region && order.address.region.province}} {{order.address.region && order.address.region.city}} {{order.address.region && order.address.region.region}}
						{{order.address.detail}}
					</view>
				</view>
				<view class="address-copy" @click="copyContent(addressCopyText,'text')">复制信息</view>
			</view>
			<!-- 物流收货 end -->

			<!-- 自提收货 -->
			<view class="self-address m-top20  b-f" v-if="!!order.store && order.express_type !== 1 ">
				<!-- 商家信息 -->
				<view class="store-info" v-if="order.express_type !== 5 && !order.gift_business && !cTicketingInfo.isTicketing">
					<view class="store-title dis-flex flex-x-between flex-y-center border-line border-bottom">
						<view class="store-name f-28 col-3">商家信息</view>
						<view class="f-24 col-3" @click="moreStore(order.merchat.id)">更多分店</view>
					</view>
					<block v-if="order.express_type === 3">
						<view class="store-address dis-flex  flex-y-center flex-x-between border-line border-bottom" v-for="(item,index) in order.store.detail"
						 :key="item.id" v-if="index<3">
							<view class="store-address-info">
								<view class="col-3 f-30 f-w">{{item.name}}</view>
								<!-- 店铺电话 -->
								<view class="store-addres-text col-9 twolist-hidden f-24">商家电话:{{item.mobile}}</view>
								<!-- 店铺地址 -->
								<view class="f-24 col-9 m-top10 dis-flex flex-y-center">
									<!-- <view class="iconfont icon-location f-24">1.6km </view> -->
									<view class="onelist-hidden" style="width:220px;"> {{item.detailed_address}}</view>
								</view>
							</view>
							<store-nav :mobile="item.mobile" :address="item"></store-nav>
						</view>
					</block>
					<block v-else-if="order.store.detail">
						<view class="store-address dis-flex  flex-y-center flex-x-between border-line border-bottom">
							<view class="store-address-info">
								<view class="f-28 col-3">{{order.store.detail.name}}</view>
								<view class="f-24 col-9 m-top10 dis-flex flex-y-center">
									<!-- <view class="iconfont icon-location f-24">1.6km </view> -->
									<view class="onelist-hidden" style="width:220px;"> {{order.store.detail.detailed_address}}</view>
								</view>
							</view>
							<store-nav :mobile="order.store.detail.mobile" :address="order.store.detail"></store-nav>
						</view>
					</block>
					<view class="self-user f-26 col-3">{{order.store.name}} {{order.store.phone}}</view>
				</view>

				<view class="store-info" v-if="order.gift_business">
					<view class="store-title dis-flex flex-x-between flex-y-center border-line border-bottom">
						<view class="store-name f-28 col-3">商家信息</view>
					</view>
					<view class="" v-for="(busitem,busIndex) in order.gift_business" :key='busIndex'>
						<view class="">
							<view class="col-3 f-30 f-w m-top10" style="margin-left: 24rpx;">商家名称：{{busitem.name}}</view>
							<block v-if="busitem.showAll == false">
								<view class="store-address dis-flex  flex-y-center flex-x-between border-line border-bottom" v-for="(store,storeIndex) in busitem.store"
								 v-if="storeIndex<1" :key='storeIndex'>
									<view class="store-address-info">
										<view class="col-3 f-30 ">{{store.name}}</view>
										<!-- 店铺电话 -->
										<view class="store-addres-text col-9 twolist-hidden f-24">商家电话:{{store.mobile}}</view>
										<!-- 店铺地址 -->
										<view class="f-24 col-9 m-top10 dis-flex flex-y-center">
											<view class="onelist-hidden" style="width:220px;"> {{store.detailed_address}}</view>
										</view>
									</view>
									<store-nav :mobile="store.mobile" :address="store"></store-nav>

								</view>
							</block>
							<block v-if="busitem.showAll == true">
								<view class="store-address dis-flex  flex-y-center flex-x-between border-line border-bottom" v-for="(store,storeIndex) in busitem.store"
								 :key='storeIndex'>
									<view class="store-address-info">
										<view class="col-3 f-30 ">{{store.name}}</view>
										<!-- 店铺电话 -->
										<view class="store-addres-text col-9 twolist-hidden f-24">商家电话:{{store.mobile}}</view>
										<!-- 店铺地址 -->
										<view class="f-24 col-9 m-top10 dis-flex flex-y-center">
											<view class="onelist-hidden" style="width:220px;"> {{store.detailed_address}}</view>
										</view>
									</view>
									<store-nav :mobile="store.mobile" :address="store"></store-nav>

								</view>

							</block>

							<view class="check-item check-more no-bor dis-flex flex-x-center flex-y-center col-9 f-24">
								<view class="" @click="checkMore(busitem)">{{busitem.showAll?"收起":"查看更多"}}</view>
								<view class="iconfont icon-unfold" :class="[busitem.showAll?'icon-fold':'icon-unfold']"></view>
							</view>

						</view>

					</view>

				</view>

				<!-- 团长信息 -->
				<view class="store-info" v-if="order.express_type === 5 && order.bind_reg && order.bind_reg.address">
					<view class="store-title dis-flex flex-x-between flex-y-center border-line border-bottom">
						<view class="store-name f-28 col-3">团长信息</view>
					</view>
					<block>
						<view class="store-address dis-flex  flex-y-center flex-x-between border-line border-bottom">
							<view class="store-address-info">
								<view class="f-28 col-3">
									<image :src="order.bind_reg.avatarUrl" style="width: 80rpx;height: 80rpx;margin-right: 15rpx;"></image>
									{{order.bind_reg.name}}
								</view>
								<view class="f-24 col-9 m-top10 dis-flex flex-y-center">
									<!-- <view class="iconfont icon-location f-24">1.6km </view> -->
									<view class="onelist-hidden" style="width:220px;"> 提货地址：{{order.bind_reg && order.bind_reg.community}}</view>

								</view>
								<view class="onelist-hidden f-24 col-9 m-top10" style="width:220px;"> 联系方式：{{order.bind_reg && order.bind_reg.phone}}</view>
							</view>

							<store-nav :mobile="order.bind_reg.phone" :address="{...order.bind_reg,address:order.bind_reg && order.bind_reg.community}"></store-nav>
						</view>
					</block>
					<view class="self-user f-26 col-3">{{order.address.name}} {{order.address.phone}}</view>
				</view>
			</view>
			<!-- 自提收货 end -->


			<image src="/static/images/order/address_line.png" class="address-line"></image>

			<!-- 物流信息 -->
			<view class="flow-all-money b-f padding-box m-top20" v-if="order.express_type === 1 && order.delivery_status.value == 20">
				<view class="flow-all-list dis-flex">
					<text class="">物流信息</text>
				</view>
				<navigator class="dis-flex" hover-class="none" :url="'./express/express?order_id='+order.order_id">
					<view class="flex-box">
						<view class="dis-flex flow-all-list-cont">
							<text class="col-7">物流公司:{{order.express_company}}</text>
						</view>
						<view class="dis-flex flow-all-list-cont" v-if="!!order.express_no">
							<text class="col-7" :selectable="true">物流单号:{{order.express_no}}</text>
						</view>
					</view>
					<view class="flow-arrow dis-flex">
						<text class="iconfont icon-xiangyoujiantou user-orderJtou"></text>
					</view>
				</navigator>
			</view>
			<!-- 物流信息 end -->

			<!-- 同城配送-配送信息 -->
			<view v-if="order.express_type == 6 && order.rider" class="city-logistics">
				<view class="city-logistics__header">
					<view class="city-logistics__title">配送信息</view>
				</view>
				<view class="city-logistics__content">
					<view class="city-logistics__row">
						<view class="city-logistics__text">
							骑手姓名
						</view>
						<view class="city-logistics__text city-logistics__text--strong" style="margin-left: 30rpx;">
							{{order.rider.real_name}}
						</view>
						<button class="btn-normal city-logistics__btn-phone" style="margin-left: auto;"  @click="makePhoneCall(order.business_store_mobile)"><image class="city-logistics__btn-phone__icon" src="/static/images/icon-make-phone--black.png" mode=""></image>联系商家</button>
					</view>
					<view class="city-logistics__row">
						<view class="city-logistics__text ">
							骑手电话
						</view>
						<view class="city-logistics__text city-logistics__text--strong" style="margin-left: 30rpx;">
							{{order.rider.mobile}}
						</view>
						<button class="btn-normal city-logistics__btn-phone" style="margin-left: auto;"  @click="makePhoneCall(order.rider.mobile)"><image class="city-logistics__btn-phone__icon" src="/static/images/icon-make-phone--black.png" mode=""></image>致电骑手</button>
					</view>
				</view>
			</view>
			<!-- 同城配送-配送信息 end -->

			<!-- 卡密信息 -->
			<view class=" m-top20   m-btm20" v-if="order.order_type === 4 && order.pay_status.value === 20">
				<view class="store-info self-address b-f">
					<view class="store-title dis-flex flex-x-between flex-y-center border-line border-bottom">
						<view class="store-name f-28 col-3">收货信息</view>
					</view>
					<view class="self-user f-26 col-3">{{order.goods?order.goods[0].name:""}} {{order.goods?order.goods[0].mobile:""}}</view>
				</view>
				<view class="store-info self-address b-f m-top20">
					<view class="store-title dis-flex flex-x-between flex-y-center border-line border-bottom">
						<view class="store-name f-28 col-3">发货信息</view>
						<view class="f-24 col-6 dis-flex flex-y-center" @click="cardUseDesc = true">
							<view class="iconfont icon-questionfill card-icon"></view>使用说明
						</view>
					</view>
					<view class="card-list">
						<view class="card-item border-line border-bottom" v-for="(item,index) in orderKeyList" :key="index">
							<view class="card-content col-6 f-28" v-for="(itemKey,indexKey) in item" :key="indexKey">
								<view class="col-3 f-w m-right12 dis-il-block">{{itemKey.key}}: </view> {{itemKey.value}}
								<view class="f-24 card-copy col-9" @click="copyContent(itemKey.value,'text')">复制</view>
							</view>
							<view class="cpoy-all dis-flex flex-x-end">
								<view class="cpoy-all-btn f-24 col-9" @click="copyContent(item,'content')">复制全部</view>
							</view>
						</view>
						<view class="card-item dis-flex flex-x-center flex-y-center col-9 f-24" v-if="order.key && order.key.data && order.key.data.length > 3">
							<view class="" @click="showAll = !showAll">{{showAll?"收起":"查看更多"}}</view>
							<view class="iconfont" :class="[showAll?'icon-fold':'icon-unfold']"></view>
						</view>
					</view>
				</view>

				<popup-view :show="cardUseDesc" type="center" @clickmask="cardUseDesc = false">
					<view class="card-use b-f">
						<view class="card-use-title dis-flex flex-x-between">
							<view class="f-28 col-6">使用说明</view>
							<view class="iconfont icon-close f-42 col-6" @click="cardUseDesc = false"></view>
						</view>
						<scroll-view scroll-y class="card-use-content">
							<parse :html="order.key.kammi_explain"></parse>
						</scroll-view>
						<view class="card-use-btn t-c f-28 col-f" @click="cardUseDesc = false">我知道了</view>
					</view>
				</popup-view>
			</view>
			<!-- 卡密信息 end -->

			<!-- 商品详情 -->
			<view class="padding-box b-f">
				<view @click="goodsDetail" class="b-f" :data-id="item.goods_id" v-for="(item, key) in order.goods" :key="key">
					<list-goods-item :goods-data="item" :group-number="order.groups_group_id > 0? order.group_number : -1 " :refund="cTicketingInfo.isTicketing ? cTicketingInfo.refund_status : item.refund_status"
					 :goodscard="order.is_rebate === 1 && order.goods[0]['goods']['is_member_price']===1? 1:0"></list-goods-item>
				</view>
			</view>
			<!-- 商品详情 end -->
			<!-- 银环票务查看二维码使用 -->
			<block v-if="cTicketingInfo.isYingHuan || ([1,2,5].includes(cTicketingInfo.type) && cTicketingInfo.yinHuanCode && cTicketingInfo.yinHuanCode.length)">
				<view v-for="(item,index) in cTicketingInfo.yinHuanCode" :key="item.code" class="ticketing-sms-card">
					<image class="ticketing-sms-card__img" :src="item.qrcode"></image>
					<view class="ticketing-sms-card__text">核销码{{cTicketingInfo.yinHuanCode.length>1 ? index+1 : ''}}：{{item.code}}</view>
					<view class="ticketing-sms-card__tip"><view class="iconfont icon-zhuyi is-inline"></view>请以短信链接为准！</view>
				</view>
			</block>
			<!-- 银环票务查看二维码使用 end -->

			<!-- 其他票务查看二维码提示 -->
			<view v-else-if="cTicketingInfo.isTicketing && cTicketingInfo.code && cTicketingInfo.qrCode" class="ticketing-sms-card">
				<image class="ticketing-sms-card__img" :src="cTicketingInfo.qrCode"></image>
				<view class="ticketing-sms-card__text">核销码{{cTicketingInfo.code}}</view>
				<view class="ticketing-sms-card__tip"><view class="iconfont icon-zhuyi is-inline"></view>请以短信链接为准！</view>
			</view>
			<!-- 其他票务查看二维码提示 end -->

			<!-- 其他票务查看手机短信提示 -->
			<view v-else-if="cTicketingInfo.isTicketing" class="ticketing-sms-card">
				<image class="ticketing-sms-card__img" :src="getImageRoot('img-sms.png')"></image>
				<view class="ticketing-sms-card__text">请查看手机短信核销码使用~</view>
				
			</view>
			<!-- 其他票务查看手机短信提示 end -->

			<!-- 订单金额 -->
			<view class="flow-all-money b-f padding-box m-top20 price-font-family">
				<view v-if="order.yqd_template" class="dis-flex flow-all-list-cont">
					<text class="flex-five col-3 f-26">充值账号:</text>
					<text class="flex-five t-r">{{order.yqd_template}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont">
					<text class="flex-five col-3 f-26">商品金额:</text>
					<text class="flex-five t-r col-m">{{settingData.currency}}{{order.total_price}}</text>
				</view>
				<view v-if="order.cash_coupon_fee && order.cash_coupon_fee != 0" class="dis-flex flow-all-list-cont">
					<text class="flex-five col-3 f-26">代金券:</text>
					<text class="flex-five t-r col-m">-{{settingData.currency}}{{order.cash_coupon_fee}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.integral_rebate_money > 0">
					<text class="flex-five col-3 f-26">{{balanceSetting.integral_str}}抵扣:</text>
					<text class="flex-five t-r col-m">-{{settingData.currency}}{{order.integral_rebate_money}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.groups_group_id > 0 && order.commander_discount > 0">
					<text class="flex-five col-3 f-26">团长优惠:</text>
					<text class="flex-five t-r col-m">-{{settingData.currency}}{{order.commander_discount}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.member_coupon_price > 0">
					<text class="flex-five col-3 f-26">会员优惠:</text>
					<text class="flex-five t-r col-m">-{{settingData.currency}}{{order.member_coupon_price}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.coupon_price > 0">
					<text class="flex-five col-3 f-26">{{appCoupon.coupon_title}}抵扣:</text>
					<text class="flex-five t-r col-m">-{{settingData.currency}}{{order.coupon_price}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.express_type == 6">
					<text class="flex-five col-3 f-26">包装费用:</text>
					<text class="flex-five t-r col-m">+{{settingData.currency}}{{order.packing_fee}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.express_price > 0">
					<text class="flex-five col-3 f-26">配送费用:</text>
					<text class="flex-five t-r col-m">+{{settingData.currency}}{{order.express_price}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.is_rebate === 1 && order.card_price ">
					<text class="flex-five col-3 f-26">会员卡费用:</text>
					<text class="flex-five t-r col-m">+{{settingData.currency}}{{order.card_price}}</text>
				</view>
				<view class="dis-flex flow-all-list-cont" v-if="order.update_price.value != '0.00'">
					<text class="flex-five col-3 f-26">后台改价:</text>
					<text class="flex-five t-r col-m">{{order.update_price.symbol}}{{settingData.currency}}{{order.update_price.value}}</text>
				</view>
			</view>

			<view class="select b-f">
				<view class="flow-num-box b-f border-line border-top select-flow-num-box">
					<text>实付: </text>
					<text class="flow-money col-m price-font-family">{{settingData.currency}}{{order.pay_price}}</text>
				</view>
			</view>

			<!-- 表单回显 -->
			<view v-if="formDatas && formDatas.length>0" class="order-info module-content m-top20">
				<block v-for="(item,index) in formDatas" :key="index">
					<block v-if="item.field_type==='8'||item.field_type==='10'">
						<view class="info-item dis-flex flex-x-between">
							<view class="item-label col-3 f-26">{{item.name.startname}}:</view>
							<view class="item-info dis-flex flex-x-between flex-y-center">
								<view class="f-24 col-9 custom-form-box">{{ item.default.startappointdata || '-' }}</view>
							</view>
						</view>
						<view class="info-item dis-flex flex-x-between">
							<view class="item-label col-3 f-26">{{item.name.endname}}:</view>
							<view class="item-info dis-flex flex-x-between flex-y-center">
								<view class="f-24 col-9 custom-form-box">{{ item.default.endappointdata || '-' }}</view>
							</view>
						</view>
					</block>
					<view v-else-if="item.field_type==='12'" class="info-item dis-flex flex-x-between">
						<view class="item-label col-3 f-26">{{item.name}}:</view>
						<view class="item-info dis-flex flex-x-between flex-y-center">
							<view class="f-24 col-9 custom-form-box">
								<block v-if="item.default && item.default.length>0">
									<image v-for="(img,idx) in item.default" :key="idx" class="custom-form-img" :src="img" mode="aspectFill"></image>
								</block>
								<text v-else>-</text>
							</view>
						</view>
					</view>
					<view v-else class="info-item dis-flex flex-x-between">
						<view class="item-label col-3 f-26">{{item.name}}:</view>
						<view class="item-info dis-flex flex-x-between flex-y-center">
							<view class="f-24 col-9 custom-form-box">{{ getFormDefault(item) }}</view>
						</view>
					</view>
				</block>


			</view>

			<view class="order-info module-content m-top20">
				<view v-if="cTicketingInfo.isTicketing" class="info-item dis-flex flex-x-between flex-y-center">
					<view class="item-label col-3 f-26">姓名:</view>
					<view class="item-info dis-flex flex-x-between flex-y-center">
						<view class="f-24 col-9">{{cTicketingInfo.name}}</view>
					</view>
				</view>
				<view v-if="cTicketingInfo.isTicketing" class="info-item dis-flex flex-x-between flex-y-center">
					<view class="item-label col-3 f-26">手机号:</view>
					<view class="item-info dis-flex flex-x-between flex-y-center">
						<view class="f-24 col-9">{{cTicketingInfo.phone}}</view>
					</view>
				</view>
				<view class="info-item dis-flex flex-x-between flex-y-center">
					<view class="item-label col-3 f-26">订单编号:</view>
					<view class="item-info dis-flex flex-x-between flex-y-center">
						<view class="f-24 col-9">{{order.order_no}}</view>
						<view class="info-copy-btn" @click="copyContent(order.order_no,'text')">复制</view>
					</view>
				</view>
				<view class="info-item dis-flex flex-x-between flex-y-center" v-if="order.give_integral > 0">
					<view class="item-label col-3 f-26">获得{{balanceSetting.integral_str}}:</view>
					<view class="item-info dis-flex flex-x-between flex-y-center">
						<view class="f-24 col-9">{{$util.removePoint(order.give_integral)}}</view>
					</view>
				</view>
				<view class="info-item dis-flex flex-x-between flex-y-center">
					<view class="item-label col-3 f-26">下单时间:</view>
					<view class="item-info dis-flex flex-x-between flex-y-center">
						<view class="f-24 col-9">{{order.create_time}}</view>
					</view>
				</view>
				<view class="info-item dis-flex flex-x-between flex-y-center" v-if="!!order.delivery_time">
					<view class="item-label col-3 f-26">发货时间:</view>
					<view class="item-info dis-flex flex-x-between flex-y-center">
						<view class="f-24 col-9">{{order.delivery_time}}</view>
					</view>
				</view>
				<view class="info-item dis-flex flex-x-between flex-y-center" v-if="!!order.receipt_time">
					<view class="item-label col-3 f-26">完成时间:</view>
					<view class="item-info dis-flex flex-x-between flex-y-center">
						<view class="f-24 col-9">{{order.receipt_time}}</view>
					</view>
				</view>
				<view class="info-item dis-flex flex-x-between flex-y-center" v-if="order.pay_type !== 'zero'">
					<view class="item-label col-3 f-26">支付方式:</view>
					<view class="item-info dis-flex flex-x-between flex-y-center">
						<view class="f-24 col-9">{{order.pay_type ==="wechat"?"微信":order.pay_type ==="alipay"?"支付宝":order.pay_type ==="admin"?"后台付款":balanceSetting.balance_str}}</view>
					</view>
				</view>
				<view class="info-item dis-flex flex-x-between flex-y-center" v-if="!!order.pay_time">
					<view class="item-label col-3 f-26">支付时间:</view>
					<view class="item-info dis-flex flex-x-between flex-y-center">
						<view class="f-24 col-9">{{order.pay_time}}</view>
					</view>
				</view>
				<view class="info-item dis-flex flex-x-between flex-y-center" v-if="order.buyer_remark.length">
					<view class="item-label col-3 f-26">订单备注:</view>
					<view class="item-info dis-flex flex-x-between flex-y-center">
						<view class="f-24 col-9">{{order.buyer_remark}}</view>
					</view>
				</view>
				<view v-if="cTicketingInfo.isTicketing && cTicketingInfo.is_calendar_price" class="info-item dis-flex flex-x-between flex-y-center">
					<view class="item-label col-3 f-26">有效期:</view>
					<view class="item-info dis-flex flex-x-between flex-y-center">
						<view class="f-24 col-9">仅限{{cTicketingInfo.term}}使用</view>
					</view>
				</view>
			</view>

			<!-- 票务注意事项 -->
			<view v-if="cTicketingAttention.params && cTicketingAttention.params.ueditor" class="ticketing-matters-card">
				<view class="ticketing-matters-card__header">
					注意事项
				</view>
				<view class="ticketing-matters-card__content">
					<!-- 					<view class="ticketing-matters-item">
						<view class="ticketing-matters-item__title">抢购时间：</view>
						<view class="ticketing-matters-item__text">即日起至2020.09.01</view>
					</view> -->
					<diy-rich-text :params="cTicketingAttention.params"></diy-rich-text>
				</view>
			</view>
			<!-- 票务注意事项 end -->
			
			<!-- 拒绝原因 -->
			<view v-if="order.cdo_order && order.cdo_order.refuse_reason" class="ticketing-matters-card">
				<view class="ticketing-matters-card__header">
					拒绝原因
				</view>
				<view class="ticketing-matters-card__content">
					<view class="f-24 col-9">{{order.cdo_order && order.cdo_order.refuse_reason}}</view>
				</view>
			</view>
			<!-- 拒绝原因 end -->

			<view class="flow-fixed-footer b-f dis-flex flex-y-center flex-x-end" v-if="options && options.showType !== 'business'">
				<block v-for="(itemBtn,btnIndex) in order.app_show_button" :key="itemBtn.event">
					<view @click.stop="orderHandle(itemBtn.event,order_id)" v-if="itemBtn.value === 1 && itemBtn.event != 'appointment' && itemBtn.event != 'appointmentIfno'"
					 class="footer-btn f-24" :class="{'main-bg-color auxiliary-color':itemBtn.event === 'get' || itemBtn.event === 'pay' || itemBtn.event === 'check' || itemBtn.event === 'agglomeration'}">{{itemBtn.text}}</view>

					<view class="footer-btn f-24" v-if="itemBtn.event === 'appointment' && itemBtn.value === 1" @click.stop="navigationTo('pages/subPages/subscribe/confirm?goods_id='+order.goods[0].goods_id+'&num='+order.goods[0].total_num+'&bus_id='+order.goods[0].bus_id+'&order_id='+order.order_id+'&goods_sku_id='+order.goods[0].spec_sku_id)">
						{{itemBtn.text}}
					</view>

					<view class="footer-btn f-24" v-if="itemBtn.event === 'appointmentIfno' && itemBtn.value === 1" @click.stop="navigationTo('pages/subPages/subscribe/info?goods_id='+order.goods[0].goods_id+'&order_id='+order.order_id+'&bus_id='+order.goods[0].bus_id+'&goods_sku_id='+order.goods[0].spec_sku_id)">
						{{itemBtn.text}}
					</view>
				</block>
			</view>
		</view>
		<!-- 订单支付组件 -->
		<OrderPay  ref="orderPay" @payBefore="payOrderSubmit" @paySuccess="paySuccess" @payFail="payFail"></OrderPay>
		<!-- 查看卡密 -->
		<KammiModel :orderKami="orderKami" v-if="showKami" @closeKami="showKami=false"></KammiModel>
		

		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import ListGoodsItem from '@/components/template/ListGoodsItem.vue'
	import LeadAttention from '@/components/template/LeadAttention.vue'
	import OrderPay from '@/components/template/OrderPayPopups.vue'
	import PopupView from '@/components/template/PopManager.vue'
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	import StoreNav from '@/components/template/StoreNav.vue'
	import DiyRichText from '@/components/page/pageComponents/RichText.vue'
	import KammiModel from '@/components/template/KammiModel.vue'
	import App from '@/common/js/app.js'
	import pageShare from "@/common/js/pageShareMixin.js"
	// import util from "@/common/js/util.js"
	let timer = null
	export default {
		mixins: [pageShare],
		data() {
			return {
				order_id: null,
				order: {
					bind_reg: {}
				},
				xxxRes: {},
				showPayList: false, // 支付组件显示隐藏
				lastPayTime: 0,
				is_check_status_give: '',
				order_type: '',
				options: {},
				isShowBtns: true,
				remainingTime: '',
				showAll: false,
				showAllCode: false, // 显示全部核销码
				payEndTime: null, // 结束时间
				cardUseDesc: false, // 使用说明显示
				isIos: '',
				orderKami: [],
				showKami: false,
				formDatas: [] // 表单列表
			}
		},
		components: {
			ListGoodsItem,
			OrderPay,
			PopupView,
			Parse,
			StoreNav,
			LeadAttention,
			KammiModel,
			DiyRichText
		},
		watch: {
			payEndTime() {
				let that = this
				that.$nextTick(() => {
					that.setEndTime()
				})
			}
		},
		computed: {
			// 获取表单对应值
			getFormDefault() {
				return function(item) {
					if (item.field_type === '1' || item.field_type === '2' || item.field_type === '3' || item.field_type === '7' ||
						item.field_type === '9') {
						return item.default || '-'
					} else if (item.field_type === '4' || item.field_type === '6') {
						let defaultVal = ''
						item.meal.map(meal => {
							if (meal.id === item.default) {
								defaultVal = meal.balanceone
							}
						})
						return defaultVal || '-'
					} else if (item.field_type === '5') {
						let defaultVal = []
						item.meal.map(meal => {
							(item.default || '').split(',').map(def => {
								if (meal.id === def) {
									// defaultVal += meal.balanceone
									defaultVal = [
										...defaultVal,
										meal.balanceone
									]
								}
							})
						})
						return defaultVal.length > 0 ? defaultVal.join('；') : '-'
					} else if (item.field_type === '11') {
						let {
							address: {
								province,
								city,
								region
							}
						} = item,
						defaultVal = (province || '') + (city || '') + (region || '')
						return defaultVal || '-'
					}
				}
			},
			// 票务订单注意事项富文本
			cTicketingAttention() {
				return {
					params: {
						ueditor: this.$util.deepGet(this.order, 'goods.0.goods.by_know', '')
					}
				}
			},
			// 格式化的票务订单的一些信息
			cTicketingInfo() {
				return {
					// 1:自我游，2：天时同城，5:票景通
					type: +this.$util.deepGet(this.order, 'ticket.ticket_type',-1),
                	// 是否是银环票务
                	isYingHuan: [3].includes(+this.$util.deepGet(this.order, 'ticket.ticket_type', -1)),
					// 是否是票务商品（包括银环票务）
					isTicketing: +this.$util.deepGet(this.order, 'goods.0.goods.transport_type', '') === 60,
					// 姓名
					name: this.$util.deepGet(this.order, 'goods.0.name', ''),
					// 手机号
					phone: this.$util.deepGet(this.order, 'goods.0.mobile', ''),
					// 有效期
					term: this.$util.deepGet(this.order, 'ticket.travel_date', ''),
					// 是否有日历价格
					is_calendar_price: +this.$util.deepGet(this.order, 'goods.0.goods.is_calendar_price', -1) === 1,
					// 核销码
					code: this.$util.deepGet(this.order, 'ticket.code', ''),
					// 银环票务的核销码和二维码（数组） 1:自我游，2：天时同城，5:票景通都算银环
					yinHuanCode: this.$util.deepGet(this.order, 'ticket.all', []).map(item => ({
						qrcode: item.path,
						code: item.code
					})),
					// 二维码
					qrCode: this.$util.deepGet(this.order, 'ticket.pft_UUqrcodeIMG', ''),
					// 售后状态
					refund_status: this.$util.deepGet(this.order, 'ticket.ticket_refund_status', ''),
				}
			},
			// 核销码状态文字
			checkStatusText() {
				return (is_refund, check_status, is_past) => is_refund === 0 ? (check_status === 0 ? (is_past === '0' ? '未核销' :
					'已过期') : (check_status === 1 ? '已核销' :
					'已退款')) : (check_status === 2 ? '已退款' : '售后中')
			},
			stateImg() {
				if (!!this.order.pay_status) {
					let {
						pay_status,
						delivery_status,
						receipt_status,
						is_closed,
						is_comment,
						express_type
					} = this.order,
						orderStatusImg = '/static/images/order/';
					[
						pay_status,
						delivery_status,
						receipt_status,
						is_closed,
						is_comment
					] = [
						pay_status,
						delivery_status,
						receipt_status,
						is_closed,
						is_comment
					].map(val => val.value)
					if (is_closed === 1) { // 已关闭
						orderStatusImg += 'yiguanbi'
					} else if (pay_status === 10) { // 待付款
						orderStatusImg += 'daifukuan'
					} else if (express_type === 3) {
						orderStatusImg += 'daishiyong'
					} else if (delivery_status === 10) { // 待发货
						orderStatusImg += 'daifahuo'
					} else if (receipt_status === 10) {
						orderStatusImg += 'daishouhuo'
					} else {
						orderStatusImg += 'yiwancheng'
					}
					orderStatusImg += '.png'
					return orderStatusImg
				}
			},
			codeList() {
				if (!!this.order.vercode) {
					let vercode = JSON.parse(JSON.stringify(this.order.vercode))
					vercode = vercode.filter((val, index) => {
						let timestamp = (new Date()).getTime()
						if (val.end_time !== '-1') {
							if (timestamp > Number(val.end_time * 1000)) {
								val.is_past = '1'
							} else {
								val.is_past = '0'
							}
						} else {
							val.is_past = '0'
						}
						return index < (this.showAll ? this.order.vercode.length : 3)
					})
					return vercode
				}
			},
			orderKeyList() {
				if (this.order.order_type === 4 && this.order.key && this.order.key.data.length > 0) {
					return this.order.key.data.filter((val, index) => index < (this.showAll ? this.order.key.data.length : 3))
				}
			},
			balanceSetting() {
				return this.settingData.balance || {}
			},
			addressCopyText() {
				let {
					address: addressData
				} = this.order
				addressData = addressData || {}
				addressData.region = addressData.region || {}
				if(addressData.end_address) {
					return   `${addressData.name} ${addressData.phone}\n${addressData.end_address}`
				}else if (!!addressData) {
					let {
						name,
						phone,
						detail,
						region: {
							province,
							city,
							region
						}
					} = addressData
					return `${name} ${phone}\n${province} ${city} ${region} ${detail}`
				}
			}
		},
		onLoad(options) {
			this.options = options
			App.showLoading()
			// #ifdef MP
			uni.hideShareMenu()
			// #endif
			// #ifdef H5
			this.pageShareMixin_hideShare()
			// #endif
		},
		onShow() {
			this.getOrderDetail(this.options)
			this.formList(this.options)
		},
		onUnload() {
			clearTimeout(timer)
			uni.removeStorageSync('orderDetail')
		},
		methods: {
			// 电话按钮点击事件
			makePhoneCall(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			// 表单回显
			formList(options) {
				let order_id = options.order_id,
					_this = this
				App._post_form('form.form/formSubmitDetail', {
					order_id
				}, function(res) {
					let {
						data: {
							pc_value
						}
					} = res
					_this.formDatas = pc_value || []
					console.log('表单回显')
					console.log(pc_value)
				})
			},
			/**
s			 * 核销码自提码隐藏
			 * @param {string} vercode
			 */
			ShowVercode(vercode) {
				let set = uni.getStorageSync('appSetting')

				console.log('vercode', uni.getStorageSync('appSetting'))
				if (set.businessStore.good_store_code == '2' && this.options.showType == 'business') {
					let str = '' + vercode
					let str_1 = str.substring(0, 3),
						str_2 = str.substring(6, 9)
					return str_1 + '***' + str_2
				}
				return vercode
			},
			/**
			 * 获取订单详情
			 */
			getOrderDetail({
				order_id,
				showType
			}) {
				let _this = this,
					systemInfo = uni.getSystemInfoSync().model,
					isIos = systemInfo.indexOf('iPhone') !== -1
				_this.isIos = isIos
				// this.order_id = order_id;
				App._get('user.order/detail', {
					order_id
				}, function(result) {
					_this.order_id = result.data.order_id


					console.log('发多岁会计法但是看了己方的so', result.data.is_check_status_give)
					if (result.data.is_check_status_give) {
						_this.is_check_status_give = result.data.is_check_status_give
					}
					if (result.data.order_type == 7) {
						_this.order_type = result.data.order_type
					}
					result.data.create_time = result.data.createtime
					if (showType && showType === 'business') {
						_this.isShowBtns = false
					} else {
						_this.isShowBtns = result.data.app_show_button.filter(val => val.value === 1).length > 0
					}


					// 核销码到期时间处理
					if (result.data.vercode.length > 0) {
						// 核销码显示顺序整理
						result.data.vercode.sort((a, b) => a.check_status - b.check_status)
					}
					// 订单时间处理
					for (let key in result.data) {
						if (key.indexOf('_time') !== -1) {
							result.data[key] = result.data[key] > 0 ? _this.$util.formatTime(result.data[key], 'info', '-') : null
						}
					}

					// 剩余支付时间计算
					if (result.data.pay_status.value === 10 && result.data.order_status === 10 && result.data.payEndTime !== 0) {
						_this.payEndTime = result.data.payEndTime
					}

					let isCompleteGroups = result.data.groups_id === 0 ? !0 : (result.data.group_status === 1 || result.data.group_status ===
						3)
					if (result.data.express_type === 3) {
						if (result.data.pay_status.value === 20 && result.data.validity_status.value === 0 && isCompleteGroups) {
							let end_time = _this.$util.deepGet(result, 'data.vercode.0.end_time', '')
							if (end_time) {
								_this.remainingTime = end_time === '-1' ? -1 : _this.$util.formatTime(end_time, 'info', '-')
							}

						}

						// 核销门店显示
						let store = {
							name: result.data.goods[0].name,
							phone: result.data.goods[0].mobile,
							detail: result.data.merchat.store
						}
						result.data.store = store
						result.data.gift_business && result.data.gift_business.forEach(item => {
							_this.$set(item, 'showAll', false)
						})
						console.log(result.data, '=============result.data')
					}

					// 订单商品售后状态
					_this.setRefundStatus(result.data)

					_this.order = result.data
					App.hideLoading(1000)
					uni.hideLoading()
				})
			},
			/**
			 * 订单商品售后状态
			 */
			setRefundStatus({
				express_type,
				goods,
				vercode,
				is_refund, // 售后状态 10未申请 20申请中 30已完成
				pay_status, // 支付状态
				delivery_status, // 发货状态
				receipt_status, // 收货状态
				after_sale_minutes, // 确认收货几天之后不能发起售后
				receipt_time, // 收货时间
				group_status, // 拼团状态
				groups_group_id, // 拼团团id,
				validity_status
			}) {
				let detailShowType = this.options.showType
				console.log('setRefundStatus')
				goods.map(goodsItem => {
					let refund_status = -1, // 1申请售后 2已申请售后 3已完成售后 -1不显示售后按钮
						goodsInfo = goodsItem.goods,
						after_sales = goodsInfo.after_sales, // 是否支持申请售后 10不支持 20支持
						isGroups = groups_group_id !== 0,
						groupStatus = isGroups ? group_status : -1,
						groupsRefund = isGroups ? (groupStatus === 1 || groupStatus === 3) : !0,
						validity = this.$util.deepGet(goodsItem, 'goods.validity'),
						validity_starttime_1 = this.$util.deepGet(goodsItem, 'goods.validity_starttime.1'),
						alow_status = this.$util.deepGet(goodsItem, 'goods.after_sales_detail.status'),
						alow_house = this.$util.deepGet(goodsItem, 'goods.after_sales_detail.alow_house'),
						alow_day = this.$util.deepGet(goodsItem, 'goods.after_sales_detail.alow_day')
						
					// #ifdef MP-TOUTIAO
					// fix https://weliam.coding.net/p/lingdian/requirements/issues/10561/detail
					alow_status = undefined
					after_sales = 20
					// #endif
					if (this.order_type == 7) {
						refund_status = -1
					} else {
						if (this.is_check_status_give == 1) {
							refund_status = -1
						} else if (+alow_status === 20 && +this.$util.deepGet(validity_status, 'value') === 1) {
							console.log('申请按钮不显示1')
							refund_status = -1
						} else if (+alow_status === 20 && +validity === 30 && validity_starttime_1 < +new Date() + (alow_day * 24 * 60 *
								60 * 1000) + (alow_house * 60 * 60 * 1000)) {
							console.log('申请按钮不显示2')
							refund_status = -1
						} else if (pay_status.value === 20) {
							// 已经付款
							console.log('已经付款',groupsRefund)
							// 拼团状态
							if (groupsRefund) {
								console.log('拼团状态')
								// 核销商品
								if (express_type === 3) {

									let codeNum = vercode.length, // 核销码数量
										code_last_refund = vercode.filter(val => val.is_refund === 0).length, // 未售后核销码
										check_code_num = vercode.filter(val => val.check_status === 2).length // 已核销核销码
									console.log('hahhaa', {
										after_sales,
										codeNum,
										code_last_refund,
										check_code_num,
										vercode,
										receipt_status,
										is_refund
									})
									// 支持申请售后
									if (after_sales === 20) {
										if (code_last_refund === 0) { // 完成所有核销码售后
											refund_status = codeNum === 1 ? 2 : 3
										} else if (code_last_refund === vercode.length) { // 未申请售后
											if (receipt_status.value === 20) { // 已核销
												refund_status = -1
											} else if (is_refund === 30 && receipt_status.value === 10) { // 未核销退款
												refund_status = -1
											} else { // 未核销
												refund_status = 1
											}
										} else if (code_last_refund < vercode.length) { // 存在售后核销码
											if (code_last_refund === codeNum - check_code_num) {
												refund_status = 1
											} else {
												refund_status = 2
											}
										}
									} else {
										refund_status = -1
									}
								} else {
									// 已申请售后
									if (is_refund > 10) {
										if (is_refund === 20) { // 已申请售后
											if (goodsItem.refund.status === 1) { // 售后状态 1进行中 2已拒绝 3完成
												refund_status = 2
											} else if (goodsItem.refund.status === 2) {
												refund_status = 1
											} else {
												refund_status = -1
											}
										} else if (is_refund === 30) { // 已完成
											refund_status = -1
										}
									} else {
										// 未申请售后
										if (receipt_status.value === 10) { // 未收货
											if ([1,6].indexOf(express_type) !== -1) {
												refund_status = delivery_status.value === 10 ? 1 : -1 // 待发货
											} else if (express_type === 2) {
												refund_status = 1 // 待自提
											}
										} else if (receipt_status.value === 20) { // 已收货
											let newreceipt_time = this.isIos ? (receipt_time ? receipt_time.replace(/-/g, '/') : '') : receipt_time,
												oneDay = 86400,
												nowTime = new Date().getTime() / 1000,
												canRefundTime = Number(new Date(newreceipt_time)) / 1000 + after_sale_minutes * oneDay // 能够申请售后的时间(秒)
											if (nowTime < canRefundTime) { // 能够申请售后
												if ([1,6].indexOf(express_type) !== -1) {
													refund_status = 1 // 已收货
												} else if (express_type === 2) {
													refund_status = -1 // 已自提
												}
											} else {
												refund_status = -1 // 未到能够申请售后的时间
											}
										}
									}
								}
							} else {
								refund_status = -1
							}
						} else {
							// 未付款
							refund_status = -1
						}
					}

					if (detailShowType === 'business' || +after_sales === 10) {
						refund_status = -1
					}

					goodsItem.refund_status = refund_status
				})
			},

			/**
			 * 跳转到商品详情
			 */
			goodsDetail(e) {
				let goods_id = e.currentTarget.dataset.id
				App.navigationTo({
					url: 'pages/subPages/goods/index/index?' + App.urlEncode({
						goods_id,
						cgp: this.options.cgp
					})
				})
			},

			/**
			 * 更多门店
			 */
			moreStore(bus_id) {
				App.navigationTo({
					url: 'pages/subPages/store/list?bus_id=' + bus_id
				})
			},

			/**
			 * 订单操作
			 */
			orderHandle(handleType, order_id) {
				let _this = this,
					comment_id = _this.order.comment ? _this.order.comment.comment_id : null,
					handleList = [
						'cancel',
						'get'
					],
					navigationTo = [
						'express',
						'comment'
					],
					kammi = ['kammi'],
					groupsInfo = ['agglomeration']
				if(handleType === 'distribution' && _this.order.express_type == 6) {
					// 跳转到配送地图
					App.navigationTo({
					    url: `pages/subPages/cityDistribution/map?order_id=${_this.order.order_id}`
					})
				}else if(handleType === 'get' && _this.order.express_type == 6) {
					App.showError('确认收货?', res => {
					    if (res.confirm) {
					        App._post_form('citydelivery.Index/confirmGoods', {
					            order_id: _this.order.order_id
					        }, result => {
					            _this.getOrderDetail({
					            	order_id: _this.order.order_id
					            })
					        })
					    }
					}, true)
				}else if (handleList.includes(handleType)) {
					App.showError(`确认${handleType === 'cancel' ? '要取消该订单吗' : '收到商品'}?`, res => {
						if (res.confirm) {
							uni.showLoading()
							App._post_form(`user.order/${handleType === 'get' ? 'receipt' : handleType}`, {
								order_id
							}, result => {
								_this.getOrderDetail({
									order_id
								})
							})
						}
					}, true)
				} else if (groupsInfo.includes(handleType)) {
					App.navigationTo({
						url: `pages/subPages/groups/index/index?order_id=${order_id}`
					})
				} else if (navigationTo.includes(handleType)) {
					App.navigationTo({
						url: `pages/mainPages/order/${handleType}/${comment_id ? 'success' : handleType}?order_id=${order_id}${comment_id ? '&&type=detail&&comment_id=' + comment_id : ''}`
					})
				} else if (kammi.includes(handleType)) {
					console.log('kami ~')
					App._postP('user.order/getOrderKammi', {
						order_id
					}).then(res => {
						console.log(res)
						this.orderKami = res.data.data
					})

					this.showKami = true

				} else if (handleType === 'show_donation') {
					// 跳转到礼包转赠页面
					if(_this.order.a_lbsp && _this.order.a_lbsp.title){
						App.navigationTo({
							url: `pages/subPages/orderPresent/giftGoodsSelect`,
							query: {
								order_id
							}
						})
					}else {
						App.navigationTo({
							url: `pages/subPages/orderPresent/normalGoodsSelect`,
							query: {
								order_id
							}
						})
					}
					
				} else {
					_this[`${handleType}Order`](order_id)
				}
			},

			/**
			 * 订单核销
			 */
			checkOrder(order_id) {
				let _this = this
				App.navigationTo({
					url: 'pages/mainPages/order/confirm?order_id=' + order_id
				})
			},

			/**
			 * 复制文本
			 */
			copyContent(content, copyType) {
				if (copyType === 'content') {
					content = content.map(val => `${val.key}:${val.value}`).join('\n')
				}
				console.log(content)
				App.copyTextHandle(content)
			},
			/**
			 * 支付方式弹窗
			 */
			onToggleList() {
				this.$refs.orderPay.onToggleList()
			},

			/**
			 * 发起付款
			 */
			payOrder(e) {
				let _this = this
				let order_id = _this.order_id
				_this.$store.commit('orderPay', {
					order_id,
					pay_from: 'order'
				})
				this.onToggleList()
			},

			/**
			 * 提交支付订单
			 */
			payOrderSubmit(e) {
				// 显示loading
				uni.showLoading({
					title: '正在处理...'
				})
			},

			/**
			 * 订单支付成功
			 */
			paySuccess(e) {
				uni.hideLoading()
				// 跳转到已付款订单
				this.getOrderDetail({
					order_id: e.order.order_id
				})
			},

			/**
			 * 订单支付失败
			 */
			payFail(result) {
				uni.hideLoading()
				// 2-微信小程序 3-H5 4-公众号 7-支付宝小程序 8-百度小程序 9-头条小程序
				console.log('payFail', result)
				let clientType = this.$store.state.clientType,
					errMsg = null
				if (clientType === '2') {
					let isCancel = result.errMsg === 'requestPayment:fail cancel'
					errMsg = isCancel ? '订单未支付' : result.err_desc
				} else if (clientType === '4') {
					errMsg = result.err_msg === 'get_brand_wcpay_request:cancel' ? '订单未支付' : '支付失败'
				} else if (clientType === '7') {
					errMsg = result.resultCode === '6001' ? '订单未支付' : '支付失败'
				} else if (clientType === '8') {
					errMsg = '支付失败'
				} else if (clientType === '9') {
					errMsg = result.errMsg === 'requestPayment:fail cancel' ? '订单未支付' : '支付失败'
				}
				App.showError(errMsg)
			},

			/**
			 * 展开核销码
			 */
			checkMore(item) {
				this.$set(item, 'showAll', !item.showAll)
			},
			/**
			 * 订单支付倒计时
			 **/
			setEndTime() {
				let that = this,
					nowTime = new Date().getTime() / 1000,
					endtime = that.payEndTime,
					remainingTime = endtime - nowTime
				if (remainingTime > 0) {
					let hh = parseInt(remainingTime / 60 / 60 / 24 * 24),
						mm = parseInt((remainingTime / 60 % 60) + (hh * 60)),
						ss = parseInt(remainingTime % 60),
						time = {
							mm,
							ss
						}
					that.$nextTick(() => {
						that.remainingTime = `${time.mm > 0 ? mm + '分钟' : ''}${ss}秒`
					})
				} else {
					that.getOrderDetail({
						order_id: that.options.order_id
					})
					clearTimeout(timer)
					return false
				};
				timer = setTimeout(that.setEndTime, 1000)
			}
		}
	}
</script>

<!-- 没有scoped 也不敢轻易加上了20200914 -->
<style lang="scss">
	.flow-distribution {
		padding: 18rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.flow-distribution .flow-dis {
		font-size: 30rpx;
	}

	.flow-distribution-left {
		flex: 14;
	}

	.flow-distribution-left .m-l {
		color: #333;
		float: right;
	}

	.flow-distribution-right {
		flex: 1;
	}

	.flow-distribution image {
		width: 30rpx;
		height: 30rpx;
		margin-top: 6rpx;
		float: right;
	}

	.flow-message-box {
		padding: 20rpx 15px;
		position: relative;
	}

	.flow-message-box .flow-message-title {
		color: #777;
	}

	.flow-message-box textarea {
		height: 100rpx;
		width: 100%;
		margin-top: 10rpx;
		padding: 10rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.flow-message-box .flow-message-num {
		position: absolute;
		bottom: 34rpx;
		right: 30rpx;
		font-size: 26rpx;
		color: #777;
	}

	/*asdasd*/

	.flow-distribution .flow-dis {
		padding-right: 15px;
	}

	.flow-message-box {
		border-bottom: 1rpx solid #f1f1f1;
	}

	.flow-message-box .cont {
		padding: 10px 0;
		color: #000;
	}

	.order-cont {
		/* padding: 12rpx 0; */
		justify-content: space-between;
	}

	.order-cont .order-num text,
	.order-cont .time {
		color: #888;
	}

	.order-cont .order-num text,
	.order-cont .order-time text {
		color: #777;
		font-size: 26rpx;
	}

	.order-header {
		border-bottom: 1rpx solid #f1f1f1;
		padding: 15rpx 0;
	}

	.order-header text {
		font-size: 30rpx;
	}

	.order-header text.title {
		color: #333;
	}

	.flow-list .header {
		position: relative;
		padding: 15rpx 0;
		background: #fff;
		border-bottom: 1rpx solid #f1f1f1;
	}

	.flow-list .header text {
		padding-left: 80rpx;
		font-size: 32rpx;
	}

	.flow-list .header image {
		width: 34rpx;
		height: 37rpx;
		position: absolute;
		top: 50%;
		margin-top: -18rpx;
		left: 15px;
	}

	/*
.checkout_list {
  padding: 15px;
  background: #fff;
}

.checkout_list .flow-shopList {
  padding: 5rpx 0 10rpx;
  border-bottom: 1rpx solid #f1f1f1;
}

.checkout_list .flow-shopList:last-child {
  border-bottom: 0;
} */
	.custom-form-box {
		max-width: 550rpx;
		word-break: break-all;
		text-align: right;
	}

	.custom-form-img {
		width: 100rpx;
		height: 100rpx;
		border-radius: 6rpx;
		margin-left: 10rpx;
	}

	.chackout-right-detail,
	.chackout-left-detail {
		font-size: 34rpx;
		color: #333;
	}

	.chackout-left-detail {
		line-height: 44px;
	}

	/* 顶部状态栏 */

	.detail-header {
		position: relative;
		width: 100%;
		height: 170rpx;
		// background-image: url("~@/static/images/order/order-header.png");
		// background-color: var(--bg-color);
		background-size: 100% 100%;
		overflow: hidden;
	}

	.detail-header .header-backdrop .header-img {
		width: 750rpx;
		height: 170rpx;
	}

	.detail-header .state-img {
		position: absolute;
		top: 50%;
		right: 5%;
		transform: translateY(-50%);
		z-index: 1;
		width: 130rpx;
	}

	.header-state {
		padding: 0 50rpx;
	}

	/* #ifdef H5 */
	.detail-header .header-backdrop {
		z-index: 1;
	}

	.header-state {
		z-index: 2;
	}

	/* #endif */

	.flow-checkout-header {
		padding: 30rpx;
	}

	.address-copy {
		position: absolute;
		top: 20rpx;
		right: 30rpx;
		border-radius: 4px;
		border: 1rpx solid #ccc;
		padding: 4rpx 16rpx;
		font-size: 24rpx;
		color: #555;
	}

	.info-item {
		margin-bottom: 24rpx;
	}

	.order-info .info-item:last-child {
		margin-bottom: 0;
	}

	.info-copy-btn {
		font-size: 22rpx;
		padding: 8rpx 16rpx;
		border-radius: 40rpx;
		border: 1rpx solid #EEEEEE;
		margin-left: 12rpx;
	}

	.flow-fixed-footer {
		height: 100rpx;
	}

	.flow-fixed-footer .footer-btn {
		color: #333333;
		padding: 18rpx 30rpx;
		border-radius: 40rpx;
		border: 1rpx solid #EEEEEE;
		margin-right: 30rpx;
	}

	.flow-fixed-footer .footer-btn.pay {
		/* background: #FFD940; */
		border: 1rpx solid transparent;
	}

	/* 自提地址 */
	.self-address {
		padding: 0 30rpx;

	}

	.store-title {
		padding: 28rpx 0 20rpx;
		/* border-bottom: 1rpx solid #EEEEEE; */
	}

	.store-name {
		padding-left: 16rpx;
		position: relative;
	}

	.store-name::after {
		content: " ";
		position: absolute;
		top: 4rpx;
		left: -2rpx;
		bottom: 4rpx;
		width: 8rpx;
		background: var(--theme-color);
		border-radius: 20rpx;
	}

	.store-address {
		padding: 30rpx 20rpx;
	}

	.store-address .icon-line {
		margin: 0 14rpx;
		width: 0;
		height: 60rpx;
		border-right: 1rpx solid #e0e0e0;
	}

	.store-address .icon-location {
		font-size: 24rpx;
	}

	.store-address .icon-dianhua,
	.store-address .icon-daohang {
		font-size: 42rpx;
	}

	.self-user {
		padding: 28rpx 0;
	}

	.check-item {
		height: 74rpx;
		line-height: 74rpx;
		border-bottom: 1rpx solid #EEEEEE;
	}

	.check-item.check-more {
		height: 80rpx;
		line-height: 80rpx;
	}

	.check-item.no-bor {
		border: 0;
	}

	.check-item.check-more .iconfont {
		font-size: 28rpx;
	}

	.address-line {
		height: 6rpx;
		width: 100vw;
		display: block;
	}

	.select-flow-num-box {
		border: none !important;
	}

	/* 卡密 */
	.card-icon {
		margin-right: 8rpx;
	}

	.card-item {
		padding: 20rpx 0;
	}

	.card-content {
		line-height: 2em;
	}

	.card-copy {
		display: inline-block;
		margin-left: 30rpx;
	}

	.cpoy-all-btn {
		line-height: 1.8em;
		padding: 0 12rpx;
		border-radius: 40px;
		border: 1rpx solid #999999;
	}

	/* 卡密使用说明 */
	.card-use {
		width: 80vw;
		border-radius: 12rpx;
		padding-bottom: 30rpx;
	}

	.card-use-title {
		height: 80rpx;
		line-height: 80rpx;
		border-bottom: 1rpx solid #EEEEEE;
		padding: 0 30rpx;
	}

	.card-use-content {
		padding: 30rpx;
		height: 500rpx;
		overflow-x: hidden;
		width: auto;
		max-width: 100%;
	}

	.card-use-btn {
		border-radius: 50px;
		background: #FFD940;
		height: 70rpx;
		line-height: 70rpx;
		margin: 0 30rpx;
	}
</style>

<!-- 票务组件的样式 -->
<style lang="scss" soped>
	// 票务顶部订阅提示
	.ticketing-top-tip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		height: 60rpx;
		padding: 0 20rpx;

		background-color: #FDFBE6;

		.iconfont {
			color: #FFA62E;
			font-size: 24rpx;
		}
	}

	.ticketing-top-tip__left {
		display: flex;
		align-items: center;
	}

	.ticketing-top-tip__text {
		color: #FFA62E;
		font-size: 24rpx;
		font-weight: bold;
	}

	.ticketing-top-tip__right {
		display: flex;
		align-items: center;
	}

	.ticketing-top-tip__btn-op {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 34rpx;
		padding: 0 16rpx;
		font-size: 20rpx;
		color: #FFA62E;
		border: 1px solid currentColor;
		border-radius: 17rpx;
	}

	.ticketing-top-tip__divider {
		height: 20rpx;
		width: 1px;
		margin: 0 20rpx;
		background-color: #999;
	}

	.ticketing-top-tip__icon-close {
		color: #999999;
	}

	// 票务顶部订阅提示 end
	// 票务查看手机短信提示
	.ticketing-sms-card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 400rpx;
		padding: 30rpx;
		margin-top: 20rpx;
		background-color: #fff;
	}

	.ticketing-sms-card__img {
		width: 260rpx;
		height: 260rpx;
	}

	.ticketing-sms-card__text {
		margin-top: 30rpx;
		font-size: 28rpx;
		font-weight: bold;
	}
	.ticketing-sms-card__tip {
		margin-top: 20rpx;
		font-size: 24rpx;
		color: #999999;
		.iconfont {
			color: inherit;
			font-size: 30rpx;
			line-height: 1;
			margin-right: 8rpx;
			vertical-align: middle;
		}
	}

	// 票务查看手机短信提示 end
	// 票务注意事项
	.ticketing-matters-card {
		box-sizing: border-box;
		background-color: #fff;
		margin-top: 20rpx;
		padding: 0 30rpx;
	}

	.ticketing-matters-card__header {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		height: 110rpx;
		border-bottom: 1px solid #eee;
	}

	.ticketing-matters-card__content {
		box-sizing: border-box;
		padding: 30rpx 0;
	}

	.ticketing-matters-item {
		display: flex;
		flex-wrap: wrap;

		&+& {
			margin-top: 16rpx;
		}
	}

	.ticketing-matters-item__title {
		flex-shrink: 0;
		white-space: nowrap;
		color: #FF4444;
		font-size: 28rpx;
	}

	.ticketing-matters-item__text {
		color: #333;
		font-size: 28rpx;
	}

	// 票务注意事项 end
</style>
<!-- 票务组件的样式 end -->

<style lang="scss" scoped>
	// 同城配送-配送信息
	.city-logistics {
		box-sizing: border-box;
		margin: 20rpx auto;
		background-color: #fff;
		padding: 0 30rpx;
	}
	.city-logistics__header {
		display: flex;
		align-items: center;
		height: 80rpx;
	}
	.city-logistics__title {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}
	.city-logistics__content {
		box-sizing: border-box;
		padding: 15rpx 0;
		border-top: 1px solid #EEEEEE;
	}
	.city-logistics__row {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		min-height: 70rpx;
		padding: 16rpx 0;
	}
	.city-logistics__text {
		font-size: 24rpx;
		color: #999;
	}
	.city-logistics__text--strong {
		color: #333333;
		font-weight: bold;
	}
	.city-logistics__btn-phone {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 160rpx;
		height: 50rpx;
		font-size: 24rpx;
		color: #333;
		border-radius: 10rpx;
		border: 1px solid #333333;
	}
	.city-logistics__btn-phone__icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 10rpx;
	}
	// 同城配送-配送信息 end
	// 底部footer
	.page-order-footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		z-index: 5;
	}
	.city-footer {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		min-height: 98rpx;
		padding: 16rpx 30rpx;
		border-top: 1px solid rgba($color: #EEEEEE, $alpha: 0.7);
	}
	.city-footer__btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 160rpx;
		height: 64rpx;
		font-size: 24rpx;
		padding: 16rpx 0;
		border-radius: 10rpx;
		&+& {
			margin-left: 20rpx;
		}
	}
	.city-footer__btn--ghost {
		border: 1px solid #eee;
	}
	// 底部footer end
</style>
