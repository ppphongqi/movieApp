<template>
	<cax ref="cax" :caxId="caxId" :painting="painting" :canvaseW="canvaseW" :canvaseH="canvaseH" v-if="showCanvas"></cax>
</template>

<script>
	import App from "@/common/js/app.js"
	import * as json2canvas from "./json2canvas/json2canvas.js";
	import cax from "./cax/cax.vue"
	export default {
		data() {
			return {
				caxId: 'caxId',
				canvaseH: 0,
				canvaseW: 0,
				isPainting: false
			}
		},
		mounted() {
			this.canvasId = this.caxId
		},
		watch: {
			'painting': {
				handler(newData, oldData) {
					if (!this.isPainting) {
						if (JSON.stringify(newData)) {
							// console.log(newData,'newData')
							if (newData && newData.width && newData.height) {
								this.isPainting = true
								this.readyPigment()
							}
						}
					}
				},
				immediate: true,
				deep: false
			},
			'w': {
				handler(newData, oldData) {
					if (typeof newData === 'number') {
						this.canvaseW = newData
					}
				},
				immediate: true,
				deep: false
			},
			'h': {
				handler(newData, oldData) {
					if (typeof newData === 'number') {
						this.canvaseH = newData
					}
				},
				immediate: true,
				deep: false
			}
		},
		props: {
			w: {
				type: Number
			},
			h: {
				type: Number
			},
			painting: {
				type: Object,
				default: () => {
					return {}
				}
			},
			showCanvas: {
				type: Boolean,
				default: true,
			},
		},
		components: {
			cax
		},
		methods: {
			getCaxComponent() {
				return this.$refs.cax
			},
			readyPigment() {
				const inter = setInterval(() => {
					if (this.canvasId) {
						clearInterval(inter)
						this.isPainting = true
						json2canvas.draw(this.painting, this.caxId, {
							page: App.getCurrentPage(),
							component: this.$refs.cax,
							callback: () => {
								this.saveImageToLocal();
							}
						}, (res) => {
							// #ifdef H5
							this.saveImageToLocal();
							// #endif
							console.log(this.isPainting, 'this.isPainting')
							this.isPainting = false

						});
					}
				}, 100)
			},
			convertCanvasToImage() {
				const selecter = this.getCaxComponent().$el.className;
				const canvas = typeof selecter === 'string' ? document.querySelector('.poster-canvas canvas') : selecter;
				const base64 = canvas.toDataURL("image/png");
				return base64;
			},
			saveImageToLocal() {
				const _this = this;
				// #ifndef H5
				const {
					width,
					height,
					scale
				} = this.painting;

				uni.canvasToTempFilePath({
					x: 0,
					y: 0,
					width: width * scale,
					height: height * scale,
					canvasId: this.caxId,
					success: function(res) {
						_this.$emit('onSave', res.tempFilePath)
					},
					fail: function() {
						_this.$emit('onFail', ...arguments)
					},
					complete: function() {
						_this.$emit('onComplete', ...arguments)
					}
				}, this.getCaxComponent())
				// #endif
				// #ifdef H5
				const base64Img = this.convertCanvasToImage();
				_this.$emit('onComplete', {
					errMsg: "canvasToTempFilePath:ok",
					tempFilePath: base64Img
				});
				// #endif
			}
		}
	}
</script>
