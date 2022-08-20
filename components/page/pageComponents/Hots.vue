<template>
	<view class="container bg-w p-r" v-if="params.thumb && params.thumb.file_path">
		<image :src="params.thumb.file_path" mode="widthFix" class="hots-bg"></image>
		<block v-for="(item,index) in hotsList" :key="index">
			<view class="hot-item" :style="{'top':item.pos_y,'left':item.pos_x,'z-index':item.z_index,'width':item.width,'height':item.height}"
			 @click="navigationTo(item.link)"></view>
		</block>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {};
		},
		props: {
			itemIndex: Number,
			params: Object,
			itemData: Array
		},
		components: {

		},
		computed: {
			hotsList() {
				let {
					itemData,
					params: {
						fixed, //热区相对计算宽度
						thumb
					},
					$store: {
						state: {
							systemInfo
						}
					}
				} = this;
				if (Array.isArray(itemData) && itemData.length > 0 && systemInfo) {
					let windowWidth = systemInfo.windowWidth, //屏幕宽度
						imgScale = thumb.x / thumb.y, //原图宽高比
						realHeight = windowWidth / imgScale, //图片显示高度
						hotScale = windowWidth / fixed, //热区计算比例
						hots = itemData.map(val => {
							let calcAttr = ["width", "height", "pos_x", "pos_y"],
								item = {};
							for (let key in val) {
								item[key] = calcAttr.includes(key) ? parseInt(val[key] * hotScale) + "px" : val[key];
							}
							return item;
						});
					return hots;
				}
			}
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style>
	.hots-bg {
		width: 100%;
		display: block;
		position: relative;
		z-index: 1;
	}

	.hot-item {
		position: absolute;
	}
</style>
