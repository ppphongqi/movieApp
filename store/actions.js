import App from '@/common/js/app.js'
const action = {
    getTabBarData({
        commit
    }) {
        let _this = this
        App._post_form('diy.Diy/getNavigationMenu', {}, res => {
            let tabBarData = res.data[0],
                sotrList = res.data.name_list,
                checkList = tabBarData.checkList,
                data = tabBarData.menu.data,
                style = tabBarData.menu.style,
                list = new Array(Object.keys(data).length)
            for (let key in data) {
                let tabItem = data[key],
                    item = {
                        name: tabItem.name,
                        pagePath: tabItem.linkurl,
                        text: tabItem.text,
                        iconPath: tabItem.iconPath.file_path,
                        selectedIconPath: tabItem.iconactivePath.file_path
                    }
                list[Number(tabItem.order) - 1] = item
            }
            commit('hiddenTabBar', true)
            uni.setStorageSync('tabBar', {
                style,
                list,
                checkList
            })
            commit('setTabbar', {
                style,
                list,
                checkList
            })
        }, () => {
            if (!_this.state.tabBar) {
                _this.dispatch('getTabBarData')
            }
        })
    },
    getTabBarMenu({ commit }) {
        App._post_form('diy.Diy/getMenu', {}, res => {
            const checkList = res.data
            console.log(checkList, '111111111111111111111===============')
            checkList.forEach(item => {
                let { menu: { data, style }, source } = item.values,
				    tabList = []
			    for (let key in data) {
                    let tabItem = data[key],
                        item = {
                            name: tabItem.name,
                            pagePath: tabItem.linkurl,
                            text: tabItem.text,
                            iconPath: tabItem.iconPath.file_path,
                            selectedIconPath: tabItem.iconactivePath.file_path
                        }
                    tabList[Number(tabItem.order) - 1] = item
                }

                item.tabList = tabList
                item.style = style
                item.source = source
            })
            console.log(checkList, '2222222222222222222222===============')
            commit('hiddenTabBar', true)
            uni.setStorageSync('tabBar', {
                checkList
            })
            commit('setTabbar', {
                checkList
            })


        })
    },
    getTheme({ commit }) {
        let theme_color = '#FFD940',
            help_color = '#FF4444',
            auxiliary_color = '#333',
            theme = `--theme-color:${theme_color};--help-color:${help_color}; --auxiliary-color:${auxiliary_color};`
        App._post_form(
            'diy.Diy/getThemeInfo', {}, res => {
                theme_color = res.data.theme_color ? res.data.theme_color : '#FFD940'
                help_color = res.data.help_color ? res.data.help_color : '#FF4444'
                auxiliary_color = res.data.auxiliary_color ? res.data.auxiliary_color : '#333'
		    theme = `--theme-color:${theme_color};--help-color:${help_color}; --auxiliary-color:${auxiliary_color};`

            }, res => {

            },
            res => {

                uni.setStorageSync('theme', theme)
                uni.setStorageSync('top-color', theme_color)
                uni.setStorageSync('auxiliary_color', auxiliary_color)
                commit('setTheme', theme)
                commit('setTopColor', theme_color)
                commit('setAuxiliaryColor', auxiliary_color)

            }
        )

    },
    getAppSetting({
        commit
    }) {
        let uniacid = App.getUniacid(),
            clientType = App.getClientType()
        App._get('setting/index', {
            edition: App.siteInfo.edition
        }, res => {
            console.log('分享调接口-------', res)
            if (!res.data.switch) {
                // #ifdef H5
                // document.title = res.data.name;
                // #endif
                uni.setStorageSync('appSetting', res.data)
                commit('setAppSetting', res.data)
            }
            if (res.data.switch === '0' && (clientType === '3' || clientType === '4') && location.href.indexOf('pages/mainPages/index/diypage') > 0) {
                uni.reLaunch({
                    url: '/pages/mainPages/index/diypage?i=' + uniacid + '&page_id=' + location.href.split('&')[1].split('=')[1]
                })
                return
            }
            if (res.data.switch === '0') {
                uni.reLaunch({
                    url: '/pages/mainPages/index/resting?i=' + uniacid
                })
            }
        })
    },
    getShareSetting({
        commit
    }) {
        App._get('user.index/getShareSetting', {
            no_login: 1
        }, optinos => {
            commit('setShareSetting', optinos.data)
        })
    }
}
export default action
