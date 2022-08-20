	<template>
	<view :style="themeColor">
		<view class="content" v-if="isCard">
			<view class="pages-header"></view>
			<view class="member-content">
				<view class="header" style="position: relative;">
					<view class="header-main" :style="{'background-image':memberInfo.is_member?(memberSet.image_second.length>0?'url('+memberSet.image_second[0]['file_path']+')':getImageRoot('27.png','url')):(memberSet.image_first.length>0?'url('+memberSet.image_first[0]['file_path']+')':getImageRoot('26.png','url'))}">
						<view class="member-number col-98 f-24" v-if="memberInfo.is_member">NO：
							<text>{{memberInfo.card_number}}</text>
						</view>
						<view class="member-msg dis-flex flex-x-between">
							<view class="member-user-msg dis-flex flex-y-center flex-box">
								<block v-if="memberInfo.avatarUrl">
									<image :src="memberInfo.avatarUrl" mode="" class="member-avatar" :class="memberInfo.is_member?'ady-member-avatar-bor':'not-member-avatar-bor'"></image>
								</block>
								<block v-else>
									<view class="member-avatar">
										<!-- #ifdef MP-WEIXIN -->
										<open-data class="" lang="zh_CN" type="userAvatarUrl"></open-data>
										<!-- #endif -->
										<!-- #ifndef MP-WEIXIN -->
										<image src="/static/images/user/avatar.png" mode="" class="member-avatar" :class="memberInfo.is_member?'ady-member-avatar-bor':'not-member-avatar-bor'"></image>
										<!-- #endif -->
									</view>
								</block>
								<view class="dis-flex flex-dir-column flex-box">
									<view class="user-nickname f-30 dis-flex flex-y-center" :class="memberInfo.is_member?'col-f':'col-3'">
										<view class="onelist-hidden flex-box">
											<block v-if="memberInfo.nickName">
												{{memberInfo.nickName}}
											</block>
											<block v-else>
												<!-- #ifdef MP-WEIXIN -->
												<open-data lang="zh_CN" type="userNickName"></open-data>
												<!-- #endif -->
												<!-- #ifndef MP-WEIXIN -->
												请登录后查看会员资料
												<!-- #endif -->
											</block>
										</view>
										<!-- <image :src="memberInfo.is_member?'/static/images/member/ady-member.png':'/static/images/member/not-member.png'"
										 mode="" class="member-logo"></image> -->
									</view>
									<view class="member-dge-price f-24 col-9 twolist-hidden" v-if="!memberInfo.is_member">{{!!memberSet.card_title?memberSet.card_title:'会员卡'}}仅售{{settingData.currency}}{{memberSet.price_min}}</view>
									<view class="member-dge-price f-24 col-f" v-else>{{memberInfo.card_end_time}}到期</view>
								</view>
							</view>
							<view class="member-people" v-if="!memberInfo.is_member">
								<view class="f-24 col-9">已加入会员</view>
								<view class="f-24 col-9 t-r"><text class="col-917952">{{memberSet.number}}</text>人</view>
							</view>
						</view>
					</view>
					<view class="member-label f-24 dis-flex flex-y-center flex-x-between padding-box" :class="memberInfo.is_member?'ady-member-label':'not-member-label'">
						<view class="">{{memberInfo.is_member?'会员期间已为你节省':'根据去年用户消费计算，预计开卡后一年节省'}}<text>{{settingData.currency}}{{memberInfo.is_member?memberInfo.card_coupon_price:memberSet.cost}}</text></view>
						<view class="dis-flex flex-y-center" @click="open_member" v-if="memberInfo.is_renew === 1">
							<view class="">立即续费</view>
							<view class="iconfont icon-jinrujiantou1"></view>
						</view>
					</view>

					<!-- && memberSet.buy_card_type==='2' -->
					<!-- <view class="open-member-btn p-r main-bg-color auxiliary-color" :class="memberInfo.is_member?'ady-open-member-btn':'not-open-member-btn'" v-if="memberInfo.is_member === 0">
						<view class="open-btn t-c f-28 col-3 f-w auxiliary-color" @click="open_member">{{memberSet.buy_card_type=='1'? '开通会员':'购买礼包赠送会员'}}</view>
						<BindMobileButton v-if="(memberInfo.mobile==='0'|| memberInfo.mobile==='') && isUserLogin" @onBindSuccess="bindMobile($event,'open')"></BindMobileButton>
					</view> -->
					<view class="redeem-code col-9 f-24 t-c " v-if="!memberInfo.is_member && memberSet.is_cdkey==='1'" @click="isopenactivationShow">激活码兑换
						<BindMobileButton v-if="(memberInfo.mobile==='0'|| memberInfo.mobile==='') && isUserLogin" @onBindSuccess="bindMobile($event,'code')"></BindMobileButton>
					</view>
				</view>
				<view class="section">
					<view class="member-Tabbar m-btm30" v-if="memberSet">
						<view class="title col-3 f-32 f-w">会员专属特权</view>
						<image :src="memberSet.image_third.length>0?memberSet.image_third[0]['file_path']:getImageRoot('31.png')" mode="widthFix"
						 style="width: 100%;"></image>
					</view>
					<view class="member-customer dis-flex b-f flex-y-center">
						<view class="customer-logo">
							<image :src="appLogo?appLogo:'/static/images/member/customer.png'" mode=""></image>
						</view>
						<view class="customer-title">
							<view class="col-3 f-28 f-w">{{appName}}专属客服服务</view>
							<view class="col-9 f-24">会员咨询，权益和加群都来找我吧~</view>
						</view>
						<view class="customer-add-btn f-24 col-f t-c" @click="customer">添加</view>
					</view>
					<image v-if="memberSet.buy_card_type != '1'" :src="getImageRoot('member_buy_goods.png')" mode="" style="width: 690rpx;height: 150rpx;" @click="buyGoodsOpenMember"></image>

					<!-- 会员专属商品 -->
					<view class="member-shop member-Tabbar m-btm30" v-if="!!member_exclusive && member_exclusive.length>0">
						<view class="dis-flex flex-x-between flex-y-center m-btm36">
							<view class="title col-3 f-32 f-w">会员专享</view>
							<view class="shop-more f-24 col-9" @click="skipDetail('exclusive')">更多
								<text class="iconfont icon-right more-icon"></text>
							</view>
						</view>
						<block v-if="!!member_exclusive && member_exclusive.length>0">
							<view class="shop-list dis-flex flex-x-between">
								<block v-for="(goods_items,index) in member_exclusive" :key="index">
									<view class="shop-items m-btm40" @click="skip_goods(goods_items.goods_id,1)">
										<view class="shop-image" :style="{'background-image':'url('+goods_items.image[0]['file_path']+')'}"></view>
										<view class="shop-detail">
											<view class="shop-title f-30 col-3 m-top-btm20 twolist-hidden">
												{{goods_items.goods_name}}
											</view>
											<view class="member-price dis-flex flex-y-center">
												<view class="now-price f-30 price-font-family">{{settingData.currency}}{{goods_items.goods_price}}</view>
												<view class="dis-flex flex-y-center">
													<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
													<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">{{memberDiyFont.exclusive_font}}</view>
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
						</block>
						<block v-else>
							<view class="f-26 t-c col-9 p-b-20">没有更多商品了~</view>
						</block>
					</view>

					<!-- 商品 -->
					<view class="member-shop member-Tabbar m-btm30">
						<view class="dis-flex flex-x-between flex-y-center m-btm36">
							<view class="title col-3 f-32 f-w">商品折扣</view>
							<view class="shop-more f-24 col-9" @click="skipDetail('goods')" v-if="!!goodsList && goodsList.length>0">更多
								<text class="iconfont icon-right more-icon"></text>
							</view>
						</view>
						<block v-if="!!goodsList && goodsList.length>0">
							<view class="shop-list dis-flex flex-x-between">
								<block v-for="(goods_items,index) in goodsList" :key="index">
									<view class="shop-items m-btm40" @click="skip_goods(goods_items.goods_id)">
										<view class="shop-image" :style="{'background-image':'url('+goods_items.image[0]['file_path']+')'}"></view>
										<view class="shop-detail">
											<view class="shop-title f-30 col-3 m-top-btm20 twolist-hidden">
												{{goods_items.goods_name}}
											</view>
											<view class="member-price dis-flex flex-y-center">
												<view class="now-price f-30 price-font-family">{{settingData.currency}}{{goods_items.goods_price}}</view>
												<view class="dis-flex flex-y-center">
													<view class="member-price-label f-22">{{memberDiyFont.member_font}}</view>
													<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">{{memberDiyFont.discount_font}}<text class="member-coupon-price">{{goods_items.coupon_price}}</text>元</view>
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
						</block>
						<block v-else>
							<view class="f-26 t-c col-9 p-b-20">没有更多商品了~</view>
						</block>
					</view>

					<!-- 优惠券 -->
					<view class="member-coupon member-Tabbar">
						<view class="dis-flex flex-x-between flex-y-center m-btm36">
							<view class="title col-3 f-32 f-w">专享{{appCoupon.coupon_title}}</view>
							<view class="shop-more f-24 col-9" @click="skipDetail('coupon')" v-if="!!newcouponList && newcouponList.length>0">更多
								<text class="iconfont icon-right more-icon"></text>
							</view>
						</view>
						<block v-if="!!newcouponList && newcouponList.length>0">
							<view class="coupon-list dis-flex flex-x-between">
								<block v-for="(item,index) in newcouponList" :key="index">
									<view class="coupon-items dis-flex flex-x-between m-btm20 p-r" @click="receiveCoupon(item,index,item.is_receive)"
									 :class="item.is_receive === 1?'ady-coupon-items-bor':'not-coupon-items-bor'">
										<view class="items-left">
											<view class="f-30" :class="item.is_receive === 1?'col-9':'coupon-price'">
												<text class="f-24" v-if="item.coupon_type !== 20">{{settingData.currency}}</text>
												{{item.coupon_type === 40 ? (item.min+"-"+item.max) : item.coupon_type === 20 ? item.discount : item.reduce_price}}
												<text class="f-24" v-if="item.coupon_type === 20">折</text>
											</view>
											<view class="condition f-24" :class="item.is_receive === 1?'col-9':''">{{item.rule === 0 ? coupon_price[item.coupon_type]['textRule']+item.rule_min_money:''}}{{coupon_price[item.coupon_type]['textPrev']}}{{item.coupon_type === 40 ? (item.min+"-"+item.max) : item.coupon_type === 20 ? item.discount : item.reduce_price}}{{coupon_price[item.coupon_type]['textLast']}}</view>
											<view class="coupon-type f-24" :class="item.is_receive === 1?'col-9':''">{{item.name}}</view>
										</view>
										<view class="items-right dis-flex flex-x-center flex-y-center" :style="{'background-image':getImageRoot(item.is_receive === 1?'29.png':'28.png','url')}">
											<view class="get-btn f-24 t-c" :class="item.is_receive === 1?'col-f':'col-3 not-get-btn'">{{item.is_receive === 1?'已领取':'立即领取'}}</view>
										</view>
									</view>
								</block>
							</view>
						</block>
						<block v-else>
							<view class="f-26 t-c col-9 p-b-20">没有更多{{appCoupon.coupon_title}}了~</view>
						</block>
					</view>
				</view>
				<view class="footer-bottom"></view>
			</view>
			<view class="mask-main" v-if="activationShow">
				<view class="mask-view"></view>
				<view class="call-main b-f">
					<view class="card-title t-c f-32 m-btm10">兑换会员</view>
					<view class="card-title-parse f-24 col-9 t-c m-btm50">兑换用户至: {{memberInfo.nickName}}</view>
					<view class="card-code-input m-btm30">
						<input type="text" value=""  placeholder="请输入兑换码" class="f-26 padding-box" v-model="activationcode" />
					</view>
					<view class="f-24 card-code-btn t-c main-bg-color auxiliary-color" @click="confrimCode">
						确认兑换
					</view>
					<view class="close-img" @click="isopenactivationShow">
						<text class="iconfont icon-roundclose"></text>
					</view>
				</view>
			</view>
			<view class="footer-bottom"></view>
		</view>
		<!-- <DiyTab></DiyTab>
		<shortcut id=""></shortcut> -->
		<view class="tabbar dis-flex">
			<view class="to-homeBtn f-32" @click="handleHomeBtn">返回首页</view>
			<view class="open-memberbtn f-32" @click="open_member">
				{{openMemberBtnText}}
				<view class="tip f-20" v-if="!is_member">开通享福利</view>
			</view>
		</view>
		<page-loading ref="loading"></page-loading>
		<!-- #ifdef H5 -->
		<share-guide ref="shareGuide"></share-guide>
		<!-- #endif -->
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import BindMobileButton from "@/components/template/BindMobileButton.vue"
	// import DiyTab from "@/components/template/TabBar.vue"
	// import shortcut from "@/components/template/ShortCut.vue"
	import pageShare from "@/common/js/pageShareMixin.js"
	// #ifdef H5
	import wxApi from "@/static/h5/wxApi.js"
	// #endif
	export default {
		mixins: [pageShare],
		data() {
			return {
				service: {},
				coupon_price: {
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
				},
				goodsList: null, // 商品
				couponList: null, // 优惠券
				memberInfo: null, //会员信息
				memberSet: null, //会员卡信息
				member_exclusive: null, //会员专属商品
				activationShow: false,
				activationcode: '',
				is_member: false,
				isCard: false //是否开启会员卡
			};
		},
		onLoad(e) {
			this.userInfo = uni.getStorageSync('userInfo');
			// uni.setNavigationBarColor({
			// 	frontColor: "#000000",
			// 	backgroundColor: "#ffffff"
			// });
		},
		onShow() {
			this.memberDetail()
		},
		components: {
			// DiyTab,
			// shortcut,
			BindMobileButton
		},
		mounted() {

		},
		methods: {
			changeCode(e){
				console.log(e)
			},
			// 会员详情
			memberDetail() {
				let _this = this;
				App._get('member.Member/MemberInfo', {
					user_id: uni.getStorageSync('user_id'),
					no_login: 1
				}, (res) => {
					console.log('----------------------',res.data)
					this.is_member = res.data.memberInfo.is_member == 1
					if(res.data.memberSet.member_card_type == 2) {
						// 跳转到新版页面
						App.navigationTo({
							url: 'pages/subPages/memberCenter/index',
							redirectTo: true
						})
						return
					}
					if (res.code === 1) {
						let {
							setting: shareSetting
						} = res.data;
						if (!!shareSetting) {
							let singleShare = {};
							for (let [key, value] of Object.entries(shareSetting)) {
								key = key.split("_");
								key.shift();
								singleShare[key.join("_")] = value;
							}
	
							// #ifdef H5
							wxApi.wxRegister();
							// #endif
	
							_this.shareData = _this.getPageShareData("member/index", singleShare);
						}
						_this.setData(res.data);
						_this.isCard = true;
					}
				}, (err) => {
					if (err.data.code === 0) {
						uni.reLaunch({
							url: '/pages/mainPages/index/index'
						});
					}
				}, () => {
					App.hideLoading();
					uni.stopPullDownRefresh();
				})
			},
			// 领取优惠券
			async receiveCoupon(coupon, index, is_receive) {
				let _this = this;
				if (_this.memberInfo.is_member) {
					if (is_receive === 1) return;
					uni.showLoading();
					console.log(coupon, index, is_receive);
					let location = {}
					if([1,2].includes(coupon.area_restrictions)) {
						location = await App.getLocation() || {}
					}
					App._post_form('user.coupon/receive', {
						coupon_id: coupon.coupon_id,
						is_member: 1,
						lat: location.latitude || '',
						lng: location.longitude || ''
					}, (result) => {
						_this.$set(_this.couponList[index], "is_receive", 1);
						App.showSuccess(result.msg);
						console.log(_this.couponList[index]);
					}, null, () => {
						uni.hideLoading();
					});
				} else {
					App.showError('请先开通会员再领取优惠券!')
				}
			},
			handleHomeBtn() {
				App.navigationTo({
					url: 'pages/mainPages/index/index'
				})
			},
			customer() {
				let _this = this;
				const item = this.service
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
				App.navigationTo({
					url: 'pages/subPages/user/service'
				})
			},
			skip_goods(goodsid,exclusive=0) {
			    let _this = this;
			    App.navigationTo({
			     url: `pages/subPages/goods/index/index?goods_id=${goodsid}&goods_type=member_goods&exclusive=${exclusive}`
			    })
			   },
			/**
			 * 获取用户手机号
			 */
			bindMobile(res, btnType) {
				console.log(res, btnType);
				this.memberInfo.mobile = res.mobile;
				this[btnType === "open" ? "open_member" : "isopenactivationShow"]();
			},
			open_member() {
				let _this = this,
					card_type = _this.memberInfo.is_member === 0 ? 2 : 1,
					mobile = _this.memberInfo.mobile;
				if (!_this.isUserLogin) {
					App.doLogin();
				}
				if (mobile === "0" || mobile === "") {
					App.showError('请前往【个人中心->设置】绑定手机号！',()=>{
						this.navigationTo('pages/subPages/user/index')
					})
					return;
				}
				if (_this.memberSet.buy_card_type === "1") {
					App.navigationTo({
						url: `pages/subPages/member/memberpay/memberpay?card_type=${card_type}`
					});
				} else if (_this.memberSet.buy_card_type === "2") {
					App.navigationTo({
						url: 'pages/subPages/member/member_goods/member_goods'
					});
				}
			},
			buyGoodsOpenMember() {
				App.navigationTo({
					url: `pages/subPages/member/member_goods/member_goods`
				})
			},
			skipDetail(skip_type) {
				let _this = this;
				switch (skip_type) {
					case 'goods':
						App.navigationTo({
							url: 'pages/subPages/member/goods_coupon/goods_coupon?PageType=goods'
						});
						break;
					case 'exclusive':
						App.navigationTo({
							url: 'pages/subPages/member/goods_coupon/goods_coupon?PageType=exclusive'
						});
						break;
					case 'coupon':
						App.navigationTo({
							url: `pages/subPages/member/goods_coupon/goods_coupon?PageType=coupon&is_member=${_this.memberInfo.is_member}`
						});
						break;
				}
			},
			isopenactivationShow() {
				let _this = this;
				if (!_this.isUserLogin) {
					App.doLogin();
				}
				if (_this.memberInfo.mobile === "0" || _this.memberInfo.mobile === "") {
					return;
				} else {
					_this.activationShow = !_this.activationShow;
				}
			},
			confrimCode() {
				uni.hideKeyboard();
				let _this = this;
				let timer = setTimeout(()=>{
					console.log('激活码：'+_this.activationcode)
					App._post_form('member.Member/cdKeyUse', {
						cdKey: _this.activationcode
					}, (res) => {
						if (res.code === 1) {
							App.showError('会员卡激活成功', () => {
								this.memberDetail();
								_this.activationShow = false;
								_this.activationcode = '';
							})
	
						}
					})
					clearTimeout(timer)
				},200)
	
			}
		},
		computed: {
			openMemberBtnText() {
				return this.is_member ? '立即续费' : '立即开通'
			},
			newcouponList() {
				let _this = this;
				if (!!_this.couponList) {
					return _this.couponList.map((val, index) => {
						if (!val.is_receive) {
							_this.$set(_this.couponList[index], "is_receive", 0);
						}
						return val
					});
				}
			}
		},
		onPullDownRefresh() {
			this.memberDetail();
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F2F2F2;
	}

	.pages-header {
		height: 200upx;
		position: relative;
		overflow: hidden;
	}

	.pages-header::before {
		content: " ";
		width: 150vw;
		height: 200upx;
		background-color: var(--theme-color);
		border-radius: 50%;
		position: absolute;
		left: -26vw;
		top: -15%;
		z-index: 1;
	}

	.member-content {
		position: relative;
		margin: -23% 30upx 0;
		z-index: 4;
	}

	.header .header-main {
		position: relative;
		width: 100%;
		height: 320upx;
		background-repeat: no-repeat;
		background-size: cover;
		/* box-shadow: 0 4upx 12upx 0 rgba(154, 154, 154, .35); */
		border-radius: 20upx;
	}

	.header .header-main .member-number {
		position: absolute;
		right: 46upx;
		top: 15%;
	}

	.member-msg {
		padding: 200upx 46upx 0 46upx;
	}

	.member-user-msg {
		max-width: 78%;
	}

	.member-user-msg .not-member-avatar-bor {
		border: 1px solid #FFFFFF
	}

	.member-user-msg .ady-member-avatar-bor {
		border: 1px solid #DBA686
	}

	.member-user-msg .member-avatar {
		display: block;
		width: 70upx;
		height: 70upx;
		border-radius: 50%;
		margin-right: 12upx;
		overflow: hidden;
	}

	.member-logo {
		display: inline-block;
		width: 30upx;
		height: 30upx;
		vertical-align: middle;
		margin-left: 10upx;
	}



	.header .not-member-label {
		background-color: #333333;
		color: #FFFFFF;
	}

	.header .ady-member-label {
		background: #e2e2e2;
		color: #666;
	}

	.header .member-label {
		width: 647rpx;
		height: 67rpx;
		margin: 0 auto;
		border-radius: 0 0 20upx 20upx;
	}

	.header .member-label .iconfont {
		font-size: 36upx;
		color: #666;
	}

	.header .member-label text {
		color: #EF4343;
		margin-left: 8upx;
	}

	.redeem-code {
		position: absolute;
		width: 6em;
		top: 30rpx;
		right: 30rpx;
		text-decoration: underline;
	}

	.not-open-member-btn {
		margin-top: 30upx;
	}

	.ady-open-member-btn {
		margin-top: 30upx;
	}

	.open-member-btn {
		position: relative;
		background-color: #FFD940;
		height: 90upx;
		line-height: 90upx;
		border-radius: 44upx;
	}

	.open-btn {
		position: relative;
		z-index: 1;
		width: 100%;
	}

	.section {
		padding: 26upx 0;
	}

	.section .member-Tabbar {
		background-color: #FFFFFF;
		position: relative;
		padding: 36upx 30upx 0;
		border-radius: 20upx;
	}

	.section .member-Tabbar::after {
		content: " ";
		position: absolute;
		top: 40upx;
		left: 15upx;
		bottom: 2upx;
		width: 8upx;
		height: 36upx;
		background: #F1E0CE;
		border-radius: 20upx
	}

	.member-Tabbar .title {
		padding-left: 10upx;
	}

	.member-Tabbar .Tabbar {
		padding: 40upx 0;
	}

	.Tabbar-items image {
		width: 60upx;
		height: 60upx;
	}

	.buy_goods-bg {
		width: 100%;
		height: 150upx;
		background-repeat: no-repeat;
		background-size: 100%, 150upx;
	}

	.member-customer {
		border-radius: 20upx;
		padding: 30upx;
	}

	.customer-logo {
		margin-right: 20upx;
	}

	.customer-logo image {
		width: 68upx;
		height: 68upx;
		border-radius: 50%;
		vertical-align: bottom;
	}

	.customer-title {
		width: 60%;
		flex: 1;
	}

	.customer-add-btn {
		background: #09bb07;
		width: 120upx;
		height: 56upx;
		line-height: 56upx;
		border-radius: 30upx;
	}

	.more-icon {
		font-size: 24upx;
	}

	.shop-list {
		/* padding: 0 30upx; */
		flex-wrap: wrap;
	}

	.shop-items {
		max-width: 50%;
	}

	.shop-items .shop-image {
		border-radius: 6upx;
		background-repeat: no-repeat;
		background-size: cover;
		width: 300upx;
		height: 300upx;
		background-position: center;
	}

	.shop-detail .shop-title {
		width: 300upx;
		height: 2.6em;
		line-height: 1.3em;
	}

	.now-price {
		color: #FE504F;
		font-size: 32upx;
		margin-right: 6upx;
	}

	.member-price-label {
		height: 0;
		line-height: 30upx;
		border-width: 0upx 10upx 30upx 0;
		border-style: none solid solid;
		border-color: transparent #000 #efd68f;
		position: relative;
		/* left: 10upx; */
		padding-left: 6upx;
		border-radius: 4upx 0 0 4upx;
	}

	.coupon-price-2 {
		padding: 0 10upx 0 0;
		height: 30upx;
		line-height: 30upx;
		border-radius: 0 4upx 4upx 0;
	}

	.coupon-items {
		width: 300upx;
		border-radius: 6upx;
	}

	.not-coupon-items-bor {
		border: 2px solid #EAD3B5;
	}

	.ady-coupon-items-bor {
		border: 2px solid #E3E3E3;
	}

	.coupon-list {
		flex-wrap: wrap;
	}

	.items-left {
		width: 78%;
		padding: 18upx 0 18upx 34upx;
	}

	.items-left .coupon-type {
		line-height: 26upx;
	}

	.items-left .coupon-price {
		color: #EF4343;
	}

	.items-right {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		width: 22%;
		background-repeat: no-repeat;
		background-size: 104% 104%;
		background-position: -2%;
	}

	.member-coupon-price {
		color: #EFD68F;
	}

	.ady-get-btn {
		padding-top: 45upx;
	}

	.not-get-btn {
		/* padding-top: 30upx; */
	}

	.items-right .get-btn {
		width: 40upx;
		line-height: 24upx;
	}

	.card_code-main {
		width: 200upx;
		height: 200upx;
	}

	.mask-main {
		position: relative;
	}

	.mask-view {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .7);
		left: 0;
		top: 0;
		z-index: 900;
	}

	.call-main {
		position: fixed;
		width: 500upx;
		height: 320upx;
		padding: 20upx 40upx;
		z-index: 901;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		border-radius: 20upx;
	}

	.card-code-input input{
		border: 1px solid rgb(243, 240, 168);
		height: 70upx;
		line-height: 70upx;
		border-radius: 8upx;
		background-color: rgb(255, 250, 233);
		width: 100%;
	}
	.card-code-btn {
		height: 70upx;
		line-height: 70upx;
		/* border: 1px solid rgb(217, 217, 217); */
		border-radius: 30upx;
		margin: 0 auto;
		background-color: rgb(255, 220, 49);
	}

	.close-img {
		position: absolute;
		left: 50%;
		/* width: 100%; */
		z-index: 101;
		transform: translate(-50%, 70upx);
		/* text-align: center; */
	}

	.close-img .iconfont {
		color: #FFFFFF;
		font-size: 56upx;
	}

	.footer-bottom {
		height: 60upx;
		/* padding-bottom: 40upx; */
	}

	.old-price {
		text-decoration: line-through;
	}
	.tabbar {
		width: 750rpx;
		height: 100rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 20;
		.to-homeBtn {
			flex: 1;
			background: linear-gradient(49deg, #E7CFAC, #F1E0CE);
			color: #472712;
			font-weight: bold;
			line-height: 100rpx;
			text-align: center;
		}
		.open-memberbtn {
			flex: 2;
			background: #2A2A2A;
			color: #E8D1B0;
			font-weight: bold;
			line-height: 100rpx;
			text-align: center;
			position: relative;
			.tip {
				width: 130rpx;
				height: 30rpx;
				color: #472712;
				line-height: 30rpx;
				text-align: center;
				font-weight: 400;
				background: linear-gradient(49deg, #E7CFAC, #F1E0CE);
				border-radius: 28px 15px 15px 1px;
				position: absolute;
				top: 11rpx;
				right: 57rpx;
			}
			
		}
	}
</style>
