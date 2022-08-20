<template>
	<view>
		<!-- 公告组 -->
		<view class="diy-notice b-f" :style="{'padding':itemStyle.margincol+'px '+itemStyle.marginrow+'px'}">
			<notice-bar :left-icon="cDefaultImgVisible ? '/static/images/diypage/notice.png' : params.thumb" :text="params.text" :color="itemStyle.textcolor" :background-color="itemStyle.bgcolor" padding-top="8" :scrollable="true" />
		</view>
	</view>
</template>

<script>
	import NoticeBar from "@/components/template/NoticeBar.vue"
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
			NoticeBar
		},
		computed: {
			cDefaultImgVisible() {
				const thumb = this.params &&　this.params.thumb || ''
				return thumb.indexOf('http') === -1
			}
		},
		beforeCreate() {

		},
		onLoad(options) {
			console.log(this.itemIndex,this.itemStyle,this.params,'====================notice')

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

</style>
