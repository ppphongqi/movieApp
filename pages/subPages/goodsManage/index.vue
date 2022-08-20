<!-- 商家中心上传商品后的商品列表
   商品状态
     1、出售中  操作：删除和推广
	 2、已售空  无操作
	 3、仓库中 无操作
	 4、审核状态  无操作 对审核状态进行展示
   查询
    根据分页，状态，商品名称，门店（商家中心带过来的门店id  当商家中心处于所有门店的时候，门店id传的-1），进行查询
	-->
<template>
	<view class="container" :style="themeColor">
		<view class="header b-f">
			<view class="search-part">
				<view class="iconfont icon-search"></view>
				<input type="text" value="" placeholder="搜索商品" placeholder-class="f-24 m-left12" class="f-24 col-3 " v-model="name"
				 @confirm="filterSearch('')" confirm-type="search" />
			</view>

			<view class="dis-flex flex-x-around flex-y-center f-28 col-3 m-top20">
				<view :class="{'category-item':goods_status==item.id}" v-for="(item,index) in category" :key='index' @click="filterSearch(item.id)">
					{{item.name}}
				</view>
			</view>
		</view>

		<!-- 商品列表部分 -->
		<view class="main">
			<block v-if="goodsData.length">
				<scroll-view scroll-y="true" style="height: 76vh;" @scrolltolower="getMore">
					<view class="goods-part m-top20" v-for="(item,index) in goodsData" :key="index">
						<view class="goods-item dis-flex flex-x-between flex-y-center b-f" @click.stop="handleGoodsItemClick(item,index)">
							<image :src="item.goods.image && Array.isArray(item.goods.image) && item.goods.image.length&& item.goods.image[0].file_path?item.goods.image[0].file_path:''"
							 mode=""></image>
							<view class="" style="width: calc(100% - 170rpx);">
								<view class="f-28 col-3 ">
									{{item.goods.goods_name}}
								</view>
								<view class="f-24 col-9 m-top10">
									<text>库存:{{item.goods.sku[0].stock_num}}</text>
									<text class="m-left12" v-if="item.goods.sku[0].goods_sales">销量：{{item.goods.sku[0].goods_sales}}</text>
								</view>
								<view class="dis-flex flex-x-between flex-y-center m-top10">
									<text class="col-f4 f-w f-28">￥{{item.goods.sku[0].goods_price}}</text>
									<text class="iconfont icon-jinrujiantou1" v-if="goods_status==10 && goods_status==1" @click.stop="display(index,item)"></text>
								</view>
							</view>
						</view>
						<view class="opeate-part dis-flex flex-x-around flex-y-center" v-if="item.check" @click="display(index)">
							<view class="f-24 col-f dis-flex flex-dir-column  flex-y-center" @click.stop="opeateGoods({goods_id:item.goods.goods_id,index},'del')">
								<image :src="getImageRoot('80.png')" mode=""></image>
								<view class="m-top20">
									删除
								</view>
							</view>
							<!-- #ifdef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO -->
								<label>
									<view class="f-24 col-f dis-flex flex-dir-column flex-y-center" >
											<image :src="getImageRoot('79.png')" mode=""></image>
											<button open-type="share" style="background-color: transparent;color: #fff;font-size: 24rpx;" >
												推广
											</button>
									</view>
								</label>
							<!-- #endif -->
							
							<!-- #ifdef H5 -->
							<view class="f-24 col-f dis-flex flex-dir-column flex-y-center" @click.stop="opeateGoods(item.goods,'fenxiangH5')">
								<image :src="getImageRoot('79.png')" mode=""></image>
								<view class="m-top20">
                                 推广
								</view>
							</view>
										        
							<!-- #endif -->

						</view>
						<image :src="item.status==3?getImageRoot('81.png'):(item.status==2?getImageRoot('83.png'):getImageRoot('82.png'))"
						 mode="" class="goods-status" v-if="!goods_status"></image>

					</view>
					<LoadMore :showLoadmore='isMore'></LoadMore>
				</scroll-view>

			</block>
			<block v-else="">
				<Abnor abnor='GOODS'></Abnor>
			</block>

		</view>
		<view class="">
			<button class="save-btn main-bg-color auxiliary-color f-30 col-3" @click="navigationTo('pages/subPages/goodsManage/edit?bus_id='+bus_id+'&store_id='+store_id)">
				上传商品</button>

		</view>

		<page-loading></page-loading>
		<PopupView :show='isShow' type='top' @clickmask='isShow=false'>
			<view class="">
				<image src="../../../static/h5/share.png" mode="" style="width: 640rpx;"></image>
			</view>
		</PopupView>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import Abnor from '@/components/template/Abnor.vue'
	import LoadMore from '@/components/template/Loadmore.vue'
	import PopupView from "@/components/template/PopManager.vue"
    // #ifdef H5
    import wxApi from "@/static/h5/wxApi.js"
    // #endif
	
	export default {
		data() {
			return {
				isMore: true,
				category: [{
					id: 10,
					name: '出售中'
				}, {
					id: 1,
					name: '已售空'
				}, {
					id: 20,
					name: '仓库中'
				}, {
					id: '',
					name: '审核状态'
				}],
				goods_status: 0,//当前商品所处状态 
				goodsData: [],//商品列表
				bus_id: '',
				page: 1,
				total: 0,
				last_page: 0,
				name: '',//商品名称
				shareData: {},
				store_id: '',
				isShow: false
			}

		},
		components: {
			Abnor,
			LoadMore,
			PopupView
		},
		onLoad(Option) {
			App.showLoading()
			this.bus_id = Option.bus_id
			this.store_id = Option.store_id
		},
		onShow() {
			this.clear()
			this.getGoodsList()
			
		},
		onShareAppMessage(e) {
			return this.shareData;
		},
		methods: {
			handleGoodsItemClick(item) {
				App.navigationTo({
					url: 'pages/subPages/goodsManage/edit?'+ App.urlEncode({
						bus_id: this.bus_id,
						store_id: this.store_id,
						goods_id: item.goods_id
					})
				})
			},
			display(index,item) {
				this.goodsData[index].check = !this.goodsData[index].check
				item && this.opeateGoods(item.goods,'fenxiang')
			},
			//  操作
			opeateGoods(obj, type) {
				switch (type) {
					case 'del':
						let {
							goods_id,
							index
						} = obj
						App._post_form('Goods/deleteGodos', {
							goods_id
						}, res => {
							const {
								msg,
								code
							} = res
							App.showSuccess(msg)
							code && setTimeout(() => {
								this.goodsData.splice(index, 1)
							}, 500)
						})
						break;
					case 'fenxiang':
						this.shareData = App.getPageShareData("goods", obj, this)
						break;
				    case 'fenxiangH5':
					   this.isShow = true;   
					   jWeixin.ready(() => {
					   	wxApi.wxShare(this.shareData);
					   });
				}

			},
			// 加载更多
			getMore() {
				if (this.page <= this.last_page) {
					this.page++
					this.isMore = false
					this.getGoodsList()
				}
			},
			// 获取商品数据
			getGoodsList() {
				const {
					goods_status,
					bus_id,
					page,
					name,
					store_id
				} = this,
				has_sale = goods_status == 1 ? 1 : '',
					status = goods_status == 1 ? '' : goods_status;
				this.isMore = false
				App._post_form('Goods/goodsList', {
					bus_id,
					goods_status: status,
					has_sale,
					goods_name: name,
					page,
					store_id
				}, res => {
					let {
						code,
						data: {
							total,
							last_page,
							current_page,
							data: data = []
						}
					} = res;
					data.forEach(item => {
						this.$set(item, 'check', false)
					})
					this.goodsData = this.goodsData.concat(data)
					console.log('测试goodsData',this.goodsData)
					this.setData({
						total,
						last_page
					})
					this.total == 0 || page >= last_page ? this.isMore = true : ''
				}, err => {}, complete => {
					App.hideLoading()
					uni.hideLoading()
				})
			},
			// 筛选商品数据
			filterSearch(id) {
				this.goods_status = id
				this.clear()
				uni.showLoading({
					title: "查询中..."
				})
				this.getGoodsList()
			},
			// 初始化数据
			clear() {
				this.goodsData = []
				this.page = 1
				this.last_page = 0
				this.total = 0
			}
		}
	}
</script>

<style lang="scss">
	.header {
		padding: 20rpx 30rpx 40rpx;

		.search-part {
			position: relative;
			width: 100%;
			height: 70rpx;

			.icon-search {
				position: absolute;
				top: 15rpx;
				left: 12rpx;
				z-index: 2;
			}

			input {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 70rpx;
				padding: 10rpx;
				padding-left: 40rpx;
				box-sizing: border-box;
				background: rgba(243, 243, 243, 1);
				border-radius: 35px;
			}

		}

	}

	.save-btn {
		position: fixed;
		bottom: 30rpx;
		width: 80%;
		left: 10%;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 50rpx;
		z-index: 10;
	}

	.category-item {
		position: relative;
	}

	.category-item::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -16rpx;
		width: 100%;
		height: 8rpx;
		border-radius: 4px;
		background-color: var(--theme-color);
	}

	// 商品列表部分
	.main {
		padding: 0 30rpx 20rpx;

		.goods-part {
			width: 100%;
			height: 210rpx;
			position: relative;
			border-radius: 10rpx;
			overflow: hidden;

			.goods-item {
				width: 100%;
				height: 100%;
				padding: 30rpx 20rpx;
				box-sizing: border-box;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 2;
			}

			.opeate-part {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 3;
				background-color: rgba(0, 0, 0, 0.5);

				image {
					width: 70rpx;
					height: 70rpx;
				}

			}

			.goods-item {
				image {
					width: 150rpx;
					height: 150rpx;
					border-radius: 10rpx;
				}
			}

			.goods-status {
				position: absolute;
				width: 115rpx;
				height: 115rpx;
				top: 0;
				right: 0;
				z-index: 3;
			}
		}
	}
</style>
