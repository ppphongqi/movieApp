<template>
	<view :style="themeColor">
		<view class="container" :style="{'background-image':getImageRoot('60.png','url')}">
			<!-- #ifdef MP -->
			<view class="content b-f dis-flex flex-dir-column flex-x-around flex-y-center business">
				<view class="title f-36 col-3 f-w">只差最后一步，即可成为店员</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="official-account">
					<official-account></official-account>
				</view>
				<!-- #endif -->
				<view class="f-26 col-9">关注公众号，及时获悉官方动态</view>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP -->
			<view class="content b-f dis-flex flex-dir-column flex-x-around flex-y-center">
				<view class="title f-36 col-3 f-w" v-if="type !=='attention'">只差最后一步，即可成为{{type ==="business"?"店员":dealerDiyFont.fxs}}</view>
				<image :src="wechat_image" class="attention-qr"></image>
				<view class="f-26 col-9">关注公众号，及时获悉官方动态</view>
				<view class="finger-box p-r">
					<image :src="wechat_image" class="finger-qr"></image>
					<image src="/static/images/finger.png" class="finger"></image>
				</view>
				<view class="f-24 col-9">长按识别二维码</view>
			</view>
			<!-- #endif -->
			<view class="back-home t-c col-3 f-24 b-f" @click="backHome">返回首页</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"

	export default {
		data() {
			return {
				wechat_image: "",
				type: ""
			};
		},
		onLoad(e) {
			this.type = e.type;
			this.wechat_image = decodeURIComponent(e.wechat_image);
		},
		components: {},
		methods: {
			backHome() {
				uni.reLaunch({
					url: `/pages/mainPages/index/index?i=${App.getUniacid()}`
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.container {
		box-sizing: border-box;
		min-height: 100vh;
		padding: 20rpx 30rpx 0;
		background-size: 100% 100%;

		.content {
			height: 915rpx;
			border-radius: $uni-border-radius-base;

			&.business {
				height: 450rpx;
				margin-top: 20vh;
			}

			.attention-qr {
				width: 360rpx;
				height: 360rpx;
				display: block;
				border-radius: $uni-border-radius-base;
			}


			.finger-qr {
				width: 220rpx;
				height: 220rpx;
				display: block;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				opacity: 0;
				z-index: 2;
			}

			.finger {
				width: 130rpx;
				height: 130rpx;
				display: block;
				position: relative;
				z-index: 1;
			}
		}

		.back-home {
			position: absolute;
			right: 0;
			bottom: 160rpx;
			width: 134rpx;
			height: 68rpx;
			line-height: 68rpx;
			border-radius: 34px 0px 0px 34px;
		}

		.official-account {
			margin: 20rpx 65rpx 0;
		}
	}
</style>
