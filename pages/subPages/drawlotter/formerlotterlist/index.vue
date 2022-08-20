<template>
	<view class="page" :style="{'background-color':pageSetInfo.bg_color?pageSetInfo.bg_color:'#F15D68'}">
		<!-- 顶部banner -->                
		<view class="banner">
			<image :src="bgimgUrl"></image>
			<view class="take_part f-24 col-f">共<text>{{lotterList.join_count}}</text>人已参与</view>
		</view>
		<!-- 往期列表 -->
		<view class="list" style="height: auto;">
			<view @click="ToLotteryDetailPage(index)" v-if="item.review_show == 1" class="lottery_list_item"  v-for="(item,index) in periods" :key="index">
				<view class="item_content">
					<!-- 赞助商滚动 -->
					<view class="item_content_header">
						<swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000" :duration="1500" style="height: 50rpx;" >
							<swiper-item v-for="(items,index) in storeList" :key="index">
								<view class="dis-flex">
									<view class="photo"><image :src="sponsorStoreLogo(index)"></image></view>
									<view class="title f-32 col-3">{{sponsorStoreTitle(index)}}</view>
								</view>	
							</swiper-item>
						</swiper>
					</view>
					<!-- 抽奖详情信息 -->
					<view class="item_content_footer dis-flex flex-x-around">
						<view class="goods_photo">
							<view class="photo_box"><image :src="storeImg"></image></view>
							<view class="lottery f-22">抽奖</view>
						</view>
						<view class="goods_info">
							<view class="number f-20"><text>{{item.luck_period_id}}</text>期</view>
							<view class="goods_describe f-28 col-3">{{lotterList.luck_title}}</view>
							<view class="lottery_describe dis-flex flex-x-between f-24 col-3">
								<view v-if="lotterList.luck_mode == 1">{{lotterTime(item.lottery_time)}}自动开奖</view>
								<view v-if="lotterList.luck_mode == 2">参与达到<text>{{lotterList.luck_begin_number}}人自动开奖</text></view>
								<view v-if="lotterList.luck_mode == 3">手动开奖</view>
								<view class="num">x<text>{{lotterList.luck_count}}</text>份</view>
							</view>
							<view class="goods_info_footer dis-flex flex-x-between">
								<view class="goods_price f-24">价值：￥<text class="f-32">{{lotterList.luck_price}}</text></view>
								<view class="lottery_result f-24 col-9">{{lotterActive(item.period_state)}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 右侧固定商家赞助图 -->
		<view @click="handleRitghtBtnClick" class="right_photo">
			<image v-if="pageSetInfo.merchant_icon" :src="pageSetInfo.merchant_icon"></image>
			<image v-else :src="getImageRoot('88.png')"></image>
		</view>
		
		<!-- 底部导航按钮 -->
		<view class="nav_btn f-24 col-3 dis-flex">
			<view class="home_btn common_btn dis-flex flex-dir-column flex-x-center flex-y-center" @click="handleHomeClick">
				<image v-if="pageSetInfo.home_icon" :src="pageSetInfo.home_icon"></image>
				<view v-else>
					<image src="../../../../static/images/icon-home--333.png" style="width: 40rpx;height: 40rpx;"></image>
					<view>首页</view>
				</view>
			</view>
			<view class="service_btn common_btn dis-flex flex-dir-column flex-x-center flex-y-center" @click="handleServiceClick">
				<image v-if="pageSetInfo.serve_icon" :src="pageSetInfo.serve_icon">
				<view v-else>
					<image src="../../../../static/images/icon-kefu--333.png" style="width: 40rpx;height: 40rpx;"></image>
					<view>客服</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import pageShare from "@/common/js/pageShareMixin.js"
	export default {
		mixins: [pageShare],
		data() {
			return {
				lotterList:{},
				periods:[],
				lottery_time:'',  //开奖时间
				storeList:[],  //赞助店铺数据
				pageSetInfo:{},  //页面配置信息
				luck_id:null,
				bgimgUrl: '',
			}
		},
		// async created() {
		// 	await this.getLotterSetRes()
			
		// },
		onLoad(options) {
			this.luck_id = options.luck_id
		},
		async onShow() {
			await this.getLotterListRes()
			await this.getLotterSetRes()
			this.bgimgUrl = this.pageSetInfo.cover ? this.pageSetInfo.cover : this.getImageRoot('87.png')
			let shareImg = {file_path: this.pageSetInfo.share_img},
				otherParams = {
					luck_id: this.lotterList.luck_id,
				},
				shareSetting = {
				title: this.pageSetInfo.share_txt,
				cover_image: [shareImg]
				}
			this.shareData = this.getPageShareData('formerlotterlist/index',shareSetting,otherParams)
		},
		methods: {
			// 请求往期抽奖信息
			async getLotterListRes() {
				try {
					const res = await App._postP('luck.luck/review',{
						luck_id:this.luck_id,
						// luck_id:206,
					})
					let result = this.$util.deepGet(res, 'data') || []
					this.lotterList = result
					let arr = this.lotterList.periods
					this.periods = arr
					this.storeList = result.prize
				} catch (e) {
					console.log(112231231212, e)
				}
			},
			//请求往期回顾页面配置信息
			async getLotterSetRes() {
				try {
					const res = await App._postP('luck.luck/getLuckReviewSet',{})
					let result = this.$util.deepGet(res,'data') || []
					this.pageSetInfo = result
					console.log('页面配置信息',this.pageSetInfo)
				}catch(e) {
					console.log(e)
				}
			},
			
			// 跳转详情页
			ToLotteryDetailPage(i) {
				App.navigationTo({
					url:'pages/subPages/drawlotter/index/index?luck_id=' + this.periods[i].luck_id + '&period_id=' + this.periods[i].luck_period_id
				})
			},
			
			// 导航按钮点击跳转
			handleHomeClick() {
				if(this.pageSetInfo.home_icon && this.pageSetInfo.home_link) {
					App.navigationTo({
						url:this.pageSetInfo.home_link
					})
				}else {
					App.navigationTo({
						url:'pages/mainPages/index/index'
					})
				}
			},
			handleServiceClick() {
				if(this.pageSetInfo.serve_icon && this.pageSetInfo.serve_link) {
					App.navigationTo({
						url:this.pageSetInfo.serve_link
					})
				}else {
					App.navigationTo({
						url:''
					})
				}
			},
			handleRitghtBtnClick() {
				App.navigationTo({
					url:this.pageSetInfo.merchant_link
				})
			},
		},
		computed: {
			// 返回赞助店铺Logo地址
			sponsorStoreLogo() {
				return function(i) {
					if(this.lotterList.prize && this.lotterList.prize[i] && this.lotterList.prize[i].business && this.lotterList.prize[i].business.logo && this.lotterList.prize[i].business.logo.file_path) {
						return this.lotterList.prize[i].business.logo.file_path
					}
				}
			},
			// 返回赞助商家名称
			sponsorStoreTitle() {
				return function(i) {
					if(this.storeList && this.storeList[i] && this.storeList[i].business_name) {
						return this.storeList[i].business_name + ' 赞助'
					}
				}
			},
			// 返回本期开奖状态
			lotterActive() {
				return function(i) {
					let res;
					switch(Number(i)) {
						case 1:
						res = '已开奖';
						break;
						case 2:
						res = '抽奖中';
						break;
						case 3:
						res = '未开始';
						break;
					}
					return res
				}
			},
			// 返回封面图地址
			storeImg() {
				return this.lotterList.image_img && this.lotterList.image_img[0] && this.lotterList.image_img[0].file_path
			},
			// 返回开奖时间
			lotterTime() {
				return function(i) {
					return this.$util.formatTime(i, 'normal', '月');
				}
			}
		},
	}
</script>

<style  lang="scss" scoped>
	.page {
		position: relative;
		width: 100vw;
		min-height: calc(100vh - 155rpx);
		// background-color: #F15D68;
		padding-bottom: 155rpx;
	}
	.banner {
		width: 750rpx;
		height: 300rpx;
		position: relative;
		background-size: 750rpx 300rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	// 往期项目样式
	.take_part {
		width: 170rpx;
		height: 46rpx;
		background: rgba(0,0,0,.5);
		position: absolute;
		top: 20rpx;
		left: 0;
		line-height: 46rpx;
		text-align: center;
		border-top-right-radius: 23rpx;
		border-bottom-right-radius: 23rpx;
	}
	.lottery_list_item {
		width: 690rpx;
		height: 352rpx;
		border-radius: 10rpx;
		background: #FFFFFF;
		margin: 20rpx 30rpx 0 30rpx;
		z-index: 9;
	}
	.item_content {
		width: 650rpx;
		height: 100%;
		margin: auto;
		overflow: hidden;
	}
	.item_content_header {
		height: 50rpx;
		margin: 41rpx 0;
		.photo {
			width: 50rpx;
			height: 50rpx;
			border-radius: 25rpx;
			image {
				width: 100%;
				height: 100%;
				border-radius: 25rpx;
			}
		}
		.title {
			height: 50rpx;
			width: 580rpx;
			line-height: 50rpx;
			margin-left: 23rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.item_content_footer {
		height: 200rpx;
		margin-bottom: 20rpx;
		.goods_photo {
			width: 200rpx;
			height: 200rpx;
			position: relative;
			border-radius: 10rpx;
			.photo_box {
				width: 100%;
				height: 100%;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.lottery {
				width: 70rpx;
				height: 34rpx;
				background-image: linear-gradient(#FBCB17,#FFEA72);
				color: #743C02;
				text-align: center;
				line-height: 34rpx;
				border-bottom-right-radius: 17rpx;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 10;
			}
		}
		.goods_info {
			width: 430rpx;
			height: 200rpx;
			margin-left: 20rpx;
			position: relative;
			.number {
				min-width: 60rpx;
				height: 28rpx;
				text-align: center;
				line-height: 28rpx;
				background-color: #F6D246;
				position: absolute;
				top: 0;
				left: 0;
			}
			.goods_describe {
				width: 420rpx;
				height: 67rpx;
				line-height: 33rpx;
				text-indent: 80rpx;
				overflow : hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.lottery_describe {
				margin-top: 45rpx;
			}
			.goods_info_footer {
				height: 40rpx;
				margin-top: 15rpx;
				.goods_price {
					color: #FF4444;
					text{
						font-weight: bold;
					}
				}
				.lottery_result {
					width: 90rpx;
					height: 40rpx;
					text-align: center;
					line-height: 40rpx;
					background-color: rgba(238,238,238,1);
				}
			}
		}
	}
	// 底部导航按钮样式
	.nav_btn {
		position: fixed;
		height: 100rpx;
		left: 0;
		bottom: 30rpx;
		z-index: 100;
		.common_btn {
			margin-left: 30rpx;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50rpx;
			background-color: #FFD940;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	// 页面右侧固定图片样式
	.right_photo {
		width: 105rpx;
		height: 116rpx;
		position: fixed;
		top: 700rpx;
		right: 30rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
</style>