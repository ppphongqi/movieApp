<!-- 余额明细 -->
<template>
	<view class="container" :style="themeColor">
		<page-nav-bar @navItemClick="navListChange" :nav-list="navList" :current="dataType" fixed="1" default_check='all'></page-nav-bar>
		<view class="recharge-list">
			<block v-if="listData.data.length>0">
				<block v-for="(item,index) in listData.data" :key="index">
					<view class="recharge-item dis-flex flex-x-between flex-y-center b-f">
						<view class="t-l">
							<view class="col-3 f-28">{{item.explain}}</view>
							<view class="f-24 col-9 m-top12">{{item.pay_time}}</view>
						</view>
						<view class="col-3 f-28">{{item.update_money}}</view>
					</view>
				</block>
				<load-more :showLoadmore="!isMore"></load-more>
			</block>
			<block v-else>
				<view class="recharge-abnor">
					<Abnor :abnor="'DATA'"></Abnor>
				</view>
			</block>
		</view>
		<!-- 		<form @submit="saveFormId" report-submit="" class="recharge-btn-box" v-if="classs === '2'">
			<button class="recharge-btn f-30 col-3 main-bg-color auxiliary-color" form-type="submit" @click="navigationTo('pages/subPages/balance/recharge')">充值</button>
		</form> -->

		<view class="page__footer app-wrapper--safe-fixed-bottom">
			<button v-if="settingData && settingData.balance && settingData.balance.withdrawal_open==1" class="page__btn-withdrawal btn-normal" @click="navigationTo('pages/subPages/balance/withdrawal')">提现</button>
			<button class="page__btn-recharge btn-normal main-bg-color auxiliary-color" @click="navigationTo('pages/subPages/balance/recharge')">充值</button>
		</view>

		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import PageNavBar from "@/components/template/PageNavBar2.vue"
	import LoadMore from "@/components/template/Loadmore.vue"
	import Abnor from "@/components/template/Abnor.vue"
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				navList: [{
						id: "all",
						title: "全部",
					},
					{
						id: "income",
						title: "收入",
					},
					{
						id: "outlay",
						title: "支出",
					}
				],
				listData: [],
				isMore: true,
				classs: 0,
				types: 0, //0-全部 1收入 2-支出
				page: 2,
				dataType: 'all'

			};
		},
		components: {
			PageNavBar,
			LoadMore,
			Abnor
		},
		computed: {},
		watch: {
			classs(newValue, oldValue) {
				let settingData = this.settingData;
				if (settingData.balance) {
					uni.setNavigationBarTitle({
						title: `${newValue === "1" ? settingData.balance.integral_str : settingData.balance.balance_str}明细`
					});
				}

			}
		},
		onLoad(options) {
			let classs = options.classs;
			this.classs = classs;
			this.getListData(options.classs, 0, 1);
		},
		methods: {
			navListChange(e) {
				this.page = 1;
				this.types = e.index;
				this.isPage = true;
				uni.pageScrollTo({
					duration: 0,
					scrollTop: 0
				})
				uni.showLoading({
					title: "加载中..."
				})
				this.getListData(this.classs, e.index, 1);
			},
			getListData(classs, types = 0, page, isPage = false) {
				let _this = this;
				App._get("balance.Balance/balanceAndIntIntegral", {
					classs,
					types,
					page
				}, res => {
					let listData = res.data;
					if (listData && listData.data.length) {
						listData.data.map(val => {
							val.pay_time = _this.$util.formatTime(val.pay_time, "info", "-");
							val.update_money = val.types === 2 ? val.update_money : `+${val.update_money}`;
							val.explain = val.explain ? val.explain : (val.types === 2 ? "后台扣款" : "后台充值");
						})
					}

					if (isPage) {
						if (listData.data.length > 0) {
							_this.listData.data.push(...listData.data)
						}
					} else {
						_this.listData = listData;
					}
					_this.isMore = listData.data.length == listData.per_page;
					uni.hideLoading();
					App.hideLoading();
				})
			}
		},
		onReachBottom() {
			let _this = this,
				listData = _this.listData;
			console.log("getListData");
			console.log(_this.page, listData.last_page);
			if (_this.page <= listData.last_page) {
				_this.getListData(_this.classs, _this.types, ++_this.page, true);
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {

		.recharge-list {
			margin: 120rpx 30rpx 120rpx;
			margin-top: 20rpx;

			.recharge-item {
				padding: 40rpx 30rpx;
				border-bottom: 1rpx solid #EEEEEE;

				&:first-child {
					border-radius: 10rpx 10rpx 0 0;
				}

				&:last-child {
					border-bottom: 0;
					border-radius: 0 0 10rpx 10rpx;
				}
			}
		}

		.recharge-btn-box {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			height: 100rpx;
			line-height: 100rpx;
			z-index: 2;

			.recharge-btn {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 1;
				line-height: 100rpx;
				background: #FFD940;
				border-radius: 0;
			}
		}
	}

	.page__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 140rpx;
		padding: 0 30rpx;
		background: #FFFFFF;
		border-radius: 30rpx 30rpx 0 0;
	}

	.page__btn-withdrawal {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 80rpx;
		font-size: 28rpx;
		color: #333;
		background: transparent;
		border: 1px solid #333;
		border-radius: 9999rpx;
	}

	.page__btn-recharge {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 80rpx;
		font-size: 28rpx;
		border-radius: 9999rpx;
		.page__btn-withdrawal+& {
			margin-left: 20rpx;
		}
	}
</style>
