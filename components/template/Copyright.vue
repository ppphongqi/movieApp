<template>
	<view class="copyright-box" :class="{'fixed':fixed === '1','padding':isIphoneX}">
		<view class="copyright-info dis-flex flex-x-center flex-y-center" v-if="appSetting.copyright_diy =='1'">
			<image :src="appSetting.app_logo&&appSetting.app_logo.length>0?appSetting.app_logo[0].file_path:appLogo"></image>
			<view class="copyright-app">
				<view class="app-name col-a f-24">{{!!appSetting.app_name?appSetting.app_name:appName}}</view>
				<view class="app-mobile col-a f-22" v-if="appSetting.app_describe || appSetting.kf_phone">{{!!appSetting.app_describe?appSetting.app_describe:"合作电话:"+appSetting.kf_phone}}</view>
			</view>
			<!-- 			<view class="contact-btn dis-flex flex-y-center col-3">
				<view class="iconfont icon-dianhua"></view>
				<view class="f-24" @click="callPhone(copyright.kf_phone)">拨打</view>
			</view> -->
		</view>

		<view class="" v-else>
			<parse :html="appSetting.copyright" parse-only="byKnow"></parse>
		</view>

		<view v-if="appSetting.app_pattern">
			<parse :html="appSetting.app_pattern" parse-only="byKnow"></parse>
		</view>


		<!-- <view class="copyright-links dis-flex flex-y-center f-24 col-9 m-top20">
			<view class="link-item" @click="copyrightLink('license')">营业执照</view>
			<view class="link-item center" @click="copyrightLink('agreement')">服务协议</view>
			<view class="link-item" @click="copyrightLink('policy')">隐私政策</view>
		</view> -->
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import Parse from '@/components/threeComponents/jyf-Parser/index'
export default {
    data() {
        return {
            copyright: null,
            logo: ''

        }
    },

    props: {
        fixed: {
            type: String,
            default: '2'
        }
    },
    components: {
        Parse

    },
    computed: {
        appSetting() {
            let appSetting = this.$store.state.appSetting
            console.log(appSetting, '设置信息	1111')
            return appSetting ? appSetting : {}
        }
    },
    beforeCreate() {

    },
    onLoad(options) {

    },
    onShow() {

    },
    mounted() {
        // let _this = this;
        // App._get("setting/index", {}, res => {
        // 	_this.copyright = res.data;
        // });
    },
    methods: {
        copyrightLink(richType) {
            App.navigationTo({
                url: 'pages/mainPages/richtext/setrich?richtype=' + richType
            })
        },
        callPhone(phoneNumber) {
            uni.makePhoneCall({
                phoneNumber: String(phoneNumber)
            })
        }
    }
}
</script>

<style>
	.copyright-box {
		padding: 40upx 0 96upx;
	}

	.copyright-box.fixed {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 96upx;
		z-index: 5;
	}

	.copyright-box.fixed.padding {
		bottom: calc(96upx + 20px);
	}

	.copyright-info image {
		width: 60upx;
		height: 60upx;
		display: block;
		border-radius: 50%;
		margin-right: 20upx;
	}

	.contact-btn {
		background: #FFD940;
		border-radius: 6upx;
		margin-left: 20upx;
		padding: 8upx 18upx 8upx 10upx;
	}

	.contact-btn .iconfont {
		font-size: 28upx;
		width: 1em;
		height: 1em;
		line-height: 1em;
		margin-right: 8upx;
	}

	.link-item {
		flex: 1;
		text-align: center;
	}

	.link-item.center {
		border-left: 1upx solid #DDDDDD;
		border-right: 1upx solid #DDDDDD;
	}
</style>
