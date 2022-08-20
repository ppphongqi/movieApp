<template>
	<view class="c-audio-icon" :class="{'is-play':status === 'play'}" :style="styleStr">
		<!-- 播放中 -->
		<view v-if="status === 'play'" class="c-audio-icon__icon is-play" :class="iconPlayingClass" @click="pause"></view>
		<!-- 播放中 -->
		<!-- 暂停播放中 -->
		<view v-else class="c-audio-icon__icon" :class="iconSuspendedClass" @click="play"></view>
		<!-- 暂停播放中 -->
	</view>
</template>

<script>
export default {
    props: {
        // 播放中按钮的class
        iconPlayingClass: {
            type: String,
            default: 'iconfont icon-16'
        },
        // 暂停中按钮的class
        iconSuspendedClass: {
            type: String,
            default: 'iconfont icon-115'
        },
        // 音乐的地址
        src: {
            type: String,
            default: ''
        },
        // 是否自动播放
        autoPlay: {
            type: Boolean,
            default: true
        },
        // 是否循环播放
        loop: {
            type: Boolean,
            default: true
        },
        // v-model
        value: {
            type: String,
            default: ''
        },
        styleStr: {
            type: String,
            default: 'position: fixed;right: 30rpx;top: 200rpx;z-index: 5;'
        }
    },
    data() {
        return {
            // 当前的状态 pause:暂停，play:播放，error:错误
            status: 'pause'
        }
    },
    mounted() {
        this.getAudioInstance()
    },
    watch: {
        // #ifdef H5
        '$route.path'() {
            console.log('音频$route.path destroy')
            this.destroy()
        },
        // #endif
        src(val) {
            if (val) {
                this.getAudioInstance().src = val
            }
            if (this.autoPlay) {
                this.play()
            }
        },
        status(val) {
            console.log('音频播放组件状态', val)
		    this.$emit('input', val)
        },
        value(val) {
            if (val === 'play') {
                this.play()
                return
            }
            if (val === 'pause') {
                this.pause()
            }
        }
    },
    beforeDestroy() {
        this.destroy()
    },
    methods: {
        // 得到音频实例
        getAudioInstance() {
            if (this.audio) {
                return this.audio
            }
            this.audio = uni.createInnerAudioContext()
            this.audio.autoplay = this.autoPlay
            this.audio.src = this.src
            this.audio.loop = this.loop
            this.audio.onPlay(() => {
                this.status = 'play'
            })
            this.audio.onPause(() => {
                this.status = 'pause'
            })
            this.audio.onStop(() => {
			    this.status = 'pause'
            })
            this.audio.onEnded(() => {
			    this.status = 'pause'
            })
            this.audio.onError(() => {
			    this.status = 'pause'
            })
            if (this.autoPlay) {
                // 确保能自动播放
                this.play()
            }
            return this.audio
        },
        // 播放音频
        play() {
            if (this.status === 'play') {
                return
            }
            if (!this.jweixinFlag && typeof jWeixin !== 'undefined') {
                // 在微信里面 第一次自动播放的办法
                console.log('在微信里面 第一次自动播放的办法')
                this.jweixinFlag = true
                const vm = this
                jWeixin.ready(function () {
                    // hack 苹果支付成功以后 又继续播放
                    if (vm.hadPlay) {
                        return
                    }
                    vm.hadPlay = true
                    console.log('微信里面开始播放音频')
                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                        vm.getAudioInstance().play()
                    })
                })
            } else {
                console.log('直接API播放的办法')
                this.getAudioInstance().play()
            }
        },
        // 暂停播放音频
        pause() {
            if (this.status === 'pause') {
                return
            }
            this.getAudioInstance().pause()
        },
        // 销毁音频
        destroy() {
            try {
                this.getAudioInstance().destroy()
                this.audio = null
            } catch (e) {
                // TODO handle the exception
            }
        }
    }
}
</script>

<style lang="scss" scoped>
	.c-audio-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 88rpx;
		height: 88rpx;
		background-color: var(--theme-color,#FFD940);
		color: var(--auxiliary-color,#fff);
		border-radius: 50%;
		.iconfont {
			font-size: 60rpx;
		}
		&.is-play {
			animation:turn 1s linear infinite;
		}
	}
	@keyframes turn{
      0%{-webkit-transform:rotate(0deg);}
      25%{-webkit-transform:rotate(90deg);}
      50%{-webkit-transform:rotate(180deg);}
      75%{-webkit-transform:rotate(270deg);}
      100%{-webkit-transform:rotate(360deg);}
    }
</style>
