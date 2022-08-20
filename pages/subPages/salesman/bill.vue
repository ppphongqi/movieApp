<template>
	<view class="page-salesman-bill app-clearfix">
		<!-- 顶部sticky -->
		<u-sticky h5-nav-height="0" bg-color="#FFFFFF">
			<view class="app-clearfix" style="background-color: #fff;">
				<!-- 搜索框 -->
				<view class="search-bar">
					<view class="search-bar__icon-search iconfont icon-search"></view>
					<input v-model="search" type="text" placeholder="请输入关键字进行搜索" @confirm="handleSearchConfirm">
				</view>
				<!-- 搜索框 end -->
				<!-- 顶部分类 -->
				<page-nav-bar class="page-nav" :nav-list="cTopCateData" :current="cTopCateActiveItem.id"
					@on-nav-item-click="handleTopCateItemClick" />
				<!-- 顶部分类 end -->
			</view>
		</u-sticky>
		<!-- 顶部sticky end -->
		<!-- 流水明细 -->
		<block v-if="topCateAvtive == 0">
			<!-- 筛选项 -->
			<view class="bill-filter-bar">
				<!-- 时间 -->
				<picker mode="date" :value="date" start="2009-01-01" :end="endDate" @change="handleTimeChange">
					<view class="bill-filter__time">{{date || '选择日期'}}
						<view class="bill-filter__time__icon-indicator iconfont is-inline icon-xialajiantouxiao"></view>
					</view>
				</picker>

				<!-- 时间 end -->
				<!-- 分类 -->
				<view class="bill-filter__types">
					<view v-for="(item,index) in cFilterTypes" :key="item.id" class="bill-filter__type"
						:class="{'bill-filter__type--active':index===filterTypesActive}"
						@click="handleFilterTypeClick(item,index)">{{item.title}}</view>
				</view>
				<!-- 分类 end -->
			</view>
			<!-- 筛选项 end -->
			<!-- 流水明细列表 -->
			<FlowList :list="cFlowList"></FlowList>
			<!-- 流水明细列表 end -->
			<!-- 加载更多提示 -->
			<LoadMore :showLoadmore="!flowListRes.hasMore"></LoadMore>
			<!-- 加载更多提示 end -->
		</block>
		<!-- 流水明细 end -->
		<!-- 账单明细 -->
		<block v-else-if="topCateAvtive == 1">
			<!-- 账单明细列表 -->
			<BillList :list="cBillList"></BillList>
			<!-- 账单明细列表 end -->
			<!-- 加载更多提示 -->
			<LoadMore :showLoadmore="!billListRes.hasMore"></LoadMore>
			<!-- 加载更多提示 end -->
		</block>
		<!-- 账单明细 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import App from '@/common/js/app.js'
	import PageNavBar from '@/components/template/PageNavBar2.vue'
	import FlowList from './components/FlowList.vue'
	import BillList from './components/BillList.vue'
	import LoadMore from '@/components/template/Loadmore.vue'
	export default {
		components: {
			PageNavBar,
			FlowList,
			BillList,
			LoadMore
		},
		data() {
			return {
				// 顶部分类选中项索引
				topCateAvtive: 0,
				// 流水明细当前选中的类型
				filterTypesActive: 0,
				// 当前选中的日期，字符串格式为"YYYY-MM-DD" 但是接口需要时间戳
				date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
				// 能查询日期的最大值
				endDate: dayjs().format('YYYY-MM-DD'),
				// 当前顶部输入框的值
				search: '',
				// 流水明细的接口数据（分页）
				flowListRes: {
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
				// 账单明细的接口数据（分页）
				billListRes: {
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
				}
			}
		},
		computed: {
			// 顶部分类数据
			cTopCateData() {
				return [{
						id: '0',
						title: '流水明细',
						value: '流水明细'
					},
					{
						id: '1',
						title: '账单明细',
						value: '账单明细'
					}
				]
			},
			// 当前选中的顶部分类的项
			cTopCateActiveItem() {
				return this.cTopCateData[this.topCateAvtive] || {}
			},
			// 类型数据
			cFilterTypes() {
				return [{
					id: '0',
					title: '总利润',
					value: 0
				}, {
					id: '1',
					title: '收入',
					value: 1
				}, {
					id: '2',
					title: '支出',
					value: 2
				}]
			},
			// 当前选中的类型
			cFilterTypeActiveItem() {
				return this.cFilterTypes[this.filterTypesActive] || {}
			},
			// 格式化的流水明细的列表数据
			cFlowList() {
				return (this.flowListRes.data || []).map(item=>({
					id: item.id,
					// 类型 0:收入，1:支出
					type: item.type,
					// 商家名称
					title: item.content,
					// 时间
					time: item.create_time,
					// 金额
					amount: item.update_money || 0,
					// 余额
					balance: item.after_money || 0
				}))
			},
			// 格式化的流水明细的列表数据
			cBillList() {
				return (this.billListRes.data || []).map(item=>({
					id: item.id,
					// 订单编号
					orderNo: item.order_no,
					// 状态
					status: 0,
					// 状态文字
					statusText: '已入账',
					// 标题
					title: item.goods_name,
					// 图片
					imgSrc: item.image,
					// 入账时间
					time: item.create_time,
					// 金额
					amount: item.settlement_money
				}))
			}
		},
		async onShow() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				await this.fetchListByTabId(this.cTopCateActiveItem.id, {
					needed: true
				})
				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
			}
		},
		// 下拉刷新
		async onPullDownRefresh() {
			try {
				await this.fetchListByTabId(this.cTopCateActiveItem.id, {
					resetBeforeFetch: true
				})
			} catch (e) {
				console.log('onPullDownRefresh 报错', e)
				// TODO handle the exception
			}
			uni.stopPullDownRefresh()
		},
		// 上拉加载更多
		onReachBottom() {
			if ((this.cTopCateActiveItem.id == 0 && (this.flowListRes.isFetching || !this.flowListRes.hasMore)) || (this.cTopCateActiveItem.id == 1 &&
					(this.billListRes.isFetching || !this.billListRes.hasMore))) {}
			this.fetchListByTabId(this.cTopCateActiveItem.id).catch(e=>{
				console.log('onReachBottom',e)
			})
		},
		methods: {
			// 搜索框确认事件
			handleSearchConfirm() {
				this.fetchListByTabId(this.cTopCateActiveItem.id, {
					resetBeforeFetch: true
				})
			},
			// 时间改变
			handleTimeChange(e) {
				this.date = e.detail.value || ''
				this.fetchListByTabId('0', {
					resetBeforeFetch: true
				})
			},
			// 顶部分类点击事件
			handleTopCateItemClick({
				index
			}) {

				this.topCateAvtive = index
				console.log('handleTopCateItemClick', this.cTopCateActiveItem.id)
				this.fetchListByTabId(this.cTopCateActiveItem.id, {
					needed: true
				})
			},
			// 流水明细当前选中的类型点击事件
			handleFilterTypeClick(item, index) {
				this.filterTypesActive = index
				this.fetchListByTabId('0', {
					resetBeforeFetch: true
				})
			},
			// 根据tabId请求数据
			fetchListByTabId(tabId, {
				needed = false,
				resetBeforeFetch = false
			} = {}) {
				if (tabId == 0) {
					if (needed && this.flowListRes.fetchedNum && !resetBeforeFetch) {
						return
					}
					return this.fetchFlowListRes({
						resetBeforeFetch
					})
				}
				if (tabId == 1) {
					if (needed && this.billListRes.fetchedNum && !resetBeforeFetch) {
						return
					}
					return this.fetchBillListRes({
						resetBeforeFetch
					})
				}
			},
			// 请求流水明细的接口数据（分页）
			async fetchFlowListRes({
				resetBeforeFetch = false
			} = {}) {
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.flowListRes = {
							...this.flowListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false
						}
					}
					// 如果没有更多就不必请求了
					if (!this.flowListRes.hasMore) {
						return Promise.reject('没有更多了')
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.flowListRes.isFetching = true
					// 请求数据
					const res = await App._getP('salesman.Salesman/waterLists', {
						page: this.flowListRes.page + 1,
						list_rows: this.flowListRes.list_rows,
						time: +dayjs(this.date),
						key: this.search,
						type: this.cFilterTypeActiveItem.value
					})
					// 取得新的数据
					const newData = this.$util.deepGet(res, 'data.data', [])
					// 判断是否有更多
					const hasMore = newData.length >= this.flowListRes.list_rows
					// 设置新的数据
					this.flowListRes = {
						...this.flowListRes,
						page: this.flowListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ? newData : this.flowListRes.data.concat(newData),
						hasMore,
						isFetching: false,
						fetchedNum: this.flowListRes.fetchedNum + 1
					}
				} catch (e) {
					console.log(e)
					this.flowListRes.fetchedNum = this.flowListRes.fetchedNum + 1
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求账单明细的接口数据（分页）
			async fetchBillListRes({
				resetBeforeFetch = false
			} = {}) {
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.billListRes = {
							...this.billListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false
						}
					}
					// 如果没有更多就不必请求了
					if (!this.billListRes.hasMore) {
						return Promise.reject('没有更多了')
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.billListRes.isFetching = true
					// 请求数据
					const res = await App._getP('salesman.Salesman/settlementLists', {
						page: this.billListRes.page + 1,
						list_rows: this.billListRes.list_rows,
						key: this.search
					})
					// 取得新的数据
					const newData = this.$util.deepGet(res, 'data.data', [])
					// 判断是否有更多
					const hasMore = newData.length >= this.billListRes.list_rows
					// 设置新的数据
					this.billListRes = {
						...this.billListRes,
						page: this.billListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ? newData : this.billListRes.data.concat(newData),
						hasMore,
						isFetching: false,
						fetchedNum: this.billListRes.fetchedNum + 1
					}
				} catch (e) {
					console.log(e)
					this.billListRes.fetchedNum = this.billListRes.fetchedNum + 1
					return Promise.reject(e)
					// TODO handle the exception
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-salesman-bill {
		min-height: 100vh;
		background-color: #F8F8F8;
	}

	// 搜索框
	.search-bar {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 80rpx;
		width: 690rpx;
		max-width: 100%;
		margin: 30rpx auto;
		padding: 20rpx 30rpx;

		background-color: #F8F8F8;
		border-radius: 10rpx;

		.iconfont {}
	}

	.search-bar__icon-search {
		font-size: 28rpx;
		color: #999999;
		margin-right: 20rpx;
	}

	// 搜索框 end
	// 筛选项
	.bill-filter-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 690rpx;
		max-width: 100%;
		margin: 30rpx auto;
	}

	.bill-filter__time {
		font-weight: bold;
		font-size: 28rpx;
		color: #000000;
	}

	.bill-filter__time__icon-indicator {
		margin-left: 20rpx;
		font-size: 28rpx;
	}

	.bill-filter__types {
		display: flex;
		align-items: center;
	}

	.bill-filter__type {
		box-sizing: border-box;
		height: 40rpx;
		padding: 0 20rpx;
		font-size: 24rpx;
		color: #000;
		border-radius: 9999rpx;
		border: 1px solid transparent;

		&+& {
			margin-left: 20rpx;
		}

		&--active {
			font-weight: bold;
			border: 1px solid #707070;
		}
	}

	// 筛选项 end
</style>
