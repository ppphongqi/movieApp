<template>
	<view class="uni-countdown" :class="{'isPadding':isPadding}">
		<view v-if="showDay" class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{d}}</view>
		<view v-if="showDay" class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '天'}}</view>
		<view class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{h}}</view>
		<view class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '时'}}</view>
		<view class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{i}}</view>
		<view class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '分'}}</view>
		<view class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{s}}</view>
		<view v-if="!showColon" class="uni-countdown__splitor" :style="{color:splitorColor}">秒</view>
	</view>
</template>
<script>
	export default {
		props: {
			//是否以冒号为分隔符
			showColon: {
				type: Boolean,
				default: false
			},
			//背景色
			backgroundColor: {
				type: String,
				default: "transparent"
			},
			//边框颜色
			borderColor: {
				type: String,
				default: "transparent"
			},
			//文字颜色
			color: {
				type: String,
				value: "#000000"
			},
			//割符号颜色
			splitorColor: {
				type: String,
				default: "#000000"
			},
			//天数
			day: {
				type: Number,
				default: 0
			},
			//小时
			hour: {
				type: Number,
				default: 0
			},
			//分钟
			minute: {
				type: Number,
				default: 0
			},
			//秒
			second: {
				type: Number,
				default: 0
			},
			//倒计时剩余时间s
			leftTime: {
				type: Number,
				default: 0
			},
			isPadding: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				timer: null,
				d: '00',
				h: '00',
				i: '00',
				s: '00',
				seconds: 0,
				showDay: true, //是否显示天数
			}
		},
		watch: {
			leftTime(newValue, oldValue) {
				if (newValue > 0) {
					clearInterval(this.timer);
					this.setCutDownTime();
				}
			}
		},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		mounted() {
			this.setCutDownTime();
		},
		methods: {
			setCutDownTime() {
				this.seconds = this.leftTime;
				// this.seconds = this.toSeconds(this.day, this.hour, this.minute, this.second);
				this.countDown()
				this.timer = setInterval(() => {
					this.seconds--
					if (this.seconds < 0) {
						this.timeUp()
						return
					}
					this.countDown()
				}, 1000)
			},
			toSeconds(day, hours, minutes, seconds) {
				return (day * 60 * 60 * 24) + (hours * 60 * 60) + (minutes * 60) + seconds
			},
			timeUp() {
				clearInterval(this.timer)
				this.$emit('timeEnd')
			},
			countDown() {
				let seconds = this.seconds
				let [day, hour, minute, second] = [0, 0, 0, 0]
				if (seconds > 0) {
					// day = Math.floor(seconds / (60 * 60 * 24))
					// hour = Math.floor(seconds / (60 * 60)) - (day * 24)
					// minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
					// second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
					day = parseInt(seconds / (60 * 60 * 24))
					hour = parseInt(seconds / 60 / 60 / 24 * 24 % 24)
					minute = parseInt(seconds / 60 % 60)
					second = parseInt(seconds % 60)
				} else {
					this.timeUp()
				}
				if (day < 10) {
					day = '0' + day
				}
				if (hour < 10) {
					hour = '0' + hour
				}
				if (minute < 10) {
					minute = '0' + minute
				}
				if (second < 10) {
					second = '0' + second
				}
				
				this.d = day
				this.h = hour
				this.i = minute
				this.s = second
				this.showDay = Number(day) > 0;
			}
		}
	}
</script>
<style lang="scss">
	$countdown-height:40rpx;
	$uni-font-size-base:24rpx;

	.uni-countdown {
		// padding: 0 6rpx;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;

		&__splitor {
			justify-content: center;
			line-height: $countdown-height;
			padding: 0 5upx;
			font-size: $uni-font-size-base;
		}

		&__number {
			line-height: $countdown-height;
			justify-content: center;
			height: $countdown-height;
			border-radius: $uni-border-radius-base;
			margin: 0 5upx;
			font-size: $uni-font-size-base;
			// border: 1px solid #000000;
			font-size: $uni-font-size-sm;
			padding: 0 4rpx;
		}

	}

	.isPadding {
		.uni-countdown__splitor {
			padding: 0;
		}

		.uni-countdown__number {
			padding: 0;
		}
	}
</style>
