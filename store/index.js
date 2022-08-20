import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

// 按模块编写Store
// import Cart from './modules/cart.js'
import cgp from './modules/cgp.js'
import storeDiy from './modules/storeDiy.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: '',
        userInfo: uni.getStorageSync('userInfo') || {}, // 用户信息
        floatOpen: false, // 浮动按钮显示隐藏
        refereeId: '', // 推荐人id
        clientType: '', // 当前平台类型
        systemInfo: null, // 当前设备信息
        appSetting: null, // 当前应用设置
        orderPay: null, // 订单支付数据
        addressData: null, // 收货地址
        storeData: null, // 门店地址
        iswrite: null, // 注销状态
        openAdvert: null, // 首页弹窗
		openAdvertIndex: 0, // 当前显示第几个弹窗
        tabBar: null, // 底部菜单数据
        hiddenTabBar: false, // 隐藏底部菜单
        AddsmallFunction: null, // 右上角添加至我的小程序提示
        pageLoad: null, // 页面加载数据
        parseWidth: null,
        appRoot: {}, // 全局路由
        shareSetting: null, // 分享设置
        wechatFollow: true, // 是否显示引导关注公众号
        theme: '',
        topColor: '',
        auxiliaryColor: '',
		// 会员信息
		memberInfo: {},
		// user/index接口的信息
		userAll: {}
    },
    getters: {
        getSingleShare: state => shareType => {
            let shareSetting = state.shareSetting,
                singleShare = {}
            if (!shareSetting) {
                return
            }
            for (let [
                key,
                value
            ] of Object.entries(shareSetting)) {
                if (key.includes(shareType)) {
                    key = key.split('_')
                    key.shift()
                    singleShare[key.join('_')] = value
                }
            }
            return singleShare
        },
        getUserInfoData(state) {
            return state.userInfo
        },
        getTabBar(state) {
            state.tabBar = state.tabBar ? state.tabBar : uni.getStorageSync('tabBar')
            return state.tabBar
        },
        getappSetting(state) {
            // #ifdef H5
            // 为什么会在这里改变state的值！！！！！
            state.appSetting = state.appSetting ? state.appSetting : uni.getStorageSync('appSetting')
            return state.appSetting
            // #endif

            // #ifndef H5

            return state.appSetting
            // #endif

        },
        getTheme(state) {

            state.theme = state.theme ? state.theme : uni.getStorageSync('theme') || ''

            console.log(state.theme, 'theme-getter----------------------------------')
            return state.theme


        },
        getTopColor(state) {
            state.topColor == state.topColor ? state.topColor : state.topColor = uni.getStorageSync('top-color')
            return state.topColor
        },
        getAuxiliaryColor(state) {
            state.auxiliaryColor = state.auxiliaryColor ? state.auxiliaryColor : uni.getStorageSync('auxiliary_color')
            return state.auxiliaryColor
        }

    },
    mutations,
    actions,
    modules: {
        // Cart,
        cgp,
		storeDiy
    }
})

export default store
