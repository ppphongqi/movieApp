<template>
	<view :style="themeColor">
		<view class="container tab-container">
			<view>
				<view class="dis-flex search-input-box">
					<view class="search-input">
						<view class="dis-flex search-box">
							<!-- <view class="search-type dis-flex flex-y-center col-3" @click="searchTypeChange">
								<view class="type-text f-24">{{searchType ==="goods"?"商品":"店铺"}}</view>
								<view class="iconfont icon-triangledownfill"></view>
							</view> -->
							<view class="left">
								<!-- <icon color="rgba(180,180,180,1)" size="15" type="search"></icon> -->
								<view class="iconfont icon-search"></view>
							</view>
							<view class="right">
								<input @input="getSearchContent" class="input" focus="true" confirm-type="search" @confirm="search" placeholder="请输入您搜索的商品"
								 placeholderStyle="color:#aba9a9;font-size:12px;" type="text"></input>
							</view>
						</view>
					</view>
					<view class="serch-button f-28 col-3" @click="search">
						搜索
					</view>
				</view>
				<view class="search-cont-box" v-if="recentSearch.length">
					<view class="title-box col-9 f-24">最近搜索
						<text @click="clearSearch" class="iconfont icon-lajixiang"></text>
					</view>
					<view class="sale-button-box">
						<view class="seconds-kill-li" v-for="(recent,idx) in recentSearch" :key="idx">
							<view @click="goSearch" class="recent-button" :data-text="recent" v-if="idx < 6">{{recent}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	export default {
		data() {
			return {
				recentSearch: [],
				searchValue: '',
				searchType: "goods"
			};
		},
		components: {

		},
		computed: {

		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {

		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			// 获取历史搜索
			this.getRecentSearch();
		},
		mounted() {

		},
		methods: {
			/**
			 * 获取历史搜索
			 */
			getRecentSearch() {
				let recentSearch = uni.getStorageSync('recentSearch');
				this.setData({
					recentSearch
				});
			},

			/**
			 * 绑定输入值
			 */
			getSearchContent(e) {
				this.searchValue = e.detail.value;
			},

			/**
			 * 搜索提交
			 */
			search() {
				if (this.searchValue) {
					// 记录最近搜索
					let recentSearch = uni.getStorageSync('recentSearch') || [];
					let index = recentSearch.indexOf(this.searchValue);
					index > -1 && recentSearch.splice(index, 1);
					recentSearch.unshift(this.searchValue);
					uni.setStorageSync('recentSearch', recentSearch)
					// 跳转到商品列表页
					App.navigationTo({
						url: "pages/subPages/category/list?search=" + this.searchValue,
					})
				}
			},

			/**
			 * 清空最近搜索记录
			 */
			clearSearch() {
				uni.removeStorageSync('recentSearch');
				this.getRecentSearch();
			},

			/**
			 * 跳转到最近搜索
			 */
			goSearch(e) {
				App.navigationTo({
					url: "pages/subPages/category/list?search=" + e.target.dataset.text,
				})
			},
		}
	}
</script>

<style>
	.seconds-kill-li {
		padding: 10upx 20upx;
		box-sizing: border-box;
		float: left;
	}

	.title-box {
		padding: 50upx 0 0 30upx;
	}

	.title-box .icon-lajixiang {
		float: right;
	}

	.sale-button-box {
		padding: 10px 10upx;
		overflow: hidden;
	}

	.sale-button,
	.recent-button {
		background: #EEEEEE;
		padding: 15upx 30upx;
		border-radius: 50px;
		justify-content: center;
		text-align: center;
		font-size: 24upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		height: 30upx;
		line-height: 30upx;
		color: #333333;
	}

	/* .serch-button button {
  background: #ff495e;
} */

	/* asd */

	.search-input-box {
		background-color: #FFD940;
		/* height: 64upx; */
		padding: 30upx 30upx 20upx 30upx;
	}

	.search-input {
		width: 80%;
		background: rgba(255, 255, 255, .5);
		border-radius: 40upx;
		padding-left: 10upx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.search-input input {
		font-size: 24upx;
		height: 64upx;
		line-height: 64upx;
	}

	.serch-button {
		width: 20%;
		text-align: center;
		line-height: 64upx;
		box-sizing: border-box;
	}

	.serch-button button {
		line-height: 64upx;
		height: 64upx;
		font-size: 28upx;
		border-radius: 0 5px 5px 0;
	}

	.search-cont {
		padding: 0 15px;
		background: #fff;
	}

	.search-box .left {
		width: 28px;
	}

	.search-box .left .iconfont {
		color: rgba(180, 180, 180, 1);
		font-size: 34upx;
		line-height: 1.8em;
		text-align: center;
	}

	.search-box .right {
		flex: 1;
	}

	.title-box image {
		width: 35upx;
		height: 35upx;
		float: right;
	}

	.search-type {
		padding: 0 0 0 12rpx;
	}

	.search-type .icon-triangledownfill {
		font-size: 12px;
		width: 1em;
		height: 1em;
		line-height: 1em;
		margin-left: 6rpx;
	}
</style>
