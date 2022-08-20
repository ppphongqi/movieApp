<template>
	<view class="festival-live" :style="{backgroundImage: `url(${backgroundImage})`}" @click="handlCardClick">
		<view class="festival-live__btn-op" :class="cBtnClassStr"><view class="iconfont icon-118"></view><view class="festival-live__btn-op__text">{{cBtnText}}</view><view v-if="status == 1" class="iconfont icon-jinrujiantou"></view></view>
	</view>
</template>

<script>
	export default {
		props: {
			// 小程序直播间id
			roomId: {
				type: String,
				default:''
			},
			// 状态 -1:不确定，1:正在直播，2:直播已结束
			status: {
				type: [String,Number],
				default: -1
			},
			// 背景图片
			backgroundImage: {
				type: String,
				default: ''
			},
		},
		computed: {
			// 按钮的class字符串
			cBtnClassStr() {
				let classStr = ''
				if(+this.status !== 1) {
					classStr += 'is-disabled'
				}
				return classStr
			},
			// 按钮文字
			cBtnText() {
				if(+this.status === 1) {
					return '正在直播'
				}else if(+this.status === 2) {
					return '直播未开始'
				}else {
					return '...'
				}
			}
		},
		methods: {
			// 点击事件 跳转到对应直播间
			handlCardClick() {
				this.navigationTo(`pages/subPages/livePlayer/livePlayer?id=${this.roomId}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.festival-live {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 280rpx;
		margin: 20rpx auto;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 10rpx;
	}
	.festival-live__btn-op {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60rpx;
		padding: 0 24rpx;
		font-size: 26rpx;
		color: #fff;
		background-color: rgba($color: #1BD034, $alpha: 0.9);
		border-radius: 4rpx;
		&.is-disabled {
			background-color: rgba($color: #000000, $alpha: 0.6);
		}
		.iconfont {
			line-height: 1;
			font-size: inherit;
			color: inherit;
			&+.festival-live__btn-op__text {
				margin-left: 12rpx;
			}
		}
		.festival-live__btn-op__text {
			&+.iconfont {
				margin-left: 12rpx;
			}
		}
	}
</style>
