<template>
	<view class="page-coupon-center-details">
		<!-- header -->
		<view class="page-header">
			<!-- banner -->
			<view class="banner-wrapper">
				<image class="banner-img" :src="cBanner.imgUrl" />
			</view>
			<!-- banner end -->
			<!-- 多少人已经领取 -->
			<view class="user-list-wrapper">
				<users-list :users-data="cFriends.usersData" :total-users-num="cFriends.num" @on-btn-share-click="pageShareMixin_openShareGuideInH5" />
			</view>
			<!-- 多少人已经领取 end -->
		</view>
		<!-- header end -->
		<!-- 优惠券本身 -->
		<view style="margin-top: 20rpx;">
			<coupon-owned :coupon-data="cCouponData" @on-btn-click="handleBtnCouponOpClick" />
		</view>
		<!-- 优惠券本身 end -->
		<!-- 商品列表标题 -->
		<view class="goods-list-title">
			<view class="goods-list-title__content">适用于以下商品</view>
		</view>
		<!-- 商品列表标题 end -->
		<!-- 商品列表 -->
		<goods-card :item-data="cRecommendGoodsData" :item-style="cRecommendGoodsStyle" />
		<!-- 商品列表 end-->
		<LoadMore :showLoadmore="!recommendGoodsListRes.hasMore"></LoadMore>
		<!-- H5分享蒙层 -->
		<!-- #ifdef H5 -->
		<share-guide ref="shareGuide"></share-guide>
		<!-- #endif -->
		<!-- H5分享蒙层 end -->
		<!-- 底部导航 -->
		<TabBar></TabBar>
		<!-- 底部导航 -->
	</view>
</template>

<script>
	import {
		dateFormat
	} from '@/common/js/date.js'
	import App from '@/common/js/app.js'
	import UsersList from './components/UsersList.vue'
	import CouponOwned from './components/CouponOwned.vue'
	import TabBar from '@/components/template/TabBar'
	import LoadMore from '@/components/template/Loadmore.vue'
	import GoodsCard from "@/components/page/pageComponents/GoodsCard.vue"
	import {
		couponItemConverter
	} from '@/common/js/dataConverter/couponItemConverter'
	import pageShareMixin from "@/common/js/pageShareMixin.js"
	export default {
		mixins: [pageShareMixin],
		components: {
			UsersList,
			CouponOwned,
			TabBar,
			GoodsCard,
			LoadMore
		},
		data() {
			return {
				// 页面的查询参数
				pageOptions: {},
				// 优惠券详情页的接口数据
				pageDataRes: {},
				// 推荐商品的接口数据
				recommendGoodsListRes:{
					// 当前第几页，0就是即将请求第1页
					page: 0,
					// 分页的大小（其他接口是list_rows,只有这里是list_rows）
					list_rows: 20,
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
			// banner图的格式化数据
			cBanner() {
				return {
					imgUrl: this.$util.deepGet(this.pageDataRes, 'coupon_image.0.file_path', '')
				}
			},
			// 好友领取信息的格式化数据
			cFriends() {
				// 总人数
				const num = this.$util.deepGet(this.pageDataRes, 'people_num', 0)
				// 已领取的用户列表
				const usersData = this.$util.deepGet(this.pageDataRes, 'user_image', []).map(item => ({
					avatar: item.avatarUrl
				}))
				return {
					num,
					usersData
				}
			},
			// 推荐商品列表格式化的数据
			cRecommendGoodsData() {
				// 原始的商品列表数据
				const data = this.recommendGoodsListRes.data || []
				return data.map(item => ({
					...item,
					goods_image: this.$util.deepGet(item, 'image[0].file_path') || '',
					goods_price: item.spec_type === 20 ? item.goods_min_price : this.$util.deepGet(item, 'sku[0].goods_price', ''),
					line_price: this.$util.deepGet(item, 'sku[0].line_price', '')
				}))

			},
			// 推荐商品应该应用的样式
			cRecommendGoodsStyle() {
				const itemStyle = {
					display: '3',
					margincol: '10',
					marginrow: '15'
				}
				const is_goods_long = this.$util.deepGet(this.settingData, 'is_goods_long', [])
				if (is_goods_long.indexOf('2') != '-1') {
					itemStyle.display = '1-2'
				}
				return itemStyle
			},
			// 格式化优惠券的样式
			cCouponData() {
				const item = this.pageDataRes
				const startTime = this.$util.formatTime(item.stime, 'date', '.')
				const endTime = this.$util.formatTime(item.etime, 'date', '.')
				let term = ''
				switch (item.expire_type){
					case 10:
						term = `有效期:${dateFormat(item.start_time,{format:'YYYY年MM月DD日 HH:mm'})}至${dateFormat(item.end_time,{format:'YYYY.MM.DD HH:mm'})}`
						break;
					case 20:
						term = "领取后当日可用"
						break;
					case 30:
						term = `领取后次日起${item.expire_day || '-'}天内可用`
						break;
					case 40:
						term = `领取后当日起${item.expire_day || '-'}天内可用`
						break;
					default:
						break;
				}
				return {
					...couponItemConverter(this.pageDataRes),
					// 有效期
					term,
					// 是否显示立即领取按钮
					btnReceiveVisible: +item.tl_coupon !== 1
				}
			}
		},
		onLoad(options) {
			this.pageOptions = options
		},
		
		async onShow() {
			try {
				await this.mainMixin_BeforeFetchPageData()
				await Promise.all([
					this.fetchPageDataRes().catch(() => {}),
					this.fetchRecommendGoodsListRes({resetBeforeFetch:true}).catch(() => {}),
				])
				// 设置分享数据
				this.shareData = this.pageShareMixin_createShareData({
					title: this.$util.deepGet(this.pageDataRes, 'name'),
					desc: this.$util.deepGet(this.pageDataRes, 'custom_share_content', ''),
					imgUrl: this.$util.deepGet(this.pageDataRes, 'share_image_id.0.file_path', ''),
					query: {
						id: this.$util.deepGet(this.pageDataRes, 'coupon_id', '')
					}
				})
				console.log('设置分享数据', this.shareData)
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 上拉加载更多
		onReachBottom() {
		    if (this.recommendGoodsListRes.isFetching || !this.recommendGoodsListRes.hasMore) {
		        return
		    }
		    this.fetchRecommendGoodsListRes().catch(() => {})
		},
		methods: {
			// 优惠券操作按钮点击事件
			async handleBtnCouponOpClick() {
				const item = this.cCouponData
				console.log('handleBtnCouponOpClick',item)
				if (item.btnStatus === 1) {
					// 按钮是去使用
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
					this.pageDataRes.is_receive = false
				} catch (e) {
					//TODO handle the exception
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
					});
					return Promise.resolve(res)
				} catch (e) {
					uni.hideLoading()
					return Promise.reject(e)
					//TODO handle the exception
				}
			},
			// 请求页面数据
			async fetchPageDataRes() {
				try {
					const res = await App._postP('Coupon/details', {
						id: this.pageOptions.id
					})
					this.pageDataRes = res.data
				} catch (e) {
					console.log('fetchPageData', e)
					return Promise.reject(e)
					// TODO handle the exception
				}
			},

			// 请求优惠券列表的分页接口数据
			async fetchRecommendGoodsListRes({
			    resetBeforeFetch = false
			} = {}) {
			    try {
			        // 如果在请求之前需要重置数据
			        if (resetBeforeFetch) {
			            // 重置数据
			            // 还应该取消请求的但是现在没有取消请求的方法
			            this.recommendGoodsListRes = {
			                ...this.recommendGoodsListRes,
			                page: 0,
			                data: [],
			                hasMore: true,
			                isFetching: false
			            }
			        }
			        // 如果没有更多就不必请求了
			        if (!this.recommendGoodsListRes.hasMore) {
			            return Promise.reject()
			        }
			        // 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
			        // 设置为正在请求
			        this.recommendGoodsListRes.isFetching = true
			        // 请求数据
			        const res = await App._getP('redenvelopes.Redenvelopes/getRecommendGoodsNew', {
						coupon_id: this.pageOptions.id,
			            page: this.recommendGoodsListRes.page + 1,
			            list_rows: this.recommendGoodsListRes.list_rows
			        })
			        // 取得新的数据
			        const newData = this.$util.deepGet(res, 'data.data', [])
			        // 判断是否有更多
			        const hasMore = newData.length >= this.recommendGoodsListRes.list_rows
					console.log('判断是否有更多',{hasMore},this.recommendGoodsListRes.list_rows)
			        // 设置新的数据
			        this.recommendGoodsListRes = {
			            ...this.recommendGoodsListRes,
			            page: this.recommendGoodsListRes.page + 1,
			            // 由于没有abort之前的请求，所以只能这样尽量避免列表数据不要出错
			            // 但如果前一个请求比后一个请求后返回，依然会出错
			            data: resetBeforeFetch ? newData : this.recommendGoodsListRes.data.concat(newData),
			            hasMore,
			            isFetching: false
			        }
			        console.log('this.recommendGoodsListRes11111111111', this.recommendGoodsListRes)
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
	.page-coupon-center-details {
		padding-bottom: 100rpx;
	}
	.page-header {
		position: relative;
		padding-bottom: 50rpx;
	}

	.banner-img {
		width: 100%;
		height: 300rpx;
	}

	.user-list-wrapper {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.goods-list-title {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}

	.goods-list-title__content {
		position: relative;
		margin-top: 32rpx;

		&::before {
			position: absolute;
			left: -6rpx;
			right: -6rpx;
			bottom: 0;
			display: block;
			content: "\20";
			height: 12rpx;
			z-index: -1;
			background-color: #FFD940;
		}
	}
</style>
