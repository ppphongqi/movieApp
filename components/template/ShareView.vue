<!-- 分享组件 buy 缪启峙 -->

<!--
	  * 使用:ref="分享组件名" this.$refs.分享组件名.shareswich();方法调用
	  * 参数:  posterType:store,goods,dealer,groups,member  //店铺,商品,分销,会员卡
			   pid://如店铺id,商品id,拼团id 分销无
-->
<template>
	<view>
		<view class="share-Masking" v-if="isShare" @click="shareswich"></view>
		<!-- #ifdef H5 -->
		<image src="/static/h5/share.png" v-show="shareImg" class="to-share" mode="widthFix"></image>
		<!-- #endif -->

		<block v-if="viewStyle === '1'">
			<view class="share-content" :class="isShare?'isshare':'isshareFlase'" :style="customStyle">
				<!-- 商品海报 -->
				<view class="poster-box" @click="shareswich">
					<image v-if="customPic" :src="customPic" mode="aspectFit" class="poster-show" ></image>
					<block v-else-if="isShowPoster && isShare">
						<image :src="posterImages" mode="aspectFit" class="poster-show" v-if="posterImages"></image>
						<view class="poster-image" v-if="!posterImages">
							<share-poster :height="height" :width="width" :poster-type="posterType" :poster-data="cPosterData" @success="posterImages = $event"></share-poster>
						</view>
					</block>
				</view>
				<view class="share-Main">
					<!-- <view class="share-Close" @click="shareswich">关闭</view> -->
					<view class="share-Box">
						<view class="share-item">
							<!-- #ifdef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO -->
							<button open-type="share" class="share-submit" :data-share-type="posterType"></button>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<view class="share-submit" @click="shareBtn"></view>
							<!-- #endif -->
							<image src="/static/images/share/share.png" mode="aspectFill"></image>
							<text>分享给朋友</text>
							
						</view>
						<!-- #ifndef MP-TOUTIAO -->
						<view class="share-item" @click="navigationTo('poster')">
							<button open-type="openSetting" class="btn-normal setting-btn" v-if="openSetting" @opensetting="onSetting"></button>
							<view class="dis-flex poster-item t-c flex-x-center flex-y-center">
								<image class="img-haibao" src="/static/images/share/download.png" mode="aspectFill"></image>
								<text>{{isShowPoster?"保存":"生成"}}海报</text>
							</view>
						</view>
						<!-- #ifdef MP-WEIXIN -->
						<view v-if="settingData && settingData.sapp_video && settingData.sapp_video.is_open == 1" class="share-item" @click="handleVideoShareClick">
							<image src="/static/images/share/video-share.png" mode="aspectFill"></image>
							<text>视频号分享</text>
						</view>
						<!-- #endif -->
						<!-- <block v-if="isGoodsRecommend">
							<view class="share-item" @click="goodsRecommend">
								<image src="/static/images/share/good.png" mode="aspectFill"></image>
								<text>好物推荐</text>
							</view>
						</block> -->
						<!-- #endif -->
					</view>
				</view>
			</view>
		</block>
		<block v-if="viewStyle === '2'">
			<view class="footer-share dis-flex flex-dir-row b-f">
				<view class="share-item flex-box p-r">
					<image src="/static/images/share/share.png" mode=""></image>
					<view class="f-28 col-3">分享给好友</view>
					<!-- #ifdef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO -->
					<button open-type="share" class="share-submit" :data-share-type="posterType"></button>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<view class="share-submit" @click="shareBtn"></view>
					<!-- #endif -->
				</view>
				<!-- #ifndef MP-TOUTIAO -->
				<view class="share-item flex-box " @click="navigationTo('poster')">
					<image src="/static/images/share/download.png" mode=""></image>
					<view class="f-28 col-3">生成海报</view>
				</view>
				<!-- #endif -->

			</view>
		</block>

	</view>
</template>

<script>
import App from '@/common/js/app.js'
import SharePoster from '@/components/template/SharePoster.vue'
// #ifdef H5
import wxApi from '@/static/h5/wxApi.js'
// #endif
export default {
    data() {
        return {
            isShare: false,
            shareImg: false,
            configData: null, // 微信公众号jssdk页面配置参数
            posterImages: '', // 商品海报
            openSetting: false, // 设置按钮显示
            posterData: null,
			videoShareLink: ''
        }
    },
    components: {
        SharePoster
    },
    props: {
		apiParams: {
			type: Object,
			default: undefined
		},
		free:{
			type: Number,
			default: null
		},
		card:{
			type: Number,
			default: null
		},
        pid: {
            type: Number,
            default: null
        },
        posterType: {
            type: String,
            default: null
        },
        periodId: {
            type: Number,
            default: null
        },

        activityData: {
            type: Object,
            default: () => {}
        },
        activitysId: {
            type: String,
            default: ''
        },
        viewStyle: {
            type: String,
            default: '1'
        },
        customStyle: {
            type: String,
            default: ''
        },
        height: {
			    type: Number,
			    default: 600
        },
        width: {
			    type: Number,
			    default: 375
        },
		// 每次都强制重新生成
		force: {
			type: Boolean,
			default: false
		},
		// 是否自定义图片
		customPic: {
			type: String,
			default: ''
		},
		goodsId: {
			type: String,
			default: ''
		}
    },
    computed: {
		cPosterData() {
			return this.apiParams||{pId:this.pid,activitysId:this.activitysId,freeId:this.free,cardId:this.card}
		},
        navHeaght() {
            if (this.$store.state.systemInfo) {
                let statusBarHeight = this.$store.state.systemInfo.statusBarHeight
                return statusBarHeight + uni.upx2px(120)
            }
        },
        isGoodsRecommend() {
            let clientType = App.getClientType(),
                pagePath = 'pages/subPages/goods/index/index'
            if (clientType === '2') {
                let currentPage = App.getCurrentPage()
                return currentPage.__route__ === pagePath
            } else if (clientType === '4') {
                return this.__page__.route === pagePath
            }
        },
        clientType() {
            return App.getClientType()
        },
        isShowPoster() { // 是否直接显示
            return [
                'goods',
                'dealer',
                'member',
                'cardBag',
				'phoneBill',
				'free_id',
				'salesman',
				'goodsCollection',
				'cardBagOrder',
				'clock'
            ].includes(this.posterType)
        }
    },
	watch: {
		pid(val) {
			console.log('pid 111',val)
		},
		posterImages(val) {
			this.$emit('on-img-chane',val)
		},
		goodsId() {
			this.videoShareLink = ''
		}
	},
    mounted() {
        // #ifdef H5
        // 公众号网页分享
        if (this.appClientType === '4') {
            this.wxApiCallback()
        }
        // #endif


    },
    methods: {
		// 视频号分享点击事件
		async handleVideoShareClick() {
			const self = this
			this.shareswich()
			console.log('handleVideoShareClick')
			if(this.videoShareLink) {
				uni.showModal({
					title: '视频号链接',
					content: self.videoShareLink,
					confirmText: '复制',
					complete(res) {
						if(res.confirm) {
							uni.setClipboardData({
								data: self.videoShareLink,
								success() {
									uni.showToast({
										title: '复制成功'
									})
								}
							})
						}
					}
				})
			}
			uni.showLoading({
				mask: true,
				content: '链接获取中...'
			})
			try{
				const res = await App._postP('sappvideo.Index/weChatArticleLink', {
					goods_id: this.goodsId
				})
				this.videoShareLink = res.data || ''
				uni.hideLoading()
				uni.showModal({
					title: '视频号链接',
					content: self.videoShareLink,
					confirmText: '复制',
					complete(res) {
						if(res.confirm) {
							uni.setClipboardData({
								data: self.videoShareLink,
								success() {
									uni.showToast({
										title: '复制成功'
									})
								}
							})
						}
					}
				})
			}catch(e){
				//TODO handle the exception
				console.log('handleVideoShareClick',e)
			}
		},
        posterSuccess(e) {
            console.log(e)
        },
        // #ifdef H5
        /**
			 * 微信jssdk配置成功回调
			 */
        wxApiCallback() {
            let _this = this
            jWeixin.ready(() => {
                let configData = wxApi.configData
                configData.url = decodeURIComponent(configData.url)
                _this.configData = {
                    appid: configData.appId,
                    timestamp: configData.timestamp,
                    noncestr: configData.nonceStr,
                    signature: configData.signature,
                    url: configData.url
                }
            })
        },
        // #endif
        shareswich() {
			if(this.force) {
				// 若每次都需要重新生成
				this.posterImages = ''
			}
            this.isShare = !this.isShare
            this.shareImg = false
			if(this.customPic) {
				this.posterImages = this.customPic
			}
        },
        navigationTo(navType) {
            let _this = this,
                posterActivityData = {
                    pId: _this.pid,
                    posterType: _this.posterType,
                },
                activityData = { ..._this.activityData,
                    period_id: _this.periodId ,
					}
					console.log("ccccckkkkk娇滴滴的多多多多多多多多多",posterActivityData)
            if (navType === 'poster') {
                if (_this.isShowPoster) {
                    if (_this.appClientType === '3' || _this.appClientType === '4') {
                        App.showSuccess('请长按图片以保存')
                    } else if (!!_this.posterImages) {
                        uni.showLoading()
                        _this.getImageTempFile(_this.posterImages).then(filePath => {
                            uni.saveImageToPhotosAlbum({
                                filePath,
                                success() {
                                    App.showSuccess('保存成功')
                                },
                                complete(res) {
                                    console.log(res)
                                    uni.hideLoading()
                                    if (res.errMsg === 'saveImageToPhotosAlbum:fail:auth denied' || res.errMsg ===
												'saveImageToPhotosAlbum:fail auth deny') {
                                        App.showError('获取权限失败,请重试')
                                        _this.openSetting = true
                                    }
                                }
                            })
                        })
                    }
                } else {
                    if (activityData) {
                        posterActivityData = Object.assign(posterActivityData, activityData)
                    }
                    posterActivityData = _this.$util.removeEmpty(posterActivityData)
                    console.log(posterActivityData)
                    App.navigationTo({
                        url: 'pages/mainPages/poster/poster?' + App.urlEncode(posterActivityData)
                    })
                }
            }
        },
        shareBtn() {
            if (this.appClientType === '3') {
                uni.showToast({
                    icon: 'none',
                    title: '请使用自带浏览器分享~'
                })
            } else if (this.appClientType === '4') {
                this.shareImg = true
            }
        },
        /**
			 * 获取图片本地路径
			 */
        getImageTempFile(tempFilePaths) {
            return new Promise((resolve, reject) => {
                if (tempFilePaths.includes('https') || tempFilePaths.includes('http')) {
                    uni.getImageInfo({
                        src: tempFilePaths,
                        success(image) {
                            resolve(image.path)
                        },
                        fail() {
                            uni.hideLoading()
                            App.showError('图片获取失败,请确认图片域名已加入小程序downloadFile合法域名列表中')
                        }
                    })
                } else {
                    resolve(tempFilePaths)
                }
            })
        },
        /**
			 * 获取好物圈需要更新的商品信息
			 */
        updateShareGoods() {
            let _this = this,
                goods_id = _this.pid,
                activityData = _this.activityData,
                clientType = _this.clientType,
                path = ''
            // 删除为空的参数
            activityData = _this.$util.removeEmpty(activityData)
            if (clientType === '2') {
                path = 'pages/subPages/goods/index/index?' + App.urlEncode(activityData)
            } else if (clientType === '4') {
                activityData.i = App.getUniacid()
                path = App.siteInfo.siteroot + 'h5/#/pages/subPages/goods/index/index?' + App.urlEncode(activityData)
            }
            return new Promise((reslove, reject) => {
                uni.showLoading({
                    title: '加载中...'
                })
                App._get('Goods/shareGoodThingCircle', {
                    goods_id,
                    path
                }, res => {
                    let product_list = res.data.product_list
                    delete product_list[0]['src_wxapp_path']
                    if (clientType === '4') {
                        res.data.product_list[0].src_h5_path = path
                    }
                    console.log('path:', path)
                    reslove(res)
                })
            })
        },
        goodsRecommend() {
            let _this = this,
                clientType = _this.clientType
            // 获取需商品信息
            _this.updateShareGoods().then(result => {
                let productData = result.data.product_list[0]
                uni.hideLoading()
                // 小程序好物圈
                if (clientType === '2') {
                    // 更新好物圈商品信息
                    if (result.code === 1) {
                        if (wx.openBusinessView) {
                            console.log(productData)
                            wx.openBusinessView({
                                businessType: 'friendGoodsRecommend',
                                extraData: {
                                    product: {
                                        item_code: productData.item_code,
                                        title: productData.title,
                                        image_list: productData.image_list
                                    }
                                },
                                success: function (res) {
                                    console.log(res)
                                },
                                fail: function (res) {
                                    console.log(res)
                                }
                            })
                        } else {
                            App.showError('微信版本过低,请更新至最新版本')
                        }
                    } else {
                        console.log('fail', res)
                        App.showError(res.data.errmsg, function () {
                            App.hideLoading()
                            fail && fail(res)
                        })
                    }
                }
                // 公众号好物圈
                else if (clientType === '4') {
                    let jsCheckObject = _this.configData,
                        productObject = productData,
                        queryString =
							`jsCheck=${encodeURIComponent(JSON.stringify(jsCheckObject))}&product=${encodeURIComponent(JSON.stringify(productObject))}`
                    console.log('productObject', productObject)
                    wxApi.wxGoodsCircle(queryString, result => {
                        console.log(JSON.stringify(result))
                    }, result => {
                        if (process.env.NODE_ENV === 'development') {
                            uni.showModal({
                                content: JSON.stringify(result)
                            })
                        } else {
                            console.log(result)
                        }
                    })
                }
            })
        },
        onSetting(res) {
            let authSetting = res.detail.authSetting,
                scope = 'scope.writePhotosAlbum'
            if (authSetting[scope]) {
                this.openSetting = false
            }
        }
    }
}
</script>

<style lang="scss">
	.share-Masking {
		position: fixed;
		z-index: 200;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgba(7, 17, 27, .65);
	}

	.share-content {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
	}

	.to-share {
		position: fixed !important;
		z-index: 1009;
		right: 10upx;
		top: 0;
		overflow: auto;
		width: 500upx;
		height: 380upx;
	}

	.share-Main {
		width: 100%;
		height: 170upx;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 902;
		background-color: #FFFFFF;
		/* transform: translateY(100%); */
	}

	.share-Close {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		font-size: 28upx;
		text-align: center;
		background-color: #fafafa;
		color: #999;
	}

	.share-Box {
		display: -webkit-box;
		/* 老版本语法: safari, iOs, Android browser, older WebKit browsers. */
		display: -moz-box;
		/* 老版本语法: Firefox (buggy) */
		display: -ms-flexbox;
		/* 混合版本语法: IE 10 */
		display: -webkit-flex;
		/* 新版本语法: Chrome 21+ */
		display: flex;
		/* 新版本语法: Opera 12.1, Firefox 22+ */
		position: absolute;
		align-items: center;
		justify-content: center;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	/* 样式一 */
	.share-item {
		display: -webkit-box;
		/* 老版本语法: safari, iOs, Android browser, older WebKit browsers. */
		display: -moz-box;
		/* 老版本语法: Firefox (buggy) */
		display: -ms-flexbox;
		/* 混合版本语法: IE 10 */
		display: -webkit-flex;
		/* 新版本语法: Chrome 21+ */
		display: flex;
		/* 新版本语法: Opera 12.1, Firefox 22+ */
		position: relative;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		flex: 1;
		width: 50%;
		height: 100%;
	}

	.share-item image {
		width: 50upx;
		height: 50upx;
		margin-bottom: 10upx;
	}


	.share-item text {
		font-size: 28upx;
	}

	/* 样式二 */
	.footer-share {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100upx;
		z-index: 100;
	}

	.footer-share .share-item {
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.footer-share .share-item:first-child::before {
		content: " ";
		position: absolute;
		top: 20upx;
		bottom: 20upx;
		right: 0;
		border-right: 1upx solid #EEEEEE;
	}

	.footer-share .share-item image {
		width: 30upx;
		height: 30upx;
		display: block;
		margin: 0 18upx 0 0;
	}

	.share-submit {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
	}

	.isshare {
		transform: translateY(0);
		transition: transform 250ms;
	}

	.isshareFlase {
		transform: translateY(100%);
		transition: transform 250ms;
	}

	/* 商品海报 */
	.poster-box {
		width: 100%;
		height: calc(100vh - 170upx);
	}

	.poster-image {
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		width: 72vw;
	}

	.poster-show {
		width: 72vw;
		height: calc(100vh - 170upx);
		margin: 0 14vw;
	}

	.poster-canvas {
		position: fixed;
		bottom: -100%;
		z-index: -999;
		opacity: 0;
	}

	.image-load {
		position: absolute;
		top: 50%;
		left: 50%;
		margin: -30upx 0 0 -30upx;
		width: 60upx;
		height: 60upx;
		display: inline-block;
		padding: 0px;
		border-radius: 100%;
		border: 4upx solid;
		border-top-color: #FFD940;
		border-top-color: var(--theme-color);
		border-bottom-color: rgba(0, 0, 0, 0.2);
		border-left-color: #FFD940;
		border-left-color: var(--theme-color);
		border-right-color: rgba(0, 0, 0, 0.2);
		animation: loader 1s ease-in-out infinite;
	}

	@keyframes loader {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.poster-item {
		flex-direction: column;
	}

	.setting-btn {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		z-index: 1;
	}
</style>
