<template>
	<view class="page-normalGoodsSelect">
		<view class="app-card">
			<!-- 商品信息 -->
			<view class="goods-card app-flex app-flex--align-center">
				<view class="app-flex-item app-flex-item--shrink-0">
					<image class="goods-card__image" :src="cDetails.image" mode="aspectFill"></image>
				</view>
				<view class="app-flex-item app-flex-item--1">
					<view class="f-28 col-3 onelist-hidden">{{cDetails.title}}</view>
					<view class="goods-card__label">普通商品</view>
				</view>
			</view>
			<!-- 商品信息 end -->
			<!-- 核销码列表 -->
			<normalCodeSelect v-model="activeIds" :list="cList"></normalCodeSelect>
			<!-- 核销码列表 end -->
		</view>
		<!-- footer -->
		<view class="app-wrapper--safe-fixed-bottom" style="background-color: #fff;">
			<view class="app-card app-card--fluid app-flex app-flex--align-center" style="margin: 0;">
				<view class="app-flex-item app-flex-item--1">
					<!-- #ifdef MP-WEIXIN -->
					<button class="app-btn app-btn-large--block" style="background-color: #ffd940;" open-type="share">转赠</button>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<button class="app-btn app-btn-large--block" style="background-color: #ffd940;" @click="handleBtnGoClick">转赠</button>
					<!-- #endif -->
				</view>
			</view>
		</view>
		<!-- footer end -->
		<!-- H5分享蒙层 -->
		<share-guide ref="shareGuide"></share-guide>
		<!-- H5分享蒙层 end -->
		<!-- 页面loading -->
		<page-loading ref="loading"></page-loading>
		<!-- 页面loading end -->
		
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import normalCodeSelect from './components/normalCodeSelect.vue'
	import pageShareMixin from "@/common/js/pageShareMixin.js"
	export default {
		mixins: [pageShareMixin],
		components: {
			normalCodeSelect,
		},
		data() {
			return {
				options: {
					// 订单id
					order_id: '',
				},
				// 当前选中的核销码
				activeIds: [],
				// 详情的接口数据
				detailsRes: {},
			}
		},
		computed: {
			// 格式化的详情数据
			cDetails() {
				const goods = this.$util.deepGet(this.detailsRes,'goods.0') || []
				return {
					id: this.order_id,
					title: goods.goods_name,
					image: goods.image && goods.image.file_path
				}
			},
			// 格式化的列表数据
			cList() {
				const list = this.$util.deepGet(this.detailsRes,'vercode') || []
				return list.filter(item=>item.donation_status != 2).map(item=>{
					return {
						id: item.vercode_id,
						code: item.code,
					}
				})
			}
		},
		onLoad(options) {
			this.options = options
			this.pageShareMixin_showShare()
		},
		async onShow() {
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#F8F8F8",
			});
			try {
				await this.mainMixin_BeforeFetchPageData()
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#F8F8F8",
				});
				await Promise.all([this.fetchDetailsRes()])
				App.hideLoading()
			} catch (e) {
				console.log('onShow 报错', e)
				// TODO handle the exception
			}
		},
		onShareAppMessage(res) {
			return {
				...this.shareData,
				// 如果该参数存在，则以 resolve 结果为准，如果三秒内不 resolve，分享会使用上面传入的默认参数
				// 如果需要自定义promise，那么pageShareMixin_usePromise可以设置为false，在shareData中定义promise即可
				promise: new Promise(resolve => {
					this.handleBtnGoClick().then(()=>{
						resolve(this.shareData)
						this.pageShareMixin_afterShare()
					})
				})
			}
		},
		methods: {
			async handleBtnGoClick() {
				// 如果正在请求或者不是以下操作 直接返回
				if(this.handleBtnGoClicking) {
					return 
				}
				// 如果没有选中，则提示先选中
				if(!this.activeIds.length) {
					uni.showToast({
						icon: 'none',
						title: '请先选择要分享的核销码'
					})
					return
				}
				this.handleBtnGoClicking = true
				try{
					// 显示loading
					uni.showLoading({
						title: '请稍候...',
						mask: true
					})
					// 请求接口
					const res = await App._postP('user.order/donation',{
						order_id: this.options.order_id,
						// uni.request也会自动this.activeIds把转换为逗号分隔的字符串，这不太好，所以这里显示的转换一下
						vercode_id: this.activeIds.join(',')
					})
					// 设置分享数据
					console.log('设置分享数据',res)
					this.shareData = this.pageShareMixin_createShareData({
						title: '商品转赠',
						imgUrl: this.cDetails.image,
						url: 'pages/subPages/orderPresent/open',
						desc: `${this.mainMixin_userInfo.nickName}给你送来一份惊喜礼物，快打开来领取它吧！`,
						query: {
							d_id: res.data.d_id
						}
					})
					// #ifdef H5
					this.pageShareMixin_openShareGuideInH5()
					// #endif
				}catch(e){
					console.log(e)
				}
				this.handleBtnGoClicking = false
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._postP('user.order/detail', {
						order_id: this.options.order_id
					})
					this.detailsRes = this.$util.deepGet(res, 'data', {})
				} catch (e) {
					return Promise.reject(e)
					// TODO handle the exception
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.goods-card {
		box-sizing: border-box;
		padding: 20rpx;
		border-bottom: 1px solid #EEEEEE;
	}
	.goods-card__image {
		width: 90rpx;
		height: 90rpx;
		border-radius: 20rpx;
	}
	.goods-card__label {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 38rpx;
		margin-top: 10rpx;
		padding: 2rpx 8rpx;
		font-size: 22rpx;
		color: #fff;
		background: linear-gradient(90deg, #FABD00 0%, #FED900 100%);
		border-radius: 10rpx;
	}
</style>
