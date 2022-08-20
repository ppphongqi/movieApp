<template>
	<view :style="themeColor">
		<view v-if="isPage">
			<!-- 注册页 -->
			<block v-if="data['status'] ===0 || data['status'] ===1">
				<!-- <view class="enter-bg main-bg-color" :style="{'background-image':getImageRoot('39.png','url')} " ></view> -->
				<view class="enter-bg main-bg-color dis-flex flex-x-center">
					<image :src="pageBannerPath" style="width: 690rpx; height: 200rpx;"></image> 
				</view>
				<view class="form-main m-left-right-30 p-r">
					<form @submit="formSubmit">
						<view class="form-content b-f bor-radius-10upx padding-all-box36">
							<view class="form-title dis-flex flex-x-between flex-y-center p-r m-btm30">
								<view class="f-28 col-3 form-title-left">请填写店铺信息</view>
								<view class="f-24 col-3 form-title-right" v-if="!!data['kf_wxid'] || !!data['kf_phone']" 
								@click="onshowShade('customer')">直接联系客服
								<text class="iconfont icon-right"></text>
								</view>
							</view>
							<view v-if="salesmanRes.salesman_id" class="from-bg-style merchant-name dis-flex flex-y-center m-btm20">
								<view class="merchant-name-left from-left f-24 col-3">业务员</view>
								<view class="merchant-name-right">
									<input class="from-input-style  f-24" :disabled="true" type="text" :value="salesmanRes.real_name"
										:adjust-position='false'  placeholder-class="from-inputPlader-style" />
								</view>
							</view>
							<view class="from-bg-style merchant-name dis-flex flex-y-center m-btm20">
								<view class="merchant-name-left from-left f-24 col-3">商家名称</view>
								<view class="merchant-name-right">
									<input class="from-input-style  f-24" type="text" :value="!!data['data']?data['data']['merchantName']:''"
									 placeholder="请输入商家名称" name="merchantName"  :adjust-position='false'  placeholder-class="from-inputPlader-style" :disabled="formdisabled" />
								</view>
							</view>
							<view class="from-bg-style merchant-user-name dis-flex flex-y-center m-btm20">
								<view class="merchant-user-name-left from-left f-24 col-3">商家姓名</view>
								<view class="merchant-user-name-right flex-box">
									<input class="from-input-style  f-24" type="text" :value="!!data['data']?data['data']['userName']:''"
									 placeholder="请输入真实姓名" name="userName" :adjust-position='false' placeholder-class="from-inputPlader-style" :disabled="formdisabled" />
								</view>
							</view>
							<view class="from-bg-style merchant-mobile dis-flex flex-y-center m-btm20">
								<view class="merchant-mobile-left from-left f-24 col-3">手机号码</view>
								<view class="merchant-mobile-right flex-box">
									<input class="from-input-style f-24" type="number" :value="!!data['data']['merchantMobile']?data['data']['merchantMobile']:getStorageMobile"
									 placeholder="请输入手机号码" name="merchantMobile" :adjust-position='false' maxlength="11" placeholder-class="from-inputPlader-style"
									 :disabled="formdisabled" />
								</view>
							</view>
							<block v-if="data['businessForm']['region'] === '1'">
								<view class="from-bg-style merchant-address dis-flex flex-y-center m-btm20 p-r" @click="showpicker">
									<view class="merchant-address-left from-left f-24 col-3">所在地区</view>
									<view class="merchant-address-right dis-flex flex-y-center">
										<block v-if="!!data['data'] && !!data['data']['region'] && data['status'] ===1">
											<view class="address-cont-box f-24">{{data['data']['region']}}</view>
										</block>
										<block v-else>
											<view class="address-cont-box">
												<view v-if="!!region" class="f-24">{{region[0]}}{{region[1]}}{{region[2]}}</view>
												<view v-else class="f-24 col-c">选择省、市、区</view>
											</view>
											<view class="iconfont icon-right address-icon" :class="!!region?'col-3':'col-c'"></view>
										</block>
									</view>
								</view>
							</block>
							<block v-if="data['businessForm']['address'] ==='1'">
								<view class="from-bg-style merchant-address dis-flex flex-y-center">
									<view class="merchant-xx-address-left from-left f-24 col-3">详细地址</view>
									<view class="merchant-xx-address-right flex-box">
										<input :adjust-position='false' class="from-input-style  f-24" type="text" :value="!!data['data'] && data['businessForm']['address'] ==='1'?data['data']['detailadress']:''"
										 placeholder="请输入详细地址" name="detailadress" placeholder-style="color:#cccccc" :disabled="formdisabled" />
									</view>
								</view>
							</block>
							<block v-if="data['businessForm']['quaimg'] ==='1'">
								<view class="store-uploading m-btm40">
									<view class="from-bg-style">
										<view class="from-left   uploading-title f-24 col-3 m-top-btm20 ">商家资质</view>
									</view>
									
									<view class="uploading-imgaes m-top20">
										<view class="up-images-list dis-flex flex-warp">
											<block v-if="!!data['data']&&data['data']['merchantImage']&&data['data']['merchantImage']['length']>0 && data['status'] ===1">
												<block v-for="(item,key) in data['data']['merchantImage']" :key="key">
													<view class="imglist-items">
														<image :src="item" class="items-img"></image>
													</view>
												</block>
											</block>
											<block v-else>
												<block v-for="(item,index) in chooseImgArr" :key="index">
													<view class="imglist-items" v-if="index<9">
														<image :src="item" class="items-img"></image>
														<view class="close iconfont icon-close t-c" @click="clearimg(key)" v-if="!formdisabled"></view>
													</view>
												</block>
												<view class="imglist-items add-images" v-if="chooseImgArr.length !== 9 && data['status'] ===0" @click="addimg"></view>
											</block>
										</view>
									</view>
								</view>
							</block>
							
							
							<!-- 商家服务协议 -->
							<block v-if="!!data['agreement']">
								<parse :html="data['agreement']" parse-only="byKnow"></parse>
								<view class="select-box dis-flex">
									<view class="check dis-flex" @click="handleCheckClick">
										<!-- <view v-if="is_check" class="iconfont icon-check"></view> -->
										<view v-if="!is_check" class="iconfont icon-round"></view>
										<view v-else class="iconfont icon-roundcheck"></view>
									</view>
									<view class="agreement-text">我已阅读并同意《商家入驻相关条款》</view>
								</view>
							</block>
							
							
							<view class="formBtn">
								<button formType="submit" :disabled="formdisabled" class="f-28 col-3 main-bg-color auxiliary-color">{{formdisabled?'提交审核中...':'立即申请'}}</button>
							</view>
						</view>
					</form>
				</view>
			</block>
			<!-- 状态页 -->
			<block v-if="data['status'] ===2 || data['status'] ===3">
				<view class="applyStatus">
					<image :src="data['status'] ===2?applyStatusImage['stutas_1']:applyStatusImage['stutas_2']" mode="" class="applyStatus-logo"></image>
					<view class="applyStatus-detail t-c">
						<view class="f-36 col-3 m-btm20">{{data['status'] ===2?applyStatusText['stutas_1']['title']:applyStatusText['stutas_2']['title']}}</view>
						<view class="f-24 col-9">{{data['status'] ===2?applyStatusText['stutas_1']['text']:applyStatusText['stutas_2']['text']}}</view>
					</view>
					<view class="applyStatusBtn t-c col-3 f-30 main-bg-color auxiliary-color" @click="applySkip(data['status'])">{{data['status'] ===2?applyStatusbtn['stutas_1']:applyStatusbtn['stutas_2']}}</view>
				</view>
			</block>
			<popup-view :show="shadeContact" type="center" @clickmask="showContact = false">
				<block v-if="popupType === 'customer'">
					<view class="shade-box">
						<view class="invite-bg m-btm40" :style="{'background-image':getImageRoot('45.png','url')}">
							<view class="invite-textbox p-r">
								<view class="invite-title f-44 col-3 t-c m-btm40">商家申请入驻</view>
								<view class="invite-text col-3 f-24 m-btm40">如果你是本地的商户，想入驻本地平台，您可以拨打下方电话或者添加微信咨询</view>
								<view class="commun-detail">
									<block v-if="!!data['kf_phone']">
										<view class="commun-bg-style bor-radius-10upx b-f commun-bg-style-top dis-flex flex-y-center flex-x-between p-left-right-30">
											<view class="commun-left dis-flex flex-y-center">
												<image src="/static/images/merchant/mobile.png" mode="" class="commun-mobile"></image>
												<view class="col-3 f-24">{{data['kf_phone']}}</view>
											</view>
											<view class="commun-right commun-right-mobile f-24 col-3 t-c main-bg-color auxiliary-color" @click="commun('mobile',data['kf_phone'])">拨号</view>
										</view>
									</block>
									<block v-if="!!data['kf_wxid']">
										<view class="commun-bg-style bor-radius-10upx b-f dis-flex flex-y-center flex-x-between p-left-right-30">
											<view class="commun-left dis-flex">
												<image src="/static/images/merchant/wx.png" mode="" class="commun-weixin"></image>
												<view class="col-3 f-24">{{data['kf_wxid']}}</view>
											</view>
											<view class="commun-right commun-right-copy f-24 col-f t-c" @click="commun('wx',data['kf_wxid'])">复制</view>
										</view>
									</block>
								</view>
							</view>.
						</view>
						<view class="shade-close t-c">
							<text class="iconfont icon-roundclose shade-close-icon" @click="commun('close')"></text>
						</view>
					</view>
				</block>
				<block v-else>
					<view class="success-tips t-c">
						<image :src="getImageRoot('66.png')" class="success-icon"></image>
						<view class="f-32 col-3 m-top12">提交成功</view>
						<view class="f-24 col-9 m-top20">审核结果将以模板消息方式通知您!</view>
						<view class="success-btns dis-flex flex-y-center" @click="successTips">
							<view class="success-btn">取消</view>
							<view class="success-btn confirm">确定</view>
						</view>
					</view>
				</block>
			</popup-view>
			<view class="footer-bottom"></view>
		</view>
		<page-loading ref="loading"></page-loading>
		<DiyTab></DiyTab>
		<shortcut></shortcut>
		<CityPicker :themeColor="themeColor1" :pickerValueDefault="pickerDefault" ref="mpvueCityPicker" @onConfirm="onConfirm"></CityPicker>
	</view>
</template>
<script>
	import App from "@/common/js/app.js";
	import CityPicker from "@/components/threeComponents/mpvueCityPicker.vue"
	import PopupView from "@/components/template/PopManager.vue"
	import DiyTab from "@/components/template/TabBar.vue"
	import shortcut from "@/components/template/ShortCut.vue"
	import Parse from "@/components/threeComponents/jyf-Parser/index"
	import pageShare from "@/common/js/pageShareMixin.js"
	export default {
		mixins: [pageShare],
		data() {
			return {
				options: {},
				data: null,
				isPage: false,
				region: null,
				code: null,
				is_check: true, // 是否同意协议
				pageBannerPath: '', //页面banner路径
				pickerDefault: ["110000000", "110100000", "110101000"], //省市区默认值
				old_imgsData: [],
				chooseImgArr: [],
				localIds: [],
				themeColor1: '#007AFF', //颜色
				formdisabled: true,
				shadeContact: false, //弹框
				applyStatusImage: {
					stutas_1: App.siteInfo.siteroot + 'assets/store/img/default/we/40.png',
					stutas_2: App.siteInfo.siteroot + 'assets/store/img/default/we/41.png'
				},
				applyStatusText: {
					stutas_1: {
						title: '恭喜您，入驻成功',
						text: '您可以在手机端管理您的店铺'
					},
					stutas_2: {
						title: '很抱歉，申请未通过',
						text: '您没有资格入驻商铺，请联系商家'
					}
				},
				applyStatusbtn: {
					stutas_1: '管理店铺',
					stutas_2: '修改申请信息'
				},
				popupType: "customer", //弹窗显示类型 customer-联系客服
				// 当前业务员的接口数据
				salesmanRes: {}
			};
		},
		components: {
			Parse,
			CityPicker,
			PopupView,
			DiyTab,
			shortcut
		},
		computed: {
			// 获取用户绑定的手机号
			getStorageMobile() {
				let userInfo = uni.getStorageSync('userInfo')
				return userInfo.mobile ? userInfo.mobile : ''
			}
		},
		onShow(){
			App.customDefaultShare(this.globalSaveRefereeId,`${App.siteInfo.siteroot}h5/#/pages/subPages/merchant/enter/enter`)
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.options = options
			if (options.scene) {
				const queryData = this.$util.scene_decode(options.scene) || {}
				this.options = {
					salesman_id: queryData.a,
					cid: queryData.c,
					...this.options
				}
			}
			this.pageBannerPath = this.$util.deepGet(this.$store.getters.getappSetting,'share.business_banner')
	
			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline']
			})
			//#endif
			let inAudit = this.settingData.inAudit;
			if(inAudit==1){
				//#ifdef MP-WEIXIN
				uni.navigateTo({
					url:"/pages/mainPages/index/index"
				})
				//#endif
				// #ifdef H5
				this.getEnterDetail();
				// #endif
			}else{
				this.getEnterDetail();
			};
	
		},
		// copy main.js里面onShareAppMessage
		onShareTimeline() {
			let clientType = AppFunction.getClientType(),
				{
					share_title,
					share_describe,
					app_share_image,
					wechat_share_image
				} = this.settingData.share;
				console.log('share_describe-enter 1111',share_describe)
			if (clientType === "4") {
				return {}
			} else {
				return {
					title: share_title || "",
					imageUrl: app_share_image ? app_share_image[0].file_path : ""
				}
			}
		},
		methods: {
			getEnterDetail(enterType = "0") {
				let _this = this,
					enterData = {
						enterType,
						user_id: App.getUserId()
					};
				App._post_form('Live/getBusinessSetting', enterData, res => {
					console.log("————商家入驻————");
					console.log("res", res.data);
					console.log();
					_this.setData(res);
					let {
						status,
						reason,
						data: {
							merchantImage,
							region,
							code,
							image
						},
						businessForm,
						province: provinceValue = {
							id: "110000000",
							value: "北京市"
						},
						city: cityValue = {
							id: "110100000",
							value: "北京市"
						},
						region: regionValue = {
							id: "110101000",
							value: "东城区"
						},
						share: shareSetting
					} = res.data,
						pickerDefault = [provinceValue, cityValue, regionValue];
					//自定义分享文案
					_this.shareData = _this.getPageShareData("merchant/enter", shareSetting);
					if (status === 0) {
						_this.formdisabled = false;
						_this.is_check = false
					}
	
					if (enterType === "0") {
						if (!!reason) {
							_this.applyStatusText.stutas_2.text = reason;
						}
						if (businessForm.region === '1') {
							_this.region = pickerDefault.map(val => val.value);
							_this.code = pickerDefault.map(val => val.id);
							_this.pickerDefault = pickerDefault.map(val => val.id);
						}
					}

					if (enterType === "1") {
						if (merchantImage && merchantImage.length > 0 && businessForm.quaimg === '1') {
							_this.chooseImgArr = merchantImage;
						}
						if (businessForm.region === '1') {
							if (!!region) {
								_this.region = region.split(",");
								_this.code = code.split(",");
							} else {
								_this.region = pickerDefault.map(val => val.value);
								_this.code = pickerDefault.map(val => val.id);
								_this.pickerDefault = pickerDefault.map(val => val.id);
							}
						}

						if (!!image && businessForm.quaimg === '1') {
							_this.old_imgsData = image.split(',');
						}
					}
					_this.isPage = true;
					App.hideLoading()
					if(this.options.salesman_id || res.data.data && res.data.data.salesman_id) {
						this.fetchSalesmanRes({
							salesman_id: this.options.salesman_id || res.data.data.salesman_id
						})
					}
				})
			},
			/**
			 * 表单提交
			 */
			formSubmit(e) {
				console.log(this.data,'data=================')
				let _this = this,
					chooseImgArr = _this.chooseImgArr,
					values = e.detail.value;
				if (_this.code !== 1) {
					values.region = _this.code.join(",")
				}
				if (!!_this.data.data) {
					values.id = _this.data.data.id;
				}
				// 记录formId
				App.saveFormId();

				// 表单验证
				if (!_this.validation(values)) {
					App.showError(_this.error);
					return false;
				}

				//过滤已上传的图片
				if (chooseImgArr.length > 0) {
					chooseImgArr = chooseImgArr.filter(val => val.indexOf("https") === -1);
				}
	
				// 是否同意商家协议
				if(!_this.is_check && !!_this.data['agreement']) {
					uni.showModal({
						title: '友情提示',
						content: '请同意商家入驻相关条款',
						showCancel: false
					})
					return false
				}

				App.showError('是否提交信息', (res) => {
					if (res.confirm) {
						_this.formdisabled = true;

						let isUpLoad = _this.appClientType === "4" ? _this.localIds.length > 0 : chooseImgArr.length > 0;
						uni.showLoading({
							title: "提交中..."
						})
						if (isUpLoad) {
							let merchantImage = [],
								upLoadList = _this.appClientType === "4" ? _this.localIds : chooseImgArr;
							// upLoadArray = _this.appClientType === "4" ? _this.localIds.map(val => App._upLoad(val)) : _this[
							// 	'chooseImgArr'].map(val => {
							// 	if (val.indexOf("https") === -1) {
							// 		return App._upLoad(val)
							// 	}
							// });
	
							App._upLoadAll(upLoadList).then(options => {
								let imgsid = options.map(val => {
									if (!!val) {
										return val.file_id
									}
								});
								let newimgsid = imgsid.filter(val => val);
								merchantImage.push(...newimgsid);
								if (_this.old_imgsData.length > 0) {
									merchantImage = _this.old_imgsData.concat(...merchantImage)
								}
								Object.assign(values, {
									merchantImage
								})
								_this.formDataUrl(values)
							})
							// return
							// Promise.all(upLoadArray).then(options => {

							// });
						} else {
							if (_this.old_imgsData.length > 0) {
								Object.assign(values, {
									merchantImage: _this.old_imgsData
								})
							}
							_this.formDataUrl(values)
						}
					}
				}, true)

			},
			/**
			 *  提交接口
			 */
			formDataUrl(values) {
				let _this = this;
				console.log("submitValues", values);
				// 提交到后端
				App._post_form('Live/addBusinessLive', {
					...values,
					user_id: App.getUserId(),
					salesman_id: this.salesmanRes.salesman_id,
					cid: this.options.cid
				}, function(result) {
					// alert(JSON.stringify(values));
					if (result.code === 1) {
						_this.onshowShade("success");
					}
				}, false, () => {
					uni.hideLoading();
					_this.formdisabled = false;
				});
			},
			/**
			 * 表单验证
			 */
			validation(values) {
				if (values.merchantName === '') {
					this.error = '商家名称不能为空';
					return false;
				}
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
				if (this.data['businessForm']['region'] === '1') {
					if (!this.region) {
						this.error = '省市区不能空';
						return false;
					}
				}
				if (this.data['businessForm']['address'] === '1') {
					if (values.detailadress === '') {
						this.error = '详细地址不能为空';
						return false;
					}
				}
	
				return true;
			},
			/**
			 * 添加照片
			 */
			addimg() {
				let _this = this;
				App.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						let tempFilePaths = res.tempFilePaths,
							chooseImgNum = tempFilePaths.length;
						if (_this.chooseImgArr.length < 9) {
							if (_this.chooseImgArr.length + chooseImgNum > 9) {
								_this.localIds.push(...res.localIds.splice(0, 9 - chooseImgNum));
								if (_this.appClientType === "4") {
									_this.chooseImgArr.push(...tempFilePaths.splice(0, 9 - chooseImgNum));
								}
							} else {
								chooseImgNum > 0 && _this.chooseImgArr.push(...tempFilePaths);
								if (_this.appClientType === "4") {
									chooseImgNum > 0 && _this.localIds.push(...res.localIds);
								}
							}
						} else {
							App.showError('最多上传九张图')
						}
						console.log(_this.localIds);
					}
				});
			},
			clearimg(key) {
				let _this = this,
					imgsData = _this.chooseImgArr,
					old_imgsData = _this.old_imgsData;
				if (old_imgsData.length > 0) {
					old_imgsData.splice(key, 1);
					_this.old_imgsData = old_imgsData;
				}
				imgsData.splice(key, 1);
				_this.chooseImgArr = imgsData;
			},
			applySkip(type) {
				let _this = this;
				switch (type) {
					case 2:
						App.navigationTo({
							url: 'pages/subPages/business/index'
						});
						break;
					case 3:
						_this.getEnterDetail("1");
						break;
				}
			},
			commun(type, val) {
				let _this = this;
				switch (type) {
					case 'mobile':
						uni.makePhoneCall({
							phoneNumber: val //仅为示例
						});
						break;
					case 'wx':
						App.copyTextHandle(val);
						break;
					case 'close':
						_this.shadeContact = false;
						break;
				}
			},
			showpicker() {
				if (this.data['status'] === 1 || this.formdisabled) return
				this.$refs.mpvueCityPicker.show();
			},
			/**
			 * 修改地区
			 */
			onConfirm(e) {
				let region = e.label.split("-");
				this.region = [...region];
				this.code = e.cityCode.map(val => val += "");
			},
			onshowShade(type = "customer") {
				this.popupType = type;
				this.shadeContact = true;
			},
			successTips() {
				let {
					submit: {
						type,
						value
					}
				} = this.data,
					links = {
						"1": "pages/mainPages/index/index",
						"2": "pages/subPages/user/index",
						"3": value
					};
				this.shadeContact = false;
				App.navigationTo({
					url: links[type]
				})
			},
			handleCheckClick() {
				if(!this.formdisabled) {
					this.is_check = !this.is_check
				}
			},
			// 请求申请详情的接口数据
			async fetchSalesmanRes({salesman_id=this.options.salesman_id}={}) {
				try {
					if(!salesman_id) return
					const res = await App._getP('salesman.Salesman/salesman',{
						salesman_id: salesman_id
					})
					this.salesmanRes = this.$util.deepGet(res, 'data', {})
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			}
	
		}
	}
</script>

<style>
	@import "enter.scss";
</style>
