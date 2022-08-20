<template>
	<view>
		<view class="loading-box" v-if="loading">
			<block v-if="settingData && settingData.loading_img">
				<view class="diy-loading">
					<image class="loading-image" :src="settingData.loading_img"></image>
					<!-- <view class="loading-text">努力加载中...</view> -->
				</view>
			</block>
			<block v-else>
				<view class="ball-clip-rotate-pulse" :style="{color: settingData.description}">
					<view :style="{backgroundColor: settingData.icon_color}"></view>
					<view :style="{borderColor: `${settingData.icon_color || '#ffe26e'} transparent ${settingData.icon_color || '#ffe26e'} transparent`}"></view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				pageRoute: "",
				loading: true,
				isHide: false
			};
		},
		created() {
			// console.log("created hideLoading");
			uni.$once("hideLoading", this.hideLoading);
		},
		methods: {
			// showLoading() {
			// 	this.loading = true;
			// },
			hideLoading(res) {
				// console.log("$on hideLoading", res);
				this.loading = res;
			}
		}
	}
</script>

<style>
	.loading-box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 900;
		background: #F4F4F4;
	}
</style>
