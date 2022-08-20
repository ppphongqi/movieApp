<template>
	<view class="page-posterGoods app-clearfix">
		<!-- banner -->
		<image class="page-posterGoods__banner" :src="cBannerImgUrl" mode="aspectFill"></image>
		<!-- banner end -->
		<posterGoodsList :list="cGoodsList" @on-item-click="handleGoodsItemClick"></posterGoodsList>
		<!-- 首页按钮 -->
		<view class="c-nav-round" @click="navigationTo('pages/mainPages/index/index')">
			<view class="c-nav-round__icon iconfont icon-shouye_huaban1"></view>
			<view class="c-nav-round__text">首页</view>
		</view>
		<!-- 首页按钮 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import posterGoodsList from './components/posterGoodsList.vue'
	export default {
		components: {
			posterGoodsList
		},
		data() {
			return {
				// 详情的接口数据
				detailsRes: {}
			}
		},
		computed: {
			// banner图片地址
			cBannerImgUrl() {
				return this.detailsRes.banner_img
			},
			// 格式化的商品列表数据
			cGoodsList() {
				const list = this.detailsRes.goods_data || []
				return list.map(item=>({
					id: item.goods_id,
					imgSrc: this.$util.deepGet(item,'image.0.file_path',''),
					title: item.goods_name,
					price: this.$util.deepGet(item,'sku.0.goods_price',''),
					linePrice: this.$util.deepGet(item,'sku.0.line_price',''),
				}))
			}
		},
		onLoad(options) {
			this.options = options
			if (options.scene) {
				const queryData = this.$util.scene_decode(options.scene) || {}
				this.options = {
					id: queryData.id,
					...this.options
				}
			}
		},
		async onShow() {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff",
			});
			try {
				await this.mainMixin_BeforeFetchPageData()
				await Promise.all([this.fetchDetailsRes()])
			} catch (e) {
				console.log('onShow 报错', e)
			}
			App.hideLoading()
		},
		methods: {
			// 商品列表项点击事件
			handleGoodsItemClick(item) {
				console.log('handleGoodsItemClick')
				App.navigationTo({
					url: 'pages/subPages/goods/index/index',
					query: {
						goods_id: item.id
					}
				})
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._getP('user.dealer.Goods/mergePosterList',{
						id: this.options.id
					})
					this.detailsRes = this.$util.deepGet(res, 'data', {})
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-posterGoods__banner {
		display: block;
		width: 690rpx;
		height: 330rpx;
		margin: 20rpx auto;
		border-radius: 20rpx;
	}
	
	.c-nav-round {
		position: fixed;
		right: 30rpx;
		bottom: 100rpx;
		box-sizing: border-box;
		width: 100rpx;
		height: 100rpx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background-color: #F9D235;
		border-radius: 100%;
	}
	.c-nav-round__icon {
		color: #333333;
		font-size: 36rpx;
	}
	.c-nav-round__text {
		color: #333333;
		font-size: 24rpx;
	}
</style>
