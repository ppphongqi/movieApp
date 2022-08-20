<!-- 返回页面顶部 buy 缪启峙 
	引入 返回顶部组件如:
	<vGoTop :pageScroll ="PageScroll" goTopStyle="bottom:20px;right:20px;" :showTopHeight ="可不填默认为 300"/>
	pageScroll  // 页面滑动的高度,
	goTopStyle  // 返回按钮与底部,左右的距离,
	showTopHeight //  滑动高度>按钮出现高度时出现返回按钮  ！
-->

<template>
	<view>
		<view class="go-top" :class="{'top-show':isShowTop}" @click="goTop" :style="goTopStyle">
			<view class="iconfont icon-top"></view>
		</view>
	</view>
</template>

<script>
	var scorllTimert = null;
	export default {
		data() {
			return {
				isShowTop: false
			};
		},
		methods: {
			goTop(e) {
				if (this.topType === "page") {
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					});
				} else if (this.topType === "view") {
					this.$emit("clickBtn");
				}
			},
			//防止滚动触发多次函数
			debounce(wait, immediate) {
				var that = this;
				return function() {
					// 每次触发 scroll 时先清除定时器
					clearTimeout(scorllTimert);
					scorllTimert = setTimeout(function() {
						that.handler(immediate);
					}, wait);
				}();
			},
			handler(scrollHeight) {
				this.isShowTop = scrollHeight > this.showTopHeight;
			},
		},
		watch: {
			pageScroll(value) {
				this.debounce(200, value)
			}
		},
		props: {
			pageScroll: Number,
			showTopHeight: {
				type: Number,
				default: 300
			},
			topType: {
				type: String,
				default: "page"
			},
			goTopStyle: String
		}
	}
</script>

<style>
	.go-top {
		position: fixed;
		bottom: 156upx;
		right: 24upx;
		width: 76upx;
		height: 76upx;
		border-radius: 50%;
		overflow: hidden;
		text-align: center;
		z-index: 16;
		transform: translateY(80upx);
		opacity: 0;
		transition: all .5s ease;
		background: rgba(255, 255, 255, 0.7);
		border: 1upx solid #eee;
	}

	.go-top.top-show {
		transform: translateY(0);
		opacity: 1;
	}

	.go-top .iconfont {
		position: absolute;
		top: 0;
		left: 0;
		width: 76upx;
		height: 76upx;
		line-height: 76upx;
		z-index: 1;
	}

	/* .go-top text {
		display: inline-block;
		color: #333;
		font-size: 22upx;
		margin-top: 38upx;
		position: relative;
		z-index: 10;
	} */
</style>
