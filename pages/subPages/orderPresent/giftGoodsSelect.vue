<template>
	<view class="page-giftGoodsSelect">
		<!-- 选择列表 -->
		<GiftCodeSelect ref="giftCodeSelect" v-model="activeIds" :list="cList"></GiftCodeSelect>
		<!-- 选择列表 end -->
		<!-- footer -->
		<view class="app-wrapper--safe-fixed-bottom" style="background-color: #fff;">
			<view class="app-card app-card--fluid app-flex app-flex--align-center" style="margin: 0;">
				<view class="app-flex-item" @click="toggelAll">
					<view class="select-checkbox" :class="{
					        'is-active': allChecked
					      }">
						<view v-show="allChecked" class="iconfont icon-check"></view>
					</view>
				</view>
				<view class="app-flex-item f-28 col-3" @click="toggelAll">
					全选
				</view>
				<view class="app-flex-item app-flex-item--1">
					<!-- #ifdef MP-WEIXIN -->
					<button class="app-btn app-btn-large--block" style="background-color: #ffd940;"
						open-type="share">转赠</button>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<button class="app-btn app-btn-large--block" style="background-color: #ffd940;"
						@click="handleBtnGoClick">转赠</button>
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
	import GiftCodeSelect from './components/GiftCodeSelect.vue'
	import pageShareMixin from "@/common/js/pageShareMixin.js"
	export default {
		mixins: [pageShareMixin],
		components: {
			GiftCodeSelect
		},
		data() {
			return {
				options: {
					// 订单id
					order_id: '',
					donation_vercode_id: ''
				},
				// 当前是否全选
				allChecked: false,
				// 当前选中的id
				activeIds: [],
				// 详情的接口数据
				detailsRes: {},
			}
		},
		computed: {
			// 格式化的列表数据
			cList() {
				const list = this.$util.deepGet(this.detailsRes, 'a_lbsp.code_detail') || []
				return list.filter(item => item.donation_status != 2).map(item => {
					return {
						id: item.vercode_id,
						title: item.gift_title,
						image: item.image,
						code: item.code,
						// 价值
						price: item.value_price,
						// 持券仅需
						needPrice: item.need_pay_moeny
					}
				})
			}
		},
		watch: {
			cList: {
				handler(val) {
					if(val.length === 1) {
						this.toggelAll()
					}
				},
				immedate: true
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
				// await this.mainMixin_BeforeFetchPageData()
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
					this.handleBtnGoClick().then(() => {
						resolve(this.shareData)
						this.pageShareMixin_afterShare()
					})
				})
			}
		},
		methods: {
			async handleBtnGoClick() {
				// 如果正在请求或者不是以下操作 直接返回
				if (this.handleBtnGoClicking) {
					return
				}
				// 如果没有选中，则提示先选中
				if (!this.activeIds.length) {
					uni.showToast({
						icon: 'none',
						title: '请先选择要分享的核销码'
					})
					return
				}
				this.handleBtnGoClicking = true
				try {
					// 显示loading
					uni.showLoading({
						title: '请稍候...',
						mask: true
					})
					// 请求接口
					const res = await App._postP('user.order/donation', {
						order_id: this.options.order_id,
						// uni.request也会自动this.activeIds把转换为逗号分隔的字符串，这不太好，所以这里显示的转换一下
						vercode_id: this.activeIds.join(','),
					})
					// 设置分享数据
					console.log('设置分享数据', res)
					this.shareData = this.pageShareMixin_createShareData({
						title: this.$util.deepGet(this.cList,'0.title'),
						imgUrl: this.$util.deepGet(this.cList,'0.image') || '',
						url: 'pages/subPages/orderPresent/open',
						desc: `${this.mainMixin_userInfo.nickName}给你送来一份惊喜礼物，快打开来领取它吧！`,
						query: {
							d_id: res.data.d_id
						}
					})
					// #ifdef H5
					this.pageShareMixin_openShareGuideInH5()
					// #endif
				} catch (e) {
					console.log(e)
				}
				this.handleBtnGoClicking = false
			},
			// 全选
			toggelAll() {
				this.allChecked = !this.allChecked
				this.$refs.giftCodeSelect.toggleAllChecked(this.allChecked)
			},
			// 请求详情的接口数据
			async fetchDetailsRes() {
				try {
					const res = await App._postP('user.order/detail', {
						order_id: this.options.order_id,
						donation_vercode_id: this.options.donation_vercode_id,
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
	.page-giftGoodsSelect {
		padding-bottom: 200rpx;
	}

	.select-checkbox {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40rpx;
		height: 40rpx;
		font-size: 20rpx;
		color: #333;
		border: 1px solid #eee;
		border-radius: 6rpx;

		&.is-active {
			background-color: #ffd940;
			border-color: #ffd940;
		}

		.iconfont {
			font-size: inherit;
		}
	}
</style>
