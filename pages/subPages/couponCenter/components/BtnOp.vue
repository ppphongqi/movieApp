<template>
	<view class="p-r" @click.native.stop>
		<button class="c-btn-op btn-normal" :style="containStyle" @click="handleClick">{{text}}</button>
		<bind-mobile-button v-if="bindMobileVisible"></bind-mobile-button>
	</view>
</template>

<script>
import BindMobileButton from '@/components/template/BindMobileButton.vue'
export default {
	components: {
		BindMobileButton
	},
    props: {
        // 按钮文字
        text: {
            type: String,
            default: '立即领取'
        },
        // 按钮样式
        containStyle: {
            type: String,
            default: ''
        },
		// 是否显示绑定手机号
		bindMobileVisible: {
			type: Boolean,
			default: false
		}
    },
    methods: {
        handleClick() {
			console.log('handleClick',this.bindMobileVisible)
			if(this.bindMobileVisible) {
				uni.showToast({
					icon: 'none',
					title: '请先绑定手机号'
				})
				return
			}
            this.$emit('on-click')
        }
    }
}
</script>

<style lang="scss" scoped>
	.c-btn-op {
		width: 150rpx;
		height: 50rpx;
		border-radius: 25rpx;
		font-weight: bold;
		font-size: 23rpx;
		color: #fff;
		text-align: center;
		line-height: 50rpx;
		background: linear-gradient(-90deg, #FF4444 0%, #FD7137 100%);;
	}
</style>
