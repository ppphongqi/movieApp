<template>
	<view class="page-withdraw-business app-clearfix">
		<!-- 收益卡片 -->
		<view class="free-card">
			<view class="free-card__content">
				<view class="free-card__title">累计收益：{{detailsRes.withdrawals || ''}}元</view>
				<view class="free-card__text" style="margin-top: 30rpx;">待营业收益：{{detailsRes.surplus_money || ''}}元</view>
			</view>
			<view class="free-card__footer">
				<view class="free-card__footer__col">
					<view class="free-card__text">总交易：{{detailsRes.total_consumption || ''}}元</view>
				</view>
				<view class="free-card__footer__col">
					<view class="free-card__text">未收益：{{detailsRes.money || ''}}元</view>
				</view>
			</view>
		</view>
		<!-- 收益卡片 end -->
		<!-- 操作按钮 -->
		<button class="btn-normal btn-go" @click="handleBtnGoClick">提现</button>
		<!-- 操作按钮 end -->
		<!-- 提现说明 -->
		<RightsCard title="提现说明" :text="detailsRes.dealer_free_explain"></RightsCard>
		<!-- 提现说明 end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import RightsCard from './components/RightsCard.vue'
	export default {
		components: {
			RightsCard
		},
		data() {
			return {
				options: {
					// 商家id
					bus_id: 194
				},
				// 详情的接口数据
				detailsRes: {}
			}
		},
		computed: {
		},
		onLoad(options) {
			this.options = options
		},
		async onShow() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				
				await Promise.all([
					this.fetchDetailsRes().catch(() => {})
		
				])
				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
				// TODO handle the exception
			}
		},
		methods: {
			handleBtnGoClick() {
				this.navigationTo(`pages/subPages/withdraw/apply/apply?type=free&bus_id=${this.options.bus_id}`)
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._getP('dealerfree.Dealerfree/getBusinessDealerMoneyInfo', {
						bus_id: this.options.bus_id
					})
					this.detailsRes = res.data || []
				} catch (e) {
					console.log('fetchCardCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	/* 累计免单 */
	.free-card {
		box-sizing: border-box;
		width: 690rpx;
		margin: 30rpx auto;
		background-color: #FFD940;
		border-radius: 0 0 10rpx 10rpx;
		overflow: hidden;
		border-radius: 20rpx;
	}
	.free-card__content {
		padding: 30rpx;
		position: relative;
	}
	.free-card__title {
		text-align: center;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}
	.free-card__text {
		text-align: center;
		font-size: 24rpx;
		color: #333;
	}
	.free-card__footer {
		box-sizing: border-box;
		padding: 26rpx 30rpx;
		display: flex;
		background-color: #FFDC5C;
	}
	.free-card__footer__col {
		display: flex;
		justify-content: center;
		flex: 1;
	}
	/* 累计免单 end */
	.btn-go {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		max-width: 100%;
		height: 90rpx;
		margin: 30rpx auto;
		border-radius: 20rpx;
		font-size: 32rpx;
		font-weight: bold;
		background-color: #FFD940;
	}
</style>
