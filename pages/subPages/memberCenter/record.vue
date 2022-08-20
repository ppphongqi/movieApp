<template>
	<view class="app-clearfix">
		<!-- 顶部导航 -->
		<u-sticky h5-nav-height="0" bg-color="transparent" z-index="199">
			<page-nav-bar class="page-nav" :nav-list="cTopCateData" :current="cTopCateActiveItem.id"
				@on-nav-item-click="handleTopCateItemClick"></page-nav-bar>
		</u-sticky>
		<!-- 顶部导航 end -->
		<!-- 消费记录 -->
		<PurchaseRecordList v-if="cTopCateActiveItem.id === 'record'" :list="cRecordList"></PurchaseRecordList>
		<!-- 消费记录 end -->
		<!-- 预约列表 -->
		<AppointmentList v-else-if="cTopCateActiveItem.id === 'appoint'" :list="cAppointList" @on-btn-cancel-click="handleBtnCancelClick"></AppointmentList>
		<!-- 预约列表 end -->
		<!-- 加载更多提示 -->
		<LoadMore :showLoadmore="cTopCateActiveItem.listRes && !cTopCateActiveItem.listRes.hasMore"></LoadMore>
		<!-- 加载更多提示 end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import App from "@/common/js/app.js";
	import PageNavBar from '@/components/template/PageNavBar2.vue'
	import LoadMore from '@/components/template/Loadmore.vue'
	import AppointmentList from './components/AppointmentList.vue'
	import PurchaseRecordList from './components/PurchaseRecordList.vue'
	export default {
		components: {
			PageNavBar,
			LoadMore,
			AppointmentList,
			PurchaseRecordList
		},
		data() {
			return {
				options: {},
				// 当前选中的顶部tab索引
				topCateAvtive: 0,
				// 预约列表的接口数据（分页）
				appointmentListRes: {
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
				// 消费列表的接口数据（分页）
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
			cAppointList() {
				return this.appointmentListRes.data.map(item => {
					let typeText = ''
					if(item.reservation_type == 1) {
						typeText = '大厅'
					}else if(item.reservation_type == 2) {
						typeText = '包间'
					}
					return {
						id: item.id,
						// 店铺logo
						logo: this.$util.deepGet(item, 'logo.0.file_path') || '',
						// 标题
						title: item.name,
						// 描述
						desc: item.store_introduce,
						// 日期
						time: dayjs(`${item.reservation_date} ${item.reservation_time}`,'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm'),
						// 人数
						num: `${item.reservation_num}人 | ${typeText} | ${item.reservation_seat}桌`,
						// 状态 0:已经预约，1:取消
						status: item.is_delete,
						// 状态文字
						statusText: item.is_delete == 0 ? '已预约' : '已取消'
					}
				})
			},
			// 格式化的列表数据
			cRecordList() {
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
			},
			// 格式化的顶部tab的数据
			cTopCateData() {
				return [{
						id: 'record',
						title: '消费记录',
						fetchListRes: this.fetchRecordListRes,
						listRes: this.recordListRes
					},
					{
						id: 'appoint',
						title: '预约列表',
						fetchListRes: this.fetchAppointmentListRes,
						listRes: this.appointmentListRes
					},
				]
			},
			// 当前选中的顶部分类的项
			cTopCateActiveItem() {
				return this.cTopCateData[this.topCateAvtive] || {}
			},
		},
		watch: {
			cTopCateActiveItem(val) {
				console.log('cTopCateActiveItem', val)
				if (val.listRes && !val.listRes.data.length && !val.listRes.isFetching) {
					console.log('请求数据')
					this.fetchTabListRes()
				}
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
					this.fetchTabListRes().catch(() => {})
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
					this.fetchTabListRes({
						resetBeforeFetch: true
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
		    if (this.cTopCateActiveItem.listRes && !this.cTopCateActiveItem.listRes.data.length && !this.cTopCateActiveItem
		    	.listRes.isFetching) {
		    	this.fetchTabListRes().catch(() => {})
		    }
		},
		methods: {
			
			// 顶部分类点击事件
			handleTopCateItemClick({
				index
			}) {
				this.topCateAvtive = index
			},
			// 取消按钮点击事件
			async handleBtnCancelClick(item,index) {
				console.log(item,index)
				// 如果正在请求或者不是以下操作 直接返回
				if(this.handleBtnCancelClicking) {
					return 
				}
				this.handleBtnCancelClicking = true
				try{
					// 确认操作
					const modalRes = await uni.showModal({
						title: '请确认',
						content: '是否取消当前预约？'
					})
					if(modalRes[1].cancel) {
						this.handleBtnCancelClicking = false
						return
					} 
					uni.showLoading({
						title: '请稍候...',
						mask: true
					})
					// 请求接口
					const res = await App._postP('reservation.Reservation/cancelUserReservation',{
						id:item.id
					})
					// 修改当前数据
					this.appointmentListRes.data[index] = {
						...this.appointmentListRes.data[index],
						is_delete: 1
					}
					this.appointmentListRes.data = [...this.appointmentListRes.data]
					uni.showToast({
						icon: 'none',
						title: '取消成功'
					})
					
				}catch(e){
					console.log(e)
				}
				this.handleBtnCancelClicking = false
			},
			fetchTabListRes(...args) {
				if (this.cTopCateActiveItem && typeof this.cTopCateActiveItem.fetchListRes === 'function') {
					return this.cTopCateActiveItem.fetchListRes(...args)
				}
			},
			// 预约列表的接口数据（分页）
			async fetchAppointmentListRes({
				resetBeforeFetch = false
			} = {}) {
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						console.log("重置数据");
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.appointmentListRes = {
							...this.appointmentListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false,
						};
					}
					// 如果没有更多就不必请求了
					if (!this.appointmentListRes.hasMore) {
						return Promise.reject();
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.appointmentListRes.isFetching = true;
					// 请求数据
					const res = await App._getP("reservation.Reservation/memberReservationList", {
						page: this.appointmentListRes.page + 1,
						// 其他接口都是list_rows
						list_rows: this.appointmentListRes.listRow,
					});
					// 取得新的数据
					const newData = this.$util.deepGet(res, "data.data", []);
					// 判断是否有更多
					const hasMore = newData.length >= this.appointmentListRes.listRow;
					// 设置新的数据
					this.appointmentListRes = {
						...this.appointmentListRes,
						page: this.appointmentListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ?
							newData : [...this.appointmentListRes.data,...newData],
						hasMore,
						isFetching: false,
					};
				} catch (e) {
					this.appointmentListRes.isFetching = false
					console.log("ha", e);
					return Promise.reject(e);
					// TODO handle the exception
				}
			},
			// 请求消费记录列表的接口数据（分页）
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
					this.appointmentListRes.isFetching = false
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
