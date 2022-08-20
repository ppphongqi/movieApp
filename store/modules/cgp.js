import App from '@/common/js/app.js'
import Util from '@/common/js/util.js'

// 更新队列（下一次需要更新数量的商品）
let goodsUpdateQueue = {

}

// 社区团购专用vuex模块
export default {
    namespaced: true,
    state: {
        // 社区团购的设置
        setting: {},
        // 购物车列表的接口数据
        cartGoodsListRes: {
            goods_rows: []
        }
    },
    mutations: {
        SET_SETTING(state, setting = {}) {
            state.setting = setting
        },
        SET_CART_GOODS_LIST_RES(state, cartGoodsListRes = {}) {
            state.cartGoodsListRes = cartGoodsListRes
        },
        // 根据id设置本地购物车对应商品数量
        SET_CART_GOODS_NUM_BY_ID(state, {
            id,
            num
        }) {
            console.log('根据id设置本地购物车对应商品数量')
            const list = state.cartGoodsListRes.goods_rows || []
            const goods = list.find(item => item.goods_id === id)
            if (goods) {
                console.log('根据id设置本地购物车对应商品数量:1：num')
                goods.goods_num = num
            } else {
                console.log('根据id设置本地购物车对应商品数量:2：num')
                state.cartGoodsListRes.goods_rows.push({
                    goods_id: id,
                    goods_num: num
                })
            }
        }
    },
    actions: {
        // 请求社区团购设置
        async fetchSetting({
            commit
        }) {
            try {
                const res = await App._getP('cgp.Index/cgpSetting')
                commit('SET_SETTING', res.data || {})
                return Promise.resolve(res)
            } catch (e) {
                return Promise.reject(e)
                // TODO handle the exception
            }
        },
        // 请求购物车列表数据
        async fetchCartGoodsListRes({
            commit
        }) {
            try {
                const res = await App._getP('cgp.Cart/cartIndex')
                commit('SET_CART_GOODS_LIST_RES', res.data || {})
                return Promise.resolve(res)
            } catch (e) {
                return Promise.reject(e)
                // TODO handle the exception
            }
        },
        // 清空购物车列表数据
        async clearCartGoodsListRes({
            commit
        }) {
            try {
                const res = await App._getP('cgp.Cart/clear')
                commit('SET_CART_GOODS_LIST_RES', {
                    goods_rows: []
                })
                return Promise.resolve(res)
            } catch (e) {
                return Promise.reject(e)
                // TODO handle the exception
            }
        },
        // 加入购物车
        doUpdateCart({
            commit,
            dispatch
        }, {
            goods_id,
            goods_sku_id,
            all_num
        }) {
            // 预先更新本地购物车对应商品数据量
            commit('SET_CART_GOODS_NUM_BY_ID', {
                id: goods_id,
                num: all_num
            })
            // 更新等待队列中的对应项
            goodsUpdateQueue[goods_id] = {
			    goods_id,
			    goods_sku_id,
			    all_num
            }
            // 发起队列请求
            dispatch('debounceUpdateCartGoodsNumByQueue', {
                goods_id,
                goods_sku_id,
                all_num
            })
        },
        // 更新队列 解决不断快速同时添加a，b两个商品 有个商品添加不上的问题
        debounceUpdateCartGoodsNumByQueue: Util.debounceNew(async function ({
            commit,
            dispatch
        }, {
            goods_id,
            goods_sku_id,
            all_num
        }) {
            console.log('goodsUpdateQueue', goodsUpdateQueue)
            // 所有需要修改的goods的数据
            const allGoods = Object.keys(goodsUpdateQueue).map(key => goodsUpdateQueue[key])
            // 清空等待队列
            goodsUpdateQueue = {}
            // 发起请求
            try {
                const res = await App._postP('cgp.Cart/add', {
                    goods: JSON.stringify(allGoods)
                })
                if (res.data && res.data.error) {
                    res.data.error.forEach(msg => {
                        App.showError(msg)
                    })
                }
                // 更新购物车列表
                dispatch('fetchCartGoodsListRes')
            } catch (e) {
                console.log('throttleUpdateCartGoodsNumByQueue', e)
                // TODO handle the exception
            }
        }, 200),
        // 修改购物车商品数据（不要用这个方法）
        throttleUpdateCartGoodsNum: Util.throttle(async function ({
            commit,
            dispatch
        }, {
            goods_id,
            goods_sku_id,
            all_num
        }) {
            try {
                // 请求接口更新购物车商品对应数量
                const res = await App._postP('cgp.Cart/add', {
                    goods_id,
                    goods_sku_id,
                    all_num: +all_num
                }).catch(() => {})
                // 不管成功失败 更新购物车列表
                dispatch('fetchCartGoodsListRes')
            } catch (e) {
                console.log('throttleAddCart', e)
                // TODO handle the exception
            }
        }, 1000)
    }
}
