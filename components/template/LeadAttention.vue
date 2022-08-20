<!-- 引导关注公众号组件 -->
<template>
	<view v-if="isShowAttention && wechatFollow" :class="cContainerClassStr">
		<view class="attention dis-flex flex-y-center">
			<view class="f-24 col-f onelist-hidden">{{followData.tipwords}}</view>
			<view class="attention-btn dis-flex flex-x-center flex-y-center" @click="follow">
				<view class="f-24 col-f">关注</view>
				<view class="iconfont icon-add"></view>
			</view>
			<view class="iconfont icon-roundclose" @click="$store.commit('setWechatFollow',false)"></view>
		</view>
		<!-- 关注公众号 -->
		<popup-view :show="showAttention" type="center" @clickmask="showAttention = false">
			<view class="community-detail b-f t-c p-r">
				<view class="iconfont icon-roundclose" @click="showAttention = false"></view>
				<view class="community-header f-w f-44 p-r" :style="{'background-image':getImageRoot('61.png','url')}">
					<image src="/static/images/attention-wx.png" class="attention-img"></image>
				</view>
				<view class="community-body f-26 col-3 t-c">
					<view class="t-c">点击“<text class="col-m">去回复</text>”发送“0”</view>
					<view class="f-26 col-3">关注公众号，即时获悉官方动态</view>
				</view>
				<button class="community-reply f-24 col-3" open-type="contact" @click="$store.commit('setWechatFollow',false)">去回复</button>
			</view>
		</popup-view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import PopupView from "@/components/template/PopManager.vue"
	export default {
		props: {
			// 放置的位置,top:顶部，bottom：底部
			placement: {
				type: String,
				default: 'top'
			}
		},
		data() {
			return {
				showAttention: false
			};
		},
		components: {
			PopupView
		},
		computed: {
			// 最外层容器的class
			cContainerClassStr() {
				let str = ''
				str += this.placement ? ` is-${this.placement}` : ''
				str += this.isIphoneX ? ` is-iphone-x` : ''
				return str
			},
			followData() {
				return this.settingData.follow || {}
			},
			wechatFollow() {
	
				return this.$store.state.wechatFollow;
			},
			userInfo() {
				return this.$store.state.userInfo || {};
			},
			isShowAttention() {
				let showList = {
						"pay": "pages/subPages/flow/success",
						"my": "pages/subPages/user/index",
						"orderdetail": "pages/mainPages/order/detail",
						"index": "pages/mainPages/index/index",
						"free":"pages/subPages/myfreeBill/index"
					},
					{
						tiplocation = []
					} = this.followData,
					pages = getCurrentPages(),
					currentPage = pages[pages.length - 1],
					pageRoute = currentPage.route || currentPage.__route__,
					followList = tiplocation.map(val => showList[val]);
				// #ifdef H5 || MP-WEIXIN
				return followList.includes(pageRoute) && this.userInfo.wechat_follow === 0;
				// #endif
				// #ifndef H5 || MP-WEIXIN
				return false;
				// #endif
			}
		},
		onLoad(options) {

		},
		methods: {
			follow() {
				let _this = this;
				// #ifdef MP
				_this.showAttention = true;
				// #endif
				// #ifndef MP
				_this.$store.commit('setWechatFollow', false)
				App.navigationTo({
					url: `pages/subPages/dealer/apply/attention?type=attention&wechat_image=${encodeURIComponent(_this.followData.wechat_url)}`
				})
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.attention {
		width: 100vw;
		background: rgba($color: #888, $alpha: .9);
		height: 80rpx;
		line-height: 80rpx;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;

		.onelist-hidden {
			width: 66%;
			margin: 0 12rpx 0 30rpx;
		}

		.attention-btn {
			width: 120rpx;
			height: 48rpx;
			line-height: 48rpx;
			border-radius: 48rpx;
			background: #2AC418;
			position: relative;

			.icon-add {
				font-size: 30rpx;
				width: 1em;
				height: 1em;
				line-height: 1em;
				color: #FFFFFF;
			}
		}

		.icon-roundclose {
			position: absolute;
			top: 50%;
			right: 20rpx;
			font-size: 36rpx;
			width: 1em;
			height: 1em;
			line-height: .9em;
			transform: translateY(-50%);
			color: #FFFFFF;
		}
	}
	
	.is-bottom {
		.attention {
			top: initial;
			bottom: 88rpx;
		}
		&.is-iphone-x {
			.attention {
				top: initial;
				bottom: 128rpx;
			}
		}
	}
	

	/* 关注公众号 */
	.community-detail {
		border-radius: 20rpx;
		padding-bottom: 35rpx;

		.icon-roundclose {
			position: absolute;
			left: 50%;
			bottom: -2em;
			font-size: 50rpx;
			width: 1em;
			height: 1em;
			line-height: 1em;
			color: #FFFFFF;
			transform: translateX(-50%);
		}

		.community-header {
			width: 70vw;
			height: 210rpx;
			background-size: 100% 100%;

			.attention-img {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 153rpx;
				height: 135rpx;
				display: block;
			}
		}

		.community-body {
			padding: 50rpx;
		}

		.community-reply {
			width: 200rpx;
			height: 70rpx;
			line-height: 70rpx;
			background: #FFD941;
			border-radius: 35rpx;
			margin: 0 auto;
		}
	}
</style>
