import {
	mapState,
	mapGetters
} from 'vuex'
import App from "@/common/js/app.js"

export default {
	computed: {
		...mapState({
			// 系统信息
			baseMixin_cSystemInfo: 'systemInfo',
			// 客户端类型
			baseMixin_cClientType: 'clientType'
		}),
		...mapGetters({
			baseMixin_cThemeColor: 'getTheme'
		}),
		// 是ios还是安卓
		baseMixin_cPlatform() {
			return this.baseMixin_cSystemInfo.platform
		},
		// 状态栏高度 单位px
		baseMixin_cStatusBarHeight() {
			return this.baseMixin_cSystemInfo.statusBarHeight || 0
		},
		// 自定义导航栏高度 单位rpx
		baseMixin_cNavigationBarHeight() {
			return 88
		},
		
	},
	methods: {
		baseMixin_navigationTo({url,success}) {
			App.navigationTo({url,success})
		}
	}
}
