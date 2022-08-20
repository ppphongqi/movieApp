<template>
	<view class="page p-r b-f" :style="themeColor">
		<view class="resting">
			<image :src="getImageRoot('18.png')"></image>
			<view class="t-c f-28 col-9 m-top20">抱歉! 店铺正在装修中...</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {

			}
		},
		components: {

		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {

		},
		onShow() {
			App._get("setting/index", {}, res => {
				console.log(res);
				let uniacid = App.getUniacid();
				if (!res.data.switch) {
					uni.reLaunch({
						url: "/pages/mainPages/index/index?i=" + uniacid
					})
				}
			});
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style>
	.page {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
	}

	.page image {
		width: 420upx;
		height: 420upx;
		display: block;
	}

	.resting {
		position: absolute;
		top: 45%;
		left: 50%;
		transform: translate(-50%, -50%);
		letter-spacing: 2upx;
	}
</style>
