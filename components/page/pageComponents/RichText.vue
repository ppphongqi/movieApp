<template>
	<view>
		<view class="diy-richText" :style="{'padding':itemStyle.margincol+'px '+itemStyle.marginrow+'px','background':itemStyle.bgcolor}">
		  <parse :html="params.ueditor"></parse>
		</view>
	</view>
</template>

<script>
	import Parse from "@/components/threeComponents/jyf-Parser/index"
	export default {
		data() {
			return {
				
			};
		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			params: Object
		},
		components: {
			Parse
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
.diy-richText {
  font-size: 28rpx;
}
</style>
