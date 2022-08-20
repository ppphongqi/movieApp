<template>
	<view>
		<view class="imgs-magic b-f" :style="{'padding':(itemStyle.gap)+'px','height':boxHeight+'vw'}">
			<view class="p-r imgs-magic-box">
				<view class="imgs-magic-item" v-for="(item,index) in imgListData" :key="index" @click="navigationTo(item.data.link)"
				 :style="{'box-sizing':'border-box','margin':itemStyle.gap+'px','top':item.style.top,'left':item.style.left,'width':item.style.width,'height':item.style.height}">
					<image class="image" :src="item.data.thumb"></image>
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
				boxHeight: 0
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
			imgListData() {
				let _this = this;
				if (_this.itemData.length > 0 && this.$store.state.systemInfo) {
					let windowWidth = this.$store.state.systemInfo.windowWidth,
						scale = windowWidth / 280,
						gap = Number(_this.itemStyle.gap),
						maxEndOver = 0,
						imgsList = _this.itemData.map(img => {
							let styleText = "",
								endHeight = Number(Number(img.data.endStart) - (Number(img.data.beginOver)) + 1);
							for (let key in img.style) {
								let styleValue = img.style[key],
									classList = ["top", "left", "width", "height"];
								if (styleValue.indexOf("px") !== -1 && key !== "box-sizing") {
									// styleValue = Number(styleValue.slice(0, -2) * scale);
									if (classList.includes(key)) {
										styleValue = Number(styleValue.slice(0, -2));
										img.style[key] = ((styleValue / 280) * (windowWidth - gap * 2) - (key == "width" || key === "height" ? gap *
												2 : 0)) +
											"px";
									}
								}
								maxEndOver = endHeight > maxEndOver ? endHeight : maxEndOver;
							}
							return img
						});
					_this.boxHeight = 100 * (isNaN(maxEndOver) || maxEndOver === 0 ? 4 : maxEndOver) / 4;
					return imgsList;
				}
			}
		},
		beforeCreate() {

		},
		onLoad(options) {

		},

		onShow() {

		},
		mounted() {

		},
		methods: {}
	}
</script>

<style>
	.imgs-magic {
		width: 100vw;
		height: 100vw;
		position: relative;
		box-sizing: border-box;
	}

	.imgs-magic-box {
		width: 100%;
		height: 100%;
		position: relative;
		box-sizing: border-box;
	}

	.imgs-magic-item {
		position: absolute;
		z-index: 1;
		background-size: 100% 100%;
	}

	.imgs-magic-item .image {
		width: 100%;
		height: 100%;
		display: block;
		box-sizing: border-box;
	}
</style>
