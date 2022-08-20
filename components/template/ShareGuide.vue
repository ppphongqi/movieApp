<template>
	<view class="pop-mask" v-if="showShareGuide" @click="showShareGuide = false">
		<!-- <image src="/static/h5/share.png" class="to-share" mode="widthFix"></image> -->
			<image src="/static/h5/share.png" class="to-share" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showShareGuide: false
			};
		},
		props: {
			// showShareGuide: Boolean
		},
		onLoad(options) {

		},
		methods: {
			showChange() {
				this.showShareGuide = !this.showShareGuide;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pop-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
		background: rgba(0, 0, 0, .5);
	}

	.to-share {
		position: fixed !important;
		z-index: 1009;
		right: 10upx;
		top: 0;
		overflow: auto;
		width: 500upx;
		height: 380upx;
	}
</style>
