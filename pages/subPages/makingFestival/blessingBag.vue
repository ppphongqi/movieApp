<template>
	<view class="page-blessingBag app-clearfix" :style="cPageStyle">
		<!-- banner -->
		<view class="blessingBag-banner">
			<image class="blessingBag-banner_img" :src="cBannerData.file_path"></image>
		</view>
		<!-- banner end -->
		<!-- 活动倒计时 -->
		<count-down :startTimeStamp="cCountDownData.startTimeStamp" :endTimeStamp="cCountDownData.endTimeStamp" />
		<!-- 活动倒计时 end -->
		<!-- 联系客服 -->
		<customer-service
			v-if="cCustomerServiceData.communityId"
			:communityId="cCustomerServiceData.communityId"
			:avatar="cCustomerServiceData.avatar"
			:title="cCustomerServiceData.title"
			:desc="cCustomerServiceData.desc"
			:phone="cCustomerServiceData.phone"
			:communityType="cCustomerServiceData.communityType"
			:qrcodeImgUrl="cCustomerServiceData.qrcodeImgUrl"
			:pagePath="cCustomerServiceData.pagePath"/>
		<!-- 联系客服 end -->
		<!-- 数据统计 -->
		<statistics-list v-if="!cLuckDrawData.blessingId" :listData="cStatisticsListData" />
		<!-- 数据统计 end -->
		<!-- 活动简介 -->
		<!-- 抽奖 -->
		<festival-intro
			v-if="cLuckDrawData.blessingId"
			:viewsNum="cFestivalIntroData.viewsNum"
			:shareNum="cFestivalIntroData.shareNum"
			:buyNum="cFestivalIntroData.buyNum"
			buyText="参与"
			buyIcon="iconfont icon-18">
			<luck-draw
				:blessingId="cLuckDrawData.blessingId"
				:helpId="cLuckDrawData.helpId"
				:fontIndex="cLuckDrawData.fontIndex"
				:logId="cLuckDrawData.logId"
				@on-page-share-query-change="handleBlessingQueryChange"/>
		</festival-intro>
		<!-- 抽奖 end -->
		<!-- 用户购买弹幕 -->
		<blessing-users-bullet v-if="cUsersBullet.length" :listData="cUsersBullet" :num="cFestivalIntroData.userBarrageNum" />
		<!-- 用户购买弹幕 end -->
		<!-- 活动商家 -->
		<festival-business :listData="cFestivalBusinessData" />
		<!-- 活动商家 end -->
		<!-- #ifdef MP-WEIXIN -->
		<!-- 直播 -->
		<festival-live v-if="cLiveData.visible" :roomId="cLiveData.roomId" :status="cLiveData.status" :backgroundImage="cLiveData.backgroundImage" />
		<!-- 直播 end -->
		<!-- #endif -->
		<!-- 商品列表导航 -->
		<u-sticky
			v-if="cBlessTabNavData.length"
			h5-nav-height="0"
			bg-color="transparent"
			@fixed="isDiyNavSticky = true"
			@unfixed="isDiyNavSticky = false">
				<blessing-tab-nav
					v-model="navActiveId"
					:listData="cBlessTabNavData"
					:isFluid="isDiyNavSticky"
					 @on-item-click="handleDiyNavItemClick"
					/>
		</u-sticky>
		<!-- 商品列表导航 end -->
		<!-- diy 数据-->
		<view v-for="item in cDiyData" :key="item._id" :class="item._id">
			<!-- 广告 -->
			<Advertisement
				v-if="diyDataMap.ADVERTISEMENT === item.key"
				:link="item.link"
				:imgUrl="item.imgUrl" />
			<!-- 广告 end -->
			<!-- 热卖 -->
			<goods-collection
				v-else-if="diyDataMap.SELLER_SPECIAL === item.key"
				:bgImgUrl="item.bgImgUrl"
				:listData="item.listData"
				:autoChunk="false"/>
			<!-- 热卖 end -->
			<!-- 秒杀 -->
			<goods-collection
				v-else-if="diyDataMap.SECKILL === item.key"
				:bgImgUrl="item.bgImgUrl"
				:navListData="item.navListData"
				:listData="item.listData"
				:autoChunk="false"/>
			<!-- 秒杀 end -->
			<!-- 拼团 -->
			<goods-collection
				v-else-if="diyDataMap.GROUP === item.key"
				goodsStyle="row"
				:bgImgUrl="item.bgImgUrl"
				:navListData="item.navListData"
				:listData="item.listData"
				:autoChunk="false"/>
			<!-- 拼团 end -->
			<!-- 砍价 -->
			<goods-collection
				v-else-if="diyDataMap.BARGAINING === item.key"
				:bgImgUrl="item.bgImgUrl"
				:navListData="item.navListData"
				:listData="item.listData"
				:autoChunk="false"/>
			<!-- 砍价 end -->
		</view>
		<!-- diy 数据 end-->
		<!-- 活动详情 -->
		<festival-details :html="cFestivalDetails" />
		<!-- 活动详情 end -->
		<!-- 音乐播放组件 -->
		<AudioIcon v-if="cMusicData.file_path" v-model="audioStatus" :src="cMusicData.file_path" styleStr="position: fixed;right: 30rpx;top: 200rpx;z-index: 5;"></AudioIcon>
		<!-- 音乐播放组件 -->
		<!-- 活动规则按钮 -->
		<view class="page-blessingBag__btn-rules" @click="rulesPopupVisible = true">活动规则<view class="iconfont icon-wenhaoxiao"></view></view>
		<!-- 活动规则按钮 end -->
		<!-- 活动规则弹窗 -->
		<gift-bag-rules-popup :show="rulesPopupVisible" :text="cRules" @on-mask-click="rulesPopupVisible = false" />
		<!-- 活动规则弹窗 end -->
		<!-- 底部悬浮按钮 -->
		<float-btn v-if="cFloatBtnData.length" :itemData="cFloatBtnData" :visibleAlways="true" />
		<!-- 底部悬浮按钮 -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import LoadMore from '@/components/template/Loadmore.vue'
import CountDown from './components/CountDown2'
import CustomerService from './components/CustomerService'
import FestivalIntro from './components/FestivalIntro'
import LuckDraw from './components/LuckDraw'
import BlessingUsersBullet from './components/BlessingUsersBullet.vue'
import FestivalBusiness from './components/FestivalBusiness.vue'
import FestivalDetails from './components/FestivalDetails.vue'
import FestivalLive from './components/FestivalLive.vue'
import BlessingTabNav from './components/BlessingTabNav.vue'
import GoodsCollection from './components/GoodsCollection.vue'
import Advertisement from './components/Advertisement.vue'
import GiftBagRulesPopup from './components/GiftBagRulesPopup'
import StatisticsList from './components/StatisticsList.vue'
import AudioIcon from '@/components/page/pageComponents/AudioIcon.vue'
import FloatBtn from "@/components/page/pageComponents/FloatBtn.vue"
import { dateFormat } from '@/common/js/date.js'
import pageShareMixin from '@/common/js/pageShareMixin.js'

export default {
    mixins: [pageShareMixin],
    components: {
        LoadMore,
        CountDown,
        CustomerService,
        FestivalIntro,
        LuckDraw,
        BlessingUsersBullet,
        FestivalBusiness,
		FestivalDetails,
        FestivalLive,
        BlessingTabNav,
        GoodsCollection,
        Advertisement,
        AudioIcon,
		FloatBtn,
		GiftBagRulesPopup,
		StatisticsList
    },
    data() {
        return {
            // 页面的options的数据
            options: {},
            // diytab选中项的id
            navActiveId: '',
            // 页面的活动的接口数据
            festivalRes: {

            },
            // 页面商品和购买用户相关数据
            goodsRes: {

            },
            // 页面diy接口信息
            diyRes: {

            },
            // 背景音乐播放状态
            audioStatus: 'play',
            // diy数据的map
            diyDataMap: {
                // 广告
                ADVERTISEMENT: 'advertisement',
                // 秒杀
                SECKILL: 'seckill',
                // 拼团
                GROUP: 'makegroup',
                // 砍价
                BARGAINING: 'bargaining',
                // 热卖
                SELLER_SPECIAL: 'sellerspecial'
            },
            // 当前diy数据导航是否吸顶
            isDiyNavSticky: false,
            // 福袋抽奖传过来的分享query
            luckDrawShareQuery: {},
			// 点击导航滑动锁
			navChangingLock: false,
			// 活动规则是否显示
			rulesPopupVisible: false
        }
    },
    computed: {
		// 数据统计的数据
		cStatisticsListData() {
			if(this.cFestivalIntroData.blessingId) {
				return [
					// 购买量
					{
						_id: '01',
						icon: 'iconfont icon-119',
						num: this.$util.deepGet(this.festivalRes, 'number', 0),
						text: '人已购'
					},
					// 分享量
					{
						_id: '02',
						icon: 'iconfont icon-120',
						num: this.$util.deepGet(this.festivalRes, 'forward_num', 0),
						text: '人分享'
					},
					// 浏览量
					{
						_id: '03',
						icon: 'iconfont icon-123',
						num: this.$util.deepGet(this.festivalRes, 'views_num', 0),
						text: '人浏览'
					}
				]
			}else {
				return [
					// 分享量
					{
						_id: '02',
						icon: 'iconfont icon-120',
						num: this.$util.deepGet(this.festivalRes, 'forward_num', 0),
						text: '人分享'
					},
					// 浏览量
					{
						_id: '03',
						icon: 'iconfont icon-123',
						num: this.$util.deepGet(this.festivalRes, 'views_num', 0),
						text: '人浏览'
					}
				]
			}

		},
		// 底部悬浮按钮的数据
		cFloatBtnData() {
			const data = this.$util.deepGet(this.diyRes,'data',[]).find(item=>item.key === 'graphicfloatbtn')
			return this.$util.deepGet(data,'data',[])
		},
		// 分享参数改变的参数
        cShareChangeTigger() {
            return [
                this.festivalRes,
                this.luckDrawShareQuery
            ]
        },
        // 格式化的luckDraw数据
        cLuckDrawData() {
            return {
                blessingId: this.cFestivalIntroData.blessingId,
                helpId: this.options.help_id,
                fontIndex: this.options.font_index,
                logId: this.options.log_id
            }
        },
	    // banner图的数据
	    cBannerData() {
	        return this.$util.deepGet(this.festivalRes, 'activity_map_id.0', {})
	    },
	    // 音频播放的数据
	    cMusicData() {
	        return this.$util.deepGet(this.festivalRes, 'music_id.0', {})
	    },
	    // page的样式字符串
	    cPageStyle() {
	        let styleStr = this.themeColor
	        const color = this.$util.deepGet(this.festivalRes, 'colour')
	        if (color) {
	            styleStr += `background-color: ${color};`
	        }
	        return styleStr
	    },
		// 倒计时数据
		cCountDownData() {
			const startTimeStamp =  (this.festivalRes.start_time || 0) * 1000
			const endTimeStamp = (this.festivalRes.end_time || 0) * 1000
			return {
				startTimeStamp,
				endTimeStamp
			}
		},
        // 客服卡片数据
        cCustomerServiceData() {
            const community = this.$util.deepGet(this.festivalRes, 'community', {})
            return {
                communityId: community.id,
                avatar: this.$util.deepGet(community, 'headimg.0.file_path', ''),
                title: community.title,
                desc: community.des,
                phone: community.mobile,
                communityType: community.community_type,
                qrcodeImgUrl: this.$util.deepGet(community, 'qrcodeimg.0.file_path', ''),
                showLongPressBtn: [
                    2,
                    4
                ].indexOf(community.community_type) == -1,
				pagePath: `blessingBag?theme_festival_id=${this.options.theme_festival_id}`
            }
        },
		// 活动规则
		cRules() {
		    return this.$util.deepGet(this.festivalRes, 'rule', '')
		},
        // 直播卡片的数据
        cLiveData() {
		    return {
				// 房间id
				roomId: this.$util.deepGet(this.festivalRes, 'live_id.roomid'),
		        // 是否显示直播卡片
		        visible: +this.$util.deepGet(this.festivalRes, 'is_live') === 1,
		        // reduce后的直播状态 -1:不确定，1:正在直播，2:直播已结束
		        status: +this.$util.deepGet(this.festivalRes, 'live_status') === 101 ? 1 : 2,
		        // 直播背景图
		        backgroundImage: +this.$util.deepGet(this.festivalRes, 'live_status') === 101 ? this.$util.deepGet(this.festivalRes, 'live_img.0.file_path') : this.$util.deepGet(this.festivalRes, 'live_notice_img.0.file_path')
		    }
        },
        // 活动简介数据
        cFestivalIntroData() {
		    return {
		        // 浏览量
		        viewsNum: this.$util.deepGet(this.festivalRes, 'views_num', 0),
		        // 分享量
		        shareNum: this.$util.deepGet(this.festivalRes, 'forward_num', 0),
		        // 购买量
		        buyNum: this.$util.deepGet(this.festivalRes, 'number', 0),
		        // 标题
		        title: this.$util.deepGet(this.goodsRes, 'title', 0),
                // 弹幕上的购买量
                userBarrageNum: +this.$util.deepGet(this.goodsRes, 'user_barrage.total') || 0,
                // 福袋id
                blessingId: this.$util.deepGet(this.festivalRes, 'blessing_id', '')
		    }
        },
        // 购买用户弹幕数据
        cUsersBullet() {
		    return this.$util.deepGet(this.goodsRes, 'user_barrage.data', []).map(item => ({
		        avatar: item.avatarUrl,
		        text: `恭喜${item.nickName}集卡成功`
		    }))
        },
        // 活动商家的数据
        cFestivalBusinessData() {
		    return this.$util.deepGet(this.festivalRes, 'store', []).map(item => ({
		        _source: item,
		        _id: item.id,
		        name: item.name,
		        addr: item.address,
		        lat: item.lat,
		        long: item.lng,
		        phone: item.mobile
		    }))
        },
        // 商品列表的导航
        cBlessTabNavData() {
            return this.$util.deepGet(this.diyRes, 'navigation', []).map(item => ({
		        _id: item.id,
		        name: item.name
		    }))
        },
        // 格式化的diy数据
        cDiyData() {
            // 每个商品的数据结构都不一样 比如说图片和价格。。。
            return this.$util.deepGet(this.diyRes, 'data', []).map(item => {
                if (item.key === this.diyDataMap.ADVERTISEMENT) {
                    // 广告
                    return {
                        _source: item,
                        _id: item.id,
                        key: item.key,
                        imgUrl: this.$util.deepGet(item, 'data.0.thumb.file_path'),
                        link: this.$util.deepGet(item, 'data.0.link')
                    }
                } else if (item.key === this.diyDataMap.SELLER_SPECIAL) {
                    // 热卖
                    let listData = []
                    let navListData = []
                    this.$util.deepGet(item, 'data', []).forEach((dataItem = {}) => {
                        // 要追加的商品数据
                        const newData = ({
                            ...this.transformGoods(dataItem),
                            label: '热卖',
                            imgUrl: this.$util.deepGet(dataItem, 'goods_image', ''),
                            priceStr: this.$util.deepGet(dataItem, 'goods_price', ''),
                            priceDelStr: this.$util.deepGet(dataItem, 'line_price', '')
                        })
                        // 分块并追加在listData
                        listData = [
                            ...listData,
                            newData
                        ]
                    })
                    return {
                        _source: item,
                        _id: item.id,
                        key: item.key,
                        imgUrl: item.goods_image,
                        bgImgUrl: this.$util.deepGet(item, 'shopdata.0.thumb.file_path'),
                        listData: this.$util.chunk(listData, 4)
                    }
                } else if (item.key === this.diyDataMap.SECKILL) {
                    // 秒杀
                    let listData = []
                    let navListData = []
                    this.$util.deepGet(item, 'data', []).forEach((dataItem = {}, dataIndex) => {
                        const goods = dataItem.goods || []
                        const navId = `nav_${dataIndex}`
                        // 要追加的商品数据
                        const newData = goods.map(goodsItem => ({
                            ...this.transformGoods(goodsItem),
                            targetNavId: navId,
                            label: '秒杀'
                        }))
                        // 分块并追加在listData
                        listData = [
                            ...listData,
                            ...this.$util.chunk(newData, 4)
                        ]
                        // 导航
                        navListData.push({
                            _id: navId,
                            title: dateFormat(dataItem.start_time, { format: 'MM月DD日' }),
                            text: ({
                                '1': '未开始',
                                '2': '进行中',
                                '3': '已结束'
                            })[dataItem.status] || ''
                        })
                    })
                    return {
                        _source: item,
                        _id: item.id,
                        key: item.key,
                        bgImgUrl: this.$util.deepGet(item, 'shopdata.0.thumb.file_path'),
                        listData,
                        navListData
                    }
                } else if (item.key === this.diyDataMap.GROUP) {
                    // 拼团
                    let listData = []
                    let navListData = []
                    this.$util.deepGet(item, 'data', []).forEach((dataItem = {}, dataIndex) => {
                        const goods = dataItem.goods || []
                        const navId = `nav_${dataIndex}`
                        // 要追加的商品数据
                        const newData = goods.map(goodsItem => ({
                            ...this.transformGoods(goodsItem),
                            targetNavId: navId,
                            imgUrl: this.$util.deepGet(goodsItem, 'image.file_path', ''),
                            priceStr: goodsItem.groups_price,
                            priceDelStr: goodsItem.original_price
                        }))
                        // 分块并追加在listData
                        listData = [
                            ...listData,
                            newData
                        ]
                        // 导航
                        navListData.push({
                            _id: navId,
                            title: dateFormat(dataItem.start_time, { format: 'MM月DD日' }),
                            text: ({
                                '1': '进行中',
                                '2': '已暂停',
                                '3': '已结束',
                                '4': '未开始'
                            })[dataItem.status] || ''
                        })
                    })
                    return {
                        _source: item,
                        _id: item.id,
                        key: item.key,
                        bgImgUrl: this.$util.deepGet(item, 'shopdata.0.thumb.file_path'),
                        listData,
                        navListData
                    }
                } else if (item.key === this.diyDataMap.BARGAINING) {
                    // 砍价
                    let listData = []
                    let navListData = []
                    this.$util.deepGet(item, 'data', []).forEach((dataItem = {}, dataIndex) => {
                        const goods = dataItem.goods || []
                        const navId = `nav_${dataIndex}`
                        // 要追加的商品数据
                        const newData = goods.map(goodsItem => ({
                            ...this.transformGoods(goodsItem),
                            targetNavId: navId,
                            label: '砍价',
                            imgUrl: this.$util.deepGet(goodsItem, 'image.0.file_path', ''),
                            priceStr: this.$util.deepGet(goodsItem, 'bargain_price', ''),
                            priceDelStr: this.$util.deepGet(goodsItem, 'goods_price', '')
                        }))
                        // 分块并追加在listData
                        listData = [
                            ...listData,
                            ...this.$util.chunk(newData, 4)
                        ]
                        // 导航
                        navListData.push({
                            _id: navId,
                            title: dateFormat(dataItem.start_time, { format: 'MM月DD日' }),
                            text: ({
                                '1': '未开始',
                                '2': '进行中',
                                '3': '已暂停',
                                '4': '已结束'
                            })[dataItem.status] || ''
                        })
                    })
                    return {
                        _source: item,
                        _id: item.id,
                        key: item.key,
                        bgImgUrl: this.$util.deepGet(item, 'shopdata.0.thumb.file_path'),
                        listData,
                        navListData
                    }
                }
                return {
                    _source: item,
                    _id: item.id,
                    key: item.key
                }

            })
        },
		// 活动详情
		cFestivalDetails() {
		    return this.$util.deepGet(this.festivalRes, 'content', '')
		},
    },
    watch: {
		// 当需要改变页面分享参数的时候
	    cShareChangeTigger() {
            const val = this.festivalRes
	        // 设置分享数据
	        // #ifdef MP-WEIXIN
	        this.shareData = this.pageShareMixin_createShareData({
	            title: this.$util.deepGet(val, 'share_title'),
	            desc: this.$util.deepGet(val, 'share_description', ''),
	            imgUrl: this.$util.deepGet(val, 'saapp_img.0.file_path', ''),
	            query: {
	                theme_festival_id: this.$util.deepGet(this.options, 'theme_festival_id', ''),
                    ...this.luckDrawShareQuery
	            }
	        })
	        // #endif
	        // #ifdef H5
	        this.shareData = this.pageShareMixin_createShareData({
	            title: this.$util.deepGet(val, 'share_title'),
	            desc: this.$util.deepGet(val, 'share_description', ''),
	            imgUrl: this.$util.deepGet(val, 'wechat_img.0.file_path', ''),
	            query: {
	                theme_festival_id: this.$util.deepGet(this.options, 'theme_festival_id', ''),
                    ...this.luckDrawShareQuery
	            }
	        })
	        // #endif
            console.log('cShareChangeTigger', this.shareData)
	    },
		festivalRes(val) {
			uni.setNavigationBarTitle({
			    title: val.special_name
			})
		}
    },
    onLoad(options) {
        this.options = options
		if (options.scene) {
			const queryData = this.$util.scene_decode(options.scene) || {}
			this.options = {
				theme_festival_id: queryData.a,
				...this.options
			}
		}
        this.changeNavActiveIdWhenScrollThrottle = this.$util.throttle(() => {
            this.changeNavActiveIdWhenScroll()
        }, 200, { leading: true,
            trailing: true })
    },
    async onShow() {
        try {
            // 确保静默登录了
            await this.mainMixin_BeforeFetchPageData()
            // 请求页面数据
            await Promise.all([
                this.fetchFestivalRes({
					referee_id: this.notFirstShow ? '' : this.options.referee_id || ''
				}),
                this.fetchGoodsRes(),
                this.fetchDiyRes()
            ])
			this.notFirstShow = true
            // 开始播放音频
            this.audioStatus = 'play'
        } catch (e) {
            // TODO handle the exception
        }
        App.hideLoading()
    },
    onHide() {
	    // 暂停播放音频
	    this.audioStatus = 'pause'
    },
    onPageScroll() {
		if(this.navChangingLock) return
        this.changeNavActiveIdWhenScrollThrottle()
    },
    methods: {
        handleBlessingQueryChange(query) {
            console.log('handleBlessingQueryChange', query)
            this.luckDrawShareQuery = query
        },
        // diy区域导航项点击事件
        handleDiyNavItemClick(id) {
            console.log('handleDiyNavItemClick', id)
            this.scrollToDiySectionById(id)
        },
        // 当页面滚动的时候改变导航的选项
        changeNavActiveIdWhenScroll() {
			if(!this.cBlessTabNavData.length) return
            const pArr = this.cDiyData.map(item => new Promise(resolve => {
                uni.createSelectorQuery().select(`.${item._id}`).
                    boundingClientRect(res => {
                        res = res || {}
                        resolve({
                            _id: item._id,
                            top: res.top || null
                        })
                    }).
                    exec()
            }))
            Promise.all(pArr).then(res => {
                // 过滤和排序
                const arr = res.filter(item => item.top !== null).sort((a, b) => a.top - b.top)
				if(!arr.length) return
                // 第一个正数的索引
                const positiveIndex = arr.findIndex(item => item.top > uni.upx2px(100))
				console.log('positiveIndex',positiveIndex)
                if (positiveIndex === -1) {
                    // console.log('不存在正数')
                    this.navActiveId = arr[arr.length - 1]._id
                } else if (positiveIndex === 0) {
                    // console.log('存在正数且为第一个数')
                    this.navActiveId = arr[0]._id
                } else {
                    // console.log('存在正数且不为第一个数')
                    this.navActiveId = arr[positiveIndex - 1]._id
                }
            })
        },
        // 滚动到指定id的diy区域
        scrollToDiySectionById(id = '') {
            if (!id) {
                return
            }
			const self = this
			this.navChangingLock = true
     //        // #ifdef MP
     //        uni.pageScrollTo({
     //            // selector在h5上不可行
     //            selector: id,
     //            complete(res) {
     //                console.log('滚动到指定id的diy区域:complete', res)
					// self.navChangingLock = false
     //            }
     //        })
     //        // #endif
            uni.createSelectorQuery().select('.page-blessingBag').
                boundingClientRect(res1 => {
					console.log(`.${id}`)
                    uni.createSelectorQuery().select(`.${id}`).
                        boundingClientRect(res => {
                            uni.pageScrollTo({
                                scrollTop: res.top - res1.top - uni.upx2px(100),
								duration: 0,
								complete() {
									setTimeout(()=>{
										self.navChangingLock = false
									}, 1000)
								}
                            })
                        }).
                        exec()
                }).
                exec()
        },
        // 格式化接口商品数据的方法
        transformGoods(goods) {
            return {
                _source: goods,
                _id: goods.goods_id,
                // 对应的导航项
                targetNavId: '',
                imgUrl: goods.file,
                label: '',
                title: goods.goods_name,
                priceStr: goods.price,
                priceDelStr: goods.old_price
            }
        },
        // 请求活动相关数据
        async fetchFestivalRes({
			referee_id
		}={}) {
		    try {
		        const res = await App._getP('festival.Festival/getThemeFestival', {
		            theme_festival_id: this.options.theme_festival_id,
                    referee_id
		        })
		        console.log('fetchFestivalRes', res)
		        this.festivalRes = this.$util.deepGet(res, 'data', {})
		    } catch (e) {
		        // TODO handle the exception
		    }
        },
        // 请求商品相关数据
        async fetchGoodsRes() {
		    try {
		        const res = await App._getP('festival.Festival/getGiftOrBlessing', {
		            theme_festival_id: this.options.theme_festival_id
		        })
		        console.log('fetchFestivalRes', res)
		        this.goodsRes = this.$util.deepGet(res, 'data', {})
		    } catch (e) {
		        // TODO handle the exception
		    }
        },
        // 请求diy相关数据
        async fetchDiyRes() {
		    try {
		        const res = await App._getP('festival.Festival/getFestivalDiyPage', {
		            theme_festival_id: this.options.theme_festival_id
		        })
		        console.log('fetchFestivalRes', res)
		        this.diyRes = this.$util.deepGet(res, 'data', {})
		    } catch (e) {
		        // TODO handle the exception
		    }
        }
    }
}
</script>

<style  lang="scss" scoped>
	.page-blessingBag {
		min-height: 100vh;
		padding-bottom: 300rpx;
	}
	.blessingBag-banner_img {
		width: 100%;
		height: 530rpx;
	}
	.page-blessingBag__btn-rules {
		position: fixed;
		right: 0;
		top: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60rpx;
		padding: 0 30rpx;
		background-color: rgba(0,0,0,0.5);
		border-radius: 60rpx 0 0 60rpx;
		z-index: 5;
		&,.iconfont {
			font-size: 28rpx;
			color: #fff;
		}
		.iconfont {
			margin-left: 8rpx;
		}
	}
</style>
