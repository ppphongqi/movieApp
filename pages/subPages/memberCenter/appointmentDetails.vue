<template>
	<view class="appointmentDetails app-clearfix">
		<!-- header -->
		<view v-if="cDetails.id" class="appointmentDetails__header">
			<view class="f-36 f-bold col-3">{{cDetails.statusText}}</view>
		</view>
		<!-- header end -->
		<!-- content -->
		<view v-if="cDetails.id" class="appointmentDetails__content">
			<AppointmentDetailsItem :logo="cDetails.logo" :title="cDetails.title" :desc="cDetails.desc" :time="cDetails.time" :num="cDetails.num" :payId="cDetails.payId" :location="cDetails.location"></AppointmentDetailsItem>
		</view>
		<!-- content end -->
		<!-- footer -->
		<view v-if="cDetails.status == 0" class="appointmentDetails__footer app-wrapper--safe-fixed-bottom">
			<view class="app-flex app-flex--align-center app-flex--justify-end" style="padding: 16rpx 0;">
				<view class="app-flex-item app-flex-item--shrink-0">
					<button class="app-btn-large--plain"
						style="width: auto;height: 64rpx;font-size: 24rpx;color: #333;" @click="handleBtnCancelClick(cDetails)">取消预约</button>
				</view>
			</view>

		</view>
		<!-- footer end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import App from "@/common/js/app.js";
	import AppointmentDetailsItem from './components/AppointmentDetailsItem.vue'
	export default {
		components: {
			AppointmentDetailsItem
		},
		data() {
			return {
				options: {
					// 详情id
					id: 3
				},
				// 详情的接口数据
				detailsRes: {}
			}
		},
		computed: {
			// 格式化的详情数据
			cDetails() {
				const data = this.detailsRes
				let typeText = ''
				if(data.reservation_type == 1) {
					typeText = '大厅'
				}else if(data.reservation_type == 2) {
					typeText = '包间'
				}
				return {
					id: data.id,
					// 店铺logo
					logo: this.$util.deepGet(data, 'logo.0.file_path') || '',
					// 标题
					title: data.name || '',
					// 描述
					desc: data.store_introduce || '',
					// 日期
					time: dayjs(`${data.reservation_date || ''} ${data.reservation_time || ''}`,'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm') || '',
					// 人数
					num: `${data.reservation_num || ''}人 | ${typeText} | ${data.reservation_seat || ''}桌`,
					// 状态 0:已经预约，1:取消
					status: data.is_delete,
					// 状态文字
					statusText: data.is_delete == 0 ? '已预约' : '已取消',
					// 在线买单id
					payId:data.pay_online_business_id,
					// 导航信息
					location: {
						name: data.name,
						address: data.address,
						longitude: data.lng,
						latitude: data.lat,
					}
				}
			}
		},
		async onLoad(options) {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#FFD940",
			});
			this.options = options;
			try {
				await this.mainMixin_BeforeFetchPageData();
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#FFD940",
				});
				await Promise.all([
					this.fetchDetailsRes(),
				])
				App.hideLoading()
			} catch (e) {
				console.log("onLoad 报错", e);
				// TODO handle the exception
			}
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
					// 刷新数据
					await this.fetchDetailsRes()
					uni.showToast({
						icon: 'none',
						title: '取消成功'
					})
					
				}catch(e){
					console.log(e)
				}
				this.handleBtnCancelClicking = false
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._getP('reservation.Reservation/getMemberReservationDetil', {
						id: this.options.id
					})
					this.detailsRes = res.data || {}
				} catch (e) {
					console.log('fetchDetailsRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.appointmentDetails__header {
		box-sizing: border-box;
		padding: 30rpx;
		padding-bottom: 100rpx;
		background-color: #FFD940;
	}

	.appointmentDetails__content {
		margin-top: -60rpx;
	}

	.appointmentDetails__footer {
		padding: 0 30rpx;
		background-color: #fff;
	}
</style>
