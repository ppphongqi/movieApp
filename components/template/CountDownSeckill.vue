<template>
	<view class="uni-countdown" :class="'uni-countdown_'+statusNew">
		<view v-if="showDay" class="uni-countdown__number price-font-family f-24">{{d}}天</view>
		<view v-if="showDay" class="uni-countdown__dian f-24">:</view>
		<view class="uni-countdown__number price-font-family f-24">{{h}}</view>
		<view class="uni-countdown__dian f-24">:</view>
		<view class="uni-countdown__number price-font-family f-24">{{i}}</view>
		<view class="uni-countdown__dian f-24">:</view>
		<view class="uni-countdown__number price-font-family f-24">{{s}}</view>
	</view>
</template>
<script>
	export default {
		props: {
			statusNew:{
				type: Number,
				default: 0
			},
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
			// isPadding: {
			// 	type: Boolean,
			// 	default: false
			// }
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
				// if (day < 10) {
				// 	day = '0' + day
				// }
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
<!-- 为什么没用scoped！！！！ -->
<style lang="scss">
	$countdown-height: 34rpx;
	$uni-font-size-base:24rpx;
	$uni-border-radius-base-new:4rpx;

	.uni-countdown {
		padding: 0 6rpx;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		
		&__number {
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 1;
			border-radius: $uni-border-radius-base-new;
			margin: 0 5rpx;
			font-size: $uni-font-size-base;
			font-size: $uni-font-size-sm;
			padding: 0 8rpx;
			padding-top: 6rpx;
			background: var(--theme-color);
			color: var(--auxiliary-color);
		}
		
		&__dian{
			padding: 0 2rpx;
		}
	}
	.uni-countdown_2{
		.uni-countdown__number{
			background: #F5F5F5;
			color: #999999;
		}
		.uni-countdown__dian{
			color: #999999;
		}
	}
</style>
