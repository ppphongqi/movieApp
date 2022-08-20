<!--
	列表商品样式 by 杨智源
	goodsData 商品数据
	refund 售后按钮显示 1申请售后 2已申请售后 3已完成售后 -1不显示售后按钮
 -->
<template>
	<view class="item-content dis-flex flex-dir-row b-f p-r">
		<view class="item-img-box" :style="{'background-image':' url('+goodsImage(goodsData.image)+')'}">
			<view v-if="groupNumber != -1" class="group-num">{{groupNumber}}人团</view>
		</view>
		<view class="item-info dis-flex flex-dir-column flex-x-between flex-box">
			<view style="display: flex;">
				<view class="f-28" v-if="goodsData.is_give&&goodsData.is_give==1" style="border: 1px solid #FF4444;margin-right: 6rpx;border-radius:8rpx;margin-bottom: 8rpx; color: #ff4444;">赠送</view>
				<view class="f-28 twolist-hidden">
				{{goodsData.goods_name}}
				</view>
			</view>
			<view class="dis-flex flex-x-between flex-y-center">
				<view class="f-24 col-9">
					<block v-if="!!goodsData.goods_attr">{{goodsData.is_meal==1?'套餐':'规格'}} :{{goodsData.goods_attr}}</block>
				</view>
				<!-- 申请售后 -->
				<!-- #ifdef MP-TOUTIAO -->
				<view class="refund-btn dis-flex flex-x-end" v-if="refund !== -1">
					<text v-if="refund === 2 || refund === 3" class="f-26 col-7">{{refund === 2?"已申请退款":"已完成退款"}}</text>
					<view v-else-if="refund === 1" class="btn-default main-bg-color auxiliary-color" @click.stop="onApplyRefund(goodsData.order_goods_id,goodsData.order_id)">申请退款</view>
					<view v-else-if="refund === 1" class="f-26 col-7 main-bg-color auxiliary-color">申请退款</view>
				</view>
				<!-- #endif -->
				<!-- #ifndef MP-TOUTIAO -->
				<view class="refund-btn dis-flex flex-x-end" v-if="refund !== -1">
					<text v-if="refund === 2 || refund === 3" class="f-26 col-7">{{refund === 2?"已申请售后":"已完成售后"}}</text>
					<view v-else-if="refund === 1" class="btn-default main-bg-color auxiliary-color" @click.stop="onApplyRefund(goodsData.order_goods_id,goodsData.order_id)">申请售后</view>
					<view v-else-if="refund === 1" class="f-26 col-7 main-bg-color auxiliary-color">申请售后</view>
				</view>
				<!-- #endif -->
			</view>
			<view v-if="type === 'new'" class="dis-flex flex-row flex-x-end">
				<view class="f-28 col-3">共{{goodsData.total_num}}件商品 合计：</view>
				<view class="f-28 col-m">¥{{goodsData.total_pay_price}}</view>
			</view>
			<view v-else class="dis-flex flex-row flex-x-between">
				<view class="col-3 f-28 price-font-family">
					{{settingData.currency || "¥"}}{{goodsData.goods_price}}
					<!-- <text class="f-22 t-c" v-if="goodscard">会员价</text> -->
				</view>
				<view class="col-9 f-28" v-if="goodsData.total_num != 0">{{totalNumPrefix}}{{goodsData.total_num}}</view>
			</view>
		</view>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
export default {
    data() {
        return {

        }
    },
    props: {
        totalNumPrefix: {
            type: String,
            default: 'X'
        },
        goodsData: {
            type: Object,
            default: null
        },
        refund: {
            type: Number,
            default: -1
        },
        groupNumber: {
            type: Number,
            default: -1
        },
        goodscard: {
            type: Number,
            default: 0
        },
        // 样式类型，new:新样式（https://lanhuapp.com/web/#/item/project/detailDetach?pid=86925d37-7b39-4fa5-bdd7-7e7113696c80&project_id=86925d37-7b39-4fa5-bdd7-7e7113696c80&image_id=87111c22-40b4-40b3-a949-b94ba72263e7&fromEditor=true）
        type: {
            type: String,
            default: ''
        }
    },
    computed: {

    },
    beforeCreate() {

    },
    onLoad(options) {
        console.log('goodsData', goodsData)
    },

    onShow() {

    },
    mounted() {

    },
    methods: {
        goodsImage(image) {
            return (image === null || image === undefined) ? '' : image instanceof Array ? (image[0] ? image[0].file_path : '')
                : image.file_path
        },
        /**
			 * 申请售后
			 */
        onApplyRefund(orderGoodsId = '', orderId = '') {
            App.navigationTo({
                url: `pages/mainPages/order/refund/apply/apply?order_goods_id=${orderGoodsId}&order_id=${orderId}`
            })
        }
    }
}
</script>

<style>
	.item-content {
		width: 100%;
		box-sizing: border-box;
		padding: 26upx 0;
	}

	.item-img-box {
		position: relative;
		width: 170upx;
		height: 170upx;
		margin-right: 20upx;
		border-radius: 6upx;
		background: no-repeat;
		background-size: cover;
		background-position: center;
	}

	.item-img-box .group-num {
		position: absolute;
		top: 0;
		left: 0;
		font-size: 24upx;
		line-height: 38upx;
		color: #FFFFFF;
		/* width:76upx; */
		height: 38upx;
		background: linear-gradient(90deg, rgba(254, 80, 79, 1), rgba(254, 133, 79, 1));
		box-shadow: 0 2upx 10upx 0 rgba(254, 80, 79, 0.54);
		border-radius: 10upx 0 6upx 0;
		z-index: 2;
		text-align: center;
	}

	/* 	.item-img-box image {
		display: block;
	} */

	.refund-btn {
		/* 	position: absolute;
		right: 0;
		bottom: 66upx; */
	}

	.btn-default {
		border-radius: 4px;
		border: 1upx solid #ccc;
		padding: 4upx 16upx;
		font-size: 24upx;
		color: #555;
	}

	.item-content .price-font-family text {
		display: inline-block;
		width: 90upx;
		height: 36upx;
		line-height: 36upx;
		color: #ECDBBD;
		background-color: #333333;
		border-radius: 8upx;
		margin-left: 16upx;
	}
</style>
