<template>
	<view>
		<!-- 辅助线 -->
		<view class="diy-guide" :style="{'padding': itemStyle.margincol+'px '+itemStyle.marginrow+'px', background: itemStyle.bgcolor}">
			<view class="line" :class="'line-style-'+itemStyle.display" :style="{'border-top-width': itemStyle.height+'px','border-top-color':itemStyle.color,'border-top-style':itemStyle.display === '1'?'solid':itemStyle.display === '2'?'dotted':'dashed'}">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		props: {
			itemIndex: Number,
			itemStyle: Object
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
	/* 辅助线 */
	.diy-guide{
		background: #FFFFFF;
	}
	.diy-guide .line {
		width: 100%;
	}
</style>
