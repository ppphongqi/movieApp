<template>
	<view>
		<!-- 视频组 -->
		<view class="show-video" :style="{'height':videoHeight+'px'}">
			<block v-if="isVideoPlay">
				<video :object-fit="objectFit" :id="itemId" class="video" style="width:100%;" :autoplay="autoplay" :x5-video-player-type="x5VideoPlayerType" :style="{'height':videoHeight+'px'}" objectFit="contain" :src="params.videolink"
				 :muted="muted" :poster="params.videocover" @play="showVideoStatus" @ended="showVideoStatus">
					<!-- <view class="video-muted flex-row" v-if="isVideoPlay" @click="videoMuted">
						<image class="video-muted-img" src="/static/images/diypage/notification_fill.png" v-if="!muted"></image>
						<image class="video-muted-img" src="/static/images/diypage/notification_forbid_fill.png" v-if="muted"></image>
					</view> -->
				</video>
			</block>
			<block v-else>
				<image mode="aspectFit" :src="params.videocover" class="cover-poster" style="width:100%;" :style="{'height':videoHeight+'px'}" @load="imageLoad"></image>
				<image class="video-play" src="/static/images/diypage/video_play.png" @click="videoPlay"></image>
			</block>
		</view>
	</view>
</template>

<script>
	let videoContext = null;
	export default {
		data() {
			return {
				isVideoPlay: false,
				videoHeight: 240,
				muted: false,
			};
		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			params: Object,
			itemId: String,
			autoplay: Boolean,
			x5VideoPlayerType: String,
			objectFit: {
				type: String,
				default: 'contain'
			},
			// 单位rpx
			height: {
				type: [String,Number],
				default: undefined
			}
		},
		components: {

		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {},
		onShow() {

		},
		onReady() {
			videoContext = uni.createVideoContext(this.itemId, this);
		},
		mounted() {
			let _this = this,
				params = _this.params,
				itemStyle = _this.itemStyle,
				scaleData = {
					"1": 16 / 9,
					"2": 4 / 3,
					"3": 1 / 1,
				}
			if (params.videotype === "2") {
				uni.getSystemInfo({
					success(res) {
						let windowWidth = res.windowWidth,
							scale = scaleData[itemStyle.display];
						console.log("videoHeight", windowWidth / scale)
						_this.videoHeight = windowWidth / scale;
					}
				});
			}
			if(this.autoplay) {
				this.videoPlay()
			}
	
		},
		methods: {
			imageLoad(e) {
				let _this = this;
				if(this.height) {
					_this.videoHeight = uni.upx2px(this.height) || this.height
				}
				if (_this.params.videotype === "1" && _this.params.videocover) {
					uni.getSystemInfo({
						success(res) {
							let windowWidth = res.windowWidth,
								imgDetail = e.detail,
								imgScale = imgDetail.width / imgDetail.height;
							_this.videoHeight = windowWidth / imgScale;
						}
					});
				}
			},
			videoPlay(e) {
				let that = this;
				that.isVideoPlay = true;
				//延时操作,防止视频组件获取失败
				setTimeout(() => {
					console.log("video play");
					videoContext.play();
				}, 200);
			},
			showVideoStatus(e) {
				let moduleId = e.currentTarget.id,
					playType = e.type,
					isVideoPlay;
				if (playType == "play") {
					isVideoPlay = true;
				} else {
					isVideoPlay = false;
				}
				this.isVideoPlay = isVideoPlay;
			},
			videoMuted(e) {
				console.log("muted");
				this.muted = !this.muted;
			},
		},
		watch: {
			isVideoPlay(newValue, oldValue) {
				console.log('isVideoPlay',newValue)
				videoContext = uni.createVideoContext(this.itemId, this);
				this.$emit('on-status-change',newValue)
			},
		},
	}
</script>

<style>
	/* 视频组 */
	.show-video {
		position: relative;
	}

	.video {
		position: relative;
		height: 100%;
	}

	.video-muted {
		position: absolute;
		top: 20upx;
		right: 20upx;
		border-radius: 60upx;
		background: rgba(0, 0, 0, 0.6);
		text-align: center;
		padding: 10upx;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}

	.cover-poster {
		width: 100%;
		position: relative;
		z-index: 10;
		background-repeat: no-repeat;
		background-size: cover;
	}

	.video-play {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 30;
		transform: translate(-50%, -50%);
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
	}

	.video-muted-img {
		width: 40upx;
		height: 40upx;
		line-height: 40upx;
	}
</style>
