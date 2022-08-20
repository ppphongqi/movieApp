<template>
	<view>
		<!-- 单图组 -->
		<view class="diy-imageSingle" :style="{'background':itemStyle.bgcolor}">
			<view class="item-image" v-for="(dataItem,index) in itemData" :key="index" :style="{'padding':'0 '+itemStyle.marginrow+'px','margin':itemStyle.margincol+'px 0'}">
				<view class="nav-to" @click="navigationTo(dataItem.link)" v-if="!!dataItem.thumb">
					<image class="image" :src="dataItem.thumb" mode="widthFix"></image>
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

			};
		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			params: Object,
			itemData: Array
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

		},
		mounted() {

		},
		methods: {
		}
	}
</script>

<style>
	.diy-imageSingle{
		overflow: hidden;
	}
	.diy-imageSingle .item-image .image {
		display: block;
		width: 100%;
	}
</style>
