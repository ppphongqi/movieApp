<template>
	<view class="container" :style="themeColor">
		<view class="header-img p-r t-c">
			<image  :src="getImageRoot('7.png')"></image>
			<view class="success-text f-32 col-3">核销成功</view>
		</view>
		<view class="success-bd" v-if="!!checkData">
			<view class="tips-list">
				<view class="tips-item dis-flex flex-x-between flex-y-center">
					<view class="tips-label f-26 col-6">核销码</view>
					<view class="tips-text f-26 col-3">{{checkData.code}}</view>
				</view>
				<view class="tips-item dis-flex flex-x-between flex-y-center">
					<view class="tips-label f-26 col-6">核销价格</view>
					<view class="tips-text f-26 col-3">{{settingData.currency}}{{checkData.goods_price}}</view>
				</view>
				<view class="tips-item dis-flex flex-x-between flex-y-center">
					<view class="tips-label f-26 col-6">核销商品</view>
					<view class="tips-text f-26 col-3">{{checkData.goods_name}}</view>
				</view>
				<view class="tips-item dis-flex flex-x-between flex-y-center">
					<view class="tips-label f-26 col-6">核销时间</view>
					<view class="tips-text f-26 col-3">{{checkData.check_time}}</view>
				</view>
			</view>
			<button @click="backCheck">继续核销</button>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				options: null,
				checkData: null
			}
		},
		components: {

		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {
			this.options = options;
			this.getDetail(options.order_id, options.vercode_id);
		},
		onShow() {

		},
		mounted() {

		},
		methods: {
			getDetail(order_id, vercode_id) {
				let _this = this;
				App._get('user.order/detail', {
					order_id
				}, (result) => {
					let orderInfo = result.data,
						{
							goods_price,
							goods_name
						} = orderInfo.goods[0],
						{
							code,
							check_time
						} = orderInfo.vercode.filter(val => val.vercode_id === Number(vercode_id))[0];
					_this.checkData = {
						goods_price,
						goods_name,
						code,
						check_time
					}
				});
			},
			backCheck() {
				uni.navigateBack({
					delta: 2
				})
			}
		}
	}
</script>

<style>
	.container {
		width: 100vw;
		height: 100vh;
		background: #FFFFFF;
	}

	.header-img {
		padding: 40upx 0 0;
	}

	.header-img image {
		width: 668upx;
		height: 367upx;
		display: inline-block;
	}

	.success-text {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 2em;
		text-align: center;
		font-weight: 500;
	}

	.success-bd {
		padding: 0 30upx;
	}

	.success-bd button {
		height: 74upx;
		line-height: 74upx;
		background: #FFD940;
		border-radius: 80upx;
		margin-top: 40upx;
		font-size: 28upx;
		color: #333333;
	}

	.tips-item {
		height: 65upx;
		line-height: 65upx;
	}
</style>
