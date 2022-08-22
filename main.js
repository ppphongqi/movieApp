import Vue from 'vue'
import uView from 'uview-ui'
import App from './App'
import Utils from './common/js/util.js'
import setData from './common/js/setData.js'
import store from './store'
import Loading from './components/template/Loading.vue'
import writeHint from './components/template/writehint.vue'
import AppFunction from './common/js/app.js'
// #ifdef H5
import wxApi from './static/h5/wxApi.js'
import H5Api from './static/h5/ican-H5Api.js'
// #endif

// hack
// #ifdef H5
const token = Utils.getParams('token', location.href, true)
if (location.href.indexOf('pages/mainPages/login/openLogin') !== -1 && token) {
    uni.setStorageSync('token', token)
}
// #endif

Vue.use(uView)

uni.setStorageSync('isLogining', false)

Vue.component('page-loading', Loading)
Vue.component('write-hint', writeHint)

Vue.config.productionTip = false

Vue.prototype.setData = setData
Vue.prototype.$store = store
Vue.prototype.$util = Utils

// Vue.prototype.siteBaseUrl = 'https://api-dy.mgmovie.net/';
Vue.prototype.siteBaseUrl = 'https://life.wanmou.cn';

Vue.prototype.sendRequest = function (param, backpage, backtype) {
    var _self = this,
        url = param.url,
        data = param.data || {},
        header = param.header,
        token = "";

    //拼接完整请求地址
    var requestUrl = this.siteBaseUrl + url;
    //固定参数
    // if(!data.token){//如果参数中无token(除了小程序第一次通过code获取token的接口默认参数token = login,其他接口token参数都是在本地缓存中获取)
    //     token = uni.getStorageSync(this.sessionKey);
    //     if(!token){//本地无token需重新登录
    //         _self.login(backpage, backtype);
    //         return;
    //     }else{
    //         data.token = token;
    //     }
    // }
    var timestamp = Date.parse(new Date()); //时间戳
    data["timestamp"] = timestamp;

    //GET或POST
    if (param.method) {
        param.method = param.method.toUpperCase(); //小写改为大写
    }

    //网络请求
    uni.request({
        url: requestUrl,
        method: param.method || "GET",
        header: header || {
            'content-type': "application/json"
        },
        data: data,
        success: res => {
            // console.log("网络请求success");
            // return res;
            param.success(res.data)
        },
        fail: (e) => {
            console.log("网络请求fail:" + JSON.stringify(e));
            uni.showModal({
                content: "" + e.errMsg
            });

            typeof param.fail == "function" && param.fail(e.data);
        },
        complete: () => {
            // console.log("网络请求complete");

            typeof param.complete == "function" && param.complete(res.data);
            return;
        }
    });
}

Vue.prototype.setStorageData = function (key, value) {
    uni.setStorage({
        key: key,
        data: value,
        success: function () {
        }
    });
}

Vue.prototype.getStorageData = function (key) {
    return uni.getStorageSync(key);
}

App.mpType = 'app'

Vue.mixin({
    data() {
        return {
            imageRoot: AppFunction.img_root,
            theme: '',
            canIUseGetUserProfile: false,
        }
    },
    computed: {
        mainMixin_userAll() {
            return this.$store.state.userAll || {};
        },
        mainMixin_userInfo() {
            return this.$store.state.userInfo || {};
        },
        mainMixin_memberInfo() {
            return this.$store.state.memberInfo || {};
        },
        // 是否隐藏底部菜单
        hiddenTabBar() {
            return store.state.hiddenTabBar
        },
        // 是否iphoneX系列
        // 涉及到底部安全距离 请在css中请使用env(safe-area-inset-bottom)
        isIphoneX() {
            // 这种判断并不好。。。新功能的代码不应该再依赖于这个isIphoneX
            // 所有型号可以参考https://www.theiphonewiki.com/wiki/Main_Page
            // let systemInfo = store.state.systemInfo,
            //     iphoneModel = [
            //         'iPhone10,1',
            //         'iPhone10,2',
            //         'iPhone10,3',
            //         'iPhone10,4',
            //         'iPhone10,5',
            //         'iPhone10,6',
            //         'iPhone11,2',
            //         'iPhone11,4',
            //         'iPhone11,6',
            //         'iPhone11,8',
            //         'iPhone12,1',
            //         'iPhone12,3',
            //         'iPhone12,5',
            //         'iPhone13,1',
            //         'iPhone13,2',
            //         'iPhone13,3',
            //         'iPhone13,4'
            //     ]
            // if (!!systemInfo && systemInfo.model) {
            //     return iphoneModel.includes(systemInfo.model) || systemInfo.model.indexOf('iPhone X') !== -1
            // }
            // 20201119
            const systemInfo = store.state.systemInfo || {}
            const {
                system = '', safeArea = {}, safeAreaInsets = {}
            } = systemInfo
            return (system.toLowerCase().indexOf('ios') > -1 && safeArea.top > 20) || safeAreaInsets.bottom > 0


        },
        tabContainer() {
            return this.isIphoneX ? 'tab-padding-container' : 'tab-container'
        },
        // 应用名称
        appName() {
            return store.state.appSetting && store.state.appSetting.name
        },
        // 应用logo
        appLogo() {
            return store.state.appSetting && store.state.appSetting.logo && store.state.appSetting.logo[0].file_path
        },
        // 优惠券自定义文字
        appCoupon() {
            let appSetting = store.state.appSetting,
                couponDefault = {
                    coupon_title: '优惠券',
                    coupon_reduction: '满减券',
                    coupon_rebate: '折扣券',
                    coupon_freight: '运费券',
                    coupon_random: '随机券'
                }
            return appSetting ? appSetting.coupon : couponDefault
        },
        // 应用全局设置
        settingData() {

            let appSetting = store.getters.getappSetting
            // #ifdef MP
            if (this.mpType === 'page' && appSetting) {}
            // #endif
            // #ifdef H5
            if (this.$mp && this.$mp.mpType === 'page' && appSetting) {}
            // #endif
            // 全局货币符号
            if (!!appSetting) {
                appSetting.currency = '¥'
                if (!!appSetting.balance) {
                    let balance = appSetting.balance
                    balance.balance_str = !!balance.balance_str ? balance.balance_str : '余额'
                    balance.integral_str = !!balance.integral_str ? balance.integral_str : '积分'
                }
            }
            return appSetting || {
                currency: '¥',
                card: {
                    font: {
                        ka_bao: '',
                        ci: ''
                    }
                }
            }
        },
        // 分享相关自定义文字
        dealerDiyFont() {
            return this.settingData && this.settingData.diy_font || {}
        },
        // 会员相关自定义文字
        memberDiyFont() {
            let {
                member_font = '会员',
                    discount_font = '优惠',
                    exclusive_font = '专享'
            } = this.settingData.member || {}
            return {
                member_font: member_font || '会员',
                discount_font: discount_font || '优惠',
                exclusive_font: exclusive_font || '专享'
            }
        },
        // 获取user_id
        globalSaveRefereeId() {
            return store.state.userInfo && store.state.userInfo.user_id || 0
        },
        // 获取渠道标识
        appClientType() {
            return AppFunction.getClientType()
        },
        isUserLogin() {
            return !!store.state.userInfo
        },
        // 全局图片url拼接
        getImageRoot() {
            let imageRoot = this.$store.state.appRoot
            return (imgName, type = 'src') => {
                if (imageRoot) {
                    if (type === 'src') {
                        return imageRoot.img_root + imgName
                    } else if (type === 'url') {
                        return 'url(' + imageRoot.img_root + imgName + ')'
                    }
                }

            }
        },
        themeColor() {
            return this.$store.getters.getTheme

        },
        topColor() {
            return this.$store.getters.getTopColor
        },
        auxiliaryColor() {
            return this.$store.getters.getAuxiliaryColor
        }
    },
    onUnload() {
        uni.removeStorageSync('isLogining')
    },
    onLoad() {
        // #ifdef MP-WEIXIN
        if (wx.getUserProfile) {
            this.canIUseGetUserProfile = true
        }
        // #endif
        if (this.topColor != '#FFD940') {
            console.log(this.topColor, '=================this.topColor')
            uni.setNavigationBarColor({
                frontColor: this.auxiliaryColor == '#333333' ? '#00000' : '#ffffff',
                backgroundColor: this.topColor
            })

        }


    },
    // #ifdef H5
    onReady() {
        let sharePages = [
            'pages/subPages/comment/detail',
            'pages/subPages/goods/index/index',
            'pages/mainPages/order/comment/success',
            'pages/mainPages/order/index',
            'pages/subPages/store/index',
            'pages/subPages/dealer/index/index',
            'pages/subPages/groups/index/index',
            'pages/subPages/bargain/index/index',
            'pages/mainPages/index/diypage'
        ]
        console.log(this.route, 'this.route====-------=')
        // 微信公众号统一设置分享文字
        if (!sharePages.includes(this.route)) {
            jWeixin.ready(() => {
                let {
                    share_title,
                    share_describe,
                    wechat_share_image
                } = this.settingData.share
                console.log('share_describe 1111', share_describe)
                wxApi.wxShare({
                    title: share_title || '', // 分享标题
                    desc: share_describe || '', // 分享描述
                    link: `${AppFunction.siteInfo.siteroot}h5/#/pages/mainPages/index/index?referee_id=${this.globalSaveRefereeId}&i=${AppFunction.getUniacid()}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: wechat_share_image ? wechat_share_image[0].file_path : '' // 分享图标
                })
            })
        }
        if (this.$mp && this.$mp.mpType === 'page' && this.appClientType === '4') {
            wxApi.wxRegister(() => {
                if (wxApi.shareOptions) {
                    jWeixin.ready(() => {
                        console.log('wxRegisterReady')
                        wxApi.wxShare(wxApi.shareOptions)
                    })
                }
            })
        }
    },
    updated() {
        if (this.$mp && this.$mp.mpType === 'page') {
            // console.log("updated");
            let inputList = document.getElementsByTagName('input')
            if (inputList && inputList.length > 0) {
                console.log('取消软键盘后页面不回弹处理')
                // 取消软键盘后页面不回弹处理
                this.$nextTick(function () {
                    for (let i = 0; i < inputList.length; i++) {
                        inputList[i].addEventListener('blur', () => {
                            uni.pageScrollTo({
                                duration: 0,
                                scrollTop: 0
                            })
                        })
                    }
                })
            }
        }
    },
    watch: {
        shareData(newValue) {
            if (!!newValue) {
                wxApi.wxShare(newValue)
            }
        }
    },
    // #endif
    onShow() {


    },
    onReady() {


    },
    methods: {
        /**
         * 在请求页面数据之前需要进行的前置操作
         * 1.是小程序会静默登录（全局只请求一次）
         * 2.获取用户信息（每次onShow或者下拉刷新的时候都应该被请求）
         * 3.为了兼容老代码，不管这个方法成功失败 都会返回成功！！！！
         * 4.使用this.hasSilentLogin来标识是否已经执行过静默登录 其他方式都不保险 只有这样了
         * 5.该方法不能解决所有登录问题
         */
        mainMixin_BeforeFetchPageData() {
            const _this = this
            const clientType = AppFunction.getClientType()
            // 已经静默登录过了或者是在H5和公众号里
            if (this.hasSilentLogin || [
                    '3',
                    '4'
                ].indexOf(clientType) !== -1) {
                return new Promise(resolve => {
                    AppFunction._get('user.index/detail', {
                        no_login: 1
                    }, function (result) {
                        if (result.data && result.data.userInfo) {
                            AppFunction.setUserinfo('', result.data.userInfo.user_id, result.data.userInfo)
                        } else {
                            _this.$store.commit('userInfo', {})
                            uni.removeStorageSync('userInfo')
                        }
                        resolve()
                    }, function () {
                        resolve()
                    })
                })
            }
            // #ifdef MP
            if (!this.hasSilentLogin) {
                // 还未静默登录 且在小程序里
                return new Promise(resolve => {
                    AppFunction.userSilentLogin(() => {
                        AppFunction._get('user.index/detail', {
                            no_login: 1
                        }, function (result) {
                            if (result.data && result.data.userInfo) {
                                AppFunction.setUserinfo('', result.data.userInfo.user_id, result.data.userInfo)
                            } else {
                                _this.$store.commit('userInfo', {})
                                uni.removeStorageSync('userInfo')
                            }
                            resolve()
                        }, function () {
                            resolve()
                        })
                    }, true)
                })
            }
            // #endif
            // 标志已经静默登录了
            this.hasSilentLogin = true
            return Promise.resolve()
        },
        // 小程序保存formId
        saveFormId(type, params) {
            // #ifdef MP-WEIXIN
            AppFunction.saveFormId(type, params)
            // #endif
        },
        // 页面自定义跳转
        async navigationTo(urlData) {
            console.log('urlData', urlData)
            console.log('navigationTo', urlData)
            // 电影票
            if (urlData == 'pages/xxx/movie') {
                // #ifdef H5 || MP-WEIXIN
                try {
                    // 显示loading
                    uni.showLoading({
                        title: '跳转中...'
                    })
                    const location = await AppFunction.getLocation() || {}
                    const res = await AppFunction._postP('movie.Movie/inToMovie', {
                        latitude: location.latitude || '',
                        longitude: location.longitude || ''
                    })
                    const url = res.data || ''

                    uni.hideLoading()
                    if (!url) {
                        uni.showToast({
                            icon: 'none',
                            title: '未获取到url'
                        })
                        return
                    }
                    // 隐藏loading
                    // #ifdef H5
                    location.href = url
                    // #endif
                    // #ifdef MP
                    AppFunction.navigationTo({
                        url: 'pages/mainPages/index/webview?link=' + encodeURIComponent(url)
                    })
                    // #endif
                } catch (e) {
                    console.log('fetchCardCateRes', e)
                    return Promise.reject(e)
                    // TODO handle the exception
                }
                return
                // #endif
                // #ifndef H5 || MP-WEIXIN
                uni.showToast({
                    title: "该平台不支持电影票",
                    icon: 'none'
                })
                return
                // #endif

            }
            let isDiyUrl = urlData instanceof Object, // 判断跳转类型
                currentPage = getCurrentPages().pop(),
                pageRoute = currentPage.route || currentPage.__route__
            if (isDiyUrl) {
                let {
                    type,
                    path,
                    app_id
                } = urlData
                switch (type) {
                    case '12': // 自定义链接
                        if (!!path) {
                            if (this.appClientType === '3' || this.appClientType === '4') {
                                location.href = path
                            } else {
                                AppFunction.navigationTo({
                                    url: 'pages/mainPages/index/webview?link=' + encodeURIComponent(path)
                                })
                            }
                        }
                        break
                    case '13': // 小程序跳转
                        if (!!app_id) {
                            // #ifdef MP
                            uni.showLoading()
                            uni.navigateToMiniProgram({
                                appId: app_id,
                                path: path ? path : '',
                                fail(res) {
                                    if (res.errMsg !== 'navigateToMiniProgram:fail cancel') {
                                        AppFunction.showError(res.errMsg)
                                    }
                                },
                                complete(res) {
                                    uni.hideLoading()
                                }
                            })
                            // #endif
                            // #ifndef MP
                            AppFunction.showError('当前渠道不支持跳转到小程序')
                            // #endif
                        }
                        break
                    case '14': // 拨打电话
                        if (!!path) {
                            uni.makePhoneCall({
                                phoneNumber: String(path)
                            })
                        }
                        break
                    case '99': // 自定义app内链接
                        if (!!path) {
                            AppFunction.navigationTo({
                                url: path
                            })
                        }
                        break
                }
            } else if (pageRoute !== urlData) {
                console.log('哈哈哈')
                AppFunction.navigationTo({
                    url: urlData
                })
            }
        }
    },
    // 小程序页面统一分享
    onShareAppMessage(e) {
        console.log(e)
        let clientType = AppFunction.getClientType(),
            {
                share_title,
                share_describe,
                app_share_image,
                wechat_share_image
            } = this.settingData.share
        if (clientType === '4') {

        } else {
            return {
                title: share_title || '',
                imageUrl: app_share_image ? app_share_image[0].file_path : '',
                path: '/pages/mainPages/index/index?referee_id=' + this.globalSaveRefereeId
            }
        }

    }
})


const app = new Vue({
    store,
    ...App
})

app.$mount()