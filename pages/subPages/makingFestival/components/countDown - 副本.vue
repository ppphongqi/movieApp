<!-- 设计稿用了第三方数字字体 但是按照常规办法 第三方字体会在真机上向上便宜 -->
<!-- 如果要处理便宜 要写额外的dom接口和css -->
<!-- 为了方便开发 就不用第三方字体了 点赞页面就没用第三方字体 -->
<template>
	<view class="count-down">
		<!-- header -->
		<view class="count-down__header">活动倒计时</view>
		<!-- header end -->
		<!-- content -->
		<view class="count-down__content">
			<view class="count-down__item">
				<view class="count-down__time">
					<!-- 必须这样写第三方数字字体才能居中 -->
					<view class="count-down__number">
						<!-- 兼容第三方数字字体的写法 -->
						<!-- <text class="is-trong price-font-family">0</text> -->
						{{time.DD[0]}}
					</view>
					<view class="count-down__number">
						{{time.DD[1]}}
					</view>
				</view>
				<view class="count-down__unit">天</view>
			</view>
			<view class="count-down__item">
				<view class="count-down__time">
					<!-- 必须这样写第三方数字字体才能居中 -->
					<view class="count-down__number">
						{{time.HH[0]}}
					</view>
					<view class="count-down__number">
						{{time.HH[1]}}
					</view>
				</view>
				<view class="count-down__unit">时</view>
			</view>
			<view class="count-down__item">
				<view class="count-down__time">
					<!-- 必须这样写第三方数字字体才能居中 -->
					<view class="count-down__number">
						{{time.HH[0]}}
					</view>
					<view class="count-down__number">
						{{time.HH[1]}}
					</view>
				</view>
				<view class="count-down__unit">时</view>
			</view>
			<view class="count-down__item">
				<view class="count-down__time">
					<!-- 必须这样写第三方数字字体才能居中 -->
					<view class="count-down__number">
						{{time.mm[0]}}
					</view>
					<view class="count-down__number">
						{{time.mm[1]}}
					</view>
				</view>
				<view class="count-down__unit">分</view>
			</view>
			<view class="count-down__item">
				<view class="count-down__time">
					<!-- 必须这样写第三方数字字体才能居中 -->
					<view class="count-down__number">
						{{time.ss[0]}}
					</view>
					<view class="count-down__number">
						{{time.ss[1]}}
					</view>
				</view>
				<view class="count-down__unit">秒</view>
			</view>
		</view>
		<!-- content end -->
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import duration from 'dayjs/plugin/duration'
	
	dayjs.extend(duration)
	
	export default {
		props: {
			// 倒计时结束时间戳（毫秒）(一定要传毫秒时间戳 否则会出错)
			endTimeStamp: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				// 当前时间
				time: {
					DD: [0,0],
					HH: [0,0],
					mm: [0,0],
					ss: [0,0]
				}
			}
		},
		watch: {
			endTimeStamp:{
				handler(val) {
					this.startCountDown()
				},
				immediate: true
			}
		},
		beforeDestroy() {
			this.endCountDown()
		},
		methods: {
			// 开始倒计时
			startCountDown() {
				if(this.timer) return
				this.timer = setInterval(()=>{
					const now = +dayjs()
					if(this.endTimeStamp < now) {
						console.log('倒计时结束啦')
						this.endCountDown()
						this.resetTime()
						return
					}
					const duration = dayjs.duration(this.endTimeStamp - now)
					const HH = this.getTimeArray(parseInt(duration.asDays()))
					this.time = {
						DD: this.getTimeArray(parseInt(duration.asDays())),
						HH: this.getTimeArray(duration.hours()),
						mm: this.getTimeArray(duration.minutes()),
						ss: this.getTimeArray(duration.seconds())
					}
				},1000)
			},
			// 结束倒计时
			endCountDown() {
				clearInterval(this.timer)
				this.timer = null
			},
			// 重置时间
			resetTime() {
				this.time= {
					DD: [0,0],
					HH: [0,0],
					mm: [0,0],
					ss: [0,0]
				}
			},
			// 得到时间数组
			/**
			 * 得到时间数组
			 * 输出结果如下
			 * 0=>[0,0]
			 * 1=>[0,1]
			 * 15=>[1,6]
			 * 101=>[9,9]
			 * @param {number} num
			 */
			getTimeArray(num) {
				if(num >= 99) {
					num = 99
				}
				if(num<0) {
					num = 0
				}
				num = "0" +　num
				return num.split('').slice(-2)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.count-down {
		box-sizing: border-box;
		width: 690rpx;
		min-height: 179rpx;
		margin: 20rpx auto;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}
	.count-down__header {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		&::after,&::before {
			content: "";
			width: 50rpx;
			height: 1px;
			margin: 0 24rpx;
			background-color: #CCCCCC;
		}
	}
	.count-down__content {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20rpx;
	}
	.count-down__item {
		display: flex;
		align-items: flex-end;
	}
	.count-down__time {
		display: flex;
		align-items: center;
		line-height: normal;
	}
	.count-down__number {
		width: 40rpx;
		height: 60rpx;
		color: #fff;
		font-size: 48rpx;
		font-weight: bold;
		text-align: center;
		line-height: 60rpx;
		background-color: #333333;
		border-radius: 4rpx;
		overflow: hidden;
		&+& {
			margin-left: 4rpx;
		}
	}
	.count-down__unit {
		margin: 0 10rpx;
	}
</style>
