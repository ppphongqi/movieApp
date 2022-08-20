<template>
	<!-- banner轮播 -->
	<view class="diy-banner">
		<swiper :autoplay="autoplay" class="banner-box swiper-box b-f" :class="['dot-'+itemStyle.btnShape]" :circular="true"
		 @change="_bindChange" :data-item-key="itemIndex" :style="{'height':imgHeight+'px'}">
			<swiper-item v-for="(banner,index) in itemData" :key="index">
				<image @click="navigationTo(banner.link)" @load="_imagesHeight($event,index)" class="slide-image" :src="banner.thumb"></image>
			</swiper-item>
		</swiper>
		<view class="swiper-indicator" :class="indicatorStyle" :style="{'text-align':itemStyle.align == 1?'left':itemStyle.align == 2?'center':'right'}">
			<block v-if="indicatorStyle !== 'arc2'">
				<view class="indicator-item" :class="{'active':imgCurrent === index }" v-for="(item,index) in itemData" :key="index"></view>
			</block>
			<block v-else>
				<view class="indicator-item">{{imgCurrent+1}}/{{itemData.length}}</view>
			</block>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				// banner轮播组件属性
				indicatorDots: true, // 是否显示面板指示点	
				autoplay: true, // 是否自动切换

				imgHeight: 0, // 图片的高度
				imgCurrent: 0, // 当前banne所在滑块指针
			};
		},
		props: {
			itemId: String,
			itemIndex: Number,
			itemStyle: Object,
			itemData: {
				type: Array,
				default: () => []
			},
			params: Object
		},
		components: {

		},
		computed: {
			indicatorStyle() {
				//下标样式 1圆角 2椭圆  3矩形 4椭圆数字
				let borderstyle = this.itemStyle.borderstyle;
				return borderstyle == 1 ? "round" : borderstyle == 2 ? "arc" : borderstyle == 3 ? "square" : "arc2";
			}
		},
		beforeCreate() {

		},
		mounted() {
			let bannerHeight = uni.getStorageSync("bannerHeight") || {};
			if (typeof bannerHeight === "number") {
				bannerHeight = {};
			}
			if (!!bannerHeight[this.itemId]) {
				this.imgHeight = bannerHeight[this.itemId];
			}
		},
		methods: {
			/**
			 * 计算图片高度
			 */
			_imagesHeight(e, imgIndex) {
				if (imgIndex !== 0) return;
				let _this = this,
					systemInfo = _this.$store.state.systemInfo;
				// 获取图片真实宽度
				let itemId = _this.itemId,
					imgwidth = e.detail.width,
					imgheight = e.detail.height,
					// 宽高比
					ratio = imgwidth / imgheight;
				// 计算的高度值
				let viewHeight = systemInfo.windowWidth / ratio,
					bannerHeight = uni.getStorageSync("bannerHeight") || {};
				if (typeof bannerHeight === "number") {
					bannerHeight = {};
				}
				if (!bannerHeight[itemId]) {
					bannerHeight[itemId] = viewHeight;
					_this.imgHeight = viewHeight;
				} else {
					if (bannerHeight[itemId] !== viewHeight) {
						bannerHeight[itemId] = viewHeight;
						_this.imgHeight = viewHeight;
					}
				}
				uni.setStorageSync("bannerHeight", bannerHeight);
			},

			/**
			 * 记录当前指针
			 */
			_bindChange(e) {
				this.imgCurrent = e.detail.current;
			},
		},
	}
</script>

<style>
	/* banner轮播 */

	.diy-banner {
		position: relative;
	}

	.diy-banner .slide-image {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		display: block;
	}

	/* 底部指示器 */
	.swiper-indicator {
		height: 28upx;
		padding: 0 20upx;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 20upx;
	}

	.indicator-item {
		display: inline-block;
		height: 12upx;
		width: 12upx;
		border-radius: 20upx;
		background: rgba(204, 204, 204, .6);
		margin: 0 8upx;
		font-size: 24upx;
	}

	.swiper-indicator.arc .indicator-item {
		width: 24upx;
		border-radius: 12upx;
	}

	.swiper-indicator.square .indicator-item {
		display: inline-block;
		height: 6upx;
		width: 32upx;
		border-radius: 0;
	}

	.swiper-indicator.arc2 .indicator-item {
		width: auto;
		height: 28upx;
		line-height: 28upx;
		color: #fff;
		padding: 0 10upx;
		vertical-align: top;
	}

	.indicator-item.active {
		background: #fff;
	}
</style>
