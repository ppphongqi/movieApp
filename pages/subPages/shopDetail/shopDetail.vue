<template>
	<view :style="cContainerStyle" class="container">
		<view class="header-bg-wrapper">
			<img class="header-bg"
				:src="swiperImage && swiperImage[0] && swiperImage[0].file && swiperImage[0].file[0] && swiperImage[0].file[0].file_path"
				alt="">
		</view>
		<view class="main">
			<view class="shop-detail">
				<view class="goods-header">
					<block v-if="bannerType === 'imgs'">
						<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
							<swiper-item v-for="(item,index) in swiperImage">
								<view class="swiper-item">
									<image class="swiper-item__image"
										:src="item.file && item.file.length &&item.file[0].file_path?  item.file[0].file_path:''"
										mode=""></image>
								</view>
							</swiper-item>
						</swiper>

					</block>
					<block v-else>
						<view class="goods-video">
							<DiyVideo objectFit="cover" :params="videoParams.params" :item-style="videoParams.itemStyle"
								:height="472"></DiyVideo>
						</view>
					</block>
					<view class="banner-change dis-flex flex-dir-row" v-if="data.video && data.video.file_path">
						<view class="change-item "
							:class="{'active main-bg-color auxiliary-color':bannerType === 'video'}"
							@click="bannerChange">视频</view>
						<view class="change-item"
							:class="{'active main-bg-color auxiliary-color':bannerType === 'imgs'}"
							@click="bannerChange">图片</view>
					</view>
				</view>



				<view class="dis-flex flex-y-center flex-x-between m-top30">
					<view class="dis-flex flex-y-center ">
						<view style="width: 336rpx;">
							<text class="dis-block f-w f-36">{{data.business_name}}</text>
							<text class="dis-block f-w f-24">{{data.name}}</text>
						</view>
						<text class="f-20 store-label col-f m-left20"
							v-if="data.store_label">{{data.store_label}}</text>
						<text class="f-20  work-status m-left20">{{data.week==1?'营业中' :"暂停营业"}}</text>
					</view>
					<!-- #ifdef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO -->
					<button @click="handleBtnShareClick" :data-share-type="posterType"
						style="background-color: #fff;width: 36rpx;height: 36rpx;padding: 0;line-height: 0;">
						<image src="../../../static/images/goods/fenxiang.png" style="width: 36rpx;height: 36rpx;"
							mode=""></image>
					</button>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<!-- <view class="iconfont icondianhua" @click="shareBtn">
						
					</view> -->
					<image @click="handleBtnShareClick" src="../../../static/images/goods/fenxiang.png"
						style="width: 36rpx;height: 36rpx;" mode="" @click="shareBtn"></image>

					<!-- #endif -->
				</view>
				<view class="dis-flex   m-top20">
					<view class=" dis-flex ">
						<view class=" dis-flex  f-28">
							<view class="" style="position: relative;width: 16px;height: 16px;"
								v-for="(items,itemsdex) in [1,2,3,4,5]" :key="itemsdex">
								<image v-if="((itemsdex+1+itemsdex)/2)==data.store_score"
									src="../../../static/images/goods/half.png" mode=""
									:style="((itemsdex+1+itemsdex)/2)==data.store_score?'z-index:2':''"
									style="position: absolute;top: 2rpx;left: 2rpx;width: 12px;height: 12px;"></image>
								<view v-if="((itemsdex+1+itemsdex)/2)!=data.store_score"
									style="position: absolute;top: 0;left: 0;"
									class="iconfont icon-shoucangxiao select "
									:style="items<=Math.round(data.store_score)?'color:#F28243;font-size:12px;':'color:#F4F4F4;font-size:12px;'">
								</view>

							</view>

						</view>

						<view class="f-22 col-6 m-left12">{{data.store_score}}分</view>
					</view>
					<text class="f-22 col-6 m-left20">￥{{data.per_capita}}/人 </text>
				</view>
				<view class="dis-flex flex-x-between flex-y-center m-top30">
					<view class="f-24 col-6 twolist-hidden" style="width: 70%;" @click="nevTobus">
						{{data.address}} 距您步行{{data.width}}km
					</view>
					<view class="t-r dis-flex flex-dir-column flex-x-center flex-y-center" style="width: 16%;"
						@click="phoneBus(data.mobile)">
						<view class="iconfont icon-dianhua1"></view>
						<text class="f-24 col-6">联系商家</text>
					</view>
				</view>

				<view class="f-24 col-6 m-top30 dis-flex flex-x-between flex-y-center">
					<view><text class="dis-il-block  m-right12">营业时间:</text><text
							class="dis-il-block">{{data.time | filterTime}}</text></view>
					<view v-if="showBusQual" style="flex-shrink: 0;white-space: nowrap;" @click="previewImage">商家资质 >
					</view>

				</view>
				<Commity :community='community' v-if="JSON.stringify(community) !='{}'"></Commity>

				<button v-if="data && data.is_payOnline_open === 1" class="btn-normal btn-online-buy" @click="handleBtnOnlineBuyClick"><view class="iconfont is-inline icon-daifukuan" style="margin-right: 8rpx;margin-bottom: -4rpx;"></view>在线买单</button>
			</view>
			<!-- 详情富文本 -->
			<view v-if="data && data.content" class="parse-wrapper">
				<parse :html="data && data.content" />
			</view>
			<!-- 详情富文本 end -->
			<!-- 标题 -->
			<view class="f-36 col-3 f-w m-top-btm40">
				<block v-if="showTitleScrollTo">
					<text class="" :class="{'tab-title':current==1}" @click="scorllTo(1)"
						v-if="activeityData.length">优惠</text>
					<text @click="scorllTo(2)" class="m-left20" :class="{'tab-title':current==2}"
						v-if="goodsShop.length"> 商品</text>
					<text @click="scorllTo(3)" :class="{'tab-title':current==30}" class="m-left20"
						v-if="JSON.stringify(remarkData)!='{}' ">评价</text>
				</block>
			</view>

			<!-- 优惠 -->
			<view class="copoun-part">
				<!-- <view class="copoun f-24 col-f dis-flex flex-y-center" v-if=" data.coupon && Array.isArray(data.coupon) && data.coupon.length">
					<text class="iconfont icon-crown "></text>
					<text class="m-left12">领优惠券</text>
					<text class="dis-il-block m-left12 m-right12">|</text>
					<view class="onelist-hidden" style="width: 66%;">
						<text class="dis-il-block m-left12 " v-for='(item,index) in data.coupon'   :key='index'>{{item.name}}.</text>
					</view>
					
					<text class="iconfont icon-jinrujiantou"></text>

				</view> -->

				<!-- 活动商品 -->

				<scroll-view scroll-x="true" v-if="activeityData.length && activeityData.length>=2">
					<view class=" dis-flex " style="width: 200%;padding-top: 20rpx;">
						<view class="active-goods two-goods m-right20" v-for="(item,index) in activeityData"
							@click="navigationTo('pages/subPages/goods/index/index?goods_id='+item.goods_id)">
							<view class="goods-image">
								<image
									:src="item.image &&item.image.length &&  item.image[0].file_path ? item.image[0].file_path:''"
									mode="" class=""></image>
								<view class="label dis-flex flex-y-center col-f">
									<text
										class="f-24 m-left20 ">{{[item.sale_type,item.activity_time,2] | filterStatus}}</text>
									<CountDown :leftTime="item.activity_time | filterActivityTime" :color="'#fff'">
									</CountDown>
								</view>

							</view>
							<view class="b-f ">
								<view class=" f-28 col-3 twolist-hidden  " style="height: 73rpx;">{{item.goods_name}}
								</view>
								<view class="dis-flex flex-x-between flex-y-center m-top10">
									<view class="onelist-hidden" style="width: 63%;">
										<text class="f-30 col-f4 f-w">￥{{item.activity_price}}</text>
										<text class="t-through m-left12 col-9 f-24">￥{{item.sku[0].line_price}}</text>
									</view>
									<view class="status f-24"
										:style="new Date().getTime() < parseFloat(item.activity_time.end_time) *1000 && new Date().getTime() > parseFloat(item.activity_time.start_time) *1000 ?'background-color: #FFEDE2;color: #F28243;':'background-color: #F4F4F4;color: #666666;'">
										{{[item.sale_type,item.activity_time,1] | filterStatus}}
									</view>

								</view>
							</view>

							<view class="label1 f-24 col-f dis-flex flex-dir-column flex-x-center flex-y-center">
								<view class="">
									限时
								</view>
								<view class="">
									{{[item.sale_type,item.activity_time,0] | filterStatus}}
								</view>

							</view>


						</view>

					</view>

				</scroll-view>
				<block v-if="activeityData.length && activeityData.length==1 ">
					<!-- <view class="activity-goods one-goods b-f" v-for="(item,index) in activeityData" @click="navigationTo('pages/subPages/goods/index/index?goods_id='+item.goods_id)">
						<view class=" main-bg-color auxiliary-color f-24 label-part dis-flex flex-y-center">
							{{[item.sale_type,item.activity_time,0] | filterStatus}}：
							<CountDown :leftTime="item.activity_time | filterActivityTime" :color="'#333'"></CountDown>
						</view>
						<image :src="item.image &&item.image.length &&  item.image[0].file_path ? item.image[0].file_path:''" mode="" ></image>
						<view class="b-f  info">
							<view class="f-w f-28 col-3 onelist-hidden  m-top20">{{item.goods_name}}</view>
							<view class="f-24 col-9 m-top20">已抢{{item.goods_sales}}份</view>
							<view class="dis-flex flex-x-between flex-y-center m-top10">
								<view class="onelist-hidden" style="width: 80%;">
									<text class="f-30 col-f4 f-w">￥{{item.activity_price}}</text>
									<text class="t-through m-left12 col-9 f-24">￥{{item.sku[0].line_price}}</text>
								</view>
								<view class="status f-24">
									{{[item.sale_type,item.activity_time,1] | filterStatus}}
								</view>
						
							</view>
						</view>


					</view> -->

					<!-- 新样式 -->
					<view class="active-goods" v-for="(item,index) in activeityData"
						@click="navigationTo('pages/subPages/goods/index/index?goods_id='+item.goods_id)">
						<view class="goods-image">
							<image
								:src="item.image &&item.image.length &&  item.image[0].file_path ? item.image[0].file_path:''"
								mode="" class=""></image>
							<view class="label dis-flex flex-y-center col-f">
								<text
									class="f-24 m-left20 ">{{[item.sale_type,item.activity_time,2] | filterStatus}}</text>
								<CountDown :leftTime="item.activity_time | filterActivityTime" :color="'#fff'">
								</CountDown>
							</view>

						</view>
						<view class="b-f ">
							<view class=" f-28 col-3 twolist-hidden  " style="height: 73rpx;">{{item.goods_name}}</view>
							<view class="dis-flex flex-x-between flex-y-center m-top10">
								<view class="onelist-hidden" style="width: 63%;">
									<text class="f-30 col-f4 f-w">￥{{item.activity_price}}</text>
									<text class="t-through m-left12 col-9 f-24">￥{{item.sku[0].line_price}}</text>
								</view>
								<view class="status f-24"
									:style="new Date().getTime() < parseFloat(item.activity_time.end_time) *1000 && new Date().getTime() > parseFloat(item.activity_time.start_time) *1000 ?'background-color: #FFEDE2;color: #F28243;':'background-color: #F4F4F4;color: #666666;'">
									{{[item.sale_type,item.activity_time,1] | filterStatus}}
								</view>

							</view>
						</view>

						<view class="label1 f-24 col-f dis-flex flex-dir-column flex-x-center flex-y-center">
							<view class="">
								限时
							</view>
							<view class="">
								{{[item.sale_type,item.activity_time,0] | filterStatus}}
							</view>
						</view>
					</view>
				</block>
			</view>



			<!-- 本店商品 -->
			<view v-if="data && data.type == 1 && goodsShop.length" class="goods">
				<view class="f-36 col-3 f-w title">
					本店商品
				</view>
				<view class="b-f bor-radius-10rpx goods-part">
					<view class="goods-item dis-flex flex-x-between m-top30" v-for="(item,index) in goodsShop"
						:key='item.id'
						@click="navigationTo('pages/subPages/goods/index/index?goods_id='+item.goods_id)">
						<image
							:src="item.image&&item.image.length &&  item.image[0].file_path?item.image[0].file_path:''">
						</image>
						<view class="dis-flex flex-dir-column flex-x-between" style="width: 74%;">
							<view class="twolist-hidden f-28 col-3">
								{{item.goods_name}}
							</view>
							<view class="dis-flex flex-x-between flex-y-center">
								<view class="f-28 col-f4"> <text class="f-w">￥{{item.sku[0].goods_price}}</text> <text
										class="col-9 f-24 m-left12 t-through">￥{{item.sku[0].line_price}}</text></view>
								<view class="main-bg-color auxiliary-color f-24 buy-goods-btn">
									购买
								</view>
							</view>

						</view>


					</view>
					<view class="check-item check-more no-bor dis-flex flex-x-center flex-y-center col-9 f-24 m-top20"
						@click="checkMore(0)" v-if='goodsShop.length == total'>
						<view class="">{{last_page==1?'没有更多了':'收起'}}</view>
						<view class="iconfont icon-fold" v-if="last_page!=1"></view>

					</view>
					<view class="check-item check-more no-bor dis-flex flex-x-center flex-y-center col-9 f-24 m-top20"
						@click="checkMore(1)" v-if='goodsShop.length < total'>
						<view class="">查看更多商品</view>
						<view class="iconfont icon-unfold"></view>

					</view>
				</view>
			</view>
			<!-- 本店商品 end -->
			<!-- 本店商品同城配送 -->
			<view v-else-if="data && data.type == 2" class="city-goods-section">
				<view class="f-36 col-3 f-w title">
					本店商品
				</view>
				<TradeArea :defaultSelectIndex="cCityDefaultCateIndex" :autoRequest="false" :list="cCityGoodsCate"
					@tradeAreaChange="handleCityGoodsCateClick">
				</TradeArea>
				<view class="b-f bor-radius-10rpx goods-part">
					<view class="goods-item dis-flex flex-x-between m-top30" v-for="(item,index) in cCityGoodsList"
						:key='index' @click="navigationTo('pages/subPages/goods/index/index?goods_id='+item.goods_id)">
						<image
							:src="item.image&&item.image.length &&  item.image[0].file_path?item.image[0].file_path:''">
						</image>
						<view class="dis-flex flex-dir-column flex-x-between" style="width: 74%;">
							<view class="twolist-hidden f-28 col-3">
								{{item.goods_name}}
							</view>
							<view class="dis-flex flex-x-between flex-y-center">
								<view class="f-28 col-f4"> <text class="f-w">￥{{item.sku[0].goods_price}}</text> <text
										class="col-9 f-24 m-left12 t-through">￥{{item.sku[0].line_price}}</text></view>
								

								<button v-if="item.run_errands == 1 &&　item.spec_type == 20"
									class="page_btn-choice-spec btn-normal" @click.stop="handleBtnSpecClick(item,index)">
									选择规格
									<u-badge type="error" :count="item.total_num" :offset="[-8,-8]" size="mini"></u-badge>
								</button>
								<GoodInputNumber v-else-if="item.run_errands == 1" :value="item.total_num"
									:inputDisabled="true" @click.native.stop @input="handleGoodsNumChange($event,item)">
								</GoodInputNumber>
								<view v-else class="main-bg-color auxiliary-color f-24 buy-goods-btn">
									购买
								</view>

							</view>

						</view>


					</view>
					<view class="check-item check-more no-bor dis-flex flex-x-center flex-y-center col-9 f-24 m-top20"
						v-if='!cityGoodsListRes.hasMore'>
						<view class="">{{!cityGoodsListRes.hasMore?'没有更多了':'收起'}}</view>
						<view class="iconfont icon-fold" v-if="cityGoodsListRes.hasMore"></view>
					</view>
					<view class="check-item check-more no-bor dis-flex flex-x-center flex-y-center col-9 f-24 m-top20"
						@click="fetchCityGoodsListRes()" v-if='cityGoodsListRes.hasMore'>
						<view class="">查看更多商品</view>
						<view class="iconfont icon-unfold"></view>

					</view>
				</view>
			</view>
			<!-- 本店商品同城配送 end -->


			<!-- 会员卡 -->
			<view class="member dis-flex flex-x-between flex-y-center"
				v-if="memberInfo&&memberInfo.is_open&&memberInfo.is_open == '1'">
				<view class="dis-flex flex-y-center">
					<view class="iconfont icon-choiceness"></view>
					<view class="f-22 m-left20">
						{{memberInfo.card_title}} | 开通{{memberInfo.card_title}}，立享优惠折扣
					</view>
				</view>
				<view class="buy-btn f-22" @click="skip_member">立即购买</view>
			</view>


			<!-- 本店评价 -->
			<view class="comment-part" v-if="JSON.stringify(remarkData)!='{}'">
				<view class="title f-36 col-3  dis-flex flex-x-between">
					<text class="f-w">本店评价</text>
					<text class="col-9 f-22">消费赚积分，可抵扣现金</text>
				</view>

				<view class="commemt-content b-f dis-flex flex-x-between ">
					<image :src="remarkData.avatarUrl? remarkData.avatarUrl:''" mode="" class="user-image"></image>
					<view class="content">
						<view class="dis-flex flex-x-between flex-y-center">
							<view class="f-28 col-3 f-w">
								{{remarkData.nickName?remarkData.nickName:''}}
							</view>
							<view class="f-24 col-9 ">
								{{remarkData.create_time}}
							</view>
						</view>
						<view class="dis-flex flex-x-between flex-y-center m-top10">

							<view class=" dis-flex flex-y-center f-28">
								<view class="" style="position: relative;width: 16px;height: 16px;"
									v-for="(items,itemsdex) in [1,2,3,4,5]" :key="itemsdex">
									<image v-if="((itemsdex+1+itemsdex)/2)==remarkData.score"
										src="../../../static/images/goods/half.png" mode=""
										:style="((itemsdex+1+itemsdex)/2)==remarkData.score?'z-index:2':''"
										style="position: absolute;top: 2rpx;left: 2rpx;width: 12px;height: 12px;">
									</image>
									<view v-if="((itemsdex+1+itemsdex)/2)!=remarkData.score"
										style="position: absolute;top: 0;left: 0;"
										class="iconfont icon-shoucangxiao select "
										:style="items<=Math.round(remarkData.score)?'color:#F28243;font-size:12px;':'color:#F4F4F4;font-size:12px;'">
									</view>

								</view>


							</view>
							<view class="f-24 col-9 ">
								优质评论
							</view>
						</view>

						<view class="f-24 col-6 twolist-hidden m-top30">

							{{remarkData.content}}

						</view>

						<view class="m-top30">
							<image :src="item.file_path?item.file_path:''" mode=""
								v-for="(item,index) in remarkData.comment_image" :key='index'></image>
						</view>

						<view class="f-24 col-9 t-r m-top30"
							@click="navigationTo('pages/subPages/goods/comment/comment?store_id='+requestData.store_id+'&bus_id='+bus_id)">
							查看{{data.total_comment}}条评论 >
						</view>

					</view>



				</view>

			</view>

			<!-- 大家还喜欢 -->
			<view v-if="data.is_like==1" class="">
				<view class="f-36 f-w col-3 title">
					大家喜欢
				</view>
				<TradeArea @tradeAreaChange='likeDataChange'></TradeArea>
				<block v-if="likeData.length && isDisLike">
					<view class="b-f bor-radius-10rpx goods-part">
						<view class="goods-item dis-flex flex-x-between m-top30" v-for="(item,index) in likeData"
							:key='index' v-if="index<showAll1 && item.goods"
							@click="navigationTo('pages/subPages/goods/index/index?goods_id='+item.goods.goods_id)">
							<image
								:src="item.goods.image && item.goods.image.length && item.goods.image[0].file_path?item.goods.image[0].file_path:''">
							</image>
							<view class="dis-flex flex-dir-column flex-x-between" style="width: 74%;">
								<view class="twolist-hidden f-28 col-3">
									{{item.goods.goods_name}}
								</view>
								<view class="dis-flex flex-x-between flex-y-center">
									<view class="f-28 col-f4"> <text
											class="f-w">￥{{item.goods.sku[0].goods_price}}</text> <text
											class="col-9 f-24 m-left12 t-through">￥{{item.goods.sku[0].line_price}}</text>
									</view>
									<view class="main-bg-color auxiliary-color f-24 buy-goods-btn">
										购买
									</view>
								</view>

							</view>


						</view>
						<view
							class="check-item check-more no-bor dis-flex flex-x-center flex-y-center col-9 f-24 m-top20 ">
							<view class="" @click="loadMore(0)">
								{{showAll1==likeData.length?"收起":`查看剩余${likeData.length-4>0?likeData.length-4:0}件商品`}}
							</view>
							<view class="iconfont icon-unfold"
								:class="[showAll1==likeData.length?'icon-fold':'icon-unfold']"></view>
						</view>

					</view>

				</block>
				<block v-else>
					<Abnor abnor="GOODS"></Abnor>
				</block>


			</view>

			<!-- 更多商家 -->
			<view v-if="settingData && settingData.businessStore && settingData.businessStore.more_store_open == '1'"
				class="">
				<view class="f-36 f-w col-3 title">
					更多门店
				</view>
				<TradeArea @tradeAreaChange='tradeAreaChange'></TradeArea>
				<block v-if='storeData.length'>
					<BusStore :storeData='storeData'></BusStore>
				</block>
				<block v-else>
					<Abnor abnor="GOODS"></Abnor>
				</block>
			</view>
		</view>
		<page-loading></page-loading>
		<PopupView :show='isShow' type='top' @clickmask='isShow=false'>
			<view class="">
				<image src="../../../static/h5/share.png" mode="" style="width: 640rpx;"></image>
			</view>
		</PopupView>
		<!-- 购物车 -->
		<ShoppingCart v-if="data && data.type == 2" :goodsList="cityCartRes" :num="cityCartTotalRes.total_num"
			:price="cityCartTotalRes.goods_price" :priceLine="cityCartTotalRes.line_price"
			:priceStarting="data.start_price" :store_id="requestData.store_id" @on-shop-logo-click="goodsPopupVisible = true"></ShoppingCart>
		<!-- 购物车 end -->
		<!-- 底部导航 -->
		<TabBar zIndex="210"></TabBar>
		<!-- 底部导航 end -->
		<!-- 分享菜单 -->
		<ShareView ref="shareView" :pid="bus_id" :poster-type="'store'" viewStyle="1"></ShareView>
		<!-- 分享菜单 end -->
		<!-- 购买提示弹窗 -->
		<PopupView :show='buyTipVisible' type='center'>
			<view class="buy-tip">
				<view class="tips-title col-f">购买提醒</view>
				<view class="buy-tips__text">商家休息中，请在营业时间内下单</view>
				<view class="buy-tips__text "><text class="m-right12">营业时间:</text><text
						class="dis-il-block">{{data.time | filterTime}}</text></view>
				<view class="buy-tips__btn" @click="buyTipVisible=false">我知道了</view>
			</view>
		</PopupView>
		<!-- 购买提示弹窗 end -->
		<!-- 规格选择弹窗 -->
		<SpecificationsPopup v-model="specificationsPopupVisible" :title="cSpecPopupProps.title" :goodsImg="cSpecPopupProps.goodsImg" :salesNum="cSpecPopupProps.salesNum" :skuData="cSpecPopupProps.skuData" :sku="cSpecPopupProps.sku" :cartList="cSpecPopupProps.cartList" @on-num-change="handleSpecNumChange"></SpecificationsPopup>
		<!-- 规格选择弹窗 end -->
		<!-- 同城商品列表弹窗 -->
		<shopping-cart-goods-popup :show="goodsPopupVisible" @btn-clear-click="handleBtnCartClearClick" @on-mask-click="goodsPopupVisible = false" :cartList="cityCartRes" @on-num-change="handleSpecNumChange" />
		<!-- 同城商品列表弹窗 end -->
	</view>
</template>

<script>
	import PopupView from "@/components/template/PopManager.vue"
	import LoadMore from "@/components/template/Loadmore.vue";
	import TradeArea from '@/components/template/TradeArea.vue'
	import BusStore from '@/components/template/BusStore.vue'
	import CountDown from "@/components/template/CountDown.vue"
	import App from "@/common/js/app.js";
	import Abnor from "@/components/template/Abnor.vue"
	import Commity from "@/components/template/Commity.vue"
	import DiyVideo from "@/components/page/pageComponents/Video.vue"
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	import TabBar from '@/components/template/TabBar'
	// #ifdef H5
	import wxApi from "@/static/h5/wxApi.js"
	// #endif
	import ShareView from '@/components/template/ShareView.vue'
	import ShoppingCart from './components/ShoppingCart.vue'
	import GoodInputNumber from './components/GoodInputNumber.vue'
	import SpecificationsPopup from './components/SpecificationsPopup.vue'
	import ShoppingCartGoodsPopup from './components/ShoppingCartGoodsPopup.vue'
	export default {
		components: {
			TradeArea,
			BusStore,
			CountDown,
			Abnor,
			Commity,
			LoadMore,
			DiyVideo,
			PopupView,
			Parse,
			TabBar,
			ShareView,
			ShoppingCart,
			GoodInputNumber,
			SpecificationsPopup,
			ShoppingCartGoodsPopup
		},
		onShareAppMessage() {
			return this.shareData
		},
		onShareTimeline() {
			return {
				title: this.shareData.title,
				imageUrl: this.shareData.imageUrl
			}
		},
		data() {
			return {
				options: {},
				shareData: null,
				isShow: false,
				bannerType: 'imgs',
				videoParams: {
					params: {},
					itemStyle: {}
				},
				isMore: true,
				showAll: 4,
				showAll1: 4,
				goodsData: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				current: 1,
				requestData: {
					store_id: '',
					lng: '',
					lat: '',
					no_login: 1
				},
				page: 1,
				data: {},
				likeLoading: false,
				storeLoading: false,
				last_page: 0,
				total: 0,
				goodsShop: [],
				bus_id: '',
				shareViewVisible: false,
				// 同城商品的分类接口数据
				cityGoodsCateRes: [],
				// 同城商品列表的分页接口数据
				cityGoodsListRes: {
					// 当前第几页，0就是即将请求第1页
					page: 0,
					// 分页的大小
					list_row: 10,
					// 数据
					data: [],
					// 是否还有更多
					hasMore: true,
					// 是否正在请求
					isFetching: false
				},
				// 同城配送的分类id
				cityGoodsCateId: '',
				// 同城配送购物车的数据(商品列表)
				cityCartRes: [],
				// 购物车的总计数据
				cityCartTotalRes: {},
				// 购买提示是否显示
				buyTipVisible: false,
				// 规格选择弹窗是否显示
				specificationsPopupVisible: false,
				// 当前规格选择弹窗对应的商品id
				specGoodsId: '',
				// 当前规格选择的接口数据
				specRes: {},
				// 同城商品弹窗是否显示
				goodsPopupVisible: false
			};
		},
		onLoad(options) {
			console.log('options.scene 111',options,options.scene)
			this.options = options
			if (options.scene) {
				const queryData = this.$util.scene_decode(options.scene) || {}
				console.log('options.scene',options.scene,queryData)
				this.options = {
					store_id: queryData.s,
					bus_id: queryData.b,
					...this.options
				}
			}
			App.showLoading()
			this.requestData.store_id = this.options.store_id
			this.bus_id = this.options.bus_id
			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline']
			})
			//#endif
		},
		onShow() {
			this.goodsShop = []
			this.getLocation()
			this.getShopData()

		},
		computed: {
			// 当前规格选择弹窗所需要的所有数据
			cSpecPopupProps() {
				const goods = this.cCityGoodsList.find(item => item.goods_id == this.specGoodsId) || {}
				return {
					title: goods.goods_name || '',
					goodsImg: this.$util.deepGet(goods,'image.0.file_path',''),
					salesNum: goods.goods_sales || 0,
					skuData: this.specRes.skuData || [],
					sku: this.specRes.sku || [],
					cartList: this.cityCartRes || [],
				}
			},
			cCityDefaultCateIndex() {
				if (!this.options.cityCateId) {
					return 0
				}
				const index = (this.cityGoodsCateRes || []).findIndex(item => item.category_id == this.options.cityCateId)
				return index >= 0 ? index : 0
			},
			// 在购物车中的商品
			cCityGoods() {
				return this.cityCartRes || []
			},
			// 格式化的同城商品列表数据
			cCityGoodsList() {
				const data = this.cityGoodsListRes.data || []
				return data.map(item => {
					const target = this.cCityGoods.find(goods => goods.goods_id === item.goods_id) || {}
					return {
						...item,
						total_num: target.total_num || 0
					}
				})
			},
			// 格式化的同城商品分类数据
			cCityGoodsCate() {
				const list = this.cityGoodsCateRes || []
				return list.map(item => ({
					id: item.category_id,
					circle_name: item.name,
					...item,
				}))
			},
			cContainerStyle() {
				let str = this.themeColor || ''
				return str
			},
			// 是否展示商家资质
			showBusQual() {
				return this.data && this.data.bus_qual && this.data.bus_qual.is_bus_qual == 1
			},
			// 当只有一个title时不显示
			showTitleScrollTo() {
				let titleLen = 0
				if (this.activeityData.length) {
					titleLen++
				}
				if (this.goodsShop.length) {
					titleLen++
				}
				if (JSON.stringify(this.remarkData) != '{}') {
					titleLen++
				}
				return titleLen >= 2
			},
			// 轮播数据
			swiperImage() {
				return this.data.quaimg ? this.data.quaimg : []

			},
			// 大家喜欢的数据
			likeData() {
				return this.data.like ? this.data.like : []
			},
			isDisLike() {
				let data = false;

				this.likeData.forEach(item => {
					if (item.goods) {
						data = true
					}
				});

				return data
			},
			// 本店商品
			goodsInShop() {
				return this.data.our_shop ? this.data.our_shop : []
			},
			// 更多门店
			storeData() {
				return this.data.bus_store ? this.data.bus_store : []
			},
			// 活动商品
			activeityData() {
				return this.data.activGoods ? this.data.activGoods : []
			},
			// 评价数据
			remarkData() {
				let {
					data: {
						comment_data: commenData = []
					}
				} = this;

				return commenData && Array.isArray(commenData) && commenData.length ? commenData[0] : {}
			},
			// 社群数据
			community() {
				return this.data.community ? this.data.community : {}
			},
			// 商家资质
			quaimg() {
				let data = this.data.bus_qual && this.data.bus_qual.quaimg && Array.isArray(this.data.bus_qual.quaimg) &&
					this.data
					.bus_qual.quaimg.length ? this.data.bus_qual.quaimg : [];
				data.length && (data = data.map(item => {
					return item.image && item.image.file_path ? item.image.file_path : ''
				}))
				return data
			},
			// 会员数据
			memberInfo() {
				return this.data.member_Info
			}
		},
		watch: {
			cityGoodsCateId(val) {
				// 请求商品列表
				this.fetchCityGoodsListRes({
					resetBeforeFetch: true
				})
			}
		},
		filters: {
			filterTime(time) {
				if (time) {
					let total = ''
					time.forEach(item => {
						let str = ''
						let datetime = new Date(Number(item[0])),
							hour = ("0" + datetime.getHours()).slice(-2),
							minute = ("0" + datetime.getMinutes()).slice(-2),
							second = ("0" + datetime.getSeconds()).slice(-2),
							datetime1 = new Date(Number(item[1])),
							hour1 = ("0" + datetime1.getHours()).slice(-2),
							minute1 = ("0" + datetime1.getMinutes()).slice(-2),
							second1 = ("0" + datetime1.getSeconds()).slice(-2);
						str = (item[2] || '') + hour + ":" + minute + ":" + second + '-' + hour1 + ":" + minute1 +
							":" + second1;
						total = total + '     ' + str
					})
					// start_time = (new Date(Number(start_time)).getHours() + 1)
					// end_time = (new Date(Number(end_time)).getHours() + 1)
					return total

				} else {
					return '无'
				}


			},
			filterStatus([sale_type, actime, value]) {
				let type = '',
					str = '',
					btnStatus = '已结束',
					{
						start_time,
						end_time
					} = actime;
				switch (sale_type) {
					case 0:
						type = '普通营销'
						break;
					case 1:
						type = '秒杀'
						break;
					case 2:
						type = '拼团'
						break;
					case 2:
						type = '抽奖'
						break;
					default:
						type = '砍价'
				}

				start_time = start_time * 1000
				end_time = end_time * 1000

				let time = new Date().getTime();
				if (time < end_time && time > start_time) {
					console.log(btnStatus)
					btnStatus = '进行中'
				}
				if (time < start_time) {
					btnStatus = '未开始'
				}
				str = btnStatus == '进行中' ? "距结束" : (btnStatus == '已结束' ? "已结束" : "距开始")
				actime.str = str
				return value == 1 ? btnStatus : (value == 0 ? type : str)

			},
			filterActivityTime({
				start_time,
				end_time,
				status
			}) {
				start_time = start_time * 1000
				end_time = end_time * 1000
				let time = new Date().getTime(),
					rest_time = 0
				if (time < end_time && time > start_time) {
					rest_time = end_time - time
				}
				if (time < start_time) {
					rest_time = start_time - time
				}
				return rest_time / 1000

			}
		},
		methods: {
			handleBtnOnlineBuyClick() {
				this.navigationTo("pages/subPages/payOnline/index?id="+(this.data && this.data.pay_online_business_id))
			},
			// 清除购物车按钮点击事件
			async handleBtnCartClearClick() {
				// 锁
				if (this.handleBtnClearClickLock) {
					return
				}
				this.handleBtnClearClickLock = true
				uni.showLoading({
					title: '请稍候...',
					mask: true
				})
				try {
					const res = await App._postP('cart/clear',{
						store_id: this.requestData.store_id,
						cart_type: 'store_wm'
					}) || {}
					uni.hideLoading()
					uni.showToast({
						title: res.msg || '清空成功！',
						icon: 'none'
					})
					this.cityCartRes = []
					this.cityCartTotalRes = {}
					this.goodsPopupVisible = false
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
				this.handleBtnClearClickLock = false
			},
			// 选择规格按钮的点击事件
			handleBtnSpecClick(item,index) {
				this.specGoodsId = item.goods_id
				if(item.goods_id != this.specRes.goods_id) {
					// id 不同 才请求
					this.specRes = {}
					this.fetchSpecRes({
						goods_id: item.goods_id
					})
				}
				// 打开规则弹窗
				this.specificationsPopupVisible = true
			},
			// 多规格数量变化事件
			handleSpecNumChange(item) {
				console.log('handleSpecNumChange',item)
				this.handleGoodsNumChange(item.num,item)
			},
			// 同城商品购物车数量变化事件
			async handleGoodsNumChange(val, item) {
				if (this.data.week_time != 1) {
					this.buyTipVisible = true;
					return
				}

				if (val < 0) {
					return
				}
				const num = ((+val) - (+item.total_num)) || 0
				console.log('handleGoodsNumChange:num', item)
				if (!num) return
				let apiName = 'cart/add'
				if (num < 0) {
					apiName = 'cart/sub'
				}
				if (this.handleGoodsNumChanging) {
					return
				}
				this.handleGoodsNumChanging = true
				uni.showLoading({
					title: '请稍候'
				})
				try {
					const res = await App._postP(apiName, {
						goods_id: item.goods_id,
						goods_num: num,
						goods_sku_id: item.goods_sku_id || this.$util.deepGet(item, 'sku.0.spec_sku_id'),
						store_id: this.requestData.store_id,
						cart_type: 'store_wm'
					})
					// 更新购物车数据量
					await Promise.all([
						this.fetchCityCartRes(),
						this.fetchCityCartTotalRes()
					])
					uni.hideLoading()
				} catch (e) {
					uni.hideLoading()
					console.log('handleGoodsNumChange:error', e)
					//TODO handle the exception
				}
				this.handleGoodsNumChanging = false
			},
			// 商品分类点击事件
			handleCityGoodsCateClick(item) {
				console.log('handleCityGoodsCateClick', item)
				// 记录当前同城配送商品的分类id
				this.cityGoodsCateId = item.id
			},
			handleBtnShareClick() {
				this.$refs.shareView.shareswich()
			},
			setShareData(storeDetail) {
				let clientType = App.getClientType(),
					shareData = null;
				if (clientType === "4") {
					jWeixin.ready(() => {
						wxApi.wxShare({
							title: this.$util.deepGet(storeDetail, 'store_share_title') || storeDetail
								.business_name + '(' + storeDetail.name + ')', // 分享标题
							desc: storeDetail.describe, // 分享描述
							link: `${App.siteInfo.siteroot}h5/#/pages/subPages/shopDetail/shopDetail?bus_id=${this.bus_id}&store_id=${this.requestData.store_id}&referee_id=${this.globalSaveRefereeId}&i=${App.getUniacid()}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: this.$util.deepGet(storeDetail, 'store_share_image.0.file_path') || (
								this.swiperImage && this.swiperImage.length && this.swiperImage[0]
								.file ? this.swiperImage[0].file[0]
								.file_path : ''), // 分享图标
						});
					});
				} else {
					shareData = {
						title: this.$util.deepGet(storeDetail, 'store_share_title') || storeDetail.business_name +
							'(' + storeDetail.name + ')' + '邀请您来看看~',
						imageUrl: this.$util.deepGet(storeDetail, 'store_share_image.0.file_path') || (this
							.swiperImage && Array.isArray(this.swiperImage) && this.swiperImage.length > 0 &&
							this.swiperImage[
								0].file ? this.swiperImage[0].file[0].file_path : ''),
						path: `/pages/subPages/shopDetail/shopDetail?bus_id=${this.bus_id}&store_id=${this.requestData.store_id}&referee_id=${this.globalSaveRefereeId}`
					};
				}
				this.shareData = shareData;
			},
			bannerChange() {
				this.bannerType = this.bannerType === "imgs" ? "video" : "imgs";
			},
			checkMore(type) {
				console.log(this.total, this.page, this.last_page, '==============')
				if (type == 1) {
					this.page++
					if (this.page <= this.last_page) {
						this.getShopData()
					}

				}

				if (type == 0) {
					this.page = 1
					this.getShopData()
				}

			},
			getShopData() {
				let {
					requestData: {
						store_id
					},
					bus_id,
					page
				} = this
				App._post_form('Business/activityGoods', {
					bus_id,
					store_id,
					page
				}, res => {
					let {
						data: {
							current_page,
							last_page,
							total: total = 0,
							data: data = []
						}
					} = res;
					this.setData({
						page: current_page,
						last_page,
						total
					})
					this.goodsShop = page == 1 ? data : this.goodsShop.concat(data)


				})
			},
			shareBtn() {
				if (this.appClientType === "3") {
					uni.showToast({
						icon: "none",
						title: "请使用自带浏览器分享~"
					})
				} else if (this.appClientType === "4") {
					this.isShow = true;
				}

			},
			// 根据商圈筛选大家喜欢
			likeDataChange(item) {
				this.likeLoading = true
				App._post_form('Business/likeCircle', {
					circle_id: item.circle_id
				}, res => {
					this.data.like = res.data ? res.data : []
				}, () => {}, () => {
					this.likeLoading = false
				})

			},
			loadMore(type) {
				if (type == 1) {
					this.showAll = this.showAll == 4 ? this.goodsInShop.length : 4
				} else {
					this.showAll1 = this.showAll1 == 4 ? this.likeData.length : 4
				}


			},
			// 根据商圈筛选大家还喜欢
			tradeAreaChange(item) {
				this.storeLoading = true
				App._post_form('Business/storeInfo', {
					isNeibor: 2,
					sort_id: "",
					lng: this.requestData.lng,
					lat: this.requestData.lat,
					recommend: 2,
					filter: "",
					circle_id: item.circle_id,
					page: 1
				}, res => {
					this.data.bus_store = res.data.data

				}, () => {}, () => {
					this.storeLoading = false
				})
			},
			getShopDetailData() {

				App._post_form('Business/storeDetail', this.requestData, res => {
					this.data = res.data
					this.setShareData(res.data)
					if (this.data.video) {
						this.videoParams.params.videolink = this.data.video.file_path;
						this.videoParams.params.videocover = this.data.image ? this.data.image.file_path : "";
					}
					this.data.store_score = parseFloat(this.data.store_score)
					if (this.data.type == 2) {
						this.fetchCityGoodsCateRes()
						this.fetchCityCartRes()
						this.fetchCityCartTotalRes()
					}
					App.hideLoading()
				}, res => {
					App.hideLoading()
				})
			},
			skip_member() {
				App.navigationTo({
					url: "pages/subPages/member/index/index"
				});
			},
			getLocation() {
				let _this = this
				App.getLocation().then(res => {
					_this.requestData.lng = res.longitude;
					_this.requestData.lat = res.latitude;
					this.getShopDetailData()
				}).catch(res => {
					App.hideLoading()
				});
			},
			scorllTo(type) {
				this.current = type
				let selector = type == 1 ? ".copoun-part" : (type == 2 ? '.goods' : '.comment-part')
				uni.createSelectorQuery().select('.container').boundingClientRect((res1) => {
					uni.createSelectorQuery().select(selector).boundingClientRect((res) => {
						uni.pageScrollTo({
							duration: 500,
							scrollTop: res.top - res1.top
						})
					}).exec();
				}).exec();

			},
			phoneBus(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber
				})

			},
			nevTobus() {
				let {
					name,
					address,
					lat,
					lng
				} = this.data
				App.openLocation({
					name,
					address,
					latitude: Number(lat),
					longitude: Number(lng),
					success() {
						console.log('success');
					}
				});
			},
			previewImage() {

				uni.previewImage({
					urls: this.quaimg
				})

			},
			// 请求当前规格选择的接口数据
			async fetchSpecRes({
				goods_id
			}) {
				try {
					const res = await App._getP('Goods/goodsSku', {
						goods_id: goods_id || this.this.specGoodsId
					})
					this.specRes = res.data || []
				} catch (e) {
					console.log('fetchSpecRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求同城商品的分类接口数据
			async fetchCityGoodsCateRes() {
				try {
					const res = await App._getP('Business/getBusinessCate', {
						store_id: this.requestData.store_id
					})
					this.cityGoodsCateRes = res.data || []
					if (!this.cityGoodsCateId) {
						this.cityGoodsCateId = this.options.cityCateId || res.data && res.data[0] && res.data[0]
							.category_id || 'all'
					}
				} catch (e) {
					console.log('fetchCityGoodsCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求同城配送购物车的数据
			async fetchCityCartRes() {
				try {
					const res = await App._getP('cart/cartAll', {
						store_id: this.requestData.store_id,
						type: 50,
						cart_type: 'store_wm'
					})
					this.cityCartRes = res.data || {}
				} catch (e) {
					//TODO handle the exception
					console.log('fetchCityCartRes', e)
				}
			},
			// 请求购物车的总计数据
			async fetchCityCartTotalRes() {
				try {
					const res = await App._getP('cart/getCartAllData', {
						store_id: this.requestData.store_id,
						cart_type: 'store_wm'
					})
					this.cityCartTotalRes = res.data || {}
				} catch (e) {
					//TODO handle the exception
					console.log('fetchCityCartRes', e)
				}
			},
			// 请求同城商品列表的分页接口数据
			async fetchCityGoodsListRes({
				resetBeforeFetch = false,
			} = {}) {
				console.log('fetchCityGoodsListRes 0')
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.cityGoodsListRes = {
							...this.cityGoodsListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false
						}
					}
					// 如果没有更多就不必请求了
					if (!this.cityGoodsListRes.hasMore) {
						return Promise.reject()
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.cityGoodsListRes.isFetching = true
					// 请求数据
					const res = await App._getP('Business/activityGoods', {
						page: this.cityGoodsListRes.page + 1,
						list_row: this.cityGoodsListRes.list_row,
						bus_id: this.bus_id,
						store_id: this.requestData.store_id,
						category_id: this.cityGoodsCateId === 'all' ? '' : this.cityGoodsCateId
					})
					// 取得新的数据
					const newData = this.$util.deepGet(res, 'data.data', [])
					// 判断是否有更多
					const hasMore = newData.length >= this.cityGoodsListRes.list_row
					// 设置新的数据
					this.cityGoodsListRes = {
						...this.cityGoodsListRes,
						page: this.cityGoodsListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ? newData : this.cityGoodsListRes.data.concat(newData),
						hasMore,
						isFetching: false
					}
					console.log('this.cityGoodsListRes11111111111', this.cityGoodsListRes.data[0])
				} catch (e) {
					console.log(e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},

		}
	}
</script>

<style lang="scss">
	.container {
		position: relative;
		box-sizing: border-box;
		padding-top: 120rpx;
		padding-bottom: 240rpx;
		background-position: center top;
		background-size: 100% 400rpx;
		background-repeat: no-repeat;
	}

	.header-bg-wrapper {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		overflow: hidden;
		z-index: 0;
	}

	.header-bg {
		width: 100%;
		height: 400rpx;
		filter: blur(10px);
	}

	.goods-swiper,
	.goods-video {
		width: 100%;
		height: 472rpx;
		position: relative;
		z-index: 1;
		overflow: hidden;
	}

	.goods-video video {
		width: 100%;
		height: 100%;
	}


	.swiper-item {
		width: 100%;
		height: 100%;
	}

	.swiper-item__image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.goods-header {
		position: relative;
	}

	.goods-header .swiper-index {
		position: absolute;
		right: 42rpx;
		bottom: 33rpx;
		z-index: 2;
		background: rgba(0, 0, 0, 1);
		opacity: 0.2;
		border-radius: 32rpx;
		font-size: 20rpx;
		font-weight: bold;
		color: #FFFFFF;
		padding: 0 10rpx;
		line-height: 1.5em;
		text-align: center;
	}

	.banner-change {
		width: 150rpx;
		height: 46rpx;
		text-align: center;
		position: absolute;
		left: 50%;
		bottom: 30rpx;
		transform: translateX(-50%);
		z-index: 2;
		background: rgba(255, 255, 255, .5);
		border-radius: 20px;
	}

	.change-item {
		font-size: 24rpx;
		line-height: 46rpx;
		text-align: center;
		color: #333333;
		width: 50%;
	}

	.change-item.active {
		border-radius: 20px;
		background: rgba(255, 217, 64, 1);
		box-shadow: 0 4rpx 8rpx 0 rgba(122, 122, 122, 0.35);
	}

	.main {
		position: relative;
		padding: 30rpx;
		box-sizing: border-box;
		overflow: hidden;
		z-index: 1;

		.shop-detail {
			background-color: #fff;
			padding: 30rpx;
			box-sizing: border-box;
			z-index: 11;
			border-radius: 10rpx;




			.store-label {
				padding: 5rpx 6rpx;
				background: rgba(242, 130, 67, 1);
				border-radius: 4px;
			}

			.work-status {
				padding: 5rpx 6rpx;
				color: #F28243;
				background: rgba(255, 237, 226, 1);
				border-radius: 4px;
			}

			swiper {
				width: 100%;
				height: 472rpx;
				border-radius: 10rpx;
				overflow: hidden;

			}
		}

		.tab-title {
			color: #F28243;
			position: relative;
		}

		.tab-title::after {
			content: '';
			width: 100%;
			height: 6rpx;
			position: absolute;
			background-color: #F28243;
			bottom: -12rpx;
			border-radius: 6rpx;
			left: 0;
		}

		.commemt-content {
			border-radius: 10rpx;
			padding: 30rpx 20rpx;
			box-sizing: border-box;

			.user-image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}

			.content {
				width: calc(100% - 100rpx);

				image {
					width: 32%;
					height: 180rpx;
					margin-right: 1%;
				}
			}

		}

		.title {
			margin: 40rpx 0;
			position: relative;
		}

		.title::after {
			content: '';
			position: absolute;
			left: 147rpx;
			transform: rotate(45deg);
			bottom: -1rpx;
			width: 0;
			height: 0;
			border: 10rpx solid rgba(0, 0, 0, 0);
			border-top-color: var(--theme-color);
		}


		.member {
			height: 80rpx;
			background: linear-gradient(169deg, rgba(90, 89, 90, 1) 0%, rgba(55, 55, 55, 1) 100%);
			border-radius: 4rpx;
			color: #FFE1B8;
			margin: 40rpx 0;
			padding: 0 20rpx;
			box-sizing: border-box;

			.buy-btn {
				padding: 10rpx 13rpx;
				border: 1rpx solid #FFE1B8;
				border-radius: 30rpx;
			}
		}



		.copoun {
			background: linear-gradient(135deg, rgba(255, 128, 56, 1) 0%, rgba(255, 103, 18, 1) 100%);
			height: 70rpx;
			position: relative;
			margin-bottom: 30rpx;
			padding: 0 30rpx;
			box-sizing: border-box;

		}

		.copoun:after {
			position: absolute;
			content: '';
			width: 20rpx;
			height: 20rpx;
			top: 25rpx;
			left: -10rpx;
			border-radius: 50%;
			background-color: #F4F4F4;
		}

		.copoun::before {
			position: absolute;
			content: '';
			width: 20rpx;
			height: 20rpx;
			top: 25rpx;
			right: -10rpx;
			border-radius: 50%;
			background-color: #F4F4F4;
		}

		.active-goods {
			position: relative;

			.b-f {
				background-color: #fff;
				padding: 20rpx;
			}

			.label1 {
				height: 80rpx;
				width: 90rpx;
				background-image: url('../../../static/images/business/label.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				position: absolute;
				top: -16rpx;
				left: 8rpx;

				view {
					width: 67%;
				}

			}

			.goods-image {
				position: relative;
				width: 100%;
				height: 388rpx;
				border-radius: 6rpx 6rpx 0rpx 0rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}

				.label {
					width: 100%;
					height: 50rpx;
					background-color: rgba(0, 0, 0, 0.3);
					position: absolute;
					bottom: 0;
					left: 0;
				}

				/deep/ .uni-countdown__splitor {
					color: #fff !important;
					padding: 0 !important;
				}
			}

			.status {
				background: rgba(255, 237, 226, 1);
				border-radius: 20px;
				padding: 8rpx 10rpx;
				color: #F28243;
			}

		}

		.two-goods {
			width: 398rpx;

			.goods-image {
				width: 100%;
				height: 224rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}


		.goods-part {
			overflow: hidden;
			padding: 10rpx 20rpx 30rpx;
			box-sizing: border-box;
			border-radius: 10rpx;

			.goods-item {
				width: 100%;
				height: 150rpx;

				image {
					border-radius: 10rpx;
					width: 150rpx;
					height: 150rpx;
				}

				.buy-goods-btn {
					padding: 10rpx 30rpx;
					border-radius: 50rpx;
				}
			}

		}


	}
</style>

<style lang="scss" scoped>
	.parse-wrapper {
		box-sizing: border-box;
		margin-top: 20rpx;
		padding: 15rpx 10rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.buy-tip {
		width: 70vw;
		border-radius: 20rpx;
		background-color: #fff;
		overflow: hidden;
	}

	.tips-title {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100rpx;
		font-size: 32rpx;
		background-color: #fff;
		z-index: 0;
		overflow: hidden;

		&::before {
			position: absolute;
			top: 0;
			left: -20rpx;
			bottom: 0;
			right: -20rpx;
			display: block;
			content: '\20';
			border-radius: 0 0 50% 50%;
			background-color: var(--help-colo, #FE504F);
			z-index: -1;
		}
	}

	.buy-tips__text {
		box-sizing: border-box;
		padding: 30rpx;
		font-size: 26rpx;
	}

	.buy-tips__btn {
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 9999rpx;
		margin: 20rpx 30rpx;
		margin-top: 200rpx;
		font-size: 28rpx;
		color: #fff;
		text-align: center;
		background-color: var(--help-colo, #FE504F);
	}
	.page_btn-choice-spec {
		box-sizing: border-box;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 20rpx;
		height: 50rpx;
		font-size: 24rpx;
		background: var(--theme-color, #FFD940);
		color: var(--auxiliary-color, #333333);
		border-radius: 10rpx;
	}
	.btn-online-buy {
		box-sizing: border-box;
		display: flex;
		height: 80rpx;
		align-items: center;
		margin-top: 30rpx;
		color: #F28243;
		font-size: 28rpx;
		justify-content: center;
		border: 1px solid currentColor;
		border-radius: 10rpx;
	}
</style>
