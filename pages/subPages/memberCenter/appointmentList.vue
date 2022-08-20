<template>
	<view class="app-clearfix">
		<AppointmentList :list="cList" @on-btn-cancel-click="handleBtnCancelClick"></AppointmentList>
		<!-- 加载更多提示 -->
		<LoadMore :showLoadmore="!appointmentListRes.hasMore"></LoadMore>
		<!-- 加载更多提示 end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import App from "@/common/js/app.js";
	import LoadMore from '@/components/template/Loadmore.vue'
	import AppointmentList from './components/AppointmentList.vue'
	export default {
		components: {
			LoadMore,
			AppointmentList
		},
		data() {
			return {
				options: {},
				// 列表的接口数据（分页）
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
			}
		},
		computed: {
			// 格式化的列表数据
			cList() {
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
					this.fetchAppointmentListRes({
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
					this.fetchAppointmentListRes({
						resetBeforeFetch: this.appointmentListRes.page <= 0
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
		    if (this.appointmentListRes.isFetching || !this.appointmentListRes.hasMore) {
		        return
		    }
		    this.fetchAppointmentListRes().catch(() => {})
		},
		methods: {
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
			// 请求列表的接口数据（分页）
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
