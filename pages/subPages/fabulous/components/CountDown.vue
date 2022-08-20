<template>
	<view class="c-count-down">
		<view v-if="status == 0" class="c-count-down__title">开始倒计时</view>
		<view v-if="status == 1" class="c-count-down__title">结束倒计时</view>
		<view v-if="status == 2" class="c-count-down__title">活动已结束</view>
		<view class="c-count-down-list">
			<view class="c-count-down-list-item">
				<view class="c-count-down-list-item__num">{{dd}}</view>
				<view class="c-count-down-list-item__company">天</view>
			</view>
			<view class="c-count-down-list-item">
				<view class="c-count-down-list-item__num">{{hh}}</view>
				<view class="c-count-down-list-item__company">时</view>
			</view>
			<view class="c-count-down-list-item">
				<view class="c-count-down-list-item__num">{{mm}}</view>
				<view class="c-count-down-list-item__company">分</view>
			</view>
			<view class="c-count-down-list-item">
				<view class="c-count-down-list-item__num">{{ss}}</view>
				<view class="c-count-down-list-item__company">秒</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 和服务器的时间差（毫秒）（比服务器时间快多少）
			timeDiff: {
				type: Number,
				default: 0
			},
			// 倒计时结束的时间（10位或者13位时间戳）
			leftTime: {
				type: Number,
				default: 0
			},
			// 活动类型
			status: {
				type: Number,
				default: 0,
			}
		},
		data() {
			return {
				timer: null,
				dd: '10',
				hh: '10',
				mm: '10',
				ss: '10',
				seconds: 0,
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
				
				this.dd = day
				this.hh = hour
				this.mm = minute
				this.ss = second
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-count-down {
		width: 616rpx;
		max-width: 100%;
		margin: 0 auto;
	}
	.c-count-down__title {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 36rpx;
		color: #7E3C0A;
		&::before,&::after {
			display: block;
			content: "\20";
			height: 2rpx;
			width: 90rpx;
			background-color: #7E3C0A;
		}
		&::before {
			margin-right: 16rpx;
		}
		&::after {
			margin-left: 16rpx;
		}
	}
	.c-count-down-list {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 32rpx;
	}
	.c-count-down-list-item {
		display: flex;
		align-items: center;
		flex: 1;
		font-weight: bold;
		color: #7E3C0A;
	}
	.c-count-down-list-item__num {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 86rpx;
		height: 86rpx;
		font-size: 36rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}
	.c-count-down-list-item__company {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
	}
</style>
