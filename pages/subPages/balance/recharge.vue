<!-- 余额充值 -->
<template>
	<view class="container" :style="themeColor">
		<view class="recharge-list b-f">
			<view class="recharge-title col-9 f-26">请选择充值金额</view>
			<view class="m-top20">
				<radio-group class="recharge-choose dis-flex flex-y-center flex-warp">
					<label class="recharge-item" v-for="(item, index) in rechargeList" :key="index"
					 @click="itemSelect(item.balance,index)">
						<view class="p-r dis-flex flex-dir-column flex-x-center " :class="{'active main-bg-color auxiliary-color':current === index}" >
							<radio :checked="current === index" :value="index" class="recharge-radio report-btn" />
							<view class="t-c">
								<view class="dis-flex flex-x-center flex-y-line t-c">
									<view class="col-3 f-42 price-font-family " :class="[current === index?'auxiliary-color':'col-3']">{{item.price}}</view>
									<view class="col-3 f-28 " :class="[current === index?'auxiliary-color':'col-3']">元</view>
								</view>
								<view class="item-price f-24 price-font-family " :class="[current === index?'auxiliary-color':'col-9']">售价:{{item.balance}}元</view>
							</view>
						</view>
					</label>
					<label class="recharge-item">
						<view class="p-r dis-flex flex-dir-column flex-x-center">
							<radio checked="" class="recharge-radio report-btn" />
							<view class="t-c">
								<input type="digit" @input="inputMoney" @focus="inputFocus" placeholder="请输入金额" placeholder-class="col-9 f-26" />
							</view>
						</view>
					</label>
				</radio-group>
			</view>
		</view>
		<view class="recharge-btn-box p-r">
			<form @submit="saveFormId" report-submit="">
				<button class="recharge-btn col-3 f-28 main-bg-color auxiliary-color" form-type="submit" @click="rechargePay">立即支付</button>
			</form>
		</view>

		<!-- 订单支付组件 -->
		<OrderPay ref="orderPay" :not-balance="true" @paySuccess="paySuccess"></OrderPay>

	</view>
</template>

<script>
	import OrderPay from "@/components/template/OrderPayPopups.vue"
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				current: 0,
				url:'',
				options:{},
				type:0,
				rechargeMoney: 0, //充值金额
				rechargeList: []
			};
		},
		components: {
			OrderPay
		},
		computed: {},
		onLoad(options) {
			this.type = options.type ? options.type :0
			this.options = options
			
			this.getRechargeList();
		},
		onReady() {
			uni.setNavigationBarTitle({
				title: `${this.settingData.balance.balance_str}充值`
			});
		},
		methods: {
			/**
			 * 获取充值套餐列表
			 */
			getRechargeList() {
				let _this = this;
				App._get("balance.Balance/balanceIndex", {}, res => {
					let {
						meal,
						str
					} = res.data;
					if (meal && meal.length > 0) {
						_this.rechargeList = meal.map(val => {
							val.price = Number(val.balance) + Number(val.money);
							val.checked = false;
							return val;
						});
						console.log(_this.rechargeList);
						_this.rechargeMoney = Number(meal[0].balance);
					}
				});
			},
			/**
			 * 套餐选择
			 */
			itemSelect(money, index) {
				this.rechargeMoney = Number(money);
				this.current = index;
			},
			/**
			 * 立即充值
			 */
			rechargePay() {
				let _this = this,
					{
						current,
						rechargeMoney
					} = this;
				if (current === -1 && rechargeMoney === 0) {
					App.showError("请输入充值金额");
					return
				}
				if (rechargeMoney <= 0.01) {
					App.showError("充值金额需大于0.01");
					return
				}
				if(!/^[0-9]+(.[0-9]{1,2})?$/.test(rechargeMoney)) {
					App.showError("请输入正确的充值金额,最多两位小数");
					return
				}
				_this.$store.commit("orderPay", {
					pay_price: rechargeMoney,
					pay_from: "balance"
				})
				_this.$refs.orderPay.onToggleList();
			},
			/**
			 * @param {Object} e
			 */
			paySuccess(result) {
				console.log("支付成功", result);
				App.showSuccess("充值成功!")
				let _this = this
				if(this.type ==1) {
					
					App.navigationTo({url:`${_this.options.url}?order_type=${_this.options.order_type}&goods_id=${_this.options.goods_id}&goods_num=${_this.options.goods_num}&goods_sku_id=${_this.options.goods_sku_id}&transport_type=${_this.options.transport_type}&is_express=${_this.options.is_express}&is_zt=${_this.options.is_zt}&activityId=${_this.options.activityId}&goods_type=${_this.options.goods_type}&group_id=${_this.options.group_id}`})
					 // App.navigationTo({url:this.url})
				}
			},
			inputFocus() {
				this.current = -1;
				this.rechargeMoney = 0;
			},
			inputMoney(e) {
				let rechargeMoney = e.detail.value;
				this.rechargeMoney = e.detail.value;
				return rechargeMoney
			}
		},
	}
</script>

<style scoped lang="scss">
	.container {

		.recharge-list {
			margin: 20rpx 30rpx 50rpx;
			border-radius: 10rpx;
			padding: 20rpx 30rpx 10rpx;

			.recharge-title {
				padding: 10rpx 0;
			}

			.recharge-item {
				width: 33.33%;
				padding: 1%;
				box-sizing: border-box;

				.p-r {
					height: 140rpx;
					border-radius: 10rpx;
					border: 1rpx solid #EEEEEE;

					&.active {
						border-color: transparent;
						// background: linear-gradient(142deg, rgba(252, 218, 49, 1) 0%, rgba(255, 223, 78, 1) 100%);
					}
				}


			}
		}

		.recharge-btn-box {
			margin-top: 50rpx;

			.recharge-btn {
				margin: 0 30rpx;
				height: 88rpx;
				line-height: 88rpx;
				border-radius: 50px;
				// background: linear-gradient(90deg, rgba(252, 218, 49, 1) 0%, rgba(255, 223, 78, 1) 100%);
			}
		}
	}
</style>
