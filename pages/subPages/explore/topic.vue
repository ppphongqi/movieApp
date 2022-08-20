<template>
	<!-- 商品上新 -->
	<view :style="themeColor">
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	export default {
		data() {
			return {};
		},
		components: {},
		computed: {

		},
		onLoad(options) {
			App.hideLoading();
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>

</style>
