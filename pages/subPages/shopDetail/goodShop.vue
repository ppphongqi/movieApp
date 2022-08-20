<template>
	<view class="container"  :style="themeColor">
		<view class="header">
			<view class="navbar-box b-f">
				<view class="nav-list flex-x-center">
					<view class="nav-items" v-for="(items,index) in navList" :key="index" @click="navItemClick(items.id,index)">
						<text :class="{'select-nav-ft':currentIndex == items.id}">{{items.title}}</text>
						<view class="select-nav-items" v-if="currentIndex == items.id">
							<image src="/static/images/br1.png" class="main-bg-color" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content" v-if="isShow">
			<scroll-view scroll-y="true" :style="'height:'+scrollHeight+'px'" class='padding-box-all' @scrolltolower="onScrollBottom"
			 @scroll="scrolly">
				<view class="store-item b-f bor-radius-10upx padding-box-all m-btm20" v-for="(item,index) in storeData.data" :key="index">
					<view class="item-header dis-flex">
						<view class="store-logo bor-radius-10upx" :style="{'background-image':currentIndex==='1'?'url('+(item && item.logo && item.logo.file_path)+')':'url('+(item && item.business && item.business.logo && item.business.logo.file_path)+')'}"></view>
						<view class="item-content dis-flex flex-dir-column flex-x-between">
							<view class="store-title dis-flex flex-x-between flex-y-center">
								<view class="store-title-w f-30 col-3 f-w onelist-hidden">{{item.name}}</view>
								<view class="store-btn t-c f-24 col-3 bor-radius-10upx main-bg-color auxiliary-color" @click="skip_store(currentIndex==='1'?item.id:item.bus_id)">进店</view>
							</view>
							<view class="store-address f-24 col-9 onelist-hidden">
								<text class="iconfont icon-dingweixiao"></text>
								<text class="store-address-w">{{currentIndex==='1'?(item.store[0]?item.store[0]['address']:""):item.address}}</text>
							</view>
							<view class="action dis-flex f-24 col-9 flex-y-center p-r">
								<view class="distance" v-if="((item.store && item.store[0]&&item.store[0]['width']) || item.width)">{{currentIndex==='1'?(item.store[0]?item.store[0]['width']:""):item.width}}公里</view>
								<view class="fgx" v-if="((item.store && item.store[0]&&item.store[0]['width']) || item.width)"></view>
								<view class="recommed">{{currentIndex==='1'?item.viewed:(item['business']?item['business']['viewed']:"")}}人推荐</view>
							</view>
						</view>
					</view>
					<block v-if="(item['business'] && item['business']['goods'] && item['business']['goods'].length>0)||item.goods && item.goods.length>0">
						<view class="goods-banner bor-radius-10upx m-top-btm30 p-r" :style="{'background-image':currentIndex==='1'?'url('+item['goods'][0]['image'][0]['file_path']+')':'url('+item['business']['goods'][0]['image'][0]['file_path']+')'}"
						 @click="skip_goods(currentIndex==='1'?item['goods'][0]['goods_id']:item['business']['goods'][0]['goods_id'])">

							<view class="goods-detail dis-flex f-24">
								<view class="goods-title col-f">{{currentIndex==='1'?item['goods'][0]['goods_name']:item['business']['goods'][0]['goods_name']}}</view>
								<view class="goods-price p-r">{{settingData.currency}}{{currentIndex==='1'?item['goods'][0]['sku'][0]['goods_price']:item['business']['goods'][0]['sku'][0]['goods_price']}}</view>
							</view>
						</view>
					</block>
					<block v-else>
						<view class="goods-banner bor-radius-10upx m-top-btm30 p-r" :style="{'background-image':currentIndex==='1'?'url('+(item &&　item.bgimg && item.bgimg.file_path)+')':'url('+(item && item.business && item.business.bgimg && item.business.bgimg.file_path)+')'}"
						 @click="skip_store(currentIndex==='1'?item.id:item.bus_id)"></view>
					</block>
					<view class="goods-intro bor-radius-10upx t-c p-r">
						<image src="/static/images/marks.png" class="intro-icon mark-left main-bg-color"></image>
						<view class="f-24 col-3 onelist-hidden">{{currentIndex==='1'?item['describe']:item.business && item.business.describe}}</view>
						<image src="/static/images/marks.png" class="intro-icon mark-right main-bg-color"></image>
					</view>
				</view>
				<load-more :showLoadmore="!isMore"></load-more>
			</scroll-view>
		</view>
		<DiyTab ref="diyTab"
		></DiyTab>
		<shortcut id=""></shortcut>
		<page-loading ref="loading"></page-loading>
		<get-permit-view ref="permitView" permit-name="userLocation" @openSetting="onSettingBack"></get-permit-view>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import LoadMore from '@/components/template/Loadmore.vue'
import shortcut from '@/components/template/ShortCut.vue'
import DiyTab from '@/components/template/TabBar.vue'
import GetPermitView from '@/components/template/GetPermitView.vue'

// #ifdef H5
import wxApi from '@/static/h5/wxApi.js'
// #endif
export default {
    data() {
        return {
            currentIndex: '2',
            navList: [
                {
                    id: '1',
                    title: '推荐'
                },
                {
                    id: '2',
                    title: '附近'
                }
            ],
            lng: null,
            lat: null,
            page: 1,
            isMore: true,
            storeData: [],
            scrollHeight: null,
            scroll_Top: 0,
            isShow: false
        }
    },
    components: {
        LoadMore,
        shortcut,
        DiyTab,
        GetPermitView
    },
    computed: {},
    onLoad() {
        // this.getLocation();
        this.scorllHeight()
        this.pageLoad()

    },
    onShow() {
        App.customDefaultShare(this.globalSaveRefereeId, `${App.siteInfo.siteroot}h5/#/pages/subPages/shopDetail/goodShop`)
    },
    methods: {
        /**
			 * 页面加载处理
			 */
        pageLoad() {
            // #ifdef MP
            this.getBusinessStore()
            // #endif
            // #ifdef H5
            wxApi.wxRegister(this.getBusinessStore)
            // #endif
        },
        navItemClick(id, index) {
            let _this = this
            uni.showLoading({})
            _this.currentIndex = id
            _this.isShow = false
            _this.page = 1
            _this.scroll_Top = 0
            _this.getStoreList(_this.page, id, _this.lng, _this.lat)
        },
        /**
			 * scroll高度
			 */
        scorllHeight() {
            let _this = this
            uni.getSystemInfo({
                success: function (res) {
                    _this.setData({
                        scrollHeight: res.windowHeight - uni.upx2px(200)
                    })
                }
            })
        },
        /**
			 * 获取商家门店
			 */
        getBusinessStore() {
            let _this = this
            App.getLocation().then(res => {
                _this.lng = res.longitude
                _this.lat = res.latitude
                _this.getStoreList(1, '2', res.longitude, res.latitude)
            })

            // _this.getStoreList(1, "1",_this.lng, _this.lat)
        },
        getLocation() {
            let _this = this
            App.getLocation().then(res => {
                _this.lng = res.longitude
                _this.lat = res.latitude
            })

        },
        /**
			 * 好店列表获取
			 */
        getStoreList(page = 1, currentIndex, lng, lat, isPage = false) {
            let _this = this,
                url = currentIndex === '1' ? 'Business/businessList' : 'Business/storeList'
            console.log('lng', lng)
            console.log('lat', lat)
            App._get(url, {
                page,
                action: currentIndex,
                lng,
                lat
            }, res => {
                if (res.data.data.length > 0) {
                    res.data.data.map(item => {
                        if (item.goods && item.goods.length > 0) {
                            item.goods.map(goods => {
                                delete goods['by_know']
                                delete goods.content
                            })
                        }
                    })
                }
                if (isPage) {
                    if (res.data.data.length > 0) {
                        _this.storeData.data.push(...res.data.data)
                    }
                } else {
                    _this.storeData = res.data
                }
                _this.isMore = res.data.data.length == res.data.per_page
                _this.isShow = true
                App.hideLoading()
            }, false, () => {
                uni.hideLoading()
            })
        },
        onScrollBottom() {
            if (this.page >= this.storeData.last_page) {
                this.isMore = false
                return false
            }
            this.getStoreList(++this.page, this.currentIndex, this.lng, this.lat, true)

        },
        /**
			 * 滑动高度
			 */
        scrolly(e) {
            this.scroll_Top = e.detail.scrollTop
        },

        /**
			 * 跳转到商品详情
			 */
        skip_goods(goods_id) {
            App.navigationTo({
                url: `pages/subPages/goods/index/index?goods_id=${goods_id}`
            })
        },
        /**
			 * 跳转到店铺详情
			 */
        skip_store(bus_id) {
            App.navigationTo({
                url: `pages/subPages/store/index?bus_id=${bus_id}`
            })
        },
        /**
			 * 获取去权限设置回调
			 */
        onSettingBack(userLocation) {
            console.log(userLocation, 'userLocation===============')
            if (userLocation) {
                App.showLoading()
                this.$refs.permitView.showChange()
                this.getBusinessStore()
            }
        }
    },
    onReachBottom() {

    }
}
</script>

<style>
	/**
	 * 头部
	 */
	.header {}

	.nav-list {
		display: flex;
		flex-direction: row;
		height: 110upx;
	}

	.nav-list .nav-items {
		width: 160upx;
		height: 100%;
		line-height: 100upx;
		text-align: center;
		/* flex: 1; */
		font-size: 30upx;
		color: #999999;
		position: relative;
	}

	.select-nav-items {
		position: absolute;
		left: 50%;
		top: 25%;
		width: 56rpx;
		height: 10rpx;
		transform: translateX(-50%);
	}

	.select-nav-items image {
		width: 100%;
		height: 100%;
	}

	.select-nav-ft {
		font-size: 36upx;
		color: #333333;
		font-weight: bold;

	}

	/**
	 * 内容
	 */
	.item-header .store-logo {
		width: 120upx;
		height: 120upx;
		background-size: 120upx 120upx;
		background-repeat: no-repeat;
		background-repeat: center;
		flex-shrink: 0;
	}

	.item-content {
		width: 100%;
		margin-left: 30upx;
	}

	.item-content .store-title-w {
		width: 350upx;
	}

	.item-content .store-title .store-btn {
		width: 90upx;
		height: 40upx;
		line-height: 40upx;
		background-color: #FFD940;
	}

	.store-address {
		width: 469upx;
	}

	.store-address .icon-dingweixiao {
		font-size: 22upx !important;
		margin-right: 10upx;
	}

	.action .distance {}

	.action .fgx {
		width: 2upx;
		height: 24upx;
		background-color: #999999;
		margin: 0 20upx;
	}

	.store-item .goods-banner {
		width: 100%;
		height: 360upx;
		background-position: center;
		background-size: cover;
	}

	.goods-detail {
		position: absolute;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 1);
		border-radius: 0upx 10upx 0upx 10upx;
		opacity: 0.5;
		padding: 12upx 10upx;
	}

	.goods-detail .goods-price {
		color: #FC645F;
		margin-left: 40upx;
	}

	.goods-detail .goods-price:before {
		content: " ";
		position: absolute;
		left: -25%;
		top: -10upx;
		height: 52upx;
		width: 4upx;
		background-color: #333333;
		opacity: .3;
	}

	.goods-intro {
		width: 100%;
		height: 82upx;
		line-height: 82upx;
		background-color: #F3F3F3;
	}

	.goods-intro .intro-icon {
		position: absolute;
		top: 50%;
		width: 40upx;
		height: 40upx;
		display: block;
	}

	.goods-intro .intro-icon.mark-left {
		left: 3%;
		transform: translateY(-60%);
	}

	.goods-intro .intro-icon.mark-right {
		right: 3%;
		transform: rotate(180deg) translateY(20%);
	}

	.goods-intro view {
		margin: 0 auto;
		width: 400upx;
	}
</style>
