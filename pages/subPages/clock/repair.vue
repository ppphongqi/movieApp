<template>
	<view class="page-clock-repair app-clearfix">
		<!-- 补签卡总数 -->
		<view class="app-card app-card--transparent">
			<view class="col-3 f-32"><text class="f-58 f-w m-right12"
					style="font-size: 80rpx;">{{cDetails.card_num}}</text>张补签卡</view>
		</view>
		<!-- 补签卡总数 end -->
		<!-- 补签卡片 -->
		<view v-if="cIsMorningOpen"  class="clock-repair-card is-morning app-card app-card--transparent app-flex app-flex--align-center">
			<view class="app-flex-item app-flex-item--1">
				<view class="f-32 f-w" style="color: #482311;">早打卡</view>
				<view class="f-28 m-top10" style="color: #B2972B">当前连续打卡{{cDetails.continuity_morning_day}}天</view>
			</view>
			<view class="app-flex-item app-flex-item--shrink-0">
				<button class="app-btn--inline f-28" style="height: 70rpx; background-color: #482311; color: #FFD940;"
					@click="handleBtnRepairClick({clockType: '1'})">补签</button>
			</view>
		</view>
		<view v-if="cIsNightOpen" class="clock-repair-card is-evening app-card app-card--transparent app-flex app-flex--align-center">
			<view class="app-flex-item app-flex-item--1">
				<view class="f-32 f-w col-f">晚打卡</view>
				<view class="f-28 m-top10 col-f">当前连续打卡{{cDetails.continuity_night_day}}天</view>
			</view>
			<view class="app-flex-item app-flex-item--shrink-0">
				<button class="app-btn--inline f-28" style="height: 70rpx; background-color: #fff; color: #273466;"
					@click="handleBtnRepairClick({clockType: '2'})">补签</button>
			</view>
		</view>
		<!-- 补签卡片 end -->
		<!-- 获取补签卡 -->
		<view class="app-card app-card--fluid app-card--transparent">
			<view class="f-w f-36 col-3">
				获取补签卡
			</view>
			<!-- 邀请新用户 -->
			<view v-if="cDetails.invite_open" class="app-card" style="padding: 0 30rpx;">
				<view class="app-flex app-flex--align-center u-border-bottom p-top-bom-30">
					<view class="app-flex-item app-flex-item--1">
						<view class="f-w f-32 col-3">邀请{{cDetails.invite_num}}名新用户</view>
						<view class="f-24 col-3 m-top10">再邀请{{cDetails.invite_num-cDetails.invite_num_progress}}人得1张补签卡
						</view>
					</view>
					<view class="app-flex-item app-flex-item--shrink-0">
						<button class="app-btn--inline col-3 f-28" style="height: 70rpx;background-color: #FFD940;"
							@click="handleBtnInviteClick">立即邀请</button>
					</view>
				</view>
				<view class="app-flex app-flex--align-center p-top-bom-30">
					<view class="app-flex-item app-flex-item--1" @click="invitedPopupVisible=true">
						<view class="f-w f-32 col-3">已邀请{{cDetails.inviteing}}人</view>
					</view>
					<view class="app-flex-item app-flex-item--shrink-0">
						<view class="clock-nav-item__icon-nav iconfont icon-jinrujiantou col-c"></view>
					</view>
				</view>
			</view>
			<!-- 邀请新用户 end -->
			<!-- 任务列表 -->
			<view class="repair-task-list">
				<view v-for="item in cTaskList" :key="item.id" class="repair-task-item">
					<view class="repair-task-card app-card">
						<view class="f-w f-32 col-3">{{item.title}}</view>
						<view class="f-24 col-3 m-top10">{{item.text}}</view>
						<view class="app-flex app-flex--align-center app-flex--justify-between m-top30">
							<view class="app-flex-item" style="width: 384rpx;margin-right: auto;">
								<u-line-progress height="40rpx" active-color="#FFD940" :percent="item.percent"
									:show-percent="false">
									<view>{{item.percentText}}</view>
								</u-line-progress>
							</view>
							<view class="app-flex-item app-flex-item--shrink-0" style="font-size: 0;">
								<image src="./static/images/icon-clock-repair-task.png" mode=""
									style="width: 40rpx;height: 40rpx;"></image>
							</view>
							<view class="app-flex-item app-flex-item--shrink-0 col-9 f-24">
								+1
							</view>
						</view>
					</view>
				</view>

			</view>
			<!-- 任务列表 end -->
			<!-- 积分兑换 -->
			<view v-if="cIntegral.visible" class="repair-task-card app-card">
				<view class="app-flex app-flex--align-center">
					<view class="app-flex-item app-flex-item--1">
						<view class="f-w f-32 col-3">{{cIntegral.title}}</view>
						<view class="f-24 col-3 m-top10">{{cIntegral.text}}
						</view>
					</view>
					<view class="app-flex-item app-flex-item--shrink-0">
						<button class="app-btn--inline col-3 f-28" style="height: 70rpx;background-color: #FFD940;"
							@click="handleBtnIntegralClick">兑换</button>
					</view>
				</view>
				<view class="app-flex app-flex--align-center app-flex--justify-between m-top30">
					<view class="app-flex-item" style="width: 384rpx;margin-right: auto;">
						<u-line-progress height="40rpx" active-color="#FFD940" :percent="cIntegral.percent"
							:show-percent="false">
							<view>{{cIntegral.percentText}}</view>
						</u-line-progress>
					</view>
				</view>
			</view>
			<!-- 积分兑换 end -->

		</view>
		<!-- 获取补签卡 end -->
		<!-- 补签提示弹窗 -->
		<RepairTipPopup v-model="repairTipPopupVisible" :text="repairTipPopupText" @on-confirm="doRepair">
		</RepairTipPopup>
		<!-- 补签提示弹窗 end -->
		<!-- 已邀请用户弹窗 -->
		<InvitedPopup v-model="invitedPopupVisible" :list="cInvitedUserList"></InvitedPopup>
		<!-- 已邀请用户弹窗 end -->
		<!-- 海报弹窗 -->
		<share-view ref="shareView" posterType="clock" :customPic="invitePosterRes" :height="667" :width="375">
		</share-view>
		<!-- 海报弹窗 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import RepairTipPopup from './components/RepairTipPopup.vue'
	import InvitedPopup from './components/InvitedPopup.vue'
	import ShareView from '@/components/template/ShareView.vue'
	export default {
		components: {
			RepairTipPopup,
			InvitedPopup,
			ShareView
		},
		data() {
			return {
				// 页面的options
				options: {},
				// 详情的接口数据
				detailsRes: {},
				// 已邀请用户的接口数据（非分页）
				invitedUserListRes: [],
				// 补签提示弹窗是否显示
				repairTipPopupVisible: false,
				// 补签提示弹窗文案
				repairTipPopupText: '',
				// 当前需要补签的类型
				clockType: '',
				// 已邀请用户弹窗是否显示
				invitedPopupVisible: false,
				// 邀请好友的接口数据
				invitePosterRes: ''
			}
		},
		computed: {
			// 格式化的详情数据
			cDetails() {
				return this.detailsRes
			},
			// 格式化的积分兑换数据
			cIntegral() {
				return {
					// 是否显示
					visible: +this.detailsRes.integral > 0,
					title: `积分兑换补签卡`,
					text: `每${this.detailsRes.integral}积分，可兑换1张补签卡`,
					percent: this.detailsRes.user_integral / this.detailsRes.integral*100,
					percentText: +this.detailsRes.user_integral > 0 ?
						`${this.detailsRes.user_integral}/${this.detailsRes.integral}` : ''
				}
			},
			// 任务列表的数据
			cTaskList() {
				const data = this.detailsRes
				let rs = []
				// 累计打卡
				if (+data.cumulative > 0) {
					rs = [...rs, {
						id: 'cumulative',
						title: `累计打卡${data.cumulative_clock_num}次`,
						text: `已打卡${data.cumulative_clock_progress}次，再打卡${data.cumulative-data.cumulative_clock_progress}次得1张补签卡`,
						percent: data.cumulative_clock_progress / data.cumulative*100,
						percentText: +data.cumulative_clock_progress > 0 ?
							`${data.cumulative_clock_progress}/${data.cumulative}` : ''
					}]
				}
				// 连续早打卡
				if (+data.continuity_m > 0 && this.cIsMorningOpen) {
					rs = [...rs, {
						id: 'continuity_m',
						title: `连续早打卡${data.continuity_m_clock_num}次`,
						text: `已打卡${data.continuity_m_clock_progress}次，再打卡${data.continuity_m-data.continuity_m_clock_progress}次得1张补签卡`,
						percent: data.continuity_m_clock_progress / data.continuity_m*100,
						percentText: +data.continuity_m_clock_progress > 0 ?
							`${data.continuity_m_clock_progress}/${data.continuity_m}` : ''
					}]
				}
				// 连续晚打卡
				if (+data.continuity_n > 0 && this.cIsNightOpen) {
					rs = [...rs, {
						id: 'continuity_n',
						title: `连续晚打卡${data.continuity_n_clock_num}次`,
						text: `已打卡${data.continuity_n_clock_progress}次，再打卡${data.continuity_n-data.continuity_n_clock_progress}次得1张补签卡`,
						percent: data.continuity_n_clock_progress / data.continuity_n*100,
						percentText: +data.continuity_n_clock_progress > 0 ?
							`${data.continuity_n_clock_progress}/${data.continuity_n}` : ''
					}]
				}
				return rs
			},
			// 邀请好友历史
			cInvitedUserList() {
				return this.invitedUserListRes.map(item => ({
					id: item.id,
					avatar: item.avatarUrl
				})).slice(0, 12)
			},
			cIsMorningOpen() {
				return this.$util.deepGet(this.settingData,'clock.is_morning_open')== 1
			},
			cIsNightOpen() {
				return this.$util.deepGet(this.settingData,'clock.is_night_open')== 1
			}
		},
		async onLoad(options) {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff"
			});
			this.options = options
			try {
				// await this.mainMixin_BeforeFetchPageData()
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#ffffff"
				});
				// 异步的请求
				this.fetchInvitedUserListRes().catch(() => {})
				this.fetchInvitePosterRes().catch(() => {})
				// 同步请求的数据
				await Promise.all([
					this.fetchDetailsRes().catch(() => {}),
				])

				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
				// TODO handle the exception
			}
		},
		async onShow() {

		},
		methods: {
			// 立即邀请按钮点击事件
			handleBtnInviteClick() {
				this.$refs.shareView.shareswich()
			},
			// 积分兑换按钮点击事件
			async handleBtnIntegralClick() {
				if (this.handleBtnIntegralClicking) return
				this.handleBtnIntegralClicking = true
				this.repairTipPopupVisible = false
				uni.showLoading({
					title: '请稍候'
				})
				try {
					const res = await App._getP('clock.Clock/integralExchange', {
					})
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: '兑换成功'
					})
					// 刷新数据
					this.fetchDetailsRes().catch(() => {})
					this.handleBtnIntegralClicking = false
				} catch (e) {
					this.handleBtnIntegralClicking = false
					console.log('fetchCardCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 早晚补签按钮点击事件
			handleBtnRepairClick({
				clockType
			}) {
				if (+this.cDetails.card_num <= 0) {
					uni.showToast({
						icon: 'none',
						title: '补签卡数量不足'
					})
					return
				}
				if (clockType == 1) {
					this.repairTipPopupText = '您将消耗1张补签卡，确认补早打卡吗？'
				}
				if (clockType == 2) {
					this.repairTipPopupText = '您将消耗1张补签卡，确认补晚打卡吗？'
				}
				this.clockType = clockType
				this.repairTipPopupVisible = true
			},
			async doRepair() {
				if (this.doRepairing) return
				this.doRepairing = true
				this.repairTipPopupVisible = false
				uni.showLoading({
					title: '请稍候'
				})
				try {
					const res = await App._getP('clock.Clock/repairClock', {
						clock_type: this.clockType
					})
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: '补卡成功'
					})
					// 刷新数据
					this.fetchDetailsRes().catch(() => {})
					this.doRepairing = false
				} catch (e) {
					this.doRepairing = false
					console.log('fetchCardCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._getP('clock.Clock/repairClockInfo', {})
					this.detailsRes = res.data || {}
				} catch (e) {
					console.log('fetchCardCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			async fetchInvitedUserListRes() {
				try {
					const res = await App._getP('clock.Clock/seeInviteUser', {})
					this.invitedUserListRes = res.data || []
				} catch (e) {
					console.log('fetchCardCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			async fetchInvitePosterRes() {
				try {
					const res = await App._getP('clock.Clock/getClockInvitePoster', {})
					this.invitePosterRes = res.data || ''
				} catch (e) {
					console.log('fetchCardCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.clock-repair-card {
		height: 175rpx;
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		border-radius: 0;
		margin-top: 0;
		margin-bottom: 0;

		&.is-morning {
			background-image: url(./static/images/bg-clock-repair--morning.png);
		}

		&.is-evening {
			background-image: url(./static/images/bg-clock-repair--evening.png);
		}
	}
</style>
