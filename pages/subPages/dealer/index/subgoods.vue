<template>
	<!-- 商品上新 -->
	<view :style="themeColor">
		<view class="header">
			<!-- 返回按钮 -->
			<view class="return-btn" @click="returnBtn" data-index="0">
				<text class="iconfont icon-fanhuijiantou col-f"></text>
			</view>
		</view>
		<view class="header-bg">
			<image :src="getImageRoot('15.png')"></image>
		</view>
		<block v-if="!!shopList&&shopList.length>0">
			<scroll-view scroll-y="true" class="goods-list " :style="{'height':scrollHeight}" @scrolltolower="onScrollBottom"
			 @scroll="scrolly" :scroll-top="scroll_Top">
				<view class="goods-item dis-flex module-content" v-for="(item,index) in shopList" :key="index"
				 :data-goodsid="item.goods_id">
					<image :src="item['image'][0]['file_path']"></image>
					<view class="goods-detail dis-flex flex-dir-column flex-x-between flex-box">
						<view class="twolist-hidden f-28 col-3">{{item.goods_name}}</view>
						<view class="goods-income dis-flex flex-dir-row flex-x-between flex-y-end">
							<view class="f-28 col-m f-w dis-flex flex-y-center"><text class="price-font-family">{{settingData.currency}}{{item.sku[item.sku.length-1]['goods_price']}}</text></view>
							<view class="f-24 share-btn main-bg-color auxiliary-color" @click="skipGoods($event,item.goods_id)">购买</view>
						</view>
					</view>
				</view>
				<loadmore :showLoadmore="showLoadmore"></loadmore>
			</scroll-view>
		</block>
		<block v-else>
			<Abnor :abnor="'DATA'" v-if="isAbnor"></Abnor>
		</block>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import loadmore from "@/components/template/Loadmore.vue";
	import Abnor from "@/components/template/Abnor.vue";
	export default {
		data() {
			return {
				current: 1,
				scrollHeight: 0,
				showLoadmore: false,
				page: 1,
				shopList: [],
				scroll_Top: 0,
				shopShare: false,
				list_page: null
			};
		},
		components: {
			loadmore,
			Abnor
		},
		computed: {
	
		},
		beforeCreate() {

		},
		onLoad(options) {
			console.log(options,'options')
			
		},
		onShow() {
		
		},

		mounted() {
			this.computeScrollViewHeight();
			this.getShopList(this.current, 1);
		},
		methods: {

			/**
			 * 获取分销商品列表
			 */
			getShopList(current, page) {
				let that = this;
				App.showLoading()
				App._get('user.dealer.goods/bedealerGoods', {
					status: current,
					page
				}, (result) => {
					console.log(result)
					let data = result.data;
					that.setData({
						shopList: data.data,
						showLoadmore: (that.page === data.last_page),
						list_page: data.last_page
					});
				}, false, () => {
					App.hideLoading()
				})
			},
			/**
			 * 计算获取scroll高度
			 */
			computeScrollViewHeight: function() {
				let that = this,
					query = uni.createSelectorQuery().in(this);
				query.select('.header').boundingClientRect(function(res) {
					// header高度
					let headerHeight = res.height,
						//获取屏幕可用高度- navbar高度
						screenHeight = uni.getSystemInfoSync().windowHeight,
						//计算 scroll-view 的高度
						scrollHeight = screenHeight - headerHeight - 150;
					that.scrollHeight = `${scrollHeight}px`;
				}).exec()
			},
			/** 
			 * 上滑加载更多
			 **/
			onScrollBottom(e) {
				console.log("到达最底部");
				let that = this,
					list_page = that.list_page;
				if (that.page >= list_page) {
					that.setData({
						showLoadmore: true
					});
					return false
				};
				!that.showLoadmore && that.toload(that.current, ++that.page);
			},
			toload(current, page) {
				let that = this;
				App._get('user.dealer.goods/bedealerGoods', {
					status: current,
					page
				}, that.itemsDataMore);
			},
			/**
			 * 加载更多
			 **/
			itemsDataMore(e) {
				console.log(e, '更多数据')
				let that = this,
					shopList = that.shopList,
					shopListDataMore = e.data.data;
				that.shopList = shopList.concat(shopListDataMore);
			},
			/**
			 * 滑动高度 
			 */
			scrolly(e) {
				this.scroll_Top = e.detail.scrollTop;
			},
			/**
			 * 跳转到商品详情
			 */
			skipGoods(event, goods_id) {
				if (!this.shopShare) {
					App.navigationTo({
						url: `pages/subPages/goods/index/index?goods_id=${goods_id}`
					});
				};
			},
			/**
			 * 返回按钮
			 */
			returnBtn(e) {
				uni.reLaunch({
					url: '/pages/subPages/user/index'
				});
			}
		}
	}
</script>

<style>
	.header-bg {
		width: 100%;
		height: 300upx;
		/* position: relative; */
	}

	.header-bg image {
		width: 100%;
		height: 300upx;
	}

	.header {
		background-color: rgb(254, 215, 73);
		/*  #ifdef  MP-WEIXIN */
		height:80rpx;
		/*  #endif  */
		/*  #ifdef  H5 */
		height: 0 ;
		/*  #endif  */
		
	}

	.nav-bar-box {
		padding: 20upx 30upx 0;
		position: relative;
		overflow: hidden;
		background: #F0F0F0;
	}

	.nav-bar-list {
		height: 100upx;
		border-radius: 20upx;
		background: #FFFFFF;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
		z-index: 2;
	}

	.nav-bar-list-bg {
		width: 180%;
		height: 200upx;
		background: #FFD940;
		border-radius: 50%;
		position: absolute;
		left: -40%;
		top: -110upx;
		z-index: 1;
	}

	.nav-bar-item {
		flex: 1;
		font-size: 28upx;
		color: #333333;
		text-align: center;
		height: 100upx;
		line-height: 100upx;
		position: relative;
	}

	.nav-bar-item.active {
		font-size: 30upx;
		font-weight: 400;
	}

	.nav-bar-item.active::after {
		content: " ";
		position: absolute;
		left: 42%;
		right: 42%;
		bottom: 10upx;
		height: 4upx;
		background: #FFD940;
		border-radius: 6upx;
	}

	/* 商品列表 */
	.goods-list {
		background: #F0F0F0;
		padding: 30upx 30upx;
		box-sizing: border-box;
	}

	.goods-item {
		margin-bottom: 22upx;
		border-radius: 6upx;
	}

	.goods-list .goods-item:last-child {
		margin-bottom: 22upx;
	}

	.goods-item image {
		width: 170upx;
		height: 170upx;
		display: block;
		margin-right: 28upx;
		border-radius: 6upx;
	}

	.goods-income {
		margin-top: -24upx;
	}

	.goods-income .price-icon {
		display: inline-block;
		font-size: 20upx;
		width: 1.6em;
		height: 1.6em;
		line-height: 1.6em;
		text-align: center;
		color: #FFFFFF;
		background: #FE504F;
		border-radius: 8upx 0 0 8upx;
		margin-right: 26upx;
		position: relative;
	}

	.goods-income .price-icon::after {
		content: " ";
		position: absolute;
		top: 0;
		right: -1.6em;
		width: 0;
		height: 0;
		border: .8em solid;
		border-color: transparent transparent transparent #FE504F;
	}

	.share-btn {
		position: relative;
		background: #FFD940;
		border-radius: 40upx;
		padding: 15upx 40upx;
		color: #333333;
		box-shadow: 0 6upx 13upx 0 var(--theme-color);
		border-radius: 33px;
		z-index: 9999;
	}

	.share-btn button {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		opacity: 0;
	}

	.return-btn {
		position: absolute;
		left: 5%;
		top: 4.5%;
		width: 60upx;
		height: 60upx;
		line-height: 60upx;
		border-radius: 50%;
		text-align: center;
		background-color: rgba(0, 0, 0, .5);
		z-index: 2;
	}

	.return-btn text {
		position: relative;
		left: 14%;
	}
</style>
