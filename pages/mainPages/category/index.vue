<template>
	<view class="container" :class="tabContainer" :style="themeColor">
		<page-header :content-show="false" comPage="query" backgroundColor="#FFFFFF">
			<block slot="user">
				<view class="index-search-box">
					<view class="index-search " hover-class="none" openType="navigate" @click="navigationTo('pages/subPages/category/list')">
						<view class="index-cont-search dis-flex flex-y-center">
							<view class="iconfont icon-search p-r"></view>
							<view>{{searchName}}</view>
						</view>
					</view>
				</view>

				<!--  -->
				<view class="cate-content search-class-list-1">
					<scroll-view scroll-x="true" style="height: 100rpx;">
						<view class="main-class dis-flex flex-y-center">
							<view class="main-class-item kind-item t-c dis-flex flex-dir-column flex-x-center flex-y-center" :class="{'active':mainIndex === -1}"
							 @click="filterChange(-1,-1,'main')">
								<view class="f-28 m-top20 t-c ">全部分类</view>
							</view>
							<block v-for="(item, mIndex) in list" :key="mIndex">
								<view class="main-class-item kind-item t-c dis-flex flex-dir-column flex-x-center flex-y-center" :class="{'active':mainIndex == mIndex}"
								 @click="filterChange(item.category_id,mIndex,'main')">
									<view class="f-28 m-top20 t-c">{{ item.name }}</view>
								</view>
							</block>
						</view>
					</scroll-view>

					<view v-if="list[mainIndex] && list[mainIndex].child.length>0" class="small-class-list border-line border-bottom search-border-line">
						<block>
							<view class="us-look f-24">大家都在看:</view>
							<scroll-view scroll-x="true" class="us-look-list">
								<view class="dis-flex flex-y-center small-class-item-box">
									<block v-for="(item,sIndex) in list[mainIndex].child" :key="item.category_id">
										<view class="small-class-item main-class-item-1 kind-item t-c dis-flex flex-dir-column flex-x-center flex-y-center"
										 :class="{'active':small_id === item.category_id}" @click="filterChange(item.category_id,sIndex,'small')">
											<view class="f-24 t-c">
												{{item.name}}
											</view>
										</view>
									</block>
								</view>
							</scroll-view>
						</block>
					</view>
				</view>
			</block>
		</page-header>
		<!-- 搜索框 -->


		<!-- 筛选条件 -->
		<view v-if="showProduct" class="search-query-box" :class="isTabarFixed?'fixed':''">
			<view class="dis-flex flex-x-between flex-y-center col-3">
				<view @click="confirmFilter(item,index)" class="dis-flex flex-x-center flex-y-center f-28 class-list-box" v-for="(item,index) in filterData"
				 :key='index' :class="{'filter':item.check || (index === 0 && item.name != '商圈') }">
					<text class="num-height-1">{{item.name}}</text>
					<i :class="item.icon" style='margin-left: 6rpx;font-size: 24rpx;' :style="item.check?'transform: rotate(180deg);':''"></i></view>
			</view>
			<!-- 商圈 -->
			<view class="shangq-box" :class="showShangqBox?'active':''" v-show="showShangqBox">
				<view class="f-28">热门商圈：</view>
				<scroll-view scroll-y="true" style="max-height: 400upx;">
					<ul class="clear" style="padding-left:0;">
						<li class="fl shangq-list num-height-1" :class="shangqListIdx==index?'active':''" @click="changeShangQListIdx(item,index)"
						 v-for="(item,index) in kindData" :key="index">
							<text class="num-height-1">{{item.circle_name}}</text>
						</li>
					</ul>
				</scroll-view>
			</view>
		</view>


		<!-- 分类样式：一级分类(大图) 10 -->
		<!-- <view class="cate-content" v-if="templet.category_style == 10 && list.length > 0">
			<view class="cate-wrapper cate_style__10">
				<scroll-view :scroll-y="true" :style="'height: '+(scrollHeight - 10)+'px; '">
					<view class="cate-item" v-for="(item, key) in list" :key="key">
						<navigator hover-class="none" :url="'../category/list?category_id='+item.category_id">
							<image mode="widthFix" :src="item.image ?item.image.file_path:'' "></image>
						</navigator>
					</view>
				</scroll-view>
			</view>
		</view> -->

		<!-- 分类样式：一级分类(小图) 11 -->
		<!-- <view class="cate-content" v-else-if="templet.category_style == 11 && list.length > 0">
			<view class="cate-wrapper cate_style__11">
				<scroll-view class="clear" :scroll-y="true" :style="'height: '+(scrollHeight - 10)+'px; '">
					<view class="cate-item" v-for="(item, key) in list" :key="key">
						<navigator hover-class="none" :url="'../category/list?category_id='+item.category_id">
							<image mode="widthFix" :src="item.image ?item.image.file_path:''"></image>
							<text class="f-26">{{ item.name }}</text>
						</navigator>
					</view>
				</scroll-view>
			</view>
		</view> -->

		<!-- 分类样式：二级分类 20 -->
		<view class="cate-content dis-flex" v-if="false">

			<!-- 左侧 一级分类 -->
			<scroll-view class="cate-left f-28" :scroll-y="true">
				<text @click="selectNav" class="type-nav" :class="{selected: curNav==item.category_id}" :data-id="item.category_id"
				 :data-index="key" v-for="(item, key) in list" :key="key">{{ item.name }}</text>
			</scroll-view>

			<!-- 右侧 二级分类 -->
			<scroll-view class="cate-right b-f" :scroll-top="scrollTop" :scroll-y="true">
				<view v-if="list[curIndex]">
					<view class="cate-right-cont">
						<view class="cate-two-box">
							<view class="cate-cont-box">
								<view class="flex-three" :data-list="index" v-for="(item, key,index) in list[curIndex].child" :key="key">
									<navigator hover-class="none" :url="'../category/list?category_id='+item.category_id">
										<view class="cate-img" :id="item.file_id">
											<image :src="item.image ? item.image.file_path:''"></image>
										</view>
										<text>{{item.name}}</text>
									</navigator>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 分类样式 分类筛选 -->
		<view class="cate-content" style="position: relative;z-index:7;">
			<!-- 	<view class="main-class dis-flex">
				<view class="main-class-all">
					<view class="main-class-item f-26 " :class="{'allactive':mainIndex === -1}" @click="filterChange(-1,-1,'main')">全部</view>
				</view>
				<view class="main-class-list">
					<block v-for="(item, mIndex) in list" :key="mIndex">
						<view class="main-class-item" :class="{'active':mainIndex == mIndex}" @click="filterChange(item.category_id,mIndex,'main')">{{ item.name }}</view>
					</block>
				</view>
			</view>
			<view class="small-class-list f-28 border-line border-bottom">
				<block v-if="mainIndex !== -1">
					<block v-for="(item,sIndex) in list[mainIndex].child" :key="item.category_id">
						<view class="small-class-item" :class="{'active':small_id === item.category_id}" @click="filterChange(item.category_id,sIndex,'small')">{{item.name}}</view>
					</block>
				</block>
			</view> -->

			<scroll-view scroll-y="true" style="background: #F5F5F5;">
				<view class="goods-list">
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
						<block v-if="!!goodsListHandle && goodsListHandle.length>0">

							<view class="goods-card-box">
								<goods-list :is-neibor="paramsObj.isNeibor" :item-data="goodsListHandle" :item-style="itemStyle">
								</goods-list>
							</view>

							<load-more :showLoadmore="!showLoadmore"></load-more>
						</block>
						<block v-else>
							<Abnor abnor="GOODS"></Abnor>
						</block>
						<view class="m-top20" v-if="!showLoadmore">
							<recommend-goods :recommendclass="RecommendClass"></recommend-goods>
						</view>
					</block>
				</view>
			</scroll-view>
			<view v-show="showShangqBox" @click="showShangqBox=false" style="position: absolute;z-index: 8;background: rgba(0,0,0,.7);left: 0;bottom: 0;right: 0;top: 0;"></view>
		</view>

		<view v-if="!list.length && notcont">
			<view class="yoshop-notcont">
				<text class="iconfont icon-wushuju"></text>
				<text class="cont">亲，暂无商品分类哦</text>
			</view>
		</view>
		<!-- 返回顶部 -->
		<GoTopBtn :page-scroll="pageScroll"></GoTopBtn>
		<DiyTab></DiyTab>
		<shortcut id=""></shortcut>
		<page-loading ref="loading"></page-loading>
		<!-- #ifdef H5 -->
		<FollowImgPopup v-if="settingData && settingData.qzgz" :visible="settingData.qzgz.indexOf('search') !== -1"></FollowImgPopup>
		<!-- #endif -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import PageHeader from '@/components/template/PageHeader.vue'
	import DiyTab from '@/components/template/TabBar.vue'
	import LoadMore from '@/components/template/Loadmore.vue'
	import GoodsList from '@/components/page/pageComponents/GoodsCard.vue'
	import RecommendGoods from '@/components/template/RecommendGoods.vue'
	import GoTopBtn from '@/components/template/GoTopBtn.vue'
	import Abnor from '@/components/template/Abnor.vue'
	import listMixin from '@/common/js/pageListMixin.js'
	import shortcut from '@/components/template/ShortCut.vue'
	import TradeArea from '@/components/template/TradeArea.vue'
	// #ifdef H5
	import FollowImgPopup from '@/components/page/pageComponents/FollowImgPopup.vue'
	// #endif
	export default {
		mixins: [listMixin],
		data() {
			return {
				appSetting: {},
				paramsObj: {
					circle_id: '', // 商圈id
					isNeibor: 0, //
					newest: 0,
					lat: '',
					lng: ''
				},

				filterDataIdx: -1,
				shangqListIdx: -1,
				isTabarFixed: false,
				showShangqBox: false,

				kindData: [],
				// requestData: {
				// 	isNeibor: 2,
				// 	sort_id: '',
				// 	lng: '',
				// 	lat: '',
				// 	recommend: 1,
				// 	filter: '',
				// 	circle_id: '',
				// 	page: 1
				// },

				// 搜索框样式
				searchColor: 'rgba(0,0,0,0.4)',
				searchSize: '15',
				searchName: '搜索商品',
				diyItems: [],
				// 列表高度
				scrollHeight: 0,

				// 一级分类：指针
				curNav: true,
				curIndex: 0,

				// 分类列表
				list: [],
				templet: {
					category_style: '',
					share_title: ''
				},
				// show
				notcont: false,
				scrollTop: 0,

				// 分类筛选
				mainIndex: -1,
				smallIndex: 0,
				main_id: -1, // 一级分类id
				small_id: '', // 二级分类id
				// itemStyle: {
				// 	display: "3",
				// 	margincol: "10",
				// 	marginrow: "15"
				// },
				cate_id: null, // 当前分类id
				page: 1, // 当前页数
				showLoadmore: false, // 是否显示加载状态
				goods_list: {
					data: []
				},
				isLoading: false,
				RecommendClass: 1, // 分类推荐商品样式


				filterData: [{
						id: 0,
						name: '商圈',
						icon: 'iconfont icon-unfold',
						check: false
					},
					{
						id: 1,
						name: '最新推荐',
						icon: 'iconfont icon-unfold',
						check: false
					},
					{
						id: 2,
						name: '附近优先',
						icon: 'iconfont icon-unfold',
						check: false
					}
				]
			}
		},
		components: {
			DiyTab,
			PageHeader,
			GoodsList,
			LoadMore,
			RecommendGoods,
			GoTopBtn,
			Abnor,
			shortcut,
			TradeArea,
			// #ifdef H5
			FollowImgPopup
			// #endif
		},
		computed: {
			showProduct() {
				// let appSetting = this.$store.getters.getappSetting
				// console.log('-----------------------------------------------',this.$util.deepGet(this.$store.getters,'getappSetting.product', ''));
				return this.$util.deepGet(this.$store.getters, 'getappSetting.product', '') === '1'
			},
			itemStyle() {
				let itemStyle = {
						display: '3',
						margincol: '10',
						marginrow: '15'
					},
					is_goods_long = this.settingData.is_goods_long

				// 判断推荐商品列表是否存在，使用长方形样式
				if (is_goods_long && Array.isArray(is_goods_long) && is_goods_long.indexOf('2') != '-1') {
					itemStyle.display = '1-2' // 3、4正方形  1-2、1-3长方形
				}
				return itemStyle
			},
			goodsListHandle() {
				// console.log(uni.getStorageSync('appSetting'), '==================')
				let _this = this,
					// appSetting = this.$store.getters.getappSetting,
					is_goods_long = this.$util.deepGet(this.$store.getters, 'getappSetting.is_goods_long', '')
				if (_this.goods_list) {
					let goodsListData = _this.goods_list.data.map(val => {
						val.goods_image = val.image[0] ? val.image[0].file_path : ''
						// val.goods_price = val.spec_type === 20 ? val.goods_min_price : (val.sku[0] ? val.sku[0].goods_price : "");
						val.goods_price = val.display ? val.goods_price : (val.spec_type === 20 ? val.goods_min_price : (val.sku[0] ?
							val.sku[0].goods_price : ''))
						val.line_price = val.sku[0] ? val.sku[0].line_price : ''
						val.member_price = val.coupon_price || 0 // 专享
						val.priceEarn = val.dealer_money || 0 // 返利
						val.commission = '返'
						val.charges = '1'
						return val
					})
					// console.log(goodsListData, '计算属性总')
					return goodsListData
				}
				// console.log("appSetting", appSetting)
				// 判断商品列表是否存在，使用长方形样式
				if (is_goods_long && Array.isArray(is_goods_long) && is_goods_long.indexOf('2') != '-1') {
					_this.itemStyle.display = '1-2'
				}
			}

		},
		beforeCreate() {
			// #ifdef MP-WEIXIN
			uni.hideTabBar()
			// #endif


			this.appSetting = this.$store.state.appSetting
		},
		onPageScroll(e) {
			if (e.scrollTop > 125) {
				this.isTabarFixed = true
			} else {
				this.isTabarFixed = false
			}
		},
		onHide() {
			this.showShangqBox = false
		},
		onLoad(options) {
			let _this = this
			App.showLoading()
			// let getappSetting = this.$store.getters.getappSetting;
			let cgp = this.$util.deepGet(this.$store.getters, 'getappSetting.cgp', '')
			if (!!cgp && cgp.open) {
				uni.redirectTo({
					url: '/pages/subPages/cgp/index/index',
					success() {
						App.hideLoading()
					}
				})

				return false
			}

			this.pageLoad(options)
		},
		mounted() {
			this.getCategoryData()

			this.getLocation()
		},
		watch: {
			showShangqBox(val) {
				val ? this.filterData[0].check = true : this.filterData[0].check = false
			},
			settingData: {
				handler(val) {
					if (val && val.goods_page_diy == 2) {
						App.navigationTo({
							url: 'pages/subPages/category/second',
							redirectTo: true
						})
					}
				},
				immediate: true
			}
		},
		methods: {
			// 选择商圈
			changeShangQListIdx(item, index) {
				this.shangqListIdx = index
				this.showShangqBox = false
				this.filterData[0].name = item.circle_name
				this.paramsObj.circle_id = item.circle_id

				this.resetListData()
			},

			getCategoryData() {
				let _this = this
				App._post_form('circle.Businesscircle/getBusinessCircle', {}, res => {
					let {
						code,
						data: data = []
					} = res
					this.kindData = this.kindData.concat(data)
				})
			},

			confirmFilter(item, index) {
				// console.log(item)
				this.filterDataIdx = index
				// 商圈
				if (index === 0) {
					this.showShangqBox = !this.showShangqBox
				} else {
					this.showShangqBox = false
					// 最新推荐
					if (index === 1) {
						// item.check ? this.requestData.recommend = 1 : this.requestData.recommend = 2;
						this.paramsObj.newest = this.paramsObj.newest == 1 ? 0 : 1
						this.filterData[1].check = this.paramsObj.newest == 1
						this.resetListData()
					}
					// 附近优先
					else if (index === 2) {
						// item.check ? this.requestData.isNeibor = 1 : this.requestData.isNeibor = 2;
						this.paramsObj.isNeibor = this.paramsObj.isNeibor == 1 ? 0 : 1
						this.filterData[2].check = this.paramsObj.isNeibor == 1
						// console.log(this.filterData)
						this.resetListData()
					}
				}
			},

			// 重置列表
			resetListData() {
				this.isLoading = true
				// this.mainIndex = -1;
				// this.main_id = -1; //一级分类id
				// this.small_id = ""; //二级分类id
				this.goods_list.data = []
				this.page = 1
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				// console.log('222222222222222222222',this.cate_id, this.page)
				// 商品列表
				this.getGoodsList(this.cate_id || -1, this.page, true)
				// 获取分类列表
				// this.getCategoryList();
			},

			onShow() {
				App.customDefaultShare(this.globalSaveRefereeId, `${App.siteInfo.siteroot}h5/#/pages/subPages/category/index`)
			},

			pageLoad(options) {
				// 设置分类列表高度
				this.setListHeight()
				// 获取分类列表
				this.getCategoryList(options)

			},
			/**
			 * 设置分类列表高度
			 */
			setListHeight: function() {
				let _this = this
				uni.getSystemInfo({
					success: function(res) {
						_this.setData({
							// #ifdef MP-WEIXIN
							scrollHeight: res.windowHeight - 47,
							// #endif
							// #ifdef H5
							scrollHeight: res.windowHeight - 91
							// #endif
						})
					}
				})
			},

			/**
			 * 一级分类：选中分类
			 */
			selectNav(t) {
				// console.log('选中')
				let curNav = t.target.dataset.id,
					curIndex = parseInt(t.target.dataset.index)
				this.setData({
					curNav,
					curIndex,
					scrollTop: 0
				})
			},

			/**
			 * 获取分类列表
			 */
			getCategoryList(options = {}) {
				// console.log('**********************************************')
				let _this = this,
					{
						main_id = -1,
						small_id = ''
					} = options,
					category_id = ''
				App._get('Category/getCateList', {}, function(result) {

					let data = result.data,
						mainIndex = -1,
						smallIndex = 0
					if (data.length > 0 && main_id !== -1) {
						mainIndex = data.findIndex(val => val.category_id === Number(main_id))
						category_id = !!small_id ? small_id : main_id
						// if (mainIndex !== -1) {
						// 	let childData = data.find(val => val.category_id === Number(main_id)).child;
						// 	if (!!childData) {
						// 		smallIndex = childData.findIndex(val => val.category_id === Number(small_id));
						// 	}
						// }
					}
					// console.log(mainIndex, smallIndex);


					// data.unshift({
					// 	category_id: -1
					// })
					_this.setData({
						list: data,
						main_id,
						mainIndex,
						curNav: data.length > 0 ? data[0].category_id : true,
						small_id: !!small_id ? Number(small_id) : (data.length > 0 ? data[0].category_id : true),
						notcont: !data.length
					})
					_this.isLoading = true
					// console.log('333333333333333333333',category_id,_this.page)
					// 获取商品列表
					// _this.getGoodsList(category_id, _this.page, true);

					// _this.resetListData()
				})
			},

			/**
			 * 分类筛选切换
			 */
			filterChange(category_id, index, type) {
				this[`${type}Index`] = index
				if (type === 'main') {
					this.main_id = category_id
					this.small_id = ''
				} else {
					this.small_id = category_id
				}

				this.showShangqBox = false

				this.cate_id = category_id
				this.resetListData()
				// console.log('111111111111111111')
				// this.getGoodsList(category_id, this.page, true);
			},


			// 获取定位
			getLocation() {
				let _this = this
				App.getLocation().then(res => {
					_this.paramsObj.lng = res.longitude || ''
					_this.paramsObj.lat = res.latitude || ''
					this.resetListData()
				}).
				catch(() => {
					App.hideLoading()
					this.resetListData()
				})
			},

			/**
			 * 获取商品列表
			 */
			getGoodsList(category_id = '', page = 1, isPage = false) {
				console.log('category_id=' + category_id, 'page =' + page, this.paramsObj)
				let _this = this
				_this.cate_id = category_id
				App._get('goods/lists', {
					page,
					no_login: 1,
					sortType: 'all',
					sortPrice: 'price',
					category_id: category_id === -1 ? '' : category_id, // 分类id
					search: '',
					...this.paramsObj
				}, result => {
					let resList = result.data.list
					if (isPage === true) {
						_this.goods_list.data.push(...resList.data)
						_this.setData({
							showLoadmore: resList.data.length == resList.per_page
						})
					} else {
						_this.setData({
							goods_list: resList,
							showLoadmore: resList.data.length == resList.per_page
						})
					}
					_this.$nextTick(() => {
						_this.isLoading = false
						uni.stopPullDownRefresh()
					})
					App.hideLoading()
				})

				// console.log(this.goods_list.data)
			}
		},
		onReachBottom() {
			// 已经是最后一页
			if (this.page >= this.goods_list.last_page) {
				// this.no_more = true;
				return false
			}
			// console.log('44444444444444444444444')
			// 加载下一页列表
			this.getGoodsList(this.cate_id, ++this.page, true)
		},
		onPullDownRefresh() {
			// this.mainIndex = -1;
			// this.main_id = -1; //一级分类id
			// this.small_id = ""; //二级分类id
			// this.goods_list.data = []
			// this.page  = 1
			// // 获取分类列表
			// this.getCategoryList();
			// 获取商品列表
			// this.getGoodsList();
			this.resetListData()
		}
	}
</script>

<style lang="scss" scoped="">
	ul,
	ol {
		list-style-type: none;
	}

	.class-list-box {
		text {
			display: inline-block;
			max-width: 140upx;
		}
	}

	.filter i {
		color: var(--theme-color);
	}

	.shangq-box {
		position: absolute;
		z-index: -1;
		background: #FFFFFF;
		left: 0;
		right: 0;
		padding: 0 30upx 30upx 30upx;
		top: -600upx;
		transition: top .2s ease-out;
		border-radius: 0 0 20upx 20upx;
	}

	.shangq-box.active {
		z-index: 9;
		top: 86upx;
		transition: top .4s ease-out;
	}

	.shangq-list {
		width: 25%;
		line-height: 28upx;
		margin: 14upx 0;
		text-align: center;

		text {
			max-width: 100%;
			border-radius: 28upx;
			display: inline-block;
			padding: 12upx;
			overflow: hidden;
			box-sizing: border-box;
		}
	}

	.shangq-list.active text {
		background-color: var(--theme-color);
		color: var(--auxiliary-color);
	}

	.goods-card-box {
		// padding: 30upx;

		padding-bottom: 30upx;
	}

	.search-query-box {
		padding: 0 50upx;
		font-size: 28upx;
		height: 86upx;
		line-height: 86upx;
		position: relative;
	}

	.search-query-box.fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		background: #FFFFFF;
	}

	.border-line.search-border-line::after {
		border-color: transparent;
	}

	.container {
		background: #FFFFFF;
	}

	/* 搜索框 */
	.index-search {
		overflow: hidden;
		border-radius: 80px;
	}

	.index-search-box {
		margin: 10upx 0 0;
	}

	.index-search {
		border-bottom: 0;
		background: rgba(255, 255, 255, 1);
		border-radius: 50upx;
		overflow: hidden;
		position: relative;
		font-size: 28upx;
		color: #999;
		box-sizing: border-box;
		height: 74upx;
		line-height: 74upx;
	}

	.index-cont-search {
		padding: 0 20upx;
	}

	.index-cont-search .icon-search {
		margin-right: 12upx;
	}

	/* 通用 */

	page {
		background: #fff;
	}

	.cate-content {
		background: #fff;
	}

	.cate-content.search-class-list-1 {
		background: transparent;
	}

	.cate-wrapper {
		padding: 0 20upx 20upx 20upx;
		box-sizing: border-box;
	}

	/* 一级分类(大图) 10 */

	.cate_style__10 .cate-item {
		margin-bottom: 18upx;
	}

	.cate_style__10 .cate-item:last-child {
		margin-bottom: 0;
	}

	.cate_style__10 .cate-item image {
		display: block;
		width: 100%;
		height: auto;
	}

	/* 一级分类(小图) 11 */

	.cate_style__11 .cate-item {
		float: left;
		padding: 25upx;
		width: 33.3333%;
		text-align: center;
		box-sizing: border-box;
	}

	.cate_style__11 .cate-item image {
		/* height: 208.656upx; */
		width: 100%;
		display: block;
	}

	.cate_style__11 .cate-item image {
		/* height: 208.656upx; */
		display: block;
		width: 100%;
		margin-bottom: 10upx;
	}

	.cate_style__11 .cate-item text {
		display: block;
		color: #555;
	}

	/* 二级分类 20 */

	.cate-content {
		width: 100%;
	}

	.cate-content .cate-left,
	.cate-content .cate-right {
		height: calc(100vh - 190upx);

		/* #ifdef H5 */
		// height: calc(100vh - 190upx - 44px);
		/* #endif */
	}

	.cate-left {
		flex-direction: column;
		display: flex;
		width: 200upx;
		color: #444;
		height: 100%;
		background: #f8f8f8;
	}

	.cate-right {
		display: flex;
		flex-direction: column;
		width: 550upx;
		height: 100%;
		overflow: hidden;
	}

	.cate-right-cont {
		width: 100%;
		display: flex;
		flex-flow: row wrap;
		align-content: flex-start;
		padding-top: 26upx;
	}

	.type-nav {
		position: relative;
		height: 90upx;
		line-height: 90upx;
		text-align: center;
		z-index: 10;
		display: block;
		font-size: 26upx;
	}

	.type-nav.selected {
		background: #fff;
		color: #ff495e;
		border-right: none;
		font-size: 28upx;
	}

	.cate-cont-box {
		margin-bottom: 30upx;
		padding-bottom: 10upx;
		background: #fff;
		overflow: hidden;
	}

	.cate-cont-box .cate-img {
		padding: 13upx 10upx 4upx 10upx;
	}

	.cate-cont-box .cate-img image {
		width: 100%;
		height: 150upx;
	}

	.cate-cont-box text {
		text-align: center;
		display: block;
		font-size: 26upx;
		padding-bottom: 14upx;
		color: #444;
		padding: 0 15upx 30upx 15upx;
	}

	.cate-two-box {
		width: 100%;
		padding: 0 10px;
	}

	/* 分类商品筛选 */
	.cate-filter {
		position: relative;
	}

	.cate-filter::after {
		content: "";
		position: absolute;
		left: 30upx;
		bottom: 0;
		right: 30upx;
		border-top: 1px solid #e5e5e5;
		transform-origin: 0 0;
		transform: scaleY(0.5);
	}

	.main-class {
		padding: 20upx 0;
		margin: 0;
		font-size: 28upx;
		line-height: 1.6em;
		// align-items: flex-start;
		white-space: nowrap;
	}

	.main-class-all {
		position: relative;
		white-space: nowrap;
		padding: 0 10upx;
	}

	.main-class-all::after {
		content: " ";
		position: absolute;
		top: 8upx;
		left: 0;
		bottom: 8upx;
		width: 8upx;
		background: var(--theme-color);
		border-radius: 20upx
	}

	.main-class-item {
		// margin-right: 30upx;
		float: left;
		display: inline-block;
		// flex: 1 0 auto;
		margin: 0 20upx;
		// display: flex;
		box-align: center;
		// align-items: center;
		// box-pack: center;
		// justify-content: center;
		box-sizing: border-box;
		color: var(--auxiliary-color);
	}

	.small-class-item {
		margin: 0 16upx;
		float: left;
		display: inline-block;
		color: var(--auxiliary-color);
	}

	.small-class-item-box {
		white-space: nowrap;
	}

	.main-class-item view {
		position: relative;
		left: -20upx;
	}

	.small-class-item view {
		left: 0;
		border: 1upx solid var(--auxiliary-color);
		border-radius: 17upx;
		padding: 0 14upx;
	}

	.main-class-item.active view,
	.main-class-item.allactive view {
		// color: var(--theme-color);
		// border-color: var(--theme-color);
		font-size: 40upx;
		font-weight: bold;
		// border-radius: 80upx;
		// transform: scale(1.2);
	}

	.small-class-item.active view {
		background-color: var(--auxiliary-color);
		color: var(--theme-color);
		font-size: 24upx;
		font-weight: normal;
	}

	// .main-class-item.allactive {
	// 	font-weight: bold;
	// 	font-size: 26upx;
	// }
	.main-class-all .main-class-item {
		margin: 0;
	}

	.small-class-list {
		// margin: 0 30upx;
		display: flex;
		margin: 12upx 0 16upx 0;
	}

	.us-look {
		width: 140upx;
		color: var(--auxiliary-color);
	}

	.us-look-list {
		flex: 1;
		width: 0;
	}

	/*.small-class-item {
		display: inline-block;
		line-height: 1.7em;
		// background: #f8f8f8;
		padding: 0 16upx;
		// color: #999999;
		border-radius: .85em;
		border:1upx solid #f00;
		margin-right: 30upx;
		font-size: 24upx;
		// margin: 0 20upx 20upx 0;
	}*/

	.small-class-item.active {
		color: var(--theme-color);
	}

	.loading {
		height: 100vh;
		position: relative;
	}

	.loading .ball-clip-rotate-pulse,
	.loading .diy-loading {
		top: 25%;
	}
</style>
