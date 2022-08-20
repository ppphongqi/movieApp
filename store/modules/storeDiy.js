import App from '@/common/js/app.js'

export default {
	namespaced: true,
	state: {
		// 商圈的接口数据
		cateListRes: [],
		cateListResLoading: false,
	},
	mutations: {
		SET_CATE_LIST_RES(state, cateListRes = []) {
			state.cateListRes = cateListRes
		},
		SET_CATE_LIST_RES_LOADING(state,cateListResLoading) {
			state.cateListResLoading = cateListResLoading
		}
	},
	actions: {
		// 请求商圈的接口数据
		async fetchCateListResIfNeeded({
			state,
			commit
		},{
			force
		}={}) {
			if((!force && state.cateListRes.length) || state.cateListResLoading) {
				return
			}
			try {
				commit('SET_CATE_LIST_RES_LOADING',true)
				const res = await App._getP('circle.Businesscircle/getBusinessCircle')
				commit('SET_CATE_LIST_RES', res.data || [])
				commit('SET_CATE_LIST_RES_LOADING',false)
				return Promise.resolve(res)
			} catch (e) {
				commit('SET_CATE_LIST_RES_LOADING',false)
				return Promise.reject(e)
				// TODO handle the exception
			}
		},
	}
}
