<template>
	<view :style="themeColor">
		<view class="page" v-if="!!Storedetail.id">
			<view class="header">
				<swiper :autoplay="true" :interval="3000" :duration="1000">
					<swiper-item v-for="(items,index) in Storedetail.bgimg" :key="index">
						<image :src="items" class="header-bg"></image>
					</swiper-item>
				</swiper>
			</view>
			<view class="section p-left-right-30 m-btm20">
				<!-- 店铺介绍 -->
				<view class="store-letter b-f m-btm20">
					<view class="logo-name dis-flex flex-y-center">
						<view class="logo" v-if="Storedetail.logo">
							<image :src="Storedetail.logo"></image>
						</view>
						<view class="name f-30 flex-box">{{Storedetail.name}}</view>
					</view>
					<view class="notice">{{Storedetail.describe}}</view>
					<view class="have-read dis-flex flex-x-between">
						<view class="goods-already-user">
							<image class="user-avatar" :src="item" v-for="(item,index) in Storedetail.user_image" :key="index" :style="{'z-index':Storedetail.user_image.length*2-index}"></image>
							<view class="user-avatar user-more f-24">···</view>
						</view>
						<view class="have-num dis-flex flex-y-center f-24">
							<text class="col-m">{{Storedetail.viewed}}</text> 人已逛过
						</view>
					</view>
				</view>
				<!-- 热卖商品 -->
				<!-- <component></component> -->
				<!-- 好文热评 -->
				<view class="buzz bor-raidus20 b-f m-btm20">
					<DiyTitle :itemStyle="titleStyle1" :params="titleParams1"></DiyTitle>
					<!-- <view cl ass="buzz-title f-30 m-btm20">好文热评</view> -->
					<swiper class="goods-list" :autoplay="true" :interval="5000" :circular="true" @change="swiperChange" v-if='store==1'>
						<swiper-item v-for="(item,index) in Storedetail.goods_list.data" :key="index">
							<view class="goods-item dis-flex flex-dir-column" @click="navigationTo(item.goods_id,item.is_member_price)">
								<view class="goods-item-img" :style="{'background-image':'url('+item.image+')'}">
									<!-- <image :src="item.image" mode="widthFix"></image> -->
								</view>
								<view class="goods-item-content">
									<view class="goods-item-title dis-flex flex-y-center m-top10">
										<view class="onelist-hidden f-30">{{item.goods_name}}</view>
									</view>
									<view class="goods-item-info dis-flex flex-x-between flex-y-center">
										<view class="goods-item-money dis-flex  flex-y-line price-font-family m-top10">
											<view class="goods-item-money-now f-36 col-m">{{settingData.currency}}{{item.goods_price}}</view>
											<view class="goods-item-money-old f-24 col-9">{{settingData.currency}}{{item.line_price}}</view>
										</view>
										<view class="goods-item-buy main-bg-color auxiliary-color">去购买</view>
									</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<scroll-view :scroll-y="true"  :show-scrollbar='true' class="goodsScoll " :style="{height:height}"
					 @scrolltolower="goodsListMore" :scroll-anchoring="true" v-if="store==2">
						<view class=" dis-flex  goods-list2" style="box-shadow:0px 0px 2px #C4BDB9;height:240rpx ;" v-if="store==2"  v-for="(item,index) in goodsList"
						 :key="index" @click="navigationTo(item.goods_id,item.is_member_price)">
							<image :src="item.image" mode="" style="width: 200rpx;height: 200rpx;"></image>
							<view class="goods-item-content dis-flex flex-dir-column flex-x-between" style="width: 63%;margin-left: 20rpx;">
								<view class="goods-item-title dis-flex flex-y-center ">
									<view class="twolist-hidden f-30">{{item.goods_name}}</view>
								</view>
								<view class="goods-item-info dis-flex flex-x-between flex-y-center">
									<view class="goods-item-money dis-flex  flex-y-line price-font-family " style="width: 66%;overflow: hidden;">
										<view class="goods-item-money-now f-36 col-m">{{settingData.currency}}{{item.goods_price}}</view>
										<view class="goods-item-money-old f-24 col-9">{{settingData.currency}}{{item.line_price}}</view>
									</view>
									<view class="goods-item-buy  main-bg-color auxiliary-color">去购买</view>
								</view>
							</view>
						</view>

						<load-more :showLoadmore="!isMore" v-if="goodsList.length "></load-more>
					</scroll-view>


					<!-- <scroll-view scroll-x="true" class="buzz-scroll">
						<view class="buzz-imag" v-for="(items,index) in Storedetail.quaimg" :key="index">
							<image :src="items"></image>
						</view>
					</scroll-view> -->
				</view>

				<!-- 店铺信息 -->
				<view class="store-msg b-f bor-raidus20 m-btm20 goods-store-content">
					<DiyTitle :itemStyle="titleStyle2" :params="titleParams2"></DiyTitle>
					<view class="goods-store-address dis-flex  flex-dir-row flex-y-center flex-x-between border-line border-top" v-for="(items,index) in Storedetail.store"
					 :key="index" v-if="index<3">
						<view class="store-addres flex-box">
							<view class="col-3 f-30 f-w m-top10">{{items.name}}</view>
							<view class="store-time m-top10 col-9 dis-flex flex-dir-column flex-align-c">
								<view class="store-time f-24 col-9 onelist-hidden">
									<block v-if="items.time && items.time.length > 0">
										营业时间：<text v-for="store,storeIndex in items.time" :key="storeIndex" style="margin-right: 10upx;">{{store[0]}}-{{store[1]}}</text>
									</block>
									<block v-else>
										营业时间：{{items.start_time}}-{{items.end_time}}
									</block>
								</view>
							</view>
							<view class="store-addres-text f-24 col-9 m-top10">商家电话：{{items.mobile}}</view>
							<view class="store-addres col-9 f-24 m-top10">{{items.address}}</view>
						</view>
						<store-nav :mobile="items.mobile" :address="items" :storeId="items.id" :busId="items.bus_id"></store-nav>
					</view>
					<view class="moreStore f-28 col-9 dis-flex flex-y-center flex-x-center border-line border-top" @click="skipStore(bus_id)">
						<view>查看更多店铺</view>
						<view class="iconfont icon-xialajiantouxiao m-left12"></view>
					</view>
				</view>

				<view v-if="showBusQual" class="aptitude-content" @click="showQuaImgs">
					<NavList :itemStyle="itemStyle" :itemData="itemData"></NavList>
				</view>

				<!-- 商家资质 -->
				<view class="brand-content">
					<copyright></copyright>
				</view>
			</view>
		</view>


		<shortcut></shortcut>
		<!-- 分享菜单 -->
		<ShareView ref="shareView" :pid="Storedetail.id" :poster-type="'store'" viewStyle="2"></ShareView>
	</view>
</template>

<script>
import ShareView from '@/components/template/ShareView.vue'
import NavList from '@/components/page/pageComponents/NavList.vue'
import DiyTitle from '@/components/page/pageComponents/Title.vue'
import shortcut from '@/components/template/ShortCut.vue'
import App from '@/common/js/app.js'
import Copyright from '@/components/template/Copyright.vue'
import StoreNav from '@/components/template/StoreNav.vue'
import loadMore from '@/components/template/Loadmore.vue'
// #ifdef H5
import wxApi from '@/static/h5/wxApi.js'
// #endif
export default {
    data() {
        return {
            last_page: 1,
            store: 2,
            bus_id: null,
            group_id: null,
            Storedetail: {},
            shareData: null,
            page: 1,
            isMore: false,
            weekMap: {
                monday: '周一',
                tuesday: '周二',
                wednesday: '周三',
                thursday: '周四',
                friday: '周五',
                saturday: '周六',
                sunday: '周天'
            },
            titleStyle1: {
                display: '1',
                margincol: '10',
                marginrow: uni.upx2px(24)
            },
            titleParams1: {
                maintext: '店长推荐',
                showmore: '2'
            },
            titleStyle2: {
                display: '1',
                margincol: '10',
                marginrow: '0'
            },
            titleParams2: {
                maintext: '店铺信息',
                showmore: '2'
            },
            itemData: [
                {
                    link: '',
                    title: '商家资质'
                }
            ],
            itemStyle: {
                radius: '2',
                margincol: '0',
                marginrow: '0'
            },
            goodsList: [],
            goodspage: 1,
            last_page: 0
        }
    },
    components: {
        ShareView,
        NavList,
        DiyTitle,
        shortcut,
        Copyright,
        StoreNav,
        loadMore
    },

    computed: {
        height() {
            return (240 * this.goodsList.length) + 'rpx'
        },
        // 是否展示商家资质
        showBusQual() {
            return this.Storedetail && this.Storedetail.is_bus_qual == 1
        }
    },
    beforeCreate() {

    },
    onLoad(options) {
        let scene = App.getSceneData(options),
            bus_id = scene.bus_id ? scene.bus_id : options.bus_id,
            group_id = scene.group_id ? scene.group_id : (options.group_id || '')
        // #ifdef MP-ALIPAY
        if (App.query) {
            bus_id = App.query.bus_id
            group_id = App.query.group_id
        }
        // #endif
        this.bus_id = bus_id
        this.group_id = group_id
        this.getStoredetail(bus_id, group_id)
    },
    onShow() {
        // this.goodsList = []
        this.setIndex()
        this.goodsList = []
        this.goodspage = 1
        this.getBusGoodsList()
    },
    methods: {
        goodsListMore() {
            this.goodspage++
            if (this.goodspage <= this.last_page) {
                this.getBusGoodsList()
            }
        },
        getBusGoodsList() {
            App._post_form('Business/getBusinessGoodsLists', {
                bus_id: this.bus_id,
                page: this.goodspage,
                list_rows: 15
            }, res => {
                let { current_page, data, last_page } = res.data
                this.goodsList.push(...data)
                this.goodspage = current_page
                this.last_page = last_page

                this.goodspage >= this.last_page || res.data.total == 0 ? (this.isMore = false) : (this.isMore = true)


            })
        },
        setIndex() {
            App._post_form('setting/index', {}, res => {

                this.store = res.data.businessStore.store_style
            })
        },
        /**
			 * 店铺详情
			 */
        getStoredetail(bus_id, group_id, page = 1, isPage = false) {
            let _this = this
            return new Promise((resolve, reject) => {
                App._get('Business/businessDetails', {
                    id: bus_id,
                    group_id: group_id, // 砍价团id
                    page,
                    no_login: 1
                }, res => {
                    if (!!res.data.store) {
                        res.data.store.map(val => {
                            const hasTime = val.time && Array.isArray(val.time) && val.time.length > 0
                            if (hasTime) {
                                val.time.map(item => {
                                    item[0] = _this.$util.formatTime(item[0] / 1000, 'rule', ':').substr(-5, 5)
                                    item[1] = _this.$util.formatTime(item[1] / 1000, 'rule', ':').substr(-5, 5)
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
                                            result.push(_this.weekMap[`${item}`])
                                        })
                                        val.$week = result.join(' ')
                                    }
                                }
                            }

                            val.start_time = _this.$util.formatTime(val.start_time, 'rule', ':').substr(-5, 5)
                            val.end_time = _this.$util.formatTime(val.end_time, 'rule', ':').substr(-5, 5)

                            return val
                        })
                        if (isPage) {
                            _this.Storedetail.goods_list.data.push(...res.data.goods_list.data)
                        } else {
                            _this.Storedetail = res.data
                            _this.setShareData(res.data)
                        }
                    }

                    if (!!res.data.bargain_money) {
                        uni.setStorageSync('bargainvisit', `${res.data.bargain_money}|${group_id}`)
                    } else {
                        uni.removeStorageSync('bargainvisit')
                    }
                })
            })
        },
        setShareData(storeDetail) {
            let clientType = App.getClientType(),
                shareData = null
            if (clientType === '4') {
                jWeixin.ready(() => {
                    wxApi.wxShare({
                        title: storeDetail.name, // 分享标题
                        desc: storeDetail.describe, // 分享描述
                        link: `${App.siteInfo.siteroot}h5/#/pages/subPages/store/index?bus_id=${storeDetail.id}&referee_id=${this.globalSaveRefereeId}&i=${App.getUniacid()}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: storeDetail.logo // 分享图标
                    })
                })
            } else {
                shareData = {
                    title: storeDetail.name + '邀请您来看看~',
                    imageUrl: storeDetail.logo,
                    path: `/pages/subPages/store/index?bus_id=${storeDetail.id}&referee_id=${this.globalSaveRefereeId}`
                }
            }
            this.shareData = shareData
        },
        /**
			 * 跳转门店列表
			 */
        skipStore(bus_id) {
            App.navigationTo({
                url: `pages/subPages/store/list?bus_id=${bus_id}`
            })
        },
        navigationTo(goods_id, goods_type) {
            let member_type = goods_type === 1 ? '&goods_type=member_goods' : ''
            App.navigationTo({
                url: 'pages/subPages/goods/index/index?goods_id=' + goods_id + member_type
            })
        },
        showQuaImgs() {
            if (this.Storedetail.quaimg.length > 0) {
                console.log(11112)
                let quaimg = this.Storedetail.quaimg.map(val => val.file_path)
                uni.previewImage({
                    urls: quaimg,
                    fail(err) {
                        console.log(err)
                    }
                })
            } else {
                console.log(22222)
                uni.showToast({
                    icon: 'none',
                    title: '暂未上传商家资质'
                })
            }
        },
        /**
			 * 商品切换
			 */
        swiperChange(e) {
            let current = e.detail.current,
                goods_list = this.Storedetail.goods_list
            if (current === goods_list.data.length - 2) {
                if (this.page < goods_list.last_page) {
                    this.getStoredetail(this.bus_id, this.group_id, ++this.page, true)
                }
            }
        }
    },
    onShareAppMessage(res) {
        return this.shareData
    }
}
</script>

<style lang="scss">
	.goods-list2 {
		box-shadow: 0 0 5rpx #C4BDB9;
		width: 95%;
		margin: 20rpx auto;
		border-radius: 10rpx;
		padding: 14rpx;
		box-sizing: border-box;
	}

	.header swiper {
		height: 400upx;
	}

	.header-bg {
		width: 100%;
	}

	.section {
		position: relative;
		top: -70upx;
		margin-bottom: 160upx;
	}

	.store-letter {
		border-radius: 20upx;
		padding: 20upx;
		/* box-shadow: 0 0 10upx #D1D1D1; */
	}

	.logo-name {
		/* padding: 0 60upx; */
	}

	.logo {
		width: 100upx;
		height: 100upx;
		margin: 10upx 20upx 12upx 20upx;
	}

	.logo image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.name {
		line-height: 70upx;
	}

	.notice {
		position: relative;
		font-size: 28upx;
		line-height: 1.6em;
		background-color: rgb(255, 252, 233);
		border-radius: 50upx;
		margin-top: 20upx;
		padding: 20upx;
	}

	.notice:after {
		content: "";
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 20upx;
		border-color: transparent transparent rgb(255, 252, 233) transparent;
		position: absolute;
		left: 60upx;
		top: -36upx;
	}

	.have-read {
		padding: 0 10upx;
	}

	.have-read .goods-already-user {
		padding: 20upx 0;
		height: 68upx;
	}

	.have-read .goods-already-user .user-avatar {
		width: 50upx;
		height: 50upx;
		border-radius: 50upx;
		display: inline-block;
		margin-right: -16upx;
		position: relative;
		vertical-align: top;
	}

	.have-read .goods-already-user .user-avatar.user-more {
		background: #F2F2F2;
		color: #999999;
		text-align: center;
		line-height: 68upx;
		z-index: 1;
	}

	.have-num text {
		margin-right: 4upx;
	}

	.bor-raidus20 {
		border-radius: 20upx;
	}

	.p-box-24 {
		padding: 24upx 0;
		box-sizing: border-box;
	}

	.buzz {
		overflow: hidden;
		/* box-shadow: 0 0 10upx #D1D1D1; */
	}

	.buzz-scroll {
		margin-right: 20upx;
		white-space: nowrap;
	}

	.buzz-imag {
		display: inline-block;
		position: relative;
		margin-right: 20upx;
		width: 600upx;
		height: 300upx;
	}

	.buzz-imag image {
		width: 100%;
		height: 100%;
		border-radius: 12upx;
	}

	.store-contet {
		align-items: center;
		margin-bottom: 30upx;
	}

	.store-contet .msg {
		position: relative;
		width: 78%;
	}

	.msg .store-address {
		line-height: 40upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.time-icon {
		font-size: 26upx !important;
		margin-right: 4upx;
	}

	.mobile {
		flex: 1;
		position: relative;
		width: 22%;
	}

	.mobile-icon {
		font-size: 40upx;
		text-align: center;
		padding: 0 16upx;
		color: #999999;
	}

	.mobile-text {
		text-align: center;
		margin-left: 15%;
	}

	.mobile:before {}

	.store-right-icon {
		position: absolute;
		right: 4%;
		top: 35%;
		transform: translateY(-50%);
	}

	.aptitude-title {
		padding: 12upx 30upx;
	}

	.aptitle-icon {
		color: #999999;
		font-size: 28upx;
	}

	.brand-content {
		background-color: rgb(245, 245, 245);
	}

	/* 	.brand-content {

	} */
	.brand-title {
		text-align: center;
		line-height: 100upx;
	}

	.footer {
		margin-top: -70upx;
	}

	.share {
		border-top: 1px solid rgb(244, 244, 244);
	}

	.share .share-btn {
		position: relative;
		width: 50%;
		text-align: center;
		height: 90upx;
		line-height: 90upx;

	}

	.share .share-btn button {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}

	.store-msg {
		padding: 0 24upx 0 24upx;
		/* box-shadow: 0 0 10upx #D1D1D1; */
	}

	.share-fg {
		border-right: 1px solid rgb(244, 244, 244);
	}

	.moreStore {
		height: 70upx;
		line-height: 70upx;
	}


	/* 商品列表 */
	.goods-list {
		height: 500upx;
	}

	.goods-item {
		padding: 0 24upx;
	}

	.goods-item-img {
		width: 100%;
		height: 48vw;
		display: block;
		overflow: hidden;
		border-radius: 6upx;
		background-size: cover;
		background-position: center;
	}

	.goods-item-img image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.goods-item-money-old {
		margin-left: 12upx;
		text-decoration: line-through;
	}

	.goods-item-buy {
		font-size: 26upx;
		line-height: 2.2em;
		background: #FFD940;
		background-color: var(--help-color);
		padding: 0 20upx;
		border-radius: 60upx;
		color: #333333;
		color:  var(--auxiliary-color);
	}

	.aptitude-content {
		border-radius: 20upx;
		overflow: hidden;
		/* box-shadow: 0 0 10upx #D1D1D1; */
	}
</style>
