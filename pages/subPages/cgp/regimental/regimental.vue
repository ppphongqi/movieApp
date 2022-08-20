<template>
	<view :style="themeColor">
		<!-- 注册页 -->
		<!-- <view class="enter-bg" :style="{'background-image':getImageRoot('39.png','url')}"></view> -->
		<image class="header-img" :style="{'background-image':getImageRoot('69.png','url')}"></image>
		<view class="form-main m-left-right-30 p-r">
			<view class="detail-news">
				<view class="detail-news-title t-c f-30">
					<span>申请团长</span>
				</view>
			</view>
			<view class=" b-f bor-radius-10upx">
				<view class="top-title ">
					<view class="top-title-s f-28 dis-il-block t-c m-top20">
						请您填写你的申请信息
					</view>
				</view>
				<form @submit="formSubmit" :disabled="disabled">
					<view class="form-content b-f padding-all-box36">
						<view class="from-bg-style merchant-user-name dis-flex flex-y-center m-btm20 ">
							<view class="merchant-user-name-left from-left f-24 col-3">姓名</view>
							<view class="merchant-user-name-right from-bg-style__right">
								<input class="from-input-style  f-24" type="text" :value="data.user_name" placeholder="请输入真实姓名" name="userName"
								 placeholder-class="from-inputPlader-style" :disabled="disabled" />
							</view>
						</view>
						<view class="from-bg-style merchant-mobile dis-flex flex-y-center m-btm20">
							<view class="merchant-mobile-left from-left f-24 col-3">手机号码</view>
							<view class="merchant-mobile-right from-bg-style__right">
								<input class="from-input-style f-24" type="number" :value="data.phone" placeholder="请输入手机号码" name="merchantMobile"
								 maxlength="11" placeholder-class="from-inputPlader-style" :disabled="disabled" />
							</view>
						</view>
						<block>
							<view class="from-bg-style merchant-address dis-flex flex-y-center m-btm20 p-r" @click="showpicker">
								<view class="merchant-address-left from-left f-24 col-3">所在地区</view>
								<view class="merchant-address-right dis-flex flex-y-center">
									<view class="address-cont-box">
										<view v-if="!!region" class="f-24">{{region[0]}}{{region[1]}}{{region[2]}}</view>
										<view v-else class="f-24 col-9">{{disabled ? data.address.detail :" 选择省、市、区"}}</view>
										<!-- {{data.province_id}}{{data.city_id}}{{data.region_id}} -->
										<!-- province_id: this.code[0],
										city_id: this.code[1],
										region_id: this.code[2]
										 选择省、市、区-->
									</view>
									<view class="iconfont icon-right address-icon" :class="!!region?'col-3':'col-c'"></view>
								</view>
							</view>
						</block>
						<block>
							<view class="from-bg-style merchant-address dis-flex flex-y-center m-btm20 ">
								<view class="address-left from-left f-24 col-3">详细地址</view>
								<view class="address-right from-bg-style__right">
									<input class="from-input-style  f-24" type="text" 
									:value="data.detail" placeholder="如街道、门牌号、小区、楼栋号" name="detailadress"
									 placeholder-style="color:#cccccc" :disabled="disabled" />
								</view>
							</view>
						</block>
						<view class="from-bg-style merchant-user-name dis-flex flex-y-center m-btm20 ">
							<view class="merchant-user-name-left from-left f-24 col-3">小区</view>
							<view class="merchant-user-name-right from-bg-style__right">
								<input class="from-input-style  f-24" type="text" name="neighbourhood"
								 placeholder="请输入小区名" placeholder-class="from-inputPlader-style" :value="data.community"
								 :disabled="disabled" />
							</view>
						</view>
						<view class="formBtn m-top-btm30 form-btn ">
							<button formType="submit" :disabled="disabled" class="f-28 col-3 ">{{status}}</button>
						</view>
					</view>
				</form>
			</view>
			
			<view>
				<block v-if="equity.is_equity==1">
					<view class="m-top-btm30 b-f equity bor-radius-10rpx">
						<view class="top-title b-f">
							<view class="top-title-s f-28 dis-il-block t-c m-top20">
								团长权益
							</view>
						</view>
						<view class="dealer-rights module-content dis-flex flex-dir-column flex-x-center flex-y-center">
							<view class="rights-content">
								<parse :html="equity.equity"></parse>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view></view>
				</block>
			</view>
		</view>

		<CityPicker :themeColor="themeColor1" :pickerValueDefault="pickerDefault" ref="mpvueCityPicker" @onConfirm="onConfirm"></CityPicker>
	</view>
</template>
<script>
	import App from "@/common/js/app.js";
	import Parse from "@/components/threeComponents/jyf-Parser/index"
	import CityPicker from "@/components/threeComponents/mpvueCityPicker.vue"
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	export default {
		mixins: [pageShareMixin],
		data() {
			return {
				formdisabled: false,
				isPage: false,
				data: null,
				region: null,
				code: null,
				themeColor1: '#007AFF', //颜色
				pickerDefault: ["110000000", "110100000", "110101000"], //省市区默认值
				disabled: false,
				status: "",
				reason: "",
				equity:"",
			};

		},
		components: {
			CityPicker,
			Parse
		},
		computed: {

		},
		watch: {
			settingData: {
				handler(val) {
					console.log('哈哈哈哈哈哈哈哈',val)
					this.shareData = this.pageShareMixin_createShareData({
						title: this.$util.deepGet(val, 'cgp.share_title'),
						desc: this.$util.deepGet(val, 'cgp.share_text', ''),
						imgUrl: this.$util.deepGet(val, 'cgp.share_image', '')
					})
				},
				immediate: true
			}
		},
		onLoad(options) {
			// this.getapply();
			this.postStates()
			this.interests()
		},
		methods: {
			/**
			 * 表单提交
			 */
			formSubmit(e) {
				let _this = this
				let values = e.detail.value;
				if (!_this.validation(values)) {
					App.showError(_this.error);
					return false;
				}
				App._post_form("cgp.RegApply/apply", {
					user_name: values.userName,
					phone: values.merchantMobile,
					detail: values.detailadress,
					community: values.neighbourhood,
					province_id: this.code[0],
					city_id: this.code[1],
					region_id: this.code[2]
				}, res => {
					App.showSuccess('提交成功');
				}, fals =>{
				}, res => {
					_this.postStates()
				})
				console.log("values+++++++++++++", values)
				if (!!_this.data.data) {
					values.id = _this.data.data.id;
				}
	
			},
			// 团长审核状态
			postStates(){
				let _this = this
				App._post_form("cgp.Regapply/applyStatus", {}, rel => {
					_this.data=rel.data || {}
					const address = _this.data.address || {}
					_this.pickerDefault =[_this.data.province_id,_this.data.city_id,_this.data.region_id]
					if(_this.data.province_id && _this.data.city_id && _this.data.region_id) {
						_this.code =  [_this.data.province_id,_this.data.city_id,_this.data.region_id]
					}
					if(address.province&&address.city&&address.region) {
						_this.region =  [address.province,address.city,address.region]
					}
					if (rel.code === 1) {
						_this.status = rel.data.status;
						_this.reason = rel.data.reason;
						if (_this.status === 1) {
							_this.status = "审核通过"
							if(_this.status){
								uni.showModal({
									title: "提示",
									content:"审核通过",
									showCancel: false,
									success:function(res){
										if(res.confirm){
											uni.navigateTo({
											    url: '/pages/subPages/cgp/center/center'
											});
										}
									}
								});
							}
						}
						if (_this.status == 2) {
							_this.status = "立即提交"
						}
						if (_this.status == 3) {
							_this.status = "审核中..."
							_this.disabled =true;
	
						}
						if(_this.status == 4){
							_this.status = "立即提交"
						}
						if(!!_this.reason){
							uni.showModal({
								title: "申请被驳回",
								content: "驳回原因:" + rel.data.reason,
								showCancel: false
							});
						}
					}
	
				})
			},
	
			interests(){
				let _this = this;
				App._post_form("cgp.reg/equity",{},res =>{
					_this.equity = res.data;
				})
			},
			/**
			 * 表单验证
			 */
			validation(values) {
				if (values.userName === '') {
					this.error = '姓名不能为空';
					return false;
				}
				if (values.merchantMobile.length < 1) {
					this.error = '手机号不能为空';
					return false;
				}
				if (values.merchantMobile.length !== 11) {
					this.error = '手机号长度有误';
					return false;
				}
				let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
				if (!reg.test(values.merchantMobile)) {
					this.error = '手机号不符合要求';
					return false;
				}
				if (values.detailadress === '') {
					this.error = '详细地址不能为空';
					return false;
				}
				if (values.neighbourhood === '') {
					this.error = '小区不能为空';
					return false;
				}
				return true;
			},

			showpicker() {
				!this.disabled &&this.$refs.mpvueCityPicker.show();
			},
			/**
			 * 修改地区
			 */
			onConfirm(e) {
				console.log('onConfirm',e)
				let region = e.label.split("-");
				this.region = [...region];
				this.code = e.cityCode.map(val => val += "");
			},
		},
	}
</script>

<style lang="scss">
	@import "regimental.css";
	
	.diy-navigator {
		position: fixed;
		left: 0;
		right: 0;
		padding: 0 20rpx;
		height: 88rpx;
		z-index: 100;
	}
	.detail-news-title {
		font-size: 16px;
		font-weight: normal;
		text-align: center;
		padding-top: 10px;
		position: relative;
		margin-bottom: 110rpx;
	}

	.detail-news-title::before {
		content: "";
		display: block;
		width: 360rpx;
		height: 1rpx;
		background: #FFFFFF;
		position: absolute;
		left: 50%;
		margin-left: -180rpx;
		top: 44rpx;
	}
	.detail-news-title span {
		padding: 0 10px;
		position: relative;
		background: #111622;
		color: #FFFFFF;
		z-index: 2;
		font-weight: bold;
	}

	.header-img {
		width: 100%;
		height: 300rpx;
	}

	.top-title {
		text-align: center;
	}

	.top-title-s {
		border: 2rpx solid #333333;
		font-weight: bold;
		padding: 10rpx 20rpx 10rpx 20rpx;
	}

	.equity {
		padding: 30rpx;
	}
	.form-btn button{
		background-color: var(--theme-color);
		color: var(--auxiliary-color);
		
	}
	.from-bg-style__right {
		min-width: 0;
		flex: 1;
	}
	.from-input-style {
		width: 100%;
	}
</style>
