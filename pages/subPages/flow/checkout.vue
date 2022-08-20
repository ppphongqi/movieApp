<template>
	<view :style="themeColor">
		<view class="container">
			<view>
				<!-- JSON.stringify(this.bind_reg)=='{}' || this.bind_reg.length==0 -->
				<blcok v-if="options.transport_type == 40 ||(options.transport_type == 40&&isCart)">
					<!-- 判断是否是社区团购商品 -->

					<block v-if="bind_reg.length==0 || bind_reg==0">
						<!-- 判断是否绑定团长 -->
						<view class="btn-select-team" @click="navigationTo('pages/subPages/cgp/address/address')">
							<view class="iconfont icon-add1"></view>点击选择团长
						</view>

					</block>
					<!-- 社区团购 -->
					<view style="margin-bottom: 20rpx;" v-else @click="navigationTo('pages/subPages/cgp/address/address')">
						<view class="content-main b-f">
							<view class="dis-flex">
								<image :src="bind_reg.avatarUrl" class="m-left12"></image>
								<view style="width: 90%;">
									<view class="dis-flex flex-y-center">
										<view class="col-3 f-28 onelist-hidden">{{bind_reg.name}}</view>
										<view class="f-20" style=" border: 1rpx solid #2AC418; color: #2AC418;
										margin-left: 10rpx;padding: 0rpx 4rpx 0rpx 4rpx; border-radius: 4rpx;">团长</view>
									</view>
									<view class="col-9 f-24 twolist-hidden m-top12">{{bind_reg.community}}</view>
								</view>
							</view>
						</view>
						<image src="/static/images/order/address_line.png" class="address-line"></image>
					</view>
				</blcok>
			</view>

			<view class="page-nav b-f" v-if="options.transport_type == 20 ||(options.transport_type == 60 && options.is_express == 1)">
				<block v-if="navList.length > 1">
					<page-nav-bar @navItemClick="expressTypeChange" ref="pageNav" :nav-list="navList" :current="navList[0].id"></page-nav-bar>
				</block>
				<!-- 物流配送 -->
				<view @click="selectAddress(!!address?address.address_id:false)" v-if="['express','city'].includes(expressType)">
					<view v-if="!!address">
						<view class="b-f">
							<view class="flow-checkout-header dis-flex flex-y-center">
								<view class="flow-header-left">
									<view class="flow-checkout-address f-28">
										<text v-if="address.default === 1">默认</text>
										{{address.region.province}} {{address.region.city}} {{address.region.region}}
									</view>
									<view class="flow-checkout-address-detail f-32">
										{{address.detail}}
									</view>
									<view class="flow-checkout-admin f-28 col-6">
										<text class="m-right12">{{address.name}}</text>
										<text>{{address.phone}}</text>
									</view>
								</view>
								<view class="flow-header-right">
									<text class="iconfont icon-jinrujiantou1 user-orderJtou"></text>
								</view>
							</view>
						</view>
					</view>
					<view v-else>
						<view class="store-info dis-flex flex-x-center">
							<view class="choose-store">选择地址</view>
						</view>
					</view>
				</view>
				<!-- 门店自提 -->
				<view class="self-container" v-if="expressType ==='self'">
					<view class="store-info dis-flex">
						<block v-if="!!store">
							<view class="store-detail dis-flex flex-dir-row" @click="storeSelect(store.id,goodsData.bus_id,goodsData.goods_id)">
								<view class="iconfont icon-location"></view>
								<view class="store-content">
									<view class="store-user f-28 col-3">{{store.name}} {{store.mobile}}</view>
									<view class="store-address f-26 col-9">{{store.address}}</view>
								</view>
							</view>
						</block>
						<block v-else>
							<view class="choose-store" @click="storeSelect(null,goodsData.bus_id,goodsData.goods_id)">选择门店</view>
						</block>
					</view>
					<!-- <view class="self-userinfo m-top20" v-if="tradeStyle == 0">
						<view class="input-item dis-flex flex-y-center border-line border-bottom">
							<view class="input-label">姓名</view>
							<input class="input" type="text" v-model="name" placeholder="请输入联系人姓名" />
						</view>
						<view class="input-item dis-flex flex-y-center border-line border-bottom">
							<view class="input-label">电话</view>
							<input class="input" type="number" v-model="phone" placeholder="请输入联系人电话" />
						</view>
					</view> -->
				</view>
				<image src="/static/images/order/address_line.png" class="address-line"></image>
			</view>
			<!-- 商品列表 -->
			<view class="goods-list">
				<block v-if="isCart">
					<block v-for="(storeItem,index) in goodsData" :key="index">
						<view class="store-item b-f">
							<view class="goods-store dis-flex flex-y-center">
								<view class="iconfont icon-shop col-3"></view>
								<view class="col-3 f-26 onelist-hidden m-left12">{{storeItem.name}}</view>
							</view>
							<block v-for="(goods,gIndex) in storeItem.goods_list" :key="goods.goods_id">
								<navigator :url="is_group_type ? '../goods/index/index?goods_id='+goods.goods_id + '&group_id=' + options.group_id : '../goods/index/index?goods_id='+goods.goods_id">
									<view class="goods-info dis-flex flex-y-center">
										<view class="goods-image-box p-r">
											<image :src="goods.image[0] ? goods.image[0].file_path : ''" class="goods-image"></image>
											<view v-if="group_join_num != -1" class="group-num">{{group_join_num}}人团</view>
										</view>
										<view class="goods-detail dis-flex flex-dir-column flex-x-between flex-box">
											<view class="goods-title f-28 col-3 onelist-hidden">{{goods.goods_name}}</view>
											<view class="goods-scp-num dis-flex flex-y-center flex-x-between">
												<view v-if="!!goods.goods_sku.goods_attr" class="goods-scp col-9 f-26 dis-flex twolist-hidden">
													{{isMeal?'套餐':'规格'}}:{{goods.goods_sku.goods_attr}}</view>
												<view class="dis-flex flex-box t-c f-24 col-9">×{{goods.total_num}}</view>
											</view>
										</view>
									</view>
								</navigator>
							</block>
							<view class="dis-flex flex-y-line flex-x-between f-26" style="padding: 10rpx 30rpx;" v-if="options.is_zt == 1&&expressType ==='self'">
								<text class="flex-five col-9 f-24">自提门店</text>
								<view class="flex-five t-r dis-flex flex-y-center flex-x-end" :class="'col-'+[!!storeItem.store?'3':'9']"
								 @click="storeSelect(storeItem.store?storeItem.store.id:null,storeItem.id,storeItem.goods_list[0].goods_id)">
									<text v-if="storeItem.store">{{storeItem.store.name}}</text>
									<text v-else>请选择自提门店</text>
									<text class="iconfont icon-jinrujiantou1" style="margin:-.1em -.1em 0 -.2em;"></text>
								</view>
							</view>
							<view class="dis-flex flex-y-line flex-x-between p-left-right-30">
								<text class="flex-five f-24 col-9">小计</text>
								<view class="flex-five t-r price-font-family col-m">{{settingData.currency}}{{(storeItem && storeItem.total_price) | moneyFormat}}</view>
							</view>
							<view v-if="expressType == 'city'" class="dis-flex flex-y-line flex-x-between p-left-right-30">
								<text class="flex-five f-24 col-9">配送费</text>
								<view class="flex-five t-r price-font-family col-m">+{{settingData.currency}}{{(storeItem && storeItem.express_city_price) | moneyFormat}}</view>
							</view>
							<view v-if="expressType == 'city'" class="dis-flex flex-y-line flex-x-between p-left-right-30">
								<text class="flex-five f-24 col-9">包装费</text>
								<view class="flex-five t-r price-font-family col-m">+{{settingData.currency}}{{(storeItem && storeItem.packing_fee) | moneyFormat}}</view>
							</view>
							<view class="user-input b-f">
								<!-- 备注留言 -->
								<view class="user-input-item dis-flex flex-y-center" style="padding: 10rpx 0;" v-if="orderForm.remark ==='1'">
									<input @input="bindRemark" class="ipt-wrapper input" placeholder="请输入留言信息给卖家" :value="remark"
									 placeholder-style="font-size:24rpx;color:#999999"></input>
								</view>
							</view>
						</view>
					</block>
				</block>
				<block v-else>
					<view class="b-f">
						<navigator :url="is_group_type ? '../goods/index/index?goods_id='+goodsData.goods_id + '&group_id=' + options.group_id : '../goods/index/index?goods_id='+goodsData.goods_id">
							<view class="goods-info dis-flex flex-y-center">
								<view class="goods-image-box p-r">
									<image :src="goodsData.image&&goodsData.image[0] ? goodsData.image[0].file_path : ''" class="goods-image"></image>
									<view v-if="group_join_num != -1" class="group-num">{{group_join_num}}人团</view>
								</view>
								<!-- <view class="goods-detail dis-flex flex-dir-column flex-x-between flex-box"> -->
								<view class="dis-flex flex-dir-column flex-box">
									<view class="goods-title f-28 twolist-hidden">{{goodsData.goods_name}}</view>
									<view style="display: flex;margin-top: 20rpx;flex-wrap:wrap;">
										<view v-for="(item,index) in goodsData.buy_and_give_rules" class="f-24" style="color:#FF4444;">
											<view v-if="item.is_buy_and_give==1" style="border: 1px solid #FF4444;margin-right: 6rpx;border-radius:8rpx;padding: 4rpx;margin-bottom: 8rpx;">买{{item.purchase}}赠{{item.give}}</view>
										</view>
									</view>

								</view>


							</view>
						</navigator>
						<!-- <view class="order-flow-num-box b-f padding-box border-line border-top flow-border-none">
							<text>共{{order_total_num}}件商品，合计</text>
							<text class="flow-money col-m price-font-family">{{settingData.currency}}{{order_total_price}}</text>
						</view> -->
						<view class="order-return dis-flex flex-x-between flex-y-center p-top-bom-10" v-if="!!bank">
							<view class="f-24 col-3">
								<block v-if="bank.bank_name && bank.bank_name.length > 0">
									<image :src="bank.bank_url" class="order-retur-bank"></image>
									<!-- {{bank.bank_name ? bank.bank_name[0] :""}} -->
								</block>
							</view>
							<view class="f-24 col-3">{{bank.bank_name ? bank.bank_name[1] : ""}}支付{{bank.type === 10?"立減":"可返现"}}<text class="col-m">{{bank.type === 10?(bank.discount_type === 1?bank.reduce_money:bank.reduce_money[0]+"~"+bank.reduce_money[1]):bank.return_money}}</text>元</view>
						</view>
					</view>
				</block>

				<!-- 票务日期选择按钮 -->
				<view v-if="options.transport_type == 60 && is_calendar_price" class="ticketing-info-card">
					<view class="ticketing-info-card__header" :class="{'has-content': cCalendarPriceTime.timeStamp}">
						<view class="ticketing-info-card__title">
							使用日期
						</view>
						<button class="ticketing-info-card__btn-add btn-normal" @click="calendarPricePopupVisible = true">{{cCalendarPriceTime.timeStamp ? cCalendarPriceTime.timeStr : '请选择日期'}}
							<view class="iconfont icon-jinrujiantou"></view>
						</button>
					</view>
				</view>
				<!-- 票务日期选择按钮 end -->

				<!-- 单选的套餐（如票务套餐） -->
				<view v-if="options.transport_type == 60 && options.is_meal==1" class="meal-selector">
					<view class="meal-selector__header">套餐选择</view>
					<view class="meal-selector__content">
						<view v-for="(item,index) in mealData" :key="item.goods_sku_id" class="meal-selector__option" :class="{'is-active': ticketingSpecSkuActiveId === item.spec_sku_id}"
						 @click="handleMealSelectorOptionClick(item,index)">
							{{item.title}}
						</view>
					</view>
					<view class="meal-selector__footer">
						<view class="meal-selector__footer__left">购买数量</view>
						<view class="meal-selector__footer__right">
							<view class="meal-selector__btn-reduce iconfont icon-move" :class="{'is-disabled':order_total_num===1}" @click="totalNumChange('down')"></view>
							<view class="meal-selector__num" @click="openEditNumPopup({type:'normal',num:order_total_num})">{{order_total_num}}</view>
							<view class="meal-selector__btn-add iconfont icon-add" :class="{'is-disabled':cIsTicketingMaxBuyLimit}" @click="totalNumChange('up')"></view>
						</view>
					</view>
				</view>
				<!-- 单选的套餐（如票务套餐）end -->
				<view v-else-if="options.transport_type == 60 " class="goods-num dis-flex flex-x-between flex-y-center f-24 b-f m-top20">
					<view class="col-3"><text style="font-size: 29rpx;">购买数量</text><text class="col-9" v-if="isLimitBuy">(每人限购{{goodsData.limit_num}}件)</text></view>
					<view class="num-btns-box dis-flex flex-y-center">
						<view class="num-btn iconfont icon-move f-w " :class="{disabled:order_total_num<=1}" @click="totalNumChange('down')"></view>
						<view class="num-btn" @click="openEditNumPopup({type:'normal',num:order_total_num})">{{order_total_num}}</view>
						<view class="num-btn iconfont icon-add  f-w" :class="{disabled:isMaxBuyLimit}" @click="totalNumChange('up')"></view>
					</view>
				</view>

				<!-- 票务用户信息 -->
				<block v-if="options.transport_type == 60">
					<view class="ticketing-info-card" v-for="(item,index) in ticketingUserActiveItems" :key="item.info_id">
						<view class="ticketing-info-card__header">
							<view class="ticketing-info-card__title">
								用户信息({{index+1}}/{{ticketingUserActiveItems.length}})<view v-if="item.default" class="ticketing__label-default">默认</view>
							</view>
							<button class="ticketing-info-card__btn-edit btn-normal" @click="handleBtnSelectTicketingUserClick(item)">修改</button>
						</view>
						<view class="ticketing-info-card__content">
							<view class="ticketing-info-item">
								<view class="ticketing-info-item__title">姓名</view>
								<view class="ticketing-info-item__text">{{item.name}}</view>
							</view>
							<view class="ticketing-info-item">
								<view class="ticketing-info-item__title">手机</view>
								<view class="ticketing-info-item__text">{{item.phone}}</view>
							</view>
							<view v-if="goodsData.id_card == 1" class="ticketing-info-item">
								<view class="ticketing-info-item__title">身份证号</view>
								<view class="ticketing-info-item__text">{{item.credit_no}}</view>
							</view>
						</view>
					</view>
				</block>

				<!-- 票务用户信息 end -->


				<view class="f-24 b-f m-top20 goods-num" v-if="options.is_meal==1 && options.transport_type != 60">
					<view class="col-3 ">套餐选择 {{options.meal_together_buy ==2 ?'(只能选择一种套餐)':''}}</view>

					<view v-for="(meal,mealindex) in mealData" :key='mealindex' style="border-bottom: 1px dashed #e7e7e7;">
						<!-- 套餐选择 -->
						<view class="dis-flex flex-x-between  flex-y-center m-top30">
							<view class="">
								<view class="col-9">{{meal.title}}</view>
								<view class="dis-flex flex-y-center">
									<view class="m-top-btm20">
										<text class="col-3">{{meal.goods_price}}</text>
										<text v-if="isShowStock === 1" class="col-9 m-left12 ">(库存{{meal.stock_num}})</text>
									</view>
									<view v-if="goodsData.is_member_price === 1" class="dis-flex flex-y-center member-coupon-view-y m-left12">
										<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
										<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">{{memberDiyFont.discount_font}}<text class="member-coupon-price">{{meal.member_coupon_price}}</text>元</view>
									</view>
								</view>
							</view>
							<view class="">
								<view class="num-btns-box dis-flex flex-y-center">
									<view class="num-btn iconfont icon-move f-w " :class="{disabled:meal.goods_num==0}" @click="totalMealNumChange('down',{goods_id:meal.goods_id,num:meal.goods_num,goods_sku_id:meal.spec_sku_id,stock_num:meal.stock_num},mealindex)"></view>
									<view class="num-btn" @click="openEditNumPopup({type:'meal',mealIndex:mealindex,num:meal.goods_num})">{{meal.goods_num}}</view>
									<view class="num-btn iconfont icon-add  f-w" :class="{disabled:meal.goods_num==meal.stock_num}" @click="totalMealNumChange('up',{goods_id:meal.goods_id,num:meal.goods_num,goods_sku_id:meal.spec_sku_id,stock_num:meal.stock_num},mealindex)"></view>
								</view>
							</view>
						</view>

						<!-- 套餐预约时间选择 -->
						<view class="user-input m-top20 b-f" v-if="options.is_reservation==1 && options.isPreShopping==1 && options.is_meal==1 &&meal.goods_num>0"
						 @click="navigationTo('pages/subPages/subscribe/confirm?goods_id='+meal.goods_id+'&goods_sku_id='+meal.spec_sku_id+'&bus_id='+goodsData.bus_id+'&type=1'+'&time='+meal.time+'&store='+meal.storeBus+'&remark='+meal.remarkSub+'&is_meal='+options.is_meal+'&index='+mealindex)">
							<view class="user-input-item dis-flex flex-y-center border-line border-bottom">
								<view class="input-label col-9 f-28">选择预约时间</view>
								<input class="input" type="text" v-model="meal.time" placeholder="选择预约时间" placeholder-style="font-size:24rpx;color:#999999" />
							</view>
							<view class="user-input-item dis-flex flex-y-center border-line border-bottom">
								<view class="input-label col-9 f-28">预约门店</view>
								<input class="input" type="text" v-model="meal.storeBus" placeholder="选择预约门店" placeholder-style="font-size:24rpx;color:#999999" />
							</view>
							<view class="user-input-item dis-flex flex-y-center border-line border-bottom">
								<view class="input-label col-9 f-28">预约留言</view>
								<input class="input" type="text" v-model="meal.remarkSub" placeholder="请填写预约备注" placeholder-style="font-size:24rpx;color:#999999" />
							</view>

						</view>
					</view>
				</view>
			</view>

			<view v-if="!isCart && options.is_meal!=1 && options.transport_type != 60" class="goods-num dis-flex flex-x-between flex-y-center f-24 b-f m-top20">
				<view class="col-3"><text style="font-size: 29rpx;">购买数量</text><text class="col-9" v-if="isLimitBuy">(每人限购{{goodsData.limit_num}}件)</text></view>
				<view class="num-btns-box dis-flex flex-y-center">
					<view class="num-btn iconfont icon-move f-w " :class="{disabled:order_total_num<=1}" @click="totalNumChange('down')"></view>
					<view class="num-btn" @click="openEditNumPopup({type:'normal',num:order_total_num})">{{order_total_num}}</view>
					<view class="num-btn iconfont icon-add  f-w" :class="{disabled:isMaxBuyLimit || isTieredPriceGoods != 0}" @click="totalNumChange('up')"></view>
				</view>
			</view>

			<!-- 订单优惠信息 -->
			<view class="money-list m-top20">
				<!-- 积分抵扣使用 -->
				<view class="dis-flex flex-y-center flex-x-between order-integral f-24 b-f" v-if="!!max_integral&&!!max_rebate_money && options.is_meal!=1">
					<!-- <view class="">使用积分 <text class="f-24">(可用积分<text class="col-m">{{total_integral}}</text>)</text></view> -->
					<!-- <view class="">可用{{max_integral}}{{balanceSetting.integral_str}}抵扣<text class="col-m">{{max_rebate_money}}</text>元</view> -->
					<view class="">{{balanceSetting.integral_str}}共{{user_integral | moneyFormat}},可用{{max_integral | moneyFormat}}最大抵扣<text
						 class="col-m">{{max_rebate_money}}</text>元</view>
					<switch checked="true" class="integral-switch" @change="is_integral_rebate = $event.detail.value" :color="topColor" />
				</view>
				<view class="flow-all-money b-f">
					<view class="dis-flex flow-all-list border-line border-bottom flow-border-none">
						<text class="flex-five">小计</text>
						<view class="flex-five t-r">
							<text class="price-font-family col-3">{{orderGoodsPrice | moneyFormat}}元</text>
						</view>
					</view>
					<view class="dis-flex flow-all-list border-line border-bottom flow-border-none" v-if="(options.order_type === '1' && member_coupon_price != 0) || (options.transport_type == '40' && member_coupon_price != 0)">
						<text class="flex-five">{{memberDiyFont.member_font}}{{memberDiyFont.discount_font}}</text>
						<view class="flex-five t-r">
							<text class="price-font-family">-{{member_coupon_price}}元</text>
						</view>
					</view>
					<!-- 积分抵扣 -->
					<view class="dis-flex flex-y-center flex-x-between flow-all-list border-line border-bottom flow-border-none" v-if="is_integral_rebate && !!max_integral && !!max_rebate_money && options.is_meal!=1">
						<view class="flex-five">{{balanceSetting.integral_str}}抵扣</view>
						<view class="dis-flex flex-y-center t-r">
							<text class="price-font-family">-{{max_rebate_money | moneyFormat}}元</text>
						</view>
					</view>
					<view v-if="is_group_discount" class="dis-flex flow-all-list border-line border-bottom flow-border-none">
						<text class="flex-five">团长优惠</text>
						<view class="flex-five t-r">
							<text class="price-font-family">-{{is_group_discount | moneyFormat}}元</text>
						</view>
					</view>
					<view class="dis-flex flow-all-list border-line border-bottom flow-border-none" v-if="!options.group_id && !options.activityId && !is_bargain_type && couponNum > 0 && options.is_meal!=1">
						<text class="flex-five">优惠</text>
						<view class="flex-five t-r">
							<view class="" @click="togglePopupCoupon">
								<block v-if="couponNum > 0">
									<text class="price-font-family" v-if="selectCoupon&&selectCoupon.user_coupon_id">-{{cut_price | moneyFormat}}{{selectCoupon.coupon_type === 30?"元运费":"元"}}</text>
									<text class="col-m" v-else>有{{ couponNum }}个优惠可用</text>
									<!-- <text class="col-m" v-else>有{{ couponNum }}张{{appCoupon.coupon_title}}可用</text> -->
									<text class="iconfont icon-xiangyoujiantou user-orderJtou"></text>
								</block>
								<text v-else class="col-9">无优惠可用</text>
							</view>
						</view>
					</view>
					<!-- 快递配送费用 -->
					<view class="dis-flex flow-all-list border-line border-bottom flow-border-none" v-if="expressType ==='express'">
						<text class="flex-five">配送费用</text>
						<view class="flex-five t-r">
							<view v-if="!!address">
								<text class="price-font-family" v-if="intra_region === 1">+{{ expressPrice | moneyFormat}}元</text>
								<text class="col-9" v-else>不在配送范围</text>
							</view>
							<view v-else>
								<text class="col-9">请先选择配送地址</text>
							</view>
						</view>
					</view>
					<!-- 快递配送费用 end -->
					<!-- 同城配送费用 -->
					<view class="dis-flex flow-all-list border-line border-bottom flow-border-none" v-if="expressType ==='city'">
						<text class="flex-five">配送费用</text>
						<view class="flex-five t-r">
							<view v-if="!!address">
								<text class="price-font-family">+{{ express_city_price | moneyFormat}}元</text>
							</view>
							<view v-else>
								<text class="col-9">请先选择配送地址</text>
							</view>
						</view>
					</view>
					<!-- 同城配送费用 end -->
					<!-- 同城配送包装费 -->
					<view class="dis-flex flow-all-list border-line border-bottom flow-border-none" v-if="expressType ==='city'">
						<text class="flex-five">包装费</text>
						<view class="flex-five t-r">
							<view v-if="!!address">
								<text class="price-font-family">+{{ packing_fee | moneyFormat}}元</text>
							</view>
							<view v-else>
								<text class="col-9">请先选择配送地址</text>
							</view>
						</view>
					</view>
					<!-- 同城配送包装费 end -->
					<view class="dis-flex flow-all-list border-line border-bottom flow-border-none" v-if="goods_type==='member_goods' && !!cardId">
						<text class="flex-five">会员卡费用</text>
						<view class="flex-five t-r">
							<text class="price-font-family">+{{card_price | moneyFormat}}元</text>
						</view>
					</view>
					<view class="dis-flex flow-all-list border-line border-bottom flow-border-none">
						<text class="flex-five">实付金额</text>
						<view class="flex-five t-r">
							<text class="price-font-family">{{ actual_pay_price  | moneyFormat}}元</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 开通会员卡 -->
			<view class="member b-f m-top20 bor-radius-10upx" v-if="goods_type==='member_goods' && member_info && member_info.is_member!==1">
				<view class="member-header dis-flex">
					<view class="header-left dis-flex flex-y-center">
						<view class="left-member-logo"></view>
						<view class="left-member-title f-24 onelist-hidden">{{!!member_data.card_title?member_data.card_title:'会员卡'}}</view>
					</view>
					<view class="header-right f-24 t-c col-3 onelist-hidden">现在勾选开卡，本单再减<text>{{settingData.currency}}{{isMeal ? (member_coupon_price > 0 ? member_coupon_price : member_coupon_price_fake) : coupon_price}}</text></view>
				</view>
				<view class="member-list">
					<scroll-view scroll-y="true">
						<block v-for="(member_items,index) in cardList" :key="index" v-if="index<=member_number">
							<view class="member-list-items border-line border-bottom" @click="select_card(member_items)">
								<view class='member-name-nowprice dis-flex flex-x-between m-btm10'>
									<view class="col-3 f-32">{{member_items.card_title}}</view>
									<view class="member-nowprice f-32 f-w">{{settingData.currency}}{{member_items.card_price}}</view>
								</view>
								<view class='member-date-oldprice dis-flex flex-x-between'>
									<block v-if="!(!!member_items.coupon)">
										<view class="col-9 f-24">有效期:{{member_items.card_type===2?member_items.card_time_date['start_time']+'至'+member_items.card_time_date['end_time']:member_items.card_time_date+'天'}}</view>
									</block>
									<block v-else>
										<view class="col-9 f-24">赠:{{member_items.coupon.name}}{{member_items.coupon_number}}张</view>
									</block>
									<view class="col-9 f-24" style="text-decoration: line-through;">{{settingData.currency}}{{member_items.card_marking_price}}</view>
								</view>
								<view class="select-logo">
									<!-- <image :src="member_items.card_id===cardId?'/static/images/member/selectmember.png':'/static/images/member/not-selectmember.png'"
									 mode=""></image> -->

									<radio value="" style="zoom: .7;width: 60rpx;height: 40rpx;line-height: 40rpx;" :color="topColor" :checked="member_items.card_id===cardId" />

								</view>
							</view>
						</block>
					</scroll-view>
					<view v-if="cardList.length>1" class="member-list-more t-c f-24 col-9 p-top-bom-10" @click="moreCardList">{{cardList.length===member_number?'收起':'查看更多'}}
						<text class="iconfont more-icon" :class="cardList.length===member_number?'icon-fold':'icon-unfold'"></text>
					</view>
				</view>
			</view>
			<view class="user-input m-top20 b-f" v-if="options.is_reservation==1 && options.isPreShopping==1 && options.is_meal!=1"
			 @click="navigationTo('pages/subPages/subscribe/confirm?goods_id='+goodsData.goods_id+'&goods_sku_id='+options.goods_sku_id+'&bus_id='+goodsData.bus_id+'&type=1'+'&time='+time+'&store='+storeBus+'&remark='+remarkSub)">
				<view class="user-input-item dis-flex flex-y-center border-line border-bottom">
					<view class="input-label col-9 f-28">选择预约时间</view>
					<input class="input" type="text" v-model="time" placeholder="选择预约时间" placeholder-style="font-size:24rpx;color:#999999" />
				</view>
				<view class="user-input-item dis-flex flex-y-center border-line border-bottom">
					<view class="input-label col-9 f-28">预约门店</view>
					<input class="input" type="text" v-model="storeBus" placeholder="选择预约门店" placeholder-style="font-size:24rpx;color:#999999" />
				</view>
				<view class="user-input-item dis-flex flex-y-center border-line border-bottom">
					<view class="input-label col-9 f-28">预约留言</view>
					<input class="input" type="text" v-model="remarkSub" placeholder="请填写预约备注" placeholder-style="font-size:24rpx;color:#999999" />
				</view>

			</view>
			<!-- 用户填写信息 -->
			<view v-if="options.transport_type != 60" class="user-input m-top20 b-f">
				<block v-if="expressType !=='express'">
					<view class="user-input-item dis-flex flex-y-center border-line border-bottom" v-if="orderForm.user_name ==='1'">
						<view class="input-label col-9 f-28">姓名</view>
						<input class="input" type="text" v-model="name" placeholder="请输入姓名" placeholder-style="font-size:24rpx;color:#999999" />
					</view>
					<view class="user-input-item dis-flex flex-y-center" v-if="orderForm.phone ==='1'">
						<view class="input-label col-9 f-28">手机</view>
						<input type="number" class="input" maxlength="11" v-model="phone" placeholder="请输入手机号" placeholder-style="font-size:24rpx;color:#999999" />
					</view>
				</block>
				<!-- 备注留言 -->
				<view class="user-input-item dis-flex flex-y-center" style="padding: 10rpx 0;" v-if="orderForm.remark ==='1' && !isCart">
					<input @input="bindRemark" class="ipt-wrapper input" placeholder="请输入留言信息给卖家" :value="remark" placeholder-style="font-size:24rpx;color:#999999"></input>
				</view>
			</view>
			
			<!-- 亿奇达(虚拟商品) -->
			<view v-if="options.transport_type == 70 && cExtraFormItemList.length" class="user-input m-top20 b-f">
				<view class="user-input-item dis-flex flex-y-center">
					<view class="input-label">充值信息</view>
				</view>
				<view v-for="(item,index) in cExtraFormItemList" :key="index" class="user-input-item dis-flex flex-y-center" style="padding: 10rpx 0;">
					<view class="input-label col-9 f-28">{{item.txt}}</view>
					<input v-if="item.type === 'input'" class="input" type="text" v-model="extraForm.yqd_template[index]" :placeholder="item.tips" placeholder-style="font-size:24rpx;color:#999999" />
				</view>
			</view>
			<!-- 亿奇达(虚拟商品) end -->

			<!-- 商品不退款协议 -->
			<view v-if="cNeedNoRefund" class="no-refund" @click="refundAgreementPopupVisible = true">
				<view class="no-refund__left">
					<radio style="zoom: .7;width: 60rpx;height: 40rpx;line-height: 40rpx;" :color="topColor" :checked="noRefundchecked"
					 @click.stop="noRefundchecked = !noRefundchecked" />
				</view>
				<view class="no-refund__center">我已阅读并同意《商品不退款协议》</view>
				<view class="no-refund__right">
					<view class="iconfont icon-jinrujiantou"></view>
				</view>
			</view>
			<!-- 商品不退款协议 -->


			<diy-form v-if="diyDatas.length>0" ref="diyForm" @changeFormDatas="changeFormDatas" :form-id="form_id" :diy-datas="diyDatas"></diy-form>

		</view>

		<!-- 提交订单 -->
		<view class="flow-fixed-footer b-f">
			<view class="dis-flex chackout-box">
				<view class="chackout-left pl-12 col-3">合计:
					<text class="col-m f-32 m-left12 price-font-family">
						{{ actual_pay_price | moneyFormat}}
						<text class="col-m f-26">元</text>
					</text>
				</view>

				<bind-mobile-button v-if="isShowBindBtn" :bind-number="phone" @onBindSuccess="bindMobile"></bind-mobile-button>
				<view @click="submitOrder" class="chackout-right p-r ">
					<text class="flow-btn f-32 help-bg-color" @click="saveFormId('pay', {'type': 'normal','goods_id': options.goods_id || ''})">提交订单</text>
					<!-- options.goods_id--商品ID -->
				</view>
			</view>
		</view>
		<!-- 优惠券弹出框 -->
		<popup-view :show="showBottomPopup" type="bottom" @clickmask="togglePopupCoupon">
			<view class="popup__coupon">
				<page-nav-bar @navItemClick="couponTypeChange" :nav-list="couponTypeList" :current="couponType"></page-nav-bar>
				<!-- 优惠券列表 -->
				<scroll-view scroll-y="true" class="coupon-list" :style="{height:couponswiperHeight+'px'}">
					<coupon-sheet ref="coupon" coupontype="is_use" :showType="couponType ==='is_use'?'coupon':'bonus'" :coupon-list="couponType ==='is_use'?coupon_list:coupon_list_no"
					 @radioChange="selectCouponTap" :iscoupon-checked="1"></coupon-sheet>
				</scroll-view>
				<view class="footer-fixed f-30">
					<view @click="doNotCouponTap" class="order-bt main-bg-color auxiliary-color" style="width:100%">不使用优惠</view>
				</view>
			</view>
		</popup-view>
		<!-- 票务选择用户弹窗 -->
		<popup-view :show="options.transport_type == 60 && ticketingUserPopupVisible" type="bottom" @clickmask="ticketingUserPopupVisible = false">
			<view class="ticketing-user-selector">
				<view class="ticketing-user-selector__header">
					<view class="ticketing-user-selector__title">选择用户信息</view>
					<button class="ticketing-user-selector__btn-add btn-normal" @click="handleBtnAddTicketingUserClick">新增用户<view
						 class="iconfont icon-add"></view></button>
				</view>
				<view class="ticketing-user-selector__content">
					<scroll-view scroll-y style="height: 444rpx;">
						<view v-for="item in cTicketingUserData" :key="item.id" class="ticketing-user-item" :class="{'is-active':ticketingUserActiveItem.info_id == item.info_id}"
						 @click="handleTicketingUserItemClick(item)">
							<view class="ticketing-user-item__left">
								<view class="ticketing-user-item__icon-radio"></view>
							</view>
							<view class="ticketing-user-item__center">
								<view class="ticketing-user-item__name">{{item.name}}
									<view v-if="item.default" class="ticketing__label-default">默认</view>
								</view>
								<view class="ticketing-user-item__phone">手机号 {{item.phone}}</view>
							</view>
							<view class="ticketing-user-item__right">
								<image class="ticketing-user-item__btn-edit" :src="getImageRoot('icon-edit-circle.png')" @click.stop="handleBtnEditTicketingUserClick(item)"></image>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</popup-view>
		<!-- 票务选择用户弹窗 end -->
		<!-- 票务编辑用户弹窗 -->
		<popup-view :show="options.transport_type == 60 && opUserPopupVisible" type="center">
			<!-- 避免https://weliam.coding.net/p/lingdian/iterations/6072/issues/6239的问题 -->
			<view v-if="options.transport_type == 60 && opUserPopupVisible" class="ticketing-user-editor">
				<view class="ticketing-user-editor__header">
					<button v-if="opUserPopupType === 'edit'" class="ticketing-user-editor__btn-del btn-normal" @click="handleBtnDelTicketingUserClick(opUserForm)">
						删除
					</button>
					<view class="ticketing-user-editor__title">{{cTicketingUserTemplate.title}}</view>
					<button class="ticketing-user-editor__btn-cancel btn-normal" @click="opUserPopupVisible = false">
						取消
					</button>
				</view>
				<view class="ticketing-user-editor__content">
					<view class="ticketing-user-editor__row">
						<view class="ticketing-user-editor__row__left">
							姓名
						</view>
						<view class="ticketing-user-editor__row__right">
							<input v-model="opUserForm.name" class="ticketing-user-editor__input" type="text" placeholder="请输入" />
						</view>
					</view>
					<view class="ticketing-user-editor__row">
						<view class="ticketing-user-editor__row__left">
							手机号
						</view>
						<view class="ticketing-user-editor__row__right">
							<input v-model="opUserForm.phone" maxlength="11" class="ticketing-user-editor__input" type="number" placeholder="请输入" />
						</view>
					</view>
					<view v-if="goodsData.id_card == 1" class="ticketing-user-editor__row">
						<view class="ticketing-user-editor__row__left">
							身份证号
						</view>
						<view class="ticketing-user-editor__row__right">
							<input v-model="opUserForm.credit_no" maxlength="18" class="ticketing-user-editor__input" placeholder="请输入" />
						</view>
					</view>
					<view class="ticketing-user-editor__row">
						<view class="ticketing-user-editor__row__left">
							设置为默认用户信息
						</view>
						<view class="ticketing-user-editor__row__right">
							<switch :checked="opUserForm.default == 1" class="ticketing-user-editor__switch" color="#FFD940" @change="opUserForm.default = $event.detail.value?'1':'2'" />
						</view>
					</view>
					<view class="ticketing-user-editor__row">
						<button class="ticketing-user-editor__btn-submit btn-normal" @click="doOpTicketingUser">{{cTicketingUserTemplate.btnTitle}}</button>
					</view>
				</view>
			</view>
		</popup-view>
		<!-- 票务编辑用户弹窗 end -->
		<!-- 票务日历价格选择弹窗 -->
		<popup-view :show="options.transport_type == 60 && calendarPricePopupVisible" type="bottom" @clickmask="handleCalendarPriceConfirm">
			<calendar-price :value="cCalendarPriceValue" :customDayData="cCalendarPriceData" @on-day-click="handleCalendarPriceItemClick"
			 @on-btn-confirm="handleCalendarPriceConfirm" />
		</popup-view>
		<!-- 票务日历价格选择弹窗 end -->
		<!-- 编辑购买数量弹窗 -->
		<popup-view :show="editNumPopupVisible" type="center">
			<view v-if="editNumPopupVisible" class="edit-num-card">
				<view class="edit-num-card__header">
					<view class="edit-num-card__title">修改购买数量</view>
				</view>
				<view class="edit-num-card__content">
					<input v-model="editNumForm.num" focus maxlength="9" class="edit-num-card__input" type="number" placeholder="请输入" />
				</view>
				<view class="edit-num-card__footer">
					<button class="edit-num-card_btn is-cancel btn-normal" @click="handleEditNumPopupBtnCancelClick">取消</button>
					<button class="edit-num-card_btn is-confirm btn-normal" @click="handleEditNumPopupBtnConfirmClick">确定</button>
				</view>
			</view>
		</popup-view>
		<!-- 编辑购买数量弹窗 end -->
		<!-- 商品退款协议弹窗 -->
		<popup-view class="refund-agreement-popup" :show="refundAgreementPopupVisible" type="center" @clickmask="refundAgreementPopupVisible = false">
			<view>
				<view class="refund-agreement-card">
					<view class="refund-agreement-card__header">
						{{after_title}}
					</view>
					<scroll-view scroll-y class="refund-agreement-card__content">
						<view class="refund-agreement-card__scroll__content">
							<parse :html="after_agreement"></parse>
						</view>
					</scroll-view>
				</view>
				<view class="refund-agreement-popup__btn-close iconfont icon-roundclose" @click="refundAgreementPopupVisible = false"></view>
			</view>
		</popup-view>
		<!-- 商品退款协议弹窗 end -->
		<!-- 点击立减弹窗 -->
		<RightOff v-model="rightOffVisible" @btnGoClick="handleRightOffGoClick"></RightOff>
		<!-- 点击立减弹窗 end -->
		<!-- 立减确认收到弹窗 -->
		<RightOffOpen v-model="rightOffOpenVisible" @btnGoClick="handleRightOffOpenGoClick" :amount="cRightOff.money" :text="cRightOff.famous_quotes"></RightOffOpen>
		<!-- 立减确认收到弹窗 end -->
		<order-pay ref="orderPay" :zeroPay="is_zero_price" @clickMask="onToggleList" @payChange="payTypeChange" @orderReady="payOrderReady"
		 @paySuccess="paySuccess" @payFail="payFail"></order-pay>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import dayjs from 'dayjs'
	import PopupView from '@/components/template/PopManager.vue'
	import OrderPay from '@/components/template/OrderPayPopups.vue'
	import PageNavBar from '@/components/template/PageNavBar2.vue'
	import CouponSheet from '@/components/template/CouponSheet.vue'
	import BindMobileButton from '@/components/template/BindMobileButton.vue'
	import CalendarPrice from '@/components/page/pageComponents/CalendarPrice.vue'
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	import DiyForm from '@/components/page/DiyForm.vue'
	import RightOff from './components/RightOff.vue'
	import RightOffOpen from './components/RightOffOpen.vue'

	let all_coupon_list = null,
		all_coupon_list_no = null
	export default {
		data() {
			return {
				// 立减点击弹窗是否显示
				rightOffVisible: false,
				// 立减确认收到弹窗是否显示
				rightOffOpenVisible: false,
				// 立减接口数据
				random_reduce_info: {},
				// 是否已经显示过立减数据了
				rightOffShown: false,
				diyDatas: [], // 表单
				form_id: '',

				// 是否支付成功
				hasPaiedSuccess: false,
				// 是否支付失败
				hasPaiedFail: false,
				back: false,
				storeId: '',
				time: '',
				remarkSub: '',
				storeBus: '',
				mealPirce: 0,
				mealData: [],
				meal_data: [],
				// 快捷导航
				nav_select: false,

				// 当前页面参数
				options: {},

				address: null, // 默认收货地址
				store: null, // 收货门店
				exist_address: false, // 是否存在收货地址
				goods: {}, // 商品信息
				groups: {}, // 拼团信息
				goods_list: [{}], // 商品列表
				order_pay_price: '',
				express_price: 0, // 初始运费
				express_price_calc: 0, // 计算后的运费
				intra_region: 0, // 配送范围
				addressOrStore: '', // 当前地址id
				rule_success: false, // 运费模板规则
				error_msg: null,
				max_buy_num: 1,
				order_total_num: 1,
				order_total_price: '0.00',
				bank: null, // 支付银行返现
				member_order_total_price: '',
				member_order_pay_price: '',
				// 优惠券列表
				coupon_list: [],
				// 不可使用优惠券
				coupon_list_no: [],
				// 选择的优惠券
				selectCoupon: null,
				// 优惠券抵扣金额
				cut_price: 0,
				// 买家留言
				remark: '',

				hasError: false,
				error: '',
				showBottomPopup: false,

				expressType: 'express', // 物流方式
				navList: [],
				couponType: 'is_use',
				realyPrice: 0,
				creatOrderData: {}, // 生成订单参数
				name: '', // 提货人姓名
				phone: '', // 提货人电话
				couponswiperHeight: 0, // 优惠券列表高度
				payType: '', // 当前支付方式
				isSubmit: false, // 是否已请求支付
				payOrderId: null, // 支付订单id
				cardList: null, // 会员卡列表
				coupon_price: 0, // 本单优惠
				member_coupon_price: null, // 会员优惠价格
				member_coupon_price_fake: null, // 假的会员优惠价格，未选中开通会员卡显示假的优惠价格
				isgoods_card: null, // 是否选择会员卡选项
				cardId: null, // 当前选择会员卡id
				card_price: null, // 当前选择会员卡价格
				goods_type: null, // 当前商品类型
				member_info: null, // 会员信息
				member_number: 0, // 会员卡数量
				member_data: null, // 会员卡信息
				user_integral: '0', // 用户总积分
				total_integral: '0', // 用户可用积分
				max_integral: '', // 商品抵扣积分
				max_rebate_money: '', // 商品积分抵扣金额
				is_integral_rebate: true, // 是否使用积分抵扣
				isShowStock: null, // 是否显示库存
				disabled: false,
				loadPop: false, // 开始加载支付方式弹窗
				order_form: {}, // 用户信息收集表单开关
				isLoading: false, // 是否正在加载中
				bind_reg: {},
				isTieredPriceGoods: null, // 是否为阶梯价商品
				form_submit_id: '', // 提交表单返回的id
				// 票务商品到底需不需要日历价格
				is_calendar_price: false,
				// 票务商品当前选中的规格id（默认为options.goods_sku_id）
				ticketingSpecSkuActiveId: '',
				// 按照规格id分类的日历价格的接口数据
				calendarPriceDataRes: {},
				// 当前选中的日历价格的项
				calendarPriceActiveItems: [],
				// 日历价格弹窗是否显示
				calendarPricePopupVisible: false,
				// 票务用户列表信息的接口数据
				ticketingUserDataRes: [],
				// 票务用户列表信息的接口数据是否已经请求过了
				ticketingUserDataResHasFetched: false,
				// 票务用户列表信息弹窗是否显示
				ticketingUserPopupVisible: false,
				// 添加/编辑/删除用户信息弹窗是否显示
				opUserPopupVisible: false,
				// add:添加，edit:修改
				opUserPopupType: '',
				// 添加/编辑用户信息form表单的值
				opUserForm: {
					// 主键id，编辑时需要
					info_id: '',
					// 姓名
					name: '',
					// 手机
					phone: '',
					// 身份证信息
					credit_no: '',
					// 是否是默认'1':是,'2':不是 和接口保持一致
					default: '1'
				},
				// 初次添加票务用户信息表单
				addUserForm: {
					// 姓名
					name: '',
					// 手机
					phone: '',
					// 身份证信息
					credit_no: '',
					// 是否是默认'1':是,'2':不是 和接口保持一致
					default: '1'
				},
				// 当前选中的用户信息的Item
				ticketingUserActiveItem: {},
				// 编辑购买数量弹窗是否显示
				editNumPopupVisible: false,
				// 编辑购买数量表单的值
				editNumForm: {
					// meal:套餐，normal:非套餐
					type: 'normal',
					// 套餐索引（type为时有用）
					mealIndex: 0,
					// 数量
					num: 1
				},
				// 20201027
				// 当前选中的票务用户信息的items列表(是有先后顺序的)
				ticketingUserActiveItems: [],
				// 是否选中了商品不退款协议
				noRefundchecked: false,
				// 退款协议弹窗是否显示
				refundAgreementPopupVisible: false,
				// 退款协议标题
				after_title: '',
				// 退款协议富文本
				after_agreement: '',
				// 是否展示退款协议按钮总开关
				display_protocol: -1,
				// 接口请求回来的新鲜运费 如果有就以这个为准
				expressPriceFinally: -1,
				// 同城配送包装费用
				packing_fee: 0,
				// 同城配送费用
				express_city_price: 0,
				// 亿奇达
				extraForm: {
					yqd_template: []
				}
			}
		},
		components: {
			PopupView,
			OrderPay,
			PageNavBar,
			CouponSheet,
			BindMobileButton,
			DiyForm,
			CalendarPrice,
			Parse,
			RightOff,
			RightOffOpen
		},
		computed: {
			// 立减相关信息
			cRightOff() {
				const data = this.random_reduce_info || {}
				return data
			},
			// 亿奇达
			cExtraFormItemList() {
				try{
					let yqdTemplate = this.$util.deepGet(this.goodsData, 'yqd_template',[])
					yqdTemplate = JSON.parse(yqdTemplate)
					console.log('cExtraFormItemList',yqdTemplate)
					return yqdTemplate
				}catch(e){
					//TODO handle the exception
					return []
				}
				
			},
			// 是否需要显示商品不退款协议按钮https://weliam.coding.net/p/lingdian/requirements/issues/7296/detail
			cNeedNoRefund() {
				return (this.goods_list || []).some(item => item.after_sales == 10 && this.display_protocol == 1)
			},
			// 需要修改ticketingUserActiveItems的触发器
			cTicketingUserActiveItemsTrigger() {
				return [
					this.cTicketingUserData,
					this.order_total_num
				]
			},
			// 当前票务是否需要身份证号
			cNeedIdCard() {
				return this.goodsData.id_card == 1
			},
			// 票务用户信息初次填写卡片是否显示
			cTicketingInitUserCardVisible() {
				// 当前是票务商品，且当前票务用户信息已经请求完毕，且当前没有任何票务用户信息
				return this.options.transport_type == 60 && this.ticketingUserDataResHasFetched && !this.ticketingUserDataRes.length
			},
			// 多规格票务商品是否达到最大购买数量了
			cIsTicketingMaxBuyLimit() {
				if(!this.calendarPriceActiveItems || !this.calendarPriceActiveItems.length) {
					return false
				}
				const maxNum = this.$util.deepGet(this.calendarPriceActiveItems, '0._source.remainNum', '0')
				console.log('maxNum +++ ', maxNum)
				return this.order_total_num >= maxNum
			},
			// 格式化票务选中用户信息
			cTicketingInfoCard() {
				// 是否显示.ticketing-info-card
				let visible = false
				if (this.ticketingUserActiveItem && !this.ticketingUserActiveItem.info_id && this.options.transport_type == 60) {
					// 当前有用户信息，且当前没有选中一个用户，且当前是票务商品
					visible = true
				}
				let type = 'add'
				let text = '请添加用户信息'
				if (this.ticketingUserDataRes.length) {
					text = '请选择用户信息',
						type = 'select'
				}
				return {
					visible,
					text,
					type
				}
			},
			// 格式化的票务用户编辑表单的标题等
			cTicketingUserTemplate() {
				// 标题
				let title = ''
				switch (this.opUserPopupType) {
					case 'add':
						title = '填写用户信息'
						break
					case 'edit':
						title = '编辑用户信息'
						break
					default:
						break
				}
				// 按钮文字
				let btnTitle = ''
				switch (this.opUserPopupType) {
					case 'add':
						btnTitle = '确认'
						break
					case 'edit':
						btnTitle = '确认修改'
						break
					default:
						break
				}
				return {
					title,
					btnTitle
				}
			},
			// 格式化的要显示的票务使用时间
			cCalendarPriceTime() {
				const timeStamp = this.$util.deepGet(this.calendarPriceActiveItems, '0.timeStamp')
				console.log('cCalendarPriceTime', timeStamp)
				return {
					timeStamp,
					timeStr: dayjs(timeStamp).format('YYYY-MM-DD')
				}
			},
			// 格式化的日历价格选中项id
			cCalendarPriceValue() {
				return this.calendarPriceActiveItems.map(item => item.id)
			},
			// 格式化的票务用户列表数据
			cTicketingUserData() {
				const arr = this.ticketingUserDataRes.map(item => ({
					_source: item,
					id: item.info_id,
					info_id: item.info_id,
					// 姓名
					name: item.name,
					// 手机号
					phone: item.phone,
					// 身份证号
					credit_no: item.credit_no,
					// 是否是默认
					default: +item.default === 1
				}))
				console.log('cTicketingUserData 12', arr)
				return arr
			},
			// 格式化的传给日历价格组件的数据
			cCalendarPriceData() {
				return (this.calendarPriceDataRes[this.ticketingSpecSkuActiveId] || []).filter((item = {}) => item.calendar_id).map(
					(item = {}) => ({
						_source: item,
						id: item.date,
						priceStr: `￥${item.salePrice}起`,
						numStr: `剩${item.remainNum || 0}张`
					}))
			},
			$groups() {
				return this.groups || {}
			},
			// 是否购物车结算
			isCart() {
				return this.options && this.options.isCart == '1'
			},
			is_group_type() {
				return this.options.order_type == '2'
			},
			is_bargain_type() {
				return this.options.order_type == '5'
			},
			is_commander() {
				return this.is_group_type ? this.$groups.is_commander || -1 : -1
			},
			group_join_num() {
				return this.is_group_type ? this.$groups.join_num || -1 : -1
			},
			group_discount() {
				return this.is_group_type ? this.$groups.commander_discount || -1 : -1
			},
			is_group_commander() {
				return this.is_group_type ? this.$groups.is_commander_discount || -1 : -1
			},
			is_group_discount() {
				return this.is_group_commander === 1 && this.is_commander !== -1 ? this.group_discount : !1
			},
			couponTypeList() {
				let typeList = [{
						id: 'is_use',
						title: `可用${this.appCoupon.coupon_title}`
					},
					{
						id: 'is_use_bonus',
						title: '可用红包'
					}
				]
				return typeList
			},
			// 是否显示绑定手机号按钮
			isShowBindBtn() {
				let userInfo = this.$store.state.userInfo
				console.log('userInfo', userInfo)
				return (userInfo && this.settingData.bindmobile === '1' && this.$util.isEmptyMobile(userInfo.mobile)) || !userInfo
			},
			// 样式显示模式
			tradeStyle() {
				// return this.settingData.trade ? this.settingData.trade.style : 0;
				return 1
			},
			// 优惠券数量
			couponNum() {
				let {
					coupon_list,
					coupon_list_no
				} = this
				return coupon_list.length + coupon_list_no.length
			},
			// 商品价格小计
			orderGoodsPrice() {
				let {
					order_total_num,
					order_total_price,
					mealPirce,
					options: {
						is_meal
					}
				} = this, price = order_total_price

				// return order_total_price * order_total_num;
				is_meal == 1 && (price = Number(order_total_price) + Number(mealPirce))
				return price
			},
			// 优惠过后订单支付价格,最终支付价格计算
			actual_pay_price() {
				/**
				 *	处理价格的顺序与计算方式应与后台相同
				 *	由于积分和优惠券用户可以主动操作，所以相关价格计算以及条件筛选，需前端进行一次
				 *	所以优惠价格均是以商品价格为基础进行计算，如优惠券使用门槛、积分抵扣金额
				 */
				let {
					expressType, // 当前物流方式
					order_pay_price, // 订单支付价格
					order_total_price, // 商品单价
					order_total_num, // 商品总数量
					express_price_calc, // 计算后的邮费
					express_price, // 初始邮费
					selectCoupon, // 当前选择优惠券
					cardId, // 会员卡id
					card_price, // 会员卡开卡费用
					member_coupon_price, // 会员卡优惠价格
					is_group_discount, // 团长优惠
					is_integral_rebate, // 是否开启积分抵扣
					max_rebate_money, // 积分抵扣金额
					mealPirce,
					packing_fee, //同城配送包装费
					options: {
						order_type,
						is_meal
					}
				} = this,
				payPrice = 0, // 订单支付金额
					expressPrice = expressType === 'express' ? Number(express_price_calc) : 0 // 最终支付邮费
				// order_total_price = Number(order_total_price * order_total_num);
				order_total_price = Number(order_total_price) < 0 ? 0 : Number(order_total_price)
				if (this.expressPriceFinally != -1) {
					expressPrice = this.expressPriceFinally
				}
				// 积分抵扣
				if (!!max_rebate_money && Number(max_rebate_money) > 0 && is_meal != 1) {
					console.log('order_total_price', order_total_price)
					let allListNum = 0
					if (all_coupon_list && all_coupon_list_no) {
						allListNum = all_coupon_list.length + all_coupon_list_no.length
					}
					if (is_integral_rebate) {
						order_total_price = (order_total_price - max_rebate_money) < 0 ? 0 : order_total_price - max_rebate_money
					}
					if (allListNum > 0) {
						this.couponUseInit(order_total_price)
					}
				}


				// 会员优惠金额
				if (order_type === '1' && (!!cardId || member_coupon_price > 0) && is_meal != 1) {
					console.log('order_total_price', order_total_price)
					order_total_price = (order_total_price - Number(member_coupon_price)) < 0 ? 0 : order_total_price - Number(
						member_coupon_price)
				}

				// 团长优惠
				if (!!is_group_discount) {
					order_total_price = (order_total_price - Number(is_group_discount)) < 0 ? 0 : order_total_price - Number(
						is_group_discount)
				}

				// 优惠券金额
				if (selectCoupon && this.options.is_meal != 1) {
					console.log('order_total_price', order_total_price)
					let coupon_type = selectCoupon.coupon_type,
						couponMoney = this.couponCutMoney(selectCoupon, order_total_price) // 优惠券
					order_total_price = coupon_type === 20 ? couponMoney.pay_price : (order_total_price - (coupon_type === 30 ? 0 :
						Number(couponMoney.cut_price)))
					order_total_price = order_total_price < 0 ? 0 : order_total_price
				}
				
				

				// 邮费、会员卡费用单独计算且商品最低价为0
				payPrice =
					is_meal != 1 ?
					(order_total_price > 0 ? order_total_price : 0) +
					expressPrice +
					(cardId ? Number(card_price) : 0) :
					(order_total_price > 0 ? order_total_price : 0) +
					expressPrice +
					(cardId ? Number(card_price) : 0) +
					Number(mealPirce) -
					Number(member_coupon_price)
				
				
					
				// 如果是同城配送
				if(expressType === 'city') {
					payPrice = payPrice + Number(packing_fee) + Number(this.express_city_price)
				}
				
				if(payPrice < 0) {
					return 0
				}else {
					return Number(payPrice).toFixed(2)
				}

				// 邮费、会员卡费用单独计算且商品最低价为0.01
				// payPrice = (order_total_price > 0 ? order_total_price : 0.01) + expressPrice + (cardId ? Number(card_price) : 0);
				// return Number(payPrice) > 0 ? Number(payPrice).toFixed(2) : 0.01;
			},
			is_zero_price() {
				return +this.actual_pay_price === 0
			},
			balanceSetting() {
				return this.settingData.balance || {}
			},
			orderForm() {
				return this.order_form
			},
			goodsData() {
				let {
					goods_list: [goods]
				} = this
				if (this.isCart) {
					return this.goods_list
				}
				return goods || {}

			},
			// 运费
			expressPrice() {
				if (this.expressPriceFinally != -1) {
					return this.expressPriceFinally
				}
				return this.selectCoupon ? this.express_price_calc : this.express_price
			},
			// 是否限购
			isLimitBuy() {
				return this.goodsData.limit_buy === 10
			},
			// 是否能够购买的数量
			isMaxBuyLimit() {
				console.log(this.goodsData, 'this.goodsData.sku================')
				if (this.isTieredPriceGoods > 0) {
					return true
				}

				let {
					options: {
						goods_sku_id, // 当前购买商品规格
						order_type // 1=普通订单 2拼团订单 3=秒杀 4卡密订单 5砍价订单
					},
					order_total_num, // 商品购买数量
					max_buy_num, // 用户可购数量
					goodsData: {
						spec_type, // 商品是否多规格
						sku: skuList = [{}],
						limit_buy, // 商品是否限购
						limit_num // 商品限购数量
					}
				} = this,
				skuItem = spec_type == 10 ? skuList : skuList.filter(val => {
						if (val.spec_sku_id == goods_sku_id) {
							return val
						}
					}),
					stock_num = (skuItem.stock_num && skuItem.stock_num) || (skuItem[0] && skuItem[0].stock_num) || 0
				order_total_num = Number(order_total_num)
				console.log({
					order_total_num,
					stock_num,
					limit_buy,
					max_buy_num,
					limit_num
				})

				return (order_type == 1 || order_type == 3) ? (order_total_num >= stock_num) || (limit_buy === 10 &&
						order_total_num >= max_buy_num) :
					true


			},
			isSelectMealNum() {
				let {
					mealData
				} = this,
				flag = false
				mealData.forEach(item => {
					item.goods_num && (flag = true)
				})
				return flag

			},
			isMeal() {
				let {
					options: {
						is_meal
					}

				} = this
				return is_meal == 1

			}
		},
		filters: {
			// 价格显示处理
			moneyFormat(value) {
				if (!value) {
					return '0'
				}
				// return parseFloat(Number(value).toFixed(2));
				return Number(value).toFixed(2)
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.options = options
			this.ticketingSpecSkuActiveId = options.goods_sku_id || ''
			this.pageLoad(options)
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		async onShow() {
			// 获取当前订单信息
			console.log(this.back, 'back=+++++++++++++++++++')
			//  #ifdef MP-WEIXIN
			if (this.hasPaiedSuccess || this.hasPaiedFail) {
				this.hasPaiedSuccess = false
				// fix https://weliam.coding.net/p/lingdian/bug-tracking/issues/6094/detail
				this.hasPaiedFail = false
				return
			}
			// #endif
			// 这个this.back 只是为了onShow只执行一次，但是实际上没有到达这个作用呀！！！？？？？
			if (!this.back) {
				this.meal_data = []
				this.getOrderData(this.order_total_num)
				this.meal_data.push({
					goods_id: this.options.goods_id,
					num: 1,
					goods_sku_id: this.options.goods_sku_id
				})

				let clientTyp = App.getClientType(),
					isSubmit = (this.isSubmit && this.payType === 'alipay')
				if (isSubmit) {
					this.orderStatusInquiry(this.payOrderId)
				}
				console.log(this.actual_pay_price, 'this.moneyFormat=============')
			}
			this.back && (this.back = false)

		},
		onUnload() {
			// 重置地址数
			this.$store.commit('addressData', null) // 收货地址
			this.$store.commit('storeData', null) // 门店地址
			all_coupon_list = null
			all_coupon_list_no = null
			uni.removeStorageSync('isReload')
		},
		watch: {
			cRightOff(val) {
				if(val.is_open == 1 && !this.rightOffShown) {
					this.rightOffShown = true
					this.rightOffVisible = true
				}
			},
			cExtraFormItemList() {
				this.extraForm.yqd_template = this.cExtraFormItemList.map(item=>'')
			},
			// 监听票务商品规格的变化
			ticketingSpecSkuActiveId(val) {
				if (+val === 0) {
					return
				}
				// 请求对应规格的日历价格
				this.fetchCalendarPriceDataRes({
					attr_id: val
				})
			},
			/**
			 * 监听cTicketingUserActiveItemsTrigger
			 * 正确的拼凑和更新this.ticketingUserActiveItems
			 */
			cTicketingUserActiveItemsTrigger() {
				const val = this.cTicketingUserData
				const arr = [...this.ticketingUserActiveItems]
				const firstInfoId = '' + this.$util.deepGet(arr, '0.info_id', '')
				console.log('firstInfoId', firstInfoId)
				if (arr.length <= 1 && (!firstInfoId || firstInfoId.indexOf('fake') !== -1)) {
					const defaultItem = val.find(item => item.default == 1)
					if (defaultItem) {
						arr[0] = defaultItem
					}
				} else {
					// 修正this.ticketingUserActiveItems
					for (let i = 0; i < arr.length; i++) {
						const target = val.find(valItem => arr[i].info_id == valItem.info_id)
						if (target) {
							console.log('更新arr[i]哈哈哈哈哈哈哈', arr[i])
							// 更新arr[i]
							arr[i] = target
						}
					}
				}
				if (!this.cNeedIdCard) {
					// 不需要身份信息 则只需要一个用户信息
					this.ticketingUserActiveItems = [arr[0]]
				} else if (this.order_total_num > arr.length) {
					this.ticketingUserActiveItems = [
						...arr,
						...new Array(this.order_total_num - arr.length).fill({}).
						map((item, index) => ({
							info_id: `fake_${index}`
						}))
					]
				} else {
					this.ticketingUserActiveItems = arr.slice(0, this.order_total_num)
				}

			}
		},
		methods: {
			handleRightOffGoClick() {
				this.rightOffVisible = false
				this.rightOffOpenVisible = true
			},
			handleRightOffOpenGoClick() {
				this.rightOffOpenVisible = false
				this.getOrderData(this.order_total_num)
			},
			// 编辑购买数量弹窗确定按钮点击事件
			handleEditNumPopupBtnConfirmClick() {
				this.editNumPopupVisible = false
				// 如果是套餐商品
				if (this.editNumForm.type === 'meal') {
					// 套餐商品信息
					const meal = this.mealData[this.editNumForm.mealIndex]
					// 改变套餐商品的数量
					this.totalMealNumChange('to', {
						goods_id: meal.goods_id,
						num: this.editNumForm.num,
						goods_sku_id: meal.spec_sku_id,
						stock_num: meal.stock_num
					}, this.editNumForm.mealIndex)
				} else if (this.editNumForm.type === 'normal') {
					if (this.editNumForm.num < 1) {
						uni.showToast({
							icon: 'none',
							title: '数量不能小于1'
						})
						return
					}
					console.log('handleEditNumPopupBtnConfirmClick 05')
					// 判断最大数量是否超出
					
					// 限购数量
					const max_buy_num = this.max_buy_num
					let activeItem = null
					if (Array.isArray(this.goodsData.sku)) {
						activeItem = this.goodsData.sku.find(val => val.spec_sku_id == this.options.goods_sku_id)
					}
					// 库存数量 因为this.editNumForm.type === 'normal'所以可以直接这样取（接口返回的this.goodsData.sku是个对象）
					const stock_num = this.$util.deepGet(this.goodsData, 'sku.stock_num', 0) || (activeItem || {}).stock_num || 0

					// 新的限购数量
					let newMaxBuyNum = -1
					const detail = this.goodsData || {}
					// spec_type 10:单规格，20:多规格
					const spec_type = detail.spec_type || []
					// 单规格
					if (spec_type == 10) {
						const hide_info = detail.hide_info || []
						if (detail.limit_buy == 10 && !hide_info.some(item => item === 'limitBuy')) {
							newMaxBuyNum = detail.limit_num
						}
					}
					// 多规格
					if (spec_type == 20) {
						if (activeItem && activeItem.limit_buy == 20) {
							newMaxBuyNum = activeItem.limit_num
						}
					}
					console.log({
						newMaxBuyNum,
						stock_num,
						num: this.editNumForm.num,
						activeItem
					})
					if (newMaxBuyNum != -1) {
						// newMaxBuyNum != -1说明开启了规格限购
						if (+this.editNumForm.num > +newMaxBuyNum) {
							console.log(`该规格最大购买数量为${newMaxBuyNum}`)
							uni.showToast({
								icon: 'none',
								title: `该规格最大购买数量为${newMaxBuyNum}`
							})
						}
						return
					} else if (this.editNumForm.num > max_buy_num) {
						uni.showToast({
							icon: 'none',
							title: `每人限购${max_buy_num}件`
						})
						return
					} else if (this.editNumForm.num > stock_num) {
						uni.showToast({
							icon: 'none',
							title: `最大购买数量为${max_buy_num}`
						})
						return
					}

					// 改变数量
					this.totalNumChange('', {
						forceNum: this.editNumForm.num,
						forceFetch: true
					})
				}
			},
			// 编辑购买数量弹窗取消按钮点击事件
			handleEditNumPopupBtnCancelClick() {
				this.editNumPopupVisible = false
			},
			// 打开编辑购买数量弹窗
			openEditNumPopup({
				type,
				mealIndex,
				num
			}) {
				console.log(type, mealIndex, num)
				// 参数检查
				if (type === 'meal' && !(mealIndex >= 0 && this.mealData[mealIndex])) {
					uni.showToast({
						icon: 'none',
						title: '未找到指定套餐'
					})
					return
				}
				// 只能购买一个的情况
				if ((this.isMaxBuyLimit || (this.options.transport_type == 60 && this.cIsTicketingMaxBuyLimit)) && num == 1) {
					return
				}
				this.editNumForm = {
					type,
					mealIndex,
					num
				}
				this.editNumPopupVisible = true
			},
			// .meal-selector__option点击事件
			handleMealSelectorOptionClick(item, index) {
				this.ticketingSpecSkuActiveId = item.spec_sku_id
				if (this.is_calendar_price) {
					this.calendarPricePopupVisible = true
				} else {
					this.totalNumChange('', {
						forceNum: this.order_total_num,
						forceFetch: true
					})
				}
			},
			// .ticketing-info-card中的按钮点击事件
			handleBtnAddInTicketingInfoCardClick() {
				switch (this.cTicketingInfoCard.type) {
					case 'add':
						this.handleBtnSelectTicketingUserClick()
						break
					case 'select':
						this.handleBtnSelectTicketingUserClick()
						break
					default:
						break
				}
			},
			// 选择用户信息按钮点击事件
			handleBtnSelectTicketingUserClick(item) {
				console.log('handleBtnSelectTicketingUserClick', item)
				this.ticketingUserActiveItem = item
				this.ticketingUserPopupVisible = true
			},
			// 添加票务用户信息按钮点击事件
			handleBtnAddTicketingUserClick() {
				this.opUserPopupType = 'add'
				this.opUserForm = {
					info_id: '',
					name: '',
					phone: '',
					credit_no: '',
					default: 0
				}
				this.ticketingUserPopupVisible = false
				this.opUserPopupVisible = true
			},
			// 用户信息列表修改按钮修改按钮点击事件
			handleBtnEditTicketingUserClick(item) {
				// hack。。。有时候取不到item
				item = item || this.cTicketingUserData[0]
				this.opUserPopupType = 'edit'
				this.opUserForm = {
					info_id: item.info_id,
					name: item.name,
					phone: item.phone,
					credit_no: item.credit_no,
					default: +item.default || 0
				}
				this.ticketingUserPopupVisible = false
				this.opUserPopupVisible = true
			},
			// 用户信息列表项点击事件
			handleTicketingUserItemClick(item) {
				if (item.info_id !== this.ticketingUserActiveItem.info_id && this.ticketingUserActiveItems.find(val => val.info_id ==
						item.info_id)) {
					uni.showToast({
						icon: 'none',
						title: '当前用户已经被选择，请选择其他用户'
					})
				} else {
					const index = this.ticketingUserActiveItems.findIndex(val => val.info_id === this.ticketingUserActiveItem.info_id)
					this.ticketingUserActiveItem = {}
					this.ticketingUserActiveItems[index] = item
					this.ticketingUserPopupVisible = false
				}

			},
			/**
			 * 日历价格选择按钮点击事件
			 * 有日历价格 且没有选择 不能关闭
			 * 没有日历价格 可以直接关闭
			 */
			handleCalendarPriceConfirm() {
				// 是否有任何可选日历价格
				const anyPrice = this.cCalendarPriceData.find(item => item.price)
				if (!this.calendarPriceActiveItems.length && anyPrice) {
					uni.showToast({
						title: '请先选择使用日期',
						icon: 'none'
					})
					return
				} else if (!this.calendarPriceActiveItems.length) {
					this.calendarPricePopupVisible = false
					return
				}
				this.order_total_num = 1
				this.totalNumChange('', {
					forceNum: this.order_total_num,
					forceFetch: true
				})
				this.calendarPricePopupVisible = false
			},
			// 删除用户信息按钮点击事件
			async handleBtnDelTicketingUserClick({
				info_id
			} = {}) {
				console.log('handleBtnDelTicketingUserClick', info_id, this.ticketingUserActiveItems)
				if (info_id == undefined) {
					uni.showToast({
						title: '未指定要删除的对象',
						icon: 'none'
					})
					return
				}
				if (this.ticketingUserActiveItems.find(val => val.info_id == info_id)) {
					uni.showToast({
						title: '当前用户已经被选中不可删除',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '请稍候...',
					mask: true
				})
				try {
					await App._postP('ticket.ticket/delUserName', {
						info_id
					})
					// 刷新相关信息
					this.fetchTicketingUserDataRes()
					// 隐藏相关面板
					this.opUserPopupVisible = false
					// 提示
					uni.showToast({
						title: '删除成功',
						icon: none
					})
				} catch (e) {
					// TODO handle the exception
				}
			},
			// 日历价格项点击事件
			handleCalendarPriceItemClick(item, index) {
				console.log(item)
				if (!item.disabled) {
					this.calendarPriceActiveItems = [item]
				}
			},
			// 修改、添加或删除票务下单 用户信息
			async doOpTicketingUser({
				type = 'add',
				successToastVisible = true
			} = {}) {
				uni.showLoading({
					title: '请稍候',
					mask: true
				})
				console.log('doOpTicketingUser')
				try {
					// 参数校验
					if (!this.opUserForm.name) {
						App.showError('请先填写票务用户姓名')
						uni.hideLoading()
						return Promise.reject()
					}
					if (!this.opUserForm.phone) {
						App.showError('请先填写票务用户手机号')
						uni.hideLoading()
						return Promise.reject()
					}
					if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(this.opUserForm.phone)) {
						App.showError('手机号格式不正确')
						uni.hideLoading()
						return Promise.reject()
					}
					if (this.goodsData.id_card == 1 && !this.opUserForm.credit_no) {
						App.showError('请先填写票务身份证号')
						uni.hideLoading()
						return Promise.reject()
					}
					// 操作请求
					await App._postP('ticket.ticket/editUserName', this.opUserForm)
					// 刷新相关信息
					await this.fetchTicketingUserDataRes()
					// 隐藏相关面板
					uni.hideLoading()
					this.opUserPopupVisible = false
					// 提示
					if (successToastVisible) {
						const titleMap = {
							add: '添加成功',
							edit: '修改成功'
						}
						const title = titleMap[type] || '操作成功'
						uni.showToast({
							title,
							icon: 'none'
						})
					}

					return Promise.resolve()
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 如果是多规格商品又不是从购物车进来 需要更新expressPriceFinally
			async fetchExpressPriceFinallyIfNeeded() {
				console.log('fetchExpressPriceFinallyIfNeeded 111', this.options.is_meal, this.isCart)
				if (this.options.is_meal != 1 || this.isCart) {
					return
				}
				console.log('fetchExpressPriceFinallyIfNeeded')
				try {
					const params = await this.submitOrderReal({
						onlyGetData: true
					})
					console.log('fetchExpressPriceFinallyIfNeeded params', params)
					const res = await App._getP('order/cart', params)
					const express_price = res.data.express_price
					console.log('fetchExpressPriceFinallyIfNeeded express_price', express_price, res)
					this.expressPriceFinally = express_price >= 0 ? express_price : -1
					if(this.expressType === 'city') {
						// 同城配送包装费
						this.packing_fee = res.data.packing_fee
						// 同城配送费用
						this.express_city_price = res.data.express_city_price
					}
				} catch (e) {
					console.log('fetchExpressPriceFinallyIfNeeded', e)
				}
			},
			// 请求票务用户信息的接口数据 
			async fetchTicketingUserDataRes() {
				try {
					const res = await App._postP('ticket.ticket/getUserName')
					this.ticketingUserDataRes = this.$util.deepGet(res, 'data', [])
					this.ticketingUserDataResHasFetched = true
				} catch (e) {
					// TODO handle the exception
				}
			},
			// 请求日历价格的接口数据
			async fetchCalendarPriceDataRes(data = {}) {
				const attr_id = data.attr_id || this.options.goods_sku_id
				if (this.calendarPriceDataRes[attr_id]) {
					return Promise.resolve()
				}
				console.log('fetchCalendarPriceDataRes', attr_id)
				try {
					const res = await App._postP('ticket.ticket/getTicketPrice', {
						goods_id: this.options.goods_id,
						start_time: +dayjs(),
						end_date: +dayjs().add(12, 'month'),
						...data,
						// 规格ID 取当前选中库存的id
						attr_id
					})
					this.calendarPriceDataRes = {
						...this.calendarPriceDataRes,
						[attr_id]: this.$util.deepGet(res, 'data', [])
					}
				} catch (e) {
					// TODO handle the exception
				}
			},
			/**
			 * 页面加载处理
			 */
			pageLoad(options) {
				this.setSwiperHeight()
				// 当前页面参数
				this.options = options
				if (options.isCart != 1) {
					this.getFormInfo(options.goods_id)
				}
				//        this.expressType = options.transport_type == '40' ? '' : (options.transport_type == '10' || options.transport_type ==
				// '30' ? 'self' : options.is_express == 1 ? 'express' : 'self')
				if(options.is_city == '1'){
					this.expressType = 'city'
				}else if (options.transport_type == '40') {
					this.expressType = ''
				} else if ([
						'10',
						'30'
					].indexOf(options.transport_type) !== -1) {
					this.expressType = 'self'
				} else if (options.is_express == 1) {
					this.expressType = 'express'
				} else if (['60','70'].indexOf(options.transport_type) !== -1) {
					this.expressType = ''
				} else {
					this.expressType = 'self'
				}
				this.goods_type = options.goods_type
				this.isTieredPriceGoods = options.isTieredPriceGoods
				console.log(this.isTieredPriceGoods, '是否为阶梯价商品=========')
				this.getOrderCard(options.goods_id, options.goods_sku_id, options.goods_num)
			},
			/**
			 * 设置收货方式
			 * express_state  是否开启物流发货 10=开启   20=关闭
			 * self_state   是否开启自提 1=开启   0=关闭
			 * city_delivery_state   是否开启同城配送 1=开启   2=关闭
			 */
			setExpressList({
				express_state = '10',
				self_state = '1',
				city_delivery_state = '1'
			}) {
				const options = this.options;
				const navList = {
					self: {
						id: 'self',
						title: '上门自提',
						value: 2
					},
					express: {
						id: 'express',
						title: '快递配送',
						value: 1
					},
					city: {
						id: 'city',
						title: '同城配送',
						value: 6
					}
				};
				const {
					// 10核销商品 20物流商品 30卡密商品 50同城配送
					transport_type, 
					// 开启快递配送 1开启 2关闭
					is_express, 
					// 开启门店自提 1开启 2关闭
					is_zt, 
					// 开启同城配送 1开启 2关闭
					run_errands 
				} = options;
				const list = [];

				if (transport_type === '20') {
					if (is_express == '1' && express_state == '10') {
						list.push(navList.express);
					}
					if (is_zt == '1' && self_state == '1') {
						list.push(navList.self)
					}
					if (run_errands == '1' && city_delivery_state == '1' || this.options.is_city == '1') {
						list.push(navList.city)
					}
					if (this.$refs.pageNav) {
						this.$refs.pageNav.currentIndex = this.expressType
					}
					
				}
				this.navList = list
				if (list.length === 1) {
					this.expressType = list[0].id
				}
			},

			/**
			 * 获取当前订单信息
			 */
			async getOrderData(goodsNum = 1) {
				let Base64 = new this.$util.Base64()

				let _this = this,
					isCart = _this.isCart,
					options = _this.options,
					expressType = _this.expressType,
					addressData = _this.$store.state.addressData, // 收货地址
					storeData = _this.$store.state.storeData // 提货门店
				// 数量按钮禁用
				_this.isLoading = true
				
				console.log('购物车结算11111isCart',isCart)
				// 购物车结算
				if (isCart) {
					// 修复切换地址后 运费没更新
					App._get('order/cart', {
						addressOrStore:  ['express','city'].includes(expressType) ? (addressData ? addressData.address_id : '') : (storeData ?
							storeData.id : ''),
						cart_indexes: JSON.parse(decodeURIComponent(options.cart_indexes)).join(','),
						cgp: options.cgp || '',
						store_id: options.store_id,
						cart_type: options.cart_type,
						rrr_id: _this.rightOffShown ? _this.cRightOff.id : ''
					}, this.orderGetCallBack)
				} else {
					let params = {
						travel_date: this.$util.deepGet(this.cCalendarPriceTime, 'timeStamp', ''),
						goods_id: options.goods_id,
						goods_num: goodsNum,
						group_id: options.group_id,
						goods_sku_id: this.ticketingSpecSkuActiveId || options.goods_sku_id,
						groups_group_id: options.groups_group_id || '',
						addressOrStore: ['express','city'].includes(expressType) ? (addressData ? addressData.address_id : '') : (storeData ?
							storeData.id : ''),
						activityId: options.activityId || '',
						free_id: options.free_id || '',
						order_type: options.order_type,
						rrr_id: _this.rightOffShown ? _this.cRightOff.id : ''

						// fix https://weliam.coding.net/p/lingdian/iterations/6373/issues/6372
						// no_login: 1
					}
					// 获取订单信息
					App._get('order/buyNow', params, this.orderGetCallBack,()=>{
						_this.isLoading = false
					})
				}
			},

			/**
			 * 获取订单信息，回调
			 */
			async orderGetCallBack(result) {
				console.log(this.cardId, 'callbackcarid---------------')
				this.random_reduce_info = result.random_reduce_info || {}
				let data = result.data,
					isCart = this.isCart, // 是否购物车结算
					expressType = this.expressType,
					addressData = this.$store.state.addressData, // 已选收货地址
					storeData = this.$store.state.storeData, // 已选提货门店
					cardId = this.cardId,
					cardList = this.cardList,
					bind_reg = this.bind_reg
				// 如果是票务商品且需要选择日期
				// 处理票务商品的接口请求
				const pArr = []
				// 如果需要请求票务用户信息
				if (+this.options.transport_type === 60) {
					pArr.push(this.fetchTicketingUserDataRes)
				}
				// 如果需要请求日历价格且没有开启快递且开启了日历价格

				this.is_calendar_price = expressType !== 'express' && +this.$util.deepGet(data, 'goods_list.0.is_calendar_price',
					'') === 1
				if (+this.options.transport_type === 60 && this.is_calendar_price) {
					pArr.push(this.fetchCalendarPriceDataRes)
					// 直接打开日历价格弹窗（如果没有打开过）
					if (!this.hadCalendarPriceOpened) {
						this.calendarPriceActiveItems = []
						// 不直接打开了202104261546
						// this.calendarPricePopupVisible = true
					}
					this.hadCalendarPriceOpened = true
					// hack.......................
				}
				try {
					await Promise.all(pArr.map(foo => foo()))
				} catch (e) {
					// TODO handle the exception
				}
				// 判断是否会员专属商品
				if (result.code === 1 && result.msg === 'member') {
					App.showError('该商品为会员专属商品，请先开通会员再购买~', () => {
						let tabBar = this.$store.state.tabBar.list,
							isHaveCard = tabBar.findIndex(val => val.name === 'membercard') > 0,
							url = '/pages/subPages/member/index/index'
						// #ifdef H5
						url += `?i=${App.getUniacid()}`
						// #endif
						uni[isHaveCard ? 'reLaunch' : 'redirectTo']({
							url
						})
					})
					return false
				}
				// 显示错误信息
				if (data.has_error) {
					this.hasError = true
					this.error = data.error_msg
					App.showError(this.error)
				}
				// 设置收货方式
				this.setExpressList(data)
				// 设置收货地址/门店
				if (isCart) {
					console.log('购物车设置收货门店',addressData,data.address)
					let stores = data.goods_list
					data.address = !!addressData ? addressData : data.address
					stores.map(store => {
						store.store = !!store.store ? store.store : !!storeData && storeData[store.id] ? storeData[store.id] : null
						storeData = Object.assign(storeData || {}, {
							[store.id]: store.store
						})
						this.$store.commit('storeData', storeData)
					})
				} else {
					// console.log(addressData,'收货地址--------------')
					data.address = !!addressData ? addressData : data.address
					data.store = !!storeData ? storeData[data.bus_id] : data.store
					if (!!data.store) {
						this.$store.commit('storeData', {
							[data.store.bus_id]: data.store
						})
					}
				}


				// 设置默认用户名和电话、可用积分、可用余额
				let userInfo = data.user_info
				this.name = this.name || userInfo.name
				this.phone = this.phone || userInfo.mobile
				this.total_integral = userInfo.integral
				// 保存初始运费
				this.express_price = Number(data.express_price).toFixed(2)
				this.express_price_calc = Number(data.express_price).toFixed(2)
				// 同城配送包装费
				this.packing_fee = data.packing_fee
				// 同城配送费用
				this.express_city_price = data.express_city_price

				// 保存所有优惠券
				if (data.coupon_list && data.coupon_list.length > 0) {
					all_coupon_list = data.coupon_list
					all_coupon_list_no = data.coupon_list_no
					if (expressType === 'self') {
						data.coupon_list = data.coupon_list.filter(val => val.coupon_type !== 30)
					}
				}
				// 接触禁用
				this.isLoading = false

				let price = 0
				if (this.options.is_meal == 1) {
					this.isShowStock = data.goods_list[0].meal_is_show_stock
					this.mealData = data.goods_list[0].sku
					this.mealData.forEach(item => {
						if (item.spec_sku_id == this.options.goods_sku_id) {
							this.$set(item, 'goods_num', 1)
						} else {
							this.$set(item, 'goods_num', 0)
						}
						this.$set(item, 'time', '')
						this.$set(item, 'remarkSub', '')
						this.$set(item, 'storeId', '')
						this.$set(item, 'storeBus', '')
						price = parseFloat(price) + (parseFloat(item.member_coupon_price) * parseFloat(item.goods_num))

					})
					this.mealPirce = 0
				}

				this.setData(data)
				if (data.member_coupon_price != 0) {
					this.setData({
						max_rebate_money: !!data.integral_rebate_money_vip || data.integral_rebate_money_vip === 0 ? data.integral_rebate_money_vip :
							data.max_rebate_money
					})
				}
				// 保存会员卡,如果有会员优惠就使用会员优惠过后的最大抵扣金额
				if (!!cardId) {
					let curCardItem = cardList.filter(val => val.card_id === cardId)[0]

					this.setData({
						cardId: curCardItem.card_id,
						card_price: curCardItem.card_price,
						member_coupon_price: this.isCart ? this.coupon_price.toFixed(2) : this.options.is_meal == 1 ? price.toFixed(2) :
							(this.coupon_price.toFixed(2) * this.order_total_num).toFixed(2),
						max_rebate_money: !!data.integral_rebate_money_vip || data.integral_rebate_money_vip === 0 ? data.integral_rebate_money_vip :
							data.max_rebate_money
					})
				}
				// 20200810 https://weliam.coding.net/p/lingdian/requirements/issues/5759/detail
				this.setData({
					member_coupon_price_fake: this.isCart ? this.coupon_price.toFixed(2) : this.options.is_meal == 1 ? price.toFixed(
						2) : (this.coupon_price.toFixed(2) * this.order_total_num).toFixed(2)
				})

				App.hideLoading()
				uni.hideLoading()
			},
			/**
			 * 设置SwiperHeight的高度
			 */
			setSwiperHeight() {
				// 获取系统信息(拿到屏幕宽度)
				let systemInfo = uni.getSystemInfoSync(),
					couponswiperHeight = systemInfo.windowHeight - 120 // swiper高度
				this.couponswiperHeight = couponswiperHeight
			},

			/**
			 *购买数量增减
			 */
			totalNumChange(changeType, {
				forceNum,
				forceFetch
			} = {}) {
				if (this.isLoading) {
					return
				}
				// 重置已选优惠券 https://weliam.coding.net/p/lingdian/requirements/issues/5759/detail
				this.doNotCouponTap(false)
				let {
					order_total_num,
					isMaxBuyLimit
				} = this

				if (typeof forceNum !== 'undefined') {
					order_total_num = forceNum
				} else if (changeType === 'down') {
					if (order_total_num > 1) {
						order_total_num--
					}
				} else if (!isMaxBuyLimit) {
					order_total_num++
				}
				if (this.order_total_num !== order_total_num || forceFetch) {
					uni.showLoading({
						title: '加载中...',
						mask: false
					})
					this.order_total_num = order_total_num
					this.getOrderData(order_total_num)
				}
			},
			/**
			 * 套餐数量改变,支持加1 减1和直接到某个数量
			 * @param {string} changeType 'up':加1 'down':减1 'to':到某个数字
			 */
			totalMealNumChange(changeType, {
				goods_id,
				num,
				goods_sku_id,
				stock_num
			}, mealIndex) {
				console.log(changeType, {
					goods_id,
					num,
					goods_sku_id,
					stock_num
				}, mealIndex)
				let flag = false
				if (changeType === 'to') {
					if (num < 0) {
						uni.showToast({
							icon: 'none',
							title: '数量不能小于0'
						})
						return
					}
					if (num > stock_num) {
						uni.showToast({
							icon: 'none',
							title: `不能超过最大数量${stock_num}`
						})
						return
					}
					flag = true
					this.mealData[mealIndex].goods_num = num
					if (this.options.meal_together_buy == 1) {
						this.mealPirce = 0
						this.mealData.forEach((item, index) => {
							this.mealPirce += parseFloat(item.goods_price) * parseFloat(item.goods_num)
						})
						// - this.order_total_price非常关键
						this.mealPirce = this.mealPirce - this.order_total_price
					}
				} else if (changeType === 'down') {
					if (num >= 1) {
						flag = true
						this.mealData[mealIndex].goods_num--
						if (this.options.meal_together_buy == 1) {
							this.mealPirce = parseFloat(this.mealPirce) - parseFloat(this.mealData[mealIndex].goods_price)

						}

					}
				} else if (changeType === 'up' && num < this.mealData[mealIndex].stock_num) {
					flag = true
					this.mealData[mealIndex].goods_num++
					if (this.options.meal_together_buy == 1) {
						this.mealPirce = parseFloat(this.mealPirce) + parseFloat(this.mealData[mealIndex].goods_price)
					}

				}


				if (flag) {
					// 只能选择一种套餐
					if (this.options.meal_together_buy != 1) {
						this.mealPirce = 0
						// 为什么这里order_total_price又要置为0。。。
						this.order_total_price = 0
						this.mealData.forEach((item, index) => {
							mealIndex != index && (item.goods_num = 0)
							this.mealPirce = parseFloat(this.mealPirce) + (parseFloat(item.goods_price) * parseFloat(item.goods_num))
						})
						this.meal_data = []
					}


					let price = 0
					let priceFake = 0
					this.mealData.forEach(item => {
						if (this.cardId || (this.member_info.is_member == 1 && this.goods_type === 'member_goods')) {
							price = parseFloat(price) + (parseFloat(item.member_coupon_price) * parseFloat(item.goods_num))
						}
						priceFake = parseFloat(priceFake) + (parseFloat(item.member_coupon_price) * parseFloat(item.goods_num))
					})
					this.meal_data.forEach((item, index, arr) => {
						if (item.goods_id == goods_id && item.goods_sku_id == goods_sku_id) {
							arr.splice(index, 1)

						}
					})
					this.member_coupon_price = Number(price).toFixed(2)
					this.member_coupon_price_fake = Number(priceFake).toFixed(2)
					this.mealData[mealIndex].goods_num && this.meal_data.push({
						goods_id,
						num: this.mealData[mealIndex].goods_num,
						goods_sku_id
					})
				}

				// 如果是多规格商品又不是从购物车进来 需要更新expressPriceFinally
				this.fetchExpressPriceFinallyIfNeeded()
			},

			/**
			 * 物流方式切换
			 */
			expressTypeChange(item) {
				this.expressType = item.id

				if (all_coupon_list && all_coupon_list.length > 0) {
					// 切换物流方式时，重置已选优惠券
					this.doNotCouponTap(false)
					if (item.id === 'self') { // coupon_type
						this.coupon_list = this.coupon_list.filter(val => val.coupon_type !== 30)
					} else {
						this.coupon_list.splice(0, this.coupon_list.length, ...all_coupon_list)
					}
				}

			},

			/**
			 * 选择收货地址
			 */
			selectAddress(id) {
				App.navigationTo({
					url: 'pages/subPages/address/' + (this.exist_address ? 'index?from=flow&choose_id=' + id : 'create')
				})
			},

			/**
			 * 切换支付方式
			 */
			payTypeChange(e, balance) {
				this.payType = e.value

				let _this = this
				if (this.payType == 'balance' && !Number(balance)) {

					uni.showModal({
						title: '提示',
						content: '是否前往充值页面进行充值？',
						success: function(res) {
							if (res.confirm) {

								App.navigationTo({
									url: `pages/subPages/balance/recharge?type=1&url=pages/subPages/flow/checkout&order_type=${_this.options.order_type}&goods_id=${_this.options.goods_id}&goods_num=${_this.options.goods_num}&goods_sku_id=${_this.options.goods_sku_id}&transport_type=${_this.options.transport_type}&is_express=${_this.options.is_express}&is_zt=${_this.options.is_zt}&activityId=${_this.options.activityId}&goods_type=${_this.options.goods_type}&group_id=${_this.options.group_id}`
								})
							} else if (res.cancel) {

							}
						}
					})
				}
			},

			/**
			 * 订单支付状态查询
			 */
			orderStatusInquiry(order_id) {
				let _this = this,
					uniacid = App.getUniacid()
				uni.showModal({
					title: '温馨提示',
					content: '请确认当前支付是否已完成',
					cancelText: '未完成',
					confirmText: '已完成',
					success(res) {
						if (res.confirm) {
							console.log('用户已完成支付')
							// 订单状态查询
							App._get('user.order/detail', {
								order_id
							}, result => {
								let orderInfo = result.data,
									pay_status = orderInfo.pay_status.value
								if (pay_status === 20) {
									// 跳转到支付成功
									uni.redirectTo({
										url: `/pages/subPages/flow/success?goods_id=${_this.goods_list[0].goods_id}&order_id=${order_id}&pay_price=${_this.actual_pay_price}&i=${uniacid}&cgp={_this.options.cgp}`
									})
								} else {
									uni.redirectTo({
										url: '/pages/mainPages/order/index?type=payment&i=' + uniacid
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户未完成支付')
							uni.redirectTo({
								url: '/pages/mainPages/order/index?type=payment&i=' + uniacid
							})
						}
					}
				})
			},

			/**
			 * 订单创建成功
			 */
			payOrderReady(e) {
				uni.hideLoading()
				let _this = this,
					source = App.getClientType(),
					payType = this.payType,
					order_id = e.result.data.order_id
				if (source === '4' && payType === 'alipay') {
					_this.isSubmit = true
					_this.payOrderId = order_id
				}
			},

			/**
			 * 订单支付成功
			 */
			paySuccess(e) {
				// 标识是否支付成功 支付成功后不需要刷新buyNow接口
				this.hasPaiedSuccess = true

				let uniacid = App.getUniacid(),
					url =
					`/pages/subPages/flow/success?goods_id=${this.goods_list[0].goods_id}&order_id=${e.order.order_id}&pay_price=${this.actual_pay_price}&is_reservation=${this.options.is_reservation}&isPreShopping=${this.options.isPreShopping}`
				if (this.is_group_type) {
					url = `/pages/subPages/groups/index/index?order_id=${e.order.order_id}`
				}
				if (!!this.options.free_id) {
					url =
						`/pages/subPages/myfreeBill/miandiansuccess?goods_id=${this.options.goods_id}&free_id=${this.options.free_id}&order_id=${e.order.order_id}`
				}
				if (+this.options.cgp === 1) {
					url += '&cgp=1'
				}

				// #ifdef MP-WEIXIN
				let {
					options: {
						goods_sku_id, // 当前购买商品规格
						order_type // 1=普通订单 2拼团订单 3=秒杀 4卡密订单 5砍价订单
					}
				} = this
				url += '&tmpType=' + (order_type === '2' ? 'group' : 'normal')
				// #endif
				// #ifdef H5
				url += '&i=' + uniacid
				// #endif
				// 跳转到支付成功
				uni.redirectTo({
					url
				})
			},

			/**
			 * 订单支付失败
			 */
			payFail(result) {
				// 2-微信小程序 3-H5 4-公众号 7-支付宝小程序 8-百度小程序 9-头条小程序
				console.log('payFail', result)
				this.hasPaiedFail = true
				let clientType = this.$store.state.clientType,
					uniacid = App.getUniacid(),
					url = '/pages/mainPages/order/index?type=payment',
					errMsg = null
				if (clientType === '2') {
					errMsg = result.errMsg === 'requestPayment:fail cancel' ? '订单未支付' : result.err_desc
				} else if (clientType === '4') {
					url += '&i=' + uniacid
					errMsg = result.err_msg === 'get_brand_wcpay_request:cancel' ? '订单未支付' : '支付失败'
					// errMsg = result.errMsg === "chooseWXPay:cancel" ? "订单未支付" : "支付失败";
				} else if (clientType === '7') {
					errMsg = result.resultCode === '6001' ? '订单未支付' : '支付失败'
				} else if (clientType === '8') {
					errMsg = '支付失败'
				} else if (clientType === '9') {
					errMsg = result.errMsg === 'requestPayment:fail cancel' ? '订单未支付' : '支付失败'
				}
				if (errMsg === '订单未支付') {
					uni.showToast({
						icon: 'none',
						title: errMsg
					})
					if (this.options.cgp == 1) {
						uni.redirectTo({
							url: '/pages/subPages/cgp/order/index?type=payment'
						})
						return
					}
					if (this.isCart) {
						uni.redirectTo({
							url
						})
					}
				} else {
					App.showError(errMsg, () => {
						// 跳转到未付款订单
						uni.redirectTo({
							url
						})
					})
				}

			},

			couponTypeChange(e) {
				this.couponType = e.id
			},

			/**
			 * 优惠券点击
			 */
			couponChange(val) {},
			/**
			 * 手机号绑定成功
			 */
			bindMobile(res) {
				console.log('bindMobile', res)
				this.phone = res.mobile
				this.submitOrder()
			},
			/**
			 * 订单提交验证
			 */
			submitVerify(addressData) {
				// 亿奇达
				if(this.options.transport_type == 70) {
					console.log('亿奇达 01')
					const errIndex = this.extraForm.yqd_template.findIndex(item=>!item)
					if(errIndex !== -1) {
						console.log('亿奇达 02',this.cExtraFormItemList[errIndex].tips)
						return {
							condition: true,
							errMsg: '充值信息:'+this.cExtraFormItemList[errIndex].tips
						}
					}
				}
				let {
					hasError,
					error,
					expressType,
					orderForm: {
						user_name: isShowName,
						phone: isShowPhone
					}, // 订单提交样式显示
					tradeStyle, // 是否简易样式
					intra_region, // 配送范围
					rule_success, // 运费模板规则
					name,
					phone,
					options: {
						is_zt
					},
					isCart // 是否购物车结算
				} = this,
				submitFalg = [{
						condition: hasError,
						errMsg: error
					},
					{
						key: 'receipt',
						condition: !addressData && expressType,
						errMsg: `请选择${expressType === 'self' ?  '收货门店' : '收货地址'}`
					},
					{
						condition: expressType === 'self' ? (isShowName === '1' && !name) || (isShowPhone === '1' && !phone) : false,
						errMsg: '请填写完整提货人信息'
					},
					{
						condition: expressType === 'express' && intra_region !== 1,
						errMsg: '当前地址不在配送范围内,请重新选择'
					},
					{
						condition: expressType === 'express' && rule_success !== 1,
						errMsg: '运费计算错误'
					}
				]
				let errMsg = null
				console.log('addressData', addressData)
				for (let value of submitFalg) {
					console.log('value.condition', value.condition)
					if (isCart && value.key === 'receipt') {
						value.condition = is_zt == 1 ? addressData.includes(false) : value.condition

					}
					if (value.condition) {
						return value
					}

				}
				
				return errMsg
			},
			// 获取自定义表单
			getFormInfo(goods_id) {
				App._post_form('form.form/goodsFormDetail', {
					goods_id
				}, res => {
					if (res.code === 1) {
						this.form_id = res.data.form_id || ''
						this.diyDatas = res.data.value || []
						// console.log(this.diyDatas,'00000000000')
					}
				})
			},
			// 监听表单数据
			changeFormDatas(datas) {
				// console.log('哈哈哈哈哈哈哈哈哈哈')
				// console.log(datas)
				// console.log('哈哈哈哈哈哈哈哈哈哈---------')
				this.diyDatas = datas
			},
			/**
			 * 订单提交
			 */
			submitOrder() {

				if (this.diyDatas && this.diyDatas.length > 0) {
					this.$refs.diyForm.saveFormInfo().then(res => {
						// console.log(res,'hhhhhhhhhhhhhhhhh',JSON.stringify(res) !== "{}")
						if (JSON.stringify(res) !== '{}') {
							this.form_submit_id = res.data.form_submit_id || ''
							this.submitOrderReal()
						}
					})
				} else {
					this.submitOrderReal()
				}
			},
			async submitOrderReal({
				onlyGetData = false
			} = {}) {
				console.log('submitOrderReal onlyGetData', onlyGetData)
				let {
					options: {
						goods_id, // 商品id,
						goods_sku_id, // 商品规格id
						transport_type, // 10核销商品 20物流商品 30卡密商品 40社区团购
						group_id, // 拼团id
						groups_group_id, // 团id
						activityId,
						free_id,
						order_type, // 订单类型
						goods_type, // 商品类型
						is_zt, // 是否自提
						is_meal,
						run_errands 
					},
					meal_data,
					time,
					storeId,
					remarkSub,
					expressType, // 物流方式
					address, // 收货地址
					store, // 门店地址
					disabled, // 购买按钮禁用
					goodsData, // 商品详情
					order_total_num, // 购买数量
					is_integral_rebate, // 是否使用积分抵扣
					cardId, // 会员卡id
					selectCoupon, // 已选优惠券详情
					bank, // 支付营销数据
					actual_pay_price, // 当前支付金额
					name, // 用户名称
					phone, // 用户手机号
					remark, // 订单备注
					isCart, // 是否购物车结算
					form_submit_id // 提交表单返回的id（关联订单详情）
				} = this,

				$store = this.$store.state,
				storeData = $store.storeData, // 门店地址
				addressData = (transport_type == '10' && is_zt != 1) || transport_type == '30' || transport_type == '50' ? !0 :
				expressType == 'express' || expressType == 'city' ?
				address : (isCart ? goodsData.map(val => !!val.store) : transport_type == '10' || transport_type == '50' ? !0 :
					store) // 收货地址：核销商品，卡密商品
				
				// 判断是否需要勾选商品退款协议
				if (this.cNeedNoRefund && !this.noRefundchecked) {
					App.showError('请阅读和勾选商品不退款协议')
					return
				}
				// 套餐预约商品的数据处理
				if (this.options.isPreShopping == 1 && this.options.is_reservation == 1 && this.isMeal) {

					let flag = true
					this.mealData.forEach(item => {
						if (item.goods_num > 0 && (!item.time || !item.storeId)) {
							flag = false
						}
					})
					if (!flag) {
						App.showError('请选择该套餐的预约时间或者门店')
						return
					}


				}

				if (this.options.isPreShopping == 1 && this.options.is_reservation == 1 && this.isMeal) {
					this.mealData.forEach(item => {
						meal_data.forEach(item1 => {
							if (item.spec_sku_id == item1.goods_sku_id) {
								item1.remarks = item.remarkSub
								item1.id = item.storeId
								item1.time = new Date(item.time).getTime()
							}
						})
					})
				}
				if (transport_type !== '40') {
					let submitVerify = this.submitVerify(addressData) // 把收货地址验证之后提交
					console.log('submitVerify', submitVerify)
					// 提交条件判断
					if (!!submitVerify && submitVerify.condition) {
						App.showError(submitVerify.errMsg)
						this.disabled = false
						return false
					}
				}
				if (this.isMeal && !this.isSelectMealNum) {
					App.showError('请选择套餐')
					return
				}
				if (transport_type === '60') {
					// 票务商品用户信息检查
					for (let i = 0, len = this.ticketingUserActiveItems.length; i < len; i++) {
						const val = this.ticketingUserActiveItems[i]
						if (!val.info_id || `${val.info_id}`.indexOf('fake') !== -1 || !val.name || !val.phone) {
							this.handleBtnEditTicketingUserClick(val)
							return
						}
						if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val.phone)) {
							App.showError('票务手机号格式不正确')
							return
						}
						if (this.cNeedIdCard && !val.credit_no) {
							App.showError(`请先填写票务用户信息(${i + 1}/${len})的身份证号`)
							return
						}
					}
				}
				// 预约商品的判断
				if (this.options.isPreShopping == 1 && this.options.is_reservation == 1 && !this.isMeal) {
					if (!this.time) {
						App.showError('请选择预约时间')
						return

					}
					if (!this.storeBus) {
						App.showError('请选择预约门店')
						return

					}
				}

				if (disabled && transport_type !== '40') {
					return
				}
				// 是否绑定手机号
				if (this.isShowBindBtn) {
					return
				}
				// 订阅消息
				if (!onlyGetData) {
					this.saveFormId('pay', {
						type: 'normal',
						goods_id: this.options.goods_id || ''
					})
				}


				this.disabled = true
				// fix https://weliam.coding.net/p/lingdian/bug-tracking/issues/10555/detail
				const express_type = ((this.navList && this.navList.length ? this.navList : [
					{
						id: 'self',
						title: '上门自提',
						value: 2
					},
					{
						id: 'express',
						title: '快递配送',
						value: 1
					},
					{
						id: 'city',
						title: '同城配送',
						value: 6
					}
				]).find(item=> item.id == expressType) || {}).value
				console.log('express_type', expressType,express_type, this.navList)
				// 创建订单-立即购买
				let payData = {
					pay_from: isCart || is_meal == 1 ? 'cart' : 'checkout',
					group_id: group_id || '',
					groups_group_id: groups_group_id || '',
					coupon_id: !!selectCoupon ? selectCoupon.user_coupon_id : '',
					remark: remark,
					express_type,
					remarks: remarkSub,
					time: new Date(time).getTime(),
					id: storeId,
					bus_id: this.options.bus_id,
					goods_id: this.options.goods_id,
					activityId: activityId || '',
					userId: App.getUserId(),
					userDeaerID: $store.refereeId,
					order_type: order_type,
					bank_content: bank ? bank.content : '',
					actual_pay_price: actual_pay_price,
					is_integral_rebate: is_meal == 1 ? 2 : (is_integral_rebate ? 1 : 2),
					form_submit_id: form_submit_id,
					cgp: this.options.cgp,
					free_id: free_id || '',
					yqd_template: this.extraForm.yqd_template.join(','),
					rrr_id: this.rightOffShown ? this.cRightOff.id : ''
				}

				if (this.cNeedNoRefund) {
					payData.i_agree = this.noRefundchecked ? 1 : 2
				}


				// if() {
				// 	payData.free_id = 

				// }


				let goods_list_data = {
					goods_id: goods_id,
					goods_num: order_total_num,
					goods_sku_id: goods_sku_id,
					goods_sku_title: goodsData.goods_attr || '',
					addressOrStore: ['express','city'].includes(expressType) ? (addressData ? addressData.address_id : '') : (store ?
						store.id : '')
				}

				if (is_meal && +this.options.transport_type === 60) {
					goods_list_data.goods_sku_id = this.ticketingSpecSkuActiveId || options.goods_sku_id
				}

				// 是否购物车结算
				if (isCart) {
					let Base64 = new this.$util.Base64(),
						goods_list = []
					// 购物车结算商品列表数据整理
					console.log('goodsData', goodsData)
					// transport_type ==40 ?goodsData=goodsData[0].goods_list:'';
					goodsData.map(storeItem => {
						let goods_item = {}
						if (transport_type != 40) {
							goods_item.bus_id = storeItem.id
							goods_item.addressOrStore = ['express','city'].indexOf(expressType) !== -1 ? (addressData ? addressData.address_id : '') : (is_zt ==
								1 ? storeItem.store.id : '')

						}

						goods_item.goods_list = storeItem.goods_list.map(goodsItem => {
							let item = {}
							item.goods_id = goodsItem.goods_id
							item.goods_num = goodsItem.total_num
							item.goods_sku_id = goodsItem.goods_sku_id
							item.goods_sku_title = goodsItem.goods_attr || ''
							return item
						})
						goods_list.push(goods_item)
					})
					goods_list_data = Base64.encode(JSON.stringify(goods_list))
				}

				// 合并商品相关数据
				Object.assign(payData, isCart ? {
					goods_list: goods_list_data
				} : goods_list_data)

				if (is_meal && +this.options.transport_type === 60) {
					meal_data = [{
						goods_id: this.options.goods_id,
						goods_sku_id: this.ticketingSpecSkuActiveId,
						num: +this.order_total_num || 0
					}]
				}
				if (is_meal == 1) {
					console.log(meal_data, '套餐数据')

					let Base64 = new this.$util.Base64(),
						data = Base64.encode(JSON.stringify(meal_data))

					Object.assign(payData, {
						meal_data: data,
						meal: 1
					})

				}
				if (goods_type === 'buy_member') {
					Object.assign(payData, {
						memberType: '3'
					})
				}
				if (goods_type === 'member_goods') {
					if (this.member_info.is_member === 1) {
						Object.assign(payData, {
							goods_type: 'member_goods'
						})
					}
					if (!!cardId) {
						Object.assign(payData, {
							memberType: '4',
							memberCard: cardId
						})
					}
				}
				// 提货人信息提交
				if (expressType === 'self') {
					let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/
					if (this.orderForm.phone === '1') {
						if (reg.test(this.phone)) {
							Object.assign(payData, {
								user_name: name,
								phone: phone
							})
						} else {
							App.showError('手机号格式有误，请输入正确的手机号')
							this.disabled = false
							return false
						}

					} else {
						Object.assign(payData, {
							user_name: name,
							phone: phone
						})

					}

				} else if (transport_type === '60') {
					Object.assign(payData, {
						travel_date: this.$util.deepGet(this.cCalendarPriceTime, 'timeStamp', ''),
						user_name: this.$util.deepGet(this.ticketingUserActiveItems, '0.name', ''),
						phone: this.$util.deepGet(this.ticketingUserActiveItems, '0.phone', ''),
						credit_no: this.$util.deepGet(this.ticketingUserActiveItems, '0.credit_no', ''),
						fields: this.ticketingUserActiveItems.map(val => val.info_id)
					})
				} else if (transport_type !== '40' && transport_type !== '70') {
					Object.assign(payData, {
						user_name: addressData.name,
						phone: addressData.phone
					})
				} else {
					Object.assign(payData, {
						user_name: name,
						phone: phone
					})
				}

				if (transport_type == 40 && (JSON.stringify(this.bind_reg) == '{}' || this.bind_reg.length == 0)) {

					uni.showModal({
						title: '提示',
						content: '亲，您还没有绑定团长哦！',
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/subPages/cgp/address/address'
								})
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})
					return
				}
				if(this.options.cart_type === 'store_wm') {
					Object.assign(payData, {
						store_id: this.options.store_id,
						cart_type: this.options.cart_type
					})
				}
				if (onlyGetData) {
					console.log('onlyGetData', payData)
					this.disabled = false
					return payData
				}
				
				
				this.$store.commit('orderPay', payData)
				this.onToggleList(() => {
					this.disabled = false
				})

			},

			/**
			 * 门店选择
			 */
			storeSelect(store_id, bus_id, goods_id) {
				let isCart = this.isCart
				App.navigationTo({
					url: `pages/subPages/store/list?&bus_id=${bus_id}&goods_id=${goods_id}&bustypeid=1${store_id ? '&store_id=' + store_id : ''}`
				})
			},

			/**
			 * 买家留言
			 */
			bindRemark(e) {
				this.setData({
					remark: e.detail.value
				})
			},

			/**
			 * 开通会员卡列表
			 */
			getOrderCard(goods_id = '', goods_sku_id = '', num = 1) {
				let cart_indexes = (!!this.options && !!this.options.cart_indexes) ? JSON.parse(this.options.cart_indexes) : '',
					_this = this
				App._post_form('member.Member/getOrderCard', {
					goods_id,
					goods_sku_id,
					cart_indexes: cart_indexes,
					num
				}, res => {
					_this.setData(res.data)
				})
			},

			/**
			 * 加载更多会员卡
			 */
			moreCardList() {
				let _this = this,
					member_number = _this.member_number,
					cardlistnum = _this.cardList.length
				if (member_number === 0) {
					_this.setData({
						member_number: cardlistnum
					})
				} else if (member_number === cardlistnum) {
					_this.setData({
						member_number: 0
					})
				}
			},

			/**
			 * 切换会员卡
			 */
			select_card(memberCardInfo) {
				let {
					cardId,
					mealData,
					options: {
						is_meal
					}
				} = this
				// 取消选择
				if (memberCardInfo.card_id === cardId) {
					this.setData({
						cardId: null,
						card_price: 0,
						member_coupon_price: 0,
						max_rebate_money: !!this.old_max_rebate_money ? this.old_max_rebate_money : this.max_rebate_money
					})
					// this.getOrderData();
				} else {
					let price = 0
					mealData.forEach(item => {
						price = parseFloat(price) + (parseFloat(item.member_coupon_price) * parseFloat(item.goods_num))
					})

					this.setData({
						cardId: memberCardInfo.card_id,
						card_price: memberCardInfo.card_price,
						member_coupon_price: this.isCart ? this.coupon_price.toFixed(2) : is_meal == 1 ? price : (this.coupon_price.toFixed(
							2) * this.order_total_num).toFixed(2),
						old_max_rebate_money: this.max_rebate_money,
						max_rebate_money: !!this.integral_rebate_money_vip || this.integral_rebate_money_vip === 0 ? this.integral_rebate_money_vip :
							this.max_rebate_money
					})
				}
			},

			/**
			 * 选择优惠券(弹出/隐藏)
			 */
			togglePopupCoupon() {
				if (this.couponNum > 0) {
					this.showBottomPopup = !this.showBottomPopup
				}
			},
			/**
			 * 可使用优惠券初始化
			 */
			couponUseInit(goodsPrice) {
				let {
					coupon_list, // 可使用优惠券
					coupon_list_no // 可使用红包
				} = this,
				useCouponList, useBonusList
				// 优惠券过滤
				if (all_coupon_list && all_coupon_list.length > 0) {
					useCouponList = all_coupon_list.filter(val => (val.rule === 0 ? goodsPrice >= Number(val.rule_min_money) : true))
					this.coupon_list = useCouponList
				}
				// 红包过滤
				if (all_coupon_list_no && all_coupon_list_no.length > 0) {
					useBonusList = all_coupon_list_no.filter(val => (val.rule === 0 ? goodsPrice >= Number(val.rule_min_money) : true))
					this.coupon_list_no = useBonusList
				}
			},
			/**
			 * 选择优惠券
			 */
			selectCouponTap(coupon, isOpenCoupon = true) {
				// 优惠券折扣金额
				let reducePrice = Number(coupon.reduce_price),
					express_price = Number(this.express_price).toFixed(2),
					actual_pay_price = null, // 计算后订单价格
					express_price_calc = null // 计算后邮费
				// 优惠券类型判断
				if (coupon.coupon_type === 30) { // 运费券
					express_price_calc = express_price > reducePrice ? Number(express_price - reducePrice) : 0
					this.express_price_calc = Number(express_price_calc).toFixed(2)
				} else {
					this.express_price_calc = express_price
				}
				this.selectCoupon = coupon
				if (isOpenCoupon) {
					this.togglePopupCoupon()
				}
			},

			/**
			 * 优惠券优惠价格计算
			 */
			couponCutMoney(coupon, goodsPrice) {
				let coupon_type = coupon.coupon_type,
					cut_price = 0, // 优惠金额
					pay_price = 0 // 优惠后支付金额
				if (coupon_type === 10 || coupon_type === 30 || coupon_type === 40) {
					cut_price = Number(coupon.reduce_price)
					pay_price = goodsPrice - Number(coupon.reduce_price)
				} else if (coupon_type === 20) {
					let discount = Number(coupon.discount)
					pay_price = goodsPrice * discount * 0.1
					cut_price = goodsPrice * (1 - discount * 0.1)
					if (coupon.max_price_type === 1 && Number(cut_price) > Number(coupon.max_price)) {
						cut_price = Number(coupon.max_price)
						pay_price = goodsPrice - Number(coupon.max_price)
					}
				}
				this.cut_price = cut_price.toFixed(2)
				return {
					pay_price,
					cut_price
				}
			},

			/**
			 * 不使用优惠券
			 */
			doNotCouponTap(isToggle = true) {
				this.selectCoupon = null
				this.cut_price = 0
				this.express_price_calc = this.express_price
				this.$refs.coupon.currentindex = -1
				isToggle && this.togglePopupCoupon()
			},

			/**
			 * 显示隐藏支付方式选择
			 */
			onToggleList(callback) {
				this.$refs.orderPay.onToggleList(callback)
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		min-height: 100vh;
		overflow: hidden;
		padding: 20rpx 30rpx 120rpx;
		box-sizing: border-box;
		background-color: #F7F7F7;
		/* #ifdef H5 */
		-webkit-backface-visibility: hidden;
		-webkit-transform: translate3d(0, 0, 0);
		/* #endif */
	}

	.content-main {
		border-radius: 10rpx;
		padding: 20rpx 40rpx 20rpx 40rpx;
	}

	.address-line {
		height: 6rpx;
		width: 100%;
		display: block;
	}

	.content-main image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	/* 地址选择 */
	.page-nav {
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		overflow: hidden;

		.address-line {
			height: 6rpx;
			width: 100%;
			display: block;
		}

		.flow-checkout-header {
			background: #FFFFFF;
			padding: 20rpx 30rpx;

			.flow-header-left {
				width: 100%;
			}

			.flow-checkout-address-detail {
				color: #333333;
				font-weight: bold;
				margin: 12upx 0;
			}

		}

		/* 门店自提样式 */
		.self-container {
			border-radius: 10upx;

			.self-userinfo {
				padding: 0 30upx;
				background: #FFFFFF;
				border-radius: 10upx;

				// .input-item {
				// 	font-size: 28upx;
				// 	height: 90upx;
				// 	line-height: 90upx;

				// 	&:last-child {
				// 		border: 0;
				// 	}

				// 	.input-label {
				// 		width: 4.2em;
				// 		margin-right: 20upx;
				// 	}

				// 	.input {
				// 		flex: 1
				// 	}
				// }
			}

		}

		.store-info {
			background: #FFFFFF;
			border-radius: 10upx;

			.store-detail {
				padding: 20upx 0;
				margin-left: 40upx;

				.icon-location {
					font-size: 40upx;
					margin-right: 20upx;
				}

				.store-content {
					line-height: 1em;

					.store-address {
						margin-top: 12upx;
					}
				}
			}

			.choose-store {
				font-size: 28upx;
				color: #333333;
				padding: 20upx 50upx;
				margin: 20upx auto;
				border: 1upx dashed #EEEEEE;
			}
		}
	}


	.price-font-family {
		color: #FE504F;
		font-size: 32rpx;

		&.col-3 {
			color: #333333;
		}
	}


	.checkout_list {
		padding: 0 30upx 0 30upx;
		background: #fff;
	}

	.flow-shopList {
		padding: 0;
	}

	.checkout_list .flow-shopList {
		border-bottom: 1upx solid #eee;
	}

	.checkout_list .flow-shopList:last-child {
		border-bottom: 0;
	}


	.flow-checkout-address text {
		font-size: 20upx;
		line-height: 1.5em;
		display: inline-block;
		margin-right: 15upx;
		// color: #FFD940;
		// color: var(--theme-color);
		padding: 0 10upx;
		// border: 1upx solid #FFD940;
		// border: 1upx solid var(--theme-color);
		border-radius: 8upx;
		background: #f00;
		color: #FFFFFF;
	}


	.flow-num-box.b-f.padding-box {
		padding: 20upx 30upx;
	}

	/* 优惠券选择 */

	.popup__coupon {
		width: 100vw;
		height: 100vh;
		/* #ifdef H5 */
		/* height: calc(100vh - var(--window-top)); */
		/* #endif */
		background: #F0F0F0;
	}

	/**
	 * 边框none
	 */
	.flow-border-none {
		border: none !important;
	}

	.flow-border-none:last-child::after {
		border: none !important;
	}

	.member {
		border-radius: 10rpx;
		overflow: hidden;
	}

	.member-header .header-left {
		padding: 0 20upx 0 30upx;
		max-width: 45%;
		height: 44upx;
		background-size: 160upx, 44upx;
		background-color: #000000;
		border-radius: 10rpx 0 0 0;
	}

	.header-left .left-member-logo {
		width: 22upx;
		min-width: 22rpx;
		height: 22upx;
		background-image: url('~@/static/images/member/member.png');
		background-size: 22upx 22upx;
		background-repeat: no-repeat;
		margin-right: 10upx;
	}

	.member-header .header-right {
		width: 376upx;
		height: 44upx;
		line-height: 44upx;
		background: linear-gradient(to right, #E7CFAC, #F1E0CE);
		border-radius: 0 0 10upx 0;
	}

	.header-left .left-member-title {
		color: #F0DAAC;
	}

	.member-header .header-right text {
		color: #FE504F;
	}

	.member-nowprice {
		color: #FE504F;
	}

	.member-list .member-list-items {
		position: relative;
		padding: 20upx 110upx 20upx 30upx;
		/* border-bottom: 1px solid #EEEEEE; */
	}

	.member-list .member-list-items .select-logo {
		position: absolute;
		right: 30upx;
		top: 50%;
		transform: translateY(-50%);
	}

	.member-list .member-list-items .select-logo image {
		width: 36upx;
		height: 36upx;
	}

	.goods-num {
		padding: 20rpx 30rpx;
		border-radius: 10rpx;

		.num-btn {
			width: 50rpx;
			height: 50rpx;
			line-height: 50rpx;
			margin: 0 4rpx;
			background: #F8F8F8;
			text-align: center;
			font-size: 24rpx;

			&.disabled {
				color: #999999;
			}
		}
	}

	.order-flow-num-box {
		font-size: 28upx;
		color: #333;
		padding: 28upx 0;
		text-align: right;
		border-top: 1upx solid #EEEEEE;
		margin: 0 30upx;
	}

	.order-return {
		border-top: 1upx solid #F7F7F7;
		/* padding: 20upx 0; */
		margin: 0 30upx;
	}

	.order-retur-bank {
		width: 252rpx;
		height: 72rpx;
		display: inline-block;
		vertical-align: middle;
		margin-right: 12rpx;
	}

	.order-integral {
		padding: 20rpx 24rpx;

		.integral-switch {
			zoom: .72;
			margin-right: -10rpx;
		}
	}

	.more-icon {
		font-size: 26upx !important;
		vertical-align: middle;
		margin-left: 6upx;
	}

	.flow-all-money,
	.goods-list {
		border-radius: 10rpx;
		overflow: hidden;

		.goods-store {
			height: 80rpx;
			line-height: 80rpx;
			border-bottom: 1rpx solid #EEEEEE;
			margin: 0 30rpx;
		}

		.store-item {
			margin-bottom: 20rpx;
			border-radius: 10rpx;
		}
	}

	.goods-info {
		padding: 30rpx;

		.goods-image-box {
			width: 130rpx;
			height: 130rpx;
			margin-right: 20rpx;

			.goods-image {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				width: 100%;
				height: 100%;
				z-index: 1;
				border-radius: 10rpx;
			}

			.group-num {
				position: absolute;
				top: 0;
				left: 0;
				font-size: 24upx;
				line-height: 38upx;
				color: #FFFFFF;
				/* width:76upx; */
				height: 38upx;
				background: linear-gradient(90deg, rgba(254, 80, 79, 1), rgba(254, 133, 79, 1));
				box-shadow: 0 2upx 10upx 0 rgba(254, 80, 79, 0.54);
				border-radius: 10upx 0 6upx 0;
				z-index: 2;
				text-align: center;
			}
		}

		.goods-detail {
			height: 130rpx;
		}
	}

	.flow-fixed-footer {
		position: fixed;
		top: calc(100vh - 100rpx - 1px);
		left: 0;
		right: 0;
		bottom: auto;
		width: 100%;
		border-top: 1px solid #eee;
		z-index: 11;
	}

	.user-input {
		padding: 0 30rpx;
		border-radius: 10rpx;

		.user-input-item {
			height: 82rpx;
			line-height: 82rpx;

			.input-label {
				width: 6em;
			}

			.input {
				flex: 1;
				text-align: right;
				font-size: 28rpx;
			}

			.ipt-wrapper.input {
				width: 100%;
				height: 60upx;
				line-height: 60upx;
				padding-left: 20upx;
				border-radius: 10upx;
				background-color: #F2F2F2;
				text-align: left;
			}
		}
	}

	.icon-jinrujiantou1 {}

	.goods-detail {
		.goods-title {
			width: 90%;
		}

		.goods-scp {
			width: 85%;
			height: 2.6em;
			line-height: 1.3em;
			margin-right: 20upx;
		}
	}

	// 单选的套餐（如票务套餐）
	.meal-selector {
		margin-top: 20rpx;
		border-radius: 10rpx;
		background-color: #fff;
	}

	.meal-selector__header {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: 86rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333;
	}

	.meal-selector__content {
		box-sizing: border-box;
		padding: 0 30rpx 30rpx 30rpx;
		display: flex;
		flex-wrap: wrap;
	}

	.meal-selector__option {
		display: inline-flex;
		align-items: center;
		box-sizing: border-box;
		height: 44rpx;
		padding: 0 16rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		font-size: 24rpx;
		color: #333;
		white-space: nowrap;
		border: 1px solid #ccc;
		border-radius: 6rpx;

		&.is-active {
			color: #FE504F;
			border-color: #FE504F;
		}
	}

	.meal-selector__footer {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 86rpx;
		padding: 10rpx 30rpx;
		border-top: 1px solid #eee;
	}

	.meal-selector__footer__left {
		font-size: 28rpx;
		color: #333333;
	}

	.meal-selector__footer__right {
		display: flex;
		align-items: center;
	}

	.meal-selector__btn-reduce,
	.meal-selector__num,
	.meal-selector__btn-add {
		box-sizing: border-box;
		display: block;
		height: 50rpx;
		min-width: 50rpx;
		margin: 0 4rpx;
		padding: 0 6rpx;
		// 700和老版本保持一致
		font-weight: 700;
		font-size: 28rpx;
		color: #999;
		line-height: 50rpx;
		text-align: center;
		white-space: nowrap;
		background-color: #F8F8F8;
	}

	.meal-selector__btn-reduce,
	.meal-selector__btn-add {
		font-size: 24rpx;
		color: #333333;

		&.is-disabled {
			color: #999;
		}
	}

	// 单选的套餐（如票务套餐）end
	// 票务用户信息
	.ticketing-info-card {
		box-sizing: border-box;
		margin-top: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.ticketing-info-card__header {
		box-sizing: border-box;
		min-height: 86rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;

	}

	.ticketing-info-card__title {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333;

		.ticketing__label-default {
			margin-left: 10rpx;
		}
	}

	.ticketing__label-default {
		display: inline-flex;
		align-items: center;
		height: 28rpx;
		padding: 0 4rpx;
		font-size: 20rpx;
		line-height: 1;
		color: #333333;
		background-color: #FFD940;
		border-radius: 4rpx;
	}

	.ticketing-info-card__btn-edit {
		font-size: 28rpx;
		color: #FE504F;
	}

	.ticketing-info-card__content {
		box-sizing: border-box;
		padding: 0 30rpx;
		border-top: 1px solid #eee;
	}

	.ticketing-info-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 86rpx;
		padding: 8rpx 0;
		font-size: 28rpx;
		color: #333;

		&+& {
			border-top: 1px solid #eee;
		}
	}

	.ticketing-info-item__title {
		flex-shrink: 0;
		white-space: nowrap;
	}

	.ticketing-info-item__text {
		margin-right: 16rpx;
		text-align: right;
	}

	// 票务用户信息 end
	// 票务用户信息添加按钮
	.ticketing-info-card__btn-add {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #999999;

		.has-content & {
			color: #333333;
		}

		.iconfont {
			margin-left: 20rpx;
			font-size: 28rpx;
			color: #333333;
		}
	}

	// 票务用户信息添加按钮 end
	// 票务选择用户弹窗
	.ticketing-user-selector {
		width: 100vw;
		padding-bottom: 1px;
		min-height: 592rpx;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;

		.ticketing-user-editor__btn-submit {
			width: 690rpx;
			margin: 30rpx auto;
		}
	}

	.ticketing-user-selector__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8rpx 30rpx;
		min-height: 110rpx;
	}

	.ticketing-user-selector__title {
		font-weight: bold;
		font-size: 32rpx;
		color: #333;
	}

	.ticketing-user-selector__btn-add {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 46rpx;
		padding: 0 16rpx;
		font-size: 24rpx;
		color: #333333;
		border-radius: 23rpx;
		border: 1px solid #999999;

		.iconfont {
			margin-left: 10rpx;
			font-size: 24rpx;
		}
	}

	.ticketing-user-selector__content {
		padding: 0 30rpx;
	}

	.ticketing-user-item {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 148rpx;
		padding: 0 30rpx;
		border-radius: 10rpx;

		&.is-active {
			border: 1px solid #CCCCCC;
			box-shadow: 0px 2px 8px 0px rgba(221, 221, 221, 0.35);
		}
	}

	.ticketing-user-item__btn-edit {
		height: 60rpx;
		width: 60rpx;
	}

	.ticketing-user-item__icon-radio {
		box-sizing: border-box;
		height: 40rpx;
		width: 40rpx;
		border: 1px solid #333;
		border-radius: 40rpx;

		&.is-active,
		.is-active & {
			box-shadow: inset 0 0 0 10rpx #fff;
			background-color: #333;
		}
	}

	.ticketing-user-item__center {
		flex: 1;
		width: 0;
		margin-left: 30rpx;
	}

	.ticketing-user-item__name {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		.ticketing__label-default {
			margin-left: 10rpx;
			font-weight: normal;
		}
	}

	.ticketing-user-item__phone {
		font-size: 24rpx;
		color: #999;
	}

	// 票务选择用户弹窗 end
	// 票务编辑用户弹窗
	.ticketing-user-editor {
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 20rpx;
		width: 690rpx;
	}

	.ticketing-user-editor__header {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 108rpx;
		padding: 0 30rpx;
	}

	.ticketing-user-editor__btn-cancel,
	.ticketing-user-editor__btn-del {
		font-size: 28rpx;
		color: #999;
	}

	.ticketing-user-editor__btn-cancel {
		color: #FF4444;
	}

	.ticketing-user-editor__title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.ticketing-user-editor__content {
		border-top: 1px solid #eee;
		padding: 0 30rpx;
	}

	.ticketing-user-editor__row {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 108rpx;
		font-size: 28rpx;
		color: #333;

		&+& {
			border-top: 1px solid #eee;
		}
	}

	.ticketing-user-editor__input {
		font-size: 28rpx;
		color: #333;
		text-align: right;
		min-width: 240rpx;
	}

	.ticketing-user-editor__switch {
		transform: scale(0.7, 0.7)
	}

	.ticketing-user-editor__btn-submit {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 80rpx;
		margin: 30rpx 0;
		font-size: 28rpx;
		color: #333;
		border-radius: 40rpx;
		background-color: #FFD940;
	}

	// 票务编辑用户弹窗 end
	// 编辑购买数量弹窗
	.edit-num-card {
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 20rpx;
		width: 540rpx;
	}

	.edit-num-card__header {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 108rpx;
		padding: 0 30rpx;
	}

	.edit-num-card__title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.edit-num-card__input {
		display: block;
		height: 64rpx;
		width: 270rpx;
		margin: 0 auto;
		font-size: 28rpx;
		color: #333;
		text-align: center;
		border: 1px solid #eee;
		border-radius: 4rpx;
		line-height: 64rpx;
	}

	.edit-num-card__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 40rpx;
		height: 80rpx;
		border-radius: 0 0 10rpx 10rpx;
		overflow: hidden;
	}

	.edit-num-card_btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 80rpx;
		font-size: 28rpx;
		color: #333;
		background-color: #FFD940;

		&.is-cancel {
			border-top: 1px solid #eee;
			background-color: transparent;
		}
	}

	// 编辑购买数量弹窗 end
	// 商品不退款协议
	.no-refund {
		display: flex;
		align-items: center;
		padding: 24rpx 30rpx;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 10px;
	}

	.no-refund__center {
		flex: 1;
		font-weight: bold;
		font-size: 24rpx;
		color: #333;
		margin-left: 16rpx;
	}

	.no-refund__right {
		margin-left: 16rpx;
	}

	// 商品不退款协议 end
	// 商品退款协议弹窗
	.refund-agreement-popup__btn-close {
		margin-top: 40rpx;
		color: #fff;
		font-size: 50rpx;
		text-align: center;
	}

	.refund-agreement-card {
		width: 580rpx;
		border-radius: 10px;
		background-color: #fff;
	}

	.refund-agreement-card__header {
		display: flex;
		min-height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 40rpx;
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
		text-align: center;
	}

	.refund-agreement-card__content {
		height: 600rpx;
		box-sizing: border-box;
		padding: 30rpx 40rpx;
	}

	// 商品退款协议弹窗 end
</style>

<style lang="scss" scoped>
	.btn-select-team {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 170rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		font-weight: bold;
		font-size: 28rpx;
		color: #333;
		border-radius: 10rpx;
		background-image: url("~@/static/images/order/address_line.png");
		background-position: left bottom;
		background-repeat: repeat-x;
		background-size: 360px 6px;

		.iconfont {
			font-size: inherit;
			margin-right: 8rpx;
			line-height: 1;
		}
	}
</style>
