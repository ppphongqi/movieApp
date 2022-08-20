/**
 * tabBar页面路径列表 (用于链接跳转时判断)
 * tabBarLinks为常量, 无需修改
 */
import Store from '@/store'
import util from '@/common/js/util.js'
// #ifdef H5
import wxApi from '@/static/h5/wxApi.js'
// #endif
const tabBarLinks = [
    'pages/mainPages/index/index',
    'pages/subPages/category/index',
    'pages/subPages/comment/index',
    'pages/subPages/user/index',
    'pages/subPages/member/index/index',
    'pages/mainPages/goodshop/goodshop',
    'pages/subPages/merchant/enter/enter',
    'pages/subPages/flow/index',
	'pages/subPages/card/index'
]

// 经纬度缓存
let appLatitude = ''
let appLongitude = ''
try{
	appLatitude = uni.getStorageSync('appLatitude')
	appLongitude = uni.getStorageSync('appLongitude')
}catch(e){
	//TODO handle the exception
}
let App = {

    /**
	 * 全局变量
	 */
    globalData: {
        user_id: null
    },
    query: null,
    // api地址
    api_root: '',
    // 图片地址
    img_root: '',
    siteInfo: {},
    /**
	 * 设置项目基础信息
	 */
    setSiteInfo() {
        let aidFromStorage = ''
        try {
            aidFromStorage = uni.getStorageSync('aid').aid || ''
        } catch (e) {
            // TODO handle the exception
        }
        let version = require('@/version.json'),
            editionUrl = (version.edition === 'we7' ? 'addons/' + version.name + '/' : '') + 'web/'
        // #ifdef H5
        let location = window.location,
            url = location.href,
            currentPageUrl = location.hash.split('?')[0].substr(2)
        // 强制隐藏返回按钮
        if (!tabBarLinks.includes(currentPageUrl)) {

            let uniBackBtn = document.getElementsByClassName('uni-btn-icon')[0]
            if (uniBackBtn && uniBackBtn.style) {
                uniBackBtn.style.display = 'none'
            }
        }

        if (process.env.NODE_ENV === 'development') {
            uni.setStorageSync('uniacid', 40)
            // version.siteroot = 'https://zerodev.weliam.com.cn/' + editionUrl
            version.siteroot = 'https://weixin.weliam.cn/' + editionUrl
            // version.siteroot = "https://vv.com/" + editionUrl;

            this.siteInfo = version
        } else {
            if (location.href.indexOf('/h5/#/pages/') === -1) {
                let reg = new RegExp('\/h5/.*?\#/')
                url = url.replace(reg, '/h5/#/')
            }
            // 获取当前请求域名
            let uniacid = util.getParams('i', url.split('#')[1], true),
                aid = util.getParams('aid', url.split('#')[1], true) || '',
                siteroot = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/'

            // 项目版本路径拼接
            siteroot += editionUrl

            uni.setStorageSync('uniacid', uniacid)
            console.log('setSiteInfo', { siteroot,
                uniacid,
                aid }, location.href)
            this.siteInfo = {
                siteroot,
                uniacid,
                aid,
                baseroot: editionUrl,
                edition: version.edition,
                weliamv: version.weliamv
            }
            history.replaceState(null, null, '/' + editionUrl + 'h5/#' + url.split('#')[1])
        }
        // #endif
        // #ifndef H5
        version.siteroot += editionUrl
        this.siteInfo = {
            aid: aidFromStorage,
            ...version
        }
        // #endif
    },
    /**
	 * 设置api地址
	 */
    setAppRoot() {
        // let App = this,
        // 	clientType = App.getClientType(),
        let siteroot = this.siteInfo.siteroot
        // if (clientType === "3" || clientType === "4") {
        // 	siteroot = App.siteInfo.siteroot + "addons/weliam_areashop/web/";
        // } else {
        // 	siteroot = App.siteInfo.siteroot + (App.siteInfo.edition === 'we7' ? 'addons/' + App.siteInfo.name : '') + '/web/';
        // }
        this.img_root = siteroot + 'assets/store/img/default/we/'
        this.api_root = siteroot + 'index.php?s=api/'
        Store.commit('setAppRoot', {
            img_root: siteroot + 'assets/store/img/default/we/',
            api_root: siteroot + 'assets/store/img/default/we/'
        })
    },

    /**
	 * 小程序启动场景
	 */
    onStartupScene(query) {
        // 获取场景值
        let scene = this.getSceneData(query)
        this.query = scene
        // 记录推荐人id
        let refereeId = query.referee_id ? query.referee_id : scene.referee_id
        if (!!refereeId) {
            console.log('小程序启动', refereeId)
            this.saveRefereeId(refereeId)
            if (!!this.getUserId()) {
                this.saveRefereeQuest()
            }
        }
    },
    saveRefereeIdX(refereeId) {
        console.log('saveRefereeIdX', refereeId)
        if (!!refereeId) {
		    this.saveRefereeId(refereeId)
		    if (!!this.getUserId()) {
		        this.saveRefereeQuest()
		    }
        }
    },

    /**
	 * 获取场景值(scene)
	 */
    getSceneData(query) {
        return query && query.scene ? util.scene_decode(query.scene) : {}
    },

    /**
	 * 更新用户信息
	 */
    updateUserInfo() {
        let App = this,
            validate = this.validateUserInfo()
        App._get('user.index/detail', {
            no_login: 1
        }, function (result) {
            let userInfo = result.data.userInfo || {}
            Store.commit('userInfo', userInfo)
        	console.log('tttt',result.data.member_info)
        	Store.commit('setMemberInfo', result.data.member_Info)
			Store.commit('setUserAll', result.data || {})
            uni.setStorageSync('user_id', userInfo.user_id)
        })
    },

    /**
	 * 记录推荐人id
	 */
    saveRefereeId(refereeId) {
        if (!!refereeId) {
            Store.commit('saveRefereeId', refereeId)
        }
    },
    /**
	 * 推荐人绑定下线
	 */
    saveRefereeQuest() {
        let App = this,
            requestUrl = [
                'user.dealer.User/reserveStaff',
                'user.dealer.User/bindingDistribution'
            ].map(val => new Promise((resolve, reject) => {
                App._get(val, {
                    no_login: 1,
                    user_id: App.getUserId(),
                    referee_id: App.getRefereId()
                }, res => {
                    resolve(res)
                })
            }))
        Promise.all(requestUrl).then(options => {
            console.log(options, '绑定成功')
        })
    },

    /**
	 * 判断当前客户端类型
	 */
    getClientType() {
        // 1-导入 2-微信小程序 3-H5 4-公众号 5-安卓 6-苹果 7-支付宝小程序 8-百度小程序 9-头条小程序

        // #ifdef MP-WEIXIN
        return '2'
        // #endif

        // #ifdef H5
        let ua = navigator.userAgent.toLowerCase() // 获取判断用的对象
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return '4'
        }
        return '3'
        // #endif

        // #ifdef MP-ALIPAY
        return '7'
        // #endif

        // #ifdef MP-BAIDU
        return '8'
        // #endif

        // #ifdef MP-TOUTIAO
        return '9'
        // #endif
    },

    /**
	 * 设置当前平台类型
	 */
    setClientType() {
        let App = this,
            clientType = App.getClientType()
        Store.commit('setClient', clientType)
    },

    /**
	 * 执行用户登录
	 */
    doLogin() {
		if (uni.getStorageSync('isLogining')) {
		   return
		}
		uni.setStorageSync('isLogining',true)
        // 保存当前页面
        let App = this,
            clientType = App.getClientType(),
            pages = getCurrentPages()
        if (pages.length > 0) {
            let currentPage = pages[pages.length - 1],
                pageOptions = (clientType === '3' || clientType === '4' ? currentPage : clientType === '2' || clientType === '7' ||
					clientType === '9' ? currentPage.$vm : currentPage.rootVM).$mp.query;
            (currentPage.route != 'pages/login/login') && uni.setStorageSync('currentPage', {
                route: currentPage.route,
                options: pageOptions,
                // #ifdef H5
                // fix https://weliam.coding.net/p/lingdian/bug-tracking/issues/7498/detail
                h5Url: location.href
                // #endif
            })
        } else {
			// #ifdef H5
			uni.setStorageSync('currentPage', {
			    // fix https://weliam.coding.net/p/lingdian/bug-tracking/issues/7498/detail
			    h5Url: location.href
			})
			// #endif
		}

        if (clientType === '3') {
            uni.redirectTo({
                url: '/pages/mainPages/login/newlogin?i=' + App.getUniacid() + '&aid=' +　App.siteInfo.aid
            })
        } else if (clientType === '4') {
			setTimeout(()=>{
				App.openWxLogin()
			}, 100)
        } else {
            // 跳转授权页面
            App.navigationTo({
                url: 'pages/mainPages/login/login'
            })
        }


    },

    /**
	 * 微信公众号登陆
	 */
    openWxLogin() {
        let App = this,
            pages = getCurrentPages(),
            currentPage = pages[pages.length - 1],
            uniacid = App.getUniacid(),
            aid = App.siteInfo.aid,
            url = App.api_root + 'user.Index/loginWxapp&source=4&wxapp_id=' + uniacid + '&aid=' + aid + '&back_url=' + encodeURIComponent(App.siteInfo.siteroot + 'h5/#/pages/mainPages/login/openLogin')
        location.href = url
        console.log('openWxLogin', { aid,
            uniacid,
            url })

    },

    /**
	 * 用户静默登录
	 */
    userSilentLogin(successCb, forceRefresh) {
        console.log('userSilentLogin 111')
        let App = this,
            isUserInfo = App.validateUserInfo()
        if (!isUserInfo || forceRefresh) {
            console.log('userSilentLogin 222')
            // 这里未考虑code过期的问题!!!
            uni.login({
                success(loginRes) {
                    console.log('userSilentLogin 333')
                    App._get('user/getUserData', {
                        code: loginRes.code
                    }, res => {
                        console.log('user/getUserData-------', res)
                        if (!!res.data) {
                            let {
                                token,
                                user_id,
                                status
                            } = res.data
                            App.setUserinfo(token, user_id, status)
                            // 获取页面分享设置
                            Store.dispatch('getShareSetting')
                        }
                        successCb && successCb()
                    })
                },
                fail(res) {
                    console.log('userSilentLogin 444')
                    console.log('uni.login fail', res)
                    successCb && successCb()
                }
            })
        } else {
            console.log('userSilentLogin 555')
            successCb && successCb()
        }
    },
    /**
	 * 设置用户信息
	 * @param {String} token
	 * @param {String} user_id
	 * @param {Object} userInfo
	 */
    setUserinfo(token, user_id, userInfo) {
        console.log('setUserinfo---------1111', userInfo)
        let App = this
        // 记录token
        !!token && uni.setStorageSync('token', token)
        !!token && Store.commit('token', token)
        // user_id
        !!user_id && uni.setStorageSync('user_id', user_id)
        // 储存用户信息
        !!userInfo && Store.commit('userInfo', userInfo)
        // 记录注销状态
        if (userInfo && userInfo.status) {
            Store.commit('iswrite', userInfo.status)
            // Store.commit('setWechatFollow', userInfo.wechat_follow === 0);
        }
    },

    /**
	 * 清除登录缓存
	 */
    removeCurrentPage() {
        uni.removeStorageSync('currentPage')
        uni.removeStorageSync('isLogining')
    },

    /**
	 * 当前用户id
	 */
    getUserId() {
        return uni.getStorageSync('user_id') || util.deepGet(Store.state, 'userInfo.user_id') || ''
    },

    /**
	 * 获取应用uniacid
	 */
    getUniacid() {
        return uni.getStorageSync('uniacid') || this.siteInfo.uniacid
    },

    /**
	 * 获取推荐人id
	 */
    getRefereId() {
        return uni.getStorageSync('referee_id') || Store.state.refereeId
    },

    /**
	 * 验证是否存在user_info
	 */
		// 不要用这个方法了 完全不准确
    validateUserInfo() {
        let user_info = uni.getStorageSync('userInfo')
        return user_info && user_info.user_id
    },

    /**
	 * 显示成功提示框
	 */
    showSuccess(msg, callback) {
        uni.showToast({
            title: msg,
            icon: 'success',
            mask: true,
            duration: 1500,
            success() {
                callback && (setTimeout(function () {
                    callback()
                }, 1500))
            }
        })
    },

    /**
	 * 显示失败提示框
	 */
    showError(msg, callback, showCancel = false) {
        uni.showModal({
            title: '友情提示',
            content: msg,
            showCancel: showCancel,
            success(res) {
                callback && callback(res)
            }
        })
    },

    /**
	 * @param {Object} url 请求地址转换
	 */
    transformUrl(url) {
        // console.log(url);
        // let strToUpperCase = (url)=>{
        //
        // };
        // if (url.indexOf(".") !== -1) {
        // 	let [url1, url2] = url.split("."),
        // 		newUrl = url1 + url2[0].toUpperCase() + url2.substring(1, url2.length - 1);
        // 	console.log(newUrl);
        // 	url = newUrl;
        // }
        return this.api_root + url
    },

    /**
	 * get请求
	 */
    _get(url, data, success, fail, complete) {
        this.weRequest('GET', url, data, success, fail, complete)
    },
    /**
	 * Promis
	 * @param {Object} url
	 * @param {Object} data
	 */
    _getP(url, data = {}) {
        return new Promise((resolve, reject) => {
            this.weRequest('GET', url, data, resolve, reject, res => {
                const code = util.deepGet(res, 'data.code')
                if (code === 1) {
                    resolve(res.data)
                } else {
                    reject(res.data)
                }
            })
        })
    },
    /**
	 * post提交
	 */
    _post_form(url, data, success, fail, complete) {
        this.weRequest('POST', url, data, success, fail, complete)
    },
    _postP(url, data = {}) {
        return new Promise((resolve, reject) => {
            this.weRequest('POST', url, data, resolve, reject, res => {
                const code = util.deepGet(res, 'data.code')
                if (code === 1) {
                    resolve(res.data)
                } else {
                    reject(res.data)
                }
            })
        })
    },

    weRequest(method = 'GET', url, data, success, fail, complete) {
        // #ifndef MP-TOUTIAO
        uni.showNavigationBarLoading()
        // #endif

        let App = this,
            uniacid = App.getUniacid(),
            requestUrl = App.transformUrl(url),
            // 无需登录白名单
            notTokenList = [
                'Setting/getWeChatShareInfo',
                'diy.Diy/getNavigationMenu',
                'diy.Diy/getThemeInfo',
                'setting/index',
                'Address/getRegionList',
                'user.H5/sendSms',
                'user/login',
                'user.H5/register',
                'user.H5/findBack',
                'user.index/detail',
                'user.index/getShareSetting',
                'user/getUserData',
                'cgp.Reg/getBindReg',
                'cgp.Regapply/applyStatus',
                'voucher.Voucher/VoucherCoupon',
                'diy.Diy/getHomeConfigInfo',
                'Business/rotation',
                'sort.Sort/getBusinessSort',
                'Business/storeInfo',
                'redenvelopes.Redenvelopes/redEnvelopesShowData',
                'redenvelopes.Redenvelopes/getRecommendGoods',
				'movie.mahua/comingList'
                // user.dealer.Apply/is_distributor
            ],
            filterKeys = [
                'interrupted',
                'timeout',
                '超时',
                'connect error',
                'unknow host',
                'request:fail'
            ] // 屏蔽报错关键字

        // 构造请求参数
        try {
            // 20200818 有可能报错 所以用try catch包起来.....
            const oldData = { ...data }
            data = data || {}
            data.wxapp_id = uniacid || this.siteInfo.uniacid
            data.aid = App.siteInfo.aid
            data.token = uni.getStorageSync('token') || ''
            data.source = App.getClientType() // 1导入 2小程序 3H5 4公众号 5安卓 6苹果
            data.weliamv = this.siteInfo.weliamv.split('.').join('')
            data.edition = this.siteInfo.edition
            // 确保业务中可以覆盖aid等参数
            data = {
                ...data,
                ...oldData
            }
        } catch (e) {
            // TODO handle the exception
            console.log('weRequest', e)
        }

        // if (data.token) {
        // 	delete data["no_login"];
        // } else {
        // 	data.no_login = 1;
        // }

        // #ifdef H5
        if (!data.token && !(notTokenList.includes(url))) {
			App.doLogin()
			return
		}
        // #endif
        // 请求的封装
        uni.request({
            url: requestUrl,
            header: {
                'content-type': method === 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'
            },
            method: method,
            data: util.removeEmpty(data),
            success(res) {
                let keyIndex = filterKeys.findIndex(val => res.data && res.data.msg && res.data.msg.indexOf(val) !== -1)
                uni.hideLoading()
                if (res.statusCode !== 200 || typeof res.data !== 'object') {
                    console.log(res)
                    App.showError('网络请求出错:\n' + url, () => {
                        fail && fail(res)
                    })
                    App.hideLoading()
                    return false
                }
                if (res.data.code === -1) {
                    // 登录态失效, 重新登录
                    // #ifndef MP-TOUTIAO
                    uni.hideNavigationBarLoading()
                    // #endif
                    // App.hideLoading();
                    App.doLogin()
                    return false
                } else if (res.data.code === 0) {
                    uni.hideLoading()
                    if (keyIndex === -1) {
                        App.showError(res.data.msg, function () {
                            App.hideLoading()
                            fail && fail(res)
                        })
                    }
                    return false
                } else if (res.data.code === 1) {
                    success && success(res.data)
                } else if (res.data.code === 2) {
                    App.showError(res.data.msg, function (options) {
                        App.hideLoading()
                        fail && fail(res)
                        if (options.confirm) {
                            uni.navigateBack({
								fail(e) {
									App.navigationTo({
										url: 'pages/mainPages/index/index',
										redirectTo: true
									})
								}
							})
                        }
                    })
                    return false
                }
            },
            fail(res) {
                let keyIndex = filterKeys.findIndex(val => res.errMsg.indexOf(val) !== -1)
                if (keyIndex === -1 && res.errMsg !== 'request:fail') {
                    App.showError(url + '\n' + res.errMsg, function () {
                        App.hideLoading()
                        fail && fail(res)
                    })
                }
            },
            complete(res) {
                // #ifndef MP-TOUTIAO
                uni.hideNavigationBarLoading()
                // #endif
                complete && complete(res)
            }
        })
    },

    // 上传图片
    _upLoad(url, status = '') {
        let App = this,
            clientType = App.getClientType()
        return new Promise((resolve, reject) => {
            // 微信公众号上传图片
            if (clientType === '4' && status == '') {
                wxApi.uploadImage({
                    localId: url.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
                    success(res) {
                        res.file_id = res.serverId
                        resolve(res)
                    },
                    fail(res) {
                        uni.hideLoading()
                        uni.showModal({
                            title: '上传失败',
                            content: JSON.stringify(res),
                            showCancel: false
                        })
                        reject()
                    }
                })
            } else {
                // 其他上传
                uni.uploadFile({
                    url: App.api_root + 'upload/image',
                    filePath: url,
                    fileType: 'image',
                    name: 'file',
                    formData: {
                        wxapp_id: App.siteInfo.uniacid,
                        aid: App.siteInfo.aid,
                        token: uni.getStorageSync('token'),
                        source: clientType,
                        weliamv: App.siteInfo.weliamv
                    },
                    success(res) {
                        if (res.statusCode !== 200 || typeof res.data !== 'string') {
                            App.showError('网络请求出错')
                            return false
                        }
                        let data = JSON.parse(res.data)
                        console.log('xxxxxxxxxxxxx', data)
                        if (data.code === 0) {
                            App.showError(res.data.msg)
                            return false
                        } else if (data.code === -1) {
                            console.log('res.code-----------', res.code)
                            // 登录态失效, 重新登录
                            // #ifndef MP-TOUTIAO
                            uni.hideNavigationBarLoading()
                            // #endif
                            // App.hideLoading();
                            if (!uni.getStorageSync('isLogining')) {
                                uni.setStorageSync('isLogining', true)
                                App.doLogin()
                            }
                            return false

                        }
                        resolve(JSON.parse(res.data).data[0])


                    },
                    fail(res) {
                        uni.hideLoading()
                        uni.showModal({
                            title: '上传失败',
                            content: JSON.stringify(res),
                            showCancel: false
                        })
                        reject()
                    },
                    complete() {
                        uni.hideToast() // 隐藏Toast
                    }
                })
            }
        })
    },

    /**
	 * 递归图片上传
	 * @param {Object} urls
	 */
    _upLoadAll(urls, status = '') {
        let App = this,
            index = 0,
            urlsList = []
        console.log(urls)
        return new Promise((resolve, reject) => {
            (function upLoadImage(urls, index) {
                console.log('upLoadImage')
                App._upLoad(urls[index], status).then(res => {
                    urlsList.push(res)
                    index += 1
                    if (index < urls.length) {
                        upLoadImage(urls, index)
                    } else {
                        resolve(urlsList)
                    }
                })
            })(urls, index)
        })
    },

    /**
	 * 对象转URL
	 */
    urlEncode(data) {
        var _result = []
        for (var key in data) {
            var value = data[key] || ''

            if (value.constructor == Array) {
                value.forEach(function (_value) {
                    _result.push(key + '=' + _value)
                })
            } else if ('' + value) {
                _result.push(key + '=' + value)
            }
        }
        return _result.join('&')
    },

    /**
	 * 小程序主动更新
	 */
    updateManager() {
        if (!uni.canIUse('getUpdateManager')) {
            return false
        }
        const updateManager = uni.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            // console.log(res.hasUpdate)
        })
        updateManager.onUpdateReady(function () {
            uni.showModal({
                title: '更新提示',
                content: '新版本已经准备好，即将重启应用',
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })
        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            uni.showModal({
                title: '更新提示',
                content: '新版本下载失败',
                showCancel: false
            })
        })
    },

    /**
	 * 获取tabBar页面路径列表
	 */
    getTabBarLinks() {
        return tabBarLinks
    },

    /**
	 * 获取页面节点信息方法
	 */
    getSelectorQuery() {
        let _this = this,
            clientType = _this.$store.state.clientType
        return clientType === '2' ? uni.createSelectorQuery().in(_this) : uni.createSelectorQuery()
    },

    /**
	 * 获取tabBar列表数据
	 */


    /**
	 * 跳转到指定页面
	 * 支持tabBar页面
	 */
    navigationTo({
        url,
        success,
        redirectTo = false,
        query = {}
    }) {
        console.log('跳转22222222222222', url)
        if (!url || url.length == 0) {
            return false
        }
        let tabBarLinks = this.getTabBarLinks(),
            uniacid = this.getUniacid(),
            settingTabs = Store.state.tabBar,
            isTabBar = tabBarLinks.includes(url),
            App = this

        // 判断当前页面是否为后台设置的底部菜单
        if (settingTabs) {
            let tabList = settingTabs.list.map(val => val.pagePath),
                isSettingUrl = tabList.includes(url)
            isTabBar = isSettingUrl
        }

        // h5跳转带上uniacid
        // #ifdef H5
        url += (url.indexOf('?') !== -1 ? '&i=' : '?i=') + uniacid
        url += (url.indexOf('?') !== -1 ? '&aid=' : '?aid=') + App.siteInfo.aid
        // #endif

        Object.keys(query).forEach(key => {
            url = util.changeURLArg(url, key, query[key])
        })

        // tabBar页面
        if (isTabBar || redirectTo) {
            console.log('跳转33333333333')
            uni.redirectTo({
                url: '/' + url,
                success,
                fail(err) {
                    console.log(err)
                }
            })
        } else {
            console.log('跳转44444444444444')
            // 普通页面
            uni.navigateTo({
                url: '/' + url,
                success,
                fail(err) {
                    console.log(err)
                }
            })
        }
    },
    /**
	 * 获取订阅消息tmpid
	 * @param {Object} type 订阅消息类型 pay=支付下单 ，refund=退款 ，aftersale=售后，order=订单相关，success=支付成功
	 * @param {Object} params 当前订阅消息所需参数
	 */
    saveFormId(type, params, callback) {
        // #ifdef MP-WEIXIN
        if (typeof type !== 'string') {
            return
        }

        let App = this
        App._post_form('wxapp.sub/getIds', {
            op: type || '',
            ...params
        }, res => {
            let {
                data: tmplIds = []
            } = res
            if (tmplIds.length) {
                wx.requestSubscribeMessage({
                    tmplIds,
                    success(res) {
                        let formIds = []
                        for (let [
                            key,
                            value
                        ] of Object.entries(res)) {
                            if (value === 'accept') {
                                formIds.push(key)
                            }
                        }
                        if (formIds.length) {
                            App._post_form('wxapp.formid/save', {
                                op: type || '',
                                ids: formIds,
                                ...params
                            }, result => {
                                console.log(result, 'xx')
                                callback && callback(result)
                            })
                        }
                    },
                    fail(res) {
                        console.log('requestSubscribeMessage fail:', res)
                    }
                })
            }
        })
        // #endif
    },
    /**
	 * 获取当前页面栈
	 */
    getCurrentPage() {
        // 1-导入 2-微信小程序 3-H5 4-公众号 5-安卓 6-苹果 7-支付宝小程序 8-百度小程序 9-头条小程序
        let App = this,
            clientType = App.getClientType(),
            currentPage = getCurrentPages().pop(),
            pageInstance = null
        if (clientType === '2' || clientType === '7' || clientType === '9') {
            pageInstance = currentPage.$vm
        } else if (clientType === '3' || clientType === '4') {
            pageInstance = currentPage
        } else {
            pageInstance = currentPage.rootVM
        }
        return pageInstance
    },
    /**
	 * 全屏加载
	 */
    showLoading() {
        let App = this,
            page = App.getCurrentPage()
        // !!page.$refs.loading && page.$refs.loading.showLoading();
    },
    hideLoading() {
        let page = this.getCurrentPage()
        !!page && page.$nextTick(function () {
            console.log('$emit hideLoading', false)
            uni.$emit('hideLoading', false)
        })
    },
	showLocationTip() {
		if(this.showLocationTipInstance) {
			return this.showLocationTipInstance
		}
		// 202111081745 有用户说不想看到这个东西
		// this.showLocationTipInstance = uni.showModal({
		// 	title: '申请获取你的位置',
		// 	content: '方便查看您与商家的距离，为您判断距离远近方便使用商品'
		// })
		this.showLocationTipInstance = [{},{}]
		return this.showLocationTipInstance
	},

    /**
	 * 获取当前经纬度
	 */
    async getLocation(type = 'wgs84') {
        let App = this,
            clientType = App.getClientType()
        console.log('app.js 里面开始获取定位', clientType,{appLatitude,appLongitude})
		// #ifdef MP-TOUTIAO
		// 避免多次弹出提示
		const showLocationTipInstance = await App.showLocationTip()
		if(showLocationTipInstance[1].cancel) {
			console.log('用户取消定位',{
				latitude: appLatitude,
				longitude: appLongitude
			})
			return {
				latitude: appLatitude,
				longitude: appLongitude
			}
		}
		// #endif
        return new Promise((resolve, reject) => {
            let clientApi = clientType === '4' ? wxApi : uni
            if (clientType === '4') {
                console.log('是公众号 4s中以后结束定位')
                setTimeout(() => {
                    resolve({
                        latitude: appLatitude,
                        longitude: appLongitude
                    })
                }, 4000)

            }
            clientApi.getLocation({
                type, // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success(res) {
                    console.log('获取定位成功',res)
					appLatitude = res.latitude
					appLongitude = res.longitude
					try{
						uni.setStorageSync('appLatitude',appLatitude)
						uni.setStorageSync('appLongitude',appLongitude)
					}catch(e){
						//TODO handle the exception
					}
                    resolve(res)
                },
                fail(res) {
                    console.log('获取定位成功失败', { clientType },res)
                    if (clientType === '4') {
                        resolve({
                            latitude: appLatitude,
                            longitude: appLongitude
                        })
                        // uni.showModal({
                        // 	content: JSON.stringify(res)
                        // })
                    } else {
                        App.hideLoading()
                        let page = App.getCurrentPage()
                        if (page.$refs && page.$refs.permitView) {
                            let res = page.$refs.permitView.showChange()
                            if (!!!res) {
                                resolve({
                                    latitude: appLatitude,
                                    longitude: appLongitude
                                })
                            }
                        } else {
                            resolve({
                                latitude: appLatitude,
                                longitude: appLongitude
                            })
                        }
                    }
                }
            })
        })
    },

    /**
	 * 查看位置
	 */
    openLocation(options) {
        let App = this,
            getClientType = App.getClientType(),
            {
                latitude,
                longitude,
                name,
                address
            } = options
        if (latitude && longitude) {
            // let gps = util.baidu_To_qq(options.latitude, options.longitude);
            if (getClientType === '4') {
                wxApi.openLocation({
                    latitude, // 纬度，浮点数，范围为90 ~ -90
                    longitude, // 经度，浮点数，范围为180 ~ -180。
                    name, // 位置名
                    address, // 地址详情说明
                    scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: '', // 在查看位置界面底部显示的超链接,可点击跳转
                    success() {
                        options.success && options.success()
                    },
                    complete(res) {
                        console.log(res)
                        // uni.showToast({
                        // 	icon: "none",
                        // 	title: JSON.stringify(res)
                        // })
                    }
                })
            } else {
                uni.openLocation({
                    name,
                    address,
                    latitude,
                    longitude,
                    success() {
                        options.success && options.success()
                    }
                })
            }

        } else {
            App.showError('经纬度信息不完整,请确认后重试')
        }
    },

    /**
	 * 图片选择
	 */
    chooseImage(optinos) {
        let App = this,
            getClientType = App.getClientType()
        if (getClientType === '4') {
            const chooseSuccess = optinos.success
            delete optinos.success
            wxApi.chooseImage({
                ...optinos,
                async success(result) {
                    let localIds = result.localIds
                    if (localIds && localIds.length > 0) {
                        App.getLocalImgs(localIds).then(imgsData => {
                            chooseSuccess && chooseSuccess(imgsData)
                        })
                    }
                }
            })
        } else {
            uni.chooseImage(optinos)
        }
    },
    /**
	 * 获取待选择图片本地路径
	 */
    getLocalImgs(imgs, index = 0) {
        let App = this
        return new Promise((resolve, reject) => {
            let localIds = [],
                tempFilePaths = [];
            (function getLocalImgData(imgs, index) {
                wxApi.getLocalImgData(imgs[index], res => {
                    localIds.push(imgs[index])
                    let localData = res.localData
                    if (localData.indexOf('data:image') != 0) {
                        // 判断是否有这样的头部
                        localData = 'data:image/jpeg;base64,' + localData
                    }
                    localData = localData.replace(/\r|\n/g, '').replace('data:image/jgp', 'data:image/jpeg')
                    // 第一个替换的是换行符，第二个替换的是图片类型，因为在IOS机上测试时看到它的图片类型时jgp，
                    tempFilePaths.push(localData)
                    index += 1
                    if (index < imgs.length) {
                        console.log('index', index)
                        getLocalImgData(imgs, index)
                    } else {
                        resolve({
                            localIds,
                            tempFilePaths
                        })
                    }
                }, res => {
                    reject(imgs[index])
                })
            })(imgs, index)
        })
    },


    /**
	 * 扫码
	 */
    scanCode(optinos) {
        let clientType = this.getClientType()
        if (clientType === '4') {
            wxApi.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: [
                    'qrCode',
                    'barCode'
                ], // 可以指定扫二维码还是一维码，默认二者都有
                ...optinos
            })
        } else {
            uni.scanCode({
                ...optinos
            })
        }
    },

    /**
	 * 文本复制
	 */
    copyTextHandle(text) {
        if (!text) {
            return
        }
        uni.setClipboardData({
            data: text,
            success() {
                // #ifdef MP-ALIPAY || H5 || MP-TOUTIAO
                uni.showToast({
                    title: '复制成功'
                })
                // #endif
            }
        })
    },

    /**
	 * 获取活动当前状态
	 * @param {Number} startTime 活动开始时间
	 * @param {Number} endTime 活动结束时间
	 * @returns {Number} leftTime 剩余时间
	 * @returns {Number} status 活动状态 0-未开始 1-进行中 2-已结束
	 */
    getActivityStatus(startTime = 0, endTime = 0) {
        // 当前时间
        let nowTime = Math.round(new Date().getTime() / 1000), // 兼容后端秒级时间戳
            // 剩余时间
            leftTime = 0,
            // 当前活动状态
            status = 0,
            // 活动状态文字
            activityText = ''
        if (nowTime < startTime) { // 未开始
            status = 0
            leftTime = parseInt(startTime - nowTime)
            activityText = '活动未开始'
        } else if (startTime <= nowTime && nowTime < endTime) { // 进行中
            status = 1
            leftTime = parseInt(endTime - nowTime)
            activityText = '活动进行中'
        } else if (nowTime >= endTime) { // 已结束
            status = 2
            leftTime = 0
            activityText = '活动已结束'
        }
        return {
            status,
            activityText,
            leftTime
        }
    },
    /**
	 * 获取活动页面自定义分享设置
	 * @param {String} activityType 活动类型 goods商品,group拼团,lottery抽奖,bargain砍价,bonus红包
	 * @param {Object} activityDetail 活动数据
	 * @param {Object} pageData 页面$data
	 */
    getPageShareData(activityType, activityDetail, pageData = {}) {
        if (!activityType || !activityDetail) {
            return
        }

        let userInfo = uni.getStorageSync('userInfo') || Store.state.userInfo || {},
            clientType = this.getClientType(),
            sharePages = {
                goods: 'pages/subPages/goods/index/index',
                group: 'pages/subPages/groups/index/index',
                lottery: 'pages/subPages/drawlotter/index/index',
                bargain: 'pages/subPages/bargain/index/index',
                bonus: 'pages/subPages/bonus/index'
            },
            shareLink = null, // 页面分享链接
            pageParams = {
                referee_id: this.getUserId(),
                // #ifdef H5
                i: this.getUniacid()
                // #endif
            }, // 页面链接参数
            otherParams = null, // 分享其他参数
            pageDefaultShare = {}, // 页面默认分享数据
            shareTitle = null, // 页面分享标题
            shareImg = null, // 页面分享图片
            { // 分享设置
                activity_share = 10, // 是否自定义活动分享图片
                // share_image_id: [share_custom_image] = [], //自定义分享图片
                is_custom = 10, // 是否自定义分享文案
                custom_share_content = '', // 自定义文案
                name = '' // 活动名称
            } = activityDetail.share || {},
            share_custom_image = activityDetail.share && activityDetail.share.share_image_id && Array.isArray(activityDetail.share.
                share_image_id) &&
			activityDetail.share.share_image_id.length > 0 ? activityDetail.share.share_image_id[0] : {}

        // 分享数据处理
        if (activityType === 'goods') {
            let {
                goods_id,
                spike_id,
                group_id,
                bargain_id,
                goods_name: title, // 分享标题
                selling_point: desc, // 分享描述
                image: [imageUrl] // 分享图标
            } = activityDetail
            // 附加参数
            otherParams = {
                goods_id,
                spike_id,
                group_id,
                bargain_id
            }
            // 删除空值
            otherParams = util.removeEmpty(otherParams)
            // 默认分享
            pageDefaultShare = {
                title,
                desc,
                imageUrl
            }
        } else if (activityType === 'group') {
            let {
                    goods_name: title, // 分享标题
                    selling_point: desc, // 分享描述
                    image: [imageUrl] // 分享图标
                } = activityDetail, {
                    order_id,
                    orther_id,
					groups_group_id
                } = pageData
			if(groups_group_id) {
				// 附加参数
				otherParams = {
				    groups_group_id,
				    orther_id,
				}
			}else {
				otherParams = {
				    order_id,
				    orther_id,
					
				}
			}
            
            // 默认分享
            pageDefaultShare = {
                title,
                desc,
                imageUrl
            }

        } else if (activityType === 'lottery') {
            let {
                luck_id,
                luck_title,
                period_id,
                image: [imageUrl] // 分享图标
            } = activityDetail // 附加参数
            otherParams = {
                luck_id,
                period_id,
                main_user_id: this.getUserId()
            }
            // 默认分享
            pageDefaultShare = {
                title: clientType === '4' ? luck_title : `${userInfo.nickName}邀请您参与抽奖~`,
                desc: `${userInfo.nickName}邀请您参与抽奖~`,
                imageUrl
            }
        } else if (activityType === 'bargain') {
            let {
                group_id,
                goods: {
                    goods_name: title, // 分享标题
                    selling_point: desc, // 分享描述
                    image: [imageUrl] // 分享图标
                }
            } = activityDetail
            // 附加参数
            otherParams = {
                group_id
            }
            // 默认分享
            pageDefaultShare = {
                title,
                desc,
                imageUrl
            }

        } else if (activityType === 'bonus') {
            let {
                    id,
                    name
                } = activityDetail, {
                    showSatus,
                    bonusTypeText
                } = pageData
            // 附加参数
            otherParams = {
                [showSatus === 1 ? 'active_id' : 'bonus_id']: id
            }

            // 默认分享
            pageDefaultShare = {
                title: clientType === '4' ? name : `${userInfo.nickName}邀请您参与抽奖~`,
                desc: `${userInfo.nickName}邀请您一起${bonusTypeText}红包`,
                imageUrl: ''
            }
        }

        // 合并分享数据
        pageParams = Object.assign(pageParams, otherParams)

        // 分享参数赋值
        shareLink = `/${sharePages[activityType]}?${this.urlEncode(pageParams)}`
        shareTitle = is_custom === 20 ? custom_share_content : pageDefaultShare.title
        shareImg = activity_share === 20 ? share_custom_image && share_custom_image.file_path : pageDefaultShare.imageUrl &&
			pageDefaultShare.imageUrl.file_path

        if (clientType === '4') {
            return {
                title: shareTitle, // 分享标题
                desc: pageDefaultShare.desc || '', // 分享描述
                link: `${this.siteInfo.siteroot}h5/#${shareLink}`,
                imgUrl: shareImg
            }
        }
        return {
            title: shareTitle,
            imageUrl: shareImg,
            path: shareLink
        }

    },
    /**
	 * 自定义默认统一分享
	 * @param {String} referee_id
	 * @param {String} nowPath 点击分享进入的链接地址
	 */
    customDefaultShare(referee_id, nowPath) {
        // #ifdef H5
        let clientType = App.getClientType()
        if (clientType === '4') {
            let {
                share_title,
                share_describe,
                wechat_share_image,
                app_share_image
            } = util.deepGet(Store.getters, 'getappSetting.share', {})
            const optionsNew = {
                i: App.getUniacid(),
                referee_id: referee_id
            }
            wxApi.wxRegister()
            wxApi.wxShare({
                title: share_title, // 分享标题
                desc: share_describe, // 分享描述
                link: `${nowPath}?${App.urlEncode(optionsNew)}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: util.deepGet(app_share_image, '0.file_path', '')
            })
        }
        // #endif
    }
}
export default {
    ...App
}
