<template>
	<view class="page" :style="themeColor">
		<block v-if="isPageShow">
			<view class="header-content b-f m-btm20">
				<view class="dis-flex flex-x-between flex-y-center tx-title ">
					<view class="f-28 col-3">提现金额</view>
					<view class="f-24 col-3 dis-flex flex-y-center" @click="isShowDesc = true"><text class="iconfont icon-questionfill col-6 f-24 "></text>手续费说明</view>
				</view>
				<!-- 提现说明 -->
				<popup-view :show="isShowDesc" type="center" @clickmask="isShowDesc = false">
					<view class="desc-box  b-f">
						<view class="desc-title dis-flex flex-x-between">
							<view class="f-28 col-6">手续费说明</view>
							<view class="iconfont icon-close f-42 col-6" @click="isShowDesc = false"></view>
						</view>
						<view class="desc-content">
							<view class="f-26 col-6">1、最低提现额度为{{txdetail.min_money}}元</view>
							<view class="f-26 col-6">2、提现手续费为{{txdetail.commission}}%</view>
						</view>
						<view class="desc-btn t-c f-28 col-f main-bg-color auxiliary-color" @click="isShowDesc = false">我知道了</view>
					</view>
				</popup-view>
				<view class="money-input dis-flex">
					<view class="money-icon">{{settingData.currency}}</view>
					<input type="digit" class="input" value="" placeholder="请输入提现金额" placeholder-class="placeinput" v-model="tx_money" />
				</view>
				<view class="tx-moneyShow dis-flex flex-x-between">
					<view class="f-24 col-9">可提现(元):{{txdetail.money}}</view>
					<view class="all-txBtn f-28 col-3" @click="alltx">全部提现</view>
				</view>
			</view>
			<form @submit="formSubmit">
				<view class="with-opContent b-f m-btm20">
					<view class="tx-title f-28 col-3">提现到</view>
					<view class="op-content">
						<view class="op-list">
							<radio-group @change="precedenceChange" name="pay_type">
								<label v-for="(item, index) in txlist" :key="index" class="label-classtyle dis-flex flex-x-between">
									<view class="dis-flex flex-y-center">
										<view class="op-imag">
											<image :src="item.imag" mode=""></image>
										</view>
										<view class="f-28 col-3">{{item.title}}</view>
									</view>
									<view>
										<radio :value="item.pay_type" :checked="index === prececurrent" />
									</view>
								</label>
							</radio-group>
						</view>
					</view>
					<view class="userMsg-content">
						<!-- 银行卡 -->
						<view class="yhk-msg-list" v-if="atpresent==='30'">
							<view class="msg-items dis-flex flex-y-center">
								<view class="msg-title f-24 col-3">开户姓名</view>
								<input class="f-24" type="text" value="" name="bank_account" placeholder="请输入姓名" placeholder-class="placemsg-items" />
							</view>
							<view class="msg-items dis-flex flex-y-center">
								<view class="msg-title f-24 col-3 onelist-hidden">开户银行</view>
								<picker name="bank_name" style="width: 72%;" @change="bankNameIndex = $event.detail.value" :range="bankNameList"
								 range-key="name">
									<view class="f-24" style="height: 52.5upx;line-height: 52.5upx;">{{bankNameList[bankNameIndex]['name']}}</view>
								</picker>
							</view>
							<view class="msg-items dis-flex flex-y-center">
								<view class="msg-title f-24 col-3">银行卡号</view>
								<input class="f-24" type="text" value="" name="bank_card" placeholder="请输入银行卡号" placeholder-class="placemsg-items" />
							</view>
						</view>
						<view class="yhk-msg-list" v-if="atpresent==='20'">
							<view class="msg-items dis-flex flex-y-center">
								<view class="msg-title f-24 col-3">真实姓名</view>
								<input class="f-24" type="text" value="" name="alipay_name" placeholder="请输入姓名" placeholder-class="placemsg-items" />
							</view>
							<view class="msg-items dis-flex flex-y-center">
								<view class="msg-title f-24 col-3">支付宝号</view>
								<input class="f-24" type="text" value="" name="alipay_account" placeholder="请输入支付宝账号" placeholder-class="placemsg-items" />
							</view>
						</view>
						<view v-if="atpresent==='20'|| atpresent==='30'" class="last-hint f-24 col-9">请务必填写真实信息
							<text>*</text>
						</view>
					</view>
				</view>
				<view class="sub-btn">
					<button class="f-28 col-3 main-bg-color auxiliary-color" formType="submit" :disabled="disabled">{{appDiyFont.to_examine}}</button>
				</view>
			</form>
			<view class="kf-content dis-flex flex-x-between flex-y-center m-top20 b-f">
				<view class="dis-flex flex-y-center">
					<image :src="kfQrCode" class="kf-qr"></image>
					<view class="">
						<view class="f-26 col-3">{{kfData.kf_wxid}}</view>
						<view class="f-24 col-9">添加客服微信,即可快速提现</view>
					</view>
				</view>
				<view class="kf-btn f-24 col-f main-bg-color auxiliary-color" @click="isShowQrCode = true">客服</view>
			</view>
			<popup-view :show="isShowQrCode" type="center" @clickmask="isShowQrCode = false">
				<view class="qrCode">
					<image :src="kfQrCode" class="pop-kf"></image>
				</view>
			</popup-view>
		</block>
		<!-- 提现历史记录 -->
		<view style="margin: 30rpx -30rpx;" v-if="isPageShow && options.type === 'free'">
			<u-sticky h5-nav-height="0">
				<page-nav-bar class="page-nav" @navItemClick="handleNavItemClick" :nav-list="navList" ></page-nav-bar>
			</u-sticky>
			<block v-if="recordListRes.data.length > 0 && recordListRes.page>0">
				<!-- 列表 -->
				<view class="record-list  b-f">
					<view class="list-items" v-for="(items,index) in recordListRes.data" :key="index">
						<view class="dis-flex">
							<view class="tx-logo">
								<image class="logo-wx" :src="items.pay_type===10?'/static/images/checkout/weixin.png':(items.pay_type===20?'/static/images/checkout/zhifubao.png/':'/static/images/checkout/yue.png/')"
								 mode=""></image>
							</view>
							<view class="flex-box">
								<view class="dis-flex flex-x-between">
									<view class="tx-title f-28 col-3">提现金额</view>
									<view class="tx-date f-32 col-3">{{settingData.currency}}{{actualMoney(items.money,items.commission)}}</view>
								</view>
								<view class="dis-flex flex-x-between">
									<view class="tx-title f-26 col-9">
										<block v-if="items.commission !=='0.00'">服务费：{{settingData.currency}}{{items.commission}}</block>
									</view>
									<view class="tx-date f-24 col-9">
										<block v-if="items.apply_status !== 30 ">{{(items.apply_status === 10 || items.apply_status === 20) ? '预计':'实际'}}到账</block>
									</view>
								</view>
								<view class="dis-flex flex-x-between">
									<view class="tx-title f-26 col-3">{{items.create_time}}</view>
									<view class="tx-date f-26 col-m">{{items.apply_status === 10 ? '审核中':items.apply_status === 20 ? '审核通过' : items.apply_status === 30 ?'申请驳回':'已打款'}}</view>
								</view>
							</view>
						</view>
						<view class="dis-flex flex-x-between">
							<view class="tx-date f-24 col-9"></view>
							<view class="tx-status f-24"></view>
						</view>
					</view>
				</view>
				<!-- 列表 end -->
				<loadmore :showLoadmore="!recordListRes.hasMore"></loadmore>
			</block>
			<Abnor v-else></Abnor>
		</view>
		<!-- 提现历史记录 end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import PopupView from "@/components/template/PopManager.vue"
	import App from "@/common/js/app.js";
	import PageNavBar from '@/components/template/PageNavBar2.vue'
	import loadmore from "@/components/template/Loadmore.vue";
	import Abnor from "@/components/template/Abnor.vue";
	export default {
		data() {
			return {
				options: {
					// 提现类型，free:免单
					type: '',
					bus_id: ''
				},
				bankNameList: [],
				bankNameIndex: 0,
				atpresent: '',
				prececurrent: 0,
				txlist: [{
						id: 'wx',
						title: '微信零钱',
						imag: '/static/images/checkout/weixin.png',
						pay_type: "10"
					},
					{
						id: 'zfb',
						title: '支付宝',
						imag: '/static/images/checkout/zhifubao.png',
						pay_type: "20"

					},
					{
						id: 'yhk',
						title: '银行卡',
						imag: '/static/images/checkout/yue.png',
						pay_type: "30"
					}
				],
				txdetail: {},
				isPageShow: false,
				tx_money: null,
				isShowDesc: false,
				disabled: false,
				isShowQrCode: false,
				navList: [{
						id: 0,
						title: '全部'
					},
					{
						id: 10,
						title: '审核中'
					},
					{
						id: 20,
						title: '审核通过'
					},
					{
						id: 40,
						title: '已打款'
					},
					{
						id: 30,
						title: '驳回'
					}
				],
				navActiveId: 0,
				// 提现记录列表的分页接口数据（业务中不用分页）。。
				recordListRes: {
					// 当前第几页，0就是即将请求第1页
					page: 0,
					// 分页的大小
					listRow: 2,
					// 数据
					data: [],
					// 是否还有更多
					hasMore: true,
					// 是否正在请求
					isFetching: false
				},
			}
		},
		components: {
			PopupView,
			PageNavBar,
			loadmore,
			Abnor
		},
		computed: {
			kfData() {
				return this.txdetail.kf || {};
			},
			kfQrCode() {
				return this.kfData.kf_qr && this.kfData.kf_qr[0] && this.kfData.kf_qr[0].file_path;
			},
			appDiyFont() {
				let appSetting = this.$store.state.appSetting;
				if (appSetting) {
					return appSetting.diy_font
				}
			}
		},
		
		onReachBottom() {
			if(this.options.type !== 'free') {
				return
			}
			if (this.recordListRes.isFetching || !this.recordListRes.hasMore) {
			    return
			}
			this.fetchRecordListRes().catch(() => {})
		},
		onLoad(options) {
			this.options = options
			App.hideLoading()
			this.withdrawDetail()
			this.getBankList()
			if(this.options.type === 'free') {
				this.fetchRecordListRes()
			}
		},
		methods: {
			actualMoney(money, commission) {
				return (money - commission).toFixed(2);
			},
			handleNavItemClick(item) {
				this.navActiveId = item.id
				this.fetchRecordListRes({
					resetBeforeFetch: true
				})
			},
			/**
			 * 获取提现详情
			 */
			getBankList() {
				let that = this;
				App._get('user.dealer.Bank/getBankList', {
					bus_id: this.options.bus_id
				}, (result) => {
					let data = result.data;
					if (Array.isArray(data) && data.length > 0) {
						that.bankNameList = data;
					}
				})
			},
			/**
			 * 获取提现详情
			 */
			withdrawDetail() {
				let that = this,
					txlist = that.txlist,
					txlist_toStr = txlist.toString(),
					newtxlist = [];
				App._get(this.options.type === 'free' ? 'dealerfree.Dealerfree/getDealerFreeInfo':'user.dealer.Withdraw/getSetInfo', {
					bus_id: this.options.bus_id
				}, (result) => {
					let data = result.data;
					if (!!data.pay_type && data.pay_type.length > 0) {
						for (let i = 0; i < txlist.length; i++) {
							if (txlist_toStr.indexOf(txlist[i].toString()) > -1) {
								for (let j = 0; j < data.pay_type.length; j++) {
									if (txlist[i].pay_type === data.pay_type[j]) {
										newtxlist.push(txlist[i]);
										break;
									}
								}
							}
						}
						console.log("hideLoading");
						that.setData({
							txdetail: data,
							txlist: newtxlist,
							atpresent: newtxlist[0].pay_type
						})
						that.isPageShow = true;
					} else {
						App.showError('暂无设置提现方式', () => {
							uni.navigateBack({
								delta: 1
							});
						})
					}
				})
			},
			/**
			 * 提现类型选择
			 */
			precedenceChange(evt) {
				for (let i = 0; i < this.txlist.length; i++) {
					if (this.txlist[i].pay_type === evt.target.value) {
						this.prececurrent = i;
						break;
					}
				}
				this.atpresent = evt.target.value;
			},
			/**
			 * 全部金额提现按钮
			 */
			alltx() {
				let that = this,
					txdetail = that.txdetail;
				if (!!txdetail.money && Number(txdetail.money) > 0) {
					that.tx_money = txdetail.money;
				} else {
					App.showError('没有可提现金额');
				}
			},
			/**
			 * 申请提现
			 */
			withdraw(fromData) {
				uni.showLoading({})
				let _this = this;
				_this.disabled = true;
				App._get('user.dealer.Withdraw/applyCashWithdrawal', {
					...fromData,
					bus_id: this.options.bus_id
				}, (result) => {
					console.log(result, '申请提现')
					uni.hideLoading()
					if (result.code === 1) {
						App.showSuccess('申请提现成功', () => {
							_this.disabled = false;
							App.navigationTo({
								url: `pages/subPages/withdraw/apply/applysuces?id=${result.data}`,
								redirectTo: true
							})
						})
					}
				},err=>{
					_this.disabled = false;
				})
			},
			/**
			 * 表单
			 */
			formSubmit(e) {
				let that = this,
					fromData = {},
					txdetail = that.txdetail;
				fromData = e.detail.value;
				fromData.money = that.tx_money;
				console.log(fromData);
				if (!that.tx_money) {
					App.showError('请输入提现金额')
					return false
				}
				if (Math.round(that.tx_money * 100) / 100 < txdetail.min_money ||
					(Math.round(that.tx_money * 100) / 100 > txdetail.money)) {
					App.showError(`请检查输入金额是否小于最少提现金额${txdetail.min_money}元或输入金额大于可提现金额`)
					return false
				}
				if (that.atpresent === "30") {
					fromData.bank_name = that.bankNameList[that.bankNameIndex]['id'];
					if (!fromData.bank_account) {
						App.showError('请输入开户姓名')
						return false
					}
					if (!fromData.bank_name) {
						App.showError('请输入开户行姓名')
						return false
					}
					if (!fromData.bank_card) {
						App.showError('请输入银行卡号')
						return false
					}
				}
				if (that.atpresent === "20") {
					if (!fromData.alipay_name) {
						App.showError('请输入真实姓名')
						return false
					}
					if (!fromData.alipay_account) {
						App.showError('请输入支付宝账号')
						return false
					}
				}!!fromData && that.withdraw(fromData)
				App.saveFormId();
			},
			// 请求优惠券列表的分页接口数据（注意业务中优惠券列表不用分页）
			async fetchRecordListRes({
				resetBeforeFetch = false
			} = {}) {
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						console.log('重置数据')
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.recordListRes = {
							...this.recordListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false
						}
					}
					// 如果没有更多就不必请求了
					if (!this.recordListRes.hasMore) {
						return Promise.reject()
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.recordListRes.isFetching = true
					// 请求数据
					const res = await App._getP('user.dealer.Withdraw/withdrawDetail', {
						page: this.recordListRes.page + 1,
						list_rows: this.recordListRes.listRow,
						apply_status: this.navActiveId,
					})
					// 取得新的数据
					const newData = this.$util.deepGet(res, 'data.list.data', [])
					// 判断是否有更多
					const hasMore = newData.length >= this.recordListRes.listRow
					// 设置新的数据
					this.recordListRes = {
						...this.recordListRes,
						page: this.recordListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ? newData : this.recordListRes.data.concat(newData),
						hasMore,
						isFetching: false
					}
					console.log('this.recordListRes11111111111', this.recordListRes.data[0], res)
				} catch (e) {
					console.log('ha', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			}
		}
	}
</script>

<style>
	.page {
		padding: 18upx 30upx;
	}

	.header-content {
		padding: 40upx 36upx 30upx 36upx;
		border-radius: 6upx;
	}

	.tx-title {
		margin-bottom: 40upx;
	}

	.tx-title .iconfont {
		font-size: 14px;
		width: 14px;
		height: 14px;
		line-height: 14px;
		display: inline-block;
		margin-right: 4rpx;
	}

	.desc-box {
		width: 80vw;
		border-radius: 12rpx;
		padding-bottom: 30rpx;
	}

	.desc-title {
		height: 80rpx;
		line-height: 80rpx;
		border-bottom: 1rpx solid #EEEEEE;
		padding: 0 30rpx;
	}

	.desc-content {
		padding: 30rpx;
		/* height: 500rpx; */
		overflow-x: hidden;
		width: auto;
		max-width: 100%;
	}

	.desc-btn {
		border-radius: 50px;
		background: #FFD940;
		height: 70rpx;
		line-height: 70rpx;
		margin: 0 30rpx;
	}

	.placeinput {
		font-size: 30upx;
		height: 52upx;
		line-height: 52upx;
	}

	.money-icon {
		margin-right: 20upx;
		font-size: 48upx;
		height: 1em;
		line-height: 1em;
	}

	.money-input {
		border-bottom: 1px solid #EEEEEE;
		align-items: baseline;
	}

	.money-input .input {
		font-size: 52upx;
		height: 1.5em;
		line-height: 1.5em;
	}

	.tx-moneyShow {
		padding-top: 34upx;
	}

	.with-opContent {
		border-radius: 6upx;
		padding: 36upx 36upx 0 36upx;
	}

	.op-imag {
		margin-right: 15upx;
	}

	.op-imag image {
		width: 50upx;
		height: 50upx;
		vertical-align: middle;
	}

	.label-classtyle {
		padding: 20upx 0;
		border-bottom: 1px solid #EEEEEE;
	}

	.label-classtyle:last-child {
		border: none;
	}

	.userMsg-content {
		padding: 0 58upx;
	}

	.msg-title {
		margin-right: 30upx;
	}

	.msg-items {
		border-bottom: 1px solid #EEEEEE;
		padding: 26upx 0;
	}

	.placemsg-items {
		color: #999999;
	}

	.last-hint {
		position: relative;
		text-align: right;
		padding: 30upx 14upx 30upx 0;
	}

	.last-hint text {
		display: block;
		position: absolute;
		color: red;
		font-size: 22upx;
		right: 0;
		top: 30%;
	}

	.sub-btn button {
		background: #FFD940;
		height: 84upx;
		line-height: 84upx;
		text-align: center;
		border-radius: 42upx;
	}

	.input-hidden {
		width: 0;
		height: 0;
		opacity: 0;
	}

	.kf-content {
		padding: 20rpx 30rpx;
		border-radius: 10rpx;
	}

	.kf-qr {
		width: 120rpx;
		height: 120rpx;
		display: block;
		margin-right: 20rpx;
	}

	.kf-btn {
		width: 150rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 60rpx;
		background: #FFD940;
	}

	.qrCode {
		padding: 20rpx;
		border-radius: 20rpx;
		background: #FFFFFF;
	}

	.pop-kf {
		width: 500rpx;
		height: 500rpx;
		display: block;
		border-radius: 20rpx;
	}
</style>

<style lang="scss" scoped>
	.record-list {
		border-top: 1px solid #EEEEEE;
		border-bottom: 1px solid #EEEEEE;
	}
	
	.record-list .list-items {
		margin: 0 30upx;
		padding: 20rpx 0;
		border-bottom: 1px solid #EEEEEE;
	}
	
	.record-list .list-items:last-child {
		border: none
	}
	
	.tx-logo {
		margin-right: 24upx;
	}
	
	.tx-logo .logo-wx {
		width: 48upx;
		height: 48upx;
		vertical-align: middle
	}
	
	.tx-title {
		margin-bottom: 9upx;
	}
	
	.tx-status {
		color: #DEA85F;
		text-align: right;
	}
</style>
