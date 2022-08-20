<template>
	<view class="app-clearfix">
		<PurchaseRecordList :list="cList"></PurchaseRecordList>
		<!-- 加载更多提示 -->
		<LoadMore :showLoadmore="!recordListRes.hasMore"></LoadMore>
		<!-- 加载更多提示 end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import App from "@/common/js/app.js";
	import LoadMore from '@/components/template/Loadmore.vue'
	import PurchaseRecordList from './components/PurchaseRecordList.vue'
	export default {
		components: {
			LoadMore,
			PurchaseRecordList
		},
		data() {
			return {
				options: {},
				// 列表的接口数据（分页）
				recordListRes: {
					// 当前第几页，0就是即将请求第1页
					page: 0,
					// 分页的大小
					listRow: 10,
					// 数据
					data: [],
					// 是否还有更多
					hasMore: true,
					// 是否正在请求
					isFetching: false,
				},
			}
		},
		computed: {
			// 格式化的列表数据
			cList() {
				return this.recordListRes.data.map(item => {
					let title = ''
					let typeText='' 
					if(item.use_type == 1) {
						title = item.goods_name
						typeText='商品' 
					}else if(item.use_type == 2) {
						title = item.store_name
						typeText='预约' 
					}else if(item.use_type == 3) {
						title = item.business_name
						typeText='在线买单' 
					}
					return {
						id: item.id,
						title,
						time: item.update_time,
						num: '-1',
						type: 1,
						typeText: typeText
					}
				})
			}
		},
		async onLoad(options) {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff",
			});
			this.options = options;
			try {
				await this.mainMixin_BeforeFetchPageData();
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#ffffff",
				});
				await Promise.all([
					this.fetchRecordListRes({
						resetBeforeFetch: true
					}).catch(() => {})
				])
				App.hideLoading()
			} catch (e) {
				console.log("onLoad 报错", e);
				// TODO handle the exception
			}
		},
		async onPullDownRefresh() {
			try {
				await Promise.all([
					this.fetchRecordListRes({
						resetBeforeFetch: this.recordListRes.page <= 0
					}).catch(() => {})
				])
			} catch (e) {
				console.log('onPullDownRefresh 报错', e)
				// TODO handle the exception
			}
			uni.stopPullDownRefresh()
		},
		// 上拉加载
		onReachBottom() {
		    if (this.recordListRes.isFetching || !this.recordListRes.hasMore) {
		        return
		    }
		    this.fetchRecordListRes().catch(() => {})
		},
		methods: {
			// 请求列表的接口数据（分页）
			async fetchRecordListRes({
				resetBeforeFetch = false
			} = {}) {
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						console.log("重置数据");
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.recordListRes = {
							...this.recordListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false,
						};
					}
					// 如果没有更多就不必请求了
					if (!this.recordListRes.hasMore) {
						return Promise.reject();
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.recordListRes.isFetching = true;
					// 请求数据
					const res = await App._getP("reservation.Reservation/getUserMemberSecond", {
						page: this.recordListRes.page + 1,
						// 其他接口都是list_rows
						list_rows: this.recordListRes.listRow,
					});
					// 取得新的数据
					const newData = this.$util.deepGet(res, "data.data", []);
					// 判断是否有更多
					const hasMore = newData.length >= this.recordListRes.listRow;
					// 设置新的数据
					this.recordListRes = {
						...this.recordListRes,
						page: this.recordListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ?
							newData : [...this.recordListRes.data,...newData],
						hasMore,
						isFetching: false,
					};
				} catch (e) {
					console.log("ha", e);
					return Promise.reject(e);
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
</style>
