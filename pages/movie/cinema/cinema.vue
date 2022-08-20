<template>
	<view :style="cContainerStyle" class="container">
		<view class="main">
			<view class="content tui-skeleton">
				<view class="fm-film ">
					<view class="bg-xh-fm" :style="{backgroundImage:'url('+filminfo.pic+')'}"></view>
					<view class="fm-film-img tui-skeleton-rect">
						<image :src="filminfo.pic" mode="" class="fm-film-detail"></image>
					</view>
					<view class="fm-film-info">
						<view class="fm-info-title tui-skeleton-rect">
							<view class="fm-info-title-a">{{filminfo.name}} <text style="color: red;">{{filminfo.versionTypes}}</text></view>
							<!-- <view class="fm-info-title-b">the eight hundred</view> -->
						</view>
						<view class="fm-info-item">
							<view class="fm-info-item-a tui-skeleton-rect">
								<view>{{filminfo.grade?filminfo.grade:filminfo.like+"想看"}}</view>{{filminfo.grade?"(评分)":""}}
							</view>
							<view class="fm-info-item-a tui-skeleton-rect">
								{{filminfo.filmTypes}}
							</view>
							<view class="fm-info-item-a tui-skeleton-rect">
								{{filminfo.language}} | {{filminfo.duration}}分钟
							</view>
							<view class="fm-info-item-a tui-skeleton-rect">
								{{filminfo.publishTime}} 中国大陆上映
							</view>
							<!-- <view class="fm-info-item-a tui-skeleton-rect">
								{{filminfo.intro}} 中国大陆上映
							</view> -->
						</view>
					</view>
					<view class="fm-film-icon">
						<image src="../../static/icon/xia.png" mode=""></image>
					</view>
				</view>
				<view class="fm-date-select">
					<view class="fm-date-item" v-for="(date, index) in datelist" :class="datelink==index?'action':''" @click="changeDate(index,date.de_show_time)" :id="index">
						{{dedate(date.de_show_time)}}
					</view>
				</view>
				<view class="screen-top  tui-skeleton-rect">
					<block v-if="searchif==true">
						<view class="search-item">
							<image src="/static/icon/Search.png" mode="" class="search-icon"></image>
							<input type="text" placeholder="搜索影院" :focus="searchif" @input="keywordChange" confirm-type="search" class="search-text" />
						</view>
						<view class="cancle-btn-search" @click="searchbtn">
							取消
						</view>
					</block>
					<block v-if="searchif==false">
						<view class="option-select-city">
							<view class="top-citys" @click="tocity(city)">
								<view class="uni-input">{{city==''?'未获取':city}}</view>
								<image src="../../static/icon/down.png" mode=""></image>
							</view>
						</view>
						<view class="option-select-city">
							<picker @change="bindPickerChange" :value="index" :range="regions" range-key="regionname" mode="selector" style="margin-bottom: 50rpx;">
								<view class="uni-input">{{regions[index].regionname}}</view>
								<image src="../../static/icon/down.png" mode=""></image>
							</picker>
						</view>
						<view class="option-select-search" @click="searchbtn">
							<image src="../../static/icon/Search.png" mode=""></image>
						</view>
					</block>
				</view>
				<view class="option-list-tm" v-if="skeletonShow">
					<view class="list-item-tm tui-skeleton-rect"></view>
					<view class="list-item-tm2 tui-skeleton-rect"></view>
					<view class="list-item-tm3 tui-skeleton-rect"></view>
				</view>
				<view class="option-list" v-if="!skeletonShow">
					<view class="list-item tui-skeleton-rect" v-for="item in yylist" @click="tofilm(item.cinemaid)">
						<view class="item-info-a  tui-skeleton-rect">
							<view class="item-info-a-name">
								{{item.cinema_name}}
							</view>
							<view class="item-info-a-price">
								<view class="item-info-a-price-num">
									{{item.down_price}}
								</view>
								元起
							</view>
						</view>
						<view class="item-info-b  tui-skeleton-rect">
							<view class="item-info-b-address">
								{{item.cinema_addr}}
							</view>
							<view class="item-info-b-juli">
								{{item.distance_text}}
							</view>
						</view>
						<view class="item-info-c tui-skeleton-rect">
							<view class="item-info-c-block" v-for="i in objtoarr(item.cinema_service)">{{i}}</view>
						</view>
					</view>
				</view>
				<!--加载loadding-->
				<tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
				<tui-nomore v-if="!pullUpOn" backgroundColor="#fafafa"></tui-nomore>
				<!--加载loadding-->
			</view>
		</view>
		<page-loading></page-loading>
		<PopupView :show='isShow' type='top' @clickmask='isShow=false'>
			<view class="">
				<image src="../../../static/h5/share.png" mode="" style="width: 640rpx;"></image>
			</view>
		</PopupView>
		<!-- 底部导航 -->
		<TabBar zIndex="210"></TabBar>
		<!-- 底部导航 end -->
		
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import TabBar from '@/components/template/TabBar'
	// #ifdef H5
	import wxApi from "@/static/h5/wxApi.js"
	// #endif
	import ShareView from '@/components/template/ShareView.vue'
	export default {
		components: {
			TabBar,
			ShareView,
			
		},
		onShareAppMessage() {
			return this.shareData
		},
		onShareTimeline() {
			return {
				title: this.shareData.title,
				imageUrl: this.shareData.imageUrl
			}
		},
		data() {
			return {
				options: {},
				film_id:'',
				shareData: null,
				isShow: false,
				bannerType: 'imgs',
				filminfo:{}
			};
		},
		onLoad(options) {
			console.log('options.scene 111',options,options.scene)
			this.options = options
			if (options.scene) {
				const queryData = this.$util.scene_decode(options.scene) || {}
				console.log('options.scene',options.scene,queryData)
				this.options = {
					film_id: queryData.film_id,
					...this.options
				}
			}
			App.showLoading()
			this.film_id = this.options.film_id
			console.log(this.film_id)
			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline']
			})
			//#endif
		},
		onShow() {
			this.goodsShop = []
			this.getLocation()
			this.getFilmData()

		},
		computed: {
			
		
		},
		watch: {
			cityGoodsCateId(val) {
				// 请求商品列表
				this.fetchCityGoodsListRes({
					resetBeforeFetch: true
				})
			}
		},
		filters: {
			filterTime(time) {
				if (time) {
					let total = ''
					time.forEach(item => {
						let str = ''
						let datetime = new Date(Number(item[0])),
							hour = ("0" + datetime.getHours()).slice(-2),
							minute = ("0" + datetime.getMinutes()).slice(-2),
							second = ("0" + datetime.getSeconds()).slice(-2),
							datetime1 = new Date(Number(item[1])),
							hour1 = ("0" + datetime1.getHours()).slice(-2),
							minute1 = ("0" + datetime1.getMinutes()).slice(-2),
							second1 = ("0" + datetime1.getSeconds()).slice(-2);
						str = (item[2] || '') + hour + ":" + minute + ":" + second + '-' + hour1 + ":" + minute1 +
							":" + second1;
						total = total + '     ' + str
					})
					// start_time = (new Date(Number(start_time)).getHours() + 1)
					// end_time = (new Date(Number(end_time)).getHours() + 1)
					return total

				} else {
					return '无'
				}


			},
			filterStatus([sale_type, actime, value]) {
				let type = '',
					str = '',
					btnStatus = '已结束',
					{
						start_time,
						end_time
					} = actime;
				switch (sale_type) {
					case 0:
						type = '普通营销'
						break;
					case 1:
						type = '秒杀'
						break;
					case 2:
						type = '拼团'
						break;
					case 2:
						type = '抽奖'
						break;
					default:
						type = '砍价'
				}

				start_time = start_time * 1000
				end_time = end_time * 1000

				let time = new Date().getTime();
				if (time < end_time && time > start_time) {
					console.log(btnStatus)
					btnStatus = '进行中'
				}
				if (time < start_time) {
					btnStatus = '未开始'
				}
				str = btnStatus == '进行中' ? "距结束" : (btnStatus == '已结束' ? "已结束" : "距开始")
				actime.str = str
				return value == 1 ? btnStatus : (value == 0 ? type : str)

			},
			filterActivityTime({
				start_time,
				end_time,
				status
			}) {
				start_time = start_time * 1000
				end_time = end_time * 1000
				let time = new Date().getTime(),
					rest_time = 0
				if (time < end_time && time > start_time) {
					rest_time = end_time - time
				}
				if (time < start_time) {
					rest_time = start_time - time
				}
				return rest_time / 1000

			}
		},
		methods: {
			handleBtnOnlineBuyClick() {
				this.navigationTo("pages/subPages/payOnline/index?id="+(this.data && this.data.pay_online_business_id))
			},
			// 清除购物车按钮点击事件
			async handleBtnCartClearClick() {
				// 锁
				if (this.handleBtnClearClickLock) {
					return
				}
				this.handleBtnClearClickLock = true
				uni.showLoading({
					title: '请稍候...',
					mask: true
				})
				try {
					const res = await App._postP('cart/clear',{
						store_id: this.requestData.store_id,
						cart_type: 'store_wm'
					}) || {}
					uni.hideLoading()
					uni.showToast({
						title: res.msg || '清空成功！',
						icon: 'none'
					})
					this.cityCartRes = []
					this.cityCartTotalRes = {}
					this.goodsPopupVisible = false
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
				this.handleBtnClearClickLock = false
			},
			// 选择规格按钮的点击事件
			handleBtnSpecClick(item,index) {
				this.specGoodsId = item.goods_id
				if(item.goods_id != this.specRes.goods_id) {
					// id 不同 才请求
					this.specRes = {}
					this.fetchSpecRes({
						goods_id: item.goods_id
					})
				}
				// 打开规则弹窗
				this.specificationsPopupVisible = true
			},
			// 多规格数量变化事件
			handleSpecNumChange(item) {
				console.log('handleSpecNumChange',item)
				this.handleGoodsNumChange(item.num,item)
			},
			// 同城商品购物车数量变化事件
			async handleGoodsNumChange(val, item) {
				if (this.data.week_time != 1) {
					this.buyTipVisible = true;
					return
				}

				if (val < 0) {
					return
				}
				const num = ((+val) - (+item.total_num)) || 0
				console.log('handleGoodsNumChange:num', item)
				if (!num) return
				let apiName = 'cart/add'
				if (num < 0) {
					apiName = 'cart/sub'
				}
				if (this.handleGoodsNumChanging) {
					return
				}
				this.handleGoodsNumChanging = true
				uni.showLoading({
					title: '请稍候'
				})
				try {
					const res = await App._postP(apiName, {
						goods_id: item.goods_id,
						goods_num: num,
						goods_sku_id: item.goods_sku_id || this.$util.deepGet(item, 'sku.0.spec_sku_id'),
						store_id: this.requestData.store_id,
						cart_type: 'store_wm'
					})
					// 更新购物车数据量
					await Promise.all([
						this.fetchCityCartRes(),
						this.fetchCityCartTotalRes()
					])
					uni.hideLoading()
				} catch (e) {
					uni.hideLoading()
					console.log('handleGoodsNumChange:error', e)
					//TODO handle the exception
				}
				this.handleGoodsNumChanging = false
			},
			// 商品分类点击事件
			handleCityGoodsCateClick(item) {
				console.log('handleCityGoodsCateClick', item)
				// 记录当前同城配送商品的分类id
				this.cityGoodsCateId = item.id
			},
			handleBtnShareClick() {
				this.$refs.shareView.shareswich()
			},
			setShareData(storeDetail) {
				let clientType = App.getClientType(),
					shareData = null;
				if (clientType === "4") {
					jWeixin.ready(() => {
						wxApi.wxShare({
							title: this.$util.deepGet(storeDetail, 'store_share_title') || storeDetail
								.business_name + '(' + storeDetail.name + ')', // 分享标题
							desc: storeDetail.describe, // 分享描述
							link: `${App.siteInfo.siteroot}h5/#/pages/subPages/shopDetail/shopDetail?bus_id=${this.bus_id}&store_id=${this.requestData.store_id}&referee_id=${this.globalSaveRefereeId}&i=${App.getUniacid()}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: this.$util.deepGet(storeDetail, 'store_share_image.0.file_path') || (
								this.swiperImage && this.swiperImage.length && this.swiperImage[0]
								.file ? this.swiperImage[0].file[0]
								.file_path : ''), // 分享图标
						});
					});
				} else {
					shareData = {
						title: this.$util.deepGet(storeDetail, 'store_share_title') || storeDetail.business_name +
							'(' + storeDetail.name + ')' + '邀请您来看看~',
						imageUrl: this.$util.deepGet(storeDetail, 'store_share_image.0.file_path') || (this
							.swiperImage && Array.isArray(this.swiperImage) && this.swiperImage.length > 0 &&
							this.swiperImage[
								0].file ? this.swiperImage[0].file[0].file_path : ''),
						path: `/pages/subPages/shopDetail/shopDetail?bus_id=${this.bus_id}&store_id=${this.requestData.store_id}&referee_id=${this.globalSaveRefereeId}`
					};
				}
				this.shareData = shareData;
			},
			bannerChange() {
				this.bannerType = this.bannerType === "imgs" ? "video" : "imgs";
			},
			checkMore(type) {
				console.log(this.total, this.page, this.last_page, '==============')
				if (type == 1) {
					this.page++
					if (this.page <= this.last_page) {
						this.getShopData()
					}

				}

				if (type == 0) {
					this.page = 1
					this.getShopData()
				}

			},
			getFilmData() {
				App._post_form('movie.mahua/movieDetail', {
					film_id : this.film_id
				}, res => {
					let {
						data: {
							current_page,
							last_page,
							total: total = 0,
							data: data = []
						}
					} = res;
					console.log(res)
					this.setData({
						filminfo:res.data
					})
				})
			},
			shareBtn() {
				if (this.appClientType === "3") {
					uni.showToast({
						icon: "none",
						title: "请使用自带浏览器分享~"
					})
				} else if (this.appClientType === "4") {
					this.isShow = true;
				}

			},
			// 根据商圈筛选大家喜欢
			likeDataChange(item) {
				this.likeLoading = true
				App._post_form('Business/likeCircle', {
					circle_id: item.circle_id
				}, res => {
					this.data.like = res.data ? res.data : []
				}, () => {}, () => {
					this.likeLoading = false
				})

			},
			loadMore(type) {
				if (type == 1) {
					this.showAll = this.showAll == 4 ? this.goodsInShop.length : 4
				} else {
					this.showAll1 = this.showAll1 == 4 ? this.likeData.length : 4
				}


			},
			// 根据商圈筛选大家还喜欢
			tradeAreaChange(item) {
				this.storeLoading = true
				App._post_form('Business/storeInfo', {
					isNeibor: 2,
					sort_id: "",
					lng: this.requestData.lng,
					lat: this.requestData.lat,
					recommend: 2,
					filter: "",
					circle_id: item.circle_id,
					page: 1
				}, res => {
					this.data.bus_store = res.data.data

				}, () => {}, () => {
					this.storeLoading = false
				})
			},
			getShopDetailData() {

				App._post_form('Business/storeDetail', this.requestData, res => {
					this.data = res.data
					this.setShareData(res.data)
					if (this.data.video) {
						this.videoParams.params.videolink = this.data.video.file_path;
						this.videoParams.params.videocover = this.data.image ? this.data.image.file_path : "";
					}
					this.data.store_score = parseFloat(this.data.store_score)
					if (this.data.type == 2) {
						this.fetchCityGoodsCateRes()
						this.fetchCityCartRes()
						this.fetchCityCartTotalRes()
					}
					App.hideLoading()
				}, res => {
					App.hideLoading()
				})
			},
			skip_member() {
				App.navigationTo({
					url: "pages/subPages/member/index/index"
				});
			},
			getLocation() {
				let _this = this
				App.getLocation().then(res => {
					_this.requestData.lng = res.longitude;
					_this.requestData.lat = res.latitude;
					this.getShopDetailData()
				}).catch(res => {
					App.hideLoading()
				});
			},
			scorllTo(type) {
				this.current = type
				let selector = type == 1 ? ".copoun-part" : (type == 2 ? '.goods' : '.comment-part')
				uni.createSelectorQuery().select('.container').boundingClientRect((res1) => {
					uni.createSelectorQuery().select(selector).boundingClientRect((res) => {
						uni.pageScrollTo({
							duration: 500,
							scrollTop: res.top - res1.top
						})
					}).exec();
				}).exec();

			},
			phoneBus(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber
				})

			},
			nevTobus() {
				let {
					name,
					address,
					lat,
					lng
				} = this.data
				App.openLocation({
					name,
					address,
					latitude: Number(lat),
					longitude: Number(lng),
					success() {
						console.log('success');
					}
				});
			},
			previewImage() {

				// uni.previewImage({
				// 	urls: this.quaimg
				// })

			},
			// 请求当前规格选择的接口数据
			async fetchSpecRes({
				goods_id
			}) {
				try {
					const res = await App._getP('Goods/goodsSku', {
						goods_id: goods_id || this.this.specGoodsId
					})
					this.specRes = res.data || []
				} catch (e) {
					console.log('fetchSpecRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求同城商品的分类接口数据
			async fetchCityGoodsCateRes() {
				try {
					const res = await App._getP('Business/getBusinessCate', {
						store_id: this.requestData.store_id
					})
					this.cityGoodsCateRes = res.data || []
					if (!this.cityGoodsCateId) {
						this.cityGoodsCateId = this.options.cityCateId || res.data && res.data[0] && res.data[0]
							.category_id || 'all'
					}
				} catch (e) {
					console.log('fetchCityGoodsCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求同城配送购物车的数据
			async fetchCityCartRes() {
				try {
					const res = await App._getP('cart/cartAll', {
						store_id: this.requestData.store_id,
						type: 50,
						cart_type: 'store_wm'
					})
					this.cityCartRes = res.data || {}
				} catch (e) {
					//TODO handle the exception
					console.log('fetchCityCartRes', e)
				}
			},
			// 请求购物车的总计数据
			async fetchCityCartTotalRes() {
				try {
					const res = await App._getP('cart/getCartAllData', {
						store_id: this.requestData.store_id,
						cart_type: 'store_wm'
					})
					this.cityCartTotalRes = res.data || {}
				} catch (e) {
					//TODO handle the exception
					console.log('fetchCityCartRes', e)
				}
			},
			// 请求同城商品列表的分页接口数据
			async fetchCityGoodsListRes({
				resetBeforeFetch = false,
			} = {}) {
				console.log('fetchCityGoodsListRes 0')
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.cityGoodsListRes = {
							...this.cityGoodsListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false
						}
					}
					// 如果没有更多就不必请求了
					if (!this.cityGoodsListRes.hasMore) {
						return Promise.reject()
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.cityGoodsListRes.isFetching = true
					// 请求数据
					const res = await App._getP('Business/activityGoods', {
						page: this.cityGoodsListRes.page + 1,
						list_row: this.cityGoodsListRes.list_row,
						bus_id: this.bus_id,
						store_id: this.requestData.store_id,
						category_id: this.cityGoodsCateId === 'all' ? '' : this.cityGoodsCateId
					})
					// 取得新的数据
					const newData = this.$util.deepGet(res, 'data.data', [])
					// 判断是否有更多
					const hasMore = newData.length >= this.cityGoodsListRes.list_row
					// 设置新的数据
					this.cityGoodsListRes = {
						...this.cityGoodsListRes,
						page: this.cityGoodsListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ? newData : this.cityGoodsListRes.data.concat(newData),
						hasMore,
						isFetching: false
					}
					console.log('this.cityGoodsListRes11111111111', this.cityGoodsListRes.data[0])
				} catch (e) {
					console.log(e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},

		}
	}
</script>

<style lang="scss">
	.container {
		position: relative;
		box-sizing: border-box;
		padding-bottom: 240rpx;
		background-position: center top;
		background-size: 100% 400rpx;
		background-repeat: no-repeat;
	}

	.header-bg-wrapper {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		overflow: hidden;
		z-index: 0;
	}

	.header-bg {
		width: 100%;
		height: 400rpx;
		filter: blur(10px);
	}

	.goods-swiper,
	.goods-video {
		width: 100%;
		height: 472rpx;
		position: relative;
		z-index: 1;
		overflow: hidden;
	}

	.goods-video video {
		width: 100%;
		height: 100%;
	}


	.swiper-item {
		width: 100%;
		height: 100%;
	}

	.swiper-item__image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.goods-header {
		position: relative;
	}

	.goods-header .swiper-index {
		position: absolute;
		right: 42rpx;
		bottom: 33rpx;
		z-index: 2;
		background: rgba(0, 0, 0, 1);
		opacity: 0.2;
		border-radius: 32rpx;
		font-size: 20rpx;
		font-weight: bold;
		color: #FFFFFF;
		padding: 0 10rpx;
		line-height: 1.5em;
		text-align: center;
	}

	.banner-change {
		width: 150rpx;
		height: 46rpx;
		text-align: center;
		position: absolute;
		left: 50%;
		bottom: 30rpx;
		transform: translateX(-50%);
		z-index: 2;
		background: rgba(255, 255, 255, .5);
		border-radius: 20px;
	}

	.change-item {
		font-size: 24rpx;
		line-height: 46rpx;
		text-align: center;
		color: #333333;
		width: 50%;
	}

	.change-item.active {
		border-radius: 20px;
		background: rgba(255, 217, 64, 1);
		box-shadow: 0 4rpx 8rpx 0 rgba(122, 122, 122, 0.35);
	}

	.main {
		position: relative;
		box-sizing: border-box;
		overflow: hidden;
		z-index: 1;

		.shop-detail {
			background-color: #fff;
			padding: 30rpx;
			box-sizing: border-box;
			z-index: 11;
			border-radius: 10rpx;




			.store-label {
				padding: 5rpx 6rpx;
				background: rgba(242, 130, 67, 1);
				border-radius: 4px;
			}

			.work-status {
				padding: 5rpx 6rpx;
				color: #F28243;
				background: rgba(255, 237, 226, 1);
				border-radius: 4px;
			}

			swiper {
				width: 100%;
				height: 472rpx;
				border-radius: 10rpx;
				overflow: hidden;

			}
		}

		.tab-title {
			color: #F28243;
			position: relative;
		}

		.tab-title::after {
			content: '';
			width: 100%;
			height: 6rpx;
			position: absolute;
			background-color: #F28243;
			bottom: -12rpx;
			border-radius: 6rpx;
			left: 0;
		}

		.commemt-content {
			border-radius: 10rpx;
			padding: 30rpx 20rpx;
			box-sizing: border-box;

			.user-image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}

			.content {
				width: calc(100% - 100rpx);

				image {
					width: 32%;
					height: 180rpx;
					margin-right: 1%;
				}
			}

		}

		.title {
			margin: 40rpx 0;
			position: relative;
		}

		.title::after {
			content: '';
			position: absolute;
			left: 147rpx;
			transform: rotate(45deg);
			bottom: -1rpx;
			width: 0;
			height: 0;
			border: 10rpx solid rgba(0, 0, 0, 0);
			border-top-color: var(--theme-color);
		}


		.member {
			height: 80rpx;
			background: linear-gradient(169deg, rgba(90, 89, 90, 1) 0%, rgba(55, 55, 55, 1) 100%);
			border-radius: 4rpx;
			color: #FFE1B8;
			margin: 40rpx 0;
			padding: 0 20rpx;
			box-sizing: border-box;

			.buy-btn {
				padding: 10rpx 13rpx;
				border: 1rpx solid #FFE1B8;
				border-radius: 30rpx;
			}
		}



		.copoun {
			background: linear-gradient(135deg, rgba(255, 128, 56, 1) 0%, rgba(255, 103, 18, 1) 100%);
			height: 70rpx;
			position: relative;
			margin-bottom: 30rpx;
			padding: 0 30rpx;
			box-sizing: border-box;

		}

		.copoun:after {
			position: absolute;
			content: '';
			width: 20rpx;
			height: 20rpx;
			top: 25rpx;
			left: -10rpx;
			border-radius: 50%;
			background-color: #F4F4F4;
		}

		.copoun::before {
			position: absolute;
			content: '';
			width: 20rpx;
			height: 20rpx;
			top: 25rpx;
			right: -10rpx;
			border-radius: 50%;
			background-color: #F4F4F4;
		}

		.active-goods {
			position: relative;

			.b-f {
				background-color: #fff;
				padding: 20rpx;
			}

			.label1 {
				height: 80rpx;
				width: 90rpx;
				background-image: url('../../../static/images/business/label.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				position: absolute;
				top: -16rpx;
				left: 8rpx;

				view {
					width: 67%;
				}

			}

			.goods-image {
				position: relative;
				width: 100%;
				height: 388rpx;
				border-radius: 6rpx 6rpx 0rpx 0rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}

				.label {
					width: 100%;
					height: 50rpx;
					background-color: rgba(0, 0, 0, 0.3);
					position: absolute;
					bottom: 0;
					left: 0;
				}

				/deep/ .uni-countdown__splitor {
					color: #fff !important;
					padding: 0 !important;
				}
			}

			.status {
				background: rgba(255, 237, 226, 1);
				border-radius: 20px;
				padding: 8rpx 10rpx;
				color: #F28243;
			}

		}

		.two-goods {
			width: 398rpx;

			.goods-image {
				width: 100%;
				height: 224rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}


		.goods-part {
			overflow: hidden;
			padding: 10rpx 20rpx 30rpx;
			box-sizing: border-box;
			border-radius: 10rpx;

			.goods-item {
				width: 100%;
				height: 150rpx;

				image {
					border-radius: 10rpx;
					width: 150rpx;
					height: 150rpx;
				}

				.buy-goods-btn {
					padding: 10rpx 30rpx;
					border-radius: 50rpx;
				}
			}

		}


	}
</style>

<style lang="scss" scoped>
	.parse-wrapper {
		box-sizing: border-box;
		margin-top: 20rpx;
		padding: 15rpx 10rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.buy-tip {
		width: 70vw;
		border-radius: 20rpx;
		background-color: #fff;
		overflow: hidden;
	}

	.tips-title {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100rpx;
		font-size: 32rpx;
		background-color: #fff;
		z-index: 0;
		overflow: hidden;

		&::before {
			position: absolute;
			top: 0;
			left: -20rpx;
			bottom: 0;
			right: -20rpx;
			display: block;
			content: '\20';
			border-radius: 0 0 50% 50%;
			background-color: var(--help-colo, #FE504F);
			z-index: -1;
		}
	}

	.buy-tips__text {
		box-sizing: border-box;
		padding: 30rpx;
		font-size: 26rpx;
	}

	.buy-tips__btn {
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 9999rpx;
		margin: 20rpx 30rpx;
		margin-top: 200rpx;
		font-size: 28rpx;
		color: #fff;
		text-align: center;
		background-color: var(--help-colo, #FE504F);
	}
	.page_btn-choice-spec {
		box-sizing: border-box;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 20rpx;
		height: 50rpx;
		font-size: 24rpx;
		background: var(--theme-color, #FFD940);
		color: var(--auxiliary-color, #333333);
		border-radius: 10rpx;
	}
	.btn-online-buy {
		box-sizing: border-box;
		display: flex;
		height: 80rpx;
		align-items: center;
		margin-top: 30rpx;
		color: #F28243;
		font-size: 28rpx;
		justify-content: center;
		border: 1px solid currentColor;
		border-radius: 10rpx;
	}
.fm-film{
		/* padding:30upx; */
		overflow:hidden;
		position:relative;
		display: flex;
	}
	.bg-xh-fm{
		width:100%;
		height:100%;
		position: absolute;
		background:hsla(0,0%,100%,.25) border-box;
		 background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		-webkit-filter: blur(15px);
		-moz-filter: blur(15px);
		-o-filter: blur(15px);
		-ms-filter: blur(15px);
		filter:blur(15px);
		z-index: -1;
	}
	.list-item-tm:first-child{
		margin-top:50rpx;
	}
	.list-item-tm{
		height:90rpx;
		width:80%;
		margin-top:15rpx;
	}
	.list-item-tm2{
		height:90rpx;
		width:70%;
		margin-top:15rpx;
	}
	.list-item-tm3{
		height:90rpx;
		width:90%;
		margin-top:15rpx;
	}
	.fm-film-img{
		width:200upx;
		height:290upx;
		border:#F1F1F1 solid 1upx;
		margin-top:30upx;
		margin-left:30upx;
	}
	.fm-film-img image{
		width:200upx;
		height:290upx;
	}
	.fm-film-info{
		width:400upx;
		margin-top:30upx;
		margin-left:20upx;
		display: flex;
		flex-direction:column;
		color:#fff;
	}
	.fm-info-title{
		font-size:30upx;
	}
	.fm-info-title-a{
		font-size:36upx;
		font-weight: bold;
		margin-top:0rpx;
	}
	.fm-info-title-b{
		font-size:28upx;
	}
	
	.fm-film-icon{
		flex:1;
		padding:150upx 0;
	}
	
	.fm-film-icon image{
		width:50upx;
		height:50upx;
		margin:0 auto;
		display:block;
		transform: rotate(-90deg);
		-ms-transform: rotate(-90deg); /* IE 9 */
		-moz-transform: rotate(-90deg); /* Firefox */
		-webkit-transform: rotate(-90deg); /* Safari and Chrome */
		-o-transform: rotate(-90deg); /* Opera */
	}
	
	.fm-info-item{
		display: flex;
		flex-direction:column;
		font-size:23upx;
		margin-top:10upx;
	}
	.fm-info-item-a{
		margin-top:10upx;
	}
	
	.fm-info-item-a view{
		display:inline-block;
		font-size:36upx;
		color:#f4ce43;
		margin-right:5upx;
	}
	
	.fm-date-select{
		white-space: nowrap;
		overflow-x: scroll;
		min-height:81rpx;
		background:#fff;
	}
	.fm-date-select view{
		display:inline-block;
		padding:20upx 30upx;
		font-size:28upx;
		
	}
	
	.fm-date-select .action{
		color:#FF6666;
		border-bottom:#FF6666 solid 1upx;
	}
	
	 /* for Chrome */
	.fm-date-select::-webkit-scrollbar {
	    display: none;
	}
	
	.screen-top{
		background:#fff;
		display:flex;
		padding:10upx 0;
		border-top: #e6e6e6 solid 1upx;
		border-bottom: #e6e6e6 solid 1upx;
		min-height:50rpx;
	}
	.option-select-city{
		flex:1;
		height:50upx;
		border-right: #E7E6EB solid 1upx;
		text-align: center;
		font-size:25upx;
		line-height:50upx;
		display:flex;
		/* padding:0 60upx; */
	}
	
	.option-select-city view{
		display:inline-block;
	}
	
	.option-select-city picker{
		display:block;
		margin:0 auto;
	}
	
	.option-select-city .top-citys{
		display:block;
		margin:0 auto;
	}
	.option-select-city image{
		width:30upx;
		height:30upx;
		display:inline-block;
		margin-top:10upx;
		float:right;
	}
	
	.option-select-search{
		width:120upx;
	}
	
	.option-select-search image{
		width:30upx;
		height:30upx;
		display: block;
		margin:0 auto;
		margin-top:10upx;
	}
	
	.list-item{
		background:#fff;
		display: flex;
		padding:20upx 25upx;
		flex-direction:column;
		border-bottom:#F1F1F1 solid 1upx;
	}
	
	.item-info-a{
		display:flex;
	}
	.item-info-a-name{
		flex:1;
		font-size:32upx;
		overflow: hidden;
	}
	.item-info-a-price{
		/* flex:1; */
		font-size:25upx;
		color:#808080;
	}
	.item-info-a-price view{
		font-size:30upx;
		display:inline-block;
		color:#ff0000;
	}
	
	.item-info-b{
		display:flex;
		margin-top:20upx;
	}
	.item-info-b-address{
		font-size:25upx;
		color:#808080;
		flex:1;
		overflow: hidden;
		word-break: break-all;  /* break-all(允许在单词内换行。) */
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
	.item-info-b-juli{
		font-size:25upx;
		color:#808080;
	}
	
	.item-info-c{
		display:flex;
		margin-top:20upx;
	}
	.item-info-c .item-info-c-block{
		font-size:20upx;
		border:#007AFF solid 1upx;
		color:#007AFF;
		margin-left:8upx;
		padding:0 8upx;
		border-radius: 6upx;
	}
	
	.search-item{
		width:80%;
		height:40rpx;
		background-color:#F8F8F8;
		border-radius: 30rpx;
		display: flex;
		padding:10rpx 10rpx;
		margin-left:23rpx;
	}
	
	.search-icon{
		width:35rpx;
		height:35rpx;
		/* flex:1; */
		margin-left:10rpx;
		margin-top:5rpx;
	}
	
	.search-text{
		flex:1;
		font-size:28rpx;
		margin-left:10rpx;
		padding-bottom: 5rpx;
		color:#999999;
	}
	.cancle-btn-search{
		padding:10rpx 5rpx;
		font-size:28rpx;
		margin-left:15rpx;
	}
</style>
