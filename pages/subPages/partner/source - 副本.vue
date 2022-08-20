<template>
	<view class="page-partner-index app-clearfix">
		<!-- header -->
		<view class="page-header">
			<view class="page-header__center">
				<u-search v-model="search" :show-action="false" height="70"
					@search="debounceFetchGoodsListRes({resetBeforeFetch:true})"></u-search>
			</view>
			<view class="page-header__right">
				<image class="page__img-avatar" :src="cDetails.avatarUrl"
					mode="aspectFill"></image>
			</view>
		</view>
		<!-- header end -->
		<!-- 筛选项-吸顶 -->
		<u-sticky h5-nav-height="0">
			<view>
				<GoodsCateList :list="cCateList" @on-change="handleCateChange"></GoodsCateList>
				<SortBar></SortBar>
			</view>
		</u-sticky>
		<!-- 筛选项-吸顶 end -->
		<!-- 商品列表 -->
		<GoodsSourceList :list="cGoodsList" @on-btn-collection-click="handleBtnCollectionClick"
			@on-btn-text-click="handleBtnTextClick" @on-btn-poster-click="handlePosterClick"
			@on-item-click="handleGoodsItemClick"></GoodsSourceList>
		<!-- 商品列表 end -->
		<!-- 加载更多提示 -->
		<LoadMore :showLoadmore="!goodsListRes.hasMore"></LoadMore>
		<!-- 加载更多提示 end -->
		<!-- fixed导航 -->
		<NavFixed :mineUrl="`pages/subPages/dealer/team/team?lv=${cDetails.lv}&listStyle=${cDetails.team_diy}`">
		</NavFixed>
		<!-- fixed导航 end -->

		<!-- 文案复制弹窗 -->
		<CopyTextPopup v-model="copyTextPopupVisible" :text="copyTextGoods.title" :link="copyTextGoods.link"></CopyTextPopup>
		<!-- 文案复制弹窗 end -->
		<!-- 海报 -->
		<ShareView ref="shareView" force :pid="posterGoods.goods_id" :poster-type="'goods'">
		</ShareView>
		<!-- 海报 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import NavFixed from './components/NavFixed.vue'
	import GoodsCateList from './components/GoodsCateList.vue'
	import SortBar from './components/SortBar.vue'
	import GoodsSourceList from './components/GoodsSourceList.vue'
	import LoadMore from '@/components/template/Loadmore.vue'
	import CopyTextPopup from './components/CopyTextPopup.vue'
	import ShareView from '@/components/template/ShareView.vue'
	export default {
		components: {
			GoodsCateList,
			SortBar,
			NavFixed,
			GoodsSourceList,
			LoadMore,
			CopyTextPopup,
			ShareView
		},
		data() {
			return {
				// 页面参数
				options: {
					collection: ''
				},
				// 顶部输入框的值
				search: '',
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
				sort: {},
				// 文案复制弹窗是否显示
				copyTextPopupVisible: false,
				// 当前文案复制对应的商品
				copyTextGoods: {},
				// 当前海报对应的商品
				posterGoods: {}
			}
		},
		computed: {
			// 格式化的详情数据
			cDetails() {
				return {
					// 团队页面的lv
					lv: this.detailsRes.is_move_protect && this.detailsRes.team_diy === '2' ? 1 : 0,
					// 团队页面的team_diy
					team_diy: this.detailsRes.team_diy,
					// 头像
					avatarUrl: this.detailsRes.avatarUrl,
				}
			},
			// 格式化的分类数据
			cCateList() {
				return (this.cateRes || []).map(item => {
					return {
						id: item.category_id,
						title: item.name,
						value: item.category_id,
					}
				})
			},
			// 格式化的商品列表
			cGoodsList() {
				return (this.goodsListRes.data || []).map(item => {
					let sku = []
					if(item.spec_type==20) {
						// 数据传输长度为 7577 KB，存在有性能问题！??????  是因为u-table的原因，所以不要用u-table
						sku = (item.sku || []).map(skuItem => ({
							id: 'id' + skuItem.sku_title,
							name: skuItem.sku_title,
							price: skuItem.goods_price,
							rebate: skuItem.dealer_money
						}))
					}
					return {
						id: item.goods_id,
						imgSrc: this.$util.deepGet(item, 'file.file_path', ''),
						title: item.goods_name,
						price: item.goods_price,
						rebate: item.rebate_commission,
						collected: item.collection,
						link: item.link,
						sku
					}
				})
			}
		},
		created() {
			// 节流的请求商品明细的接口数据
			this.debounceFetchGoodsListRes = this.$util.throttle((...args) => {
				this.fetchGoodsListRes(...args)
			}, 500, {
				leading: false,
				trailing: true
			})
		},
		onLoad(options) {
			this.options = options
		},
		async onShow() {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff",
			});
			uni.setNavigationBarTitle({
				title: this.options.collection == '1' ? '我的收藏' : '获取素材'
			})
			try {
				await this.mainMixin_BeforeFetchPageData()
				await Promise.all([
					this.fetchDetailsRes(),
					this.fetchCateRes()
				])
			} catch (e) {
				console.log('onShow 报错', e)
			}
			App.hideLoading()
		},
		// 上拉加载更多
		onReachBottom() {
			if (!this.goodsListRes.isFetching && this.goodsListRes.hasMore) {
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
			// 海报按钮点击事件
			handlePosterClick(item, index) {
				console.log('handlePosterClick')
				this.posterGoods = this.goodsListRes.data[index] || {}
				this.$refs.shareView.shareswich()
			},
			// 复制文案按钮点击事件
			handleBtnTextClick(item) {
				this.copyTextGoods = item
				this.copyTextPopupVisible = true
			},
			// 收藏按钮点击事件
			async handleBtnCollectionClick(item, index) {
				if (this.handleBtnCollectionClicking) return
				this.handleBtnCollectionClicking = true
				uni.showLoading({
					mask: true,
					title: '请稍候'
				})
				try {
					// 当前是否已经收藏
					const collected = item.collected
					// 收藏或者取消收藏
					await App._getP('collection/userCollection', {
						goods_id: item.id
					})
					// 修改相关原始数据
					this.goodsListRes.data[index].collection = !collected
					uni.hideLoading()
				} catch (e) {
					uni.hideLoading()
				}
				this.handleBtnCollectionClicking = false

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
			// 请求商品明细的接口数据（分页）
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
					const res = await App._getP('user.dealer.Goods/getList', {
						page: this.goodsListRes.page + 1,
						list_rows: this.goodsListRes.list_rows,
						goods_name: this.search,
						category_id: this.cateId,
						collection: this.options.collection,
						...this.sort,
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
		min-height: 100vh;
		background-color: #F8F8F8;
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
