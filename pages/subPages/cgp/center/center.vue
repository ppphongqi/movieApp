<template>
	<view class="page" :style="themeColor">
		<!-- 返回按钮 -->
		<!-- #ifdef H5 || MP-WEIXIN || MP-TOUTIAO -->
		<view class="diy-navigator" :style="{'top':backBtnHeight+'px'}">
			<view class="return-btn" @click="returnBtn">
				<text class="iconfont icon-fanhuijiantou col-f"></text>
			</view>
		</view>
		<!-- #endif -->
		
		<view class="header-bg">
			<!-- <image src="/static/images/zhushoubg.png" mode="widthFix"></image> -->
			<image src="" class="main-bg-color" mode="widthFix"></image>
		</view>
		<view class="header-right f-24 twolist-hidden" style="width: 30%;">
			自提地址:{{regData.address}}
		</view>
		<view class="section">
			<view class="cancel-content p-left-right-30">
				<!-- 头部扫一扫 -->
				<view class="content-header b-f m-btm20 ">
					<view class="cancel-header t-c">
						<view class="cancel-logo">
							<image src="/static/images/saoma1.png" class="main-bg-color"  @click="scanningCode"></image>
						</view>
						<view class="col-3 f-28 m-btm40">扫一扫</view>
						<view class="dis-flex flex-x-center">
							<view class="dis-flex cancel-left flex-y-center flex-x-center" @click="getStock">
								<image src="/static/images/grouppurchase/chakanbeihuo.png"></image>
								<view class="f-24">查看备货</view>
							</view>
							<view class="dis-flex cancel-left flex-y-center flex-x-center">
								<view style="background: #EEEEEE;width: 2rpx; height: 50rpx;" class="m-left-right-30">
								</view>
							</view>
							<view class="dis-flex cancel-left flex-y-center flex-x-center" @click="isShare">
								<image :src="getImageRoot('72.png')" style="width: 35rpx; height: 35rpx;margin-right: 4rpx;"></image>
								<view class="f-24">分享社区</view>
							</view>
							<view class="dis-flex cancel-left flex-y-center flex-x-center">
								<view style="background: #EEEEEE;width: 2rpx; height: 50rpx;" class="m-left-right-30">
								</view>
							</view>
							<view class="dis-flex cancel-left flex-y-center flex-x-center" @click="delivery">
								<image src="/static/images/grouppurchase/chakantihuo.png"></image>
								<view class="f-24">查看提货</view>
							</view>

							<!-- <view class="dis-flex cancel-left flex-y-center flex-x-center">
								<view style="background: #EEEEEE;width: 2rpx; height: 50rpx;" class="m-left-right-30">
								</view>
							</view>
							<view class="dis-flex cancel-left flex-y-center flex-x-center">
								<image src="/static/images/grouppurchase/chakanbeihuo.png"></image>
								<view class="f-24">查看备货</view>
							</view> -->
						</view>
					</view>
				</view>
				<!-- 代理订单 -->
				<view class="b-f bor-radius-10rpx" style="padding: 20rpx;">
					<view class="f-30 f-w" style="color:rgba(51,51,51,1); font-family:PingFang SC;">代理订单</view>
					<view class=" dis-flex flex-y-center flex-x-between">
						<view class="content-content-left">
							<view class="content-content-a">
								<view class="f-30 ">{{regData.dl_order_info.sum_order_num}}</view>
								<view class="f-24 col-9 m-top12">总订单数</view>
							</view>
							<view class="content-content-a">
								<view class="f-30 ">{{regData.dl_order_info.sum_goods_num}}</view>
								<view class="f-24 col-9 m-top12">总商品数</view>
							</view>
						</view>
						<view class="content-content-left" style="border-right:2rpx solid #EEEEEE ;">
							<view class="content-content-a">
								<view class="f-30 ">{{regData.dl_order_info.zt_order_num}}</view>
								<view class="f-24 col-9 m-top12">已自提订单数</view>
							</view>
							<view class="content-content-a">
								<view class="f-30 ">{{regData.dl_order_info.nozt_order_num}}</view>
								<view class="f-24 col-9 m-top12">未自提订单数</view>
							</view>
						</view>

						<view class="content-content-left">
							<view class="content-content-a t-c">
								<view class="f-30">{{regData.dl_order_info.sum_money?regData.dl_order_info.sum_money:'0'}}</view>
								<view class="f-24 col-9 m-top12">总收益</view>
							</view>
							<view class="content-content-a">
								<navigator url="/pages/subPages/cgp/details/details">
									<view class="details f-24 ">查看详情</view>
								</navigator>

							</view>
						</view>
					</view>
				</view>
				<!-- 最新订单 -->
				<view class="b-f m-top20 bor-radius-10rpx">
					<view class="f-30 f-w" style="color:rgba(51,51,51,1);padding: 20rpx; font-family:PingFang SC;">最新订单</view>
					<view>
						<block v-if="regData.new_order.length">
							<view class="dis-flex m-top10 flex-y-center" v-for="(item,index) in regData.new_order" style="padding: 10rpx 20rpx 10rpx 20rpx;">
								<image :src="item.goods_img" style="width: 110rpx;height: 110rpx;border-radius: 10rpx;"></image>
								<view style="margin-left: 16rpx; width: 80%;">
									<view class="f-28 f-w">{{item.goods_name}}</view>
									<view class="dis-flex flex-x-between">
										<view class="f-24 col-9 m-right12">
											<view class="">佣金：{{item.reg_money}}</view>
											<view class="">下单时间：{{item.create_time}}</view>
										</view>
										<view class="f-24 col-9 ">数量：{{item.total_num}}</view>
									</view>
								</view>
							</view>
							<view class="f-24 col-9 dis-flex flex-x-center flex-y-center" style="padding: 30rpx;" @click="getMore">
								<text class="m-right12">查看更多</text>
								<text class="iconfont icon-unfold"></text>
							</view>
						</block>
						<block v-else>
							<view class="" style="font-size: 24rpx; margin: 20rpx; color: #999999;padding-bottom: 20rpx ;">暂无最新订单</view>
						</block>

					</view>
				</view>
				<!-- 我的资产 -->
				<view class="b-f m-top20 bor-radius-10rpx" style="padding: 20rpx;">
					<view class="f-30 f-w" style="color:rgba(51,51,51,1);">我的资产</view>
					<view class="content-content flex-y-center flex-x-between">
						<view class="content-content-left">
							<view class="content-content-a">
								<view class="f-30 ">{{regData.my_assets.yrz}}</view>
								<view class="f-24 col-9 m-top12">已入账(元)</view>
							</view>
							<view class="content-content-a">
								<view class="f-30 ">{{regData.my_assets.ytx}}</view>
								<view class="f-24 col-9 m-top12">已提现(元)</view>
							</view>
						</view>
						<view class="content-content-left" style="border-right:1px solid #EEEEEE;">
							<view class="content-content-a">
								<view class="f-30 ">{{regData.my_assets.wrz}}</view>
								<view class="f-24 col-9 m-top12">未入账(元)</view>
							</view>
							<view class="content-content-a">
								<view class="f-30 ">{{regData.my_assets.txz}}</view>
								<view class="f-24 col-9 m-top12">提现中(元)</view>
							</view>
						</view>

						<view class="content-content-left">
							<view class="content-content-a t-c">
								<view class="f-30 ">{{regData.my_assets.wtx?regData.my_assets.wtx:0}}</view>
								<view class="f-24 col-9 m-top12">可提现(元)</view>
							</view>
							<view class="content-content-a " @click="toWidthDraw">
								<view class="wallet f-24 main-bg-color auxiliary-color">我的钱包</view>
							</view>
						</view>
						
					</view>
				</view>
			</view>
		</view>
		<!-- 分享菜单 -->
		<share-view ref="shareView" :poster-type="'cgp'"></share-view>
		
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import ShareView from "@/components/template/ShareView.vue"
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	export default {
		mixins: [pageShareMixin],
		data() {
			return {
				regData: {
					dl_order_info: {
						sum_order_num: 0,
						sum_goods_num: 0,
						zt_order_num: 0,
						nozt_order_num: 0,
						sum_money: 0,
					},
					my_assets: {
						yrz: 0,
						wrz: 0,
						ytx: 0,
						wtx: 0,
						zzc: 0,
					},
					new_order: []
				}

			};
		},
		components: {
			ShareView
		},
		computed: {

		},
		watch: {
			settingData: {
				handler(val) {
					console.log('哈哈哈哈哈哈哈哈',val)
					this.shareData = this.pageShareMixin_createShareData({
						title: this.$util.deepGet(val, 'cgp.share_title'),
						desc: this.$util.deepGet(val, 'cgp.share_text', ''),
						imgUrl: this.$util.deepGet(val, 'cgp.share_image', '')
					})
				},
				immediate: true
			}
		},
		onLoad(options) {

		},
		onShow() {
			this.getLeaderData()

		},
		mounted() {

		},
		methods: {
	
			/**
			 * 返回按钮
			 */
			returnBtn(e) {
				let pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack({
						delta: 1
					})
				} else {
					let url = "/pages/mainPages/index/index";
					// #ifdef H5
					url += "?i=" + App.getUniacid();
					// #endif
					uni.reLaunch({
						url
					});
				}
			},
			/**
			 * 底部菜单按钮跳转
			 */
			footerNav(item = {}) {
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
					this.isShare("share");
					return
				}else if (type === "cart") {
					url = "pages/subPages/flow/index";
					// #ifdef H5
					url += "?i=" + App.getUniacid();
					// #endif
					uni.reLaunch({
						url: "/" + url
					});
					return;
				}
				App.navigationTo({
					url
				});
			},
	
			getLeaderData() {
				App._post_form('cgp.Reg/regCore', {}, res => {
					const data = res.data || []
					if(data.code === 0) {
						App.showError(res.msg, options => {
							App.hideLoading()
							if (options.confirm) {
							    App.navigationTo({
									url: 'pages/subPages/cgp/regimental/regimental',
									redirectTo: true
								})
							}
						})
					} else {
						this.regData = res.data
					}
	
				})
			},
			scanningCode() {
				// let _this = this
				// App.scanCode({complete(res) {
				// 	let {result} = res,
				// 	[siteInfo,url]=result.split("#")
				// 	App.navigationTo({
				// 		url
				// 	})

				// }})


				let _this = this,
					clientType = App.getClientType();
				App.scanCode({
					complete(res) {
						console.log(res);
						let isScanCode = clientType === "4" ? (res.errMsg === "scanQRCode:ok") : (res.errMsg === "scanCode:ok");
						if (isScanCode) {
							let Base64 = new _this.$util.Base64(),
								result = res[clientType === "4" ? "resultStr" : res.scanType === "QR_CODE" ? "result" : "path"],
								isSceneQR = result.indexOf("scene") !== -1, //是否小程序码
								isHttpUrl = result.indexOf("http") !== -1; //是否二维码
							if (isSceneQR) { //扫小程序码
								let params = _this.$util.getParams("scene", decodeURIComponent(result), true);
								params = _this.$util.scene_decode(params);
								let {
									a: order_id = "",
									b: user_id = ""
								} = params;
								result = {
									order_id,
									user_id
								}
							} else if (isHttpUrl && !isSceneQR) { //扫二维码

								let [
									order_id = "",
									user_id = ""
								] = ["order_id", "user_id"].map(val => {
									return _this.$util.getParams(val, decodeURIComponent(result), true) || "";
								});
								result = {
									order_id,
									user_id
								}
							} else {
								result = JSON.parse(result)
							}
							const {
								order_id = '',
									user_id = ''
							} = result;
							App.navigationTo({
								url: `pages/subPages/cgp/selectgoods/selectgoods?user_id=${user_id}&order_id=${order_id}`,
							})
						}

					}
				});
			},
			getMore() {
				App.navigationTo({
					url: "pages/subPages/cgp/details/details"
				});
			},
			toWidthDraw() {
				App.navigationTo({
					url: "pages/subPages/withdraw/store/store?state=leader"
				});
			},
			getStock() {
				App.navigationTo({
					url: "pages/subPages/cgp/stock/stock"
				});
			},
			delivery() {
				App.navigationTo({
					url: "pages/subPages/cgp/goods/goods"
				});
			},
			isShare(){
				// #ifndef MP-TOUTIAO || MP-ALIPAY
				this.$refs.shareView.shareswich();
				// #endif
			}
		},
		onPullDownRefresh() {
			 this.getLeaderData()
			 setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
		},
	}
</script>

<style lang="scss" scoped>
	$statistics-border: #cccccc;
	.diy-navigator {
		position: fixed;
		left: 0;
		right: 0;
		padding: 0 20rpx;
		height: 88rpx;
		z-index: 100;
	}
	.return-btn {
		position: absolute;
		left: 20rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50%;
		text-align: center;
		background-color: rgba(0, 0, 0, .5);
		z-index: 50;
	}
	.return-btn text {
		position: relative;
		left: 10%;
	}
	.header-bg image {
		width: 100%;
		margin-top: -2upx;
		height: 265rpx;
		border-radius: 0 0 40rpx 40rpx;
	}

	.header-right {
		position: relative;
		bottom: 250rpx;
		right: -520rpx;
	}

	.cancel-data {
		border-radius: 10upx;

		.cancel-title {
			font-size: 30upx;
			color: #333333;
			padding: 0 40upx 40upx;
		}
	}

	.section {
		position: relative;
		top: -160upx;
	}

	.content-header {
		height: 280upx;
		border-radius: 10rpx;
	}

	.cancel-logo {
		position: relative;

		image {
			width: 176upx;
			height: 176upx;
			border-radius: 50%;
			border:10rpx solid #fff;
		}
	}

	.cancel-left {
		image {
			width: 50rpx;
			height: 50rpx;
		}
	}

	.cancel-header,
	.cancel-main {
		position: relative;
		top: -86upx;
	}

	.content-content {
		display: flex;
	}

	.content-content-left {
		// margin-right: 55rpx;
		width: 333.3%;
	}

	.content-content-a {
		padding: 10rpx;
	}

	.details {
		padding: 15rpx;
		text-align: center;
		border-radius: 10rpx;
		background: #FFFFFF;
		border: 1rpx solid #EEEEEE;
	}

	.wallet {
		background: #FFD940;
		border-radius: 10rpx;
		text-align: center;
		padding: 20rpx;
	}
</style>
