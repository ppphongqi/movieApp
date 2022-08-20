<template>
	<view class="page-clock-create app-flex app-flex--column">
		<!-- banner -->
		<view class="app-flex-item app-flex-item--shrink-0">
			<Poster :type="cPoster.type" :bgUrl="cPoster.bgUrl" :avatar="cPoster.avatar"
				:targetText="cPoster.targetText" :targetDay="cPoster.targetDay" :timeTitle="cPoster.timeTitle"
				:timeStr="cPoster.timeStr" :titmeTip="cPoster.titmeTip" :sentence="cPoster.sentence"
				:dayOfWeek="cPoster.dayOfWeek" :date="cPoster.date" :qrCode="cPoster.qrCode"
				:qrCodeTip="cPoster.qrCodeTip" :textColor="cPoster.textColor"></Poster>
		</view>
		<!-- banner end -->
		<view class="app-flex-item app-flex-item--1">
			<!-- 图片列表 -->
			<PicList v-if="footerTabActiveId === 'pic'" v-model="picId" :tabList="cPicCateList" :list="cPicList"
				@on-tab-item-click="handlePicTabItemClick" @on-scrolltolower="handlePicScrolltolower" @on-upload-success="handleUploadSuccess"></PicList>
			<!-- 图片列表 end -->
			<!-- 金句列表 -->
			<SentenceList v-else-if="footerTabActiveId === 'text'" v-model="sentenceId" :color="color"
				:list="cSentenceList" @on-scrolltolower="handleSentenceScrolltolower"
				@on-color-item-click="handleColorClick" @on-btn-custom-click="customInputPopupVisible = true">
			</SentenceList>
			<!-- 金句列表 end -->
		</view>
		<!-- footer -->
		<view
			class="page-clock-create__footer app-flex-item app-flex-item--shrink-0 app-flex app-flex--align-center app-card app-card--fluid">
			<view v-for="item in cFooterTabList" :key="item.id" class="app-flex-item"
				@click="handleFooterTabItemClick(item)">
				<view class="page-clock-create-nav" :class="{ 'is-active': item.id === footerTabActiveId }">
					<image class="page-clock-create-nav__icon" :src="item.imgSrc" mode=""></image>
					<view class="page-clock-create-nav__text">{{
                        item.text
                    }}</view>
				</view>
			</view>
			<view class="app-flex-item app-flex-item--1">
				<button class="btn-normal page-clock-create__btn-create" @click="handleBtnCreateClick">
					生成海报
				</button>
			</view>
		</view>
		<!-- footer end -->
		<!-- 自定文案输入框 -->
		<CustomInputPopup v-model="customInputPopupVisible" @on-confirm="handleCustomInputPopupConfirm">
		</CustomInputPopup>
		<!-- 自定文案输入框 end -->
		<!-- 海报弹窗 -->
		<share-view ref="shareView" poster-type="clock" :apiParams="cShareViewApiParams" :height="667" :width="375"
			@on-img-chane="handleImgChange"></share-view>
		<!-- 海报弹窗 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
	</view>
</template>

<script>
	import dayjs from "dayjs";
	import App from "@/common/js/app.js";
	import Poster from "./components/Poster.vue";
	import PicList from "./components/PicList.vue";
	import SentenceList from "./components/SentenceList.vue";
	import CustomInputPopup from "./components/CustomInputPopup.vue";
	import ShareView from '@/components/template/ShareView.vue'
	import pageShareMixin from '@/common/js/pageShareMixin.js'

	export default {
		mixins: [
			pageShareMixin
		],
		components: {
			Poster,
			PicList,
			SentenceList,
			CustomInputPopup,
			ShareView
		},
		data() {
			return {
				// 页面的options
				options: {
					clock_id: "",
				},
				// 详情的接口数据
				detailsRes: {},
				// 图片分类的接口数据（非分页）
				picCateListRes: [],
				// 图片的接口数据（分页）
				picListRes: {
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
				// 金句的接口数据（分页）
				sentenceListRes: {
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
				// 金句当前选中项的id
				sentenceId: "",
				// 当前自定义金句
				customSentenceText: "",
				// 底部tab选择项的id
				footerTabActiveId: "text",
				// 当前选中的图片分类id
				picTabId: "",
				// 当前选中的图片id
				picId: '',
				// 当前选中的颜色
				color: '#FFFFFF',
				// 是否显示自定义文案输入框
				customInputPopupVisible: false,
				// 海报弹窗是否显示
				posterPopupVisible: false,
				// 三个点的分享图片
				shareImg: '',
				// 当前图片上传的数据
				uploadRes: {
					file_id: '',
					file_path: ''
				}
			};
		},
		computed: {
			// 格式化的海报数据
			cPoster() {
				const pic = this.cPicList.find(item => item.id === this.picId) || {}
				return {
					type: "css",
					bgUrl: pic.imgUrl || this.uploadRes.file_path || this.detailsRes.img || "",
					avatar: this.detailsRes.avatarUrl || "",
					targetText: this.detailsRes.one || "",
					targetDay: this.detailsRes.two || "",
					timeTitle: this.detailsRes.three || "",
					timeStr: this.detailsRes.four || "",
					titmeTip: this.detailsRes.five || "",
					sentence: this.customSentenceText || this.detailsRes.clock_text || "",
					dayOfWeek: this.detailsRes.week || "",
					date: this.detailsRes.clock_date || "",
					qrCode: this.detailsRes.qr || "",
					qrCodeTip: this.detailsRes.scan_code || "",
					textColor: this.color || "#fff",
				};
			},
			// 格式化的金句列表
			cSentenceList() {
				const data = this.sentenceListRes.data || [];
				return data.map((item) => ({
					id: item.id,
					text: item.clock_text,
				}));
			},
			// 当前生成海报对应的金句
			cSentence() {
				const item = this.cSentenceList.find(
					(item) => item.id === this.sentenceId
				);
				if (item) {
					return item.text;
				}
				return this.customSentenceText || this.cPoster.sentence;
			},
			// 图片的分类数据
			cPicCateList() {
				return this.picCateListRes.map((item) => ({
					id: item.id,
					title: item.type_name,
				}));
			},
			// 图片的列表数据
			cPicList() {
				const data = this.picListRes.data || [];
				return data.map((item) => ({
					id: item.file_id,
					imgUrl: this.$util.deepGet(item, 'clock_img.0.file_path', ''),
				}));
			},
			// 底部的tab项数据
			cFooterTabList() {
				return [{
						id: "pic",
						imgSrc: require("./static/images/icon-picture.png"),
						text: "换图",
					},
					{
						id: "text",
						imgSrc: require("./static/images/icon-text.png"),
						text: "文字",
					},
				];
			},
			// shareView的apiParams
			cShareViewApiParams() {
				return {
					clock_id: this.options.clock_id,
					file_id: this.picId || this.uploadRes.file_id || this.detailsRes.file_id,
					clock_text: this.cSentence,
					color: this.color
				}
			},
			// 格式化的三个点的分享图片
			cShareImg() {
				return this.shareImg || this.detailsRes.clocked_img || ''
			}
		},
		watch: {
			// 设置金句的默认值
			cSentenceList(list) {
				console.log("cSentenceList watch");
				if (list.find((item) => item.id === this.sentenceValue)) {
					return;
				}
				this.sentenceId = list[0] && list[0].id;
			},
			// 设置图片分类的默认值
			cPicCateList(list) {
				if (list.find((item) => item.id === this.picTabId)) {
					console.log("cSentenceList watch 01");
					return;
				}
				this.picTabId = list[0] && list[0].id;
			},
			picTabId() {
				this.debounceFetchPicListRes({
					resetBeforeFetch: true,
				});
			},
			cShareImg(val) {
				console.log('cShareImg watch')
				this.shareData = this.pageShareMixin_createShareData({
					imgUrl: val,
					title: '早晚打卡',
					desc: '坚持打卡，做最好的自己~~'
				})
			}
		},
		created() {
			// 节流的请求图片接口
			this.debounceFetchPicListRes = this.$util.throttle(
				(...args) => {
					this.fetchPicListRes(...args);
				},
				500, {
					leading: false,
					trailing: true,
				}
			);
		},
		async onLoad(options) {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff",
			});
			this.options = options;
			try {
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#ffffff",
				});
				// await this.mainMixin_BeforeFetchPageData();
				// 异步请求下面的数据
				if (
					!this.sentenceListRes.isFetching &&
					this.sentenceListRes.page === 0
				) {
					this.fetchSentenceListRes({
						resetBeforeFetch: true,
					}).catch(() => {});
				}
				// 刷新数据
				await Promise.all([
					this.fetchDetailsRes(),
					this.fetchPicCateListRes(),
				]);
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
		},
		methods: {
			// 自定义图片上传成功
			handleUploadSuccess(res) {
				console.log('handleUploadSuccess',res)
				this.picId = ''
				this.uploadRes = res
			},
			// 分享海报图片改变事件
			handleImgChange(val) {
				this.shareImg = val
			},
			// 自定义文字
			handleCustomInputPopupConfirm(val) {
				this.sentenceId = ''
				this.customSentenceText = val || ''
			},
			// 选择颜色
			handleColorClick(color) {
				this.color = color
			},
			// 图片加载更多
			handlePicScrolltolower() {
				console.log('handleSentenceScrolltolower')
				if (this.picListRes.isFetching || !this.picListRes.hasMore) {
					return
				}
				this.fetchPicListRes().catch(() => {})
			},
			// 金句加载更多
			handleSentenceScrolltolower() {
				console.log('handleSentenceScrolltolower')
				if (this.sentenceListRes.isFetching || !this.sentenceListRes.hasMore) {
					return
				}
				this.fetchSentenceListRes().catch(() => {})
			},
			// 图片tab点击事件
			handlePicTabItemClick(id) {
				this.picTabId = id;
			},
			// 底部tab项点击事件
			handleFooterTabItemClick(item) {
				this.footerTabActiveId = item.id;
			},
			// 生成海报按钮点击事件
			async handleBtnCreateClick() {
				if (this.handleBtnCreateClicking) return;
				this.handleBtnCreateClicking = true;
				uni.showLoading({
					title: "请稍候",
				});
				try {
					// const res = await App._postP("clock.Clock/newClockImg", {
					// 	clock_id: this.options.clock_id,
					// 	file_id: this.picId || this.detailsRes.file_id,
					// 	clock_text: this.cSentence,
					// 	color: this.color
					// });
					// this.posterUrl = res.data || ''
					// 刷新数据
					// await this.fetchDetailsRes();
					// uni.showToast({
					// 	icon: "none",
					// 	title: "生成成功",
					// });
					// 显示海报弹窗
					// this.posterPopupVisible = true
					this.$refs.shareView.shareswich()
					this.handleBtnCreateClicking = false;
				} catch (e) {
					this.handleBtnCreateClicking = false;
					return Promise.reject(e);
					// TODO handle the exception
				}
				
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._postP(
						"clock.Clock/getAssemblyClockInfo", {
							clock_id: this.options.clock_id,
						}
					);
					this.detailsRes = res.data || {};
				} catch (e) {
					console.log("fetchCardCateRes", e);
					return Promise.reject(e);
					// TODO handle the exception
				}
			},
			async fetchPicCateListRes() {
				try {
					const res = await App._postP("clock.Clock/getClockTypeAll", {
						clock_id: this.options.clock_id,
					});
					this.picCateListRes = res.data || [];
				} catch (e) {
					console.log("fetchPicCateListRes", e);
					return Promise.reject(e);
					// TODO handle the exception
				}
			},
			// 请求金句的接口数据（分页）
			async fetchSentenceListRes({
				resetBeforeFetch = false
			} = {}) {
				console.log('fetchSentenceListRes')
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch || !this.cTopCateActiveItem.id) {
						console.log("重置数据");
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.sentenceListRes = {
							...this.sentenceListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false,
						};
					}
					// 如果没有更多就不必请求了
					if (!this.sentenceListRes.hasMore) {
						return Promise.reject();
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.sentenceListRes.isFetching = true;
					// 请求数据
					const res = await App._postP("clock.Clock/getClockTextPage", {
						page: this.sentenceListRes.page + 1,
						// 其他接口都是list_rows
						listRow: this.sentenceListRes.listRow,
					});
					// 取得新的数据
					const newData = this.$util.deepGet(res, "data.data", []);
					// 判断是否有更多
					const hasMore = newData.length >= this.sentenceListRes.listRow;
					// 设置新的数据
					this.sentenceListRes = {
						...this.sentenceListRes,
						page: this.sentenceListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ?
							newData : this.sentenceListRes.data.concat(newData),
						hasMore,
						isFetching: false,
					};
					console.log(
						"this.sentenceListRes11111111111",
						this.sentenceListRes.data[0],
						res
					);
				} catch (e) {
					console.log("ha", e);
					return Promise.reject(e);
					// TODO handle the exception
				}
			},
			// 请求金句的接口数据（分页）
			async fetchPicListRes({
				resetBeforeFetch = false
			} = {}) {
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch || !this.picTabId) {
						console.log("重置数据");
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.picListRes = {
							...this.picListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false,
						};
					}
					// 如果没有更多就不必请求了
					if (!this.picListRes.hasMore) {
						return Promise.reject();
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.picListRes.isFetching = true;
					// 请求数据
					const res = await App._postP("clock.Clock/getClockImgPage", {
						page: this.picListRes.page + 1,
						// 其他接口都是list_rows
						listRow: this.picListRes.listRow,
						id: this.picTabId,
					});
					// 取得新的数据
					const newData = this.$util.deepGet(res, "data.data", []);
					// 判断是否有更多
					const hasMore = newData.length >= this.picListRes.listRow;
					// 设置新的数据
					this.picListRes = {
						...this.picListRes,
						page: this.picListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ?
							newData : this.picListRes.data.concat(newData),
						hasMore,
						isFetching: false,
					};
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
	.page-clock-create {
		height: 100vh;
		background-color: #f8f8f8;
	}

	// footer
	.page-clock-create__footer {
		margin: 0 auto;
		border-radius: 0;
	}

	.page-clock-create-nav {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100rpx;
		border-radius: 10rpx;

		&.is-active {
			background-color: #f8f8f8;
		}
	}

	.page-clock-create-nav__icon {
		width: 50rpx;
		height: 50rpx;
	}

	.page-clock-create-nav__text {
		font-size: 24rpx;
		color: #999;

		.page-clock-create-nav.is-active & {
			color: #333333;
		}
	}

	.page-clock-create__btn-create {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100rpx;
		border-radius: 20rpx;
		font-size: 32rpx;
		color: #333;
		background-color: #ffd940;
	}

	// footer end
</style>
