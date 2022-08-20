<template>
	<view v-if="cData" class="users-bullet" :class="cClassStr" :style="cStyleStr">
		<image class="users-bullet__avatar" :src="cData.avatar">
		<view class="users-bullet__text">
			{{cData.text}}
		</view>
	</view>
</template>

<script>
export default {
    props: {
        // 是否是fixed
        fixed: {
            type: Boolean,
            default: true
        },
        bgColor: {
            type: String,
            default: ''
        },
        textColor: {
            type: String,
            default: ''
        },
        // 用户弹幕的列表数据
        listData: {
            type: Array,
            default() {
                return [
                    // {
                    // 	avatar: 'http://placekitten.com/46/46',
                    // 	text: '名扬天下刚刚下单成功名扬天下刚刚下单成功名扬天下刚刚下单成功名扬天下刚刚下单成功名扬天下刚刚下单成功'
                    // }
                ]
            }
        },
        // 动画时长 毫秒
        duration: {
            type: Number,
            default: 500
        },
        // 自动切换时间间隔 毫秒 不要大于duration
        interval: {
            type: Number,
            default: 4000
        }
    },
    data() {
        return {
            // 当前显示数据的索引
            activeIndex: 0,
            // 当前是否显示
            visible: true
        }
    },
    computed: {
        // 当前显示的用户数据
        cData() {
            return (this.listData || [])[this.activeIndex] || null
        },
        // 当前的classStr
        cClassStr() {
            let classStr = ''
            if (this.visible) {
                classStr += 'is-visible'
            }
            return classStr
        },
        // 格式化的styleStr
        cStyleStr() {
            let styleStr = ''
            styleStr += `--transition-duration: ${this.duration / 1000}s;`
            if (this.fixed) {
                styleStr += 'position: fixed;'
            } else {
                styleStr += 'position: static;'
            }
            if (this.bgColor) {
                styleStr += `background-color:${this.bgColor}`
            }
            if (this.textColor) {
                styleStr += `color:${this.textColor}`
            }
            return styleStr
        }
    },
    mounted() {
        this.startAnimation()
    },
    beforeDestroy() {
        this.endAnimation()
    },
    methods: {
        startAnimation() {
            console.log('UsersBullet startAnimation')
            if (this.timer) {
                return
            }
            this.timer = setInterval(() => {
                console.log('UsersBullet Interval')
                if (!this.listData || !this.listData.length || this.innerTimer) {
                    this.endAnimation()
                    return
                }
                this.visible = false
                this.innerTimer = setTimeout(() => {
                    this.visible = true
                    if (this.activeIndex >= this.listData.length - 1) {
                        this.activeIndex = 0
                    } else {
                        this.activeIndex += 1
                    }
                    clearTimeout(this.innerTimer)
                    this.innerTimer = null
                }, this.duration)
            }, this.interval)
        },
        endAnimation() {
            console.log('UsersBullet endAnimation')
            clearInterval(this.timer)
            this.timer = null
            this.innerTimer = null
        }
    }
}
</script>

<style lang="scss" scoped>
	.users-bullet {
		box-sizing: border-box;
		position: fixed;
		left: 30rpx;
		top: 30rpx;
		z-index: 30;
		display: flex;
		align-items: center;
		height: 60rpx;
		max-width: 440rpx;
		color: #fff;
		padding-left: 8rpx;
		padding-right: 30rpx;
		border-radius: 30rpx;
		background-color: rgba($color: #000000, $alpha: 0.6);
		opacity: 0;
		transition: opacity var(--transition-duration) ease-in-out;
		pointer-events: none;
		&.is-visible {
		  opacity: 1;
		}
	}
	.users-bullet__avatar {
		width: 46rpx;
		height: 46rpx;
		flex-shrink: 0;
		border-radius: 100%;
	}
	.users-bullet__text {
		margin-left: 24rpx;
		font-size: 24rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
