<!-- Abnor页面异常处理 buy 缪启峙
	 引入 Abnor  如:<vAbnor :abnor="'CART'"/>
	 异常状态名称 默认为:'DATA' : 如'REQUEST_ERROR','NOT_FOUND','DATA'
-->
<template>
	<view>
		<view class="abnor">
			<view class="abnor-box">
				<image class="abnor-image" :src="abnorImg" mode="widthFix"></image>
				<view class="abnor-text">{{abnorTitle}}</view>
				<!-- <view class="abnor-tip" v-if="!!abnortip">{{abnortip}}</view> -->
				<!-- <view class="abnor-btn" v-if="!!abnorbutton">{{abnorbutton}}</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {

			}
		},
		props: {
			abnor: {
				type: String,
				default: "DATA"
			},
			title: {
				type: String,
				default: ""
			}
		},
		computed: {
			abnorName() {
				return {
					'DATA': {
						image: '12.png',
						title: '没有相关记录哦'
					},
					'GOODS': {
						image: '11.png',
						title: '没有相关商品哦'
					},
					'ORDER': {
						image: '10.png',
						title: '您还没有订单信息哦'
					},
					'ADDRESS': {
						image: '13.png',
						title: '您还没有收货地址哦'
					},
					'COUNPONS': {
						image: '14.png',
						title: `暂无${this.appCoupon.coupon_title}哦`
					},
					'BONUS': {
						image: '14.png',
						title: `暂无红包哦`
					},
					'YUYUE': {
						image: '10.png',
						title: `您暂无预约信息`
					}
				}
			},
			abnorImg() {
				return App.img_root + this.abnorName[this.abnor].image;
			},
			abnorTitle() {
				return this.title ? this.title : this.abnorName[this.abnor].title;
			}, //
			// 			abnortip() {
			// 				return this.abnorName[`${this.abnor}`].tip;
			// 			},
			// 			abnorbutton() {
			// 				return this.abnorName[`${this.abnor}`].button;
			// 			}
		}
	}
</script>

<style>
	.abnor {
		position: relative;
		display: block;
		width: 100%;
		height: 0;
		padding-bottom: 100%;
		overflow: hidden
	}

	.abnor-box {
		position: absolute;
		display: flex;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		flex-direction: column;
		justify-content: center;
		align-items: center
	}

	.abnor-btn {
		min-width: 228upx;
		height: 66upx;
		margin-top: 30upx;
		padding: 0 30upx;
		background-color: #ff5777;
		border: 0 none;
		border-radius: 2upx;
		color: #fff;
		font-size: 28upx;
		text-align: center;
		overflow: hidden;
		line-height: 66upx
	}

	.abnor-btn:active {
		background-color: #f5456e
	}

	.abnor-image {
		width: 400upx;
		height: 400upx;
		display: block;
		background: transparent no-repeat;
		background-size: cover
	}

	.abnor-text {
		margin-top: 30upx;
		color: #333;
		font-size: 28upx
	}

	.abnor-tip {
		margin-top: 20upx;
		color: #666;
		font-size: 28upx
	}
</style>
