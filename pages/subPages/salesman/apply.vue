<template>
	<view class="page-salesman-apply app-clearfix">
		<!-- header -->
		<view class="page-salesman-apply__title">填写业务员资料</view>
		<view class="page-salesman-apply__subtitle">填写资料，绑定业务员。成为公司的一员</view>
		<!-- header end -->
		<!-- 申请表单 -->
		<view class="form-card">
			<!-- 姓名 -->
			<view class="form-row">
				<view class="form-row__left">
					姓名
				</view>
				<view class="form-row__center">
					<input v-model="form.real_name" class="form-row__input" type="text" placeholder="请填写真实姓名">
				</view>
			</view>
			<!-- 姓名 end -->
			<!-- 联系电话 -->
			<view class="form-row">
				<view class="form-row__left">
					联系电话
				</view>
				<view class="form-row__center">
					<input v-model="form.real_mobile" class="form-row__input" type="text" placeholder="请填写联系电话"
					maxlength="11">
				</view>
			</view>
			<!-- 联系电话 end -->
			<!-- 所在地区 -->
			<view class="form-row" @click="showCityPicker">
				<view class="form-row__left">
					所在地区
				</view>
				<view class="form-row__center">
					<input disabled class="form-row__input" type="text" placeholder="省市区县、乡镇等" :value="address">
				</view>
				<view class="form-row__right">
					<view class="form-row__icon-more iconfont icon-jinrujiantou1"></view>
				</view>
			</view>
			<!-- 所在地区 end -->
			<!-- 详细地址 -->
			<view class="form-row">
				<view class="form-row__left">
					详细地址
				</view>
				<view class="form-row__center">
					<textarea v-model="form.detail_address" class="form-row__textarea" type="text"
						placeholder="请输入详细地址"></textarea>
				</view>
			</view>
			<!-- 详细地址 end -->
			<button class="page_btn-submit btn-normal" @click="handleBtnApplyClick">{{cBtnSubmitText}}</button>
		</view>
		<!-- 申请表单 end -->
		<!-- 业务员权益 -->
		<RightsCard title="业务员权益" :text="detailsRes.explain"></RightsCard>
		<!-- 业务员权益 end -->
		<!-- 省市区选择器 -->
		<CityPicker themeColor="#007AFF" :pickerValueDefault="cCityPickerValueDefault" ref="CityPicker"
			@onConfirm="handleCityPickerConfirm"></CityPicker>
		<!-- 省市区选择器 end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import RightsCard from './components/RightsCard.vue'
	import CityPicker from "@/components/threeComponents/mpvueCityPicker.vue"
	import cityList from '@/common/js/cityData.js'
	export default {
		components: {
			RightsCard,
			CityPicker
		},
		data() {
			return {
				// 表单的值
				form: {
					// 姓名
					real_name: '',
					// 联系电话
					real_mobile: '',
					// 省id（错误的拼写）
					prce: '',
					// 市id
					city: '',
					// 地区id
					area: '',
					// 详细地址
					detail_address: ''
				},
				// 当前选中省市区的名称
				address: '',
				// 申请详情的接口数据
				detailsRes: {}
			}
		},
		computed: {
			// 当前省市区选择器的默认值
			cCityPickerValueDefault() {
				const {
					prce,
					city,
					area
				} = this.form
				if (!prce || !city || !area) {
					return ["110000000", "110100000", "110101000"]
				}
				return [prce, city, area]
			},
			// 当前提交按钮要显示的文字
			cBtnSubmitText() {
				const status = this.detailsRes.status
				if(status == 1) {
					return '等待审核'
				}
				if(status == 2) {
					return '已同意'
				}
				if(status == 3) {
					return '重新提交'
				}
				return '立即提交'
			}
		},
		watch: {
			detailsRes(val) {
				this.form = {
					// 姓名
					real_name: val.real_name,
					// 联系电话
					real_mobile: val.real_mobile,
					// 省id（错误的拼写）
					prce: val.prce,
					// 市id
					city: val.city,
					// 地区id
					area: val.area,
					// 详细地址
					detail_address: val.detail_address,
				}
			},
			form(val) {
				if (val.prce || val.city || val.area) {
					const {
						allData = []
					} = cityList
					// 更新address
					const provinceName = (allData.find(item => item.value == val.prce) || {}).label || ''
					const cityName = (allData.find(item => item.value == val.city) || {}).label || ''
					const areaName = (allData.find(item => item.value == val.area) || {}).label || ''
					this.address = `${provinceName}${cityName}${areaName}`
				}
			}
		},
		async onShow() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				await Promise.all([
					this.fetchDetailsRes().catch(() => {})
				])
				// 如果已经驳回
				if(this.detailsRes.status == 3) {
					App.showError(this.detailsRes.reject)
				}
				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
			}
		},
		methods: {
			// 显示省市区选择器
			showCityPicker() {
				this.$refs.CityPicker.show();
			},
			/**
			 * 省市区确认事件
			 */
			handleCityPickerConfirm(e = {}) {
				console.log('handleCityPickerConfirm', e)
				const [prce, city, area] = e.cityCode || []
				if (!prce || !city || !area) {
					return
				}
				this.form = {
					...this.form,
					prce,
					city,
					area
				}
			},
			/**
			 * 校验表单数据
			 * @return {Boolean}
			 */
			validateForm(data = this.form) {
				if (!data) {
					return false
				}
				if (!data.real_name) {
					uni.showToast({
						icon: 'none',
						title: '请填写姓名'
					})
					return false
				}
				if (!data.real_mobile) {
					uni.showToast({
						icon: 'none',
						title: '请填写联系电话'
					})
					return false
				}

				if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(data
					.real_mobile)) {
					uni.showToast({
						icon: 'none',
						title: '手机号码格式不正确'
					})
					return false
				}
				if (!data.prce || !data.city || !data.area) {
					uni.showToast({
						icon: 'none',
						title: '请填写详细地址'
					})
					return false
				}
				if (!data.detail_address) {
					uni.showToast({
						icon: 'none',
						title: '请填写详细地址'
					})
					return false
				}
				return true
			},
			async handleBtnApplyClick() {
				if (this.applying) {
					return
				}
				if([2].includes(+this.detailsRes.status)) {
					App.navigationTo({
						url: 'pages/subPages/salesman/index'
					})
					return
				}
				if([1].includes(+this.detailsRes.status)) {
					uni.showToast({
						icon: 'none',
						title: this.cBtnSubmitText
					})
					return
				}
				this.applying = true
				if (!this.validateForm()) {
					return
				}
				try {
					uni.showLoading({
						title: '提交中...',
					})
					await App._postP('salesman.Salesman/apply', {
						// 姓名
						real_name: this.form.real_name,
						// 联系电话
						real_mobile: this.form.real_mobile,
						// 省id（错误的拼写）
						prce: this.form.prce,
						// 市id
						city: this.form.city,
						// 地区id
						area: this.form.area,
						// 详细地址
						detail_address: this.form.detail_address,
					})
					await this.fetchDetailsRes().catch(()=>{})
					uni.showToast({
						icon: 'none',
						title: '提交成功'
					})
				} catch (e) {
					//TODO handle the exception
				}
				this.applying = false
			},
			// 请求申请详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._getP('salesman.Salesman/getApply')
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
	.page-salesman-apply {
		box-sizing: border-box;
		min-height: 100vh;
		padding: 0 30rpx;
		background-image: url("./static/images/bg-page-salesman-apply.png");
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-color: #f8f8f8;
		padding-bottom: 100rpx;
	}

	.page-salesman-apply__title {
		margin-top: 50rpx;
		font-weight: bold;
		font-size: 48rpx;
		color: #5A1F03;
	}

	.page-salesman-apply__subtitle {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #5A1F03;
	}

	// 申请表单
	.form-card {
		box-sizing: border-box;
		margin-top: 50rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.form-row {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		font-size: 28rpx;
		color: #333;
		border-radius: 10rpx;
		background-color: #F8F8F8;

		&+& {
			margin-top: 20rpx;
		}
	}

	.form-row__left {
		flex-shrink: 0;
		width: 4em;
		font-size: 28rpx;
		color: #333;
		align-self: flex-start;
	}

	.form-row__center {
		flex: 1;
		margin-left: 20rpx;
	}

	.form-row__right {
		margin-left: 20rpx;
	}

	.form-row__icon-more {
		padding-left: 20rpx;
		font-size: 30rpx;
		color: #333;
	}

	.form-row__textarea {
		padding-top: 6rpx;
	}

	.page_btn-submit {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 90rpx;
		margin-top: 30rpx;
		font-size: 32rpx;
		color: #000;
		font-weight: bold;
		background-color: #FFD940;
		border-radius: 10rpx;
	}

	// 申请表单 end
</style>
