<template>
	<view class="store-contact dis-flex flex-dir-row flex-y-center">
		<!-- <view v-if="hasAddress" class="" @click="storeLocation(address)">
			<view class="iconfont-box">
				<text class="iconfont icon-daohang1"></text>
			</view>
			<view class="f-24 col-s onelist-hidden title">地图</view>
		</view>
		<view v-if="mobile" class="iconfont-line border-vertical border-left"></view>
		<view v-if="mobile" class="" @click="storeMobile(mobile)">
			<view class="iconfont-box">
				<text class="iconfont icon-dianhua1"></text>
			</view>
			<view class="f-24 col-s onelist-hidden title">电话</view>
		</view> -->
		<view class="coupon-price t-c flex-x-center">
			<view v-if="busId" class="dial main-bg-color auxiliary-color"  @click.stop="goToStoreDetail({storeId:storeId,busId:busId})">
				<view class="f-26">进入</view>
			</view>
			<view v-if="mobile" class="dial main-bg-color auxiliary-color"  @click.stop="storeMobile(mobile)">
				<view class="f-26">拨打</view>
			</view>
			<view v-if="hasAddress" class="dial main-bg-color auxiliary-color" @click.stop="storeLocation(address)">
				<view class="f-26">导航</view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		props:{
			// 商家id
			busId: {
				type: [String,Number],
				default: ''
			},
			// 店铺id
			storeId: {
				type: [String,Number],
				default: ''
			},
			mobile:{
				type:String,
				default: ''
			},
			address:{
				type:Object,
				default: ()=>{{}}
			}
		},
		computed: {
			hasAddress() {
				return Object.keys(this.address).length > 0
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			/**
			 * 去店铺详情
			 */
			goToStoreDetail({storeId,busId}) {
				if(this.storeId) {
					// 进新版详情页
					App.navigationTo({
						url: `pages/subPages/shopDetail/shopDetail?store_id=${this.storeId}&bus_id=${this.busId}`
					})
				}else {
					// 进老版详情页
					App.navigationTo({
						url: `pages/subPages/store/index?bus_id=${this.busId}`
					})
				}
				
			},
			/**
			 * 拨打门店电话
			 */
			storeMobile(mobile) {
				uni.makePhoneCall({
					phoneNumber: mobile
				});
			},
			
			/**
			 * 查看门店地址
			 */
			storeLocation({
				lat,
				lng,
				name,
				address
			}) {
				App.openLocation({
					name,
					address,
					latitude: Number(lat),
					longitude: Number(lng),
					success() {
						console.log('success');
					}
				});
			},
		},
	}
</script>

<style lang="scss">
$r: 30upx;
$color: rgb(53,53,53);
.store-contact{
	text-align: center;
	.iconfont-box{
		position: relative;
		width: $r;
		height: $r;
		border-radius: 2em;
		border: 1px solid $color;
		margin: 0 auto;
		.iconfont {
			position: absolute;
			top: 50%;
			left: 50%;
			line-height: 1;
			&.icon-daohang1{
				margin-top: 1.5upx;
			}
			transform: translate(-50%, -50%);
			font-size: 24upx;
			width: 24upx;
			height: 24upx;
			color: $color;
		}
	}
	.iconfont-line {
		height:40upx;
		margin:-40upx 20upx 0;
		&.border-vertical::after{
			border-left: 1px solid #EEEEEE;
		}
	}
	.title.onelist-hidden{
		font-size: 20upx;
		color: #999999!important;
		line-height:1;
		margin-top:6px;
	}
	.dial{
		width:80rpx;
		height: 40rpx;
		line-height: 40rpx;
		// background: #FFD940;
		border-radius: 10rpx;
		margin-top: 30rpx;
		}

	


}
</style>
