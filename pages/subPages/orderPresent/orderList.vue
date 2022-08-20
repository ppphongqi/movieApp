<template>
	<view class="pages-card-record app-clearfix">
		<!-- 列表 -->
		<OderList :list="cOrderList"></OderList>
		<!-- 列表 end -->
		<!-- 加载更多提示 -->
		<LoadMore :showLoadmore="!orderListRes.hasMore"></LoadMore>
		<!-- 加载更多提示 end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import LoadMore from '@/components/template/Loadmore.vue'
	import OderList from './components/OderList.vue'
	import {
		dateFormat
	} from '@/common/js/date'
	export default {
		components: {
			LoadMore,
			OderList,
		},
		data() {
			return {
				// 页面options
				options: {
					card_id: ''
				},
				// 优惠券列表的分页接口数据
				orderListRes: {
					// 当前第几页，0就是即将请求第1页
					page: 0,
					// 分页的大小
					list_rows: 20,
					// 数据
					data: [],
					// 是否还有更多
					hasMore: true,
					// 是否正在请求
					isFetching: false
				}
			}
		},
		computed: {
			// 格式化的使用记录列表数据
			cOrderList() {
				return (this.orderListRes.data || []).map(item => {
					return {
						id: item.id,
						// 订单号
						orderNo: item.order_no,
						// 状态
						status: '',
						// 状态文字
						statusText: '已转赠',
						title: item.goods_name,
						image: item.goods_img,
						// 转赠时间
						time: item.create_time,
						// 商品数量
						num: 1,
						// 价值
						price: item.value_price,
						// 收取人头像
						avatar: item.avatar,
						// 收取人名称
						nickName: item.nickname
					}
				})
			}
		},
		onLoad(options) {
			this.options = options
		},
		async onShow() {
			try {
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#F8F8F8",
				});
				await this.mainMixin_BeforeFetchPageData()
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#F8F8F8",
				});
				await Promise.all([
					this.fetchOrderListRes({
						resetBeforeFetch: this.orderListRes.page <= 0
					}).catch(() => {})
				])
				App.hideLoading()
			} catch (e) {
				console.log('onPullDownRefresh 报错', e)
				// TODO handle the exception
			}
		},
		async onPullDownRefresh() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				await Promise.all([
					this.fetchOrderListRes({
						resetBeforeFetch: true
					}).catch(() => {})
				])
			} catch (e) {
				console.log('onPullDownRefresh 报错', e)
				// TODO handle the exception
			}
			uni.stopPullDownRefresh()
		},
		// 上拉加载更多
		// onReachBottom() {
		//  if (this.orderListRes.isFetching || !this.orderListRes.hasMore) {
		//      return
		//  }
		//  this.fetchOrderListRes().catch(() => {})
		// },
		methods: {
			// 请求优惠券列表的分页接口数据
			async fetchOrderListRes({
				resetBeforeFetch = false
			} = {}) {
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.orderListRes = {
							...this.orderListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false
						}
					}
					// 如果没有更多就不必请求了
					if (!this.orderListRes.hasMore) {
						return Promise.reject()
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.orderListRes.isFetching = true
					// 请求数据
					const res = await App._getP('user.order/getDonationRecords', {
						page: this.orderListRes.page + 1,
						list_rows: this.orderListRes.list_rows,
					})
					// 取得新的数据(接口数据不是分页)
					console.log('hahah',res)
					const newData = this.$util.deepGet(res, 'data', [])
					// 判断是否有更多
					// const hasMore = newData.length >= this.orderListRes.list_rows
					const hasMore = false
					// 设置新的数据
					this.orderListRes = {
						...this.orderListRes,
						page: this.orderListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ? newData : this.orderListRes.data.concat(newData),
						hasMore,
						isFetching: false
					}
					console.log('this.orderListRes11111111111', this.orderListRes.data[0])
				} catch (e) {
					this.orderListRes.isFetching = false
					console.log(e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
</style>

<style lang="scss" scoped>
	.pages-card-record {
		box-sizing: border-box;
		min-height: 100vh;
		background-color: #F8F8F8;
	}
</style>
