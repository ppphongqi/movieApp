<template>
	<view class="shopping-cart">
		<!-- 操作区域 -->
		<view class="op-section" :class="cOpSectionClassStr">
			<!-- 左 -->
			<view class="op-section__left">
				<button class="op-section__btn-contact btn-normal" @click="popupLayerVisible = true">
					<image class="op-section__btn-contact__img" src="../static/images/icon-cgp-contact-merchant.png" />
					<view class="op-section__btn-contact__img__text">联系商家</view>
				</button>
			</view>
			<!-- 左 end -->
			<!-- 中 -->
			<view class="op-section__center">
				<!-- 店铺logo -->
				<view class="op-section__logo-shop">
					<view v-if="cTotalData.num" class="op-section__total-num">{{cTotalData.num}}</view>
				</view>
				<!-- 店铺logo end -->
				<!-- 价格 -->
				<view v-if="cTotalData.num" class="price-wrapper">
					<view class="price-wrapper__row">
						<view class="price is-white"><text>￥</text><text class="is-strong">{{cTotalData.priceStr}}</text></view>
						<view class="price price--line"><text>￥{{cTotalData.priceLineStr}}</text></view>
					</view>
					<view v-if="cTotalData.priceSaveStr" class="price-wrapper__row">
						<view class="price"><text>{{memberDiyFont.member_font}}：{{memberDiyFont.discount_font}}￥{{cTotalData.priceSaveStr}}</text></view>
					</view>
				</view>
				<!-- 价格 end -->
				<!-- 暂无商品提示 -->
				<view v-else class="op-section_tip">暂无加入商品</view>
				<!-- 暂无商品提示 end -->
			</view>
			<!-- 中 end -->
			<!-- 右 -->
			<view v-if="cTotalData.num" class="op-section__right" @click="handleBtnGo">
				<button class="op-section__btn-go btn-normal">去结算</button>
			</view>
			<!-- 右 end -->
		</view>
		<!-- 操作区域 end -->
		<!-- 商品列表弹窗 -->
		<shopping-cart-goods-popup :show="goodsPopupVisible" @on-mask-click="goodsPopupVisible = false" />
		<!-- 商品列表弹窗 end -->
		<!-- 联系客服弹窗 -->
		<!-- #ifdef H5 -->
		<popup-layer
			:show="popupLayerVisible" 
			:showClose="true"
			topTitle="联系商家"
			:phone="cCustomerServiceData.phone"
			:communityType="cCustomerServiceData.communityType"
			:imgSrc="cCustomerServiceData.qrcodeImgUrl"
			:isShowLongPressBtn="cCustomerServiceData.showLongPressBtn"
			@closePopupBtn="popupLayerVisible=false">
		</popup-layer>
		<!-- #endif -->
		<!-- #ifdef MP -->
		<popup-layer
			:showClose="true"
			:show="popupLayerVisible"
			topTitle="联系商家"
			:phone="cCustomerServiceData.phone"
			:communityType="cCustomerServiceData.communityType"
			:imgSrc="getImageRoot('91.png')"
			:pagePath="cCustomerServiceData.pagePath"
			footBtnText='去回复'
			@closePopupBtn="popupLayerVisible=false">
			<view v-if="appClientType ==='2'">
				有任何疑问，点击“<text class="col-m">去回复</text>”发送“<text class="col-m">{{cCustomerServiceData.communityId}}</text>”,即可添加客服微信
			</view>
		</popup-layer>
		<!-- #endif -->
		<!-- 联系客服弹窗 end -->
		<!-- 关注公众号弹窗 -->
		<popup-view :show="followWechatPopupVisible" :overlay="true" @clickmask="followWechatPopupVisible = false">
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
					<button class="community-reply f-24 col-3" open-type="contact" :send-message-path="cFollowWechatData.path" :send-message-title="cFollowWechatData.title" show-message-card>去关注</button>
				</view>
				<view class="iconfont icon-roundclose" @click="followWechatPopupVisible = false"></view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="attention-box">
				<view class="attention-title f-28 col-9 t-c">活动仅限公众号粉丝参与</view>
				<view class="attention-label dis-flex flex-y-center m-top30 col-3 f-24">
					<view class="label-num backColor auxiliary-color">1</view>
					<view class="attention-text">识别下方二维码关注公众号</view>
				</view>
				<image :src="cFollowWechatData.subscribe_wechat_img" class="wechat-image"></image>
				<view class="iconfont icon-roundclose" @click="followWechatPopupVisible = false"></view>
			</view>
			<!-- #endif -->
		</popup-view>
		<!-- 关注公众号弹窗 end -->
		<!-- 留出底部安全距离 -->
		<view class="app-container--safe-bottom"></view>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import ShoppingCartGoodsPopup from './ShoppingCartGoodsPopup.vue'
	import PopupLayer from '@/components/template/PopLayer.vue'
	import PopupView from '@/components/template/PopManager.vue'
	export default {
		components: {
			ShoppingCartGoodsPopup,
			PopupLayer,
			PopupView
		},
		data() {
			return {
				// 商品弹窗是否显示
				goodsPopupVisible: false,
				// 联系客服弹窗是否显示
				popupLayerVisible: false,
				// 是否显示关注公众号弹窗
				followWechatPopupVisible: false
			}
		},
		computed: {
			// 关注公众号的数据
			cFollowWechatData() {
				return {
					// 是否需要关注公众号
					needed: this.$util.deepGet(this.$store.state.cgp, 'cartGoodsListRes.need_handle',false),
					path: `index/index?cgp=1&user_id=${App.getUserId()}&referee_id=${App.getUserId()}`,
					title: '社区团购',
					subscribe_wechat_img: this.$util.deepGet(this.$store.state.cgp, 'cartGoodsListRes.qr_path','')
				}
			},
			// 客服卡片数据
			cCustomerServiceData() {
			    const community = this.$util.deepGet(this.$store.state.cgp, 'setting.community', {})
			    return {
			        communityId: community.id,
			        avatar: this.$util.deepGet(community, 'headimg.0.file_path', ''),
			        title: community.title,
			        desc: community.des,
			        phone: community.mobile,
			        communityType: community.community_type,
			        qrcodeImgUrl: this.$util.deepGet(community, 'qrcodeimg.0.file_path', ''),
			        showLongPressBtn: [
			            2,
			            4
			        ].indexOf(community.community_type) == -1,
			        pagePath: `index/index?community_id=${community.id}&user_id=${App.getUserId()}`
			    }
			},
			// 购物车商品接口信息
			cCartGoodsListRes() {
				return this.$store.state.cgp.cartGoodsListRes || {
					goods_rows: []
				}
			},
			// 总计的一些信息
			cTotalData() {
				return {
					// 购物车商品总数
					num: +this.cCartGoodsListRes.goods_total_num || 0,
					// 最终价
					priceStr: this.cCartGoodsListRes.total_price,
					// 原价
					priceLineStr: this.cCartGoodsListRes.total_line_price,
					// 会员节省
					priceSaveStr: this.cCartGoodsListRes.total_member_coupon_price > 0 ? this.cCartGoodsListRes.total_member_coupon_price :
						''
				}
			},
			// 操作区域的class
			cOpSectionClassStr() {
				let classStr = ''
				if (!this.cTotalData.num) {
					classStr += ' is-no-goods'
				}
				return classStr
			}
		},
		watch: {
			cTotalData(val) {
				console.log('cTotalData', val)
			}
		},
		methods: {
			// 去结算按钮点击事件
			handleBtnGo() {
				console.log({
					cFollowWechatData: this.cFollowWechatData
				})
				// 需要关注公众号
				if (this.cFollowWechatData.needed) {
				    this.followWechatPopupVisible = true
				    return
				}
				if (!this.goodsPopupVisible) {
					this.goodsPopupVisible = true
					return
				}
				if (this.cTotalData.num > 0) {
					// 去购物车 页面参数为transport_type=40&cart_indexes=["690_0"]&isCart=1&is_express=0&is_zt=0&order_type=1&goods_type=&i=1
					const cart_indexes = (this.cCartGoodsListRes.goods_rows || []).filter(item => !item.tip).map(item =>
						`${item.goods_id}_${item.goods_sku_id}`)
					if(!cart_indexes.length) {
						App.showError('暂无可下单商品')
						return
					}
					App.navigationTo({
						url: 'pages/subPages/flow/checkout?' + App.urlEncode({
							transport_type: 40,
							cart_indexes: JSON.stringify(cart_indexes),
							isCart: 1,
							is_express: 1,
							is_zt: 0,
							order_type: 1,
							cgp: 1
						})
					})
				}
			}
		}

	}
</script>

<style lang="scss" scoped>
	$op-height: 100rpx;
	$op-radius: $op-height/2;

	.shopping-cart {
		box-sizing: border-box;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding-bottom: 130rpx;
		z-index: 206;
	}

	.op-section {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 690rpx;
		margin: 0 auto;
		background-color: #333;
		border-radius: $op-radius;
		z-index: 210;
	}

	.op-section__left {
		position: relative;

		&::after {
			position: absolute;
			right: 0;
			top: 50%;
			display: block;
			content: "\20";
			width: 1px;
			height: 59rpx;
			transform: translateY(-50%);
			background-color: rgba($color: #FFD940, $alpha: 0.5);
		}
	}

	.op-section__btn-contact {
		position: relative;
		box-sizing: border-box;
		height: 100%;
		width: 138rpx;
		height: $op-height;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: $op-radius 0 0 $op-radius;
	}

	.op-section__btn-contact__img {
		width: 40rpx;
		height: 40rpx;
	}

	.op-section__btn-contact__img__text {
		color: #FFD940;
		font-size: 20rpx;
	}

	.op-section__btn-go {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 140rpx;
		height: $op-height;
		font-weight: bold;
		color: #333333;
		font-size: 28rpx;
		border-radius: 0 $op-radius $op-radius 0;
		background: linear-gradient(-90deg, #FBAE34 0%, #FCCF5D 100%);
	}

	.op-section__center {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0;
		padding-left: 28rpx;
		height: $op-height;
	}

	.op-section__logo-shop {
		position: relative;
		top: -20rpx;
		flex-shrink: 0;
		width: 100rpx;
		height: 100rpx;
		background-image: url(../static/images/img-cgp-shop-community.png);
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;

		.is-no-goods & {
			background-image: url(../static/images/img-cgp-shop-community--disabled.png);
		}
	}

	.op-section__total-num {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 30rpx;
		min-width: 30rpx;
		padding: 0 4rpx;
		font-size: 20rpx;
		color: #fff;
		background-color: #FF4444;
		border-radius: 15rpx;
		transform: translateX(50%);
	}

	.price-wrapper {
		padding-left: 14rpx;
	}

	.price-wrapper__row {
		display: flex;
		align-items: flex-end;
	}

	.price {
		color: #999;
		font-size: 24rpx;

		&.is-white {
			color: #fff;
		}

		.is-strong {
			font-weight: bold;
			font-size: 28rpx;
			line-height: 1;
		}
	}

	.price--line {
		margin-left: 8rpx;
		text-decoration: line-through;
	}

	.op-section_tip {
		width: 100%;
		font-size: 28rpx;
		color: #fff;
		text-align: center;
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
	
	.img_shouzhi {
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
</style>
