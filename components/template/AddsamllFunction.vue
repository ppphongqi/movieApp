<!-- 右上角提示保存小程序按钮 by 缪启峙 -->
<template>
	<!-- <<view></view>  :style="themeColor"> -->
	<view v-if="canTip !== 3" :style="themeColor">
		<block v-if="canTip === 1">
			<view class="collect-guide dis-flex flex-y-center" :class="contentBoxClassStr" :style="contentBoxClassStyle" v-if="collectGuide" @click="guideShow">
				<image src="/static/images/hongbao.png" class="guide-icon"></image>
				<view class="">
					<view class="guide-text-1 f-22 col-s">免费送红包</view>
					<view class="guide-text-2 f-22 col-f dis-flex flex-y-center">{{canTip === 1?"收藏":"关注"}}进入送红包<view class="iconfont icon-unfold"></view>
					</view>
				</view>
			</view>
			<view class="guide-contnet" v-show="isShowContnet">
				<view class="guide-contnet-mask"></view>
				<view class="guide-info">
					<view class="guide-tips dis-flex flex-y-center">
						<view class="guide-tips-number main-bg-color auxiliary-color">1</view>
						<view class="col-f f-26  flex-box">点击<text class="dot"></text>添加至我的小程序</view>
					</view>
					<image :src="getImageRoot('47.png')" mode="widthFix" class="guide-img"></image>
					<view class="guide-tips dis-flex">
						<view class="guide-tips-number main-bg-color auxiliary-color">2</view>
						<view class="col-f f-26 flex-box">从微信下拉，“我的小程序”进入即可领取惊喜红包！</view>
					</view>
					<image :src="getImageRoot('48.gif')" mode="widthFix" class="guide-img"></image>
					<view class="guide-btn f-28 col-f t-c" @click="isShowContnet = false">我知道了</view>
				</view>
			</view>
		</block>
		<block v-if="canTip === 2">
			<view class="content-box dis-flex flex-y-center" :class="contentBoxClassStr" :style="contentBoxClassStyle" v-if="isopen">
				<view class="col-f content-text dis-flex flex-y-center">点击<text class="dot"></text>添加至我的小程序</view>
				<view class="iconfont icon-round_close_light close" @click="close"></view>
			</view>
		</block>
		<block v-if="canTip === 4">
			<!-- -->
			<view class="follow-guide" v-if="collectGuide" @click="guideShow">
				<image src="/static/images/hongbao.png" class="follow-icon"></image>
			</view>
			<view class="community-box" v-if="isCommunity">
				<view class="community-content">
					<view class="community-detail b-f t-c">
						<view class="community-header f-w f-44 p-r"><text class="community-header-text p-r">关注有礼</text></view>
						<!-- #ifdef MP-WEIXIN -->
						<!-- <view class="community-body f-26 col-3" v-if="appClientType ==='2'">
							有任何疑问，点击“<text class="col-m">去回复</text>”发送“<text class="col-m">{{community.id}}</text>”,即可添加客服微信
						</view> -->
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<view class="community-body">
							<image :src="followWechatQR" class="community-qrcodeimg"></image>
							<view class="community-toreply f-26 col-3">{{appClientType === '3'?"扫码关注公众号":"长按识别二维码"}}</view>
							<view class="iconfont icon-roundclose" @click="isCommunity = false"></view>
						</view>
						<!-- #endif -->
						<!-- <view class="community-phone dis-flex flex-y-center flex-x-between">
							<view class="community-number dis-flex flex-y-center">
								<image src="/static/images/goods/community.png" class="community-number-icon"></image>
								<view class="f-24 col-3">{{community.mobile}}</view>
							</view>
							<view class="community-bdial f-24 col-3" @click="callPhone(community.mobile)">拨号</view>
						</view> -->
						<!-- <button class="community-reply f-24 col-3" open-type="contact" v-if="appClientType === '2'">去回复</button> -->
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import baseMixin from '@/mixins/baseMixin.js'
export default {
    mixins: [baseMixin],
    data() {
        return {
            isopen: true,
            collectGuide: true, // 收藏引导
            isShowContnet: false, // 引导内容
            isCommunity: false // 关注关注
        }
    },
    props: {
        follow: {
            type: Number,
            default: undefined
        },
        // 会否是自定义导航栏，这将会影响组件的定位
        isCustomNav: {
            type: Boolean,
            default: false
        }
    },
    components: {

    },
    computed: {
        canTip() {
            return !!this.$store.state.userInfo && this.$store.state.userInfo.can_tip
        },
        followWechatQR() {
            return !!this.$store.state.appSetting && this.$store.state.appSetting.followWechatQR
        },
        contentBoxClassStr() {
            return this.isCustomNav ? 'is-custom-nav' : ''
        },
        contentBoxClassStyle() {
            let styleStr = ''
            styleStr += this.isCustomNav ? `top: ${this.baseMixin_cStatusBarHeight * this.baseMixin_cSystemInfo.
                pixelRatio + 100}rpx;` : ''
            return styleStr
        }
    },
    beforeCreate() {

    },
    onLoad(options) {

    },
    onShow() {

    },
    created() {

    },
    mounted() {


    },
    watch: {
        follow: {
            handler(newValue) {
                if (newValue == 1) {
                    this.collectGuide = false
                }
            },
            immediate: true

        }

    },

    methods: {
        close() {
            this.isopen = false
        },
        guideShow() {
            this.collectGuide = false
            this[this.canTip === 1 ? 'isShowContnet' : 'isCommunity'] = true
        }
    }
}
</script>

<style scoped>
	.content-box {
		position: fixed;
		padding: 0 20upx;
		top: 12px;
		right: 20upx;
		z-index: 200;
		background: rgba(0, 0, 0, .5);
		border-radius: 50upx;
	}

	.content-box.is-custom-nav {
		top: 140rpx;
	}

	.content-text {
		font-size: 26upx;
		height: 50upx;
		line-height: 50upx;
	}

	.close {
		color: #FFFFFF;
		margin-left: 12upx;
	}

	.content-box::after {
		content: " ";
		position: absolute;
		left: 69%;
		top: -14px;
		border-width: 7px;
		border-style: solid;
		border-color: transparent transparent rgba(0, 0, 0, .5) transparent;
	}

	.dot {
		font-size: 26upx;
		width: 60upx;
		height: 50upx;
		display: inline-block;
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI2MTVGN0VCODVDODExRTk5QUU2RDU4NDU2OTIxMTczIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjI2MTVGN0VDODVDODExRTk5QUU2RDU4NDU2OTIxMTczIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjYxNUY3RTk4NUM4MTFFOTlBRTZENTg0NTY5MjExNzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjYxNUY3RUE4NUM4MTFFOTlBRTZENTg0NTY5MjExNzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Cq+D4AAACkklEQVR42uyav2sUQRTHb1VE0y1aW5xR068iNlYbbGyDBhS7FIIoKBzJX5C/wB9B8RBtYmGVQu4K0yUhUdKkSwSxiCiXTg0kjt8xb/HduDe3e9mFO/N98GV33+wM7zNv9u3sJYExpnKQ7FDlgBmBCUxgAhOYwAQmMIEJTGACE5jABCbw/2dBcmKMGcNhKwiCpvLVcGjCt9KvAM5vclVoTM5nLA8UQ5GczySdnpg9a8l1CC2Lb7afM2aBlVrmr81CVdNuNXvTRJvDmQAoHiBgbTb2yPE17E3rDmyoboj7/Zl0gGtqZRrxTSvGhp6VUAaI5Xp5EIqQA6xXbEP5khU7rat0K8myWDQoWVZmk5YwJIU2UoVsw133DZXhtud6ADKsC21LClakCpltqxyRmYjUrKxICQ/Ft1VwgOdxGIfOQTvQB+gFXn0fC8huVeId/ZPNvcyGwjSqg4j10pXZsr6oQNCj0CPol/nXtqH7BTzDkcSufbG+Tnvoy1LddLc7ZccR7OOvh6egK9BxaAFa8tx7GZrPMOZ36DS02aH9AnQJ+gG9hT4VUdazqCbLUNsbaKjD/c9MdkvL8pCM7z4GU3lj7wX2uifYeoc+SzmAn+acsGt54u/la+mup+0GdNL3kdKDnYBuedrvlf15OOJpOwydSfGv5Rh/1bk+K+P2Ek8hwF+7tH9J8T3POLYtWq8zjJcnnn0Dv/K0LcoL37V3UD3D2JMpFXpD3gKd7GXZVdpuIJopxeMzNNyl32PPxuOBp++wjO9aU8Yt/T1st6Q3oavQMcnsQ+hbhr56a7kLvbdbS6jb1tIWw9vQRegnNCf9dnL9xMN/WyIwgQlMYAITmMAEJjCBCUxgAhOYwAQmMIH7234LMACo4CmURHS6eAAAAABJRU5ErkJggg==');
		background-size: 100% 60upx;
		background-repeat: no-repeat;
		margin: -12upx 8upx 0;
	}

	/* 收藏送红包 */
	.collect-guide {
		position: fixed;
		top: 20upx;
		right: 20upx;
		z-index: 200;
		background: rgba(0, 0, 0, .5);
		border-radius: 8upx;
		padding: 0 10upx;
	}

	.collect-guide.is-custom-nav {
		top: 140rpx;
	}

	.collect-guide::after {
		content: " ";
		position: absolute;
		left: calc(50% - 7px);
		top: -14px;
		border-width: 7px;
		border-style: solid;
		border-color: transparent transparent rgba(0, 0, 0, .5) transparent;
	}

	.collect-guide .guide-icon {
		width: 80upx;
		height: 80upx;
		display: block;
	}

	.collect-guide .icon-unfold {
		font-size: 24upx;
		color: #FFFFFF;
		width: 1em;
		height: 1em;
		line-height: 1em;
	}

	.guide-contnet {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
	}

	.guide-contnet-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 10;
	}

	.guide-info {
		position: absolute;
		top: 5%;
		left: 10%;
		width: 80%;
		z-index: 20;
	}

	.guide-tips-number {
		display: inline-block;
		font-size: 24upx;
		width: 1.2em;
		height: 1.2em;
		line-height: 1.2em;
		border-radius: 50%;
		background: #FFD940;
		text-align: center;
		font-weight: bold;
		color: #000000;
		margin-right: 12upx;
	}

	.guide-info .guide-img {
		width: 100%;
		margin: 12upx auto;
	}

	.guide-info .guide-btn {
		border: 1upx solid #FFFFFF;
		border-radius: 10upx;
		width: 6em;
		padding: 12upx 0;
		margin: 0 auto;
	}

	.follow-guide {
		position: fixed;
		top: 60%;
		right: 20upx;
		z-index: 20;
		padding: 10upx;
		border-radius: 50%;
		background: rgba(0, 0, 0, .5);
	}

	.follow-guide .follow-icon {
		width: 70upx;
		height: 70upx;
		display: block;
	}

	.community-box {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 50;
	}

	.community-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
	}

	.community-detail {
		border-radius: 20upx;
		overflow: hidden;
	}

	.community-detail .community-header {
		width: 70vw;
		height: 120upx;
		line-height: 120upx;
	}

	.community-detail .community-header .community-header-text {
		z-index: 2;
	}

	.community-detail .community-header::after {
		content: " ";
		position: absolute;
		top: -160upx;
		left: -25%;
		width: 150%;
		height: 280upx;
		border-radius: 60%;
		background: #FFD940;

		z-index: 1;
	}

	.community-detail .community-body {
		padding: 50upx;
	}

	.community-detail .community-body .icon-roundclose {
		position: absolute;
		bottom: -1.8em;
		left: 50%;
		transform: translateX(-50%);
		font-size: 48upx;
		width: 1em;
		height: 1em;
		color: #FFFFFF;
	}

	.community-detail .community-body .icon-roundclose {
		position: ;
	}

	.community-detail .community-phone {
		height: 80upx;
		line-height: 80upx;
		margin: 0 30upx 30upx;
		padding: 0 20upx;
		border-radius: 20upx;
		background: rgba(255, 217, 64, .2);
	}

	.community-detail .community-number .community-number-icon {
		width: 30upx;
		height: 30upx;
		display: block;
		margin-right: 15upx;
	}

	.community-detail .community-bdial {
		width: 96upx;
		height: 52upx;
		line-height: 52upx;
		background: #FFD941;
		border-radius: 10upx;
	}

	.community-detail .community-reply {
		width: 200upx;
		height: 70upx;
		line-height: 70upx;
		background: #FFD941;
		border-radius: 35upx;
		margin: 0 auto 30upx;
	}

	.community-detail .community-qrcodeimg {
		width: 366upx;
		height: 366upx;
		display: block;
		margin: 0 auto 30upx;
	}
</style>
