<template>
	<view :style="themeColor">
		<web-view :src="link"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				link: ""
			}
		},
		components: {},
		computed: {},
		onLoad(options) {
			this.link = decodeURIComponent(decodeURIComponent(options.link));
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style>

</style>
