import App from '@/common/js/app.js'
import ShareGuide from '@/components/template/ShareGuide.vue'
// #ifdef H5
import wxApi from '@/static/h5/wxApi.js'
// #endif
let mixin = {
	data() {
		return {
			shareData: null,
			// 是否使用Promise https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object
			pageShareMixin_usePromise: false
		}
	},
	// #ifdef H5
	components: {
		ShareGuide
	},
	watch: {
		shareData(newValue) {
			console.log('pageShareMixin 新的分享参数', newValue)
			// #ifdef H5
			if (!!newValue) {
				wxApi.wxShare({
					success: ()=> {
						this.pageShareMixin_afterShare()
					},
					...newValue
				})
			}
			// #endif
		}
	},
	// #endif
	methods: {
		// 点击了分享需要执行的事件
		pageShareMixin_afterShare() {
			console.log('pageShareMixin_afterShare')
		},
		// 在当前页面隐藏分享按钮
		pageShareMixin_hideShare() {
			// #ifdef H5
			const menuList = [
				'menuItem:share:appMessage',
				'menuItem:share:timeline'
			]
			jWeixin.ready(() => {
				jWeixin.hideMenuItems({
					menuList
				})
				uni.$once('beforeDestroy', () => {
					jWeixin.showShareMenu({
						menuList
					})
				})
			})
			// #endif
		},
		pageShareMixin_showShare() {
			// #ifdef H5
			const menuList = [
				'menuItem:share:appMessage',
				'menuItem:share:timeline'
			]
			jWeixin.ready(() => {
				jWeixin.showMenuItems({
					menuList
				})
			})
			// #endif
		},
		// 在H5中打开分享引导提示
		pageShareMixin_openShareGuideInH5() {
			// #ifdef H5
			try {
				this.$refs.shareGuide.showChange()
			} catch (e) {
				console.log(e)
				// TODO handle the exception
			}

			// #endif
		},
		// 用于替代getPageShareData的方法
		pageShareMixin_createShareData({
			// 分享路径,格式为/pages/subPages/dealer/apply/apply
			url = '',
			// 查询参数，将会萍姐在url后面
			query = {},
			// 封面图
			imgUrl = '',
			// 描述
			desc = '',
			// title标题
			title = ''
		} = {}) {
			console.log('createShareData', {
				url,
				query,
				imgUrl,
				desc,
				title
			})
			// 处理查询参数
			let defaultQuery = {}

			// #ifdef H5
			defaultQuery = {
				referee_id: App.getUserId(),
				i: App.getUniacid(),
				aid: App.siteInfo.aid || ''
			}
			// #endif

			// #ifdef MP
			defaultQuery = {
				referee_id: App.getUserId()
			}
			// #endif
			// 合并成最终的查询参数
			const newQuery = this.$util.removeEmpty({
				...defaultQuery,
				...query
			})

			// 得到默认值

			// 最终的分享链接
			let link = ''
			if (url) {
				link = `${url}?${App.urlEncode(newQuery)}`
			} else {
				const pages = getCurrentPages()
				const page = pages[pages.length - 1]
				link = `/${page.route}?${App.urlEncode(newQuery)}`
			}

			// 返回最终的值
			// #ifdef H5
			return this.$util.removeEmpty({
				title,
				imgUrl,
				link: `${App.siteInfo.siteroot}h5/#${link}`,
				desc
			})
			// #endif

			// #ifdef MP
			return this.$util.removeEmpty({
				title,
				imageUrl: imgUrl,
				path: link,
				desc,
			})
			// #endif
		},
		getPageShareData(sharePage, customizeShare, otherParams = {}) {
			console.log(sharePage, customizeShare, 'customizeShare')
			let shareData = null,
				userInfo = uni.getStorageSync('userInfo'),
				isWeXin = this.appClientType === '4',
				pageParams = {
					referee_id: App.getUserId(),
					// #ifdef H5
					i: App.getUniacid()
					// #endif
				}, // 页面链接参数
				pagesData = {
					'dealer/index': {
						link: 'pages/subPages/dealer/apply/apply',
						share: {
							title: `成为${this.dealerDiyFont.fxs}~`,
							describe: `邀请您成为${this.dealerDiyFont.fxs}~`
						}
					},
					'dealer/goods': {
						link: 'pages/subPages/dealer/index/goods',
						share: {
							title: '购买商品',
							describe: '邀请您购买商品~'
						}
					},
					'member/index': {
						link: 'pages/subPages/member/index/index',
						share: {
							title: '开通会员卡',
							describe: '邀请您开通会员卡~'
						}
					},
					'merchant/enter': {
						link: 'pages/subPages/merchant/enter/enter',
						share: {
							title: '商家入驻',
							describe: '邀请您入驻本平台~'
						}
					},
					'live/index': {
						link: 'pages/subPages/live/index',
						share: {
							title: '直播分享',
							describe: '邀请您分享直播间'
						}
					},
					'formerlotterlist/index': {
						link: 'pages/subPages/drawlotter/formerlotterlist/index',
						share: {
							title: '抽奖分享',
							describe: '邀请您参与抽奖'
						}
					},
					'fabulous/index': {
						link: 'pages/subPages/fabulous/index',
						share: {
							title: '点赞分享',
							describe: '邀请您参与点赞活动~'
						}
					},
					'drawlotterlist/drawlotterlist': {
						link: 'pages/subPages/drawlotter/drawlotterlist/drawlotterlist',
						share: {
							title: '活动分享',
							describe: '邀请您参与活动~'
						}
					},
					'subPages/couponCenter/index': {
						link: 'subPages/couponCenter/index',
						share: {
							title: '领券中心',
							describe: '邀请您领取优惠券'
						}
					}
				},
				defaultData = this.$util.deepGet(pagesData[sharePage], 'share', {}),
				{
					title: shareTitle,
					describe: shareDesc,
					cover_image: [shareImg] = []
				} = customizeShare || defaultData,
				shareLink = ''

			// [shareTitle, shareDesc, shareImg] = this.$util.objectValues();
			// shareTitle = shareTitle?shareTitle: isWeXin ? userInfo.nickName : `${userInfo.nickName}邀请您${pagesData[sharePage].share.shareTitle}~`;

			if (!shareImg) {
				shareImg = {
					file_path: userInfo.avatarUrl
				}
			}

			// 合并分享数据
			pageParams = Object.assign(pageParams, otherParams)
			// 删除空值
			otherParams = this.$util.removeEmpty(otherParams)
			// 分享参数赋值
			const pageUrl = this.$util.deepGet(pagesData, `${sharePage}.link`)
			shareLink = `/${pageUrl}?${App.urlEncode(pageParams)}`
			if (isWeXin) {
				return {
					title: shareTitle || `${userInfo.nickName}`, // 分享标题
					desc: shareDesc || `邀请您${defaultData.title}~`, // 分享描述
					link: `${App.siteInfo.siteroot}h5/#${shareLink}`,
					imgUrl: shareImg.file_path
				}
			}
			return {
				title: shareTitle || `${userInfo.nickName}邀请您${defaultData.title}~`,
				imageUrl: shareImg.file_path,
				path: shareLink
			}

		}
	},
	/**
	 * 分享商品
	 */
	onShareAppMessage(res) {
		if (this.pageShareMixin_usePromise) {
			console.log('使用promise分享')
			return {
				...this.shareData,
				// 如果该参数存在，则以 resolve 结果为准，如果三秒内不 resolve，分享会使用上面传入的默认参数
				// 如果需要自定义promise，那么pageShareMixin_usePromise可以设置为false，在shareData中定义promise即可
				promise: new Promise(resolve => {
					setTimeout(() => {
						resolve(this.shareData)
						this.pageShareMixin_afterShare()
					}, 0)
				})
			}
		}
		this.pageShareMixin_afterShare()
		return this.shareData
	}
}

export default mixin
