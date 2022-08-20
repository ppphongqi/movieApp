<template>
	<view>
		<view v-if="show" class="zan-noticebar grace-align-center" :class="{'zan-noticebar--within-icon':hasRightIcon}"
		 :style="{'color':color,'background-color':backgroundColor,'padding':paddingTop+'px 10px'}">
			<view v-if="leftIcon" class="zan-noticebar__left-icon">
				<image class="image" :src="leftIcon" />
			</view>
			<view class="zan-noticebar__content-wrap">
				<view class="zan-noticebar__content" :style="{'transform': 'translateX('+scrollNumber+'px)','transition': 'all '+elapse+'ms linear'}"
				 @transitionend="transitionEnd">
					{{ text }}
				</view>
			</view>
			<!-- <block v-if="mode">
				<zan-icon v-if="mode === 'closeable'" class="zan-noticebar__right-icon" type="close" @click="_handleButtonClick" />
				<navigator v-if="mode === 'link'" :url="url" :open-type="openType">
					<zan-icon class="zan-noticebar__right-icon" type="arrow" />
				</navigator>
			</block> -->
		</view>
	</view>
</template>

<script>
	var VALID_MODE = ['closeable'];
	var FONT_COLOR = '#f60';
	var BG_COLOR = '#fff7cc';
	export default {
		data() {
			return {
				show: true,
				hasRightIcon: false,
				width: 0,
				wrapWidth: 0,
				elapse: 0,
				scrollNumber: 0,
				// 				animation: null,
				// 				resetAnimation: null,
				// 				timer: null,
				// 				animationData: null
			};
		},
		props: {
			text: {
				type: String,
				default: '',
			},
			mode: {
				type: String,
				default: ''
			},
			url: {
				type: String,
				default: ''
			},
			openType: {
				type: String,
				default: 'navigate'
			},
			delay: {
				type: Number,
				default: 0
			},
			speed: {
				type: Number,
				default: 40
			},
			scrollable: {
				type: Boolean,
				default: true
			},
			leftIcon: {
				type: String,
				default: ''
			},
			color: {
				type: String,
				default: FONT_COLOR
			},
			backgroundColor: {
				type: String,
				default: BG_COLOR
			},
			paddingTop: {
				type: String,
				default: 4
			}
		},
		components: {

		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {
			var mode = this.mode,
				that = this;

			if (mode && this._checkMode(mode)) {
				this.setData({
					hasRightIcon: true
				});
			}
		},
		mounted() {
			let that = this;
			setTimeout(() => {
				that.textInit();
			}, 500)
		},
		onUnload() {
			var timer = this.timer;
			timer && clearTimeout(timer);
		},
		watch: {
			text(newVal) {
				this.textInit();
			}
		},
		methods: {
			_checkMode(val) {
				var isValidMode = ~VALID_MODE.indexOf(val);
				if (!isValidMode) {
					console.warn('mode only accept value of ' + VALID_MODE + ', now get ' + val + '.');
				}
				return isValidMode;
			},
			transitionEnd() {
				let that = this,
					speed = that.speed,
					elapse = that.width / that.speed * 1000,
					wrapElapse = that.wrapWidth / that.speed * 1000;
				that.elapse = 0;
				that.scrollNumber = that.wrapWidth;
				setTimeout(() => {
					that._scroll(-(elapse * speed) / 1000, elapse + wrapElapse);
				}, 200);
			},
			textInit() {
				var _this = this;
				_this.getSelectorQuery().select('.zan-noticebar__content').boundingClientRect(function(res) {
					if (!res || !res.width) {
						return;
					}
					_this.width = res.width;
					_this.getSelectorQuery().select('.zan-noticebar__content-wrap').boundingClientRect(function(rect) {
						if (!rect || !rect.width) {
							return;
						}
						var wrapWidth = rect.width;
						var width = _this.width,
							speed = _this.speed,
							scrollable = _this.scrollable,
							delay = _this.delay;
						_this.wrapWidth = wrapWidth;
						// console.log(rect);
						if (scrollable && wrapWidth < width) {
							var elapse = width / speed * 1000;
							_this._scroll(-(elapse * speed) / 1000, elapse);
						}
					}).exec();
				}).exec();
			},
			_scroll(scrollNumber, elapse) {
				this.scrollNumber = scrollNumber;
				this.elapse = elapse;
			},
			getSelectorQuery() {
				let _this = this,
					clientType = _this.$store.state.clientType;
				return clientType === "2" ? uni.createSelectorQuery().in(_this) : uni.createSelectorQuery();
			}
		}
	}
</script>

<style>
	.zan-noticebar {
		display: -webkit-box;
		display: flex;
		/* padding: 4px 10px; */
		font-size: 26upx;
		line-height: 1.5;
		border-radius: 8upx;
	}

	.zan-noticebar--within-icon {
		position: relative;
		padding-right: 30px;
	}

	.zan-noticebar__left-icon {
		height: 18px;
		min-width: 20px;
		padding-top: 1px;
		box-sizing: border-box;
	}

	.zan-noticebar__left-icon .image {
		width: 16px;
		height: 16px;
	}

	.zan-noticebar__right-icon {
		position: absolute;
		top: 10px;
		right: 10px;
		font-size: 15px;
		line-height: 1;
	}

	.zan-noticebar__content-wrap {
		position: relative;
		-webkit-box-flex: 1;
		flex: 1;
		height: 18px;
		overflow: hidden;
	}

	.zan-noticebar__content {
		position: absolute;
		white-space: nowrap;
		line-height: 1.6em;
	}
</style>
