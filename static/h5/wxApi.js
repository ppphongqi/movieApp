import App from '@/common/js/app.js'
import Util from '@/common/js/util.js'
import store from '@/store/index.js'
const wxApi = {
    configData: null,
    timer: null,
    shareOptions: null,
    /**
	 * [wxRegister 微信Api初始化]
	 */
    wxRegister(callback) {
        let _this = this,
            signUrl = encodeURIComponent(location.href.split('#')[0]),
            jsApiList = [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'updateAppMessageShareData',
                'updateTimelineShareData',
                'openBusinessView',
                'scanQRCode',
                'getLocation',
                'openLocation',
                'chooseWXPay',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'getLocalImgData',
                'hideMenuItems',
                'showMenuItems'
            ]
        App._post_form('Setting/getWeChatShareInfo', {
            sign_url: signUrl
        }, res => {
            let data = res.data
            jWeixin.config({
                debug: false, // 开启调试模式
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature, // 必填，签名
                jsApiList: jsApiList // 必填，需要使用的JS接口列表
            })

            _this.configData = {
                ...data,
                url: signUrl
            }

            jWeixin.ready(() => {
                callback && callback()
            })

            jWeixin.error(optinos => {
                console.log(optinos, '配置错误信息')
                // config信息验证失败会执行error函数，
                // 如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，
                // 也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                clearTimeout(_this.timer)
                _this.timer = setTimeout(() => {
                    _this.wxRegister()
                }, 500)
            })
        })
    },
    wxShare(options) {
        const host = Util.deepGet(store.state.appSetting, 'oauth_domain', '') || location.host
        const link = options.link.replace(/:\/\/(.*?)\//, `://${host}/`)
        // const imgUrl = options.imgUrl.replace(/:\/\/(.*?)\//, `://${host}/`)
        this.shareOptions = {
            ...options,
            link
        }
        console.log('wxShare this.shareOptions', this.shareOptions)
        jWeixin.updateAppMessageShareData(this.shareOptions)
        jWeixin.updateTimelineShareData(this.shareOptions)
        jWeixin.onMenuShareAppMessage(this.shareOptions)
        jWeixin.onMenuShareTimeline(this.shareOptions)
        // jWeixin.ready(() => {
        // 	jWeixin.onMenuShareAppMessage({
        // 		title: options.title, // 分享标题
        // 		desc: options.desc, // 分享描述
        // 		link: options.link, // 分享链接
        // 		imgUrl: options.imgUrl, // 分享图标
        // 		success(res) {
        // 			// 用户点击了分享后执行的回调函数
        // 		}
        // 	});
        // 	jWeixin.onMenuShareTimeline({
        // 		title: options.title, // 分享标题
        // 		link: options.link, // 分享链接
        // 		imgUrl: options.imgUrl, // 分享图标
        // 		success() {
        // 			// 设置成功
        // 		}
        // 	})
        // });
    },
    wxPay(options) {
        jWeixin.chooseWXPay({
            timestamp: options.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: options.nonceStr, // 支付签名随机串，不长于 32 位
            package: options.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: options.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: options.paySign, // 支付签名
            success(res) {
                // 支付成功后的回调函数
                options.success && options.success(res)
            },
            cancel(res) {
                options.cancel && options.cancel(res)
            },
            fail(res) {
                options.fail && options.fail(res)
            }
        })
    },
    scanQRCode(optinos) {
        jWeixin.scanQRCode(optinos)
    },
    uploadImage(optinos) {
        jWeixin.uploadImage(optinos)
    },
    chooseImage(optinos) {
        jWeixin.chooseImage(optinos)
    },
    getLocalImgData(localId, success, fail) {
        jWeixin.getLocalImgData({
            localId, // 图片的localID
            success: function (res) {
                console.log('success', res)
                success && success(res)
            },
            fail: function (res) {
                fail && fail(res)
            }
        })
    },
    openLocation(optinos) {
        jWeixin.openLocation(optinos)
    },
    getLocation(optinos) {
        jWeixin.getLocation(optinos)
    },
    /**
	 * 微信好物圈
	 */
    wxGoodsCircle(queryString, success, fail) {
        jWeixin.openBusinessView({
            businessType: 'friendGoodsRecommend',
            queryString: queryString,
            success(res) {
                success && success(res)
            },
            fail(res) {
                fail && fail(res)
            }
        })
    }
}
export default wxApi
