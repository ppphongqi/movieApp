<template>
	<popup-view class="rights-popup" :show="dVisible" type="center" @clickmask="dVisible = false">
		<view class="rights-card" :style="{'background-image':getImageRoot('98.png','url')}">
			<view class="rights-card__header">
				<view class="t-c f-36">{{title}}</view>
			</view>
			<view class="rights-card__content">
				<view class="t-c"><text style="font-size: 100rpx;">{{cAmount}}</text>元</view>
				<view class="t-c f-32">-随减金额-</view>
			</view>
			<view class="rights-card__footer padding-box-all">
				<view class="rights-card__btn-go app-btn-large" @click="handleBtnGo">确认收到</view>
			</view>
			<!-- 头像 -->
			<view class="rights-card__avatar-wrapper">
				<image class="rights-card__avatar" :src="cAvatar" mode="aspectFill"></image>
				<view class="rights-card__avatar-mask" :style="{'background-image':getImageRoot('97.png','url')}">
				</view>
				<view class="rights-card__avatar-text">{{cNickname}}</view>
			</view>
			<!-- 头像 end -->
			<!-- <view class="rights-popup__btn-close iconfont icon-searchclose" @click="dVisible = false"></view> -->
		</view>
	</popup-view>
</template>

<script>
	import {
		animate,
		easeOut,
	} from "popmotion/dist/popmotion.min.js"
	import PopupView from '@/components/template/PopManager.vue'
	const roundToNearest = target => v => Math.ceil(v / target) * target
	function getRandomInt(max) {
	  return Math.floor(Math.random() * max);
	}
	export default {
		components: {
			PopupView,
		},
		props: {
			// 默认是否显示v-model
			value: {
				type: Boolean,
				default: false
			},
			// 标题
			title: {
				type: String,
				default: '世界会向那些有目标和远见的人让路'
			},
			// 立减金额
			amount: {
				type: Number,
				default: 18.88
			},
			// 头像
			avatar: {
				type: String,
				default: ''
			},
			// 昵称
			nickname: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				dVisible: this.value,
				// 当前金额
				progress: 0
			}
		},
		computed: {
			cAmount() {
				return this.progress
			},
			cAvatar() {
				return this.avatar || this.mainMixin_userInfo.avatarUrl
			},
			cNickName() {
				return this.nickname || this.mainMixin_userInfo.nickName
			}
		},
		watch: {
			value(val) {
				
				this.dVisible = val
			},
			dVisible(val) {
				if(val) {
					this.stopAnimate()
					this.startAnimate()
				}
				this.$emit('input', val)
			}
		},
		beforeDestroy() {
			this.stopAnimate()
		},
		mounted() {
		},
		methods: {
			// 开始计数
			startAnimate() {
				if (this.animateInstance) return
				this.animateInstance = animate({
					from: 0,
					to: 100,
					duration: 2000+getRandomInt(1000),
					ease: easeOut,
					onUpdate: () => {
						this.progress = `${getRandomInt(9)}${getRandomInt(9)}.${getRandomInt(9)}${getRandomInt(9)}`
					},
					onComplete: ()=> {
						this.progress = this.amount
						this.stopAnimate()
					}
				})
			},
			// 结束计数
			stopAnimate() {
				if (!this.animateInstance) return
				this.animateInstance.stop()
				this.animateInstance = null
			},
			handleBtnGo() {
				if(!this.animateInstance) {
					this.$emit('btnGoClick')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rights-card {
		box-sizing: border-box;
		position: relative;
		width: 612rpx;
		height: 762rpx;
		padding-top: 172rpx;
		padding-left: 58rpx;
		padding-right: 58rpx;
		color: #FFF2B6;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
	}

	.rights-popup__btn-close {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		font-size: 36rpx;
		text-align: center;
	}

	.rights-card__content {
		margin-top: 30rpx;
		font-size: 36rpx;
		font-weight: bold;
		color: #FFF2B6;
		text-align: center;
	}

	.rights-card__btn-go {
		box-sizing: border-box;
		position: absolute;
		top: 560rpx;
		left: 50%;
		height: 120rpx;
		width: 280rpx;
		transform: translateX(-50%);
		border-radius: 999rpx;
		opacity: 0;
	}

	.rights-card__avatar-wrapper {
		box-sizing: border-box;
		position: absolute;
		left: 50%;
		top: -140rpx;
		width: 320rpx;
		height: 250rpx;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		transform: translateX(-50%);
	}

	.rights-card__avatar {
		position: absolute;
		left: 100rpx;
		top: 54rpx;
		width: 117rpx;
		height: 117rpx;
		border-radius: 100%;
	}

	.rights-card__avatar-mask {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		box-sizing: border-box;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
	}

	.rights-card__avatar-text {
		box-sizing: border-box;
		position: absolute;
		left: 0;
		bottom: 44rpx;
		width: 100%;
		padding: 0 80rpx;
		font-size: 28rpx;
		color: #fff;
		text-align: center;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
