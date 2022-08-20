<template>
	<view :style="themeColor">

		<view class="list-container main-bg-color" >
		<!-- <view class="list-container main-bg-color" :style="{'background-image':getImageRoot('4.png','url')}"> -->
			<view class="store-list">
				<scroll-view scroll-y="true" @scrolltolower="onScrollBottom" class="scroll-view">
					<radio-group>
						<view class="store-item border-line border-bottom" v-for="(items,index) in cStorelist" :key="index">
							<view class="store-detail dis-flex flex-y-center flex-x-between">
								<view class="store-detail-left flex-box dis-flex flex-y-center flex-x-between">
									<view class="store-info flex-box">
										<view class="col-3 f-30 f-w">{{items.name}}</view>
										<view v-if="items.distance" class="store-addres col-9 f-24 m-top10">距离：{{items.distance}}</view>
										<view class="store-time m-top10 col-9 dis-flex flex-dir-column flex-align-c">
											<view class="store-time f-24 col-9 onelist-hidden">
												<!-- <text class="time-icon iconfont icon-timefill"></text> -->
												<block v-if="items.time && items.time.length > 0">
													营业时间：<text v-for="store,storeIndex in items.time" :key="storeIndex" style="margin-right: 10upx;">{{store[2] || ''}}{{store[0]}}-{{store[1]}}</text>
												</block>
												<block v-else>
													营业时间：{{items.start_time}}-{{items.end_time}}
												</block>
											</view>
										</view>
										<view class="store-addres col-9 f-24 m-top10">商家电话：{{items.mobile}}</view>
										<view class="store-addres col-9 f-24 m-top10">{{items.address}}</view>
									</view>
									<view v-if="bustypeid!==0">
										<label class="uni-list-cell uni-list-cell-pd" @click="radioChange(items)">
											<radio :value="items.id" :checked="items.id == adressCurrent" />
										</label>
									</view>
								</view>
								<!-- 有storeId就会到新版详情页 -->
								<store-nav v-if="bustypeid===0" :mobile="items.mobile" :address="items" :storeId="toNewStore ? items.id : ''" :busId="items.bus_id"></store-nav>
							</view>
							<view class="store-time dis-flex flex-dir-column flex-x-between col-9  m-top10 ">
								<!-- <view class="dis-flex flex-y-center flex-x-between">
									<view class="iconfont icon-timefill">
										<block v-if="items.time && items.time.length > 0">
											<text v-for="store,storeIndex in items.time" :key="storeIndex" style="margin-right: 10upx;">{{store[0]}}-{{store[1]}}</text>
										</block>
										<block v-else>
											{{items.start_time}}-{{items.end_time}}
										</block>
									</view>
									<view class="iconfont icon-locationfill" style="align-self: flex-start;" v-if="items.distance !== 0">{{items.distance}}km</view>
								</view> -->
								<!-- <view v-if="items.$week" style="margin-top: 10upx;font-size: 26upx;">
									<text>{{items.$week}}</text>
								</view> -->

							</view>
						</view>
					</radio-group>
					<loadmore :showLoadmore="showLoadmore"></loadmore>
				</scroll-view>
			</view>
		</view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import util from '@/common/js/util.js'
import loadmore from '@/components/template/Loadmore.vue'
import StoreNav from '@/components/template/StoreNav.vue'
export default {
    data() {
        return {
            options: {},
            Storelist: [],
            weekMap: {
                monday: '周一',
                tuesday: '周二',
                wednesday: '周三',
                thursday: '周四',
                friday: '周五',
                saturday: '周六',
                sunday: '周天'
            },
            page: 1,
            limit: 10,
            location: {
                lat: '',
                lng: ''
            },
            showLoadmore: false,
            bus_id: null,
            goods_id: null,
            prize_id: null,
            bustypeid: null,
            adressCurrent: null,
            basicSetting: {},
            param_s: {}
        }
    },
    components: {
        loadmore,
        StoreNav
    },
    computed: {
        cStorelist() {
            return (this.Storelist || []).map(item => {
                // 接口的单位是km
                let distance = +item.distance || 0
                if (distance > 0 && distance < 1) {
                    distance = +(distance * 1000).toFixed(2) + 'm'
                } else if (distance > 1) {
                    distance = distance.toFixed(2) + 'km'
                } else {
                    distance = 0
                }
                return {
                    ...item,
                    distance
                }
            })
        },
        // 进入店铺是到新版还是老板
        toNewStore() {
            const businessStore = this.basicSetting.businessStore || {}
            return +businessStore.good_store_style === 2
        }
    },
    beforeCreate() {

    },
    onLoad(options) {
        this.options = options
        App.showLoading()
        let _this = this,
            clientType = App.getClientType()
        if (options.param_s) {
            console.log('hahahah')
            console.log(typeof options.param_s)
            _this.param_s = options.param_s
        }
        _this.bus_id = options.bus_id
        _this.prize_id = options.prize_id
        _this.goods_id = options.goods_id
        _this.bustypeid = options.bustypeid || 0
        _this.adressCurrent = options.store_id
        App.getLocation().then(res => {
            _this.location = {
                lat: res.latitude,
                lng: res.longitude
            }
            _this.getStoreList(_this.bus_id, _this.goods_id, 1, _this.limit, res.latitude, res.longitude, _this.prize_id)
            _this.getBasicSetting()
        })
    },
    methods: {
        getBasicSetting() {
            App._post_form('setting/index', {}, res => {
                this.basicSetting = res.data
            })
        },
        /**
				获取商铺列表
			 **/
        getStoreList(bus_id, goods_id, page, limit, lat, lng, prize_id = null) {
            let that = this
            return new Promise((resolve, reject) => {
                App._get('Business/lists', {
                    bus_id,
                    goods_id,
                    page,
                    limit,
                    lat,
                    lng,
                    prize_id,
                    param_s: that.param_s,
                    store_ids: this.options.store_ids
                }, function (result) {
                    console.log(result)
                    result.data.map(val => {
                        const hasTime = val.time && Array.isArray(val.time) && val.time.length > 0
                        val.id = String(val.id)
                        if (hasTime) {
                            val.time.map(item => {
                                item[0] = that.$util.formatTime(item[0] / 1000, 'rule', ':').substr(-5, 5)
                                item[1] = that.$util.formatTime(item[1] / 1000, 'rule', ':').substr(-5, 5)
                            })
                        } else {
                            val.start_time = util.formatTime(val.start_time, 'rule', ':').substr(-5, 5)
                            val.end_time = util.formatTime(val.end_time, 'rule', ':').substr(-5, 5)
                        }

                        if (val.week) {
                            const week = JSON.parse(val.week)
                            if (Array.isArray(week) && week.length > 0) {
                                const result = []
                                if (week.length == 7) {
                                    val.$week = '每日'
                                } else {
                                    week.map(item => {
                                        result.push(that.weekMap[`${item}`])
                                    })
                                    val.$week = result.join(' ')
                                }
                            }
                        }

                        val.distance = Math.floor(val.distance * 100) / 100
                    })
                    that.Storelist = result.data
                    console.log('that.Storelist---', that.Storelist)
                    that.showLoadmore = (result.data.length < that.limit)
                    App.hideLoading()
                    uni.stopPullDownRefresh()
                })
            })
        },
        radioChange(storeItem) {
            let storeData = this.$store.state.storeData || {}
            storeData = Object.assign(storeData, {
                [storeItem.bus_id]: storeItem
            })
            this.$store.commit('storeData', storeData)
            uni.navigateBack({
                delta: 1
            })
        },
        /**
			 * 上滑加载更多
			 **/
        onScrollBottom(e) {
            console.log('到达最底部')
            let {
                page,
                limit,
                location
            } = this
            !this.showLoadmore && this.toload(this.bus_id, ++this.page, limit, location.lat, location.lng)
        },
        toload(bus_id, page, limit, lat, lng) {
            App._get('Business/lists', {
                bus_id,
                page,
                limit,
                lat,
                lng

            }, this.itemsDataMore)
        },
        /**
			 * 加载更多
			 **/
        itemsDataMore(e) {
            console.log(e, '更多数据')
            let that = this,
                Storelist = that.Storelist,
                StoreMore = e.data
            if (!!StoreMore) {
                StoreMore.map(val => {
                    const hasTime = val.time && Array.isArray(val.time) && val.time.length > 0
                    val.id = String(val.id)
                    if (hasTime) {
                        val.time.map(item => {
                            item[0] = that.$util.formatTime(item[0] / 1000, 'rule', ':').substr(-5, 5)
                            item[1] = that.$util.formatTime(item[1] / 1000, 'rule', ':').substr(-5, 5)
                        })
                    }

                    if (val.week) {
                        const week = JSON.parse(val.week)
                        if (Array.isArray(week) && week.length > 0) {
                            const result = []
                            if (week.length == 7) {
                                val.$week = '每日'
                            } else {
                                week.map(item => {
                                    result.push(that.weekMap[`${item}`])
                                })
                                val.$week = result.join(' ')
                            }
                        }
                    }
                    val.start_time = util.formatTime(val.start_time, 'rule', ':').substr(-5, 5)
                    val.end_time = util.formatTime(val.end_time, 'rule', ':').substr(-5, 5)
                    val.distance = Math.floor(val.distance * 100) / 100
                })
            }
            that.showLoadmore = (StoreMore.length === 0)
            that.Storelist = Storelist.concat(StoreMore)
        }
    },
    onPullDownRefresh() {
        let _this = this
        App.getLocation().then(res => {
            _this.getStoreList(_this.bus_id, 1, _this.limit, res.latitude, res.longitude)
        })
    }
}
</script>

<style>
	.scroll-view {
		height: calc(100vh - 40upx);
	}

	.list-container {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		padding: 20upx 30upx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.store-list {
		width: 100%;
		height: 100%;
		background: #FFFFFF;
		border-radius: 20upx;
	}

	.store-item {
		padding: 8upx 0;
		margin: 0 30upx;
	}

	.store-item:last-child::after {
		border: none !important;
	}

	.store-detail-right {
		margin-left: 20upx;
		padding-left: 20upx;
		border-left: 1upx solid #EEEEEE;
	}

	.store-time .iconfont {
		font-size: 26upx;
	}

	.store-time .icon-timefill:before,
	.icon-locationfill:before {
		padding-right: 20upx;
		font-size: 32upx;
	}

	.store-detail-iconsize {
		font-size: 40upx !important;
	}

	/* #ifdef H5*/
	radio>>>.uni-radio-input {
		/* 自定义样式.... */
		height: 36upx;
		width: 36upx;
		margin-top: -4upx;
		border-radius: 50%;
		border: 2upx solid #999;
		background: transparent;
	}


	radio>>>.uni-radio-input.uni-radio-input-checked {
		background-color: #FFD940 !important;
		border-color: #FFD940 !important;
		background-color: var(--theme-color) !important;
		border-color: var(--theme-color) !important;
	}

	radio>>>.uni-radio-input.uni-radio-input-checked::before {
		border-radius: 50%;
		width: 20upx;
		height: 20upx;
		line-height: 20upx;
		text-align: center;
		font-size: 20upx;
		color: #000000;
		margin-left: -2upx;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	/* #endif */
</style>
