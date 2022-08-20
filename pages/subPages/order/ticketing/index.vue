<template>
	<view class="page-ticketing">
		<!-- header -->
		<view class="page-ticketing__header">
			<image class="page-ticketing__img-banner" :src="cDetailsData.bannerUrl"></image>
		</view>
		<!-- header end-->
		<!-- main -->
		<view class="page-ticketing__main">
			<view class="details-card">
				<view class="details-card__header">
					<!-- 标题 -->
					<view class="details-card__title">{{cDetailsData.title}}</view>
					<!-- 标题 end -->
					<!-- 描述 -->
					<view class="details-card__sketch">
						<view class="details-card__shop">
							<view class="details-card__icon-shop iconfont icon-shop"></view>
							<view class="details-card__shop-name">{{cDetailsData.shopName}}</view>
						</view>
						<view v-if="cDetailsData.type === 0" class="details-card__price price-font-family">
							<view class="details-card__price-symbol">¥</view>
							<view class="details-card__price-num">{{cDetailsData.priceStr}}</view>
						</view>
					</view>
				</view>
				<view class="details-card__content">
					<!-- 立即支付按钮 -->
					<view v-if="cDetailsData.type === 0" class="page-ticketing__btn-pay btn-normal" @click="handleBtnPayClick">立即支付</view>
					<!-- 立即支付按钮 end -->
					<!-- 描述 end -->
					<!-- 二维码 -->
					<image v-else-if="cDetailsData.type === 1" class="page-ticketing__img-qrcode" :src="cDetailsData.qrCodeUrl"></image>
					<!-- 二维码 end -->
					<!-- 状态提示 -->
					<view v-else-if="cDetailsData.type === 2" class="details-status">
						{{cDetailsData.statusText}}
					</view>
					<!-- 状态提示 end-->
					<!-- 有效期 -->
					<view v-if="cDetailsData.timeStr" class="page-ticketing__time">有效期：{{cDetailsData.timeStr}}</view>
					<!-- 有效期 end -->
					<!-- 提示 -->
					<view v-if="cDetailsData.tip" class="page-ticketing__tip">
						{{cDetailsData.tip}}
					</view>
					<!-- 提示 end -->
				</view>
			</view>
		</view>
		<!-- main end -->
		<!-- 支付方式选择弹窗 -->
		<OrderPay ref="orderPay" @paySuccess="paySuccess" @payFail="payFail" @onClickMask="payClickMask"></OrderPay>
		<!-- 支付方式选择弹窗 end -->
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
// show_qr = 1时显示二维码，其他都显示 status_text字段的值
import { dateFormat } from '@/common/js/date.js'
import App from '@/common/js/app.js'
import OrderPay from '@/components/template/OrderPayPopups.vue'
export default {
    components: {
        OrderPay
    },
    data() {
	    return {
            // 查询参数
            options: {},
	        // 详情的接口数据
	        detailsDataRes: {},
            // 二维码的接口数据
            qrCodeDataRes: '',
            // 当前是否正在进行支付操作
            isPaying: false
	    }
    },
    computed: {
        cDetailsData() {
            const data = this.detailsDataRes || {}
            // 类型：0-待付款，1-待使用，2-其他
            let type = -1
            if (data.price > 0 && +data.status === 2) {
                type = 0
            } else if (+data.show_qr === 1) {
                type = 1
            } else {
                type = 2
            }
            return {
                _soruce: data,
                // 状态
                type,
                // 当前
                statusText: data.status_text,
                // banner图地址
                bannerUrl: data.cover || '',
                // 标题
                title: data.title || '',
                // 商家名称
                shopName: this.$util.deepGet(data, 'stores.name', ''),
                // 价格
                priceStr: data.price || '',
                // 二维码地址
                qrCodeUrl: this.qrCodeDataRes || '',
                // 有效期
                timeStr: `${dateFormat(data.check_stime, { format: 'YYYY.MM.DD' })}~${dateFormat(data.check_etime, { format: 'YYYY.MM.DD' })}`,
                // 提示
                tip: data.check_tips || ''
            }
        }
    },
    onLoad(options) {
        this.options = options
    },
    onShow() {
        this.refreshPageData()
    },
    methods: {
        // 刷新页面数据的方法
        async refreshPageData() {
            try {
			    await this.mainMixin_BeforeFetchPageData()
			    await this.fetchDetailsRes()
                if (this.cDetailsData.type === 1) {
                    await this.fetchQrCodeDataRes()
                }
            } catch (e) {
			    // TODO handle the exception
            }
        },
        // 立即支付按钮的点击事件
        handleBtnPayClick() {
            if (this.isPaying) {
                return
            }
            this.isPaying = true
            this.onToggleList()
        },
        /**
		 * 支付方式弹窗打开关闭切换
		 */
        onToggleList() {
            this.$store.commit('orderPay', {
                id: this.detailsDataRes.id,
                assist_id: this.detailsDataRes.assist_id,
                pay_from: 'assist'
            })
            this.$refs.orderPay.onToggleList()
        },
        payClickMask() {
            console.log('payClickMask')
            this.isPaying = false
        },
        async paySuccess() {
            try {
                await this.refreshPageData()
                this.isPaying = false
            } catch (e) {

            }

        },
        async payFail() {
            try {
                await this.refreshPageData()
                this.isPaying = false
            } catch (e) {

            }
        },
        // 请求详情的接口数据
        async fetchDetailsRes() {
            try {
                const res = await App._postP('assist.Assist/assistDetail', {
                    id: this.options.id
                })
                this.detailsDataRes = res.data || {}
                App.hideLoading()
            } catch (e) {
                console.log('fetchDetailsRes', e)
                return Promise.reject(e)
                // TODO handle the exception
            }
        },
        // 请求二维码的接口数据
        async fetchQrCodeDataRes() {
		    try {
		        const res = await App._postP('order/createQrCode', {
		            param_c: this.$util.deepGet(this.detailsDataRes, 'param_c')
		        })
		        this.qrCodeDataRes = res.data || ''
                App.hideLoading()
		    } catch (e) {
		        console.log('fetchQrCodeDataRes', e)
		        return Promise.reject(e)
		        // TODO handle the exception
		    }
        }
    }
}
</script>

<style lang="scss" scoped>
	.page-ticketing__img-banner {
		width: 750rpx;
		height: 422rpx;
	}
	.page-ticketing__img-qrcode {
		display: block;
		width: 330rpx;
		height: 330rpx;
		margin: 0 auto;
		margin-top: 30rpx;
	}
	.details-card {
		box-sizing: border-box;
		position: relative;
		width: 690rpx;
		padding: 20rpx 30rpx 30rpx 30rpx;
		margin: 0 auto;
		margin-top: -54rpx;
		background-color: #fff;
		border-radius: 10rpx;
		z-index: 5;
	}
	.details-card__header {
		position: relative;
		margin: 0 -30rpx;
		padding: 0 30rpx;
		border-bottom: 1px dashed #eee;
		&::before {
			position: absolute;
			bottom: -25rpx;
			left: 0;
			content: "\20";
			width: 25rpx;
			height: 50rpx;
			background: #F8F8F8;
			border-radius: 0 100rpx 100rpx 0;
		}
		&::after {
			position: absolute;
			bottom: -25rpx;
			right: 0;
			content: "\20";
			width: 25rpx;
			height: 50rpx;
			background: #F8F8F8;
			border-radius: 100rpx 0 0 100rpx;
		}

	}
	.details-card__title {
		font-weight: bold;
		font-size: 36rpx;
		color: #333;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.details-card__sketch {
		display: flex;
		padding: 20rpx;
	}
	.details-card__shop {
		display: flex;
		align-items: center;
		flex: 1;
		width: 0;
		color: #999;
		font-size: 28rpx;
		margin-right: 16rpx;
	}
	.details-card__icon-shop {
		margin-right: 12rpx;
		vertical-align: middle;
	}
	.details-card__shop-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.details-card__price {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		font-weight: bold;
		margin-left: auto;
		font-size: 58rpx;
		color: #FF4444;
	}
	.details-card__content {
		position: relative;
		padding-top: 1px;
	}
	.details-card__price-symbol {
		padding-top: 11rpx;
		font-size: 36rpx;
	}
	.page-ticketing__time {
		margin-top: 10rpx;
		font-size: 26rpx;
		color: #999;
		text-align: center;
	}
	.page-ticketing__tip {
		box-sizing: border-box;
		padding: 12rpx 20rpx;
		margin-top: 42rpx;
		background-color: #F8F8F8;
		border-radius: 10rpx;
	}
	.page-ticketing__btn-pay {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		margin-top: 49rpx;
		font-size: 32rpx;
		font-weight: bold;
		background: var(--theme-color, #FFD940);
		color: var(--auxiliary-color, #333333);
		border-radius: 10rpx;
	}
	.details-status {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 330rpx;
		height: 330rpx;
		margin: 0 auto;
		margin-top: 30rpx;
		font-weight: bold;
		font-size: 36rpx;
		color: #fff;
		background-image: url(./static/images/img-qrcode--invalid.png);
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
