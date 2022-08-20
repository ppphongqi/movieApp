<template>
	<PopManager :show="topPopup" type="top" @clickmask="showTopPopup">
		<view class="soldout-main">
			<view class="header">
				<image src="/static/images/soldout.png" mode=""></image>
				<view class="title f-24 col-3 m-top20">手慢了亲,活动商品已被抢完</view>
			</view>
			<view>
				<recommend-goods :recommendclass="RecommendClass" :goods-id="recommendId" :titleType="1" :soldoutype="1"></recommend-goods>
			</view>
			<view class="more-shop f-28 col-9 t-c" @click="skipCategory">查看更多商品</view>
		</view>
		<view class="close iconfont icon-roundclose" @click="showTopPopup"></view>
	</PopManager>
</template>

<script>
	import PopManager from '@/components/template/PopManager.vue'
	import RecommendGoods from "@/components/template/RecommendGoods.vue"
	export default {
		data() {
			return {
				RecommendClass: 1,
				recommendId: this.goodsId
			};
		},
		props: {

		},
		components: {
			PopManager,
			RecommendGoods
		},
		computed: {

		},
		mounted() {

		},
		methods: {
			skipCategory() {
				uni.reLaunch({
					url: '/pages/subPages/category/index'
				});
			},
			showTopPopup() {
				this.$emit('isshowTopPopup', false)
			}
		},
		props: {
			goodsId: Number,
			topPopup: {
				type: Boolean,
				default: false
			}
		},
	}
</script>

<style>
	.soldout-main {
		width: 101vw;
		padding-top: 120upx;
		padding-bottom: 0 !important;
		background-color: #FFFFFF;
	}

	.header {
		width: 100%;
		text-align: center;
	}

	.header image {
		width: 80upx;
		height: 80upx;
	}

	.more-shop {
		height: 100upx;
		line-height: 100upx;
	}

	.close {
		font-size: 48upx;
		color: #FFFFFF;
		text-align: center;
		margin-top: 40upx;
	}
</style>
