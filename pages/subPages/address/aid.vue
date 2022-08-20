<template>
	<view class="page-aid-city">
		<!-- sticky header -->
		<u-sticky h5-nav-height="0" bg-color="#FFFFFF">
			<!-- 搜索 -->
			<view class="search-wrapper">
				<view class="search-wrapper__left">
					<view class="search-wrapper__icon iconfont icon-search"></view>
					<input v-model="keyword" class="search-wrapper__input" placeholder-class="is-placeholder" placeholder="输入城市名或拼音查询"
					 type="text" maxlength="99" />
					<view v-if="keyword" class="search-wrapper__icon iconfont icon-guanbi" @click="handleBtnSearchClearClick"></view>
				</view>
				<view class="search-wrapper__right" @click="handleBtnSearchClick">搜索</view>
			</view>
			<!-- 搜索 end -->
		</u-sticky>
		<!-- sticky header end -->
		<!-- 目前搜索的城市 -->
		<block v-if="citiesSearchedVisible">
			<view class="cities-list">
				<view class="cities-list__header">
					目前搜索的城市
				</view>
				<view class="cities-list__content">
					<view
						v-for="item in cSitiesSearchedData"
						:key="item.id"
						class="cities-item"
						@click="handleCityItemClick(item)">
						<view class="cities-item__text">{{item.name}}</view>
					</view>
				</view>
			</view>
		</block>
		<!-- 目前搜索的城市 end -->
		<block v-else>
			<!-- 当前位置 -->
			<view class="cities-list">
				<view class="cities-list__header">
					当前位置
				</view>
				<view class="cities-list__content">
					<view class="cities-item is-active" @click="handleCityItemClick(cCurrentCityData)">
						<view class="cities-item__icon iconfont iconfont icon-dingweixiao"></view>
						<view class="cities-item__text">{{cCurrentCityData.name}}</view>
					</view>
				</view>
			</view>
			<!-- 当前位置 end -->
			<!-- 最近访问的城市 -->
			<view class="cities-list">
				<view class="cities-list__header">
					最近访问的城市
				</view>
				<view class="cities-list__content">
					<view
						v-for="item in recentCities"
						:key="item.agent_id"
						class="cities-item"
						@click="handleCityItemClick(item)">
						<view class="cities-item__text">{{item.name}}</view>
					</view>
				</view>
			</view>
			<!-- 最近访问的城市 end -->
			<!-- 热门城市 -->
			<view class="cities-list">
				<view class="cities-list__header">
					热门城市
				</view>
				<view class="cities-list__content">
					<view
						v-for="item in cHotCitiesData"
						:key="item.agent_id"
						class="cities-item"
						@click="handleCityItemClick(item)">
						<view class="cities-item__text">{{item.name}}</view>
					</view>
				</view>
			</view>
			<!-- 热门城市 end -->
			<!-- 索引列表 -->
			<view class="index-list-wrapper">
				<u-index-list :scrollTop="scrollTop" :sticky="true" :offset-top="116" z-index="1" active-color="#999999"
				 :index-list="cIndexListIndexes">
					<view v-for="(item, key) in cIndexList" :key="key">
						<u-index-anchor :index="key" />
						<view
							v-for="city in item"
							:key="city.agent_id"
							class="list-cell"
							@click="handleCityItemClick(city)">
							{{city.name}}
						</view>
					</view>
				</u-index-list>
			</view>
			<!-- 索引列表 end -->
		</block>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
export default {
    data() {
        return {
            // 页面的滚动距离
            scrollTop: 0,
            // 索引列表和热门城市的接口数据
            allCitiesRes: {},
            // 目前搜索的城市接口数据
            citiesSearchedRes: {},
            // 当前城市的接口数据
            currentCityRes: {},
            // 当前定位的位置
            location: {
                lat: '',
                lng: ''
            },
            // 最近访问城市的数据
            recentCities: [],
            // 最近访问城市最多存几个
            maxRecentCitiesNum: 6,
            // 最近访问城市在localStorage里面的值
            recentCitiesStorageKey: 'S_RECENT_CITIES',
            // 当前输入框的值
            keyword: '',
            // 目前搜索的城市是否显示
            citiesSearchedVisible: false
        }
    },
    computed: {
        // 当前定位城市的数据
        cCurrentCityData() {
            return {
                id: this.$util.deepGet(this.currentCityRes, 'ad_info.adcode', ''),
                name: this.$util.deepGet(this.currentCityRes, 'address_component.district', '正在定位'),
				agent_id:  this.currentCityRes.agent_id
            }
        },
        // 目前搜索的城市数据
        cSitiesSearchedData() {
            return this.$util.deepGet(this.citiesSearchedRes, 'citylist', [])
        },
        // 热门城市的数据（和接口字段保持一致）
        cHotCitiesData() {
            // {
            // 			id: 510116,
            // 			pid: 510100,
            // 			name: '双流区',
            // 			visible: 2,
            // 			displayorder: 0,
            // 			level: 3,
            // 			lat: '30.57447',
            // 			lng: '103.92377',
            // 			pinyin: 'shuangliuqu',
            // 			initial: 'S',
            // 			agent_id: 152,
            // 			only_id: '0cb4b18d21e5b70d2e7f5a97232119d8'
            // 		}
            return this.$util.deepGet(this.allCitiesRes, 'hotcity', [])
        },
        // 索引列表的数据
        cIndexList() {
            return this.$util.deepGet(this.allCitiesRes, 'citylist', {})
        },
        // 索引列表的索引
        cIndexListIndexes() {
            return Object.keys(this.$util.deepGet(this.allCitiesRes, 'citylist', {}))
        }
    },
    watch: {
        keyword(val) {
            if (!val) {
                this.citiesSearchedVisible = false
            }
        }
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop
    },
    mounted() {
        this.fetchAllCitiesRes()
        this.fetchCurrentCityRes()
        this.getRecentCitiesFromStorage()
    },
    methods: {
        // 城市选项点击时间
        handleCityItemClick(item = {}) {
			console.log('handleCityItemClick',item)
            if (!item.id || !item.name) {
                return
            }
            uni.showLoading({
                title: '跳转中...'
            })
            this.addRecentCitiyToStorage(item)
            this.getAidAndGotoHome({
                areaid: item.id,
				select_aid: item.agent_id
            })
        },
        // 搜索清除按钮点击事件
        handleBtnSearchClearClick() {
            this.keyword = ''
            this.citiesSearchedVisible = false
        },
        // 得到aid存储到storage里面然后跳转到首页
        async getAidAndGotoHome({ areaid,select_aid } = {}) {
            // 参数校验
            if (select_aid === undefined || select_aid === null) {
                App.showError('没有指定select_aid')
                return
            }
            // 锁
            if (this.getAidAndGotoHomeing) {
                return
            }
            this.getAidAndGotoHomeing = true
            uni.showLoading({
                title: '跳转中...'
            })
            try {
                // 获取当前位置
                const location = await this.getLocation()
                if (!location.lat || !location.lng) {
                    App.showError('获取当前位置失败，请稍候或检查定位设置后重试')
                    uni.hideLoading()
                    this.getAidAndGotoHomeing = false
                    return
                }
                // 获取aid
                const res = await App._postP('agent.index/getAid', {
                    lat: location.lat,
                    lng: location.lng,
					select_aid
                })
                if (!res.data || !('' + res.data.aid)) {
                    return
                }


                // #ifdef MP-WEIXIN
                // 存储aid信息到localStorage
                uni.setStorageSync('aid', res.data || {})
                // 更新app.siteInfo
                App.setSiteInfo()
                // 跳转到首页
                this.navigationTo('pages/mainPages/index/index')
                // #endif

                // #ifdef H5
                window.location.replace(this.$util.changeURLArg(window.location.href, 'aid', 0))
                App.navigationTo({
                    url: 'pages/mainPages/index/index',
                    query: {
                        aid: res.data.aid
                    }
                })
                window.location.reload()

                // #endif
                uni.hideLoading()
                this.getAidAndGotoHomeing = false
            } catch (e) {
                console.log('跳转 error', e)
                uni.hideLoading()
                this.getAidAndGotoHomeing = false
                // TODO handle the exception
            }
        },
        // 从localStorage里取得最近访问城市
        getRecentCitiesFromStorage() {
            // 用try-catch是因为本地存储受网络和权限影响可能会报错
            try {
                this.recentCities = uni.getStorageSync(this.recentCitiesStorageKey) || []
                return this.recentCities
            } catch (e) {
                // TODO handle the exception
                return []
            }

        },
        // 向localStorage里存储最近访问城市
        addRecentCitiyToStorage(city = {}) {
            let recentCities = this.recentCities
            if (!recentCities.length) {
                // 确保数据的新鲜 同时避免频繁操作localStorage
                recentCities = this.getRecentCitiesFromStorage()
            }
            // 把新数据拼接在最前面
            const newCurrentCityRes = [
                city,
                ...recentCities
            ]
            // 去重
            let res = []
            newCurrentCityRes.forEach(item => {
                if (!res.find(resItem => resItem.id === item.id)) {
                    res.push(item)
                }
            })
            res = res.slice(0, this.maxRecentCitiesNum)
            this.recentCities = res
            // 存储到本地存储
            try {
                uni.setStorageSync(this.recentCitiesStorageKey, res)
            } catch (e) {
                // TODO handle the exception
            }
            return res
        },
        // 搜索按钮点击事件
        async handleBtnSearchClick() {
            // 锁
            if (this.searching) {
                return
            }
            this.searching = true
            uni.showLoading({
                title: '搜索中...'
            })
            try {
                await this.fetchCitiesSearchedRes({
                    keyword: this.keyword
                })
                this.citiesSearchedVisible = true
                uni.hideLoading()
            } catch (e) {
                // TODO handle the exception
            }
            this.searching = false
            console.log('点击了搜索按钮', this.keyword)
        },
        // 得到当前位置
        async getLocation() {
            if (this.location.lat && this.location.lng) {
                return Promise.resolve(this.location)
            }
            return App.getLocation().then(res => {
                console.log('App.getLocation', res)
                this.location = {
                    lat: res.latitude,
                    lng: res.longitude
                }
                return Promise.resolve(this.location)
            })

        },
        // 请求索引列表和热门城市的接口数据
        async fetchAllCitiesRes() {
            try {
                // https://docs.apipost.cn/view/e00f2167028ff25d#3476104
                const res = await App._postP('agent.index/cityList', {
                    aid: ''
                })
                this.allCitiesRes = this.$util.deepGet(res, 'data', {})
            } catch (e) {
                // TODO handle the exception
            }
        },
        // 请求目前搜索的城市接口数据
        async fetchCitiesSearchedRes({
            keyword
        } = {}) {
            try {
                // https://docs.apipost.cn/view/e00f2167028ff25d#3476104
                const res = await App._postP('agent.index/cityList', {
                    aid: '',
                    keyword
                })
                this.citiesSearchedRes = this.$util.deepGet(res, 'data', {})
            } catch (e) {
                // TODO handle the exception
            }
        },
        // 请求当前城市的接口数据
        async fetchCurrentCityRes({
            citycode = '',
            areaid = ''
        } = {}) {
            try {
                // https://docs.apipost.cn/view/e00f2167028ff25d#3476802
                const location = await this.getLocation()
                if (!location.lat || !location.lng) {
                    App.showError('获取当前位置失败，请稍候或检查定位设置后重试')
                    return
                }
                const res = await App._postP('agent.index/cityLocation', {
                    lat: location.lat,
                    lng: location.lng,
                    citycode,
                    areaid
                })
                this.currentCityRes = this.$util.deepGet(res, 'data', {})
            } catch (e) {
                // TODO handle the exception
            }
        }
    }
}
</script>

<style lang="scss" scoped>
	.page-aid-city {
		min-height: 100vh;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #fff;
	}

	.search-wrapper {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding: 20rpx 24rpx;
		background-color: #fff;
	}

	.search-wrapper__left {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex: 1;
		height: 76rpx;
		border-radius: 38rpx;
		background-color: #F6F6F6;
		padding: 0 24rpx;
	}

	.search-wrapper__icon {
		color: #959595;
	}

	.search-wrapper__input {
		flex: 1;
		margin: 0 20rpx;
		font-size: 26rpx;
		color: #333333;

		/deep/ {
			&.is-placeholder {
				color: #999999;
			}
		}
	}

	.search-wrapper__right {
		margin-left: 30rpx;
		font-weight: bold;
		font-size: 30rpx;
		color: #333;
	}

	// 城市列表
	.cities-list {
		box-sizing: boder-box;
		padding: 0 24rpx;
		margin: 30rpx 0;
	}

	.cities-list__header {
		font-size: 24rpx;
		color: #999999;
		margin-bottom: 18rpx;
	}

	.cities-list__content {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -12rpx;
	}

	.cities-item {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		min-width: 197rpx;
		max-width: 100%;
		margin: 15rpx;
		padding: 28rpx;
		height: 64rpx;
		font-size: 28rpx;
		color: #333333;
		border-radius: 32rpx;
		background-color: #F6F6F6;

		&.is-active {
			background-color: #FFD940;
		}
	}

	.cities-item__icon {
		margin-right: 10rpx;
	}

	.cities-item__text {
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	// 城市列表 end
	// 索引列表
	.list-cell {
		display: flex;
		box-sizing: border-box;
		padding: 20rpx 0;
		margin: 0 24rpx;
		overflow: hidden;
		color: #333333;
		font-size: 28rpx;
		line-height: 48rpx;
		background-color: #fff;

		&+& {
			border-top: 1px solid #F0F0F0;
		}
	}

	.anchor-text {
		padding-left: 10rpx;
		color: #999999;
	}

	// 索引列表end
</style>
