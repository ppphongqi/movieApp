<template>
	<view class="container" :style="themeColor">
		<scroll-view scroll-y class="list-container" lower-threshold="20" @scrolltolower="onScrollBottom">
			<block v-for="(item,index) in listData.data" :key="index">
				<view class="item-employee b-f dis-flex flex-x-between flex-y-center">
					<view class="employee-info dis-flex  flex-y-center">
						<image class="employee-avatar" :src="item.avatarUrl"></image>
						<view class="dis-flex flex-dir-column flex-x-around">
							<view class="employee-name f-30 col-3  dis-flex  flex-y-center">{{item.name}}
								<view class="iconfont" :class="[item.status === 1?'icon-chenggong':'icon-biaodankongjianshanchu']"></view>
							</view>
							<view class="employee-role f-24 col-9">角色：{{item.type === 1?"管理员":"店员"}}</view>
						</view>
					</view>
					<view class="employee-handle dis-flex  flex-y-center">
						<view class="handle-btn handle-edit" @click="editeMployee(item)">编辑</view>
						<view class="handle-btn" :class="[item.status === 1?'':'handle-open main-bg-color auxiliary-color']" @click="employeeHandle(item.id,index,item.status)">{{item.status === 1?"停用":"启用"}}</view>
					</view>
				</view>
			</block>
			<load-more :showLoadmore="!isLoading"></load-more>
		</scroll-view>
		<view class="add-employee f-28 main-bg-color auxiliary-color" @click="addEmployee(bus_id)">添加店员</view>

		<!-- 添加店员 -->
		<popup-view :show="showAddClerk" type="center" @clickmask="addClerkChange">
			<view class="card-use b-f">
				<form @submit="addSubmit" report-submit="">
					<view class="card-use-title dis-flex flex-x-between">
						<view class="f-28 col-6">添加店员</view>
						<view class="iconfont icon-close f-42 col-6" @click="addClerkChange"></view>
					</view>
					<view class="card-use-content add-container">
						<view class="qr-box p-r">
							<view class="image-load" v-if="!codeData.qrcode"></view>
							<!-- #ifdef H5 -->
							<image :src="'data:image/png;base64,'+codeData.qrcode" class="addQrcode"></image>
							<!-- #endif -->
							<!-- #ifndef H5 -->
							<image :src="codeData.qrcode" class="addQrcode"></image>
							<!-- #endif -->
						</view>
					</view>
				</form>
			</view>
		</popup-view>

		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import LoadMore from "@/components/template/Loadmore.vue"
	import PopupView from "@/components/template/PopManager.vue"
	export default {
		data() {
			return {
				listData: {},
				showAddClerk: false, //显示添加二维码
				codeData: {},
				timer: null,
				bus_id: "", //商家id
				isInvite: false, //是否接受邀请
				isLoading: true
			};
		},
		components: {
			PopupView,
			LoadMore
		},
		computed: {

		},
		onLoad(options) {
			this.bus_id = options.bus_id;
			console.log('-----------------------------',options)
		},
		onShow() {
			this.getClerkList(this.bus_id);
		},
		onHide() {
			this.clearTimer();
		},
		onUnload() {
			this.clearTimer();
		},
		methods: {
			/**
			 * 获取店员列表
			 */
			getClerkList(bus_id, page = 1, isPage = false) {
				let _this = this;
				App._get("merchant.index/saleclerkIndex", {
					bus_id,
					page
				}, result => {
					let data = result.data;
					if (isPage) {
						if (data.data.length > 0) {
							_this.listData.data.push(...data.data)
						}
					} else {
						_this.listData = data;
					}
					_this.isLoading = data.data.length == data.per_page;
					App.hideLoading();
				})
			},
			/**
			 * 店员编辑跳转
			 */
			editeMployee(info) {
				App.navigationTo({
					url: `pages/subPages/business/employee/edit?mployee_id=${info.id}&bus_id=${this.bus_id}`
				})
			},
			/**
			 * 店员状态修改
			 */
			employeeHandle(id, index, status) {
				let _this = this;
				uni.showLoading({
					title: "加载中..."
				})
				App._get("merchant.index/status", {
					id
				}, result => {
					console.log(result);
					uni.hideLoading();
					if (result.code === 1) {
						App.showSuccess("操作成功")
						_this.$set(this.listData.data[index], "status", status === 1 ? 0 : 1);
					}
				})
			},
			/**
			 * 添加店员弹窗显示/隐藏
			 */
			addClerkChange() {
				this.showAddClerk = !this.showAddClerk;
				if (this.showAddClerk === false) {

					this.clearTimer();
				}
			},
			/**
			 * 生成店员二维码
			 * @param {Object} bus_id
			 */
			addEmployee(bus_id) {
				let _this = this;
				this.addClerkChange();
				App._get("merchant.index/addQrcode", {
					bus_id
				}, result => {
					_this.codeData = result.data;
					_this.inviteStatus(result.data.code, bus_id);
				});
			},
			/**
			 * 扫码状态查询
			 */
			inviteStatus(code, bus_id) {
				let _this = this;
				if (_this.showAddClerk) {
					_this.timer = setTimeout(() => {
						_this.monitorStatus(code, bus_id);
					}, 300);
				}

			},
			monitorStatus(code, bus_id) {
				let _this = this;
				App._get("merchant.index/monitor", {
					code,
					bus_id
				}, result => {
					if (result.data === "") {
						if (_this.showAddClerk) {
							_this.inviteStatus(code, bus_id);
						}
					} else {
						_this.showAddClerk = false;
						clearTimeout(_this.timer);
						App.navigationTo({
							url: `pages/subPages/business/employee/edit?code=${_this.codeData.code}&avatarUrl=${result.data.avatarUrl}&bus_id=${this.bus_id}`
						})
						console.log("已接受邀请");
					}
				})
			},
			clearTimer() {
				clearTimeout(this.timer);
				this.timer = null;
			},
			/**
			 * 滚动到底部
			 */
			onScrollBottom(e) {
				let {
					last_page,
					current_page
				} = this.listData;
				// 已经是最后一页
				if (current_page >= last_page) {
					this.isLoading = false;
					return false;
				}
				// 加载下一页列表
				this.getClerkList(this.bus_id, ++this.listData.current_page, true);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 0 30rpx;
	}

	.list-container {
		height: calc(100vh - 120rpx);
	}

	.item-employee {
		margin-top: 20rpx;
		padding: 30rpx;
		border-radius: 10rpx;

		.employee-avatar {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			display: block;
			margin-right: 20rpx;
		}

		.iconfont {
			font-size: 26rpx;
			width: 1em;
			height: 1em;
			line-height: 1em;
			margin-left: 10rpx;
		}

		.icon-chenggong {
			color: #25DC4C;
		}

		.icon-biaodankongjianshanchu {
			color: #FF4444;
		}

		.flex-dir-column {
			height: 90rpx;
		}

		.handle-btn {
			font-size: 24rpx;
			width: 80rpx;
			height: 46rpx;
			line-height: 46rpx;
			text-align: center;
			border: 1rpx solid #EEEEEE;
			margin-left: 20rpx;
			border-radius: 6rpx;
		}

		.handle-edit {
			border: 0;
			background: #F8F8F8;
		}

		.handle-open {
			color: #333333;
			border: 0;
			background: #FFD940;
		}
	}

	.add-employee {
		position: fixed;
		left: 30rpx;
		right: 30rpx;
		bottom: 20rpx;
		height: 90rpx;
		line-height: 90rpx;
		color: #333333;
		background: #FFD940;
		border-radius: 45px;
		text-align: center;
	}

	/* 添加店员 */
	.card-use {
		width: 80vw;
		border-radius: 12rpx;
		padding-bottom: 30rpx;
	}

	.card-use-title {
		height: 80rpx;
		line-height: 80rpx;
		border-bottom: 1rpx solid #EEEEEE;
		padding: 0 30rpx;
	}

	.card-use-content {
		padding: 30rpx;
		overflow-x: hidden;
		width: auto;
		max-width: 100%;
		box-sizing: border-box;
	}

	.card-use-btn {
		border-radius: 50px;
		background: #FFD940;
		height: 70rpx;
		line-height: 70rpx;
		margin: 0 30rpx;
	}

	.add-container {

		.form-item {
			margin-bottom: 12rpx;

			.form-label {
				width: 4.2em;
				min-height: 60rpx;
				line-height: 60rpx;
			}

			.form-input-box {
				padding-left: 20rpx;
				line-height: 60rpx;

				.form-input {
					padding: 0 12rpx;
					border: 1rpx solid #dcdfe6;
					border-radius: 8rpx;
					box-sizing: border-box;
					min-height: 60rpx;
					line-height: 60rpx;
				}
			}
		}

		//二维码
		.qr-box {
			.addQrcode {
				width: 350rpx;
				height: 350rpx;
				margin: 0 auto;
				display: block;
			}
		}
	}


	.image-load {
		position: absolute;
		top: 50%;
		left: 50%;
		margin: -15upx 0 0 -15upx;
		width: 30upx;
		height: 30upx;
		display: inline-block;
		padding: 0px;
		border-radius: 100%;
		border: 2upx solid;
		border-top-color: #FFD940;
		border-bottom-color: rgba(0, 0, 0, 0.1);
		border-left-color: #FFD940;
		border-right-color: rgba(0, 0, 0, 0.1);
		animation: loader 1s ease-in-out infinite;
	}

	@keyframes loader {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>
