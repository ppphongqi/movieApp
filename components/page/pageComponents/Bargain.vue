<template>
	<view class="diy-bargain">
		<bargain-list :itemData="itemData"></bargain-list>
		<bargain-keep-in :itemData="itemData"></bargain-keep-in>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	import BargainList from "./BargainList.vue"
	import BargainKeepIn from "./BargainKeepIn.vue"
	export default {
		data() {
			return {
				currentIndex: 1
			};
		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			params: Object,
			itemData: Array
		},
		components: {
			BargainList,
			BargainKeepIn
		},
		computed: {
			
		},
		beforeCreate() {

		},
		onLoad(options) {

		},

		onShow() {

		},
		mounted() {

		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	
</style>
