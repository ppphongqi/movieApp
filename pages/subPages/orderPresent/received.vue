<template>
	<view class="page-received app-clearfix">
		<!-- header -->
		<view class="page-received__header app-card app-card--fluid app-card--transparent col-f">
			<view class="app-flex app-flex--align-center app-flex--justify-center">
				<view class="app-flex-item f-36">
					<view class="iconfont is-size-inherit icon-chenggong"></view>
				</view>
				<view class="app-flex-item f-36 f-bold">
					已领取成功
				</view>
			</view>
			<view class="app-flex app-flex--align-center app-flex--justify-center m-top40">
				<view class="app-flex-item app-flex-item--1">
					<button class="btn-normal page-received__btn-go" style="color: #fff;" @click="navigationTo('pages/mainPages/index/index')">再逛逛</button>
				</view>
				<view class="app-flex-item app-flex-item--1">
					<button class="btn-normal page-received__btn-go" style="color: #fff;" @click="navigationTo('pages/mainPages/order/index?type=all')">查看订单</button>
				</view>
			</view>
		</view>
		<!-- header end -->
		<view class="page-received__content app-card app-card app-card--fluid">
			<view class="app-flex app-flex--justify-center">
				<view class="app-flex-item f-36 col-3 f-bold">-为您推荐-</view>
			</view>
			<view style="margin: 0 -30rpx;">
				<recommend-goods v-if="options.goods_id" :recommendclass="1" :isShowCopyRight="false" :isShowTitle="false" :goodsId="options.goods_id"></recommend-goods>
			</view>
		</view>
	</view>
</template>

<script>
	import RecommendGoods from '@/components/template/RecommendGoods.vue'
	import App from '@/common/js/app.js'
	export default {
		components: {
			RecommendGoods
		},
		data() {
			return {
				options: {
					goods_id: ''
				}
			}
		},
		onLoad(options) {
			this.options = options
		},
		async onShow() {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#F8F8F8",
			});
			try {
				await this.mainMixin_BeforeFetchPageData()
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#F8F8F8",
				});
				await Promise.all([])
				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
				// TODO handle the exception
			}
		},
	}
</script>

<style lang="scss" scoped>
	.page-open {
		box-sizing: border-box;
		min-height: 100vh;
		background-color: #fff;
	}
	.page-received__header{
		padding: 80rpx 85rpx;
		margin: 0 auto;
		background-color: rgb(254,103,94);
	}
	.page-received__btn-go {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 80rpx;
		border-radius: 20rpx;
		color: #fff;
		font-size: 28rpx;
		border: 1px solid #fff;
	}
	.page-received__content {
		margin: 0 auto;
		border-radius: 30rpx 30rpx 0 0;
		margin-top: -40rpx;
	}
</style>
