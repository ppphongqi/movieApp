<template>
	<view class="page-salesman-index">
		<!-- 数据卡片 -->
		<DashboardCard :totalProfit="cDashboardData.totalProfit" :todayProfit="cDashboardData.todayProfit"
			:withdrawnCash="cDashboardData.withdrawnCash" :balance="cDashboardData.balance" :btnWithdrawVisible="cDashboardData.btnWithdrawVisible"
			@on-rights-click="rightsPopupVisible = true" @on-btn-withdrawal-click="handleBtnWithdrawalClick"
			@on-btn-poster-click="toggleShare" @on-btn-bill-click="handleBtnBillClick"></DashboardCard>
		<!-- 数据卡片 end -->
		<!-- 我的商家 -->
		<BusinessList :list="cBusinessList"></BusinessList>
		<!-- 我的商家 end -->
		<!-- 业务员权益弹窗 -->
		<RightsPopup v-model="rightsPopupVisible" :text="detailsRes.explain"></RightsPopup>
		<!-- 业务员权益弹窗 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
		<!-- 分享海报 -->
		<share-view ref="shareView" poster-type="salesman" :height="667" :width="375"></share-view>
		<!-- 分享海报 end -->
	</view>
</template>

<script>
	import {
		dateFormat
	} from '@/common/js/date.js'
	import App from '@/common/js/app.js'
	import DashboardCard from './components/DashboardCard.vue'
	import BusinessList from './components/BusinessList.vue'
	import RightsPopup from './components/RightsPopup.vue'
	import ShareView from '@/components/template/ShareView.vue'
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	export default {
		mixins: [pageShareMixin],
		components: {
			DashboardCard,
			BusinessList,
			RightsPopup,
			ShareView
		},
		data() {
			return {
				options: {},
				// 业务员权益是否显示
				rightsPopupVisible: false,
				// 绑定业务员的接口数据
				bindingRes: {},
				// 详情的接口数据
				detailsRes: {}
			}
		},
		computed: {
			// 格式化的数据卡片的数据
			cDashboardData() {
				return {
					// 累计收益（元）
					totalProfit: this.detailsRes.sum_income,
					// 今日收益（元）
					todayProfit: this.detailsRes.day_income,
					// 已提现（元）
					withdrawnCash: this.detailsRes.tx_money,
					// 余额（元）
					balance: this.detailsRes.money,
					// 提现按钮是否显示
					btnWithdrawVisible: this.$util.deepGet(this.detailsRes, 'setting.is_withdraw') == 1
				}
			},
			// 格式化的我的商家列表数据
			cBusinessList() {
				return (this.detailsRes.business || []).map(item => ({
					id: item.bus_id,
					// 商家名称
					title: item.bus_name,
					// 商家图片
					logo: item.logo,
					// 到期时间
					expirationTime: dateFormat(item.expire_time, {
						fallback: ''
					}),
					// 绑定时间
					bindingTime: item.bind_time == -1 ? '长期绑定' : item.bind_time,
					// 已返
					rebate: item.income
				}))
			}
		},
		watch: {
			detailsRes(val) {
				this.shareData = this.pageShareMixin_createShareData({
					url: '/pages/subPages/merchant/enter/enter',
					query: {
						salesman_id: this.$util.deepGet(val, 'setting.salesman.salesman_id', ''),
						referee_id: App.getUserId()
					},
					imgUrl: this.$util.deepGet(val, 'setting.share_img.0.file_path', ''),
					title: this.$util.deepGet(val, 'setting.share_title', ''),
					desc: this.$util.deepGet(val, 'setting.share_text', '')
				})
			}
		},
		onLoad(options) {
			this.options = options
			if (options.scene) {
				const queryData = this.$util.scene_decode(options.scene) || {}
				this.options = {
					bus_id: queryData.a,
					...this.options
				}
			}
		},
		async onShow() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				// 请求绑定关系
				await this.fetchBindingRes()
				// 请求详情的接口数据
				await this.fetchDetailsRes()
				App.hideLoading()
			} catch (e) {
				// #ifdef H5
				if (e.code == 2) {
					setTimeout(() => {
						App.showError(e.msg, function(options) {
							App.navigationTo({
								url: 'pages/mainPages/index/index',
								redirectTo: true
							})
						})
					}, 500)
				}
				// #endif
				console.log('onShow 报错', e)
			}

		},
		methods: {
			toggleShare() {
				this.$refs.shareView.shareswich()
			},
			// 我要提现按钮点击事件
			handleBtnWithdrawalClick() {
				App.navigationTo({
					url: 'pages/subPages/salesman/withdrawal'
				})
			},
			// 账单明细按钮点击事件
			handleBtnBillClick() {
				App.navigationTo({
					url: 'pages/subPages/salesman/bill'
				})
			},
			// 请求绑定关系的接口数据
			async fetchBindingRes() {
				try {
					if (!this.options.bus_id) {
						return
					}
					const res = await App._getP('salesman.Salesman/businessBindSalesman', {
						bus_id: this.options.bus_id
					})
					this.bindingRes = this.$util.deepGet(res, 'data', {})
				} catch (e) {
					console.log('fetchBindingRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求申请详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._getP('salesman.Salesman/salesmanCenter')
					this.detailsRes = this.$util.deepGet(res, 'data', {})
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-salesman-index {
		background-color: #F8F8F8;
		min-height: 100vh;
	}
</style>
