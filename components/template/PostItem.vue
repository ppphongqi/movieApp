<template>
	<view class="post-item-content b-f">
		<view class="post-author dis-flex flex-y-center">
			<image src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erCztSdax7nDKM0G0kmWDCJJda8AjUVK0BuwQia2HB7voUNe72kuqBBhHLMCul0hl90l0cwziagicKNw/132"
			 class="author-avatal m-right12"></image>
			<view class="dis-flex flex-dir-column flex-x-around">
				<view class="col-3 f-26">酷酷帅源源</view>
				<view class="col-9 f-24">09-23发布</view>
			</view>
		</view>
		<view class="post-info m-top12">
			<view class="post-imgs">
				<image src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erCztSdax7nDKM0G0kmWDCJJda8AjUVK0BuwQia2HB7voUNe72kuqBBhHLMCul0hl90l0cwziagicKNw/132"
				 class="img-item"></image>
				<image src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erCztSdax7nDKM0G0kmWDCJJda8AjUVK0BuwQia2HB7voUNe72kuqBBhHLMCul0hl90l0cwziagicKNw/132"
				 class="img-item"></image>
				<image src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erCztSdax7nDKM0G0kmWDCJJda8AjUVK0BuwQia2HB7voUNe72kuqBBhHLMCul0hl90l0cwziagicKNw/132"
				 class="img-item"></image>
				<image src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erCztSdax7nDKM0G0kmWDCJJda8AjUVK0BuwQia2HB7voUNe72kuqBBhHLMCul0hl90l0cwziagicKNw/132"
				 class="img-item"></image>
				<image src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erCztSdax7nDKM0G0kmWDCJJda8AjUVK0BuwQia2HB7voUNe72kuqBBhHLMCul0hl90l0cwziagicKNw/132"
				 class="img-item"></image>
			</view>
			<view class="post-text f-28 col-3">味道好极了！！！还会继续来这里吃！！！味道好极了还会继续来这里吃！！！味道好极了！！！还会继续来这里吃！！味道好极了！！！还会继续来这里吃</view>
			<view class="post-label col-3 f-24 "><text class="label f-26">#</text>人气爆火的排队王餐厅</view>
			<view class="post-store m-top-btm20 dis-flex flex-y-center">
				<image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573647918506&di=5542d8bc8799bbcc73ed54fa11ff64db&imgtype=0&src=http%3A%2F%2Fpic23.nipic.com%2F20120830%2F7365921_123334378000_2.jpg"
				 class="store-img"></image>
				 <view class="dis-flex flex-dir-column flex-x-around">
					 <view class="col-3 f-28"></view>
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

			}
		},
		props: {

		},
		components: {

		},
		computed: {

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

<style lang="scss" scoped>
	.post-item-content {
		padding: $uni-spacing-row-lg;
		border-radius: $uni-border-radius-base;

		.post-author {
			.author-avatal {
				width: 54rpx;
				height: 54rpx;
				display: block;
				border-radius: $uni-border-radius-circle;
			}
		}

		.post-info {

			.post-imgs {
				column-count: 3;
				column-gap: 12rpx;

				.img-item {
					width: 200rpx;
					height: 200rpx;
					display: inline-block;
					margin: 12rpx auto 0;
				}
			}

			.post-label {
				padding: 12rpx 30rpx;
				background: #F9F9F9;
				border-radius: 27px;
				width: fit-content;
				margin: 12rpx 0;

				.label {
					color: #2EA1FB;
					margin: 0 12rpx;
				}
			}

			.post-store {
				padding: $uni-spacing-row-base;
				background: #F9F9F9;

				.store-img {
					width: 80rpx;
					height: 80rpx;
					display: block;
					margin-right: $uni-spacing-row-lg;
				}
			}
		}
	}
</style>
