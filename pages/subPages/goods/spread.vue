<template>
	<view :style="themeColor">
		<page-Header>
			<block slot="content">
				<view class="spread-content">
					<view class="spread-title f-30 col-3">商品推广文案<view class="title-icon"></view>
					</view>
					<view class="spread-text f-26 col-6">
						<image class="semicolon" src="/static/images/semicolon.png"></image>{{extension_text?extension_text:"暂无推广文案"}}
						<image class="semicolon rotate" src="/static/images/semicolon.png"></image>
					</view>
					<view class="spread-btn f-26 col-9 t-c dis-flex flex-y-center flex-x-center" @click="copyText">
						<view class="iconfont icon-text"></view>复制发圈文案
					</view>
				</view>
			</block>
		</page-header>
		<view class="spread-content b-f spread-imgs-box">
			<view class="spread-title f-30 col-3">商品推广图片<view class="title-icon"></view>
			</view>
			<view class="spread-imgs">
				<block v-for="(item,index) in extension_img" :key="index">
					<view class="spread-img p-r" :style="{'background-image':'url('+index===0?'':item+')','background-color':item===''?'#F6F6F6':''}"
					 @click="previewImage(index)">
						<image :src="item" class="poster-img" mode="widthFix"></image>
						<view class="image-load" v-if="item===''"></view>
					</view>
				</block>
			</view>
			<view class="spread-btn f-26 col-3 t-c p-r main-bg-color auxiliary-color" v-if="extension_img.length>0" @click="saveSpreadImg">
				<button open-type="openSetting" class="btn-normal setting-btn " v-if="openSetting" @opensetting="onSetting"></button>
				保存发圈图片
			</view>
		</view>
		<view class="share-poste">
			<share-poster poster-type="goods" :poster-data="{pId:goods_id}" @success="getPoster"></share-poster>
		</view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import SharePoster from '@/components/template/SharePoster.vue'
import PageHeader from '@/components/template/PageHeader.vue'
let isPermission = true
export default {
    data() {
        return {
            extension_img: [''],
            extension_text: '',
            goods_id: '',
            post_img: '',
            openSetting: false,
            isSaving: false
        }
    },
    components: {
        PageHeader,
        SharePoster
    },
    computed: {},
    onLoad(e) {
        this.pageLoad(e)
    },
    methods: {
        /**
			 * 页面加载处理
			 */
        pageLoad(e) {
            this.goods_id = e.goods_id
            this.getCommodity(e.goods_id)
        },
        getPoster(e) {
            this.post_img = e
            this.extension_img.splice(0, 1, e)
        },
        getCommodity(goods_id) {
            let _this = this
            App._get('goods/commodityPromotion', {
                goods_id
            }, result => {
                let {
                    extension_img,
                    extension_text
                } = result.data
                App.hideLoading()
                let loadList = []
                _this.extension_img.splice(1, 8, ...extension_img)
                _this.extension_text = extension_text
                uni.stopPullDownRefresh()
            })
        },
        copyText() {
            if (this.extension_text) {
                App.copyTextHandle(this.extension_text)
            } else {
                uni.showToast({
                    icon: 'none',
                    title: '暂无推广文案'
                })
            }

        },
        async saveSpreadImg() {
            let _this = this,
                openSetting = _this.openSetting,
                extension_img = _this.extension_img,
                saveImagesList = []
            if (openSetting) {
                return
            }
            // #ifdef H5
            uni.showToast({
                icon: 'none',
                title: '请点开图片长按以保存'
            })
            return
            // #endif
            uni.showLoading({
                title: '保存中...'
            })

            // 保存图片的promise
            const saveImgPromiseList = []

            extension_img.forEach((img, index) => {
                if (img) {
                    const saveImgPromise = async () => {
                        try {
                            // 取得图片数据
                            const [
                                imageInfoError,
                                imageInfoRes
                            ] = await uni.getImageInfo({
                                src: img
                            })
                            if (imageInfoError) {
                                return Promise.reject({
								    msg: `第${index + 1}图片${img}获取失败`
                                })
                            }
                            console.log({
							    imageInfoError,
							    imageInfoRes
                            })
                            // 保存图片
                            const [
                                saveImageError,
                                saveImageRes
                            ] = await uni.saveImageToPhotosAlbum({
                                filePath: imageInfoRes.path
                            })

                            if (saveImageError && (saveImageError.errMsg === 'saveImageToPhotosAlbum:fail:auth denied' || saveImageError.errMsg === 'saveImageToPhotosAlbum:fail auth deny')) {
							    return Promise.reject({
                                    msg: '请先打开相册权限'
                                })
							    this.openSetting = true
                            } else if (saveImageError) {
                                return Promise.reject({
								    msg: saveImageError.errMsg
                                })
                            }
                            console.log({
                                imageInfoError,
                                imageInfoRes,
                                saveImageError,
                                saveImageRes
                            })
                        } catch (e) {
                            console.log(e)
                            return Promise.reject({
                                msg: `第${index + 1}图片${img}保存失败`
                            })
                            // TODO handle the exception
                        }
                    }
                    saveImgPromiseList.push(saveImgPromise)
                }
            })

            try {
                const res = await Promise.all(saveImgPromiseList.map(foo => foo()))
                console.log('haha', res)
                uni.showToast({
                    title: `保存成功，共 ${res.length}张图片`,
                    icon: 'none'
                })
            } catch (e) {
                uni.hideLoading()
                App.showError(e.msg || '保存图片失败')
                // TODO handle the exception
            }

            /* saveImagesList = extension_img.map((img, index) => {
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							uni.getImageInfo({
								src: img,
								success(imgInfo) {
									resolve(imgInfo.path);
								}
							})
						}, 100);
					})
				});

				console.log(saveImagesList, 'saveImagesList===========')
				Promise.all(saveImagesList).then((imagesList) => {
					console.log(imagesList, 'imagesList===========')
					let poster = imagesList[0],
						spreadImg = imagesList.slice(1);
					uni.saveImageToPhotosAlbum({
						filePath: poster,
						success() {
							spreadImg.map(image => {
								setTimeout(() => {
									uni.saveImageToPhotosAlbum({
										filePath: image,
										success() {
											uni.hideLoading();
											console.log('save success', image);
											App.showSuccess("已保存");
										}
									});
								}, 200);
							})
						},
						complete(res) {
							uni.hideLoading();
							if (res.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || res.errMsg ===
								"saveImageToPhotosAlbum:fail auth deny") {
								App.showError("获取权限失败,请重试");
								_this.openSetting = true;
							}
						}
					});
				});*/
        },
        onSetting(res) {
            console.log(res)
            let authSetting = res.detail.authSetting,
                scope = 'scope.writePhotosAlbum'
            if (authSetting[scope]) {
                this.openSetting = false
            }
        },
        previewImage(index) {
            let extension_img = this.extension_img
            if (extension_img.length > 0) {
                uni.previewImage({
                    urls: extension_img,
                    current: index
                })
            }
        }
    },
    onPullDownRefresh() {
        this.getPoster(this.post_img)
        this.getCommodity(this.goods_id)
    }
}
</script>

<style lang="scss">
	.spread-content {
		padding: 10upx 30upx 30upx;
	}

	.spread-title {
		line-height: 3em;
	}

	.title-icon {
		display: inline-block;
		width: 0;
		height: 0;
		border: 10upx solid;
		border-color: transparent #FFD940 #FFD940 transparent;
		border-color: transparent var(--theme-color) var(--theme-color)transparent;
		margin-left: 12upx;
		vertical-align: bottom;
		position: relative;
		bottom: 1em;
	}

	.spread-text {
		padding: 30upx;
		background-color: #F6F6F6;
		text-indent: 4upx;
		letter-spacing: 4upx;
		line-height: 1.6em;
		word-break: break-all;
	}

	.semicolon {
		display: inline-block;
		width: 72upx;
		height: 72upx;
		vertical-align: bottom;
		margin: -20upx 12upx 0 -10upx;
	}

	.semicolon.rotate {
		transform: rotate(180deg);
		margin: -10upx 0;
	}

	.spread-btn {
		margin: 40upx auto 10upx;
		width: 300upx;
		height: 70upx;
		line-height: 70upx;
		border-radius: 6upx;
		border: 1upx solid #CCCCCC;
	}

	.spread-btn .iconfont {
		display: inline-block !important;
		line-height: 2em;
		margin-right: 12upx;
	}

	.spread-imgs-box {
		margin: 20upx 30upx;
		border-radius: 20upx;
	}

	.spread-imgs-box .spread-btn {
		background: #FFD940;
		border: 0;
	}

	.spread-img {
		box-sizing: border-box;
		display: inline-block;
		width: 31%;
		padding-top: 31%;
		margin: 0 1.16%;
		background-repeat: no-repeat;
		background-size: 100%;
		background-position: center;
		position: relative;
		overflow: hidden;
	}

	.poster-img {
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		width: 100%;
		display: block;
	}

	.image-load {
		position: absolute;
		top: 50%;
		left: 50%;
		margin: -15upx 0 0 -15upx;
		width: 30upx;
		height: 30upx;
		display: inline-block;
		padding: 0px;
		border-radius: 100%;
		border: 2upx solid;
		border-top-color: #FFD940;
		border-bottom-color: rgba(0, 0, 0, 0.1);
		border-left-color: #FFD940;
		border-right-color: rgba(0, 0, 0, 0.1);
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

	.setting-btn {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		z-index: 10;
	}

	.share-poste {
		position: fixed;
		bottom: -99999vh;
		z-index: -9999;
		opacity: 0;
	}
</style>
