<template>
	<view class="container" :style="themeColor">
		<form @submit="formSubmit">
			<view class="edit-container b-f">
				<image class="edit-avatar" :src="clerkDetail.avatarUrl?clerkDetail.avatarUrl:avatarUrl"></image>
				<view class="edit-form">
					<view class="form-title col-3">店员信息</view>
					<view class="form-item dis-flex flex-y-center">
						<view class="form-label f-26 t-r col-3">姓名</view>
						<view class="form-input-box flex-box">
							<input type="text" class="f-28 form-input" name="name" v-model="clerkDetail.name" placeholder="请填写店员姓名"
							 placeholder-class="col-9" />
						</view>
					</view>
					<view class="form-item dis-flex flex-y-center">
						<view class="form-label f-26 t-r col-3">电话</view>
						<view class="form-input-box flex-box">
							<input type="number" class="f-28 form-input" name="mobile" v-model="clerkDetail.mobile" maxlength="11"
							 placeholder="请填写店员电话" placeholder-class="col-9" />
						</view>
					</view>
					<view class="form-item dis-flex flex-y-center">
						<view class="form-label f-26 t-r col-3">身份</view>
						<view class="form-input-box flex-box">
							<picker mode="selector" :range="typeList" range-key="name" name="type" :value="typeIndex" @change="typeIndex = $event.detail.value * 1">
								<view class="f-28 form-input dis-flex flex-y-center flex-x-between" :class="[typeIndex === null?'col-9':'col-3']">
									{{typeIndex === null?"请选择店员身份":typeList[typeIndex].name}}
									<view class="iconfont icon-jinrujiantou1" v-if="typeIndex === -1"></view>
								</view>
							</picker>
						</view>
					</view>
					<view class="form-item dis-flex flex-y-center" v-if="typeIndex === 0">
						<view class="form-label f-26 t-r col-3">门店</view>
						<view class="form-input-box flex-box">
							<picker mode="selector" :range="storeList" range-key="name" name="store_id" :value="storeIndex" @change="storeIndex =  $event.detail.value * 1">
								<view class="f-28 form-input dis-flex flex-y-center flex-x-between" :class="[storeIndex === null?'col-9':'col-3']">
									{{storeIndex === -1?'请选择所在门店':storeList[storeIndex].name}}
									<view class="iconfont icon-jinrujiantou1" v-if="storeIndex === -1"></view>
								</view>
							</picker>
						</view>
					</view>
					<view class="form-item dis-flex flex-y-center" v-if="typeIndex === 0">
						<view class="form-label f-26 t-r col-3">密码</view>
						<view class="form-input-box flex-box">
							<input type="number" :password="true" class="f-28 form-input" name="password" :value="clerkDetail.password"
							 @input="passwordChange" maxlength="4" placeholder="请填写店员核销密码" placeholder-class="col-9" />
						</view>
					</view>
					<view class="form-title col-3 m-top30">权限设置</view>
					<view class="form-item dis-flex flex-y-center flex-x-between">
						<view class="form-label f-26 t-r col-3">订单核销</view>
						<view class="form-input-box">
							<switch :color="topColor" @change="clerkDetail.power.hxorder = $event.detail.value?1:0" :checked="clerkDetail.power.hxorder" />
						</view>
					</view>
					<view class="form-item dis-flex flex-y-center flex-x-between">
						<view class="form-label f-26 t-r col-3">查看交易数据</view>
						<view class="form-input-box">
							<switch :color="topColor" @change="clerkDetail.power.seedata = $event.detail.value?1:0" :checked="clerkDetail.power.seedata" />
						</view>
					</view>
					<view class="form-item dis-flex flex-y-center flex-x-between" v-if="typeIndex === 1">
						<view class="form-label f-26 t-r col-3">店员管理</view>
						<view class="form-input-box">
							<switch :color="topColor" @change="clerkDetail.power.addsal = $event.detail.value?1:0" :checked="clerkDetail.power.addsal" />
						</view>
					</view>
					<view class="form-item dis-flex flex-y-center flex-x-between">
						<view class="form-label f-26 t-r col-3">状态</view>
						<view class="form-input-box">
							<switch :color="topColor" name="status" :checked="clerkDetail.status" />
						</view>
					</view>
				</view>
			</view>
			<view class="form-btn-box dis-flex flex-y-center flex-x-center">
				<button class="form-btn btn-delete" v-if="!!mployee_id" @click="mployeeDetele(mployee_id)">删除</button>
				<button class="form-btn main-bg-color auxiliary-color" form-type="submit">保存</button>
			</view>
		</form>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import formChecker from "@/common/js/formChecker.js"
	export default {
		data() {
			return {
				options: {},
				mployee_id: "", //店员id
				code: "", //新增店员code
				avatarUrl: "", //新增店员头像
				clerkDetail: {
					status: 1, //店员启用状态
					power: { //店员权限
						hxorder: 1, //核销
						seedata: 1, //查看数据
						addsal: 0, //管理店员
					}
				},
				typeIndex: null, //身份index
				typeList: [{
						value: 0,
						name: "店员"
					},
					{
						value: 1,
						name: "管理员"
					}
				],
				storeIndex: -1,
				storeList: [],
				bus_id: "", //商家id
				isEditPassword: false, //是否修改过密码
			};
		},
		components: {

		},
		computed: {

		},
		onLoad(options) {
			this.mployee_id = options.mployee_id;
			this.code = options.code;
			this.avatarUrl = options.avatarUrl;
			this.getStoreList(options);
		},
		methods: {
			/**
			 * 获取门店列表
			 */
			getStoreList(options) {
				this.options = options
				let _this = this;
				App._get("merchant.index/index", {bus_id:options.bus_id,bus_new:1}, res => {
					_this.storeList = res.data.storeList;
					_this.bus_id = res.data.bus_id;
					_this.storeIndex = 0
					if (options.mployee_id) {
						_this.getClerkDetail(options.mployee_id);
					} else {
						App.hideLoading();
					}
				})
			},
			/**
			 * 获取店员详情
			 * @param {Object} id 店员id
			 */
			getClerkDetail(id) {
				let _this = this;
				App._get("merchant.index/saleclerkDetail", {
					id,
					bus_id: this.options.bus_id
				}, result => {
					console.log(result);
					let data = result.data,
						power = {
							hxorder: 0, //核销
							seedata: 0, //查看数据
							addsal: 0, //管理店员
						};
					data.power = JSON.parse(data.power);
					if (data.power && data.power.length > 0) {
						data.power.map(val => {
							power[val] = 1;
						})
						data.power = power;
					}
					_this.clerkDetail = data;
					_this.typeIndex = data.type;
					_this.storeIndex = _this.storeList.findIndex(val => val.id === data.store_id);
					console.log(this.storeIndex, this.typeIndex);
					App.hideLoading();
				});
			},
			/**
			 * 删除店员
			 */
			mployeeDetele(mployee_id) {
				if (!!mployee_id) {
					uni.showModal({
						title: "确认操作",
						content: "确认删除该店员吗?",
						success(options) {
							if (options.confirm) {
								App._get("merchant.index/delete", {
									id: mployee_id
								}, result => {
									if (result.code) {
										App.showSuccess("删除成功", () => {
											uni.navigateBack();
										})
									}
								})
							}
						}
					})
				}
			},
			/**
			 * 密码修改
			 */
			passwordChange() {
				this.isEditPassword = true;
			},
			/**
			 *	保存店员
			 */
			formSubmit(e) {
				let formData = e.detail.value,
					{
						clerkDetail,
						mployee_id = "",
						storeList,
						code,
						bus_id,
						isEditPassword
					} = this,
					power = clerkDetail.power,
					powerArray = [];
				//店员权限数据处理
				for (let key in power) {
					if (power[key] === 1) {
						powerArray.push(key);
					}
				}
				formData.power = powerArray.join(",");
				formData.bus_id = bus_id;
				formData.id = mployee_id;
				formData.status = formData.status ? 1 : 0;
				formData.store_id = formData.store_id !== undefined ? storeList[formData.store_id].id : 0;
				//新增店员传code，编辑店员传user_id
				if (code) {
					formData.code = code;
				} else {
					formData.user_id = clerkDetail.user_id;
				}
				console.log(formData);
				//表单验证
				let rule = [{
							name: "name",
							checkType: "notnull",
							checkRule: "",
							errorMsg: "请填写姓名"
						}
						,
						{
							name: "mobile",
							checkType: "phoneno",
							checkRule: "",
							errorMsg: "请填写正确手机号"
						},
					],
					checkRes = null;
					(this.typeIndex == 0) && rule.push({
							name: "password",
							checkType: "notnull",
							checkRule: "",
							errorMsg: "请填写店员核销密码"
						});
				if (formData.type === 0) {
					//是否编辑过密码
					if (isEditPassword) { //编辑过,校验密码格式
						rule.push({
							name: "password",
							checkType: "string",
							checkRule: "4,",
							errorMsg: "请填写4位密码"
						});
					} else { //未编辑,重置密码未空
						formData.password = "";
					}

				}
				checkRes = formChecker.check(formData, rule);
				
				
				if (checkRes) {
					App._get("merchant.index/Addedit", formData, result => {
						console.log(result);
						if (result.code === 1) {
							App.showSuccess(`${!!mployee_id?"编辑成功":"添加成功"}`, () => {
								if (!mployee_id) {
									uni.navigateBack();
								}
							});
						}
					})
				} else {
					App.showError(formChecker.error)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		margin: 20rpx 30rpx 0;
	}

	.edit-container {
		padding: 40rpx 30rpx 20rpx;

		.edit-avatar {
			width: 160rpx;
			height: 160rpx;
			display: block;
			border-radius: 20rpx;
			margin: 0 auto 30rpx;
		}

		.edit-form {
			.form-title {
				font-size: 28rpx;
				padding: 12rpx 20rpx;
				position: relative;
				margin-bottom: 20rpx;
			}

			.form-title::after {
				content: "";
				position: absolute;
				top: 14rpx;
				bottom: 14rpx;
				left: 3rpx;
				width: 6rpx;
				background: #FFD940;
				background: var(--theme-color);
				border-radius: 8rpx;
			}

			.form-item {
				height: 80rpx;
				line-height: 80rpx;
				background: #FAFAFA;
				border-radius: 10rpx;
				padding: 0 30rpx;
				margin-bottom: 20rpx;

				.form-input-box {
					margin-left: 20rpx;
				}

			}
		}
	}

	.form-btn-box {
		margin: 20rpx 0;

		.form-btn {
			width: 43%;
			height: 80rpx;
			line-height: 80rpx;
			background: #FFD940;
			font-size: 28rpx;
			color: #333333;
		}

		.btn-delete {
			background: transparent;
			border: 1rpx solid #CCCCCC;
		}
	}
</style>
