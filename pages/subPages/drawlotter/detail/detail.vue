<template>
	<view class="page-container" :style="themeColor">
		<view class="confirm-container" v-if="!!detail" :style="{'background-image':getImageRoot('3.png','url')}">
			<view class="confirm-hd dis-flex flex-dir-column flex-y-center flex-x-center">
				<view class="group-goods-box">
					<view class="group-goods padding-box" style="padding-top: 30upx;padding-bottom:15upx;">
						<view class="goods-list dis-flex flex-dir-row flex-x-between flex-y-center border-line">
							<view class="img-logo">
								<image class="goods-img" :src="detail.luck_detail.image[0]['file_path']" mode=""></image>
							</view>
							<view class="goods-info" style="width: 0;flex-grow: 1;">
								<view class="title twolist-hidden">
									{{detail.luck_detail.luck_title}}
								</view>
								<view class="desc dis-flex flex-dir-column">
									<view class="dis-flex flex-dir-row flex-y-center" style="margin: 10upx 0;">
										<text class="num">中奖数: {{detail.luck_detail.luck_count}}份</text>
									</view>
									<view class="price dis-flex flex-dir-row flex-x-between">
										<text v-if="detail.luck_detail['luck_mode'] === 1" class="old">{{detail.luck_detail.luck_begin_time}}自动开奖</text>
										<text v-if="detail.luck_detail['luck_mode'] === 2" class="old">人数满{{detail.luck_detail.luck_begin_number}}人自动开奖</text>
										<text v-if="detail.luck_detail['luck_mode'] === 3" class="old">手动开奖</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="confirm-line dis-flex flex-dir-row flex-y-center">
				<view class="semicircle left"></view>
				<view class="semicircle-line flex-box"></view>
				<view class="semicircle right"></view>
			</view>
			<!-- active -->
			<view class="confirm-bd dis-flex flex-dir-column flex-x-center flex-y-center" :class="{'active': !!detail && detail.qrcode.surplus_number == 0}">
				<!-- <image v-if="isGetEnd && !!detail" class="checked-tip" src="../../../../static/images/order/checked.png"></image> -->
				<view class="iconfont icon-back" :class="{'disabled':codeCurrent === 0}" v-if="swiperList.length>1" @click="swiperSwitch('previous')"></view>
				<swiper class="qr-swiper" @change="swiperChange" :current="codeCurrent">
					<swiper-item class="t-c p-r" v-for="(item,index) in swiperList" :key="index">
						<image :src="`/static/images/order/${item.is_get === 1?'checked':'expired'}.png`" class="confirm-status" v-if="item.is_get === 1 || item.is_no === 2"></image>
						<!-- #ifdef H5 -->
						<image class="qr-code" :class="{'checked':item.is_get===1 || item.is_no === 2}" :src="'data:image/png;base64,'+item.qrcode" mode="aspectFit"></image>
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<image class="qr-code" :class="{'checked':item.is_get===1 || item.is_no === 2}" :src="item.qrcode" mode="aspectFit"></image>
						<!-- #endif -->
					</swiper-item>
				</swiper>
				<view class="iconfont icon-right" :class="{'disabled':codeCurrent === swiperList.length -1}" v-if="swiperList.length>1"
				 @click="swiperSwitch('next')"></view>
				<!-- <view class="confirm-code-number" v-if="!!detail">可核销<text>{{detail.qrcode.sum_number}}</text>次,剩余<text>{{detail.qrcode.surplus_number}}</text>次</view> -->
				<view class="confirm-code-number">{{swiperList[codeCurrent]?swiperList[codeCurrent].prize_title:""}}</view>
				<view class="confirm-time-list">
					<view class="confirm-time-item dis-flex flex-y-center f-26 col-3">
						<view class="confirm-time-label">出示以上二维码，到对应门店进行核销</view>
					</view>
				</view>
				<!-- <button class="confirm-btn" v-if="detail.express_type === 3" :disabled="check_code_num === 0" @click="selfCheck">自助核销</button> -->
			</view>
			<view class="confirm-line dis-flex flex-dir-row flex-y-center">
				<view class="semicircle left"></view>
				<view class="semicircle-line flex-box"></view>
				<view class="semicircle right"></view>
			</view>
			<view class="confirm-ft">
				<view class="confirm-need">
					<view class="confirm-need-know" v-if="!!detail && detail.hit_detail.hit.length > 0">
						<text>中奖商品</text>
						<view class="line"></view>
					</view>
					<view v-if="!!detail && (detail.hit_detail.length === 0 || detail.hit_detail.hit.length === 0)" style="font-size:26upx;color: #999999;text-align: center;">
						<text>没有更多中奖信息了~</text>
					</view>
				</view>
				<view class="confirm-store">
					<!-- <view class="confirm-ft-title dis-flex flex-y-center flex-x-between">
						<text>商家信息</text>
						<button @click="moreStore(detail.bus_id)">更多分店</button>
					</view> -->
					<view class="confirm-store-info" v-if="Array.isArray($prize)" v-for="(prize,index) in $prize" :key="index">
						<view class="store-detail dis-flex flex-y-center flex-x-between">
							<view class="store-detail-left flex-box dis-flex flex-y-center flex-x-between">
								<view class="store-info">
									<view class="store-name f-26">{{prize.prize_title}}</view>
								</view>
							</view>
							<view class="store-detail-right" :class="{'get-over': prize.is_get == 1}" @click="moreStore(prize.business_id, prize.prize_id,prize.is_get)">
								<view v-if="prize.is_get == 2" class="col-9 dis-flex flex-x-center flex-y-center">
									<text class="f-26">去领取</text><text class="iconfont icon-jinrujiantou"></text>
								</view>
								<view v-if="prize.is_get == 1" class="col-9 dis-flex flex-x-center flex-y-center">
									<text class="f-26" style="color: #999999;">已领取</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				isGetEnd: false,
				codeCurrent: 0,
				luck_id: "",
				detail: null,
				store: null,
				codeList: null,
				code_path: null,
				check_code_num: 0
			};
		},
		components: {

		},
		computed: {
			$prize() {
				return !!this.detail && this.detail.hit_detail.hit
			},
			checkData() {
				if (!!this.detail && this.detail.express_type === 3) {
					return this.codeList[this.codeCurrent];
				}
			},
			swiperList() {
				if (!!this.detail) {
					const {
						qrcode
					} = this.detail;
					return qrcode
				}
			},
			confirmStatusImg() {
				if (!!this.detail && this.detail.express_type === 2) {
					return `/static/images/order/self.png`
				} else {
					if (this.checkData && this.checkData.check_status !== "0") {
						return `/static/images/order/${this.checkData.check_status == "1" ? "checked" : "refund"}.png`
					}
				}

			}
		},
		beforeCreate() {},
		onLoad(options) {
			App.showLoading();
			this.luck_id = options.luck_id;
		},
		onShow() {
			this.getLotterInfo(this.luck_id);
		},
		methods: {
			/**
			 * 获取订单信息
			 */
			getLotterInfo(luck_id) {
				let _this = this,
					requestList = ["luck.luck/prizeDetail"].map(val => {
						return new Promise((resolve, reject) => {
							App._get(val, {
								luck_id
							}, res => {
								resolve(res.data);
							});
						})
					})
				Promise.all(requestList).then(optinos => {
					let [lotterInfo] = optinos;
					_this.detail = lotterInfo;
					_this.isGetEnd = true;
					App.hideLoading(1000);
				})
			},

			/**
			 * 更多门店
			 */
			moreStore(bus_id, prize_id, is_get) {
				if (is_get == '2') {
					App.navigationTo({
						url: `pages/subPages/store/list?bus_id=${bus_id}&prize_id=${prize_id}`
					})
				}
			},

			/**
			 * 门店电话
			 */
			callStore(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber
				})
			},
			/**
			 * 门店定位
			 */
			// storeLocation(latitude, longitude, address) {
			// 	@click="storeLocation(store.lat,store.lng,store.address)"
			// 	if (latitude && longitude) {
			// 		uni.openLocation({
			// 			address,
			// 			latitude,
			// 			longitude
			// 		})
			// 	} else {
			// 		App.showError("门店位置参数错误");
			// 	}
			// },

			/**
			 * 核销码切换
			 */
			swiperChange(e) {
				this.codeCurrent = e.detail.current;
			},
			swiperSwitch(type) {
				if (type === "previous") {
					(this.codeCurrent !== 0) && --this.codeCurrent
				} else if (type === "next") {
					(this.codeCurrent !== this.swiperList.length - 1) && ++this.codeCurrent
				}
			},

			/**
			 * 自助核销
			 */
			selfCheck() {
				App.navigationTo({
					url: "pages/mainPages/order/selfcancel?order_type=user&order_id=" + this.order_id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgb(255, 217, 64);
		overflow-y: auto;
		overflow-x: hidden;
	}

	.confirm-container {
		padding: 80upx 30upx 30upx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.confirm-hd {
		background: #FFFFFF;
		border-radius: 18upx 18upx 0 0;
	}

	.confirm-name {
		margin-top: 12upx;
	}

	.confirm-line {
		height: 34upx;
		overflow: hidden;
	}

	.confirm-line view {
		height: 34upx;
	}

	.semicircle {
		width: 34upx;
		height: 34upx;
		background: radial-gradient(transparent 0, transparent 50%, #FFFFFF 50%);
	}

	.semicircle.left {
		margin-left: -17upx;
	}

	.semicircle.right {
		margin-right: -17upx;
	}

	.confirm-line view.semicircle-line {
		background: #FFFFFF;
		position: relative;
	}

	.semicircle-line::after {
		content: " ";
		position: absolute;
		top: calc(50% - 1upx);
		left: 0;
		right: 0;
		transform: scaleY(0.5);
		height: 2upx;
		background-image: linear-gradient(to right, #FFD52C 0%, #FFD52C 50%, transparent 50%);
		background-size: 24upx 2upx;
		background-repeat: repeat-x;
	}

	.confirm-bd {
		background: #FFFFFF;
		padding: 0 0 35upx;
		position: relative;

		.checked-tip {
			display: none;
			position: absolute;
			width: 109upx;
			height: 92upx;
			right: 80upx;
			top: 50upx;
			z-index: 11;
		}

		&.active {
			.checked-tip {
				display: inline-block;
			}

			.qr-swiper:after {
				content: '';
				position: absolute;
				display: inline-block;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				background: rgba(255, 255, 255, .6);
			}
		}
	}

	.confirm-bd .confirm-status {
		width: 119upx;
		height: 102upx;
		display: block;
		position: absolute;
		top: 10upx;
		right: 62upx;
		transform: scale(1.2);
	}

	.confirm-bd .qr-swiper {
		width: 100%;
		height: 400upx !important;
		position: relative;
		z-index: 10;
	}

	.confirm-bd .iconfont {
		position: absolute;
		top: 22%;
		font-size: 52upx;
		color: #333333;
		z-index: 15;
	}

	.confirm-bd .iconfont.disabled {
		color: #999999;
	}

	.confirm-bd .iconfont.icon-back {
		left: 20upx;
	}

	.confirm-bd .iconfont.icon-right {
		right: 20upx;
	}

	.confirm-bd .qr-code {
		width: 270upx;
		height: 270upx;
		border-radius: 15upx;
		display: inline-block;
		margin-top: 65upx;
	}

	.confirm-bd .qr-code.checked {
		opacity: .5;
	}

	.confirm-bd .confirm-code-number {
		font-size: 30upx;
		font-weight: bold;
		margin: 0 0 35upx;

		text {
			color: #FE504F;
		}
	}

	.confirm-time-item {
		color: rgb(153, 153, 153);
		margin-bottom: 20upx;
	}

	.confirm-time-value {
		padding-left: 12upx;
	}

	.confirm-btn {
		width: 330upx;
		height: 74upx;
		font-size: 30upx;
		line-height: 74upx;
		background: #FFD940;
		margin-top: 40upx;
		border-radius: 50upx;
	}

	.confirm-ft {
		background: #FFFFFF;
		border-radius: 0 0 18upx 18upx;
	}

	.confirm-need {
		padding: 18upx 0;
		background: #FFFFFF;
		margin: 0 30upx;
	}

	.confirm-ft-title {
		font-size: 28upx;
		padding-left: 16upx;
		position: relative;
	}

	.confirm-ft-title::after {
		content: " ";
		position: absolute;
		top: 50%;
		left: -4upx;
		transform: translateY(-50%);
		width: 8upx;
		height: 30upx;
		background: #FED83F;
		border-radius: 20upx;
	}

	.confirm-need-know {
		position: relative;
		font-size: 30upx;
		font-weight: 600;
		text-align: center;
		line-height: 2em;

		.line {
			display: inline-block;
			height: 10upx;
			width: 150upx;
			background: #ffd940;
		}

		text {
			position: absolute;
			z-index: 2;
			left: 50%;
			transform: translateX(-50%);
		}
	}

	.confirm-store {
		padding: 0 30upx 30upx 30upx;
		background: #FFFFFF;
		border-radius: 0 0 18upx 18upx;
	}

	.confirm-ft-title button {
		border: 1upx solid #FFD940;
		font-size: 24upx;
		width: 160upx;
		height: 54upx;
		border-radius: 50upx;
		line-height: 54upx;
		color: #999999;
		background: #FFFFFF;
		margin: 0;
	}

	.confirm-store-info {
		margin-top: 20upx;
		margin-bottom: 20upx;
	}

	.confirm-store-info .iconfont.col-9 {
		font-size: 42upx;
	}

	.confirm-store-info .store-addres text.iconfont {
		display: inline-block;
		padding-right: 20upx;
		font-size: 26upx;
	}

	.store-detail {
		border: 1upx solid #EEEEEE;

		.store-detail-left {
			border-right: 1upx solid #EEEEEE;
			height: 120upx;
			padding: 30upx;
			box-sizing: border-box;
		}
	}

	.store-detail-right {
		margin-left: 20upx;
		padding-left: 20upx;
		padding-right: 20upx;

		&.get-over {
			width: 177upx;
			padding-left: 0;
			margin-left: 0;
			padding-right: 0;
		}

		.dis-flex {
			color: #FE504F;

			.iconfont {
				margin-right: 10upx;
				margin-left: -5upx;
			}
		}
	}

	.group-goods-box {
		width: 100%;
	}

	.group-goods {
		position: relative;
		z-index: 2;
	}

	.group-goods .goods-list .img-logo {
		position: relative;
		font-size: 0;
	}

	.group-goods .goods-list .img-logo .goods-img {
		width: 180upx;
		height: 180upx;
		border-radius: 10upx;
		margin-right: 28upx;
	}

	.group-goods .goods-info .title {
		color: #000000;
		font-size: 28upx;
		height: 80upx;
		font-weight: 400;
		line-height: 40upx;
	}

	.group-goods .goods-info .old {
		font-size: 24upx;
		color: #999999;
		align-self: flex-end;
	}

	.group-goods .goods-info .num {
		font-size: 24upx;
		color: #999999;
		width: 126upx;
		text-align: center;
		white-space: nowrap;
	}
</style>
