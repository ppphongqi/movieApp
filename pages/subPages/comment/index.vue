<template>
	<view :style="themeColor">
		<view v-if="isShow" :class="tabContainer">
			<page-header :pos="'1'">
				<block slot="user">
					<view class="nav-bar-bg">
						<!-- <view class="bg-img " :style="{'background-image':getImageRoot('8.png','url')}"></view> -->
						<view class="bg-img main-bg-color dis-flex flex-x-center flex-y-center">
							<image :src="pageBannerPath" style="width: 690rpx;height: 250rpx;"></image>
						</view>
					</view>
				</block>
				<block slot="content">
					<view class="nav-bar-list">
						<view class="nav-bar-item" @click="navItemClick(1)">最热评论
							<view class="select-nav-items" v-if="currentIndex === 1">
								<image src="/static/images/br1.png" class="main-bg-color" mode=""></image>
							</view>
						</view>
						<view class="nav-bar-item" @click="navItemClick(2)">最好评论
							<view class="select-nav-items" v-if="currentIndex === 2">
								<image src="/static/images/br1.png" class="main-bg-color" mode=""></image>
							</view>
						</view>
					</view>
				</block>
			</page-header>
			<!-- #ifdef H5 -->
			<view class="to-share-box" v-show="shareImg" @click="shareImg = false">
				<image src="/static/h5/share.png" class="to-share" mode="widthFix"></image>
			</view>
			<!-- #endif -->
			<view class="comment-list">
				<block v-if="newcommentList && newcommentList.length > 0">
					<block v-for="(comment_detail,index) in newcommentList" :key="index">
						<view class="m-btm30 comment-item" @click.stop="goodcoment(comment_detail.comment_id)">
							<comment-item type="list" :comment_detail="comment_detail" @singegivelike="givelike(comment_detail.comment_id,index)"></comment-item>
						</view>
					</block>
					<loadmore :showLoadmore="showLoadmore"></loadmore>
				</block>
				<block v-else>
					<Abnor></Abnor>
				</block>
			</view>
			<!-- <scroll-view scroll-y="true" class="comment-list" @scroll="onScroll" @scrolltolower="onPageBottom" lower-threshold="0"
			 :scroll-into-view="intoViewId">
				<view class="scroll-top-view" id="intoView"></view>
				<block v-if="newcommentList.length > 0">
					<block v-for="(comment_detail,index) in newcommentList" :key="index">
						<view class="m-btm30 comment-item" @click.stop="goodcoment(comment_detail.comment_id)">
							<comment-item type="list" :comment_detail="comment_detail" @singegivelike="givelike(comment_detail.comment_id,index)"></comment-item>
						</view>
					</block>
					<loadmore :showLoadmore="showLoadmore"></loadmore>
				</block>
				<block v-else>
					<Abnor></Abnor>
				</block>
			</scroll-view> -->
		</view>
		<!-- 分享菜单 -->
		<share-view ref="shareView"></share-view>
		<page-loading ref="loading"></page-loading>
		<!-- 返回顶部 -->
		<GoTopBtn :pageScroll="pageScroll" :goTopStyle="hiddenTabBar?'bottom:80px;right:20px;':'bottom:50px;right:20px;'"></GoTopBtn>
		<shortcut id=""></shortcut>
		<DiyTab></DiyTab>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import DiyTab from "@/components/template/TabBar.vue"
	import PageHeader from "@/components/template/PageHeader.vue";
	import CommentItem from "@/components/template/CommentItem.vue";
	import loadmore from "@/components/template/Loadmore.vue";
	import GoTopBtn from "@/components/template/GoTopBtn.vue"
	import listMixin from "@/common/js/pageListMixin.js"
	import Abnor from "@/components/template/Abnor.vue"
	import shortcut from "@/components/template/ShortCut.vue"
	import ShareView from "@/components/template/ShareView.vue"
	
	export default {
		mixins: [listMixin],
		data() {
			return {
				currentIndex: 1, //tab 选项
				commentList: [], //评论列表
				swiperHeight: 0, //scroll高度
				page: 1, //当前页数
				list_page: null, //总页数
				// 是否加载
				showLoadmore: false, //是否加载
				isAbnor: false, //没有数据时显示
				isShow: false, //加载完成显示
				scroll_Top: 0, //滑动高度
				intoViewId: "",
				shareImg: false,
				pageBannerPath: '', //banner路径
			};
		},
		components: {
			PageHeader,
			CommentItem,
			loadmore,
			DiyTab,
			GoTopBtn,
			Abnor,
			shortcut,
			ShareView
		},
		computed: {
			newcommentList() {
				if (!!this.commentList && this.commentList.length > 0) {
					let commentList = this.commentList.map((val) => {
						val = Object.assign({}, val, {
							isgl: val.is_fabulous === 1 ? true : false
						})
						return val;
					})
					return commentList
				}
			}
		},
		beforeCreate() {
			// #ifdef MP-WEIXIN
			uni.hideTabBar();
			// #endif
		},
		onLoad(options) {
			this.pageBannerPath = this.$util.deepGet(this.$store.getters.getappSetting,'share.good_banner')
			App.showLoading();
			
			this.setSwiperHeight()
		},
		onShow() {
			this.commDetail(this.currentIndex, this.page);
			App.customDefaultShare(this.globalSaveRefereeId,`${App.siteInfo.siteroot}h5/#/pages/subPages/comment/index`)
		},
		mounted() {

		},
		methods: {
			/**
			 * 评论详情
			 */
			commDetail(order_rule, page) {
				let that = this
				
				App._get('Comment/getPraiseList', {
					order_rule,
					page,
					no_login: 1
				}, (result) => {
					let data = result.data;
					that.setData({
						commentList: data.data,
						showLoadmore: (that.page === data.last_page),
						list_page: data.last_page,
						isShow: true
					})
				}, false, () => {
					uni.hideLoading()
					App.hideLoading(500)
					uni.stopPullDownRefresh();
				});
			},
			/**
			 * 设置swiper的高度
			 */
			setSwiperHeight() {
				// 获取系统信息(拿到屏幕宽度)
				let systemInfo = uni.getSystemInfoSync(),
					swiperHeight = systemInfo.windowHeight - 195; // swiper高度
				// #ifdef H5 
				swiperHeight -= 44;
				// #endif
				this.setData({
					swiperHeight
				});
			},
			/**
			 * tab选项
			 * 
			 */
			navItemClick(val) {
				this.page = 1;
				this.currentIndex = val;
				uni.pageScrollTo({
					duration: 0,
					scrollTop: 0
				})
				this.commDetail(val, 1)
			},
			goodcoment(comment_id) {
				App.navigationTo({
					url: `pages/subPages/comment/detail?comment_id=${comment_id}&comment_type=goodsingle`
				})
			},

			toload(order_rule, page) {
				let that = this;
				App._get('Comment/getPraiseList', {
					order_rule,
					page
				}, that.itemsDataMore);
			},
			/**
			 * 加载更多
			 **/
			itemsDataMore(e) {
				console.log(e, '更多数据')
				let that = this,
					listData = that.commentList,
					ListDataMore = e.data.data;
				if (!!ListDataMore) {
					ListDataMore.map((val) => {
						if (val.is_fabulous === 1) {
							val.isgl = true;
						} else {
							val.isgl = false;
						}
					});
				}
				that.commentList = listData.concat(ListDataMore);
			},
			givelike(comment_id, index) {
				let that = this,
					commentList = that.commentList;
				App._get('Comment/fabulous', {
					comment_id
				}, (result) => {
					if (result.data === 1) {
						commentList[index].isgl = false;
						commentList[index].total_comment--;
						commentList[index].is_fabulous = 0;
						App.showSuccess('取消点赞');
					} else if (result.data === 2) {
						commentList[index].isgl = true;
						commentList[index].total_comment++;
						commentList[index].is_fabulous = 1;
						App.showSuccess('点赞成功');
					}
				})
				return commentList
			}
		},
		onReachBottom() {
			let that = this,
				list_page = that.list_page;
			if (that.page >= list_page) {
				that.setData({
					showLoadmore: true
				});
				return false
			};
			!that.showLoadmore && that.toload(this.currentIndex, ++that.page);
		},
		onPullDownRefresh() {
			let _this = this;
			_this.currentIndex = 1, //tab 选项
				_this.page = 1 //页数
			_this.commDetail(1, 1);
		},
		onShareAppMessage(res) {
			console.log(res)
			let shop_id = res.target.dataset.shopid,
				shopimgUrl = res.target.dataset.shopimgurl,
				shopName = res.target.dataset.shopname;
			if (res.from === 'button') { // 来自页面内分享按钮

			};
			return {
				title: `正在分享商品:${shopName}给您！快点开看看吧~`,
				path: `/pages/subPages/goods/index/index?goods_id=${shop_id}&referee_id=${this.globalSaveRefereeId}`,
				imageUrl: shopimgUrl
			};
		},
	}
</script>

<style>
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
		width: 180vw;
		height: 300upx;
		background: #FFD940;
		border-radius: 50%;
		position: absolute;
		left: -40vw;
		bottom: 32%;
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

	/* 	.nav-bar-item::before {
		content: " ";
		position: absolute;
		top: 20upx;
		right: 0;
		bottom: 20upx;
		width: 0;
		border-right: 1upx solid #EEEEEE;
	} */

	.nav-bar-list .nav-bar-item:last-child::before {
		content: none;
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
		background: var(--theme-color);
		border-radius: 6upx;
	}

	.nav-bar-bg {
		height: 250upx;
		position: relative;
	}

	.nav-bar-bg .bg-img {
		width: 750upx;
		height: 402upx;
		position: absolute;
		top: -95rpx;
		left:-30rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
	
	.comment-list {
		box-sizing: border-box;
		padding: 390upx 20upx 0;
	}

	.select-nav-items {
		position: absolute;
		left: 50%;
		top: 25%;
		width: 56upx;
		height: 10upx;
		transform: translate(-50%);
	}

	.select-nav-items image {
		width: 100%;
		height: 100%;
	}

	.comment-item:first-child {}

	.scroll-top-view {
		height: 190upx;
	}

	.to-share-box {
		position: fixed;
		z-index: 200;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgba(7, 17, 27, .65);
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
