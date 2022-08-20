<template>
	<view class="page" v-show="mask">
		<view class="mask-view"></view>
		<view class="write-main">
			<view class="write-content b-f">
				<view class="write-title f-32 col-3 t-c">温馨提示</view>
				<view class="write-text f-24 col-6 t-c">你已注销此平台账号,当前服务不可用,如需继续使用服务请重新激活账号</view>
				<view class="write-btn">
					<view class="confim m-btm20 t-c f-32" @click="activate">重新激活</view>
					<view class="cancel t-c f-32" @click="hideMask">暂不激活</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				mask: null
			};
		},
		components: {

		},
		computed: {

		},
		beforeCreate() {

		},
		mounted() {
			this.mask = uni.getStorageSync('iswrite') === 2;
		},
		onLoad(options) {

		},
		methods: {
			activate() {
				let that = this;
				uni.showLoading({})
				App._post_form('user/updateStatus', {
					user_id: uni.getStorageSync('user_id'),
					status: 1
				}, (res) => {
					if (res.code === 1) {
						that.$store.commit('iswrite', 1);
						that.mask = false;
						App.showSuccess('账号激活成功')
					}
				}, false, () => {
					uni.hideLoading()
				})
			},
			hideMask() {
				this.mask = false;
			}
		}
	}
</script>

<style>
	.page {
		position: relative;
	}

	.mask-view {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .4);
		left: 0;
		top: 0;
		z-index: 100;
	}

	.write-main {
		position: fixed;
		width: 100%;
		z-index: 101;
		left: 0;
		top: 45%;
		transform: translateY(-50%);
	}

	.write-main .write-content {
		margin: 0 5%;
		/* height: 360upx; */
		padding: 20upx 0;
		border-radius: 6upx;
	}

	.write-title {
		margin-top: 30upx;
		margin-bottom: 30upx;
	}

	.write-text {
		/* padding: 0 30upx; */
		margin: 0 auto 30upx auto;
		width: 51%;
	}

	.write-btn {
		padding: 0 30upx;
	}

	.write-btn view {
		height: 90upx;
		line-height: 90upx;
		border-radius: 50upx;
	}

	.write-btn .confim {
		background-color: rgb(255, 221, 0);
	}

	.write-btn .cancel {
		border: 1px solid rgb(105, 105, 105);
	}
</style>
