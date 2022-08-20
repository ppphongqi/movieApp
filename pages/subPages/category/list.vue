<template>
	<view class="container" :style="themeColor">
		<view class="list-header">
			<!-- 搜索框 -->
			<view class="dis-flex search-input-box main-bg-color ">
				<view class="search-input ">
					<view class="dis-flex search-box">
						<view class="left">
							<view class="iconfont icon-search"></view>
						</view>
						<view class="right">
							<input class="input" :focus="searchFocus" v-model="searchValue" confirm-type="search" @confirm="search" placeholder="商品名称/店铺名称"
							 placeholderStyle="color:#aba9a9;font-size:12px;" type="text"></input>
						</view>
					</view>
				</view>
				<view class="serch-button f-28 col-3 auxiliary-color" @click="search">
					搜索
				</view>
			</view>
			<view class="search-cont-box" v-if="recentSearch.length && !isSearch">
				<view class="title-box col-9 f-24">最近搜索
					<text @click="clearSearch" class="iconfont icon-delete"></text>
				</view>
				<scroll-view class="scroll-view_H" scroll-x="true">
					<view class="sale-button-box">
						<view class="seconds-kill-li" v-for="(recent,idx) in recentSearch" :key="idx">
							<view @click="goSearch(recent)" class="recent-button" :data-text="recent" v-if="idx < 6">{{recent}}</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 搜索结果 -->
			<!-- 筛选标签 -->
			<view class="store_nav_cont dis-flex b-f main-bg-color" v-if="searchValue !== '' && isSearch">
				<view @click="switchSortType('goods')" class="flex-box t-c p-r" :class="[serchType ==='goods'?'list-true':'list-0']">
					<text class="auxiliary-color">商品</text>
				</view>
				<view @click="switchSortType('business')" class="flex-box t-c p-r" :class="[serchType ==='business'?'list-true':'list-0']">
					<text class="auxiliary-color">店铺</text>
				</view>
			</view>
			<!-- 商品列表 -->
			<block v-if="(searchValue !== '' && isSearch) || categorySearch">
				<scroll-view @scrolltolower="bindDownLoad" class="b-f scrollHeight p-r" scroll-y :style="{'height':scrollHeight}">
					<block v-if="isLoading">
						<view class="loading p-r">
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
						<block v-if="list.data.length">
							<block v-if="serchType ==='goods'">
								<view class="new" :style="{'padding':showView?'15px':'0'}">
									<!-- <GoodsList :item-data="goodsListHandle" :item-style="itemStyle"></GoodsList> -->
									<goods-list
									:is-neibor="0"
									:item-data="goodsListHandle"
									:item-style="itemStyle">
									</goods-list>
								</view>
							</block>
							<block v-if="serchType === 'business'">
								<view class="store-item b-f bor-radius-10upx padding-box-all m-btm20 border-line border-bottom" v-for="(store,index) in list.data"
								 :key="store.id">
									<view class="item-header dis-flex" @click="goStore(store.id)">
										<view class="store-logo bor-radius-10upx" :style="{'background-image':'url('+(store.logo?store.logo.file_path:'')+')'}"></view>
										<view class="item-content dis-flex flex-dir-column flex-x-between">
											<view class="store-title dis-flex flex-x-between flex-y-center">
												<view class="store-title-w f-30 col-3 f-w onelist-hidden">{{store.name}}</view>
												<view class="store-btn t-c f-24 col-3 bor-radius-10upx">进店</view>
											</view>
											<view class="store-address f-24 col-9 onelist-hidden" v-if="store.address">
												<text class="iconfont icon-dingweixiao"></text>
												<text class="store-address-w">{{store.address}}</text>
											</view>
											<view class="action dis-flex f-24 col-9 flex-y-center p-r">
												<!-- <view class="distance">541公里</view>
												<view class="fgx"></view> -->
												<view class="recommed">{{store.viewed}}人推荐</view>
											</view>
										</view>
									</view>
								</view>
							</block>
							<load-more :showLoadmore="!showLoadmore"></load-more>
						</block>
						<blcok v-else>
							<!-- 无数据 -->
							<view class="yoshop-notcont" style="margin-top:130px;">
								<Abnor></Abnor>
							</view>
						</blcok>

					</block>
				</scroll-view>
			</block>
		</view>
		<view class="recommend_re" :style="{'margin-top':recommendTop === null ? '100vh' :recommendTop+'px'}" v-if="!isSearch">
			<recommend-goods :recommendclass="RecommendClass" :isShowCopyRight="false" @onReady="onRecommendReady"></recommend-goods>
		</view>
	</view>
</template>

<script>
import RecommendGoods from '@/components/template/RecommendGoods.vue'
import GoodsList from '@/components/page/pageComponents/GoodsCard.vue'
import Abnor from '@/components/template/Abnor.vue'
import LoadMore from '@/components/template/Loadmore.vue'
import App from '@/common/js/app.js'
export default {
    data() {
        return {
            showView: false, // 列表显示方式
            searchValue: '', // 搜索文字
            recentSearch: [], // 最近搜索
            serchType: 'goods',
            categorySearch: false, // 是否分类搜索
            isSearch: false, // 是否搜索
            option: {}, // 当前页面参数
            list: {
                data: []
            }, // 商品列表数据
            no_more: false, // 没有更多数据
            isLoading: true, // 是否正在加载中
            page: 1, // 当前页码
            RecommendClass: 1, // 分类推荐商品样式
            // itemStyle: {
            // 	display: "1-2",
            // 	margincol: "10",
            // 	marginrow: "15"
            // },
            recommendTop: null,
			searchFocus: false
        }
    },
    components: {
        GoodsList,
        Abnor,
        LoadMore,
        RecommendGoods
    },
    computed: {
        itemStyle() {
            let itemStyle = {
                    display: '3',
                    margincol: '10',
                    marginrow: '15'
                },
                is_goods_long = this.settingData.is_goods_long
            // 判断推荐商品列表是否存在，使用长方形样式
            if (is_goods_long && Array.isArray(is_goods_long) && is_goods_long.indexOf('2') != '-1') {
                itemStyle.display = '1-2'
            }
            return itemStyle
        },
        goodsListHandle() {
            let _this = this
            if (_this.list.data.length > 0 && _this.serchType === 'goods') {
                let goodsListData = _this.list.data.map(val => {
                    val.goods_image = this.$util.deepGet(val, 'image.0.file_path', '')
                    // val.goods_price = val.spec_type === 20 ? val.goods_min_price : (val.sku[0] ? val.sku[0].goods_price : "");
                    val.goods_price = val.display ? val.goods_price : (val.spec_type === 20 ? val.goods_min_price : (val.sku[0] ? val.sku[0].goods_price : ''))
                    val.line_price = this.$util.deepGet(val, 'sku.0.line_price')
                    return val
                })
                return goodsListData
            }
        },
        scrollHeight() {
            let isH5 = this.appClientType === '3' || this.appClientType === '4',
                searchValue = this.searchValue,
                isLoading = this.isLoading,
                height = `calc(100vh - ${isLoading || searchValue === '' ? '100rpx' : '180rpx'})`
            return height
        }
    },
    onLoad(option) {
        this.pageLoad(option)
    },
    onShow() {

    },
    mounted() {
		setTimeout(()=>{
			this.searchFocus = true
		},1000)
    },
    watch: {
        searchValue(newValue) {
            if (newValue === '') {
                this.list.data = []
                this.isSearch = false
                this.onRecommendReady()
            }
        },
        recentSearch(newValue) {
            if (newValue.length === 0) {
                this.onRecommendReady()
            }
        }
    },
    methods: {
        querySelect(queryString, params) {
            let query = uni.createSelectorQuery().in(this)
            return new Promise(function (resolve, reject) {
                query.select(queryString).boundingClientRect(data => {
                    resolve(data ? data[params] : 0)
                }).
                    exec()
            })
        },
        async onRecommendReady() {
            let _this = this,
                class_dom = [
                    '.search-input-box',
                    '.search-cont-box',
                    '.recommend_re'
                ],
                windowHeight = uni.getSystemInfoSync().windowHeight,
                recommendTop = 0
            for (let i = 0; i < class_dom.length; i++) {
                class_dom[i] = await this.querySelect(class_dom[i], 'height')
            }
            let [
                    inputBox,
                    contBox,
                    recommend
                ] = class_dom,
                difference = windowHeight - inputBox - contBox
            _this.recommendTop = recommend > difference ? 0 : difference - recommend
            // let val = {
            // 	windowHeight: systemInfo.windowHeight,
            // 	inp_y: inputBox + (contBox != null ? contBox : 0),
            // 	max_y: systemInfo.windowHeight - inputBox - (contBox != null ? contBox : 0),
            // }
            // let difference = 1005 + val.inp_y - val.windowHeight,
            // 	move_y = recommend > val.max_y ? val.max_y + difference : recommend + difference;

            // let animation = uni.createAnimation({
            // 	duration: 300,
            // 	timingFunction: "ease",
            // })
            // this.animation = animation
            // animation.step()
            // this.animationData = animation.export()
            // animation.translateY(-move_y).step()
            // this.animationData = animation.export()


            // new Promise(function(resolve,reject){
            // 	// 获取筛选样式高度
            // 	query.select('.search-input-box').boundingClientRect(data => {
            // 		resolve(data.height);
            // 	}).exec();
            // }).then(val => {
            // 	console.log(".search-input-box高度：",val);
            // 	// 获取最近筛选记录样式高度
            // 	return new Promise(function(resolve,reject){
            // 		query.select('.search-cont-box').boundingClientRect(data => {
            // 			resolve((data != null ? data.height : 0) + val);
            // 		}).exec();
            // 	})
            // }).then(val => {
            // 	console.log(".search-input-box + .search-cont-box高度：",val);
            // 	//获取可用页面高度并计算最大移动高度
            // 	return new Promise(function(resolve,reject){
            // 		uni.getSystemInfo({
            // 			success: function(res) {
            // 				console.log('可用屏幕高度', res.windowHeight);
            // 				let data = {
            // 					windowHeight:res.windowHeight,
            // 					max_y:res.windowHeight - val,
            // 					inp_y:val
            // 				}
            // 				resolve(data)
            // 			}
            // 		});
            // 	})
            // }).then(val => {
            // 	console.log('屏幕高度，最大移动高度,.search-input-box + .search-cont-box高度：',val);
            // 	//计算最终移动高度
            // 	return new Promise(function(resolve,reject){
            // 		query.select('.recommend_re').boundingClientRect(data => {
            // 			console.log("组件高度", data.height);
            // 			// _this.recommendBottom = data.height + 'rpx !important';
            // 			let difference = 1000 + val.inp_y - val.windowHeight;
            // 			console.log('difference',difference);
            // 			if (data.height > val.max_y) {
            // 				resolve(val.max_y + difference);
            // 			} else {
            // 				resolve(data.height + difference);
            // 			}
            // 		}).exec();
            // 	})
            // }).then(val => {
            // 	//最终动画
            // 	console.log('最终移动高度', val);
            // 	var animation=uni.createAnimation({
            // 		duration:300,
            // 		timingFunction:"ease",
            // 	})
            // 	this.animation = animation
            // 	animation.step()
            // 	this.animationData = animation.export()
            // 	setTimeout(function() {
            // 		animation.translateY(-val).step()
            // 		this.animationData = animation.export()
            // 	}.bind(this), 500);
            // })
        },
        pageLoad(option) {
            this.option = option
            if (option.category_id || option.key) {
                let search = option.key ? decodeURIComponent(option.key) : '';
                (!!search) && (this.searchValue = search)
                this.categorySearch = true
                this.getGoodsList(false, 1, search)
            } else {
                this.getRecentSearch()
            }
        },
        /**
			 * 获取商品列表
			 * @param {bool} isPage 是否分页
			 * @param {number} page 指定的页码
			 */
        getGoodsList(isPage = false, page = 1, search = '') {
            let _this = this

            App._get('goods/lists', {
                page: page,
                sortType: 'all',
                sortPrice: 1,
                category_id: this.option.category_id || 0,
                type: _this.serchType,
                search
            }, result => {
                let resList = result.data.list,
                    dataList = _this.list
                if (isPage) {
                    if (dataList.data.length > 0) {
                        _this.list.data = dataList.data.concat(resList.data)
                    }
                } else {
                    _this.list = resList
                }
                _this.no_more = resList.data.length == resList.per_page
                _this.isSearch = true
                _this.$nextTick(() => {
                    _this.isLoading = false
                })
            })
        },

        /**
			 * 搜索提交
			 */
        search() {
            if (this.searchValue) {
                // 记录最近搜索
                let recentSearch = uni.getStorageSync('recentSearch') || []
                let index = recentSearch.indexOf(this.searchValue)
                index > -1 && recentSearch.splice(index, 1)
                recentSearch.unshift(this.searchValue)
                uni.setStorageSync('recentSearch', recentSearch)
                this.goSearch(this.searchValue)
                this.getRecentSearch()
            }
        },

        /**
			 * 快捷搜索
			 */
        goSearch(searchValue) {
            this.setData({
                isLoading: true,
                isSearch: true,
                searchValue: searchValue
            })
            this.getGoodsList(false, 1, searchValue)
        },

        /**
			 * 获取历史搜索
			 */
        getRecentSearch() {
            let recentSearch = uni.getStorageSync('recentSearch') || []
            if (recentSearch.length > 0) {
                this.recentSearch = recentSearch
            }
        },

        /**
			 * 清空最近搜索记录
			 */
        clearSearch() {
            App.showError('是否清空搜索记录', res => {
                if (res.confirm) {
                    uni.removeStorageSync('recentSearch')
                    this.recentSearch = []
                }
            })
        },

        /**
			 * 切换搜索方式
			 */
        switchSortType(type) {
            if (this.serchType !== type) {
                this.setData({
                    list: {
                        data: []
                    },
                    page: 1,
                    serchType: type,
                    isLoading: true,
                    no_more: false
                })
                this.getGoodsList(false, 1, this.searchValue)
            }
        },

        /**
			 * 进入店铺
			 */
        goStore(bus_id) {
            App.navigationTo({
                url: `pages/subPages/store/index?bus_id=${bus_id}`
            })
        },

        /**
			 * 下拉到底加载数据
			 */
        bindDownLoad() {
            // 已经是最后一页
            if (this.page >= this.list.last_page) {
                this.no_more = false
                return false
            }
            // 加载下一页列表
            this.getGoodsList(true, ++this.page, this.searchValue)
        }
    },
    onPullDownRefresh() {

    },
    onShareAppMessage() {
        // 构建分享参数
        let params = App.urlEncode({
            referee_id: App.getUserId()
        })
        return {
            title: '全部分类',
            desc: '',
            path: '/pages/subPages/category/index?' + params + '&referee_id=' + this.globalSaveRefereeId
        }
    }
}
</script>

<style>
	.search-input-box {
		background: #FFD940;
		position: relative;
		bottom: 2upx;
		padding: 18upx 30rpx;
		/* #ifdef H5*/
		/* margin-top: var(--window-top); */
		/* #endif */
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
		height: 120rpx;
	}

	.search-input {
		width: 85%;
		background: rgba(255, 255, 255, 1);
		border-radius: 40upx;
		padding-left: 10upx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.search-input input {
		font-size: 24upx;
		height: 64upx;
		line-height: 64upx;
	}

	.serch-button {
		width: 15%;
		text-align: center;
		line-height: 64upx;
		box-sizing: border-box;
	}

	.serch-button button {
		line-height: 64upx;
		height: 64upx;
		font-size: 28upx;
		border-radius: 0 5px 5px 0;
	}

	.search-cont {
		padding: 0 15px;
		background: #fff;
	}

	.search-box .left {
		width: 28px;
	}

	.search-box .left .iconfont {
		color: rgba(180, 180, 180, 1);
		font-size: 34upx;
		line-height: 1.8em;
		text-align: center;
	}

	.search-box .right {
		flex: 1;
	}

	/* 最近搜索 */
	.seconds-kill-li {
		padding: 10upx 20upx;
		box-sizing: border-box;
		float: left;
	}

	.title-box {
		padding: 30upx 30upx 0;
	}

	.title-box .icon-delete {
		float: right;
	}

	.sale-button-box {
		padding: 10px 10upx;
		display: flex;
		height: 100rpx;
	}

	.sale-button,
	.recent-button {
		background: #EEEEEE;
		padding: 15upx 30upx;
		border-radius: 50px;
		justify-content: center;
		text-align: center;
		font-size: 24upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		height: 30upx;
		line-height: 30upx;
		color: #333333;
	}


	.store_nav_cont {
		height: 80rpx;
		line-height: 80rpx;
		background-color: #FFD940;
		position: relative;
		bottom: 2upx;
	}

	.store_nav_cont .list-true {
		font-weight: 600;
		font-size: 28upx;
	}

	.store_nav_cont .list-0 {
		color: #999;
		font-size: 24upx;

	}

	.store_nav_cont .price__arrow {
		padding-left: 20upx;
		color: #777;
	}

	.store_nav_cont .price__arrow .iconfont {
		font-size: 18upx;
		line-height: 1;
	}

	.store_nav_cont #list-true .price__arrow text.active {
		color: #ff495e;
	}

	.container {
		position: relative;
	}

	.index-cont-search .icon-search {
		left: 0;
		margin-left: 20upx;
	}

	.index-search-box {
		background: #FFD940;
		position: relative;
		bottom: 2upx;
		padding: 18upx 13upx;
		/* #ifdef H5*/
		/* margin-top: var(--window-top); */
		/* #endif */
	}

	.index-search {
		border-bottom: 0;
		background: #fff;
		border-radius: 50upx;
		overflow: hidden;
		position: relative;
		font-size: 32upx;
		color: #999;
		box-sizing: border-box;
		height: 64upx;
		line-height: 64upx;
		margin: 0 10upx;
	}

	.index-cont-search .search-text {
		margin-left: 20upx;
	}

	.list-right {
		width: 60upx;
	}

	.list-right text {
		height: 60upx;
		line-height: 60upx;
		font-size: 40upx;
	}

	.list-header {
		/* position: fixed;
		top: 1upx;
		left: 0;
		right: 0; */
		/* margin-bottom: 1370rpx; */
	}

	.no-more {
		text-align: center;
		color: #737373;
		padding: 20upx 0;
	}

	.category-list {
		overflow: hidden;
	}

	.category-list .list {
		box-sizing: border-box;
		width: 50%;
		float: left;
	}

	.category-list .list:nth-child(2n) {
		border-left: 4upx solid #f7f7f7;
		border-bottom: 8upx solid #f7f7f7;
	}

	.category-list .list:nth-child(2n-1) {
		border-right: 4upx solid #f7f7f7;
		border-bottom: 8upx solid #f7f7f7;
	}

	.category-list .list .left,
	.category-list .right {
		width: 100%;
	}

	.category-list .list .left .img image {
		width: 100%;
		height: 375upx;
		display: block;
	}

	.category-list .right .cont {
		padding: 0 12upx;
	}

	.category-list .right .cont .title {
		height: 76upx;
		line-height: 1.3;
	}

	.category-list.arrange .list {
		overflow: hidden;
		padding: 15upx;
		border-bottom: 1upx solid #f7f7f7;
		width: 100%;
	}

	.category-list.arrange .list .left {
		width: 35%;
		float: left;
	}

	.category-list.arrange .list .right {
		width: 65%;
		float: left;
	}

	.category-list.arrange .list .left .img image {
		width: 220upx;
		height: 220upx;
	}

	.bg-op {
		background-color: rgba(255, 255, 255, .5) !important;
	}

	.scrollHeight {
		width: 100vw;
		background: #F5F5F5;
	}

	.loading {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.yoshop-notcont {
		background: #FFFFFF !important;
		margin-top: 0 !important;
	}

	/* 商家列表 */
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

	/* #ifdef H5 */
	.search-input>>>.uni-input-wrapper .uni-input-form {
		height: 100%;
	}

	/* #endif */
	.recommend_re {
		position: relative;
		transition: margin-top .3s ease-out;
	}
</style>
