<template>
	<view>
		<view class="container" :style="themeColor">
			<view class="common-header-xian"></view>
			<!-- 表单 -->
			<form @submit="saveData" report-submit="true">
				<view class="all-content-box">
					<view class="address-cont-title cont-top b-f">
						<view class="list address-box dis-flex b-b">
							<view class="left-name">
								<text class="f-28">收货人</text>
							</view>
							<view class="right-cont flex-box">
								<input name="name" placeholder="请输入收货人姓名" :value="detail.name"></input>
							</view>
						</view>
						<view class="list address-box dis-flex b-b">
							<view class="left-name">
								<text class="f-28">手机号</text>
							</view>
							<view class="right-cont flex-box">
								<input maxlength="11" name="phone" placeholder="请输入收货人联系电话" type="number" :value="detail.phone"></input>
							</view>
						</view>
					</view>
					<view class="address-cont-title cont-btm b-f">
						<view class="dis-flex list address-box b-b">
							<view class="left-name">
								<text class="f-28">所在地区</text>
							</view>
							<view class="address-cont-box flex-box onelist-hidden">
								<text v-if="!!region" class="f-24">{{region[0]}}{{region[1]}}{{region[2]}}</text>
								<text v-else class="f-28 col-7 col-c">选择省、市、区</text>
							</view>
							<view class="address-location" @click="chooseLocation">
								<image class="address-location__icon" style="width: 25rpx;height: 30rpx;" src="./static/images/icon-location--yellow.png" mode=""></image>定位
							</view>
						</view>
						<view class="dis-flex list address-box">
							<view class="left-name">
								<text class="f-28">详细地址</text>
							</view>
							<view class="right-cont flex-box onelist-hidden">
								<input name="detail" placeholder="如：道路、门牌号、小区、楼栋号" type="text" :value="detail.detail"></input>
							</view>
						</view>
					</view>
				</view>
				<view class="label-content">
					<radio-group name="default" @change="radioChange">
						<label class="f-28 col-3">
							<radio value="adddefault" class="radio-right" :checked="detail['default']===1" />
							<text class="">设为默认地址</text>
						</label>
					</radio-group>
				</view>
				<!-- <view class="padding-box m-top35 get-addressBtn">
					<button class="f-28" @click="chooseAddress">一键获取微信地址</button>
				</view> -->
				<view class="padding-box m-top20 save-btn">
					<button class="f-28 main-bg-color auxiliary-color"  formType="submit" :disabled="disabled">保存</button>
				</view>
			</form>
		</view>
		<!-- <CityPicker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></CityPicker> -->
	</view>
</template>

<script>
	import CityPicker from "@/components/threeComponents/mpvueCityPicker.vue"
	import App from "@/common/js/app.js";

	export default {
		data() {
			return {
				disabled: false,
				nav_select: false, // 快捷导航
				region: '',
				code: null,
				detail: {},
				adddefault: 0,
				error: '',
				cityPickerValueDefault: [0, 0, 0]
			};
		},
		components: {
			CityPicker
		},
		beforeCreate() {
			//App = this.getApp;
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			// 获取当前地址信息
			this.getAddressDetail(options.address_id);
		},
		watch: {
			code(newValue, oldValue) {

			}
		},
		methods: {
			// 自带地图选择地址
			chooseLocation() {
				const _this = this
				uni.chooseLocation({
					// 仅小程序支持目标经纬度
					// latitude: this.detail.lat,
					// longitude: this.detail.lng,
					success(res) {
						console.log('选择的地址', res)
						App._getP('Address/jsonInverseAnalysis', {
							address: res.address,
							lat: res.latitude,
							lng: res.longitude,
							name: res.name
						}).then(res1 => {
							const data = res1.data || {}
							const {
								province,
								city,
								district,
								address
							} = data
							_this.cityPickerValueDefault = ['' + province.id, '' + city.id, '' + district.id];
							_this.region = ['' + province.name, '' + city.name, '' + district.name];
							_this.code = _this.cityPickerValueDefault;
							_this.detail.detail = address
							_this.detail.lat = res.latitude
							_this.detail.lng = res.longitude
						})
					}
				})
			},
			showpicker() {
				this.$refs.mpvueCityPicker.show();
			},
			/**
			 * 获取当前地址信息
			 */
			getAddressDetail: function(address_id) {
				let _this = this;
				App._get('address/detail', {
					address_id
				}, function(result) {
					let {
						province_id,
						city_id,
						region_id
					} = result.data.detail,
						code = [province_id, city_id, region_id];
					_this.cityPickerValueDefault = [province_id, city_id, region_id].map(val => val += "");
					_this.code = [province_id, city_id, region_id];
					_this.setData(result.data);
				});
			},

			/**
			 * 表单提交
			 */
			saveData: function(e) {
				let _this = this,
					values = e.detail.value
				values.region = this.code.join(",");
				values.default = this.detail.default;
				values.lat = this.detail.lat;
				values.lng = this.detail.lng;
				console.log('saveData values', values)
				// 记录formId
				App.saveFormId();

				// 表单验证
				if (!_this.validation(values)) {
					App.showError(_this.error);
					return false;
				}

				// 按钮禁用
				_this.setData({
					disabled: true
				});

				// 提交到后端
				values.address_id = _this.detail.address_id;
				console.log('提交到后端的数据',values)
				App._post_form('address/edit', values, function(result) {
					App.showSuccess(result.msg, function() {
						uni.navigateBack();
					});
				}, false, function() {
					// 解除禁用
					_this.setData({
						disabled: false
					});
				});
			},
			radioChange(e) {
				console.log(e)
				let that = this;
				that.adddefault = e.detail.value === "0" ? 1 : 0
				this.detail.default = +that.adddefault
			},
			/**
			 * 表单验证
			 */
			validation: function(values) {
				if (values.name === '') {
					this.error = '收件人不能为空';
					return false;
				}
				if (values.phone.length < 1) {
					this.error = '手机号不能为空';
					return false;
				}
				if (values.phone.length !== 11) {
					this.error = '手机号长度有误';
					return false;
				}
				let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
				if (!reg.test(values.phone)) {
					this.error = '手机号不符合要求';
					return false;
				}
				if (!values.lat || !values.lng) {
					this.error = '经纬度不能为空,请重新选择地址';
					return false;
				}
				if (!this.region) {
					this.error = '省市区不能空';
					return false;
				}
				if (values.detail === '') {
					this.error = '详细地址不能为空';
					return false;
				}
				return true;
			},

			/**
			 * 修改地区
			 */
			onConfirm(e) {
				let region = e.label.split("-");
				this.setData({
					region: [...region],
					code: e.cityCode.map(val => val += ""),
				})
			},

			/**
			 * 获取微信地址
			 */
			chooseAddress: function() {
				let _this = this;
				uni.chooseAddress({
					success: function(res) {
						_this.setData({
							'detail.name': res.userName,
							'detail.phone': res.telNumber,
							'detail.detail': res.detailInfo,
							region: [res.provinceName, res.cityName, res.countyName],
						});
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.all-content-box {
		padding: 20upx 30upx;
		border-radius: 6upx;
	}

	.profile-list .admin {
		padding-left: 15px;
		font-size: 30upx;
		color: #333;
	}

	.address-box {
		height: 80upx;
		line-height: 80upx;
	}

	.address-box .left-name {
		width: 85px;
		height: 80upx;
		line-height: 80upx;
	}

	.cont-top {
		border-top-left-radius: 10upx;
		border-top-right-radius: 10upx;
	}

	.cont-btm {
		border-bottom-left-radius: 10upx;
		border-bottom-right-radius: 10upx;
	}

	.address-cont-title .list {
		width: auto;
		margin: 0 42upx;
		padding: 10upx 0;
	}

	.tui-picker-detail text {
		padding: 0 10upx;
	}

	.infoText {
		line-height: 56upx;
		display: block;
	}

	.label-content {
		height: 80upx;
		line-height: 80upx;
		border-radius: 6upx;
		background-color: #FFFFFF;
		margin: 0 30upx;
		padding: 0 42upx;
	}

	picker-view {
		background-color: white;
		padding: 0;
		width: 100%;
		height: 480upx;
		bottom: 0;
		position: fixed;
	}

	picker-view-column view {
		vertical-align: middle;
		font-size: 28upx;
		line-height: 28upx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.animation-element-wrapper {
		display: flex;
		position: fixed;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		z-index: 21;
	}

	.animation-element {
		display: flex;
		position: fixed;
		width: 100%;
		height: 570upx;
		bottom: 0;
		background-color: rgba(255, 255, 255, 1);
	}

	.animation-button {
		margin-top: 20upx;
		top: 20upx;
		width: 400upx;
		height: 100upx;
		line-height: 100upx;
		align-items: center;
	}

	.address-text {
		color: #999;
		display: inline-flex;
		position: fixed;
		margin-top: 20upx;
		height: 50upx;
		text-align: center;
		line-height: 50upx;
		font-size: 30upx;
		font-family: Arial, Helvetica, sans-serif;
	}

	.left-bt {
		left: 30upx;
	}

	.right-bt {
		right: 30upx;
		color: #ec5151;
	}

	.line {
		display: block;
		position: fixed;
		height: 1upx;
		width: 100%;
		margin-top: 89upx;
		background-color: #eee;
	}

	.address-box .right-cont input {
		/* width: 100%; */
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
		color: #999999;
	}

	.bargain-commont-bg {
		background: rgba(0, 0, 0, 0.6);
		position: fixed;
		right: 0;
		left: 0;
		top: 0;
		bottom: 0;
		z-index: 20;
	}

	.radio-right {
		margin-right: 16upx;
	}

	.f-34 {
		font-size: 34upx;
	}

	.f-32 {
		font-size: 32upx;
	}

	.f-31 {
		font-size: 31upx;
	}

	.f-28 {
		font-size: 28upx;
	}

	.f-26 {
		font-size: 26upx;
	}

	.f-24 {
		font-size: 24upx;
	}

	.f-22 {
		font-size: 22upx;
	}

	.b-r {
		border-right: 1upx solid #eee;
	}

	.b-b {
		border-bottom: 1upx solid #eee;
	}

	.b-t {
		border-top: 1upx solid #eee;
	}

	.m-top4 {
		margin-top: 4upx;
	}

	.m-top10 {
		margin-top: 10upx;
	}

	.m-top20 {
		margin-top: 25upx;
	}

	.m-top35 {
		margin-top: 35upx;
	}

	/* #ifdef MP-ALIPAY */
	.address-cont-box .col-c {
		color: #CCCCCC;
	}

	/* #endif */

	radio .wx-radio-input {
		/* 自定义样式.... */
		height: 30upx;
		width: 30upx;
		margin-top: -4upx;
		border-radius: 50%;
		border: 2upx solid #999;
		background: transparent;
	}


	radio .wx-radio-input.wx-radio-input-checked {
		background-color: #FFD940 !important;
		border-color: #FFD940 !important;
		background-color: var(--theme-color) !important;
		border-color: var(--theme-color) !important;
	}

	radio .wx-radio-input.wx-radio-input-checked::before {
		border-radius: 50%;
		width: 20upx;
		height: 20upx;
		line-height: 20upx;
		text-align: center;
		font-size: 24upx;
		color: #000000;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	.save-btn button {
		height: 80upx;
		line-height: 80upx;
		background-color: #FFD940;
		border-radius: 40upx;
		color: #333333;
	}

	.get-addressBtn button {
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		color: #FFFFFF;
		background-color: #00BA19;
		border-radius: 40upx;
	}
</style>

<style lang="scss" scoped>
	.address-location {
		position: relative;
		display: flex;
		align-items: center;
		&::before {
			position: absolute;
			top: 50%;
			left: 0;
			display: block;
			content: "\20";
			width: 1px;
			height: 50rpx;
			background-color: #eee;
			transform: translateY(-50%);
		}
	}
	.address-location__icon {
		margin-left: 30rpx;
		margin-right: 10rpx;
	}
</style>
