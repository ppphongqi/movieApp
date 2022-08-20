// 提成mixin并不合适 但够用
/**
 * 主要功能点 检查全局设置里面有没有开代理
 * 有开代理就要根据当前定位选择最近的代理
 */
import App from '@/common/js/app.js'
export default {
    data() {
        return {
            // 当前地址的接口数据
            agentMixin_locationRes: {},
            // 代理的接口数据
            agentMixin_aidRes: {}
        }
    },
    computed: {
        // 是否开启了代理
        agentMixin_cAgentOpen() {
            return +this.$util.deepGet(this.settingData, 'agent_open') === 1
        },
        // 代理的名称
        agentMixin_cAgentName() {
            return this.$util.deepGet(this.agentMixin_aidRes, 'areaname', '正在定位')
        },
        // 当前位置的名称
        agentMixin_cLocationName() {
			try{
				return this.agentMixin_locationRes.result.addressComponent.city
			}catch(e){
				//TODO handle the exception
				return ''
			}
		    
        }
    },
    methods: {
        // 提示切换代理如果有必要的话(请在全局设置请求完毕后调用)
        async agentMixin_checkAgentIfNeeded() {
            if (+this.$util.deepGet(this.settingData, 'agent_open') === 1) {
                try {
                    await this.agentMixin_fetchAidRes()
                    await this.agentMixin_checkAgent()
                } catch (e) {
                    // TODO handle the exception
                }
            } else {
                try {
				    await this.agentMixin_fetchLocationRes()
                } catch (e) {
				    // TODO handle the exception
                }
            }
        },
        async agentMixin_checkAgent() {
            try {
                // 获取当前位置
                const location = await App.getLocation()
                if (!location.latitude || !location.longitude) {
                    // App.showError('获取当前位置失败，请稍候或检查定位设置后重试')
                    return
                }
                // 获取aid
                const res = await App._postP('agent.index/aidTip', {
                    lat: location.latitude,
                    lng: location.longitude
                })
                const data = this.$util.deepGet(res, 'data') || {}
                const self = this
                if (+data.status === 3) {
                    // #ifdef MP-WEIXIN
                    // 存储Storage
                    uni.setStorageSync('aid', {
                        ...data,
                        aid: 0
                    })
                    App.setSiteInfo()
                    // 刷新页面
                    self.getPageData()
                    self.getData()
                    // #endif
                    // #ifdef H5
                    console.log('h5重启', window.location.href)
                    // window.location.href = self.$util.changeURLArg(window.location.href,'aid',0)
                    window.location.replace(self.$util.changeURLArg(window.location.href, 'aid', 0))
                    window.location.reload()
                    // #endif
                } else if (+data.status === 1 && this.settingData && this.settingData.agent_tip_switch == 1) {
                    uni.showModal({
                        title: '友情提示',
                        content: `定位到您在${data.areaname},是否切换到该地区？`,
                        success(res) {
													try {
														if (!res.confirm) {
														    return
														}
														console.log('success', res)
														
														console.log('友情提示', data)
														// #ifdef MP-WEIXIN
														// 存储Storage
														uni.setStorageSync('aid', data)
														App.setSiteInfo()
														// 刷新页面
														self.getPageData()
														self.getData()
														// #endif
														// #ifdef H5
														console.log('h5重启', window.location.href)
														window.location.replace(self.$util.changeURLArg(window.location.href, 'aid', data.aid))
														window.location.reload()
														// #endif
													}catch(error){
														 
													}
                            
                        }
                    })
                }else if(+data.status === 1 && this.settingData && this.settingData.agent_auto_switch == 1) {
					const lastAutoSwitchTime = uni.getStorageSync('lastAutoSwitchTime') || 0
					console.log('lastAutoSwitchTime',lastAutoSwitchTime,+new Date()-lastAutoSwitchTime)
					if(+new Date()-lastAutoSwitchTime < 1000*60*60*24) {
						console.log('lastAutoSwitchTime 一天内只自动切换一次')
						// 一天内只自动切换一次
						return
					}
					uni.setStorageSync('lastAutoSwitchTime',+new Date())
					// #ifdef MP-WEIXIN
					// 存储Storage
					
					uni.setStorageSync('aid',data)
					App.setSiteInfo()
					// 刷新页面
					this.pageOptions = {}
					self.getPageData()
					self.getData()
					// #endif
					// #ifdef H5
					console.log('h5重启',window.location.href)
					window.location.replace(self.$util.changeURLArg(window.location.href,'aid',data.aid))
					window.location.reload()
					// #endif
				}
            } catch (e) {
                // TODO handle the exception
            }
        },
        async agentMixin_fetchAidRes() {
            try {
                // 获取当前位置
                const location = await App.getLocation()
                if (!location.latitude || !location.longitude) {
                    // App.showError('获取当前位置失败，请稍候或检查定位设置后重试')
                    // return
                }
                // 获取aid
                const res = await App._postP('agent.index/getAid', {
                    lat: location.latitude,
                    lng: location.longitude
                })
                this.agentMixin_aidRes = res.data || {}
                // 存储aid信息到localStorage
                uni.setStorageSync('aid', res.data || {})
                // 更新app.siteInfo
                App.setSiteInfo()
            } catch (e) {
                console.log('fetchAidRes error', e)
                // TODO handle the exception
            }
        },
        async agentMixin_fetchLocationRes() {
		    try {
		        // 获取当前位置
		        const location = await App.getLocation()
		        if (!location.latitude || !location.longitude) {
		            // App.showError('获取当前位置失败，请稍候或检查定位设置后重试')
		            return
		        }
		        // 获取aid
		        const res = await App._postP('agent.index/getLocation', {
		            lat: location.latitude,
		            lng: location.longitude
		        })
		        this.agentMixin_locationRes = res.data || {}
				this.agentMixin_locationRes = {
					...this.agentMixin_locationRes
				}
                console.log('agentMixin_fetchLocationRes success', this.agentMixin_locationRes)
		        // 存储aid信息到localStorage
		    } catch (e) {
		        console.log('fetchAidRes error', e)
		        // TODO handle the exception
		    }
        }
    }

}
