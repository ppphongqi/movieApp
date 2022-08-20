<template>
	<view>
		<block v-if="itemStyle.display === '1'">
			<view class="audio-item dis-flex">
				<view class="iconfont" :class="[isAudioPaly?'icon-zanting':'icon-bofang']" @click="audioPlayChange"></view>
				<view class="audio-content p-r">
					<view class="audio-title f-28" :style="{'color':params.color}">{{params.title}}</view>
					<slider :value="speed" max="1000" block-size="12" activeColor="#83c0ff" block-color="#409EFF" step="1" class="cap-slider"
					 @change="audioSpeedChange" />
					<view class="audio-time">{{currentTime}}/{{duration}}</view>
				</view>
			</view>
		</block>
		<block v-if="itemStyle.display === '2'">
			<view class="audio-item dis-flex flex-y-center display-2">
				<view class="iconfont" :class="[isAudioPaly?'icon-zanting':'icon-bofang']" @click="audioPlayChange"></view>
				<view class="audio-title f-28" :style="{'color':params.color}">{{params.title}}</view>
			</view>
		</block>
		<block v-if="itemStyle.display === '3'">
			<view class="audio-item dis-flex flex-y-center display-3" @click="audioPlayChange">
				<image :src="params.thumb" class="img"></image>
				<image src="/static/images/diypage/audio1.png" class="audio"></image>
			</view>
		</block>
		<block v-if="itemStyle.display === '4'">
			<view class="audio-item dis-flex flex-x-end flex-y-center display-4" @click="audioPlayChange">
				<image src="/static/images/diypage/audio2.png" class="audio"></image>
				<image :src="params.thumb" class="img"></image>
			</view>
		</block>
	</view>
</template>

<script>
	let innerAudioContext = null,
		timer = null;
	export default {
		data() {
			return {
				isAudioPaly: false,
				currentTime: "00:00",
				duration: "00:00",
				speed: 0
			};
		},
		components: {

		},
		computed: {

		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			params: Object,
			itemId: String
		},
		beforeCreate() {

		},
		mounted() {
			let _this = this,
				params = _this.params
			if (params) {
				innerAudioContext = uni.createInnerAudioContext(_this.itemId, _this);
				innerAudioContext.duration
				innerAudioContext.src = params.audio;
				innerAudioContext.onPlay(_this.onAudioPaly);
				innerAudioContext.onEnded(_this.onAudioEnded);
				innerAudioContext.onSeeked(_this.onAudioSeeked);
				innerAudioContext.onTimeUpdate(_this.onAudioTimeUpdate);
			}
		},
		methods: {
			/**
			 * 音频播放/暂停
			 */
			audioPlayChange() {
				this.isAudioPaly = !this.isAudioPaly;
				innerAudioContext[!this.isAudioPaly ? 'pause' : 'play']();
			},
			onAudioPaly() {
				console.log("onAudioPaly")
			},
			/**
			 * 音频播放完成
			 */
			onAudioEnded() {
				this.isAudioPaly = false;
				this.currentTime = "00:00";
				this.speed = 0;
			},
			/**
			 * 音频播放进度
			 */
			onAudioTimeUpdate() {
				let _this = this,
					[currentTime, duration] = [innerAudioContext.currentTime, innerAudioContext.duration];
				_this.currentTime = _this.s_to_hs(currentTime);
				_this.duration = _this.s_to_hs(duration);
				_this.speed = parseInt((currentTime / duration) * 1000);
			},
			/**
			 * 音频进度跳转
			 */
			audioSpeedChange(res) {
				let speed = res.detail.value,
				seekTime = innerAudioContext.duration * speed / 1000;
				// console.log(this.s_to_hs(innerAudioContext.duration * speed / 100))
				innerAudioContext.seek(seekTime);
				this.currentTime = this.s_to_hs(seekTime);
			},
			/**
			 * 播放进度完成跳转
			 */
			onAudioSeeked(){
				innerAudioContext.pause();
				innerAudioContext.play();
			},
			s_to_hs(s) {
				var h;
				h = Math.floor(s / 60);
				s = s % 60;
				h = parseInt(h);
				s = parseInt(s);
				h += '';
				s += '';
				h = (h.length == 1) ? '0' + h : h;
				s = (s.length == 1) ? '0' + s : s;
				return h + ':' + s;
			}
		}
	}
</script>

<style>
	.audio-box {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.audio-item {
		height: 140upx;
		border: 1upx solid #eee;
		padding: 0 10upx;
		box-sizing: border-box;
		position: relative;
		margin: 10upx 30upx;
		overflow: hidden;
		background: #fff;
	}

	.audio-item .iconfont {
		font-size: 50upx;
		width: 80upx;
		height: 80upx;
		line-height: 68upx;
		text-align: center;
		text-indent: 10upx;
		color: #409EFF;
		border: 4upx solid #409EFF;
		border-radius: 50%;
		margin: 30upx 0 0 20upx;
		box-sizing: border-box;
	}

	.audio-item .iconfont.icon-zanting {
		text-indent: 0;
		font-size: 38upx;
	}

	.audio-item.display-2 {
		height: auto;
		padding: 20upx;
	}

	.audio-item.display-2 .iconfont {
		font-size: 30upx;
		width: 50upx;
		height: 50upx;
		line-height: 42upx;
		text-align: center;
		text-indent: 8upx;
		margin: 0;
	}

	.audio-item.display-2 .iconfont.icon-zanting {
		text-indent: 0;
		font-size: 28upx;
	}

	.audio-item.display-3,
	.audio-item.display-4 {
		padding: 20upx;
		background: transparent;
		border: 0;
	}

	.audio-item.display-3 .img,
	.audio-item.display-4 .img {
		width: 80upx;
		height: 80upx;
		display: block;
	}

	.audio-item.display-3 .audio,
	.audio-item.display-4 .audio {
		width: 300upx;
		height: 100upx;
		display: block;
	}



	.audio-item .audio-title {
		height: 70upx;
		line-height: 70upx;
		padding-left: 20upx;
	}

	.audio-content {
		padding-left: 12upx;
		flex: 1;
	}

	.audio-content .audio-time {
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		font-size: 22upx;
	}

	.audio-content .cap-slider {
		width: 70%;
		margin: 0 0 0 20upx;
		transform: translateY(-50%);
	}

	.cap-slider .cap-slider__bar {
		position: relative;
		margin: 0 16upx 0 0;
		height: 4upx;
		border-radius: 0;
		background-color: #f2f2f2;
	}

	.cap-slider__bar .cap-slider__pivot {
		position: absolute;
		top: 50%;
		width: 28upx;
		height: 28upx;
		border: 2upx solid #e5e5e5;
		border-radius: 50%;
		transform: translate3d(0, -50%, 0);
	}

	.cap-slider__bar .cap-slider__pivot::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		width: 8upx;
		height: 8upx;
		border-radius: 8upx;
		background: #409eff;
	}
</style>
