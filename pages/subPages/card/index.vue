<template>
	<view class="page-card-index">
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar :title="cTitle" :background="{ background: 'transparent' }" immersive is-fixed :border-bottom="false"
		 title-color="#333333" />
		<!-- #endif -->
		<!-- 顶部搜索框 -->
		<view class="top-search" :class="{'is-active': topSearchFocus}">
			<view class="top-search__left">
				<view class="top-search__city">{{agentMixin_cLocationName}}</view>
			</view>
			<view class="top-search__center">
				<view class="iconfont icon-search"></view>
				<input v-model="cardSearchValue" class="top-search__input" type="text" placeholder="输入关键词" @focus="handleTopSearchFocus"
				 @blur="handleTopSearchBlur" />
			</view>
		</view>
		<!-- 顶部搜索框 end -->
		<!-- 顶部导航 -->
		<view class="top-nav-list">
			<view class="top-nav-item is-active" @click.stop="toggleShare">
				<image class="top-nav-item__img" src="./static/images/icon-poster-2.png"></image>
				<view class="top-nav-item__text">海报</view>
			</view>
			<view class="top-nav-item p-r" @click.stop="navigationTo('pages/subPages/merchant/enter/enter')">
				<image class="top-nav-item__img" src="./static/images/icon-settled.png"></image>
				<view class="top-nav-item__text">入驻</view>
				
			</view>
		</view>
		<!-- 顶部导航 end -->
		<!-- 地图 -->
		<view class="business-map-wrapper">
			<map class="business-map-wrapper__map" :longitude="mapLng" :latitude="mapLat" :markers="cMarkers" @markertap="handleMapMakerClick" />
		</view>
		<!-- 地图 end -->
		<!-- 详情弹窗 -->
		<popup-view :show="detailsPopupVisible" type="bottom" @on-mask-touchstart="detailsPopupCollapse = true" :overlay="!detailsPopupCollapse"
		 overlayStyle="background-color: transparent;">
			<view class="details-wrapper app-clearfix" @click="detailsPopupCollapse = false">
				<!-- 开关指示器 -->
				<view class="details-wrapper__close-wrapper" @click="detailsPopupCollapse = false">
					<view class="details-wrapper__btn-close"></view>
				</view>
				<!-- 开关指示器 end -->
				<!-- 搜索框 -->
				<!-- 				<view class="search-card">
					<view class="search-card__left">
						<view class="search-card__city">{{agentMixin_cLocationName}}</view>
					</view>
					<view class="search-card__center">
						<view class="iconfont icon-search"></view>
						<input v-model="cardSearchValue" class="search-card__input" type="text" placeholder="输入关键词" @focus="detailsPopupCollapse = false" />
					</view>
				</view> -->
				<!-- 搜索框 end -->

				<!-- 滚动容器 -->
				<scroll-view class="details-wrapper__scorll" :class="{'is-collapse': detailsPopupCollapse}" scroll-y="true">
					<view>
						<!-- 卡包轮播 -->
						<swiper class="card-swiper" :autoplay="false" previous-margin="32rpx" next-margin="32rpx" :current="swiperCurrent"
						 @change="handleCardSwiperChange">
							<swiper-item class="card-swiper__item" v-for="(item,index) in cCardList" :key="item.id">
								<view class="card-swiper-card" :class="{'is-active': index == swiperCurrent}" :style="{backgroundImage: `url(${item.bgUrl})`}">
									<view class="card-swiper__center" :style="{color: item.color || '#fff' }">
										<view v-if="item.title" class="card-swiper-card__text">{{item.title}}</view>
										<view class="card-swiper-card__title">{{item.cate}}</view>
									</view>
									<!-- 购买按钮 -->
									<view class="card-swiper-card__left">
										<button class="btn-normal card-swiper-card__btn" @click="handleBtnBuyClick(item)">购买</button>
										<view class="card-swiper-card__tip" :style="{color: item.color || '#fff' }">滑动查看更多<view class="iconfont is-inline icon-right"></view></view>
									</view>
								</view>
							</swiper-item>
						</swiper>
						<!-- 卡包轮播 end -->
						<!-- 商家列表 -->
						<view class="business-section">
							<view class="business-section__title-wrapper">
								<view class="business-section__title is-active">
									<view>周边商家</view>
									<view class="iconfont icon-110 main-color" style="font-size: 40rpx;"></view>
								</view>
								<view class="business-section__title" @click="navigationTo('pages/subPages/card/list')">
									<view>我的{{settingData.card.font.ci}}票</view>
									<u-badge v-if="mainMixin_userInfo.card_count" :count="mainMixin_userInfo.card_count" :offset="[-16,0]" size="mini"></u-badge>
								</view>
							</view>
							<business-list :list="cBusinessList" :isRounded="true" @on-item-click="handleBusinessItemClick" />
							<!-- 商家总数提醒 -->
							<view class="business-total">周边{{cBusinessList.length}}家商户为您服务</view>
							<!-- 商家总数提醒 end -->
						</view>
						<!-- 商家列表 end -->
					</view>
				</scroll-view>
				<!-- 滚动容器 end -->

			</view>
		</popup-view>
		<!-- 详情弹窗 end -->

		<!-- 分享菜单 -->
		<share-view ref="shareView" poster-type="cardBag" :height="667" :width="375"></share-view>
		<!-- 分享菜单 end -->

		<!-- 底部导航 -->
		<tab-bar zIndex="500" />
		<!-- 底部导航 end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import PopupView from '@/components/template/PopManager.vue'
	import BusinessList from './components/BusinessListV2.vue'
	import agentMixin from '@/mixins/agentMixin'
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	import TabBar from '@/components/template/TabBar'
	import ShareView from '@/components/template/ShareView.vue'
	export default {
		mixins: [
			agentMixin,
			pageShareMixin
		],
		components: {
			PopupView,
			BusinessList,
			TabBar,
			ShareView
		},
		data() {
			return {
				options: {},
				// 卡包分类的接口数据
				cardCateRes: [],
				// 商家列表的接口数据
				storeRes: [],
				// 是否显示详情弹窗
				detailsPopupVisible: true,
				// 详情弹窗是否折叠
				detailsPopupCollapse: false,
				// 是否隐藏
				// 当前搜索框的值
				cardSearchValue: '',
				// 顶部搜索框是否获取焦点
				topSearchFocus: false,
				// 当前卡片轮播的激活项
				swiperCurrent: 0,
				// 当前的纬度
				lat: 30.57447,
				// 当前的经度
				lng: 103.92377,
				mapLat: 30.57447,
				mapLng: 30.57447,
			}
		},
		computed: {
			// 标题
			cTitle() {
				return this.$util.deepGet(this.settingData, 'card.font.ka_bao', '') + '首页'
			},
			// 右下角导航按钮的配置
			cBtnCardNav() {
				const data = this.$util.deepGet(this.settingData, 'card.button', {})
				return {
					...data,
					imgUrl: this.$util.deepGet(data, 'icon.0.file_path', '')
				}
			},
			// 当前轮播激活的项
			cSwiperActiveItem() {
				return this.cCardList[this.swiperCurrent] || {}
			},
			// 当前要显示的卡包列表
			cCardList() {
				// return [
				//     {
				//         id: '121212',
				//         bgUrl: 'https://via.placeholder.com/690x170/000000/000000',
				//         cate: '年卡',
				//         title: '某某洗车行卡某某洗车行卡某某洗车行卡某某洗车行卡',
				//         times: 20
				//     }
				// ]
				return (this.cardCateRes || []).map(item => ({
					_source: item,
					id: item.card_class_id,
					bgUrl: item.image || '',
					title: item.alias_title || '',
					cate: item.name,
					color: item.color
				}))
			},
			// 格式化的商家数据
			cBusinessList() {
				const card_id = ''
				return (this.storeRes || []).map(item => {
					let statusStr = ''
					let statusClass = ''
					if (item.week == 1) {
						statusStr = '营业中'
					} else if (item.week == 2) {
						statusStr = '休息中'
						statusClass = 'is-disabled'
					}
					return {
						_source: item,
						id: item.id,
						imgUrl: item.storelogo || '',
						title: item.name || '',
						// 状态
						statusStr,
						// 状态class
						statusClass,
						// 距离
						distanceStr: `${item.width || ''}km`,
						// 电话
						phone: item.mobile || '',
						// 经纬度
						latitude: item.lat,
						longitude: item.lng,
						// 地址名称
						addressName: item.store_introduce || item.detailed_address || '',
						// 详细地址
						address: item.store_introduce || item.detailed_address || ''
					}
				})
			},
			// 当前地图上的标记
			cMarkers() {
				return this.cBusinessList.filter(item => item.title && item.latitude && item.longitude).map(item => ({
					id: item.id,
					width: 48,
					height: 48,
					latitude: item.latitude,
					longitude: item.longitude,
					// callout: {
					// 	content: item.title,
					// 	textAlign: 'center',
					// 	borderRadius: 4,
					// 	bgColor: '#ffffff',
					// 	color: '#333333',
					// 	padding: '4',
					// 	display: 'ALWAYS'
					// },
					// iconPath: 'https://via.placeholder.com/16x20/2a9ff6/fffffff'
					iconPath: this.$util.deepGet(this.settingData, 'card.maker_icon.0.file_path', '') ||
						require(
							'./static/images/icon-map-maker.png')
				}))
			},
			cShareViewcustomStyle() {
				return `bootom: ${uni.upx2px(100)};`
			}
		},
		watch: {
			cBusinessList(val) {
				const item = val && val[0]
				if (item && item.longitude && item.latitude) {
					this.changeMapCenterThrottle({
						lat: item.latitude,
						lng: item.longitude
					})
				}
			},
			cSwiperActiveItem(val) {
				if (val.id) {
					this.fetchStoreResIfNeededThrottle()
				}
			},
			cardSearchValue(val) {
				this.fetchStoreResIfNeededThrottle()
			},
			'settingData.card.font': {
				handler(val) {
					uni.setNavigationBarTitle({
						title: val.ka_bao + '首页'
					})
				},
				immediate: true
			}
		},
		onLoad(options) {
			this.options = options

		},
		async onShow() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				const location = await App.getLocation().catch(() => {}) || {}
				this.lat = location.latitude
				this.lng = location.longitude
				await Promise.all([this.fetchCardCateRes().catch(() => {}), this.agentMixin_fetchLocationRes().catch(
					() => {})])
				if (this.options.scene) {
					const queryData = this.$util.scene_decode(this.options.scene)
					// queryData.a是referee_id
					console.log('queryData.a', queryData.a)
					if (queryData.a) {
						App.saveRefereeIdX(queryData.a)
					}

				}
				this.shareData = this.pageShareMixin_createShareData({
					imgUrl: this.$util.deepGet(this.settingData, 'card.share_image.0.file_path', ''),
					title: this.$util.deepGet(this.settingData, 'card.font.ka_bao', '') + '首页',
					desc: this.$util.deepGet(this.settingData, 'card.share_content', '')
				})
				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
				// TODO handle the exception
			}
		},
		created() {
			this.changeSwiperCurrentByCrdSearchValueThrottle = this.$util.throttle(val => {
				console.log('changeSwiperCurrentByCrdSearchValueThrottle')
				this.changeSwiperCurrentByCrdSearchValue(val)
			}, 200, {
				leading: true,
				trailing: true
			})
			this.fetchStoreResIfNeededThrottle = this.$util.throttle(val => {
				this.fetchStoreResIfNeeded(val)
			}, 200, {
				leading: true,
				trailing: true
			})
			this.changeMapCenterThrottle = this.$util.throttle(val => {
				console.log('changeMapCenterThrottle')
				this.changeMapCenter(val)
			}, 200, {
				leading: true,
				trailing: true
			})
		},
		methods: {
			toggleShare() {
				this.$refs.shareView.shareswich()
			},
			// 题图标记点击事件
			handleMapMakerClick(e) {
				const id = e.detail.markerId
				const item = this.cBusinessList.find(item => item.id == id)
				this.handleBusinessItemClick(item)
			},
			// 商家列表项点击事件
			handleBusinessItemClick(item) {
				console.log('handleBusinessItemClick', item._source)
				this.goStoreDetails(item._source)
			},
			// 顶部输入框获取焦点事件
			handleTopSearchFocus() {
				this.detailsPopupCollapse = false
				this.topSearchFocus = true
			},
			// 顶部输入框失去焦点事件
			handleTopSearchBlur() {
				this.topSearchFocus = false
			},
			// 右下角导航按钮点击事件
			handleBtnNavClick(item = {}) {
				let {
					link: url = '',
					type
				} = item,
				kf_phone = this.settingData.kf_phone
				if (type === '1') {
					url = 'pages/subPages/user/service'
					// #ifndef H5
					return
					// #endif
				} else if (type === '2') {
					uni.makePhoneCall({
						phoneNumber: kf_phone // 仅为示例
					})
					return
				} else if (type === '3') {
					if (url.indexOf('pages/mainPages/index/index') !== -1) {
						// #ifdef H5
						url += '?i=' + App.getUniacid() + '&aid=' + App.siteInfo.aid
						// #endif
						uni.reLaunch({
							url: '/' + url
						})
						return
					}
				} else if (type === '4' || type === '5') {
					App.navigationTo({
						url: 'pages/subPages/card/poster',
						redirect: true
					})
					return
				} else if (type === 'cart') {
					url = 'pages/subPages/flow/index'
					// #ifdef H5
					url += '?i=' + App.getUniacid()
					// #endif
					uni.reLaunch({
						url: '/' + url
					})
					return
				}
				App.navigationTo({
					url
				})
			},
			// 卡包分类按钮 购买按钮的点击事件
			handleBtnBuyClick(item) {
				console.log('handleBtnBuyClick', item)
				// 跳转到订单页面
				App.navigationTo({
					url: `pages/subPages/card/createOrder?${App.urlEncode({
                    card_class_id: item.id
                })}`
				})
			},
			// 卡片轮播change事件
			handleCardSwiperChange(e) {
				this.swiperCurrent = e.detail.current
			},
			changeMapCenter(val) {
				const {
					lat,
					lng
				} = val || {}
				if (!lat || !lng) return
				this.mapLat = lat
				this.mapLng = lng
			},
			// 跳转到门店详情
			goStoreDetails({
				store_id,
				bus_id
			} = {}) {
				App.navigationTo({
					url: 'pages/subPages/shopDetail/shopDetail?' + App.urlEncode({
						store_id,
						bus_id
					})
				})
			},
			// 根据当前输入改变轮播图激活项
			changeSwiperCurrentByCrdSearchValue(val = '') {
				if (!val) {
					return
				}
				const index = this.cCardList.findIndex(item => {
					const cate = item.cate || ''
					return val.indexOf(cate) != -1 || cate.indexOf(val) != -1
				})
				if (index === -1) {
					return
				}
				this.swiperCurrent = index
			},
			// 请求商家列表的接口数据
			async fetchCardCateRes() {
				try {
					const res = await App._getP('card.card/index')
					this.cardCateRes = res.data || []
				} catch (e) {
					console.log('fetchCardCateRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求商家列表的接口数据
			async fetchStoreResIfNeeded({
				card_class_id = '',
				card_id = ''
			} = {}) {
				try {
					card_class_id = card_class_id || this.cCardList[this.swiperCurrent].id
					const lat = this.lat
					const lng = this.lng
					const res = await App._getP('card.card/cardBusiness', {
						list_rows: 100,
						card_class_id,
						card_id,
						lat,
						lng,
						store_name: this.cardSearchValue
					})
					this.storeRes = this.$util.deepGet(res, 'data.data', [])
				} catch (e) {
					console.log('fetchStoreResIfNeeded', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	// 详情弹窗
	.details-wrapper {
		position: relative;
		box-sizing: border-box;
		width: 100vw;
		padding-top: 52rpx;
		padding-bottom: 96rpx;
		background-color: #FBFAFC;
		border-radius: 30rpx 30rpx 0 0;
	}

	.details-wrapper__scorll {
		height: 800rpx;
		transition: height .2s ease-in;

		&.is-collapse {
			height: 0;
		}
	}

	.details-wrapper__close-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 52rpx;
	}

	.details-wrapper__btn-close {
		width: 70rpx;
		height: 8rpx;
		background-color: #eee;
		border-radius: 9999rpx;
	}


	// 详情弹窗 end
	// 搜索框
	.search-card {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		height: 90rpx;
		width: 690rpx;
		max-width: 100%;
		margin: 30rpx auto;
		background-color: #EEF0F4;
		border-radius: 20rpx;
	}

	.search-card__left {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		max-width: 200rpx;
		padding: 0 16rpx;
		font-size: 32rpx;
		color: #333;

		.iconfont {
			margin-left: 8rpx;
			font-size: 24rpx;
			color: #333333;
		}

		&::after {
			box-sizing: border-box;
			content: "\20";
			position: absolute;
			right: 0;
			top: 50%;
			width: 1px;
			height: 30rpx;
			background-color: #ccc;
			transform: translateY(-50%);
		}
	}

	.search-card__city {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.search-card__center {
		display: flex;
		align-items: center;
		min-width: 0;
		flex: 1;
		margin: 0 16rpx;

		.iconfont {
			margin-right: 16rpx;
			color: #999;
		}
	}

	.search-card__input {
		flex: 1;
		font-size: 28rpx;
		color: #333;
	}

	// 搜索框 end
	// 顶部搜索框
	.top-search {
		position: fixed;
		left: 30rpx;
		/* #ifdef MP */
		top: 163rpx;
		/* #endif */
		/* #ifdef H5 */
		top: 30rpx;
		/* #endif */
		display: flex;
		align-items: center;
		box-sizing: border-box;
		height: 90rpx;
		width: 420rpx;
		max-width: 100%;
		margin: 0 auto;
		background-color: rgba($color: #FFFFFF, $alpha: 0.9);
		border-radius: 20rpx;
		transition: all .2s ease-in-out;
		z-index: 200;

		&.is-active {
			background-color: #fff;
		}
	}

	.top-search__left {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		max-width: 200rpx;
		padding: 0 30rpx;
		font-weight: bold;
		font-size: 32rpx;
		color: #333;

		.iconfont {
			margin-left: 8rpx;
			font-size: 24rpx;
			color: #333333;
		}

		&::after {
			box-sizing: border-box;
			content: "\20";
			position: absolute;
			right: 0;
			top: 50%;
			width: 1px;
			height: 30rpx;
			background-color: #ccc;
			transform: translateY(-50%);
		}
	}

	.top-search__city {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.top-search__center {
		display: flex;
		align-items: center;
		min-width: 0;
		flex: 1;
		margin: 0 30rpx;

		.iconfont {
			margin-right: 16rpx;
			color: #999;
		}
	}

	.top-search__input {
		flex: 1;
		font-size: 28rpx;
		color: #333;
	}

	// 顶部搜索框 end
	// 卡包轮播
	.card-swiper {
		height: 200rpx;
	}

	.card-swiper-card {
		position: relative;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		height: 100%;
		width: 650rpx;
		max-width: 100%;
		margin: 0 auto;
		padding: 40rpx;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		background-color: #EFEFEF;
		border-radius: 30rpx;

		&::after {
			display: block;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			content: "\20";
			background-color: rgba(255, 255, 255, 0.5);
			transition: background-color .2s ease-in-out;
			pointer-events: none;
		}

		&.is-active::after {
			background-color: rgba(255, 255, 255, 0);
		}
	}
	
	.card-swiper__center {
		min-width: 0;
		flex: 1;
	}
	
	.card-swiper-card__left {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		margin-left: 16rpx;
	}

	.card-swiper-card__text {
		max-width: 100%;
		font-size: 28rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.card-swiper-card__title {
		margin-top: 16rpx;
		font-weight: bold;
		font-size: 48rpx;
	}

	.card-swiper-card__btn {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 50rpx;
		padding: 0 30rpx;
		color: #333333;
		font-size: 28rpx;
		background-color: #fff;
		border-radius: 9999rpx;
	}
	
	.card-swiper-card__tip {
		font-size: 24rpx;
		color: #fff;
		margin-top: 50rpx;
		.iconfont {
			font-size: 24rpx;
		}
	}

	// 卡包轮播 end
	// 商家列表
	.business-section__title-wrapper {
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		margin-top: 4rpx;
	}

	.business-section__title {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 200rpx;
		margin-top: 20rpx;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #333;
		line-height: 1;

		&.is-active {
			font-size: 36rpx;
			font-weight: bold;
		}
	}

	// 商家列表 end

	// 地图的样式
	.map-wrapper {
		height: 100vh;
		width: 100vw;
	}

	.business-map-wrapper__map {
		height: 100vh;
		width: 100vw;
	}

	// 地图的样式 end

	// 顶部导航
	.top-nav-list {
		position: fixed;
		right: 30rpx;
		/* #ifdef MP */
		top: 163rpx;
		/* #endif */
		/* #ifdef H5 */
		top: 30rpx;
		/* #endif */
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba($color: #FFFFFF, $alpha: 0.9);
		z-index: 200;
		border-radius: 20rpx;
		;
	}

	.top-nav-item {
		position: relative;
		display: flex;
		height: 90rpx;
		width: 104rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #333;

		&+&::after {
			position: absolute;
			display: block;
			top: 0;
			left: 0;
			width: 1px;
			height: 40rpx;
			background-color: #EEEEEE;
			transform: translateY(50%);
			content: "\20";
		}
	}

	.top-nav-item__img {
		width: 34rpx;
		height: 30rpx;
	}

	.top-nav-item__text {
		font-size: 20rpx;
		margin-top: 4rpx;
	}

	// 顶部导航 end
	// 商家总数提示
	.business-total {
		display: flex;
		margin: 20rpx 0;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #999;
		&::after,&::before {
			display: block;
			content: "\20";
			width: 40rpx;
			height: 1rpx;
			margin: 0 10rpx;
			background-color: #999;
		}
	}
	// 商家总数提示 end
</style>
