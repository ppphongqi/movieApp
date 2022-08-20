<template>
	<view class="">
		<view class="contaienr">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular='true'>
				<swiper-item v-for="(item,index) in swiperData" :key='index' >
					<view class="swiper-item bor-radius-10" style="height: 100%;"  @click="navigationTo(item.link)">
						<image :src="(item.image&&item.image.length>0)?item.image[0].file_path:''" mode="aspectFill" class="image-part" ></image>
					</view>
				</swiper-item>

			</swiper>
			<u-sticky @fixed="isNavWrapperFixed = true" @unfixed="isNavWrapperFixed = false" h5-nav-height="0">
				<view class="nav-wrapper" :class="{'is-fixed': isNavWrapperFixed}">
					<scroll-view scroll-x="true" style="height: 132rpx;">
						<view class="dis-flex flex-y-center " >
							<view v-for="(item,index) in kindData" style="width: 100rpx;" class="kind-item t-c dis-flex flex-dir-column flex-x-center flex-y-center" :key='index' :class="{'m-left-40':index}" @click="confirmCategory(item,index)">
								<view class="box dis-flex flex-y-center flex-x-center" :class="{'active':index == current}">
									<image :src="(item.image&&item.image.length>0)?item.image[0].file_path:''"  mode="aspectFill"></image>
								</view>
								<view class="col-9 f-24 m-top20 t-c " style="width: 100rpx;"  :class="{'f-26 f-w col-3':index === current}">{{item.sort_name}}</view>
							</view>

						</view>
					</scroll-view>
					<!-- 筛选部分 -->
					<view class=" ">
						<!-- 筛选条件 -->
						<view class="dis-flex flex-x-between flex-y-center f-24 col-3 m-top40" >
							<view @click="confirmFilter(item,index)" class="dis-flex flex-x-center flex-y-center" v-for="(item,index) in filterData"
							 :key='index' :class="{'filter':item.check}">{{item.name}}
								<i :class="item.icon" style='margin-left: 6rpx;font-size: 24rpx;' :style="item.check && index<2?'transform: rotate(180deg);':''" ></i></view>
						</view>

						<!-- 商圈 -->
						<TradeArea @tradeAreaChange='tradeAreaChange' @isHasData='isHasData'></TradeArea>
					</view>
				</view>
			</u-sticky>


			<!-- 商品列表部分 -->
			<block v-if="isLoading">
				<view class="loading p-r" style="margin-top:160rpx;">
					<block v-if="settingData && settingData.loading_img">
						<view class="diy-loading">
							<image class="loading-image" :src="settingData.loading_img"></image>
							<view class="loading-text">努力加载中...</view>
						</view>
					</block>
					<block v-else>
						<view class="ball-clip-rotate-pulse">
							<view></view>
							<view></view>
						</view>
					</block>
				</view>
			</block>
			<block v-else>
				<view v-if="storeData.length">
					<view class=" goods-item dis-flex m-top-btm20" @click="navigationTo('pages/subPages/shopDetail/shopDetail?store_id='+item.id+'&bus_id='+item.bus_id)"
					 v-for="(item,index) in storeData" :key='index'>
						<!-- 图片部分 -->
						<view class="goods-image">
							<image :src="item.quaimg && item.quaimg.length && item.quaimg[0].file_path?item.quaimg[0].file_path:''" mode="" style="border-radius: 20rpx;"> </image>
							<view class="f-18 dis-flex flex-x-center flex-y-center" v-if="item.store_label">
								{{item.store_label}}
							</view>
						</view>

						<!-- 描述部分 -->
						<view class="m-left20" style="width: 74%;">
							<view class="col-3 f-28 f-w">
								<text v-if="settingData && settingData.businessStore && settingData.businessStore.good_store_name_style && settingData.businessStore.good_store_name_style.indexOf('title') != -1">{{item.business_name}}</text>
								<text v-if="settingData && settingData.businessStore && settingData.businessStore.good_store_name_style && settingData.businessStore.good_store_name_style.indexOf('name') != -1" class="m-left20 f-22">{{item.name}}</text>
							</view>
							<view class="dis-flex flex-x-between  m-top-18">
								<view class=" dis-flex ">

									<view class=" dis-flex  f-24">
										<view class="" style="position: relative;width: 16px;height: 16px;" v-for="(items,itemsdex) in [1,2,3,4,5]" :key="itemsdex">
											 <image src="../../../static/images/goods/half.png" mode="" v-if="((itemsdex+1+itemsdex)/2)==item.store_score" :style="((itemsdex+1+itemsdex)/2)==item.store_score?'z-index:2':''" style="position: absolute;top: 2rpx;left: 2rpx;width: 12px;height: 12px;"></image>
											<view v-if="((itemsdex+1+itemsdex)/2)!=item.store_score" style="position: absolute;top: 0;left: 0;" class="iconfont icon-shoucangxiao select "
											 :style="items<=Math.round(item.store_score)?'color:#F28243;font-size:12px;':'color:#F4F4F4;font-size:12px;'"></view>

										</view>
										<!-- <view class="iconfont icon-shoucangxiao select m-right12" v-for="(items,index) in [1,2,3,4,5]" :key="index"
										 :style="items<item.store_score?'color:#F28243;font-size:12px;':'color:#F4F4F4;font-size:12px;'"></view> -->
									</view>
									<view class="f-22 col-6 m-left12" v-if="item.store_score>0">{{item.store_score}}分</view>
									<text class="f-22 col-6 m-left20" v-if="item.per_capita>0">￥{{item.per_capita?item.per_capita:0}}/人 </text>
								</view>

								<text class="f-22 col-6">{{item.width?item.width:0}}km </text>
							</view>
							<view class="f-22 col-6 dis-flex flex-x-between  m-top-18">

								<view class="">
									<text>{{item.sort_name}}</text>
									<text :style="item.sort_name?'margin-left:20rpx':''">{{item.circle_name}}</text>
								</view>
								<text :style="item.week==1?'color: #F28243;':'color: #666;'" class="f-w">{{item.week==1?'今日营业':'暂停营业'}}</text>


							</view>
							<view class="comment onelist-hidden m-top-18 dis-il-block" v-if="item.store_introduce || item.describe">{{item.store_introduce?item.store_introduce:item.describe}}</view>
							<view class="dis-flex m-top-18 flex-y-center" v-if="item.dis_info">
								<view class="word col-f f-20">惠</view>
								<view class="col-6 f-22 m-left12">{{item.dis_info}}</view>
							</view>
							<!-- <view class="dis-flex m-top-18 flex-y-center" v-if="item.dis_info">
								<view class="word col-f f-20" style="background:rgba(243,162,57,1);">劵</view>
								<view class="col-6 f-22 m-left12">双人餐86.9元起，4人餐269元...</view>
							</view> -->


						</view>


					</view>
					<load-more :showLoadmore="!isMore"></load-more>
				</view>
				<Abnor abnor="GOODS" v-else></Abnor>
			</block>

			<page-loading></page-loading>

			<view v-show="isFilterDis" type="top" class="filter-popup"  :class="{'filter-none':!isCircleData && kindData.length==0,'filter-none1':!isCircleData && kindData.length>0,'filter-none2':isCircleData && kindData.length==0}">

				<!-- 筛选具体条件 -->
				<view class="col-3 f-24 filter-part" >
					<view class="m-top-btm20" v-for="(item,index) in searchData " :key='index' :style="index==0?'border-top: 1rpx solid #DBDBDB;padding-top:20rpx':''" :class="{'filter':searchCurrent==index}"
					 @click="confirmSearch(item,index)"> {{item.name}}</view>
				</view>
				<view class="mask" @click="isFilterDis = false">


				</view>

			</view>

		</view>
		<DiyTab></DiyTab>
	</view>

</template>

<script>
import App from '@/common/js/app.js'
import PopupView from '@/components/template/PopManager.vue'
import TradeArea from '@/components/template/TradeArea.vue'
import LoadMore from '@/components/template/Loadmore.vue'
import DiyTab from '@/components/template/TabBar.vue'
import Abnor from '@/components/template/Abnor.vue'

export default {
    components: {
        TradeArea,
        LoadMore,
        DiyTab,
        Abnor,
        PopupView

    },
    data() {
        return {
            // 页面查询参数
            options: {},
            isCircleData: true,
            isLoading: false,
            isMore: false,
            swiperData: [],
            scropTop: 0,
            isFilterDis: false, // 筛选条件是否展示
            display: true,
            kindData: [],
            current: 0,
            filterData: [
                {
                    id: 0,
                    name: '附近',
                    icon: 'iconfont icon-unfold',
                    check: false
                },
                {
                    id: 1,
                    name: '最新推荐',
                    icon: 'iconfont icon-unfold',
                    check: true
                },
                {
                    id: 2,
                    name: '筛选',
                    icon: 'iconfont icon-filter',
                    check: false
                }
            ],
            searchData: [
                {
                    id: 0,
                    name: '好评优先',
                    type: 'favourable',
                    check: true
                },
                {
                    id: 1,
                    name: '今日营业',
                    type: 'work',
                    check: false
                },
                {
                    id: 2,
                    name: '价格由高到低',
                    type: 'asc',
                    check: false
                },
                {
                    id: 3,
                    name: '价格由低到高',
                    type: 'desc',
                    check: false
                }
            ],
            searchCurrent: -1,
            filterCurrent: 0,
            requestData: {
                isNeibor: 2,
                sort_id: '',
                lng: '',
                lat: '',
                recommend: 1,
                filter: '',
                circle_id: '',
                page: 1
            },
            storeData: [],
            // 当前是否吸顶
            isNavWrapperFixed: false
        }
    },
    onPageScroll(obj) {
        // 		this.$util.debounce(50,()=>{
        // 			this.scropTop = obj.scrollTop
        // 			this.scropTop >= 200 ? (this.display = false) : (this.display = true)
        // 			if(this.scropTop<150) {
        // 				this.isFilterDis = false
        // 				this.filterData[2].check = false

        // 			}
        // 		})

    },
    onLoad(e) {
        this.options = e
        // console.log('onLoad1111111',e)
        App.showLoading()
        this.requestData.sort_id = e.sort_id || ''
        this.clear()
        this.getSeting()
    },
    onPullDownRefresh() {
        !this.display && (this.display = true)
        uni.stopPullDownRefresh()
    },
    onReachBottom() {
        if (this.requestData.page <= this.last_page) {
            this.requestData.page++
            this.isMore = true
            this.getStoreData()
        }
        (this.total == 0 || this.requestData.page > this.last_page) ? this.isMore = false : ''
    },
	    onShow() {
        // this.clear()
        // this.getSeting()
        App.customDefaultShare(this.globalSaveRefereeId, `${App.siteInfo.siteroot}h5/#/pages/subPages/goodshop/goodshop`)
    },
    onShareAppMessage(e) {
        let {
            share_title,
            share_describe,
            app_share_image,
            wechat_share_image
        } = this.settingData.share
        console.log('share_describe-goodshop------------------------- 1111', share_describe)
        return {
            title: share_title || '',
            imageUrl: app_share_image ? app_share_image[0].file_path : '',
            path: '/pages/subPages/goodshop/goodshop?referee_id=' + this.globalSaveRefereeId
        }
    },
    methods: {
        isHasData(data) {
            this.isCircleData = !!data.length
        },
        getSeting() {
            let flag = ''
            App._post_form('setting/index', {}, res => {
                flag = res.data && res.data.businessStore && res.data.businessStore.good_store_style ? res.data.businessStore.good_store_style : 1
            }, res => {}, res => {
                if (flag == 1) {

                    // #ifndef H5
                    uni.redirectTo({
                        url: '/pages/subPages/shopDetail/goodShop',
                        success() {
                            setTimeout(() => {
                                App.hideLoading()
                            }, 1000)
                        }
                    })
                    // #endif
                    // #ifdef H5
                    uni.redirectTo({
                        url: '/pages/subPages/shopDetail/goodShop?i=' + App.getUniacid(),
                        success() {
                            setTimeout(() => {
                                App.hideLoading()
                            }, 1000)
                        }
                    })
                    // #endif
                }
				    if (flag == 2) {
                    this.getLocation()
                    this.getCategoryData()
                    this.getSwiper()
                }

            })
        },
        getSwiper() {
            App._post_form('Business/rotation', {}, res => {
                let { code, data: data = [] } = res
                this.swiperData = data


            })
        },
        tradeAreaChange(item) {
            this.clear()
            this.requestData.circle_id = item.circle_id
            this.isLoading = true
            this.getStoreData()

        },
        clear() {
            this.storeData = []
            this.requestData.page = 1
        },
        getCategoryData() {
            let _this = this
            _this.kindData = []
            App._post_form('sort.Sort/getBusinessSort', {}, res => {

                let {
                    code,
                    data: data = []
                } = res
                this.kindData = this.kindData.concat(data)
                // 更新当前选中的分类
                const index = this.kindData.findIndex(item => '' + item.sort_id === '' + this.options.sort_id)
                this.current = index > -1 ? index : 0
            })
        },
        getLocation() {
            let _this = this
            App.getLocation().then(res => {
                _this.requestData.lng = res.longitude
                _this.requestData.lat = res.latitude
                this.getStoreData()
            }).
                catch(() => {
                    App.hideLoading()
                })
        },
        confirmFilter(item, index) {
            index != 2 && this.clear()
            index != 2 && (this.isLoading = true)
            index != 2 && (item.check = !item.check)
            this.display = false
            if (index == 0) {
                item.check ? this.requestData.isNeibor = 1 : this.requestData.isNeibor = 2
                this.getStoreData()
            }
            if (index == 1) {
                item.check ? this.requestData.recommend = 1 : this.requestData.recommend = 2
                this.getStoreData()
            }

            if (index == 2) {
                this.display = false
                this.scropTop = 300
                this.isFilterDis = !this.isFilterDis

            }


        },
        confirmCategory(item, index) {
            this.clear()
            this.current = index
            this.isLoading = true
            this.requestData.sort_id = item.sort_id
            this.getStoreData()
        },
        confirmSearch(item, index) {
            this.clear()
            this.isLoading = true
            this.searchCurrent = index
            this.requestData.filter = item.type

            this.getStoreData()
            setTimeout(() => {
                this.filterData[2].check = true
                this.isFilterDis = false
            }, 1000)

        },
        getStoreData() {
            App._post_form('Business/storeInfo', this.requestData, res => {
                let {
                    code,
                    data: {
                        data: data = [],
                        last_page,
                        current_page,
                        total
                    }
                } = res
                this.storeData = this.storeData.concat(data)
                this.requestData.page = current_page
                this.setData({
                    last_page,
                    total
                })
                this.total == 0 || this.requestData.page >= this.last_page ? this.isMore = false : ''
                App.hideLoading()
                this.isLoading = false
            }, res => {
                this.isLoading = false
                App.hideLoading()
            })


        }
    }
}
</script>

<style lang="scss" scoped>
	.contaienr {
		padding: 20rpx 30rpx;
		overflow: hidden;
		swiper {
			height: 260rpx;
			overflow: hidden;
			border-radius: 10rpx;
			margin-bottom: 40rpx;
		}

		.image-part {
			width: 100%;
			height: 100% !important;
		}

		.filter {
			color: #F28243;
		}

        .filter-popup {
			position: fixed;
			top: 230rpx;
			left: 0;
			width: 100vw;
			height:calc(100vh - 230rpx);
			z-index: 12;

			.mask {
			   position: absolute;
			   width: 100%;
			   height: 100%;
			   top: 0;
			   left: 0;
		       background-color: rgba(0,0,0,.6);
			   z-index: 1;
			}
		}
		.filter-none {
			top: 120rpx !important;
			height:calc(100vh - 120rpx) !important;
		}
		.filter-none1 {
			top: 176rpx !important;
			height:calc(100vh - 176rpx) !important;
		}
		.filter-none2 {
			top: 226rpx !important;
			height:calc(100vh - 226rpx) !important;
		}
		.filter-part {
			position: absolute;
			width: 100%;
			padding:0 30rpx ;
			box-sizing: border-box;
			top: 0;
			left: 0;
			z-index: 2;

			background-color: #fff;
			border-radius:0px 0px 20rpx 20rpx;
			view {
				border-radius: 0px 0px 20rpx 20rpx;
			}
		}

		.filter-fix {
			width: 100%;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 10;
			background-color: #fff;
			padding: 20rpx 30rpx;
			box-sizing: border-box;

		}

		.m-left-40 {
			margin-left: 30rpx;
		}

		.kind-item {

			.box {
				width: 80rpx;
				height: 80rpx;

				overflow: hidden;
				background: linear-gradient(180deg, rgba(230, 230, 230, 1) 0%, rgba(238, 238, 238, 1) 100%);
				border-radius: 40rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.active {
				background: linear-gradient(0deg, rgba(255, 245, 207, 1), rgba(255, 234, 148, 1));

			}
		}


		.goods-item {

			background-color: #fff;
			border-radius: 10rpx;
			padding: 30rpx 20rpx;
			box-sizing: border-box;
			.goods-image{
				width: 150rpx;
				height: 150rpx;
				border-radius: 10rpx;
				overflow: hidden;
				position: relative;
				image{
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
				}
				view{
					position: absolute;
					top: 0;
					right: 0;
					width:50rpx;
					height:30rpx;
					z-index: 2;
					background:rgba(255,217,64,1);
					border-radius:0rpx 10rpx 0rpx 10rpx;
				}

			}


			.m-top-18 {
				margin-top: 6rpx;
			}

			.comment {
				max-width: 94%;
				color: rgba(242, 130, 67, 1);
				font-size: 20rpx;
				padding: 2rpx 15rpx;
				border: 1rpx solid rgba(242, 130, 67, 1);
				border-radius: 18rpx 15rpx 15rpx 0rpx;
			}

			.word {
				width: 30rpx;
				height: 30rpx;
				text-align: center;
				line-height: 30rpx;
				background: rgba(242, 130, 67, 1);
				border-radius: 4rpx;
			}
		}


	}
	.nav-wrapper {
		box-sizing: border-box;
		padding: 20rpx;
		background-color: #fff;
		height: 310rpx;
		transition: all .2s;
		&.is-fixed {
			margin: 0 -30rpx;
			padding: 20rpx 50rpx;
		}

	}
</style>
