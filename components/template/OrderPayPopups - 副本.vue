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
	<view>
		<pop-manager :show="showList" type="bottom" @clickmask="clickMask">
			<view class="order-pay-menu" :style="'height:'+PayMenuHeight+'px'">
				<form @submit="formSubmit" report-submit="" data-op="pay" data-type="group">
					<view class="pay-menu-title">支付方式</view>
					<view class="order-pay-list">
						<radio-group-list ref="radioGroup" :defaultPay='defaultPay' :radio-list="radioList" @radioChange="radioChange"></radio-group-list>
						<view class="col-3 t-c f-32" v-if="radioList.length === 0">暂未设置支付方式</view>
					</view>
					<view class="order-pay-btn ">
						<button form-type="submit" :disabled="disabled" class="main-bg-color auxiliary-color">确认支付</button>
					</view>
				</form>
			</view>
		</pop-manager>
	</view>
</template>

<script>
	import PopManager from "@/components/template/PopManager.vue"
	import RadioGroupList from "@/components/template/RadioGroup.vue"
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				defaultPay:'',
				balance:'',
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
					_this.defaultPay=settingPayList.default,
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
						_this.currentChecked =_this.defaultPay?_this.defaultPay: payList[0] ? payList[0].id : "";
					} else {
						_this.radioList.splice(0, payList.length, ...payList);
						_this.currentChecked =_this.defaultPay?_this.defaultPay: payList[0].id;
					}
					_this.PayMenuHeight = 200 + (payList.length - 1) * 60;
				} else {
					_this.PayMenuHeight = 200;
				}
			});
		},
		methods: {
			//1-导入 2-微信小程序 3-H5 4-公众号 5-安卓 6-苹果 7-支付宝小程序 8-百度小程序 9-头条小程序
			clickMask() {
				this.onToggleList();
			},
			onToggleList(callback) {
				if (this.isZeroPay) {
					//走零元付款流程
					this.formSubmit({});
				} else {
					let payData = this.$store.state.orderPay,
						wechatPay = this.radioList && this.radioList.length > 0 ? this.radioList.filter(val => val.id === "wechat") : [];
					if (wechatPay.length > 0) {
						wechatPay = wechatPay[0];
						wechatPay.label = payData.bank_content;
						let wechatIndex = this.radioList.findIndex(val => val.id === "wechat");
						this.radioList.splice(wechatIndex, 1, wechatPay);
					}

					if (!this.showList) {
						if (this.isBalancePay) {
							let _this = this,
								balanceIndex = this.radioList.findIndex(val => val.id === "balance"),
								balancePay = this.radioList[balanceIndex];
							uni.showLoading();
							App._get("balance.Balance/balance", {}, res => {
								let {
									balance,
									str,
									zero_is_pay
								} = res.data;
								balance = _this.$util.removePoint(balance);
								_this.balance = balance
								uni.hideLoading();
								//是否余额支付
								if (!!balancePay) {
									balancePay.label = `当前${str}:${balance}元`;
									_this.radioList.splice(balanceIndex, 1, balancePay);
									_this.totalBalance = balance;
									_this.showList = true;
								} else {
									_this.showList = true;
								}
								console.log(_this.radioList,'_this.payList')
								if(zero_is_pay == 2 && Number(balance)==0) {
									_this.radioList.forEach((item,index,arr) => {
										if(item.id =='balance'){
											arr.splice(index,1)
										}
									})
									
									
								}
							})
						} else {
							this.showList = true;
						}
					} else {
						this.showList = false;
					}
					if (callback && typeof callback === 'function') {
						setTimeout(() => {
							callback();
						}, 300)
					}
				}
			},
			radioChange(e) {
				this.currentChecked = e.value;
				
				this.$emit("payChange", e,this.balance);
				
			},
			formSubmit(e) {

				// 记录formId
				App.saveFormId();

				let _this = this,
					{
						paymentUrl,
						currentPayType
					} = _this,
					source = App.getClientType(), //当前支付客户端版本
					payData = _this.$store.state.orderPay,
					payType = _this.currentChecked,
					payFrom = payData.pay_from, //提交订单请求来源
					requestUrl = ""; //请求地址

				switch (payFrom) {
					case "checkout": //创建订单
						requestUrl = "order/buyNow";
						break;
					case "order": //订单支付
						requestUrl = "user.order/pay";
						break;
					case "balance": //余额充值
						payData.pay_type = payType;
						requestUrl = "balance.Balance/recharge";
						break;
					case "cart": //购物车结算
						requestUrl = "order/cart";
						break;
					case "luck": //购物车结算
						requestUrl = "luck.luck/payCode";
						break;
					case "live": //直播申请结算
						requestUrl = "live.live/liveApplyDoOrder";
						break;
				}


				//触发表单提交事件(提交支付前)
				if (!payType) {
					App.showError("暂时无法支付~");
					return;
				}
				console.log(payData);
				//字节跳动小程序支付处理
				if (_this.appClientType === "9") {
					let systemInfo = _this.$store.state.systemInfo;
					payData.source_name = systemInfo.appName;
				}

				_this.disabled = true;
				_this.$emit("payBefore");
				if (!!paymentUrl && !!currentPayType && currentPayType === payType) {
					location.href = paymentUrl;
					_this.disabled = false;
					!_this.isZeroPay && _this.onToggleList();
				} else {
					//余额支付判断
					if (payType === "balance") {
						console.log("payData", payData);
						if (_this.totalBalance < Number(payData.actual_pay_price)) {
							App.showError(`当前${_this.settingData.balance.balance_str}不足,请选择其他支付方式`);
							_this.disabled = false;
							return
						}
					}!_this.isZeroPay && _this.onToggleList();

					// 显示loading
					uni.showLoading({
						title: '正在处理...'
					});
					console.log(requestUrl,'requestUrl=========')
					App._post_form(requestUrl, {
						...payData,
						pay_type: payType,
					}, (result) => {
						console.log("result", result);
						if (_this.isZeroPay) { //0元支付
							if (result.data.status) {
								//支付成功
								_this.$emit("paySuccess", {
									order: result.data
								});
							}
						} else {
							//关闭弹窗
							_this.showList = false;
							//触发提交订单回调
							_this.$emit("orderReady", {
								result,
								source
							});
							if (payType === "balance") { //余额支付
								//支付成功
								_this.$emit("paySuccess", {
									order: result.data
								});
							} else {
								if (source === "3" || source === "4") { //H5支付
									_this.currentPayType = payType;
									if (payType === "alipay") {
										_this.aliPayment(result);
									} else if (payType === "wechat") {
										_this.wechatPayment(result, source);
									}
								} else { //小程序支付
									_this.miniProgramPay(result);
								}
							}
						}
					}, null, (res) => {
						_this.disabled = false;
					});
				}
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
                console.log(providerData[clientType])
                console.log(payRequestData)
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
				// console.log()
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

<style lang="scss">
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
		background: var(--theme-color);
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
