<template>
	<view class="page" :style="themeColor">
		<view class="poster-image">
			<share-poster :poster-type="posterType" :poster-data="{pId:pId,period_id:period_id}" @success="poster_images = $event"></share-poster>
		</view>
		<view class="t-c p-r" v-if="appClientType !== '4'">
			<button open-type="openSetting" class="btn-normal setting-btn" v-if="openSetting" @opensetting="onSetting"></button>
			<view class="saveBtn f-30 col-3 main-bg-color auxiliary-color" @click="saveimages(poster_images)">保存海报</view>
		</view>
	</view>
</template>

<script>
	import SharePoster from "@/components/template/SharePoster.vue"
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				poster_images: null,
				openSetting: false,
				pId: "",
				posterType: "",
				period_id:0
			};
		},
		components: {
			SharePoster
		},
		onLoad(e) {
			let {
				pId,
				posterType,
				period_id
			} = e;
			this.pId = pId;
			this.posterType = posterType;
			this.period_id=period_id
		},
		methods: {
			saveimages() {
				uni.showLoading();
				let _this = this,
					poster_images = this.poster_images;
				// #ifdef H5
				_this.downloadIamge(poster_images);
				// #endif
				// #ifdef MP-ALIPAY
				my.saveImage({
					url: poster_images,
					complete() {
						uni.hideLoading();
					}
				});
				// #endif
				// #ifndef H5 || MP-ALIPAY
				// uni.getImageInfo({
				// 	src: poster_images,
				// 	success(image) {
				_this.getImageTempFile(poster_images).then(filePath => {
					uni.saveImageToPhotosAlbum({
						filePath,
						success() {
							App.showSuccess('保存成功');
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
				})

				// 	},
				// 	fail() {
				// 		uni.hideLoading();
				// 		App.showError("图片获取失败,请确认图片域名已加入小程序downloadFile合法域名列表中");
				// 	}
				// });
				// #endif
			},
			/**
			 * 获取图片本地路径
			 */
			getImageTempFile(tempFilePaths) {
				return new Promise((resolve, reject) => {
					if (tempFilePaths.includes("https") || tempFilePaths.includes("http")) {
						uni.getImageInfo({
							src: tempFilePaths,
							success(image) {
								resolve(image.path);
							},
							fail() {
								uni.hideLoading();
								App.showError("图片获取失败,请确认图片域名已加入小程序downloadFile合法域名列表中");
							}
						});
					} else {
						resolve(tempFilePaths)
					}
				})
			},
			onSetting(res) {
				console.log(res);
				let authSetting = res.detail.authSetting,
					scope = "scope.writePhotosAlbum";
				if (authSetting[scope]) {
					this.openSetting = false;
				}
			},
			// downloadIamge(imgsrc) {
			// 	//必须同源才能下载
			// 	var alink = document.createElement("a");
			// 	alink.href = imgsrc;
			// 	alink.download = "pic"; //图片名
			// 	alink.click();
			// },
			downloadIamge(imgsrc) { //下载图片地址和图片名
				var image = new Image();
				// 解决跨域 Canvas 污染问题
				image.setAttribute("crossOrigin", "anonymous");
				image.onload = function() {
					var canvas = document.createElement("canvas");
					canvas.width = image.width;
					canvas.height = image.height;
					var context = canvas.getContext("2d");
					context.drawImage(image, 0, 0, image.width, image.height);
					var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

					var a = document.createElement("a"); // 生成一个a元素
					var event = new MouseEvent("click"); // 创建一个单击事件
					a.download = "poster"; // 设置图片名称
					a.href = url; // 将生成的URL设置为a.href属性
					a.dispatchEvent(event); // 触发a的单击事件
				};
				image.src = imgsrc;
			}
		}
	}
</script>

<style scoped="">
	.page {
		padding: 0 30upx;

	}

	.poster-box {}

	.poster-image {
		width: 100%;
		margin: 30upx 0;
		border-radius: 15upx;
		height: calc(100vh - 160upx);
		/* #ifdef H5 */
		/* height: calc(100vh - 160upx - 44px); */
		/* #endif */
		display: block;
	}

	.saveBtn {
		width: 300upx;
		height: 80upx;
		line-height: 80upx;
		border-radius: 50upx;
		display: inline-block;
		background: rgb(255, 217, 64);
		text-align: center;
	}

	.setting-btn {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
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
		border-bottom-color: rgba(0, 0, 0, 0.2);
		border-left-color: #FFD940;
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
</style>
