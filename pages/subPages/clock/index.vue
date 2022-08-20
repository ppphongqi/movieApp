<template>
	<view class="page-clock app-clearfix">
		<!-- 打卡海报 -->
		<view class="clock-poster-card">
			<image class="clock-poster-card__img" :src="cDetails.posterUrl" mode=""></image>
			<!-- 周几和日期 -->
			<view v-if="!cDetails.clocked" class="clock-date-card">
				<view class="clock-date-card__text is-strong">
					{{ cDetails.dayOfWeek }}
				</view>
				<view class="clock-date-card__text">
					{{ cDetails.date }}
				</view>
			</view>
			<!-- 周几和日期 -->
		</view>
		<!-- 打卡海报 end -->
		<!-- 打卡卡片 -->
		<view v-if="!cDetails.clocked" class="clock-go-card">
			<view class="clock-go-card__text">{{ cDetails.clockText }}</view>
			<button class="btn-normal clock-go-card__btn" @click="handleBtnClockClick">
				{{ cDetails.btnClockGoText }}
			</button>
			<view class="clock-go-card__tip">{{ cDetails.clockGoTip }}</view>
		</view>
		<!-- 打卡卡片  end -->
		<!-- 导航 -->
		<view class="clock-nav-list">
			<view v-for="item in cNavList" :key="item.id" class="clock-nav-item" @click="handleNavItemClick(item)">
				<view class="clock-nav-card">
					<image class="clock-nav-card__img" :src="item.imgUrl" mode=""></image>
					<view class="clock-nav-card__text">{{ item.text }}</view>
				</view>
			</view>
		</view>
		<!-- 导航 end -->
		<!-- 推荐商品 -->
		<view class="clock-section-title"> 推荐商品 </view>
		<view v-for="item in cAdList" :key="item.id" class="clock-ad" @click="navigationTo(item.link)">
			<image class="clock-ad__img" :src="item.imgUrl" mode="aspectFill"></image>
		</view>
		<DiyGoodsV2 :params="{}" :itemStyle="{ display: '2', buybtn: '1', btntext: '立即购买' }" :item-data="cGoodsList">
		</DiyGoodsV2>
		<!-- 加载更多提示 -->
		<LoadMore :showLoadmore="!goodsListRes.isLoading"></LoadMore>
		<!-- 加载更多提示 end -->
		<!-- 推荐商品 end -->
		<!-- 底部导航 -->
		<tab-bar />
		<!-- 底部导航 end -->
		<!-- 文本复制弹窗 -->
		<CopyTextPopup v-model="copyTextVisible" :text="copyText"></CopyTextPopup>
		<!-- 文本复制弹窗 end -->
		<!-- 海报弹窗 -->
		<share-view ref="shareView" posterType="clock" :customPic="cDetails.posterUrl" :height="667" :width="375">
		</share-view>
		<!-- 海报弹窗 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
	import dayjs from "dayjs";
	import "dayjs/locale/zh-cn";
	import App from "@/common/js/app.js";
	import TabBar from "./components/TabBar.vue";
	import DiyGoodsV2 from "@/components/page/pageComponents/GoodsV2.vue";
	import LoadMore from "@/components/template/Loadmore.vue";
	import CopyTextPopup from "./components/CopyTextPopup";
	import ShareView from '@/components/template/ShareView.vue'
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	export default {
		mixins: [
			pageShareMixin
		],
		components: {
			TabBar,
			DiyGoodsV2,
			LoadMore,
			CopyTextPopup,
			ShareView
		},
		data() {
			return {
				// 页面的options
				options: {},
				// 详情的接口数据
				detailsRes: {},
				// 广告的接口数据
				adRes: [],
				// 商品的接口数据（分页）
				goodsListRes: {
					// 当前第几页，0就是即将请求第1页
					page: 0,
					// 分页的大小
					listRow: 10,
					// 数据
					data: [],
					// 是否还有更多
					hasMore: true,
					// 是否正在请求
					isFetching: false,
				},
				// 当前要复制的文本
				copyText: '',
				// 文本复制弹窗是否可见
				copyTextVisible: false,
			};
		},
		computed: {
			// 格式化的详情数据
			cDetails() {
				// 是否已经打卡
				const clocked = !!this.detailsRes.clock_id;
				// 按钮文字的map
				const btnClockGoTextMap = {
					1: "早起打卡",
					2: "早睡打卡",
				};
				// 当前时间
				const now = dayjs().locale("zh-cn");
				wx.dayjs = dayjs;
				return {
					clockId: this.detailsRes.clock_id,
					// 是否已经打卡
					clocked: !!this.detailsRes.clock_id,
					// 海报id
					posterId: this.$util.deepGet(
						this.detailsRes,
						"img.clock_img.0.file_id",
						""
					),
					// 海报地址
					posterUrl: this.$util.deepGet(
						this.detailsRes,
						"img.clock_img.0.file_path",
						""
					) || this.detailsRes.clock_img,
					// 打卡文案
					clockText: this.detailsRes.clock_text,
					// 打卡按钮文字
					btnClockGoText: btnClockGoTextMap[this.detailsRes.clock_type],
					// 打卡按钮提示文字
					clockGoTip:`打卡时间：${this.detailsRes.clock_time}`,
					// 星期几
					dayOfWeek: now.format("dddd"),
					// 几号
					date: now.format("YYYY.MM.DD"),
				};
			},
			// 格式化的广告数据
			cAdList() {
				return this.adRes.map((item) => ({
					id: item.id,
					link: item.path,
					imgUrl: this.$util.deepGet(item, "ad_img.0.file_path", ""),
				}));
			},
			// 导航的列表数据
			cNavList() {
				return [{
						id: "sentence",
						text: "早安金句",
						imgUrl: require("./static/images/icon-nav-sentence.png"),
						needClock: true,
						type: 'copy',
						copyText: this.cDetails.clockText
					},
					{
						id: "backGround",
						text: "换底图",
						imgUrl: require("./static/images/icon-nav-pic.png"),
						type: "link",
						link: "pages/subPages/clock/create?clock_id=" + this.cDetails.clockId,
						needClock: true
					},
					{
						id: "poster",
						text: "分享海报",
						imgUrl: require("./static/images/icon-nav-poster.png"),
						type: "poster",
						needClock: true
					},
					{
						id: "repair",
						text: "补卡",
						imgUrl: require("./static/images/icon-nav-repair.png"),
						type: "link",
						link: "pages/subPages/clock/repair",
					},
				];
			},
			// 格式化商品列表
			cGoodsList() {
				const list = this.$util.deepGet(this.goodsListRes, "data", []);
				return list.map((item) => {
					return {
						...item,
						goods_image: item.image && item.image[0] ?
							item.image[0].file_path :
							"",
						goods_price: item.display ?
							item.goods_price :
							item.spec_type === 20 ?
							item.goods_min_price :
							item.sku[0] ?
							item.sku[0].goods_price :
							"",
						line_price: item.sku[0] ? item.sku[0].line_price : "",
						member_price: item.coupon_price || 0,
						priceEarn: item.dealer_money || 0,
						commission: "返",
						charges: "1",
					};
				});
			},
		},
		watch: {
			cDetails(val) {
				this.shareData = this.pageShareMixin_createShareData({
					imgUrl: val.posterUrl,
					title: '早晚打卡',
					desc: '坚持打卡，做最好的自己~~'
				})
			} 
		},
		async onLoad(options) {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff",
			});
			this.options = options;
			try {
				await this.mainMixin_BeforeFetchPageData();
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#ffffff",
				});
				// 异步请求广告和商品数据
				this.fetchAdRes().catch(() => {});
				if (
					!this.goodsListRes.isFetching &&
					!this.goodsListRes.data.length
				) {
					this.fetchGoodsListRes({
						resetBeforeFetch: true,
					}).catch(() => {});
				}
				// 同步请求的数据
				await Promise.all([this.fetchDetailsRes().catch(() => {})]);
				App.hideLoading();
			} catch (e) {
				console.log("onShow 报错", e);
				// TODO handle the exception
			}
		},
		mounted() {
			const nowHour = +dayjs().format('H')
			let greetings = '你好，'
			if(nowHour>=6 && nowHour<11){
				greetings = '早上好，'
			}else if(nowHour>=11 && nowHour<1){
				greetings = '中午好，'
			}else if(nowHour>=13 && nowHour<18){
				greetings = '下午好，'
			}else if(nowHour>=18 && nowHour<23){
				greetings = '晚上好，'
			}else if(nowHour>=0 && nowHour<6){
				greetings = '晚上好，'
			}
			uni.setNavigationBarTitle({
				title: `${greetings}${this.mainMixin_userInfo.nickName}`
			})
		},
		async onShow() {
			// 非初次进入页面 更新数据
			if(this.cDetails.posterUrl) {
				this.fetchDetailsRes().catch(() => {})
			}
		},
		// 上拉加载更多
		onReachBottom() {
			console.log("onReachBottom");
			if (this.goodsListRes.isFetching || !this.goodsListRes.hasMore) {
				return;
			}
			this.fetchGoodsListRes().catch(() => {});
		},
		methods: {
			handleNavItemClick(item) {
				// 如果是需要先打卡
				if (item.needClock && !this.cDetails.clocked) {
					uni.showModal({
						title: '提示',
						content: '请先打卡',
						showCancel: false
					})
					return
				}
				// 如果是复制文本
				if (item.type === 'copy') {
					this.copyText = item.copyText
					this.copyTextVisible = true
				}
				// 如果是海报
				if (item.type === 'poster') {
					this.$refs.shareView.shareswich()
				}
				// 如果是链接
				if (item.type === 'link') {
					this.navigationTo(item.link);
				}
			},
			// 打卡按钮点击事件
			async handleBtnClockClick() {
				if (this.handleBtnClockClicking) return;
				this.handleBtnClockClicking = true;
				uni.showLoading({
					title: "请稍候",
				});
				try {
					const res = await App._getP("clock.Clock/userClock", {
						file_id: this.cDetails.posterId,
						clock_text: this.cDetails.clockText,
						referee_id: this.options.referee_id,
					});
					// 刷新数据
					await this.fetchDetailsRes();
					uni.showToast({
						icon: "none",
						title: "打卡成功",
					});
					this.handleBtnClockClicking = false;
				} catch (e) {
					this.handleBtnClockClicking = false;
					console.log("fetchCardCateRes", e);
					return Promise.reject(e);
					// TODO handle the exception
				}
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._getP("clock.Clock/getClockInfo", {});
					this.detailsRes = res.data || {};
				} catch (e) {
					console.log("fetchCardCateRes", e);
					return Promise.reject(e);
					// TODO handle the exception
				}
			},
			// 请求详情的接口数据
			async fetchAdRes() {
				try {
					const res = await App._getP("clock.Clock/getClockAd", {});
					this.adRes = res.data || [];
				} catch (e) {
					console.log("fetchCardCateRes", e);
					return Promise.reject(e);
					// TODO handle the exception
				}
			},
			// 请求商品的接口数据（分页）
			async fetchGoodsListRes({
				resetBeforeFetch = false
			} = {}) {
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch || !this.cTopCateActiveItem.id) {
						console.log("重置数据");
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.goodsListRes = {
							...this.goodsListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false,
						};
					}
					// 如果没有更多就不必请求了
					if (!this.goodsListRes.hasMore) {
						return Promise.reject();
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.goodsListRes.isFetching = true;
					// 请求数据
					const res = await App._getP("clock.Clock/getClockGoodsList", {
						page: this.goodsListRes.page + 1,
						// 其他接口都是list_rows
						listRow: this.goodsListRes.listRow,
					});
					// 取得新的数据
					const newData = this.$util.deepGet(res, "data.data", []);
					// 判断是否有更多
					const hasMore = newData.length >= this.goodsListRes.listRow;
					// 设置新的数据
					this.goodsListRes = {
						...this.goodsListRes,
						page: this.goodsListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ?
							newData :
							this.goodsListRes.data.concat(newData),
						hasMore,
						isFetching: false,
					};
					console.log(
						"this.goodsListRes11111111111",
						this.goodsListRes.data[0],
						res
					);
				} catch (e) {
					console.log("ha", e);
					return Promise.reject(e);
					// TODO handle the exception
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.page-clock {
		min-height: 100vh;
		background-color: #f8f8f8;
	}

	.clock-poster-card {
		position: relative;
		// flex 用于消除图片空隙
		display: flex;
		align-items: center;
		justify-content: center;
		width: 750rpx;
		height: 750rpx;
		flex-direction: column;
	}
	
	
	
	.clock-poster-card__img {
		width: 690rpx;
		height: 690rpx;
		border-radius: 20rpx;
	}

	.clock-date-card {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		box-sizing: border-box;
		position: absolute;
		right: 60rpx;
		top: 60rpx;
		width: 200rpx;
		min-height: 120rpx;
		padding: 30rpx 16rpx;
		background: linear-gradient(270deg,
				rgba(255, 255, 255, 0.3) 0%,
				rgba(255, 255, 255, 0) 100%);
	}

	.clock-date-card__text {
		font-size: 28rpx;
		color: #fff;

		&.is-strong {
			font-weight: bold;
			font-size: 32rpx;
		}

		&+& {
			margin-top: 10rpx;
		}
	}

	// 打卡卡片
	.clock-go-card {
		position: relative;
		box-sizing: border-box;
		width: 630rpx;
		padding: 40rpx;
		margin: 0 auto;
		margin-top: -150rpx;
		background-color: #fff;
		border-radius: 20rpx;
		z-index: 1;
	}

	.clock-go-card__text {
		position: absolute;
		left: 50%;
		bottom: 100%;
		box-sizing: border-box;
		width: 570rpx;
		padding: 20rpx 30rpx;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.39);
		border-radius: 20rpx 20rpx 0 0;
		transform: translateX(-50%);
	}

	.clock-go-card__btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 110rpx;
		background-color: #ffd940;
		border-radius: 20rpx;
		font-size: 36rpx;
		color: #000;
		font-weight: bold;
	}

	.clock-go-card__tip {
		margin-top: 20rpx;
		text-align: center;
		font-size: 24rpx;
		color: #999;
	}

	// 打卡卡片 end
	// 导航
	.clock-nav-list {
		box-sizing: border-box;
		display: flex;
		width: 690rpx;
		margin: 0 auto;
		margin-top: 35rpx;
	}

	.clock-nav-item {
		box-sizing: border-box;
		flex: 1;
		min-width: 0;
	}

	.clock-nav-card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15rpx;
		width: 100%;
	}

	.clock-nav-card__img {
		width: 80rpx;
		height: 80rpx;
	}

	.clock-nav-card__text {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		text-align: center;
	}

	// 导航 end
	// 推荐商品
	.clock-section-title {
		font-weight: bold;
		color: #333333;
		font-size: 36rpx;
		padding: 0 30rpx;
		margin-top: 35rpx;
	}

	.clock-ad {
		width: 690rpx;
		margin: 0 auto;
		margin-top: 20rpx;
	}

	.clock-ad__img {
		width: 100%;
		height: 200rpx;
		border-radius: 20rpx;
	}

	// 推荐商品  end
</style>
