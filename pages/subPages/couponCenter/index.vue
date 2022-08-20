<template>
	<view class="pages-coupon-center">
		<!-- 轮播 -->
		<view class="banner-swiper-wrapper">
			<u-swiper :list="cSwiperData" :height="318" border-radius="0" @click="handleSwiperItemClick">
			</u-swiper>
		</view>
		<!-- 轮播 end -->
		<!-- 限时抢券 -->
		<view v-if="limitedTimeResData && limitedTimeResData.length" style="margin: 20rpx 0">
			<coupon-limited-time :coupon-data="limitedTimeResData" @on-item-click="handleCouponLimitedItemClick"
				@on-btn-click="handleBtnCouponLimitedOpClick" />
		</view>
		<!-- 限时抢券 end -->
		<view v-for="(item,index) in cCouponListData" :key="item.id" class="p-r" style="margin: 20rpx 0">
			<coupon-full v-if="item.styleType === 0" :coupon-data="item" @on-item-click="handleCouponItemClick"
				@on-btn-click="handleBtnCouponOpClick(item,index)" />
			<coupon-single v-else-if="item.styleType === 1" :coupon-data="item" @on-item-click="handleCouponItemClick"
				@on-btn-click="handleBtnCouponOpClick(item,index)" />
			<coupon-multiple v-else-if="item.styleType === 2" :coupon-data="item" @on-item-click="handleCouponItemClick"
				@on-btn-click="handleBtnCouponOpClick(item,index)" />
			<bind-mobile-button v-if="item.bindMobileVisible"></bind-mobile-button>
		</view>
		<LoadMore :showLoadmore="!couponListRes.hasMore"></LoadMore>
		<!-- 底部导航 -->
		<tab-bar />
		<!-- 底部导航 end -->
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import CouponLimitedTime from './components/CouponLimitedTime.vue'
	import CouponFull from './components/CouponFull.vue'
	import CouponSingle from './components/CouponSingle.vue'
	import CouponMultiple from './components/CouponMultiple.vue'
	import TabBar from './components/TabBar.vue'
	import {
		couponItemConverter
	} from '@/common/js/dataConverter/couponItemConverter'
	import LoadMore from '@/components/template/Loadmore.vue'
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	import BindMobileButton from '@/components/template/BindMobileButton.vue'
	export default {
		mixins: [pageShareMixin],
		components: {
			CouponLimitedTime,
			CouponFull,
			CouponSingle,
			CouponMultiple,
			TabBar,
			LoadMore,
			BindMobileButton
		},
		data() {
			return {
				// 页面设置相关接口数据（如轮播图）
				pageDataRes: {},
				// 限时抢券的接口数据
				limitedTimeResData: [],
				// 优惠券列表的分页接口数据
				couponListRes: {
					// 当前第几页，0就是即将请求第1页
					page: 0,
					// 分页的大小（其他接口是list_row,只有这里是listRow）
					listRow: 20,
					// 数据
					data: [],
					// 是否还有更多
					hasMore: true,
					// 是否正在请求
					isFetching: false
				}
			}
		},
		computed: {
			// 格式化的顶部轮播数据
			cSwiperData() {
				// return [
				// 	{
				// 		// 图片地址
				// 		image: 'https://via.placeholder.com/690x292/2a9761/fffffff'
				// 	},
				// ]
				const rs = this.$util.deepGet(this.pageDataRes, 'rotation', []).map((item = {}) => ({
					link: item.link,
					image: item.thumb
				}))
				console.log(1111111, rs, this.pageDataRes)
				return rs
			},
			// 格式化的优惠券列表数据
			cCouponListData() {
				const data = this.$util.deepGet(this.couponListRes, 'data', [])
				return data.map(item => ({
					...couponItemConverter(item),
					// 是否需要绑定手机号
					bindMobileVisible: item.is_mandatory_phone == 1 && !this.mainMixin_userInfo.mobile
				}))
			}
		},
		async onPullDownRefresh() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				await Promise.all([
					this.fetchFouponListRes({
						resetBeforeFetch: true
					}).catch(() => {}),
					this.fetchLimitedTimeResData({}).catch(() => {}),
					this.fetchPageDataRes().catch(() => {})
				])
			} catch (e) {
				console.log('onPullDownRefresh 报错', e)
				// TODO handle the exception
			}
			uni.stopPullDownRefresh()
		},
		// 上拉加载更多
		onReachBottom() {
			if (this.couponListRes.isFetching || !this.couponListRes.hasMore) {
				return
			}
			this.fetchFouponListRes().catch(() => {})
		},
		async onShow() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				await Promise.all([
					this.fetchFouponListRes({
						resetBeforeFetch: true
					}).catch(() => {}),
					this.fetchLimitedTimeResData({}).catch(() => {}),
					this.fetchPageDataRes().catch(() => {})
				])
				console.log(this.pageDataRes, '12345')
				// 设置分享数据
				this.shareData = this.pageShareMixin_createShareData({
					imgUrl: this.$util.deepGet(this.pageDataRes, 'share_image_id.0.file_path', ''),
					desc: this.$util.deepGet(this.pageDataRes, 'custom_share_content', ''),
					title: this.$util.deepGet(this.pageDataRes, 'title', '领券中心'),
				})
				// 设置标题
				uni.setNavigationBarTitle({
					title: this.$util.deepGet(this.pageDataRes, 'title', '领券中心'),
				})
			} catch (e) {
				console.log('onPullDownRefresh 报错', e)
				// TODO handle the exception
			}
		},
		watch: {
			// 监控页面配置接口数据
			pageDataRes(val) {
				console.log('watch pageDataRes', val)
				this.shareData = this.pageShareMixin_createShareData({
					// 封面图
					imgUrl: this.$util.deepGet(val, 'share_image_id.0.file_path'),
					// 描述
					desc: this.$util.deepGet(val, 'custom_share_content'),
					// title标题
					title: this.$util.deepGet(val, 'title')
				})
				console.log('watch pageDataRes shareData', this.shareData)
			}
		},
		methods: {
			// 轮播图点击事件
			handleSwiperItemClick(index) {
				const item = this.cSwiperData[index]
				if (item.link) {
					this.navigationTo(item.link)
				}
			},
			// 限时抢优惠券点击事件
			async handleCouponLimitedItemClick({
				item,
				index,
				cate,
				cateIndex
			} = {}) {
				App.navigationTo({
					url: `pages/subPages/couponCenter/details?id=${item.id}`
				})
			},
			// 优惠券点击事件
			handleCouponItemClick(item) {
				if (item.bindMobileVisible) {
					uni.showToast({
						icon: 'none',
						title: '请先绑定手机号'
					})
					return
				}
				App.navigationTo({
					url: `pages/subPages/couponCenter/details?id=${item.id}`
				})
			},
			// 限时抢券操作按钮点击事件
			async handleBtnCouponLimitedOpClick({
				item,
				index,
				// 类别
				cate,
				// 类别索引
				cateIndex
			} = {}) {
				if (item.btnStatus === 1) {
					// Todo 如果是去使用按钮就要跳转到优惠券详情页面
					this.handleCouponItemClick(item)
					return
				}
				if (cate.status === 0) {
					uni.showToast({
						title: '请开始后再抢券',
						icon: 'none'
					})
					return
				}
				if (cate.status === 2) {
					uni.showToast({
						title: '抢券已结束',
						icon: 'none'
					})
					return
				}
				try {
					// 优惠券的所属时段
					const type = this.$util.deepGet(this.limitedTimeResData, `${cateIndex}.type`, '')
					if (!type) {
						// 没有必要参数就返回
						uni.showToast({
							title: '没有参数type',
							icon: 'none'
						})
						return
					}
					let location = {}
					if(item.locationNeed) {
						location = await App.getLocation() || {}
					}
					await this.doReceiveCoupon({
						coupon_id: item.id,
						type,
						latitude: location.latitude || '',
						longitude: location.longitude || ''
					})
					// 强制把is_receive置为false，为了按钮变成去使用
					// 这个时候这个路径已经是有的了
					this.limitedTimeResData[cateIndex].coupon_id[index].is_receive = false
				} catch (e) {
					console.log(e)
					// TODO handle the exception
				}
			},
			// 优惠券操作按钮点击事件
			async handleBtnCouponOpClick(item, index) {
				if (item.btnStatus === 1) {
					// Todo 如果是去使用按钮就要跳转到优惠券详情页面
					this.handleCouponItemClick(item)
					return
				}
				try {
					let location = {}
					if(item.locationNeed) {
						location = await App.getLocation() || {}
					}
					const res = await this.doReceiveCoupon({
						coupon_id: item.id,
						latitude: location.latitude || '',
						longitude: location.longitude || ''
					})
					// 强制更改按钮的文字(危险的操作)
					// 这个时候这个路径已经是有的了
					this.couponListRes.data[index].is_receive = false
				} catch (e) {
					console.log(item, index)
					// TODO handle the exception
				}
			},
			// 领取优惠券的操作
			async doReceiveCoupon({
				coupon_id,
				latitude,
				longitude,
				type
			} = {}) {
				uni.showLoading({
					title: '请稍候',
					mask: true
				})
				try {
					const res = await App._postP('user.Coupon/receive', {
						coupon_id,
						type,
						lat: latitude,
						lng: longitude,
					})
					uni.hideLoading()
					uni.showToast({
						title: '领取成功',
						icon: 'none'
					})
					return Promise.resolve(res)
				} catch (e) {
					uni.hideLoading()
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求限时抢券接口数据
			async fetchPageDataRes() {
				try {
					const res = await App._getP('Setting/getItemCouponCenter')
					this.pageDataRes = res.data
				} catch (e) {
					console.log('fetchPageDataRes', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求限时抢券接口数据
			async fetchLimitedTimeResData() {
				try {
					const res = await App._getP('Coupon/getLimitCoupon')
					this.limitedTimeResData = res.data
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
			// 请求优惠券列表的分页接口数据
			async fetchFouponListRes({
				resetBeforeFetch = false
			} = {}) {
				try {
					// 如果在请求之前需要重置数据
					if (resetBeforeFetch) {
						// 重置数据
						// 还应该取消请求的但是现在没有取消请求的方法
						this.couponListRes = {
							...this.couponListRes,
							page: 0,
							data: [],
							hasMore: true,
							isFetching: false
						}
					}
					// 如果没有更多就不必请求了
					if (!this.couponListRes.hasMore) {
						return Promise.reject()
					}
					// 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
					// 设置为正在请求
					this.couponListRes.isFetching = true
					// 请求数据
					const res = await App._getP('Coupon/getCouponCenter', {
						page: this.couponListRes.page + 1,
						listRow: this.couponListRes.listRow
					})
					// 取得新的数据
					const newData = this.$util.deepGet(res, 'data.data', [])
					// 判断是否有更多
					const hasMore = newData.length >= this.couponListRes.listRow
					// 设置新的数据
					this.couponListRes = {
						...this.couponListRes,
						page: this.couponListRes.page + 1,
						// 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
						// 但如果前一个请求比后一个请求后返回，依然会出错
						data: resetBeforeFetch ? newData : this.couponListRes.data.concat(newData),
						hasMore,
						isFetching: false
					}
					console.log('this.couponListRes11111111111', this.couponListRes.data[0])
				} catch (e) {
					console.log(e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.banner-swiper-wrapper {
		padding-top: 0;
	}
</style>
