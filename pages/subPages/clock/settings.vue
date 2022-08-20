<template>
	<view class="page-clock-setting app-clearfix">
		<!-- 早起提醒 -->
		<view  v-if="cIsMorningOpen"  class="app-card" style="padding: 0 30rpx;">
			<view class="app-flex app-flex--align-center p-top-bom-30 u-border-bottom">
				<view class="app-flex-item app-flex-item--1 f-28 col-3">
					早起提醒
				</view>
				<view class="app-flex-item app-flex-item--shrink-0">
					<u-switch v-model="form.is_morning_remind" active-color="#FFD940" :active-value="1"
						:inactive-value="0" @change="debouncedoEditSetting"></u-switch>
				</view>
			</view>
			<picker mode="time" :value="form.morning_remind_time" @change="handleTimePickerChange($event,'morning_remind_time')">
				<view class="app-flex app-flex--align-center p-top-bom-30">
					<view class="app-flex-item app-flex-item--1 f-28 col-3">
						提醒时间
					</view>
					<view class="app-flex-item app-flex-item--shrink-0 f-w">{{form.morning_remind_time}}</view>
					<view class="app-flex-item app-flex-item--shrink-0">
						<view class="clock-nav-item__icon-nav iconfont icon-jinrujiantou col-c"></view>
					</view>
				</view>
			</picker>
		</view>
		<!-- 早起提醒 end -->
		<!-- 早睡提醒 -->
		<view v-if="cIsNightOpen" class="app-card" style="padding: 0 30rpx;">
			<view class="app-flex app-flex--align-center p-top-bom-30 u-border-bottom">
				<view class="app-flex-item app-flex-item--1 f-28 col-3">
					早睡提醒
				</view>
				<view class="app-flex-item app-flex-item--shrink-0">
					<u-switch v-model="form.is_night_remind" active-color="#FFD940" :active-value="1"
						:inactive-value="0" @change="debouncedoEditSetting"></u-switch>
				</view>
			</view>
			<picker mode="time" :value="form.night_remind_time" @change="handleTimePickerChange($event,'night_remind_time')">
				<view class="app-flex app-flex--align-center p-top-bom-30">
					<view class="app-flex-item app-flex-item--1 f-28 col-3">
						提醒时间
					</view>
					<view class="app-flex-item app-flex-item--shrink-0 f-w">{{form.night_remind_time}}</view>

					<view class="app-flex-item app-flex-item--shrink-0">
						<view class="clock-nav-item__icon-nav iconfont icon-jinrujiantou col-c"></view>
					</view>

				</view>
			</picker>
		</view>
		<!-- 早睡提醒 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	export default {
		data() {
			return {
				options: {},
				// 
				k: false,
				// 表单数据
				form: {
					is_morning_remind: 0,
					morning_remind_time: '',
					is_night_remind: 0,
					night_remind_time: ''
				}
			}
		},
		computed: {
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
				// 同步请求的数据
				await Promise.all([
					this.fetchForm().catch(() => {}),
				])
				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
				// TODO handle the exception
			}
		},
		async onShow() {
			
		},
		created() {
			// 节流的请求修改接口
			this.debouncedoEditSetting = this.$util.throttle(() => {
				this.doEditSetting()
			}, 500, {
				leading: false,
				trailing: true
			})
		},
		methods: {
			handleTimePickerChange(e,key) {
				this.form[key] = e.detail.value
				this.debouncedoEditSetting()
			},
			// 编辑数据
			async doEditSetting() {
				try {
					if (this.doEditSettinging) {
						return
					}
					const res = await App._getP('clock.Clock/editUserClockRemind', this.form)
					uni.showToast({
						icon: 'none',
						title: '设置成功'
					})
				} catch (e) {
					console.log('fetchCardCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求表单的数据
			async fetchForm() {
				try {
					const res = await App._getP('clock.Clock/getUserClockRemind', {})
					const data = res.data || {}
					this.form = {
						is_morning_remind: data.is_morning_remind,
						morning_remind_time: data.morning_remind_time,
						is_night_remind: data.is_night_remind,
						night_remind_time: data.night_remind_time,
					}
				} catch (e) {
					console.log('fetchCardCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-clock-setting {
		min-height: 100vh;
		background-color: #F8F8F8;
	}
</style>
