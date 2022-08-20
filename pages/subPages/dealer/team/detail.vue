<template>
	<view class="contaienr" :style="themeColor">
		<view class="user-title">
			<page-header>
				<block slot="user">
					<view class="user-info dis-flex flex-y-center" v-if="Staffdetail.avatarUrl && Staffdetail.nickName">
						<image :src="Staffdetail.avatarUrl"></image>
						<view class="col-3 f-28">{{Staffdetail.nickName}}</view>
					</view>
				</block>
				<block slot="content">
					<view class="team-list dis-flex flex-dir-row">
						<view class="team-item t-c dis-flex flex-dir-column flex-x-center all">
							<view class="col-9 f-24">累计贡献返利</view>
							<view class="col-3 f-32 m-top10">{{settingData.currency}}{{Staffdetail.rebate_money}}</view>
						</view>
						<view class="team-item t-c dis-flex flex-dir-column flex-x-center already">
							<view class="col-9 f-24">已购买(单)</view>
							<view class="col-3 f-32 m-top10">{{Staffdetail.total_order}}</view>
						</view>
						<view class="team-item t-c dis-flex flex-dir-column flex-x-center">
							<view class="col-9 f-24">已邀请(人)</view>
							<view class="col-3 f-32 m-top10">{{!!Staffdetail.referee?Staffdetail.referee['total_team']:0}}</view>
						</view>
					</view>
				</block>
			</page-header>
			<view class="module-content binding-time col-6 f-26" v-if="Staffdetail.create_time">推荐绑定时间:
				{{Staffdetail.create_time}}</view>
			<view class="f-32 col-3">
				<page-nav-bar :nav-list="navList" :current="current" @navItemClick="orderTypeChange"></page-nav-bar>
			</view>
		</view>
		<view class="dealer-goods-list" :style="{'margin-top':scrollHeight+'px'}">
			<block v-if="!!distorderList&&distorderList.data.length>0">
				<dealer-goods-item :distorderList="distorderList.data"></dealer-goods-item>
				<load-more :showLoadmore="!isLoading"></load-more>
			</block>
			<block v-else>
				<Abnor :abnor="'DATA'" v-if="isAbnor"></Abnor>
			</block>
		</view>

		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import PageHeader from "@/components/template/PageHeader.vue"
	import PageNavBar from "@/components/template/PageNavBar2.vue"
	import DealerGoodsItem from "@/components/template/DealerGoodsItem.vue"
	import LoadMore from "@/components/template/Loadmore.vue"
	import Abnor from "@/components/template/Abnor.vue"
	export default {
		data() {
			return {
				recid: null,
				Staffdetail: {},
				distorderList: null,
				isAbnor: false,
				isLoading: true,
				current: 2,
				navList: [{ //is_settled
						id: 2,
						title: "普通订单"
					},
					{
						id: 3,
						title: "会员卡订单"
					}
				],
				scrollHeight: "365"
			};
		},
		components: {
			PageHeader,
			DealerGoodsItem,
			Abnor,
			PageNavBar,
			LoadMore
		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {
			this.recid = options.id;
			this.getStaffdetail(options.id, 2, 1, false, true);
		},
		methods: {
			/**
			 * 
			 */
			setScrollHeight() {
				let _this = this;
				uni.createSelectorQuery()
					// #ifdef MP-WEIXIN || MP-TOUTIAO
					.in(this)
					// #endif
					.select('.user-title')
					.boundingClientRect(data => {
						_this.scrollHeight = data.height;
						App.hideLoading();
					}).exec();
			},
			/**
			 * //获取个人分销详情
			 */
			getStaffdetail(recid, is_settled = 2, page, isPage = false, isOnload = false) {
				let _this = this;
				App._get('user.dealer.User/getStaffDetail', {
					id: recid,
					page,
					is_settled
				}, (result) => {
					let data = result.data,
						orderData = data.order;
					if (isPage) {
						if (orderData.data.length > 0) {
							_this.distorderList.data.push(...orderData.data)
						}
					} else {
						_this.setData({
							Staffdetail: data,
							distorderList: orderData,
							isAbnor: true
						});
					}
					_this.isLoading = orderData.data.length == orderData.per_page;
					if(isOnload){
						_this.$nextTick(function() {
							_this.setScrollHeight();
						})
					}else{
						App.hideLoading();
					}
					uni.hideLoading();
				});
			},
			orderTypeChange(value) {
				uni.showLoading({
					title: "加载中..."
				});
				this.current = value.id;
				this.getStaffdetail(this.recid, value.id, 1, false);
			},
		},
		onReachBottom() {
			let {
				last_page,
				current_page
			} = this.distorderList;
			// 已经是最后一页
			if (current_page >= last_page) {
				this.isLoading = false;
				return false;
			}
			// 加载下一页列表
			this.getStaffdetail(this.recid, this.current, ++this.distorderList.current_page, true);
		}
	}
</script>

<style>
	.contaienr {
		background: #FFFFFF;
		min-height: 100vh;
	}

	.user-title {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 2;
	}

	.user-info {
		margin-bottom: 20upx;
	}

	.user-info image {
		width: 78upx;
		height: 78upx;
		margin-right: 24upx;
		border-radius: 50%;
	}

	.team-item {
		width: 100%;
		height: 144upx;
		position: relative;
	}

	.team-item::after {
		content: " ";
		position: absolute;
		top: 35upx;
		right: 0;
		bottom: 35upx;
		border-right: 1upx solid #EEEEEE;
	}

	.team-item:last-child::after {
		content: none;
	}

	.binding-time {
		border-bottom: 1upx solid #EEEEEE;
	}

	.dealer-goods-list {
		padding: 0 30upx;
		box-sizing: border-box;

	}
</style>
