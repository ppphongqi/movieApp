<template>
	<view class="page" :style="themeColor">
		
		<view class="header auxiliary-color">
			<view class="header-left">
				<view class="header-left-name m-btm10 f-24">当前金额(元)</view>
				<view class="header-left-box f-32">
					<text>¥</text>
					<text class="header-left-box-num price-font-family">{{detail.balance}}</text>
				</view>
			</view>
		</view>
		<view class="card">
			<view class="card-title f-24 col-3">提现金额</view>
			<view class="card-box dis-flex flex-x-between flex-y-center m-btm10">
				<text class="f-58 col-3">¥</text>
				<input type="digit" value="" v-model="withdrawalMonery" placeholder="请输入提现金额" />
				<view class="f-28 col-0" @click="allWithdrawal">全部提现</view>
			</view>
			<view class="card-hint m-btm30">
				<text class="iconfont icon-dingweixiao col-3"></text>
				<text class="f-24 col-9">单次提现金额限制</text>
				<text class="f-24 col-3">10.00-5000.00</text>
			</view>
			<button type="default" class="withdraw-btn main-bg-color auxiliary-color" @click="isShowWithdraw">提现</button>
		</view>
		
		
		<!-- 之前朋友写的 -->
		<view class="cancel-data dis-flex flex-x-center m-btm20">
			<view class="dis-flex flex-y-center" style="width: 50%;margin-top: 20rpx;margin-bottom: 20rpx;">
				<view class="data-content t-c" style="height: 42rpx;" v-for="(items,index) in navList" :key="index" @click="TxTypeChange(items.id)">
					<view :class="{'active':items.id == TxType}" class="col-9 f-28">{{items.title}}</view>
					<view class="line"></view>
				</view>
			</view>
		</view>
		<view class="scroll-list">
			<scroll-view scroll-y="true" class="scroll-view" @scrolltolower="onScrollBottom" :scroll-into-view="scroll_Top" @scroll="scrolly">
				<view id="scroll_Top_id"></view>
				<view class="cancel-data dis-flex flex-dir-column m-btm20" v-for="(item,index) in storeList" :key="index">
					<view class="dis-flex flex-y-center">
						<view class="t-c dis-flex flex-dir-column flex-x-between" style="width: 100%;">
							<view class="dis-flex flex-dir-column flex-x-between" style="text-align: left;">
								<view class="dis-flex flex-y-center flex-x-between col-3 f-32">
									<text class="onelist-hidden" v-if="TxType == 1" style="font-size: 28rpx;margin-right: 10px;width: 60%;">{{ item.content }}</text>
									<text class="dis-flex flex-y-center" v-if="TxType == 2" style="font-size: 28rpx;color:#999999;">
										<text class="tag" style="vertical-align: middle;">{{item.content || '申请提现'}}</text>
										<text style="vertical-align: middle;">{{item.balance || '0.0'}}</text>
									</text>
									<text v-if="TxType == 1" style="font-size: 32rpx;color:#E34A4A;">+{{item.balance || '0.0'}}</text>
									<text class="dis-flex flex-y-center" v-if="TxType == 2" style="font-size: 32rpx;color:#E34A4A;">
										<text v-if="item.withdrawal_status == 4" class="tag success">实际到账</text>
										 <text v-if="item.withdrawal_status == 1" style="font-size: 28rpx;color:#999999;">申请通过</text>
										 <text v-if="item.withdrawal_status == 2" style="font-size: 28rpx;color:#999999;">待审核</text>
										 <text v-if="item.withdrawal_status == 4" style="vertical-align: middle;">{{item.balance || '0.0'}}</text>
										 <text v-if="item.withdrawal_status == 3" style="vertical-align: middle;">已驳回</text>
									</text>
								</view>
								<view class="col-9 f-24 dis-flex flex-x-between flex-y-center" style="margin-top: 10rpx;margin-bottom: 40rpx;">
									<span>{{item.create_time}}</span>
									<span v-if="TxType == 2">{{item.withdrawal_time || ''}}</span>
								</view>
							</view>
						</view>
					</view>
				</view>
				<loadmore :showLoadmore="showLoadmore"></loadmore>
			</scroll-view>
		</view>
		<pop-manager ref="popmanager" :show="showCalendar" type="bottom" @clickmask="showCalendar = false">
			<view class="order-pay-menu" :style="'height:' + PayMenuHeight + 'px'">
				<form @submit="withdraw" report-submit="">
					<view class="pay-menu-title">提现方式</view>
					<view class="col-3 f-24" style="margin-left: 40rpx;margin-top:40rpx;letter-spacing: 5rpx;">
						当前提现金额:
						<text style="color:#E34A4A;margin-right: 10rpx;">{{ withdrawalMonery }}</text>
					</view>
					<view class="order-pay-list" v-if="radioList && radioList.length > 0">
						<radio-group @change="radioChange" :name="'current'">
							<label
								class="order-pay-item dis-flex flex-y-center flex-x-between"
								v-for="(radioItem, index) in radioList"
								:key="radioItem.id"
								:class="{ 'pay-border': type === 'pay' }"
							>
								<radio :value="radioItem.id" class="radio" :checked="current == radioItem.id" />
								<view class="order-pay dis-flex flex-y-center">
									<block v-if="!!radioItem.thumb"><image :src="radioItem.thumb"></image></block>
									<view class="order-pay-text col-3" :class="[type === 'pay' ? 'f-30' : 'f-26']">{{ radioItem.title }}</view>
								</view>
								<view class="iconfont" :class="[current == radioItem.id ? 'icon-radiobox' : 'icon-round']"></view>
							</label>
						</radio-group>
						<view class="col-3 t-c f-32" v-if="radioList.length === 0">暂未设置支付方式</view>
					</view>
					<view class="order-pay-btn"><button form-type="submit">确认提现</button></view>
				</form>
			</view>
		</pop-manager>
		
	</view>
</template>

<script>
import App from "@/common/js/app.js"
// #ifdef H5
import wxApi from "@/static/h5/wxApi.js"
// #endif
import loadmore from "@/components/template/Loadmore.vue";
import WPicker from '@/components/threeComponents/w-picker.vue';
import PopManager from "@/components/template/PopManager.vue"
export default {
	data() {
		return {
			startYear: 0,
			endYear: 0,
			showCalendar: false,
			radioList: [],
			current: '',
			PayMenuHeight: 300,
			TxType: 1,
			page: 1,
			solHeight: null,
			listData: [{
					id: "wechat",
					title: "微信支付",
					thumb: "/static/images/checkout/weixin.png"
				},
				{
					id: "alipay",
					title: "支付宝支付",
					thumb: "/static/images/checkout/zhifubao.png"
				},
				{
					id: "card",
					title: "银行卡",
					thumb: "/static/images/checkout/card.png"
				},
			],
			navList: [{
					id: 1,
					title: '收入'
				},
				{
					id: 2,
					title: '提现'
				}
			],
			showLoadmore: false,
			storeList: [],
			scroll_Top: "",
			list_page: null,
			detail: null,
			withdrawalMonery: '',//提现金额
		};
	},
	components: {
		loadmore,
		WPicker,
		PopManager
	},
	computed: {
		hasOrder() {
			return this.detail && this.detail.order && Array.isArray(this.detail.order.data)
		}
	},
	beforeCreate() {

	},
	onLoad(options) {
		const {bus_id} = options;
		this.$bus_id = bus_id;
		this.state = options.state;
	},
	onShow() {
		this.getMerchantInfo();
	},
	methods: {
		allWithdrawal() { //全部提现
			this.withdrawalMonery = this.detail.balance > 5000 ? 5000 : this.detail.balance
		},
		isShowWithdraw() {
			if(Number(this.withdrawalMonery) < 10 || Number(this.withdrawalMonery) > 5000){
				uni.showModal({
					title: '提示',
					content: `提现金额不能小于10.00或者大于5000.00`,
					showCancel: false
				})
			}else{
				this.showCalendar = true;
			}
		},
		/**
		 * 提现
		 */
		withdraw() {
			this.showCalendar = false;
			
			if (this.current != '') {
				uni.showLoading({
					title: "加载中..."
				})
				App._post_form('merchant.Wallet/applyBalance', {
					bus_id: this.$bus_id,
					withdrawal_type: this.current,
					balance: this.withdrawalMonery
				}, (res) => {
					const {code} = res
					if(code ==1) {
						uni.hideLoading();
						uni.showToast({
							title: '申请提现成功',
							icon: 'success',
							duration: 2000
						})
						setTimeout(() => {
							this.page=1
							this.getMerchantInfo()
						},2000)						
					}
				});
			} else {
				App.showSuccess('请选择提现方式');
			}
		},
		/**
		 *  tabbar选项
		 */
		TxTypeChange(e) {
			this.TxType = e;
			this.page = 1;
			this.scroll_Top = "scroll_Top_id";
			uni.showLoading();
			this.storeList = [];
			this.showLoadmore = true;
			this.getMerchantInfo();
		},
		/**
		 * 上拉加载更多
		 */
		onScrollBottom(e) {
			console.log("到达最底部");
			let that = this,
				list_page = that.list_page;
			if (that.page >= list_page) {
				that.setData({
					showLoadmore: true
				});
				return false
			};
			!that.showLoadmore && that.toload(that.TxType, ++that.page);
		},
		toload(TxType, page) {
			let _this = this
			App._post_form('merchant.Wallet/balanceApplyLog', {
				bus_id: _this.$bus_id,
				type: _this.TxType,
				page: _this.page,
			}, _this.itemsDataMore);
		},
		/**
		 * 加载更多
		 **/
		itemsDataMore(e) {
			console.log(e, '更多数据')
			let that = this,
				storeList = that.storeList,
				storeListMore = e.data.lists.data;
			that.storeList = storeList.concat(storeListMore);
		},
		/**
		 * 滑动高度
		 */
		scrolly(e) {
			this.scroll_Top = "";
		},
		radioChange(e) {
			console.log(e.detail.value)
			this.current = e.detail.value;
		},
		/**
		 * 获取商家数据
		 */
		getMerchantInfo() {
			let _this = this
			App._post_form('merchant.Wallet/balanceApplyLog', {
				bus_id: _this.$bus_id,
				type: _this.TxType,
				page: _this.page,
			}, res => {
				const {
					code,
					data: {
						now_balance,
						lists: {
							current_page,
							last_page,
							data: store,
							total
						},
						withdrawal_type
					}
				} = res;

				if (code === 1) {
					_this.withdrawalMonery = Number(now_balance) > 5000 ? 5000 : parseFloat(now_balance).toFixed(2)
					let radioList = [];
					_this.detail = res.data;
					_this.detail.balance = parseFloat(now_balance).toFixed(2);
					_this.storeList = store;
					_this.listData.map(item => {
						if (withdrawal_type.includes(item.id)) {
							radioList.push(item);
						}
					})
					console.log(radioList)
					if (radioList.length > 0) {
						_this.radioList = radioList;
						_this.current = radioList[0]['id'];
					}
					_this.list_page = last_page;
					_this.showLoadmore = total === 0 || (_this.page === last_page)
					uni.hideLoading();
				}
			})
		}
	},
}
</script>

<style lang="scss" scoped>
.page {
	.header {
		box-sizing: border-box;
		height: 358rpx;
		background: var(--theme-color);
		border-radius: 0px 0px 10rpx 150rpx;
		padding: 40rpx 30rpx 186rpx 30rpx;
		overflow: hidden;
		margin-bottom: -186rpx;
		&-left {
			float: left;
			&-name {
				font-weight: 500;
			}
			&-box {
				font-weight: bold;
				&-num {
					font-size: 60rpx;
					font-family: Number-Font;
				}
			}
		}
	}
	.card {
		box-sizing: border-box;
		margin: 0 auto;
		width: 690rpx;
		height: 372rpx;
		background: #ffffff;
		border-radius: 10rpx;
		padding: 30rpx;
		&-title {
			font-weight: 500;
		}
		&-box {
			padding: 20rpx 0 20rpx 0;
			border-bottom: 1px solid #eeeeee;
			input {
				width: 440rpx;
				height: 42rpx;
				font-size: 42rpx;
				color: #333;
				font-family: Number-Font;
			}
		}
		&-hint {
			.iconfont {
				color: #333;
				margin-right: 10rpx;
			}
		}
		.withdraw-btn {
			width: 630rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: var(--theme-color);
			border-radius: 40rpx;
			margin: 0 auto;
			font-size: 30rpx;
			color: #000;
		}
	}

	// 之前朋友写的===================
	.cancel-data {
		border-radius: 6rpx;
	
		.cancel-title {
			font-size: 30rpx;
			color: #333333;
			padding: 0 40rpx 40rpx;
		}
	
		.tag {
			display: inline-block;
			width: 300rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			color: #ffffff;
			font-size: 20rpx;
			background-color: #2ea1fb;
			padding: 5rpx 10rpx;
			margin-right: 16rpx;
	
			&.success {
				background-color: rgb(103, 194, 58);
				display: inline;
			}
		}
	}
	.data-content {
		flex: 1;
	
		.active {
			font-weight: bold;
			color: #333333;
	
			&+.line {
				width: 28rpx;
				height: 4rpx;
				background: #FFD940;
				background: var(--theme-color);
				border-radius: 4px;
				margin: 10rpx auto 0;
			}
		}
	}
	.scroll-list{
		padding: 0 30rpx;
		margin-top: 30rpx;
	}
	.scroll-view {
		height: calc(100vh - 700rpx);
	}
	.order-pay-item {
		position: relative;
		padding: 16rpx 0;
	}
	
	.order-pay-item.pay-border {
		padding: 20rpx 0;
	}
	
	.order-pay-item .radio {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
	}
	
	.order-pay-item .iconfont {
		font-size: 42rpx;
		height: 1em;
		width: 1em;
		line-height: 1em;
		color: #CCCCCC;
	}
	
	.order-pay-item .iconfont.icon-radiobox {
		color: #FFDD00;
		color: var(--theme-color);
	}
	
	.order-pay-item image {
		width: 60rpx;
		height: 60rpx;
		display: block;
		border-radius: 50%;
		margin: 0 20rpx;
	}
	
	.order-pay-text {
		margin-left: 20rpx;
	}
	.order-pay-menu {
		width: 100vw;
		/* height: 600rpx; */
		background: #ffffff;
		border-radius: 20rpx 20rpx 0 0;
	}

	.pay-menu-title {
		font-size: 34rpx;
		color: #333333;
		line-height: 3em;
		font-weight: 400;
		text-align: center;
		position: relative;
	}

	.order-pay-list {
		padding: 30rpx;
	}

	.pay-menu-title::after {
		content: ' ';
		position: absolute;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%);
		width: 40rpx;
		height: 8rpx;
		background: #ffd940;
		background: var(--theme-color);
		border-radius: 20rpx;
	}

	.order-pay-btn {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0 30rpx 40rpx;
	}

	.order-pay-btn button {
		background: #ffdd00;
		color: #333333;
		background: var(--theme-color);
		color: var(--auxiliary-color);

		height: 84rpx;
		line-height: 84rpx;
		border-radius: 45rpx;
		font-size: 32rpx;
	}
}
</style>
