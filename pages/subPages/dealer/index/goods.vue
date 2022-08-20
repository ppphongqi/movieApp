<!-- 分销商品 -->
<template>
	<view class="container" :style="themeColor">
		<view class="dealer-goods-title main-bg-color">
			<view class="f-w col-3 f-36 auxiliary-color">必推热门爆款</view>
			<view class="col-3 f-24 m-top16 auxiliary-color dis-flex flex-y-center flex-x-between">
				分享超值好物，锁定长期收益
				<view class=" col-3 f-24  auxiliary-color copy m-left12" @click="extendLink" v-if="my_shop_is_copy==1">推广链接</view>
				<view class=" col-3 f-24  auxiliary-color copy m-left12" @click="copyLink" v-if="my_shop_is_copy==1">复制链接</view>
			</view>

			<view class="dealer-goods-filter dis-flex flex-y-center m-top40">
				<view class="goods-filter-item dis-flex flex-x-center flex-y-center" :class="sortData.total_sales" @click="sortChange('total_sales')">
					<view class="col-3 f-30 auxiliary-color">销量</view>
					<view class="filter-icon auxiliary-bg-color"></view>
				</view>
				<view class="goods-filter-item dis-flex flex-x-center flex-y-center" :class="sortData.rebate_commission" v-if="isDealerUser"
				 @click="sortChange('rebate_commission')">
					<view class="col-3 f-30 auxiliary-color">收益</view>
					<view class="filter-icon auxiliary-bg-color"></view>
				</view>
				<view class="goods-filter-item dis-flex flex-x-center flex-y-center" @click="sortChange('create_time')">
					<view class="f-30" :class="[sortData.create_time ==='desc'?'auxiliary-color':'help_color']">最新</view>
				</view>
				<view class="goods-filter-item dis-flex flex-x-center flex-y-center">
					<view class="goods-filter-search dis-flex flex-x-center flex-y-center p-r" :style="{width:isDealerUser?'222rpx':'400rpx'}">
						<view class="iconfont icon-search_light"></view>
						<input type="text" value="" class="flex-box" placeholder="搜索好物" v-model="searchText" confirm-type="search"
						 @confirm="getGoodsList(searchText,sortData,1)" :placeholder-style="inputPlace" />
					</view>
				</view>
			</view>
		</view>
		<view class="dealer-goods-list" v-if="goodsData.data">
			<block v-for="(item,index) in goodsData.data" :key="item.goods_id">
				<view class="dealer-goods-item dis-flex" @click="navigationTo('pages/subPages/goods/index/index?goods_id='+item.goods_id)">
					<image :src="!!item.file&&!!item.file.file_path?item.file.file_path:''" class="goods-image"></image>
					<view class="dis-flex flex-dir-column flex-x-between flex-box">
						<view class="col-3 f-28" :class="[isDealerUser?'onelist-hidden':'twolist-hidden']">{{item.goods_name}}</view>
						<block v-if="isDealerUser">
							<view class="goods-income dis-flex flex-y-center">
								<view class="income-item">{{appDiyFont.d_selling}}{{settingData.currency}}{{item.rebate_commission}}</view>
								<view class="income-item" v-if="item.team_commission !== ''">{{appDiyFont.g_selling}}{{settingData.currency}}{{item.team_commission}}</view>
							</view>
							<view class="goods-price dis-flex flex-y-line">
								<view class="col-m f-28">{{settingData.currency}}{{item.goods_price}}</view>
								<view class="col-9 f-24 m-left12">{{settingData.currency}}{{item.line_price}}</view>
							</view>
							<view class="goods-handle dis-flex flex-y-center">
								<view class="handle-item" @click.stop="navigationTo('pages/subPages/goods/spread?goods_id='+item.goods_id)">推广文案</view>
								<view class="handle-item main-bg-color auxiliary-color" @click.stop="navigationTo('pages/subPages/goods/index/index?goods_id='+item.goods_id)">分享赚</view>
							</view>
						</block>
						<block v-else>
							<view class="dis-flex flex-x-between flex-y-center">
								<view class="goods-price dis-flex flex-y-line">
									<view class="col-m f-32">{{settingData.currency}}{{item.goods_price}}</view>
									<view class="col-9 f-26 m-left12">{{settingData.currency}}{{item.line_price}}</view>
								</view>
								<view class="go-buy col-3 f-26 t-c">去购买</view>
							</view>
						</block>
					</view>
				</view>
			</block>
			<load-more :showLoadmore="!isMore"></load-more>
		</view>
		<block v-else>
			<Abnor :abnor="'DATA'"></Abnor>
		</block>
		<view class="dealer-share t-c dis-flex flex-dir-column flex-x-center flex-y-center p-r main-bg-color" @click="share">
			<view class="iconfont icon-fenxiang auxiliary-color"></view>
			<view class="f-22 col-3 auxiliary-color">分享</view>
			<button class="report-btn" open-type="share"></button>
		</view>
		<!-- 返回顶部 -->
		<GoTopBtn :page-scroll="pageScroll" :goTopStyle="'bottom:340rpx;right:36rpx'"></GoTopBtn>
		<page-loading ref="loading"></page-loading>
		<!-- #ifdef H5 -->
		<share-guide ref="shareGuide"></share-guide>
		<!-- #endif -->
		<shortcut id=""></shortcut>

		<popup-view :show="showDealerLevel" type="center" @clickmask="showDealerLevel = false">
			<view class="copy-popup dis-flex flex-dir-column flex-x-around flex-y-center">
				<view class="f-24 col-3" style="width: 90%;">
					<view class="twolist-hidden">{{shop_copy_text}}</view>
					<view class="m-top10 twolist-hidden" style="color: #0d1dfb;">{{url}}</view>
				</view>
				<view class="copy-btn main-bg-color auxiliary-color t-c f-24 " @click="cpoyUrl">复制文案链接</view>

			</view>
			<view class="iconfont icon-round_close_light m-top20" style="color: #fff;text-align: center;font-size: 20px;" @click="showDealerLevel = false"></view>
		</popup-view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import GoTopBtn from "@/components/template/GoTopBtn.vue"
	import LoadMore from "@/components/template/Loadmore.vue"
	import Abnor from "@/components/template/Abnor.vue"
	import listMixin from "@/common/js/pageListMixin.js"
	import pageShare from "@/common/js/pageShareMixin.js"
	import shortcut from "@/components/template/ShortCut.vue"
	import PopupView from "@/components/template/PopManager.vue"
	export default {
		mixins: [listMixin, pageShare],
		data() {
			return {
				showDealerLevel: false,
				isMore: true,
				page: 1,
				goodsData: {},
				isAbnor: false,
				searchText: "",
				sortData: {
					total_sales: "",
					rebate_commission: "",
					create_time: "desc"
				},
				url: '',
				my_shop_is_copy:'',
				shop_copy_text:''
			};
		},
		components: {
			LoadMore,
			Abnor,
			GoTopBtn,
			shortcut,
			PopupView
		},
		computed: {
			inputPlace() {
				return "padding-left:20rpx;color: #999999;font-size: 26rpx;"
			},
			appDiyFont() {
				let appSetting = this.$store.state.appSetting;
				if (appSetting) {
					uni.setNavigationBarTitle({
						title:appSetting.diy_font && appSetting.diy_font.goods?appSetting.diy_font.goods:''
					});
					return appSetting.diy_font
				}
			},
			userInfo() {
				return this.$store.state.userInfo || {}
			},
			isDealerUser() {
				return this.userInfo.dealer_user === 1;
			}
		},
		beforeCreate() {

		},
		onLoad(options) {
			// 设置自定义页面分享
			let singleShare = this.$store.getters.getSingleShare("store");
			this.shareData = this.getPageShareData("dealer/goods", singleShare);
			this.getGoodsList("", this.sortData);
		},
		onShow() {
			this.setIndex()

		},
		methods: {
			setIndex() {
				App._post_form('setting/index', {}, res => {
					let {
						dealer_basic: {
							my_shop_is_copy,
							shop_copy_text
						}
					} = res.data
					
					this.setData({
						my_shop_is_copy,
						shop_copy_text
						
					})
				})
			},
			/**
			 * 筛选切换
			 */
			sortChange(sortIndex) {
				uni.showLoading();
				let sortData = this.sortData,
					sort = this.sortData[sortIndex];
				this.page = 1;
				for (let [key, value] of Object.entries(sortData)) {
					if (key === sortIndex) {
						sortData[key] = sort === "" ? "desc" : (sort === "desc" ? "asc" : "desc");
					} else {
						sortData[key] = "";
					}
				}
				this.sortData = sortData;
				// i(sort === "none") {
				// 	sortData[sortIndex] = "desc";
				// }
				// this.$set(this.sortData, sortIndex, sort === "desc" ? "asc" : "desc");
				this.getGoodsList(this.searchText, sortData, 1);
			},
			// 推广链接
			extendLink() {
				App.navigationTo({
				     url: 'pages/subPages/extendLink/index'
				    })
			},
			// 复制链接
			copyLink() {
				console.log(App.getRefereId(),'======================')
				let pages = getCurrentPages(),
				 page = pages[pages.length - 1].route,
				 siteInfo =App.siteInfo,
				 re_id =App.getUserId(),
				 url=`${siteInfo.siteroot}h5/#/${page}?i=${siteInfo.uniacid}&referee_id=${re_id}`;
				this.url = url
				this.showDealerLevel = true
			},
			cpoyUrl() {
				let content = this.shop_copy_text+'\n\n'+this.url
				App.copyTextHandle(content);
			},
			/**
			 * 获取分销商品列表
			 */
			getGoodsList(searchText = "", sortData, page = 1, isPage = false) {
				let _this = this,
					{
						total_sales = "desc",
						rebate_commission = "desc",
						create_time = "asc"
					} = sortData;
				App._get('user.dealer.Goods/getList', {
					goods_name: searchText,
					total_sales, //销量
					rebate_commission, //收益
					create_time, //最新
					page
				}, (result) => {
					console.log(result)
					if (isPage) {
						if (result.data.data.length > 0) {
							_this.goodsData.data.push(...result.data.data)
						}
					} else {
						_this.goodsData = result.data;
					}
					_this.isMore = result.data.data.length == result.data.per_page;
					_this.page = page;
					App.hideLoading();
					uni.hideLoading();
				})
			},
			share() {
				// #ifdef H5
				this.$refs.shareGuide.showChange();
				// #endif
			}
		},
		onReachBottom() {
			let _this = this,
				goodsData = _this.goodsData;
			if (_this.page <= goodsData.last_page) {
				_this.getGoodsList(this.searchText, _this.sortData, ++_this.page, true);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.copy-popup {
		width: 600rpx;
		height: 350rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.copy-btn {
			width: 60%;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 50rpx;
		}
	}

	.dealer-goods-title {
		height: 356rpx;
		box-sizing: border-box;
		background: #FFD940;
		padding: 50rpx 30rpx 0;

		.copy {
			width: 140rpx;
			height: 50rpx;
			line-height: 50rpx;
			font-size: 24rpx;
			text-align: center;
			border-radius: 50rpx;
			border: 1rpx solid var(--auxiliary-color);
		}


		.goods-filter-item {
			flex: 1;

			.filter-icon {
				position: relative;
				width: 10rpx;
				margin-left: 10rpx;

				&::before,
				&::after {
					content: " ";
					width: 0;
					height: 0;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					border: 10rpx solid transparent;
				}

				&::after {
					bottom: -22rpx;
					border-top-color: #333333;
					border-top-color: var(--auxiliary-color);
				}

				&::before {
					top: -22rpx;
					border-bottom-color: #333333;
					border-bottom-color: var(--auxiliary-color);
				}

			}

			&.desc {
				.filter-icon::after {
					border-top-color: #FE504F;
					border-top-color: var(--help-color);
				}
			}

			&.asc {
				.filter-icon::before {
					border-bottom-color: #FE504F;
					border-bottom-color: var(--help-color);
				}
			}

			.goods-filter-search {
				width: 222rpx;
				height: 66rpx;
				background: rgba(255, 255, 255, 1);
				opacity: 0.8;
				border-radius: 33px;

				.icon-search_light {
					position: absolute;
					top: 50%;
					left: 12rpx;
					transform: translateY(-54%);
					font-size: 36rpx;
					width: 1em;
					height: 1em;
					line-height: 1em;
				}

				.flex-box {
					height: 66rpx;
					line-height: 66rpx;
					padding: 0 12rpx 0 54rpx;
					font-size: 26rpx;
				}
			}
		}
	}

	.dealer-goods-list {
		margin: -70rpx 30rpx 30rpx;

		.dealer-goods-item {
			box-sizing: border-box;
			padding: $uni-spacing-row-base;
			border-radius: $uni-border-radius-base;
			background: $uni-bg-color;
			margin-bottom: $uni-spacing-row-base;

			.goods-image {
				border-radius: $uni-border-radius-base;
				width: 200rpx;
				height: 200rpx;
				display: block;
				margin-right: $uni-spacing-row-lg;
			}


			.flex-dir-column {
				height: 200rpx;
			}

			.goods-income {

				.income-item {
					font-size: 20rpx;
					color: #FE504F;
					border: 1rpx solid #FE504F;
					padding: 2rpx 12rpx;
					border-radius: 20px;
					margin-right: 18rpx;
				}

			}

			.handle-item {
				width: 140rpx;
				height: 50rpx;
				line-height: 50rpx;
				font-size: 24rpx;
				text-align: center;
				margin-right: $uni-spacing-row-lg;
				background: #FFD940;
				border-radius: 50rpx;

				&:first-child {
					border: 1rpx solid #CCCCCC;
					background: $uni-bg-color;
				}
			}

			.go-buy {
				width: 130rpx;
				height: 50rpx;
				line-height: 50rpx;
				background: rgba(255, 217, 64, 1);
				border-radius: 25px;
				background: #FFD940;
			}
		}
	}

	.input-place {
		text-align: center;
		color: #999999;
		font-size: 24rpx;
	}

	.dealer-share {
		position: fixed;
		right: 30rpx;
		bottom: 134rpx;
		width: 90rpx;
		height: 90rpx;
		border-radius: $uni-border-radius-circle;
		background: #FFD940;
		z-index: 20;

		.icon-fenxiang {
			font-size: 36rpx;
			width: 1em;
			height: 1em;
			line-height: 1em;
			margin-bottom: 6rpx;
		}
	}

	.container {
		/deep/ .shortcut {
			right: 36rpx !important;
			z-index: 18 !important;
		}
	}
</style>
