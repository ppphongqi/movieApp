<template>
	<view>
		<view class="container m-b6" :style="themeColor">
			<view class="common-header-xian"></view>
			<block v-if="list.length > 0">
				<radio-group @change="chooseAddress">
					<block v-for="(item,index) in list" :key="index">
						<view class="custom-li p-r b-f">
							<label :class="{'choose-list':options.from === 'flow'}">
								<view class="address-header m-top18">
									<view class="flow-header-left pl-12">
										<view class="flow-checkout-admin f-32 f-w">{{item.name}}
											<text class="f-30">{{item.phone}}</text>
										</view>
										<view class="flow-checkout-address">
											{{item.region.province}} {{item.region.city}} {{item.region.region}} {{item.detail}}
										</view>
									</view>
								</view>
								<radio class="choose-label" v-if="options.from === 'flow'" :checked="item.address_id == options.choose_id"
								 :value="item.address_id" :color="topColor"></radio>
							</label>
							<block v-if="options.from !== 'flow'">
								<view class="address-list dis-flex b-f">
									<view class="list address-left" @click="setDefault(item.address_id)">
										<label class="radio dis-flex flex-y-center">
											<radio :checked="item.default == 1" :color="topColor" :value="item.address_id"></radio>
											<view class="cont" v-if="item.default == 1">默认地址</view>
											<view class="cont" v-else>设为默认</view>
										</label>
									</view>
									<view class="list dis-flex">
										<view @click="editAddress" :data-id="item.address_id" class="f-24 col-9 add-maright">
											<text class="iconfont icon-edit"></text>
											<text class="title">编辑</text>
										</view>
										<view @click="removeAddress" :data-id="item.address_id" class="f-24 col-9">
											<text class="iconfont icon-delete"></text>
											<text class="title">删除</text>
										</view>
									</view>
								</view>
							</block>
							<!-- 定位提示蒙层 -->
							<view v-if="!item.lat || !item.lng" class="location-marker" :data-id="item.address_id" @click="editAddress">
								<view class="location-marker__text">请定位准确的配送地址<view class="iconfont is-inline icon-arrow-right-copy"></view></view>
							</view>
							<!-- 定位提示蒙层 end -->
						</view>
					</block>
				</radio-group>
			</block>
			<view v-else>
				<view class="no-data">
					<Abnor :abnor="'ADDRESS'"></Abnor>
				</view>
			</view>
			<view class="footer-fixed f-32">
				<view @click="createAddress" class="order-bt main-bg-color auxiliary-color" style="width:100%">添加新地址</view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import Abnor from "@/components/template/Abnor.vue"
	export default {
		data() {
			return {
				list: [],
				default_id: null,
				from: "",
				choose_id: null,
				options: null,
			};
		},
		components: {
			Abnor
		},
		computed: {

		},
		beforeCreate() {
			//App = this.getApp;
		},
		onLoad: function(options) {
			// 当前页面参数
			this.options = options;
		},

		onShow: function() {
			// 获取收货地址列表
			this.getAddressList();
		},
		mounted() {

		},
		methods: {
			/**
			 * 获取收货地址列表
			 */
			getAddressList: function() {
				let _this = this;
				App._get('address/lists', {
					no_login: 1
				}, function(result) {
					if (result.data.list.length > 0) {
						result.data.list.map(val => {
							val.address_id += '';
						})
					}
					_this.setData(result.data)
					// 							let list = result.data.list,
					// 							default_id = result.data.default_id
					// 					_this.setData({
					// 						list,
					// 						default_id
					// 					});
				});
			},

			/**
			 * 添加新地址
			 */
			createAddress: function() {
				App.navigationTo({
					url: "pages/subPages/address/create"
				});
			},

			/**
			 * 编辑地址
			 */
			editAddress: function(e) {
				App.navigationTo({
					url: "pages/subPages/address/detail?address_id=" + e.currentTarget.dataset.id,
					redirectTo: true
				});
			},

			/**
			 * 移除收货地址
			 */
			removeAddress: function(e) {
				let _this = this,
					address_id = e.currentTarget.dataset.id;
				uni.showModal({
					title: "提示",
					content: "您确定要移除当前收货地址吗?",
					success: function(o) {
						o.confirm && App._post_form('address/delete', {
							address_id
						}, function(result) {
							_this.getAddressList();
						});
					}
				});
			},

			/**
			 * 设置为默认地址
			 */
			setDefault: function(address_id) {
				console.log('this.default_id',this.default_id)
				if(address_id == this.default_id) {
					return
				}
				console.log("setDefault");
				let _this = this;
				_this.setData({
					default_id: parseInt(address_id)
				});
				App._post_form('address/setDefault', {
					address_id
				}, function(result) {
					_this.options.from === 'flow' && uni.navigateBack();
				});
				return false;
			},

			/**
			 * 订单地址修改
			 */
			chooseAddress(e) {
				let store = this.$store,
					addressId = e.detail.value,
					addressData = this.list.filter(val => val.address_id == addressId)[0];
				if (this.options.from === "flow") {
					store.commit("addressData", addressData);
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20upx 30upx 100rpx;
	}

	.custom-li {
		position: relative;
		margin-bottom: 20upx !important;
		border-radius: 6upx;
	}

	.address-list {
		border-bottom: 1px solid #f6f6f9;
		border-bottom-left-radius: 10upx;
		border-bottom-right-radius: 10upx;
		align-items: center;
	}

	.choose-item {
		position: relative;
	}

	.choose-list {
		display: flex;
		flex-direction: row;
		align-items: center;
	}



	.choose-label {
		margin: 0 36upx;
	}

	.address-list .list {
		padding: 0 40upx 16upx 40upx;
	}

	.add-maright {
		margin-right: 56upx;
	}

	.address-list .list .title {
		font-size: 24upx;
		padding: 0 0 0 6upx;
		color: #999999;
	}

	.address-list .list .cont {
		font-size: 24upx;
		color: #333333;
	}

	.address-list .list navigator {
		display: inline-block;
	}

	.address-list .list image {
		width: 28upx;
		height: 28upx;
	}

	.address-left {
		flex: 6;
		margin-top: 10upx;
	}

	.address-right .iconfont {
		color: #777;
		font-size: 30upx;
	}

	.flow-fixed-footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		background: #f42424;
		z-index: 400;
	}

	.flow-fixed-footer .chackout-left {
		font-size: 32upx;
		line-height: 44px;
		color: #777;
	}

	.flow-fixed-footer .chackout-right {
		font-size: 34upx;
	}

	.address-header {
		padding-top: 28upx;
		background-size: 120upx auto;
		font-size: 1.7rem;
		border-top-left-radius: 10upx;
		border-top-right-radius: 10upx;
	}

	.choose-list .address-header {
		padding: 28upx 0;
		flex: 1;
	}

	.flow-header-left {
		flex: 14;
		padding: 0upx 40upx;
	}

	.flow-header-right {
		flex: 1;
	}

	.flow-header-right image {
		width: 34upx;
		height: 34upx;
		margin-top: 20upx;
		float: right;
	}

	.address-header .flow-checkout-admin {
		color: #333333;

	}

	.address-header .flow-checkout-admin text {
		padding: 0 10upx;
		font-weight: normal;
	}

	.address-header .flow-checkout-address {
		font-size: 24upx;
		color: #999999;
		margin-top: 6upx;
	}

	.no-data {
		padding-top: 80upx;
		box-sizing: border-box;
	}

	.radio-group .radio {
		align-items: center;
	}

	radio .wx-radio-input {
		/* 自定义样式.... */
		height: 22upx;
		width: 22upx;
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
		font-size: 20upx;
		color: #000000;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	radio.choose-label .wx-radio-input {
		width: 32upx;
		height: 32upx;
		margin-top: -4upx;
		border-radius: 50%;
		border: 2upx solid #999;
		background: transparent;
	}

	radio.choose-label .wx-radio-input.wx-radio-input-checked::before {
		width: 32upx;
		height: 32upx;
		line-height: 32upx;
		font-size: 24upx;
	}

	/* #ifdef H5*/
	radio>>>.uni-radio-input {
		/* 自定义样式.... */
		height: 32upx;
		width: 32upx;
		margin-top: -4upx;
		border-radius: 50%;
		border: 2upx solid #999;
		background: transparent;
	}


	radio>>>.uni-radio-input.uni-radio-input-checked {
		background-color: #FFD940 !important;
		border-color: #FFD940 !important;
		background-color: var(--theme-color) !important;
		border-color: var(--theme-color) !important;
	}

	radio>>>.uni-radio-input.uni-radio-input-checked::before {
		border-radius: 50%;
		width: 20upx;
		height: 20upx;
		line-height: 20upx;
		text-align: center;
		font-size: 20upx;
		color: #000000;
		margin-left: -2upx;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	/* #endif */
</style>

<style lang="scss" scoped>
	.location-marker {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba($color: #000000, $alpha: 0.7);
		border-radius: 10rpx;
	}
	.location-marker__text {
		color: #fff;
		font-size: 28rpx;
		.iconfont {
			margin-left: 16rpx;
			font-size: 24rpx;
		}
	}
</style>
