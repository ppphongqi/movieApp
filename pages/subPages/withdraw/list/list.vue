<template>
	<view :style="themeColor">
		<view class="header-box">
			<page-header>
				<block slot="content">
					<view class="header-content">
						<view class="so-able-title f-24 col-9">可提现(元)</view>
						<view class="so-money f-48 col-3">{{!!tx_money.money?tx_money.money:0}}</view>
						<view class="already-money dis-flex flex-y-center">
							<view class="already-money-title col-9 f-24">已提现(元):</view>
							<view class="already-money-num f-32 col-3">{{!!tx_money.withdrawals?tx_money.withdrawals:0}}</view>
						</view>
						<view class="Tx-btn f-28 col-3" @click="skip">提现</view>
					</view>
				</block>
			</page-header>
			<view class="navbar-Box b-f">
				<page-NewnavBar @navItemClick="TxTypeChange" :nav-list="navList" :current="TxType"></page-newnavBar>
			</view>
		</view>
		<block v-if="!!aplyList&&aplyList.length>0">
			<view class="scroll-list b-f">
				<scroll-view scroll-y="true" class="scroll-view" @scrolltolower="onScrollBottom" :scroll-top="scroll_Top" :style="{'height':solHeight}"
				 @scroll="scrolly">
					<view class="record-list">
						<view class="list-items" v-for="(items,index) in aplyList" :key="index">
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
					<loadmore :showLoadmore="showLoadmore"></loadmore>
				</scroll-view>
			</view>
		</block>
		<block v-else>
			<Abnor :abnor="'DATA'" v-if="isAbnor"></Abnor>
		</block>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from '@/common/js/app.js';
	import PageNewnavBar from '@/components/template/PageNavBar2.vue';
	import PageHeader from '@/components/template/PageHeader';
	import loadmore from "@/components/template/Loadmore.vue";
	import Abnor from "@/components/template/Abnor.vue";
	export default {
		data() {
			return {
				solHeight: null,
				TxType:0,
				status: 1,
				page: 1,
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
				showLoadmore: false,
				isAbnor: false,
				tx_money: {},
				aplyList: [],
				scroll_Top: 0,
				list_page: null
			};
		},
		components: {
			PageNewnavBar,
			PageHeader,
			loadmore,
			Abnor
		},
		computed: {
			appDiyFont() {
				let appSetting = this.$store.state.appSetting;
				if (appSetting) {
					uni.setNavigationBarTitle({
						title:appSetting.diy_font&& appSetting.diy_font.detailed ?appSetting.diy_font.detailed:''
					});
					return appSetting.diy_font
				}
			},
			actualMoney() {
				return (money, commission) => {
					return (money - commission).toFixed(2);
				}
			}
		},
		beforeCreate() {

		},
		onLoad(options) {
			this.scrolHeight();
			this.applyDetailList(0, 1);
		},
		onShow() {

		},
		mounted() {

		},
		methods: {
			/**
			 *  tabbar选项
			 */
			TxTypeChange(e) {
				this.TxType = e.id;
				this.page = 1;
				this.scroll_Top = 0;
				uni.showLoading();
				this.applyDetailList(this.TxType, 1);
			},
			/**
			 * 获取scroll高度
			 */
			getViewHeight(className) {
				let that = this;
				return new Promise((reslove, reject) => {
					uni.createSelectorQuery().in(that).select(`.${className}`).fields({
						size: true,
					}, data => {
						if (!!data) {
							reslove(data.height);
						}
					}).exec();
				})
			},
			scrolHeight() {
				let that = this;
				uni.getSystemInfo({
					success(res) {
						let windowHeight = res.windowHeight;
						let heightList = ["header-box"].map(val => that.getViewHeight(val));
						Promise.all(heightList).then(heights => {
							let scollViewHeight = windowHeight - heights[0];
							that.solHeight = `${scollViewHeight}px`;
						})
					}
				});
			},
			/**
			 * 跳转提现页面
			 */
			skip() {
				App.navigationTo({
					url: 'pages/subPages/withdraw/apply/apply'
				})
			},
			/**
			 * 明细详情列表
			 */
			applyDetailList(TxType, page) {
				let that = this;
				App._get('user.dealer.Withdraw/withdrawDetail', {
					apply_status: TxType,
					page
				}, (result) => {
					let data = result.data;
					that.tx_money = {
						'money': data.money,
						'withdrawals': data.withdrawals
					};
					that.setData({
						aplyList: data.list.data,
						showLoadmore: (that.page === data.list.last_page),
						list_page: data.list.last_page,
						isAbnor: true
					});
					App.hideLoading()
				}, false, () => {
					uni.hideLoading()
				})
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
				!that.showLoadmore && that.toload(that.current, ++that.page);
			},
			toload(TxType, page) {
				let that = this;
				App._get('user.dealer.Withdraw/withdrawDetail', {
					apply_status: TxType,
					page
				}, that.itemsDataMore);
			},
			/**
			 * 加载更多
			 **/
			itemsDataMore(e) {
				console.log(e, '更多数据')
				let that = this,
					aplyList = that.aplyList,
					aplyDataMore = e.data.list.data;
				that.aplyList = aplyList.concat(aplyDataMore);
			},
			/**
			 * 滑动高度
			 */
			scrolly(e) {
				this.scroll_Top = e.detail.scrollTop;
			},
		}
	}
</script>

<style>
	.header-content {
		position: relative;
		padding: 36upx 34upx 44upx 34upx;
	}

	.so-money {
		letter-spacing: 1upx;
	}

	.already-money {
		margin-top: 28upx;
	}

	.already-money-title {
		margin-right: 10upx;
	}

	.Tx-btn {
		position: absolute;
		right: 34upx;
		bottom: 15%;
		width: 130upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
		border: 1px solid #EEEEEE;
		border-radius: 30upx;
		background-color: #FFFFFF;
	}

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
