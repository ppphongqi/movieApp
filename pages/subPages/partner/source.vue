<template>
	<view class="page-partner-index app-clearfix">
		<!-- header -->
		<view class="page-header">
			<view class="page-header__center">
				<u-search v-model="search" :show-action="false" height="70"
					@search="debounceFetchGoodsListRes({resetBeforeFetch:true})"></u-search>
			</view>
			<view class="page-header__right">
				<image class="page__img-avatar" :src="cDetails.avatarUrl" mode="aspectFill"></image>
			</view>
		</view>
		<!-- header end -->
		<!-- 筛选项-吸顶 -->
		<u-sticky h5-nav-height="0">
			<view>
				<!-- 素材 -->
				<view v-show="options.collection != 1">
					<GoodsCateList :list="cCateList" @on-change="handleCateChange"></GoodsCateList>
					<SortBar @on-item-click="handleSortBarClick"></SortBar>
				</view>
				<!-- 素材 end -->
				<!-- 我的收藏 -->
				<GoodsCateList v-show="options.collection == 1" :navLeftVisible="false" menuIcon="arrow-down"
					dropdownItemTitle="全部类目" :list="cCateList" @on-change="handleCateChange">
					<template #right>
						<view class="btn-wrapper-top">
							<button v-if="[1,3].includes(type)" class="btn-normal page__btn-op"
								@click="handleBtnOpPosterClick">制作集合海报</button>
							<button v-if="[1,2].includes(type)" class="btn-normal page__btn-op"
								@click="handleBtnOpClick">管理</button>
							<button v-if="[2].includes(type)" class="btn-normal page__btn-op"
								@click="handleBtnOpCancelClick">取消</button>
							<button v-if="[3].includes(type)" class="btn-normal page__btn-op"
								@click="handleBtnOpConfirmClick">完成</button>
						</view>
					</template>
				</GoodsCateList>
				<!-- 我的收藏 end -->
			</view>
		</u-sticky>
		<!-- 筛选项-吸顶 end -->
		<!-- 海报商品选择器 -->
		<template v-if="type == 2">
			<GoodsSelector v-model="posterValue" :list="cGoodsList" :max="8"></GoodsSelector>
			<!-- 底部操作项 -->
			<view class="footer-op app-wrapper--safe-fixed-bottom">
				<view class="footer-op__left">
					<view class="footer-op__text">海报素材({{posterValue.length}}/{{cGoodsList.length}})</view>
				</view>
				<view class="footer-op__right">
					<button class="btn-normal footer-op__btn" @click="handleBtnSelectPosterClick">选择海报模板</button>
				</view>
			</view>
			<!-- 底部操作项 end -->
		</template>
		<!-- 海报商品选择器 end -->
		<!-- 删除商品选择器 -->
		<template v-else-if="type == 3">
			<GoodsSelector v-model="delValue" :list="cGoodsList" :max="8"></GoodsSelector>
			<!-- 底部操作项 -->
			<view class="footer-op app-wrapper--safe-fixed-bottom">
				<view class="footer-op__left">
					<view class="pay-card__radio" :class="{'is-active':cAll}" @click="handleBtnAllClick">
						<view class="iconfont icon-check"></view>
					</view>
					<view class="footer-op__text">全选({{delValue.length}}/{{cGoodsList.length}})</view>
				</view>
				<view class="footer-op__right">
					<button class="btn-normal footer-op__btn" style="background-color: #FF4444;color: #fff;"
						@click="handleBtnDelClick">删除</button>
				</view>
			</view>
			<!-- 底部操作项 end -->
		</template>
		<!-- 删除商品选择器 end -->
		<!-- 商品列表 -->
		<GoodsSourceList v-else :list="cGoodsList" @on-btn-collection-click="handleBtnCollectionClick"
			@on-btn-text-click="handleBtnTextClick" @on-btn-poster-click="handlePosterClick"
			@on-item-click="handleGoodsItemClick"></GoodsSourceList>
		<!-- 商品列表 end -->

		<!-- 加载更多提示 -->
		<LoadMore :showLoadmore="!goodsListRes.hasMore"></LoadMore>
		<!-- 加载更多提示 end -->
		<!-- fixed导航 -->
		<NavFixed v-if="[0,1].includes(type)"
			:mineUrl="`pages/subPages/dealer/team/team?lv=${cDetails.lv}&listStyle=${cDetails.team_diy}`">
		</NavFixed>
		<!-- fixed导航 end -->

		<!-- 文案复制弹窗 -->
		<CopyTextPopup v-model="copyTextPopupVisible" :text="copyTextGoods.title" :link="copyTextGoods.link">
		</CopyTextPopup>
		<!-- 文案复制弹窗 end -->
		<!-- 海报 -->
		<ShareView ref="shareView" force :pid="posterGoods.goods_id" :poster-type="'goods'">
		</ShareView>
		<!-- 海报 end -->
		<!-- 海报集合 -->
		<!-- 海报集合 end -->
		<ShareView ref="posterShare" force :apiParams="cPosterApiParams" poster-type="goodsCollection">
		</ShareView>
		<!-- 海报模板选择页面 -->
		<PosterTypePopup v-model="posterTypePopupVisible" :list="cPosterTypeList" @on-change="handlePosterTypeChange"
			@on-btn-confirm-click="handlePosterConfirm"></PosterTypePopup>
		<!-- 海报模板选择页面 end -->
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
	import PosterTypePopup from './components/PosterTypePopup.vue'
	import GoodsSelector from './components/GoodsSelector.vue'
	export default {
		components: {
			GoodsCateList,
			SortBar,
			NavFixed,
			GoodsSourceList,
			LoadMore,
			CopyTextPopup,
			ShareView,
			PosterTypePopup,
			GoodsSelector
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
				// 海报模板列表的接口数据
				posterTypeRes: [],
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
				posterGoods: {},
				// 当前海报项选中的项
				posterValue: [],
				// 当前选中的删除项
				delValue: [],
				// 当前的页面类型：0:素材 1:我的收藏，2:制作海报，3:管理
				type: 0,
				dropdownOpen: false,
				// 选择海报模板弹窗是否显示
				posterTypePopupVisible: false,
				// 当前选中的海报类型
				posterType: ''
			}
		},
		computed: {
			// 海报参数
			cPosterApiParams() {
				return {
					goods_ids: this.posterValue.join(','),
					goods_template: this.posterType
				}
			},
			// 当前是否全选
			cAll() {
				return this.delValue.length === this.cGoodsList.length
			},
			// 格式化的海报列表数据
			cPosterTypeList() {
				return (this.posterTypeRes || []).map(item => ({
					id: item.id,
					imgSrc: item.imgUrl
				}))
			},
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
				return ([{
					category_id: 'all',
					name: '全部类目',
					category_id: ''
				}, ...this.cateRes]).map(item => {
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
					if (item.spec_type == 20) {
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
			if (this.options.collection == '1') {
				this.type = 1
			}
			try {
				await this.mainMixin_BeforeFetchPageData()
				await Promise.all([
					this.fetchDetailsRes(),
					this.fetchCateRes(),
					this.fetchPosterTypeRes()
				])
				this.debounceFetchGoodsListRes && this.debounceFetchGoodsListRes({
					resetBeforeFetch: true
				})
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
			// 删除收藏按钮点击事件
			async handleBtnDelClick() {
				if (this.handleBtnDelClicking) {
					return
				}
				this.handleBtnDelClicking = true
				if (!this.delValue.length) {
					uni.showToast({
						icon: 'none',
						title: '请先选择商品'
					})
					this.handleBtnDelClicking = false
					return
				}
				try {
					// 确认操作
					const modalRes = await uni.showModal({
						title: '请确认',
						content: '确认删除' + this.delValue.length + '个商品'
					})
					if (modalRes[1].cancel) {
						this.handleBtnDelClicking = false
						return
					}
					uni.showLoading({
						icon: 'none',
						title: '请稍候'
					})
					// 请求接口
					await App._postP('user.dealer.Goods/delete', {
						goods_ids: this.delValue.join(',')
					})
					// 提示删除成功
					uni.showToast({
						icon: 'none',
						title: '删除成功'
					})
					// 刷新列表
					this.debounceFetchGoodsListRes && this.debounceFetchGoodsListRes({
						resetBeforeFetch: true
					})
					uni.hideLoading()
				} catch (e) {
					uni.hideLoading()
					console.log(e)
				}
			},
			// 全选按钮点击事件
			handleBtnAllClick() {
				if (this.delValue.length) {
					this.delValue = []
				} else {
					this.delValue = this.cGoodsList.map(item => item.id)
				}
			},
			// 生成海报确认按钮点击事件
			handlePosterConfirm() {
				if (!this.posterType) {
					uni.showToast({
						icon: 'none',
						title: '请先选择模板'
					})
					return
				}
				// 关闭弹窗
				this.posterTypePopupVisible = false
				// 显示海报
				this.$refs.posterShare.shareswich()
			},
			// 选择海报change事件
			handlePosterTypeChange(id) {
				this.posterType = id
			},
			// 选择海报模板按钮点击事件
			handleBtnSelectPosterClick() {
				if (!this.posterValue.length) {
					uni.showToast({
						icon: 'none',
						title: '请先选择商品'
					})
					return
				}
				this.posterTypePopupVisible = true
			},
			// 顶部制作海报按钮点击事件
			handleBtnOpPosterClick() {
				this.type = 2
			},
			// 顶部管理按钮点击事件
			handleBtnOpClick() {
				this.type = 3
			},
			// 顶部取消按钮点击事件
			handleBtnOpCancelClick() {
				this.type = 1
			},
			// 顶部完成按钮点击事件
			handleBtnOpConfirmClick() {
				this.type = 1
			},
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
			// 请求海报模板列表的接口数据
			async fetchPosterTypeRes() {
				try {
					const res = await App._getP('user.dealer.Goods/posterTemplateList')
					this.posterTypeRes = this.$util.deepGet(res, 'data', [])
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
		padding: 20rpx 30rpx;
		background-color: #fff;
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

	.btn-wrapper-top {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: 30rpx;
	}

	.page__btn-op {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 20rpx;
		height: 50rpx;
		font-size: 28rpx;
		color: #FE504F;
		border: 1px solid #FE504F;
		border-radius: 9999rpx;

		&+& {
			margin-left: 20rpx;
		}
	}

	// 底部操作项
	.footer-op {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 30rpx;
		background-color: #fff;
	}

	.footer-op__left {
		display: flex;
		align-items: center;
	}

	.pay-card__radio {
		box-sizing: border-box;
		display: flex;
		width: 50rpx;
		height: 50rpx;
		margin-right: 20rpx;
		align-items: center;
		justify-content: center;
		border-radius: 100%;
		border: 1px solid #ccc;

		.iconfont {
			display: none;
			font-size: 24rpx;
		}

		&.is-active {
			background: #FF4444;
			color: #fff;
			border-color: #FF4444;

			.iconfont {
				display: block;
			}
		}
	}

	.footer-op__text {
		font-size: 28rpx;
		color: #333;
	}

	.footer-op__btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 20rpx;
		height: 80rpx;
		font-size: 28rpx;
		color: #333333;
		background-color: #FFD940;
		border-radius: 9999rpx;
		min-width: 6em;
	}

	// 底部操作项 end
</style>
