<template>
	<view :style="themeColor">
		<!-- 弹窗开始 -->
		<popup-view :show="cardUseDesc" type="center" :overlay="cardUseDesc">
			<view class="" style="background: #FFFFFF;width: 540rpx;height: 200rpx;position: relative;border-radius: 20rpx;">
					<view style="padding: 40rpx 0 40rpx 0;text-align: center;font-size: 28rpx;">
						确定要分享吗？
					</view>
					<view style="display: flex;justify-content:space-around;text-align: center;border-top: 1px solid #C0C0C0;">
						<view style="border-right: 1px solid #C0C0C0;width: 49%;margin: 8rpx;">
							<button type='warn' size="mini" style="background:#FFFFFF;color: #000000;" @click="close">我在想想</button>
						</view>
							<!-- #ifdef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO -->
						<view style="width: 49%;margin: 8rpx;">
							<button type='warn' size="mini" open-type="share" style="background:#FFFFFF;color: #00882B;">确定</button>
						</view>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<view style="width: 49%;margin: 8rpx;">
							<button type='warn' size="mini" style="background:#FFFFFF;color: #00882B;" @click="hangderbtn">确定</button>
						</view>
						<!-- #endif -->
					</view>
			</view>
			<view class="iconfont icon-roundclose" style="text-align: center;margin-top: 40rpx;color: #FFFFFF;" @click="close"></view>
		</popup-view>
		<!-- 弹窗结束 -->
		<page-nav-bar @navItemClick="expressType" :fixed="1" :nav-list="navList" :current="dataType" is-scroll="true"></page-nav-bar>
		<view class="" style="padding-bottom: 52rpx;">
			<view class="lotter-list padding-box-all" style="padding: 20upx;">
				<scroll-view scroll-y="true" @scrolltolower="onScrollBottom" @scroll="scrolly">
					<!-- <view class="list-item m-btm20 bor-radius-10 b-f padding-box-all dis-flex" v-for="(item,index) in listData" @click="toLotterDetail(item)">
					<view v-if="item.image" class="goods-image bor-radius-10" :style="{'background-image':'url('+ (item.image_img ? item.image_img[0]['file_path'] || '' : '') +')'}"></view>
					
					<view class="goods-detail dis-flex flex-dir-column flex-x-between" style="width: 100%;">
						<view class="goods-title twolist-hidden f-28 col-3">{{item.luck_title}}</view>
						<block v-if="item.prize_state == 1">
							<view class="col-9 f-24">中奖数：{{item.luck_count}}份</view>
						</block>
						<block v-if="item.prize_state == 2">
							<view class="f-24 win-text">已中奖</view>
						</block>
						<block v-if="item.prize_state == 3">
							<view class="f-24 win-text">未中奖</view>
						</block>
						<view class="col-9 f-24 dis-flex flex-x-between flex-y-center" style="width: 100%;">
						<text class="onelist-hidden" style="width:240upx;flex-grow:1;">{{luck_mode(item)}}</text>
						<view v-if="item.prize_state == 2" style="margin-left: 20upx;" class="go-draw-style main-bg-color auxiliary-color">中奖详情</view>
						</view>
					</view>
				</view> -->
					<view class="styleFour" v-for="(item,index) in listData" :key="index" @click="toLotterDetail(item.to_path)">
						<view v-if="!!item.stores">
							<view class="headTitle" v-if="item.stores.length>1">
								<swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000" :duration="1500" next-margin="-30rpx"
								 style="height: 50rpx;">
									<swiper-item style="display: table;height: 50rpx;" v-for="(ite,ind) in item.stores" :key="ind">
										<view class="storeContent">
											<view class="">
												<image class="storeLogo" :src="ite.cover" mode=""></image>
											</view>
											<view class="oneLine" style="line-height: 50rpx;width: 560rpx;">
												<text style="font-size: 16px;" >{{ite.name}}赞助</text>
											</view>
										</view>
									</swiper-item>
								</swiper>
							</view>
							<view class="headTitle" v-else>
								<view class="storeContent">
									<view class="">
										<image class="storeLogo" :src="item.stores[0].cover" mode=""></image>
									</view>
									<view class="oneLine" style="line-height: 50rpx;width: 560rpx;">
										<text style="font-size: 16px;" v-if="item.type!=5">{{item.stores[0].name}}赞助</text>
									</view>
								</view>
							</view>
						</view>
						
						<view class="" style="display: flex;">
							<view class="" style="margin-right: 20rpx;position: relative;">
								<view class="goodsImg" :style="{'background-image':'url('+ item.cover +')'}"></view>
								<view class="lotteryTips">
									<text v-if="item.type == 1">抽奖</text>
									<text v-if="item.type == 2">集赞</text>
								</view>
							</view>
							<view class="" style="display: flex;flex-direction: column;justify-content: space-between;">
								<view class="goodsTitle">
									<text class="peridos">{{item.tips}}</text>
									<!-- <text class="peridos" v-else>{{item.luck_tag}}</text> -->
									<!-- <text>【5店通用·小肥羊】68元抢100元无门槛现 金券，周末节假日通用，1个成人可免费携带一...</text> -->
									<text>{{item.title}}</text>
								</view>
								<view class="">
									<view class="flexContent" style="margin-bottom: 20rpx;width: 420rpx;">
										<view class="" v-if="item.type!=5">
											<!-- <text v-if="item.luck_mode === 1">{{item.luck_begin_time.splice(0,5)}}自动开奖</text> -->
											<!-- <text v-if="item.luck_mode === 1">{{item.luck_period_id==0 ? item.luck_begin_time.splice(0,5) : item.periods.lottery_time | timeChange}}自动开奖</text>
										<text v-if="item.luck_mode === 2">人数满{{item.luck_begin_number}}人自动开奖</text>
										<text v-if="item.luck_mode === 3">{{item.hand_text}}</text> -->
											<text >{{item.sub_title}}</text>
										</view>
										<view class="" v-if="item.type==5" style="font-size: 24rpx;color: #CCCCCC;">
											<text >差<text style="color: #FF9F9F;">{{item.surplus_num}}</text>人免单</text>
											</view>
										<view class="" v-if="item.type!=5">
											<text>{{item.num}}</text>
										</view>
									</view>
									<view class="flexContent">
										<view class="" style="color: #FF4444;">
											<view v-if="item.type!=5">
												<text>价值￥</text><text style="font-size: 18px;font-weight:bold;">{{item.price}}</text>
											</view>
											<view v-else>
												<text>￥</text>
												<text style="font-size: 18px;font-weight:bold;">{{item.price}}</text>
												<text style="margin-left: 10rpx; font-size: 24rpxpx;font-weight:bold;text-decoration:line-through;color: #999999;line-height: 13rpx;">{{item.line_price}}</text>
											</view>
											
										</view>
										<view class="">
											<view class="freeBtn" v-for="(textItem,textIndex) in item.status_text" :Key="textIndex" >
												<view v-if="item.type==5" >
													<view v-if="item.status==2">
														<text>{{item.tips}}成功</text>
													</view>
													<view v-else>
														<button @click.stop="handshareBtn(item.type,item)" size="mini" style="background:#FFD940;">{{textItem.txt}}</button>
											
													</view>
												</view>
												<view v-else :style="{'background-color':textItem.bg_color,'color':textItem.color}">
												<text >{{textItem.txt}}</text>
												</view>
											</view>

										</view>
										
									</view>
								</view>
							</view>
						</view>
					</view>
					
					
					
					
					<load-more :showLoadmore="!isMore"></load-more>
				</scroll-view>
			</view>
			<!-- <voucher></voucher> -->
			<page-loading ref="loading"></page-loading>
		</view>
		<!-- 底部按钮 -->
		<view class="btnWrap">
			<view class="homeBtn dis-flex flex-dir-column flex-x-center" @click="navigationTo('pages/mainPages/index/index')">
				<view class=" imgBox">
					<!-- <image class="iconBtn" src="/static/images/user/client.png" mode=""></image> -->
					<u-icon size="35" name="home"></u-icon>
				</view>
				<view class="">
					<text>首页</text>
				</view>
			</view>
			<view class="homeBtn dis-flex flex-dir-column flex-x-center" @click="serviceBtn">
				<view class="imgBox">
					<u-icon size="35" name="server-fill"></u-icon>
				</view>
				<view class="">
					<text>客服</text>
				</view>
			</view>
		</view>
		<PopupView :show='isShow' type='top' @clickmask='isShow=false'>
			<view class="">
				<!-- <image src="../../../static/h5/share.png" mode="" style="width: 640rpx;"></image> -->
				<image src="../../../../static/h5/share.png" mode="" style="width: 640rpx;"></image>
			</view>
		</PopupView>
		<!-- H5分享蒙层 -->
		<!-- #ifdef H5 -->
		<share-guide ref="shareGuide"></share-guide>
		<!-- #endif -->
		<!-- H5分享蒙层 end -->
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import PageNavBar from "@/components/template/PageNavBar2.vue"
	import LoadMore from "@/components/template/Loadmore.vue";
	import PopupView from '@/components/template/PopManager.vue'
	import pageShare from "@/common/js/pageShareMixin.js"
	import ShareView from "@/components/template/ShareView.vue"
	// import Voucher from "@/components/template/Voucher.vue";
	export default {
		mixins: [pageShare],
		data() {
			return {
				cardUseDesc:false,
				dataType: 0, 
				page: 1,
				scroll_Top: 0,
				activityName: '活动筛选',
				scrollHeight: null,
				last_page: null,
				isMore: true,
				isShow:false,
				showSelect: false,
				listData: [],
				shareSetting: {},
				activityList: [], //活动列表数据
				listDataApi: '',
				selectItemActive: 0,
				navList: [],
				afdata:{},
			};
		},
	
		async onLoad(options) {
			// 自定义分享
			await this.getNavList()
			await this.share()
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff"
			});
			// type = 1 时是点赞详情页跳转到此页面的我的集赞
			if (options.type == 1) {
				// this.dataType = 1
				// this.listDataApi = 'praise.Praise/myPraise'
				this.navList.forEach((item,index) => {
					console.log('parise==============')
					if(item.key == 'praise') {
						this.listDataApi = item.api
						this.dataType = index
					}
				})
			} else if (options.type == 3) { 
				// this.dataType = 2
				// this.listDataApi = 'blessing.blessing/myBlessing'
				this.navList.forEach((item,index) => {
					if(item.key == 'blessing') {
						this.listDataApi = item.api
						this.dataType = index
					}
				})
			}
			this.getLotterList();
		},
		onShow() {
		},
		watch: {
			
		},
		computed: {
			luck_mode() {
				return function(itemRow) {
					// 人数满{{item.luck_begin_number}}人自动开奖
					let luck_mode_msg = '';
					const {
						luck_mode,
						luck_begin_number,
						luck_begin_time
					} = itemRow;
					switch (luck_mode) {
						case 1:
							luck_mode_msg = `${luck_begin_time} 自动开奖`
							break;
						case 2:
							luck_mode_msg = `人数满${luck_begin_number}人自动开奖`;
							break;
						case 3:
							luck_mode_msg = `手动开奖`;
							break;
					}
					return luck_mode_msg
				}
			},
			// prize_state() {
			// 	const stateMap = {
			// 		0: '',
			// 		1: 1,
			// 		2: 2,
			// 		3: 3,
			// 	}
			// 	return stateMap[this.dataType]
			// }
		},
		components: {
			PageNavBar,
			LoadMore,
			PopupView,
			ShareView,
			// Voucher
		},
		mounted() {
			App.showLoading();
			this.scorllHeight();

		},
		filters: {
			//时间戳转换
			timeChange: function(value) {
				// return this.$util.formatTime(times,normal," ")
				var time = new Date(value * 1000);
				var y = time.getFullYear();
				var m = time.getMonth() + 1;
				var d = time.getDate();
				var h = time.getHours();
				var mm = time.getMinutes();
				var s = time.getSeconds();
				return m + '月' + d + '日' + ' ' + h + ':' + mm;
			},
		},
		methods: {
			close() {
				this.cardUseDesc = false
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
			hangderbtn(){
				// #ifdef H5
					this.shareBtn()
				// #endif
			},
			handshareBtn(type,item){
				console.log("dddddfdsfsdfdsfds",item)
				if(type==5){
					// this.showBanner()
					
					if(item.is_goods==1){
						url: "pages/subPages/goods/index/index?" + App.urlEncode({
							goods_id: item.goods_id,
							free_id: item.free_id,
							referee_id:item.user?item.user.user_id:'',
						})
					}else{
						url: "pages/subPages/card/createOrder?" + App.urlEncode({
							free_id: item.free_id,
							referee_id:item.user?item.user.user_id:'',
							card_id:item.card_id,
						})
					}
					this.cardUseDesc = true
					console.log("4444444444",item)
					
					this.shareData = this.pageShareMixin_createShareData({
						url:item.is_goods==1?'/pages/subPages/goods/index/index':'pages/subPages/card/createOrder',
						imgUrl: this.$util.deepGet(item,'cover',''),
						desc: this.$util.deepGet(item,'',''),
						title: this.$util.deepGet(item,'title',''),
						query:{
							free_id: this.$util.deepGet(item, 'free_id', ''),
							card_id:this.$util.deepGet(item, 'card_id', ''),
							goods_id:this.$util.deepGet(item, 'goods_id', ''),
						}
					})
				
				}
				
			},
			homeBtn() {

				let urls = App.getTabBarLinks(),
					url = "/" + urls[0];
				uni.reLaunch({
					url
				});
			},
			async getNavList() {
				try {
					const res = await App._postP('setting/getPlugins')
					this.listDataApi = res.data[0].api
					this.navList = res.data.map((item,index) => {
						item.title = item.value
						item.id = index
						return item
					})
				}catch(e) {
					console.log(e)
				}
			},
			share() {
				// try {
				// 	const res = await App._getP('setting/index')
				// 	let share = res.data.share,
				// 		clientType = App.getClientType(),
				// 		imgurl = clientType == 4 ? share.app_share_image[0].file_path : share.wechat_share_image[0].file_path,
				// 		shareImg = {
				// 			file_path: imgurl
				// 		}
				// 	this.shareSetting = {
				// 		title: share.share_title,
				// 		describe: share.share_describe,
				// 		cover_image: [shareImg]
				// 	}
				// 	console.log(this.shareSetting,'分享设置信息')
				// }catch(e) {
				// 	console.log(e)
				// }






				App._get("setting/index", {}, res => {
					let share = res.data.share,
						clientType = App.getClientType(),
						app_share_image = share && share.app_share_image && share.app_share_image[0] && share.app_share_image[0].file_path,
						wechat_share_image = share && share.wechat_share_image && share.wechat_share_image[0] && share.wechat_share_image[
							0].file_path

					// #ifdef H5
					this.shareData = this.pageShareMixin_createShareData({
						title: share.share_title,
						desc: share.share_describe,
						imgUrl: wechat_share_image
					})
					// #endif
					// #ifdef MP
					this.shareData = this.pageShareMixin_createShareData({
						title: share.share_title,
						imgUrl: app_share_image
					})
					// #endif

					console.log(app_share_image, '分享设置信息')
				})
			},
			serviceBtn() {
				App.navigationTo({
					url: 'pages/subPages/user/service'
				})
			},
			toLotterDetail(item) {
				App.navigationTo({
					url: item

				});

			},
			scorllHeight() {
				let _this = this;
				uni.getSystemInfo({
					success: function(res) {
						_this.setData({
							scrollHeight: res.windowHeight - 55,
						});
					}
				});
			},
			getLotterList(params = {
				// prize_state: this.prize_state,
				page: this.page
			}, isGetMore) {
				let _this = this;
				App._get(this.listDataApi, params, function(result) {
					// console.log(result,"--------------------");
					// 初始化商品详情数据
					const {
						data: {
							per_page,
							last_page,
							data: listData = []
						}
					} = result;
					_this.listData = isGetMore ? [..._this.listData, ...listData] : listData;
					_this.last_page = last_page;
					console.log(listData,'listData===============')
					_this.isMore = listData.length == per_page;
					// _this.listData.map(item=>{
					// 	if(item.periods.length>0){
					// 		item.periods
					// 	}
					// })
					App.hideLoading(1000);
				}, (err) => {
					if (err.data.code === 0) {
						uni.navigateBack({
							delta: 1
						});
					}
					uni.hideLoading()
				});
			},
			onScrollBottom() {
				let _this = this;
				if (_this.page < _this.last_page) {
					_this.page += 1;
					_this.getLotterList({
						// prize_state: this.prize_state,
						page: this.page
					}, true);
				} else {
					_this.isMore = false
				}
			},
			/**
			 * 滑动高度 
			 */
			scrolly(e) {
				this.scroll_Top = e.detail.scrollTop;
			},
			expressType(item) {
				this.dataType = item.id;
				console.log(this.dataType);
				this.listDataApi = this.navList[this.dataType].api
				uni.showLoading({})
				this.page = 1;
				this.scroll_Top = 0;
				this.getLotterList();
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		overflow: hidden;
	}
  /* 弹出层形式的广告 */
    .uni-banner {
        width: 70%;
        position: absolute; 
		left: 0; 
		top: 0; 
		right: 0;
		 bottom: 0;
          margin:0 auto; 
        z-index: 99;
		
    }
    .uni-mask{
         z-index: 1;
        background: rgba(0, 0, 0, 0.6);
    }
	.bg-color {
		background-color: #FFD940;
	}

	

	.list-item .goods-image {
		width: 170upx;
		height: 170upx;
		background-size: 170upx 170upx;
		background-position: center;
		background-repeat: no-repeat;
		flex-shrink: 0;
		margin-right: 30upx;
	}

	.goods-detail .goods-title {
		line-height: 1.3em;
	}

	.goods-detail .win-text {
		color: #FE504F;
	}

	.go-draw-style {
		font-size: 24upx;
		color: #333333;
		width: 160upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
		background-color: rgb(255, 216, 66);
		border-radius: 40upx;

		&.active {
			background: rgba(204, 204, 204, 1);
			color: #ffffff;
		}
	}

	text {
		font-size: 28rpx;
	}

	.styleFour {
		.oneLine {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		background-color: #FFFFFF;
		padding: 20rpx;
		border-radius: 10rpx;
		margin: 16rpx;

		.storeLogo {
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			margin-right: 23rpx;
		}

		.goodsImg {
			width: 200rpx;
			height: 200rpx;
			border-radius: 8rpx;
			background-repeat: no-repeat;
			background-size: 100% 100%;
			background-position: center;
		}

		.flexContent {
			display: flex;
			justify-content: space-between;
			width: 100%;
		}

		.freeBtn {
			// background: rgba(255, 217, 64, 1);
			border-radius: 4px;
			padding: 0 12rpx 12rpx 12rpx;
			height: 40rpx;
			line-height: 52rpx;
			//color: #333333;
			margin-left: 14rpx;
		}

		.passBtn {
			border-radius: 4px;
			padding: 0 12rpx 12rpx 12rpx;
			height: 40rpx;
			color: #999999;
			background: rgba(237, 237, 237, 1);
			margin-left: 16rpx;
		}

		.lotteryTips {
			background: linear-gradient(50deg, rgba(251, 203, 23, 1) 0%, rgba(255, 234, 114, 1) 100%);
			border-radius: 4rpx 0rpx 16rpx 0rpx;
			padding: 0 13rpx;
			color: #743C02;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 3;
		}

		.headTitle {
			margin: 25rpx 0;
			height: 50rpx;

			overflow: hidden;
		}

		.storeContent {
			display: flex;
		}

		.peridos {
			background: rgba(246, 210, 70, 1);
			padding: 0 6rpx;
			margin-right: 10rpx;
			color: #333333;
			border-radius: 4rpx;
			font-size: 10px;
		}

		.goodsTitle {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		.bigTime {
			display: flex;
			justify-content: space-between;
			background: rgba(0, 0, 0, 0.5);
			color: #FFFFFF;
			padding: 0 21rpx;
			position: absolute;
			width: 639rpx;
			bottom: 8rpx;
			border-radius: 4rpx;
		}

		.contentWrap {
			padding: 21rpx;
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			height: 160rpx;
		}
	}

	.btnWrap {
		position: fixed;
		z-index: 3;
		bottom: 30rpx;
		left: 30rpx;
		display: flex;

		.homeBtn {
			text-align: center;
			width: 100rpx;
			height: 100rpx;
			background: rgba(255, 217, 64, 1);
			background: var(--theme-color);
			border-radius: 50%;
			color: #333333;
			margin-right: 30rpx;
			box-sizing: border-box;

		}

		.imgBox {
			//margin-top: 10rpx;
			margin-bottom: -10rpx;
		}

		.iconBtn {
			width: 32rpx;
			height: 32rpx;

		}

	}
</style>

