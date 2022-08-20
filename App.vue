<script>
import App from '@/common/js/app.js'
import cityData from '@/common/js/cityData.js'
// #ifdef H5
import wxApi from '@/static/h5/wxApi.js'
// #endif
// fix 5796
export default {
    data() {
        htmlData: []
    },
    onLoad() {},
    /**
		 * 生命周期函数--监听小程序初始化
		 */
    onLaunch(e) {

        // 设置项目地址信息
        App.setSiteInfo()

        // 设置地址
        App.setAppRoot()

        // #ifdef MP
        // 用户静默登录
        App.userSilentLogin(() => {}, true)
        // #endif

        // 获取底部菜单
        // this.$store.dispatch("getTabBarMenu");
        this.$store.dispatch('getTabBarData')


        // 获取主题颜色
        this.$store.dispatch('getTheme')

        // 获取当前应用设置
        this.$store.dispatch('getAppSetting')

        // 获取页面自定义分享设置
        this.$store.dispatch('getShareSetting')

        // 获取当前设备信息
        this.$store.commit('setSystemInfo')

        // 设置当前编译平台
        App.setClientType()

        // #ifdef H5
        // 公众号接口权限获取
        let clientType = App.getClientType()
        if (clientType === '4') {
            wxApi.wxRegister()
        }

        // 保存推荐人Id并绑定推荐关系
        let refereeId = this.$util.getParams('referee_id', location.href.split('#')[1], true)
        if (refereeId) {
            App.saveRefereeId(refereeId)
            console.log('saveRefereeQuest')
            App.saveRefereeQuest()
        }
        // #endif

        // 获取全国行政区划
        cityData.init()


    },
    /**
		 * 当小程序启动，或从后台进入前台显示，会触发 onShow
		 */
    onShow(options) {
        // #ifdef MP
        // #ifdef MP-WEIXIN
        // 小程序主动更新
        App.updateManager()
        // 缓存小程序进入场景值
        uni.setStorageSync('scene', options.scene)
        // #endif
        // 小程序启动场景
        if (options.query && JSON.stringify(options.query) !== '{}') {
            console.log('e.query', options.query)
            App.isScanCode = true
            App.onStartupScene(options.query)
        }
        // #endif

        // 更新当前用户信息
        console.log('onShow: 更新当前用户信息')
        App.updateUserInfo()
    },
    // #ifdef MP-WEIXIN
    onPageNotFound() {
        uni.reLaunch({
            url: '/pages/mainPages/index/index'
        })
    }
    // #endif
}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	// 修复box-sizing的问题 https://github.com/YanxinNet/uView/issues/410
	view, text {
		box-sizing: initial;
	}

	.u-tabbar,.u-swiper-wrap,.u-progress,.u-index-list {
		&,view, text {
			box-sizing: border-box;
		}
	}
</style>
<style lang="scss">
	/*  #ifdef  MP-WEIXIN  */
	// page {
	// 	--theme-color: #FFD940;
	// 	--help-color: #FF4444;
	// 	--auxiliary-color: #333;
	// }

	/*  #endif  */

	/*  #ifdef  H5  */
	// :root {
	// 	--theme-color: #FFD940;
	// 	--help-color: #FF4444;
	// 	--auxiliary-color: #333;
	// }

	/*  #endif  */
	// 辅助字体颜色
	.help_color {
		color: var(--help-color, #FF4444) !important;

	}

	@supports ((--help_color: 0)) {
		.help_color {
			color: var(--help-color, #FF4444) !important;

		}
	}

	@supports (not (--help_color: 0)) {
		.help_color {
			color: #FF4444;

		}
	}

	//辅助背景颜色
	.help-bg-color {
		background-color: var(--help-color, #FF4444) !important;

	}

	@supports ((--help-bg-color: 0)) {
		.help-bg-color {
			background-color: var(--help-color, #FF4444) !important;

		}
	}

	@supports (not (--help-bg-color: 0)) {
		.help-bg-color {
			background-color:#FF4444;

		}
	}

	//辅助边框颜色
	.help-border-color {
		border-color: var(--help-color, #FF4444) !important;

	}

	@supports ((--help-border-color: 0)) {
		.help-border-color {
			border-color: var(--help-color, #FF4444) !important;

		}
	}

	@supports (not (--help-bg-color: 0)) {
		.help-border-color {
			border-color: #FF4444;

		}
	}

	//字体颜色
	.main-color {
		color: var(--theme-color, #FFD940) !important;
	}

	@supports ((--main-color: 0)) {
		.main-color {
			color: var(--theme-color, #FFD940) !important;
		}
	}

	@supports (not (--main-color: 0)) {
		.main-color {
			color: #FFD940;
		}
	}

	.auxiliary-color {
		color: var(--auxiliary-color, #333) !important;
	}

	@supports ((--auxiliary-color: 0)) {
		.auxiliary-color {
			color: var(--auxiliary-color, #333) !important;
		}
	}

	@supports (not (--auxiliary-color: 0)) {
		.auxiliary-color {
			color:#333;
		}
	}


	// 背景颜色
	.main-bg-color {
		background-color: var(--theme-color, #FFD940) !important;
	}

	@supports ((--main-bg-color: 0)) {
		.main-bg-color {
			background-color: var(--theme-color, #FFD940) !important;
		}
	}

	@supports (not (--main-bg-color: 0)) {
		.main-bg-color {
			background-color:#FFD940;
		}
	}

	.auxiliary-bg-color {
		background-color: var(--auxiliary-color, #333) !important;
	}

	@supports ((--auxiliary-bg-color: 0)) {
		.auxiliary-bg-color {
			background-color: var(--auxiliary-color, #333) !important;
		}
	}

	@supports (not (--auxiliary-bg-color: 0)) {
		.auxiliary-bg-color {
			background-color: #333;
		}
	}


	// 边框颜色
	.main-border-color {
		border-color: var(--theme-color, #FFD940) !important;
	}

	@supports ((--main-border-color: 0)) {
		.main-border-color {
			border-color: var(--theme-color, #FFD940);
		}
	}

	@supports (not (--main-border-color: 0)) {
		.main-border-color {
			border-color: #FFD940;
		}
	}

	.auxiliary-border-color {
		border-color: var(--auxiliary-color, #333);
	}

	@supports ((--auxiliary-border-color: 0)) {
		.auxiliary-border-color {
			border-color: var(--auxiliary-color, #333);
		}
	}

	@supports (not (--auxiliary-border-color: 0)) {
		.auxiliary-border-color {
			border-color: #333;
		}
	}


	/*每个页面公共css */
	@import "./common/css/app.css";
	@import "./common/css/common.css";
	@import "./common/css/iconfont.css";

	/* 数字字体 */
	@font-face {
		font-family: "Number-Font";
		src: url('data:application/x-font-ttf;charset=utf-8;base64,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LgAgAEIAYQBzAGUAZAAgAG8AbgAgAEQAaQBuACAAVABlAHgAdAAgAGEAbgBkACAARABpAG4AIABVAG4AaQB2AGUAcgBzAGEAbAAuAEgAZQBsAGwAYQAgAEQASQBOACAAVQBuAGkAdgBlAHIAcwBhAGwAIABNAGUAZABpAHUAbQBSAGUAZwB1AGwAYQByAFAAYQByAGEAYwBoAHUAdABlAFcAbwByAGwAZAB3AGkAZABlADoAIABIAGUAbABsAGEARABJAE4AVQBuAGkAdgBlAHIAcwBhAGwALQBNAGUAZABpAHUAbQA6ACAAMgAwADEAMABIAGUAbABsAGEARABJAE4AVQBuAGkAdgBlAHIAcwBhAGwALQBNAGUAZABpAHUAbQBWAGUAcgBzAGkAbwBuACAAMQAuADAAMAAwAEgAZQBsAGwAYQBEAEkATgBVAG4AaQB2AGUAcgBzAGEAbAAtAE0AZQBkAGkAdQBtAEQAaQBuACAAVABlAHgAdACoACAAaQBzACAAYQAgAHIAZQBnAGkAcwB0AGUAcgBlAGQAIAB0AHIAYQBkAGUAbQBhAHIAawAgAG8AZgAgAFAAYQByAGEAYwBoAHUAdABlAKgAUABhAHIAYQBjAGgAdQB0AGUAqAAgAFcAbwByAGwAZAB3AGkAZABlAFAAYQBuAG8AcwAgAFYAYQBzAHMAaQBsAGkAbwB1AEIAYQBzAGUAZAAgAG8AbgAgAEQASQBOACAAMQA0ADUAMQAgAHQAaABlACAARwBlAHIAbQBhAG4AIABJAG4AZAB1AHMAdAByAGkAYQBsACAAcwB0AGEAbgBkAGEAcgBkACAAYgB5ACAAdABoAGUAIABEAGUAdQB0AHMAYwBoAGUAcwAgAEkAbgBzAHQAaQB0AHUAdAAgAE4AbwByAG0AdQBuAGcAIAAtACAAKAAxADkAMwA2AC8AMQA5ADgANgApAGgAdAB0AHAAOgAvAC8AdwB3AHcALgBwAGEAcgBhAGMAaAB1AHQAZQAuAGcAcgBIAGUAbABsAGEAIABEAEkATgAgAFUAbgBpAHYAZQByAHMAYQBsAE0AZQBkAGkAdQBtAAACAAAAAAAA/28APAAAAAAAAAAAAAAAAAAAAAAAAAAMAAwAAAARABMAFAAVABYAFwAYABkAGgAbABwAAA==');
	}


	list-goods-item {
		width: 100%;
	}

	.icon-jinrujiantou1 {
		font-size: 42upx;
		height: 1em;
		line-height: 1em;
		color: #999999;
	}

	/* #ifdef H5 */
	uni-button[disabled] {
		color: rgba(0, 0, 0, .3) !important;
		background-color: #f7f7f7 !important;
	}

	/* #endif */

	/* #ifdef MP-ALIPAY */
	image {
		background-size: 100% 100%;
	}

	input {
		padding: 0;
		background-color: transparent;
	}

	button {
		height: auto;
		position: relative;
	}

	/* #endif */


	/* #ifdef H5 */
	uni-checkbox.custom_checkbox .uni-checkbox-input {
		color: var(--auxiliary-color, #333) !important;
	}
	uni-checkbox.custom_checkbox .uni-checkbox-input.uni-checkbox-input-checked,
	uni-radio.custom_radio .uni-radio-input.uni-radio-input-checked:before{
		color: var(--auxiliary-color, #333) !important;
		background:var(--theme-color, #FFD940) !important;
	}

	.custom_checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		border-color: transparent !important;
	}
	/* #endif */

	/* #ifdef APP-PLUS ||MP-WEIXIN */
	checkbox.custom_checkbox .wx-checkbox-input {
		color: var(--auxiliary-color, #333) !important;
	}
	checkbox.custom_checkbox .wx-checkbox-input.wx-checkbox-input-checked,
	radio.custom_radio .wx-radio-input.wx-radio-input-checked::before,
	radio.custom_radio .wx-radio-input.wx-radio-input-checked:before{
		color: var(--auxiliary-color, #333) !important;
		background: var(--theme-color, #FFD940) !important;
	}
	radio .wx-radio-input.wx-radio-input-checked::before{
	  border-radius: 50%;/* 圆角 */
	  width: 44rpx;
	  height: 44rpx;
	  font-size: 24rpx;
	  text-align: center;
	  line-height: 44rpx;
	  transform:translate(-50%, -50%) scale(1.1);
	  -webkit-transform:translate(-50%, -50%) scale(1.1);
	}
	.custom_checkbox .wx-checkbox-input.wx-checkbox-input-checked,
	radio .wx-radio-input.wx-radio-input-checked::before{
		border-color: var(--theme-color, #FFD940) !important;
	}
	.uni-picker-container {
		top: initial;
		.uni-mask {
			z-index: 0;
		}
	}
	/* #endif */
	
</style>
