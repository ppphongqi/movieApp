<template>
	<view class="page-partner-index app-clearfix">
		<!-- header -->
		<view class="page-header">
			<view class="page-header__center">
				<u-search :show-action="false" height="70" disabled
					@click="navigationTo('pages/subPages/category/index')"></u-search>
			</view>
			<view class="page-header__right">
				<image class="page__img-avatar" :src="cDetails.avatarUrl"
					mode="aspectFill"></image>
			</view>
		</view>
		<!-- header end -->
		<!-- 数据看板 -->
		<DashboardCard :totalProfit="cDetails.totalProfit" :todayProfit="cDetails.todayProfit" :refreshTipVisible="settingData && settingData.dealer_basic && settingData.dealer_basic.is_refresh == 1"
			:monthProfit="cDetails.monthProfit" :balance="cDetails.balance"
			@on-btn-withdrawal-click="navigationTo('pages/subPages/withdraw/list/list')"
			@on-btn-refresh-click="handleBtnRefreshClick"></DashboardCard>
		<!-- 数据看板 end -->
		<!-- 导航 -->
		<NavList :list="cNavList" @on-item-click="handleNavItemClick"></NavList>
		<!-- 导航 end -->
		<!-- 广告位 -->
		<image v-if="cAd.imgSrc" class="page__img-ad" :src="cAd.imgSrc" mode="widthFix" @click="navigationTo(cAd.link)">
		</image>
		<!-- 广告位 end -->
		<!-- 筛选项-吸顶 -->
		<u-sticky h5-nav-height="0">
			<view>
				<GoodsCateList :list="cCateList" @on-change="handleCateChange"></GoodsCateList>
				<SortBar v-if="cSortBarVisible" @on-item-click="handleSortBarClick"></SortBar>
			</view>
		</u-sticky>
		<!-- 筛选项-吸顶 end -->
		<!-- 商品列表 -->
		<GoodsList :list="cGoodsList" @on-item-click="handleGoodsItemClick"></GoodsList>
		<!-- 商品列表 end -->
		<!-- 加载更多提示 -->
		<LoadMore :showLoadmore="!goodsListRes.hasMore"></LoadMore>
		<!-- 加载更多提示 end -->
		<!-- fixed导航 -->
		<NavFixed :mineUrl="`pages/subPages/dealer/team/team?lv=${cDetails.lv}&listStyle=${cDetails.team_diy}`"></NavFixed>
		<!-- fixed导航 end -->
		<!-- 分享海报 -->
		<share-view ref="shareView" :poster-type="'dealer'"></share-view>
		<!-- 分享海报 end -->
		<!-- 快捷导航 -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import DashboardCard from './components/DashboardCard.vue'
	import NavList from './components/NavList.vue'
	import NavFixed from './components/NavFixed.vue'
	import GoodsCateList from './components/GoodsCateList.vue'
	import SortBar from './components/SortBar.vue'
	import GoodsList from './components/GoodsList.vue'
	import ShareView from '@/components/template/ShareView.vue'
	import LoadMore from '@/components/template/Loadmore.vue'
	export default {
		components: {
			DashboardCard,
			NavList,
			NavFixed,
			GoodsCateList,
			GoodsList,
			ShareView,
			SortBar,
			LoadMore
		},
		data() {
			return {
				// 分销商详情的接口数据
				detailsRes: {},
				// 商品分类的接口数据
				cateRes: [],
				// 商品的接口数据（分页）
				goodsListRes: {
					// 当前第几页，0就是即将请求第1页
					page: 0,
					// 分页的大小
					list_rows: 20,
					// 数据
					data: [],
					// 是否还有更多
					hasMore: true,
					// 是否正在请求
					isFetching: false,
					// 请求过的次数（无论成功失败）
					fetchedNum: 0
				},
				// 当前选择的分类id
				cateId: '',
				// 当前选择排序方式，
				sort: {}
			}
		},
		computed: {
			// 当前排序条显不显示
			cSortBarVisible() {
				return !['all','total_sales','rebate_commission','create_time'].includes(this.cateId)
			},
			// 格式化的详情数据
			cDetails() {
				return {
					// 累计收益（元）
					totalProfit: this.detailsRes.total_money || '',
					// 今日收益（元）
					todayProfit: this.detailsRes.Day_money || '',
					// 本月收益（元）
					monthProfit: this.detailsRes.month_money || '',
					// 可提现金额（元）
					balance: this.detailsRes.money || '',
					// 团队页面的lv
					lv: this.detailsRes.is_move_protect && this.detailsRes.team_diy === '2' ? 1 : 0,
					// 团队页面的team_diy
					team_diy: this.detailsRes.team_diy,
					// 头像
					avatarUrl: this.detailsRes.avatarUrl,
				}
			},
			// 格式化的导航金刚区数据
			cNavList() {
				return [{
					id: '01',
					imgSrc: require('./static/images/icon-partner-team.png'),
					text: '我的团队',
					url: `pages/subPages/dealer/team/team?lv=${this.cDetails.lv}&listStyle=${this.cDetails.team_diy}`
				}, {
					id: '02',
					imgSrc: require('./static/images/icon-partner-level.png'),
					text: '我的等级',
					url: 'pages/subPages/dealer/index/level'
				}, {
					id: '03',
					imgSrc: require('./static/images/icon-partner-poster.png'),
					text: '专属海报',
					url: '',
					type: 'poster'
				}, {
					id: '04',
					imgSrc: require('./static/images/icon-partner-file.png'),
					text: '素材管理',
					url: 'pages/subPages/partner/source'
				}, {
					id: '05',
					imgSrc: require('./static/images/icon-partner-collection.png'),
					text: '我的收藏',
					url: 'pages/subPages/partner/source?collection=1'
				}]
			},
			// 格式化的广告数据
			cAd() {
				return {
					// 图片地址
					imgSrc: this.$util.deepGet(this.settingData, 'dealer_basic.advertisement_image'),
					// 链接（链接选择器的数据格式）
					link: this.$util.deepGet(this.settingData, 'dealer_basic.advertisement_link')
				}
			},
			// 格式化的分类数据
			cCateList() {
				// 用于排序的分类
				const sortCate = [{
						id: 'total_sales',
						title: ' 销量',
						value: '',
						type: 'sort'
					}, {
						id: 'rebate_commission',
						title: ' 佣金',
						value: '',
						type: 'sort'
					}, {
						id: 'create_time',
						title: ' 最新',
						value: '',
						type: 'sort'
					}]
				const cate = (this.cateRes || []).map(item => {
					return {
						id: item.category_id,
						title: item.name,
						value: item.category_id,
					}
				})
				if(cate.length) {
					return [...sortCate,...cate]
				}
				return []
			},
			// 格式化的商品列表
			cGoodsList() {
				return (this.goodsListRes.data || []).map(item => ({
					id: item.goods_id,
					imgSrc: this.$util.deepGet(item,'file.file_path'),
					title: item.goods_name,
					price: item.goods_price,
					rebate: item.rebate_commission
				}))
			}
		},
		created() {
			// 数据卡片点击事件
			this.handleBtnRefreshClick = this.$util.throttle(val => {
				this.fetchDetailsRes().catch(() => {})
			}, 500, {
				leading: true,
				trailing: false
			})
			// 节流的请求商品明细的接口数据
			this.debounceFetchGoodsListRes = this.$util.throttle((...args) => {
				this.fetchGoodsListRes(...args)
			}, 500, {
				leading: false,
				trailing: true
			})
		},
		async onShow() {
			if(this.$util.deepGet(this.settingData,'dealer_basic.dealer_center_page','') == 1) {
				App.navigationTo({
					url: 'pages/subPages/dealer/index/index',
					redirectTo: true,
				})
				return
			}
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff",
			});
			try {
				await this.mainMixin_BeforeFetchPageData()
				await Promise.all([
					this.fetchDetailsRes(),
					this.fetchCateRes()
				])
			} catch (e) {
				if(e.data && e.data.code == 10) {
					console.log('跳转到申请分销商页面')
					App.navigationTo({
						url: 'pages/subPages/dealer/apply/apply',
						redirectTo: true,
					})
				}
				console.log('onShow 报错', e)
			}
			App.hideLoading()
		},
		// 上拉加载更多
		onReachBottom() {
			if(!this.goodsListRes.isFetching && this.goodsListRes.hasMore) {
				this.fetchGoodsListRes()
			}
		},
		methods: {
			// 商品列表项点击事件
			handleGoodsItemClick(item) {
				console.log('handleGoodsItemClick')
				App.navigationTo({
					url: 'pages/subPages/goods/index/index',
					query: {
						goods_id: item.id
					}
				})
			},
			// 排序点击事件
			handleSortBarClick({
				value
			}) {
				
				this.sort = value
				this.debounceFetchGoodsListRes && this.debounceFetchGoodsListRes({
					resetBeforeFetch: true
				})
			},
			// 分类改变事件
			handleCateChange(id) {
				this.cateId = id
				this.debounceFetchGoodsListRes && this.debounceFetchGoodsListRes({
					resetBeforeFetch: true
				})
			},
			// 金刚区导航点击事件
			handleNavItemClick(item) {
				console.log('handleNavItemClick')
				// #ifndef MP-TOUTIAO || MP-ALIPAY
				if (item.type === 'poster') {
					this.$refs.shareView.shareswich()
				}
				// #endif
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._getP('user.dealer.User/getDistributor')
					this.detailsRes = this.$util.deepGet(res, 'data', {})
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求分类的接口数据
			async fetchCateRes() {
				try {
					const res = await App._getP('Category/getCateList')
					this.cateRes = this.$util.deepGet(res, 'data', [])
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求商品列表的接口数据（分页）
			async fetchGoodsListRes({
				resetBeforeFetch = false
			} = {}) {
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						// 重置数据
						console.log('fetchGoodsListRes 重置数据')
						// 还应该取消请求的但是现在没有取消请求的方法
						this.goodsListRes = {
							...this.goodsListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false
						}
					}
					// 如果没有更多就不必请求了
					if (!this.goodsListRes.hasMore) {
						return Promise.reject('没有更多了')
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.goodsListRes.isFetching = true
					// 请求数据
					let sort = this.sort
					if(['all','total_sales','rebate_commission','create_time'].includes(this.cateId)) {
						sort = {
							[this.cateId]: 'desc'
						}
					}
					const res = await App._getP('user.dealer.Goods/getList', {
						page: this.goodsListRes.page + 1,
						list_rows: this.goodsListRes.list_rows,
						category_id: ['all','total_sales','rebate_commission','create_time'].includes(this.cateId) ? '' :this.cateId,
						collection: 0,
						...sort,
					})
					// 取得新的数据
					const newData = this.$util.deepGet(res, 'data.data', [])
					// 判断是否有更多
					const hasMore = newData.length >= this.goodsListRes.list_rows
					// 设置新的数据
					this.goodsListRes = {
						...this.goodsListRes,
						page: this.goodsListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ? newData : this.goodsListRes.data.concat(newData),
						hasMore,
						isFetching: false,
						fetchedNum: this.goodsListRes.fetchedNum + 1
					}
				} catch (e) {
					console.log(e)
					this.goodsListRes.fetchedNum = this.goodsListRes.fetchedNum + 1
					return Promise.reject(e)
					// TODO handle the exception
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-partner-index {
		box-sizing: border-box;
		min-height: 100vh;
		background-color: #fff;
		padding-bottom: 200rpx;
	}

	.page-header {
		box-sizing: border-box;
		display: flex;
		padding: 0 30rpx;
		margin: 20rpx 0;
	}

	.page-header__center {
		flex: 1;
	}

	.page-header__right {
		margin-left: 20rpx;
	}

	.page__img-avatar {
		width: 68rpx;
		height: 68rpx;
		border-radius: 100%;
	}

	.page__img-ad {
		display: block;
		width: 690rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}
</style>
