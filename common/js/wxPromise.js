import util from './util.js'
import {
    sleep
} from './sleep.js'

// https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.getSetting.html
export const wxGetSetting = ({
    withSubscriptions = false
} = {}) => new Promise((resolve, reject) => {
    uni.getSetting({
        withSubscriptions,
        success(res) {
            resolve(res)
        },
        fail(err) {
            reject(err)
        }
    })
})

// https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html
export const wxRequestSubscribeMessage = ({
    tmplIds
}) => new Promise((resolve, reject) => {
    wx.requestSubscribeMessage({
        tmplIds,
        success(res) {
            resolve(res)
        },
        fail(err) {
            reject(err)
        }
    })
})

/**
 * 更高级的订阅消息
 * 应该规范一下这个方法的返回值
 *
 * 很多地方忽略tmplIds是个数组需要修改
 *
 * 如果出现requestSubscribeMessage:fail can only be invoked by user TAP gesture.请参考https://developers.weixin.qq.com/community/develop/article/doc/00066e97bb8dc0d1720b1a8f75fc13或者https://developers.weixin.qq.com/community/develop/doc/000e4eb6780138f6168a74dcd51800?highLine=requestSubscribeMessage%253Afail%2520can%2520only%2520be%2520invoked%2520by%2520user%2520TAP%2520gesture.
 */
export const wxRequestSubscribeMessageX = async ({
    tmplIds = [],
    showMessage = true
}) => {
    if (!tmplIds.length) {
        showMessage && uni.showToast({
            icon: 'none',
            title: '没有订阅模板'
        })
        return Promise.reject()
    }
    uni.showLoading({
        mask: true,
        title: '请稍后'
    })
    try {
        // 获取当前订阅的配置
        const setting = await wxGetSetting({
            withSubscriptions: true
        }).catch(() => Promise.resolve({}))
        const lastestStatus = util.deepGet(setting, `subscriptionsSetting.itemSettings[${tmplIds[0]}]`)

        uni.hideLoading()
        // 发起订阅
        const res = await wxRequestSubscribeMessage({
            tmplIds
        })
        const status = util.deepGet(res, tmplIds)
        // 判断订阅的状态
        if (status === 'accept') {
            showMessage && uni.showToast({
                icon: 'none',
                title: '订阅成功'
            })
        } else if (status === 'reject' && lastestStatus === 'reject') {
            const err = new Error()
            // 20004标识需要打开订阅消息
            err.errCode = 20004
            throw err
        } else if (status === 'reject') {
            showMessage && uni.showToast({
                icon: 'none',
                title: '取消'
            })
            return Promise.reject()
        } else {
            showMessage && uni.showToast({
                icon: 'none',
                title: '订阅成功'
            })
        }
    } catch (error) {
        console.log('哈哈', error)
        uni.hideLoading()
        const errCode = util.deepGet(error, 'errCode')
        if (errCode === 20004) {
            showMessage && uni.showModal({
                title: '温馨提示',
                content: '点击小程序右上角「...」，选择「设置」，在「订阅消息」打开「接收订阅消息」和「相应消息模板」',
                showCancel: false
            })
        } else {
            showMessage && uni.showToast({
                icon: 'none',
                title: error.message || error.errMsg || '订阅失败'
            })
        }
        return Promise.reject(error)
    }
}
