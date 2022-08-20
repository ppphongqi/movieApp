<template>
	<view class="container" :style="{'height':height+'px'}">
		<!-- 返回按钮 -->
		<!-- #ifdef H5 || MP-WEIXIN || MP-TOUTIAO -->
		<view class="diy-navigator" :style="{'top':backBtnHeight+'px'}">
			<view class="return-btn" @click="returnBtn">
				<text class="iconfont icon-fanhuijiantou col-f"></text>
			</view>
		</view>
		<!-- #endif -->


		<swiper v-if="goodsList && goodsList.length" :interval="3000" :duration="1000" style="height: 100%;" :vertical='true'
		 @change='swiperChange($event)'>
			<swiper-item v-for="(item,index) in goodsList" style="position: relative;">
				<view class="swiper-item" style=";width: 100%;height: 100%;" @click="pauseVideo(index,item)">
					<image src="../../../static/images/diypage/video_play.png" mode="widthFix" class="image2" v-if="!isPlay"></image>
					<video x5-video-player-type="h5-page" :autoplay="true" object-fit='cover' :show-play-btn='false'
					 :show-fullscreen-btn='false' show-center-play-btn :loop="true" :src="item.video.file_path" controls :id="'myVideo'+index"
					 :danmu-list="barrageList" :enable-danmu='item.is_video_danmaku==1'></video>
					<view class="git-goods-part dis-flex flex-x-between flex-y-center" @click="navigationTo('pages/subPages/goods/index/index?goods_id='+item.goods_id)">
						<image :src="item.image[0].file_path" mode="" style="width: 118rpx;height: 118rpx;"></image>
						<view class="m-left12 dis-flex flex-dir-column flex-x-around " style="width: 70%;">
							<view class="col-f f-w f-28 onelist-hidden">{{item.goods_name}}</view>
							<view class="dis-flex  flex-y-center m-top10">
								<view class="dis-flex flex-y-center" v-if="item.is_member_price==1">
									<view class="member-price-label f-22 m-top10">会员</view>
									<view class="f-22 col-f onelist-hidden b-0 coupon-price-2 m-top10">{{memberDiyFont.member_font}}<text class="member-coupon-price">{{item.sku[0].member_price}}</text></view>
								</view>
								<view class=" dis-flex flex-y-center f-20 m-top10" v-if="isdealer && item.dealer_money>0" :class="{'m-left12':item.is_member_price==1}">
									<view class="dealer col-f">赚</view>
									<view class="money onelist-hidden">{{settingData.currency}}{{item.dealer_money}}</view>
								</view>
							</view>
							<view class="col-f  dis-flex flex-x-between flex-y-center m-top10">
								<view class="f-24">
									<text class="">{{settingData.currency}}</text>
									<text class="f-w  f-28 f-w">{{item.sku[0].goods_price}}</text>
									<text class="t-through m-left12">{{settingData.currency}}{{item.sku[0].line_price}}</text>
								</view>
								<view class="cart dis-flex flex-x-center flex-y-center">
									<image src="../../../static/images/goods/cart.png" mode="widthFix" style="width: 30rpx;"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="like " @click.stop="collect({goods_id:item.goods_id,type:item.isCollect?-1:1},item)">

						<image src="../../../static/images/like1.png" mode="" v-if="item.isCollect"></image>
						<image src="../../../static/images/like.png" mode="" v-else></image>
						<view class="col-f f-24 ">{{item.statis}}</view>
					</view>
				</view>
			</swiper-item>


		</swiper>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import App from '@/common/js/app.js'
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	export default {
		mixins: [pageShareMixin],
		data() {
			return {
				isPlay: true,
				height: 0,
				successTimer: null,
				indexTimer: null,
				setTimer: null,
				showTips: false, // 显示弹幕
				showLoadmore: false,
				page: 1,
				lastpage: 1,
				goodsList: [],
				current: 0,
				options: {},
				barrageList: [],
				tipsIndex: 0,
				isdealer: false

			}
		},
		computed: {
			// 设置返回按钮高度
			backBtnHeight() {
				// #ifdef MP-TOUTIAO
				return 0
				// #endif
				// #ifndef MP-TOUTIAO
				return this.$store.state.systemInfo && this.$store.state.systemInfo.statusBarHeight
				// #endif
			},
			videoContext() {
				return this.goodsList.map((item, index) => uni.createVideoContext('myVideo' + index))
			}


		},

		methods: {
			handleAutoplay(val) {
				try {
					console.log('current', val)
					this.videoContext.forEach((item, index) => {
					
						this.videoContext[index].seek(0)
						this.videoContext[index].pause()
					})
					this.videoContext[val].play()
					
					
					let value = val + ''
					if (value.indexOf('6') > -1) {
						this.page++
						if (this.page <= this.lastpage) {
							this.showLoadmore = true
							this.getVideoGoodsList()
						} else {
							this.showLoadmore = false
						}
					}
					// 修改分享数据
					const goods = this.goodsList[val] || {}
				}catch(e) {
					
				}
			},
			/**
			 * 返回按钮
			 */
			returnBtn(e) {
				let pages = getCurrentPages()
				if (pages.length > 1) {
					uni.navigateBack({
						delta: 1
					})
				} else {
					let url = '/pages/mainPages/index/index'
					// #ifdef H5
					url += '?i=' + App.getUniacid()
					// #endif
					uni.reLaunch({
						url
					})
				}
			},

			getHeight() {
				let _this = this
				uni.getSystemInfo({
					success(res) {
						_this.height = res.windowHeight


					}
				})
			},
			pauseVideo(index, item) {
				let isPlay = item.isPlay
				if (isPlay) {
					this.videoContext[index].pause()
					this.$set(item, 'isPlay', false)
				} else {
					this.videoContext[index].play()
					this.$set(item, 'isPlay', true)
				}
				this.isPlay = item.isPlay

			},
			getVideoGoodsList() {
				let _this = this,
					requestData = this.page == 1 ? {
						goods_id: this.options.goods_id,
						page: this.page
					} : {
						page: this.page
					}
				App._post_form('videolist.Videolist/getVideoList', requestData, res => {
					let {
						data: {
							data: goodsList = [],
							last_page: last_page = 1
						}
					} = res
					this.lastpage = last_page
					this.goodsList = this.goodsList.concat(goodsList)
					this.goodsList.forEach(item => {
						item.isPlay = true
						this.$set(item, 'isPlay', true)
						item.viwdew.length > 0 ? this.$set(item, 'isCollect', true) : this.$set(item, 'isCollect', false)

					})
					this.goodsList[this.current].is_video_danmaku == 1 && this.getBarrageData(this.goodsList[this.current].goods_id)
					const goods = this.goodsList[this.current]
					this.shareData = this.pageShareMixin_createShareData({
						title: goods.goods_name,
						desc: `￥${this.$util.deepGet(goods,'sku.0.goods_price','')}`,
						imgUrl: this.$util.deepGet(goods, 'image.0.file_path', ''),
						query: {
							goods_id: this.options.goods_id
						}
					})
					_this.$nextTick(()=>{
						_this.handleAutoplay(0)
					})
				}, res => {}, res => {
					App.hideLoading()
				})
			},
			swiperChange(e) {
				this.isPlay = true
				this.current = e.detail.current
				this.goodsList[this.current].is_video_danmaku == 1 && this.getBarrageData(this.goodsList[this.current].goods_id)

			},
			addCart({
				goods_id,
				goods_sku_id
			}) {
				App._post_form('cart/add', {
					goods_id,
					goods_sku_id
				}, res => {
					res.code == 1 && App.showSuccess('加入购物车成功')

				})
			},
			getSettingIndex() {
				App._post_form('setting/index', {}, res => {
					let {
						data: {
							dealer_basic: {
								is_open,
								user_diy
							}
						}
					} = res
					this.isdealer = is_open == 1 && user_diy == 1
				})
			},
			getBarrageData(goods_id) {
				App._get('Goods/barrage', {
					goods_id
				}, res => {
					this.barrageList = res.data
					this.barrageList.forEach((item, index) => {
						delete item.avatarUrl
						item.time = index
						item.color = '#fff'
					})
					console.log(this.barrageList, 'this.barrageList========')

				})
			},
			collect({
				goods_id,
				type
			}, item) {
				App._post_form('videolist.Videolist/addVideoStatis', {
					goods_id,
					type
				}, res => {
					if (res.code == 1) {
						type == -1 ? (item.statis -= 1) : (item.statis += 1)
						item.isCollect = !item.isCollect
					}

				})

			}


		},
		onShow() {
			App.showLoading()
			this.getHeight()
			this.getVideoGoodsList()
			this.getSettingIndex()


		},
		onLoad(options) {
			this.options = options

		},
		watch: {
			current: {
				handler(val) {
					this.handleAutoplay(val)
				},
				immediate: true
			}
		}
	}
</script>

<style lang="scss">
	.success-tips {
		position: fixed;
		bottom: 83%;
		left: 30rpx;
		height: 54rpx;
		line-height: 54rpx;
		background: #FFD940;
		background: var(--theme-color);
		border-radius: 50px;
		z-index: 50;
		padding: 0 12rpx;
		opacity: 0;
		transition: opacity .4s;
	}

	.success-tips.show {
		opacity: 1;
	}

	.success-tips .success-avatar {
		width: 40rpx;
		height: 40rpx;
		display: block;
		border-radius: 50%;
	}

	.success-tips .success-goods {
		max-width: 450rpx;
	}

	.diy-navigator {
		position: fixed;
		left: 0;
		right: 0;
		padding: 0 20rpx;
		height: 88rpx;
		z-index: 100;
	}

	.image2 {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		top: calc(50vh - 50rpx);
		left: calc(50% - 50rpx);
		z-index: 2;
	}

	.return-btn {
		position: absolute;
		left: 10px;
		top: 50%;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
		width: 30px;
		height: 30px;
		padding-left: 14rpx;
		box-sizing: border-box;
		line-height: 30px;
		border-radius: 50%;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 50;
	}

	.like {
		width: 80rpx;
		height: 80rpx;
		position: absolute;
		bottom: 216rpx;
		right: 40rpx;
		z-index: 2;
		// background:rgba(255,68,68,1);
		border-radius: 50%;

		image {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.container {
		overflow: hidden;

		.swiper-item {
			width: 100%;
			height: 100%;
			position: relative;

			video {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}

			.git-goods-part {
				width: 520rpx;
				height: 200rpx;
				padding: 20rpx;
				box-sizing: border-box;
				background: rgba(0, 0, 0, 0.5);
				border-radius: 10rpx;
				position: absolute;
				bottom: 90rpx;
				left: 40rpx;
				z-index: 2;

				.dealer {
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					background-color: #FF4444;
					line-height: 30rpx;
					text-align: center;
					z-index: 10;

				}

				.money {
					// width: 88rpx;
					height: 30rpx;
					background: rgba(255, 243, 243, 1);
					color: #FF5A5A;
					// text-align: right;
					// padding-right: 14rpx;
					// box-sizing: border-box;
					line-height: 30rpx;
					margin-left: -20rpx;
					padding-left: 22rpx;
					padding-right: 8rpx;
					border-radius: 20rpx;
				}

				.cart {
					width: 60rpx;
					height: 60rpx;
					background: linear-gradient(0deg, rgba(255, 220, 77, 1) 0%, rgba(255, 204, 0, 1) 100%);
					border-radius: 50%;
				}

			}
		}
	}
</style>
