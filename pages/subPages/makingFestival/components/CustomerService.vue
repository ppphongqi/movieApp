<template>
	<view class="customer-service">
		<view class="customer-service__left">
			<image class="customer-service__avatar" :src="avatar" />
		</view>
		<view class="customer-service__center">
			<view class="customer-service__title">{{title}}</view>
			<view class="customer-service__desc">{{desc}}</view>
		</view>
		<view class="customer-service__right">
			<button class="btn-normal customer-servic__btn-concat" @click="popupLayerVisible=true">{{btnText}}</button>
		</view>
		<!-- 联系客服弹窗 -->
		<!-- #ifdef H5 -->
		<popup-layer
			:show="popupLayerVisible" 
			:showClose="true"
			topTitle="关注提醒"
			:phone="phone"
			:communityType="communityType"
			:imgSrc="qrcodeImgUrl"
			:isShowLongPressBtn="showLongPressBtn"
			@closePopupBtn="popupLayerVisible=false">
		</popup-layer>
		<!-- #endif -->
		<!-- #ifdef MP -->
		<popup-layer
			:showClose="true"
			:show="popupLayerVisible"
			topTitle="联系客服"
			:phone="phone"
			:communityType="communityType"
			:imgSrc="getImageRoot('91.png')"
			:pagePath="pagePath"
			footBtnText='去回复'
			@closePopupBtn="popupLayerVisible=false">
			<view v-if="appClientType ==='2'">
				有任何疑问，点击“<text class="col-m">去回复</text>”发送“<text class="col-m">{{communityId}}</text>”,即可添加客服微信
			</view>
		</popup-layer>
		<!-- #endif -->
		<!-- 联系客服弹窗 end -->
	</view>
</template>

<script>
import PopupLayer from '@/components/template/PopLayer.vue'
export default {
    components: {
        PopupLayer
    },
    props: {
        // 头像
        avatar: {
            type: String,
            default: 'http://placekitten.com/68/68'
        },
        // 标题
        title: {
            type: String,
            default: '本地吃喝玩乐福利群本地吃喝玩乐福利群本地吃喝玩乐福利群本地吃喝玩乐福利群'
        },
        // 描述
        desc: {
            type: String,
            default: '有问题咨询客服小姐姐~'
        },
        // 按钮文字
        btnText: {
            type: String,
            default: '对话'
        },
        // 联系电话
        phone: {
            type: String,
            default: ''
        },
        // 社群类型
        communityType: {
            type: String,
            default: ''
        },
		// 发送文字
		communityId: {
			type: String,
			default: ''
		},
		// 公众号中的二维码图片
		qrcodeImgUrl: {
			type: String,
			default: ''
		},
		showLongPressBtn: {
			type: Boolean,
			default: false
		},
		pagePath: {
			type: String,
			default: ''
		}
    },
    data() {
        return {
            popupLayerVisible: false
        }
    }
}
</script>

<style lang="scss" scoped>
	.customer-service {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		width: 690rpx;
		padding: 30rpx;
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 10rpx;
	}
	.customer-service__left {
		font-size: 0;
	}
	.customer-service__avatar {
		width: 68rpx;
		height: 68rpx;
		border-radius: 100%;
	}
	.customer-service__center {
		flex: 1;
		min-width: 0;
		margin-left: 18rpx;
	}
	.customer-service__title {
		width: 100%;
		font-weight: bold;
		color: #333;
		font-size: 28rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.customer-service__desc {
		width: 100%;
		color: #999;
		font-size: 24rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.customer-service__right {
		margin-left: 18rpx;
	}
	.customer-servic__btn-concat {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50rpx;
		padding: 0 30rpx;
		color: #fff;
		font-size: 24rpx;
		background-color: #2AC418;
		border-radius: 6rpx;
	}
</style>
