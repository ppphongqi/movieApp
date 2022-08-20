<template>
	<view class="c-clock-poster">
		<!-- type:url -->
		<view v-if="type === 'url'" class="clock-poster-url" :style="[cStyle]">
			<image class="clock-poster-url__img" :src="posterUrl" mode=""></image>
		</view>
		<!-- type:url end -->
		<!-- type:css -->
		<view v-else-if="type === 'css'" class="c-clock-poster-css" :style="[cStyle]">
			<!-- 头像 -->
			<image :src="avatar" style="position: absolute;left: 30rpx;top: 30rpx;width: 100rpx;height: 100rpx;border-radius: 100%;"></image>
			<!-- 头像 end -->
			<!-- 坚持的事情 -->
			<view style="position: absolute;left: 30rpx;top: 172rpx;font-size: 27rpx;">{{targetText}}</view>
			<!-- 坚持的事情 end -->
			<!-- 坚持的时间 -->
			<view style="position: absolute;left: 30rpx;top: 203rpx;font-size: 54rpx;">{{targetDay}}</view>
			<!-- 坚持的时间 end -->
			<!-- 时间标签 -->
			<view style="position: absolute;left: 30rpx;top: 312rpx;font-size: 27rpx;">{{timeTitle}}</view>
			<!-- 时间标签 end -->
			<!-- 时间 -->
			<view style="position: absolute;left: 30rpx;top: 344rpx;font-size: 54rpx;">{{timeStr}}</view>
			<!-- 时间 end -->
			<!-- 时间tip -->
			<view style="position: absolute;left: 30rpx;top: 410rpx;font-size: 20rpx;">{{titmeTip}}</view>
			<!-- 时间tip end -->
			<!-- 金句 -->
			<view style="position: absolute;left: 30rpx;top: 490rpx;font-size: 28rpx;width: 16em;">{{sentence}}</view>
			<!-- 金句 end -->
			<!-- 周几 -->
			<view style="position: absolute;right: 30rpx;top: 30rpx;font-size: 27rpx;">{{dayOfWeek}}</view>
			<!-- 周几 end -->
			<!-- 日期 -->
			<view style="position: absolute;right: 30rpx;top: 70rpx;font-size:27rpx;">{{date}}</view>
			<!-- 日期 end -->
			<!-- 二维码提示 -->
			<view style="position: absolute;right: 40rpx;top: 510rpx;font-size: 20rpx;width: 160rpx;text-align: center;">{{qrCodeTip}}</view>
			<!-- 二维码提示 end -->
			<!-- 二维码 -->
			<view style="position: absolute;right: 40rpx;top: 550rpx;font-size: 20rpx;width: 160rpx;height: 160rpx;">
				<image :src="qrCode" mode="" style="width: 100%;height:100%;"></image>
			</view>
			<!-- 二维码 end -->
		</view>
		<!-- type:css end -->
	</view>
</template>

<script>
	// 前后端海报样式是解耦的，前端尽量向后端靠近即可
	// 如果要调整海报样式，前后端都要调整
	export default {
		props: {
			// css:css样式，url:一张图片的样式(后端提供图片路径)
			type: {
				type: String,
				default: 'css'
			},
			// 缩放，可能用于弹窗等 需要缩放一下大小
			scale: {
				type: Number,
				default: 1
			},
			// 圆角，可能用于弹窗等 需要圆角,单位rpx
			radius: {
				type: [Number,String],
				default: 0
			},
			// 海报地址，type为url的时候必须
			posterUrl: {
				type: String,
				default: 'http://placekitten.com/750/750'
			},
			// 背景图片，type为css的时候必须
			bgUrl: {
				type: String,
				default: 'http://placekitten.com/750/750'
			}, 
			// 用户头像
			avatar: {
				type: String,
				default: 'https://via.placeholder.com/100x100/2a9ff6/fffffff'
			},
			// 坚持的事情
			targetText: {
				type: String,
				default: '坚持早睡'
			},
			// 坚持的时间（单位天）
			targetDay: {
				type: [String,Number],
				default: 2
			},
			// 时间标签
			timeTitle:{
				type: String,
				default: '今日入睡'
			},
			//时间
			timeStr: {
				type: String,
				default: '15:21'
			},
			// 时间tip
			titmeTip: {
				type: String,
				default: '比0.00%的人都睡得早'
			},
			// 金句
			sentence: {
				type: String,
				default: '长风破浪会有时，直挂云帆济沧海。'
			},
			// 周几
			dayOfWeek: {
				type: String,
				default: '星期四'
			},
			// 日期
			date: {
				type: String,
				default: '2022.03.17'
			},
			// 二维码
			qrCode: {
				type: String,
				default: 'https://via.placeholder.com/160x160/2a9ff6/fffffff'
			},
			// 二维码提示
			qrCodeTip: {
				type: String,
				default: '扫码说晚安'
			},
			// 所有文字的颜色
			textColor: {
				type: String,
				default: '#fff'
			}
		},
		computed: {
			// 格式化的style
			cStyle() {
				const defaultStyle = {
					transform: `scale(${this.scale})`,
					borderRadius: typeof +this.radius === 'number' ? `${this.radius}rpx` : this.radius,
				}
				if(this.type === 'url') {
					return defaultStyle
				}
				return {
					...defaultStyle,
					color: this.textColor,
					backgroundImage: `url("${this.bgUrl}")`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-clock-poster {
		width: 750rpx;
		height: 750rpx;
		transform: scale(0.92);
		transform-origin: center;
		border-radius: 20rpx;
		overflow: hidden;
	}
	// url 模式
	.clock-poster-url {
		display: flex;
		flex-direction: column;
	}
	.clock-poster-url__img {
		width: 100%;
		height: 100%;
	}
	// url 模式 end
	// css 模式
	.c-clock-poster-css {
		box-sizing: border-box;
		position: relative;
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
	// css 模式 end
</style>
