<template>
	<view :style="themeColor">
		<!-- 返回按钮 -->
		<!-- #ifdef H5 || MP-WEIXIN || MP-TOUTIAO -->
		<view class="diy-navigator" :style="{'top':backBtnHeight+'px'}">
			<view class="return-btn" @click="returnBtn">
				<text class="iconfont icon-fanhuijiantou col-f"></text>
			</view>
		</view>
		<!-- #endif -->
		<view>
			<!-- <image class="header-img" src="/static/images/grouppurchase/tihuo.jpg"></image> -->
			<image class="header-img" :style="{'background-image':getImageRoot('70.png','url')}"></image>
			
				<view class="top-main m-left-right-30 p-r">
						<image :src="data.qrcode" mode="widthFix" class="code-img"></image>
						<view class="f-24 col-9 padding-box-all">向团长出示提货二维码，便可提货~</view>
				</view>
		
			<view v-if="data.reg && data.reg.name" class="content-main b-f">
				<view class="dis-flex">
					<image :src="data.reg.avatarUrl" class="m-left12"></image>
					<view style="width: 90%;">
						<view class="dis-flex flex-y-center" >
							<view class="col-3 f-28 onelist-hidden">{{data.reg.name}}</view>
							<view class="f-20" style=" border: 1rpx solid #2AC418; color: #2AC418; margin-left: 10rpx;padding: 0rpx 4rpx">团长</view>
						</view>
						<view class="col-9 f-24 twolist-hidden m-top12">{{data.reg.community}}</view>
					</view>
				</view>
			</view>
			<view class="shop-detail b-f m-left-right-30">
				<!-- 按钮 -->
				<view class="dis-flex content-button flex-x-center flex-y-center">
					<view class="content-content-a" v-for="(item,index) in semesterSelection" @click="setid(index)" :class="{active:current === index}"
					 :key="index">
						<view class="f-24">{{item.name}}</view>
					</view>
				</view>
				<view class="dis-flex flex-warp flex-x-between padding-box">
					<view style="width: 40%;padding: 20rpx;" v-for="(item,index) in data.goods_lists.data" :key='index'>
						<image :src="item.img" class="dis-block"></image>
						<view class="b-f" style="padding: 10rpx;">
							<view class="f-28 col-3 twolist-hidden">{{item.goods_name}}</view>
							<view class="dis-flex flex-x-between flex-y-center">
								<view class="f-24 col-9 ">数量:{{item.total_num}}</view>
								<!-- <view class="f-24 f-w col-9" style="background: #F8F8F8;padding: 5rpx 10rpx 5rpx 10rpx">已确认</view> -->
								<!-- <view class="f-24 f-w col-9" style="background: #F8F8F8;padding: 5rpx 10rpx 5rpx 10rpx">未备货</view> -->
								<!-- <radio value="" style="zoom: .7;width: 60rpx;height: 40rpx;line-height: 40rpx;" color="#FFD640" /> -->
							</view>
						</view>
					</view>
		
				</view>
			</view>
			<page-loading ref="loading"></page-loading>
		</view>
	</view>
	
</template>

<script>
	import App from "@/common/js/app.js"
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	export default {
		mixins: [pageShareMixin],
		data() {
			return {
				current: 0,
				state:0,
				data: {
					goods_lists: {
						data: []
					},
					reg: {}
				},
				semesterSelection: [
					{
						name: '可提货'
					},
					{
						name: '备货中'
					},
					{
						name: '最近提货'
					}
				],
				isShowDate: false, // 显示日期选择
			}
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
			setid(index) {
				this.current = index;
				this.state = this.current+1
				this.getDetail()
			},
			getDetail() {
				let _this = this
				App._post_form('cgp.User/deliveryCode', {
						status: _this.state,
						page: 1,
						list_rows: 500
					}, function(res) {
						_this.data = res.data
						Array.isArray(res.data.reg) && res.data.reg.length == 0 ? _this.data.reg = {} : _this.data.reg= res.data.reg

					}, function(res) {},
					function(res) {
						App.hideLoading();
					})

			}


		},
		onLoad() {
	
		},
		onShow(){
			this.state = this.current+1
			this.getDetail()
		},
		onPullDownRefresh(){
			this.getDetail()
		}
	}
</script>

<style>
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
	.header-img {
		width: 100%;
		background-size: 100% auto;
		background-repeat: no-repeat;
	}

	.top-main {
		margin-top: -200upx;
		background: #FFFFFF;
		text-align: center;
		border-radius: 10rpx;
	}

	.content-main {
		margin: 20rpx 30rpx 20rpx 30rpx;
		padding: 10rpx 20rpx 10rpx 20rpx;
	}

	.content-main image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.content-button {
		padding: 20rpx 24rpx 20rpx 24rpx;
		text-align: center;

	}

	.content-content-a {
		flex: 1;
		background: #FFFFFF;
		padding: 20rpx 56rpx 20rpx 56rpx;
		border: 2rpx solid #EEEEEE;
	}

	.shop-detail image {
		width: 100%;
		height: 180rpx;
		border-radius: 10rpx;
	}

	.active {
		background: #FFD940;
		background: var(--theme-color);
		color:var(--auxiliary-color);
	}

	.code-img {
		width: 400rpx;
		margin-top: 60rpx;
	}
</style>
