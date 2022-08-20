<template>
	<view class="" :style="themeColor">
		<block v-if="goodsList.length>0">
			<view class="container dis-flex flex-x-between flex-warp ">
				<view class="part">

					<view class="goodsItem m-top30" v-for="(item,index) in goodsList" :key='index' @click="navigationTo('pages/subPages/videoGoods/video?goods_id='+item.goods_id)"
					 v-if="index%2==0 ">
						<!-- <video :src="item.video.file_path" controls></video> -->
						<view class="">
							<view :class="'item'+index" style="position: relative;width: 100%;">
								<image :src="item.image[0].file_path" mode="widthFix" style="width: 100%;" class="image1" @load="imagesHeight($event,item,index)"></image>
								<image src="../../../static/images/diypage/video_play.png" mode="widthFix" :style="{'top':item.height+'rpx'}"
								 class="image2"></image>
							</view>
						</view>
						<view class="info">
							<view class="twolist-hidden f-28 col-3 f-w">{{item.goods_name}}</view>
							<view class="dis-flex flex-y-center m-top10">
								<view class="dis-flex flex-y-center" v-if="item.is_member_price=='1'">
									<view class="member-price-label f-22">会员</view>
									<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">{{settingData.currency}}<text class="member-coupon-price">{{item.sku[0].member_price}}</text></view>
								</view>
								<view class=" dis-flex flex-y-center f-20" v-if="isdealer && item.dealer_money>0" :class="{'m-left12':item.is_member_price==1}">
									<view class="dealer col-f">赚</view>
									<view class="money onelist-hidden">{{settingData.currency}}{{item.dealer_money}}</view>
								</view>
							</view>
							<view class="">
								<text class="col-f4 f-28 f-w">{{settingData.currency}}{{item.sku[0].goods_price}}</text>
								<text class="t-through m-left12 col-9 f-24">{{settingData.currency}}{{item.sku[0].line_price}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="part">
					<view class="goodsItem m-top30" v-for="(item,index) in goodsList" :key='index' @click="navigationTo('pages/subPages/videoGoods/video?goods_id='+item.goods_id)"
					 v-if="index%2==1 ">
						<!-- <video :src="item.video.file_path" controls></video> -->
						<view class="">
							<view :class="'item'+index" style="position: relative;width: 100%;">
								<image :src="item.image[0].file_path" mode="widthFix" style="width: 100%;" class="image1" @load="imagesHeight($event,item,index)"></image>
								<image src="../../../static/images/diypage/video_play.png" mode="widthFix" :style="{'top':item.height+'rpx'}"
								 class="image2"></image>
							</view>
						</view>
						<view class="info">
							<view class="twolist-hidden f-28 col-3 f-w">{{item.goods_name}}</view>
							<view class="dis-flex flex-y-center m-top10">
								<view class="dis-flex flex-y-center" v-if="item.is_member_price=='1'">
									<view class="member-price-label f-22">会员</view>
									<view class="f-22 col-f onelist-hidden b-0 coupon-price-2">{{settingData.currency}}
										<text class="member-coupon-price">{{item.sku[0].member_price}}</text>
									</view>
								</view>
								<view class=" dis-flex flex-y-center f-20" v-if="isdealer && item.dealer_money>0" :class="{'m-left12':item.is_member_price==1}">
									<view class="dealer col-f">赚</view>
									<view class="money onelist-hidden">{{settingData.currency}}{{item.dealer_money}}</view>
								</view>
							</view>
							<view class="">
								<text class="col-f4 f-28 f-w">{{settingData.currency}}{{item.sku[0].goods_price}}</text>
								<text class="t-through m-left12 col-9 f-24">{{settingData.currency}}{{item.sku[0].line_price}}</text>
							</view>
						</view>
					</view>
				</view>


				<load-more :showLoadmore="!showLoadmore"></load-more>
			</view>
		</block>
		<block v-else>
			<view class="dis-flex flex-dir-column flex-y-center m-top40">
				<image src="../../../static/images/no_content.png" mode="widthFix" style="width: 50%;"></image>
				<text class="f-28 col-6 ">没有相关视频</text>
			</view>
		</block>





		<page-loading ref="loading"></page-loading>
		<DiyTab></DiyTab>
	</view>
</template>

<script>
	import DiyTab from "@/components/template/TabBar.vue"
	import App from "@/common/js/app.js";
	import DiyVideo from "@/components/page/pageComponents/Video.vue"
	import LoadMore from "@/components/template/Loadmore.vue"
	
	export default {
		data() {
			return {
				showLoadmore: false,
				page: 1,
				lastpage: 1,
				goodsList: [],
				isdealer: false

			};
		},
		components: {
			DiyVideo,
			LoadMore,
			DiyTab
		},
		onShow() {
			this.goodsList=[]
			App.showLoading()
			this.getVideoGoodsList()
			this.getSettingIndex()
			App.customDefaultShare(this.globalSaveRefereeId,`${App.siteInfo.siteroot}h5/#/pages/subPages/videoGoods/videoGoods`)
		},

		onReachBottom() {
			this.page++
			if (this.page <= this.lastpage) {
				this.showLoadmore = true
				this.getVideoGoodsList()
			} else {
				this.showLoadmore = false
			}

		},
		methods: {
			imagesHeight(e, item, index) {
				index = '.item' + index
				let info = uni.createSelectorQuery().select(index),
					height = 0,
					_this = this;
				info.boundingClientRect(function(data) {
					height = data.height / 2
					_this.$set(item, 'height', height)
				}).exec()
				// height = height?height-30:120


			},
			getVideoGoodsList() {

				let _this = this
				App._post_form('videolist.Videolist/getVideoList', {
					page: this.page
				}, res => {
					let {
						data: {
							data: goodsList = [],
							last_page: last_page = 1
						}
					} = res;
					this.lastpage = last_page
					this.goodsList = this.goodsList.concat(goodsList)
					console.log(goodsList)
					this.$nextTick(result => {
						this.goodsList.forEach((item, index) => {
							let index1 = '.item' + index,
								info = uni.createSelectorQuery().select(index1),
								height = 0;
							info.boundingClientRect(heightdata => {
								height = heightdata.height
								height = height ? height - 30 : 120
								this.$set(item, 'height', height)
							}).exec()

						})

					})




				}, res => {}, res => {
					App.hideLoading()
				})
			},
			getSettingIndex() {
				App._post_form('setting/index', {}, res => {
					let {
						data: {
							dealer_basic: {
								is_open,
								user_diy
							}
						}
					} = res
					this.isdealer = is_open == 1 && user_diy == 1
				})
			}

		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		align-items: flex-start;
		margin-bottom: 150rpx;
	}

	.part {
		width: 48%;
	}

	.goodsItem {
		overflow: hidden;
		border-radius: 10rpx 10rpx 0 0;
		height: auto !important;

		video {
			width: 100%;
		}

		// overflow: hidden;
		width: 100%;
		background-color: #fff;

		.info {
			padding: 16rpx 20rpx;
			box-sizing: border-box;
		}

		.dealer {
			width: 30rpx;
			height: 30rpx;
			border-radius: 50%;
			background-color: #FF4444;
			line-height: 30rpx;
			text-align: center;
			z-index: 10;

		}

		.money {
			// width: 88rpx;
			height: 30rpx;
			background: rgba(255, 243, 243, 1);
			color: #FF5A5A;
			// text-align: right;
			// padding-right: 14rpx;
			// box-sizing: border-box;
			line-height: 30rpx;
			margin-left: -20rpx;
			padding-left: 22rpx;
			padding-right: 8rpx;
			border-radius: 20rpx;
		}

		.image1 {
			width: 100%;

		}

		.image2 {
			width: 100rpx !important;
			position: absolute;
			// top: 150rpx;
			left: calc(100% - 200rpx);
			width: 50rpx;
		}
	}
</style>
