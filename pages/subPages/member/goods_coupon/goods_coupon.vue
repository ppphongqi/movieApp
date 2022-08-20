<template>
	<view :style="themeColor">
		<!-- <view class="header-bg" :style="{'background-image':'url('+imageRoot+'20.png)'}"></view> -->
		<view class="section padding-box">
			<!-- <view class="tab-bar m-btm30" :style="{'background-image':'url('+imageRoot+'21.png)'}"> -->
			<!-- 				<view class="member-label-height"></view>
				<view class="f-24 member-label member-label t-c m-btm36">会员卡专享四大权益</view>
				<view class="Tabbar dis-flex flex-x-between padding-box">
					<block v-for="(items,index) in Tabbar" :key="index">
						<view class="Tabbar-items t-c">
							<image :src="items.imgae" mode=""></image>
							<view class="tabbar-title f-24 col-3">{{items.title}}</view>
						</view>
					</block>
				</view>
			</view> -->
			<block v-if="PageType==='goods' || PageType==='exclusive'">
				<view class="goods-list">
					<block v-for="(goods_items,index) in goods_list" :key="index">
						<view class="goods-items m-btm30 b-f cont-box dis-flex" @click="skip_goods(goods_items.goods_id)">
							<view class="items-left" :style="{'background-image':'url('+goods_items.image[0]['file_path']+')'}"></view>
							<view class="items-right">
								<view class="goods-title twolist-hidden f-30 col-3">{{goods_items.goods_name}}</view>
								<view class="goods-price dis-flex flex-y-center">
									<view class="now-price f-38 price-font-family">{{settingData.currency}}{{goods_items.goods_price}}</view>
									<view class="dis-flex flex-y-center">
										<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
										<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">
											<block v-if="PageType === 'goods'">
												{{memberDiyFont.discount_font}}<text class="member-coupon-price">{{goods_items.coupon_price}}</text>元
											</block>
											<block v-if="PageType === 'exclusive'">
												{{memberDiyFont.exclusive_font}}
											</block>
										</view>


									</view>
								</view>
								<view class="member-price dis-flex flex-y-center flex-x-between">
									<view class="old-price f-24 col-9">{{settingData.currency}}{{goods_items.line_price}}</view>
									<view class="f-24 col-9">已售{{goods_items.goods_sales}}</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<loadmore :showLoadmore="showLoadmore"></loadmore>
			</block>
			<block v-if="PageType==='coupon'">
				<view class="coupon-list">
					<block v-for="(coupon_items,index) in newcouponList" :key="index">
						<view class="coupon-items m-btm20 cont-box dis-flex flex-y-center flex-x-between" :class="coupon_items.is_receive?'ady_coupon_bg':'not_coupon_bg'"
						 @click="receiveCoupon(coupon_items,index,coupon_items.is_receive)">
							<view class="f-50" :class="coupon_items.is_receive?'ady-coupon-price':'coupon-price'">
								<text class="f-24" v-if="coupon_items.coupon_type !== 20">{{settingData.currency}}</text>
								{{coupon_items.coupon_type === 40 ? (coupon_items.min+"-"+coupon_items.max) : coupon_items.coupon_type === 20 ? coupon_items.discount : coupon_items.reduce_price}}
								<text class="f-24" v-if="coupon_items.coupon_type === 20">折</text>
							</view>
							<view class="coupon-type">
								<view class="f-28" :class="coupon_items.is_receive?'col-c':'col-3'">{{coupon_items.name}}</view>
								<view class="coupon-condition col-c f-24 m-btm10">{{coupon_items.rule === 0 ? coupon_price[coupon_items.coupon_type]['textRule']+coupon_items.rule_min_money:''}}{{coupon_price[coupon_items.coupon_type]['textPrev']}}{{coupon_items.coupon_type === 40 ? (coupon_items.min+"~"+coupon_items.max) : coupon_items.coupon_type === 20 ? coupon_items.discount : coupon_items.reduce_price}}{{coupon_price[coupon_items.coupon_type]['textLast']}}</view>
								<view class="progress-main dis-flex flex-y-center">
									<view class="progress">
										<view class="ady-progress" :class="coupon_items.is_receive?'ady-progress-bg':'not-progress-bg'" v-if="coupon_items.much!==-1"
										 :style="'width:'+(coupon_items.much * 100)+'%'"></view>
									</view>
									<view class="f-22 col-c">已抢{{parseInt(coupon_items.much * 100)}}%</view>
								</view>
							</view>
							<view class="coupon-getbtn" :class="coupon_items.is_receive?'ady-getbtn':'not-getbtn'">{{coupon_items.is_receive?'已领取':'立即领取'}}</view>
						</view>
					</block>
					<loadmore :showLoadmore="showLoadmore"></loadmore>
				</view>
			</block>
		</view>
		<GoTopBtn :page-scroll="pageScroll"></GoTopBtn>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import loadmore from "@/components/template/Loadmore.vue"
	import GoTopBtn from "@/components/template/GoTopBtn.vue"
	import listMixin from "@/common/js/pageListMixin.js"
	export default {
		mixins: [listMixin],
		data() {
			return {
				PageType: null, //页面类型(goods,coupon)
				is_member: null,
				current_page: 1,
				last_page: null,
				showLoadmore: false, //是否加载完成
				goods_list: [], //商品列表
				coupon_list: [], //优惠券列表
				coupon_price: {}, //优惠券价格打折类型
				pageScroll: 0, //滑动高度
				Tabbar: [{
						imgae: '/static/images/member/zhekou.png',
						title: '商品折扣价'
					},
					{
						imgae: '/static/images/member/coupon.png',
						title: '专属优惠券'
					},
					{
						imgae: '/static/images/member/fenxiao.png',
						title: '直享分销'
					},
					{
						imgae: '/static/images/member/kefu.png',
						title: '优先客服'
					},
				]
			};
		},
		onLoad(e) {
			App.showLoading()
			let _this = this,
				NavbarTitle = e.PageType === 'coupon' ? `会员${this.appCoupon.coupon_title}` : e.PageType === "exclusive" ? "会员专属" :
				'商品折扣';
			_this.PageType = e.PageType;
			_this.is_member = e.is_member;
			uni.setNavigationBarTitle({
				title: NavbarTitle ?NavbarTitle:''
			});
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff"
			});
			_this.DataDetails(e.PageType, 1, false);
		},
		onShow() {

		},
		components: {
			loadmore,
			GoTopBtn
		},
		mounted() {

		},
		computed: {
			newcouponList() {
				let _this = this;
				if (!!_this.coupon_list && _this.coupon_list.length > 0) {
					return _this.coupon_list.map((val, index) => {
						if (!val.is_receive) {
							_this.$set(_this.coupon_list[index], "is_receive", 0);
						}
						return val
					});
				} else {
					return [];
				}
			}
		},
		methods: {
			// 商品或优惠券列表
			DataDetails(PageType, page = 1, isPage = false) {
				let _this = this,
					requestUrl,
					data;
				if (PageType === "goods" || PageType === "exclusive") {
					requestUrl = 'member.Member/getMemberGoodsList';
					data = {
						goods_type: PageType === "goods" ? 1 : 3,
						page,
						listRows: 10
					};
				}
				if (PageType === "coupon") {
					let coupon_price = {
						10: {
							textRule: '满',
							textPrev: '减免',
							textLast: '元'
						},
						20: {
							textRule: '满',
							textPrev: '打',
							textLast: '折'
						},
						30: {
							textRule: '满',
							textPrev: '减免',
							textLast: '元'
						},
						40: {
							textRule: '满',
							textPrev: '随机减',
							textLast: '元'
						}
					};
					_this.coupon_price = coupon_price;
					requestUrl = 'member.Member/getCoupon';
					data = {
						page,
						listRows: 10,
						user_id: uni.getStorageSync('user_id')
					};
				}
				App._post_form(requestUrl, data, (res) => {
					let listData = res.data;
					if (isPage) {
						if (listData.data.length > 0) {
							_this[PageType === "goods" || PageType === "exclusive" ? "goods_list" : "coupon_list"].push(...listData.data);
						} else {
							_this.showLoadmore = true;
						}
					} else {
						_this[PageType === "goods" || PageType === "exclusive" ? "goods_list" : "coupon_list"] = listData.data;
						_this.showLoadmore = listData.data.length < listData.per_page;
						_this.setData(listData);
					}
				}, false, () => {
					App.hideLoading()
				})
			},
			//商品跳转详情
			skip_goods(goodsid) {
				App.navigationTo({
					url: `pages/subPages/goods/index/index?goods_id=${goodsid}&goods_type=member_goods`
				})
			},
			// 领取优惠券
			async receiveCoupon(coupon, index, is_receive) {
				let _this = this;
				// if(_this.is_member){
				// 	App.showError('请先开通会员卡获取该权限!')
				// 	return
				// }
				if (is_receive === 1) return;
				uni.showLoading();
				let location = {}
				if([1,2].includes(coupon.area_restrictions)) {
					location = await App.getLocation() || {}
				}
				App._post_form('user.coupon/receive', {
					coupon_id: coupon.coupon_id,
					lat: location.latitude || '',
					lng: location.longitude || '',
					is_member: 1
				}, (result) => {
					_this.$set(_this.coupon_list[index], "is_receive", 1);
					App.showSuccess(result.msg);
				}, null, () => {
					uni.hideLoading();
				});
			}
		},
		onReachBottom() {
			let _this = this;
			if (_this.current_page >= _this.last_page) {
				_this.showLoadmore = true;
				return false;
			}
			_this.DataDetails(_this.PageType, ++_this.current_page, true);
		}
	}
</script>

<style>
	page {
		background-color: #f2f2f2;
		padding-bottom: -160upx;
	}

	.not_coupon_bg {
		background-image: url('~@/static/images/member/not-coupon-bg.png');
	}

	.ady_coupon_bg {
		background-image: url('~@/static/images/member/ady-coupon-bg.png');
	}

	/* 	.header-bg {
		width: 100%;
		height: 370upx;
		background-size: cover;
		background-repeat: no-repeat;
	} */

	.section {
		position: relative;
		margin-top: 30upx;
	}

	.section .tab-bar {
		width: 100%;
		height: 270upx;
		background-size: cover;
		background-repeat: no-repeat;
		/* padding-top: 30upx; */
	}

	.member-label-height {
		height: 30upx;
	}

	.member-label {
		position: relative;
		width: 270upx;
		height: 56upx;
		line-height: 56upx;
		color: #EBD9BA;
		background: linear-gradient(to right, #222222, #414141);
	}

	.member-label::after {
		content: " ";
		position: absolute;
		right: 0;
		top: 0;
		border-bottom: 28upx solid transparent;
		border-right: 10upx solid rgb(239, 222, 191);
		border-top: 28upx solid transparent;
	}

	.Tabbar-items image {
		width: 60upx;
		height: 60upx;
	}

	.goods-items {
		border-radius: 20upx;
	}

	.goods-items .items-left {
		width: 170upx;
		height: 170upx;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		border-radius: 6upx;
		margin-right: 30upx;
	}

	.goods-items .items-right {
		flex: 1;
	}

	.goods-items .items-right .goods-title {
		height: 80upx;
		line-height: 40upx;
	}

	.goods-items .items-right .goods-price {}

	.goods-items .items-right .goods-price .now-price {
		color: #EF4343;
	}

	.goods-items .old-price {
		text-decoration: line-through;
	}

	.member-price-label {
		height: 0;
		line-height: 30upx;
		border-width: 0upx 10upx 30upx 0;
		border-style: none solid solid;
		border-color: transparent #000 #efd68f;
		position: relative;
		left: 10upx;
		padding-left: 6upx;
		border-radius: 4upx 0 0 4upx;
	}

	.coupon-price-2 {
		padding: 0 10upx;
		height: 30upx;
		line-height: 30upx;
		border-radius: 0 4upx 4upx 0;
	}

	.coupon-list .coupon-items {
		height: 180upx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.coupon-items .ady-coupon-price {
		color: #CCCCCC;
	}

	.coupon-items .coupon-price {
		color: #472712;
	}

	.progress-main .progress {
		position: relative;
		width: 130upx;
		height: 14upx;
		border-radius: 6upx;
		background-color: #F0F0F0;
		margin-right: 10upx;
	}

	.progress-main .progress .ady-progress-bg {
		background-color: #CCCCCC;
	}

	.progress-main .progress .not-progress-bg {
		background-color: #ECDBBD;
	}

	.progress-main .progress .ady-progress {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		width: 20%;
		height: 14upx;
		border-radius: 6upx;
	}

	.coupon-getbtn.ady-getbtn {
		color: #999999;
	}

	.coupon-getbtn.not-getbtn {
		color: #472712;
	}

	.coupon-getbtn {
		position: relative;
		width: 40upx;
		line-height: 24upx;
		font-size: 24upx;
	}

	.coupon-getbtn::before {
		content: " ";
		width: 2upx;
		height: 56upx;
		left: -50upx;
		background-color: #CCCCCC;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}
</style>
