<!-- 
	支付方式选择 by 杨智源
	showList 是否显示组件
	payData  支付参数
	zeroPay 零元支付
	notBalance 禁用余额支付

	
	@clickMask 遮罩层点击
	@payChange 支付方式切换 
	@payBefore 确认支付前(表单提交)
	@orderReady 订单创建成功
	@paySuccess 支付成功
	@payFail 支付失败
	@payError 支付错误
 -->
<template>
	<view :style="themeColor">
		<button type="primary" @click="formSubmit">支付</button>
	</view>
</template>

<script>
	import PopManager from "@/components/template/PopManager.vue"
	import RadioGroupList from "@/components/template/RadioGroup.vue"
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				currentChecked: "",
				showList: false,
				radioList: [],
				PayMenuHeight: 100,
				paymentUrl: null,
				currentPayType: null,
				disabled: false,
				isBalancePay: false,
				totalBalance: 0 //用户余额
			};
		},
		props: {
			handlePayType: { // 组件处理方式
				type: String,
				default: "order"
			},
			zeroPay: {
				type: Boolean,
				default: false
			},
			notBalance: { //禁用余额支付
				type: Boolean,
				default: false
			}
		},
		components: {
			PopManager,
			RadioGroupList
		},
		onLoad(options) {

		},
		mounted() {
			let _this = this,
				scene = App.getClientType(),
				listData = {
					"2": [{
						id: "wechat",
						title: "微信支付",
						thumb: "/static/images/checkout/weixin.png"
					}],
					"7": [{
						id: "alipay",
						title: "支付宝支付",
						thumb: "/static/images/checkout/zhifubao.png"
					}],
					"8": [{
						id: "baidu",
						title: "百度收银台",
						thumb: "/static/images/checkout/baidu.png"
					}],
					"9": [{
						id: "alipay",
						title: "收银台支付",
						thumb: "/static/images/checkout/toutiao.png"
					}],
					"3": [{
						id: "wechat",
						title: "微信支付",
						thumb: "/static/images/checkout/weixin.png"
					}, {
						id: "alipay",
						title: "支付宝支付",
						thumb: "/static/images/checkout/zhifubao.png"
					}],
					"4": [{
							id: "wechat",
							title: "微信支付",
							thumb: "/static/images/checkout/weixin.png"
						},
						{
							id: "alipay",
							title: "支付宝支付",
							thumb: "/static/images/checkout/zhifubao.png"
						}
					]
				},
				payList = listData[scene];
			App._get("setting/index", {}, res => {
				//支付方式过滤
				let settingPayList = res.data.pay_type || {},
					balanceData = res.data.balance;
				settingPayList = Object.keys(settingPayList).filter(val => settingPayList[val] != "0");
				if (settingPayList.length > 0) {
					payList = payList.filter(val => settingPayList.includes(val.id));
					//添加余额支付
					if (settingPayList.includes("balance") /* && balanceData.balance_open === "1" */ && !_this.notBalance) {
						_this.isBalancePay = true;
						payList.push({
							id: "balance",
							title: `${balanceData.balance_str?balanceData.balance_str:"余额"}支付`,
							thumb: "/static/images/checkout/yue.png"
						})
					}

					if (scene === "3" || scene === "4") {
						_this.radioList.splice(0, payList.length, ...payList);
						_this.currentChecked = payList[0] ? payList[0].id : "";
					} else {
						_this.radioList.splice(0, payList.length, ...payList);
						_this.currentChecked = payList[0].id;
					}
					_this.PayMenuHeight = 200 + (payList.length - 1) * 60;
				} else {
					_this.PayMenuHeight = 200;
				}
			});
		},
		methods: {
			formSubmit() {
				uni.showLoading({
					title: '正在处理...'
				});
				App._post_form("order/cart", {}, result => {
					uni.hideLoading();
					console.log("order/cart", result);
					this.miniProgramPay(result);
				})
			},
			/**
			 * 余额支付
			 * @param {Object} result
			 */
			balancePay(result) {
				console.log(result);
			},
			/**
			 * 小程序支付
			 */
			miniProgramPay(result) {
				let _this = this,
					clientType = _this.$store.state.clientType;
				if (result.code === -10) {
					App.showError(result.msg, () => {
						_this.$emit("payError", res);
						// 跳转到未付款订单
						uni.redirectTo({
							url: "/pages/mainPages/order/index?type=payment"
						})
					});
					return false;
				}
				_this.requestPayment(clientType, result);
			},

			/**
			 * 小程序请求支付
			 * @param {String} clientType 当前客户端平台
			 * @param {Object} payInfo 支付订单信息
			 */
			requestPayment(clientType, payInfo) {
				let _this = this,
					providerData = {
						"2": "wxpay",
						"7": "alipay",
						"8": "baidu",
						"9": "toutiao"
					},
					systemInfo = _this.$store.state.systemInfo,
					payRequestData = {};
				//微信小程序
				if (clientType === "2") {
					payRequestData = {
						timeStamp: payInfo.data.payment.timeStamp,
						nonceStr: payInfo.data.payment.nonceStr,
						package: payInfo.data.payment.package,
						signType: 'MD5',
						paySign: payInfo.data.payment.paySign,
					}
				}
				//支付宝
				else if (clientType === "7") {
					payRequestData.orderInfo = payInfo.data.payment.trade_no;
				}
				//百度
				else if (clientType === "8") {
					payRequestData.orderInfo = payInfo.data.payment;
				}
				//头条
				else if (clientType === "9") {
					let orderInfo = payInfo.data.payment;
					orderInfo.timestamp = String(orderInfo.timestamp);
					orderInfo.risk_info = "";
					// if (systemInfo.appName === "Toutiao") {
					orderInfo.trade_time = String(orderInfo.trade_time);
					payRequestData.orderInfo = orderInfo;
					// } else {
					// 	orderInfo.trade_no = String(orderInfo.trade_no);
					// 	payRequestData.data = orderInfo;
					// }
				}
				console.log(payRequestData);
				// 发起支付
				// #ifdef MP-ALIPAY
				//支付宝支付
				my.tradePay({
					tradeNO: payInfo.data.payment.trade_no,
					success(res) {
						console.log(res);
						if (res.resultCode == "9000") {
							//支付成功
							_this.$emit("paySuccess", {
								pay: res,
								order: payInfo.data
							});
						} else {
							//支付失败
							_this.$emit("payFail", res);
						}
					},
					fail(res) {
						//支付失败
						_this.$emit("payFail", res);
					},
					complete() {
						uni.hideLoading();
					}
				});
				// #endif

				// #ifndef MP-ALIPAY
				//头条收银台支付
				if (clientType === "9") {
					console.log("payRequestData", payRequestData);
					tt.pay({
						...payRequestData,
						service: 1,
						getOrderStatus(res) {
							let {
								out_order_no
							} = res;
							console.log("out_order_no", res);
							return new Promise((resolve, reject) => {
								// 商户前端根据 out_order_no 请求商户后端查询微信支付订单状态
								App._get("order/payOrderFind", {
									out_order_no
								}, (result) => {
									console.log("order/payOrderFind", result);
									// 商户后端查询的微信支付状态，通知收银台支付结果
									//0：支付成功 1：支付超时 2：支付失败 3：支付关闭 4：支付取消 9：订单状态开发者自行获取
									resolve({
										code: result.data ? 0 : 2
									});
								}, (err) => {
									reject(err);
								});
							});
						},
						success(res) {
							console.log("success".res);
							if (res.code == 0) {
								// 支付成功处理逻辑，只有res.code=0时，才表示支付成功
								// 但是最终状态要以商户后端结果为准
								uni.hideLoading();
								//支付成功
								_this.$emit("paySuccess", {
									pay: res,
									order: payInfo.data
								});
							}

						},
						fail(res) {
							console.log("fail".res);
							// 调起收银台失败处理逻辑
							uni.hideLoading();
							//支付失败
							_this.$emit("payFail", res);
						},
					});
					return
				}

				//小程序支付
				uni.requestPayment({
					provider: providerData[clientType],
					...payRequestData,
					success(res) {
						uni.hideLoading();
						//支付成功
						_this.$emit("paySuccess", {
							pay: res,
							order: payInfo.data
						});
					},
					fail(res) {
						uni.hideLoading();
						//支付失败
						_this.$emit("payFail", res);
					}
				});
				// #endif
			},

			/**
			 * 支付宝H5支付
			 */
			aliPayment(result) {
				let orderPay = this.$store.state.orderPay,
					clientType = this.$store.state.clientType,
					paymentUrl = `${result.data.payment}&goods_id=${orderPay.goods_id}`;
				if (clientType === "3") {
					this.paymentUrl = paymentUrl;
					// location.href = paymentUrl;
				} else if (clientType === "4") {
					let base64 = new this.$util.Base64(),
						param = base64.encode(result.data.payment);
					App.navigationTo({
						url: "pages/subPages/flow/pay?goto=" + param
					});
				}
			},

			/**
			 * 微信H5支付
			 * @param {Object} result 支付信息
			 * @param {String} clientType 支付平台
			 */
			wechatPayment(result, clientType) {
				let _this = this,
					payment = result.data.payment;
				if (clientType === "3") {
					location.href = payment;
				} else if (clientType === "4") {
					// #ifdef H5
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest', {
							appId: payment.appId, //公众号名称，由商户传入     
							timeStamp: payment.timeStamp, //时间戳，自1970年以来的秒数     
							nonceStr: payment.nonceStr, //随机串     
							package: payment.package,
							signType: payment.signType, //微信签名方式：     
							paySign: payment.paySign, //微信签名 
						}, (res) => {
							if (res.err_msg == "get_brand_wcpay_request:ok") {
								// 使用以上方式判断前端返回,微信团队郑重提示：
								//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
								//支付成功
								_this.$emit("paySuccess", {
									pay: res,
									order: result.data
								});
							} else {
								//支付失败
								_this.$emit("payFail", res);
							}
						});

					// #endif
				}
			},

		},
		computed: {
			isZeroPay() {
				return this.zeroPay;
			}
		}
	}
</script>

<style>
	.order-pay-menu {
		width: 100vw;
		/* height: 600upx; */
		background: #FFFFFF;
		border-radius: 20upx 20upx 0 0;
	}

	.pay-menu-title {
		font-size: 34upx;
		color: #333333;
		line-height: 3em;
		font-weight: 400;
		text-align: center;
		position: relative;
	}

	.order-pay-list {
		padding: 30upx;
	}

	.pay-menu-title::after {
		content: " ";
		position: absolute;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%);
		width: 40upx;
		height: 8upx;
		background: #FFD940;
		border-radius: 20upx;
	}

	.order-pay-btn {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0 30upx 40upx;
	}

	.order-pay-btn button {
		background: #FFDD00;
		color: #333333;
		height: 84upx;
		line-height: 84upx;
		border-radius: 45upx;
		font-size: 32upx;
	}
</style>
