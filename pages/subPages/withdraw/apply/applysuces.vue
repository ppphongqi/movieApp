<template>
	<view :style="themeColor">
		<view class="page b-f" :style="{'height':pageHeight}" v-if="isPageShow">
			<view class="header-banner p-left-right-30">
				<image :src="getImageRoot('9.png')"mode="widthFix"></image>
				<view class="f-24 col-3 banner-text">请耐心等待系统审核...</view>
			</view>
			<view class="msg-content p-left-right-30">
				<view class="msg-items dis-flex flex-x-between f-24 marbtm-47">
					<view class="col-6">提现记录</view>
					<view class="col-3">{{settingData.currency}}{{apyDetail.money}}</view>
				</view>
				<view class="msg-items dis-flex flex-x-between f-24 marbtm-47">
					<view class="col-6">提现渠道</view>
					<view class="col-3">{{apyDetail.pay_type===10?'微信':(apyDetail.pay_type===20?'支付宝':'银行卡')}}</view>
				</view>
				<block v-if="apyDetail.pay_type!==10">
					<view class="msg-items dis-flex flex-x-between f-24 marbtm-47">
						<view class="col-6">提现账户</view>
						<view class="col-3">{{!!apyDetail.bank_card?apyDetail.bank_card:alipay_account}}</view>
					</view>
				</block>
				<view class="msg-items dis-flex flex-x-between f-24 marbtm-47">
					<view class="col-6">提交时间</view>
					<view class="col-3">{{apyDetail.create_time}}</view>
				</view>
			</view>
			<view class="suces-btn f-28 col-3" @click="redireskip">完成</view>
		</view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from '@/common/js/app.js';
	export default {
		data() {
			return {
				pageHeight: null,
				apply_id: null,
				isPageShow: false,
				apyDetail: {}
			}
		},
		components: {

		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {
			this.apply_id = options.id
		},

		onShow() {

		},
		mounted() {
			this.pgHeight()
			this.getapySuces(this.apply_id)
		},
		methods: {
			pgHeight() {
				let that = this;
				uni.getSystemInfo({
					success(res) {
						let pageHeight = res.windowHeight;
						that.pageHeight = `${pageHeight}px`;
					}
				});
			},
			/**
			 * 成功详情
			 */
			getapySuces(apply_id) {
				App.showLoading()
				let that = this;
				App._get('user.dealer.Withdraw/applySuccess', {
					id: apply_id
				}, (result) => {
					console.log(result)
					if (result.code === 1) {
						let data = result.data;
						this.isPageShow = true;
						that.setData({
							apyDetail: data
						})
					}
				},false,()=>{
					App.hideLoading()
				})
			},
			/**
			 * 跳转提现明细
			 */
			redireskip() {
				App.navigationTo({
					url:'pages/subPages/withdraw/list/list',
					redirectTo: true
				})
			}
		}
	}
</script>

<style>
	.marbtm-47 {
		margin-bottom: 47upx;
	}

	.suces-btn {
		background: #FFD940;
		height: 74upx;
		line-height: 74upx;
		text-align: center;
		border-radius: 38upx;
		margin: 0 30upx;
	}

	.header-banner {
		padding: 58upx 30upx;
	}

	.header-banner image {
		width: 100%;
	}

	.banner-text {
		text-align: center;
	}
</style>
