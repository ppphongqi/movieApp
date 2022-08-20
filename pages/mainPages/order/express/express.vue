<template>
	<view :style="themeColor">
		<view class="page padding-box" v-if="isShow">
			<view class="header b-f m-top-btm20 bor-radius-10">
				<view class="goods_detail dis-flex m-btm20" v-for="(items,index) in goodsData" :key="index">
					<view class="goods_image" :style="'background-image:url('+items.image.file_path+')'"></view>
					<view class="goods_text dis-flex flex-dir-column flex-x-between">
						<view class="f-28 col-3 m-btm20">{{items.goods_name}}</view>
						<view>
							<view class="f-24 col-9 m-btm10">订单编号：{{loggDataDetail.expressage}}</view>
							<view class="f-24 col-9">物流：{{loggDataDetail.expressName}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="logis bor-radius-10 b-f m-btm20">
				<view class="p-left-right-30">
					<view class="logis-title p-top-bom-30 col-9 f-24">订单跟踪</view>
					<view class="logis-list p-top-bom-40">
						<view class="logis-list-header">
							<view class="dis-flex flex-y-center">
								<view class="logis-date f-24 col-3">
								</view>
								<view class="Icon-bg">
									<view class="icon-line iconfont icon-check col-9"></view>
								</view>
								<view class="address flex-box col-9 f-24">收货地址：{{loggDataDetail.address}}</view>
							</view>
						</view>
						<view class="loggis-section">
							<view v-for="(items,index) in loggDataList" :key="index">
								<view class="loggis-move">
									<view class="dis-flex flex-y-center">
										<view class="logis-date f-24 col-3">
											<view>{{items.year}}</view>
											<view class="pd-left">{{items.date}}</view>
										</view>
										<view class="Icon-bg Icon-bg-presen" v-if="items.curlogg">
											<view class="icon-line iconfont icon-kuaidi col-3"></view>
										</view>
										<view class="circle-seg" v-if="!items.curlogg"></view>
										<view class="address flex-box col-9 f-24">{{items.AcceptStation}}</view>
									</view>
								</view>
								<view class="logg-dotted"></view>
							</view>
						</view>
						<view class="logis-list-footer">
							<view class="dis-flex flex-y-center">
								<view class="logis-date f-24 col-3">
									<view>{{loggDataDetail.place_year}}</view>
									<view class="pd-left">{{loggDataDetail.place_date}}</view>
								</view>
								<view class="Icon-bg">
									<view class="icon-line iconfont icon-formfill col-9 f-22"></view>
								</view>
								<view class="address flex-box col-9 f-24">已下单</view>
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
	import App from "@/common/js/app.js";
	export default {
		data() {
			return {
				order_id: null,
				loggDataList: [], // 物流信息列表
				goodsData: [], // 商品信息列表
				isShow: false,
				loggDataDetail: {}
			}
		},
		components: {

		},
		computed: {

		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			App.showLoading()
			this.order_id = options.order_id;
		},
		onShow() {

		},
		mounted() {
			this.getlogDetail(this.order_id)
		},
		methods: {
			getlogDetail(order_id) {
				let that = this;
				App._get('user.order/express', {
					order_id
				}, (result) => {
					if (result.code === 1) {
						let Data = result.data.express,
							loggDataList = Data.Traces.map((val, index, array) => {
								val.year = val.AcceptTime.substring(5, 10);
								val.date = val.AcceptTime.substring(10, 16);
								val.curlogg = false;
								if (array[0]) {
									array[0].curlogg = true;
								};
								return val
							}),
							loggDataDetail = {
								'expressName': Data.expressName,
								'address': `${Data.address.region.province}${Data.address.region.city}${Data.address.region.region}${Data.address.detail}`,
								'expressage': Data.LogisticCode,
								'place_year':Data.time.substring(5, 10),
								'place_date':Data.time.substring(10, 16)
							};
						that.setData({
							loggDataList: loggDataList,
							goodsData: Data.goods,
							loggDataDetail: loggDataDetail,
							isShow: true
						});
					} else {
						if (result.code === 0) {
							App.showError(result.msg, () => {
								uni.navigateBack({
									delta: 1
								});
							});
						};
					}
				}, false, () => {
					App.hideLoading(1000);
				});
			}
		}
	}
</script>

<style>
	/**
	 * 头部
	 */
	.header {
		padding: 46upx 30upx 40upx;
	}

	.goods_detail .goods_image {
		margin-right: 28upx;
		width: 170upx;
		height: 170upx;
		border-radius: 6upx;
		background-repeat: no-repeat;
		background-size: 170upx 170upx;
		background-position: center;
	}

	/**
	 * 订单物流
	 */
	.logis-title {
		border-bottom: 1px solid #F0F0F0;
	}

	.logis-list .logis-date {
		width: 68upx;
		word-wrap: break-word;
		word-break: normal;
		line-height: 30upx;
	}

	.Icon-bg {
		width: 50upx;
		height: 50upx;
		line-height: 46upx;
		border-radius: 50%;
		background: #F0F0F0;
		text-align: center;
		margin: 0 24upx;
	}

	.icon-line {
		font-size: 28upx !important;
	}

	.loggis-move .address {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
	}

	.logis-list-header::after {
		content: " ";
		position: relative;
		left: 18%;
		width: 2upx;
		height: 80upx;
		border-left: 1px dashed rgba(204, 204, 204, 1);
	}
	.pd-left{
		padding-left :6%;
	}
	.logg-dotted {
		position: relative;
		left: 18%;
		width: 2upx;
		height: 80upx;
		border-left: 1px dashed rgba(204, 204, 204, 1);
	}

	.circle-seg {
		width: 18upx;
		height: 18upx;
		border-radius: 50%;
		background: #F0F0F0;
		margin: 0 40upx;
	}

	.Icon-bg-presen {
		background-color: #FFD940;
		color: #333333 !important;
	}
</style>
