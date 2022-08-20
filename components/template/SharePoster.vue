<!--
	分享海报 by yzy
	@param {String} postType  goods商品 store店铺 dealer分销 evaluate评价 luck抽奖
	@param {Object} postData  生成海报所需参数
 -->
<template>
	<view class="share-poster">
		<view class="image-load" v-show="!poster_images"></view>
		<block v-show="poster_images">
			<image :src="poster_images" mode="aspectFit" class="poster-image"></image>
		</block>
		<canvas-poster class="poster-canvas" @onComplete="saveImg" ref="json2canvas" :h="height" :w="width" :painting="painting"></canvas-poster>
	</view>
</template>

<script>
import canvasPoster from '@/components/threeComponents/canvasPoster/index.vue'
import App from '@/common/js/app.js'
export default {
    data() {
        return {
            poster_images: null,
            user_id: App.getUserId(),
            painting: null
        }
    },
    components: {
        canvasPoster
    },
    props: {
        posterType: {
            type: String,
            default: ''
        },

        posterData: {
            type: Object,
            default: () => null
        },
        period_id: {
            type: Number,
            default: undefined
        },
        height: {
            type: Number,
            default: 600
        },
        width: {
            type: Number,
            default: 375
        }
    },
    mounted() {
        console.log('添加参数+++++++++++++++++++',this.posterData)
        console.log(this.posterType)

        this.getPosterDetail(this.posterType, this.posterData)

    },

    methods: {
        getPosterDetail(posterType, posterData) {
            let _this = this,
                url = ''

				 console.log('getPosterDetail', posterType, posterData)
            switch (posterType) {
            case 'goods':
                url = 'goods/getQrcode'
                posterData.goods_id = posterData.pId
                posterData.activitys_id = posterData.activitysId || ''
                break
            case 'store':
                url = 'merchant.index/getQrcode'
                posterData.bus_id = posterData.pId
                break
            case 'dealer':
                url = 'user.dealer.user/getQrcode'
                break
            case 'evaluate':
                url = 'comment/getPoster'
                posterData.evaluate_id = posterData.pId
                break
            case 'luck':
                url = 'luck.luck/getQrcode'
                posterData.luck_id = posterData.pId
                posterData.period_id = posterData.period_id
                break
            case 'praise':
                url = 'praise.Praise/poster'
                posterData.praise_id = posterData.pId
                break
            case 'member':
                url = 'member.Member/getQrcode'
                break
            case 'cgp':
                url = 'cgp.Reg/getQrcode'
				break
            case 'cardBag':
                url = 'card.card/poster'
                break
			case 'phoneBill':
			    url = 'phoneBill.Index/poster'
			    break
			case 'salesman':
			    url = 'salesman.Salesman/poster'
			    break
			case 'goodsCollection':
				url = 'user.dealer.Goods/getQrcode'
				break
			case 'free_id':
			    url = 'free.Free/getFreePoster'
				posterData.goods_id = posterData.pId
				posterData.free_id = posterData.freeId
				posterData.card_id = posterData.cardId
			    break
			case 'cardBagOrder':
				url = 'card.card/orderPoster'
				break
			case 'clock':
				url = 'clock.Clock/newClockImg'
				break
            }
            delete posterData.pId
            delete posterData.postertype
            delete posterData.requesttype
            delete posterData.activitysId


            // #ifdef MP-TOUTIAO
            posterData.appName = _this.$store.state.systemInfo.appName
            // #endif
            posterData.diyPoster = 1

            App._post_form(url, posterData, result => {

                if (result.code === 1) {
                    _this[result.data instanceof Object ? 'painting' : 'poster_images'] = result.data
                    if (!(result.data instanceof Object)) {
                        _this.$emit('success', result.data)
                    }
                }
            })

        },
        /**
			 *生成海报
			 */
        saveImg(saveInfo) {
            let {
                posterType,
                goods_id
            } = this
            console.log(saveInfo)
            if (saveInfo.errMsg === 'canvasToTempFilePath:ok') {
                this.$emit('success', saveInfo.tempFilePath)
                this.poster_images = saveInfo.tempFilePath
            } else {
                uni.hideLoading()
                App.showError('生成失败,请重试')
            }
        }
    }
}
</script>

<style scoped="" lang="scss">
	.share-poster {}

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
		border-top-color: var(--theme-color);
		border-bottom-color: rgba(0, 0, 0, 0.2);
		border-left-color: #FFD940;
		border-left-color:var(--theme-color);
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
