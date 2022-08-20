<template>
	<view class="page-salesman-withdrawal app-clearfix">
		<!-- 基础信息 -->
		<view class="info-card">
			<view class="info-card__title">当前{{ cBalanceData.font }}(元)</view>
			<view class="info-card__price">￥<text class="is-strong">{{ cBalanceData.balance }}</text></view>
		</view>
		<!-- 基础信息 end -->
		<!-- 表单 -->
		<view class="form-card">
			<view class="form-card__title">提现金额</view>
			<view class="input-row">
				<view class="input-row__prefix">￥</view>
				<input class="input-row__input" v-model="form.value" type="digit" />
				<view class="input-row__suffix" @click="handleBtnAllClick">全部提现</view>
			</view>
			<view class="form-card__tip">
				<view class="iconfont icon-tishi is-inline"></view>单次提现金额限制￥{{cBalanceData.minPrice}}~￥5000.00
			</view>
			<button :disabled="!cBalanceData.open" class="form-card__btn-submit btn-normal"
				:class="{ 'is-disabled': !cBalanceData.open }" @click="withdrawalMethodPopupVisible = true">
				提现
			</button>
			<view class="form-card__tip">服务费¥{{
			    cServiceCharge
			  }}，服务费率{{ cBalanceData.rate }}%</view>
		</view>
		<!-- 表单 end -->
		<!-- 提现说明 -->
		<RightsCard title="提现说明" :text="balanceRes.tx_explain"></RightsCard>
		<!-- 提现说明 end -->
		<!-- 提现方式 -->
		<WithdrawalMethodPopup v-model="withdrawalMethodPopupVisible" :filterEn="cBalanceData.tx_type"
			@on-btn-confirm-click="handleBtnConfirmClick"></WithdrawalMethodPopup>
		<!-- 提现方式 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import RightsCard from './components/RightsCard.vue'
	import WithdrawalMethodPopup from './components/WithdrawalMethodPopup.vue'
	export default {
		components: {
			RightsCard,
			WithdrawalMethodPopup
		},
		data() {
			return {
				// 余额的接口数据
				balanceRes: {},
				// 表单的值
				form: {
					value: 0,
				},
				//  是否正在提交表单
				submitting: false,
				// 提现方式弹窗是否显示
				withdrawalMethodPopupVisible: false
			};
		},
		computed: {
			//   格式化的余额数据
			cBalanceData() {
				const data = this.balanceRes || {};
				return {
					// 当前余额
					balance: data.salesman_money || '',
					// 自定义文字
					font: data.str || "余额",
					// 服务费率
					rate: +data.tx_min_rate,
					// 最低提现金额
					minPrice: +data.tx_min_price,
					// 是否可提现
					open: true,
					// 提现方式
					tx_type: data.tx_type
				};
			},
			// 当前手续费
			cServiceCharge() {
				return (this.cBalanceData.rate * this.form.value / 100 || 0).toFixed(2);
			},
		},
		watch: {
			"cBalanceData.font"(val) {
				uni.setNavigationBarTitle({
					title: `${val}提现`
				});
			},
		},
		async onShow() {
			try {
				await this.mainMixin_BeforeFetchPageData();
				await Promise.all([this.fetchBalanceRes().catch(() => {})]);
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#ffffff",
				});
				App.hideLoading();
			} catch (e) {
				console.log("onShow 报错", e);
			}
		},
		methods: {
			// 全部提现按钮点击事件
			handleBtnAllClick() {
				this.form.value = this.cBalanceData.balance
			},
			handleBtnConfirmClick(type) {
				this.doSubmit({
					type
				})
				this.withdrawalMethodPopupVisible = false
			},
			// 提交订单按钮点击事件
			async doSubmit({
				// 提现方式 type：1微信提现，2银行卡提现
				type
			} = {}) {
				console.log("doSubmit");
				if (this.submitting) {
					return;
				}
				if (!this.validateForm()) {
					return;
				}
				this.submitting = true;
				try {
					const res = await App._getP("salesman.Salesman/withdraw", {
						apply_money: this.form.value,
						type
					});
					if (res.code == 1) {
						uni.showToast({
							icon: "none",
							title: res.data || "确认成功，请等待审核~",
						});
					}
					this.fetchBalanceRes()
				} catch (e) {
					console.log("doSubmit", e);
				}
				this.submitting = false;
			},
			// 表单校验
			validateForm() {
				if (!this.cBalanceData.open) {
					uni.showToast({
						icon: "none",
						title: "提现开关已关闭",
					});
					return false;
				}
				console.log(this.form.value);
				if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(this.form.value)) {
					uni.showToast({
						icon: "none",
						title: "请输入合法数字,最多两位小数",
					});
					return false;
				}
				if (this.form.value < this.cBalanceData.minPrice) {
					uni.showToast({
						icon: "none",
						title: `最低提现额度为${this.cBalanceData.minPrice}元`,
					});
					return false;
				}
				if (+this.form.value > +this.cBalanceData.balance) {
					uni.showToast({
						icon: "none",
						title: `最高提现额度为${this.cBalanceData.balance}元`,
					});
					return false;
				}
				if (+this.form.value > 5000) {
					uni.showToast({
						icon: "none",
						title: "最高提现额度为5000元",
					});
					return false;
				}
				return true;
			},
			// 请求详情的接口数据
			async fetchBalanceRes() {
				try {
					const res = await App._getP("salesman.Salesman/salesmanSetting");
					this.balanceRes = res.data || {};
				} catch (e) {
					console.log("fetchCardCateRes", e);
					return Promise.reject(e);
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.page-salesman-withdrawal {
		box-sizing: border-box;
		min-height: 100vh;
		padding: 0 30rpx;
		background-image: url("./static/images/bg-page-balance-Withdrawal.png");
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-color: #f8f8f8;
	}

	// 基础信息
	.info-card {
		box-sizing: border-box;
		min-height: 209rpx;
		padding: 40rpx 0;
	}

	.info-card__title {
		font-size: 24rpx;
		color: #333333;
	}

	.info-card__price {
		margin-top: 20rpx;
		font-weight: bold;
		font-size: 30rpx;
		color: #333333;

		.is-strong {
			font-size: 60rpx;
		}
	}

	// 基础信息 end
	// 表单
	.form-card {
		box-sizing: border-box;
		min-height: 463rpx;
		padding: 30rpx 30rpx 20rpx 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.form-card__title {
		font-size: 24rpx;
		color: #333333;
	}

	.input-row {
		display: flex;
		align-items: center;
		min-height: 100rpx;
		margin-top: 8rpx;
		line-height: 1.5;
		border-bottom: 1px solid #eeeeee;
	}

	.input-row__prefix {
		font-weight: bold;
		font-size: 60rpx;
		color: #333333;
	}

	.input-row__input {
		flex: 1;
		margin: 0 16rpx;
		font-weight: bold;
		font-size: 60rpx;
		color: #333333;
		height: 70rpx;
	}

	.input-row__suffix {
		font-size: 28rpx;
		color: #333333;
	}

	.form-card__btn-submit {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		margin-top: 60rpx;
		font-size: 28rpx;
		color: #000;
		border-radius: 9999rpx;
		background-color: #ffd940;

		&.is-disabled {
			color: #ccc;
			background-color: #f8f8f8;
		}
	}

	.form-card__tip {
		margin-top: 24rpx;
		font-size: 24rpx;
		color: #999;

		.iconfont {
			margin-right: 10rpx;
		}
	}

	.withdrawal-target {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 30rpx;
	}

	.withdrawal-target__text {
		font-size: 28rpx;
		color: #999;
	}

	.withdrawal-target__img-payment {
		display: inline-block;
		width: 24rpx;
		height: 24rpx;
		margin-right: 10rpx;
	}

	// 表单 end
</style>
